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

class ExchangeRatesController < ApplicationController
  require 'soap/wsdlDriver'
  
  data_table :exchange_rate, [{:key => :from_currency, :alignment => 'center', :sort_clause => 'currencies.code', :sql_column => 'currencies.code', :render_text => "<%= value %>"},
                              :rate, 
                              {:key => :to_currency, :alignment => 'center', :sort_clause => 'to_currencies_exchange_rates.code', :sql_column => 'to_currencies_exchange_rates.code'}, 
                              :rate_date],
                              {:find_options => {:include => [:from_currency,:to_currency], :order => 'rate_date DESC, created_at DESC'}}

  before_filter :check_multiple_currencies, :only => [ :new ]
  
  def index
    list
    render :action => 'list'
  end
  
  def list
    @title = 'Exchange Rates'
    @tstr = render_exchange_rate_table
  end
  
  def new
    @title = 'New Exchange Rate'
    @exchange_rate = ExchangeRate.new
    @exchange_rate.rate_date = Date.today
  end
  
  def create
    @exchange_rate = ExchangeRate.new(params[:exchange_rate].delete_if{|k,v| k == "to_currency" || k == "from_currency"})
    if @exchange_rate.save
      flash[:notice] = 'Exchange rate successfully created.'
      redirect_to :action => 'index'
    else
      @title = 'New Exchange Rate'
      render :action => 'new'
    end
  end
  
  def auto_complete_for_exchange_rate_from_currency
    @currencies = Currency.find(:all,
      :conditions => [ 'LOWER(code) LIKE ? AND enabled_flag = ?',
      '%' + params[:id] + '%', true ])
    # just show the code, but bring back the rest of the stuff we need, too.
    render :inline => '<% currencies = @currencies.map { |entry| content_tag("li",'+
      '"<span class=\"acid\" style=\"display:none\">#{entry.id}</span>'+
      '<span class=\"acname\">#{entry.code}</span> (#{entry.name})") } %><%=content_tag("ul", currencies) %>'
  end
  
  def auto_complete_for_exchange_rate_to_currency
    auto_complete_for_exchange_rate_from_currency
  end
  
  def bulk_loader
    @data_source = DataFileSource.new
    @title = "Bulk Load Exchange Rates"
  end
  
  def list_csv
    exchange_rates = ExchangeRate.find(:all)
    output = ""
    CSV::Writer.generate(output) do |csv|
      csv << ["Action*","ID","From Currency**","From Currency ID**","To Currency**","To Currency ID**","Rate*","Rate Date*"]
      if params[:template_only].nil? || !params[:template_only]
        exchange_rates.each do |exc|
          csv << [nil,exc.id,exc.from_currency.code,exc.from_currency.id,exc.to_currency.code,exc.to_currency.id,exc.rate,exc.rate_date]
        end
      end
    end
    headers["Content-Type"] = "text/csv"
    headers["Content-Disposition"] = "attachment; filename=\"exchange_rate_list.csv\""
    render_without_layout :text => output
  end
  
  def load_file
    @data_source = DataFileSource.new(params[:data_source])
    @data_source.source_for = 'ExchangeRate'
    if @data_source.save
      begin
        job_key = MiddleMan.new_worker(:class => :exchange_rate_loader_worker,
                            :args => { :user => User.current_user.id, :data => @data_source.id })
        @data_source.update_attributes(:job_key => job_key)
      rescue ActiveRecord::StaleObjectError
        @data_source.reload
        @data_source.update_attributes(:job_key => job_key)
      rescue
        flash[:warning] = "Can't connect to the background processor."
        redirect_to :controller => 'data_sources', :action => 'index'
      end
    else
      @title = "Bulk Load Exchange Rates"
      render :action => 'bulk_loader'
      return
    end
    @title = "Loading Exchange Rates"
  end

  def load_progress
    @data_source = DataSource.find(params[:id])
    progress_percent = MiddleMan.get_worker(@data_source.job_key).progress
    render :update do |page|
      page.call('progressPercent', 'progress_bar', progress_percent.round)        
      page.redirect_to( :controller => 'data_sources', :action => 'index')   if progress_percent >= 100
    end
  end
  
  def get_rates
    factory = SOAP::WSDLDriverFactory.new("http://www.newyorkfed.org/markets/fxrates/WebService/v1_0/FXWS.wsdl")
    the_fed = factory.create_rpc_driver
    document = REXML::Document.new(the_fed.getAllLatestNoonRates)
    rates = document.elements.each('UtilityData/frbny:DataSet/frbny:Series') do |rate|
      # create the forward and reverse rates - these are mid rates, and the base isn't always USD
      ExchangeRate.new(:from_currency_id => Currency.find_by_code(rate.attributes['UNIT']).id,
                       :to_currency_id => Currency.find_by_code(rate.elements['frbny:Key/frbny:CURR'].text).id,
                       :rate => rate.elements['frbny:Obs/frbny:OBS_VALUE'].text,
                       :rate_date => Date.parse(rate.elements['frbny:Obs/frbny:TIME_PERIOD'].text)).save
      ExchangeRate.new(:from_currency_id => Currency.find_by_code(rate.elements['frbny:Key/frbny:CURR'].text).id,
                       :to_currency_id => Currency.find_by_code(rate.attributes['UNIT']).id,
                       :rate => 1.to_f/rate.elements['frbny:Obs/frbny:OBS_VALUE'].text.to_f,
                       :rate_date => Date.parse(rate.elements['frbny:Obs/frbny:TIME_PERIOD'].text)).save
    end
    flash[:notice] = 'Loaded exchange rates from the FRBNY'
    redirect_to :action => 'list'
  end

  protected
  # In order to create exchange rates, we must have > 1 currency enabled
  def check_multiple_currencies
    if Currency.find_all_by_enabled_flag(true).size > 1
      true
    else  
      redirect_to :action => 'currencies_needed'
      false
    end
  end
end
