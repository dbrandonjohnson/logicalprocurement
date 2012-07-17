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

Rules['.accatalog_item'] = function(element, event) {
    var root = element.id.replace(/_description$/, '');
    new Ajax.Autocompleter(element.id, element.id + '_auto_complete', '/catalog_items/auto_complete', {
        paramName:'name',
        indicator:element.id+'_wait',
        updateElement:function (li) { auto_complete_update_element(li, root); catalog_item_update(root); }
		});
}

// Rules['.grab_cat'] = function(element,event) {
//  if ($(element.id+'_auto_complete')) {
//      new Ajax.Autocompleter(element.id,element.id+'_auto_complete','/catalog_items/auto_complete', {
//          afterUpdateElement:capture_catalog_item_data, 
//          indicator:element.id+'_wait', 
//          paramName:'id', 
//          select:'acname'});
//  }
// };

Rules['.acuom'] = function(element,event) {
    if ($(element.id+'_auto_complete')) {
	    new Ajax.Autocompleter(element.id,element.id+'_auto_complete','/uoms/auto_complete',
	        {indicator:element.id+'_wait', paramName:'id'});
    }
};

Rules['.acsupplier'] = function(element,event) {
    if ($(element.id+'_auto_complete')) {
	    new Ajax.Autocompleter(element.id,element.id+'_auto_complete','/suppliers/auto_complete_unfiltered',
        	{indicator:element.id+'_wait', paramName:'id', select:'acname', afterUpdateElement: capture_supplier_data});
    }
};

function confirm_return(response) {
    if (response.responseText == '' || confirm('Requisition is incomplete.  Would you like to return it to requester?')) {
        $('req_submit_type').value = 'submit'; $('req_form').submit();
    } 
}

function catalog_item_update(root) {
    if ($(root+'_item_id').value) {
        new Ajax.Request('/buying/select_item/'+$(root+'_id').value, {
    			asynchronous:true, evalScripts:false, 
    			onLoaded:function(request){
    				$('table_wait').hide();
    			},
    			onLoading:function(request){
    				$('table_wait').show();
    			}, 
    			parameters:'item_id='+$(root+'_item_id').value
    		});
	}
}




function capture_catalog_item_data(textElem, selectedElem) {
	var root = textElem.id.substring(0, textElem.id.length - 11);
	 
    // grab the id
    var nodes = document.getElementsByClassName('acid', selectedElem) || [];
    if(nodes.length>0) $(root+'item_id').value = Element.collectTextNodes(nodes[0], 'acid');

    // grab the uom
    nodes = document.getElementsByClassName('acuom', selectedElem) || [];
    if(nodes.length>0) $(root+'uom').value = Element.collectTextNodes(nodes[0], 'acid');

    // grab the price
    nodes = document.getElementsByClassName('acprice', selectedElem) || [];
    if(nodes.length>0) $(root+'unit_price').value = Element.collectTextNodes(nodes[0], 'acid');
    
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
	


	update_contract_data(textElem, selectedElem);
	update_catalog_item_data(textElem);
};

