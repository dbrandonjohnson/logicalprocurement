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

class RequisitionAmountLine < RequisitionLine
  composed_of :received, :class_name => 'Money', :mapping => [%w(received amount),%w(currency_id currency_id)]
  validates_presence_of :unit_price, :if => :allow_validation, :on => :update
  validates_numericality_of :unit_price, :if => :allow_validation, :on => :update
  
  before_save :update_total

  include Attachable

  def update_total
    write_attribute 'total', (unit_price.amount || 0)
  end
  
  def self.type_icon
    'money.png'
  end
  
  def approvable?
    valid_unit_price? &&
    valid_description? &&
    valid_supplier? &&
    valid_backing?
  end

  def valid_unit_price?
    !unit_price.blank?
  end

  def valid_description?
    !description.blank?
  end

  def valid_supplier?
    !supplier.blank? 
  end

  def valid_backing?
    released_by_buyer || !contract.blank? || !Setup.find_or_create_by_key('route_to_buyer_on_no_contract').value
  end
  
  def received
    self.order_line.received || Money.new(0, self.currency) if self.order_line
  end

  def formatted_received
    self.received
  end
  
  def remaining
    rcvd = self.received
    if self.unit_price && self.unit_price > rcvd
      self.unit_price - rcvd
    else
      Money.new(0,self.currency)
    end
  end

  def formatted_amount
    self.unit_price
  end
  
  def quantity_editable?
    false
  end

  def uom_editable?
    false
  end
  
  def catalog_item_editable?
    false
  end
  
  def fully_received?
    
    self.received >= self.unit_price
  end
end
