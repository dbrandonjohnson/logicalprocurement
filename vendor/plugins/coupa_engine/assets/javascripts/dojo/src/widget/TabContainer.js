/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

dojo.provide("dojo.widget.TabContainer");

dojo.require("dojo.lang.func");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.PageContainer");
dojo.require("dojo.event.*");
dojo.require("dojo.html.selection");
dojo.require("dojo.widget.html.layout");

dojo.widget.defineWidget("dojo.widget.TabContainer", dojo.widget.PageContainer, {

	// summary
	//	A TabContainer is a container that has multiple panes, but shows only
	//	one pane at a time.  There are a set of tabs corresponding to each pane,
	//	where each tab has the title (aka label) of the pane, and optionally a close button.
	//
	//	Publishes topics <widgetId>-addChild, <widgetId>-removeChild, and <widgetId>-selectChild
	//	(where <widgetId> is the id of the TabContainer itself.

	// labelPosition: String
	//   Defines where tab labels go relative to tab content.
	//   "top", "bottom", "left-h", "right-h"
	labelPosition: "top",
	
	// closeButton: String
	//   If closebutton=="tab", then every tab gets a close button.
	//   DEPRECATED:  Should just say closable=true on each
	//   pane you want to be closable.
	closeButton: "none",

	templateString: null,	// override setting in PageContainer
	templateString:"<div id=\"${this.widgetId}\" class=\"dojoTabContainer\">\n\t<div dojoAttachPoint=\"tablistNode\"></div>\n\t<div class=\"dojoTabPaneWrapper\" dojoAttachPoint=\"containerNode\" dojoAttachEvent=\"onKey\" waiRole=\"tabpanel\"></div>\n</div>\n",
	templateCssString:".dojoTabContainer {\n\tposition : relative;\n}\n\n.dojoTabPaneWrapper {\n\tborder : 1px solid #6290d2;\n\t_zoom: 1; /* force IE6 layout mode so top border doesnt disappear */\n\tdisplay: block;\n\tclear: both;\n\toverflow: hidden;\n}\n\n.dojoTabLabels-top {\n\tposition : relative;\n\ttop : 0px;\n\tleft : 0px;\n\toverflow : visible;\n\tmargin-bottom : -1px;\n\twidth : 100%;\n\tz-index: 2;\t/* so the bottom of the tab label will cover up the border of dojoTabPaneWrapper */\n}\n\n.dojoTabNoLayout.dojoTabLabels-top .dojoTab {\n\tmargin-bottom: -1px;\n\t_margin-bottom: 0px; /* IE filter so top border lines up correctly */\n}\n\n.dojoTab {\n\tposition : relative;\n\tfloat : left;\n\tpadding-left : 9px;\n\tborder-bottom : 1px solid #6290d2;\n\tbackground : url(images/tab_left.gif) no-repeat left top;\n\tcursor: pointer;\n\twhite-space: nowrap;\n\tz-index: 3;\n}\n\n.dojoTab div {\n\tdisplay : block;\n\tpadding : 4px 15px 4px 6px;\n\tbackground : url(images/tab_top_right.gif) no-repeat right top;\n\tcolor : #333;\n\tfont-size : 90%;\n}\n\n.dojoTab .close {\n\tdisplay : inline-block;\n\theight : 12px;\n\twidth : 12px;\n\tpadding : 0 12px 0 0;\n\tmargin : 0 -10px 0 10px;\n\tcursor : default;\n\tfont-size: small;\n}\n\n.dojoTab .closeImage {\n\tbackground : url(images/tab_close.gif) no-repeat right top;\n}\n\n.dojoTab .closeHover {\n\tbackground-image : url(images/tab_close_h.gif);\n}\n\n.dojoTab.current {\n\tpadding-bottom : 1px;\n\tborder-bottom : 0;\n\tbackground-position : 0 -150px;\n}\n\n.dojoTab.current div {\n\tpadding-bottom : 5px;\n\tmargin-bottom : -1px;\n\tbackground-position : 100% -150px;\n}\n\n/* bottom tabs */\n\n.dojoTabLabels-bottom {\n\tposition : relative;\n\tbottom : 0px;\n\tleft : 0px;\n\toverflow : visible;\n\tmargin-top : -1px;\n\twidth : 100%;\n\tz-index: 2;\n}\n\n.dojoTabNoLayout.dojoTabLabels-bottom {\n\tposition : relative;\n}\n\n.dojoTabLabels-bottom .dojoTab {\n\tborder-top :  1px solid #6290d2;\n\tborder-bottom : 0;\n\tbackground : url(images/tab_bot_left.gif) no-repeat left bottom;\n}\n\n.dojoTabLabels-bottom .dojoTab div {\n\tbackground : url(images/tab_bot_right.gif) no-repeat right bottom;\n}\n\n.dojoTabLabels-bottom .dojoTab.current {\n\tborder-top : 0;\n\tbackground : url(images/tab_bot_left_curr.gif) no-repeat left bottom;\n}\n\n.dojoTabLabels-bottom .dojoTab.current div {\n\tpadding-top : 4px;\n\tbackground : url(images/tab_bot_right_curr.gif) no-repeat right bottom;\n}\n\n/* right-h tabs */\n\n.dojoTabLabels-right-h {\n\toverflow : visible;\n\tmargin-left : -1px;\n\tz-index: 2;\n}\n\n.dojoTabLabels-right-h .dojoTab {\n\tpadding-left : 0;\n\tborder-left :  1px solid #6290d2;\n\tborder-bottom : 0;\n\tbackground : url(images/tab_bot_right.gif) no-repeat right bottom;\n\tfloat : none;\n}\n\n.dojoTabLabels-right-h .dojoTab div {\n\tpadding : 4px 15px 4px 15px;\n}\n\n.dojoTabLabels-right-h .dojoTab.current {\n\tborder-left :  0;\n\tborder-bottom :  1px solid #6290d2;\n}\n\n/* left-h tabs */\n\n.dojoTabLabels-left-h {\n\toverflow : visible;\n\tmargin-right : -1px;\n\tz-index: 2;\n}\n\n.dojoTabLabels-left-h .dojoTab {\n\tborder-right :  1px solid #6290d2;\n\tborder-bottom : 0;\n\tfloat : none;\n\tbackground : url(images/tab_top_left.gif) no-repeat left top;\n}\n\n.dojoTabLabels-left-h .dojoTab.current {\n\tborder-right : 0;\n\tborder-bottom :  1px solid #6290d2;\n\tpadding-bottom : 0;\n\tbackground : url(images/tab_top_left.gif) no-repeat 0 -150px;\n}\n\n.dojoTabLabels-left-h .dojoTab div {\n\tbackground : 0;\n\tborder-bottom :  1px solid #6290d2;\n}\n",templateCssPath: dojo.uri.moduleUri("dojo.widget", "templates/TabContainer.css"),

	// selectedTab: String
	//	initially selected tab (widgetId)
	//	DEPRECATED: use selectedChild instead.
	selectedTab: "",

	postMixInProperties: function() {
		if(this.selectedTab){
			dojo.deprecated("selectedTab deprecated, use selectedChild instead, will be removed in", "0.5");
			this.selectedChild=this.selectedTab;
		}
		if(this.closeButton!="none"){
			dojo.deprecated("closeButton deprecated, use closable='true' on each child instead, will be removed in", "0.5");
		}
		dojo.widget.TabContainer.superclass.postMixInProperties.apply(this, arguments);
	},

	fillInTemplate: function() {
		// create the tab list that will have a tab (a.k.a. tab button) for each tab panel
		this.tablist = dojo.widget.createWidget("TabController",
			{
				id: this.widgetId + "_tablist",
				labelPosition: this.labelPosition,
				doLayout: this.doLayout,
				containerId: this.widgetId
			}, this.tablistNode);
		dojo.widget.TabContainer.superclass.fillInTemplate.apply(this, arguments);
	},

	postCreate: function(args, frag) {	
		dojo.widget.TabContainer.superclass.postCreate.apply(this, arguments);

		// size the container pane to take up the space not used by the tabs themselves
		this.onResized();
	},

	_setupChild: function(tab){
		if(this.closeButton=="tab" || this.closeButton=="pane"){
			// TODO: remove in 0.5
			tab.closable=true;
		}
		dojo.html.addClass(tab.domNode, "dojoTabPane");
		dojo.widget.TabContainer.superclass._setupChild.apply(this, arguments);
	},

	onResized: function(){
		// Summary: Configure the content pane to take up all the space except for where the tabs are
		if(!this.doLayout){ return; }

		// position the labels and the container node
		var labelAlign=this.labelPosition.replace(/-h/,"");
		var children = [
			{domNode: this.tablist.domNode, layoutAlign: labelAlign},
			{domNode: this.containerNode, layoutAlign: "client"}
		];
		dojo.widget.html.layout(this.domNode, children);

		if(this.selectedChildWidget){
			var containerSize = dojo.html.getContentBox(this.containerNode);
			this.selectedChildWidget.resizeTo(containerSize.width, containerSize.height);
		}
	},

	selectTab: function(tab, callingWidget){
		dojo.deprecated("use selectChild() rather than selectTab(), selectTab() will be removed in", "0.5");
		this.selectChild(tab, callingWidget);
	},

	onKey: function(e){
		// summary
		//	Keystroke handling for keystrokes on the tab panel itself (that were bubbled up to me)
		//	Ctrl-up: focus is returned from the pane to the tab button
		//	Alt-del: close tab
		if(e.keyCode == e.KEY_UP_ARROW && e.ctrlKey){
			// set focus to current tab
			var button = this.correspondingTabButton || this.selectedTabWidget.tabButton;
			button.focus();
			dojo.event.browser.stopEvent(e);
		}else if(e.keyCode == e.KEY_DELETE && e.altKey){
			if (this.selectedChildWidget.closable){
				this.closeChild(this.selectedChildWidget);
				dojo.event.browser.stopEvent(e);
			}
		}
	},

	destroy: function(){
		this.tablist.destroy();
		dojo.widget.TabContainer.superclass.destroy.apply(this, arguments);
	}
});

