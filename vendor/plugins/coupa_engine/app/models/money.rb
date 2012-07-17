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

class Money
  include Comparable
  attr_reader :amount, :currency, :currency_id, :estimate, :error_msg
  
  class InvalidCurrencyError < StandardError
  end

  class ExchangeRateUnavailableError < StandardError
  end
  
  class CurrencyMismatchError < StandardError
  end
  
  def initialize(amount, currency = nil, estimate = false, error_msg = nil)
    @estimate = estimate
    @amount = (amount.kind_of?(Numeric) || amount.kind_of?(String)) ? BigDecimal.new(amount.to_s) : BigDecimal.new("0")
    @error_msg = error_msg
    @currency = case
    when currency.is_a?(Currency)
      currency
    when currency.kind_of?(Numeric)
      Currency.find(currency)
    when currency.kind_of?(String)
      /^\d+$/.match(currency) ? Currency.find(currency.to_i) : Currency.find_by_code(currency)
    else
      nil
    end
    @currency_id = self.currency ? self.currency.id : nil
    self.freeze
  end
  
  def +(other_money)
    if other_money.nil? || other_money.zero?
      self.dup
    elsif amount.zero?
      other_money
    elsif currency == other_money.currency
      Money.new(amount + other_money.amount, currency, estimate || other_money.estimate)
    else
      Money.new(amount + other_money.convert_to(currency).amount, currency, true)
    end
  end
  
  def -(other_money)
    if other_money.nil? || other_money.zero?
      self.dup
    elsif currency == other_money.currency
      Money.new(amount - other_money.amount, currency, estimate || other_money.estimate)
    else
      Money.new(amount - other_money.convert_to(currency).amount, currency, true)
    end
  end
  
  def *(fixnum)
    Money.new((amount)*(fixnum),currency)
  end
  
  def /(fixnum)
    Money.new((amount)/(fixnum),currency)
  end
  
  def eql?(other_money)
    amount == other_money.amount && 
    currency == other_money.currency
  end
  
  def zero?
    amount.zero?
  end

  def <=>(other_money)
    if other_money.zero?
      amount <=> 0
    elsif currency == other_money.currency
      amount <=> other_money.amount
    else
      amount <=> other_money.convert_to(currency).amount
    end
  end
  
  def convert_to(other_currency,rate_date = Time.now)
    begin
      if !amount || amount == 0
        return self.dup
      end
      oc = nil
      if currency.nil?
        raise InvalidCurrencyError, "Invalid currency to convert from"
      end
      if other_currency.kind_of? Currency
        oc = other_currency
      elsif other_currency.kind_of? Numeric
        oc = Currency.find(other_currency)
      elsif other_currency.kind_of? String
        oc = Currency.find_by_code(other_currency)
      end
      if oc.nil?
        raise InvalidCurrencyError, "Invalid currency to convert to"
      end
      if currency.id == oc.id
        self.dup
      else
        er = ExchangeRate.find_by_from_currency_id_and_to_currency_id(currency.id,oc.id,:conditions => ['rate_date < ?',rate_date],:order => 'rate_date DESC, created_at DESC')
        if er.nil?
          raise ExchangeRateUnavailableError, "No valid exchange rate found."
        end
        Money.new(er.convert(amount),oc,estimate)
      end
    rescue
      Money.new(self.amount,self.currency,self.estimate,$!.message)
    end
  end
  
  def to_s
    error_msg || "%01.2f" % amount
  rescue
    amount.to_s
  end
end
