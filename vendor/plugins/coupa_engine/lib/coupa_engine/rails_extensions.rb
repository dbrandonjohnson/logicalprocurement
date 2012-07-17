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

# Based on action_mailer_layouts plugin from
# http://blog.cardboardrocket.com/archives/2007/1/14/the_action_mailer_layouts_plugin/
# Modified to remove the funny method name logic that confuses us
# when we try to use it in the manner we do (ie. calling render_message vs.
# having it called automatically)

module ActionMailer
  class Base
    # Specify the layout name
    adv_attr_accessor :layout

    def render_message(method_name, body)
      layout = @layout.to_s << ".rhtml"
      if File.exists?(File.join(layouts_path, layout))
        body[:content_for_layout] = render(:file => method_name, :body => body)
        ActionView::Base.new(layouts_path, body, self).render(:file => layout)
      else
        render :file => method_name, :body => body
      end
    end

    def layouts_path
      File.join(template_root, 'layouts')
    end
  end
end

module ActionView::Helpers
  module AssetTagHelper
    def image_tag_with_coupa_additions(source, options = {})
      options.stringify_keys!
      process_image_options(source, options)    
      source = options.delete('src') if options.has_key?('src')
      image_tag_without_coupa_additions(source, options)
    end
    alias_method_chain :image_tag, :coupa_additions
  end
  
  module FormTagHelper
    def image_submit_tag_with_coupa_additions(source, options = {})
      options.stringify_keys!
      process_image_options(source, options)
      source = options.delete('src') if options.has_key?('src')
      source = Engines::RailsExtensions::PublicAssetHelpers.plugin_asset_path(options.delete('plugin'), "images", source) if options['plugin']
      image_submit_tag_without_coupa_additions(source, options)
    end
    alias_method_chain :image_submit_tag, :coupa_additions
  end
end


 module ActionController::Filters::ClassMethods
   # By default rails overwrites conditions.  We want them to join
   def update_conditions(filters, conditions)
     return if conditions.empty?
     if conditions[:only]
       write_inheritable_hash('included_actions', merge_condition_hashes(included_actions, condition_hash(filters, conditions[:only])))
     else
       write_inheritable_hash('excluded_actions', merge_condition_hashes(excluded_actions, condition_hash(filters, conditions[:except]))) if conditions[:except]
     end
   end

  def merge_condition_hashes(original_condition_hash, new_condition_hash)
    new_condition_hash.each_pair do |filter, actions|
      original_actions = original_condition_hash[filter] || []
      original_condition_hash[filter] = original_actions.concat(actions).uniq
    end
    return original_condition_hash
  end
end

