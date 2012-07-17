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

class RequisitionHeadersController < ApplicationController
  include ActionView::Helpers::JavaScriptHelper
  helper :addresses, :catalog_items, :uoms, :suppliers
  hide_action :escape_javascript,:javascript_cdata_section,:javascript_tag,:link_to_function
  hide_action :define_javascript_functions,:button_to_function  
  skip_before_filter :authorize_action, :only => [:quick_access,:portlet]
  before_filter :find_requisition, :only => [:show,:approve,:reject_popup,:reject]

  verify :xhr => true, :only => [ :destroy, :add, :portlet_add, :resend, :portlet_remove ], :redirect_to => { :controller => :user, :action => :home }
  data_table :requisition_header, [{:key => :id, :label => "Req #", :alignment => 'center', :render_text => "<%= link_to value, :action => 'show', :id => value %>"},
                                   {:key => :requested_by, :label => "Requester", :alignment => 'left', :render_text => "<%= value ? value.fullname : render_attribute(nil) %>"},
                                   {:key => :requested_by, :display => false, :sql_column => 'users.firstname'},
                                   {:key => :requested_by, :display => false, :sql_column => 'users.lastname'},
                                   {:key => :submitted_at, :label => 'Submitted On', :render_text => "<%= render_attribute(value ? value.to_date : value) %>"},
                                   {:key => :status, :render_text => "<%= value.humanize %>"},
                                   {:key => :items, :method => :self, :alignment => 'left', :render_text => 
                                        '<ul>'+
                                            '<% value.requisition_lines.each { |line| %>'+
                                                '<% if line.is_a? RequisitionQuantityLine %>'+
                                                    '<% if line.catalog_item %>'+
                                                        '<li><%= "#{line.formatted_quantity} #{line.uom ? line.uom.name : \'(no UOM)\'} of #{link_to line.description, :controller => \'catalog_items\', :action => \'show\', :id => line.catalog_item.id}" %></li>'+
                                                    '<% else %>'+
                                                        '<li><%= "#{line.formatted_quantity} #{line.uom ? line.uom.name : \'(no UOM)\'} of #{line.description}" %></li>'+
                                                    '<% end %>'+
                                                '<% else %>'+
                                                '<li><%= line.description %></li>'+
                                                '<% end %>'+
                                            '<% }%>'+
                                        '</ul>'
                                   },
                                   {:key => :total, :alignment => 'right', :render_text => "<%= render_attribute value %>"},
                                   {:key => :actions, :method => :self, 
                                    :render_text => '<%= link_if_authorized(image_tag(\'pencil\', :title => "Edit requisition ##{value.id}"), {:controller => \'buying\', :action => \'req_detail\', :id => value.id}, :title => \'Edit/Checkout\') if value.status == \'pending_buyer_action\' %>'+
                 '<%= link_to_remote(image_tag(\'email_go\', :title => "Resend requisition ##{value.id} for approval"),{:url => {:controller => \'requisition_headers\', :action => \'resend\', :id => value.id}}, :title => \'Resend approval request\', :confirm => "Resend approval request?") if [\'pending_approval\'].index(value.status) %>'
#                '<%= link_to(image_tag(\'arrow_undo\', :title => "Withdraw requisition ##{value.id}"), {:controller => \'requisition_headers\', :action => \'withdraw\', :id => value.id},:title => \'Withdraw\', :confirm => "Withdraw requisition?") if [\'pending_approval\',\'pending_buyer_action\',\'approved\'].index(value.status) %>'+
#                '<%= link_to(image_tag(\'lorry\', :title => "Receive against requisition ##{value.id}"), {:controller => \'receipts\', :action => \'receive_requisition\', :id => value.id},:title => \'Receive\') if [\'ordered\',\'partially_received\'].index(value.status) %>'
                                    }],
                                   {:find_options => { :include => :requested_by, :order => 'requisition_headers.created_at DESC' },  
                                    :filters => [
                          {:label => 'Requiring Action',:conditions => ["requisition_headers.status in ('approved','pending_buyer_action')"]},
                          {:label => 'Ordered',:conditions => ["requisition_headers.status in ('ordered','partially_received','received')"]},
                          {:label => 'Pending Approval',:conditions => ["requisition_headers.status in ('pending_approval')"]},
                          {:label => 'Pending Receipt',:conditions => ["requisition_headers.status in ('ordered','partially_received')"]},
                          {:label => 'Draft',:conditions => ["requisition_headers.status in ('cart','draft')"]}
]}

  @@invoice_matching_levels = [['2-way (Require a purchase order line)','2-way'],['3-way (Require a purchase order line and a receipt)','3-way'],['ERS (Generate an invoice after receipt)','ERS']]
  @@line_types = [['Qty','RequisitionQuantityLine'],['Amt','RequisitionAmountLine']]

  def index
    list
    render :action => 'list'
  end

  def list
    @title = 'Requisitions'
    params[:filter] ||= '0'
    @tstr = render_requisition_header_table(requisition_header_process_options(params))
  end

  def show
    @title = "Requisition ##{@requisition_header.id}"
    respond_to do |format|
      format.html # show.rhtml
      format.xml  { render :xml => @requisition_header.to_xml }
    end
  end

  def new
    @title = 'Requisition - New'
    @requisition_header = RequisitionHeader.new()
  end

  def create
    @requisition_header = RequisitionHeader.new(params[:requisition_header])
    @requisition_header.status = 'draft'
    if @requisition_header.save
      flash[:notice] = 'RequisitionHeader was successfully created.'
      redirect_to :action => 'list'
    else
      @title = "Requisition ##{@requisition_header.id}"
      render :action => 'new'
    end
  end

  def portlet
    @requisition_header = RequisitionHeader.find_by_requested_by(session[:user].id, :conditions => 'status = \'cart\'', :order => 'created_at DESC')
    if @requisition_header.nil?
      @requisition_header = RequisitionHeader.new
      @requisition_header.status = 'draft'
      @requisition_header.requested_by = session[:user]
      @requisition_header.save
      @requisition_header.replace_cart!
    else
      @requisition_header.compact!
    end
    render_without_layout
  end

  def quick_access
    @suppliers = Supplier.find_by_sql(["SELECT DISTINCT suppliers.name, suppliers.id 
              FROM suppliers, contracts
              WHERE suppliers.id = contracts.supplier_id
              AND contracts.status = 'published'
              AND contracts.preferred_flag = ?
                  AND contracts.start_date <= ? 
                  AND contracts.end_date > ? 
              AND suppliers.status = 'active'
              AND (SELECT count(*) FROM catalog_items 
                 WHERE catalog_items.contract_id = contracts.id) > 0",true,Time.now,Time.now]) 
    @punchout_sites = PunchoutSite.find(:all,:order => 'name')
    portlet
  end
  
  def portlet_add
    process_add
    render :update do |page|
      if @requisition_line
        page.replace_html 'shopping_cart', :partial => 'portlet_cart'
        page.visual_effect :highlight, "req_line_#{@requisition_line.id}"
      else
        page.reload_flash
      end
    end
  end
  
  def add
    was_update = process_add
    if was_update
      render :update do |page|
        page.replace "req_line_#{@requisition_line.id}", :partial => 'edit_cart_line', :locals => {:edit_cart_line => @requisition_line}
        page.visual_effect :highlight, "req_line_#{@requisition_line.id}"
      end
    else
      render :update do |page|
        page.insert_html :after, "req_line_#{@requisition_line.higher_item.id}", :partial => 'edit_cart_line', :locals => {:edit_cart_line => @requisition_line}
        page.visual_effect :highlight, "req_line_#{@requisition_line.id}"
      end
    end
  end

  def checkout
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ['requested_by = ? AND status IN (\'cart\',\'draft\')',session[:user].id])
    if @requisition_header.ship_to_address_id.nil?
      @requisition_header.ship_to_address = session[:user].default_address
    end
    if @requisition_header.account_id.nil?
      @requisition_header.account = session[:user].default_account
    end
    flash[:warning] = "Cannot generate approval list." unless @requisition_header.generate_approval_list
    @requisition_header.save(false)
    if !@requisition_header.valid?
      # if we have blank lines, redirect to the edit cart page instead of checkout
      @line_types = @@line_types
      @title = "Edit Cart - Requisition ##{@requisition_header.id}"
      render :action => 'edit_cart'
      return
    end
    @title = "Checkout - Requisition ##{@requisition_header.id}"
  end

  def change_shipping
    if !params[:address_id] || params[:address_id] == '' then
      store_location
      redirect_to :controller => 'addresses', :action => 'choose'
    else
      @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["created_by = ? AND status IN ('cart','draft')",session[:user].id])
      if !@requisition_header.nil? then
        @requisition_header.ship_to_address_id = params[:address_id]
        @requisition_header.save
      end
      @title = "Requisition ##{@requisition_header.id}"
      render :action => 'checkout'
    end
  end
  
  def change_billing
    if !params[:account_id] || params[:account_id] == '' then
      store_location
      redirect_to :controller => 'accounts', :action => 'choose'
    else
      @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["created_by = ? AND status IN ('cart','draft')",session[:user].id])
      if !@requisition_header.nil? then
        @requisition_header.account_id = params[:account_id]
        @requisition_header.generate_approval_list
        @requisition_header.save
      end
      @title = "Checkout - Requisition ##{@requisition_header.id}"
      render :action => 'checkout'
    end
  end
  
  def change_line_type
    params[:requisition_line].each do |key,val|
      @requisition_line = RequisitionLine.find(key.to_i)
      if @requisition_line.type_editable? && (@requisition_line.class.to_s != params[:requisition_line][key][:type])
        @requisition_header = @requisition_line.requisition_header
        case params[:requisition_line][key][:type]
        when "RequisitionQuantityLine"
          @requisition_line.type= 'RequisitionQuantityLine'
          @requisition_line.save_with_validation(false)
          @requisition_line = RequisitionLine.find(@requisition_line.id)
        when "RequisitionAmountLine"
          @requisition_line.type= 'RequisitionAmountLine'
          @requisition_line.quantity= nil
          @requisition_line.uom_id= nil
          @requisition_line.save_with_validation(false)
          @requisition_line = RequisitionLine.find(@requisition_line.id)
        else
          #do nothing
        end
        @requisition_line.attributes=params[:requisition_line][key].without(:unit_price,:uom)
        @requisition_line.uom= Uom.find_by_code(params[:requisition_line][key][:uom])
        @requisition_line.unit_price=Money.new(params[:requisition_line][key][:unit_price],@requisition_line.currency_id)
        @line_types = @@line_types
      end
    end
  end
  
  def edit_cart
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["created_by = ? AND status IN ('cart','draft')",session[:user].id])
    @requisition_header.compact!
    @requisition_header.reload
    if params[:add_line]
      @requisition_header.requisition_lines << RequisitionQuantityLine.new(:currency => session[:user].default_currency,:uom => Uom.find_by_code('EA'),:quantity => 1)
      @requisition_header.save_with_validation(false)
      @focus_field = "requisition_line_#{@requisition_header.requisition_lines[-1].id}_description"
    end
    @line_types = @@line_types
    @title = "Edit Cart - Requisition ##{@requisition_header.id}"
  end
  
  def edit
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["created_by = ?",session[:user].id])
    @title = "Checkout - Requisition ##{@requisition_header.id}"
    render :action => 'checkout'
  end
  
  def add_line
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["created_by = ?",session[:user].id])
    @requisition_header.requisition_lines << RequisitionQuantityLine.new(:currency => session[:user].default_currency,:uom => Uom.find_by_code('EA'),:quantity => 1, :supplier_id => (params[:requisition_line] ? params[:requisition_line][params[:requisition_line].keys[0]][:supplier_id] : nil))
    @requisition_header.save_with_validation(false)
    @line_types = @@line_types
    
    render :partial => 'requisition_line', :locals => {:requisition_line => @requisition_header.requisition_lines[-1]}
