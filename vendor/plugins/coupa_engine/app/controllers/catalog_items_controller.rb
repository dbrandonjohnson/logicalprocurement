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

class CatalogItemsController < ApplicationController
  
  data_table :catalog_item,[{:key => :name, :method => :self, :render_text => "<%= link_to(h(value.name),{:action => 'show',:id => value.id},:title => 'Show details') %>"},
                        {:key => :contract, :method => :self, :render_text => "<%= value.contract ? value.contract.name : '' %>", :sql_column => 'contracts.name'},
                        {:key => :description, :render_text => "<%= h(value) %>"},
                        {:key => :uom, :method => :self, :render_text => "<%= value.uom.code %>"},
                        {:key => :list_price, :method => :self, :render_text => "<%= render_attribute value.list_price, (Currency.find_all_by_enabled_flag(true).size > 1 ? :long : '') %>" },
                        :avg_rating,
                        {:key => :actions, :method => :id, :render_text => "<%= link_to(image_tag('pencil', :title => 'Edit'),:action => 'edit',:id => value) %>"+"<%= link_to( image_tag('delete'), { :action => 'destroy', :id => value }, :confirm => 'Are you sure?', :post => true, :title => 'Delete') %>"},
                        ],
                        {:find_options => {:include => :contract}}

  def index
    list
    render :action => 'list'
  end

  def bulk_loader
    @title = "Bulk Load Catalog Items"
    @data_source = DataFileSource.new
  end

  def list_csv
    output = ""
    CSV::Writer.generate(output) do |csv|
      csv << ["Action*","ID","Name*","Description","Contract ID","Contract Number","UOM ID**","UOM code**",
              "List Price","List Price Currency ID","List Price Currency Code","Source Part Num","Lead Time","Image URL"]
      
      if params[:template_only].nil? || !params[:template_only]
        items = CatalogItem.find(:all)
        items.each do |i|
          csv << [nil,i.id,i.name,i.description,i.contract_id,i.contract ? i.contract.name : '',i.uom_id, i.uom ? i.uom.code : '', 
                  i.list_price,i.list_price_currency_id, i.list_price.currency ? i.list_price.currency.code : '', i.source_part_num, i.lead_time]
        end
      end
    end
    headers["Content-Type"] = "text/csv"
    headers["Content-Disposition"] = "attachment; filename=\"catalog_item_list.csv\""
    render :layout => false, :text => output
  end

  def load_file
    @data_source = DataFileSource.new(params[:data_source])
    @data_source.source_for = 'CatalogItem'
    if @data_source.save
      begin
        job_key = MiddleMan.new_worker(:class => :catalog_item_loader_worker,
                            :args => { :user => User.current_user.id, :data => @data_source.id })
        @data_source.update_attributes(:job_key => job_key)
      rescue ActiveRecord::StaleObjectError
        @data_source.reload
        @data_source.update_attributes(:job_key => job_key)
      rescue
        flash[:warning] = "Can't connect to the background processor."
        logger.debug("CatalogItemsController.load_file: #{$!}")
        redirect_to :controller => 'data_sources', :action => 'index'
      end
    else
      @title = "Bulk Load Catalog Items"
      render :action => 'bulk_loader'
      return
    end
    @title = "Loading Catalog Items"
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
    @catalog_items = CatalogItem.find(:all,
      :conditions => [ 'LOWER(name) LIKE ?',
      '%' + params[:name] + '%' ], :limit => 5)
    render :layout => false
  end

  def list
    @title = 'Catalog Items'
    @tstr = render_catalog_item_table
  end

  def show
    @catalog_item = CatalogItem.find(params[:id])
    @title = @catalog_item.name
  end

  def new
    @catalog_item = CatalogItem.new
    if params[:contract_id]
      @catalog_item.contract_id = params[:contract_id]
    end
    @title = "New Catalog Item"
  end

  def create
    @catalog_item = CatalogItem.new(params[:catalog_item])
    if @catalog_item.save
      #@catalog_item.tag_with(params[:tags])
      flash[:notice] = 'Catalog item was successfully created.'
      redirect_to :action => 'list'
    else
      @title = "New Catalog Item"
      render :action => 'new'
    end
  end

  def edit
    @catalog_item = CatalogItem.find(params[:id])
    @title = "Editing Catalog Item"
  end

  def update
    @catalog_item = CatalogItem.find(params[:id])
    if @catalog_item.update_attributes(params[:catalog_item])
      #@catalog_item.tag_with(params[:tags])
      flash[:notice] = 'Catalog item was successfully updated.'
      redirect_to :action => 'list'
    else
      @title = "Editing Catalog Item"
      render :action => 'edit'
    end
  end
  def destroy
    CatalogItem.find(params[:id]).destroy
    flash[:notice] = 'Catalog item was successfully deleted'
    redirect_to :action => 'list'
  end

  def tags
    @catalog_item = CatalogItem.find(params[:id])
    render_without_layout :action => 'tags'
  end
  
  def tags_add
    @catalog_item = CatalogItem.find(params[:id])
    @catalog_item.tag_with(params[:tag])
    render_without_layout :action => 'tags'
  end

  def tags_search
    @search_term = params[:id]
    page = (params[:page] ||= 1).to_i
    items_per_page = 9
    offset = (page - 1) * items_per_page

    @catalog_items = CatalogItem.find_tagged_with(@search_term)
    @catalog_item_pages = Paginator.new self, @catalog_items.length, items_per_page, page
    @catalog_items = @catalog_items[offset..(offset + items_per_page - 1)]
    
    render :action => 'search'
  end
  
  def search
    @search_term = params[:id] || ''
    @catalog_item_pages, @catalog_items = paginate :catalog_items, :per_page => 9, :conditions => ["name LIKE ? OR description LIKE ?",'%'+@search_term+'%','%'+@search_term+'%']
  end

  def mini
    case request.method
    when :get
      @catalog_item_pages, @catalog_items = {},{}
    when :post
      search
    end
    render_without_layout :action => 'mini'
  end
  
end

