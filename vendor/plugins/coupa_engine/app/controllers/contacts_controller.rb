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

class ContactsController < ApplicationController
  def index
    list
    render :action => 'list'
  end

  def list
    @title = 'Listing Contacts'
    @contact_pages, @contacts = paginate :contacts, :per_page => 10
  end

  def show
    @contact = Contact.find(params[:id])
  end

  def new
    @title = 'New Contact'
    @contact = Contact.new
  end

  def create
    @contact = Contact.new(params[:contact])
    if @contact.save
      flash[:notice] = 'Contact was successfully created.'
      redirect_to :action => 'list'
    else
      @title = 'New Contact'
      render :action => 'new'
    end
  end

  def edit
    @contact = Contact.find(params[:id])
    @title = "Editing Contact"
  end

  def update
    @contact = Contact.find(params[:id])
    if @contact.update_attributes(params[:contact])
      flash[:notice] = 'Contact was successfully updated.'
      redirect_to :action => 'show', :id => @contact
    else
      @title = "Editing Contact"
      render :action => 'edit'
    end
  end

  def destroy
    Contact.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
  
  def vcf
    @contact = Contact.find(params[:id])
    headers['Content-Type'] = 'text/x-vcard'
    headers['Content-Disposition'] = "attachment; filename=contact.vcf"
    render_without_layout :text => @contact.vcf
  end
end
