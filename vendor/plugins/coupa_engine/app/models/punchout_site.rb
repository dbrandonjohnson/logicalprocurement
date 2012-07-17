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

# Needed to produce ISO8601 timestamps
require 'time'

class PunchoutSite < ActiveRecord::Base
  acts_as_taggable
  
  belongs_to :created_by, :class_name => 'User', :foreign_key => 'created_by'
  belongs_to :updated_by, :class_name => 'User', :foreign_key => 'updated_by'
  
  belongs_to :contract
  has_many :requisition_lines
  has_many :order_headers
  
  validates_presence_of :name, :url, :domain, :identity, :secret, :sender_domain, :sender_identity, :protocol, :contract_id
  validates_uniqueness_of :name
  validates_each :url do |record, attribute, value|
    next if value.blank?
    record.errors.add attribute, "is not a valid URL" unless URI::regexp(["http","https"]).match(value)
  end

  def punchout(checkout_url)
    return false unless valid?
    cxml_from_self.punchout(checkout_url,self.session.buyer_cookie)
  end
  
  def session(user = User.current_user)
    PunchoutSession.find_or_create_by_user_id_and_punchout_site_id(user.id, self.id)
  end

  private

  def cxml_from_self
    CXML.new(:url => url,
             :domain => sender_domain,
             :identity => sender_identity,
             :destination_domain => domain,
             :destination_identity => identity,
             :secret => secret,
             :protocol => protocol
            )
  end
end
