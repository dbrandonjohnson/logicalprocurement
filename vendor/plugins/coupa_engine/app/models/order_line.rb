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

class OrderLine < ActiveRecord::Base
  belongs_to :order_header
  belongs_to :catalog_item, :foreign_key => 'item_id'
  belongs_to :contract
  belongs_to :account
  belongs_to :currency
  belongs_to :supplier
  belongs_to :uom
  belongs_to :accounting_total_currency, :class_name => "Currency"
  composed_of :price, :class_name => 'Money', :mapping => [%w(price amount),%w(currency_id currency_id)]
  composed_of :total, :class_name => 'Money', :mapping => [%w(total amount),%w(currency_id currency_id)]
  composed_of :accounting_total, :class_name => 'Money', :mapping => [%w(accounting_total amount),%w(accounting_total_currency_id currency_id)]
  has_one :requisition_line
  include Attachable
  has_many :receipts, :as => :receivable, :dependent => :destroy, :after_add => :update_received
  has_many :account_allocations, :as => :allocable
  
  validates_presence_of :description, :price, :currency_id
  
  acts_as_versioned_set :include => :order_header, :if => Proc.new { |line|
    line.clear_association_cache
    line.order_header.version_condition_met?
  }

  acts_as_list :scope => :order_header, :column => "line_num"
  acts_as_state_machine :column => :status, :initial => :draft
  
  state :draft
  state :currency_hold, :enter => Proc.new{ |line| line.order_header.place_on_currency_hold! }
  state :created
  state :cancelled
  state :partially_received
  state :received
  
  event :create do
    transitions :to => :created, :from => [:draft,:currency_hold], :guard => :update_functional_total
    transitions :to => :currency_hold, :from => :draft
  end

  event :cancel do
    transitions :to => :cancelled, :from => :created
  end
  
  event :receive do
    transitions :to => :received, :from => [:created, :partially_received], :guard => Proc.new{|r| r.fully_received?}
    transitions :to => :partially_received, :from => [:created, :partially_received]
  end

  def update_functional_total
    begin
      self.update_attribute(:accounting_total_currency_id,account.account_type.currency_id)
      self.update_attribute(:accounting_total,self.total.convert_to(account.account_type.currency))
    rescue
      logger.debug("update_functional_total:#{$!}")
      # raise admin task
      return false
    end
    return true
  end

  def update_received(receipt)
    self.received = derive_received
    self.save_without_revision
    self.requisition_line.update_received
  end

  def derive_received
    0
  end

  def self.create_from_req_line(req_line,order_header,amt = :all)
    if req_line.kind_of?(RequisitionQuantityLine)
      nol = OrderQuantityLine.create_from_req_line(req_line,amt)
    elsif req_line.kind_of?(RequisitionAmountLine)
      nol = OrderAmountLine.create_from_req_line(req_line,amt)
    end
    nol.order_header = order_header
    if req_line.attachment_links
      req_line.attachment_links.find_all_by_intent('Supplier').each do |al|
        nol.attachment_links.build(:attachment => al.attachment, :intent => al.intent)
      end
    end
    nol.save
    req_line.order_line = nol
    req_line.save
  end

  def receive(amt = :all)
    Receipt.create_from_order_line(self,amt)
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
  
  def fully_received?
    self.received >= self.total
  end
  
  def editable?
    self.order_header.editable?
  end

  def price_editable?
    self.editable?
  end
  
  def need_by_date_editable?
    self.editable?
  end
  
  protected
  def method_missing(method_symbol, *parameters)#:nodoc:
    case method_symbol.id2name
    when /^([a-z_]\w+)_editable\?/
      false
    else 
      super
    end  
  end
  
end
