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

class AccountFieldType < ActiveRecord::Base
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'

  validates_presence_of :name, :code, :validation_regex
  validates_uniqueness_of :name, :code
  validates_length_of :name, :maximum => 50
  validates_length_of :code, :maximum => 6
  validates_each :validation_regex do |record, attribute, value|
    begin
      if Regexp.new('^'+value+'$') =~ ''
        record.errors.add attribute, "can not match an empty string."
      end
      if value && record.id then # only do this if the type is already saved and the regex is filled in
        conflict_count = 0
        # find account types that use this field type
        AccountType.find_all.each do |at| Array
          cur_field_index = at.segment_field_types.index(record)
          if cur_field_index
            #see if the field still validates
            Account.find(:all, :conditions => ['account_type_id = ?',at.id]).each do |acct|
              at.segment_field_types.each_with_index do |sft,i|
                if (sft.id == record.id) && !(Regexp.new("^#{value}$") =~ acct.send("segment_#{i+1}")) then
                  conflict_count = conflict_count + 1
                end
              end
            end
          end
        end
        if conflict_count > 0
          record.errors.add attribute, "is invalid.  There are #{conflict_count} account segments that would no longer validate."
        end
      end
    rescue
      record.errors.add attribute, "is not a valid regular expression."
    end
  end

end
