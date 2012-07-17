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

class ApprovalNotify < ActionNotifier

  require 'pdf/writer'
  require 'requisitions_mailer'
  require 'html2techbook'
  
  include ActionView::Helpers::UrlHelper
  include ActionView::Helpers::NumberHelper
  include AddressesHelper
  include FileColumnHelper
  helper :coupa

  cattr_accessor :pdf_template

  # Customizable PDF template
  @@pdf_template = File.join(Rails.plugins['coupa_engine'].root, "app", "views", "order_headers", "po.rpdf")
  
  def next_approver(passed_controller, req, approval = nil)
    controller = passed_controller || ActionController::MailerController.new(:controller => 'requisition_headers')
    # this is passed in from the enter action in approval.rb, since the status attribute hasn't been updated
    # by the time this is called
    if approval
      cur_approval = approval
    else
      cur_approval = req.approval
      while (cur_approval.status == 'approved') && cur_approval.children.first
        cur_approval = cur_approval.children.first
      end
    end
    @notifier   = cur_approval
    @to_user    = cur_approval.user
    @recipients = cur_approval.user.email
    @from       = "approvals@#{smtp_settings[:domain]}"
    @subject    = "Approval Request for #{req.requested_by.fullname} - Requisition ##{req.id}"
    @sent_on    = Time.now
    @approval_key = cur_approval.approval_key
    @online_notification = render_message("next_approver.online.rhtml", :controller => controller, :requisition_header => req, :to_user => @to_user)

    @layout     = :approval_notify
    part :content_type => 'text/html',
      :body => render_message("next_approver.text.html.rhtml", :controller => controller, :requisition_header => req, :from => @from, :approval_key => @approval_key, :to_user => @to_user)
  end
  
  def po_to_supplier(passed_controller, po)
    controller = passed_controller || ActionController::MailerController.new(:controller => 'order_headers')
    @recipients = po.supplier.primary_contact.email
    @from       = "do_not_reply@#{smtp_settings[:domain]}"
    if po.versions.size > 1
      @subject    = "#{Setup.find_by_key('company name') ? Setup.find_by_key('company name').value : ''} Revised Purchase Order ##{po.id}"
    else
      @subject    = "#{Setup.find_by_key('company name') ? Setup.find_by_key('company name').value : ''} Purchase Order ##{po.id}"
    end
    @sent_on    = Time.now
    @layout     = :approval_notify
    part :content_type => 'text/html',
         :body => render_message('po_to_supplier.text.html.rhtml', 
                                 :controller => controller, 
                                 :order_header => po )
    attachment("application/pdf") do |a|
      a.content_disposition = "attachment;filename=PO_#{po.id}.pdf"
      pdf = ::PDF::Writer.new( :paper => 'LETTER' )
      pdf.compressed = true if RAILS_ENV != 'development'
      template_path = ApprovalNotify.pdf_template 
      template = File.read(template_path)
      @order_header = po
      @po_term_string = HTML2Techbook.from_html(@order_header.order_lines[0].account.account_type.po_terms)
      eval template
      a.body = pdf.render
    end
  end
  
  def po_cancellation_notice_to_supplier(po)
    controller = ActionController::MailerController.new(:controller => 'requisition_headers')
    @recipients = po.supplier.primary_contact.email
    @from       = "do_not_reply@#{smtp_settings[:domain]}"
    @subject    = "#{Setup.find_by_key('company name') ? Setup.find_by_key('company name').value : ''} Purchase Order ##{po.id} has been cancelled"
    @sent_on    = Time.now
    @layout     = :approval_notify
    part :content_type => 'text/html',
         :body => render_message('po_cancellation_notice_to_supplier.text.html.rhtml', 
                                 :controller => controller, 
                                 :order_header => po )
  end
    
  def req_to_requester(controller, req)
    @notifier   = req
    @to_user    = req.requested_by
    @recipients = req.requested_by.email
    @from       = "do_not_reply@#{smtp_settings[:domain]}"
    @subject    = "Requisition ##{req.id} Returned from Buyer"
    @sent_on    = Time.now
    @online_notification = render_message("req_to_requester.text.html.rhtml", :controller => controller, :requisition_header => req)

    @layout     = :approval_notify
    part :content_type => 'text/html',
      :body => render_message("req_to_requester.text.html.rhtml", :controller => controller, :requisition_header => req)
  end
  
  def req_approved(controller, req)
    @notifier   = req
    @to_user    = req.requested_by
    @recipients = req.requested_by.email
    @from       = "do_not_reply@#{smtp_settings[:domain]}"
    @subject    = "Requisition ##{req.id} Approved"
    @sent_on    = Time.now
    @online_notification = render_message("req_approved.text.html.rhtml", :controller => controller, :requisition_header => req)

    @layout     = :approval_notify
    part :content_type => 'text/html',
      :body => render_message("req_approved.text.html.rhtml", :controller => controller, :requisition_header => req)
  end

  def req_rejected(controller, req)
    @notifier   = req
    @to_user    = req.requested_by
    @recipients = req.requested_by.email
    @from       = "do_not_reply@#{smtp_settings[:domain]}"
    @subject    = "Requisition ##{req.id} Rejected"
    @sent_on    = Time.now

    @online_notification = render_message("req_rejected.text.html.rhtml", :controller => controller, :requisition_header => req)
    @layout     = :approval_notify
    part :content_type => 'text/html',
      :body => render_message("req_rejected.text.html.rhtml", :controller => controller, :requisition_header => req)
  end
    
  def receive(email)    
    controller = ActionController::MailerController.new(:controller => 'requisition_headers')
    
    # validate user
    unless User.current_user = User.find_by_email(email.from.first)
      RequisitionsMailer.deliver_request_failed controller, email, ["You are not registered on our system."]
      return
    end
    
    if /\[([a-f0-9]+)\]/ =~ email.subject
      unless (cur_approval = Approval.find(:first,:conditions => ['user_id = ? AND status = \'pending_approval\' AND approval_key = ?',User.current_user.id,$1])) &&
             (requisition_header = RequisitionHeader.find_by_approval_id(cur_approval.root.id))
        RequisitionsMailer.deliver_request_failed controller, email, ["Can't process approval/rejection.  The requisition may have been withdrawn or already approved."]
        return
      end
      case email.subject
      when /Approve/
        cur_approval.approve!
        if cur_approval.current_state == :approved
          if [:approved,:ordered].index(requisition_header.reload.current_state)
            begin
              ApprovalNotify.deliver_req_approved(controller,requisition_header)
            rescue
              RequisitionsMailer.deliver_request_failed controller, email, ["Requisition was approved but could not deliver notification to requisitioner.  Message was: #{$!}"]
            end
          end
        else
          RequisitionsMailer.deliver_request_failed controller, email, ["Could not approve Requisition ##{@requisition_header.id}."]
        end
      when /Reject/
        cur_approval.approval_date = Time.now
        cur_approval.reject!
        requisition_header.reject!
        begin
          ApprovalNotify.deliver_req_rejected(controller,requisition_header)
        rescue
          RequisitionsMailer.deliver_request_failed controller, email, ["Could not deliver rejection notice to requisitioner.  Message was: #{$!}"]
        end
      else
        RequisitionsMailer.deliver_request_failed controller, email, ["Can't process approval/rejection.  Couldn't find a command."]
      end
    else
      RequisitionsMailer.deliver_request_failed controller, email, ["Can't process approval/rejection.  The subject line is malformed."]
      return
    end
  end
  
end
