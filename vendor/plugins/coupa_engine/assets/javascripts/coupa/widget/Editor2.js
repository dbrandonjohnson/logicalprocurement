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

dojo.provide("coupa.widget.Editor2");
dojo.require("dojo.widget.Editor2");

//
// Dojo RichText w/ Dojo 4.1 IE prototype conflict fixed
// See ticket http://trac.dojotoolkit.org/ticket/2450 for details
// This entire widget can be removed on upgrading to Dojo v4.2
//
dojo.widget.defineWidget(
	"coupa.widget.Editor2",
	dojo.widget.Editor2,
	{
		/**
		 * Transforms the node referenced in this.domNode into a rich text editing
		 * node. This can result in the creation and replacement with an <iframe> if
		 * designMode is used, an <object> and active-x component if inside of IE or
		 * a reguler element if contentEditable is available.
		 */
		open: function (/*DomNode, optional*/element) {
			// summary:
			//		Transforms the node referenced in this.domNode into a rich text editing
			//		node. This can result in the creation and replacement with an <iframe> if
			//		designMode is used, an <object> and active-x component if inside of IE or
			//		a reguler element if contentEditable is available.
			if(this.onLoadDeferred.fired >= 0){
				this.onLoadDeferred = new dojo.Deferred();
			}

			var h = dojo.render.html;
			if (!this.isClosed) { this.close(); }
			dojo.event.topic.publish("dojo.widget.RichText::open", this);

			this._content = "";
			if((arguments.length == 1)&&(element["nodeName"])){ this.domNode = element; } // else unchanged

			if(	(this.domNode["nodeName"])&&
				(this.domNode.nodeName.toLowerCase() == "textarea")){
				this.textarea = this.domNode;
				var html = dojo.string.trim(this.textarea.value);
				this.domNode = dojo.doc().createElement("div");
				dojo.html.copyStyle(this.domNode, this.textarea);
				var tmpFunc = dojo.lang.hitch(this, function(){
					//some browsers refuse to submit display=none textarea, so
					//move the textarea out of screen instead
					with(this.textarea.style){
						display = "block";
						position = "absolute";
						left = top = "-1000px";

						if(h.ie){ //nasty IE bug: abnormal formatting if overflow is not hidden
							this.__overflow = overflow;
							overflow = "hidden";
						}
					}
				});
				if(h.ie){
					setTimeout(tmpFunc, 10);
				}else{
					tmpFunc();
				}
				if(!h.safari){
					// FIXME: VERY STRANGE safari 2.0.4 behavior here caused by
					// moving the textarea. Often crashed the browser!!! Seems
					// fixed on webkit nightlies.
					dojo.html.insertBefore(this.domNode, this.textarea);
				}
				// this.domNode.innerHTML = html;

				if(this.textarea.form){
					dojo.event.connect('before', this.textarea.form, "onsubmit",
						// FIXME: should we be calling close() here instead?
						dojo.lang.hitch(this, function(){
							this.textarea.value = this.getEditorContent();
						})
					);
				}

				// dojo plucks our original domNode from the document so we need
				// to go back and put ourselves back in
				var editor = this;
				dojo.event.connect(this, "postCreate", function (){
					dojo.html.insertAfter(editor.textarea, editor.domNode);
				});
			}else{
				var html = this._preFilterContent(dojo.string.trim(this.domNode.innerHTML));
			}
			if(html == ""){ html = "&nbsp;"; }
			var content = dojo.html.getContentBox(this.domNode);
			this._oldHeight = content.height;
			this._oldWidth = content.width;

			this._firstChildContributingMargin = this._getContributingMargin(this.domNode, "top");
			this._lastChildContributingMargin = this._getContributingMargin(this.domNode, "bottom");

			this.savedContent = this.domNode.innerHTML;
			this.domNode.innerHTML = '';

			this.editingArea = dojo.doc().createElement("div");
			this.domNode.appendChild(this.editingArea);

			// If we're a list item we have to put in a blank line to force the
			// bullet to nicely align at the top of text
			if(	(this.domNode["nodeName"])&&
				(this.domNode.nodeName == "LI")){
				this.domNode.innerHTML = " <br>";
			}

			if(this.saveName != ""){
				var saveTextarea = dojo.doc().getElementById("dojo.widget.RichText.savedContent");
				if (saveTextarea.value != "") {
					var datas = saveTextarea.value.split(this._SEPARATOR);
					for (var i = 0; i < datas.length; i++) {
						var data = datas[i].split(":");
						if (data[0] == this.saveName) {
							html = data[1];
							datas.splice(i, 1);
							break;
						}
					}
				}
				dojo.event.connect("before", window, "onunload", this, "_saveContent");
				// dojo.event.connect(window, "onunload", this, "_saveContent");
			}

			if(h.ie70 && this.useActiveX){
				dojo.debug("activeX in ie70 is not currently supported, useActiveX is ignored for now.");
				this.useActiveX = false;
			}
			// Safari's selections go all out of whack if we do it inline,
			// so for now IE is our only hero
			//if (typeof document.body.contentEditable != "undefined") {
			if(this.useActiveX && h.ie){ // active-x
				var self = this;
				//if call _drawObject directly here, textarea replacement
				//won't work: no content is shown. However, add a delay
				//can workaround this. No clue why.
				setTimeout(function(){self._drawObject(html);}, 0);
			}else if(h.ie || this._safariIsLeopard() || h.opera){ // contentEditable, easy
				this.iframe = dojo.doc().createElement( 'iframe' ) ;
				this.iframe.src = 'javascript:void(0)';
				this.editorObject = this.iframe;
				with(this.iframe.style){
					border = '0';
					width = "100%";
				}
				this.iframe.frameBorder = 0;
				this.editingArea.appendChild(this.iframe)
				this.window = this.iframe.contentWindow;
				this.document = this.window.document;
				this.document.open();
				this.document.write("<html><head><style>body{margin:0;padding:0;border:0;overflow:hidden;}</style></head><body><div></div></body></html>");
				this.document.close();
				this.editNode = this.document.body.firstChild;//document.createElement("div");
				this.editNode.contentEditable = true;
				with (this.iframe.style) {
					if(h.ie70){
						if(this.height){
							height = this.height;
						}
						if(this.minHeight){
							minHeight = this.minHeight;
						}
					}else{
						height = this.height ? this.height : this.minHeight;
					}
				}

				// FIXME: setting contentEditable on switches this element to
				// IE's hasLayout mode, triggering weird margin collapsing
				// behavior. It's particularly bad if the element you're editing
				// contains childnodes that don't have margin: defined in local
				// css rules. It would be nice if it was possible to hack around
				// this. Sadly _firstChildContributingMargin and
				// _lastChildContributingMargin don't work on IE unless all
				// elements have margins set in CSS :-(

				//if the normal way fails, we try the hard way to get the list
				//do not use _cacheLocalBlockFormatNames here, as it will trigger security warning in IE7
				//in the array below, ul can not come directly after ol, otherwise the queryCommandValue returns Normal for it
				var formats = ['p', 'pre', 'address', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'div', 'ul'];
				var localhtml = "";
				for(var i=0;i<formats.length;i++){
					if(formats[i].charAt(1) != 'l'){
						localhtml += "<"+formats[i]+"><span>content</span></"+formats[i]+">";
					}else{
						localhtml += "<"+formats[i]+"><li>content</li></"+formats[i]+">";
					}
				}
				//queryCommandValue returns empty if we hide editNode, so move it out of screen temporary
				with(this.editNode.style){
					position = "absolute";
					left = "-2000px";
					top = "-2000px";
				}
				this.editNode.innerHTML = localhtml;
				var node = this.editNode.firstChild;
				while(node){
					dojo.withGlobal(this.window, "selectElement", dojo.html.selection, [node.firstChild]);
					var nativename = node.tagName.toLowerCase();
					this._local2NativeFormatNames[nativename] = this.queryCommandValue("formatblock");
//						dojo.debug([nativename,this._local2NativeFormatNames[nativename]]);
					this._native2LocalFormatNames[this._local2NativeFormatNames[nativename]] = nativename;
					node = node.nextSibling;
				}
				with(this.editNode.style){
					position = "";
					left = "";
					top = "";
				}

				this.editNode.innerHTML = html;
				if(this.height){ this.document.body.style.overflowY="scroll"; }

				dojo.lang.forEach(this.events, function(e){
					dojo.event.connect(this.editNode, e.toLowerCase(), this, e);
				}, this);

				this.onLoad();
			} else { // designMode in iframe
				this._drawIframe(html);
				this.editorObject = this.iframe;
			}

			// TODO: this is a guess at the default line-height, kinda works
			if (this.domNode.nodeName == "LI") { this.domNode.lastChild.style.marginTop = "-1.2em"; }
			dojo.html.addClass(this.domNode, "RichTextEditable");

			this.isClosed = false;
		}
	}
);
