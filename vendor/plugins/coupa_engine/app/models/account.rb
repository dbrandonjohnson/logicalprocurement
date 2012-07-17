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

class Account < ActiveRecord::Base
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  belongs_to :account_type

  acts_as_ferret :fields => [:code, :account_type_name], :remote => true
  
  validates_presence_of :account_type, :segment_1
  
  validates_each :segment_1, :segment_2, :segment_3, :segment_4, :segment_5,
   :segment_6, :segment_7, :segment_8, :segment_9, :segment_10,
   :segment_11, :segment_12, :segment_13, :segment_14, :segment_15,
   :segment_16, :segment_17, :segment_18, :segment_19, :segment_20 do |record, attribute, value|
     ft = record.account_type.send("#{attribute}_field_type")
     record.errors.add attribute, "#{attribute} can not be populated for this account type." unless ft || !value
     record.errors.add attribute, "The value entered for \"#{attribute.to_s.humanize} - #{ft.name}\" is invalid.  The proper format for this segment is /#{ft.validation_regex}/." unless ft.nil? || Regexp.new("^#{ft.validation_regex}$") =~ value
     record.errors.add attribute, "#{attribute} is required for this account type." unless ft.nil? || !value.nil?
  end

  def to_s
    self.code
  end
    
  def code
    [segment_1, segment_2, segment_3, segment_4, segment_5,
     segment_6, segment_7, segment_8, segment_9, segment_10,
     segment_11, segment_12, segment_13, segment_14, segment_15,
     segment_16, segment_17, segment_18, segment_19, segment_20].compact.join('-')
  end
  
  def segments
    [segment_1, segment_2, segment_3, segment_4, segment_5,
     segment_6, segment_7, segment_8, segment_9, segment_10,
     segment_11, segment_12, segment_13, segment_14, segment_15,
     segment_16, segment_17, segment_18, segment_19, segment_20]
   end
   
   def account_type_name
     account_type.name
   end
end
