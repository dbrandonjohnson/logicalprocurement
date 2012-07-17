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

class PunchinController < ApplicationController
  @@section_title = 'Coupa Punchout Server'

  before_filter :authorize_action, :except => [ :setup, :start, :po, :invalid_credentials, :override_session ]
  
  verify :method => :post, :only => [ :setup, :po ],
         :redirect_to => { :controller => :user, :action => :home }

  def setup
    begin
      # parse setup request
      document = REXML::Document.new(request.raw_post)

      # validate request
      operation = document.elements["cXML/Request/PunchOutSetupRequest"].attributes["operation"]
      raise StandardError.new("Operation not supported") unless operation == "create"

      domain = document.elements["cXML/Header/Sender/Credential"].attributes["domain"]
      raise StandardError.new("Sender credential domain not supported") unless domain == "CoupaLogin"

      identity = document.text("cXML/Header/Sender/Credential/Identity")
      raise StandardError.new("No sender identity") unless identity
      
      secret = document.text("cXML/Header/Sender/Credential/SharedSecret")
      raise StandardError.new("No shared secret") unless secret
      
      user = User.authenticate(identity, secret)
      raise StandardError.new("Login failed") unless user

      checkout_url = document.text("cXML/Request/PunchOutSetupRequest/BrowserFormPost/URL")
      raise StandardError.new("Invalid buyer form post location") unless URI::regexp(['http','https']).match(checkout_url)
      
      buyer_cookie = document.text("cXML/Request/PunchOutSetupRequest/BuyerCookie")
      raise StandardError.new("No buyer cookie") unless buyer_cookie

      @punchin_session = PunchinSession.find_or_create_by_user_id_and_buyer_cookie(user.id, buyer_cookie)
      @punchin_session.start_page = url_for :action => 'start', :id => user.id, :t => user.generate_security_token(1), :b => buyer_cookie, :only_path => false
      @punchin_session.checkout_url = checkout_url
      @punchin_session.buyer_cookie = buyer_cookie
      @punchin_session.save
    rescue
      @error = $!
    end
    
    headers['Content-Type'] = 'text/xml'
    render :action => 'setup_response', :layout => false
  end

  def po 
    begin 
      document = REXML::Document.new(request.raw_post)  
       
      # Single strings indicate the element is required 
      # Hash items indicate that the associated items are required attributes 
      required_elements = [ 'cXML/Header/Sender/Credential/SharedSecret', 
                            'cXML/Header/Sender/Credential/Identity', 
                            'cXML/Request/OrderRequest',  
                            { 'cXML/Request/OrderRequest/OrderRequestHeader' => [ 'orderID', 'type' ] },  
                            'cXML/Request/OrderRequest/OrderRequestHeader/ShipTo',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/ShipTo/Address',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/ShipTo/Address/Name',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/ShipTo/Address/PostalAddress',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/ShipTo/Address/PostalAddress/DeliverTo',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/ShipTo/Address/PostalAddress/Street',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/ShipTo/Address/PostalAddress/City',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/ShipTo/Address/PostalAddress/State',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/ShipTo/Address/PostalAddress/PostalCode',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/ShipTo/Address/PostalAddress/Country',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/BillTo/Address',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/BillTo/Address/PostalAddress',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/BillTo/Address/PostalAddress/Street',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/BillTo/Address/PostalAddress/City',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/BillTo/Address/PostalAddress/State',  
                            'cXML/Request/OrderRequest/OrderRequestHeader/BillTo/Address/PostalAddress/PostalCode', 
                            { 'cXML/Request/OrderRequest/ItemOut' => [ 'quantity', 'lineNumber' ] } 
                          ] 
       
      # Required elements per item 
      required_item_elements = [ 'ItemID', 
                                'ItemID/SupplierPartID', 
                                'ItemDetail', 
                                'ItemDetail/UnitPrice', 
                                'ItemDetail/Description', 
                                'ItemDetail/UnitOfMeasure', 
                                { 'ItemDetail/Classification' => [ 'domain' ] } 
                              ] 
       
      validate_elements = Proc.new { |element_set, document| 
        element_set.each { |element| 
          if element.is_a?(Hash) 
            element.values[0].each { |attribute| raise StandardError.new("Element "+element.keys[0]+" missing attribute "+attribute) if !document.elements[element.keys[0]].attributes[attribute] } 
          else 
            raise StandardError.new("Element "+element+" missing") unless document.text(element) 
          end 
        } 
      } 
      
      validate_elements.call(required_elements, document) 
      validate_elements.call(required_item_elements, document.elements['cXML/Request/OrderRequest/ItemOut']) 
    rescue 
      @error = $! 
    end  
 
    headers['Content-Type'] = 'text/xml' 
    render :action => 'po_response', :layout => false 
  end 
  
  def start
    @title = @@section_title
    redirect_to :action => 'invalid_credentials' unless user = User.authenticate_by_token(params[:id], params[:t]) and @punchin_session = PunchinSession.find_by_user_id_and_buyer_cookie(user.id, params[:b])
    unless session[:user]
      session[:user] = user
      session[:user].logged_in_at = Time.now
      session[:user].save
      session[:punchout] = true
    end
    if session[:user] == user and session[:punchout]
      payload = render_to_string :partial => 'order_message'
      @urlencoded_data = CGI.escape(payload)
      @base64_data = Base64.encode64(payload)
    end
    @punchin_session.destroy
    headers['Content-Type'] = 'text/html'
  end
  
  def override_session
    session[:user] = nil
    redirect_to params.merge(:action => 'start')
  end
  
  def keep_session
    redirect_to :back
  end
  
  def invalid_credentials
    @title = @@section_title
  end
end
