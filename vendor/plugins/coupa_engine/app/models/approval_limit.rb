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

class ApprovalLimit < ActiveRecord::Base
  belongs_to :currency
  composed_of :amount, :class_name => 'Money', :mapping => [%w(amount amount),%w(currency_id currency_id)]
  validates_presence_of :amount, :currency
  #validates_numericality_of :amount
  validates_uniqueness_of :amount, :scope => :currency_id
  validates_each :amount do |record, attr, value|
    record.errors.add attr, 'must be a positive number.' if !value.amount || value.amount <= 0
  end
end
