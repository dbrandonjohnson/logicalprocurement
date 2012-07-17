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

require 'rss'

class AdministrationController < ApplicationController

  def home
  end

  def company
    @company_name = Setup.lookup('company name') || ''
    @title = 'Company Information'
  end

  def update_company_info
    Setup.find_or_create_by_key('company name').update_attribute(:value,params[:company_name])
    Setup.find_or_create_by_key('allow_self_approval').update_attribute(:value,params[:allow_self_approval])
    Setup.find_or_create_by_key('route_to_buyer_on_no_contract').update_attribute(:value,params[:no_contract])
    Setup.find_or_create_by_key('route_to_buyer_on_draft_supplier').update_attribute(:value,params[:draft_supplier])

    flash.now[:notice] = "Successfully updated company information."
    company
    render :action => 'company'
    return
  end

  def feeds
    @title = "RSS Feed for the Homepage"
    @feed = Feed.find(:first)
  end

  def update_feeds
    @feed = Feed.find(:first) || Feed.new()
    error = false
	  if @feed.update_attributes(params[:feed])
		  @feed.update_attributes(:cache => nil,:last_cached_at => nil,:last_checked_at => nil)
		  unless @feed.url.blank?
		    begin
  			  @feed.reload.rss
  		  rescue
  			  error = true
  			  flash.now[:warning] = "Error parsing URI or connecting to RSS feed."
  		  end
	  
  		  if @feed.rss.nil?  || @feed.rss.empty?
  			    error = true
  			    flash.now[:warning] = "Cannot retrieve feed"
  		  else
  			    pf = RSS::Parser.parse(@feed.rss,true)
  		    if pf.nil? || pf.items.nil?
  		      error = true
  		      flash.now[:warning] = "Cannot parse RSS feed."
  		    end
  	    end
	    end
		else
		  error = true
		end
  	
    if error
      @title = "RSS Feed for the Homepage"
      render :action => 'feeds'
    else
      flash.now[:notice] = "Successfully updated RSS feed."
      home
      render :action => 'home'
    end    
  end

end