#    render :update do |page|
#      page.insert_html :before, 'dummy_row', :partial => 'requisition_line', :locals => {:requisition_line => @requisition_header.requisition_lines[-1]}
#      page << 'EventSelectors.assign(Rules);'
#      page << "$('requisition_line_#{@requisition_header.requisition_lines[-1].id}_description').focus();"
#    end
  end

  def submit_for_approval
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["created_by = ? AND status IN ('cart','draft')",session[:user].id])
    # Update pcard info on our req., if user has chosen to use pcard
    if params[:use_pcard] == '1'
      @requisition_header.build_pcard(@requisition_header.requested_by.pcard.attributes) 
      @requisition_header.save
    end

    @requisition_header.update_attributes(params[:requisition_header])
    # the status change is why we're not just calling the save function first- the validation
    # changes based on the req status
    @requisition_header.submit_for_approval!
    if @requisition_header.pending_approval?
      # check for auto-approval
      if @requisition_header.approval.user == @requisition_header.requested_by
        @requisition_header.approval.approve!
        if @requisition_header.approval.current_state == :approved
          if @requisition_header.approval.children.size == 0
            flash[:notice] = "Requisition ##{@requisition_header.id} approved."
            if [:approved,:ordered].index(@requisition_header.reload.current_state)
              begin
                ApprovalNotify.deliver_req_approved(self,@requisition_header)
              rescue
                flash[:warning] = "Approval notification not sent."
              end
            end
          else
            flash[:notice] = "Requisition ##{@requisition_header.id} submitted for approval."
          end
        else
          flash[:warning] = "Requisition could not be approved."
        end
      else

        res = ApprovalNotify.deliver_next_approver self, @requisition_header
        
        if res
          flash[:notice] = "Requisition ##{@requisition_header.id} submitted for approval."
        else
          flash[:warning] = "Email could not be sent.  The requisition must be approved online."
        end
      end
      redirect_to :controller => 'user', :action => 'home'
      return
    elsif @requisition_header.pending_buyer_action?
      flash[:notice] = "Requisition ##{@requisition_header.id} submitted for buyer action."
      redirect_to :controller => 'user', :action => 'home'
      return
    else
      # there was a saving/validation error
      flash[:notice] = "Submission failed.  Please check for errors."
      @title = "Checkout - Requisition ##{@requisition_header.id}"
      render :action => 'checkout'
    end
  end
  
  def save
    if params[:submit_type] == 'submit'
      submit_for_approval
      return
    end
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["created_by = ? AND status IN ('cart','draft')",session[:user].id])
    if @requisition_header.update_attributes(params[:requisition_header])
      flash[:notice] = "Requisition ##{@requisition_header.id} saved."
    end
    @title = "Checkout - Requisition ##{@requisition_header.id}"
    render :action => 'checkout'
  end
  
  def approve
    if @requisition_header.status != 'pending_approval'
      case @requisition_header.status
      when 'draft'
        flash[:notice] = "#{@requisition_header.created_by.fullname} has withdrawn the requisition."
      else
        flash[:notice] = "Requisition ##{@requisition_header.id} is not in the correct state to be approved."
      end
      redirect_to :controller => "inbox", :action => "index"
      return
    end
    cur_approval = @requisition_header.approval
    
    while (cur_approval.approved?) && cur_approval.children.first
      cur_approval = cur_approval.children.first
    end
    
    @approval_status = 'not_current'
    
    # is the current user the current approver?
    if cur_approval.user.id != User.current_user.id
      flash[:warning] = "You are not the current approver for Requisition ##{@requisition_header.id}."
      redirect_to :controller => "inbox", :action => "index"
      return
    end

    if cur_approval.status == 'pending_approval'
      cur_approval.approve!
    end
    logger.debug("current state: #{cur_approval.current_state}")
    if cur_approval.current_state == :approved
      flash[:notice] = "Thank you for approving Requisition ##{@requisition_header.id}."
      if [:approved,:ordered].index(@requisition_header.reload.current_state)
        begin
          ApprovalNotify.deliver_req_approved(self,@requisition_header)
        rescue
          flash[:warning] = "Approval notification not sent."
        end
      end
    else
      flash[:warning] = "Could not approve Requisition ##{@requisition_header.id}"
    end
    @title = "Requisition ##{@requisition_header.id}"
    redirect_to :controller => "inbox", :action => "index"
  end
  
  def reject_popup
    win = render_to_string :action => 'reject_popup', :layout => false
    render :update do |page|
      page.insert_html :after, 'reject_popup_insert', win
      page << "dojo.widget.createWidget('reject_popup').show();"
    end
  end

  def reject
    if @requisition_header.status != 'pending_approval'
      case @requisition_header.status
      when 'draft'
        flash[:notice] = "#{@requisition_header.created_by.fullname} has withdrawn the requisition."
      else
        flash[:notice] = "Requisition ##{@requisition_header.id} is not in the correct state to be rejected."
      end
      redirect_to :controller => "inbox", :action => "index"
      return
    end
    cur_approval = @requisition_header.approval
    while (cur_approval.approved?) && cur_approval.children.first
      cur_approval = cur_approval.children.first
    end

    @approval_status = 'not_current'
    
    # is the current user the current approver?
    if cur_approval.user.id != User.current_user.id
      flash[:warning] = "You are not the current approver for Requisition ##{@requisition_header.id}."
      redirect_to :controller => "inbox", :action => "index"
      return
    end

    # Save our reject reason, if there is one
    if params[:submit_type] != 'cancel'
      @requisition_header.update_attributes(params[:requisition_header])
    end
    
    if cur_approval.status == 'pending_approval'
      cur_approval.approval_date = Time.now
      cur_approval.reject!
      @requisition_header.reject!
      @approval_status = 'rejected'
      begin
        ApprovalNotify.deliver_req_rejected(self,@requisition_header)
      rescue
        flash[:warning] = "Rejection notification not sent."
        logger.error("Rejection notification not sent: #{$!}")
      end
    end 
    @title = "Requisition ##{@requisition_header.id}"
    flash[:notice] = "Requisition ##{@requisition_header.id} rejected."
    redirect_to :controller => "inbox", :action => "index"
  end
  
  def ask
  end
  
  def resend
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["status = 'pending_approval'"])
    cur_approval = @requisition_header.approval
    while (cur_approval.status == 'approved') && cur_approval.children.first
      cur_approval = cur_approval.children.first
    end
    
    if cur_approval.status == 'pending_approval'
      begin
        ApprovalNotify.deliver_next_approver self, @requisition_header
        flash[:notice] = "Approver has been notified."
      rescue
        flash[:warning] = "Approval email not sent, please try again later."
        logger.error("Approval email not sent: #{$!}")
      end
    end
    render :update do |page|
      page.replace_html 'flash_container', :partial => 'layouts/flash'
    end
  end
  
  def portlet_remove
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["created_by = ? AND status IN ('cart','draft')",session[:user].id])
    @requisition_header.requisition_lines.find(params[:line_id]).destroy
    render :update do |page|
      page.replace_html "shopping_cart", :partial => "portlet_cart"
    end
  end
  
  def remove
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["created_by = ? AND status IN ('cart','draft')",session[:user].id])
    rl = @requisition_header.requisition_lines.find(params[:line_id]) unless !params[:line_id]
    rl.destroy unless rl.nil?
    render :update do |page|
      page.hide "requisition_line_#{params[:line_id]}"
      page.remove "requisition_line_#{params[:line_id]}"
      #page.hide "requisition_line_#{params[:root]}_main"
      #page.hide "requisition_line_#{params[:root]}_hidden"
      #page.hide "requisition_line_#{params[:root]}_more"
      #page.remove "requisition_line_#{params[:root]}_main"
      #page.remove "requisition_line_#{params[:root]}_hidden"
      #page.remove "requisition_line_#{params[:root]}_more"
      page << 'EventSelectors.assign(Rules);'
    end
  end

  def update
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["requisition_headers.created_by = ? AND requisition_headers.status IN ('cart','draft')",session[:user].id])
    all_good = true
    if params[:requisition_header]
      all_good = @requisition_header.update_attributes(params[:requisition_header].delete_if {|k,v| k == 'status'}) && all_good
    end
    if params[:requisition_line] then 
      params[:requisition_line].each do |key,val|
        logger.debug("Entering req_line block. key=#{key}, id=#{val[:id]}")
        if val[:id] && !val[:id].empty?
          requisition_line = @requisition_header.requisition_lines.find(val[:id])
          logger.debug("Updating req line #{requisition_line.id}.")
          if val[:item_id] && !val[:item_id].empty? && requisition_line.catalog_item_editable? then
            cat = CatalogItem.find(val[:item_id])
            requisition_line.item_id = cat.id
            requisition_line.uom = cat.uom
            requisition_line.unit_price = cat.list_price
            requisition_line.description = cat.name
            requisition_line.supplier = cat.contract.supplier
            requisition_line.contract = cat.contract
          end
          requisition_line.uom = Uom.find_by_name(val[:uom]) unless !requisition_line.uom_editable?
          if val[:currency_id] && !val[:currency_id].empty? && requisition_line.currency_editable?
            requisition_line.currency = Currency.find(val[:currency_id])
          end
          requisition_line.unit_price = Money.new(val[:unit_price].to_f,requisition_line.currency_id) unless !requisition_line.unit_price_editable?
          requisition_line.description = val[:description] unless !requisition_line.description_editable?
          if val[:supplier] && !val[:supplier].empty? && requisition_line.supplier_editable?
            requisition_line.supplier = Supplier.find_by_name(val[:supplier])
            # Invalid name, try by ID.  This should only really be used with draft suppliers
            if !requisition_line.supplier && val[:supplier_id] && !val[:supplier_id].empty?
              requisition_line.supplier = Supplier.find(val[:supplier_id])
            end
          end
          if requisition_line.quantity_editable?
            requisition_line.quantity = val[:quantity] 
            requisition_line.quantity = requisition_line.formatted_quantity
          end
          all_good = requisition_line.update_attachments(val) && all_good
          
          requisition_line.attributes=  val.delete_if {|k,v| ['status','attachment','attachment_link','attachment_links','supplier','supplier_id','contract','contract_id','quantity','uom','uom_id','description','unit_price','currency','currency_id'].index(k)}
          all_good = all_good && requisition_line.save_with_validation(false)
        end
      end
    end
    #iterate through and compact the line numbers
