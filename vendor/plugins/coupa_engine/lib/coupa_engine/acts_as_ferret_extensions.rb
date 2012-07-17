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

module ActsAsFerret
  module Remote::Config
    # backported http://projects.jkraemer.net/acts_as_ferret/changeset/175
    # remove when this makes it to the stable gem
    class << self
      def load_with_default(file = "#{RAILS_ROOT}/config/ferret_server.yml")
        (File.exists?(file) && load_without_default(file)) || {}
      end
      alias_method_chain :load, :default
    end
  end
  
  module ActMethods
    # backported http://projects.jkraemer.net/acts_as_ferret/changeset/180
    # remove when this makes it to the stable gem
    def acts_as_ferret_with_force_local(options={}, ferret_options={})
      options.delete(:remote) if ENV['FERRET_USE_LOCAL_INDEX']
      acts_as_ferret_without_force_local(options, ferret_options)
    end
    alias_method_chain :acts_as_ferret, :force_local
  end
end