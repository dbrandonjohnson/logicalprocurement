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

class UserController < ApplicationController
  include ActionView::Helpers::TextHelper
  
  filter_parameter_logging :password
  data_table :user, [{:key => :fullname, :method => :self, :label => "Name", :sort_clause => 'users.lastname, users.firstname', :render_text => "<%= link_if_authorized value.fullname, {:action => 'show', :id => value}, :show_text => true %>" }, 
                      :login, :email, 
                     {:key => :status, :render_text => "<%= value.humanize %>"},
                     {:key => :actions, :method => :id, :render_text => <<-END
                       <% user = User.find(value) -%>
                       <% login, reports = user.login, user.descendants.size -%>
                       <% confirmation = 'Are you sure you wish to delete the user '+login+'?' -%>
                       <% confirmation = 'The user '+login+' has '+pluralize(reports, 'report')+' who will be deleted as well. '+confirmation unless reports == 0 -%>
                       <%= link_if_authorized image_tag('pencil', :title => 'Edit '+login), {:action => 'edit_user', :id => value} %>
                       END
                       }]
                       
  def auto_complete
    conditions = [ '(LOWER(firstname) LIKE ? OR LOWER(lastname) LIKE ?) and status = ?', '%' + params[:user].downcase + '%', '%' + params[:user].downcase + '%', 'active' ]
    if params[:id]
      conditions[0] += ' AND id <> ?'
      conditions.push(params[:id])
    end

    @users = User.find(:all, :conditions => conditions)
    result = "<ul>"+@users.collect { |u| "<li><span class='name'>#{u.fullname}</span> (#{u.login})</li>" }.join+"</ul>" 
    render :inline => result
  end

  def list
    @tstr = render_user_table
  end
  
  def show
    @user = User.find(params[:id])
    prepare_for_view
  end

  def registrations
    @title = "Pending Registrations"
    @content_columns = user_content_columns_to_display    
    @user_pages, @all_users = paginate :user, :per_page => 10, :conditions => ['verified = ?', false]
    render :action => 'list'        
  end

  def account
    @title = 'My Account'
    @list_mode = sanitize(params[:list_mode] || "all")
    @feed_params = {:action => 'req_feed', :list_mode => @list_mode}
    items_per_page = 10
    if @list_mode == "open"
      @requisition_header_pages, @requisition_headers = paginate :requisition_headers, :per_page => items_per_page, :conditions => ["requested_by = ? AND status in ('draft','approved','pending_approval','pending_buyer_action')",session[:user].id], :order => 'created_at DESC'
    elsif @list_mode == "completed"
      @requisition_header_pages, @requisition_headers = paginate :requisition_headers, :per_page => items_per_page, :conditions => ["requested_by = ? AND status in ('ordered','partially_received','received')",session[:user].id], :order => 'created_at DESC'
    elsif @list_mode == "pending_approval"
      @requisition_header_pages, @requisition_headers = paginate :requisition_headers, :per_page => items_per_page, :conditions => ["requested_by = ? AND status = 'pending_approval'",session[:user].id], :order => 'created_at DESC'
    elsif @list_mode == "pending_receipt"
      @requisition_header_pages, @requisition_headers = paginate :requisition_headers, :per_page => items_per_page, :conditions => ["requested_by = ? AND status in ('ordered','partially_received')",session[:user].id], :order => 'created_at DESC'
    else
      @requisition_header_pages, @requisition_headers = paginate :requisition_headers, :per_page => items_per_page, :conditions => ["requested_by = ? AND status <> 'cart'",session[:user].id], :order => 'created_at DESC'
    end
  end
  
  def req_feed
    account
    render_without_layout
  end

  # Create a new User, skipping any verification by email.
  def new
    case request.method
      when :get
        @user = User.new
        curs = Currency.find_all_by_enabled_flag(true)
        # If only 1 currency then it becomes the default
        if curs.size == 1
          @user.default_currency = curs.first
        end
        prepare_for_view
        render
        return true
      when :post
        @user = create_new_user(params)
        @user.new_password = true
        @user.verified = 1 # skip verification, because we are ADMIN!
        if @user.save 
          flash[:notice] = 'User creation successful.'
          redirect_to :action => 'list'
          return
        end
    end
    flash[:warning] = "Error creating account"
    prepare_for_view
  end

  def list_csv
    output = ""
    CSV::Writer.generate(output) do |csv|
      csv << ["Action*","ID","Login*","Status","Password","Email*","FirstName*","LastName*","Phone Work","Phone Mobile","Approval Limit ID","Approval Limit Amount","Manager ID","Manager Login","Default Account Name","Default Account Code","Default Account Type Name**", "User Role IDs", "User Role Names","Pcard ID", "Pcard Name", "Pcard Number", "Pcard Expiry", "Default Currency", "Default Address ID**", "Default Address Street1", "Default Address Street2", "Default Address City", "Default Address State", "Default Address Postal Code", "Default Address Country ID**", "Default Address Country Code**", "Default Address Country Name**"] 
      if params[:template_only].nil? || !params[:template_only]
        users = User.find(:all)
          users.each do |u|
            csv_data = [nil,u.id,u.login,u.status,nil,u.email,u.firstname,u.lastname,u.phone_work,u.phone_mobile,u.approval_limit_id,u.approval_limit ? u.approval_limit.amount.to_s : nil, u.manager_id, u.parent ? u.parent.login : nil, u.default_account ? %Q/"#{u.default_account.code.to_s}"/ : nil, u.default_account && u.default_account.account_type ? u.default_account.account_type.id : nil, u.default_account && u.default_account.account_type ? u.default_account.account_type.name : nil, u.roles ? u.roles.collect { |r| r.id }.join(", ") : nil, u.roles ? u.roles.collect { |r| r.name }.join(", ") : nil, u.pcard ? u.pcard.id : nil, u.pcard ? u.pcard.name : nil, u.pcard ? u.pcard.number : nil, u.pcard ? u.pcard.expiry : nil, u.default_currency ? u.default_currency.code : nil]
            if u.default_address 
              csv_data += [u.default_address.id, u.default_address.street1, u.default_address.street2, u.default_address.city, u.default_address.state, u.default_address.postal_code, u.default_address.country.id, u.default_address.country.code, u.default_address.country.name] 
            end
            csv << csv_data
          end
      end
    end
    headers["Content-Type"] = "text/csv"
    headers["Content-Disposition"] = "attachment; filename=\"user_list.csv\""
    render_without_layout :text => output
  end

  def change_status
    @user = User.find(params[:id])
    case params[:user][:status].downcase
      when 'active' : 
        @user.enable!
        if @user.status == 'active'
          flash.now[:notice] = "User is now active"
        else
          flash.now[:warning] = "Could not update user status"
        end
      when 'inactive' : 
        @user.disable!
        if @user.status == 'inactive'
          flash.now[:notice] = "User is now inactive"
        else
          flash.now[:warning] = "Could not update user status"
        end
    end
    prepare_for_view
    render :action => 'edit_user'
  end

  # Edit the details of any user. The Role which can perform this will almost certainly also
  # need the following permissions: user/change_password, user/edit, user/edit_roles, user/delete
  def edit_user
    if (@user = find_user(params[:id]))
      prepare_for_view
      case request.method
        when :get
        when :post
          # For bad/empty data, default is no manager
          params[:user][:manager_id] = nil
          if params[:user][:manager]
            result = User.find_by_contents(params[:user][:manager])
            params[:user][:manager_id] = result.first.id unless result.empty?
          end
          params[:user].delete(:manager)
          @user.attributes = params[:user].delete_if { |k,v| not LoginEngine.config(:changeable_fields).include?(k) }
          if @user.save
            flash.now[:notice] = "Details for user '#{@user.login}' have been updated"
          else
            flash.now[:warning] = "Details could not be updated!"
          end
      end
    else
      redirect_back_or_default :action => 'list'
    end
  end

  # override UserEngine.change_password_for_user to fix http://trac.coupa.com/ticket/93. Delete this when fixed in UserEngine.
  def change_password_for_user
    do_change_password_for(@user) if @user = find_user(params[:id])

    prepare_for_view
    render :action => 'edit_user'
  end

  def edit_address
    @user = User.find(params[:id])
    params[:address].store(:name, @user.login)
    if !params[:remove_address].blank?
      @user.default_address.destroy if @user.default_address
      @user.reload
      msg = "Address removed"
    elsif !@user.default_address
      @user.create_default_address(params[:address])
      msg = "Address added"
    else
      @user.default_address.update_attributes(params[:address])
      msg = "Address updated"
    end
    if !@user.save || (!@user.default_address.nil? && !@user.default_address.errors.empty?)
      flash[:warning] = "Address could not be updated for user '#{@user.login}'."
    else  
      flash[:notice] = msg
    end
    prepare_for_view
    render :action => 'edit_user'
  end
  
  def change_pcard_for_user
    @user = User.find(params[:id])
    if !params[:remove_pcard].blank?
      @user.pcard.destroy if @user.pcard
      @user.pcard = nil
      msg = "P-card removed"
    elsif !@user.pcard
      @user.create_pcard(params[:pcard])
      msg = "P-card added"
    else
      @user.pcard.update_attributes(params[:pcard])
      msg = "P-card updated"
    end
    if !@user.save || (!@user.pcard.nil? && !@user.pcard.errors.empty?)
      flash[:warning] = "P-card data could not be updated."
    else
      flash[:notice] = msg
    end
    prepare_for_view
    render :action => 'edit_user'
  end

  # override UserEngine.edit_roles to fix problem when no roles are set.  Delete this when fixed in UserEngine
  def edit_roles
    if (@user = find_user(params[:id]))
      begin
        # add any new roles & remove any missing roles
        @user.roles.clear
        params[:roles].each { |role_id| @user.roles << Role.find(role_id) }

        @user.save
        flash[:notice] = "Roles updated for user '#{@user.login}'."
      rescue 
        flash[:warning] = 'Roles could not be edited at this time. Please retry.'
      ensure
        prepare_for_view
        render :action => 'edit_user'
      end
    else
      redirect_back_or_default :action => 'list'
    end
  end

  def load_file
    @data_source = DataFileSource.new(params[:data_source])
    @data_source.source_for = 'User'
    if @data_source.save
      begin
        job_key = MiddleMan.new_worker(:class => :user_loader_worker,
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
      @title = "Load Users from a File"
      render :action => 'bulk_loader'
      return
    end
    @title = "Loading Users"
  end
  
  def load_progress
    @data_source = DataSource.find(params[:id])
    progress_percent = MiddleMan.get_worker(@data_source.job_key).progress
    render :update do |page|
      page.call('progressPercent', 'progress_bar', progress_percent)        
      page.redirect_to( :controller => 'data_sources', :action => 'index')   if progress_percent >= 100
    end
  end
  
  def index
    list
    render :action => 'list'
  end

  def bulk_loader
    @data_source = DataFileSource.new
    @title = "Load Users from a File"
  end

  protected
  # override LoginEngine.destroy to fix http://dev.rails-engines.org/tickets/217. Delete this when fix gets into our LoginEngine freeze.
  def destroy(user)
    user.destroy()
    begin
      UserNotify.deliver_delete(user) if LoginEngine.config(:use_email_notification)
      flash[:notice] = "The account for #{user.login} was successfully deleted."
    rescue => error
      flash[:notice] = "The account for #{user.login} was successfully deleted, but the notification email failed."
      logger.error("UserController::destroy(#{user.nil? ? 'nil' : user.id}): #{error}")
    end
  end

  def prepare_for_view
    @address = @user.default_address
    @all_roles = Role.find_all.select { |r| r.name != UserEngine.config(:guest_role_name) }
    @pcard = @user.pcard
  end

  def create_new_user(params)
    if params[:user][:manager]
      result = User.find_by_contents(params[:user][:manager])
      params[:user][:manager_id] = result.first.id unless result.empty?
    end
    params[:user].delete(:manager)
    params[:user].delete(:default_account) # default_account_id will work
    @user = User.new(params[:user])
    if params[:address].find { |key,value| !value.blank? && key != :country_id }
      @user.build_default_address(params[:address])
      @user.default_address.name = @user.login
      # This triggers the error set if anything invalid
      @user.default_address.valid?
    end

    # Only add a pcard if the user has entered something in the pcard fields
    if params[:pcard].values.find { |attrib| !attrib.blank? }
      @user.build_pcard(params[:pcard]) 
      @user.pcard.valid?
    end

    # Add roles
    params[:roles].each { |role_id| @user.roles << Role.find(role_id) } unless params[:roles].nil?

    @user
  end

  # override LoginEngine.do_change_password_for to fix http://trac.coupa.com/ticket/93. Delete this when fixed in LoginEngine.
  def do_change_password_for(user)
    begin
# Transaction breaks things
#      User.transaction(user) do
        user.change_password(params[:user][:password], params[:user][:password_confirmation])
        if user.save
          if LoginEngine.config(:use_email_notification)
            begin
              UserNotify.deliver_change_password(user, params[:user][:password])
              flash[:notice] = "Updated password emailed to #{user.email}."
            rescue => error
              logger.error("do_change_password_for(#{user.id}): UserNotify.deliver_change_password: #{error}")
              flash[:notice] = "Password updated but notification email failed."
            end
          else
            flash[:notice] = "Password updated."
          end
          return true
        else
          return false
        end
#      end
    rescue => error
      logger.error("do_change_password_for(#{user.nil? ? 'nil' : user.id}): #{error}")
      flash[:warning] = "Password could not be changed at this time. Please try again."
      return false
    end
  end
end
