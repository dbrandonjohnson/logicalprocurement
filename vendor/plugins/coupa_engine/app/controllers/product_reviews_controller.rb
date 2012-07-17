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

class ProductReviewsController < ApplicationController
  helper :catalog_items
  before_filter :authorize_action, :except => [ :embedded_list ]
  
  def manage
    @title = "My Reviews"
    @product_review_pages, @product_reviews = paginate :product_reviews, :per_page => 10, :conditions => ['product_reviews.created_by = ? AND reviewer IS NULL',session[:user].id], :include => 'catalog_item'
  end
  
  def embedded_list
    @item_id = params[:id]
    @product_review = ProductReview.new
    @product_review.catalog_item_id = params[:id]
    @product_review_pages, @product_reviews =
      paginate :product_reviews, 
               :order => 'reviewed_at DESC', 
               :conditions => ["catalog_item_id = ?", params[:id]],
               :per_page => 5    
    render_without_layout :action => 'embedded_list'
  end
  
  def embedded_add
    @item_id = params[:id]
    @catalog_item = CatalogItem.find(params[:id])
    @product_review = ProductReview.new(params[:product_review])
    @product_review.reviewed_at = Time.now
    if @product_review.valid? && @catalog_item.product_reviews << @product_review
      #@catalog_item.save
      @product_review = ProductReview.new
      @product_review_pages, @product_reviews =
        paginate :product_reviews, 
                 :order => 'reviewed_at DESC', 
                 :conditions => ["catalog_item_id = ?", params[:id]],
                 :per_page => 5    
      render :update do |page|
        page.replace "rating_#{@catalog_item.id}", :partial => 'catalog_items/rating'
        page.replace_html 'product_review_list', :partial => 'list'
        page.replace_html 'pr_add_container', :partial => 'add'
        page << "dojo.widget.byId('pr_add').hide();"
        page << "$('product_review[title]').focus();"
      end
    else
      render :update do |page|
        page.replace_html 'pr_add_container', :partial => 'add'
        #page << "dojo.widget.createWidget('pr_add').show();"
        page << "dojo.widget.byId('pr_add').placeDialog();"
      end
    end
    
  end
  
  def manage_edit
    @product_review = ProductReview.find(params[:id],:conditions => ['created_by = ? AND reviewer IS NULL',session[:user].id])
    if @product_review.update_attributes(params[:product_review][params[:id]])
      render :update do |page|
        page << "dojo.widget.byId('pr_#{@product_review.id}').hide();"
        page.replace "product_review_#{@product_review.id}", :partial => 'managed_review', :locals => {:managed_review => @product_review, :managed_review_count => 0}
      end
    else
      render :update do |page|
        page.replace_html "pr_#{@product_review.id}", :partial => 'edit', :locals => {:product_review => @product_review}
        page << "dojo.widget.byId('pr_#{@product_review.id}').placeDialog();"
      end
    end
  end
  
  def manage_destroy
    process_destroy
    render :update do |page|
      page.remove("product_review_#{@product_review.id}")
    end
  end
  
  def embedded_destroy
    process_destroy
    if @catalog_item
      @item_id = @catalog_item.id
      @product_review_pages, @product_reviews =
        paginate :product_reviews, 
                 :order => 'reviewed_at DESC', 
                 :conditions => ["catalog_item_id = ?", @catalog_item.id],
                 :per_page => 5    
      render :update do |page|
        page.replace_html 'product_review_list', :partial => 'list'
        page.replace "rating_#{@catalog_item.id}", :partial => 'catalog_items/rating'
      end
    else
      render :nothing =>true
    end
  end

  protected
  def process_destroy
    @product_review = ProductReview.find(params[:id], :conditions => ['created_by = ?',session[:user].id])
    if @product_review
      @catalog_item = @product_review.catalog_item
      @catalog_item.product_reviews.delete(@product_review)
      #@catalog_item.save
    end
  end
  
end
