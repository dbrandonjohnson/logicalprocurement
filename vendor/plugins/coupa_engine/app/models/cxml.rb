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

require 'net/https'

class CXML < ActiveForm
  attr_accessor :url, :domain, :identity, :secret, :destination_domain, :destination_identity, :protocol
  validates_presence_of :url, :domain, :identity, :secret, :destination_domain, :destination_identity, :protocol

  # Just a random string
  @@mime_boundary = 'mimepart_34908340983198718771';
  cattr_accessor :mime_boundary

  def initialize(params)
    params.each { |k,v| self.send("#{k}=",v) }
  end
  
  def punchout(checkout_url,session_cookie)
    return unless valid?
    uri = URI.parse(url)
    conn = Net::HTTP.new(uri.host, uri.port)
    conn.use_ssl = uri.scheme.eql?("https")
    conn.start do |http|
      response = http.post(uri.path, setup_request(checkout_url,session_cookie), {'Content-Type' => 'text/xml'}).body
      document = REXML::Document.new(response)

      status = document.elements["cXML/Response/Status"]
      raise StandardError.new("No status element in setup response: #{response}") unless status

      code, text = [status.attributes["code"], status.attributes["text"]]
      raise StandardError.new("Setup request failed: #{code} #{text}") unless code == "200"

      start_page = document.text("cXML/Response/PunchOutSetupResponse/StartPage/URL")
      raise StandardError.new("No punchout start page in setup response") unless start_page

      return start_page
    end
  end

  def deliver_po_to_supplier(po)
    return unless valid?
    uri = URI.parse(url)
    conn = Net::HTTP.new(uri.host, uri.port)
    conn.use_ssl = uri.scheme.eql?("https")
    conn.start do |http|
      # Uncomment this for multipart forms
      #      response = http.post(uri.path, order_request(po), {'Content-Type' => 'multipart/form-data;boundary="'+mime_boundary+'"'}).body
      response = http.post(uri.path, order_request(po), {'Content-Type' => 'text/xml'}).body
      document = REXML::Document.new(response)

      status = document.elements["cXML/Response/Status"]
      raise StandardError.new("No status element in setup response: #{response}") unless status
      
      code, text = [status.attributes["code"], status.attributes["text"]]
      raise StandardError.new("PO failed: #{code} #{text}") unless code == "200"
    end
  end

  def setup_request(checkout_url,session_cookie)
    xml = Builder::XmlMarkup.new(:indent => 2) 
    xml.instruct!
    xml.declare! :DOCTYPE, :cXML, :SYSTEM, "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd"
    xml.cXML(:'xml:lang' => "en-US", :payloadID => "#{Time.now.to_f}@#{`hostname`.chomp}", :timestamp => Time.now) do

      header(xml)

      xml.Request do
        xml.PunchOutSetupRequest(:operation => "create") do
          xml.BuyerCookie(session_cookie)
          xml.BrowserFormPost do
            xml.URL(checkout_url)
          end
        end
      end
    end
    xml.target!
  end

  def order_request(po)
    company_key = Setup.find_by_key('company name')
    bill_to_user_name = ''
    bill_to_user_name += company_key.value+" " unless company_key.blank?
    bill_to_user_name += "Attn: #{po.bill_to_name}"
    # Map some variables explicitly here.. this is only for readability
    if po.order_lines[0].contract
      bill_to_address = po.order_lines[0].contract.bill_to_address
    else
      bill_to_address = po.order_lines[0].account.account_type.primary_address
    end

    xml = Builder::XmlMarkup.new(:indent => 2)
    xml.instruct!
    xml.declare! :DOCTYPE, :cXML, :SYSTEM, "http://xml.cxml.org/schemas/cXML/1.2.014/cXML.dtd"
    xml.cXML(:'xml:lang' => "en-US", :payloadID => "#{Time.now.to_f}@#{`hostname`.chomp}", :timestamp => Time.now.iso8601) do

      # <Header>
      header(xml)
      # </Header>

      xml.Request do
        xml.OrderRequest do

          # <OrderRequestHeader>
          xml.OrderRequestHeader(:orderID => po.id.to_s, :orderDate => po.created_at.iso8601, :type => 'new') do
            xml.Total { money(xml, po.total) }
            xml.ShipTo { address(xml, po.ship_to_address, po.ship_to_user.fullname, po.ship_to_user.email) }
            xml.BillTo { address(xml, bill_to_address, bill_to_user_name) }

            if po.pcard
              xml.Payment do
                xml.PCard(:number => po.pcard.number, :expiration => po.pcard.expiry, :name => po.pcard.name)
              end
            end
          end
          # </OrderRequestHeader>

          # <ItemOut>
          po.order_lines.each { |line| item_line(xml, line) }
          # </ItemOut>
        end
      end
    end
  end

  private

  def header(parent_xml)
    parent_xml.Header do
      parent_xml.From do
        parent_xml.Credential(:domain => domain) do
          parent_xml.Identity(identity)
        end
      end
      parent_xml.To do
        parent_xml.Credential(:domain => destination_domain) do
          parent_xml.Identity(destination_identity)
        end
      end
      parent_xml.Sender do
        parent_xml.Credential(:domain => domain) do
          parent_xml.Identity(identity)
          parent_xml.SharedSecret(secret)
        end
        parent_xml.UserAgent("Coupa Procurement 1.0")
      end
    end
  end

  # Address --> cXML Address
  def address(parent_xml, address, username = '', email = '')
    parent_xml.Address do
      parent_xml.Name(address.name, 'xml:lang' => 'en')

      # Optional elements
      parent_xml.PostalAddress(:name => 'default') do
        parent_xml.DeliverTo(username) unless username.blank?
        parent_xml.Street(address.street1)
        parent_xml.Street(address.street2)
        parent_xml.City(address.city)
        parent_xml.State(address.state)
        parent_xml.PostalCode(address.postal_code)
        parent_xml.Country(address.country.name, :isoCountryCode => address.country.id)
      end

      parent_xml.Email(email, :name => 'default') unless email.blank?
    end
  end

  # Money --> cXML Money
  def money(parent_xml, obj)
    currency_code = obj.currency.nil? ? "USD" : obj.currency.code
    parent_xml.Money(obj.amount, :currency => currency_code)
  end

  # OrderLine --> cXML Order
  def item_line(parent_xml, line)
    parent_xml.ItemOut(:quantity => line.quantity.to_i.to_s, :lineNumber => line.line_num.to_s) do
      parent_xml.ItemID do
        parent_xml.SupplierPartID(line.source_part_num)
      end
      parent_xml.ItemDetail do
        parent_xml.UnitPrice { money(parent_xml, line.price) }
        parent_xml.Description(line.description, :'xml:lang' => 'en')
        parent_xml.UnitOfMeasure(line.uom.code)
        parent_xml.Classification('unknown', :domain => 'UNSPSC')
      end
      parent_xml.Distribution do
        parent_xml.Accounting(:name => line.account.name) do
          account_field_types = line.account.account_type.segment_field_types
          line.account.segments.each_with_index { |segment,index|
            parent_xml.Segment(:type => account_field_types[index].name, :id => segment, :description => account_field_types[index].code) unless segment.nil?
          }
        end
        parent_xml.Charge { money(parent_xml, line.total) }

        # If there's an attachment, add a link in comments
#        line.attachments.each { |attachment| 
#          parent_xml.Comments do
#            parent_xml.Attachment do
#              parent_xml.URL('cid: '+attachment.id.to_s)
#            end
#          end
#        }
      end
    end
  end
end
