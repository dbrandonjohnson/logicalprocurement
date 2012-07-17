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

class Supplier < ActiveRecord::Base
  belongs_to :primary_contact, :class_name => 'Contact', :foreign_key => 'primary_contact_id'
  belongs_to :primary_address, :class_name => 'Address', :foreign_key => 'primary_address_id', :include =>:country
  has_many :address_assignments, :as => :addressable
  has_many :addresses, :through => :address_assignments
  has_many :owned_addresses, :as => :address_owner
  has_many :contracts
  acts_as_tree
  validates_each :parent, :allow_nil => true do |record, attribute, value|
    record.errors.add attribute, "Supplier cannot be in the same tree twice." if record.ancestors.include?(record)
  end
  validates_presence_of :name, :primary_contact, :primary_address
  validates_associated :primary_contact, :primary_address, :message => nil
  validates_inclusion_of :po_method, :in => %w(cxml email none)
  validates_presence_of :cxml_url, :cxml_domain, :cxml_identity, :cxml_supplier_domain, :cxml_supplier_identity, :cxml_secret, :cxml_protocol, :if => Proc.new { |s| s.po_method == 'cxml' } 
  validates_each :cxml_url do |record, attribute, value|
    next if value.blank? || record.po_method != 'cxml'
    record.errors.add attribute, "is not a valid URL" unless URI::regexp(["http","https"]).match(value)
  end

  validates_uniqueness_of :name
  validates_length_of :name, :maximum => 100
  
  attr_protected :status
  acts_as_state_machine :column => :status, :initial => :draft
  state :draft
  state :active
  
  event :publish do
    transitions :from => :draft, :to => :active
  end
  
  def to_s
    name
  end
  
  def orders_on_hold
    OrderHeader.count_by_sql("select count(*) from order_headers where status = 'supplier_hold' and supplier_id = #{self.id}")
  end

  def send_po_approval(po)
    case po_method
      when 'email': ApprovalNotify.deliver_po_to_supplier(nil, po)
      when 'cxml':  cxml_from_self.deliver_po_to_supplier(po)
    end
  end

  def send_po_cancellation(po)
    case po_method
      when 'email' : ApprovalNotify.deliver_po_cancellation_notice_to_supplier(po)
      when 'cxml' : # Can't send CXML cancellations
                    return false
    end
  end

  private
  def cxml_from_self
    CXML.new(:url => cxml_url,
             :domain => cxml_domain,
             :identity => cxml_identity,
             :destination_domain => cxml_supplier_domain,
             :destination_identity => cxml_supplier_identity,
             :secret => cxml_secret,
             :protocol => cxml_protocol
            )
  end
end
