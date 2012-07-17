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

require 'action_controller/test_process'

module ActionController
  class MailerController < ActionController::Base
    @@default_settings = {:host => 'localhost', :port => 3000}
    cattr_accessor :default_settings
    
    attr_accessor :settings
    
    def initialize(options = {})
      @settings = @@default_settings.merge(options)
      # Here we access the internal representation of :attr_internal to modify the request.
      # This is *BAD*, however setting the request through the mutator was not working... so there ya go.
      @_request = TestRequest.new
      @_response = TestResponse.new
      @_request.host = @settings.delete(:host)
      @_request.port = @settings.delete(:port)
    end
    
    def url_for(options = {}, *parameters_for_method_reference)
      @url ||= UrlRewriter.new(@_request, {})
      super(settings.merge(options), parameters_for_method_reference)
    end
  end
end