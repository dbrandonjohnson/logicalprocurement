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

require 'application'

module CoupaHelper
  include LoginEngine
  include UserEngine

  def error_messages_for(object_name, options = {})
    options.symbolize_keys!
    object = instance_variable_get("@#{object_name}")
    if object && !object.errors.empty? && (mesgs = object.errors.full_messages.collect { |msg| content_tag("li", msg) }) && !mesgs.blank?
      content_tag("div",
        image_tag('exclamation.png',"style" => "padding:0px 2px 2px;") +
        content_tag(options[:header_tag] || "span",
          "Please fix the errors below and resubmit","style" => "display:inline;vertical-align:top;border:none;color:#c63;font-weight:bold;"
        ) +
        content_tag("ul", mesgs),
        "id" => options[:id] || "errorExplanation", "class" => options[:class] || "errorExplanation"
      )
    else
      ""
    end
  end
  
  def nested_error_messages_for(object_name, collection_name, options = {})
    options.symbolize_keys!
    object = instance_variable_get("@#{object_name}")
    collection = object.send(collection_name).find_all

    unless object.errors.empty? && collection.all? { |item| item.errors.empty? }
      content_tag("div",
        image_tag('exclamation.png',"style" => "padding:0px 2px 2px;") +
        content_tag(options[:header_tag] || "span",
          "Please fix the errors below and resubmit",
          "style" => "display:inline;vertical-align:top;border:none;color:#c63;font-weight:bold;"
        ) +
        content_tag("ul",
          object.errors.full_messages.collect { |msg| !msg.nil? ? content_tag("li", msg) : ''} +
          collection.collect_with_index { |item,i| !item.errors.empty? ? item.errors.full_messages.collect { |msg| content_tag("li", "Line #{item.respond_to?(:position_column) ? item.send(item.position_column) : i}: #{msg} see")} : '' }.compact
        ),
        "id" => options[:id] || "errorExplanation", "class" => options[:class] || "errorExplanation"
      )
    end
  end

  # Catches all exceptions, and just returns a nil
  # Easy implementation of <a href="http://www.martinfowler.com/eaaCatalog/specialCase.html">http://www.martinfowler.com/eaaCatalog/specialCase.html</a>
  def nil_on_fail
      begin
          return yield
      rescue
          return nil
      end
  end

  def punchout_status
    "&nbsp;<small><em>punchout</em></small>" if session[:punchout]
  end
  
  def toggle_switch_for(target, options = {})
    defaults = { :collapsed_image => "live_tree_branch_collapsed_icon.gif",
                 :expanded_image => "live_tree_branch_expanded_icon.gif" }
                 
    options = defaults.merge(options.symbolize_keys)
    
    collapsed_image_options = { :id => "#{target}_show", :title => "Show", :src => options[:collapsed_image] }
    expanded_image_options = { :id => "#{target}_hide", :title => "Hide", :src => options[:expanded_image] }
    
    if options[:description]
      collapsed_image_options[:title] = "Show #{options[:description]}"
      expanded_image_options[:title] = "Hide #{options[:description]}"
    end
    
    (options[:expanded] ? collapsed_image_options : expanded_image_options)[:style] = "display:none"
    
    collapsed_image = image_tag(collapsed_image_options.delete(:src), collapsed_image_options)
    expanded_image = image_tag(expanded_image_options.delete(:src), expanded_image_options)
    
    link_to_function(collapsed_image + expanded_image, "$('#{target}_show', '#{target}_hide', '#{target}').each(Element.toggle)")
  end
  
  def mail_status
    new_mail_count = Notification.count(:conditions => ['user_id = ? AND (read_flag IS NULL OR read_flag = ?)',session[:user].id,false])
    new_mail_count.zero? ?
      link_to(image_tag("email.png", :style => 'vertical-align:middle;'), :controller => 'inbox', :action => 'index') :
      "#{link_to(image_tag("email_open.png", :style => 'vertical-align:middle;margin-top:-3px;'), :controller => 'inbox', :action => 'index')} (#{new_mail_count})"
  end
  
  def pagination_links_each(paginator, options)
    options = ActionView::Helpers::PaginationHelper::DEFAULT_OPTIONS.merge(options)
    link_to_current_page = options[:link_to_current_page]
    always_show_anchors = options[:always_show_anchors]

    current_page = paginator.current_page
    window_pages = current_page.window(options[:window_size]).pages
    return if window_pages.length <= 1 unless link_to_current_page
    
    first, last = paginator.first, paginator.last
    
    html = '<div class="paginator">'

    if always_show_anchors and not (wp_first = window_pages[0]).first?
      html << yield(first.number)
      html << ' ... ' if wp_first.number - first.number > 1
      html << ' '
    end
      
    window_pages.each do |page|
      if current_page == page && !link_to_current_page
        html << '<span class="inactive_page_number">' + page.number.to_s + '</span>'
      else
        html << yield(page.number)
      end
      html << ' '
    end
    
    if always_show_anchors and not (wp_last = window_pages[-1]).last? 
      html << ' ... ' if last.number - wp_last.number > 1
      html << yield(last.number)
    end
    
    html << '</div>'
  end
  
  def create_widgets
    javascript_tag("dojo.addOnLoad(function() { dojo.widget.createWidget(dojo.body()) })")
  end

  def rollover_link_to(label, link_options)
    rollover_link_to_function(label, "window.location='#{url_for(link_options)}'")
  end
  
  def rollover_link_to_remote(label, link_options)
    rollover_link_to_function(label, remote_function(link_options))
  end

  def rollover_link_to_function(label, link_options)
    button = content_tag("div", label, :dojotype => "coupa:Button", :onclick => "#{link_options}; return false;")
    button << create_widgets if request && request.xhr?
    button
  end

  def rollover_button_to(name, options = {}, html_options = nil)
    button_to(name, options, html_options).sub(%r{<div>.*</div>}m, rollover_submit_tag(name))
  end
  
  def rollover_submit_tag(value = "Save changes", options = {})
    button = content_tag("div", value, { :dojotype => "coupa:SubmitButton" }.update(options))
    button << create_widgets if request && request.xhr?
    button
  end
  
  def rollover_submit_to_remote(label, form_id, options)
    rollover_link_to_remote(label, { :with => "Form.serialize('#{form_id}')" }.update(options))
  end
  
  def rollover_link_if_authorized(label, link_options)
    rollover_link_to(label, link_options) if authorized?(link_options)
  end
  
  def rollover_link_to_remote_if_authorized(label, link_options)
    rollover_link_to_remote(label, link_options) if authorized?(link_options[:url])
  end
  
  if ENV['RAILS_ENV'] == 'test'
    alias_method :selenium_rollover_link_to_function, :rollover_link_to_function
    def rollover_link_to_function(label, link_options)
      content_tag("a", selenium_rollover_link_to_function(label, link_options), :href => "#")
    end
    
    alias_method :selenium_rollover_submit_tag, :rollover_submit_tag
    def rollover_submit_tag(value = "Save changes", options = {})
      content_tag("a", selenium_rollover_submit_tag(value, options), :href => "#")
    end
  end

  alias_method :small_rollover_submit_tag, :rollover_submit_tag
  alias_method :small_rollover_link_to, :rollover_link_to
  alias_method :small_rollover_link_to_remote, :rollover_link_to_remote
  alias_method :small_rollover_link_to_function, :rollover_link_to_function

  def render_attribute(attrib,form = :short,show_none = true)
    if attrib.kind_of?(Date)
      attrib.strftime('%m/%d/%y')
    elsif attrib.kind_of?(Time)
      attrib.strftime('%m/%d/%y %I:%M %p')
    elsif (attrib.kind_of?(TrueClass) || attrib.kind_of?(FalseClass))
      attrib ? 'Yes' : 'No'
    elsif attrib.kind_of?(Money)
      if attrib.error_msg
        "<span style=\"color:#c63\" title=\"#{attrib.error_msg}\">Error</span>"
      elsif attrib.currency && form == :long
        "#{attrib.amount < 0 ? '<span style="color:#c63">' : ''}#{number_to_currency(attrib.amount,{:unit => ''})} #{attrib.currency.code}#{attrib.amount < 0 ? '</span>' : ''}"
      elsif attrib.currency
        "<span title=\"#{attrib.currency.code}\"#{attrib.amount < 0 ? ' style="color:#c63"' : ''}>"+number_to_currency(attrib.amount,:unit => '')+"</span>"
      else
        number_to_currency(attrib.amount,:unit => '')
      end
    elsif attrib.blank?
      show_none ? none : ''
    else h attrib
    end
  end

  def none(text = 'None')
    "<span style=\"color:#999\">#{text}</span>"
  end
  
  def reload_flash
    page.replace_html 'flash_container', :partial => 'layouts/flash'
  end
  
  def javascriptize_helpers helpers
    o = ""
    helpers.each do |helper|
      o << "function " << helper.to_s << "() {\n"
      o << render(:update) { |page| page.send helper }
      o << "\n}\n"
    end
    return o
  end

  def auto_complete_result_method(entries, field, phrase = nil)
    return unless entries
    items = entries.map { |entry| content_tag("li", phrase ? highlight(entry.send(field), phrase) : h(entry.send(field))) }
    content_tag("ul", items.uniq)
  end
  
  def text_field_selector(object,method,tag_options = {},completion_options = {})
    text_field_with_auto_complete(object,method,{:size => 15}.update(tag_options),
                                  {:after_update_element => "function(textElem,selectedElem){var nodes = document.getElementsByClassName('acid', selectedElem) || [];if(nodes.length>0) {value = Element.collectTextNodes(nodes[0], 'acid');} else {value = null;}$('#{object}_#{method}_id').value = value;#{completion_options[:after_update_element]}}",
                                   :select => 'acname', :param_name => 'id', :indicator => "#{object}_#{method}_wait"}.
                                    update(completion_options.delete_if{|k,v| k.to_sym == :after_update_element}))+
    image_tag('spinner.gif', :id => "#{object}_#{method}_wait", :style => "display:none;margin-left:1px;margin-top:0px;max-height:16px;")+
    hidden_field(object,"#{method}_id",:style => 'border:none')+
    javascript_tag("Event.observe($('#{object}_#{method}'), \"blur\", function(event){setTimeout(function() { sync_fields(event); }, 250);});")
  end

  def supplier_selector(object_name, method_name, tag_options = {}, completion_options = {})
    render :partial => 'suppliers/selector', :locals => {:tag_options => tag_options, :completion_options => completion_options}.merge(derive_field_root(object_name, method_name))
  end
  
  def account_selector(object_name, method_name, account_type_id = nil, tag_options = {}, completion_options = {})
    render :partial => 'accounts/selector', :locals => {:account_type_id => account_type_id, :tag_options => tag_options, :completion_options => completion_options}.merge(derive_field_root(object_name, method_name))
  end

  def account_picker_field(object_name, method_name, options = {})
    current_options = {:restrict_to_account_type_ids => [],
                       :linked_form => nil,
                       :linked_account_type_field => nil}.merge(options)
    field_root = derive_field_root(object_name, method_name)
    render :partial => 'accounts/picker_field', 
      :locals => {:object_name => object_name, 
                  :method_name => method_name}.merge(current_options).merge(field_root)
  end
  
  def currency_selector(object_name, method_name, currencies = Currency.find_all_by_enabled_flag(true))
    if currencies.size > 1
      select(object_name, method_name+'_id', currencies.collect{|cur| [cur.code,cur.id]})
    else
     (currencies.first ? currencies.first.code : 'No currencies enabled') + hidden_field(object_name, method_name+'_id')
    end
  end

  def inline_file_column_field(name, object, method, options={})
    div_options = { :class => 'inline_form_element', :style => 'clear:left' }
    label = content_tag :label, name
    field = file_column_field(object, method, options)
    
    if options[:hint]
      hint = content_tag(:span, options.delete(:hint), :class => 'hint')
      field << '<br />' << hint
      field = content_tag :div, field, :style => "display:table-cell"
    end
    
    if existing_file = instance_variable_get("@#{object}").send(method)
      old = link_to File.basename(existing_file), url_for_file_column(object, method)
      old = content_tag :div, old, :style => "float:left"
      change_button = content_tag :div, small_rollover_link_to_function("Change", "$('#{object}_#{method}_old').hide();$('#{object}_#{method}_new').show()"), :style => "display:table-cell"
      old = content_tag :div, old << change_button, :id => "#{object}_#{method}_old"
      cancel = link_to_function "cancel", "$('#{object}_#{method}').value='';$('#{object}_#{method}_new').hide();$('#{object}_#{method}_old').show()"
      field = content_tag :div, field << "&nbsp;" << cancel, :id => "#{object}_#{method}_new", :style => "display:none"
      content_tag :div, label << old << field, div_options
    else
      content_tag :div, label << field, div_options
    end
  end
  
  def date_picker_field(object, method, options = {})
    add_index = false
    obj = nil
    if object.sub!(/\[\]$/,"")
      add_index = true
      obj = self.instance_variable_get("@#{Regexp.last_match.pre_match}")
    else
      obj = instance_eval("@#{object}")
    end
    value = obj.send(method)
    out = date_picker_field_tag("#{object}#{add_index ? '['+obj.id.to_s+']' : ''}[#{method}]", value, { :id => "#{object}_#{add_index ? obj.id.to_s+'_' : ''}#{method}" }.update(options.symbolize_keys))
    out = ActionView::Base.field_error_proc.call(out, nil) if obj.respond_to?(:errors) && obj.errors.on(method)
    out
  end
  
  def date_picker_field_tag(name, value = nil, options = {})
    begin
      value = value.to_time.xmlschema.split('T').first if value.respond_to?(:to_time)
    rescue
      logger.error("date_picker_field_tag: Invalid value:")
      logger.error($!)
      value = nil
    end
    options = { :dojotype => 'coupa:DropdownDatePicker', :id => name, :name => name, :value => value }.update(options.symbolize_keys)

    
    datepicker = content_tag('div', '', options)
    datepicker << javascript_tag("dojo.widget.createWidget('#{options[:id]}')") if request && request.xhr?
    datepicker
  end
  
  def immutable_field(object, method, options = {})
    immutable_field_tag("#{object}[#{method}]", instance_eval("@#{object}").send(method), { :id => "#{object}_#{method}" }.update(options.symbolize_keys))
  end
  
  def immutable_field_tag(name, value = nil, options = {})
    content_tag('span', render_attribute(value), { :id => name, :name => name }.update(options.symbolize_keys))
  end
  
  def link_to_dialog(name, options = {}, html_options = {})
    div_id = options[:url][:action].dup
    div_id << "_#{options[:url][:id]}" if options[:url][:id]
    
    options[:complete] ||= "dojo.widget.createWidget('#{div_id}').show()"
    options[:update] ||= "tail"
    options[:position] ||= "bottom"
    
    link_to_remote(name, options, html_options)
  end
  
  def dialog_id
    params[:id] ? "#{params[:action]}_#{params[:id]}" : "#{params[:action]}"
  end

  def method_missing(method_symbol, *parameters)#:nodoc:
    # wrap form elements in a div and label
    case method_symbol.id2name
      when /^wrapped_([a-z_]\w*)/
        if %w(address_picker_field).include?($1) ||
           CoupaHelper.method_defined?($1) ||
           %w(FormTagHelper FormHelper FormOptionsHelper JavaScriptMacrosHelper).any? { |helper| "ActionView::Helpers::#{helper}".constantize.method_defined?($1.to_sym) }
          div_options = {}
          if parameters[0].is_a?(String)
            div_options[:name] = parameters[0]
          elsif parameters[0].is_a?(Hash)
            div_options = parameters[0]
          end
          
          div_options[:name] ||= ''
          div_options[:hint] ||= ''
          div_options[:after] ||= ''
          div_options[:class] ||= 'wrapped_form_element'
          
          if div_options[:required]
            required = content_tag(:span,' * ', :class => 'req')
            div_options.delete(:required)
          else
            required = ''
          end

          label = content_tag :label, div_options.delete(:name) + required
          field = send $1.to_sym, *parameters[1..-1]
          if div_options[:hint].blank?
            hint = ''
            div_options.delete(:hint)
          else
            hint = content_tag(:span, div_options.delete(:hint), :class => 'hint')
            if div_options[:class] == 'inline_form_element'
              hint = '<br/>'+hint
            end
          end
          
          content_tag :div, label << field << div_options.delete(:after) << hint, div_options
        else super
        end
      when /^inline_([a-z_]\w*)/
        if parameters[0].is_a?(String)
          parameters[0] = { :name => parameters[0] }
        end
        parameters[0][:class] ||= 'inline_form_element'
        self.method_missing(method_symbol.id2name.sub('inline', 'wrapped').to_sym, *parameters)
      else super
    end
  end
  
  protected
  def derive_field_root(object_name, method_name)
    result = {}
    result[:object_name] = object_name
    result[:method] = method_name
    oname = object_name.dup.to_s
    if oname.sub!(/\[\]$/,"")
      result[:object] = self.instance_variable_get("@#{Regexp.last_match.pre_match}")
      cur_id = result[:object].id_before_type_cast
      result[:field_root_name] = "#{oname}[#{cur_id}][#{method_name}]"
      result[:field_root_id] = "#{oname}_#{cur_id}_#{method_name}"
    else
      result[:object] = self.instance_variable_get("@#{oname}")
      result[:field_root_name] = "#{object_name}[#{method_name}]"
      result[:field_root_id] = "#{object_name}_#{method_name}"
    end
    result[:value] = result[:object].send(method_name)
    
    result
  end
  
  def png_dimensions(png_file)
    File.new(png_file,'rb').read[0x10..0x18].unpack('NN')
  end
  
  def preserve_aspect_ratio(source, options)
    path = image_path(source, options)
    if path && options.has_key?(:height) ^ options.has_key?(:width)
      path = path.split('?').first
      width, height = png_dimensions(File.join(RAILS_ROOT, 'public', path))
      amount, unit = /^(\d+)(\D*)$/.match(options[:height].to_s).captures
      amount = amount.to_i
    
      if options.has_key?(:height)
        options[:width] = (amount * width / height).to_s + unit
      else
        options[:height] = (amount * height / width).to_s + unit
      end
    end
  end

  def process_image_options(source, options)
    options.stringify_keys!
    source << '.png' unless source.include?('.')
    unless options['plugin']
      options['plugin'] = 'coupa_engine' if CoupaEngine.images.include?(source)
    end
    options['alt'] ||= options['title'] || ''
    options['title'] ||= options['alt']
    
    options['width'], options['height'] = options.delete('size').split('x') if options['size']
    
    if File.extname(source).downcase == '.png' && request && /msie\s(5\.[5-9]|[6]\.[0-9]*).*(win)/i.match(request.env['HTTP_USER_AGENT']) && !/opera|webtv|blazer/i.match(request.env['HTTP_USER_AGENT'])
      preserve_aspect_ratio(source, options)
      loader_options = ['enabled=true']
      loader_options << "sizingMethod='scale'" if options['height'] || options['width']
      loader_options << "src='#{image_path(source, options) || source}'"
      options['style'] = "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(#{loader_options.join(',')});#{options['style']}"
      options['plugin'] = 'coupa_engine'
      options['src'] = 'blank.gif'
    end
  end
end
