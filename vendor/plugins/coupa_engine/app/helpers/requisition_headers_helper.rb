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

module RequisitionHeadersHelper
   def line_description_field(object_name)
     if object_name.sub!(/\[\]$/,"")
       auto_index = self.instance_variable_get("@#{Regexp.last_match.pre_match}").id_before_type_cast
     end
     line = self.instance_variable_get("@#{object_name}")
     field = '<table style="padding:0px;margin:0px;"><tr><td style="padding:0px;margin:0px;">'+text_field("#{object_name}[]", "description", :class => (line.catalog_item_editable? ? 'accatalog_item' : 'amt_desc'), :size => 80, :style => "vertical-align:top;")+
           content_tag("div",'',:id => "#{object_name}_#{line.id}_description_auto_complete",
               :class => "autocomplete", :style => "white-space:normal;display:none;")+'</td><td style="padding:0px;margin:0px;">'+
           image_tag('spinner.gif', 
               :id => "#{object_name}_#{line.id}_description_wait", 
               :style => "display:none;margin-left:1px;margin-top:2px;max-height:16px;")+'</td></tr></table>'
     if line.catalog_item
       display = link_to( line.catalog_item.name, :controller => 'catalog_items', 
           :action => 'show', :id => line.catalog_item.id)
     else
       display = line.description
     end
     content_tag("div",content_tag("div",display,:id => "#{object_name}_#{line.id}_description_display", :style => (line.description_editable? ? 'display:none;' : 'float:left;padding:0px 3px 0px 0px;'))+
                       content_tag("div",field,:id => "#{object_name}_#{line.id}_description_field", :style => (line.description_editable? ? 'float:left;padding:0px 3px 0px 0px;' : 'display:none;')),:id => "#{object_name}_#{line.id}_description_tog")
   end
   
   def line_quantity_field(object_name)
     if object_name.sub!(/\[\]$/,"")
       auto_index = self.instance_variable_get("@#{Regexp.last_match.pre_match}").id_before_type_cast
     end
     line = self.instance_variable_get("@#{object_name}")
     field = text_field("#{object_name}[]", "quantity", :size => 5)
     display = line.respond_to?(:formatted_quantity) ? line.formatted_quantity : line.quantity
     content_tag("div",content_tag("div",display,:id => "#{object_name}_#{line.id}_quantity_display", :style => (line.quantity_editable? ? 'display:none' : ''))+
                       content_tag("div",field,:id => "#{object_name}_#{line.id}_quantity_field", :style => (line.quantity_editable? ? '' : 'display:none')),:id => "#{object_name}_#{line.id}_quantity_tog")
   end

   def line_uom_field(object_name)
     if object_name.sub!(/\[\]$/,"")
       auto_index = self.instance_variable_get("@#{Regexp.last_match.pre_match}").id_before_type_cast
     end
     line = self.instance_variable_get("@#{object_name}")
     field = text_field("#{object_name}[]", "uom", :size => 5,:class => "acuom",:style => "vertical-align:top;")+
            content_tag("div",'',:id => "#{object_name}_#{line.id}_uom_auto_complete",
                :class => "autocomplete", :style => "white-space:normal;display:none;")+
            image_tag('spinner.gif', 
                :id => "#{object_name}_#{line.id}_uom_wait", 
                :style => "display:none;")
     display = line.uom ? line.uom.name : ''
     content_tag("div",content_tag("div",display,:id => "#{object_name}_#{line.id}_uom_display", :style => (line.uom_editable? ? 'display:none' : 'padding:0px 3px 0px 0px;'))+
                       content_tag("div",field,:id => "#{object_name}_#{line.id}_uom_field", :style => (line.uom_editable? ? 'padding:0px 3px 0px 0px;' : 'display:none')),:id => "#{object_name}_#{line.id}_uom_tog")
   end
end
