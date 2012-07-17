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

class AskQuestion < ActiveRecord::Base
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  
  belongs_to :category, :class_name => 'AskCategory'
  has_many :answers, :class_name => 'AskAnswer', :dependent => :destroy, :order => 'created_at'
  
  acts_as_ferret :fields => [:text], :remote => true
  acts_as_taggable
  
  validates_presence_of :text, :ask_category_id
  validates_uniqueness_of :text
  
  def self.questions
    AskQuestion.find(:all)
  end
  
  def self.open_questions
    AskQuestion.find_all_by_status 'Open'
  end
  
  def self.closed_questions
    AskQuestion.find_all_by_status 'Closed'
  end
  
  def self.questions_asked
    AskQuestion.find_all_by_created_by(User.current_user.id, :order => "created_at DESC")
  end
  
  def self.questions_answered
    AskAnswer.find_all_by_created_by(User.current_user.id, :order => "created_at DESC").collect { |a| a.question }.uniq - AskQuestion.questions_asked
  end
  
  def eligible_to_answer?(user=User.current_user)
    if category.private? || closed?
      created_by == user || category.moderator_users.include?(user)
    else
      !closed?
    end
  end
  
  def eligible_to_close?(user=User.current_user)
    !closed? && (created_by == user || category.moderator_users.include?(user))
  end
  
  def eligible_to_delete?(user=User.current_user)
    category.moderator_users.include?(user)
  end
  
  def notify_subscribers(controller)
    category.email_subscriptions.each { |subscription| AskMailer.deliver_new_question(controller, self, subscription) }
  end
  
  def closed?
    status == 'Closed'
  end
end
