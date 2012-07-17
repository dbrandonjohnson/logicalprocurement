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
require 'suppliers_controller'

# Re-raise errors caught by the controller.
class SuppliersController; def rescue_action(e) raise e end; end

class SuppliersControllerTest < Test::Unit::TestCase
  fixtures :roles,:users,:users_roles,:suppliers,:addresses,:contacts

  def setup
    @controller = SuppliersController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new
    login(:users_001)
  end

  def test_index
    get :index
    assert_response :success
    assert_template 'list'
  end

  def test_list
    get :list

    assert_response :success
    assert_template 'list'

    assert_not_nil assigns(:suppliers)
  end

  def test_show
    get :show, :id => 1

    assert_response :success
    assert_template 'show'

    assert_not_nil assigns(:supplier)
    assert assigns(:supplier).valid?
  end

  def test_new
    get :new

    assert_response :success
    assert_template 'new'

    assert_not_nil assigns(:supplier)
  end

  def test_create
    num_suppliers = Supplier.count

    post :create, :supplier => {}

    assert_response :redirect
    assert_redirected_to :action => 'list'

    assert_equal num_suppliers + 1, Supplier.count
  end

  def test_edit
    get :edit, :id => 1

    assert_response :success
    assert_template 'edit'

    assert_not_nil assigns(:supplier)
    assert assigns(:supplier).valid?
  end

  def test_update
    post :update, :id => 1
    assert_response :redirect
    assert_redirected_to :action => 'show', :id => 1
  end

  def test_destroy
    assert_not_nil Supplier.find(1)

    post :destroy, :id => 1
    assert_response :redirect
    assert_redirected_to :action => 'list'

    assert_raise(ActiveRecord::RecordNotFound) {
      Supplier.find(1)
    }
  end
end
