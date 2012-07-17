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

module CatalogItemsHelper
  def image_url(item)
    begin
      return url_for_file_column(item, "image") || 'na.png'
    rescue
      return 'na.png'
    end
  end
  
  def catalog_item_selector(object,method,tag_options = {},completion_options = {})
    text_field_selector(object,method,tag_options,completion_options)
  end
end
