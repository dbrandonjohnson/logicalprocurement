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

class ActiveForm
  #bring back all of the read/write attributes in a hash
  def attributes
    self.instance_variables.inject(Hash.new) { |attrs,var|
      attrs[var[1..-1]]= self.send(var[1..-1]) if self.respond_to?(var[1..-1]) && self.respond_to?(var[1..-1]+'=')
      attrs 
    }
  end
end