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

dojo.provide("coupa.widget.Button");
dojo.require("dojo.widget.Button");

//
// Dojo button with customized images and embedded html button
//
dojo.widget.defineWidget(
	"coupa.widget.Button",
	dojo.widget.Button,
	{
		templatePath: dojo.uri.moduleUri("coupa", "widget/templates/ButtonTemplate.html"),
		templateCssPath: dojo.uri.moduleUri("coupa", "widget/templates/ButtonTemplate.css"),
		inactiveImg: "../../../coupa/widget/templates/images/coupaButton-",
		
		// set the value of the embedded submit button
		fillInTemplate: function(args, frag) {
			coupa.widget.Button.superclass.fillInTemplate.call(this, args, frag);
			this.inputNode.value = this.containerNode.innerHTML;
		}
	}
);
