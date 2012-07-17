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

/* getElementsByName */
function $N() {
  var results = [], element;
  for (var i = 0; i < arguments.length; i++) {
    element = arguments[i];
    if (typeof element == 'string')
      $A(document.getElementsByName(element)).each(function(e) {
          results.push(Element.extend(e))
      });
    else
      results.push(Element.extend(element))
  }
  return results.length < 2 ? results[0] : results;
}

/* getElementsByTagName */
function $T() {
  var results = [], element;
  for (var i = 0; i < arguments.length; i++) {
    element = arguments[i];
    if (typeof element == 'string')
      $A(document.getElementsByTagName(element)).each(function(e) {
          results.push(Element.extend(e))
      });
    else
      results.push(Element.extend(element))
  }
  return results.length < 2 ? results[0] : results;
}

function toggle_and_focus(elem_id, focus_id) {
    if (!document.getElementById) {
            return true;
    }
    elem = document.getElementById(elem_id);
    if (elem.style.display == 'none') {
            elem.style.display = 'block';
            document.getElementById(focus_id).focus();
    }
    else {
            elem.style.display = 'none';   
    }
}

function progressPercent(bar, percentage) {
  document.getElementById(bar).style.width =  parseInt(percentage)+"px";
  document.getElementById(bar).innerHTML= "<div align='center'>"+percentage+"%</div>"
}

function checkAll(name)
{
  boxes = document.getElementsByName(name)
  for (i = 0; i < boxes.length; i++)
        boxes[i].checked = true ;
}

function uncheckAll(name)
{
  boxes = document.getElementsByName(name)
  for (i = 0; i < boxes.length; i++)
        boxes[i].checked = false ;
}

function sync_fields(event){
    element = Event.element(event);
    if (element.value == null || element.value == '') {
        $(element.id+'_id').value = null;
    }
}

function hide_and_destroy(id) {
    w = dojo.widget.byId(id);
    w.hide();
    w.destroy();
}

Abstract.Insertion.prototype.contentFromAnonymousTable = function() {
  var div = document.createElement('div');
  if (this.content.substr(this.content.indexOf('<'), 6).toLowerCase() == '<tbody') {
      div.innerHTML = '<table>' + this.content + '</table>';
      return $A(div.childNodes[0].childNodes);
  } else {
      div.innerHTML = '<table><tbody>' + this.content + '</tbody></table>';
      return $A(div.childNodes[0].childNodes[0].childNodes);
  }    
}

// Returns the previous element only, ignoring whitespace (previousSibling doesn't).
// Couldn't extend Element because IE doesn't support it.
function getPreviousSiblingElement(object) {
	var testPrevious=object.previousSibling;
	while (testPrevious.nodeType!=1)  {
		testPrevious=testPrevious.previousSibling;
	}
	return testPrevious;
}

// Generic value-replacing after auto-completion selection
function auto_complete_update_element(li, root) {
	$A(li.childNodes).each(function(child) {
        if (child.nodeType == 1 && child.getAttribute('target')) {
            var target_attribute_name = child.getAttribute('target');
            var target = $(root + "_" + target_attribute_name);
            var display = $(root + "_" + target_attribute_name + '_display');
            if (target) {
                if (target.tagName == "INPUT") {
                    if (child.getAttribute('value')) {
                        target.value = child.getAttribute('value');
                    } else {
                        target.value = child.innerHTML.strip();
                    }
	            } else {
	                target.innerHTML = child.innerHTML.strip();
	            }
	            if (display) {
	                display.innerHTML = child.innerHTML.strip();
	                if (child.getAttribute('editable') == 'true') {
	                    target.show();
	                    display.hide();
	                } else if (child.getAttribute('editable') == 'false') {
	                    display.show();
	                    target.hide();
	                }
	            }
            } else {
                alert("No target found with id = " + root + "_" + target_attribute_name);
            }
        }
    })
}

var Rules = {};
Rules['tr.stripe_even, tr.stripe_odd'] = function(element,event) {
	if (!element) return;
    while (element.tagName != 'TR') {
        element = element.parentNode;
    }
    if (element.rowIndex % 2) {
        element.style.backgroundColor = '#fff';
    }
    else {
        element.style.backgroundColor = '#edf3fe';
    }
};
Rules['.draggable:mouseover'] = function(element,event) {
    while (element && element.tagName != 'DIV') {
        element = element.parentNode;
    }
	var dragHandle = document.getElementsByClassName('drag_handle',element)[0];
	if (dragHandle) dragHandle.show();
   
};
Rules['.draggable:mouseout'] = function(element,event) {
	if (!element) return;
    while (element && element.tagName != 'DIV') {
        element = element.parentNode;
    }
    var dragHandle = document.getElementsByClassName('drag_handle',element)[0];
	if (dragHandle) dragHandle.hide();
};
dojo.addOnLoad(function() { EventSelectors.start(Rules) });



