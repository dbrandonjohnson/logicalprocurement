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

class AskAnswer < ActiveRecord::Base
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  
  belongs_to :question, :class_name => 'AskQuestion'
  
  acts_as_ferret :fields => [:text, :question_text], :remote => true
  validates_presence_of :text
  
  def question_text
    self.question.text
  end
  
  def notify_subscribers(controller)
    AskMailer.deliver_new_answer_to_creator(controller, self)
    # Don't send duplicate emails to question creator
    subscriptions = question.category.email_subscriptions.reject{|s| s.subscriber == self.question.created_by }
    subscriptions.each { |subscription| AskMailer.deliver_new_answer(controller, self, subscription) }
  end
end
