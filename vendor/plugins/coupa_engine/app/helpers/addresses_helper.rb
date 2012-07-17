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

module AddressesHelper
  def address_to_string(addr)
    str = "#{addr.street1}\n"
    if (addr.street2 != '')
      str = "#{str}#{addr.street2}\n"
    end
    return "#{str}#{addr.city}, #{addr.state} #{addr.postal_code} #{addr.country.name}"
  end

  def address_to_html(addr)
    "#{h addr.street1}<br/>#{h addr.street2}#{addr.street2 != '' ? '<br/>' : ''}"+
    "#{h addr.city}#{addr.city != '' ? ', ' : ''}#{h addr.state} #{h addr.postal_code}<br/>"+
    "#{h addr.country.name}"
  end

  def address_picker_field(object_name, method_name, options = {})
    field_root = derive_field_root(object_name, method_name)
    locals = {:object_name => object_name, :method_name => method_name, :highlight => false}.merge(options).merge(field_root)
    render :partial => 'addresses/picker_field', :locals => locals
  end
end
