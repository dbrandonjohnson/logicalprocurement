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

# Copyright (c) 2005 James Adam
#
# This is the MIT license, the license Ruby on Rails itself is licensed 
# under.
#
# Permission is hereby granted, free of charge, to any person obtaining 
# a copy of this software and associated documentation files (the 
# "Software"), to deal in the Software without restriction, including 
# without limitation the rights to use, copy, modify, merge, publish, 
# distribute, sublicense, and/or sell copies of the Software, and to permit
# persons to whom the Software is furnished to do so, subject to the 
# following conditions:
#
# The above copyright notice and this permission notice shall be included 
# in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
# OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
# IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
# CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
# TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
# OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 



# The RoleController allows Role objects to be manipulated via the
# web interface
class RoleController < ApplicationController

  data_table :role, [{:key => :name, :method => :self, :render_text => "<%= link_to(h(value.name), {:action => 'show', :id => value}, :title => 'Show details', :show_text => true )%>" }, 
                     :description, :omnipotent, :system_role,
                     {:key => :actions, :method => :self, :render_text => "<%= link_to(image_tag('pencil', :title => 'Edit'),{:action => 'edit',:id => value},:title => 'Edit') %>"+
                                                      "&nbsp;<%= link_to(image_tag('delete'),{:action => 'destroy',:id => value},:title => 'Delete',:confirm => 'Are you sure?', :method => 'post') unless value.system_role %>"}]
                     
  # Displays a paginated list of Role objects
  def list
    @content_columns = Role.content_columns
    @role_pages, @roles = paginate :role, :per_page => 10, :order => 'system_role desc, name'
    @title = 'Roles'
    @tstr = render_role_table
    render :inline => "<div id=\"content\"><%= @tstr %><br/><%= rollover_link_to 'New role', :action => :new %></div>", :layout => 'coupa'
  end

  # Edit a Role object.. added the ability to generate role if it doesn't exist & a fix on failed
  # validation
  def edit
    case request.method
      when :get
        if (@role = find_role(params[:id]))
          # load up the controllers
          @all_permissions = Permission.find_all

          # split it up into controllers
          @all_actions = {}
          @all_permissions.each { |permission|
            @all_actions[permission.controller] ||= []
            @all_actions[permission.controller] << permission
          }
        else
          redirect_back_or_default :action => 'list'
        end
      when :post
        if (@role = Role.find_by_id(params[:id]) || Role.new)
          new_record = @role.new_record?

          # update the action permissions
          permission_keys = params.keys.select { |k| k =~ /^permissions_/ }
          permissions = permission_keys.collect { |k| params[k] }

          begin
            permissions.collect! { |perm_id| Permission.find(perm_id) }

            # just wipe them all and re-build
            @role.permissions.clear

            permissions.each { |perm|
              if !@role.permissions.include?(perm)
                @role.permissions << perm
              end
            }

            # save the object    
            if @role.update_attributes(params[:role])
              flash[:notice] = 'Role was successfully %s.' % (new_record ? 'created' : 'updated')
              redirect_to :action => 'show', :id => @role
            else
              flash[:message] = 'The role could not be %s.' % (new_record ? 'created' : 'updated')
              @all_permissions = Permission.find_all
              @all_actions = {}
              @all_permissions.each { |permission|
                @all_actions[permission.controller] ||= []
                @all_actions[permission.controller] << permission
              }
              render :action => 'edit'
            end
          rescue ActiveRecord::RecordNotFound => e
            flash[:message] = 'Permission not found!'
            @all_permissions = Permission.find_all
            @all_actions = {}
            @all_permissions.each { |permission|
              @all_actions[permission.controller] ||= []
              @all_actions[permission.controller] << permission
            }
            render :action => 'edit'
          end
        else
          redirect_back_or_default :action => 'list'
        end
    end
  end

  # Added ability to include permissions on create
  def new
    @role = Role.new
    @all_permissions = Permission.find_all
    @all_actions = {}
    @all_permissions.each { |permission|
      @all_actions[permission.controller] ||= [] 
      @all_actions[permission.controller] << permission
    }
  end
end
