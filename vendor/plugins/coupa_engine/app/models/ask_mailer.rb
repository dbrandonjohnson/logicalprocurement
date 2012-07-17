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

class AskMailer < ActionMailer::Base
  @@from_address = "Coupa Subscriptions <subscriptions@#{smtp_settings[:domain]}>"
  
  def receive(email)
    if /^\s*subscribe (?:(\S*) )?to \s*(.*)\s*$/i.match(email.subject)
      subscription = AskSubscription.new
      
      # if the user does not exist we generate a dummy with the from email address
      actor = User.find_by_email(email.from.first) || User.new({ :email => email.from.first, :lastname => email.from.first })

      catch :done do        
        if actor.new_record?
          subscription.subscriber = actor
          subscription.errors.add_to_base "You have not registered in our system yet"
          throw :done
        end
        
        unless subscriber = ($1 ? User.find_by_email($1) : actor)
          subscription.errors.add :subscriber_id, ActiveRecord::Errors.default_error_messages[:invalid]
          throw :done
        end

        unless category = AskCategory.find_by_name($2)
          subscription.errors.add :ask_category_id, ActiveRecord::Errors.default_error_messages[:invalid]
          throw :done
        end

        subscription.created_by = subscription.updated_by = actor
        subscription.category = category
        subscription.subscriber = subscriber
        subscription.email_answers = true
        subscription.email_questions = true
      end
      
      if subscription.errors.empty? and subscription.save
        AskMailer.deliver_subscribed(subscription, actor)
      else
        AskMailer.deliver_subscription_denied(subscription, actor)
      end
    end
  end

  def subscribed(subscription, actor = User.current_user)
    @subject    = 'Ask an Expert subscription request'
    @body       = { :subscription => subscription, :actor => actor }
    @recipients = "#{subscription.subscriber.fullname} <#{subscription.subscriber.email}>"
    @from       = @@from_address
    @sent_on    = Time.now
    @headers    = {}
    @content_type = 'text/html'
  end

  def unsubscribed(subscription, actor = User.current_user)
    @subject    = 'Ask an Expert unsubscription request'
    @body       = { :subscription => subscription, :actor => actor }
    @recipients = "#{subscription.subscriber.fullname} <#{subscription.subscriber.email}>"
    @from       = @@from_address
    @sent_on    = Time.now
    @headers    = {}
    @content_type = 'text/html'
  end
  
  def subscription_denied(subscription, actor = User.current_user)
    @subject    = 'Ask an Expert subscription request denied'
    @body       = { :subscription => subscription, :actor => actor }
    @recipients = "#{subscription.subscriber.fullname} <#{subscription.subscriber.email}>"
    @from       = @@from_address
    @sent_on    = Time.now
    @headers    = {}
    @content_type = 'text/html'
  end
  
  def new_question(controller, question, subscription)
    @subject    = 'Ask an Expert question asked'
    @body       = { :controller => controller, :question => question, :subscription => subscription }
    @recipients = "#{subscription.subscriber.fullname} <#{subscription.subscriber.email}>"
    @from       = @@from_address
    @sent_on    = Time.now
    @headers    = {}
    @content_type = 'text/html'
  end  

  def new_answer(controller, answer, subscription)
    @subject    = 'Ask an Expert question answered'
    @body       = { :controller => controller, :answer => answer, :subscription => subscription }
    @recipients = "#{subscription.subscriber.fullname} <#{subscription.subscriber.email}>"
    @from       = @@from_address
    @sent_on    = Time.now
    @headers    = {}
    @content_type = 'text/html'
  end
  def new_answer_to_creator(controller, answer)
    @subject      = 'Your Ask an Expert question answered'
    @body         = { :controller => controller, :answer => answer}
    @recipients   = "#{answer.question.created_by.fullname} <#{answer.question.created_by.email}>"
    @from         = @@from_address
    @sent_on      = Time.now
    @headers      = {}
    @content_type = 'text/html'
  end
end
