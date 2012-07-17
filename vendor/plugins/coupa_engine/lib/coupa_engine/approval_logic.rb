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

module ApprovalLogic
  def generate_approval_list
    unless self.approval.nil?
      self.approval.destroy
      self.approval = nil
    end
    
    approvers = []
    under_limits = false
    cur_approval = nil
    error_cond = false

    #check whether we can just approve this first
    if Setup.find_or_create_by_key('allow_self_approval').value
      if requested_by.approval_limit && 
         requested_by.approval_limit.amount && 
         requested_by.approval_limit.currency && 
         requested_by.approval_limit.amount >= total(requested_by.approval_limit.currency)
        create_approval(:user => requested_by, :approvable => self)
        cur_approval = self.approval
        under_limits = true
      end
    end

    #detect the no-immediate-manager, no-approval-limit, or loopback conditions upfront

    if !under_limits
      error_cond = error_cond || requested_by.parent.nil? || requested_by.parent.id == requested_by.id
    end

    cur_approval = self.approval
    cur_approver = requested_by.parent
    approvers = []

    while !error_cond && !under_limits && cur_approver
      if cur_approval
        cur_approval = cur_approval.children.create(:user => cur_approver, :status => 'pending_approval', :approvable => self)
      else
        cur_approval = create_approval(:user => cur_approver, :status => 'pending_approval', :approvable => self)
      end
      if cur_approver.approval_limit && cur_approver.approval_limit.amount && cur_approver.approval_limit.currency && cur_approver.approval_limit.amount >= total(cur_approver.approval_limit.currency)
        under_limits = true
      end
      approvers << cur_approver.id
      cur_approver = cur_approver.parent
      #check for loops in the hierarchy
      if !under_limits && cur_approver && approvers.index(cur_approver.id)
        error_cond = true
      end
    end


    #route to the ultimate approver if there was an error
    if error_cond || !under_limits
      ua = Setup.find_by_key('ultimate approver')
      ultimate_approver = nil
      ultimate_approver = User.find(ua.value.to_i) unless ua.nil? || ua.value.empty?
      if ultimate_approver
        if cur_approval
          cur_approval.children.create(:user => ultimate_approver, :status => 'pending_approval', :approvable => self)
        else
          create_approval(:user => ultimate_approver , :status => 'pending_approval', :approvable => self)
        end
        return true
      else
        logger.debug("Approval:#{approval}")
        unless self.approval.nil?
          logger.debug("Destroying approval chain...")
          self.approval.destroy()
          self.approval = nil
        end
        return false
      end
    else
      return true
    end
  end
end