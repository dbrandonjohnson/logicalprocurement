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

class AttachmentsController < ApplicationController
  before_filter :authorize_action, :except => [ :embedded_list, :retrieve ]
  
  def retrieve
    att = Attachment.find(params[:id])
    attachables = att.attachment_links.collect(&:attachable)
    if (params[:supplier_view_key] &&
      attachables.any? { |attach|
        case
        when attach.kind_of?(OrderHeader) || attach.kind_of?(QuoteRequest)
          attach[:supplier_view_key] == params[:supplier_view_key]
        when attach.kind_of?(OrderLine)
          attach.order_header[:supplier_view_key] == params[:supplier_view_key]
        when attach.kind_of?(QuoteRequestLine)
          attach.quote_request[:supplier_view_key] == params[:supplier_view_key]
        end
      }) || attachables.any? { |attachable| authorize_object(attachable) }
    then
      send_file att.file
    else
      flash.now[:warning] = 'You are not authorized to download this file'
      render :update do |page|
        page.reload_flash
      end
    end
  end
  
  def attach
    @attachment = Attachment.new
    if params[:attachment] then
      @attachment = Attachment.new(params[:attachment])
      if @attachment.save then
        # TODO: close window and update original window
        return
      end
    end
    render :action => 'attach', :layout => 'popup'
  end
  
  def embedded_list
    @editable = params[:editable]
    @intents = params[:intents]
    @attachment_name = params[:field_object]
    @attach_to = params[:attach_to]
    page = (params[:page] ||= 1).to_i
    items_per_page = 10
    offset = (page - 1) * items_per_page
    @attachment_links = params[:attach_to].attachment_links ? params[:attach_to].attachment_links.find(:all) : {}
    render_without_layout :action => 'embedded_list'
  end

  def embedded_destroy
    a_l = AttachmentLink.find(params[:id])
    Attachment.find(a_l.attachment_id).destroy
    a_l.destroy
    render :update do |page|
      page.remove "attach_#{params[:id]}"
    end
  end
  
  def index
    list
    render :action => 'list'
  end

  def list
    @attachment_pages, @attachments = paginate :attachments, :per_page => 10
  end

  def show
    @attachment = Attachment.find(params[:id])
  end

  def new
    @attachment = Attachment.new
  end

  def create
    @attachment = Attachment.new(params[:attachment])
    if @attachment.save
      flash[:notice] = 'Attachment was successfully created.'
      redirect_to :action => 'list'
    else
      render :action => 'new'
    end
  end

  def edit
    @attachment = Attachment.find(params[:id])
  end

  def update
    @attachment = Attachment.find(params[:id])
    if @attachment.update_attributes(params[:attachment])
      flash[:notice] = 'Attachment was successfully updated.'
      redirect_to :action => 'show', :id => @attachment
    else
      render :action => 'edit'
    end
  end

  def destroy
    Attachment.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
end
