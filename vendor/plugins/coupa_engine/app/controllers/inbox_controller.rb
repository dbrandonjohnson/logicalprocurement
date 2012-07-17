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

class InboxController < ApplicationController
  def index
    @title = "My Inbox"
    @feed_params = {:action => 'rss'}
    @notification_pages, @notifications = paginate :notifications, :per_page => 10, :conditions => ['user_id = ?',session[:user].id], :order => 'created_at DESC'
  end
  
  def rss
    @notifications = Notification.find_all_by_user_id(session[:user].id,:order => 'created_at DESC',:limit => 15)
    render_without_layout
  end
  
  def show
    @notification = Notification.find(params[:id],:conditions => ['user_id = ?',session[:user].id])
    @notification.update_attribute(:read_flag,true) if !@notification.read_flag
    @title = @notification.subject
  end
  
  def show_content
    @notification = Notification.find(params[:id],:conditions => ['user_id = ?',session[:user].id])
    render :text => @notification.body
  end
end