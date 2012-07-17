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

class ReceiptQuantity < Receipt  
  belongs_to :uom
  validates_presence_of :quantity, :uom
  validates_numericality_of :quantity
  validates_each :quantity, :allow_nil => true do |record, attrib, value|
    pattern = Regexp.new('^\d+'+(record.uom.allowable_precision > 0 ? '\.[\d]{0,'+record.uom.allowable_precision.to_s+'}$' : '\.0$'))
    record.errors.add(attrib, "precision must match UOM (#{record.uom.allowable_precision.to_s})") unless value.to_s =~ pattern
    record.errors.add(attrib, "must be a positive number") unless value > 0
  end

  def self.create_from_order_line(order_line, amount = :all)
    amount = order_line.remaining if amount == :all
    receipt = ReceiptQuantity.new(
      :quantity => amount,
      :unit_price => order_line.price,
      :uom => order_line.uom,
      :total => amount.to_f * order_line.price.amount,
      :receipt_date => Time.now
    )
    order_line.receipts << receipt if receipt.valid?
    receipt
  end
end
