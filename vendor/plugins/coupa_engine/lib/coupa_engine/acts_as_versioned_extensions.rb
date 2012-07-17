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

class ActiveRecord::Base
  def self.versioned?
    false
  end
end

module ActiveRecord::Acts::Versioned
  module VersionProxy
    def version_target
      send(self.class.parent.to_s.demodulize.underscore.to_sym)
    end
    
    def respond_to?(symbol, include_private = false)
      super || version_target.respond_to?(symbol)
    end
    
    def method_missing(method_symbol, *parameters)
      target = self.version_target
      target.respond_to?(method_symbol) ? target.revert_to(self) && target.send(method_symbol, *parameters) : super
    end
    
    def is_a?(other)
      super || version_target.is_a?(other)
    end
    alias_method :kind_of?, :is_a?
  end
  
  module ClassMethods
    alias_method :coupa_acts_as_versioned, :acts_as_versioned
    
    # hijack the :if_changed option because the standard acts_as_versioned redefines the #{attribute}= accessor
    # which is not friendly to associations and aggregations
    def acts_as_versioned(options = {}, &extension)
      # don't allow multiple calls
      return if self.included_modules.include?(ActiveRecord::Acts::Versioned::ActMethods)

      cattr_accessor :tracked_attributes
      self.tracked_attributes = options.delete(:if_changed)
      
      coupa_acts_as_versioned(options, &extension)
      
      versioned_class.send :include, ActiveRecord::Acts::Versioned::VersionProxy
      
      unless self.tracked_attributes.nil?
        class_eval do
          self.track_changed_attributes = true
          self.tracked_attributes = [self.tracked_attributes].flatten.collect(&:to_sym)
        end
      end
      
    end
  end
  
  module ActMethods
    # If called with no parameters, gets whether the current model has changed and needs to be versioned.
    # If called with a single parameter, gets whether the parameter has changed.
    # Extended to use the tracked_attributes array
    def changed?(attr_name = nil)
      return true if attr_name.nil? && !self.class.track_changed_attributes
      original = self.class.find(self.id)
      (attr_name.nil? ? versioned_attributes : tracked_attributes).any? { |a| self[a] != original[a] }
    end
    
    # keep old dirty? method
    alias_method :dirty?, :changed?
    
    # Clones a model.  Used when saving a new version or reverting a model's version.
    # Extended to use []= writer to directly write foreign keys to the new model
    # and to clear the association cache after copying the attributes.
    def clone_versioned_model(orig_model, new_model)
      self.versioned_attributes.each do |key|
        new_model[key] = orig_model[key] if orig_model.has_attribute?(key)
      end

      if orig_model.is_a?(self.class.versioned_class)
        new_model[new_model.class.inheritance_column] = orig_model[self.class.versioned_inheritance_column]
      elsif new_model.is_a?(self.class.versioned_class)
        new_model[self.class.versioned_inheritance_column] = orig_model[orig_model.class.inheritance_column]
      end
      
      new_model.clear_association_cache
    end
    
    private
    # disable callbacks if versioned table does not exist
    CALLBACKS.each do |attr_name| 
      alias_method "safe_#{attr_name}".to_sym, attr_name
      define_method(attr_name) do
        return unless self.connection.tables.include?(self.versioned_table_name)
        send "safe_#{attr_name}"
      end
      protected attr_name if protected_method_defined?("safe_#{attr_name}".to_sym)
      private attr_name if private_method_defined?("safe_#{attr_name}".to_sym)
      alias_method "orig_#{attr_name}".to_sym, attr_name
    end
    
    module ClassMethods      
      def versioned?
        true
      end
    end
  end
end
