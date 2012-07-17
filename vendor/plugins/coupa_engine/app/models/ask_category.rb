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

class AskCategory < ActiveRecord::Base
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  
  has_many :questions, :class_name => 'AskQuestion', :dependent => :destroy, :order => 'created_at DESC'
  has_many :open_questions, :class_name => 'AskQuestion', :dependent => :destroy, :conditions => "status = 'Open'", :order => 'created_at DESC'
  has_many :closed_questions, :class_name => 'AskQuestion', :dependent => :destroy, :conditions => "status = 'Closed'", :order => 'created_at DESC'
  has_many :subscriptions, :class_name => 'AskSubscription', :dependent => :destroy
  has_many :subscribers, :through => :subscriptions
  has_many :email_subscriptions, :class_name => 'AskSubscription', :conditions => "email_notifications = 1"
  has_many :moderators, :class_name => 'AskModerator' , :dependent => :destroy, :after_add => :add_moderator_subscription
  has_many :moderator_users, :through => :moderators
  
  validates_presence_of :name
  validates_uniqueness_of :name
  
  def questions_asked
    AskQuestion.questions_asked.find_all { |q| q.category == self }
  end
  
  def questions_answered
    AskQuestion.questions_answered.find_all { |q| q.category == self }
  end
  
  def add_moderator_subscription(moderator)

    subscription = AskSubscription.find_by_ask_category_id_and_subscriber_id(self.id, moderator.user_id)

    if subscription.nil?
      subscription = AskSubscription.new(:ask_category_id => self.id, :subscriber => moderator.user) 
    end
    
    subscription.update_attribute(:email_notifications, true)

    subscription.save
  
  end
end
