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

class AdminStructure < Blueprint::Container
  define do
    node 'headers' do
      header 'Company Setup' do
        node 'links' do
          link 'Company information', :link_to => {:controller => 'administration', :action => 'company'}
          link 'Users', :link_to => {:controller => 'user', :action => 'list'}
          link 'Roles', :link_to => {:controller => 'role', :action => 'list'}
          link 'Approvals', :link_to => {:controller => 'approval_limits', :action => 'index'}
          link 'Units of measure', :link_to => {:controller => 'uoms', :action => 'index'}
          link 'Data sources', :link_to => {:controller => 'data_sources', :action => 'index'}
        end
      end
      header 'Financial Setup' do
        node 'links' do
          link 'Accounts', :link_to => {:controller => 'accounts', :action => 'index'}
          link 'Currencies', :link_to => {:controller => 'currencies', :action => 'index'}
          link 'Exchange rates', :link_to => {:controller => 'exchange_rates', :action => 'index'}
        end
      end
      header 'Content Control' do
        node 'links' do
          link 'Public tags', :link_to => {:controller => 'tag', :action => 'admin'}
          link 'Reported employee reviews', :link_to => {:controller => 'objections', :action => 'list'}
          link '\'Ask an Expert\' categories', :link_to => {:controller => 'ask', :action => 'categories'}
          link 'RSS feed', :link_to => {:controller => 'administration', :action => 'feeds'}
        end
      end
      header 'Suppliers' do
        node 'links' do
          link 'Suppliers', :link_to => {:controller => 'suppliers', :action => 'list'}
          link 'Contracts', :link_to => {:controller => 'contracts', :action => 'list'}
          link 'Catalog items', :link_to => {:controller => 'catalog_items', :action => 'list'}
          link 'Punchout sites', :link_to => {:controller => 'punchout', :action => 'list'}
        end
      end
      header 'Purchasing Tools' do
        node 'links' do
          link 'Manage requisitions', :link_to => {:controller => 'requisition_headers', :action => 'index', :filter => 1}
          link 'Manage purchase orders', :link_to => {:controller => 'order_headers', :action => 'index'}
          link 'Buying policies', :link_to => {:controller => 'policies', :action => 'list'}
        end
      end
    end
    node 'administration_home_columns' do
      administration_home_column 'first' do
        node 'headers' do
          header 'Company Setup'
          header 'Financial Setup'
        end
      end
      administration_home_column 'second' do
        node 'headers' do
          header 'Purchasing Tools'
          header 'Suppliers'
        end
      end
      administration_home_column 'third' do
        node 'headers' do
          header 'Content Control'
        end
      end
    end
  end
end
