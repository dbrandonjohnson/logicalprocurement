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

class OrderHeaderTest < Test::Unit::TestCase
  fixtures :requisition_headers, :requisition_lines,
    :order_headers, :order_header_versions, :order_lines, :order_line_versions,
    :accounts, :account_types, :currencies, :exchange_rates, :suppliers, :uoms

  def get_order_header
    OrderHeader.find_in_state(:first, :created, :order => 'created_at DESC')
  end

  def test_approve_req_header
    requisition_header = RequisitionHeader.find_by_status('pending_approval')
    requisition_header.approve!
    assert_equal :ordered, requisition_header.current_state
    assert_equal :created, requisition_header.requisition_lines.first.order_line.order_header.current_state
  end

  def test_order_lines_reader
    header = get_order_header
    lines = header.order_lines
    assert_kind_of Array, lines
    lines.each do |line|
      assert_kind_of OrderLine, line
      assert_equal header.id, line.order_header_id
    end
  end
end
