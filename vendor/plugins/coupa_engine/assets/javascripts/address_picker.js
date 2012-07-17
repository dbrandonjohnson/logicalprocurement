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

function get_address_page(root, page) {
    $(root+'_pagination_buttons').hide();
    $(root+'_pagination_spinner').show();
    new Ajax.Updater(root+'_picker', '/addresses/picker', {
        postBody: $H({ root: root, page: page }).toQueryString(),
        onComplete: function(request) {
            dojo.widget.byId(root+'_picker').placeDialog();
            $(root+'_pagination_spinner').hide();
            $(root+'_pagination_buttons').show();
        }
    })
}

function show_address_form(root) {
    if ($(root+'_form')) {
        dojo.widget.byId(root+'_picker').hide();
        dojo.widget.byId(root+'_form_dialog').show();
    } else {
        $(root+'_add_button').hide();
        $(root+'_add_spinner').show();
        new Ajax.Updater('tail', '/addresses/dialog_form', { insertion: Insertion.Bottom,
            postBody: $H({ root: root }).toQueryString(),
            onComplete: function(request) {
                $(root+'_add_spinner').hide();
                $(root+'_add_button').show();
                dojo.widget.byId(root+'_picker').hide();
                dojo.html.insertCssText('#'+root+'_form_dialog { width: 400px; }');
                dojo.widget.createWidget(root+'_form_dialog').show();
            }
        })
    }
}

function close_address_form(root) {
    dojo.widget.byId(root+'_form_dialog').hide();
    dojo.widget.byId(root+'_picker').show();
}

function show_address_picker(root) {
    dojo.html.insertCssText('#'+root+'_picker { width: 200px; }');
    dojo.widget.byId(root+'_picker').show();
}

function close_address_picker(root) {
    dojo.widget.byId(root+'_picker').hide();
}

function select_address(root, address_id) {
    $(root+'_id').value = address_id;
    $(root).innerHTML = $(root+'_'+address_id).innerHTML;
    dojo.widget.byId(root+'_picker').hide();
}

function update_address_picker(root) {
    new Ajax.Updater(root+'_picker', '/addresses/picker', {
        postBody: $H({ root: root }).toQueryString()
    })
}
