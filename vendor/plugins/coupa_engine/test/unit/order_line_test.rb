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

require File.dirname(__FILE__) + '/../test_helper'

class OrderLineTest < Test::Unit::TestCase
  fixtures :requisition_headers, :requisition_lines,
    :order_headers, :order_header_versions, :order_lines, :order_line_versions,
    :accounts, :account_types, :currencies, :exchange_rates, :suppliers, :uoms

  def get_order_header
    OrderHeader.find_in_state(:first, :created, :order => 'created_at DESC')
  end

  def test_order_header_reader
    header = get_order_header
    lines = header.order_lines
    lines.each do |line|
      assert_not_nil line.order_header
      assert_equal header.id, line.order_header.id
      assert_equal header.version, line.order_header.version
    end
  end
  
  def test_change_tracked_field
    header = get_order_header
    lines = header.order_lines
    line = lines.first
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    new_line = new_lines.first
    new_line.update_attribute(:quantity, line.quantity + 1)
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    new_line = new_lines.first
    assert_equal line.quantity + 1, new_line.quantity
    assert_equal line.version + 1, new_line.version
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    new_line = new_lines.first
    new_line.update_attribute(:price, line.price + Money.new(1, line.currency))
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    new_line = new_lines.first
    assert_equal line.price + Money.new(1, line.currency), new_line.price
    assert_equal line.version + 1, new_line.version
  end
  
  def test_change_untracked_field
    header = get_order_header
    lines = header.order_lines
    line = lines.first
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    new_line = new_lines.first
    new_line.update_attribute(:supplier_id, Supplier.find(:first).id)
    
    new_header = get_order_header
    new_lines = new_header.order_lines
    new_line = new_lines.first
    assert_equal Supplier.find(:first).id, new_line.supplier_id
    assert_equal line.version, new_line.version
  end
end
