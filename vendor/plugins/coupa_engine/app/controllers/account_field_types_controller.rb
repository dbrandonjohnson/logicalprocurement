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

class AccountFieldTypesController < ApplicationController
  @@validation_type = [['Any Character','.+'],['Alphanumeric','[A-Za-z0-9]+'], ['Numeric','[0-9]+'], ['Alphabetic','[A-Za-z]+'], ['Other','Other']]
  data_table :account_field_type, [:name,
                             :code,
                             {:key => :validation_regex, :label => "Validation"},
                             {:key => :actions, :method => :id, :render_text => "<%= link_to(image_tag('pencil', :title => 'Edit'), {:action => 'edit', :id => value}, :title => 'Edit') %>"}]

  def index
    list
    render :action => 'list'
  end

  def list
    @validation_type = @@validation_type
    @tstr = render_account_field_type_table
    #@account_field_type_pages, @account_field_types = paginate :account_field_types, :per_page => 10
    @title = 'Segments'
  end

  def show
    @account_field_type = AccountFieldType.find(params[:id])
  end

  def new
    @validation_type = @@validation_type
    @display_style = 'display:none'
    @account_field_type = AccountFieldType.new
    @title = "Create New Segment"
  end

  def create
    @validation_type = @@validation_type
    params[:account_field_type][:validation_regex] = params[:account_field_select_type][:validation_regex] unless params[:account_field_select_type][:validation_regex] == 'Other'
    @account_field_type = AccountFieldType.new(params[:account_field_type])

   if (@validation_type.flatten.include?(@account_field_type.validation_regex))
      @selected_regex = @account_field_type.validation_regex
      @display_style = 'display:none'
   else
      @selected_regex = 'Other'
      @display_style = 'display:block'
   end
    
    if @account_field_type.save
      flash[:notice] = 'Segment was successfully created.'
      redirect_to :action => 'list'
    else
      @title = "Create New Segment"
      render :action => 'new'
    end
  end

  def edit
    
    @validation_type = @@validation_type
    @account_field_type = AccountFieldType.find(params[:id])

   if (@validation_type.flatten.include?(@account_field_type.validation_regex))
      @selected_regex = @account_field_type.validation_regex
      @display_style = 'display:none'
   else
      @selected_regex = 'Other'
      @display_style = 'display:block'
   end
    @title = "Editing Segment '#{@account_field_type.name}'"
  end

  def update
    @account_field_type = AccountFieldType.find(params[:id])
    params[:account_field_type][:validation_regex] = params[:account_field_select_type][:validation_regex] unless params[:account_field_select_type][:validation_regex] == 'Other'
    if @account_field_type.update_attributes(params[:account_field_type])
      flash[:notice] = 'Segment was successfully updated.'
      redirect_to :action => 'list'
    else
      @title = "Editing Segment '#{@account_field_type.name}'"
      render :action => 'edit'
    end
  end

  def destroy
    AccountFieldType.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
  
  def validation_type
     if (params[:value] == "Other")
        render :update do |page|
          page.show "account_field_type_id"
          page.show "account_field_type_validation_regex"
        end
      else
         render :update do |page|
           page.hide "account_field_type_id"
           page.hide "account_field_type_validation_regex"
         end
      end
   end
end
