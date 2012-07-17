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

class Approval < ActiveRecord::Base
  include Attachable
  belongs_to :user
  belongs_to :approvable, :polymorphic => true
  acts_as_tree

  after_create :generate_approval_key

  #validates_presence_of :note, :if => 'parent_id is null' # There should be an initial justification
  acts_as_state_machine :column => :status, :initial => :pending_approval

  state :pending_approval, :exit => Proc.new { |a|
    if (a.current_state == :approved) # Exit's happen after the state changes, entry happens before.
      a.approval_date = Time.now
      if a.children.first
        ApprovalNotify.deliver_next_approver(nil, a.approvable, a.children.first)
      else
        a.approvable.approve!
      end
      Notification.destroy_all(['user_id = ? AND notifier_type = \'Approval\' AND notifier_id = ?',User.current_user.id,a.id])
    end
  }
  
  state :approved
  state :rejected, :enter => Proc.new { |a| Notification.destroy_all(['user_id = ? AND notifier_type = \'Approval\' AND notifier_id = ?',User.current_user.id,a.id])}
  state :cancelled, :enter => Proc.new { |a| Notification.destroy_all(['notifier_type = \'Approval\' AND notifier_id = ?',a.id])}
  
  event :approve do
    transitions :to => :approved, :from => :pending_approval
  end
  
  event :reject do
    transitions :to => :rejected, :from => :pending_approval
  end
  
  event :cancel do
    transitions :to => :cancelled, :from => [:approved,:rejected]
  end

  def status_icon
    case status
      when 'pending_approval'
        'time.png'
      when 'approved'
        'accept.png'
      when 'rejected'
        'delete.png'
    end
  end
  
  def contains_user(user)
    self.user == user ? true :
      self.children.first ? self.children.first.contains_user(user) :
      false    
  end

  protected 
  def generate_approval_key
    self.update_attribute(:approval_key,Digest::SHA1.hexdigest("#{self.user.fullname}#{Time.now}#{self.id}")[0..99])
  end
end