#    logger.debug(@requisition_header.requisition_lines.collect{|rl| rl.line_num }.join(','))
#    @requisition_header.requisition_lines.each_with_index do |rl,i|
#      rl.line_num = i + 1
#    end
    if params[:checkout_flag] && !params[:checkout_flag].blank?
      #validate the req
      all_good = all_good && @requisition_header.valid?
    end
    if !all_good || params[:checkout_flag].blank?
      @title = "Edit Cart - Requisition ##{@requisition_header.id}"
      @line_types = @@line_types
      render :action => 'edit_cart'
      return
    end
    if @requisition_header.approval
      @requisition_header.approval.destroy
    end
    if @requisition_header.ship_to_address_id.nil?
      @requisition_header.ship_to_address = session[:user].default_address
    end
    if @requisition_header.account_id.nil?
      @requisition_header.account = session[:user].default_account
    end
    flash[:error] = "Cannot generate approval list." unless @requisition_header.generate_approval_list
    @requisition_header.save_without_validation
    @title = "Checkout - Requisition ##{@requisition_header.id}"
    render :action => 'checkout'
  end
  
  def withdraw
    req = RequisitionHeader.find(params[:id], :conditions => ['requested_by = ? AND status IN (\'pending_approval\',\'pending_buyer_action\',\'approved\')',session[:user].id])
    req.withdraw!
    if req.draft?
      flash[:notice] = "Successfully withdrew Requisition ##{req.id}."
    else
      flash[:warning] = "Could not withdraw Requisition ##{req.id}"
    end
    redirect_to :controller => 'user', :action => 'account'
  end
  
  def destroy
    begin
      RequisitionHeader.find(params[:id], :conditions => ['requested_by = ? AND status IN (\'cart\',\'draft\',\'rejected\')',session[:user].id]).destroy
      flash[:notice] = "Requisition ##{params[:id]} deleted."
    rescue
    end
    render :update do |page|
      page.redirect_to :controller => 'user', :action => 'home'
    end
  end
  
  def clear_cart
    begin
      RequisitionHeader.find(params[:id], :conditions => ['requested_by = ? AND status IN (\'cart\',\'draft\',\'rejected\')',session[:user].id]).requisition_lines.clear
      flash[:notice] = "Cart cleared."
    rescue
    end
    render :update do |page|
      page.redirect_to :controller => 'user', :action => 'home'
    end
  end
  
  protected
  def find_requisition
    @requisition_header = authorize_object(RequisitionHeader.find(params[:id]))
    raise ActiveRecord::RecordNotFound.new unless @requisition_header
  end

  def process_add
    was_update = false
    if (params[:req])
      @requisition_header = RequisitionHeader.find(params[:req], :conditions => ['requested_by = ? AND status IN (\'cart\',\'draft\')',session[:user].id])
    else
      @requisition_header = RequisitionHeader.find_by_requested_by(session[:user].id, :conditions => ['status = \'cart\''], :order => 'created_at DESC')
    end
    if (params[:id] =~ /item_(\d+)/)
      item_id = $1
      @requisition_line = @requisition_header.requisition_lines.find_by_item_id(item_id, :conditions => 'form_response_id is null')
      if @requisition_line then
        @requisition_line.quantity += (Kernel.Float(params[:quantity]) || 1.0)
        was_update = true
      else
        @requisition_line = RequisitionQuantityLine.new(:header_id => @requisition_header.id)
        @requisition_line.item_id = item_id
        cat = CatalogItem.find(item_id)
        @requisition_line.uom_id = cat.uom_id
        @requisition_line.unit_price = cat.list_price
        @requisition_line.currency_id = cat.list_price_currency_id
        @requisition_line.description = cat.name
        @requisition_line.quantity = (Kernel.Float(params[:quantity]) || 1.0)
        @requisition_line.quantity = @requisition_line.formatted_quantity
        @requisition_line.supplier = cat.contract.supplier
        @requisition_line.contract = cat.contract
        @requisition_header.requisition_lines << @requisition_line
      end
      @requisition_line.save
      @requisition_header.save
    end
    was_update
  end
  
end
