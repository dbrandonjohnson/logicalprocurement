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

require 'pdf/writer'
require 'html2techbook'

class OrderHeadersController < ApplicationController
  require 'html2techbook'
  helper :addresses, :requisition_headers
  skip_before_filter :authorize_action, :only => [ :supplier_view ]
  before_filter :find_order, :only => [:show, :destroy, :cancel, :pdf, :edit, :send_via_email]
  
  data_table :order_header, [{:key => :id, :label => "PO #", :render_text => "<%= link_to(value , {:action => 'show', :id => value}, :title => 'Show details' )%>"},
                            {:key => :ship_to_user, :label => "Requester", :alignment => 'left', :render_text => "<%= value ? value.fullname : render_attribute(nil) %>"},
                            {:key => :ship_to_user, :display => false, :sql_column => 'users.firstname'},
                            {:key => :ship_to_user, :display => false, :sql_column => 'users.lastname'},
                             :created_at,
                             {:key => :supplier, :render_text => "<%= value %>", :sort_clause => 'suppliers.name'},
                             {:key => :status, :render_text => "<%= value.humanize %>", :alignment => 'center'},
                             {:key => :items, :method => :self, :alignment => 'left', :render_text => 
                                    '<ul>'+
                                        '<% value.order_lines.each { |line| %>'+
                                            '<% if line.is_a? OrderQuantityLine %>'+
                                                '<% if line.catalog_item %>'+
                                                    '<li><%= "#{line.formatted_quantity} #{line.uom ? line.uom.name : \'(no UOM)\'} of #{link_to line.description, :controller => \'catalog_items\', :action => \'show\', :id => line.catalog_item.id}" %></li>'+
                                                '<% else %>'+
                                                    '<li> <%= "#{line.formatted_quantity} #{line.uom ? line.uom.name : \'(no UOM)\'} of #{line.description}" %></li>'+
                                                '<% end %>'+
                                            '<% else %>'+
                                            '<li><%= line.description %></li>'+
                                            '<% end %>'+
                                        '<% }%>'+
                                    '</ul>'
                             },
                             {:key => :total, :alignment => 'right'},
                             {:key => :actions, :method => :self, 
                              :render_text => "<%= [:created,:sent,:acknowledged].index(value.current_state) ? '&nbsp;'+link_to(image_tag('page_white_acrobat', :title => 'PDF'), {:action => 'pdf', :id => value.id}, :title => 'PDF' ) : '' %>"+
                                              "<%= [:created,:sent,:acknowledged].index(value.current_state) && value.cancellable? && authorized?(:controller => 'order_headers',:action => 'cancel') ? '&nbsp;'+link_to_remote(image_tag('arrow_undo', :title => 'Cancel'), :url => {:action => 'cancel', :id => value.id}, :title => 'Cancel', :confirm => 'Are you sure?' ) : '' %>"+
                                              "<%= [:created,:sent,:acknowledged].index(value.current_state) ? '&nbsp;'+link_if_authorized(image_tag('pencil', :title => 'Revise PO'),{:controller => 'order_headers', :action => 'edit', :id => value.id},{:title => 'Revise PO'}) : '' %>"}],
                            {:find_options => {:include => [:supplier, :ship_to_user], :order => 'order_headers.created_at DESC', :per_page => 20}}
                            

  @@line_types = [['Qty','OrderQuantityLine'],['Amt','OrderAmountLine']]
    
  def index
    list
    render :action => 'list'
  end

  def search
    @search_term = params[:id] || ''
    @title = "Purchase Orders matching '#{@search_term}'"
    @order_header_pages, @order_headers = paginate :order_headers, :per_page => 10, :conditions => ["status LIKE ?",'%'+@search_term+'%']
  end

  def mini
    case request.method
    when :get
      @order_header_pages, @order_headers = {},{}
    when :post
      search
    end
    render_without_layout :action => 'mini'
  end

  def list
    @title = 'Purchase Orders'
    #@order_header_pages, @order_headers = paginate :order_headers, :per_page => 10
    @tstr = render_order_header_table
  end

  def show
    if params[:version] && !params[:version].blank?
      @order_header = @order_header.find_version(params[:version])
    end
    if request.xhr?
      render :partial => 'show_body', :locals => {:order_header => @order_header}
      return
    else
      @title = "Purchase Order ##{params[:id]}"
    end
  end

  def new
    @title = 'Purchase Order - New'
    @order_header = OrderHeader.new
  end

  def create
    @order_header = OrderHeader.new(params[:order_header])
    if @order_header.save
      flash[:notice] = 'OrderHeader was successfully created.'
      redirect_to :action => 'list'
    else
      @title = "Purchase Order ##{@order_header.id}"
      render :action => 'new'
    end
  end

  def edit
    @title = "Revise Purchase Order ##{@order_header.id}"
    @line_types = @@line_types
  end

  def update
    @order_header = OrderHeader.find(params[:id],:include => 'order_lines')
    @title = "Revise Purchase Order ##{@order_header.id}"
    all_good = true
    if params[:order_line] then
      @order_header.versioned_set_transaction do 
        @order_header.update_attributes(params[:order_header])
        params[:order_line].each do |key,val|
          if val[:id] && !val[:id].empty?
            order_line = @order_header.order_lines.find(val[:id])
            # check for the "delete flag"
            # unlike in other pages, the AJAX line deletion action for the PO revision
            # page we're processing here just sets a flag, which we need to process as part
            # of the save.
            if val[:delete] && val[:delete] == "1"
              # TODO: Do we need to stop deletion if the line has been invoice-matched?
              # This shouldn't happen unless the user writes the form response manually,
              # since the delete button won't show up for lines that have been received against.
              if order_line.received && order_line.received > 0
                order_line.errors.add_to_base('Lines that have been received against cannot be deleted.')
              else
                # if this is the last/only line, cancel the PO instead of creating a new version
                if @order_header.order_lines.size == 1
                  begin
                    @order_header.cancel!
                  rescue
                    logger.error("Error:"+$!)
                  end
                  if @order_header.current_state == :cancelled
                    flash[:notice] = "PO ##{@order_header.id} has been cancelled."
                  else
                    flash[:warning] = "PO ##{@order_header.id} could not be cancelled."
                  end
                else
                  @order_header.order_lines.delete(order_line)
                end
              end
            else
              # the line isn't deleted, so update allowed attributes
              order_line.update_attachments(val)
              val.delete_if{|k,v| k == "id" }.each do |key,val|
                logger.debug("#{key}=#{val}")
                if order_line.send("#{key}_editable?")
                  case key
                  when "uom"
                    order_line.uom = Uom.find_by_name(val)
                  when "price"
                    order_line.price = Money.new(val.to_f,order_line.currency)
                  else
                    order_line.send("#{key}=",val)
                  end
                end
              end
              all_good = order_line.save && all_good
            end
          end
        end
      end
    end
          
    if all_good
      @order_header.supplier.send_po_approval(@order_header)
      flash[:notice] = 'PO was successfully revised.'
      redirect_to :action => 'index'
    else
      render :action => 'edit'
    end
  end
  
  def destroy
    @order_header.destroy
    redirect_to :action => 'list'
  end
  
  def acknowledge
    order_header = OrderHeader.find(params[:id], :conditions => ["status IN ('created','sent')"])
    if params[:flag] == "1"
      order_header.acknowledged_flag = true
      order_header.save_without_revision
      if order_header.versions.size > 0
        order_header = order_header.versions[-1]
        order_header.acknowledged_flag = true
        order_header.save
      end
      flash.now[:notice] = "Order acknowledged"
    else
      order_header.acknowledged_flag = false
      order_header.save_without_revision
      if order_header.versions.size > 0
        order_header = order_header.versions[-1]
        order_header.acknowledged_flag = false
        order_header.save
      end
      flash.now[:notice] = "Order unacknowledged"
    end
    render :update do |page|
      page.reload_flash
    end
  end
  
  def cancel
    begin
      @order_header.cancel!
    rescue
      logger.error("Error:"+$!)
    end
    if @order_header.current_state == :cancelled
      flash.now[:notice] = "PO ##{@order_header.id} has been cancelled."
    else
      flash.now[:warning] = "PO ##{@order_header.id} could not be cancelled."
    end
    render :update do |page|
      page.replace_html 'flash_container', :partial => 'layouts/flash'
      page.replace "order_header_row_#{@order_header.id}", :partial => 'layouts/table_row', :collection => @order_header.to_a, :locals => {:table_options => @@order_header_table_options, :table_columns => @@order_header_columns}
      page << "EventSelectors.start(Rules);"
    end
  end
    
  def pdf
    @po_term_string = HTML2Techbook.from_html(@order_header.order_lines.first.account ? @order_header.order_lines[0].account.account_type.po_terms : nil)
    headers['Content-Type'] = 'application/pdf'
    headers['Content-Disposition'] = "attachment; filename=PO_#{@order_header.id}#{@order_header.versions.size > 1 ? '-'+@order_header.version.to_s : ''}.pdf"
    render_without_layout :action => 'po'
  end
  
  def send_via_email
    order_header.without_set_revision do
      order_header.send!
    end
    if order_header.current_state = :sent
      flash[:notice] = "PO ##{order_header.id} sent"
    else
      flash[:warning] = "PO ##{order_header.id} could not be sent"
    end
    list
    render :action => 'list'
  end
  
  def supplier_view
    @order_header = OrderHeader.find_by_supplier_view_key(params[:id], :conditions => ['status = \'sent\''])
    @title = "Attachments to Purchase Order ##{@order_header.id}"
  end
        
  protected
  def find_order
    @order_header = authorize_object(OrderHeader.find(params[:id]))
    raise ActiveRecord::RecordNotFound.new unless @order_header
  end
end
