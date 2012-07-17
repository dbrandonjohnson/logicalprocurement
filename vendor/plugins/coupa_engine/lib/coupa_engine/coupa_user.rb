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

module CoupaEngine
  module CoupaUser
    def self.included(base)
      base.extend(ClassMethods)
      base.class_eval do
        has_many :address_assignments, :as => :addressable
        has_many :addresses, :through => :address_assignments
        has_many :subscriptions, :class_name => 'AskSubscription', :foreign_key => 'subscriber_id'
        has_many :subscribed_ask_categories, :through => :subscriptions, :source => :category

        belongs_to :default_address, :class_name => 'Address', :foreign_key => 'default_address_id'
        belongs_to :default_account, :class_name => 'Account', :foreign_key => 'default_account_id'
        belongs_to :approval_limit
        belongs_to :default_currency, :class_name => 'Currency', :foreign_key => 'default_currency_id'
        acts_as_tree :foreign_key => "manager_id"

        belongs_to :pcard

        validates_presence_of :firstname, :lastname, :email
        validates_length_of :phone_work, :maximum => 20, :allow_nil => true
        validates_length_of :phone_mobile, :maximum => 20, :allow_nil => true
        validates_format_of :email, :with => /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i

        acts_as_ferret :fields => [:lastname, :firstname], :remote => true
        acts_as_state_machine :column => :status, :initial => :active

        state :active
        # Processes that occur on disabling a user
        state :inactive, :enter => Proc.new { |u| 
          # Move all migrations to next/ultimate approver
          u.migrate_approvals 
                    
          # Remove as manager
          users = User.find_all_by_manager_id(u.id)
          users.each { |u|
            u.update_attribute(:manager_id,nil)
          } unless users.nil?
        }

        event :disable do
          transitions :to => :inactive, :from => :active
        end

        event :enable do
          transitions :to => :active, :from => :inactive
        end

        # prevent cycles in approval chain
        validates_each :manager_id do |r,a,v|
          r.errors.add a, "will result in a cyclic approval chain" if r.ancestors.include?(r)
        end

        # added for the UserStamp module, threadsafe so we can use it with BackgroundRb
        def self.current_user
          Thread.current[:user]
        end

        def self.current_user=(newUser)
          Thread.current[:user] = newUser
        end

        # Migrate all pending approvals from this user to next
        def migrate_approvals
          approvals = Approval.find(:all, :conditions => ["user_id = ? AND status = ?", self.id, "pending_approval"])
          unless approvals.nil?
            approvals.each { |a| 
              if a.children.first.nil?
                ultimate_approver = User.find_by_id(Setup.lookup('ultimate approver'))
                if ultimate_approver
                  a.children.create(:user => ultimate_approver, :status => 'pending_approval', :approvable => a.approvable) 
                end
              end
              # Don't automatically approve unless we have another approver in the chain
              unless a.children.first.nil?
                a.approve! 
              else
                a.destroy
              end
            }
          end
        end

        # force the security token to expire
        def expire_security_token
          write_attribute('token_expiry', Time.now)
          update_without_callbacks
        end
        
        def fullname
          "#{self.firstname} #{self.lastname}"
        end

        def fullname_for_collect
          "#{self.firstname} #{self.lastname} (#{self.login})"
        end
        
        def default_account_editable?
          true
        end
      end
    end
    
    module ClassMethods
      # Return 0 if not logged in
      def current_user_id
        current_user ? current_user.id : 0
      end

      def authenticate(login, password)
        u = find_by_login_and_verified_and_deleted_and_status(login, true, false,'active')
        return nil if u.nil? 

        # Authenticate against Active Directory if available
        if Object.const_defined?("ActiveDirectory")
          begin
            ad_user = ActiveDirectory::User.find(login)
          rescue
            ad_user = nil
          end

          # Fall through to local authentication if the user is not found in ActiveDirectory
          unless ad_user.nil?
            begin
              return ad_user.authenticate(password) ? u : nil
            rescue ActiveDirectory::PasswordInvalid
              return nil
            rescue
              logger.error("CoupaEngine::CoupaUser::ClassMethods::authenticate: Error authenticating against ActiveDirectory:")
              logger.error($!)
              return nil
            end
          end
        end

        return u if u.salted_password == LoginEngine::AuthenticatedUser.salted_password(u.salt, LoginEngine::AuthenticatedUser.hashed(password))
      end
    end
  end
end
