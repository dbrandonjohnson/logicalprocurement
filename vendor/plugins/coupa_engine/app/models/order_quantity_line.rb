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

class OrderQuantityLine < OrderLine
  before_save :update_total
  
  validates_presence_of :quantity, :uom
  validates_numericality_of :quantity
  validates_each :quantity,  :allow_nil => true do |record, attrib, value|
    pattern = Regexp.new('^\d+'+(record.uom.allowable_precision > 0 ? '\.[\d]{0,'+record.uom.allowable_precision.to_s+'}$' : '\.0$'))
    record.errors.add(attrib, "precision must match UOM (#{record.uom.allowable_precision.to_s})") unless value.to_s =~ pattern
    record.errors.add(attrib, "must be a positive number") unless value > 0
  end
  
  def self.create_from_req_line(req_line,amt = :all)
    OrderQuantityLine.new(:item_id => req_line.item_id,
      :description => req_line.description,
      :need_by_date => req_line.need_by_date,
      :supplier_id => req_line.supplier_id,
      :quantity => (amt.is_a?(Symbol) && amt == :all) ? req_line.quantity : amt,
      :uom_id => req_line.uom_id,
      :price => req_line.unit_price,
      :currency_id => req_line.currency_id,
      :total => (amt.is_a?(Symbol) && amt == :all) ? req_line.total : (amt.to_f * req_line.unit_price),
      :currency_id => req_line.currency_id,
      :contract => req_line.contract,
      :account_id => req_line.requisition_header.account_id,
      :accounting_total_currency_id => req_line.requisition_header.account.account_type.currency_id,
      :accounting_total => req_line.total.convert_to(req_line.requisition_header.account.account_type.currency,
      :source_part_num => req_line.source_part_num))
  end

  def update_total
    if (quantity.nil? || uom.nil?)
      write_attribute('total',0)
    else
      write_attribute('total', ((price || Money.new(0,currency)) * formatted_quantity).amount)
    end
  end
  
  def derive_received
    self.receipts.find(:all).sum(&:quantity)
  end
  
  def remaining
    rcvd = self.received || 0
    if self.quantity >= rcvd
      self.quantity.to_f - rcvd
    else
      0
    end
  end
  
  def quantity_editable?
    self.editable?
  end

  def type_icon
    'basket.png'
  end
  
end
