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

#  


module CoupaEngine
  module VERSION
    Major = 0 # change implies compatibility breaking with previous versions
    Minor = 1 # change implies backwards-compatible change to API
    Release = 0 # incremented with bug-fixes, updates, etc.
  end
end

Engines.current.version = CoupaEngine::VERSION

# load up all the required files we need...
require 'coupa_engine'
require File.join(File.dirname(__FILE__), 'app', 'helpers', 'coupa_helper')

# copy backgroundrb workers to rails root
engine_workers = File.join(File.dirname(__FILE__), 'lib', 'workers')
rails_workers = File.join(RAILS_ROOT, 'lib', 'workers')
FileUtils.mkdir(rails_workers) unless File.directory?(rails_workers)
FileUtils.cp(Dir[File.join(engine_workers, '*')], rails_workers)

# copy selenium tests and fixtures to rails root for testing
if RAILS_ENV == 'test'
  %w(selenium fixtures).each do |type|
    src = File.join(File.dirname(__FILE__), 'test', type)
    dst = File.join(RAILS_ROOT, 'test', type, Engines.current.name)
    FileUtils.mkpath(dst) unless File.directory?(dst)
    Dir[File.join(src, '**', '*')].each do |file|
      target = file.sub(src, dst)
      FileTest.directory?(file) ? FileUtils.mkpath(target) : FileUtils.cp(file, target)
    end
  end
end
