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

class RequisitionQuantityLine < RequisitionLine
  before_save :update_total
  
  validates_presence_of :quantity, :uom_id, :if => :allow_validation, :on => :update
  validates_numericality_of :quantity, :if => :allow_validation, :on => :update
  validates_each :quantity,  :allow_nil => true, :on => :update, :if => Proc.new {|line| line.uom} do |record, attrib, value|
    if record.uom
      pattern = Regexp.new('^\d+'+(record.uom.allowable_precision > 0 ? '\.[\d]{0,'+record.uom.allowable_precision.to_s+'}$' : '\.0$'))
      record.errors.add(attrib, "precision must match UOM (#{record.uom.allowable_precision.to_s})") unless value.to_s =~ pattern
    end
    record.errors.add(attrib, "must be a positive number") unless value > 0
  end
  
  def update_total
    if (quantity.nil? || uom.nil?)
      write_attribute('total',0)
    else
      write_attribute('total', ((unit_price || Money.new(0,currency)) * formatted_quantity).amount)
    end
  end

  def formatted_quantity
    if !uom || !quantity
      quantity
    elsif uom.allowable_precision == 0
      quantity.prec_i
    else
      (quantity*(10^uom.allowable_precision).round.prec_f)/(10^uom.allowable_precision)
    end
  end

  def formatted_quantity=(val)
    quantity=val
  end
    
  def fully_received?
    self.received >= self.quantity
  end

  def remaining
    rcvd = self.received
    if !rcvd
      self.quantity
    elsif self.quantity > rcvd
      self.quantity - rcvd
    else
      0
    end
  end  
    
  def approvable?
    valid_unit_price? &&
    valid_description? &&
    valid_uom? &&
    valid_quantity? &&
    valid_supplier? &&
    valid_backing?
  end

  def valid_unit_price?
    !unit_price.blank? 
  end

  def valid_description?
    !description.blank? 
  end

  def valid_uom?
    !uom.blank? 
  end

  def valid_quantity?
    !quantity.blank? 
  end

  def valid_supplier?
    (!supplier.blank? && (supplier.status == 'active' || !Setup.find_or_create_by_key('route_to_buyer_on_draft_supplier').value)) 
  end

  def valid_backing?
    (!contract.blank? || released_by_buyer || !Setup.find_or_create_by_key('route_to_buyer_on_no_contract').value)
  end
  
  class << self
    def type_icon
      'basket.png'
    end
  end
  
end
