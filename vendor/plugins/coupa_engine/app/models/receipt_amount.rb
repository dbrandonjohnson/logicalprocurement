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

class ReceiptAmount < Receipt  
  validates_presence_of :unit_price
  validates_numericality_of :unit_price
  validates_each :unit_price, :allow_nil => true do |record, attrib, value|
    record.errors.add(attrib, "must be a positive number") unless value > 0
  end
  
  def self.create_from_order_line(order_line, amount)
    amount = order_line.remaining if amount == :all
    amount = amount.to_f if amount.is_a?(String)
    amount = Money.new(amount, order_line.currency) if amount.is_a?(Numeric)
    receipt = ReceiptAmount.new(:unit_price => amount, :total => amount, :receipt_date => Time.now)
    order_line.receipts << receipt if receipt.valid?
    receipt
  end
end