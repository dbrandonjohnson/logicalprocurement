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

class RequisitionsMailer < ActionMailer::Base
  helper ActionView::Helpers::UrlHelper
  include FileColumnHelper
  
  @@from_name = "Coupa Requisitions"
  @@from_address = "requisitions@#{server_settings[:domain]}"
  @@from_link = "<a href=\"mailto:#{@@from_address}\">#{@@from_name}</a>"
  @@from = "#{@@from_name} <#{@@from_address}>"
  @@template_subject = 'Coupa requisition email template'
  
  def request_entered(controller, email, requisition_header)
    @subject    = "Requisition ##{requisition_header.id} created"
    @body       = { :requisition_header => requisition_header, :controller => controller }
    @recipients = email.from.first
    @from       = @@from
    @sent_on    = Time.now
    @headers    = {}
    @content_type = 'text/html'
  end
  
  def request_failed(controller, email, errors)
    @subject    = "ERROR: #{email.subject}"
    @body       = { :errors => errors, :controller => controller }
    @recipients = email.from.first
    @from       = @@from
    @sent_on    = Time.now
    @headers    = {}
    @content_type = 'text/html'
  end
end
