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

class PoliciesController < ApplicationController
  before_filter :authorize_action, :except => [ :related ]
  @@section_title = 'Buying Policies'
  data_table :policy, [{:key => :name, :method => :self, :render_text => "<%= link_if_authorized(h(value.name), {:action => 'show', :id => value.id}, :title => 'Show details', :show_text => true) %>"},
                       {:key => :updated_at, :label => 'Last updated', :render_text => "<%= render_attribute(value.to_date) %>"},
                       {:key => :actions, :alignment => 'center', :method => :id, :permission => {:controller => 'policies', :action => 'edit'}, :render_text => 
                         "<%= link_if_authorized( image_tag('pencil'), {:action => 'edit', :id => value}, :title => 'Edit') %>"+
                         "&nbsp;<%= link_if_authorized( image_tag('delete'), { :action => 'destroy', :id => value }, :confirm => 'Are you sure?', :post => true, :title => 'Delete') %>"
                         }],
                         {:find_options => {:order => 'name DESC'}}
                         
  def index
    list
    render :action => 'list'
  end

  def list
    @title = "How to Buy Policies"
    @setup = Setup.find_by_key('default_policy')
    #@policy_pages, @policies = paginate :policies, :order => "name ASC", :per_page => 100
    @tstr = render_policy_table
  end

  def show
    @policy = Policy.find(params[:id])
  end

  def new
    @policy = Policy.new
    @policy.text = '&lt;Enter the policy text here&gt;'
    @title = "Create New How to Buy Policy"
  end

  def set_default_policy
    if params[:setup][:value]
      @setup = Setup.find_or_create_by_key('default_policy')
      @setup.value = params[:setup][:value]
      @setup.save
    end
    flash[:notice] = "Updated default policy."
    render :update do |page|
      page.reload_flash
    end
  end

  def create
    @policy = Policy.new(params[:policy])
    if @policy.save
      flash[:notice] = 'Policy was successfully created.'
      redirect_to :action => 'list'
    else
      render :action => 'new'
    end
  end

  def edit
    @policy = Policy.find(params[:id])
    @title = "Edit Policy '#{@policy.name}'"
  end

  def update
    @policy = Policy.find(params[:id])
    if @policy.update_attributes(params[:policy])
      flash[:notice] = 'Policy was successfully updated.'
      redirect_to :action => 'show', :id => @policy
    else
      render :action => 'edit'
    end
  end

  def destroy
    Policy.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
  
  def search
    query = params[:q]
    @title = "How to Buy Policies matching '#{query}'"
    @search_string = "policy:#{query}"
    @policies = Policy.find(:all,
                            :conditions => ["name like ?", "%#{query}%"],
                            :order => "name ASC")
    render :action => 'list'
  end
  
  def related
    @search_term = params[:id]
    if @search_term.blank?
      @policies = {}
    else
      @policies = Policy.find_tagged_with(@search_term.gsub('"',''))
    end
    render_without_layout :action => 'related'
  end
end
