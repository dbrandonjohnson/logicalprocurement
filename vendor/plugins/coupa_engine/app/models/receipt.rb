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

class Receipt < ActiveRecord::Base
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  belongs_to :receivable, :polymorphic => true
  belongs_to :currency
  composed_of :unit_price, :class_name => 'Money', :mapping => [%w(unit_price amount),%w(currency_id currency_id)]
  validates_presence_of :receipt_date
  
  def self.create_from_order_line(order_line, amt = :all)
    if order_line.kind_of?(OrderQuantityLine)
      ReceiptQuantity.create_from_order_line(order_line,amt)
    elsif order_line.kind_of?(OrderAmountLine)
      ReceiptAmount.create_from_order_line(order_line,amt)
    end
  end
end