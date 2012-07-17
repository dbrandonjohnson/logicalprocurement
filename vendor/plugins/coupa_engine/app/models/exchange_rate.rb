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

class ExchangeRate < ActiveRecord::Base
  belongs_to :from_currency, :class_name => 'Currency', :foreign_key => 'from_currency_id'
  belongs_to :to_currency, :class_name => 'Currency', :foreign_key => 'to_currency_id'
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  
  validates_presence_of :from_currency_id, :to_currency_id, :rate, :rate_date
  validates_numericality_of :rate
  validates_each :to_currency do |r,a,v|
    r.errors.add(a, "cannot be the same as the from currency") unless r.from_currency_id != r.to_currency_id
  end
  
  def convert(amount)
    amount.to_f*self.rate
  end
end
