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

class AccountTypesController < ApplicationController
  helper :addresses, :contacts
  data_table :account_type, [{:key => :name, :method => :self, :render_text => "<%= link_to(h(value.name),:action => 'show',:id => value.id) %>"},
                             {:key => :actions, :method => :id, 
                              :render_text => "<%= link_to(image_tag('pencil', :title => 'Edit'),:action => 'edit',:id => value) %>"}]

  def index
    list
    render :action => 'list'
  end

  def list
    #@account_type_pages, @account_types = paginate :account_types, :per_page => 10
    @tstr = render_account_type_table
    @title = 'Sets of Books'
  end

  def show
    @account_type = AccountType.find(params[:id])
    @title = "Details for '#{@account_type.name}'"
  end

  def new
    @account_type = AccountType.new
    @contact = Contact.new
    @address = Address.new
    @account_field_types = AccountFieldType.find_all()
    @title = "Create New Set of Books"
    @account_type.po_terms = ''
  end

  def create
    @account_type = AccountType.new(params[:account_type].delete_if{|k,v| k == "currency"})
    @account_type = AccountType.new(params[:account_type])
    # Default nickname is name of account
    params[:address][:name] = params[:account_type][:name]
    @account_type.build_primary_contact(params[:contact])
    @account_type.build_primary_address(params[:address])
    if @account_type.primary_contact.save && @account_type.primary_address.save && @account_type.save
      flash[:notice] = 'Set of Books was successfully created.'
      redirect_to :action => 'list'
    else
      @account_field_types = AccountFieldType.find_all()
      @contact = @account_type.primary_contact
      @address = @account_type.primary_address
      @title = "Create New Set of Books"
      render :action => 'new'
    end
  end

  def update_default
    newout = render_to_string(:partial => 'default_terms', :locals => { :address => Address.new(params[:address]) })
    render :update do |page|
      page.call "replaceTerms", newout
    end
  end

  def edit
    @account_type = AccountType.find(params[:id])
    @contact = @account_type.primary_contact
    @address = @account_type.primary_address
    @account_field_types = AccountFieldType.find_all()
    @title = "Editing Set of Books '#{@account_type.name}'"
  end

  def update
    @account_type = AccountType.find(params[:id])
    params[:account_type].delete_if{|k,v| k == "currency" || k == "currency_id"}
    # Default of address name is account name
    params[:address][:name] = params[:account_type][:name]
    @account_type.attributes= params[:account_type]
    @account_type.primary_address.attributes= params[:address]
    @account_type.primary_contact.attributes= params[:contact]

    if @account_type.save && @account_type.primary_address.save && @account_type.primary_contact.save
      flash[:notice] = 'Set of Books was successfully updated.'
      redirect_to :action => 'list'
    else
      @account_field_types = AccountFieldType.find_all()
      @contact = @account_type.primary_contact
      @address = @account_type.primary_address
      render :action => 'edit'
    end
  end

  def destroy
    AccountType.find(params[:id]).destroy
    redirect_to :action => 'list'
  end

  def auto_complete_for_account_type_currency
    @currencies = Currency.find(:all,
      :conditions => [ 'LOWER(code) LIKE ? AND enabled_flag = ?',
      '%' + params[:id] + '%', true ])
    # just show the code, but bring back the rest of the stuff we need, too.
    render :inline => '<% currencies = @currencies.map { |entry| content_tag("li",'+
      '"<span class=\"acid\" style=\"display:none\">#{entry.id}</span>'+
      '<span class=\"acname\">#{entry.code}</span> (#{entry.name})") } %><%=content_tag("ul", currencies) %>'
  end

  def add_segment
    @last_segment ||= params[:field].gsub(/segment_/, "").to_i 
    @last_segment += 1
    render :update do |page|
      page.visual_effect 'Appear', "segment_#{last_segment}_element"
#      page.insert_html "segment_container", @last_segment.to_s
    end
  end
end
