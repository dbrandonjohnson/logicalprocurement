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

module RailsStudio::Acts::StateMachine
  module InstanceMethods
    # Returns the current state the object is in, as a Ruby symbol.
    def current_state
      state = self.send(self.class.state_column)
      self.new_record? ? (state || self.initial_state).to_sym : state.to_sym
    end
    
    alias_method :orig_run_transition_action, :run_transition_action
    # spurious security error bugfix - http://www.railsweenie.com/forums/1/topics/659
    def run_transition_action(action)
      Symbol === action ? self.send(action) : action.call(self)
    end
    
  end
  
  module ClassMethods
    alias_method :coupa_event, :event
    def event(event, &block)
      coupa_event(event, &block)
      class_eval do
        define_method("#{event.to_s}!") do
          next_states = next_states_for_event(event.to_sym)
          next_states.any? do |ns|
            success = false
            if ns.guard(self)
              loopback = current_state == ns.to
              exitact  = self.class.read_inheritable_attribute(:states)[current_state][:exit]
              enteract = self.class.read_inheritable_attribute(:states)[ns.to][:enter]

              run_transition_action(enteract) if enteract && !loopback

              self.update_attribute(self.class.state_column, ns.to.to_s)

              run_transition_action(exitact) if exitact && !loopback
              
              success = true
            end
            success
          end
        end
      end
    end
  end
end