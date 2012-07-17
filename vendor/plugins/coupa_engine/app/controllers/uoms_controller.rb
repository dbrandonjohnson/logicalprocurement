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

class UomsController < ApplicationController
  data_table :uom, [:code,:name,
                    {:key => :allowable_precision, :alignment => 'center'},
                    {:key => :actions, :alignment => 'center', :method => :self, :render_text => "<%= link_to(image_tag('pencil', :title => 'Edit'),{:action => 'edit',:id => value},:title => 'Edit') %>"}]
       #"&nbsp;<%= link_to(image_tag('delete'),{:action => 'destroy',:id => value},:title => 'Delete',:confirm => 'Are you sure?') %>"}]
  def index
    list
    render :action => 'list'
  end

  def auto_complete
    @uoms = Uom.find(:all,
      :conditions => [ 'LOWER(name) LIKE ?',
      '%' + params[:id] + '%' ])
    render :inline => '<%= auto_complete_result(@uoms, \'name\') %>'
  end
  
  def list
    @title = "Units of Measure"
    @tstr = render_uom_table
  end

  def show
    @uom = Uom.find(params[:id])
    @title = "Details for UOM '#{@uom.code}'"
  end

  def new
    @uom = Uom.new
    @title = "New UOM"
  end

  def create
    @uom = Uom.new(params[:uom])
    if @uom.save
      flash[:notice] = 'Uom was successfully created.'
      redirect_to :action => 'list'
    else
      render :action => 'new'
    end
  end

  def edit
    @uom = Uom.find(params[:id])
    @title = "Editing UOM '#{@uom.code}'"
  end

  def update
    @uom = Uom.find(params[:id])
    if @uom.update_attributes(params[:uom])
      flash[:notice] = 'Uom was successfully updated.'
      redirect_to :action => 'show', :id => @uom
    else
      render :action => 'edit'
    end
  end
  # Removing ability to destroy UOM's, wait on inactivate (#791)
  # def destroy
  #   Uom.find(params[:id]).destroy
  #   redirect_to :action => 'list'
  # end
end
