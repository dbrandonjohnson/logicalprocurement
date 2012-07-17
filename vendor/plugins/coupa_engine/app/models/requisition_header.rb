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

class RequisitionHeader < ActiveRecord::Base
  include ApprovalLogic
  
  has_many :requisition_lines, :foreign_key => 'header_id', :dependent => :destroy, :order => "line_num", :include => "uom"
  belongs_to :requested_by, :class_name => "User", :foreign_key => "requested_by"
  belongs_to :account
  belongs_to :pcard

  belongs_to :approval, :dependent => :destroy
  belongs_to :ship_to_address, :class_name => "Address", :foreign_key => "ship_to_address_id"
  belongs_to :created_by, :class_name => "User", :foreign_key => "created_by"
  belongs_to :updated_by, :class_name => "User", :foreign_key => "updated_by"

  include Attachable
  has_many :events, :class_name => 'RequisitionEventHistory'

  acts_as_state_machine :column => :status, :initial => :draft
  state :draft, :enter => Proc.new {|r| r.events.create(:status => 'draft') }
  state :cart, :enter => Proc.new {|r| r.events.create(:status => 'cart') }
  state :pending_buyer_action, :enter => Proc.new {|r| r.events.create(:status => 'pending_buyer_action')
                                                       r.update_attribute(:submitted_at,Time.now) }
  state :pending_approval, :enter => Proc.new {|r| r.events.create(:status => 'pending_approval')
                                                   r.update_attribute(:submitted_at,Time.now)}
  state :approved, :enter => Proc.new {|r| r.events.create(:status => 'approved') }
  state :ordered, :enter => Proc.new {|r| r.requisition_lines.each(&:update_need_by_date!)
                                          OrderHeader.create_from_req(r)
                                          r.events.create(:status => 'ordered') }
  state :partially_received
  state :received, :enter => Proc.new {|r| r.events.create(:status => 'received') }
  
  event :replace_cart do
    transitions :to => :cart, :from => :draft, :guard => Proc.new { |r| 
        old_cart = RequisitionHeader.find_by_requested_by(User.current_user.id, :conditions => 'status = \'cart\'', :order => 'created_at DESC')
        old_cart.save_as_draft! unless old_cart.nil?
        true
      }
  end
  
  event :save_as_draft do
    transitions :to => :draft, :from => :cart
  end
  
  event :submit_for_approval do
    transitions :to => :pending_approval, :from => [:draft,:cart], :guard => Proc.new { |r| r.approvable? }
    transitions :to => :pending_buyer_action, :from => [:draft,:cart]
  end
  
  event :return_to_requester do
    transitions :to => :draft, :from => :pending_buyer_action #TODO: Notify the requester
  end
  
  event :approve do
    transitions :to => :ordered, :from => :pending_approval
  end
  
  event :reject do
    transitions :to => :draft, :from => :pending_approval
  end
  
  event :withdraw do
    transitions :to => :draft, :from => [:pending_approval,:pending_buyer_action,:approved], :guard => Proc.new { |r| 
      cur_approval = r.approval
      while (cur_approval.approved?) && cur_approval.children.first
        cur_approval = cur_approval.children.first
      end
      if !cur_approval.approved?
        n = Notification.find(:first,:conditions => ['notifier_type = ? and notifier_id = ?','Approval',cur_approval.id])
        n.destroy if n
      end}
  end
    
  event :place_order do
    transitions :to => :ordered, :from => :approved
  end
  
  event :receive do
    transitions :to => :received, :from => [:ordered, :partially_received], :guard => Proc.new{|r| r.fully_received?}
    transitions :to => :partially_received, :from => [:ordered, :partially_received]
  end
  
  attr_protected :status
  
  validates_presence_of :status
  validates_presence_of :requested_by, :ship_to_address, :account, :if => Proc.new{|requisition_header| requisition_header.status && (requisition_header.status != 'draft') && (requisition_header.status != 'cart') && (requisition_header.status != 'pending_buyer_action')}
  validates_associated :requisition_lines, :message => nil
  validates_presence_of :requisition_lines, :on => :update
  
  def authorize(user)
#    true if (user.admin? || requested_by == user || approval.contains_user(user))
    (user == self.requested_by) || user.authorized?('buying','req_detail') || approvers.index(user)
  end
  
  def approvers
    app = []
    if cur_app = self.approval
      while cur_app.children.first
        app << cur_app.user
        cur_app = cur_app.children.first
      end
      app << cur_app.user
    end
    app
  end
  
  def total(in_currency = nil)
    in_currency ||= User.current_user.default_currency unless User.current_user.nil?
    sub_total = Money.new(0, in_currency)
    requisition_lines.each {|rl| sub_total += rl.total}
    sub_total.convert_to(in_currency)
  end
  
  def approvable?
    # the req is approvable if all of its lines are
    account && ship_to_address && !requisition_lines.empty? && requisition_lines.inject(true) { |res,line| res && line.approvable? }
  end
  
  def ship_to_attention
    self.ship_to_address.attention.blank? ? self.requested_by.fullname : self.ship_to_address.attention
  end

  def fully_received?
    requisition_lines.find(:all).all?(&:fully_received?)
  end
  
  def editable?
    [:draft,:cart,:pending_buyer_action].index(self.current_state)
  end
  
  def current_approval
    ca = self.approval
    while ca && ca.status != 'pending_approval' && ca.children && ca.children.first
      ca = ca.children.first
    end
    if ca.status == 'pending_approval'
      ca
    else
      nil
    end
  end
  

  def compact!
    self.requisition_lines.each do |line|
      if line.description.nil? || line.description.blank?
        line.destroy
      end
    end
  end
end