dojo.widget.defineWidget(
    "dojo.widget.TabController",
    dojo.widget.PageController,
	{
		// summary
		// 	Set of tabs (the things with labels and a close button, that you click to show a tab panel).
		//	Lets the user select the currently shown pane in a TabContainer or PageContainer.
		//	TabController also monitors the TabContainer, and whenever a pane is
		//	added or deleted updates itself accordingly.

		templateString: "<div wairole='tablist' dojoAttachEvent='onKey'></div>",

		// labelPosition: String
		//   Defines where tab labels go relative to tab content.
		//   "top", "bottom", "left-h", "right-h"
		labelPosition: "top",

		doLayout: true,

		// class: String
		//	Class name to apply to the top dom node
		"class": "",

		// buttonWidget: String
		//	the name of the tab widget to create to correspond to each page
		buttonWidget: "TabButton",

		postMixInProperties: function() {
			if(!this["class"]){
				this["class"] = "dojoTabLabels-" + this.labelPosition + (this.doLayout ? "" : " dojoTabNoLayout");
			}
			dojo.widget.TabController.superclass.postMixInProperties.apply(this, arguments);
		}
	}
);

dojo.widget.defineWidget("dojo.widget.TabButton", dojo.widget.PageButton,
{
	// summary
	//	A tab (the thing you click to select a pane).
	//	Contains the title (aka label) of the pane, and optionally a close-button to destroy the pane.
	//	This is an internal widget and should not be instantiated directly.

	templateString: "<div class='dojoTab' dojoAttachEvent='onClick'>"
						+"<div dojoAttachPoint='innerDiv'>"
							+"<span dojoAttachPoint='titleNode' tabIndex='-1' waiRole='tab'>${this.label}</span>"
							+"<span dojoAttachPoint='closeButtonNode' class='close closeImage' style='${this.closeButtonStyle}'"
							+"    dojoAttachEvent='onMouseOver:onCloseButtonMouseOver; onMouseOut:onCloseButtonMouseOut; onClick:onCloseButtonClick'></span>"
						+"</div>"
					+"</div>",

	postMixInProperties: function(){
		this.closeButtonStyle = this.closeButton ? "" : "display: none";
		dojo.widget.TabButton.superclass.postMixInProperties.apply(this, arguments);
	},

	fillInTemplate: function(){
		dojo.html.disableSelection(this.titleNode);
		dojo.widget.TabButton.superclass.fillInTemplate.apply(this, arguments);
	},
	
	onCloseButtonClick: function(/*Event*/ evt){
		// since the close button is located inside the select button, make sure that the select
		// button doesn't inadvertently get an onClick event
		evt.stopPropagation();
		dojo.widget.TabButton.superclass.onCloseButtonClick.apply(this, arguments);
	}
});


dojo.widget.defineWidget(
	"dojo.widget.a11y.TabButton",
	dojo.widget.TabButton,
	{
		// summary
		//	Tab for display in high-contrast mode (where background images don't show up).
		//	This is an internal widget and shouldn't be instantiated directly.

		imgPath: dojo.uri.moduleUri("dojo.widget", "templates/images/tab_close.gif"),
		
		templateString: "<div class='dojoTab' dojoAttachEvent='onClick;onKey'>"
							+"<div dojoAttachPoint='innerDiv'>"
								+"<span dojoAttachPoint='titleNode' tabIndex='-1' waiRole='tab'>${this.label}</span>"
								+"<img class='close' src='${this.imgPath}' alt='[x]' style='${this.closeButtonStyle}'"
								+"    dojoAttachEvent='onClick:onCloseButtonClick'>"
							+"</div>"
						+"</div>"
	}
);
