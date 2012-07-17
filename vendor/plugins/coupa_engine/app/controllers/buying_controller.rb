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

class BuyingController < ApplicationController
  hide_action :time_zone_select, :time_zone_options_for_select, :country_options_for_select
  hide_action :collection_select, :options_for_select, :option_groups_from_collection_for_select, :country_select, :select

  include ActionView::Helpers::FormOptionsHelper
  helper :addresses
  helper :requisition_headers
  before_filter :authorize_action, :except => [ :update_contracts ]

  data_table :requisition_header, [{:key => :id, :label => "Requisition", :alignment => 'center'},
                                   {:key => :requested_by, :alignment => 'left', :render_text => "<%= value.fullname %>"},
                                   :created_at,
                                   {:key => :total, :alignment => 'right', :render_text => "<%= render_attribute value %>"},
                                   {:key => :actions, :method => :id, 
                                    :render_text => "<%= link_to(image_tag('pencil', :title => 'Edit requisition #'+value.to_s),{:action => 'req_detail',:id => value}, :title => 'Edit') %>"}
                                   ],
                                   {:find_options => {:conditions => ['status = ?','pending_buyer_action']}}
  @@line_types = [['Qty','RequisitionQuantityLine'],['Amt','RequisitionAmountLine']]
  
  def index
    pool
    render :action => 'pool'
  end
  
  def tabs
    render :layout => false;
  end
  
  def pool
    @title = "Requisitions Requiring Action"
    @tstr = render_requisition_header_table
  end
  
  def req_detail
    @requisition_header = RequisitionHeader.find(params[:id],:conditions => ["status IN ('pending_buyer_action')"])
    @requisition_line = RequisitionQuantityLine.new
    @address_pages = Paginator.new self, User.current_user.addresses.count, 5, @params['address_page']
    @addresses = User.current_user.addresses.find :all,
                          :limit  =>  @address_pages.items_per_page,
                          :offset =>  @address_pages.current.offset
    @contracts = {}
    @line_types = @@line_types
    @title = "Requisition ##{@requisition_header.id}"
  end

  def change_billing
    if !params[:account_id] || params[:account_id] == '' then
      store_location
      redirect_to :controller => 'accounts', :action => 'choose'
    else
      @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["status IN ('pending_buyer_action')"])
      @requisition_line = RequisitionQuantityLine.new
      @address_pages = Paginator.new self, User.current_user.addresses.count, 5, @params['address_page']
      @addresses = User.current_user.addresses.find :all,
                            :limit  =>  @address_pages.items_per_page,
                            :offset =>  @address_pages.current.offset
      @contracts = {}
      @title = "Requisition ##{@requisition_header.id}"
      if !@requisition_header.nil? then
        @requisition_header.account_id = params[:account_id]
        @requisition_header.save
      end
      @line_types = @@line_types
      render :action => 'req_detail'
    end
  end

  def update_contracts
    supplier = Supplier.find_by_name(params[:value]).id
    contracts = Contract.find_all_by_supplier_id_and_status(supplier, 'published', :order => 'name ASC', :conditions => ['start_date <= ? AND end_date > ?',Time.now,Time.now])
    rl = RequisitionLine.find(params[:req_line])
    
    # Reset backing
    rl.contract = nil

    render :update do |page|
      page.replace_html "requisition_line_#{params[:req_line]}_backing_document", :partial => 'backing_document_selector', :locals => {:req_line => rl, :contracts => contracts}
    end  
  end
  
  def edit_draft_supplier
    @supplier = Supplier.find_by_id(params[:supplier],:conditions => ['status = ?','draft'])
    @update_field_root = params[:update_field_root]
    render :partial => 'suppliers/edit_draft_supplier'
  end

  def activate_supplier
    @supplier = Supplier.find(params[:supplier],:conditions => ['status = ?','draft'])
    @update_field_root = params[:update_field_root]
    @supplier.publish!
    flash.now[:notice] = 'Supplier was successfully activated.'
    render :update do |page|
      page["#{@update_field_root}_edit_btn"].hide if @supplier.active?
      page["#{@update_field_root}_activate_btn"].hide if @supplier.active?
      page["#{@update_field_root}_missing_indicator"].className = '' if @supplier.active?
      page.reload_flash
    end
  end
  
  def edit_supplier
    @supplier = Supplier.find(params[:id],:conditions => ['status = ?','draft'])
    @update_field_root = params[:update_field_root]
    if @supplier.update_attributes(params[:supplier]) && 
       @supplier.primary_address.update_attributes(params[:address]) &&
       @supplier.primary_contact.update_attributes(params[:contact])
      if params[:publish] == 'true'
        @supplier.publish!
        flash.now[:notice] = 'Supplier was successfully edited and activated.'
      else
        flash.now[:notice] = 'Supplier was successfully edited.'
      end
      render :partial => 'suppliers/edit_supplier'
    else
      @contact = @supplier.primary_contact
      @address = @supplier.primary_address
      render :update do |page|
        page.replace_html "supplier_#{@supplier.id}_form_partial", :partial => 'suppliers/mini_form'
      end
    end
  end
  
  def remove
    @requisition_header = RequisitionHeader.find(params[:id], :conditions => ["status IN ('pending_buyer_action')"])
    rl = @requisition_header.requisition_lines.find(params[:line_id]) unless !params[:line_id]
    rl.destroy unless rl.nil?
    render :update do |page|
      page.remove "requisition_line_#{params[:root]}"
      page << 'EventSelectors.assign(Rules);'
    end
  end

  def add_line
    @requisition_header = RequisitionHeader.find_by_id_and_status(params[:id], 'pending_buyer_action')
    @requisition_header.requisition_lines << RequisitionQuantityLine.new(:currency => session[:user].default_currency,:uom => Uom.find_by_code('EA'),:quantity => 1)
    @requisition_header.save_with_validation(false)
    @line_types = @@line_types
    render :partial => 'requisition_line', :locals => {:requisition_line => @requisition_header.requisition_lines[-1]}
  end
  
  def approve_and_submit
    all_good, @requisition_header = process_update(params)
    render :inline => @requisition_header.approvable? ? '' : 'false'
  end
  
  def select_item
    requisition_line = RequisitionLine.find(params[:id])
    chosen_item = CatalogItem.find(params[:item_id])
    
    requisition_line.item_id = chosen_item.id
    requisition_line.uom = chosen_item.uom
    requisition_line.unit_price = chosen_item.list_price
    requisition_line.description = chosen_item.name
    requisition_line.supplier = chosen_item.contract.supplier
    requisition_line.contract = chosen_item.contract
    # Remember catalog item selection
    requisition_line.save
    
    render :update do |page|
      page << "$('requisition_line_#{requisition_line.id}').id = 'temporary_placeholder';"
      page.hide('temporary_placeholder')
      page.insert_html(:after, "temporary_placeholder", :partial => 'requisition_line', :locals => {:requisition_line => requisition_line})
      page.remove('temporary_placeholder')
      page.visual_effect :highlight, "requisition_line_#{requisition_line.id}"
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
          process_update(params)
        when "RequisitionAmountLine"
          @requisition_line.type= 'RequisitionAmountLine'
          @requisition_line.quantity= nil
          @requisition_line.uom_id= nil
          @requisition_line.save_with_validation(false)
          @requisition_line = RequisitionLine.find(@requisition_line.id)
          process_update(params)
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

  def update
    if params[:req_submit_type] && params[:req_submit_type] != 'submit'
      all_good, @requisition_header = process_update(params) 
    else
      @requisition_header = RequisitionHeader.find(params[:id])
      all_good = true
    end
    if params[:req_submit_type] && ((params[:req_submit_type] == 'submit') || (params[:req_submit_type] == 'sent_to_rfq'))
      #validate the req
      all_good = all_good && @requisition_header.valid?
    end
    
    if !all_good
      @title = "Requisition ##{@requisition_header.id}"
      @address_pages = Paginator.new self, User.current_user.addresses.count, 5, @params['address_page']
      @addresses = User.current_user.addresses.find :all,
                            :limit  =>  @address_pages.items_per_page,
                            :offset =>  @address_pages.current.offset
      @line_types = @@line_types
      @contracts = {}
      render :action => 'req_detail'
      return
    end
    if @requisition_header.approval
      @requisition_header.approval.destroy
    end
    flash[:error] = "Cannot generate approval list." unless @requisition_header.generate_approval_list
    if all_good && @requisition_header.save && params[:req_submit_type] == 'submit'
      @requisition_header.return_to_requester!
      if @requisition_header.draft?
        begin
          ApprovalNotify.deliver_req_to_requester self, @requisition_header
          flash[:notice] = "Requisition ##{@requisition_header.id} returned to requester."
        rescue
          logger.error("Req return email not sent: #{$!}")
          logger.error($!.backtrace.first(10).join("\n"))
          flash[:warning] = "Return notification email not sent."
        end
      else
        flash[:warning] = "Could not return to requester."
      end
    end
    redirect_to :controller => 'requisition_headers', :action => 'index', :filter => 1
  end

  protected
  def process_update(params)
    requisition_header = RequisitionHeader.find_by_id_and_status(params[:id],'pending_buyer_action')
    all_good = true
    if params[:requisition_header]
      all_good = requisition_header.update_attachments(params[:requisition_header]) && all_good
      all_good = (requisition_header.attributes= params[:requisition_header].delete_if {|k,v| ['status','attachment','attachment_link','attachment_links'].index(k)}) && all_good
      requisition_header.save_with_validation(false)
    end
    if params[:requisition_line] then 
      params[:requisition_line].each do |key,val|
        requisition_line = nil
        if val[:id] && !val[:id].empty?
          requisition_line = requisition_header.requisition_lines.find(val[:id])
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
          if val[:currency_id] && !val[:currency_id].blank? && requisition_line.currency_editable?
            requisition_line.currency = Currency.find(val[:currency_id])
          end
          requisition_line.unit_price = Money.new(val[:unit_price].to_f,requisition_line.currency_id) unless !requisition_line.unit_price_editable?
          requisition_line.description = val[:description] unless !requisition_line.description_editable?
          if val[:supplier] && !val[:supplier].blank? && requisition_line.supplier_editable?
            requisition_line.supplier = Supplier.find_by_name(val[:supplier])
          elsif val[:supplier_id] && !val[:supplier_id].blank? && requisition_line.supplier_editable?
            requisition_line.supplier = Supplier.find(val[:supplier_id])
          elsif (val[:supplier] || val[:supplier_id]) && requisition_line.supplier_editable?
            requisition_line.supplier = nil
          end
          if val[:backing].blank? || val[:backing] == 'contract'
            if (!val[:backing] || val[:backing] == 'contract') && val[:contract] && !val[:contract].blank? && requisition_line.contract_editable?
              requisition_line.contract = Contract.find(val[:contract],:conditions => ['supplier_id = ?',requisition_line.supplier_id])
            elsif (!val[:backing] || val[:backing] == 'contract') && val[:contract_id] && !val[:contract_id].empty? && requisition_line.contract_editable?
              requisition_line.contract = Contract.find(val[:contract_id])
            elsif (!val[:backing] || val[:backing] != 'contract') || (val[:contract] || val[:contract_id]) && requisition_line.contract_editable?
              requisition_line.contract = nil
            end
          else
            requisition_line.contract = nil
          end
          # if val[:backing].blank? || val[:backing] == 'quote_line'
          #             if val[:quote_response_line] && !val[:quote_response_line].empty? && requisition_line.quote_response_line_editable?
          #               requisition_line.quote_response_line = QuoteResponseLine.find(val[:quote_response_line].to_i,:conditions => ['supplier_id = ?',requisition_line.supplier_id])
          #             elsif val[:quote_response_line_id] && !val[:quote_response_line_id].empty? && requisition_line.quote_response_line_editable?
          #               requisition_line.quote_response_line = QuoteResponseLine.find(val[:quote_response_line_id])
          #             elsif ((val[:quote_response_line] || val[:quote_response_line_id]) && requisition_line.quote_response_line_editable?)
          #               requisition_line.quote_response_line = nil
          #             end
          #             # If we're bringing this in from a quote line, our quote line overrides everything
          #             requisition_line.attributes = requisition_line.class.params_from_quote_response_line(requisition_line.quote_response_line) if requisition_line.quote_response_line
          #           else
          #             requisition_line.quote_response_line = nil
          #           end
          if val[:backing] && val[:backing] != 'none'
            requisition_line.released_by_buyer = false
          end
          if requisition_line.quantity_editable?
            requisition_line.quantity = val[:quantity] 
            requisition_line.quantity = requisition_line.formatted_quantity
          end
          all_good = requisition_line.update_attachments(val) && all_good
          requisition_line.attributes= val.delete_if {|k,v| ['status','backing','attachment','attachment_link','attachment_links','supplier','supplier_id','contract','contract_id','quantity','uom','uom_id','description','unit_price','currency','currency_id'].index(k)}
          all_good = requisition_line.save_with_validation(false) && all_good
        end
      end
    end
    [all_good, requisition_header]
  end
end
