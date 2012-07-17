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

module ValueToInt
  def value_i
    value.to_i
  end
end

class ApprovalLimitsController < ApplicationController
  data_table :approval_limit,[{:key => :amount, :method => :self, :alignment => 'left', :render_text => "<%= link_to(render_attribute(value.amount),:action => 'show',:id => value.id) %>"},
                              :currency,
                              {:key => :actions, :method => :id, 
                                    :render_text => "<%= link_to(image_tag('pencil', :title => 'Edit'),:action => 'edit',:id => value) %>"+
                                          "&nbsp;<%= link_to(image_tag('delete', :title => 'Delete'),{:action => 'destroy',:id => value},:confirm => 'Are you sure?') %>"}
                        ],
            {:find_options => {:include => [:currency], :order => 'amount'}}
  
  verify :xhr => true, :only => :auto_complete_for_approval_limit_currency
  skip_before_filter :authorize_action, :only => :auto_complete_for_approval_limit_currency

  def index
    list
    render :action => 'list'
  end

  def list
    @title = "Configure Approvals"
    @setup = Setup.find_by_key('ultimate approver').extend(ValueToInt)
    @users = User.find(:all,:conditions => ['status = ?', 'active'],:order => 'login')
    @tstr = render_approval_limit_table
    #@approval_limit_pages, @approval_limits = paginate :approval_limits, :per_page => 10, :order => 'amount'
  end

  def set_ultimate_approver
    @setup = Setup.find_or_create_by_key('ultimate approver').extend(ValueToInt)
    res = User.find_by_contents(params[:setup][:value_i])
    if  !res.empty? && @setup.update_attribute('value',res.first.id)
      flash[:notice] = "Successfully updated the ultimate approver."
      redirect_to :action => 'list'
    else
      flash.now[:warning] = "Ultimate approver not updated."
      list
      render :action => 'list'
    end
  end
      
  def show
    @title = "Approval Limit"
    @approval_limit = ApprovalLimit.find(params[:id])
    @users = User.find_all_by_approval_limit_id(params[:id], :order => 'login')
  end

  def new
    @title = "New Approval Limit"
    @approval_limit = ApprovalLimit.new
  end

  def create
    @approval_limit = ApprovalLimit.new()
    if params[:approval_limit][:currency_id].to_i > 0
      @approval_limit.amount = Money.new(params[:approval_limit][:amount].to_f,params[:approval_limit][:currency_id].to_i)
    end
    @approval_limit.currency_id = params[:approval_limit][:currency_id]
    if @approval_limit.save
      flash[:notice] = 'Approval limit was successfully created.'
      redirect_to :action => 'list'
    else
      render :action => 'new'
    end
  end

  def edit
    @title = 'Editing Approval Limit'
    @approval_limit = ApprovalLimit.find(params[:id])
  end

  def update
    @approval_limit = ApprovalLimit.find(params[:id])
    if params[:approval_limit][:currency_id].to_i > 0
      @approval_limit.amount = Money.new(params[:approval_limit][:amount].to_f,params[:approval_limit][:currency_id].to_i)
    end
    @approval_limit.currency_id = params[:approval_limit][:currency_id]
    if @approval_limit.save
      flash[:notice] = 'Approval limit was successfully updated.'
      redirect_to :action => 'show', :id => @approval_limit
    else
      render :action => 'edit'
    end
  end

  def destroy
    ApprovalLimit.find(params[:id]).destroy
    redirect_to :action => 'list'
  end

  def auto_complete_for_approval_limit_currency
    @currencies = Currency.find(:all,
      :conditions => [ 'LOWER(code) LIKE ? AND enabled_flag = ?',
      '%' + params[:id] + '%', true ])
    # just show the code, but bring back the rest of the stuff we need, too.
    render :inline => '<% currencies = @currencies.map { |entry| content_tag("li",'+
      '"<span class=\"acid\" style=\"display:none\">#{entry.id}</span>'+
      '<span class=\"acname\">#{entry.code}</span> (#{entry.name})") } %><%=content_tag("ul", currencies) %>'
  end

end
