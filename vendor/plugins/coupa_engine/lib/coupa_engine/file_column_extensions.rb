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

require 'fileutils'

module FileColumn # :nodoc:
  module ClassMethods
    DEFAULT_OPTIONS[:root_path] = File.join(RAILS_ROOT, "public", "files")
    DEFAULT_OPTIONS[:web_root] = "files/"
  end
  
  def self.create_state(instance,attr)
    filename = instance[attr]
    # Prevent file set on clone
    if filename.nil? or filename.empty? or instance.id.nil?
      NoUploadedFile.new(instance,attr)
    else
      PermanentUploadedFile.new(instance,attr)
    end
  end

  class TempUploadedFile < RealUploadedFile # :nodoc:
    def store_upload(file)
      @tmp_dir = FileColumn.generate_temp_name
      @dir = File.join(tmp_base_dir, @tmp_dir)      
      FileUtils.mkpath(@dir)

      @filename = FileColumn::sanitize_filename(file.original_filename)
      local_file_path = File.join(tmp_base_dir,@tmp_dir,@filename)

      # stored uploaded file into local_file_path
      # If it was a Tempfile object, the temporary file will be
      # cleaned up automatically, so we do not have to care for this
      if file.respond_to?(:local_path) and file.local_path and File.exists?(file.local_path)
        FileUtils.copy_file(file.local_path, local_file_path)
      elsif file.respond_to?(:read)
        File.open(local_file_path, "wb") { |f| f.write(file.read) }
      else
        raise ArgumentError.new("Do not know how to handle #{file.inspect}")
      end
      File.chmod(options[:permissions], local_file_path)

      if options[:fix_file_extensions]
        # try to determine correct file extension and fix
        # if necessary
        content_type = get_content_type((file.content_type.chomp if file.content_type))
        if content_type and options[:mime_extensions][content_type]
          @filename = correct_extension(@filename,options[:mime_extensions][content_type])
        end

        new_local_file_path = File.join(tmp_base_dir,@tmp_dir,@filename)
        FileUtils.mv(local_file_path, new_local_file_path) unless new_local_file_path == local_file_path
        local_file_path = new_local_file_path
      end

      @instance[@attr] = @filename
      @just_uploaded = true
    end
  end
end

module FileColumnHelper
  
  # modify the output of url_for_file_column to be absolute
  def url_for_file_column_with_coupa_extensions(object, method, options=nil)
    case object
    when String, Symbol
      object = instance_variable_get("@#{object.to_s}")
    end

    # parse options
    subdir = nil
    absolute = false
    if options
      case options
      when Hash
        subdir = options[:subdir]
        absolute = options[:absolute]
      when String, Symbol
        subdir = options
      end
    end

    relative_path = object.send("#{method}_relative_path", subdir)
    return nil unless relative_path

    url = ""
    url << controller.request.relative_url_root.to_s if absolute
    url << "/"
    url << object.send("#{method}_options")[:base_url] << "/"
    url << relative_path
    
    segments = url.split('/')
    controller.url_for(:controller => segments.delete_at(1), :action => segments.delete_at(1)) << segments.join('/')
  end
  alias_method_chain :url_for_file_column, :coupa_extensions
end