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

class IncompatiblePluginError < StandardError
end

module ActiveRecord::Acts::VersionedSet
  def self.included(base) # :nodoc:
    base.extend ClassMethods
  end
  
  module ClassMethods
    def acts_as_versioned_set(options = {}, &extension)
      return if self.included_modules.include?(ActiveRecord::Acts::VersionedSet::ActMethods)
      raise ArgumentError.new("acts_as_versioned_set requires an :include option") if options[:include].nil?      
      raise IncompatiblePluginError.new("acts_as_versioned_set cannot be used with acts_as_versioned") if
        self.included_modules.include?(ActiveRecord::Acts::Versioned::ActMethods)
      
      (options[:association_options] ||= {}).update(:dependent => :nullify)
      
      acts_as_versioned options, &extension
      
      cattr_accessor :aavs_disabled, :aavs_included_reflections
      self.aavs_included_reflections = [options.delete(:include)].flatten.collect { |a| reflect_on_association(a.to_sym) }
      
      send :include, ActiveRecord::Acts::VersionedSet::ActMethods
      
      class_eval do
        after_save :sync_versioned_set
        after_destroy :sync_remaining_versioned_set
      end
      
      clone_reflections
    end
    
    protected
    def clone_reflections
      aavs_included_reflection_names = self.aavs_included_reflections.collect(&:name)
      reflections.reject { |k, v| k == :versions }.each_value do |reflection|
        aavs_included_reflection_names.include?(reflection.name) ? clone_included_reflection(reflection) : clone_excluded_reflection(reflection)
      end
    end
    
    def clone_included_reflection(reflection)
      case reflection.macro
      when :belongs_to
        versioned_class.class_eval do
          belongs_to reflection.name,
            :class_name => "::#{reflection.klass.versioned_class.name}",
            :foreign_key => reflection.klass.versioned_class.name.gsub('::', '').foreign_key
        end
      when :has_one, :has_many
        versioned_class.class_eval do
          send reflection.macro, reflection.name,
            :class_name => "::#{reflection.klass.versioned_class.name}",
            :foreign_key => reflection.active_record.versioned_class.name.gsub('::', '').foreign_key
        end
      else
        raise ArgumentError.new("acts_as_versioned currently only supports :belongs_to, :has_one and :has_many associations for the :include option")
      end
    end
    
    def clone_excluded_reflection(reflection)
      reflection.options.reverse_merge!(:foreign_key => self.name.foreign_key) if [:has_one, :has_many].include?(reflection.macro)
      reflection.options[:class_name].insert(0, '::') if reflection.options.has_key?(:class_name) && !reflection.options[:class_name].starts_with?('::')
      versioned_class.class_eval do            
        send reflection.macro, reflection.name, reflection.options
      end
    end
  end
  
  module ActMethods
    def self.included(base) # :nodoc:
      base.extend ClassMethods
    end

    def without_set_revision(&block)
      self.class.without_set_revision(&block)
    end
        
    def save_without_set_revision
      save_without_set_revision!
      true
    rescue
      false
    end
    
    def save_without_set_revision!
      without_locking do
        without_revision do
          without_set_revision do
            save!
          end
        end
      end
    end
    
    def versioned_set_transaction(&block)
      result = without_set_revision do
        block.call
      end
      sync_versioned_set
      result
    end
    
    def versioned_set(set = [])
      return [] if set.include?(self)
      set << self
      aavs_included_parents.collect { |p| p.versioned_set(set) }.flatten + [self] +
        aavs_included_children.collect { |c| c.versioned_set(set) }.flatten
    end
    
    # Updates the set after a member has been destroyed
    def sync_remaining_versioned_set
      return if self.aavs_disabled || !self.connection.tables.include?(self.class.versioned_table_name)
      (aavs_included_parents.first || aavs_included_children.first).sync_versioned_set
    end
    
    # Updates the set after a member has been saved
    def sync_versioned_set
      return if self.aavs_disabled || !self.connection.tables.include?(self.class.versioned_table_name)
      clear_association_cache
      without_set_revision do
        versioned_set.each do |member|
          # ensure every member has at least one version and is newer than its children
          member.save! if member.versions.empty? || member.aavs_included_child_reflections.any? do |r|
            recent_children = member.versions.last.send(r.name)
            !recent_children.empty? && recent_children.to_set != member.send(r.name).collect { |c| c.versions.last }.to_set
          end
          
          # ensure every member is aware of the latest versions of its parents
          member.aavs_included_parent_reflections.each do |r|
            latest = member.versions(true).last
            parent = member.send(r.name, true)
            
            latest.update_attribute(r.name, parent.versions.last) unless latest.send(r.name)
            
            unless latest.send(r.name) == parent.versions.last
              member.save
              member.versions(true).last.update_attribute(r.name, parent.versions.last)
            end            
          end
        end
      end
    end
    
    protected
    def aavs_included_parent_reflections
      self.aavs_included_reflections.select { |r| r.macro == :belongs_to }
    end
    
    def aavs_included_parents
      aavs_included_parent_reflections.collect { |r| send r.name }
    end
    
    def aavs_included_child_reflections
      self.aavs_included_reflections.select { |r| [:has_one, :has_many].include? r.macro }
    end
    
    def aavs_included_children
      aavs_included_child_reflections.collect { |r| send r.name }.flatten
    end
    
    module ClassMethods
      # Rake migration task to create the versioned table using options passed to acts_as_versioned
      # Extended from acts_as_versioned to create foreign keys in the versioned table
      def create_versioned_table(create_table_options = {})
        # create version column in main table if it does not exist
        if !self.content_columns.find { |c| %w(version lock_version).include? c.name }
          self.connection.add_column table_name, :version, :integer
        end
        
        self.connection.create_table(versioned_table_name, create_table_options) do |t|
          t.column versioned_foreign_key, :integer
          t.column :version, :integer
        end
        
        updated_col = nil
        self.versioned_columns.each do |col| 
          updated_col = col if !updated_col && %(updated_at updated_on).include?(col.name)
          self.connection.add_column versioned_table_name, col.name, col.type, 
            :limit => col.limit, 
            :default => col.default
        end
    
        if type_col = self.columns_hash[inheritance_column]
          self.connection.add_column versioned_table_name, versioned_inheritance_column, type_col.type, 
            :limit => type_col.limit, 
            :default => type_col.default
        end

        if updated_col.nil?
          self.connection.add_column versioned_table_name, :updated_at, :timestamp
        end
        
        aavs_included_reflections.each do |reflection|
          if reflection.macro == :belongs_to
            self.connection.add_column versioned_table_name, reflection.klass.versioned_class.name.sub('::', '').foreign_key, :integer
          end
        end
      end
      
      def versioned_set_classes(set = [])
        return [] if set.include?(self)
        set << self
        aavs_included_parent_classes.each { |p| p.versioned_set_classes(set) } + [self] +
          aavs_included_child_classes.each { |c| c.versioned_set_classes(set) }
      end

      def without_set_revision(&block)
        already_disabled = self.aavs_disabled
        self.versioned_set_classes.each { |klass| klass.aavs_disabled = true }
        result = block.call
        self.versioned_set_classes.each { |klass| klass.aavs_disabled = already_disabled }
        result
      end
      
      protected
      def aavs_included_parent_classes
        aavs_included_reflections.select { |r| r.macro == :belongs_to }.collect { |r| r.klass }
      end
      
      def aavs_included_child_classes
        aavs_included_reflections.select { |r| [:has_one, :has_many].include? r.macro }.collect { |r| r.klass }
      end
    end
  end
end

ActiveRecord::Base.send :include, ActiveRecord::Acts::VersionedSet