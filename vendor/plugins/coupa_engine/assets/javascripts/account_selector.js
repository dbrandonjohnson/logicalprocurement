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

function capture_account_data(textElem,selectedElem) {
    var nodes = document.getElementsByClassName('accode', selectedElem) || [];
    if(nodes.length>0) {
        nodes = document.getElementsByClassName('acid', selectedElem) || [];
        if(nodes.length>0) value = Element.collectTextNodes(nodes[0], 'acid');
        $(textElem.id+'_id').value = value;    
    } 
    else {
        $(textElem.id+'_id').value = null;    
    }
}
Rules['.acaccount'] = function(element,event) {
    new Ajax.Autocompleter(element.id,element.id+'_auto_complete','/accounts/auto_complete',
        {afterUpdateElement:capture_account_data, paramName:'id', indicator:element.id+'_wait',
         select:'accode'});
};
