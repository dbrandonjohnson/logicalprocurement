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

class OrderAmountLine < OrderLine
  composed_of :received, :class_name => 'Money', :mapping => [%w(received amount), %w(currency_id currency_id)]
  
  before_save :update_total

  def self.create_from_req_line(req_line,amt = :all)
    OrderAmountLine.new(:item_id => req_line.item_id,
      :description => req_line.description,
      :need_by_date => req_line.need_by_date,
      :supplier_id => req_line.supplier_id,
      :price => (amt.is_a?(Symbol) && amt == :all) ? req_line.unit_price : amt,
      :total => (amt.is_a?(Symbol) && amt == :all) ? req_line.unit_price : amt,
      :currency_id => req_line.currency_id,
      :contract => req_line.contract,
      :account_id => req_line.requisition_header.account_id,
      :accounting_total_currency_id => req_line.requisition_header.account.account_type.currency_id,
      :accounting_total => req_line.total.convert_to(req_line.requisition_header.account.account_type.currency))
  end

  def update_total
    write_attribute 'total', (price.amount || 0)
  end

  def derive_received
    self.receipts.find(:all).sum(&:unit_price)
  end

  def remaining
    rcvd = self.received || Money.new(0, self.currency)
    if self.price >= rcvd
      self.price - rcvd
    else
      Money.new(0, self.currency)
    end
  end

  def type_icon
    'money.png'
  end

end