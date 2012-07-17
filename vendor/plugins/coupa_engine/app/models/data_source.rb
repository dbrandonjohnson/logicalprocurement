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

class DataSource < ActiveRecord::Base
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  belongs_to :owner, :polymorphic => true
  attr_protected :status
  validates_presence_of :source_for
  acts_as_state_machine :column => :status, :initial => :pending
  state :pending
  state :loading
  state :done
  
  event :load do
    transitions :to => :loading, :from => :pending
  end
  
  event :finish do
    transitions :to => :done, :from => :loading
  end
  
  def worker!
    MiddleMan.get_worker(job_key)
  end
  
  def worker
    begin
      return worker!
    rescue
      return false
    end
  end
end
