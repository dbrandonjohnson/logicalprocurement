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

class CIF
  HEADER_RE = %r{\s*(\w+):\s*(.+?)\s*$}
  DATA_RE = %r{\s*(\"?)(.+?)\s*\1\s*(,|$)}
  LINE_RE = %r{\s*(.*?)\s*$}
  
  attr_reader(:header, :fields, :items, :parse_error)

  def initialize(data=nil)
    @header = {}
    @fields = []
    @items = []
    parse(data) if data
  end
  
  def ==(other_cif)
    @header == other_cif.header && @fields == other_cif.fields && @items == other_cif.items
  end
  
  alias :eql? :==
  alias :equal? :==

  def parse(data)
    s = StringScanner.new(data)
    @parse_error = catch(:e) do
      # parse header
      throw :e, "Invalid version" unless s.scan /\s*CIF_I_V([\d.]+)\s*\n/ and @header[:VERSION] = s[1] and @header[:VERSION] == '3.0'
      until s.scan /\s*DATA\s*$/
        throw :e, "Could not parse header" unless s.scan HEADER_RE
        @header.store s[1].to_sym, s[2]
      end
      
      # parse field names
      throw :e, "No field names specified" unless @header[:FIELDNAMES]
      f = StringScanner.new(@header[:FIELDNAMES])
      while f.scan DATA_RE
        @fields << f[2]
      end
      
      # parse data
      until s.scan /\s*ENDOFDATA\s*$/
        throw :e, "Could not find the first item" unless s.scan LINE_RE
        l = StringScanner.new(s[1])
        item = {}
        @fields.each do |f|
          throw :e, "Could not parse field ##{item.size + 1} of item ##{@items.size + 1}" unless l.scan DATA_RE
          item.store f, l[2].gsub('""','"')
        end
        @items << item
      end      
    end
    
    @parse_error.nil?
  end
  
  def to_s
    puts "Header:"
    @header.each_pair{ |k,v| puts "#{k} => #{v}" }
    @items.each_with_index do |item,i|
      puts
      puts "Item ##{i+1}:"
      item.each_pair{ |k,v| puts "#{k} => #{v}" }
    end
  end
  
  alias :to_str :to_s
end