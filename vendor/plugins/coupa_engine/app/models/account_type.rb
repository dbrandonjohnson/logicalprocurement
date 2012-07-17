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

class AccountType < ActiveRecord::Base
  belongs_to :primary_contact, :class_name => 'Contact', :foreign_key => 'primary_contact_id'
  belongs_to :primary_address, :class_name => 'Address', :foreign_key => 'primary_address_id', :include =>:country
  belongs_to :currency
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  
  validates_associated :primary_contact, :primary_address

  belongs_to :segment_1_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_1_field_type_id'
  belongs_to :segment_2_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_2_field_type_id'
  belongs_to :segment_3_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_3_field_type_id'
  belongs_to :segment_4_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_4_field_type_id'
  belongs_to :segment_5_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_5_field_type_id'
  belongs_to :segment_6_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_6_field_type_id'
  belongs_to :segment_7_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_7_field_type_id'
  belongs_to :segment_8_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_8_field_type_id'
  belongs_to :segment_9_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_9_field_type_id'
  belongs_to :segment_10_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_10_field_type_id'
  belongs_to :segment_11_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_11_field_type_id'
  belongs_to :segment_12_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_12_field_type_id'
  belongs_to :segment_13_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_13_field_type_id'
  belongs_to :segment_14_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_14_field_type_id'
  belongs_to :segment_15_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_15_field_type_id'
  belongs_to :segment_16_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_16_field_type_id'
  belongs_to :segment_17_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_17_field_type_id'
  belongs_to :segment_18_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_18_field_type_id'
  belongs_to :segment_19_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_19_field_type_id'
  belongs_to :segment_20_field_type, :class_name => 'AccountFieldType', :foreign_key => 'segment_20_field_type_id'

  validates_presence_of :name, :currency, :segment_1_field_type
  validates_length_of :name, :maximum => 50
  validates_uniqueness_of :name

  validates_each :segment_1_field_type do |record, attribute, value|
      found_nil = false
      gap = false
      (1..20).each do |x|
        unless found_nil
          found_nil = record.send("segment_#{x}_field_type").nil?
        else
          gap = gap || !record.send("segment_#{x}_field_type").nil?
        end
      end
      if gap
        record.errors.add "There can not be a gap in the sequence."
      end
      #check that any existing accounts with this type still validate
      if record.id
        conflict_count = 0
        Account.find(:all,:conditions => ['account_type_id = ?',record.id]).each do |acct|
          acct.account_type = record
          conflict_count = conflict_count + 1 unless acct.valid?
        end
        if conflict_count > 0
          record.errors.add_to_base "These changes cause #{conflict_count} existing accounts to be invalid."
        end
      end
  end
  
  def segment_field_types
    [self.segment_1_field_type,self.segment_2_field_type,self.segment_3_field_type,self.segment_4_field_type,
     self.segment_5_field_type,self.segment_6_field_type,self.segment_7_field_type,self.segment_8_field_type,
     self.segment_9_field_type,self.segment_10_field_type,self.segment_11_field_type,self.segment_12_field_type,
     self.segment_13_field_type,self.segment_14_field_type,self.segment_15_field_type,self.segment_16_field_type,
     self.segment_17_field_type,self.segment_18_field_type,self.segment_19_field_type,self.segment_20_field_type].compact
  end
  
  def to_s
    name
  end
end
