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

class Address < ActiveRecord::Base
  has_many :address_assignments
  belongs_to :country
  belongs_to :address_owner, :polymorphic => true
  attr_human_name 'street1' => 'Line 1'
  attr_human_name 'street2' => 'Line 2'
  
  #validates_uniqueness_of :name, :scope => [:address_owner_id,:address_owner_type], :if => Proc.new {|addr|!addr.address_owner_id.blank?}
  validates_presence_of :street1, :city, :country, :postal_code
end
