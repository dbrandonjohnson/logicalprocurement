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
require 'application'

# Re-raise errors caught by the controller.
class ApplicationController; def rescue_action(e) raise e end; end

class ApplicationControllerTest < Test::Unit::TestCase
  def setup
    @controller = ApplicationController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new
  end

  def test_add_url_params
    assert_equal @controller.add_url_params("", {}), ""
    assert_equal @controller.add_url_params("", { :real => "no" }), "?real=no"
    assert_equal @controller.add_url_params("/slim/shady", {}), "/slim/shady"
    assert_equal @controller.add_url_params("/slim/shady", { :real => "no" }), "/slim/shady?real=no"
    assert_equal @controller.add_url_params("/slim/shady?real=no", {}), "/slim/shady?real=no"
    assert_equal @controller.add_url_params("/slim/shady?real=no", { :real => "yes" }), "/slim/shady?real=yes"
    assert_equal @controller.add_url_params("/slim/shady?real=no", { :real => "yes", :fake => "no" }), "/slim/shady?real=yes&fake=no"
  end
end
