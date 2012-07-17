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
require 'form_responses_controller'

# Re-raise errors caught by the controller.
class FormResponsesController; def rescue_action(e) raise e end; end

class FormResponsesControllerTest < Test::Unit::TestCase
  fixtures :roles,:users,:users_roles,:form_responses

  def setup
    @controller = FormResponsesController.new
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

    assert_not_nil assigns(:form_responses)
  end

  def test_show
    get :show, :id => 1

    assert_response :success
    assert_template 'show'

    assert_not_nil assigns(:form_responses)
    assert assigns(:form_responses).valid?
  end

  def test_new
    get :new

    assert_response :success
    assert_template 'new'

    assert_not_nil assigns(:form_responses)
  end

  def test_create
    num_form_responses = FormResponses.count

    post :create, :form_responses => {}

    assert_response :redirect
    assert_redirected_to :action => 'list'

    assert_equal num_form_responses + 1, FormResponses.count
  end

  def test_edit
    get :edit, :id => 1

    assert_response :success
    assert_template 'edit'

    assert_not_nil assigns(:form_responses)
    assert assigns(:form_responses).valid?
  end

  def test_update
    post :update, :id => 1
    assert_response :redirect
    assert_redirected_to :action => 'show', :id => 1
  end

  def test_destroy
    assert_not_nil FormResponses.find(1)

    post :destroy, :id => 1
    assert_response :redirect
    assert_redirected_to :action => 'list'

    assert_raise(ActiveRecord::RecordNotFound) {
      FormResponses.find(1)
    }
  end
end
