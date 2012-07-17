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

class TagController < ApplicationController  
  include TagHelper
  include ActionView::Helpers::TextHelper
  helper :catalog_items
  
  skip_before_filter :authorize_action, :only => [:portlet,:cloud_portlet]
  
  def index
    @title = "Tags"
    conditions = ["taggings.created_at > ?",Time.now - 604800]
    @recent_tags = CatalogItem.tags_count(:conditions => conditions, :raw => true)
    @popular_tags = CatalogItem.tags_count(:raw => true)
  end
  
  def portlet
    @item = params[:item]
    render_without_layout :action => 'portlet'
  end
  
  def cloud_portlet
    conditions = ["taggings.taggable_type = ?",params[:type]] if !params[:type].blank?
    @tagged_items = CatalogItem.tags_count(:conditions => conditions, :raw => true, :limit => params[:limit])
    render_without_layout :action => 'cloud_portlet'
  end
  
  def add
    params[:is_private] ||= false
    @item = params[:type].constantize.find(params[:id])
    @item.tag_with(strip_tags(params[:tag]),params[:is_private])
    render_without_layout :action => 'portlet'
  end

  def search
    @search_term = params[:id]
    page = (params[:page] ||= 1).to_i
    items_per_page = 9
    offset = (page - 1) * items_per_page

    @catalog_items = CatalogItem.find_tagged_with(@search_term)
    @catalog_item_pages = Paginator.new self, @catalog_items.length, items_per_page, page
    @catalog_items = @catalog_items[offset..(offset + items_per_page - 1)]
    
    render :action => 'search'
  end
  
  def manage
    @title = "My Tags"
    @tagged_items = CatalogItem.tags_count(:conditions => ['taggings.created_by = ?', session[:user].id], :raw => true)
    @tags = Tag.find(:all, :conditions => ['taggings.created_by = ?', session[:user].id], :include => 'taggings', :order => 'tags.name')
  end

  def admin
    @title = "Public Tags"
    @tagged_items = CatalogItem.tags_count(:conditions => ['taggings.is_private = ?', false], :raw => true)
    @tags = Tag.find(:all, :conditions => ['taggings.is_private = ?', false], :include => 'taggings', :order => 'tags.name')
  end
  
  def remove_taggings
    Tagging.destroy_all(['taggings.tag_id = ? AND taggings.created_by = ?',params[:id],session[:user].id])
    render :update do |page|
      page.remove("tag_#{params[:id]}")
      page << "EventSelectors.assign(Rules);"
    end
  end
  
  def admin_remove_taggings
    Tagging.destroy_all(['taggings.tag_id = ? AND taggings.is_private = ?', params[:id], false])
    render :update do |page|
      page.remove("tag_#{params[:id]}")
      page << "EventSelectors.assign(Rules);"
    end
  end
  
  def remove_tagging
    Tagging.destroy_all(['taggings.created_by = ? AND taggings.tag_id = ? AND taggings.taggable_type = ? AND taggings.taggable_id = ?',session[:user].id,params[:tag_id],params[:taggable_type],params[:taggable_id]])
    render :update do |page|
      page.remove("tag_#{params[:tag_id]}_#{params[:taggable_type].underscore}_#{params[:taggable_id]}")
    end
  end

  def admin_remove_tagging
    Tagging.destroy_all(['taggings.is_private = ? AND taggings.tag_id = ? AND taggings.taggable_type = ? AND taggings.taggable_id = ?',false,params[:tag_id],params[:taggable_type],params[:taggable_id]])
    render :update do |page|
      page.remove("tag_#{params[:tag_id]}_#{params[:taggable_type].underscore}_#{params[:taggable_id]}")
    end
  end
end