function update_contract_data(textElem, selectedElem) {
	var root = textElem.id.substring(0, textElem.id.length - 11);
	var req_line = textElem.id.substring(17, textElem.id.length - 12);
	var svalid = $(root+'supplier_id').value;
	var euricvalid = encodeURIComponent($(root+'supplier_id').value);

	// Update the contract
	new Ajax.Request('/buying/update_contracts', {
			asynchronous:true, evalScripts:false, 
			onLoaded:function(request){
				$(root+'contract_wait').hide();
			},
			onLoading:function(request){
				$(root+'contract_wait').show();
			}, 
			parameters:'value='+encodeURIComponent($(root+'supplier_id').value)+'&req_line='+req_line
		});
	
	 // grab the supplier
     var nodes = document.getElementsByClassName('acsupplier_object', selectedElem) || [];
     if(nodes.length>0) {
		var tmp = Element.collectTextNodes(nodes[0]);
		$(root+'supplier_name').innerHTML = Element.collectTextNodes(nodes[0]);
	 }

     nodes = document.getElementsByClassName('acsupplier_id', selectedElem) || [];
     if(nodes.length>0) {
		var tmp = Element.collectTextNodes(nodes[0]);
		$(root+'supplier_id').value = Element.collectTextNodes(nodes[0]);
	 }
     nodes = document.getElementsByClassName('acemail', selectedElem) || [];
    if(nodes.length>0) {
		var tmp = Element.collectTextNodes(nodes[0]);
		$(root+'supplier_email').innerHTML = Element.collectTextNodes(nodes[0]);

	}
 	nodes = document.getElementsByClassName('acaddress', selectedElem) || [];
 	if(nodes.length>0) {
		var tmp = Element.collectTextNodes(nodes[0]);
		$(root+'supplier_address').innerHTML = Element.collectTextNodes(nodes[0]);
	}
 	
	nodes = document.getElementsByClassName('acstatus', selectedElem) || [];
 
	if (nodes.length>0 && 'draft' == Element.collectTextNodes(nodes[0])) {
     	$(root+'supplier_edit_btn').show();
     	$(root+'supplier_activate_btn').show();
     	$(root+'supplier_missing_indicator').className = 'missing';
 	}
 	else {
     	$(root+'supplier_edit_btn').hide();
     	$(root+'supplier_activate_btn').hide();
     	$(root+'supplier_missing_indicator').className = '';
 	}
}

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
	$(root+'supplier_info').show();
    
}


function capture_supplier_data(textElem, selectedElem) {
	var root = textElem.id.substring(0, textElem.id.length - 8);
	
    // grab the supplier
    var nodes = document.getElementsByClassName('acname', selectedElem) || [];
    if(nodes.length>0) {
        var req_line = textElem.id.substring(17,textElem.id.length - 9);
        new Ajax.Request('/buying/update_contracts',
                         {asynchronous:true, evalScripts:false, 
                         onLoaded:function(request){
                                    $(root+'contract_wait').hide();
                                    },
                          onLoading:function(request){
                                    $(root+'contract_wait').show();
                                    }, 
                         parameters:'value='+encodeURIComponent(textElem.value)+'&req_line='+req_line});
        $(root+'supplier_name').innerHTML = Element.collectTextNodes(nodes[0], 'acid');
    
        nodes = document.getElementsByClassName('acid', selectedElem) || [];
        if(nodes.length>0) $(root+'supplier_id').value = Element.collectTextNodes(nodes[0], 'acid');

        nodes = document.getElementsByClassName('acemail', selectedElem) || [];
        if(nodes.length>0) $(root+'supplier_email').innerHTML = Element.collectTextNodes(nodes[0], 'acid');

        nodes = document.getElementsByClassName('acaddress', selectedElem) || [];
        if(nodes.length>0) $(root+'supplier_address').innerHTML = Element.collectTextNodes(nodes[0], 'acid');

        nodes = document.getElementsByClassName('acstatus', selectedElem) || [];
        if (nodes.length>0 && 'draft' == Element.collectTextNodes(nodes[0], 'acid')) {
            $(root+'supplier_edit_btn').show();
            $(root+'supplier_activate_btn').show();
            $(root+'supplier_missing_indicator').className = 'missing';
        }
        else {
            $(root+'supplier_edit_btn').hide();
            $(root+'supplier_activate_btn').hide();
            $(root+'supplier_missing_indicator').className = '';
        }
    } 
    else {
        $(root+'supplier_id').value = '';    
        $(root+'supplier_name').innerHTML = '';    
        $(root+'supplier_email').innerHTML = '';    
        $(root+'supplier_address').innerHTML = '';            
        $(root+'supplier_edit_btn').hide();
        $(root+'supplier_activate_btn').hide();
    }

    $(root+'supplier_info').show();
};

function replace_line(rootName, template) {
    Element.remove('requisition_line_'+rootName+'_hidden');
    Element.remove('requisition_line_'+rootName+'_more');
    $('requisition_line_'+rootName+'_main').id = 'placeholder_'+rootName;
    new Insertion.Before('placeholder_'+rootName, template.replace(/new_req_line/g, rootName));
    Element.remove('placeholder_'+rootName);
    EventSelectors.assign(Rules);
};
