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

function capture_supplier_data(textElem,selectedElem) {
    // grab the supplier
    var nodes = document.getElementsByClassName('acname', selectedElem) || [];
    if(nodes.length>0) {
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_info').show();            
        value = Element.collectTextNodes(nodes[0], 'acid');
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_name').innerHTML = value;    
        nodes = document.getElementsByClassName('acid', selectedElem) || [];
        if(nodes.length>0) value = Element.collectTextNodes(nodes[0], 'acid');
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_id').value = value;    
        nodes = document.getElementsByClassName('acemail', selectedElem) || [];
        if(nodes.length>0) value = Element.collectTextNodes(nodes[0], 'acid');
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_email').innerHTML = value;    
        nodes = document.getElementsByClassName('acaddress', selectedElem) || [];
        if(nodes.length>0) value = Element.collectTextNodes(nodes[0], 'acid');
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_address').innerHTML = value;    
        nodes = document.getElementsByClassName('acstatus', selectedElem) || [];
        if(nodes.length>0) {
            value = Element.collectTextNodes(nodes[0], 'acid');
            if (value == 'draft') {
                $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_edit_btn').show();
            }
            else {
                $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_edit_btn').hide();
            }
        }
    } 
    else {
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_id').value = null;    
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_info').hide();            
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_name').innerHTML = '';    
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_email').innerHTML = '';    
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_address').innerHTML = '';
        $(textElem.id.substring(0,textElem.id.length - 8)+'supplier_edit_btn').hide();
    }
}
var show_supplier_form = function(element,event) {
    var root = element.id.substring(0,element.id.length - 8);
    if (element.value.escapeHTML() != $(root+'supplier_name').innerHTML) {
        $(root+'supplier_id').value = null;    
        $(root+'supplier_name').innerHTML = '';    
        $(root+'supplier_email').innerHTML = '';    
        $(root+'supplier_address').innerHTML = '';
        $(root+'supplier_info').hide();                    
        if (element.value && element.value != '') {
            // it wasn't autocompleted
      			new Ajax.Updater('tail', '/suppliers/new_supplier_form',
      			    { insertion:Insertion.Bottom,
      			      onComplete:function(request){ dojo.widget.createWidget('new_supplier_dialog').show() },
      			      postBody: 'update_field_root='+root+'&supplier[name]='+encodeURIComponent(element.value)
      		        });
        }
    }
};
Rules['.acsupplier'] = function(element,event) {
    if (element) {
        new Ajax.Autocompleter(element.id,element.id+'_auto_complete','/suppliers/auto_complete',
            {afterUpdateElement:capture_supplier_data, paramName:'id', indicator:element.id+'_wait',
             select:'acname'});
    }
};
Rules['.acsupplier:blur'] = function(element,event) { setTimeout(function() { show_supplier_form(element,event) }, 250) };
