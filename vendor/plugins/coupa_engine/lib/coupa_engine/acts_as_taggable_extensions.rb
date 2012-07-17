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

class Tagging
  def self.reloadable?; false end
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
end

class Tag
  def self.reloadable?; false end
  alias :orig_on :on
  
  def on(taggable, is_private = false)
    create = true
    if (is_private)
      if taggable.taggings.find_by_tag_id_and_is_private_and_created_by(self.id, true, User.current_user_id)
        create = false
      end
    elsif (taggable.taggings.find_by_tag_id(self.id))
      create = false
    end
    taggings.create :taggable => taggable, :is_private => is_private if create
  end
end
  
module ActiveRecord
  module Acts
    module Taggable
      module ClassMethods
        alias :orig_acts_as_taggable :acts_as_taggable
        
        def acts_as_taggable(options = {})
          write_inheritable_attribute(:acts_as_taggable_options, {
            :taggable_type => ActiveRecord::Base.send(:class_name_of_active_record_descendant, self).to_s,
            :from => options[:from]
          })
          
          class_inheritable_reader :acts_as_taggable_options

          has_many :taggings, :as => :taggable, :conditions => ["taggings.is_private = ? OR taggings.created_by = ?", false, User.current_user_id]
          has_many :private_taggings, :as => :taggable, :conditions => ["taggings.is_private = ? AND taggings.created_by = ?", true, User.current_user_id]
          has_many :all_taggings, :as => :taggable, :class_name => 'Tagging', :dependent => :destroy
          
          has_many :tags, :through => :taggings
          has_many :private_tags, :through => :private_taggings
          has_many :all_tags, :through => :all_taggings
          
          after_create :assign_deferred_tags

          include ActiveRecord::Acts::Taggable::InstanceMethods
          extend ActiveRecord::Acts::Taggable::SingletonMethods          
        end
        
      end
      module SingletonMethods
        def tags_count(options = {})
          conditions = options[:conditions] || []
          if conditions.blank?
            conditions << "tags.id = taggings.tag_id AND (taggings.is_private = ? OR taggings.created_by = ?)"
          else
            conditions[0] += " AND tags.id = taggings.tag_id AND (taggings.is_private = ? OR taggings.created_by = ?)"
          end
          conditions << false << User.current_user_id
          
          sql = ["SELECT tags.name AS name, count(tags.name) AS c"]
          sql << " FROM tags, taggings "
          add_joins!(sql, options)
          add_conditions!(sql, conditions)
          sql << " GROUP BY tags.name"
          sql << " ORDER BY tags.name"
          if !options[:limit].blank?
            add_limit!(sql,options[:limit])
          end
          sql = sql.join  " "
          result = connection.select_all(sql)
          count = result.inject({}) { |hsh, row| hsh[row['name']] = row['c'].to_i; hsh } unless options[:raw]
          count || result
        end
        
        def find_tagged_with(list)
          find_by_sql([
            "SELECT #{table_name}.* FROM #{table_name}, tags, taggings " +
            "WHERE #{table_name}.#{primary_key} = taggings.taggable_id " +
            "AND taggings.taggable_type = ? " +
            "AND taggings.tag_id = tags.id AND tags.name IN (?) " +
            "AND (taggings.is_private = ? OR taggings.created_by = ?)",
            acts_as_taggable_options[:taggable_type], list, false, User.current_user_id
          ])
        end
      end
      
      module InstanceMethods
        def assign_deferred_tags
          @deferred_tag_assignment.call unless @deferred_tag_assignment.nil?
        end
        
        alias :orig_tag_with :tag_with
        def tag_with(list, is_private=false)
          Tag.transaction do
            Tag.parse(list).each do |name|
              #get rid of illegal characters that'll screw up ferret searches
              name.gsub!(/\!/,'')
              if acts_as_taggable_options[:from]
                send(acts_as_taggable_options[:from]).tags.find_or_create_by_name(name).on(self,is_private)
              else
                Tag.find_or_create_by_name(name).on(self,is_private)
              end
            end
          end
        end
        
        def tag_list=(list, is_private=false)
          if new_record?
            @deferred_tag_assignment = Proc.new { self.method(:tag_list=).call(list, is_private) }
          else
            taggings.destroy_all
            tag_with(list, is_private)
          end
        end
        
        alias :orig_tag_list :tag_list
        # changing the original single quotes to double, so that we can resubmit a text field filled
        # via tag_list and not corrupt the taggings
        def tag_list
          tags.collect { |tag| tag.name.include?(" ") ? "\"#{tag.name}\"" : tag.name }.join(" ")
        end
      end
    end
  end
end

