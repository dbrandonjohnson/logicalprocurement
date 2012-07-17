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

Rules['.accatalog_item:blur'] = function(element,event) {
	var root = element.id.substring(0,element.id.length - 11);
	// it wasn't autocompleted, so this is a non-catalog request.  open the add'l info.
	if (!$(root+'item_id').value) {
		if (element.value && !$(root+'more').visible()) {
    		$(root+'more_show').toggle();
    		$(root+'more_hide').toggle();
    		$(root+'more').toggle();
		}
	}
};

Rules['.amt_desc:blur'] = function(element,event) {
	var root = element.id.substring(0,element.id.length - 11);
	// it wasn't autocompleted, so this is a non-catalog request.  open the add'l info.
	if (element.value && !$(root+'more').visible()) {
		$(root+'more_show').toggle();
		$(root+'more_hide').toggle();
		$(root+'more').toggle();
	}
};

Rules['.accatalog_item'] = function(element,event) {
	if ($(element.id+'_auto_complete')) {
		new Ajax.Autocompleter(element.id,element.id+'_auto_complete','/catalog_items/auto_complete',
		    {afterUpdateElement:capture_catalog_item_data, indicator:element.id+'_wait', paramName:'name', select:'acname'});
	}
};

Rules['.acuom'] = function(element,event) {
    if ($(element.id+'_auto_complete')) {
	    new Ajax.Autocompleter(element.id,element.id+'_auto_complete','/uoms/auto_complete',
	        {indicator:element.id+'_wait', paramName:'id'});
    }
};

function capture_catalog_item_data(textElem, selectedElem) {
	var root = textElem.id.substring(0, textElem.id.length - 11);

	// grab the id
	var nodes = document.getElementsByClassName('acid', selectedElem) || [];
	if (nodes.length>0) $(root+'item_id').value = Element.collectTextNodes(nodes[0], 'acid');

	// grab the uom
	nodes = document.getElementsByClassName('acuom', selectedElem) || [];
	if (nodes.length>0) $(root+'uom').value = Element.collectTextNodes(nodes[0], 'acid');

	// grab the price
	nodes = document.getElementsByClassName('acprice', selectedElem) || [];
	if (nodes.length>0) $(root+'unit_price').value = Element.collectTextNodes(nodes[0], 'acid');

	// grab the lead time
	nodes = document.getElementsByClassName('acleadtime', selectedElem) || [];
	if (nodes.length>0) {
		var value = Element.collectTextNodes(nodes[0], 'acid');
		var need_by_date_widget = dojo.widget.byId(root+'need_by_date');
		var need_by_date_node = need_by_date_widget.domNode;
		var lead_time_node = $(root+'lead_time');
		
		lead_time_node.innerHTML = value;
		need_by_date_widget.inputNode.value = '';
		if (value.length>0) {
			need_by_date_node.parentNode.hide();
			lead_time_node.parentNode.show();
		} else {
			lead_time_node.parentNode.hide();
			need_by_date_node.parentNode.show();
		}
	}

	// grab the supplier
    nodes = document.getElementsByClassName('acsupplier_object', selectedElem) || [];
    if (nodes.length>0) $(root+'supplier').value = Element.collectTextNodes(nodes[0], 'acid');
	nodes = document.getElementsByClassName('acsupplier_id', selectedElem) || [];
	if (nodes.length>0) $(root+'supplier_id').value = Element.collectTextNodes(nodes[0], 'acid');

  $(root+'supplier_info').hide();            
  $(root+'supplier_name').innerHTML = '';    
  $(root+'supplier_email').innerHTML = '';    
  $(root+'supplier_address').innerHTML = '';
  $(root+'supplier_edit_btn').hide();

	// grab the currency and lock it down..major probs getting this to work, explaining the tds..
	nodes = document.getElementsByClassName('accurrency', selectedElem) || [];
	if (nodes.length>0) Element.update($(root+'currency_id').parentNode, Element.collectTextNodes(nodes[0], 'acid'));

	update_catalog_item_data(textElem);
};

function update_catalog_item_data(element) {
	var root = element.id.substring(0,element.id.length - 11);
	if ($(root+'item_id').value) {
		// turn the description into a link
		if(!dojo.render.html.ie) {
		    element.parentNode.style.whiteSpace = "normal";
		}
		Element.hide(element);
		Element.update($(root+"description_display"), '<a href="/catalog_items/show/'+$(root+'item_id').value+'">'+element.value+'</a>');
		Element.show($(root+"description_display"));
		$(root+'type').disabled = true;
		// fix the uom and currency
		if ($(root+'uom')) {
			Element.update($(root+'uom').parentNode, $(root+'uom').value);
		}
//		Element.update($(root+'currency_id').parentNode, $(root+'currency_id'));
		Element.update($(root+'unit_price').parentNode, $(root+'unit_price').value);
		Element.update($(root+'supplier').parentNode, $(root+'supplier').value);
			
		// set the focus on the quantity column
		if ($(root+'quantity')) {
		    $(root+'quantity').focus();
		} else {
			$(root+'unit_price').focus();
		}
	}
}

function change_line_type(id) {
    new Ajax.Request('/requisition_headers/change_line_type/', {
        parameters: Form.serialize('requisition_line_'+id+'_main'),
        onLoaded:function(request){
                   $('table_wait').hide();
                   },
         onLoading:function(request){
                   $('table_wait').show();
                   }
    })
}

function add_line(id) {
    Element.show('table_wait');
    new Ajax.Updater('dummy_body', '/requisition_headers/add_line/' + id, {
        insertion: Insertion.Before,
        parameters: Form.serialize(getPreviousSiblingElement($('dummy_body'))),
        onComplete: function(request) {
            var new_root = getPreviousSiblingElement($('dummy_body'));
            dojo.widget.createWidget(new_root);
            Element.hide('table_wait');
            EventSelectors.assign(Rules);
            $(new_root.id + '_description').focus();
        }
    })
}