module ActiveRecord
  module Acts
    module Tree::InstanceMethods
      def descendants
        children.collect { |child| child.descendants.push(child) }.flatten
      end
    end
    
    module List::InstanceMethods
      def compact_positions_on_all_items
        self.class.base_class.find(:all, :conditions => scope_condition, :order => position_column).each_with_index do |item, i|
          item.update_attribute(:position, i+1) unless item.position == i+1
        end
      end
    end
  end
  
  module ConnectionAdapters
    module SchemaStatements
      class PluginSchemaInfo < ActiveRecord::Base
        set_table_name 'plugin_schema_info'
      end

      class EngineSchemaInfo < ActiveRecord::Base
        set_table_name 'engine_schema_info'
      end
    
      # copy the engine_schema_info data over to the new plugin_schema_info
      def initialize_schema_information_with_coupa_additions
        initialize_schema_information_without_coupa_additions
        if EngineSchemaInfo.table_exists? && PluginSchemaInfo.table_exists?
          EngineSchemaInfo.find(:all).each do |e|
            if p = PluginSchemaInfo.find_by_plugin_name(e.engine_name)
              p.update_attribute(:version, e.version) if p.version < e.version
            else
              PluginSchemaInfo.create(:plugin_name => e.engine_name, :version => e.version)
            end
          end
        end
      end
      alias_method_chain :initialize_schema_information, :coupa_additions
    end
    
    if defined?(OracleColumn)
      class OracleColumn < Column
        private
        def simplified_type_with_float(field_type)
          return :float if field_type =~ /number/i && extract_precision(field_type).nil? && extract_scale(field_type).nil?
          simplified_type_without_float(field_type)
        end
        alias_method_chain :simplified_type, :float
      end
    end
    
    if defined?(OracleAdapter)
      class OracleAdapter < AbstractAdapter
        # overridden to fix bug with passing a string to Array.replace
        def add_limit_offset!(sql, options) #:nodoc:
          offset = options[:offset] || 0

          if limit = options[:limit]
            sql.replace(sql.class.new << "select * from (select raw_sql_.*, rownum raw_rnum_ from (#{sql}) raw_sql_ where rownum <= #{offset+limit}) where raw_rnum_ > #{offset}")
          elsif offset > 0
            sql.replace(sql.class.new << "select * from (select raw_sql_.*, rownum raw_rnum_ from (#{sql}) raw_sql_) where raw_rnum_ > #{offset}")
          end
        end
        
        # overridden to quote reserved words as well
        def quote_column_name(name) #:nodoc:
          name =~ /([A-Z]|file|number|rows)/ ? "\"#{name}\"" : name
        end
        
        # Backport of http://dev.rubyonrails.org/changeset/6090 to avoid literal empty_clob()
        # Remove when it makes it to the gem
        def quote(value, column = nil) #:nodoc:
          if value && column && [:text, :binary].include?(column.type)
            %Q{empty_#{ column.sql_type.downcase rescue 'blob' }()}
          else
            super
          end
        end
        
        # Backport of http://dev.rubyonrails.org/changeset/6090 to avoid literal empty_clob()
        # Remove when it makes it to the gem
        def columns(table_name, name = nil) #:nodoc:
          (owner, table_name) = @connection.describe(table_name)

          table_cols = <<-SQL
            select column_name as name, data_type as sql_type, data_default, nullable,
                   decode(data_type, 'NUMBER', data_precision,
                                     'FLOAT', data_precision,
                                     'VARCHAR2', data_length,
                                      null) as limit,
                   decode(data_type, 'NUMBER', data_scale, null) as scale
              from all_tab_columns
             where owner      = '#{owner}'
               and table_name = '#{table_name}'
             order by column_id
          SQL

          select_all(table_cols, name).map do |row|
            limit, scale = row['limit'], row['scale']
            if limit || scale
              row['sql_type'] << "(#{(limit || 38).to_i}" + ((scale = scale.to_i) > 0 ? ",#{scale})" : ")")
            end

            # clean up odd default spacing from Oracle
            if row['data_default']
              row['data_default'].sub!(/^(.*?)\s*$/, '\1')
              row['data_default'].sub!(/^'(.*)'$/, '\1')
              row['data_default'] = nil if row['data_default'] =~ /^(null|empty_[bc]lob\(\))$/i
            end

            OracleColumn.new(oracle_downcase(row['name']),
                             row['data_default'],
                             row['sql_type'],
                             row['nullable'] == 'Y')
          end
        end
        
        # Backport of http://dev.rubyonrails.org/changeset/6090 to avoid literal empty_clob()
        # Remove when it makes it to the gem
        def add_column_options!(sql, options) #:nodoc:
          # handle case of defaults for CLOB columns, which would otherwise get "quoted" incorrectly
          if options_include_default?(options) && (column = options[:column]) && column.type == :text
            sql << " DEFAULT #{quote(options.delete(:default))}"
          end
          super
        end
        
        private

        # Backport of http://dev.rubyonrails.org/changeset/6348 to always return a Time
        # Remove when integrated into the gem
        def select(sql, name = nil)
          cursor = execute(sql, name)
          cols = cursor.get_col_names.map { |x| oracle_downcase(x) }
          rows = []

          while row = cursor.fetch
            hash = Hash.new

            cols.each_with_index do |col, i|
              hash[col] =
                case row[i]
                when OCI8::LOB
                  name == 'Writable Large Object' ? row[i]: row[i].read
                when OraDate
                  if emulate_dates && (row[i].hour == 0 && row[i].minute == 0 && row[i].second == 0)
                    row[i].to_date
                  else
                    row[i].to_time rescue row[i].to_datetime
                  end
                else row[i]
                end unless col == 'raw_rnum_'
            end

            rows << hash
          end

          rows
        ensure
          cursor.close if cursor
        end
      end
    end
  end
  
  class Base
    private
    alias_method :coupa_method_missing, :method_missing
    def method_missing(method_id, *args, &block)
      coupa_method_missing(method_id, *args, &block)
    rescue NoMethodError
      method_name = method_id.to_s
      raise $! unless method_name.ends_with?('=')
      associations = self.class.reflect_on_all_associations(:belongs_to) + self.class.reflect_on_all_associations(:has_one)
      association = associations.find { |a| /^#{a.name}_(.+)=$/.match(method_name) && a.klass.column_methods_hash[$1.to_sym] }
      if association
        attribute = $1
        value = args[0]
        target = send(association.name)
        if target.nil? || target.send(attribute) != value
          send("#{association.name}=", association.klass.send("find_by_#{attribute}", value))
        end
      else
        raise $!
      end
    end
  end
end

module ActiveSupport::CoreExtensions
  module Time::Conversions
    def to_dojo_date
      self.to_time.xmlschema.split('T').first
    end
  end
  
  module Date::Conversions
    def to_dojo_date
      self.to_time.xmlschema.split('T').first
    end
  end
end

module ::ActiveRecord
  class Base
    #module Aggregations
      class << self
        alias_method :old_composed_of, :composed_of
        def composed_of(part_id, options = {})
          options.assert_valid_keys(:class_name, :mapping, :allow_nil)

          name        = part_id.id2name
          class_name  = options[:class_name] || name.camelize
          mapping     = options[:mapping]    || [ name, name ]
          allow_nil   = options[:allow_nil]  || false

          reader_method(name, class_name, mapping, allow_nil)
          writer_method(name, class_name, mapping, allow_nil)
      
          create_reflection(:composed_of, part_id, options, self)
        end
    
        private
        def reader_method(name, class_name, mapping, allow_nil)
          mapping = (Array === mapping.first ? mapping : [ mapping ])

          allow_nil_condition = if allow_nil
            mapping.collect { |pair| "!read_attribute(\"#{pair.first}\").nil?"}.join(" && ")
          else
            "true"
          end

          module_eval <<-end_eval
            def #{name}(force_reload = false)
              if (@#{name}.nil? || force_reload) && #{allow_nil_condition}
                @#{name} = #{class_name}.new(#{mapping.collect { |pair| "read_attribute(\"#{pair.first}\")"}.join(", ")})
              end
              return @#{name}
            end
          end_eval
        end        

        def writer_method(name, class_name, mapping, allow_nil)
          mapping = (Array === mapping.first ? mapping : [ mapping ])

          if allow_nil
            module_eval <<-end_eval
              def #{name}=(part)
                if part.nil?
                  #{mapping.collect { |pair| "@attributes[\"#{pair.first}\"] = nil" }.join("\n")}
                else
                  @#{name} = part.freeze
                  #{mapping.collect { |pair| "@attributes[\"#{pair.first}\"] = part.#{pair.last}" }.join("\n")}
                end
              end
            end_eval
          else
            module_eval <<-end_eval
              def #{name}=(part)
                @#{name} = part.freeze
                #{mapping.collect{ |pair| "@attributes[\"#{pair.first}\"] = part.#{pair.last}" }.join("\n")}
              end
            end_eval
          end
        end
      end
    #end
  end
end

