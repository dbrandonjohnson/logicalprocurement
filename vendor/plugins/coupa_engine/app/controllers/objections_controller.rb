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

class ObjectionsController < ApplicationController

  helper :product_reviews

  def index
    list
    render :action => 'list'
  end

  # GETs should be safe (see http://www.w3.org/2001/tag/doc/whenToUseGet.html)
  verify :method => :post, :only => [ :destroy, :create, :update ],
         :redirect_to => { :action => :list }

  def list
	@title = 'Reported Employee Reviews'
	@objections = Objection.find( :all, :order => 'id' )
  end

  def object
	@objection = Objection.new
	@objection[:product_review_id] = params[:product_review_id]
	@objection[:status] = "PENDING"
	if @objection.save
	      flash[:notice] = 'Your concern has been reported.'
	else 
	      flash[:error] = 'Error.'
	end
	render :partial => 'layouts/flash'
  end

  def dismiss_objection
      @objection = Objection.find(params[:id])
	@objection[:status] = 'DISMISSED'
	if @objection.update_attributes(params[:objection]) and @objection.destroy
	  flash[:notice] = 'Dismissed complaint.'
      else
  	  flash[:error] = 'Error.'
	end
	redirect_to :action => 'list'
  end

  def remove_review
      @objection = Objection.find(params[:id])
	@objection[:status] = 'UPHELD'
	if @objection.update_attributes(params[:objection]) and @objection.product_review.catalog_item.product_reviews.delete(@objection.product_review)
	  flash[:notice] = 'Product review removed.'
      else
  	  flash[:error] = 'Error.'
	end
	redirect_to :action => 'list'
  end

end
