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

class AddressesController < ApplicationController
  def index
    list
    render :action => 'list'
  end

  def choose
    new_id = params[:id]
    if params[:address] then # creating a new address...
      @address = Address.new(params[:address])
      if @address.save then
        session[:user].address_assignments.create :address => @address
        if params[:default]
          session[:user].default_address = @address
        end
        session[:user].save
        new_id = @address.id
      else
        list
        render :action => 'choose'
        return
      end
    elsif !params[:id] || params[:id] == '' then # nothing selected
      list
      render :action => 'choose'
      return
    end
    # we have a selection, so now try to go back
    if session['return-to'].nil?
      # TODO: proper error handling
      redirect_to :action => 'error'
    else
      if params[:default]
        @address = Address.find(new_id)
        session[:user].default_address = @address
        session[:user].save
      end
      rt = session['return-to']
      session['return-to'] = nil
      redirect_to_url add_url_params(rt, {:address_id => new_id})
    end
  end

  def list
    page = (params[:page] ||= 1).to_i
    items_per_page = 9
    offset = (page - 1) * items_per_page
    @addresses = session[:user].addresses.find(:all)
    @address_pages = Paginator.new self, @addresses.length, items_per_page, page
    @addresses = @addresses[offset..(offset + items_per_page - 1)]
  end

  def show
    @address = session[:user].addresses.find(params[:id])
  end

  def new
    @address = Address.new
  end

  def create
    @address = Address.new(params[:address])
    if @address.save
      session[:user].address_assignments.create :address => @address
      session[:user].save
      flash[:notice] = 'Address was successfully created.'
      redirect_to :action => 'list'
    else
      render :action => 'new'
    end
  end

  def edit
    @address = session[:user].addresses.find(params[:id])
  end

  def update
    @address = session[:user].addresses.find(params[:id])
    if @address.update_attributes(params[:address])
      flash[:notice] = 'Address was successfully updated.'
      redirect_to :action => 'show', :id => @address
    else
      render :action => 'edit'
    end
  end

  def destroy
    session[:user].addresses.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
  
  def picker
    @address_pages = Paginator.new self, User.current_user.addresses.count, 5, params['page']
    @addresses = User.current_user.addresses.find :all,
                    :limit  =>  @address_pages.items_per_page,
                    :offset =>  @address_pages.current.offset
    render :partial => 'addresses/picker', :locals => {:field_root_id => params[:root]}
  end
  
  def dialog_form
    @address = Address.new
    render :partial => "addresses/dialog_form", :locals => {:root => params[:root]}
  end
  
  def create_from_dialog
    root = params[:root]
    @address = Address.new(params[:address])
    if @address.save
      session[:user].address_assignments.create :address => @address
      session[:user].save
      flash.now[:notice] = 'Address was successfully created.'
      render(:update) do |page|
        page.reload_flash
        page["#{root}_id"].value = @address.id
        page.replace_html "#{root}", :partial => "addresses/address", :locals => {:address => @address}
        page << "hide_and_destroy('#{root}_form_dialog')"
        page.call "update_address_picker", root
      end
    else
      render(:update) do |page|
        page.replace_html "#{root}_form", :partial => "addresses/form"
      end
    end
  end
end
