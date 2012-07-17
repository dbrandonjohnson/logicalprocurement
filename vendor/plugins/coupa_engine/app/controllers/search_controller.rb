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

class SearchController < ApplicationController

TOKEN="0"
skip_before_filter :authorize_action, :only => [ :header ]

def header
  if params[:search_string]
    @search_string = params[:search_string]
  end
  
  render :layout => false
end

def tag
  redirect_to :controller => 'catalog_items', :action => 'tags_search', :id => params[:search]
end

# need to scope the search, dispatch it to the various engines, and display the results
def results
  # 1 - scoping
  # this depends on search keywords and current location
  # TODO later - configurable ordering & keywords, translatability
  @search_term = params[:search]
  case @search_term
    when /(po|order|purchase order):(.*)/i
      logger.debug("PO search: #{$+}")
    when /(req|requisition):(.*)/i
      logger.debug("Req search: #{$+}")
    when /(policy|policies|how-to-buy|how to buy|how):(.*)/i
      logger.debug("Policy search: #{$+}")
      redirect_to :controller => "policies", :action => "search", :q => $+
      return
    when /tags?:(.*)/i
      logger.debug("Tag search: #{$+}")
    when /ask:(.*)/i
      logger.debug("Ask search: #{$+}")
      redirect_to :controller => "ask", :action => "search", :q => $+
      return
  end
  #2 - dispatching
  search_catalog
end

def browse_by_supplier
    @catalog_item_pages, @catalog_items = paginate :catalog_item, :per_page => 9, :include => :contract, 
      :conditions => ['contracts.status = \'published\' '+
        'AND contracts.preferred_flag = ? ' +
        'AND contracts.supplier_id = ? '+
        'AND contracts.start_date <= ? '+
        'AND contracts.end_date > ? ',true,params[:id],Time.now,Time.now]
    @policies = []
    @requisition_header = RequisitionHeader.find_by_requested_by(session[:user].id, :conditions => 'status = \'cart\'', :order => 'created_at DESC')
    
    contracts = Contract.find_all_by_supplier_id(params[:id])
    if contracts.size > 0
      @sites = PunchoutSite.find(:all,:conditions => ['contract_id in (?)',contracts.collect{|con| con.id}])
    else
      @sites = []
    end
    render :action => 'results'
end

protected
helper :catalog_items

def search_catalog
  @search_term = params[:search] || ''
  #get rid of illegal characters that'll screw up ferret searches
  @search_term.gsub!(/\!/,'')
  page = (params[:page] ||= 1).to_i
  items_per_page = 9
  offset = (page - 1) * items_per_page
  if /tag:(\w+)|tag:"(.+)"/i =~ @search_term
    @search_term = $+  # take this part out of the generic search
    tag_search = true
  else
    @search_term.gsub!(/"/,'') # get rid of quotes for now
  end
  @catalog_items = CatalogItem.find_tagged_with(@search_term)
  @catalog_items.concat(CatalogItem.find_by_contents(@search_term, :limit => :all)) unless tag_search
  @catalog_items.uniq!
  @catalog_items.select do |item|
    item.contract.published? &&
    item.contract.start_date <= Time.now &&
    item.contract.end_date > Time.now
  end
  @catalog_item_pages = Paginator.new self, @catalog_items.length, items_per_page, page
  @catalog_items = @catalog_items[offset..(offset + items_per_page - 1)]
  
  # Add policies, req line templates, punchout sites, and a default policy
  if @search_term.blank?
    @policies = {}
  else
    @policies = Policy.find_tagged_with(@search_term.gsub('"',''))
    @policies.concat(Policy.find_by_contents('name:' + @search_term)) unless tag_search
    @policies.uniq!
  end
  if @search_term.blank?
    @requisition_line_templates = {}
  else
    @requisition_header = RequisitionHeader.find_by_requested_by(session[:user].id, :conditions => 'status = \'cart\'', :order => 'created_at DESC')
  end
  
  @sites = @search_term.blank? ? [] : PunchoutSite.find_tagged_with(@search_term.gsub('"',''))

  if @sites.size == 0 && @policies.size == 0 && @catalog_items.size == 0 && (dpid = Setup.find_by_key('default_policy')) && dpid && dpid.value && !dpid.value.blank?
    @policies = [Policy.find(dpid.value)]
  end

end

def amazon_search(term)
  resp = Net::HTTP.get(URI.parse("http://webservices.amazon.com/onca/xml?Service=AWSECommerceService&AWSAccessKeyId=#{TOKEN}&Operation=ItemSearch&SearchIndex=Blended&ResponseGroup=Small,Offers,Images,EditorialReview,Reviews&Keywords=#{URI.escape(term)}"))
  doc = REXML::Document.new resp
  #logger.debug(resp)
  doc.elements.each('ItemSearchResponse/Items/Item') { |i| create_or_update_from_amazon_xml(i) }
end

def create_or_update_from_amazon_xml(item)
  pn = ''
  item.elements.each('ASIN'){ |t| pn = t.get_text.value }
  catalog_item = CatalogItem.find_or_create_by_source_part_num(pn)
  if !catalog_item.cached_at || (catalog_item.cached_at.to_date < (DateTime.now.to_date << 1).to_date) # only update if the cache is more than a month old
    catalog_item.cached_at = DateTime.now
    catalog_item.uom_id = 1
    catalog_item.contract = Contract.find_first()
    item.elements.each('ItemAttributes/Title'){ |t| catalog_item.name = t.get_text.value }
    item.elements.each('OfferSummary/LowestNewPrice/Amount'){ |t| catalog_item.list_price = (t.get_text.value.to_f / 100) }
    catalog_item.description = "<ul>"
    item.elements.each('ItemAttributes/Feature'){ |t| catalog_item.description = catalog_item.description + "<li>#{t.get_text.value}" }
    catalog_item.description = catalog_item.description + "</ul>"
    item.elements.each('EditorialReviews/EditorialReview') do |t|
      t.elements.each('Source') { |u| catalog_item.description = catalog_item.description + "<h4>#{u.get_text.value}</h4>" }
      t.elements.each('Content') { |u| catalog_item.description = catalog_item.description + "<p>#{u.get_text.value}</p>" }    
    end
    item.elements.each('MediumImage/URL') do |t|
      filename =  File.join(RAILS_ROOT,'public','images','tmp','temp.jpg')
      if /\/([._0-9A-Za-z]+\.jpg)$/ =~ t.get_text.value
        filename = File.join(RAILS_ROOT, 'public', 'images', 'tmp', $1)
      end
      logger.debug("Trying to save #{filename}")
      file = open(filename, "wb")
      resp = Net::HTTP.get(URI.parse(t.get_text.value))
      file << resp
      file.close
      catalog_item.image = file
    end
    catalog_item.save
    #delete any already existing amazon reviews so we don't have dupes
    catalog_item.product_reviews.delete(catalog_item.product_reviews.find(:all,:conditions => "source_id = 1"))
    item.elements.each('CustomerReviews/Review') do |t|
      p = catalog_item.product_reviews.build(:source_id => 1, :reviewer => 'Amazon')
      t.elements.each('Summary'){ |u| p.title = u.get_text.value[0..99] }
      t.elements.each('Content'){ |u| p.text = u.get_text.value }    
      t.elements.each('Rating'){ |u| p.rating = u.get_text.value.to_i * 20 }
      t.elements.each('Date'){ |u| p.reviewed_at = DateTime.parse(u.get_text.value) }
      catalog_item.evaluate_avg_rating_add(p)
      #catalog_item.product_reviews << p
    end
    catalog_item.save
  end
end

end