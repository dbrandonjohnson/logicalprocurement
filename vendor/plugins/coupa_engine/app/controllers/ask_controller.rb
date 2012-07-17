# Copyright (C) 2007  Coupa Software Incorporated http://www.coupa.com
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

class AskController < ApplicationController
  @@section_title = 'Ask an Expert'
  data_table :ask_category, [{:key => :name, :method => :self, :render_text => "<%= value.name + (value.private ? ' <i>(private)</i>' : '') %>"},
    {:key => :open_questions, :method => :self, :alignment => 'center', :render_text => "<%= link_to_unless value.open_questions.empty?, render_attribute(value.open_questions.size) , :action => 'open_questions', :id => value.id %>"},
    {:key => :closed_questions, :method => :self, :alignment => 'center', :render_text => "<%= link_to_unless value.closed_questions.empty?, render_attribute(value.closed_questions.size) , :action => 'closed_questions', :id => value.id %>"},
    {:key => :moderators, :method => :self, :alignment => 'center', :render_text => "<%= link_to render_attribute(value.moderators.size) , :action => 'moderators', :id => value.id %>"},
    {:key => :subscribers, :method => :self, :alignment => 'center', :render_text => "<%= link_to render_attribute(value.subscribers.size) , :action => 'subscribers', :id => value.id %>"},
    {:key => :actions, :method => :id, :alignment => 'center', :render_text => "<%= link_to(image_tag('pencil', :title => 'Edit'),:action => 'category_name', :id => value) %>&nbsp;<%= link_to(image_tag('delete', :title => 'Delete'),{:action => 'destroy',:id => value}, :title => 'Delete', :confirm => 'Remove category, questions and responses?') %>"}]
    
  skip_before_filter :authorize_action, :only => [:portlet,:auto_complete_for_moderator_user]
  
  verify :xhr => true,
	:only => [ :answer_question,
		:post_question,
		:close_question,
		:answer_button,
		:close_button,
		:cancel_answer_form,
		:subscribe_from_subscriptions,
		:subscribe_from_subscriptions,
		:unsubscribe_from_subscriptions,
		:unsubscribe_from_subscribers,
		:create_category,
		:set_category_name,
		:set_email_questions,
		:set_email_answers,
		:delete_category,
		:add_moderator,
		:remove_moderator ],
	:redirect_to => { :action => :index }

  def index
    @title ||= @@section_title
    @search_string = 'ask:'
    @question = AskQuestion.new
    @questions_asked = AskQuestion.questions_asked
    @questions_answered = AskQuestion.questions_answered
    subscriptions
  end

  def portlet
    @question = AskQuestion.new
    render :layout => false
  end
  def destroy
     AskCategory.find(params[:id]).destroy
     redirect_to :action => 'categories'
   end
  def query
    @title = @@section_title
    @search_string = 'ask:'
    @question = AskQuestion.new(params[:question])
    @question.text ||= ''
    @similar_questions = perform_search(@question.text).reject { |q| !q.closed? }.first(3)
  end
  
  def question
    redirect_to :action => 'index' unless params[:id]
    @title = @@section_title
    @search_string = 'ask:'
    @question = AskQuestion.find(params[:id], :include => :answers)
    @answers = @question.answers
    @answer ||= AskAnswer.new({:ask_question_id => @question.id})
    @close ||= AskAnswer.new({:ask_question_id => @question.id})
  end
  
  def questions
    action = params[:action]
    action_title = case action
                     when 'questions_asked' then 'Questions I asked'
                     when 'questions_answered' then 'Questions I answered'
                     else action.humanize
                    end
    @search_string = 'ask:'
    if params[:id]
      @category = AskCategory.find(params[:id])
      @questions = @category.send(action)
      @title = @category.name
    else
      @title = "#{@@section_title}: #{action_title}"
      @questions = AskQuestion.send(action)
    end

    render :action => 'questions'
  end
  
  alias :closed_questions :questions
  alias :open_questions :questions
  alias :questions_asked :questions
  alias :questions_answered :questions
  
  def delete_question
    if params[:id] and @question = AskQuestion.find(params[:id]) and @question.eligible_to_delete?
      @question.destroy
      flash[:notice] = "The question has been deleted"
    end
    
    redirect_to :back
  end
  
  def post_question
    @question = AskQuestion.new(params[:question])
    @question.status = 'Open'
    if @question.save
      begin
        @question.notify_subscribers(self)
      rescue
        logger.error "AskController.post_question failed to deliver notifications: #{$!}"
      end
      flash.now[:notice] = 'Question was successfully posted'
      render(:update) { |page| page.redirect_to :action => 'index'}
    else
      render(:update) { |page| page['question_form'].reload }
    end
  end

  def answer_question
    unless params[:answer] and @answer = AskAnswer.new(params[:answer]) and @answer.question and @answer.question.eligible_to_answer?
      render :nothing => true
      return
    end
    
    if @answer.save
      begin
        @answer.notify_subscribers(self)
      rescue
        logger.error "AskController.answer_question failed to deliver notifications: #{$!}"
      end      
      flash[:notice] = 'Answer was successfully posted'
      @question = @answer.question
      @answers = @question.answers
      render(:update) do |page|
        page.redirect_to :action => 'index'
      end
    else
      render(:update) do |page| 
        page['answer_form'].reload
        page.show('answer_form')
      end
    end 
  end
  
  def close_question
    unless params[:close] and @close = AskAnswer.new(params[:close]) and @close.question and @close.question.eligible_to_close?
      render :nothing => true
      return
    end
    
    if (@close.text.empty? or @close.save) and @close.question.update_attribute(:status, 'Closed')
      unless @close.text.empty?
        begin
          @close.notify_subscribers(self)
        rescue
          logger.error "AskController.close_question failed to deliver notifications: #{$!}"
        end
      end  
      flash[:notice] = 'Question was successfully closed'
    end
    
    render(:update) do |page|
      page.redirect_to :action => 'index'
    end
  end
  
  def subscriptions
    @title ||= @@section_title + ': My Subscriptions'
    @search_string = 'ask:'
    @subscriptions = User.current_user.subscriptions.find(:all, :include => :category, :order => 'ask_categories.name')
    @subscribed_categories = @subscriptions.collect{ |s| s.category }
    @categories_for_select = AskCategory.find_all_by_private(false, :order => 'name').delete_if { |c| @subscribed_categories.include?(c) }.collect! { |c| [c.name, c.id] }
    @subscription ||= AskSubscription.new({ :subscriber => User.current_user })
  end
  
  def subscribers
    if params[:id] && @category = AskCategory.find(params[:id])
      @title = "Subscribers: #{@category.name}"
      @search_string = 'ask:'
      @subscriptions = @category.subscriptions.find(:all, :include => :subscriber, :order => 'users.firstname, users.lastname')
      @subscribers = @subscriptions.collect{ |s| s.subscriber }
      @subscribers_for_select = User.find(:all, :order => 'firstname, lastname').delete_if { |u| @subscribers.include?(u) }.collect! { |u| [u.fullname_for_collect, u.id] }
      @subscription ||= AskSubscription.new({ :ask_category_id => @category.id })
    else
      redirect_to :action => 'index'
    end
  end
  
  def subscribe_from_subscriptions
    unless params[:subscription] and @subscription = AskSubscription.new(params[:subscription]) and not @subscription.category.private?
      render :nothing => true
      return
    end
    
    if @subscription.save
      flash.now[:notice] = "You are now subscribed to #{@subscription.category.name}"
     @subscription = nil
      subscriptions
      render(:update) { |page| page.reload_form_and_list 'subscriptions' }
    else
      subscriptions
      render(:update) { |page| page['subscription_form'].reload }
    end
  end
  
  def subscribe_from_subscribers
    unless params[:subscription] and @subscription = AskSubscription.new(params[:subscription])
      render :nothing => true
      return
    end

    if @subscription.save
      flash.now[:notice] = "#{@subscription.subscriber.fullname} is now subscribed to #{@subscription.category.name}"
      params[:id] = @subscription.category.id
      @subscription = nil
      subscribers
      render(:update) { |page| page.reload_form_and_list 'subscribers' }
    else
      params[:id] = @subscription.category.id
      subscribers
      render(:update) { |page| page['subscriber_form'].reload }
    end
  end
  
  def unsubscribe_from_subscriptions
    unless params[:id] and subscription = AskSubscription.find(params[:id])
      render :nothing => true
      return
    end

    subscription.destroy
    flash.now[:notice] = "You have been unsubscribed from #{subscription.category.name}"
    subscriptions
    render(:update) { |page| page.reload_form_and_list 'subscriptions' }
  end
  
  def unsubscribe_from_subscribers
    unless params[:id] and subscription = AskSubscription.find(params[:id])
      render :nothing => true
      return
    end
    
    subscription.destroy
    flash.now[:notice] = "#{subscription.subscriber.fullname} has been unsubscribed from #{subscription.category.name}"
    params[:id] = subscription.category.id
    subscribers
    render(:update) { |page| page.reload_form_and_list 'subscribers' }
  end
  
  def set_email_notifications
    unless params[:value] and subscription = AskSubscription.find(params[:id]) and subscription.subscriber == User.current_user
      render :nothing => true
      return
    end
    
    subscription.update_attribute(:email_notifications, params[:value]=="1")
    render(:update) { |page| page["email_notifications#{subscription.id}"].checked = subscription.email_notifications? }
  end

  def categories
    if (params[:admin_type] == 'edit_name')
      @edit_category = true
      @category = AskCategory.find(params[:id])
    end
    @title = @@section_title + ': Categories'
    @search_string = 'ask:'
    @categories = AskCategory.find( :all, :order => 'name' )
    @category ||= AskCategory.new
    @tstr = render_ask_category_table
  end
  
  def create_category
    @category = AskCategory.new(params[:category])
    if @category.save
      flash.now[:notice] = 'Category was successfully created'
      categories
      @category = nil
      render(:update) { |page| page.reload_form_and_list 'categories' }
    else
      categories
      render(:update) { |page| page['category_form'].reload }
    end
  end
  
  def category_name
    @category = AskCategory.find(params[:id])
    #render :layout => false
  end
  
  def update_category_name
    @category = AskCategory.find(params[:id])
    if @category.update_attribute('name', params[:category][:name])
      flash[:notice] = 'Category was successfully updated'
    else
      render :nothing => true
    end
    redirect_to :controller => 'ask', :action => 'categories'
  end
  
  def delete_category
    unless params[:id]
      render :nothing => true
      return
    end
      
    AskCategory.find(params[:id]).destroy
    flash.now[:notice] = 'Category was successfully deleted'
    categories
    render(:update) { |page| page.reload_form_and_list 'categories' }
  end
  
  def moderators
    redirect_to :action => 'index' unless params[:id]
    
    @category = AskCategory.find(params[:id])
    @title = "Moderators: #{@category.name}"
    @search_string = 'ask:'
    @moderators = @category.moderators.find(:all, :include => :user, :order => 'users.firstname, users.lastname')
    @moderator_users = @moderators.collect{ |m| m.user }
    @moderators_for_select = User.find(:all, :order => 'firstname, lastname').delete_if { |u| @moderator_users.include?(u) }.collect! { |u| [u.fullname_for_collect, u.id] }
    @moderator ||= AskModerator.new({ :ask_category_id => @category.id })
  end
  
  def auto_complete_for_moderator_user
    @category = AskCategory.find(params[:cat_id])
    @moderators = @category.moderators.find(:all, :include => :user, :order => 'users.firstname, users.lastname')
    @moderator_users = @moderators.collect{ |m| m.user }
    @users = User.find_by_contents(params[:id]+'*').delete_if { |u| @moderator_users.include?(u) }
    render :inline => '<% users = @users.map { |entry| content_tag("li",'+
      '"<span class=\"acid\" style=\"display:none\">#{entry.id}</span>'+
      '<span class=\"acname\">#{entry.fullname_for_collect}</span>") } %><%=content_tag("ul", users) %>'
  end
  
  def add_moderator
    unless params[:moderator]
      render :nothing => true
      return
    end
    
    moderator = AskModerator.new(params[:moderator].delete_if{|k,v| k == 'user'})  
    params[:id] = moderator.category.id  
    category = AskCategory.find(params[:id])
    
    if category.moderators << moderator
      flash.now[:notice] = "#{moderator.user.fullname} is now a moderator for #{moderator.category.name}"
      @moderator = nil
      moderators
      render(:update) { |page| page.reload_form_and_list 'moderators' }
    else
      params[:id] = @moderator.category.id
      moderators
      render(:update) { |page| page['moderator_form'].reload }
    end
  end
  
  def remove_moderator
    unless params[:id]
      render :nothing => true
      return
    end
    
    moderator = AskModerator.find(params[:id])
    moderator.destroy
    flash.now[:notice] = "#{moderator.user.fullname} is no longer a moderator for #{moderator.category.name}"
    params[:id] = moderator.category.id
    moderators
    render(:update) { |page| page.reload_form_and_list 'moderators' }
  end
  
  def search
    q = params[:q] || ''
    @title = "Questions matching '#{q}'"
    @search_string = "ask:#{q}"
    @questions = perform_search(q)
    render :action => 'questions'
  end
  
  protected
  
  def perform_search(q)
    # perform FTS
    hits = AskAnswer.find_by_contents((q.delete('?').split - SEARCH_STOP_LIST).join(' OR '))
    
    # Answers now search their question_text also.  Results return in sorted order.
    hits.collect! {|hit| hit.question }.uniq!
    
    # filter out questions in private categories
     subscribed_categories = User.current_user.subscriptions.find(:all, :include => :category).collect{ |s| s.category }
     hits.reject! { |question| question.category.private? && !subscribed_categories.include?(question.category) }
     return hits
  end
end
