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

class SuppliersController < ApplicationController
  @@po_send_methods = [['E-mail','email'],['cXML','cxml'],['None','none']]
  cattr_reader :po_send_methods

  #include ActionView::Helpers::UrlHelper
  helper :addresses, :contacts
  data_table :supplier,[{:key => :name, :method => :self, :render_text => "<%= link_to(h(value.name),{:action => 'show',:id => value.id},:title => 'Show details') %>"},
                        {:key => :status, :render_text => "<%= value.humanize %>"},
                        {:key => :on_hold, :render_text => "<%= value ? 'Yes' : 'No' %>"},
                        {:key => :contact, :method => :primary_contact, 
                         :render_text => "<%= link_to(value.fullname,:controller => 'contacts',:action => 'show', :id => value.id) %>",
                         :sql_column => 'contacts.name_given'},
                        {:key => :contact, :display => false, :sql_column => 'contacts.name_family'},
                        {:key => :city, :method => :primary_address,
                          :render_text => "<%= value.city %>", :sql_column => 'addresses.city'},
                        {:key => :state, :method => :primary_address,
                          :render_text => "<%= value.state %>", :sql_column => 'addresses.state'},
                        {:key => :country, :method => :primary_address,
                          :render_text => "<%= value.country.name %>", :sql_column => 'countries.name'},
                        {:key => :actions, :method => :id, 
                          :render_text => "<%= link_to(image_tag('pencil', :title => 'Edit'),:action => 'edit',:id => value) %>"}
                        ],
            {:find_options => {:include => [:primary_contact, {:primary_address => :country}], :order => 'suppliers.status DESC, suppliers.name ASC'},
             :filters => [{:label => 'Draft',:conditions => ["suppliers.status = 'draft'"]},
                          {:label => 'On Hold',:conditions => ["suppliers.on_hold = ?",true]}]}
  
  def show_hierarchy
    @supplier = Supplier.find(params[:id])
    @title = "Supplier Hierarchy for '#{@supplier.name}'"
  end
  
  def bulk_loader
    @title = "Bulk Load Suppliers"
    @data_source = DataFileSource.new
  end

  def load_file
    @data_source = DataFileSource.new(params[:data_source])
    @data_source.source_for = 'Supplier'
    if @data_source.save
      begin
        job_key = MiddleMan.new_worker(:class => :supplier_loader_worker,
                            :args => { :user => User.current_user.id, :data => @data_source.id })
        @data_source.update_attributes(:job_key => job_key)
      rescue ActiveRecord::StaleObjectError
        @data_source.reload
        @data_source.update_attributes(:job_key => job_key)
      rescue
        flash[:warning] = "Can't connect to the background processor."
        logger.debug("SuppliersController.load_file: #{$!}")
        redirect_to :controller => 'data_sources', :action => 'index'
      end
    else
      @title = "Bulk Load Suppliers"
      render :action => 'bulk_loader'
      return
    end
    @title = "Loading Suppliers"
  end
  
  def load_progress
    @data_source = DataSource.find(params[:id])
    progress_percent = MiddleMan.get_worker(@data_source.job_key).progress
    render :update do |page|
      page.call('progressPercent', 'progress_bar', progress_percent)        
      page.redirect_to( :controller => 'data_sources', :action => 'index')   if progress_percent >= 100
    end
  end
    
  def auto_complete
    @suppliers = Supplier.find(:all,
      :conditions => [ 'LOWER(name) LIKE ? AND (status = \'active\' OR (status = \'draft\' AND created_by = ?))',
      '%' + params[:id] + '%', User.current_user.id ])
    #render :inline => '<%= auto_complete_result(@suppliers, \'name\') %>'
    # just show the name, but bring back the rest of the stuff we need, too.
    render :inline => '<%=content_tag("ul", render(:partial => "auto_complete", :collection => @suppliers)) %>'
  end

  def auto_complete_unfiltered
    @suppliers = Supplier.find(:all,
      :conditions => [ 'LOWER(name) LIKE ?','%' + params[:id] + '%' ])
    #render :inline => '<%= auto_complete_result(@suppliers, \'name\') %>'
    # just show the name, but bring back the rest of the stuff we need, too.
    render :inline => '<% suppliers = @suppliers.map { |entry| content_tag("li",'+
      '"<span class=\"acid\" style=\"display:none\">#{entry.id}</span>'+
      '<span class=\"acstatus\" style=\"display:none\">#{entry.status}</span>'+
      '<b><span class=\"acname\">#{entry.name}</span></b>#{entry.status == \'draft\' ? \' <i>(Draft)</i>\' : \'\'}<br/><span style=\"color:#999\"><span class=\"acaddress\" style=\"display:none\">#{h address_to_html(entry.primary_address)}</span><span class=\"acemail\">#{entry.primary_contact.email}</span></span>") } %><%=content_tag("ul", suppliers) %>'
  end

  def search
    @search_term = params[:id] || ''
    @title = "Suppliers matching '#{@search_term}'"
    @supplier_pages, @suppliers = paginate :suppliers, :per_page => 9, :conditions => ['name LIKE ?','%'+@search_term+'%']
  end

  def mini
    case request.method
    when :get
      @supplier_pages, @suppliers = {},{}
    when :post
      search
    end
    render_without_layout :action => 'mini'
  end
  
  def index
    list
    render :action => 'list'
  end

  def list
    @title = 'Suppliers'
    #@supplier_pages, @suppliers = paginate :suppliers, :per_page => 10
    @tstr = render_supplier_table
  end

  def show
    @supplier = Supplier.find(params[:id])
    @title = "Details for '#{@supplier.name}'"
  end

  def new
    @title = "New Supplier"
    @supplier = Supplier.new
    @address = Address.new
    @contact = Contact.new
    @supplier.po_method = 'email'
  end

  def create
    @supplier = Supplier.new(params[:supplier])
    @supplier.build_primary_contact(params[:contact])
    @supplier.build_primary_address(params[:address].merge(:name => params[:supplier][:name]))
    if @supplier.save
      if params[:publish] == 'true'
        @supplier.publish!
        flash[:notice] = 'Supplier was successfully created and activated.'
      else
        flash[:notice] = 'Supplier was successfully created.'
      end
      redirect_to :action => 'list'
    else
      @contact = @supplier.primary_contact
      @address = @supplier.primary_address
      render :action => 'new'
    end
  end

  def edit
    @supplier = Supplier.find(params[:id])
    @contact = @supplier.primary_contact
    @address = @supplier.primary_address
    @title = "Editing \"#{@supplier.name}\""
  end

  def update
    @supplier = Supplier.find(params[:id])
    release_holds = @supplier.on_hold && params[:supplier][:on_hold]
    success = false
    # Default of address name is the supplier name
    params[:address][:name] = params[:supplier][:name]
    @supplier.attributes= params[:supplier]
    @supplier.primary_address.attributes= params[:address]
    @supplier.primary_contact.attributes= params[:contact]
    success = @supplier.save && @supplier.primary_address.save && @supplier.primary_contact.save
    if success
      if release_holds && @supplier.orders_on_hold
        logger.debug("Kick off hold process")
        @data_source = DataBackgroundJobSource.new()
        @data_source.source_for = 'OrderHeader'
        @data_source.parameters = @supplier.id
        @data_source.save
        begin
          job_key = MiddleMan.new_worker(:class => :order_header_release_worker,
                              :args => @data_source.id)
          @data_source.update_attributes(:job_key => job_key)
        rescue ActiveRecord::StaleObjectError
          @data_source.reload
          @data_source.update_attributes(:job_key => job_key)
        rescue
          flash[:warning] = "Can't connect to the background processor."
        end                
      end
      if params[:publish] == 'true'
       @supplier.publish!
       flash[:notice] = 'Supplier was successfully updated and activated.'
      else
       flash[:notice] = 'Supplier was successfully updated.'
      end
      redirect_to :action => 'show', :id => @supplier
    else
      @contact = @supplier.primary_contact
      @address = @supplier.primary_address
      render :action => 'edit'
    end
  end

  def destroy
    Supplier.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
  
  def list_csv
    suppliers = Supplier.find(:all)
    output = ""
    CSV::Writer.generate(output) do |csv|
      csv << ["Action*","ID","Name*","Parent ID","Account number","Parent Name","Primary Contact ID",
              "Primary Contact Email*","Primary Contact Phone Work","Primary Contact Phone Mobile",
              "Primary Contact Name Prefix","Primary Contact Name Given*","Primary Contact Name Additional",
              "Primary Contact Name Family*","Primary Contact Name Suffix","Primary Contact Notes",
              "Primary Address Street1*","Primary Address Street2",
              "Primary Address City*","Primary Address State","Primary Address Postal Code",
              "Primary Address Country ID**","Primary Address Country Code**","Primary Address Country Name**",
              "PO Method","cXML URL","cXML Domain","cXML Identity","cXML Supplier Domain",
              "cXML Supplier Identity","cXML Secret","cXML Protocol"]

      suppliers.each do |sup|
        csv << [nil,sup.id,sup.name,sup.parent_id,sup.account_number,(sup.parent ? sup.parent.name : nil),sup.primary_contact_id,
                sup.primary_contact.email,sup.primary_contact.phone_work,sup.primary_contact.phone_mobile,
                sup.primary_contact.name_prefix,sup.primary_contact.name_given,sup.primary_contact.name_additional,
                sup.primary_contact.name_family,sup.primary_contact.name_suffix,sup.primary_contact.notes,
                sup.primary_address.street1,sup.primary_address.street2,
                sup.primary_address.city,sup.primary_address.state,sup.primary_address.postal_code,
                sup.primary_address.country_id,sup.primary_address.country.code,sup.primary_address.country.name,
                sup.po_method,sup.cxml_url,sup.cxml_domain,sup.cxml_identity,sup.cxml_supplier_domain,
                sup.cxml_supplier_identity,sup.cxml_secret,sup.cxml_protocol]
      end
    end
    headers["Content-Type"] = "text/csv"
    headers["Content-Disposition"] = "attachment; filename=\"supplier_list.csv\""
    render_without_layout :text => output
  end

  def csv_template
    output = ""
    CSV::Writer.generate(output) do |csv|
      csv << ["Action*","ID","Name*","Parent ID","Account number","Parent Name","Primary Contact ID",
              "Primary Contact Email*","Primary Contact Phone Work","Primary Contact Phone Mobile",
              "Primary Contact Name Prefix","Primary Contact Name Given*","Primary Contact Name Additional",
              "Primary Contact Name Family*","Primary Contact Name Suffix","Primary Contact Notes",
              "Primary Address Name*","Primary Address Street1*","Primary Address Street2",
              "Primary Address City*","Primary Address State","Primary Address Postal Code",
              "Primary Address Country ID**","Primary Address Country Code**","Primary Address Country Name**",
              "PO Method","cXML URL","cXML Domain","cXML Identity","cXML Supplier Domain",
              "cXML Supplier Identity","cXML Secret","cXML Protocol"]
    end
    headers["Content-Type"] = "text/csv"
    headers["Content-Disposition"] = "attachment; filename=\"supplier_template.csv\""
    render_without_layout :text => output
  end

  def new_supplier
    @supplier = Supplier.new(params[:supplier])
    @update_field_root = params[:update_field_root]
    @supplier.build_primary_contact(params[:contact])
    params[:address][:name] = params[:supplier][:name]
    @supplier.build_primary_address(params[:address])
    @supplier.po_method = 'email'
    if @supplier.save
      if params[:publish] == 'true'
        @supplier.publish!
        flash.now[:notice] = 'Supplier was successfully created and activated.'
      else
        flash.now[:notice] = 'Supplier was successfully created.'
      end
      render :update do |page|
        page << "dojo.widget.byId('new_supplier_dialog').hide();"
        page << "dojo.widget.byId('new_supplier_dialog').destroy();"
        page.reload_flash
        page[@update_field_root+'supplier'].value = @supplier.name
        page[@update_field_root+'supplier_id'].value = @supplier.id
        page.replace_html(@update_field_root+'supplier_name',"#{@supplier.name} <i>(Draft)</i>")
        page.replace_html(@update_field_root+'supplier_email',@supplier.primary_contact.email)
        page.replace_html(@update_field_root+'supplier_address',address_to_html(@supplier.primary_address))			
        page["#{@update_field_root}supplier_info"].show
        page[@update_field_root + 'supplier_edit_btn'].show
        page << "hide_and_destroy('new_supplier_dialog');"
      end
    else
      @contact = @supplier.primary_contact
      @address = @supplier.primary_address
      render :update do |page|
        page.replace_html 'supplier_form_partial', :partial => 'suppliers/mini_form'
      end
    end
  end
  
  # actions for the popup supplier form used in reqs
  def new_supplier_form
    @supplier = Supplier.new(params[:supplier])
    @address = Address.new
    @contact = Contact.new
    @update_field_root = params[:update_field_root]   
    render :partial => 'suppliers/new_supplier_form'
  end
  
  def edit_draft_supplier
    @supplier = Supplier.find_by_id(params[:supplier],:conditions => ['created_by = ? AND status = ?',session[:user].id,'draft'])
    @update_field_root = params[:update_field_root]
  
    # RJS.. partial so we can access externally
    render :partial => 'edit_draft_supplier'
  end

  def edit_supplier
    @supplier = Supplier.find(params[:id],:conditions => ['created_by = ? AND status = ?',session[:user].id,'draft'])
    @update_field_root = params[:update_field_root]
    if @supplier.update_attributes(params[:supplier]) && 
       @supplier.primary_address.update_attributes(params[:address]) &&
       @supplier.primary_contact.update_attributes(params[:contact])
      flash.now[:notice] = 'Supplier was successfully edited.'
      # RJS.. partial so we can access externally
      render :partial => 'edit_supplier'
    else
      @contact = @supplier.primary_contact
      @address = @supplier.primary_address
      render :update do |page|
        page.replace_html "supplier_#{@supplier.id}_form_partial", :partial => 'suppliers/mini_form'
      end
    end
  end
  
end
