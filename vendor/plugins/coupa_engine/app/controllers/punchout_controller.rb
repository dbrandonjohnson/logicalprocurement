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

class PunchoutError < StandardError
end

class PunchoutParseError < StandardError
end

class PunchoutController < ApplicationController
  @@section_title = "Punchout"
  
  before_filter :authorize_action, :except => [ :checkout, :checkout_test, :related ]

  verify :method => :post, :only => [ :destroy, :create, :update, :checkout, :checkout_test ],
         :redirect_to => { :action => :list }

  auto_complete_for :supplier, :name

  def index
    list
    render :action => 'list'
  end

  def list
    @title = "#{@@section_title}: Punchout Sites"
    @site_pages, @sites = paginate :punchout_sites, :per_page => 10
  end

  def new
    @site ||= PunchoutSite.new
    @supplier = @site.contract.supplier if @site.contract
    @contracts = @supplier.nil? ? [] : @supplier.contracts.find_all_by_status("published")
    @title = "#{@@section_title}: Create Punchout Site"
  end
  
  def create
    tags = params[:site].delete("tag_list")
    @site = PunchoutSite.new(params[:site])
    if @site.save
      @site.update_attribute("tag_list", tags) unless tags.blank?
      redirect_to :action => "list"
    else
      new
      render :action => "new"
    end
  end
  
  def edit
    @site ||= PunchoutSite.find(params[:id])
    @supplier = @site.contract.supplier if @site.contract
    @contracts = @supplier.nil? ? [] : @supplier.contracts.find_all_by_status("published")
    @title = "#{@@section_title}: Editing Site '#{@site.name}'"
  end
  
  def update
    @site = PunchoutSite.find(params[:id])
    @site.attributes = params[:site]
    if @site.save
      flash[:notice] = "Punchout Site '#{@site.name}' has been updated"
      redirect_to :action => 'list'
    else
      edit
      render :action => 'edit'
    end
  end
  
  def destroy
    @site = PunchoutSite.find(params[:id])
    @site.destroy
    flash[:notice] = "Punchout Site '#{@site.name}' has been deleted"
    redirect_to :back
  end

  def go
    @site = PunchoutSite.find(params[:id])
    begin
      redirect_to @site.punchout(url_for(:action => 'checkout', :id => @site.id, :only_path => false))
      return
    rescue
      @error = $!
      @title = "#{@@section_title}: Connect"
    end
    render :action => 'test'
  end
    
  def test
    @site = PunchoutSite.find(params[:id])
    begin
      redirect_to @site.punchout(url_for(:action => 'checkout_test', :id => @site.id, :only_path => false))
      return
    rescue
      @error = $!
      @title = "#{@@section_title}: Test"
    end
  end
  
  def related
    @search_term = params[:id]
    @sites = @search_term.blank? ? [] : PunchoutSite.find_tagged_with(@search_term.gsub('"',''))
    render_without_layout :action => 'related'
  end
  
  def checkout_test
    @title = "#{@@section_title}: Test: Checkout"

    unless session[:user]
      render :action => 'login'
      return
    end

    if params[:user]
      if params[:user][:login] and params[:user][:password] and user = User.authenticate(params[:user][:login], params[:user][:password])
        session[:user] = user
        session[:user].logged_in_at = Time.now
        session[:user].save
        session[:punchout] = false
        flash[:notice] = 'Successfully authenticated'
      else
        flash[:notice] = 'Failed authentication'
        render :action => 'login'
        return
      end
    end

    @site = PunchoutSite.find(params[:id])
    @urlencoded_errors = @base64_errors = []
    if params['cxml-urlencoded']
      begin
        lines = parse_order_message(CGI.unescape(params['cxml-urlencoded']))
        lines.each { |l| l.update_total }
        @urlencoded_header = RequisitionHeader.new
        @urlencoded_header.requisition_lines << lines
      rescue SecurityError
        render :action => 'login'
        return
      rescue
        @urlencoded_errors << $!
      end
    end
    
    if params['cxml-base64']
      begin
        lines = parse_order_message(Base64.decode64(params['cxml-base64']))
        lines.each { |l| l.update_total }
        @base64_header = RequisitionHeader.new
        @base64_header.requisition_lines << lines
      rescue SecurityError
        render :action => 'login'
        return
      rescue
        @base64_errors << $!
      end
    end
  end
  
  def checkout
    @title = "#{@@section_title}: Checkout"
    
    if params[:user]
      if params[:user][:login] and params[:user][:password] and user = User.authenticate(params[:user][:login], params[:user][:password])
        session[:user] = user
        session[:user].logged_in_at = Time.now
        session[:user].save
        session[:punchout] = false
        flash[:notice] = 'Successfully authenticated'
      else
        flash[:notice] = 'Failed authentication'
        render :action => 'login'
        return
      end
    end
    
    unless session[:user]
      render :action => 'login'
      return
    end
    
    @site = PunchoutSite.find(params[:id])
    @errors = []
    @header = RequisitionHeader.find_or_create_by_requested_by_and_status(session[:user].id, 'cart')
    lines = []
    begin
      if params['cxml-base64']
        lines = parse_order_message(Base64.decode64(params['cxml-base64']))
        @header.requisition_lines << lines
      elsif params['cxml-urlencoded']
        lines = parse_order_message(CGI.unescape(params['cxml-urlencoded']))
        @header.requisition_lines << lines
      else
        raise PunchoutParseError.new("No checkout data received")
      end
      @header.save
    rescue SecurityError
      render :action => 'login'
      return
    rescue
      @errors << $!
    end
    
    if @errors.empty?
      flash[:notice] = "Added #{lines.size} punchout items to your shopping cart"
      redirect_to :controller => 'user', :action => 'home'
    end
  end
  
  # this action should only be rendered by checkout and checkout_test
  def login
    redirect_to :controller => 'user', :action => 'home'
  end
  
  def update_contract_selector
    supplier = Supplier.find_by_name(params[:supplier_name])
    @contracts = supplier.nil? ? [] : Contract.find_all_by_supplier_id_and_status(supplier.id, 'published', :order => 'name ASC', :conditions => ['start_date <= ? AND end_date > ?', Time.now, Time.now])
    render(:update) { |page| page['contract_selector'].reload }
  end
  
  protected
  def parse_order_message(order_message)
    lines = []
    document = REXML::Document.new(order_message)
    buyer_cookie = document.text('cXML/Message/PunchOutOrderMessage/BuyerCookie')
    raise PunchoutParseError.new("No Buyer Cookie") unless buyer_cookie
    raise PunchoutParseError.new("Invalid Buyer Cookie") unless punchout_session = PunchoutSession.find_by_buyer_cookie(buyer_cookie)
    raise PunchoutParseError.new("Wrong Buyer Cookie") unless punchout_session.punchout_site == @site
    raise SecurityError.new("Wrong User") unless punchout_session.user == session[:user] and !session[:punchout]
    
    document.elements.each('cXML/Message/PunchOutOrderMessage/ItemIn') do |e|
      attributes = Hash.new
      attributes[:description] = e.text("ItemDetail/Description")
      raise PunchoutParseError.new("No description found for item #{lines.size+1}") unless attributes[:description]
      
      attributes[:source_part_num] = e.text('ItemID/SupplierPartID')
      raise PunchoutParseError.new("No supplier part ID found for item '#{attributes[:description]}'") unless attributes[:source_part_num]
      
      attributes[:quantity] = e.attributes['quantity']
      raise PunchoutParseError.new("No quantity found for item '#{attributes[:description]}'") unless attributes[:quantity]
      raise PunchoutParseError.new("Invalid quantity '#{attributes[:quantity]}' for item '#{attributes[:description]}'") unless attributes[:quantity].to_f > 0
      
      unit_price_element = e.elements['ItemDetail/UnitPrice/Money']
      raise PunchoutParseError.new("No unit price element found for item '#{attributes[:description]}'") unless unit_price_element
      
      attributes['unit_price(1)'] = unit_price_element.text
      raise PunchoutParseError.new("Invalid unit price '#{attributes['unit_price(1)']}' for item '#{attributes[:description]}'") unless attributes['unit_price(1)'].to_f > 0
      
      attributes['unit_price(2)'] = unit_price_element.attributes['currency']
      raise PunchoutParseError.new("No currency found for item '#{attributes[:description]}'") if attributes['unit_price(2)'].nil?
      raise PunchoutParseError.new("Invalid currency '#{attributes['unit_price(2)']}' found for item '#{attributes[:description]}'") unless Currency.find_by_code(attributes['unit_price(2)'])
      
      uom_code = e.text("ItemDetail/UnitOfMeasure")
      raise PunchoutParseError.new("No unit of measure found for item '#{attributes[:description]}'") unless uom_code
      raise PunchoutParseError.new("Invalid unit of measure '#{uom_code}' for item '#{attributes[:description]}'") unless attributes[:uom] = Uom.find_by_code(uom_code)
      
      attributes[:punchout_site] = @site
      attributes[:contract] = @site.contract
      attributes[:supplier] = @site.contract.supplier
      
      lines << RequisitionQuantityLine.new(attributes)
    end
    
    raise PunchoutParseError.new("No items found") if lines.empty?
    return lines
  end
end
