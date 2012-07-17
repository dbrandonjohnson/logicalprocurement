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

class ContractsController < ApplicationController
  skip_before_filter :authorize_action, :only => [ :auto_complete_for_supplier_name ]
  helper :Addresses, :CatalogItems

  def auto_complete_for_supplier_name
    @items = Supplier.find(:all,:conditions => [ "LOWER(name) LIKE ? AND (suppliers.status = \'active\' OR (suppliers.status = \'draft\' AND created_by = ?))", '%' + params[:supplier][:name].downcase + '%',User.current_user.id ], 
    :order => "name ASC",
    :limit => 10)
    render :inline => "<%= auto_complete_result @items, 'name' %>"
  end

  data_table :contract, [{:key => :number, :method => :self, :render_text => "<%= link_to( h(value.number), {:action => 'show', :id => value.id}, :title => 'Show details') %>"},
                         :name,
	                       {:key => :supplier_id, :method => :supplier, :alignment => 'left',:sql_column => 'suppliers.name', :sort_clause => 'suppliers.name'},
	                       {:key => :start_date,:label => "Starts", :render_text => "<%= render_attribute(value.to_date) %>"},
	                       {:key => :end_date,:label => "Expires", :render_text => "<%= render_attribute(value.to_date) %>"},
	                       {:key => :status, :render_text => "<%= value.humanize %>"},
	                       {:key => :actions, :method => :id, :render_text =>"<%= link_to( image_tag('pencil', :title => 'Edit'), {:action => 'edit', :id => value}, :title => 'Edit') %>&nbsp;"+
                          "<%= link_to( image_tag('delete'), { :action => 'destroy', :id => value }, :confirm => 'Are you sure?', :post => true, :title => 'Delete') %>"}],
	                       {:find_options => {:include => 'supplier'}}
  
  @@section_title = 'Contracts'
  
  def index
    list
    render :action => 'list'
  end

  verify :method => :post, :only => [ :destroy, :create, :update ],
         :redirect_to => { :action => :index }
         
  verify :xhr => true, :only => [ :delete_item ], :redirect_to => { :action => :index }

  def list
    @title = @@section_title
    @tstr = render_contract_table
  end

  def show
    begin
      @contract = Contract.find(params[:id])
      @catalog_items = (@contract.replaces || @contract).catalog_items
    rescue ActiveRecord::RecordNotFound
      flash[:warning] = "The specified contract does not exist or is not accessible."
      redirect_to :action => 'index'
      return
    end
    @title = "#{@@section_title}: Contract ##{@contract.number}"
    @catalog_loader_worker = @contract.catalog_data_source.worker if @contract.catalog_data_source
  end

  def new
    @contract ||= Contract.new
    @contract.status = 'draft'
    @contract.start_date = Date.today
    @contract.end_date = Date.today>>12
    @supplier = @contract.supplier || Supplier.new
    @address_pages = Paginator.new self, User.current_user.addresses.count, 5, @params['shipping_address_page']
    @addresses = User.current_user.addresses.find :all,
                          :limit  =>  @address_pages.items_per_page,
                          :offset =>  @address_pages.current.offset
    @title = "#{@@section_title}: New contract"
  end

  def create
    @contract = Contract.new
    @contract.update_attachments(params[:contract])
    @contract.attributes = params[:contract].reject {|k,v| ['attachment','attachment_link'].index(k)}
    @contract.status = 'draft'
    
    @contract.errors.add(:number, ActiveRecord::Errors.default_error_messages[:taken]) if Contract.find_by_number(@contract.number)

    if do_save
      if params['publish'] == 'true' && !@contract.published?
        flash[:notice] = "Contract ##{@contract.number} was successfully created but could not be published."
        params['id'] = @contract.id
        edit
        render :action => 'edit'
      else
        flash[:notice] = "Contract ##{@contract.number} was successfully created#{' and published' if @contract.published?}."
        redirect_to :action => 'index'
      end
    else
      new
      render :action => 'new'
    end
  end

  def edit
    @contract ||= Contract.find(params[:id])
    unless @contract.draft?
      old_contract = @contract
      unless @contract = Contract.find_by_status_and_number('draft', @contract.number)
        @contract = old_contract.clone
        @contract.save!
      end
      redirect_to :action => 'edit', :id => @contract.id
      return
    end
    
    @title = "#{@@section_title}: Editing draft for contract ##{@contract.number}"
    @supplier = @contract.supplier
    @existing_contract = @contract.replaces
    @address_pages = Paginator.new self, User.current_user.addresses.count, 5, @params['shipping_address_page']
    @addresses = User.current_user.addresses.find :all,
                          :limit  =>  @address_pages.items_per_page,
                          :offset =>  @address_pages.current.offset
  end

  def update
    @contract = Contract.find(params[:id])
    redirect_to :action => 'show', :id => params[:id] and return unless @contract.draft?
    
    @contract.update_attachments(params[:contract])
    @contract.attributes = params[:contract].reject { |k,v| ['attachment','attachment_link'].index(k) }
    
    if do_save
      if params['publish'] == 'true' && !@contract.published?
        flash[:notice] = "Contract ##{@contract.number} was successfully updated but could not be published."
        edit
        render :action => 'edit'
        return
      else
        flash[:notice] = "Contract ##{@contract.number} was successfully updated#{' and published' if @contract.published?}."
        redirect_to :action => 'index'
        return
      end
    else
      edit
      render :action => 'edit'
      return
    end
  end

  def destroy
    Contract.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
    
  def delete_item
    item = CatalogItem.find(params[:id])
    item.destroy
    render(:update) do |page|
      page.replace_html "catalog_item_count", item.contract.catalog_items.count.to_s
      if item.contract.catalog_items.empty?
        %w(catalog_items show_catalog_items hide_catalog_items).each { |e| page.remove e }
      else
        page.remove "catalog_item_#{params[:id]}"
      end
    end
  end
  
  def gallery_summary
    contract = Contract.find(params[:id])
    render :partial => 'gallery_summary', :collection => contract.catalog_items
  end
  
  protected
  def do_save
    if @contract.supplier.nil? && params[:supplier] && params[:supplier][:name]
      @contract.supplier = Supplier.find_by_name(params[:supplier][:name],:conditions => ['suppliers.status = \'active\''])
      if !params[:supplier][:name].empty? && !@contract.supplier
        flash[:notice] = "Invalid supplier \"#{params[:supplier][:name]}\" for contract ##{@contract.number}."
        return false
      end
    end
            
    return false unless @contract.save
    @contract.publish! if params['publish'] == 'true'
    return true
  end
end
