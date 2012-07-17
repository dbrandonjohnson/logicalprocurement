/*
  Copyright (C) 2007  Coupa Software Incorporated http://www.coupa.com
  
  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License along
  with this program; if not, write to the Free Software Foundation, Inc.,
  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

function show_account_picker(root) {
    dojo.html.insertCssText('#'+root+'_picker { width: 200px; }');
    dojo.widget.byId(root+'_picker').show();
}

function close_account_picker(root) {
    dojo.widget.byId(root+'_picker').hide();
    dojo.widget.byId(root+'_picker').destroy();
}

function select_account(root, account_id) {
    $(root+'_id').value = account_id;
    $(root).innerHTML = $(root+'_'+account_id).innerHTML;
    dojo.widget.byId(root+'_picker').hide();
}

function update_account_picker(root) {
    new Ajax.Updater(root+'_picker', '/accounts/picker', {
        postBody: $H({ root: root }).toQueryString()
    })
}