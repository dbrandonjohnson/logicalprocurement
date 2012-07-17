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

class OrderHeader < ActiveRecord::Base
  include AddressesHelper
  belongs_to :supplier
  belongs_to :pcard
  has_many :order_lines
  belongs_to :ship_to_address, :class_name => 'Address', :foreign_key => 'ship_to_address_id'
  belongs_to :ship_to_user, :class_name => 'User', :foreign_key => 'ship_to_user_id'
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  include Attachable
  has_many :events, :class_name => 'OrderEventHistory'
  
  # attr_protected :status
  
  # validates_presence_of :status
  # validates_presence_of :order_lines, :if => Proc.new {|oh| !oh.status || (oh.status != 'draft')}
  
  acts_as_versioned_set :include => :order_lines, :if => Proc.new { |header|
    %w(created sent acknowledged).include?(header.current_state.to_s)    
  }  do
      def total
        self.order_lines.inject(nil){|t,r| r.total + t }
      end
    end
  
  acts_as_state_machine :column => :status, :initial => :draft
  
  state :draft, :enter => Proc.new {|r| r.events.create(:status => 'draft') }
  state :currency_hold
  state :supplier_hold
  state :created, :enter => Proc.new {|r| r.events.create(:status => 'created') },
                  :after => Proc.new { |r| r.send! }
  state :sent, :enter => Proc.new { |r|
                                    begin
                                      r.supplier.send_po_approval(r)                         
                                      r.events.create(:status => 'sent') 
                                    rescue
                                      false
                                    end
                                    true
                                  }
  state :cancelled, :enter => Proc.new {|r|
                                          r.transaction do
                                            r.order_lines.inject(true) do |success,line|
                                              line.cancel!
                                              success = success && (line.current_state == :cancelled)
                                            end
                                            r.events.create(:status => 'cancelled')
                                            r.supplier.send_po_cancellation(r)
                                          end
                                        }
  state :acknowledged, :enter => Proc.new {|r| r.events.create(:status => 'acknowledged') }
  state :closed, :enter => Proc.new {|r| r.events.create(:status => 'closed') }
  event :create do
    transitions :to => :supplier_hold, :from => [:draft,:currency_hold,:supplier_hold], :guard => Proc.new {|r| r.supplier.on_hold }
    transitions :to => :created, :from => [:draft,:currency_hold,:supplier_hold], :guard => Proc.new {|r|
      r.transaction { r.order_lines.find(:all).all?(&:create!) }
    }
  end

  event :place_on_currency_hold do
    transitions :to => :currency_hold, :from => :draft
  end

  event :send do
    transitions :to => :sent, :from => :created, :guard => :sendable?
  end

  event :cancel do
    transitions :to => :cancelled, :from => [:created,:sent,:acknowledged], :guard => :cancellable?
  end

  event :acknowledge do
    transitions :to => :acknowledged, :from => [:created,:sent]
  end

  event :unacknowledge do
    transitions :to => :sent, :from => :acknowledged
  end
  
  event :close do
    transitions :to => :closed, :from => [:created,:sent,:acknowledged]
  end

  def authorize(user)
    true
  end
  
  def total
    order_lines.find_all.inject(nil){|t,r| r.total + t}
  end

  def sendable?
    !(self.supplier.po_method == 'none')
  end

  def cancellable?
    order_lines.inject(true){|isc,ol| isc && ol.receipts.empty?}
  end

  def bill_to_name
    if pcard
      pcard.name
    else 
      order_lines.first.account ? 
        order_lines[0].account.account_type.primary_contact.fullname :
        ''      
    end
  end

  def bill_to_info
    if pcard
      pcard.number
    else 
      order_lines.first.account ?
        address_to_string(order_lines[0].account.account_type.primary_address):
        ''
    end
  end
  
  def ship_to_attention
    self.ship_to_address.attention.blank? ? self.ship_to_user.fullname : self.ship_to_address.attention
  end

  def self.create_from_req(req)
    orders = []
    order_header = nil
    cur_supplier_id = -1
    cur_contract_id = -1
    cur_currency_id = -1
    for line in req.requisition_lines.find(:all, :include => :catalog_item, :order => "requisition_lines.contract_id, requisition_lines.currency_id")
      # create one PO per supplier/contract/currency combination on the req
      if ((line.supplier_id != cur_supplier_id) || 
          (line.contract_id != cur_contract_id) || 
          (line.currency_id != cur_currency_id))
        cur_supplier_id = line.supplier_id
        cur_contract_id = line.contract_id
        cur_currency_id = line.currency_id
        if order_header
          order_header.without_revision do
            order_header.create!
            if order_header.current_state == :created
              begin
                # send it!
                order_header.send!
                req.place_order!
              rescue
                # raise an admin task here
                logger.debug("PO Send failed:")
                logger.debug($!)
              end
            end
          end
        end
        orders << (order_header = OrderHeader.new(:supplier_id => line.supplier_id, 
                                       :ship_to_user => req.requested_by, 
                                       :ship_to_address => req.ship_to_address,
                                       :supplier_view_key => Digest::SHA1.hexdigest("#{line.supplier.name}#{Time.now}#{line.id}#{req.ship_to_address}")[0..99],
                                       :pcard_id => req.pcard_id
                                       ))
        if req.attachment_links
          req.attachment_links.find_all_by_intent('Supplier').each do |link|
            order_header.attachment_links.build(:attachment => link.attachment, :intent => link.intent)
          end
        end
        worked = order_header.save
        if !worked
          logger.debug("header not saved: #{order_header.status} #{order_header.errors.full_messages.join(',')}}")
        end
      end
      OrderLine.create_from_req_line(line,order_header)
    end
    if order_header
      order_header.without_revision do
        order_header.create!
        if order_header.current_state == :created
          begin 
            order_header.send!
            req.place_order!
          rescue
            # raise an admin task here
            logger.error("PO Send failed:")
            logger.error($!)
          end
        end
      end
    end
    return orders
  end

  def editable?
    [:created,:sent,:acknowledged].index(self.current_state)
  end
  
end
