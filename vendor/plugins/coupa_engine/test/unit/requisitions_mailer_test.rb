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

require File.dirname(__FILE__) + '/../test_helper'
require 'requisitions_mailer'

class RequisitionsMailerTest < Test::Unit::TestCase
  FIXTURES_PATH = File.dirname(__FILE__) + '/../fixtures'
  CHARSET = "utf-8"

  include ActionMailer::Quoting

  fixtures :accounts, :addresses, :approvals, :approval_limits, :catalog_items, :contracts, :countries, :currencies, :suppliers, :uoms, :users
  
  def setup
    ActionMailer::Base.delivery_method = :test
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.deliveries = []

    @expected = TMail::Mail.new
    @expected.set_content_type "text", "plain", { "charset" => CHARSET }
  end

  def test_receive
    RequisitionsMailer.receive(read_fixture("order_two_catalog_items"))
    deliveries = ActionMailer::Base.deliveries
    assert_equal 2, deliveries.size
    assert_equal "Approval Request for Seggy Umboh - Requisition #1", deliveries[0].subject
    assert_match "Requisition #1 created", deliveries[1].subject
    assert_equal :pending_approval, RequisitionHeader.find(1).current_state
  end

  def test_email_template
  end
  
  def test_request_entered
  end
  
  def test_request_failed
  end

  private
    def read_fixture(action)
      IO.read("#{FIXTURES_PATH}/requisitions_mailer/#{action}")
    end

    def encode(subject)
      quoted_printable(subject, CHARSET)
    end
end
