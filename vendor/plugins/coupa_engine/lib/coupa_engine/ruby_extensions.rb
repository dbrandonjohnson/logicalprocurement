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

class Object
  def deep_clone
    Marshal.load(Marshal.dump(self))
  end
end

module Enumerable
  def intersects?(other)
    self.any? { |member| other.include?(member) }
  end
  
  def collect_with_index
    result = []
    each_with_index do |element, index|
      result << yield(element, index)
    end
    result
  end
end

class Hash
  def only(*keys)
    clone = self.class.new
    keys.each { |key| clone[key] = self[key] if self[key] }
    clone
  end
  
  def without(*keys)
    clone = self.dup
    keys.each { |key| clone.delete(key) }
    clone
  end
end

# Ruby 1.8-cvs and 1.9 define private Time#to_date
# workaround taken from ActiveSupport in Rails 1.2
# we can remove this when moving to Rails 1.2
class Time
  %w(to_date to_datetime).each do |method|
    public method if private_instance_methods.include?(method)
  end
end
