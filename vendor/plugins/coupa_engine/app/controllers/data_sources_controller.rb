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

class DataSourcesController < ApplicationController
  def index
    @title = 'File Upload Status'
    @data_source_pages, @data_sources = paginate :data_sources, :per_page => 10, :conditions => ['type = ?','DataFileSource'], :order => 'created_at DESC'
  end
  
  def start
    @data_source = DataSource.find(params[:id])
    if @data_source.current_state == :pending
      begin
        job_key = MiddleMan.new_worker(:class => "#{@data_source.source_for.underscore}_loader_worker",
                            :args => { :user => User.current_user.id, :data => @data_source.id })
        @data_source.update_attributes(:job_key => job_key)
      rescue ActiveRecord::StaleObjectError
        @data_source.reload
        @data_source.update_attributes(:job_key => job_key)
      rescue
        logger.debug($!.to_s)
        flash[:warning] = "Can't connect to the background processor."
      end
    else
      flash[:warning] = "Only pending files can be started."
    end
    redirect_to :action => 'index'
  end
  
  def errors
    @data_source = DataSource.find(params[:id])
    headers["Content-Type"] = "text/csv"
    headers["Content-Disposition"] = "attachment; filename=\"errors_#{@data_source.id}.csv\""
    render_without_layout :text => @data_source.error_text
  end
end
