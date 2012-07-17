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

class RequisitionLine < ActiveRecord::Base
  belongs_to :requisition_header, :foreign_key => 'header_id'
  has_many   :account_allocations, :as => :allocable
  belongs_to :catalog_item, :foreign_key => 'item_id'
  belongs_to :uom
  belongs_to :order_line
  belongs_to :contract
  belongs_to :supplier
  belongs_to :currency
  belongs_to :punchout_site
  composed_of :unit_price, :class_name => 'Money', :mapping => [%w(unit_price amount),%w(currency_id currency_id)]
  composed_of :total, :class_name => 'Money', :mapping => [%w(total amount),%w(currency_id currency_id)]
  belongs_to :created_by, :class_name => "User", :foreign_key => "created_by"
  belongs_to :updated_by, :class_name => "User", :foreign_key => "updated_by"

  include Attachable
  acts_as_list :scope => :header, :column => "line_num"
  
  attr_protected :status
  
  validates_presence_of :header_id
  validates_presence_of :description, :currency_id, :on => :update

  
  def self.type_icon
    ''
  end
  
  def approvable?
    false
  end

  def valid_backing?
    false
  end

  def valid_supplier?
    false
  end

  def valid_quantity?
    true
  end

  def valid_unit_price?
    true
  end

  def valid_uom?
    true
  end

  def valid_description?
    true
  end

  
  def allow_validation
    self.requisition_header #&& self.requisition_header.status && !['draft','cart'].index(self.requisition_header.status)
  end

  def formatted_quantity
    self.quantity || ''
  end
  
  def formatted_received
    self.received
  end

  def formatted_remaining
    self.remaining
  end

  def received
    if self.order_line && self.order_line.received
      self.order_line.received
    else
      0
    end
  end

  def receive(amt = :all)
    self.order_line.receive(amt) if self.order_line
  end

  def fully_received?
    self.received >= self.total
  end

  def update_received
    self.requisition_header.receive!
  end
  
  def order(amt = :all)
    ol = OrderLine.create_from_req_line(self,amt)
    if ol.valid?
      self.requisition_header.requisition_lines << ol
    end
    ol
  end
  
  def remaining
    rcvd = self.received
    if self.order_line && self.order_line.quantity && (self.order_line.status != 'cancelled') && self.order_line.quantity > rcvd
      self.order_line.quantity - rcvd
    else
      0
    end
  end
  
  def lead_time
    if associated = self.punchout_site || self.catalog_item
      associated.lead_time
    end
  end
  
  def update_need_by_date
    return true if lead_time.nil?
    new_need_by_date = Time.now + lead_time.days
    self.need_by_date = new_need_by_date if self.need_by_date.nil? || self.need_by_date < new_need_by_date
  end
  
  def update_need_by_date!
    return true if lead_time.nil?
    update_need_by_date && save
  end
  
  def editable?
    self.requisition_header.editable?
  end
  
  def type_editable?
    self.editable? && !self.catalog_item && !self.punchout_site_id
  end
  
  def description_editable?
    self.editable? && !self.catalog_item && !self.punchout_site_id
  end
  
  def uom_editable?
    self.editable? && !self.catalog_item && !self.punchout_site_id
  end

  def unit_price_editable?
    self.editable? && !self.catalog_item && !self.punchout_site_id
  end

  def currency_editable?
    self.editable? && !self.catalog_item && !self.punchout_site_id
  end
  
  def supplier_editable?
    self.editable? && !self.catalog_item && !self.punchout_site_id
  end
  
  def display_line_num
    self[:line_num]
  end
  
  protected
  def method_missing(method_symbol, *parameters)#:nodoc:
    case method_symbol.id2name
    when /^([a-z_]\w+)_editable\?/
      self.editable?
    else 
      super
    end  
  end
end
