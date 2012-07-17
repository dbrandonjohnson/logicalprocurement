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

class ReceiptsController < ApplicationController
  helper :requisition_headers

  def asset_received_popup
    @requisition_line = RequisitionLine.find(params[:id])
    render :layout => false
  end
  def receive_requisition
    @requisition_header = RequisitionHeader.find(params[:id],:conditions => ['created_by = ? AND status IN (?)',User.current_user.id,['ordered','partially_received','received']])
    @title = "Receive Requisition ##{@requisition_header.id}"
  end
  
  def update_requisitions
    has_error = false
    # Make a dummy object for our errors
    @errored_form = RequisitionLine.new
    update_array = {}
    params[:requisition_line].each do |id,req_data|
      result = nil
      if req_data[:receive]
        rl = RequisitionLine.find_by_id(id)
        result = rl.receive(:all)
        update_array.store(id, rl.received)
      elsif !req_data[:receive_amt].empty?
        rl = RequisitionLine.find_by_id(id)
        result = rl.receive(req_data[:receive_amt])
        update_array.store(id, rl.received)
      end
      if result && result.respond_to?(:errors) && !result.errors.empty?
        has_error = true
        result.errors.each_full do |mesg|
          @errored_form.errors.add_to_base("Req #"+rl.requisition_header.id.to_s+" Line #"+rl.line_num.to_s+" - "+mesg)
        end
      end
    end
    
    redirect_to :action => 'list'
     if has_error
       flash[:notice] = "There were errors trying to recieve your items."
     else
       flash[:notice] = "Items Received"
     end
  end 

  # Extra protection in the case of a single req.
  def update_requisition
    @requisition_header = RequisitionHeader.find(params[:id],:include => :requisition_lines,:conditions => ['requisition_headers.created_by = ? AND requisition_headers.status IN (?)',User.current_user.id,['ordered','partially_received','received']])
    has_error = false
    @requisition_header.requisition_lines.each do |rl|
      if params[:requisition_line][rl.id.to_s]
        result = nil
        if params[:requisition_line][rl.id.to_s][:receive]
          result = rl.receive(:all)
        elsif !params[:requisition_line][rl.id.to_s][:receive_amt].blank?
          result = rl.receive(params[:requisition_line][rl.id.to_s][:receive_amt])
        end
        if result && result.respond_to?(:errors) && !result.errors.empty?
          has_error = true
          result.errors.each_full do |mesg|
            rl.errors.add_to_base(mesg)
          end
        end
      end
    end
    if has_error
      @title = "Receive Requisition ##{@requisition_header.id}"
      render :action => 'receive_requisition'
    else
      flash[:notice] = "Successfully received Requisition ##{@requisition_header.id}"
      redirect_to :action => 'receive_requisition', :id => @requisition_header.id
    end
  end
  
end

