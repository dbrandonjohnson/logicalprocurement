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

# This modules contains fixes and improvements to the Ruby RTF gem
# http://ruby-rtf.rubyforge.org/

require 'rtf'

module RTF
  class TableNode < RTF::ContainerNode
    # Allow us to use variable sized rows
    def initialize(parent, rows, columns, *widths)
       super(parent) do
          entries = [] 
          if columns.kind_of? Array
            rows.times {|idx|entries.push(TableRowNode.new(self, columns[idx], *widths.first[idx]))}
          else
            rows.times {entries.push(TableRowNode.new(self, columns, *widths))}
          end
          entries
       end
       @cell_margin = 100
    end
  end

  class TableRowNode < RTF::ContainerNode
    # Fix for a spelling error in RTF gem
    # 'trgaph' (table row gap horizontal) is incorrectly named 'tgraph'
    def to_rtf
       text   = StringIO.new
       temp   = StringIO.new
       offset = 0

       text << "\\trowd\\trgaph#{parent.cell_margin}"
       self.each do |entry|
          widths = entry.border_widths
          colour = entry.shading_colour

          text << "\n"
          text << "\\clbrdrt\\brdrw#{widths[0]}\\brdrs" if widths[0] != 0
          text << "\\clbrdrl\\brdrw#{widths[3]}\\brdrs" if widths[3] != 0
          text << "\\clbrdrb\\brdrw#{widths[2]}\\brdrs" if widths[2] != 0
          text << "\\clbrdrr\\brdrw#{widths[1]}\\brdrs" if widths[1] != 0
          text << "\\clcbpat#{root.colours.index(colour)}" if colour != nil
          text << "\\cellx#{entry.width + offset}"
          temp << "\n#{entry.to_rtf}"
          offset += entry.width
       end
       text << "#{temp.string}\n\\row"

       text.string
    end
  end
end
