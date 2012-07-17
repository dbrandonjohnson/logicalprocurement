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

class CurrenciesController < ApplicationController
  data_table :currency, [:code,:name,
                        {:key => :enabled_flag, :label => 'Enabled', :render_text => "<%= value ? 'Yes' : 'No' %>"},
                        {:key => :actions, :method => :self, 
                          :render_text => "<%= link_to_remote(image_tag('tick', :title => 'Enable'),:url => {:action => 'enable',:id => value.id}, :title => 'Enable', :confirm => 'Are you sure?') if !value.enabled_flag %>"}
                        ],
                        {:find_options => {:order => 'enabled_flag DESC, code ASC'}}
  
  verify :xhr => true, :only => [ :enable ], :redirect_to => { :action => :index }
    
  def index
    list
    render :action => 'list'
  end
  
  def list
    @title = 'Currencies'
    @tstr = render_currency_table
  end
  
  def show
    @currency = Currency.find(params[:id])
    @title = "Details for #{@currency.code}"
  end
  
  def enable
    @currency = Currency.find(params[:id])
    if @currency.update_attribute(:enabled_flag,true)
      flash.now[:notice] = "#{@currency.code} successfully enabled"
      render :update do |page|
        page.replace_html 'flash_container', :partial => 'layouts/flash'
        page.replace "currency_row_#{@currency.id}", :partial => 'layouts/table_row', :collection => @currency.to_a, :locals => {:table_options => @@currency_table_options, :table_columns => @@currency_columns}
        page<<"EventSelectors.start(Rules);"        
      end
    else
      flash.now[:warning] = "#{@currency.code} could not be enabled."
      render :update do |page|
        page.replace_html 'flash_container', :partial => 'layouts/flash'
      end
    end
  end

end