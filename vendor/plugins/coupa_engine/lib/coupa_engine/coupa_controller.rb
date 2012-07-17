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

# Filters added to this controller will be run for all controllers in the application.
# Likewise, all the methods added will be available for all controllers.
module CoupaEngine
  module CoupaController    
    
    def self.included(base)
      base.extend(ClassMethods)
      base.class_eval do
        helper :coupa
        helper :user
        model :user
        
        layout 'coupa'
        before_filter :authorize_action
        after_filter :set_charset

        hide_action :set_charset, :add_url_params
        hide_action :concat, :truncate, :highlight, :excerpt, :pluralize, :word_wrap, :textilize
        hide_action :textilize_without_paragraph, :markdown, :simple_format, :auto_link, :strip_links
        hide_action :sanitize, :strip_tags, :cycle, :reset_cycle
        hide_action :rescue_action_in_public, :local_request?, :to_enum, :enum_for
        hide_action :images, :images=, :authorize_object, :process_without_test, :process_with_test
        before_filter do |c|
          User.current_user = c.session[:user] unless c.session[:user].nil?
        end
        
        # Admin has access to all objects
        # If a class method 'authorize' is defined on the object, the object can determine whether a user is authorized
        # If no class method, all objects are accessible
        # Refactoring to a common set of rules would simplify this a bit
        def authorize_object(object)
          return object if (User.current_user && User.current_user.admin?) || !object.respond_to?(:authorize) || object.authorize(User.current_user)
        end
        
        protected

        def set_charset
          if !headers["Content-Type"] || /text\/html/=~ headers["Content-Type"]
            headers["Content-Type"] = "text/html; charset=utf-8" 
          end
        end

        def add_url_params(url, params={})
          # parse existing params from url
          old_params = {}
          if /\?/.match(url)
            url = $`
            $'.split('&').each{ |p| /=/.match(p) ? old_params[$`] = $' : old_params[p] = '' }
          end

          # override old ones with new ones
          params = old_params.merge(params.stringify_keys)

          # return new url
          query_string = ""
          params.each_pair { |k,v| query_string << "&#{k}=#{v}" }
          query_string.sub! '&', '?'
          url << query_string
        end
        
      end  
    end
    
    module ClassMethods


      def data_table(model_id, columns, options = {})
        singular_name = model_id.to_s
        plural_name = singular_name.pluralize
        options.symbolize_keys!
        model_class = Object.module_eval(singular_name.camelize)
        merged_options = options.update({
          :name => singular_name,
          :table => options[:table] || singular_name.pluralize,
          :find_options => options[:find_options] || {},
          :searchable => options[:searchable].nil? ? true : options[:searchable],
          :actions => options[:actions] || {},
          :accept_partial_match => options[:accept_partial_match] || false
        })
        merged_columns = []
        columns.each do |col|
          if col.is_a? Hash
            col.update({
              :method => col[:method] || col[:key],
              :sql_column => col[:sql_column] || "#{merged_options[:table]}.#{col[:key].to_s}",
              :alignment => col[:alignment] || (model_class.column_names.include?(col[:key].to_s) && model_class.columns_hash[col[:key].to_s].number? ? 'right' : 'left'),
              :sortable => !col[:sort_clause].nil? || (model_class.column_names.include?(col[:key].to_s) && (col[:sortable].nil? || col[:sortable])),
              :searchable => ((model_class.column_names.include?(col[:key].to_s) || !col[:sql_column].nil?) && (col[:searchable].nil? || col[:searchable])),
              :label => col[:label] || col[:key].to_s.titleize,
              :render_text => col[:render_text] || "<%= render_attribute(value) %>",
              :display => col[:display].nil? || col[:display]
            })
            unless col.has_key?(:render_text)
              table_name, column_name = /(?:(\w+)\.)?(\w+)/.match(col[:sql_column]).captures
              column = merged_options[:table]==table_name ? model_class.columns_hash[column_name] : ActiveRecord::Base.connection.columns(table_name).find { |c| c.name == column_name }
              col[:render_text] = column && column.klass == Time ? "<%= h(value.to_date.to_formatted_s(:long)) if value %>" : "<%= h value %>"
            end
            merged_columns << col
          else
            merged_columns << {
              :key => col.to_sym,
              :method => col.to_sym,
              :sql_column => "#{merged_options[:table]}.#{col.to_s}",
              :alignment => (model_class.column_names.include?(col.to_s) && model_class.columns_hash[col.to_s].number? ? 'right' : 'left'),
              :sortable => model_class.column_names.include?(col.to_s),
              :searchable => model_class.column_names.include?(col.to_s),
              :label => col.to_s.titleize,
              :render_text => "<%= render_attribute(value) %>",
              :display => true
            }
          end
        end

        table_methods = <<-END_OF_TABLE_METHODS

        skip_before_filter :authorize_action, :only => [ :sort_#{singular_name}_table,:search_#{singular_name}_table ]
        verify :xhr => true, :only => [:sort_#{singular_name}_table,:search_#{singular_name}_table]
        
        public

        def sort_#{singular_name}_table
          current_options = #{singular_name}_process_options(params)
          @#{singular_name}_pages, @#{plural_name} = paginate(:#{plural_name},{:per_page => 20}.merge(current_options[:find_options]))
          render :update do |page|
            page << "dojo.dom.removeChildren(dojo.byId('#{singular_name}_thead'));"
            page.insert_html :bottom, "#{singular_name}_thead", :partial => 'layouts/table_header', :locals => {:table_columns => @@#{singular_name}_columns, :table_options => current_options}
            page.replace "#{singular_name}_page_links", :partial => 'layouts/table_pagination_links', :locals => {:table_row_pages => @#{singular_name}_pages, :table_options => current_options}
            page << "dojo.dom.removeChildren(dojo.byId('#{singular_name}_tbody'));"
            page.insert_html :bottom, "#{singular_name}_tbody", :partial => 'layouts/table_row', :collection => @#{plural_name}, :locals => {:table_columns => @@#{singular_name}_columns, :table_options => current_options}
          end
        end

        def search_#{singular_name}_table
          current_options = #{singular_name}_process_options(params)
          @#{singular_name}_pages, @#{plural_name} = paginate(:#{plural_name},{:per_page => 20}.merge(current_options[:find_options]))
          render :update do |page|
            page << "dojo.dom.removeChildren(dojo.byId('#{singular_name}_thead'));"
            page.insert_html :bottom, "#{singular_name}_thead", :partial => 'layouts/table_header', :locals => {:table_columns => @@#{singular_name}_columns, :table_options => current_options}
            page.replace "#{singular_name}_page_links", :partial => 'layouts/table_pagination_links', :locals => {:table_row_pages => @#{singular_name}_pages, :table_options => current_options}
            page << "dojo.dom.removeChildren(dojo.byId('#{singular_name}_tbody'));"
            page.insert_html :bottom, "#{singular_name}_tbody", :partial => 'layouts/table_row', :collection => @#{plural_name}, :locals => {:table_columns => @@#{singular_name}_columns, :table_options => current_options}
          end
        end
        
        protected
        @@#{singular_name}_columns = []
        @@#{singular_name}_table_options = {}
        
        def self.#{singular_name}_columns=(val)
          @@#{singular_name}_columns = val
        end
        
        def self.#{singular_name}_table_options=(val)
          @@#{singular_name}_table_options = val
        end
        
        def self.#{singular_name}_current_options=(val)
          @@#{singular_name}_current_options = val
        end
        
        def #{singular_name}_process_options(params)
          current_options = @@#{singular_name}_table_options.deep_clone
          cur_cond = (@@#{singular_name}_table_options[:find_options][:conditions] ? @@#{singular_name}_table_options[:find_options][:conditions].clone : []).to_a
          if params[:search]
            searchable_cols = []
            @@#{singular_name}_columns.each do |col|
              if col[:searchable]
                searchable_cols << "\#\{col[:sql_column]\} LIKE ?"
              end
            end
            search_str = searchable_cols.join(' OR ')
            if cur_cond[0] && !cur_cond[0].empty?
              cur_cond[0] = cur_cond[0] + ' AND (' + search_str + ')'
            else
              cur_cond[0] = search_str
            end
            searchable_cols.each do |col|
              cur_cond << "%\#\{params[:search]\}%"
            end
            if #{model_class}.include?(ActsAsFerret::InstanceMethods) then
              search_params = sanitize(params[:search])
              search_params = "*"+search_params+"*" if #{merged_options[:accept_partial_match]}
              res =  #{model_class}.find_by_contents(search_params,@@#{singular_name}_table_options[:find_options]).collect(&:id)
              if !res.empty?
                if cur_cond[0].empty?
                  cur_cond[0] = '#{merged_options[:table]}.id in (?)'
                else
                  cur_cond[0] = '('+cur_cond[0]+') OR (#{merged_options[:table]}.id in (?))'
                end
                cur_cond << res
              end
            end
            current_options[:search] = sanitize(params[:search])
          end
          if params[:filter] && !params[:filter].empty? && !(params[:filter].to_i == 0)
            zero_based_filter = params[:filter].to_i - 1
            if cur_cond[0] && !cur_cond[0].empty?
              cur_cond[0] = '(' + cur_cond[0] + ') AND (' + current_options[:filters][zero_based_filter][:conditions][0] + ')'
            else
              cur_cond[0] = current_options[:filters][zero_based_filter][:conditions][0]
            end
            if current_options[:filters][zero_based_filter][:conditions].size > 1
              cur_cond.concat(current_options[:filters][zero_based_filter][:conditions][1..-1])
            end
            current_options[:selected_filter] = (params[:filter].to_i)
          end
          current_options[:find_options][:conditions] = cur_cond
          if params[:sort] && params[:dir]
            current_options[:find_options][:order] = "\#\{sanitize params[:sort]\} \#\{sanitize params[:dir]\}"          
          end
          current_options[:sort] = params[:sort]
          current_options[:dir] = params[:dir]
          current_options[:filter] = params[:filter]
          # Need this because Rails doesn't like empty condition strings
          current_options[:find_options][:conditions] = nil if current_options[:find_options][:conditions].empty?
          current_options
        end
        
        def render_#{singular_name}_table(current_options = @@#{singular_name}_table_options)
          @#{singular_name}_pages, @#{plural_name} = paginate(:#{plural_name},{:per_page => 20}.merge(current_options[:find_options]))
          render_to_string :partial => 'layouts/table', :locals => {:table_columns => @@#{singular_name}_columns, :table_rows => @#{plural_name}, :table_row_pages => @#{singular_name}_pages, :table_options => current_options}
        end
        
        END_OF_TABLE_METHODS
        self.module_eval(table_methods,"generated code (#{__FILE__}:#{__LINE__})")
        send("#{singular_name}_columns=",merged_columns)
        send("#{singular_name}_table_options=",merged_options.deep_clone)
        send("#{singular_name}_current_options=",merged_options.deep_clone)
      end
    end

    SEARCH_STOP_LIST = []
    
    def rescue_action_in_public(exception)
      @title = "Error"
      @exception = exception
      render :template => 'layouts/error'
    end

    def local_request?
      false
    end
      
    protected
    include ActionView::Helpers::TextHelper
    
  end
end
