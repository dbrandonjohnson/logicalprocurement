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

class Name
  include Comparable
  attr_reader :prefix, :given, :additional, :family, :suffix, :fullname
  
  def initialize(prefix,given,additional,family,suffix,fullname)
    @prefix, @given, @additional, @family, @suffix, @fullname = prefix, given, additional, family, suffix, fullname
    #@fullname = self.formatted_name if @fullname.blank?
  end
  
#  alias :attr_fullname :fullname
  
#  def fullname
#    attr_fullname.blank? ? formatted_name : attr_fullname
#  end
  
  def formatted_name
    "#{prefix} #{given} #{additional} #{family} #{suffix}".strip.gsub('  ',' ')
  end

  def ==(other_name)
    given == other_name.given && 
    family == other_name.family && 
    suffix == other_name.suffix && 
    additional == other_name.additional
  end

  # TODO: make sorting locale-specific
  def <=>(other_name)
    result = family <=> other_name.family
    result = given <=> other_name.given if result == 0
    result = additional <=> other_name.additional if result == 0
    result = suffix <=> other_name.suffix if result == 0
    result = prefix <=> other_name.prefix if result == 0
    result
  end
  
end
