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

require 'vpim/vcard'
class Contact < ActiveRecord::Base
  composed_of :name, :mapping => [ %w(name_prefix prefix), %w(name_given given), %w(name_additional additional), %w(name_family family), %w(name_suffix suffix), %w(name_fullname fullname) ]
  has_many :address_assignments, :as => :addressable
  has_many :addresses, :through => :address_assignments
  file_column :photo
  attr_human_name 'name_given' => 'First name'
  attr_human_name 'name_family' => 'Last name'
  
  validates_presence_of :name_given, :name_family, :email
  validates_length_of :name_prefix, :maximum => 10, :allow_nil => true
  validates_length_of :name_given, :maximum => 40, :allow_nil => true
  validates_length_of :name_additional, :maximum => 50, :allow_nil => true
  validates_length_of :name_family, :maximum => 40, :allow_nil => true
  validates_length_of :name_suffix, :maximum => 10, :allow_nil => true
  validates_length_of :name_fullname, :maximum => 155, :allow_nil => true
  validates_length_of :email, :maximum => 60, :allow_nil => true
  validates_format_of :email, :with => /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i, :allow_nil => true
  validates_length_of :phone_work, :maximum => 20, :allow_nil => true
  validates_length_of :phone_mobile, :maximum => 20, :allow_nil => true
  
  # Returns the full name of this user.
  def fullname
    (!self.name.fullname || self.name.fullname.empty?) ? self.name.formatted_name : self.name.fullname
  end
  
  def vcf
    card = Vpim::Vcard::Maker.make2 do |maker|
      maker.add_name do |name|
        name.prefix = name_prefix unless name_prefix.blank?
        name.given = name_given unless name_given.blank?
        name.additional = name_additional unless name_additional.blank?
        name.family = name_family unless name_family.blank?
        name.suffix = name_suffix unless name_suffix.blank?
      end

      maker.add_email(email) unless email.blank?

      address_assignments.each {|a|
        maker.add_addr do |addr|
          addr.location = a.address.name
          addr.street = "#{a.address.street1} #{a.address.street2}"
          addr.locality = a.address.city
          addr.region = a.address.state
          addr.postalcode = a.address.postal_code
          addr.country = a.address.country.name
        end
      }

      maker.add_photo do |photo|
        photo.image = File.open(photo.absolute_path).read
        photo.type = ''
      end unless photo.blank?

      maker.add_tel(phone_work) { |t| t.location = 'work' } unless phone_work.blank?

      maker.add_tel(phone_mobile) { |t| t.location = 'cell'} unless phone_mobile.blank?
    end
  end
  
  def create_from_vcf(filename)
    card = Vpim::Vcard.decode(filename).first
    name_prefix = card.name.prefix
    name_given = card.name.given
    name_additional = card.name.additional
    name_family = card.name.family
    name_suffix = card.name.suffix
    #TODO: other contact info
    #TODO: Photo decoding & storage
  end
  
end
