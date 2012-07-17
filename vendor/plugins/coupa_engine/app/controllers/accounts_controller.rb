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

require 'csv'
class AccountsController < ApplicationController
  before_filter :authorize_action, :except => [ :update_segments, :update_segment_fields, :search ]
  data_table :account, [:name,
                        {:key => :code, :sort_clause => 'segment_1, segment_2, segment_3, segment_4, segment_5, segment_6, segment_7, segment_8, segment_9, segment_10, segment_11, segment_12, segment_13, segment_14, segment_15, segment_16, segment_17, segment_18, segment_19, segment_20'},
                        {:key => :type, :sort_clause => 'account_types.name', :method => :account_type, :sql_column => 'account_types.name', :render_text => "<%= value.name %>"},
                        {:key => :actions, :method => :self, :render_text => "<%= link_to(image_tag('pencil', :title => 'Edit'), {:action => 'edit', :id => value}, :title => 'Edit') %>"}],
                        {:find_options => {:include => :account_type},
                         :accept_partial_match => true}
                        
  def index
    list
    render :action => 'list'
  end

  def update_segments
    render :partial => 'segment_form', :locals => {:account_type => !params[:id].blank? ? AccountType.find(params[:id]) : nil}
  end

  def picker
    render :partial => 'accounts/picker', :locals => {:field_root_id => params[:root]}
  end

  def pick
    new_id = params[:id]
    if params[:id].blank?
      if params[:linked_account_type_field]
        @account_type = AccountType.find(params[:linked_account_type_field].split(/\[|\]/).inject(nil){|memo,param| param.blank? ? memo : (memo || params).send('[]',param)})
        @account_types = @account_type.to_a
      else
        if params[:restrict_to_account_type_ids]
          @account_type = AccountType.find(params[:restrict_to_account_type_ids][0])
          @account_types = AccountType.find(:all,:conditions => ['id in (?)',params[:restrict_to_account_type_ids].to_a])
        else
          @account_types = AccountType.find(:all)
          @account_type = @account_types[0]
        end
      end
      @account_pages, @accounts = paginate :accounts, :per_page => 10, :include => :account_type, :conditions => ['account_type_id = ?',@account_type.id]
      render :update do |page|
        page << "dojo.html.insertCssText('##{params[:field_root_id]}_picker { width: 80%; }');"
        page.insert_html :after, 'content', :partial => 'accounts/picker', :locals => {:field_root_id => params[:field_root_id]}
        page << "dojo.widget.createWidget('#{params[:field_root_id]}_picker').show();"
      end
      return
    else
      render :update do |page|
        page.call('close_account_picker',params[:field_root_id])
        page["#{params[:field_root_id]}_id"].value=new_id
        page.replace_html params[:field_root_id], Account.find(new_id).code
      end
    end
  end
  
  def choose
    @account = Account.new
    @title = "Choose an Account"
    new_id = params[:id]
    if !params[:id] || params[:id] == '' then # nothing selected
      @account_types = AccountType.find(:all)
      if session[:user].default_account
        @account_type = session[:user].default_account.account_type
      end
      @account_type ||= @account_types[0]
      @account_pages, @accounts = paginate :accounts, :per_page => 10, :include => :account_type, :conditions => ['account_type_id = ?',@account_type.id]
      @title = "Choose an Account"
      #render :update do |page|
      #  page.insert_html :after, 'content', :partial => 'choose'
      #  page << "dojo.widget.createWidget($('account_picker_dialog')).show();"
      #end
      return
    end
    # we have a selection, so now try to go back
    if session['return-to'].nil?
      # TODO: proper error handling
      redirect_to :action => 'error'
    else
      if params[:default]
        @account = Account.find(new_id)
        session[:user].default_account = @account
        session[:user].save
      end
      # TODO: clean up so this can deal with existing parameters in the url
      rt = session['return-to']
      session['return-to'] = nil
      redirect_to_url rt+"?account_id=#{new_id}"
    end
  end

  def list
    @account_types = AccountType.find(:all)
    if session[:user].default_account
      @account_type = session[:user].default_account.account_type
    end
    @account_type ||= @account_types[0]
    #@account_pages, @accounts = paginate :accounts, :per_page => 10
    @tstr = render_account_table
    @title = 'Accounts'
  end

  def search
    update_segments = params.delete(:update_segments)
    refresh_accounts
    render :update do |page|
      page.replace_html('page_links', :partial => 'choose_links')
      page << "dojo.dom.removeChildren(dojo.byId('account_list'));"
      page.insert_html(:bottom,'account_list', :partial => 'choose_summary', :collection => @accounts)
      page.replace_html('segments',:partial => 'segment_search_form') if update_segments
    end
  end

  def picker_search
    update_segments = params.delete(:update_segments)
    refresh_accounts
    render :update do |page|
      page.replace_html('page_links', :partial => 'picker_links', :locals => {:field_root_id => params[:field_root_id]})
      page << "dojo.dom.removeChildren(dojo.byId('account_list'));"
      page.insert_html(:bottom,'account_list', :partial => 'picker_summary', :collection => @accounts, :locals => {:field_root_id => params[:field_root_id]})
      page.replace_html('segments',:partial => 'picker_segment_search_form', :locals => {:field_root_id => params[:field_root_id]}) if update_segments
    end
  end

  def show
    @account = Account.find(params[:id])
    @title = "Account '#{@account.name}'"
  end

  def new
    @account = Account.new
    @account_types = AccountType.find_all()
    @title = "Create New Account"
  end

  def create
    @account = Account.new(params[:account])
    if @account.save
      flash[:notice] = 'Account was successfully created.'
      redirect_to :action => 'list'
    else
      @account_types = AccountType.find_all()
      @title = "Create New Account"
      render :action => 'new'
    end
  end

  def edit
    @account = Account.find(params[:id])
    @account_types = AccountType.find_all()
    @title = "Editing Account '#{@account.name}'"
  end

  def update
    @account = Account.find(params[:id])
    if @account.update_attributes(params[:account])
      flash[:notice] = 'Account was successfully updated.'
      redirect_to :action => 'list'
    else
      @account_types = AccountType.find_all()
      render :action => 'edit'
    end
  end

  def auto_complete
    matched_account_ids = Account.find_id_by_contents(params[:id]+'*',:limit => :all).collect{|elem|elem[:id]}
    if !matched_account_ids.empty?
      @accounts = Account.find(:all,:conditions => ['id in (?)',matched_account_ids])
    else
      @accounts = []
    end
    render :inline => '<%=content_tag("ul", render(:partial => "auto_complete", :collection => @accounts)) %>'
  end
  
  def destroy
    Account.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
  
  def bulk_loader
    @data_source = DataFileSource.new
    @title = "Load Accounts from a File"
  end
  
  def list_csv
    accounts = Account.find(:all)
    output = ""
    CSV::Writer.generate(output) do |csv|
      csv << ["Action*","ID","Name","Account Type**","Account Type ID**","Segment 1*","Segment 2","Segment 3","Segment 4","Segment 5","Segment 6","Segment 7","Segment 8","Segment 9","Segment 10","Segment 11","Segment 12","Segment 13","Segment 14","Segment 15","Segment 16","Segment 17","Segment 18","Segment 19","Segment 20"]
      accounts.each do |acc|
        csv << [nil,acc.id,acc.name,acc.account_type.name,acc.account_type.id,acc.segments].flatten
      end
    end
    headers["Content-Type"] = "text/csv"
    headers["Content-Disposition"] = "attachment; filename=\"account_list.csv\""
    render_without_layout :text => output
  end
  
  def csv_template
    output = ""
    CSV::Writer.generate(output) do |csv|
      csv << ["Action*","ID","Name","Account Type**","Account Type ID**","Segment 1*","Segment 2","Segment 3","Segment 4","Segment 5","Segment 6","Segment 7","Segment 8","Segment 9","Segment 10","Segment 11","Segment 12","Segment 13","Segment 14","Segment 15","Segment 16","Segment 17","Segment 18","Segment 19","Segment 20"]
    end
    headers["Content-Type"] = "text/csv"
    headers["Content-Disposition"] = "attachment; filename=\"account_template.csv\""
    render_without_layout :text => output
  end
  
  def load_file
    @data_source = DataFileSource.new(params[:data_source])
    @data_source.source_for = 'Account'
    if @data_source.save
      begin
        job_key = MiddleMan.new_worker(:class => :account_loader_worker,
                            :args => { :user => User.current_user.id, :data => @data_source.id })
        @data_source.update_attributes(:job_key => job_key)
      rescue ActiveRecord::StaleObjectError
        @data_source.reload
        @data_source.update_attributes(:job_key => job_key)
      rescue
        flash[:warning] = "Can't connect to the background processor."
        redirect_to :controller => 'data_sources', :action => 'index'
      end
    else
      @title = "Bulk Load Accounts"
      render :action => 'bulk_loader'
      return
    end
    @title = "Loading Accounts"
  end
  
  def load_progress
    @data_source = DataSource.find(params[:id])
    progress_percent = MiddleMan.get_worker(@data_source.job_key).progress
    render :update do |page|
      page.call('progressPercent', 'progress_bar', progress_percent)        
      page.redirect_to( :controller => 'data_sources', :action => 'index')   if progress_percent >= 100
    end
  end

  protected
  def refresh_accounts
    @account_types = AccountType.find(:all)
    @account_type = AccountType.find_by_id(params[:account_type]) || @account_types.first

    cond = params[:account_type] ? ['account_type_id = ?'] : []
    cond_vars = params[:account_type] ? [params[:account_type]] : []
    params.each do |k,v|
      if /segment/ =~ k && v && !v.to_s.empty?
        cond << "#{k} like ?"
        cond_vars << '%'+v.to_a[0]+'%'
      end
    end
    if cond.empty?
      @account_pages, @accounts = paginate(:accounts,:include => :account_type)
    else
      @account_pages, @accounts = paginate(:accounts,:conditions => [cond.join(' AND '),cond_vars].flatten, :include => :account_type)
    end
  end
  
end
