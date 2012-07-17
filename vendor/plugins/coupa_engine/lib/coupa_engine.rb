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

require 'csv'

require 'coupa_engine/ruby_extensions'
require 'coupa_engine/rails_extensions'

require 'coupa_engine/active_form_extensions'
require 'coupa_engine/acts_as_ferret_extensions'
require 'coupa_engine/acts_as_state_machine_extensions'
require 'coupa_engine/acts_as_taggable_extensions'
require 'coupa_engine/acts_as_versioned_extensions'
require 'coupa_engine/file_column_extensions'
require 'coupa_engine/rtf_extensions'

require 'coupa_engine/acts_as_versioned_set'
require 'coupa_engine/approval_logic'
require 'coupa_engine/attachable'
require 'coupa_engine/coupa_controller'

module CoupaEngine
  def self.included(base)
    if base == ApplicationController
      base.class_eval { include CoupaEngine::CoupaController }
    end
  end
  
  # save the list of images for lookup
  mattr_accessor :images
  self.images = Dir[File.join(File.dirname(__FILE__), '..', 'assets', 'images', '**', '*')].collect { |f|
    f.sub(File.join(File.dirname(__FILE__), '..', 'assets', 'images', ''), '')
  }.select { |f| f.include?('.') }
end
