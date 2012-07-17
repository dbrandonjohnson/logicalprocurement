/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(typeof dojo=="undefined"){
var dj_global=this;
var dj_currentContext=this;
function dj_undef(_1,_2){
return (typeof (_2||dj_currentContext)[_1]=="undefined");
}
if(dj_undef("djConfig",this)){
var djConfig={};
}
if(dj_undef("dojo",this)){
var dojo={};
}
dojo.global=function(){
return dj_currentContext;
};
dojo.locale=djConfig.locale;
dojo.version={major:0,minor:4,patch:2,flag:"",revision:Number("$Rev: 7616 $".match(/[0-9]+/)[0]),toString:function(){
with(dojo.version){
return major+"."+minor+"."+patch+flag+" ("+revision+")";
}
}};
dojo.evalProp=function(_3,_4,_5){
if((!_4)||(!_3)){
return undefined;
}
if(!dj_undef(_3,_4)){
return _4[_3];
}
return (_5?(_4[_3]={}):undefined);
};
dojo.parseObjPath=function(_6,_7,_8){
var _9=(_7||dojo.global());
var _a=_6.split(".");
var _b=_a.pop();
for(var i=0,l=_a.length;i<l&&_9;i++){
_9=dojo.evalProp(_a[i],_9,_8);
}
return {obj:_9,prop:_b};
};
dojo.evalObjPath=function(_e,_f){
if(typeof _e!="string"){
return dojo.global();
}
if(_e.indexOf(".")==-1){
return dojo.evalProp(_e,dojo.global(),_f);
}
var ref=dojo.parseObjPath(_e,dojo.global(),_f);
if(ref){
return dojo.evalProp(ref.prop,ref.obj,_f);
}
return null;
};
dojo.errorToString=function(_11){
if(!dj_undef("message",_11)){
return _11.message;
}else{
if(!dj_undef("description",_11)){
return _11.description;
}else{
return _11;
}
}
};
dojo.raise=function(_12,_13){
if(_13){
_12=_12+": "+dojo.errorToString(_13);
}else{
_12=dojo.errorToString(_12);
}
try{
if(djConfig.isDebug){
dojo.hostenv.println("FATAL exception raised: "+_12);
}
}
catch(e){
}
throw _13||Error(_12);
};
dojo.debug=function(){
};
dojo.debugShallow=function(obj){
};
dojo.profile={start:function(){
},end:function(){
},stop:function(){
},dump:function(){
}};
function dj_eval(_15){
return dj_global.eval?dj_global.eval(_15):eval(_15);
}
dojo.unimplemented=function(_16,_17){
var _18="'"+_16+"' not implemented";
if(_17!=null){
_18+=" "+_17;
}
dojo.raise(_18);
};
dojo.deprecated=function(_19,_1a,_1b){
var _1c="DEPRECATED: "+_19;
if(_1a){
_1c+=" "+_1a;
}
if(_1b){
_1c+=" -- will be removed in version: "+_1b;
}
dojo.debug(_1c);
};
dojo.render=(function(){
function vscaffold(_1d,_1e){
var tmp={capable:false,support:{builtin:false,plugin:false},prefixes:_1d};
for(var i=0;i<_1e.length;i++){
tmp[_1e[i]]=false;
}
return tmp;
}
return {name:"",ver:dojo.version,os:{win:false,linux:false,osx:false},html:vscaffold(["html"],["ie","opera","khtml","safari","moz"]),svg:vscaffold(["svg"],["corel","adobe","batik"]),vml:vscaffold(["vml"],["ie"]),swf:vscaffold(["Swf","Flash","Mm"],["mm"]),swt:vscaffold(["Swt"],["ibm"])};
})();
dojo.hostenv=(function(){
var _21={isDebug:false,allowQueryConfig:false,baseScriptUri:"",baseRelativePath:"",libraryScriptUri:"",iePreventClobber:false,ieClobberMinimal:true,preventBackButtonFix:true,delayMozLoadingFix:false,searchIds:[],parseWidgets:true};
if(typeof djConfig=="undefined"){
djConfig=_21;
}else{
for(var _22 in _21){
if(typeof djConfig[_22]=="undefined"){
djConfig[_22]=_21[_22];
}
}
}
return {name_:"(unset)",version_:"(unset)",getName:function(){
return this.name_;
},getVersion:function(){
return this.version_;
},getText:function(uri){
dojo.unimplemented("getText","uri="+uri);
}};
})();
dojo.hostenv.getBaseScriptUri=function(){
if(djConfig.baseScriptUri.length){
return djConfig.baseScriptUri;
}
var uri=new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
if(!uri){
dojo.raise("Nothing returned by getLibraryScriptUri(): "+uri);
}
var _25=uri.lastIndexOf("/");
djConfig.baseScriptUri=djConfig.baseRelativePath;
return djConfig.baseScriptUri;
};
(function(){
var _26={pkgFileName:"__package__",loading_modules_:{},loaded_modules_:{},addedToLoadingCount:[],removedFromLoadingCount:[],inFlightCount:0,modulePrefixes_:{dojo:{name:"dojo",value:"src"}},setModulePrefix:function(_27,_28){
this.modulePrefixes_[_27]={name:_27,value:_28};
},moduleHasPrefix:function(_29){
var mp=this.modulePrefixes_;
return Boolean(mp[_29]&&mp[_29].value);
},getModulePrefix:function(_2b){
if(this.moduleHasPrefix(_2b)){
return this.modulePrefixes_[_2b].value;
}
return _2b;
},getTextStack:[],loadUriStack:[],loadedUris:[],post_load_:false,modulesLoadedListeners:[],unloadListeners:[],loadNotifying:false};
for(var _2c in _26){
dojo.hostenv[_2c]=_26[_2c];
}
})();
dojo.hostenv.loadPath=function(_2d,_2e,cb){
var uri;
if(_2d.charAt(0)=="/"||_2d.match(/^\w+:/)){
uri=_2d;
}else{
uri=this.getBaseScriptUri()+_2d;
}
if(djConfig.cacheBust&&dojo.render.html.capable){
uri+="?"+String(djConfig.cacheBust).replace(/\W+/g,"");
}
try{
return !_2e?this.loadUri(uri,cb):this.loadUriAndCheck(uri,_2e,cb);
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.hostenv.loadUri=function(uri,cb){
if(this.loadedUris[uri]){
return true;
}
var _33=this.getText(uri,null,true);
if(!_33){
return false;
}
this.loadedUris[uri]=true;
if(cb){
_33="("+_33+")";
}
var _34=dj_eval(_33);
if(cb){
cb(_34);
}
return true;
};
dojo.hostenv.loadUriAndCheck=function(uri,_36,cb){
var ok=true;
try{
ok=this.loadUri(uri,cb);
}
catch(e){
dojo.debug("failed loading ",uri," with error: ",e);
}
return Boolean(ok&&this.findModule(_36,false));
};
dojo.loaded=function(){
};
dojo.unloaded=function(){
};
dojo.hostenv.loaded=function(){
this.loadNotifying=true;
this.post_load_=true;
var mll=this.modulesLoadedListeners;
for(var x=0;x<mll.length;x++){
mll[x]();
}
this.modulesLoadedListeners=[];
this.loadNotifying=false;
dojo.loaded();
};
dojo.hostenv.unloaded=function(){
var mll=this.unloadListeners;
while(mll.length){
(mll.pop())();
}
dojo.unloaded();
};
dojo.addOnLoad=function(obj,_3d){
var dh=dojo.hostenv;
if(arguments.length==1){
dh.modulesLoadedListeners.push(obj);
}else{
if(arguments.length>1){
dh.modulesLoadedListeners.push(function(){
obj[_3d]();
});
}
}
if(dh.post_load_&&dh.inFlightCount==0&&!dh.loadNotifying){
dh.callLoaded();
}
};
dojo.addOnUnload=function(obj,_40){
var dh=dojo.hostenv;
if(arguments.length==1){
dh.unloadListeners.push(obj);
}else{
if(arguments.length>1){
dh.unloadListeners.push(function(){
obj[_40]();
});
}
}
};
dojo.hostenv.modulesLoaded=function(){
if(this.post_load_){
return;
}
if(this.loadUriStack.length==0&&this.getTextStack.length==0){
if(this.inFlightCount>0){
dojo.debug("files still in flight!");
return;
}
dojo.hostenv.callLoaded();
}
};
dojo.hostenv.callLoaded=function(){
if(typeof setTimeout=="object"||(djConfig["useXDomain"]&&dojo.render.html.opera)){
setTimeout("dojo.hostenv.loaded();",0);
}else{
dojo.hostenv.loaded();
}
};
dojo.hostenv.getModuleSymbols=function(_42){
var _43=_42.split(".");
for(var i=_43.length;i>0;i--){
var _45=_43.slice(0,i).join(".");
if((i==1)&&!this.moduleHasPrefix(_45)){
_43[0]="../"+_43[0];
}else{
var _46=this.getModulePrefix(_45);
if(_46!=_45){
_43.splice(0,i,_46);
break;
}
}
}
return _43;
};
dojo.hostenv._global_omit_module_check=false;
dojo.hostenv.loadModule=function(_47,_48,_49){
if(!_47){
return;
}
_49=this._global_omit_module_check||_49;
var _4a=this.findModule(_47,false);
if(_4a){
return _4a;
}
if(dj_undef(_47,this.loading_modules_)){
this.addedToLoadingCount.push(_47);
}
this.loading_modules_[_47]=1;
var _4b=_47.replace(/\./g,"/")+".js";
var _4c=_47.split(".");
var _4d=this.getModuleSymbols(_47);
var _4e=((_4d[0].charAt(0)!="/")&&!_4d[0].match(/^\w+:/));
var _4f=_4d[_4d.length-1];
var ok;
if(_4f=="*"){
_47=_4c.slice(0,-1).join(".");
while(_4d.length){
_4d.pop();
_4d.push(this.pkgFileName);
_4b=_4d.join("/")+".js";
if(_4e&&_4b.charAt(0)=="/"){
_4b=_4b.slice(1);
}
ok=this.loadPath(_4b,!_49?_47:null);
if(ok){
break;
}
_4d.pop();
}
}else{
_4b=_4d.join("/")+".js";
_47=_4c.join(".");
var _51=!_49?_47:null;
ok=this.loadPath(_4b,_51);
if(!ok&&!_48){
_4d.pop();
while(_4d.length){
_4b=_4d.join("/")+".js";
ok=this.loadPath(_4b,_51);
if(ok){
break;
}
_4d.pop();
_4b=_4d.join("/")+"/"+this.pkgFileName+".js";
if(_4e&&_4b.charAt(0)=="/"){
_4b=_4b.slice(1);
}
ok=this.loadPath(_4b,_51);
if(ok){
break;
}
}
}
if(!ok&&!_49){
dojo.raise("Could not load '"+_47+"'; last tried '"+_4b+"'");
}
}
if(!_49&&!this["isXDomain"]){
_4a=this.findModule(_47,false);
if(!_4a){
dojo.raise("symbol '"+_47+"' is not defined after loading '"+_4b+"'");
}
}
return _4a;
};
dojo.hostenv.startPackage=function(_52){
var _53=String(_52);
var _54=_53;
var _55=_52.split(/\./);
if(_55[_55.length-1]=="*"){
_55.pop();
_54=_55.join(".");
}
var _56=dojo.evalObjPath(_54,true);
this.loaded_modules_[_53]=_56;
this.loaded_modules_[_54]=_56;
return _56;
};
dojo.hostenv.findModule=function(_57,_58){
var lmn=String(_57);
if(this.loaded_modules_[lmn]){
return this.loaded_modules_[lmn];
}
if(_58){
dojo.raise("no loaded module named '"+_57+"'");
}
return null;
};
dojo.kwCompoundRequire=function(_5a){
var _5b=_5a["common"]||[];
var _5c=_5a[dojo.hostenv.name_]?_5b.concat(_5a[dojo.hostenv.name_]||[]):_5b.concat(_5a["default"]||[]);
for(var x=0;x<_5c.length;x++){
var _5e=_5c[x];
if(_5e.constructor==Array){
dojo.hostenv.loadModule.apply(dojo.hostenv,_5e);
}else{
dojo.hostenv.loadModule(_5e);
}
}
};
dojo.require=function(_5f){
dojo.hostenv.loadModule.apply(dojo.hostenv,arguments);
};
dojo.requireIf=function(_60,_61){
var _62=arguments[0];
if((_62===true)||(_62=="common")||(_62&&dojo.render[_62].capable)){
var _63=[];
for(var i=1;i<arguments.length;i++){
_63.push(arguments[i]);
}
dojo.require.apply(dojo,_63);
}
};
dojo.requireAfterIf=dojo.requireIf;
dojo.provide=function(_65){
return dojo.hostenv.startPackage.apply(dojo.hostenv,arguments);
};
dojo.registerModulePath=function(_66,_67){
return dojo.hostenv.setModulePrefix(_66,_67);
};
if(djConfig["modulePaths"]){
for(var param in djConfig["modulePaths"]){
dojo.registerModulePath(param,djConfig["modulePaths"][param]);
}
}
dojo.setModulePrefix=function(_68,_69){
dojo.deprecated("dojo.setModulePrefix(\""+_68+"\", \""+_69+"\")","replaced by dojo.registerModulePath","0.5");
return dojo.registerModulePath(_68,_69);
};
dojo.exists=function(obj,_6b){
var p=_6b.split(".");
for(var i=0;i<p.length;i++){
if(!obj[p[i]]){
return false;
}
obj=obj[p[i]];
}
return true;
};
dojo.hostenv.normalizeLocale=function(_6e){
var _6f=_6e?_6e.toLowerCase():dojo.locale;
if(_6f=="root"){
_6f="ROOT";
}
return _6f;
};
dojo.hostenv.searchLocalePath=function(_70,_71,_72){
_70=dojo.hostenv.normalizeLocale(_70);
var _73=_70.split("-");
var _74=[];
for(var i=_73.length;i>0;i--){
_74.push(_73.slice(0,i).join("-"));
}
_74.push(false);
if(_71){
_74.reverse();
}
for(var j=_74.length-1;j>=0;j--){
var loc=_74[j]||"ROOT";
var _78=_72(loc);
if(_78){
break;
}
}
};
dojo.hostenv.localesGenerated=["ROOT","es-es","es","it-it","pt-br","de","fr-fr","zh-cn","pt","en-us","zh","fr","zh-tw","it","en-gb","xx","de-de","ko-kr","ja-jp","ko","en","ja"];
dojo.hostenv.registerNlsPrefix=function(){
dojo.registerModulePath("nls","nls");
};
dojo.hostenv.preloadLocalizations=function(){
if(dojo.hostenv.localesGenerated){
dojo.hostenv.registerNlsPrefix();
function preload(_79){
_79=dojo.hostenv.normalizeLocale(_79);
dojo.hostenv.searchLocalePath(_79,true,function(loc){
for(var i=0;i<dojo.hostenv.localesGenerated.length;i++){
if(dojo.hostenv.localesGenerated[i]==loc){
dojo["require"]("nls.dojo_"+loc);
return true;
}
}
return false;
});
}
preload();
var _7c=djConfig.extraLocale||[];
for(var i=0;i<_7c.length;i++){
preload(_7c[i]);
}
}
dojo.hostenv.preloadLocalizations=function(){
};
};
dojo.requireLocalization=function(_7e,_7f,_80,_81){
dojo.hostenv.preloadLocalizations();
var _82=dojo.hostenv.normalizeLocale(_80);
var _83=[_7e,"nls",_7f].join(".");
var _84="";
if(_81){
var _85=_81.split(",");
for(var i=0;i<_85.length;i++){
if(_82.indexOf(_85[i])==0){
if(_85[i].length>_84.length){
_84=_85[i];
}
}
}
if(!_84){
_84="ROOT";
}
}
var _87=_81?_84:_82;
var _88=dojo.hostenv.findModule(_83);
var _89=null;
if(_88){
if(djConfig.localizationComplete&&_88._built){
return;
}
var _8a=_87.replace("-","_");
var _8b=_83+"."+_8a;
_89=dojo.hostenv.findModule(_8b);
}
if(!_89){
_88=dojo.hostenv.startPackage(_83);
var _8c=dojo.hostenv.getModuleSymbols(_7e);
var _8d=_8c.concat("nls").join("/");
var _8e;
dojo.hostenv.searchLocalePath(_87,_81,function(loc){
var _90=loc.replace("-","_");
var _91=_83+"."+_90;
var _92=false;
if(!dojo.hostenv.findModule(_91)){
dojo.hostenv.startPackage(_91);
var _93=[_8d];
if(loc!="ROOT"){
_93.push(loc);
}
_93.push(_7f);
var _94=_93.join("/")+".js";
_92=dojo.hostenv.loadPath(_94,null,function(_95){
var _96=function(){
};
_96.prototype=_8e;
_88[_90]=new _96();
for(var j in _95){
_88[_90][j]=_95[j];
}
});
}else{
_92=true;
}
if(_92&&_88[_90]){
_8e=_88[_90];
}else{
_88[_90]=_8e;
}
if(_81){
return true;
}
});
}
if(_81&&_82!=_84){
_88[_82.replace("-","_")]=_88[_84.replace("-","_")];
}
};
(function(){
var _98=djConfig.extraLocale;
if(_98){
if(!_98 instanceof Array){
_98=[_98];
}
var req=dojo.requireLocalization;
dojo.requireLocalization=function(m,b,_9c,_9d){
req(m,b,_9c,_9d);
if(_9c){
return;
}
for(var i=0;i<_98.length;i++){
req(m,b,_98[i],_9d);
}
};
}
})();
}
if(typeof window!="undefined"){
(function(){
if(djConfig.allowQueryConfig){
var _9f=document.location.toString();
var _a0=_9f.split("?",2);
if(_a0.length>1){
var _a1=_a0[1];
var _a2=_a1.split("&");
for(var x in _a2){
var sp=_a2[x].split("=");
if((sp[0].length>9)&&(sp[0].substr(0,9)=="djConfig.")){
var opt=sp[0].substr(9);
try{
djConfig[opt]=eval(sp[1]);
}
catch(e){
djConfig[opt]=sp[1];
}
}
}
}
}
if(((djConfig["baseScriptUri"]=="")||(djConfig["baseRelativePath"]==""))&&(document&&document.getElementsByTagName)){
var _a6=document.getElementsByTagName("script");
var _a7=/(__package__|dojo|bootstrap1)\.js([\?\.]|$)/i;
for(var i=0;i<_a6.length;i++){
var src=_a6[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_a7);
if(m){
var _ab=src.substring(0,m.index);
if(src.indexOf("bootstrap1")>-1){
_ab+="../";
}
if(!this["djConfig"]){
djConfig={};
}
if(djConfig["baseScriptUri"]==""){
djConfig["baseScriptUri"]=_ab;
}
if(djConfig["baseRelativePath"]==""){
djConfig["baseRelativePath"]=_ab;
}
break;
}
}
}
var dr=dojo.render;
var drh=dojo.render.html;
var drs=dojo.render.svg;
var dua=(drh.UA=navigator.userAgent);
var dav=(drh.AV=navigator.appVersion);
var t=true;
var f=false;
drh.capable=t;
drh.support.builtin=t;
dr.ver=parseFloat(drh.AV);
dr.os.mac=dav.indexOf("Macintosh")>=0;
dr.os.win=dav.indexOf("Windows")>=0;
dr.os.linux=dav.indexOf("X11")>=0;
drh.opera=dua.indexOf("Opera")>=0;
drh.khtml=(dav.indexOf("Konqueror")>=0)||(dav.indexOf("Safari")>=0);
drh.safari=dav.indexOf("Safari")>=0;
var _b3=dua.indexOf("Gecko");
drh.mozilla=drh.moz=(_b3>=0)&&(!drh.khtml);
if(drh.mozilla){
drh.geckoVersion=dua.substring(_b3+6,_b3+14);
}
drh.ie=(document.all)&&(!drh.opera);
drh.ie50=drh.ie&&dav.indexOf("MSIE 5.0")>=0;
drh.ie55=drh.ie&&dav.indexOf("MSIE 5.5")>=0;
drh.ie60=drh.ie&&dav.indexOf("MSIE 6.0")>=0;
drh.ie70=drh.ie&&dav.indexOf("MSIE 7.0")>=0;
var cm=document["compatMode"];
drh.quirks=(cm=="BackCompat")||(cm=="QuirksMode")||drh.ie55||drh.ie50;
dojo.locale=dojo.locale||(drh.ie?navigator.userLanguage:navigator.language).toLowerCase();
dr.vml.capable=drh.ie;
drs.capable=f;
drs.support.plugin=f;
drs.support.builtin=f;
var _b5=window["document"];
var tdi=_b5["implementation"];
if((tdi)&&(tdi["hasFeature"])&&(tdi.hasFeature("org.w3c.dom.svg","1.0"))){
drs.capable=t;
drs.support.builtin=t;
drs.support.plugin=f;
}
if(drh.safari){
var tmp=dua.split("AppleWebKit/")[1];
var ver=parseFloat(tmp.split(" ")[0]);
if(ver>=420){
drs.capable=t;
drs.support.builtin=t;
drs.support.plugin=f;
}
}else{
}
})();
dojo.hostenv.startPackage("dojo.hostenv");
dojo.render.name=dojo.hostenv.name_="browser";
dojo.hostenv.searchIds=[];
dojo.hostenv._XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
dojo.hostenv.getXmlhttpObject=function(){
var _b9=null;
var _ba=null;
try{
_b9=new XMLHttpRequest();
}
catch(e){
}
if(!_b9){
for(var i=0;i<3;++i){
var _bc=dojo.hostenv._XMLHTTP_PROGIDS[i];
try{
_b9=new ActiveXObject(_bc);
}
catch(e){
_ba=e;
}
if(_b9){
dojo.hostenv._XMLHTTP_PROGIDS=[_bc];
break;
}
}
}
if(!_b9){
return dojo.raise("XMLHTTP not available",_ba);
}
return _b9;
};
dojo.hostenv._blockAsync=false;
dojo.hostenv.getText=function(uri,_be,_bf){
if(!_be){
this._blockAsync=true;
}
var _c0=this.getXmlhttpObject();
function isDocumentOk(_c1){
var _c2=_c1["status"];
return Boolean((!_c2)||((200<=_c2)&&(300>_c2))||(_c2==304));
}
if(_be){
var _c3=this,_c4=null,gbl=dojo.global();
var xhr=dojo.evalObjPath("dojo.io.XMLHTTPTransport");
_c0.onreadystatechange=function(){
if(_c4){
gbl.clearTimeout(_c4);
_c4=null;
}
if(_c3._blockAsync||(xhr&&xhr._blockAsync)){
_c4=gbl.setTimeout(function(){
_c0.onreadystatechange.apply(this);
},10);
}else{
if(4==_c0.readyState){
if(isDocumentOk(_c0)){
_be(_c0.responseText);
}
}
}
};
}
_c0.open("GET",uri,_be?true:false);
try{
_c0.send(null);
if(_be){
return null;
}
if(!isDocumentOk(_c0)){
var err=Error("Unable to load "+uri+" status:"+_c0.status);
err.status=_c0.status;
err.responseText=_c0.responseText;
throw err;
}
}
catch(e){
this._blockAsync=false;
if((_bf)&&(!_be)){
return null;
}else{
throw e;
}
}
this._blockAsync=false;
return _c0.responseText;
};
dojo.hostenv.defaultDebugContainerId="dojoDebug";
dojo.hostenv._println_buffer=[];
dojo.hostenv._println_safe=false;
dojo.hostenv.println=function(_c8){
if(!dojo.hostenv._println_safe){
dojo.hostenv._println_buffer.push(_c8);
}else{
try{
var _c9=document.getElementById(djConfig.debugContainerId?djConfig.debugContainerId:dojo.hostenv.defaultDebugContainerId);
if(!_c9){
_c9=dojo.body();
}
var div=document.createElement("div");
div.appendChild(document.createTextNode(_c8));
_c9.appendChild(div);
}
catch(e){
try{
document.write("<div>"+_c8+"</div>");
}
catch(e2){
window.status=_c8;
}
}
}
};
dojo.addOnLoad(function(){
dojo.hostenv._println_safe=true;
while(dojo.hostenv._println_buffer.length>0){
dojo.hostenv.println(dojo.hostenv._println_buffer.shift());
}
});
function dj_addNodeEvtHdlr(_cb,_cc,fp){
var _ce=_cb["on"+_cc]||function(){
};
_cb["on"+_cc]=function(){
fp.apply(_cb,arguments);
_ce.apply(_cb,arguments);
};
return true;
}
function dj_load_init(e){
var _d0=(e&&e.type)?e.type.toLowerCase():"load";
if(arguments.callee.initialized||(_d0!="domcontentloaded"&&_d0!="load")){
return;
}
arguments.callee.initialized=true;
if(typeof (_timer)!="undefined"){
clearInterval(_timer);
delete _timer;
}
var _d1=function(){
if(dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
};
if(dojo.hostenv.inFlightCount==0){
_d1();
dojo.hostenv.modulesLoaded();
}else{
dojo.hostenv.modulesLoadedListeners.unshift(_d1);
}
}
if(document.addEventListener){
if(dojo.render.html.opera||(dojo.render.html.moz&&(djConfig["enableMozDomContentLoaded"]===true))){
document.addEventListener("DOMContentLoaded",dj_load_init,null);
}
window.addEventListener("load",dj_load_init,null);
}
if(dojo.render.html.ie&&dojo.render.os.win){
document.attachEvent("onreadystatechange",function(e){
if(document.readyState=="complete"){
dj_load_init();
}
});
}
if(/(WebKit|khtml)/i.test(navigator.userAgent)){
var _timer=setInterval(function(){
if(/loaded|complete/.test(document.readyState)){
dj_load_init();
}
},10);
}
if(dojo.render.html.ie){
dj_addNodeEvtHdlr(window,"beforeunload",function(){
dojo.hostenv._unloading=true;
window.setTimeout(function(){
dojo.hostenv._unloading=false;
},0);
});
}
dj_addNodeEvtHdlr(window,"unload",function(){
dojo.hostenv.unloaded();
if((!dojo.render.html.ie)||(dojo.render.html.ie&&dojo.hostenv._unloading)){
dojo.hostenv.unloaded();
}
});
dojo.hostenv.makeWidgets=function(){
var _d3=[];
if(djConfig.searchIds&&djConfig.searchIds.length>0){
_d3=_d3.concat(djConfig.searchIds);
}
if(dojo.hostenv.searchIds&&dojo.hostenv.searchIds.length>0){
_d3=_d3.concat(dojo.hostenv.searchIds);
}
if((djConfig.parseWidgets)||(_d3.length>0)){
if(dojo.evalObjPath("dojo.widget.Parse")){
var _d4=new dojo.xml.Parse();
if(_d3.length>0){
for(var x=0;x<_d3.length;x++){
var _d6=document.getElementById(_d3[x]);
if(!_d6){
continue;
}
var _d7=_d4.parseElement(_d6,null,true);
dojo.widget.getParser().createComponents(_d7);
}
}else{
if(djConfig.parseWidgets){
var _d7=_d4.parseElement(dojo.body(),null,true);
dojo.widget.getParser().createComponents(_d7);
}
}
}
}
};
dojo.addOnLoad(function(){
if(!dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
});
try{
if(dojo.render.html.ie){
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
document.createStyleSheet().addRule("v\\:*","behavior:url(#default#VML)");
}
}
catch(e){
}
dojo.hostenv.writeIncludes=function(){
};
if(!dj_undef("document",this)){
dj_currentDocument=this.document;
}
dojo.doc=function(){
return dj_currentDocument;
};
dojo.body=function(){
return dojo.doc().body||dojo.doc().getElementsByTagName("body")[0];
};
dojo.byId=function(id,doc){
if((id)&&((typeof id=="string")||(id instanceof String))){
if(!doc){
doc=dj_currentDocument;
}
var ele=doc.getElementById(id);
if(ele&&(ele.id!=id)&&doc.all){
ele=null;
eles=doc.all[id];
if(eles){
if(eles.length){
for(var i=0;i<eles.length;i++){
if(eles[i].id==id){
ele=eles[i];
break;
}
}
}else{
ele=eles;
}
}
}
return ele;
}
return id;
};
dojo.setContext=function(_dc,_dd){
dj_currentContext=_dc;
dj_currentDocument=_dd;
};
dojo._fireCallback=function(_de,_df,_e0){
if((_df)&&((typeof _de=="string")||(_de instanceof String))){
_de=_df[_de];
}
return (_df?_de.apply(_df,_e0||[]):_de());
};
dojo.withGlobal=function(_e1,_e2,_e3,_e4){
var _e5;
var _e6=dj_currentContext;
var _e7=dj_currentDocument;
try{
dojo.setContext(_e1,_e1.document);
_e5=dojo._fireCallback(_e2,_e3,_e4);
}
finally{
dojo.setContext(_e6,_e7);
}
return _e5;
};
dojo.withDoc=function(_e8,_e9,_ea,_eb){
var _ec;
var _ed=dj_currentDocument;
try{
dj_currentDocument=_e8;
_ec=dojo._fireCallback(_e9,_ea,_eb);
}
finally{
dj_currentDocument=_ed;
}
return _ec;
};
}
dojo.requireIf((djConfig["isDebug"]||djConfig["debugAtAllCosts"]),"dojo.debug");
dojo.requireIf(djConfig["debugAtAllCosts"]&&!window.widget&&!djConfig["useXDomain"],"dojo.browser_debug");
dojo.requireIf(djConfig["debugAtAllCosts"]&&!window.widget&&djConfig["useXDomain"],"dojo.browser_debug_xd");
dojo.provide("dojo.dom");
dojo.dom.ELEMENT_NODE=1;
dojo.dom.ATTRIBUTE_NODE=2;
dojo.dom.TEXT_NODE=3;
dojo.dom.CDATA_SECTION_NODE=4;
dojo.dom.ENTITY_REFERENCE_NODE=5;
dojo.dom.ENTITY_NODE=6;
dojo.dom.PROCESSING_INSTRUCTION_NODE=7;
dojo.dom.COMMENT_NODE=8;
dojo.dom.DOCUMENT_NODE=9;
dojo.dom.DOCUMENT_TYPE_NODE=10;
dojo.dom.DOCUMENT_FRAGMENT_NODE=11;
dojo.dom.NOTATION_NODE=12;
dojo.dom.dojoml="http://www.dojotoolkit.org/2004/dojoml";
dojo.dom.xmlns={svg:"http://www.w3.org/2000/svg",smil:"http://www.w3.org/2001/SMIL20/",mml:"http://www.w3.org/1998/Math/MathML",cml:"http://www.xml-cml.org",xlink:"http://www.w3.org/1999/xlink",xhtml:"http://www.w3.org/1999/xhtml",xul:"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",xbl:"http://www.mozilla.org/xbl",fo:"http://www.w3.org/1999/XSL/Format",xsl:"http://www.w3.org/1999/XSL/Transform",xslt:"http://www.w3.org/1999/XSL/Transform",xi:"http://www.w3.org/2001/XInclude",xforms:"http://www.w3.org/2002/01/xforms",saxon:"http://icl.com/saxon",xalan:"http://xml.apache.org/xslt",xsd:"http://www.w3.org/2001/XMLSchema",dt:"http://www.w3.org/2001/XMLSchema-datatypes",xsi:"http://www.w3.org/2001/XMLSchema-instance",rdf:"http://www.w3.org/1999/02/22-rdf-syntax-ns#",rdfs:"http://www.w3.org/2000/01/rdf-schema#",dc:"http://purl.org/dc/elements/1.1/",dcq:"http://purl.org/dc/qualifiers/1.0","soap-env":"http://schemas.xmlsoap.org/soap/envelope/",wsdl:"http://schemas.xmlsoap.org/wsdl/",AdobeExtensions:"http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"};
dojo.dom.isNode=function(wh){
if(typeof Element=="function"){
try{
return wh instanceof Element;
}
catch(e){
}
}else{
return wh&&!isNaN(wh.nodeType);
}
};
dojo.dom.getUniqueId=function(){
var _ef=dojo.doc();
do{
var id="dj_unique_"+(++arguments.callee._idIncrement);
}while(_ef.getElementById(id));
return id;
};
dojo.dom.getUniqueId._idIncrement=0;
dojo.dom.firstElement=dojo.dom.getFirstChildElement=function(_f1,_f2){
var _f3=_f1.firstChild;
while(_f3&&_f3.nodeType!=dojo.dom.ELEMENT_NODE){
_f3=_f3.nextSibling;
}
if(_f2&&_f3&&_f3.tagName&&_f3.tagName.toLowerCase()!=_f2.toLowerCase()){
_f3=dojo.dom.nextElement(_f3,_f2);
}
return _f3;
};
dojo.dom.lastElement=dojo.dom.getLastChildElement=function(_f4,_f5){
var _f6=_f4.lastChild;
while(_f6&&_f6.nodeType!=dojo.dom.ELEMENT_NODE){
_f6=_f6.previousSibling;
}
if(_f5&&_f6&&_f6.tagName&&_f6.tagName.toLowerCase()!=_f5.toLowerCase()){
_f6=dojo.dom.prevElement(_f6,_f5);
}
return _f6;
};
dojo.dom.nextElement=dojo.dom.getNextSiblingElement=function(_f7,_f8){
if(!_f7){
return null;
}
do{
_f7=_f7.nextSibling;
}while(_f7&&_f7.nodeType!=dojo.dom.ELEMENT_NODE);
if(_f7&&_f8&&_f8.toLowerCase()!=_f7.tagName.toLowerCase()){
return dojo.dom.nextElement(_f7,_f8);
}
return _f7;
};
dojo.dom.prevElement=dojo.dom.getPreviousSiblingElement=function(_f9,_fa){
if(!_f9){
return null;
}
if(_fa){
_fa=_fa.toLowerCase();
}
do{
_f9=_f9.previousSibling;
}while(_f9&&_f9.nodeType!=dojo.dom.ELEMENT_NODE);
if(_f9&&_fa&&_fa.toLowerCase()!=_f9.tagName.toLowerCase()){
return dojo.dom.prevElement(_f9,_fa);
}
return _f9;
};
dojo.dom.moveChildren=function(_fb,_fc,_fd){
var _fe=0;
if(_fd){
while(_fb.hasChildNodes()&&_fb.firstChild.nodeType==dojo.dom.TEXT_NODE){
_fb.removeChild(_fb.firstChild);
}
while(_fb.hasChildNodes()&&_fb.lastChild.nodeType==dojo.dom.TEXT_NODE){
_fb.removeChild(_fb.lastChild);
}
}
while(_fb.hasChildNodes()){
_fc.appendChild(_fb.firstChild);
_fe++;
}
return _fe;
};
dojo.dom.copyChildren=function(_ff,_100,trim){
var _102=_ff.cloneNode(true);
return this.moveChildren(_102,_100,trim);
};
dojo.dom.replaceChildren=function(node,_104){
var _105=[];
if(dojo.render.html.ie){
for(var i=0;i<node.childNodes.length;i++){
_105.push(node.childNodes[i]);
}
}
dojo.dom.removeChildren(node);
node.appendChild(_104);
for(var i=0;i<_105.length;i++){
dojo.dom.destroyNode(_105[i]);
}
};
dojo.dom.removeChildren=function(node){
var _108=node.childNodes.length;
while(node.hasChildNodes()){
dojo.dom.removeNode(node.firstChild);
}
return _108;
};
dojo.dom.replaceNode=function(node,_10a){
return node.parentNode.replaceChild(_10a,node);
};
dojo.dom.destroyNode=function(node){
if(node.parentNode){
node=dojo.dom.removeNode(node);
}
if(node.nodeType!=3){
if(dojo.evalObjPath("dojo.event.browser.clean",false)){
dojo.event.browser.clean(node);
}
if(dojo.render.html.ie){
node.outerHTML="";
}
}
};
dojo.dom.removeNode=function(node){
if(node&&node.parentNode){
return node.parentNode.removeChild(node);
}
};
dojo.dom.getAncestors=function(node,_10e,_10f){
var _110=[];
var _111=(_10e&&(_10e instanceof Function||typeof _10e=="function"));
while(node){
if(!_111||_10e(node)){
_110.push(node);
}
if(_10f&&_110.length>0){
return _110[0];
}
node=node.parentNode;
}
if(_10f){
return null;
}
return _110;
};
dojo.dom.getAncestorsByTag=function(node,tag,_114){
tag=tag.toLowerCase();
return dojo.dom.getAncestors(node,function(el){
return ((el.tagName)&&(el.tagName.toLowerCase()==tag));
},_114);
};
dojo.dom.getFirstAncestorByTag=function(node,tag){
return dojo.dom.getAncestorsByTag(node,tag,true);
};
dojo.dom.isDescendantOf=function(node,_119,_11a){
if(_11a&&node){
node=node.parentNode;
}
while(node){
if(node==_119){
return true;
}
node=node.parentNode;
}
return false;
};
dojo.dom.innerXML=function(node){
if(node.innerXML){
return node.innerXML;
}else{
if(node.xml){
return node.xml;
}else{
if(typeof XMLSerializer!="undefined"){
return (new XMLSerializer()).serializeToString(node);
}
}
}
};
dojo.dom.createDocument=function(){
var doc=null;
var _11d=dojo.doc();
if(!dj_undef("ActiveXObject")){
var _11e=["MSXML2","Microsoft","MSXML","MSXML3"];
for(var i=0;i<_11e.length;i++){
try{
doc=new ActiveXObject(_11e[i]+".XMLDOM");
}
catch(e){
}
if(doc){
break;
}
}
}else{
if((_11d.implementation)&&(_11d.implementation.createDocument)){
doc=_11d.implementation.createDocument("","",null);
}
}
return doc;
};
dojo.dom.createDocumentFromText=function(str,_121){
if(!_121){
_121="text/xml";
}
if(!dj_undef("DOMParser")){
var _122=new DOMParser();
return _122.parseFromString(str,_121);
}else{
if(!dj_undef("ActiveXObject")){
var _123=dojo.dom.createDocument();
if(_123){
_123.async=false;
_123.loadXML(str);
return _123;
}else{
dojo.debug("toXml didn't work?");
}
}else{
var _124=dojo.doc();
if(_124.createElement){
var tmp=_124.createElement("xml");
tmp.innerHTML=str;
if(_124.implementation&&_124.implementation.createDocument){
var _126=_124.implementation.createDocument("foo","",null);
for(var i=0;i<tmp.childNodes.length;i++){
_126.importNode(tmp.childNodes.item(i),true);
}
return _126;
}
return ((tmp.document)&&(tmp.document.firstChild?tmp.document.firstChild:tmp));
}
}
}
return null;
};
dojo.dom.prependChild=function(node,_129){
if(_129.firstChild){
_129.insertBefore(node,_129.firstChild);
}else{
_129.appendChild(node);
}
return true;
};
dojo.dom.insertBefore=function(node,ref,_12c){
if((_12c!=true)&&(node===ref||node.nextSibling===ref)){
return false;
}
var _12d=ref.parentNode;
_12d.insertBefore(node,ref);
return true;
};
dojo.dom.insertAfter=function(node,ref,_130){
var pn=ref.parentNode;
if(ref==pn.lastChild){
if((_130!=true)&&(node===ref)){
return false;
}
pn.appendChild(node);
}else{
return this.insertBefore(node,ref.nextSibling,_130);
}
return true;
};
dojo.dom.insertAtPosition=function(node,ref,_134){
if((!node)||(!ref)||(!_134)){
return false;
}
switch(_134.toLowerCase()){
case "before":
return dojo.dom.insertBefore(node,ref);
case "after":
return dojo.dom.insertAfter(node,ref);
case "first":
if(ref.firstChild){
return dojo.dom.insertBefore(node,ref.firstChild);
}else{
ref.appendChild(node);
return true;
}
break;
default:
ref.appendChild(node);
return true;
}
};
dojo.dom.insertAtIndex=function(node,_136,_137){
var _138=_136.childNodes;
if(!_138.length||_138.length==_137){
_136.appendChild(node);
return true;
}
if(_137==0){
return dojo.dom.prependChild(node,_136);
}
return dojo.dom.insertAfter(node,_138[_137-1]);
};
dojo.dom.textContent=function(node,text){
if(arguments.length>1){
var _13b=dojo.doc();
dojo.dom.replaceChildren(node,_13b.createTextNode(text));
return text;
}else{
if(node.textContent!=undefined){
return node.textContent;
}
var _13c="";
if(node==null){
return _13c;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
_13c+=dojo.dom.textContent(node.childNodes[i]);
break;
case 3:
case 2:
case 4:
_13c+=node.childNodes[i].nodeValue;
break;
default:
break;
}
}
return _13c;
}
};
dojo.dom.hasParent=function(node){
return Boolean(node&&node.parentNode&&dojo.dom.isNode(node.parentNode));
};
dojo.dom.isTag=function(node){
if(node&&node.tagName){
for(var i=1;i<arguments.length;i++){
if(node.tagName==String(arguments[i])){
return String(arguments[i]);
}
}
}
return "";
};
dojo.dom.setAttributeNS=function(elem,_142,_143,_144){
if(elem==null||((elem==undefined)&&(typeof elem=="undefined"))){
dojo.raise("No element given to dojo.dom.setAttributeNS");
}
if(!((elem.setAttributeNS==undefined)&&(typeof elem.setAttributeNS=="undefined"))){
elem.setAttributeNS(_142,_143,_144);
}else{
var _145=elem.ownerDocument;
var _146=_145.createNode(2,_143,_142);
_146.nodeValue=_144;
elem.setAttributeNode(_146);
}
};
dojo.provide("dojo.xml.Parse");
dojo.xml.Parse=function(){
var isIE=((dojo.render.html.capable)&&(dojo.render.html.ie));
function getTagName(node){
try{
return node.tagName.toLowerCase();
}
catch(e){
return "";
}
}
function getDojoTagName(node){
var _14a=getTagName(node);
if(!_14a){
return "";
}
if((dojo.widget)&&(dojo.widget.tags[_14a])){
return _14a;
}
var p=_14a.indexOf(":");
if(p>=0){
return _14a;
}
if(_14a.substr(0,5)=="dojo:"){
return _14a;
}
if(dojo.render.html.capable&&dojo.render.html.ie&&node.scopeName!="HTML"){
return node.scopeName.toLowerCase()+":"+_14a;
}
if(_14a.substr(0,4)=="dojo"){
return "dojo:"+_14a.substring(4);
}
var djt=node.getAttribute("dojoType")||node.getAttribute("dojotype");
if(djt){
if(djt.indexOf(":")<0){
djt="dojo:"+djt;
}
return djt.toLowerCase();
}
djt=node.getAttributeNS&&node.getAttributeNS(dojo.dom.dojoml,"type");
if(djt){
return "dojo:"+djt.toLowerCase();
}
try{
djt=node.getAttribute("dojo:type");
}
catch(e){
}
if(djt){
return "dojo:"+djt.toLowerCase();
}
if((dj_global["djConfig"])&&(!djConfig["ignoreClassNames"])){
var _14d=node.className||node.getAttribute("class");
if((_14d)&&(_14d.indexOf)&&(_14d.indexOf("dojo-")!=-1)){
var _14e=_14d.split(" ");
for(var x=0,c=_14e.length;x<c;x++){
if(_14e[x].slice(0,5)=="dojo-"){
return "dojo:"+_14e[x].substr(5).toLowerCase();
}
}
}
}
return "";
}
this.parseElement=function(node,_152,_153,_154){
var _155=getTagName(node);
if(isIE&&_155.indexOf("/")==0){
return null;
}
try{
var attr=node.getAttribute("parseWidgets");
if(attr&&attr.toLowerCase()=="false"){
return {};
}
}
catch(e){
}
var _157=true;
if(_153){
var _158=getDojoTagName(node);
_155=_158||_155;
_157=Boolean(_158);
}
var _159={};
_159[_155]=[];
var pos=_155.indexOf(":");
if(pos>0){
var ns=_155.substring(0,pos);
_159["ns"]=ns;
if((dojo.ns)&&(!dojo.ns.allow(ns))){
_157=false;
}
}
if(_157){
var _15c=this.parseAttributes(node);
for(var attr in _15c){
if((!_159[_155][attr])||(typeof _159[_155][attr]!="array")){
_159[_155][attr]=[];
}
_159[_155][attr].push(_15c[attr]);
}
_159[_155].nodeRef=node;
_159.tagName=_155;
_159.index=_154||0;
}
var _15d=0;
for(var i=0;i<node.childNodes.length;i++){
var tcn=node.childNodes.item(i);
switch(tcn.nodeType){
case dojo.dom.ELEMENT_NODE:
var ctn=getDojoTagName(tcn)||getTagName(tcn);
if(!_159[ctn]){
_159[ctn]=[];
}
_159[ctn].push(this.parseElement(tcn,true,_153,_15d));
if((tcn.childNodes.length==1)&&(tcn.childNodes.item(0).nodeType==dojo.dom.TEXT_NODE)){
_159[ctn][_159[ctn].length-1].value=tcn.childNodes.item(0).nodeValue;
}
_15d++;
break;
case dojo.dom.TEXT_NODE:
if(node.childNodes.length==1){
_159[_155].push({value:node.childNodes.item(0).nodeValue});
}
break;
default:
break;
}
}
return _159;
};
this.parseAttributes=function(node){
var _162={};
var atts=node.attributes;
var _164,i=0;
while((_164=atts[i++])){
if(isIE){
if(!_164){
continue;
}
if((typeof _164=="object")&&(typeof _164.nodeValue=="undefined")||(_164.nodeValue==null)||(_164.nodeValue=="")){
continue;
}
}
var nn=_164.nodeName.split(":");
nn=(nn.length==2)?nn[1]:_164.nodeName;
_162[nn]={value:_164.nodeValue};
}
return _162;
};
};
dojo.provide("dojo.lang.common");
dojo.lang.inherits=function(_167,_168){
if(!dojo.lang.isFunction(_168)){
dojo.raise("dojo.inherits: superclass argument ["+_168+"] must be a function (subclass: ["+_167+"']");
}
_167.prototype=new _168();
_167.prototype.constructor=_167;
_167.superclass=_168.prototype;
_167["super"]=_168.prototype;
};
dojo.lang._mixin=function(obj,_16a){
var tobj={};
for(var x in _16a){
if((typeof tobj[x]=="undefined")||(tobj[x]!=_16a[x])){
obj[x]=_16a[x];
}
}
if(dojo.render.html.ie&&(typeof (_16a["toString"])=="function")&&(_16a["toString"]!=obj["toString"])&&(_16a["toString"]!=tobj["toString"])){
obj.toString=_16a.toString;
}
return obj;
};
dojo.lang.mixin=function(obj,_16e){
for(var i=1,l=arguments.length;i<l;i++){
dojo.lang._mixin(obj,arguments[i]);
}
return obj;
};
dojo.lang.extend=function(_171,_172){
for(var i=1,l=arguments.length;i<l;i++){
dojo.lang._mixin(_171.prototype,arguments[i]);
}
return _171;
};
dojo.inherits=dojo.lang.inherits;
dojo.mixin=dojo.lang.mixin;
dojo.extend=dojo.lang.extend;
dojo.lang.find=function(_175,_176,_177,_178){
if(!dojo.lang.isArrayLike(_175)&&dojo.lang.isArrayLike(_176)){
dojo.deprecated("dojo.lang.find(value, array)","use dojo.lang.find(array, value) instead","0.5");
var temp=_175;
_175=_176;
_176=temp;
}
var _17a=dojo.lang.isString(_175);
if(_17a){
_175=_175.split("");
}
if(_178){
var step=-1;
var i=_175.length-1;
var end=-1;
}else{
var step=1;
var i=0;
var end=_175.length;
}
if(_177){
while(i!=end){
if(_175[i]===_176){
return i;
}
i+=step;
}
}else{
while(i!=end){
if(_175[i]==_176){
return i;
}
i+=step;
}
}
return -1;
};
dojo.lang.indexOf=dojo.lang.find;
dojo.lang.findLast=function(_17e,_17f,_180){
return dojo.lang.find(_17e,_17f,_180,true);
};
dojo.lang.lastIndexOf=dojo.lang.findLast;
dojo.lang.inArray=function(_181,_182){
return dojo.lang.find(_181,_182)>-1;
};
dojo.lang.isObject=function(it){
if(typeof it=="undefined"){
return false;
}
return (typeof it=="object"||it===null||dojo.lang.isArray(it)||dojo.lang.isFunction(it));
};
dojo.lang.isArray=function(it){
return (it&&it instanceof Array||typeof it=="array");
};
dojo.lang.isArrayLike=function(it){
if((!it)||(dojo.lang.isUndefined(it))){
return false;
}
if(dojo.lang.isString(it)){
return false;
}
if(dojo.lang.isFunction(it)){
return false;
}
if(dojo.lang.isArray(it)){
return true;
}
if((it.tagName)&&(it.tagName.toLowerCase()=="form")){
return false;
}
if(dojo.lang.isNumber(it.length)&&isFinite(it.length)){
return true;
}
return false;
};
dojo.lang.isFunction=function(it){
return (it instanceof Function||typeof it=="function");
};
(function(){
if((dojo.render.html.capable)&&(dojo.render.html["safari"])){
dojo.lang.isFunction=function(it){
if((typeof (it)=="function")&&(it=="[object NodeList]")){
return false;
}
return (it instanceof Function||typeof it=="function");
};
}
})();
dojo.lang.isString=function(it){
return (typeof it=="string"||it instanceof String);
};
dojo.lang.isAlien=function(it){
if(!it){
return false;
}
return !dojo.lang.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));
};
dojo.lang.isBoolean=function(it){
return (it instanceof Boolean||typeof it=="boolean");
};
dojo.lang.isNumber=function(it){
return (it instanceof Number||typeof it=="number");
};
dojo.lang.isUndefined=function(it){
return ((typeof (it)=="undefined")&&(it==undefined));
};
dojo.provide("dojo.lang.func");
dojo.lang.hitch=function(_18d,_18e){
var fcn=(dojo.lang.isString(_18e)?_18d[_18e]:_18e)||function(){
};
return function(){
return fcn.apply(_18d,arguments);
};
};
dojo.lang.anonCtr=0;
dojo.lang.anon={};
dojo.lang.nameAnonFunc=function(_190,_191,_192){
var nso=(_191||dojo.lang.anon);
if((_192)||((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"]==true))){
for(var x in nso){
try{
if(nso[x]===_190){
return x;
}
}
catch(e){
}
}
}
var ret="__"+dojo.lang.anonCtr++;
while(typeof nso[ret]!="undefined"){
ret="__"+dojo.lang.anonCtr++;
}
nso[ret]=_190;
return ret;
};
dojo.lang.forward=function(_196){
return function(){
return this[_196].apply(this,arguments);
};
};
dojo.lang.curry=function(_197,func){
var _199=[];
_197=_197||dj_global;
if(dojo.lang.isString(func)){
func=_197[func];
}
for(var x=2;x<arguments.length;x++){
_199.push(arguments[x]);
}
var _19b=(func["__preJoinArity"]||func.length)-_199.length;
function gather(_19c,_19d,_19e){
var _19f=_19e;
var _1a0=_19d.slice(0);
for(var x=0;x<_19c.length;x++){
_1a0.push(_19c[x]);
}
_19e=_19e-_19c.length;
if(_19e<=0){
var res=func.apply(_197,_1a0);
_19e=_19f;
return res;
}else{
return function(){
return gather(arguments,_1a0,_19e);
};
}
}
return gather([],_199,_19b);
};
dojo.lang.curryArguments=function(_1a3,func,args,_1a6){
var _1a7=[];
var x=_1a6||0;
for(x=_1a6;x<args.length;x++){
_1a7.push(args[x]);
}
return dojo.lang.curry.apply(dojo.lang,[_1a3,func].concat(_1a7));
};
dojo.lang.tryThese=function(){
for(var x=0;x<arguments.length;x++){
try{
if(typeof arguments[x]=="function"){
var ret=(arguments[x]());
if(ret){
return ret;
}
}
}
catch(e){
dojo.debug(e);
}
}
};
dojo.lang.delayThese=function(farr,cb,_1ad,_1ae){
if(!farr.length){
if(typeof _1ae=="function"){
_1ae();
}
return;
}
if((typeof _1ad=="undefined")&&(typeof cb=="number")){
_1ad=cb;
cb=function(){
};
}else{
if(!cb){
cb=function(){
};
if(!_1ad){
_1ad=0;
}
}
}
setTimeout(function(){
(farr.shift())();
cb();
dojo.lang.delayThese(farr,cb,_1ad,_1ae);
},_1ad);
};
dojo.provide("dojo.lang.array");
dojo.lang.mixin(dojo.lang,{has:function(obj,name){
try{
return typeof obj[name]!="undefined";
}
catch(e){
return false;
}
},isEmpty:function(obj){
if(dojo.lang.isObject(obj)){
var tmp={};
var _1b3=0;
for(var x in obj){
if(obj[x]&&(!tmp[x])){
_1b3++;
break;
}
}
return _1b3==0;
}else{
if(dojo.lang.isArrayLike(obj)||dojo.lang.isString(obj)){
return obj.length==0;
}
}
},map:function(arr,obj,_1b7){
var _1b8=dojo.lang.isString(arr);
if(_1b8){
arr=arr.split("");
}
if(dojo.lang.isFunction(obj)&&(!_1b7)){
_1b7=obj;
obj=dj_global;
}else{
if(dojo.lang.isFunction(obj)&&_1b7){
var _1b9=obj;
obj=_1b7;
_1b7=_1b9;
}
}
if(Array.map){
var _1ba=Array.map(arr,_1b7,obj);
}else{
var _1ba=[];
for(var i=0;i<arr.length;++i){
_1ba.push(_1b7.call(obj,arr[i]));
}
}
if(_1b8){
return _1ba.join("");
}else{
return _1ba;
}
},reduce:function(arr,_1bd,obj,_1bf){
var _1c0=_1bd;
if(arguments.length==2){
_1bf=_1bd;
_1c0=arr[0];
arr=arr.slice(1);
}else{
if(arguments.length==3){
if(dojo.lang.isFunction(obj)){
_1bf=obj;
obj=null;
}
}else{
if(dojo.lang.isFunction(obj)){
var tmp=_1bf;
_1bf=obj;
obj=tmp;
}
}
}
var ob=obj||dj_global;
dojo.lang.map(arr,function(val){
_1c0=_1bf.call(ob,_1c0,val);
});
return _1c0;
},forEach:function(_1c4,_1c5,_1c6){
if(dojo.lang.isString(_1c4)){
_1c4=_1c4.split("");
}
if(Array.forEach){
Array.forEach(_1c4,_1c5,_1c6);
}else{
if(!_1c6){
_1c6=dj_global;
}
for(var i=0,l=_1c4.length;i<l;i++){
_1c5.call(_1c6,_1c4[i],i,_1c4);
}
}
},_everyOrSome:function(_1c9,arr,_1cb,_1cc){
if(dojo.lang.isString(arr)){
arr=arr.split("");
}
if(Array.every){
return Array[_1c9?"every":"some"](arr,_1cb,_1cc);
}else{
if(!_1cc){
_1cc=dj_global;
}
for(var i=0,l=arr.length;i<l;i++){
var _1cf=_1cb.call(_1cc,arr[i],i,arr);
if(_1c9&&!_1cf){
return false;
}else{
if((!_1c9)&&(_1cf)){
return true;
}
}
}
return Boolean(_1c9);
}
},every:function(arr,_1d1,_1d2){
return this._everyOrSome(true,arr,_1d1,_1d2);
},some:function(arr,_1d4,_1d5){
return this._everyOrSome(false,arr,_1d4,_1d5);
},filter:function(arr,_1d7,_1d8){
var _1d9=dojo.lang.isString(arr);
if(_1d9){
arr=arr.split("");
}
var _1da;
if(Array.filter){
_1da=Array.filter(arr,_1d7,_1d8);
}else{
if(!_1d8){
if(arguments.length>=3){
dojo.raise("thisObject doesn't exist!");
}
_1d8=dj_global;
}
_1da=[];
for(var i=0;i<arr.length;i++){
if(_1d7.call(_1d8,arr[i],i,arr)){
_1da.push(arr[i]);
}
}
}
if(_1d9){
return _1da.join("");
}else{
return _1da;
}
},unnest:function(){
var out=[];
for(var i=0;i<arguments.length;i++){
if(dojo.lang.isArrayLike(arguments[i])){
var add=dojo.lang.unnest.apply(this,arguments[i]);
out=out.concat(add);
}else{
out.push(arguments[i]);
}
}
return out;
},toArray:function(_1df,_1e0){
var _1e1=[];
for(var i=_1e0||0;i<_1df.length;i++){
_1e1.push(_1df[i]);
}
return _1e1;
}});
dojo.provide("dojo.lang.extras");
dojo.lang.setTimeout=function(func,_1e4){
var _1e5=window,_1e6=2;
if(!dojo.lang.isFunction(func)){
_1e5=func;
func=_1e4;
_1e4=arguments[2];
_1e6++;
}
if(dojo.lang.isString(func)){
func=_1e5[func];
}
var args=[];
for(var i=_1e6;i<arguments.length;i++){
args.push(arguments[i]);
}
return dojo.global().setTimeout(function(){
func.apply(_1e5,args);
},_1e4);
};
dojo.lang.clearTimeout=function(_1e9){
dojo.global().clearTimeout(_1e9);
};
dojo.lang.getNameInObj=function(ns,item){
if(!ns){
ns=dj_global;
}
for(var x in ns){
if(ns[x]===item){
return new String(x);
}
}
return null;
};
dojo.lang.shallowCopy=function(obj,deep){
var i,ret;
if(obj===null){
return null;
}
if(dojo.lang.isObject(obj)){
ret=new obj.constructor();
for(i in obj){
if(dojo.lang.isUndefined(ret[i])){
ret[i]=deep?dojo.lang.shallowCopy(obj[i],deep):obj[i];
}
}
}else{
if(dojo.lang.isArray(obj)){
ret=[];
for(i=0;i<obj.length;i++){
ret[i]=deep?dojo.lang.shallowCopy(obj[i],deep):obj[i];
}
}else{
ret=obj;
}
}
return ret;
};
dojo.lang.firstValued=function(){
for(var i=0;i<arguments.length;i++){
if(typeof arguments[i]!="undefined"){
return arguments[i];
}
}
return undefined;
};
dojo.lang.getObjPathValue=function(_1f2,_1f3,_1f4){
with(dojo.parseObjPath(_1f2,_1f3,_1f4)){
return dojo.evalProp(prop,obj,_1f4);
}
};
dojo.lang.setObjPathValue=function(_1f5,_1f6,_1f7,_1f8){
dojo.deprecated("dojo.lang.setObjPathValue","use dojo.parseObjPath and the '=' operator","0.6");
if(arguments.length<4){
_1f8=true;
}
with(dojo.parseObjPath(_1f5,_1f7,_1f8)){
if(obj&&(_1f8||(prop in obj))){
obj[prop]=_1f6;
}
}
};
dojo.provide("dojo.lang.declare");
dojo.lang.declare=function(_1f9,_1fa,init,_1fc){
if((dojo.lang.isFunction(_1fc))||((!_1fc)&&(!dojo.lang.isFunction(init)))){
var temp=_1fc;
_1fc=init;
init=temp;
}
var _1fe=[];
if(dojo.lang.isArray(_1fa)){
_1fe=_1fa;
_1fa=_1fe.shift();
}
if(!init){
init=dojo.evalObjPath(_1f9,false);
if((init)&&(!dojo.lang.isFunction(init))){
init=null;
}
}
var ctor=dojo.lang.declare._makeConstructor();
var scp=(_1fa?_1fa.prototype:null);
if(scp){
scp.prototyping=true;
ctor.prototype=new _1fa();
scp.prototyping=false;
}
ctor.superclass=scp;
ctor.mixins=_1fe;
for(var i=0,l=_1fe.length;i<l;i++){
dojo.lang.extend(ctor,_1fe[i].prototype);
}
ctor.prototype.initializer=null;
ctor.prototype.declaredClass=_1f9;
if(dojo.lang.isArray(_1fc)){
dojo.lang.extend.apply(dojo.lang,[ctor].concat(_1fc));
}else{
dojo.lang.extend(ctor,(_1fc)||{});
}
dojo.lang.extend(ctor,dojo.lang.declare._common);
ctor.prototype.constructor=ctor;
ctor.prototype.initializer=(ctor.prototype.initializer)||(init)||(function(){
});
var _203=dojo.parseObjPath(_1f9,null,true);
_203.obj[_203.prop]=ctor;
return ctor;
};
dojo.lang.declare._makeConstructor=function(){
return function(){
var self=this._getPropContext();
var s=self.constructor.superclass;
if((s)&&(s.constructor)){
if(s.constructor==arguments.callee){
this._inherited("constructor",arguments);
}else{
this._contextMethod(s,"constructor",arguments);
}
}
var ms=(self.constructor.mixins)||([]);
for(var i=0,m;(m=ms[i]);i++){
(((m.prototype)&&(m.prototype.initializer))||(m)).apply(this,arguments);
}
if((!this.prototyping)&&(self.initializer)){
self.initializer.apply(this,arguments);
}
};
};
dojo.lang.declare._common={_getPropContext:function(){
return (this.___proto||this);
},_contextMethod:function(_209,_20a,args){
var _20c,_20d=this.___proto;
this.___proto=_209;
try{
_20c=_209[_20a].apply(this,(args||[]));
}
catch(e){
throw e;
}
finally{
this.___proto=_20d;
}
return _20c;
},_inherited:function(prop,args){
var p=this._getPropContext();
do{
if((!p.constructor)||(!p.constructor.superclass)){
return;
}
p=p.constructor.superclass;
}while(!(prop in p));
return (dojo.lang.isFunction(p[prop])?this._contextMethod(p,prop,args):p[prop]);
},inherited:function(prop,args){
dojo.deprecated("'inherited' method is dangerous, do not up-call! 'inherited' is slated for removal in 0.5; name your super class (or use superclass property) instead.","0.5");
this._inherited(prop,args);
}};
dojo.declare=dojo.lang.declare;
dojo.provide("dojo.ns");
dojo.ns={namespaces:{},failed:{},loading:{},loaded:{},register:function(name,_214,_215,_216){
if(!_216||!this.namespaces[name]){
this.namespaces[name]=new dojo.ns.Ns(name,_214,_215);
}
},allow:function(name){
if(this.failed[name]){
return false;
}
if((djConfig.excludeNamespace)&&(dojo.lang.inArray(djConfig.excludeNamespace,name))){
return false;
}
return ((name==this.dojo)||(!djConfig.includeNamespace)||(dojo.lang.inArray(djConfig.includeNamespace,name)));
},get:function(name){
return this.namespaces[name];
},require:function(name){
var ns=this.namespaces[name];
if((ns)&&(this.loaded[name])){
return ns;
}
if(!this.allow(name)){
return false;
}
if(this.loading[name]){
dojo.debug("dojo.namespace.require: re-entrant request to load namespace \""+name+"\" must fail.");
return false;
}
var req=dojo.require;
this.loading[name]=true;
try{
if(name=="dojo"){
req("dojo.namespaces.dojo");
}else{
if(!dojo.hostenv.moduleHasPrefix(name)){
dojo.registerModulePath(name,"../"+name);
}
req([name,"manifest"].join("."),false,true);
}
if(!this.namespaces[name]){
this.failed[name]=true;
}
}
finally{
this.loading[name]=false;
}
return this.namespaces[name];
}};
dojo.ns.Ns=function(name,_21d,_21e){
this.name=name;
this.module=_21d;
this.resolver=_21e;
this._loaded=[];
this._failed=[];
};
dojo.ns.Ns.prototype.resolve=function(name,_220,_221){
if(!this.resolver||djConfig["skipAutoRequire"]){
return false;
}
var _222=this.resolver(name,_220);
if((_222)&&(!this._loaded[_222])&&(!this._failed[_222])){
var req=dojo.require;
req(_222,false,true);
if(dojo.hostenv.findModule(_222,false)){
this._loaded[_222]=true;
}else{
if(!_221){
dojo.raise("dojo.ns.Ns.resolve: module '"+_222+"' not found after loading via namespace '"+this.name+"'");
}
this._failed[_222]=true;
}
}
return Boolean(this._loaded[_222]);
};
dojo.registerNamespace=function(name,_225,_226){
dojo.ns.register.apply(dojo.ns,arguments);
};
dojo.registerNamespaceResolver=function(name,_228){
var n=dojo.ns.namespaces[name];
if(n){
n.resolver=_228;
}
};
dojo.registerNamespaceManifest=function(_22a,path,name,_22d,_22e){
dojo.registerModulePath(name,path);
dojo.registerNamespace(name,_22d,_22e);
};
dojo.registerNamespace("dojo","dojo.widget");
dojo.provide("dojo.event.common");
dojo.event=new function(){
this._canTimeout=dojo.lang.isFunction(dj_global["setTimeout"])||dojo.lang.isAlien(dj_global["setTimeout"]);
function interpolateArgs(args,_230){
var dl=dojo.lang;
var ao={srcObj:dj_global,srcFunc:null,adviceObj:dj_global,adviceFunc:null,aroundObj:null,aroundFunc:null,adviceType:(args.length>2)?args[0]:"after",precedence:"last",once:false,delay:null,rate:0,adviceMsg:false,maxCalls:-1};
switch(args.length){
case 0:
return;
case 1:
return;
case 2:
ao.srcFunc=args[0];
ao.adviceFunc=args[1];
break;
case 3:
if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isString(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
}else{
if((dl.isString(args[1]))&&(dl.isString(args[2]))){
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
}else{
if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isFunction(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
var _233=dl.nameAnonFunc(args[2],ao.adviceObj,_230);
ao.adviceFunc=_233;
}else{
if((dl.isFunction(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))){
ao.adviceType="after";
ao.srcObj=dj_global;
var _233=dl.nameAnonFunc(args[0],ao.srcObj,_230);
ao.srcFunc=_233;
ao.adviceObj=args[1];
ao.adviceFunc=args[2];
}
}
}
}
break;
case 4:
if((dl.isObject(args[0]))&&(dl.isObject(args[2]))){
ao.adviceType="after";
ao.srcObj=args[0];
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isString(args[1]))&&(dl.isObject(args[2]))){
ao.adviceType=args[0];
ao.srcObj=dj_global;
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isFunction(args[1]))&&(dl.isObject(args[2]))){
ao.adviceType=args[0];
ao.srcObj=dj_global;
var _233=dl.nameAnonFunc(args[1],dj_global,_230);
ao.srcFunc=_233;
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
if((dl.isString(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))&&(dl.isFunction(args[3]))){
ao.srcObj=args[1];
ao.srcFunc=args[2];
var _233=dl.nameAnonFunc(args[3],dj_global,_230);
ao.adviceObj=dj_global;
ao.adviceFunc=_233;
}else{
if(dl.isObject(args[1])){
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=dj_global;
ao.adviceFunc=args[3];
}else{
if(dl.isObject(args[2])){
ao.srcObj=dj_global;
ao.srcFunc=args[1];
ao.adviceObj=args[2];
ao.adviceFunc=args[3];
}else{
ao.srcObj=ao.adviceObj=ao.aroundObj=dj_global;
ao.srcFunc=args[1];
ao.adviceFunc=args[2];
ao.aroundFunc=args[3];
}
}
}
}
}
}
break;
case 6:
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=args[3];
ao.adviceFunc=args[4];
ao.aroundFunc=args[5];
ao.aroundObj=dj_global;
break;
default:
ao.srcObj=args[1];
ao.srcFunc=args[2];
ao.adviceObj=args[3];
ao.adviceFunc=args[4];
ao.aroundObj=args[5];
ao.aroundFunc=args[6];
ao.once=args[7];
ao.delay=args[8];
ao.rate=args[9];
ao.adviceMsg=args[10];
ao.maxCalls=(!isNaN(parseInt(args[11])))?args[11]:-1;
break;
}
if(dl.isFunction(ao.aroundFunc)){
var _233=dl.nameAnonFunc(ao.aroundFunc,ao.aroundObj,_230);
ao.aroundFunc=_233;
}
if(dl.isFunction(ao.srcFunc)){
ao.srcFunc=dl.getNameInObj(ao.srcObj,ao.srcFunc);
}
if(dl.isFunction(ao.adviceFunc)){
ao.adviceFunc=dl.getNameInObj(ao.adviceObj,ao.adviceFunc);
}
if((ao.aroundObj)&&(dl.isFunction(ao.aroundFunc))){
ao.aroundFunc=dl.getNameInObj(ao.aroundObj,ao.aroundFunc);
}
if(!ao.srcObj){
dojo.raise("bad srcObj for srcFunc: "+ao.srcFunc);
}
if(!ao.adviceObj){
dojo.raise("bad adviceObj for adviceFunc: "+ao.adviceFunc);
}
if(!ao.adviceFunc){
dojo.debug("bad adviceFunc for srcFunc: "+ao.srcFunc);
dojo.debugShallow(ao);
}
return ao;
}
this.connect=function(){
if(arguments.length==1){
var ao=arguments[0];
}else{
var ao=interpolateArgs(arguments,true);
}
if(dojo.lang.isArray(ao.srcObj)&&ao.srcObj!=""){
var _235={};
for(var x in ao){
_235[x]=ao[x];
}
var mjps=[];
dojo.lang.forEach(ao.srcObj,function(src){
if((dojo.render.html.capable)&&(dojo.lang.isString(src))){
src=dojo.byId(src);
}
_235.srcObj=src;
mjps.push(dojo.event.connect.call(dojo.event,_235));
});
return mjps;
}
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc);
if(ao.adviceFunc){
var mjp2=dojo.event.MethodJoinPoint.getForMethod(ao.adviceObj,ao.adviceFunc);
}
mjp.kwAddAdvice(ao);
return mjp;
};
this.log=function(a1,a2){
var _23d;
if((arguments.length==1)&&(typeof a1=="object")){
_23d=a1;
}else{
_23d={srcObj:a1,srcFunc:a2};
}
_23d.adviceFunc=function(){
var _23e=[];
for(var x=0;x<arguments.length;x++){
_23e.push(arguments[x]);
}
dojo.debug("("+_23d.srcObj+")."+_23d.srcFunc,":",_23e.join(", "));
};
this.kwConnect(_23d);
};
this.connectBefore=function(){
var args=["before"];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return this.connect.apply(this,args);
};
this.connectAround=function(){
var args=["around"];
for(var i=0;i<arguments.length;i++){
args.push(arguments[i]);
}
return this.connect.apply(this,args);
};
this.connectOnce=function(){
var ao=interpolateArgs(arguments,true);
ao.once=true;
return this.connect(ao);
};
this.connectRunOnce=function(){
var ao=interpolateArgs(arguments,true);
ao.maxCalls=1;
return this.connect(ao);
};
this._kwConnectImpl=function(_246,_247){
var fn=(_247)?"disconnect":"connect";
if(typeof _246["srcFunc"]=="function"){
_246.srcObj=_246["srcObj"]||dj_global;
var _249=dojo.lang.nameAnonFunc(_246.srcFunc,_246.srcObj,true);
_246.srcFunc=_249;
}
if(typeof _246["adviceFunc"]=="function"){
_246.adviceObj=_246["adviceObj"]||dj_global;
var _249=dojo.lang.nameAnonFunc(_246.adviceFunc,_246.adviceObj,true);
_246.adviceFunc=_249;
}
_246.srcObj=_246["srcObj"]||dj_global;
_246.adviceObj=_246["adviceObj"]||_246["targetObj"]||dj_global;
_246.adviceFunc=_246["adviceFunc"]||_246["targetFunc"];
return dojo.event[fn](_246);
};
this.kwConnect=function(_24a){
return this._kwConnectImpl(_24a,false);
};
this.disconnect=function(){
if(arguments.length==1){
var ao=arguments[0];
}else{
var ao=interpolateArgs(arguments,true);
}
if(!ao.adviceFunc){
return;
}
if(dojo.lang.isString(ao.srcFunc)&&(ao.srcFunc.toLowerCase()=="onkey")){
if(dojo.render.html.ie){
ao.srcFunc="onkeydown";
this.disconnect(ao);
}
ao.srcFunc="onkeypress";
}
if(!ao.srcObj[ao.srcFunc]){
return null;
}
var mjp=dojo.event.MethodJoinPoint.getForMethod(ao.srcObj,ao.srcFunc,true);
mjp.removeAdvice(ao.adviceObj,ao.adviceFunc,ao.adviceType,ao.once);
return mjp;
};
this.kwDisconnect=function(_24d){
return this._kwConnectImpl(_24d,true);
};
};
dojo.event.MethodInvocation=function(_24e,obj,args){
this.jp_=_24e;
this.object=obj;
this.args=[];
for(var x=0;x<args.length;x++){
this.args[x]=args[x];
}
this.around_index=-1;
};
dojo.event.MethodInvocation.prototype.proceed=function(){
this.around_index++;
if(this.around_index>=this.jp_.around.length){
return this.jp_.object[this.jp_.methodname].apply(this.jp_.object,this.args);
}else{
var ti=this.jp_.around[this.around_index];
var mobj=ti[0]||dj_global;
var meth=ti[1];
return mobj[meth].call(mobj,this);
}
};
dojo.event.MethodJoinPoint=function(obj,_256){
this.object=obj||dj_global;
this.methodname=_256;
this.methodfunc=this.object[_256];
this.squelch=false;
};
dojo.event.MethodJoinPoint.getForMethod=function(obj,_258){
if(!obj){
obj=dj_global;
}
var ofn=obj[_258];
if(!ofn){
ofn=obj[_258]=function(){
};
if(!obj[_258]){
dojo.raise("Cannot set do-nothing method on that object "+_258);
}
}else{
if((typeof ofn!="function")&&(!dojo.lang.isFunction(ofn))&&(!dojo.lang.isAlien(ofn))){
return null;
}
}
var _25a=_258+"$joinpoint";
var _25b=_258+"$joinpoint$method";
var _25c=obj[_25a];
if(!_25c){
var _25d=false;
if(dojo.event["browser"]){
if((obj["attachEvent"])||(obj["nodeType"])||(obj["addEventListener"])){
_25d=true;
dojo.event.browser.addClobberNodeAttrs(obj,[_25a,_25b,_258]);
}
}
var _25e=ofn.length;
obj[_25b]=ofn;
_25c=obj[_25a]=new dojo.event.MethodJoinPoint(obj,_25b);
if(!_25d){
obj[_258]=function(){
return _25c.run.apply(_25c,arguments);
};
}else{
obj[_258]=function(){
var args=[];
if(!arguments.length){
var evt=null;
try{
if(obj.ownerDocument){
evt=obj.ownerDocument.parentWindow.event;
}else{
if(obj.documentElement){
evt=obj.documentElement.ownerDocument.parentWindow.event;
}else{
if(obj.event){
evt=obj.event;
}else{
evt=window.event;
}
}
}
}
catch(e){
evt=window.event;
}
if(evt){
args.push(dojo.event.browser.fixEvent(evt,this));
}
}else{
for(var x=0;x<arguments.length;x++){
if((x==0)&&(dojo.event.browser.isEvent(arguments[x]))){
args.push(dojo.event.browser.fixEvent(arguments[x],this));
}else{
args.push(arguments[x]);
}
}
}
return _25c.run.apply(_25c,args);
};
}
obj[_258].__preJoinArity=_25e;
}
return _25c;
};
dojo.lang.extend(dojo.event.MethodJoinPoint,{squelch:false,unintercept:function(){
this.object[this.methodname]=this.methodfunc;
this.before=[];
this.after=[];
this.around=[];
},disconnect:dojo.lang.forward("unintercept"),run:function(){
var obj=this.object||dj_global;
var args=arguments;
var _264=[];
for(var x=0;x<args.length;x++){
_264[x]=args[x];
}
var _266=function(marr){
if(!marr){
dojo.debug("Null argument to unrollAdvice()");
return;
}
var _268=marr[0]||dj_global;
var _269=marr[1];
if(!_268[_269]){
dojo.raise("function \""+_269+"\" does not exist on \""+_268+"\"");
}
var _26a=marr[2]||dj_global;
var _26b=marr[3];
var msg=marr[6];
var _26d=marr[7];
if(_26d>-1){
if(_26d==0){
return;
}
marr[7]--;
}
var _26e;
var to={args:[],jp_:this,object:obj,proceed:function(){
return _268[_269].apply(_268,to.args);
}};
to.args=_264;
var _270=parseInt(marr[4]);
var _271=((!isNaN(_270))&&(marr[4]!==null)&&(typeof marr[4]!="undefined"));
if(marr[5]){
var rate=parseInt(marr[5]);
var cur=new Date();
var _274=false;
if((marr["last"])&&((cur-marr.last)<=rate)){
if(dojo.event._canTimeout){
if(marr["delayTimer"]){
clearTimeout(marr.delayTimer);
}
var tod=parseInt(rate*2);
var mcpy=dojo.lang.shallowCopy(marr);
marr.delayTimer=setTimeout(function(){
mcpy[5]=0;
_266(mcpy);
},tod);
}
return;
}else{
marr.last=cur;
}
}
if(_26b){
_26a[_26b].call(_26a,to);
}else{
if((_271)&&((dojo.render.html)||(dojo.render.svg))){
dj_global["setTimeout"](function(){
if(msg){
_268[_269].call(_268,to);
}else{
_268[_269].apply(_268,args);
}
},_270);
}else{
if(msg){
_268[_269].call(_268,to);
}else{
_268[_269].apply(_268,args);
}
}
}
};
var _277=function(){
if(this.squelch){
try{
return _266.apply(this,arguments);
}
catch(e){
dojo.debug(e);
}
}else{
return _266.apply(this,arguments);
}
};
if((this["before"])&&(this.before.length>0)){
dojo.lang.forEach(this.before.concat(new Array()),_277);
}
var _278;
try{
if((this["around"])&&(this.around.length>0)){
var mi=new dojo.event.MethodInvocation(this,obj,args);
_278=mi.proceed();
}else{
if(this.methodfunc){
_278=this.object[this.methodname].apply(this.object,args);
}
}
}
catch(e){
if(!this.squelch){
dojo.debug(e,"when calling",this.methodname,"on",this.object,"with arguments",args);
dojo.raise(e);
}
}
if((this["after"])&&(this.after.length>0)){
dojo.lang.forEach(this.after.concat(new Array()),_277);
}
return (this.methodfunc)?_278:null;
},getArr:function(kind){
var type="after";
if((typeof kind=="string")&&(kind.indexOf("before")!=-1)){
type="before";
}else{
if(kind=="around"){
type="around";
}
}
if(!this[type]){
this[type]=[];
}
return this[type];
},kwAddAdvice:function(args){
this.addAdvice(args["adviceObj"],args["adviceFunc"],args["aroundObj"],args["aroundFunc"],args["adviceType"],args["precedence"],args["once"],args["delay"],args["rate"],args["adviceMsg"],args["maxCalls"]);
},addAdvice:function(_27d,_27e,_27f,_280,_281,_282,once,_284,rate,_286,_287){
var arr=this.getArr(_281);
if(!arr){
dojo.raise("bad this: "+this);
}
var ao=[_27d,_27e,_27f,_280,_284,rate,_286,_287];
if(once){
if(this.hasAdvice(_27d,_27e,_281,arr)>=0){
return;
}
}
if(_282=="first"){
arr.unshift(ao);
}else{
arr.push(ao);
}
},hasAdvice:function(_28a,_28b,_28c,arr){
if(!arr){
arr=this.getArr(_28c);
}
var ind=-1;
for(var x=0;x<arr.length;x++){
var aao=(typeof _28b=="object")?(new String(_28b)).toString():_28b;
var a1o=(typeof arr[x][1]=="object")?(new String(arr[x][1])).toString():arr[x][1];
if((arr[x][0]==_28a)&&(a1o==aao)){
ind=x;
}
}
return ind;
},removeAdvice:function(_292,_293,_294,once){
var arr=this.getArr(_294);
var ind=this.hasAdvice(_292,_293,_294,arr);
if(ind==-1){
return false;
}
while(ind!=-1){
arr.splice(ind,1);
if(once){
break;
}
ind=this.hasAdvice(_292,_293,_294,arr);
}
return true;
}});
dojo.provide("dojo.event.topic");
dojo.event.topic=new function(){
this.topics={};
this.getTopic=function(_298){
if(!this.topics[_298]){
this.topics[_298]=new this.TopicImpl(_298);
}
return this.topics[_298];
};
this.registerPublisher=function(_299,obj,_29b){
var _299=this.getTopic(_299);
_299.registerPublisher(obj,_29b);
};
this.subscribe=function(_29c,obj,_29e){
var _29c=this.getTopic(_29c);
_29c.subscribe(obj,_29e);
};
this.unsubscribe=function(_29f,obj,_2a1){
var _29f=this.getTopic(_29f);
_29f.unsubscribe(obj,_2a1);
};
this.destroy=function(_2a2){
this.getTopic(_2a2).destroy();
delete this.topics[_2a2];
};
this.publishApply=function(_2a3,args){
var _2a3=this.getTopic(_2a3);
_2a3.sendMessage.apply(_2a3,args);
};
this.publish=function(_2a5,_2a6){
var _2a5=this.getTopic(_2a5);
var args=[];
for(var x=1;x<arguments.length;x++){
args.push(arguments[x]);
}
_2a5.sendMessage.apply(_2a5,args);
};
};
dojo.event.topic.TopicImpl=function(_2a9){
this.topicName=_2a9;
this.subscribe=function(_2aa,_2ab){
var tf=_2ab||_2aa;
var to=(!_2ab)?dj_global:_2aa;
return dojo.event.kwConnect({srcObj:this,srcFunc:"sendMessage",adviceObj:to,adviceFunc:tf});
};
this.unsubscribe=function(_2ae,_2af){
var tf=(!_2af)?_2ae:_2af;
var to=(!_2af)?null:_2ae;
return dojo.event.kwDisconnect({srcObj:this,srcFunc:"sendMessage",adviceObj:to,adviceFunc:tf});
};
this._getJoinPoint=function(){
return dojo.event.MethodJoinPoint.getForMethod(this,"sendMessage");
};
this.setSquelch=function(_2b2){
this._getJoinPoint().squelch=_2b2;
};
this.destroy=function(){
this._getJoinPoint().disconnect();
};
this.registerPublisher=function(_2b3,_2b4){
dojo.event.connect(_2b3,_2b4,this,"sendMessage");
};
this.sendMessage=function(_2b5){
};
};
dojo.provide("dojo.event.browser");
dojo._ie_clobber=new function(){
this.clobberNodes=[];
function nukeProp(node,prop){
try{
node[prop]=null;
}
catch(e){
}
try{
delete node[prop];
}
catch(e){
}
try{
node.removeAttribute(prop);
}
catch(e){
}
}
this.clobber=function(_2b8){
var na;
var tna;
if(_2b8){
tna=_2b8.all||_2b8.getElementsByTagName("*");
na=[_2b8];
for(var x=0;x<tna.length;x++){
if(tna[x]["__doClobber__"]){
na.push(tna[x]);
}
}
}else{
try{
window.onload=null;
}
catch(e){
}
na=(this.clobberNodes.length)?this.clobberNodes:document.all;
}
tna=null;
var _2bc={};
for(var i=na.length-1;i>=0;i=i-1){
var el=na[i];
try{
if(el&&el["__clobberAttrs__"]){
for(var j=0;j<el.__clobberAttrs__.length;j++){
nukeProp(el,el.__clobberAttrs__[j]);
}
nukeProp(el,"__clobberAttrs__");
nukeProp(el,"__doClobber__");
}
}
catch(e){
}
}
na=null;
};
};
if(dojo.render.html.ie){
dojo.addOnUnload(function(){
dojo._ie_clobber.clobber();
try{
if((dojo["widget"])&&(dojo.widget["manager"])){
dojo.widget.manager.destroyAll();
}
}
catch(e){
}
if(dojo.widget){
for(var name in dojo.widget._templateCache){
if(dojo.widget._templateCache[name].node){
dojo.dom.destroyNode(dojo.widget._templateCache[name].node);
dojo.widget._templateCache[name].node=null;
delete dojo.widget._templateCache[name].node;
}
}
}
try{
window.onload=null;
}
catch(e){
}
try{
window.onunload=null;
}
catch(e){
}
dojo._ie_clobber.clobberNodes=[];
});
}
dojo.event.browser=new function(){
var _2c1=0;
this.normalizedEventName=function(_2c2){
switch(_2c2){
case "CheckboxStateChange":
case "DOMAttrModified":
case "DOMMenuItemActive":
case "DOMMenuItemInactive":
case "DOMMouseScroll":
case "DOMNodeInserted":
case "DOMNodeRemoved":
case "RadioStateChange":
return _2c2;
break;
default:
var lcn=_2c2.toLowerCase();
return (lcn.indexOf("on")==0)?lcn.substr(2):lcn;
break;
}
};
this.clean=function(node){
if(dojo.render.html.ie){
dojo._ie_clobber.clobber(node);
}
};
this.addClobberNode=function(node){
if(!dojo.render.html.ie){
return;
}
if(!node["__doClobber__"]){
node.__doClobber__=true;
dojo._ie_clobber.clobberNodes.push(node);
node.__clobberAttrs__=[];
}
};
this.addClobberNodeAttrs=function(node,_2c7){
if(!dojo.render.html.ie){
return;
}
this.addClobberNode(node);
for(var x=0;x<_2c7.length;x++){
node.__clobberAttrs__.push(_2c7[x]);
}
};
this.removeListener=function(node,_2ca,fp,_2cc){
if(!_2cc){
var _2cc=false;
}
_2ca=dojo.event.browser.normalizedEventName(_2ca);
if(_2ca=="key"){
if(dojo.render.html.ie){
this.removeListener(node,"onkeydown",fp,_2cc);
}
_2ca="keypress";
}
if(node.removeEventListener){
node.removeEventListener(_2ca,fp,_2cc);
}
};
this.addListener=function(node,_2ce,fp,_2d0,_2d1){
if(!node){
return;
}
if(!_2d0){
var _2d0=false;
}
_2ce=dojo.event.browser.normalizedEventName(_2ce);
if(_2ce=="key"){
if(dojo.render.html.ie){
this.addListener(node,"onkeydown",fp,_2d0,_2d1);
}
_2ce="keypress";
}
if(!_2d1){
var _2d2=function(evt){
if(!evt){
evt=window.event;
}
var ret=fp(dojo.event.browser.fixEvent(evt,this));
if(_2d0){
dojo.event.browser.stopEvent(evt);
}
return ret;
};
}else{
_2d2=fp;
}
if(node.addEventListener){
node.addEventListener(_2ce,_2d2,_2d0);
return _2d2;
}else{
_2ce="on"+_2ce;
if(typeof node[_2ce]=="function"){
var _2d5=node[_2ce];
node[_2ce]=function(e){
_2d5(e);
return _2d2(e);
};
}else{
node[_2ce]=_2d2;
}
if(dojo.render.html.ie){
this.addClobberNodeAttrs(node,[_2ce]);
}
return _2d2;
}
};
this.isEvent=function(obj){
return (typeof obj!="undefined")&&(obj)&&(typeof Event!="undefined")&&(obj.eventPhase);
};
this.currentEvent=null;
this.callListener=function(_2d8,_2d9){
if(typeof _2d8!="function"){
dojo.raise("listener not a function: "+_2d8);
}
dojo.event.browser.currentEvent.currentTarget=_2d9;
return _2d8.call(_2d9,dojo.event.browser.currentEvent);
};
this._stopPropagation=function(){
dojo.event.browser.currentEvent.cancelBubble=true;
};
this._preventDefault=function(){
dojo.event.browser.currentEvent.returnValue=false;
};
this.keys={KEY_BACKSPACE:8,KEY_TAB:9,KEY_CLEAR:12,KEY_ENTER:13,KEY_SHIFT:16,KEY_CTRL:17,KEY_ALT:18,KEY_PAUSE:19,KEY_CAPS_LOCK:20,KEY_ESCAPE:27,KEY_SPACE:32,KEY_PAGE_UP:33,KEY_PAGE_DOWN:34,KEY_END:35,KEY_HOME:36,KEY_LEFT_ARROW:37,KEY_UP_ARROW:38,KEY_RIGHT_ARROW:39,KEY_DOWN_ARROW:40,KEY_INSERT:45,KEY_DELETE:46,KEY_HELP:47,KEY_LEFT_WINDOW:91,KEY_RIGHT_WINDOW:92,KEY_SELECT:93,KEY_NUMPAD_0:96,KEY_NUMPAD_1:97,KEY_NUMPAD_2:98,KEY_NUMPAD_3:99,KEY_NUMPAD_4:100,KEY_NUMPAD_5:101,KEY_NUMPAD_6:102,KEY_NUMPAD_7:103,KEY_NUMPAD_8:104,KEY_NUMPAD_9:105,KEY_NUMPAD_MULTIPLY:106,KEY_NUMPAD_PLUS:107,KEY_NUMPAD_ENTER:108,KEY_NUMPAD_MINUS:109,KEY_NUMPAD_PERIOD:110,KEY_NUMPAD_DIVIDE:111,KEY_F1:112,KEY_F2:113,KEY_F3:114,KEY_F4:115,KEY_F5:116,KEY_F6:117,KEY_F7:118,KEY_F8:119,KEY_F9:120,KEY_F10:121,KEY_F11:122,KEY_F12:123,KEY_F13:124,KEY_F14:125,KEY_F15:126,KEY_NUM_LOCK:144,KEY_SCROLL_LOCK:145};
this.revKeys=[];
for(var key in this.keys){
this.revKeys[this.keys[key]]=key;
}
this.fixEvent=function(evt,_2dc){
if(!evt){
if(window["event"]){
evt=window.event;
}
}
if((evt["type"])&&(evt["type"].indexOf("key")==0)){
evt.keys=this.revKeys;
for(var key in this.keys){
evt[key]=this.keys[key];
}
if(evt["type"]=="keydown"&&dojo.render.html.ie){
switch(evt.keyCode){
case evt.KEY_SHIFT:
case evt.KEY_CTRL:
case evt.KEY_ALT:
case evt.KEY_CAPS_LOCK:
case evt.KEY_LEFT_WINDOW:
case evt.KEY_RIGHT_WINDOW:
case evt.KEY_SELECT:
case evt.KEY_NUM_LOCK:
case evt.KEY_SCROLL_LOCK:
case evt.KEY_NUMPAD_0:
case evt.KEY_NUMPAD_1:
case evt.KEY_NUMPAD_2:
case evt.KEY_NUMPAD_3:
case evt.KEY_NUMPAD_4:
case evt.KEY_NUMPAD_5:
case evt.KEY_NUMPAD_6:
case evt.KEY_NUMPAD_7:
case evt.KEY_NUMPAD_8:
case evt.KEY_NUMPAD_9:
case evt.KEY_NUMPAD_PERIOD:
break;
case evt.KEY_NUMPAD_MULTIPLY:
case evt.KEY_NUMPAD_PLUS:
case evt.KEY_NUMPAD_ENTER:
case evt.KEY_NUMPAD_MINUS:
case evt.KEY_NUMPAD_DIVIDE:
break;
case evt.KEY_PAUSE:
case evt.KEY_TAB:
case evt.KEY_BACKSPACE:
case evt.KEY_ENTER:
case evt.KEY_ESCAPE:
case evt.KEY_PAGE_UP:
case evt.KEY_PAGE_DOWN:
case evt.KEY_END:
case evt.KEY_HOME:
case evt.KEY_LEFT_ARROW:
case evt.KEY_UP_ARROW:
case evt.KEY_RIGHT_ARROW:
case evt.KEY_DOWN_ARROW:
case evt.KEY_INSERT:
case evt.KEY_DELETE:
case evt.KEY_F1:
case evt.KEY_F2:
case evt.KEY_F3:
case evt.KEY_F4:
case evt.KEY_F5:
case evt.KEY_F6:
case evt.KEY_F7:
case evt.KEY_F8:
case evt.KEY_F9:
case evt.KEY_F10:
case evt.KEY_F11:
case evt.KEY_F12:
case evt.KEY_F12:
case evt.KEY_F13:
case evt.KEY_F14:
case evt.KEY_F15:
case evt.KEY_CLEAR:
case evt.KEY_HELP:
evt.key=evt.keyCode;
break;
default:
if(evt.ctrlKey||evt.altKey){
var _2de=evt.keyCode;
if(_2de>=65&&_2de<=90&&evt.shiftKey==false){
_2de+=32;
}
if(_2de>=1&&_2de<=26&&evt.ctrlKey){
_2de+=96;
}
evt.key=String.fromCharCode(_2de);
}
}
}else{
if(evt["type"]=="keypress"){
if(dojo.render.html.opera){
if(evt.which==0){
evt.key=evt.keyCode;
}else{
if(evt.which>0){
switch(evt.which){
case evt.KEY_SHIFT:
case evt.KEY_CTRL:
case evt.KEY_ALT:
case evt.KEY_CAPS_LOCK:
case evt.KEY_NUM_LOCK:
case evt.KEY_SCROLL_LOCK:
break;
case evt.KEY_PAUSE:
case evt.KEY_TAB:
case evt.KEY_BACKSPACE:
case evt.KEY_ENTER:
case evt.KEY_ESCAPE:
evt.key=evt.which;
break;
default:
var _2de=evt.which;
if((evt.ctrlKey||evt.altKey||evt.metaKey)&&(evt.which>=65&&evt.which<=90&&evt.shiftKey==false)){
_2de+=32;
}
evt.key=String.fromCharCode(_2de);
}
}
}
}else{
if(dojo.render.html.ie){
if(!evt.ctrlKey&&!evt.altKey&&evt.keyCode>=evt.KEY_SPACE){
evt.key=String.fromCharCode(evt.keyCode);
}
}else{
if(dojo.render.html.safari){
switch(evt.keyCode){
case 25:
evt.key=evt.KEY_TAB;
evt.shift=true;
break;
case 63232:
evt.key=evt.KEY_UP_ARROW;
break;
case 63233:
evt.key=evt.KEY_DOWN_ARROW;
break;
case 63234:
evt.key=evt.KEY_LEFT_ARROW;
break;
case 63235:
evt.key=evt.KEY_RIGHT_ARROW;
break;
case 63236:
evt.key=evt.KEY_F1;
break;
case 63237:
evt.key=evt.KEY_F2;
break;
case 63238:
evt.key=evt.KEY_F3;
break;
case 63239:
evt.key=evt.KEY_F4;
break;
case 63240:
evt.key=evt.KEY_F5;
break;
case 63241:
evt.key=evt.KEY_F6;
break;
case 63242:
evt.key=evt.KEY_F7;
break;
case 63243:
evt.key=evt.KEY_F8;
break;
case 63244:
evt.key=evt.KEY_F9;
break;
case 63245:
evt.key=evt.KEY_F10;
break;
case 63246:
evt.key=evt.KEY_F11;
break;
case 63247:
evt.key=evt.KEY_F12;
break;
case 63250:
evt.key=evt.KEY_PAUSE;
break;
case 63272:
evt.key=evt.KEY_DELETE;
break;
case 63273:
evt.key=evt.KEY_HOME;
break;
case 63275:
evt.key=evt.KEY_END;
break;
case 63276:
evt.key=evt.KEY_PAGE_UP;
break;
case 63277:
evt.key=evt.KEY_PAGE_DOWN;
break;
case 63302:
evt.key=evt.KEY_INSERT;
break;
case 63248:
case 63249:
case 63289:
break;
default:
evt.key=evt.charCode>=evt.KEY_SPACE?String.fromCharCode(evt.charCode):evt.keyCode;
}
}else{
evt.key=evt.charCode>0?String.fromCharCode(evt.charCode):evt.keyCode;
}
}
}
}
}
}
if(dojo.render.html.ie){
if(!evt.target){
evt.target=evt.srcElement;
}
if(!evt.currentTarget){
evt.currentTarget=(_2dc?_2dc:evt.srcElement);
}
if(!evt.layerX){
evt.layerX=evt.offsetX;
}
if(!evt.layerY){
evt.layerY=evt.offsetY;
}
var doc=(evt.srcElement&&evt.srcElement.ownerDocument)?evt.srcElement.ownerDocument:document;
var _2e0=((dojo.render.html.ie55)||(doc["compatMode"]=="BackCompat"))?doc.body:doc.documentElement;
if(!evt.pageX){
evt.pageX=evt.clientX+(_2e0.scrollLeft||0);
}
if(!evt.pageY){
evt.pageY=evt.clientY+(_2e0.scrollTop||0);
}
if(evt.type=="mouseover"){
evt.relatedTarget=evt.fromElement;
}
if(evt.type=="mouseout"){
evt.relatedTarget=evt.toElement;
}
this.currentEvent=evt;
evt.callListener=this.callListener;
evt.stopPropagation=this._stopPropagation;
evt.preventDefault=this._preventDefault;
}
return evt;
};
this.stopEvent=function(evt){
if(window.event){
evt.cancelBubble=true;
evt.returnValue=false;
}else{
evt.preventDefault();
evt.stopPropagation();
}
};
};
dojo.kwCompoundRequire({common:["dojo.event.common","dojo.event.topic"],browser:["dojo.event.browser"],dashboard:["dojo.event.browser"]});
dojo.provide("dojo.event.*");
dojo.provide("dojo.widget.Manager");
dojo.widget.manager=new function(){
this.widgets=[];
this.widgetIds=[];
this.topWidgets={};
var _2e2={};
var _2e3=[];
this.getUniqueId=function(_2e4){
var _2e5;
do{
_2e5=_2e4+"_"+(_2e2[_2e4]!=undefined?++_2e2[_2e4]:_2e2[_2e4]=0);
}while(this.getWidgetById(_2e5));
return _2e5;
};
this.add=function(_2e6){
this.widgets.push(_2e6);
if(!_2e6.extraArgs["id"]){
_2e6.extraArgs["id"]=_2e6.extraArgs["ID"];
}
if(_2e6.widgetId==""){
if(_2e6["id"]){
_2e6.widgetId=_2e6["id"];
}else{
if(_2e6.extraArgs["id"]){
_2e6.widgetId=_2e6.extraArgs["id"];
}else{
_2e6.widgetId=this.getUniqueId(_2e6.ns+"_"+_2e6.widgetType);
}
}
}
if(this.widgetIds[_2e6.widgetId]){
dojo.debug("widget ID collision on ID: "+_2e6.widgetId);
}
this.widgetIds[_2e6.widgetId]=_2e6;
};
this.destroyAll=function(){
for(var x=this.widgets.length-1;x>=0;x--){
try{
this.widgets[x].destroy(true);
delete this.widgets[x];
}
catch(e){
}
}
};
this.remove=function(_2e8){
if(dojo.lang.isNumber(_2e8)){
var tw=this.widgets[_2e8].widgetId;
delete this.topWidgets[tw];
delete this.widgetIds[tw];
this.widgets.splice(_2e8,1);
}else{
this.removeById(_2e8);
}
};
this.removeById=function(id){
if(!dojo.lang.isString(id)){
id=id["widgetId"];
if(!id){
dojo.debug("invalid widget or id passed to removeById");
return;
}
}
for(var i=0;i<this.widgets.length;i++){
if(this.widgets[i].widgetId==id){
this.remove(i);
break;
}
}
};
this.getWidgetById=function(id){
if(dojo.lang.isString(id)){
return this.widgetIds[id];
}
return id;
};
this.getWidgetsByType=function(type){
var lt=type.toLowerCase();
var _2ef=(type.indexOf(":")<0?function(x){
return x.widgetType.toLowerCase();
}:function(x){
return x.getNamespacedType();
});
var ret=[];
dojo.lang.forEach(this.widgets,function(x){
if(_2ef(x)==lt){
ret.push(x);
}
});
return ret;
};
this.getWidgetsByFilter=function(_2f4,_2f5){
var ret=[];
dojo.lang.every(this.widgets,function(x){
if(_2f4(x)){
ret.push(x);
if(_2f5){
return false;
}
}
return true;
});
return (_2f5?ret[0]:ret);
};
this.getAllWidgets=function(){
return this.widgets.concat();
};
this.getWidgetByNode=function(node){
var w=this.getAllWidgets();
node=dojo.byId(node);
for(var i=0;i<w.length;i++){
if(w[i].domNode==node){
return w[i];
}
}
return null;
};
this.byId=this.getWidgetById;
this.byType=this.getWidgetsByType;
this.byFilter=this.getWidgetsByFilter;
this.byNode=this.getWidgetByNode;
var _2fb={};
var _2fc=["dojo.widget"];
for(var i=0;i<_2fc.length;i++){
_2fc[_2fc[i]]=true;
}
this.registerWidgetPackage=function(_2fe){
if(!_2fc[_2fe]){
_2fc[_2fe]=true;
_2fc.push(_2fe);
}
};
this.getWidgetPackageList=function(){
return dojo.lang.map(_2fc,function(elt){
return (elt!==true?elt:undefined);
});
};
this.getImplementation=function(_300,_301,_302,ns){
var impl=this.getImplementationName(_300,ns);
if(impl){
var ret=_301?new impl(_301):new impl();
return ret;
}
};
function buildPrefixCache(){
for(var _306 in dojo.render){
if(dojo.render[_306]["capable"]===true){
var _307=dojo.render[_306].prefixes;
for(var i=0;i<_307.length;i++){
_2e3.push(_307[i].toLowerCase());
}
}
}
}
var _309=function(_30a,_30b){
if(!_30b){
return null;
}
for(var i=0,l=_2e3.length,_30e;i<=l;i++){
_30e=(i<l?_30b[_2e3[i]]:_30b);
if(!_30e){
continue;
}
for(var name in _30e){
if(name.toLowerCase()==_30a){
return _30e[name];
}
}
}
return null;
};
var _310=function(_311,_312){
var _313=dojo.evalObjPath(_312,false);
return (_313?_309(_311,_313):null);
};
this.getImplementationName=function(_314,ns){
var _316=_314.toLowerCase();
ns=ns||"dojo";
var imps=_2fb[ns]||(_2fb[ns]={});
var impl=imps[_316];
if(impl){
return impl;
}
if(!_2e3.length){
buildPrefixCache();
}
var _319=dojo.ns.get(ns);
if(!_319){
dojo.ns.register(ns,ns+".widget");
_319=dojo.ns.get(ns);
}
if(_319){
_319.resolve(_314);
}
impl=_310(_316,_319.module);
if(impl){
return (imps[_316]=impl);
}
_319=dojo.ns.require(ns);
if((_319)&&(_319.resolver)){
_319.resolve(_314);
impl=_310(_316,_319.module);
if(impl){
return (imps[_316]=impl);
}
}
dojo.deprecated("dojo.widget.Manager.getImplementationName","Could not locate widget implementation for \""+_314+"\" in \""+_319.module+"\" registered to namespace \""+_319.name+"\". "+"Developers must specify correct namespaces for all non-Dojo widgets","0.5");
for(var i=0;i<_2fc.length;i++){
impl=_310(_316,_2fc[i]);
if(impl){
return (imps[_316]=impl);
}
}
throw new Error("Could not locate widget implementation for \""+_314+"\" in \""+_319.module+"\" registered to namespace \""+_319.name+"\"");
};
this.resizing=false;
this.onWindowResized=function(){
if(this.resizing){
return;
}
try{
this.resizing=true;
for(var id in this.topWidgets){
var _31c=this.topWidgets[id];
if(_31c.checkSize){
_31c.checkSize();
}
}
}
catch(e){
}
finally{
this.resizing=false;
}
};
if(typeof window!="undefined"){
dojo.addOnLoad(this,"onWindowResized");
dojo.event.connect(window,"onresize",this,"onWindowResized");
}
};
(function(){
var dw=dojo.widget;
var dwm=dw.manager;
var h=dojo.lang.curry(dojo.lang,"hitch",dwm);
var g=function(_321,_322){
dw[(_322||_321)]=h(_321);
};
g("add","addWidget");
g("destroyAll","destroyAllWidgets");
g("remove","removeWidget");
g("removeById","removeWidgetById");
g("getWidgetById");
g("getWidgetById","byId");
g("getWidgetsByType");
g("getWidgetsByFilter");
g("getWidgetsByType","byType");
g("getWidgetsByFilter","byFilter");
g("getWidgetByNode","byNode");
dw.all=function(n){
var _324=dwm.getAllWidgets.apply(dwm,arguments);
if(arguments.length>0){
return _324[n];
}
return _324;
};
g("registerWidgetPackage");
g("getImplementation","getWidgetImplementation");
g("getImplementationName","getWidgetImplementationName");
dw.widgets=dwm.widgets;
dw.widgetIds=dwm.widgetIds;
dw.root=dwm.root;
})();
dojo.provide("dojo.uri.Uri");
dojo.uri=new function(){
this.dojoUri=function(uri){
return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri(),uri);
};
this.moduleUri=function(_326,uri){
var loc=dojo.hostenv.getModuleSymbols(_326).join("/");
if(!loc){
return null;
}
if(loc.lastIndexOf("/")!=loc.length-1){
loc+="/";
}
var _329=loc.indexOf(":");
var _32a=loc.indexOf("/");
if(loc.charAt(0)!="/"&&(_329==-1||_329>_32a)){
loc=dojo.hostenv.getBaseScriptUri()+loc;
}
return new dojo.uri.Uri(loc,uri);
};
this.Uri=function(){
var uri=arguments[0];
for(var i=1;i<arguments.length;i++){
if(!arguments[i]){
continue;
}
var _32d=new dojo.uri.Uri(arguments[i].toString());
var _32e=new dojo.uri.Uri(uri.toString());
if((_32d.path=="")&&(_32d.scheme==null)&&(_32d.authority==null)&&(_32d.query==null)){
if(_32d.fragment!=null){
_32e.fragment=_32d.fragment;
}
_32d=_32e;
}else{
if(_32d.scheme==null){
_32d.scheme=_32e.scheme;
if(_32d.authority==null){
_32d.authority=_32e.authority;
if(_32d.path.charAt(0)!="/"){
var path=_32e.path.substring(0,_32e.path.lastIndexOf("/")+1)+_32d.path;
var segs=path.split("/");
for(var j=0;j<segs.length;j++){
if(segs[j]=="."){
if(j==segs.length-1){
segs[j]="";
}else{
segs.splice(j,1);
j--;
}
}else{
if(j>0&&!(j==1&&segs[0]=="")&&segs[j]==".."&&segs[j-1]!=".."){
if(j==segs.length-1){
segs.splice(j,1);
segs[j-1]="";
}else{
segs.splice(j-1,2);
j-=2;
}
}
}
}
_32d.path=segs.join("/");
}
}
}
}
uri="";
if(_32d.scheme!=null){
uri+=_32d.scheme+":";
}
if(_32d.authority!=null){
uri+="//"+_32d.authority;
}
uri+=_32d.path;
if(_32d.query!=null){
uri+="?"+_32d.query;
}
if(_32d.fragment!=null){
uri+="#"+_32d.fragment;
}
}
this.uri=uri.toString();
var _332="^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
var r=this.uri.match(new RegExp(_332));
this.scheme=r[2]||(r[1]?"":null);
this.authority=r[4]||(r[3]?"":null);
this.path=r[5];
this.query=r[7]||(r[6]?"":null);
this.fragment=r[9]||(r[8]?"":null);
if(this.authority!=null){
_332="^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$";
r=this.authority.match(new RegExp(_332));
this.user=r[3]||null;
this.password=r[4]||null;
this.host=r[5];
this.port=r[7]||null;
}
this.toString=function(){
return this.uri;
};
};
};
dojo.kwCompoundRequire({common:[["dojo.uri.Uri",false,false]]});
dojo.provide("dojo.uri.*");
dojo.provide("dojo.html.common");
dojo.lang.mixin(dojo.html,dojo.dom);
dojo.html.body=function(){
dojo.deprecated("dojo.html.body() moved to dojo.body()","0.5");
return dojo.body();
};
dojo.html.getEventTarget=function(evt){
if(!evt){
evt=dojo.global().event||{};
}
var t=(evt.srcElement?evt.srcElement:(evt.target?evt.target:null));
while((t)&&(t.nodeType!=1)){
t=t.parentNode;
}
return t;
};
dojo.html.getViewport=function(){
var _336=dojo.global();
var _337=dojo.doc();
var w=0;
var h=0;
if(dojo.render.html.mozilla){
w=_337.documentElement.clientWidth;
h=_336.innerHeight;
}else{
if(!dojo.render.html.opera&&_336.innerWidth){
w=_336.innerWidth;
h=_336.innerHeight;
}else{
if(!dojo.render.html.opera&&dojo.exists(_337,"documentElement.clientWidth")){
var w2=_337.documentElement.clientWidth;
if(!w||w2&&w2<w){
w=w2;
}
h=_337.documentElement.clientHeight;
}else{
if(dojo.body().clientWidth){
w=dojo.body().clientWidth;
h=dojo.body().clientHeight;
}
}
}
}
return {width:w,height:h};
};
dojo.html.getScroll=function(){
var _33b=dojo.global();
var _33c=dojo.doc();
var top=_33b.pageYOffset||_33c.documentElement.scrollTop||dojo.body().scrollTop||0;
var left=_33b.pageXOffset||_33c.documentElement.scrollLeft||dojo.body().scrollLeft||0;
return {top:top,left:left,offset:{x:left,y:top}};
};
dojo.html.getParentByType=function(node,type){
var _341=dojo.doc();
var _342=dojo.byId(node);
type=type.toLowerCase();
while((_342)&&(_342.nodeName.toLowerCase()!=type)){
if(_342==(_341["body"]||_341["documentElement"])){
return null;
}
_342=_342.parentNode;
}
return _342;
};
dojo.html.getAttribute=function(node,attr){
node=dojo.byId(node);
if((!node)||(!node.getAttribute)){
return null;
}
var ta=typeof attr=="string"?attr:new String(attr);
var v=node.getAttribute(ta.toUpperCase());
if((v)&&(typeof v=="string")&&(v!="")){
return v;
}
if(v&&v.value){
return v.value;
}
if((node.getAttributeNode)&&(node.getAttributeNode(ta))){
return (node.getAttributeNode(ta)).value;
}else{
if(node.getAttribute(ta)){
return node.getAttribute(ta);
}else{
if(node.getAttribute(ta.toLowerCase())){
return node.getAttribute(ta.toLowerCase());
}
}
}
return null;
};
dojo.html.hasAttribute=function(node,attr){
return dojo.html.getAttribute(dojo.byId(node),attr)?true:false;
};
dojo.html.getCursorPosition=function(e){
e=e||dojo.global().event;
var _34a={x:0,y:0};
if(e.pageX||e.pageY){
_34a.x=e.pageX;
_34a.y=e.pageY;
}else{
var de=dojo.doc().documentElement;
var db=dojo.body();
_34a.x=e.clientX+((de||db)["scrollLeft"])-((de||db)["clientLeft"]);
_34a.y=e.clientY+((de||db)["scrollTop"])-((de||db)["clientTop"]);
}
return _34a;
};
dojo.html.isTag=function(node){
node=dojo.byId(node);
if(node&&node.tagName){
for(var i=1;i<arguments.length;i++){
if(node.tagName.toLowerCase()==String(arguments[i]).toLowerCase()){
return String(arguments[i]).toLowerCase();
}
}
}
return "";
};
if(dojo.render.html.ie&&!dojo.render.html.ie70){
if(window.location.href.substr(0,6).toLowerCase()!="https:"){
(function(){
var _34f=dojo.doc().createElement("script");
_34f.src="javascript:'dojo.html.createExternalElement=function(doc, tag){ return doc.createElement(tag); }'";
dojo.doc().getElementsByTagName("head")[0].appendChild(_34f);
})();
}
}else{
dojo.html.createExternalElement=function(doc,tag){
return doc.createElement(tag);
};
}
dojo.html._callDeprecated=function(_352,_353,args,_355,_356){
dojo.deprecated("dojo.html."+_352,"replaced by dojo.html."+_353+"("+(_355?"node, {"+_355+": "+_355+"}":"")+")"+(_356?"."+_356:""),"0.5");
var _357=[];
if(_355){
var _358={};
_358[_355]=args[1];
_357.push(args[0]);
_357.push(_358);
}else{
_357=args;
}
var ret=dojo.html[_353].apply(dojo.html,args);
if(_356){
return ret[_356];
}else{
return ret;
}
};
dojo.html.getViewportWidth=function(){
return dojo.html._callDeprecated("getViewportWidth","getViewport",arguments,null,"width");
};
dojo.html.getViewportHeight=function(){
return dojo.html._callDeprecated("getViewportHeight","getViewport",arguments,null,"height");
};
dojo.html.getViewportSize=function(){
return dojo.html._callDeprecated("getViewportSize","getViewport",arguments);
};
dojo.html.getScrollTop=function(){
return dojo.html._callDeprecated("getScrollTop","getScroll",arguments,null,"top");
};
dojo.html.getScrollLeft=function(){
return dojo.html._callDeprecated("getScrollLeft","getScroll",arguments,null,"left");
};
dojo.html.getScrollOffset=function(){
return dojo.html._callDeprecated("getScrollOffset","getScroll",arguments,null,"offset");
};
dojo.provide("dojo.a11y");
dojo.a11y={imgPath:dojo.uri.moduleUri("dojo.widget","templates/images"),doAccessibleCheck:true,accessible:null,checkAccessible:function(){
if(this.accessible===null){
this.accessible=false;
if(this.doAccessibleCheck==true){
this.accessible=this.testAccessible();
}
}
return this.accessible;
},testAccessible:function(){
this.accessible=false;
if(dojo.render.html.ie||dojo.render.html.mozilla){
var div=document.createElement("div");
div.style.backgroundImage="url(\""+this.imgPath+"/tab_close.gif\")";
dojo.body().appendChild(div);
var _35b=null;
if(window.getComputedStyle){
var _35c=getComputedStyle(div,"");
_35b=_35c.getPropertyValue("background-image");
}else{
_35b=div.currentStyle.backgroundImage;
}
var _35d=false;
if(_35b!=null&&(_35b=="none"||_35b=="url(invalid-url:)")){
this.accessible=true;
}
dojo.body().removeChild(div);
}
return this.accessible;
},setCheckAccessible:function(_35e){
this.doAccessibleCheck=_35e;
},setAccessibleMode:function(){
if(this.accessible===null){
if(this.checkAccessible()){
dojo.render.html.prefixes.unshift("a11y");
}
}
return this.accessible;
}};
dojo.provide("dojo.widget.Widget");
dojo.declare("dojo.widget.Widget",null,function(){
this.children=[];
this.extraArgs={};
},{parent:null,isTopLevel:false,disabled:false,isContainer:false,widgetId:"",widgetType:"Widget",ns:"dojo",getNamespacedType:function(){
return (this.ns?this.ns+":"+this.widgetType:this.widgetType).toLowerCase();
},toString:function(){
return "[Widget "+this.getNamespacedType()+", "+(this.widgetId||"NO ID")+"]";
},repr:function(){
return this.toString();
},enable:function(){
this.disabled=false;
},disable:function(){
this.disabled=true;
},onResized:function(){
this.notifyChildrenOfResize();
},notifyChildrenOfResize:function(){
for(var i=0;i<this.children.length;i++){
var _360=this.children[i];
if(_360.onResized){
_360.onResized();
}
}
},create:function(args,_362,_363,ns){
if(ns){
this.ns=ns;
}
this.satisfyPropertySets(args,_362,_363);
this.mixInProperties(args,_362,_363);
this.postMixInProperties(args,_362,_363);
dojo.widget.manager.add(this);
this.buildRendering(args,_362,_363);
this.initialize(args,_362,_363);
this.postInitialize(args,_362,_363);
this.postCreate(args,_362,_363);
return this;
},destroy:function(_365){
if(this.parent){
this.parent.removeChild(this);
}
this.destroyChildren();
this.uninitialize();
this.destroyRendering(_365);
dojo.widget.manager.removeById(this.widgetId);
},destroyChildren:function(){
var _366;
var i=0;
while(this.children.length>i){
_366=this.children[i];
if(_366 instanceof dojo.widget.Widget){
this.removeChild(_366);
_366.destroy();
continue;
}
i++;
}
},getChildrenOfType:function(type,_369){
var ret=[];
var _36b=dojo.lang.isFunction(type);
if(!_36b){
type=type.toLowerCase();
}
for(var x=0;x<this.children.length;x++){
if(_36b){
if(this.children[x] instanceof type){
ret.push(this.children[x]);
}
}else{
if(this.children[x].widgetType.toLowerCase()==type){
ret.push(this.children[x]);
}
}
if(_369){
ret=ret.concat(this.children[x].getChildrenOfType(type,_369));
}
}
return ret;
},getDescendants:function(){
var _36d=[];
var _36e=[this];
var elem;
while((elem=_36e.pop())){
_36d.push(elem);
if(elem.children){
dojo.lang.forEach(elem.children,function(elem){
_36e.push(elem);
});
}
}
return _36d;
},isFirstChild:function(){
return this===this.parent.children[0];
},isLastChild:function(){
return this===this.parent.children[this.parent.children.length-1];
},satisfyPropertySets:function(args){
return args;
},mixInProperties:function(args,frag){
if((args["fastMixIn"])||(frag["fastMixIn"])){
for(var x in args){
this[x]=args[x];
}
return;
}
var _375;
var _376=dojo.widget.lcArgsCache[this.widgetType];
if(_376==null){
_376={};
for(var y in this){
_376[((new String(y)).toLowerCase())]=y;
}
dojo.widget.lcArgsCache[this.widgetType]=_376;
}
var _378={};
for(var x in args){
if(!this[x]){
var y=_376[(new String(x)).toLowerCase()];
if(y){
args[y]=args[x];
x=y;
}
}
if(_378[x]){
continue;
}
_378[x]=true;
if((typeof this[x])!=(typeof _375)){
if(typeof args[x]!="string"){
this[x]=args[x];
}else{
if(dojo.lang.isString(this[x])){
this[x]=args[x];
}else{
if(dojo.lang.isNumber(this[x])){
this[x]=new Number(args[x]);
}else{
if(dojo.lang.isBoolean(this[x])){
this[x]=(args[x].toLowerCase()=="false")?false:true;
}else{
if(dojo.lang.isFunction(this[x])){
if(args[x].search(/[^\w\.]+/i)==-1){
this[x]=dojo.evalObjPath(args[x],false);
}else{
var tn=dojo.lang.nameAnonFunc(new Function(args[x]),this);
dojo.event.kwConnect({srcObj:this,srcFunc:x,adviceObj:this,adviceFunc:tn});
}
}else{
if(dojo.lang.isArray(this[x])){
this[x]=args[x].split(";");
}else{
if(this[x] instanceof Date){
this[x]=new Date(Number(args[x]));
}else{
if(typeof this[x]=="object"){
if(this[x] instanceof dojo.uri.Uri){
this[x]=dojo.uri.dojoUri(args[x]);
}else{
var _37a=args[x].split(";");
for(var y=0;y<_37a.length;y++){
var si=_37a[y].indexOf(":");
if((si!=-1)&&(_37a[y].length>si)){
this[x][_37a[y].substr(0,si).replace(/^\s+|\s+$/g,"")]=_37a[y].substr(si+1);
}
}
}
}else{
this[x]=args[x];
}
}
}
}
}
}
}
}
}else{
this.extraArgs[x.toLowerCase()]=args[x];
}
}
},postMixInProperties:function(args,frag,_37e){
},initialize:function(args,frag,_381){
return false;
},postInitialize:function(args,frag,_384){
return false;
},postCreate:function(args,frag,_387){
return false;
},uninitialize:function(){
return false;
},buildRendering:function(args,frag,_38a){
dojo.unimplemented("dojo.widget.Widget.buildRendering, on "+this.toString()+", ");
return false;
},destroyRendering:function(){
dojo.unimplemented("dojo.widget.Widget.destroyRendering");
return false;
},addedTo:function(_38b){
},addChild:function(_38c){
dojo.unimplemented("dojo.widget.Widget.addChild");
return false;
},removeChild:function(_38d){
for(var x=0;x<this.children.length;x++){
if(this.children[x]===_38d){
this.children.splice(x,1);
_38d.parent=null;
break;
}
}
return _38d;
},getPreviousSibling:function(){
var idx=this.getParentIndex();
if(idx<=0){
return null;
}
return this.parent.children[idx-1];
},getSiblings:function(){
return this.parent.children;
},getParentIndex:function(){
return dojo.lang.indexOf(this.parent.children,this,true);
},getNextSibling:function(){
var idx=this.getParentIndex();
if(idx==this.parent.children.length-1){
return null;
}
if(idx<0){
return null;
}
return this.parent.children[idx+1];
}});
dojo.widget.lcArgsCache={};
dojo.widget.tags={};
dojo.widget.tags.addParseTreeHandler=function(type){
dojo.deprecated("addParseTreeHandler",". ParseTreeHandlers are now reserved for components. Any unfiltered DojoML tag without a ParseTreeHandler is assumed to be a widget","0.5");
};
dojo.widget.tags["dojo:propertyset"]=function(_392,_393,_394){
var _395=_393.parseProperties(_392["dojo:propertyset"]);
};
dojo.widget.tags["dojo:connect"]=function(_396,_397,_398){
var _399=_397.parseProperties(_396["dojo:connect"]);
};
dojo.widget.buildWidgetFromParseTree=function(type,frag,_39c,_39d,_39e,_39f){
dojo.a11y.setAccessibleMode();
var _3a0=type.split(":");
_3a0=(_3a0.length==2)?_3a0[1]:type;
var _3a1=_39f||_39c.parseProperties(frag[frag["ns"]+":"+_3a0]);
var _3a2=dojo.widget.manager.getImplementation(_3a0,null,null,frag["ns"]);
if(!_3a2){
throw new Error("cannot find \""+type+"\" widget");
}else{
if(!_3a2.create){
throw new Error("\""+type+"\" widget object has no \"create\" method and does not appear to implement *Widget");
}
}
_3a1["dojoinsertionindex"]=_39e;
var ret=_3a2.create(_3a1,frag,_39d,frag["ns"]);
return ret;
};
dojo.widget.defineWidget=function(_3a4,_3a5,_3a6,init,_3a8){
if(dojo.lang.isString(arguments[3])){
dojo.widget._defineWidget(arguments[0],arguments[3],arguments[1],arguments[4],arguments[2]);
}else{
var args=[arguments[0]],p=3;
if(dojo.lang.isString(arguments[1])){
args.push(arguments[1],arguments[2]);
}else{
args.push("",arguments[1]);
p=2;
}
if(dojo.lang.isFunction(arguments[p])){
args.push(arguments[p],arguments[p+1]);
}else{
args.push(null,arguments[p]);
}
dojo.widget._defineWidget.apply(this,args);
}
};
dojo.widget.defineWidget.renderers="html|svg|vml";
dojo.widget._defineWidget=function(_3ab,_3ac,_3ad,init,_3af){
var _3b0=_3ab.split(".");
var type=_3b0.pop();
var regx="\\.("+(_3ac?_3ac+"|":"")+dojo.widget.defineWidget.renderers+")\\.";
var r=_3ab.search(new RegExp(regx));
_3b0=(r<0?_3b0.join("."):_3ab.substr(0,r));
dojo.widget.manager.registerWidgetPackage(_3b0);
var pos=_3b0.indexOf(".");
var _3b5=(pos>-1)?_3b0.substring(0,pos):_3b0;
_3af=(_3af)||{};
_3af.widgetType=type;
if((!init)&&(_3af["classConstructor"])){
init=_3af.classConstructor;
delete _3af.classConstructor;
}
dojo.declare(_3ab,_3ad,init,_3af);
};
dojo.provide("dojo.widget.Parse");
dojo.widget.Parse=function(_3b6){
this.propertySetsList=[];
this.fragment=_3b6;
this.createComponents=function(frag,_3b8){
var _3b9=[];
var _3ba=false;
try{
if(frag&&frag.tagName&&(frag!=frag.nodeRef)){
var _3bb=dojo.widget.tags;
var tna=String(frag.tagName).split(";");
for(var x=0;x<tna.length;x++){
var ltn=tna[x].replace(/^\s+|\s+$/g,"").toLowerCase();
frag.tagName=ltn;
var ret;
if(_3bb[ltn]){
_3ba=true;
ret=_3bb[ltn](frag,this,_3b8,frag.index);
_3b9.push(ret);
}else{
if(ltn.indexOf(":")==-1){
ltn="dojo:"+ltn;
}
ret=dojo.widget.buildWidgetFromParseTree(ltn,frag,this,_3b8,frag.index);
if(ret){
_3ba=true;
_3b9.push(ret);
}
}
}
}
}
catch(e){
dojo.debug("dojo.widget.Parse: error:",e);
}
if(!_3ba){
_3b9=_3b9.concat(this.createSubComponents(frag,_3b8));
}
return _3b9;
};
this.createSubComponents=function(_3c0,_3c1){
var frag,_3c3=[];
for(var item in _3c0){
frag=_3c0[item];
if(frag&&typeof frag=="object"&&(frag!=_3c0.nodeRef)&&(frag!=_3c0.tagName)&&(!dojo.dom.isNode(frag))){
_3c3=_3c3.concat(this.createComponents(frag,_3c1));
}
}
return _3c3;
};
this.parsePropertySets=function(_3c5){
return [];
};
this.parseProperties=function(_3c6){
var _3c7={};
for(var item in _3c6){
if((_3c6[item]==_3c6.tagName)||(_3c6[item]==_3c6.nodeRef)){
}else{
var frag=_3c6[item];
if(frag.tagName&&dojo.widget.tags[frag.tagName.toLowerCase()]){
}else{
if(frag[0]&&frag[0].value!=""&&frag[0].value!=null){
try{
if(item.toLowerCase()=="dataprovider"){
var _3ca=this;
this.getDataProvider(_3ca,frag[0].value);
_3c7.dataProvider=this.dataProvider;
}
_3c7[item]=frag[0].value;
var _3cb=this.parseProperties(frag);
for(var _3cc in _3cb){
_3c7[_3cc]=_3cb[_3cc];
}
}
catch(e){
dojo.debug(e);
}
}
}
switch(item.toLowerCase()){
case "checked":
case "disabled":
if(typeof _3c7[item]!="boolean"){
_3c7[item]=true;
}
break;
}
}
}
return _3c7;
};
this.getDataProvider=function(_3cd,_3ce){
dojo.io.bind({url:_3ce,load:function(type,_3d0){
if(type=="load"){
_3cd.dataProvider=_3d0;
}
},mimetype:"text/javascript",sync:true});
};
this.getPropertySetById=function(_3d1){
for(var x=0;x<this.propertySetsList.length;x++){
if(_3d1==this.propertySetsList[x]["id"][0].value){
return this.propertySetsList[x];
}
}
return "";
};
this.getPropertySetsByType=function(_3d3){
var _3d4=[];
for(var x=0;x<this.propertySetsList.length;x++){
var cpl=this.propertySetsList[x];
var cpcc=cpl.componentClass||cpl.componentType||null;
var _3d8=this.propertySetsList[x]["id"][0].value;
if(cpcc&&(_3d8==cpcc[0].value)){
_3d4.push(cpl);
}
}
return _3d4;
};
this.getPropertySets=function(_3d9){
var ppl="dojo:propertyproviderlist";
var _3db=[];
var _3dc=_3d9.tagName;
if(_3d9[ppl]){
var _3dd=_3d9[ppl].value.split(" ");
for(var _3de in _3dd){
if((_3de.indexOf("..")==-1)&&(_3de.indexOf("://")==-1)){
var _3df=this.getPropertySetById(_3de);
if(_3df!=""){
_3db.push(_3df);
}
}else{
}
}
}
return this.getPropertySetsByType(_3dc).concat(_3db);
};
this.createComponentFromScript=function(_3e0,_3e1,_3e2,ns){
_3e2.fastMixIn=true;
var ltn=(ns||"dojo")+":"+_3e1.toLowerCase();
if(dojo.widget.tags[ltn]){
return [dojo.widget.tags[ltn](_3e2,this,null,null,_3e2)];
}
return [dojo.widget.buildWidgetFromParseTree(ltn,_3e2,this,null,null,_3e2)];
};
};
dojo.widget._parser_collection={"dojo":new dojo.widget.Parse()};
dojo.widget.getParser=function(name){
if(!name){
name="dojo";
}
if(!this._parser_collection[name]){
this._parser_collection[name]=new dojo.widget.Parse();
}
return this._parser_collection[name];
};
dojo.widget.createWidget=function(name,_3e7,_3e8,_3e9){
var _3ea=false;
var _3eb=(typeof name=="string");
if(_3eb){
var pos=name.indexOf(":");
var ns=(pos>-1)?name.substring(0,pos):"dojo";
if(pos>-1){
name=name.substring(pos+1);
}
var _3ee=name.toLowerCase();
var _3ef=ns+":"+_3ee;
_3ea=(dojo.byId(name)&&!dojo.widget.tags[_3ef]);
}
if((arguments.length==1)&&(_3ea||!_3eb)){
var xp=new dojo.xml.Parse();
var tn=_3ea?dojo.byId(name):name;
return dojo.widget.getParser().createComponents(xp.parseElement(tn,null,true))[0];
}
function fromScript(_3f2,name,_3f4,ns){
_3f4[_3ef]={dojotype:[{value:_3ee}],nodeRef:_3f2,fastMixIn:true};
_3f4.ns=ns;
return dojo.widget.getParser().createComponentFromScript(_3f2,name,_3f4,ns);
}
_3e7=_3e7||{};
var _3f6=false;
var tn=null;
var h=dojo.render.html.capable;
if(h){
tn=document.createElement("span");
}
if(!_3e8){
_3f6=true;
_3e8=tn;
if(h){
dojo.body().appendChild(_3e8);
}
}else{
if(_3e9){
dojo.dom.insertAtPosition(tn,_3e8,_3e9);
}else{
tn=_3e8;
}
}
var _3f8=fromScript(tn,name.toLowerCase(),_3e7,ns);
if((!_3f8)||(!_3f8[0])||(typeof _3f8[0].widgetType=="undefined")){
throw new Error("createWidget: Creation of \""+name+"\" widget failed.");
}
try{
if(_3f6&&_3f8[0].domNode.parentNode){
_3f8[0].domNode.parentNode.removeChild(_3f8[0].domNode);
}
}
catch(e){
dojo.debug(e);
}
return _3f8[0];
};
dojo.provide("dojo.html.style");
dojo.html.getClass=function(node){
node=dojo.byId(node);
if(!node){
return "";
}
var cs="";
if(node.className){
cs=node.className;
}else{
if(dojo.html.hasAttribute(node,"class")){
cs=dojo.html.getAttribute(node,"class");
}
}
return cs.replace(/^\s+|\s+$/g,"");
};
dojo.html.getClasses=function(node){
var c=dojo.html.getClass(node);
return (c=="")?[]:c.split(/\s+/g);
};
dojo.html.hasClass=function(node,_3fe){
return (new RegExp("(^|\\s+)"+_3fe+"(\\s+|$)")).test(dojo.html.getClass(node));
};
dojo.html.prependClass=function(node,_400){
_400+=" "+dojo.html.getClass(node);
return dojo.html.setClass(node,_400);
};
dojo.html.addClass=function(node,_402){
if(dojo.html.hasClass(node,_402)){
return false;
}
_402=(dojo.html.getClass(node)+" "+_402).replace(/^\s+|\s+$/g,"");
return dojo.html.setClass(node,_402);
};
dojo.html.setClass=function(node,_404){
node=dojo.byId(node);
var cs=new String(_404);
try{
if(typeof node.className=="string"){
node.className=cs;
}else{
if(node.setAttribute){
node.setAttribute("class",_404);
node.className=cs;
}else{
return false;
}
}
}
catch(e){
dojo.debug("dojo.html.setClass() failed",e);
}
return true;
};
dojo.html.removeClass=function(node,_407,_408){
try{
if(!_408){
var _409=dojo.html.getClass(node).replace(new RegExp("(^|\\s+)"+_407+"(\\s+|$)"),"$1$2");
}else{
var _409=dojo.html.getClass(node).replace(_407,"");
}
dojo.html.setClass(node,_409);
}
catch(e){
dojo.debug("dojo.html.removeClass() failed",e);
}
return true;
};
dojo.html.replaceClass=function(node,_40b,_40c){
dojo.html.removeClass(node,_40c);
dojo.html.addClass(node,_40b);
};
dojo.html.classMatchType={ContainsAll:0,ContainsAny:1,IsOnly:2};
dojo.html.getElementsByClass=function(_40d,_40e,_40f,_410,_411){
_411=false;
var _412=dojo.doc();
_40e=dojo.byId(_40e)||_412;
var _413=_40d.split(/\s+/g);
var _414=[];
if(_410!=1&&_410!=2){
_410=0;
}
var _415=new RegExp("(\\s|^)(("+_413.join(")|(")+"))(\\s|$)");
var _416=_413.join(" ").length;
var _417=[];
if(!_411&&_412.evaluate){
var _418=".//"+(_40f||"*")+"[contains(";
if(_410!=dojo.html.classMatchType.ContainsAny){
_418+="concat(' ',@class,' '), ' "+_413.join(" ') and contains(concat(' ',@class,' '), ' ")+" ')";
if(_410==2){
_418+=" and string-length(@class)="+_416+"]";
}else{
_418+="]";
}
}else{
_418+="concat(' ',@class,' '), ' "+_413.join(" ') or contains(concat(' ',@class,' '), ' ")+" ')]";
}
var _419=_412.evaluate(_418,_40e,null,XPathResult.ANY_TYPE,null);
var _41a=_419.iterateNext();
while(_41a){
try{
_417.push(_41a);
_41a=_419.iterateNext();
}
catch(e){
break;
}
}
return _417;
}else{
if(!_40f){
_40f="*";
}
_417=_40e.getElementsByTagName(_40f);
var node,i=0;
outer:
while(node=_417[i++]){
var _41d=dojo.html.getClasses(node);
if(_41d.length==0){
continue outer;
}
var _41e=0;
for(var j=0;j<_41d.length;j++){
if(_415.test(_41d[j])){
if(_410==dojo.html.classMatchType.ContainsAny){
_414.push(node);
continue outer;
}else{
_41e++;
}
}else{
if(_410==dojo.html.classMatchType.IsOnly){
continue outer;
}
}
}
if(_41e==_413.length){
if((_410==dojo.html.classMatchType.IsOnly)&&(_41e==_41d.length)){
_414.push(node);
}else{
if(_410==dojo.html.classMatchType.ContainsAll){
_414.push(node);
}
}
}
}
return _414;
}
};
dojo.html.getElementsByClassName=dojo.html.getElementsByClass;
dojo.html.toCamelCase=function(_420){
var arr=_420.split("-"),cc=arr[0];
for(var i=1;i<arr.length;i++){
cc+=arr[i].charAt(0).toUpperCase()+arr[i].substring(1);
}
return cc;
};
dojo.html.toSelectorCase=function(_424){
return _424.replace(/([A-Z])/g,"-$1").toLowerCase();
};
if(dojo.render.html.ie){
dojo.html.getComputedStyle=function(node,_426,_427){
node=dojo.byId(node);
if(!node||!node.style){
return _427;
}
return node.currentStyle[dojo.html.toCamelCase(_426)];
};
dojo.html.getComputedStyles=function(node){
return node.currentStyle;
};
}else{
dojo.html.getComputedStyle=function(node,_42a,_42b){
node=dojo.byId(node);
if(!node||!node.style){
return _42b;
}
var s=document.defaultView.getComputedStyle(node,null);
return (s&&s[dojo.html.toCamelCase(_42a)])||"";
};
dojo.html.getComputedStyles=function(node){
return document.defaultView.getComputedStyle(node,null);
};
}
dojo.html.getStyleProperty=function(node,_42f){
node=dojo.byId(node);
return (node&&node.style?node.style[dojo.html.toCamelCase(_42f)]:undefined);
};
dojo.html.getStyle=function(node,_431){
var _432=dojo.html.getStyleProperty(node,_431);
return (_432?_432:dojo.html.getComputedStyle(node,_431));
};
dojo.html.setStyle=function(node,_434,_435){
node=dojo.byId(node);
if(node&&node.style){
var _436=dojo.html.toCamelCase(_434);
node.style[_436]=_435;
}
};
dojo.html.setStyleText=function(_437,text){
try{
_437.style.cssText=text;
}
catch(e){
_437.setAttribute("style",text);
}
};
dojo.html.copyStyle=function(_439,_43a){
if(!_43a.style.cssText){
_439.setAttribute("style",_43a.getAttribute("style"));
}else{
_439.style.cssText=_43a.style.cssText;
}
dojo.html.addClass(_439,dojo.html.getClass(_43a));
};
dojo.html.getUnitValue=function(node,_43c,_43d){
var s=dojo.html.getComputedStyle(node,_43c);
if((!s)||((s=="auto")&&(_43d))){
return {value:0,units:"px"};
}
var _43f=s.match(/(\-?[\d.]+)([a-z%]*)/i);
if(!_43f){
return dojo.html.getUnitValue.bad;
}
return {value:Number(_43f[1]),units:_43f[2].toLowerCase()};
};
dojo.html.getUnitValue.bad={value:NaN,units:""};
if(dojo.render.html.ie){
dojo.html.toPixelValue=function(_440,_441){
if(!_441){
return 0;
}
if(_441.slice(-2)=="px"){
return parseFloat(_441);
}
var _442=0;
with(_440){
var _443=style.left;
var _444=runtimeStyle.left;
runtimeStyle.left=currentStyle.left;
try{
style.left=_441||0;
_442=style.pixelLeft;
style.left=_443;
runtimeStyle.left=_444;
}
catch(e){
}
}
return _442;
};
}else{
dojo.html.toPixelValue=function(_445,_446){
return (_446&&(_446.slice(-2)=="px")?parseFloat(_446):0);
};
}
dojo.html.getPixelValue=function(node,_448,_449){
return dojo.html.toPixelValue(node,dojo.html.getComputedStyle(node,_448));
};
dojo.html.setPositivePixelValue=function(node,_44b,_44c){
if(isNaN(_44c)){
return false;
}
node.style[_44b]=Math.max(0,_44c)+"px";
return true;
};
dojo.html.styleSheet=null;
dojo.html.insertCssRule=function(_44d,_44e,_44f){
if(!dojo.html.styleSheet){
if(document.createStyleSheet){
dojo.html.styleSheet=document.createStyleSheet();
}else{
if(document.styleSheets[0]){
dojo.html.styleSheet=document.styleSheets[0];
}else{
return null;
}
}
}
if(arguments.length<3){
if(dojo.html.styleSheet.cssRules){
_44f=dojo.html.styleSheet.cssRules.length;
}else{
if(dojo.html.styleSheet.rules){
_44f=dojo.html.styleSheet.rules.length;
}else{
return null;
}
}
}
if(dojo.html.styleSheet.insertRule){
var rule=_44d+" { "+_44e+" }";
return dojo.html.styleSheet.insertRule(rule,_44f);
}else{
if(dojo.html.styleSheet.addRule){
return dojo.html.styleSheet.addRule(_44d,_44e,_44f);
}else{
return null;
}
}
};
dojo.html.removeCssRule=function(_451){
if(!dojo.html.styleSheet){
dojo.debug("no stylesheet defined for removing rules");
return false;
}
if(dojo.render.html.ie){
if(!_451){
_451=dojo.html.styleSheet.rules.length;
dojo.html.styleSheet.removeRule(_451);
}
}else{
if(document.styleSheets[0]){
if(!_451){
_451=dojo.html.styleSheet.cssRules.length;
}
dojo.html.styleSheet.deleteRule(_451);
}
}
return true;
};
dojo.html._insertedCssFiles=[];
dojo.html.insertCssFile=function(URI,doc,_454,_455){
if(!URI){
return;
}
if(!doc){
doc=document;
}
var _456=dojo.hostenv.getText(URI,false,_455);
if(_456===null){
return;
}
_456=dojo.html.fixPathsInCssText(_456,URI);
if(_454){
var idx=-1,node,ent=dojo.html._insertedCssFiles;
for(var i=0;i<ent.length;i++){
if((ent[i].doc==doc)&&(ent[i].cssText==_456)){
idx=i;
node=ent[i].nodeRef;
break;
}
}
if(node){
var _45b=doc.getElementsByTagName("style");
for(var i=0;i<_45b.length;i++){
if(_45b[i]==node){
return;
}
}
dojo.html._insertedCssFiles.shift(idx,1);
}
}
var _45c=dojo.html.insertCssText(_456,doc);
dojo.html._insertedCssFiles.push({"doc":doc,"cssText":_456,"nodeRef":_45c});
if(_45c&&djConfig.isDebug){
_45c.setAttribute("dbgHref",URI);
}
return _45c;
};
dojo.html.insertCssText=function(_45d,doc,URI){
if(!_45d){
return;
}
if(!doc){
doc=document;
}
if(URI){
_45d=dojo.html.fixPathsInCssText(_45d,URI);
}
var _460=doc.createElement("style");
_460.setAttribute("type","text/css");
var head=doc.getElementsByTagName("head")[0];
if(!head){
dojo.debug("No head tag in document, aborting styles");
return;
}else{
head.appendChild(_460);
}
if(_460.styleSheet){
var _462=function(){
try{
_460.styleSheet.cssText=_45d;
}
catch(e){
dojo.debug(e);
}
};
if(_460.styleSheet.disabled){
setTimeout(_462,10);
}else{
_462();
}
}else{
var _463=doc.createTextNode(_45d);
_460.appendChild(_463);
}
return _460;
};
dojo.html.fixPathsInCssText=function(_464,URI){
if(!_464||!URI){
return;
}
var _466,str="",url="",_469="[\\t\\s\\w\\(\\)\\/\\.\\\\'\"-:#=&?~]+";
var _46a=new RegExp("url\\(\\s*("+_469+")\\s*\\)");
var _46b=/(file|https?|ftps?):\/\//;
regexTrim=new RegExp("^[\\s]*(['\"]?)("+_469+")\\1[\\s]*?$");
if(dojo.render.html.ie55||dojo.render.html.ie60){
var _46c=new RegExp("AlphaImageLoader\\((.*)src=['\"]("+_469+")['\"]");
while(_466=_46c.exec(_464)){
url=_466[2].replace(regexTrim,"$2");
if(!_46b.exec(url)){
url=(new dojo.uri.Uri(URI,url).toString());
}
str+=_464.substring(0,_466.index)+"AlphaImageLoader("+_466[1]+"src='"+url+"'";
_464=_464.substr(_466.index+_466[0].length);
}
_464=str+_464;
str="";
}
while(_466=_46a.exec(_464)){
url=_466[1].replace(regexTrim,"$2");
if(!_46b.exec(url)){
url=(new dojo.uri.Uri(URI,url).toString());
}
str+=_464.substring(0,_466.index)+"url("+url+")";
_464=_464.substr(_466.index+_466[0].length);
}
return str+_464;
};
dojo.html.setActiveStyleSheet=function(_46d){
var i=0,a,els=dojo.doc().getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")){
a.disabled=true;
if(a.getAttribute("title")==_46d){
a.disabled=false;
}
}
}
};
dojo.html.getActiveStyleSheet=function(){
var i=0,a,els=dojo.doc().getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("title")&&!a.disabled){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.getPreferredStyleSheet=function(){
var i=0,a,els=dojo.doc().getElementsByTagName("link");
while(a=els[i++]){
if(a.getAttribute("rel").indexOf("style")!=-1&&a.getAttribute("rel").indexOf("alt")==-1&&a.getAttribute("title")){
return a.getAttribute("title");
}
}
return null;
};
dojo.html.applyBrowserClass=function(node){
var drh=dojo.render.html;
var _479={dj_ie:drh.ie,dj_ie55:drh.ie55,dj_ie6:drh.ie60,dj_ie7:drh.ie70,dj_iequirks:drh.ie&&drh.quirks,dj_opera:drh.opera,dj_opera8:drh.opera&&(Math.floor(dojo.render.version)==8),dj_opera9:drh.opera&&(Math.floor(dojo.render.version)==9),dj_khtml:drh.khtml,dj_safari:drh.safari,dj_gecko:drh.mozilla};
for(var p in _479){
if(_479[p]){
dojo.html.addClass(node,p);
}
}
};
dojo.provide("dojo.widget.DomWidget");
dojo.widget._cssFiles={};
dojo.widget._cssStrings={};
dojo.widget._templateCache={};
dojo.widget.defaultStrings={dojoRoot:dojo.hostenv.getBaseScriptUri(),dojoWidgetModuleUri:dojo.uri.moduleUri("dojo.widget"),baseScriptUri:dojo.hostenv.getBaseScriptUri()};
dojo.widget.fillFromTemplateCache=function(obj,_47c,_47d,_47e){
var _47f=_47c||obj.templatePath;
var _480=dojo.widget._templateCache;
if(!_47f&&!obj["widgetType"]){
do{
var _481="__dummyTemplate__"+dojo.widget._templateCache.dummyCount++;
}while(_480[_481]);
obj.widgetType=_481;
}
var wt=_47f?_47f.toString():obj.widgetType;
var ts=_480[wt];
if(!ts){
_480[wt]={"string":null,"node":null};
if(_47e){
ts={};
}else{
ts=_480[wt];
}
}
if((!obj.templateString)&&(!_47e)){
obj.templateString=_47d||ts["string"];
}
if(obj.templateString){
obj.templateString=this._sanitizeTemplateString(obj.templateString);
}
if((!obj.templateNode)&&(!_47e)){
obj.templateNode=ts["node"];
}
if((!obj.templateNode)&&(!obj.templateString)&&(_47f)){
var _484=this._sanitizeTemplateString(dojo.hostenv.getText(_47f));
obj.templateString=_484;
if(!_47e){
_480[wt]["string"]=_484;
}
}
if((!ts["string"])&&(!_47e)){
ts.string=obj.templateString;
}
};
dojo.widget._sanitizeTemplateString=function(_485){
if(_485){
_485=_485.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,"");
var _486=_485.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_486){
_485=_486[1];
}
}else{
_485="";
}
return _485;
};
dojo.widget._templateCache.dummyCount=0;
dojo.widget.attachProperties=["dojoAttachPoint","id"];
dojo.widget.eventAttachProperty="dojoAttachEvent";
dojo.widget.onBuildProperty="dojoOnBuild";
dojo.widget.waiNames=["waiRole","waiState"];
dojo.widget.wai={waiRole:{name:"waiRole","namespace":"http://www.w3.org/TR/xhtml2",alias:"x2",prefix:"wairole:"},waiState:{name:"waiState","namespace":"http://www.w3.org/2005/07/aaa",alias:"aaa",prefix:""},setAttr:function(node,ns,attr,_48a){
if(dojo.render.html.ie){
node.setAttribute(this[ns].alias+":"+attr,this[ns].prefix+_48a);
}else{
node.setAttributeNS(this[ns]["namespace"],attr,this[ns].prefix+_48a);
}
},getAttr:function(node,ns,attr){
if(dojo.render.html.ie){
return node.getAttribute(this[ns].alias+":"+attr);
}else{
return node.getAttributeNS(this[ns]["namespace"],attr);
}
},removeAttr:function(node,ns,attr){
var _491=true;
if(dojo.render.html.ie){
_491=node.removeAttribute(this[ns].alias+":"+attr);
}else{
node.removeAttributeNS(this[ns]["namespace"],attr);
}
return _491;
}};
dojo.widget.attachTemplateNodes=function(_492,_493,_494){
var _495=dojo.dom.ELEMENT_NODE;
function trim(str){
return str.replace(/^\s+|\s+$/g,"");
}
if(!_492){
_492=_493.domNode;
}
if(_492.nodeType!=_495){
return;
}
var _497=_492.all||_492.getElementsByTagName("*");
var _498=_493;
for(var x=-1;x<_497.length;x++){
var _49a=(x==-1)?_492:_497[x];
var _49b=[];
if(!_493.widgetsInTemplate||!_49a.getAttribute("dojoType")){
for(var y=0;y<this.attachProperties.length;y++){
var _49d=_49a.getAttribute(this.attachProperties[y]);
if(_49d){
_49b=_49d.split(";");
for(var z=0;z<_49b.length;z++){
if(dojo.lang.isArray(_493[_49b[z]])){
_493[_49b[z]].push(_49a);
}else{
_493[_49b[z]]=_49a;
}
}
break;
}
}
var _49f=_49a.getAttribute(this.eventAttachProperty);
if(_49f){
var evts=_49f.split(";");
for(var y=0;y<evts.length;y++){
if((!evts[y])||(!evts[y].length)){
continue;
}
var _4a1=null;
var tevt=trim(evts[y]);
if(evts[y].indexOf(":")>=0){
var _4a3=tevt.split(":");
tevt=trim(_4a3[0]);
_4a1=trim(_4a3[1]);
}
if(!_4a1){
_4a1=tevt;
}
var tf=function(){
var ntf=new String(_4a1);
return function(evt){
if(_498[ntf]){
_498[ntf](dojo.event.browser.fixEvent(evt,this));
}
};
}();
dojo.event.browser.addListener(_49a,tevt,tf,false,true);
}
}
for(var y=0;y<_494.length;y++){
var _4a7=_49a.getAttribute(_494[y]);
if((_4a7)&&(_4a7.length)){
var _4a1=null;
var _4a8=_494[y].substr(4);
_4a1=trim(_4a7);
var _4a9=[_4a1];
if(_4a1.indexOf(";")>=0){
_4a9=dojo.lang.map(_4a1.split(";"),trim);
}
for(var z=0;z<_4a9.length;z++){
if(!_4a9[z].length){
continue;
}
var tf=function(){
var ntf=new String(_4a9[z]);
return function(evt){
if(_498[ntf]){
_498[ntf](dojo.event.browser.fixEvent(evt,this));
}
};
}();
dojo.event.browser.addListener(_49a,_4a8,tf,false,true);
}
}
}
}
var _4ac=_49a.getAttribute(this.templateProperty);
if(_4ac){
_493[_4ac]=_49a;
}
dojo.lang.forEach(dojo.widget.waiNames,function(name){
var wai=dojo.widget.wai[name];
var val=_49a.getAttribute(wai.name);
if(val){
if(val.indexOf("-")==-1){
dojo.widget.wai.setAttr(_49a,wai.name,"role",val);
}else{
var _4b0=val.split("-");
dojo.widget.wai.setAttr(_49a,wai.name,_4b0[0],_4b0[1]);
}
}
},this);
var _4b1=_49a.getAttribute(this.onBuildProperty);
if(_4b1){
eval("var node = baseNode; var widget = targetObj; "+_4b1);
}
}
};
dojo.widget.getDojoEventsFromStr=function(str){
var re=/(dojoOn([a-z]+)(\s?))=/gi;
var evts=str?str.match(re)||[]:[];
var ret=[];
var lem={};
for(var x=0;x<evts.length;x++){
if(evts[x].length<1){
continue;
}
var cm=evts[x].replace(/\s/,"");
cm=(cm.slice(0,cm.length-1));
if(!lem[cm]){
lem[cm]=true;
ret.push(cm);
}
}
return ret;
};
dojo.declare("dojo.widget.DomWidget",dojo.widget.Widget,function(){
if((arguments.length>0)&&(typeof arguments[0]=="object")){
this.create(arguments[0]);
}
},{templateNode:null,templateString:null,templateCssString:null,preventClobber:false,domNode:null,containerNode:null,widgetsInTemplate:false,addChild:function(_4b9,_4ba,pos,ref,_4bd){
if(!this.isContainer){
dojo.debug("dojo.widget.DomWidget.addChild() attempted on non-container widget");
return null;
}else{
if(_4bd==undefined){
_4bd=this.children.length;
}
this.addWidgetAsDirectChild(_4b9,_4ba,pos,ref,_4bd);
this.registerChild(_4b9,_4bd);
}
return _4b9;
},addWidgetAsDirectChild:function(_4be,_4bf,pos,ref,_4c2){
if((!this.containerNode)&&(!_4bf)){
this.containerNode=this.domNode;
}
var cn=(_4bf)?_4bf:this.containerNode;
if(!pos){
pos="after";
}
if(!ref){
if(!cn){
cn=dojo.body();
}
ref=cn.lastChild;
}
if(!_4c2){
_4c2=0;
}
_4be.domNode.setAttribute("dojoinsertionindex",_4c2);
if(!ref){
cn.appendChild(_4be.domNode);
}else{
if(pos=="insertAtIndex"){
dojo.dom.insertAtIndex(_4be.domNode,ref.parentNode,_4c2);
}else{
if((pos=="after")&&(ref===cn.lastChild)){
cn.appendChild(_4be.domNode);
}else{
dojo.dom.insertAtPosition(_4be.domNode,cn,pos);
}
}
}
},registerChild:function(_4c4,_4c5){
_4c4.dojoInsertionIndex=_4c5;
var idx=-1;
for(var i=0;i<this.children.length;i++){
if(this.children[i].dojoInsertionIndex<=_4c5){
idx=i;
}
}
this.children.splice(idx+1,0,_4c4);
_4c4.parent=this;
_4c4.addedTo(this,idx+1);
delete dojo.widget.manager.topWidgets[_4c4.widgetId];
},removeChild:function(_4c8){
dojo.dom.removeNode(_4c8.domNode);
return dojo.widget.DomWidget.superclass.removeChild.call(this,_4c8);
},getFragNodeRef:function(frag){
if(!frag){
return null;
}
if(!frag[this.getNamespacedType()]){
dojo.raise("Error: no frag for widget type "+this.getNamespacedType()+", id "+this.widgetId+" (maybe a widget has set it's type incorrectly)");
}
return frag[this.getNamespacedType()]["nodeRef"];
},postInitialize:function(args,frag,_4cc){
var _4cd=this.getFragNodeRef(frag);
if(_4cc&&(_4cc.snarfChildDomOutput||!_4cd)){
_4cc.addWidgetAsDirectChild(this,"","insertAtIndex","",args["dojoinsertionindex"],_4cd);
}else{
if(_4cd){
if(this.domNode&&(this.domNode!==_4cd)){
this._sourceNodeRef=dojo.dom.replaceNode(_4cd,this.domNode);
}
}
}
if(_4cc){
_4cc.registerChild(this,args.dojoinsertionindex);
}else{
dojo.widget.manager.topWidgets[this.widgetId]=this;
}
if(this.widgetsInTemplate){
var _4ce=new dojo.xml.Parse();
var _4cf;
var _4d0=this.domNode.getElementsByTagName("*");
for(var i=0;i<_4d0.length;i++){
if(_4d0[i].getAttribute("dojoAttachPoint")=="subContainerWidget"){
_4cf=_4d0[i];
}
if(_4d0[i].getAttribute("dojoType")){
_4d0[i].setAttribute("isSubWidget",true);
}
}
if(this.isContainer&&!this.containerNode){
if(_4cf){
var src=this.getFragNodeRef(frag);
if(src){
dojo.dom.moveChildren(src,_4cf);
frag["dojoDontFollow"]=true;
}
}else{
dojo.debug("No subContainerWidget node can be found in template file for widget "+this);
}
}
var _4d3=_4ce.parseElement(this.domNode,null,true);
dojo.widget.getParser().createSubComponents(_4d3,this);
var _4d4=[];
var _4d5=[this];
var w;
while((w=_4d5.pop())){
for(var i=0;i<w.children.length;i++){
var _4d7=w.children[i];
if(_4d7._processedSubWidgets||!_4d7.extraArgs["issubwidget"]){
continue;
}
_4d4.push(_4d7);
if(_4d7.isContainer){
_4d5.push(_4d7);
}
}
}
for(var i=0;i<_4d4.length;i++){
var _4d8=_4d4[i];
if(_4d8._processedSubWidgets){
dojo.debug("This should not happen: widget._processedSubWidgets is already true!");
return;
}
_4d8._processedSubWidgets=true;
if(_4d8.extraArgs["dojoattachevent"]){
var evts=_4d8.extraArgs["dojoattachevent"].split(";");
for(var j=0;j<evts.length;j++){
var _4db=null;
var tevt=dojo.string.trim(evts[j]);
if(tevt.indexOf(":")>=0){
var _4dd=tevt.split(":");
tevt=dojo.string.trim(_4dd[0]);
_4db=dojo.string.trim(_4dd[1]);
}
if(!_4db){
_4db=tevt;
}
if(dojo.lang.isFunction(_4d8[tevt])){
dojo.event.kwConnect({srcObj:_4d8,srcFunc:tevt,targetObj:this,targetFunc:_4db});
}else{
alert(tevt+" is not a function in widget "+_4d8);
}
}
}
if(_4d8.extraArgs["dojoattachpoint"]){
this[_4d8.extraArgs["dojoattachpoint"]]=_4d8;
}
}
}
if(this.isContainer&&!frag["dojoDontFollow"]){
dojo.widget.getParser().createSubComponents(frag,this);
}
},buildRendering:function(args,frag){
var ts=dojo.widget._templateCache[this.widgetType];
if(args["templatecsspath"]){
args["templateCssPath"]=args["templatecsspath"];
}
var _4e1=args["templateCssPath"]||this.templateCssPath;
if(_4e1&&!dojo.widget._cssFiles[_4e1.toString()]){
if((!this.templateCssString)&&(_4e1)){
this.templateCssString=dojo.hostenv.getText(_4e1);
this.templateCssPath=null;
}
dojo.widget._cssFiles[_4e1.toString()]=true;
}
if((this["templateCssString"])&&(!dojo.widget._cssStrings[this.templateCssString])){
dojo.html.insertCssText(this.templateCssString,null,_4e1);
dojo.widget._cssStrings[this.templateCssString]=true;
}
if((!this.preventClobber)&&((this.templatePath)||(this.templateNode)||((this["templateString"])&&(this.templateString.length))||((typeof ts!="undefined")&&((ts["string"])||(ts["node"]))))){
this.buildFromTemplate(args,frag);
}else{
this.domNode=this.getFragNodeRef(frag);
}
this.fillInTemplate(args,frag);
},buildFromTemplate:function(args,frag){
var _4e4=false;
if(args["templatepath"]){
args["templatePath"]=args["templatepath"];
}
dojo.widget.fillFromTemplateCache(this,args["templatePath"],null,_4e4);
var ts=dojo.widget._templateCache[this.templatePath?this.templatePath.toString():this.widgetType];
if((ts)&&(!_4e4)){
if(!this.templateString.length){
this.templateString=ts["string"];
}
if(!this.templateNode){
this.templateNode=ts["node"];
}
}
var _4e6=false;
var node=null;
var tstr=this.templateString;
if((!this.templateNode)&&(this.templateString)){
_4e6=this.templateString.match(/\$\{([^\}]+)\}/g);
if(_4e6){
var hash=this.strings||{};
for(var key in dojo.widget.defaultStrings){
if(dojo.lang.isUndefined(hash[key])){
hash[key]=dojo.widget.defaultStrings[key];
}
}
for(var i=0;i<_4e6.length;i++){
var key=_4e6[i];
key=key.substring(2,key.length-1);
var kval=(key.substring(0,5)=="this.")?dojo.lang.getObjPathValue(key.substring(5),this):hash[key];
var _4ed;
if((kval)||(dojo.lang.isString(kval))){
_4ed=new String((dojo.lang.isFunction(kval))?kval.call(this,key,this.templateString):kval);
while(_4ed.indexOf("\"")>-1){
_4ed=_4ed.replace("\"","&quot;");
}
tstr=tstr.replace(_4e6[i],_4ed);
}
}
}else{
this.templateNode=this.createNodesFromText(this.templateString,true)[0];
if(!_4e4){
ts.node=this.templateNode;
}
}
}
if((!this.templateNode)&&(!_4e6)){
dojo.debug("DomWidget.buildFromTemplate: could not create template");
return false;
}else{
if(!_4e6){
node=this.templateNode.cloneNode(true);
if(!node){
return false;
}
}else{
node=this.createNodesFromText(tstr,true)[0];
}
}
this.domNode=node;
this.attachTemplateNodes();
if(this.isContainer&&this.containerNode){
var src=this.getFragNodeRef(frag);
if(src){
dojo.dom.moveChildren(src,this.containerNode);
}
}
},attachTemplateNodes:function(_4ef,_4f0){
if(!_4ef){
_4ef=this.domNode;
}
if(!_4f0){
_4f0=this;
}
return dojo.widget.attachTemplateNodes(_4ef,_4f0,dojo.widget.getDojoEventsFromStr(this.templateString));
},fillInTemplate:function(){
},destroyRendering:function(){
try{
dojo.dom.destroyNode(this.domNode);
delete this.domNode;
}
catch(e){
}
if(this._sourceNodeRef){
try{
dojo.dom.destroyNode(this._sourceNodeRef);
}
catch(e){
}
}
},createNodesFromText:function(){
dojo.unimplemented("dojo.widget.DomWidget.createNodesFromText");
}});
dojo.provide("dojo.html.display");
dojo.html._toggle=function(node,_4f2,_4f3){
node=dojo.byId(node);
_4f3(node,!_4f2(node));
return _4f2(node);
};
dojo.html.show=function(node){
node=dojo.byId(node);
if(dojo.html.getStyleProperty(node,"display")=="none"){
dojo.html.setStyle(node,"display",(node.dojoDisplayCache||""));
node.dojoDisplayCache=undefined;
}
};
dojo.html.hide=function(node){
node=dojo.byId(node);
if(typeof node["dojoDisplayCache"]=="undefined"){
var d=dojo.html.getStyleProperty(node,"display");
if(d!="none"){
node.dojoDisplayCache=d;
}
}
dojo.html.setStyle(node,"display","none");
};
dojo.html.setShowing=function(node,_4f8){
dojo.html[(_4f8?"show":"hide")](node);
};
dojo.html.isShowing=function(node){
return (dojo.html.getStyleProperty(node,"display")!="none");
};
dojo.html.toggleShowing=function(node){
return dojo.html._toggle(node,dojo.html.isShowing,dojo.html.setShowing);
};
dojo.html.displayMap={tr:"",td:"",th:"",img:"inline",span:"inline",input:"inline",button:"inline"};
dojo.html.suggestDisplayByTagName=function(node){
node=dojo.byId(node);
if(node&&node.tagName){
var tag=node.tagName.toLowerCase();
return (tag in dojo.html.displayMap?dojo.html.displayMap[tag]:"block");
}
};
dojo.html.setDisplay=function(node,_4fe){
dojo.html.setStyle(node,"display",((_4fe instanceof String||typeof _4fe=="string")?_4fe:(_4fe?dojo.html.suggestDisplayByTagName(node):"none")));
};
dojo.html.isDisplayed=function(node){
return (dojo.html.getComputedStyle(node,"display")!="none");
};
dojo.html.toggleDisplay=function(node){
return dojo.html._toggle(node,dojo.html.isDisplayed,dojo.html.setDisplay);
};
dojo.html.setVisibility=function(node,_502){
dojo.html.setStyle(node,"visibility",((_502 instanceof String||typeof _502=="string")?_502:(_502?"visible":"hidden")));
};
dojo.html.isVisible=function(node){
return (dojo.html.getComputedStyle(node,"visibility")!="hidden");
};
dojo.html.toggleVisibility=function(node){
return dojo.html._toggle(node,dojo.html.isVisible,dojo.html.setVisibility);
};
dojo.html.setOpacity=function(node,_506,_507){
node=dojo.byId(node);
var h=dojo.render.html;
if(!_507){
if(_506>=1){
if(h.ie){
dojo.html.clearOpacity(node);
return;
}else{
_506=0.999999;
}
}else{
if(_506<0){
_506=0;
}
}
}
if(h.ie){
if(node.nodeName.toLowerCase()=="tr"){
var tds=node.getElementsByTagName("td");
for(var x=0;x<tds.length;x++){
tds[x].style.filter="Alpha(Opacity="+_506*100+")";
}
}
node.style.filter="Alpha(Opacity="+_506*100+")";
}else{
if(h.moz){
node.style.opacity=_506;
node.style.MozOpacity=_506;
}else{
if(h.safari){
node.style.opacity=_506;
node.style.KhtmlOpacity=_506;
}else{
node.style.opacity=_506;
}
}
}
};
dojo.html.clearOpacity=function(node){
node=dojo.byId(node);
var ns=node.style;
var h=dojo.render.html;
if(h.ie){
try{
if(node.filters&&node.filters.alpha){
ns.filter="";
}
}
catch(e){
}
}else{
if(h.moz){
ns.opacity=1;
ns.MozOpacity=1;
}else{
if(h.safari){
ns.opacity=1;
ns.KhtmlOpacity=1;
}else{
ns.opacity=1;
}
}
}
};
dojo.html.getOpacity=function(node){
node=dojo.byId(node);
var h=dojo.render.html;
if(h.ie){
var opac=(node.filters&&node.filters.alpha&&typeof node.filters.alpha.opacity=="number"?node.filters.alpha.opacity:100)/100;
}else{
var opac=node.style.opacity||node.style.MozOpacity||node.style.KhtmlOpacity||1;
}
return opac>=0.999999?1:Number(opac);
};
dojo.provide("dojo.html.layout");
dojo.html.sumAncestorProperties=function(node,prop){
node=dojo.byId(node);
if(!node){
return 0;
}
var _513=0;
while(node){
if(dojo.html.getComputedStyle(node,"position")=="fixed"){
return 0;
}
var val=node[prop];
if(val){
_513+=val-0;
if(node==dojo.body()){
break;
}
}
node=node.parentNode;
}
return _513;
};
dojo.html.setStyleAttributes=function(node,_516){
node=dojo.byId(node);
var _517=_516.replace(/(;)?\s*$/,"").split(";");
for(var i=0;i<_517.length;i++){
var _519=_517[i].split(":");
var name=_519[0].replace(/\s*$/,"").replace(/^\s*/,"").toLowerCase();
var _51b=_519[1].replace(/\s*$/,"").replace(/^\s*/,"");
switch(name){
case "opacity":
dojo.html.setOpacity(node,_51b);
break;
case "content-height":
dojo.html.setContentBox(node,{height:_51b});
break;
case "content-width":
dojo.html.setContentBox(node,{width:_51b});
break;
case "outer-height":
dojo.html.setMarginBox(node,{height:_51b});
break;
case "outer-width":
dojo.html.setMarginBox(node,{width:_51b});
break;
default:
node.style[dojo.html.toCamelCase(name)]=_51b;
}
}
};
dojo.html.boxSizing={MARGIN_BOX:"margin-box",BORDER_BOX:"border-box",PADDING_BOX:"padding-box",CONTENT_BOX:"content-box"};
dojo.html.getAbsolutePosition=dojo.html.abs=function(node,_51d,_51e){
node=dojo.byId(node,node.ownerDocument);
var ret={x:0,y:0};
var bs=dojo.html.boxSizing;
if(!_51e){
_51e=bs.CONTENT_BOX;
}
var _521=2;
var _522;
switch(_51e){
case bs.MARGIN_BOX:
_522=3;
break;
case bs.BORDER_BOX:
_522=2;
break;
case bs.PADDING_BOX:
default:
_522=1;
break;
case bs.CONTENT_BOX:
_522=0;
break;
}
var h=dojo.render.html;
var db=document["body"]||document["documentElement"];
if(h.ie){
with(node.getBoundingClientRect()){
ret.x=left-2;
ret.y=top-2;
}
}else{
if(document.getBoxObjectFor){
_521=1;
try{
var bo=document.getBoxObjectFor(node);
ret.x=bo.x-dojo.html.sumAncestorProperties(node,"scrollLeft");
ret.y=bo.y-dojo.html.sumAncestorProperties(node,"scrollTop");
}
catch(e){
}
}else{
if(node["offsetParent"]){
var _526;
if((h.safari)&&(node.style.getPropertyValue("position")=="absolute")&&(node.parentNode==db)){
_526=db;
}else{
_526=db.parentNode;
}
if(node.parentNode!=db){
var nd=node;
if(dojo.render.html.opera){
nd=db;
}
ret.x-=dojo.html.sumAncestorProperties(nd,"scrollLeft");
ret.y-=dojo.html.sumAncestorProperties(nd,"scrollTop");
}
var _528=node;
do{
var n=_528["offsetLeft"];
if(!h.opera||n>0){
ret.x+=isNaN(n)?0:n;
}
var m=_528["offsetTop"];
ret.y+=isNaN(m)?0:m;
_528=_528.offsetParent;
}while((_528!=_526)&&(_528!=null));
}else{
if(node["x"]&&node["y"]){
ret.x+=isNaN(node.x)?0:node.x;
ret.y+=isNaN(node.y)?0:node.y;
}
}
}
}
if(_51d){
var _52b=dojo.html.getScroll();
ret.y+=_52b.top;
ret.x+=_52b.left;
}
var _52c=[dojo.html.getPaddingExtent,dojo.html.getBorderExtent,dojo.html.getMarginExtent];
if(_521>_522){
for(var i=_522;i<_521;++i){
ret.y+=_52c[i](node,"top");
ret.x+=_52c[i](node,"left");
}
}else{
if(_521<_522){
for(var i=_522;i>_521;--i){
ret.y-=_52c[i-1](node,"top");
ret.x-=_52c[i-1](node,"left");
}
}
}
ret.top=ret.y;
ret.left=ret.x;
return ret;
};
dojo.html.isPositionAbsolute=function(node){
return (dojo.html.getComputedStyle(node,"position")=="absolute");
};
dojo.html._sumPixelValues=function(node,_530,_531){
var _532=0;
for(var x=0;x<_530.length;x++){
_532+=dojo.html.getPixelValue(node,_530[x],_531);
}
return _532;
};
dojo.html.getMargin=function(node){
return {width:dojo.html._sumPixelValues(node,["margin-left","margin-right"],(dojo.html.getComputedStyle(node,"position")=="absolute")),height:dojo.html._sumPixelValues(node,["margin-top","margin-bottom"],(dojo.html.getComputedStyle(node,"position")=="absolute"))};
};
dojo.html.getBorder=function(node){
return {width:dojo.html.getBorderExtent(node,"left")+dojo.html.getBorderExtent(node,"right"),height:dojo.html.getBorderExtent(node,"top")+dojo.html.getBorderExtent(node,"bottom")};
};
dojo.html.getBorderExtent=function(node,side){
return (dojo.html.getStyle(node,"border-"+side+"-style")=="none"?0:dojo.html.getPixelValue(node,"border-"+side+"-width"));
};
dojo.html.getMarginExtent=function(node,side){
return dojo.html._sumPixelValues(node,["margin-"+side],dojo.html.isPositionAbsolute(node));
};
dojo.html.getPaddingExtent=function(node,side){
return dojo.html._sumPixelValues(node,["padding-"+side],true);
};
dojo.html.getPadding=function(node){
return {width:dojo.html._sumPixelValues(node,["padding-left","padding-right"],true),height:dojo.html._sumPixelValues(node,["padding-top","padding-bottom"],true)};
};
dojo.html.getPadBorder=function(node){
var pad=dojo.html.getPadding(node);
var _53f=dojo.html.getBorder(node);
return {width:pad.width+_53f.width,height:pad.height+_53f.height};
};
dojo.html.getBoxSizing=function(node){
var h=dojo.render.html;
var bs=dojo.html.boxSizing;
if(((h.ie)||(h.opera))&&node.nodeName.toLowerCase()!="img"){
var cm=document["compatMode"];
if((cm=="BackCompat")||(cm=="QuirksMode")){
return bs.BORDER_BOX;
}else{
return bs.CONTENT_BOX;
}
}else{
if(arguments.length==0){
node=document.documentElement;
}
var _544;
if(!h.ie){
_544=dojo.html.getStyle(node,"-moz-box-sizing");
if(!_544){
_544=dojo.html.getStyle(node,"box-sizing");
}
}
return (_544?_544:bs.CONTENT_BOX);
}
};
dojo.html.isBorderBox=function(node){
return (dojo.html.getBoxSizing(node)==dojo.html.boxSizing.BORDER_BOX);
};
dojo.html.getBorderBox=function(node){
node=dojo.byId(node);
return {width:node.offsetWidth,height:node.offsetHeight};
};
dojo.html.getPaddingBox=function(node){
var box=dojo.html.getBorderBox(node);
var _549=dojo.html.getBorder(node);
return {width:box.width-_549.width,height:box.height-_549.height};
};
dojo.html.getContentBox=function(node){
node=dojo.byId(node);
var _54b=dojo.html.getPadBorder(node);
return {width:node.offsetWidth-_54b.width,height:node.offsetHeight-_54b.height};
};
dojo.html.setContentBox=function(node,args){
node=dojo.byId(node);
var _54e=0;
var _54f=0;
var isbb=dojo.html.isBorderBox(node);
var _551=(isbb?dojo.html.getPadBorder(node):{width:0,height:0});
var ret={};
if(typeof args.width!="undefined"){
_54e=args.width+_551.width;
ret.width=dojo.html.setPositivePixelValue(node,"width",_54e);
}
if(typeof args.height!="undefined"){
_54f=args.height+_551.height;
ret.height=dojo.html.setPositivePixelValue(node,"height",_54f);
}
return ret;
};
dojo.html.getMarginBox=function(node){
var _554=dojo.html.getBorderBox(node);
var _555=dojo.html.getMargin(node);
return {width:_554.width+_555.width,height:_554.height+_555.height};
};
dojo.html.setMarginBox=function(node,args){
node=dojo.byId(node);
var _558=0;
var _559=0;
var isbb=dojo.html.isBorderBox(node);
var _55b=(!isbb?dojo.html.getPadBorder(node):{width:0,height:0});
var _55c=dojo.html.getMargin(node);
var ret={};
if(typeof args.width!="undefined"){
_558=args.width-_55b.width;
_558-=_55c.width;
ret.width=dojo.html.setPositivePixelValue(node,"width",_558);
}
if(typeof args.height!="undefined"){
_559=args.height-_55b.height;
_559-=_55c.height;
ret.height=dojo.html.setPositivePixelValue(node,"height",_559);
}
return ret;
};
dojo.html.getElementBox=function(node,type){
var bs=dojo.html.boxSizing;
switch(type){
case bs.MARGIN_BOX:
return dojo.html.getMarginBox(node);
case bs.BORDER_BOX:
return dojo.html.getBorderBox(node);
case bs.PADDING_BOX:
return dojo.html.getPaddingBox(node);
case bs.CONTENT_BOX:
default:
return dojo.html.getContentBox(node);
}
};
dojo.html.toCoordinateObject=dojo.html.toCoordinateArray=function(_561,_562,_563){
if(_561 instanceof Array||typeof _561=="array"){
dojo.deprecated("dojo.html.toCoordinateArray","use dojo.html.toCoordinateObject({left: , top: , width: , height: }) instead","0.5");
while(_561.length<4){
_561.push(0);
}
while(_561.length>4){
_561.pop();
}
var ret={left:_561[0],top:_561[1],width:_561[2],height:_561[3]};
}else{
if(!_561.nodeType&&!(_561 instanceof String||typeof _561=="string")&&("width" in _561||"height" in _561||"left" in _561||"x" in _561||"top" in _561||"y" in _561)){
var ret={left:_561.left||_561.x||0,top:_561.top||_561.y||0,width:_561.width||0,height:_561.height||0};
}else{
var node=dojo.byId(_561);
var pos=dojo.html.abs(node,_562,_563);
var _567=dojo.html.getMarginBox(node);
var ret={left:pos.left,top:pos.top,width:_567.width,height:_567.height};
}
}
ret.x=ret.left;
ret.y=ret.top;
return ret;
};
dojo.html.setMarginBoxWidth=dojo.html.setOuterWidth=function(node,_569){
return dojo.html._callDeprecated("setMarginBoxWidth","setMarginBox",arguments,"width");
};
dojo.html.setMarginBoxHeight=dojo.html.setOuterHeight=function(){
return dojo.html._callDeprecated("setMarginBoxHeight","setMarginBox",arguments,"height");
};
dojo.html.getMarginBoxWidth=dojo.html.getOuterWidth=function(){
return dojo.html._callDeprecated("getMarginBoxWidth","getMarginBox",arguments,null,"width");
};
dojo.html.getMarginBoxHeight=dojo.html.getOuterHeight=function(){
return dojo.html._callDeprecated("getMarginBoxHeight","getMarginBox",arguments,null,"height");
};
dojo.html.getTotalOffset=function(node,type,_56c){
return dojo.html._callDeprecated("getTotalOffset","getAbsolutePosition",arguments,null,type);
};
dojo.html.getAbsoluteX=function(node,_56e){
return dojo.html._callDeprecated("getAbsoluteX","getAbsolutePosition",arguments,null,"x");
};
dojo.html.getAbsoluteY=function(node,_570){
return dojo.html._callDeprecated("getAbsoluteY","getAbsolutePosition",arguments,null,"y");
};
dojo.html.totalOffsetLeft=function(node,_572){
return dojo.html._callDeprecated("totalOffsetLeft","getAbsolutePosition",arguments,null,"left");
};
dojo.html.totalOffsetTop=function(node,_574){
return dojo.html._callDeprecated("totalOffsetTop","getAbsolutePosition",arguments,null,"top");
};
dojo.html.getMarginWidth=function(node){
return dojo.html._callDeprecated("getMarginWidth","getMargin",arguments,null,"width");
};
dojo.html.getMarginHeight=function(node){
return dojo.html._callDeprecated("getMarginHeight","getMargin",arguments,null,"height");
};
dojo.html.getBorderWidth=function(node){
return dojo.html._callDeprecated("getBorderWidth","getBorder",arguments,null,"width");
};
dojo.html.getBorderHeight=function(node){
return dojo.html._callDeprecated("getBorderHeight","getBorder",arguments,null,"height");
};
dojo.html.getPaddingWidth=function(node){
return dojo.html._callDeprecated("getPaddingWidth","getPadding",arguments,null,"width");
};
dojo.html.getPaddingHeight=function(node){
return dojo.html._callDeprecated("getPaddingHeight","getPadding",arguments,null,"height");
};
dojo.html.getPadBorderWidth=function(node){
return dojo.html._callDeprecated("getPadBorderWidth","getPadBorder",arguments,null,"width");
};
dojo.html.getPadBorderHeight=function(node){
return dojo.html._callDeprecated("getPadBorderHeight","getPadBorder",arguments,null,"height");
};
dojo.html.getBorderBoxWidth=dojo.html.getInnerWidth=function(){
return dojo.html._callDeprecated("getBorderBoxWidth","getBorderBox",arguments,null,"width");
};
dojo.html.getBorderBoxHeight=dojo.html.getInnerHeight=function(){
return dojo.html._callDeprecated("getBorderBoxHeight","getBorderBox",arguments,null,"height");
};
dojo.html.getContentBoxWidth=dojo.html.getContentWidth=function(){
return dojo.html._callDeprecated("getContentBoxWidth","getContentBox",arguments,null,"width");
};
dojo.html.getContentBoxHeight=dojo.html.getContentHeight=function(){
return dojo.html._callDeprecated("getContentBoxHeight","getContentBox",arguments,null,"height");
};
dojo.html.setContentBoxWidth=dojo.html.setContentWidth=function(node,_57e){
return dojo.html._callDeprecated("setContentBoxWidth","setContentBox",arguments,"width");
};
dojo.html.setContentBoxHeight=dojo.html.setContentHeight=function(node,_580){
return dojo.html._callDeprecated("setContentBoxHeight","setContentBox",arguments,"height");
};
dojo.provide("dojo.html.util");
dojo.html.getElementWindow=function(_581){
return dojo.html.getDocumentWindow(_581.ownerDocument);
};
dojo.html.getDocumentWindow=function(doc){
if(dojo.render.html.safari&&!doc._parentWindow){
var fix=function(win){
win.document._parentWindow=win;
for(var i=0;i<win.frames.length;i++){
fix(win.frames[i]);
}
};
fix(window.top);
}
if(dojo.render.html.ie&&window!==document.parentWindow&&!doc._parentWindow){
doc.parentWindow.execScript("document._parentWindow = window;","Javascript");
var win=doc._parentWindow;
doc._parentWindow=null;
return win;
}
return doc._parentWindow||doc.parentWindow||doc.defaultView;
};
dojo.html.gravity=function(node,e){
node=dojo.byId(node);
var _589=dojo.html.getCursorPosition(e);
with(dojo.html){
var _58a=getAbsolutePosition(node,true);
var bb=getBorderBox(node);
var _58c=_58a.x+(bb.width/2);
var _58d=_58a.y+(bb.height/2);
}
with(dojo.html.gravity){
return ((_589.x<_58c?WEST:EAST)|(_589.y<_58d?NORTH:SOUTH));
}
};
dojo.html.gravity.NORTH=1;
dojo.html.gravity.SOUTH=1<<1;
dojo.html.gravity.EAST=1<<2;
dojo.html.gravity.WEST=1<<3;
dojo.html.overElement=function(_58e,e){
_58e=dojo.byId(_58e);
var _590=dojo.html.getCursorPosition(e);
var bb=dojo.html.getBorderBox(_58e);
var _592=dojo.html.getAbsolutePosition(_58e,true,dojo.html.boxSizing.BORDER_BOX);
var top=_592.y;
var _594=top+bb.height;
var left=_592.x;
var _596=left+bb.width;
return (_590.x>=left&&_590.x<=_596&&_590.y>=top&&_590.y<=_594);
};
dojo.html.renderedTextContent=function(node){
node=dojo.byId(node);
var _598="";
if(node==null){
return _598;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
var _59a="unknown";
try{
_59a=dojo.html.getStyle(node.childNodes[i],"display");
}
catch(E){
}
switch(_59a){
case "block":
case "list-item":
case "run-in":
case "table":
case "table-row-group":
case "table-header-group":
case "table-footer-group":
case "table-row":
case "table-column-group":
case "table-column":
case "table-cell":
case "table-caption":
_598+="\n";
_598+=dojo.html.renderedTextContent(node.childNodes[i]);
_598+="\n";
break;
case "none":
break;
default:
if(node.childNodes[i].tagName&&node.childNodes[i].tagName.toLowerCase()=="br"){
_598+="\n";
}else{
_598+=dojo.html.renderedTextContent(node.childNodes[i]);
}
break;
}
break;
case 3:
case 2:
case 4:
var text=node.childNodes[i].nodeValue;
var _59c="unknown";
try{
_59c=dojo.html.getStyle(node,"text-transform");
}
catch(E){
}
switch(_59c){
case "capitalize":
var _59d=text.split(" ");
for(var i=0;i<_59d.length;i++){
_59d[i]=_59d[i].charAt(0).toUpperCase()+_59d[i].substring(1);
}
text=_59d.join(" ");
break;
case "uppercase":
text=text.toUpperCase();
break;
case "lowercase":
text=text.toLowerCase();
break;
default:
break;
}
switch(_59c){
case "nowrap":
break;
case "pre-wrap":
break;
case "pre-line":
break;
case "pre":
break;
default:
text=text.replace(/\s+/," ");
if(/\s$/.test(_598)){
text.replace(/^\s/,"");
}
break;
}
_598+=text;
break;
default:
break;
}
}
return _598;
};
dojo.html.createNodesFromText=function(txt,trim){
if(trim){
txt=txt.replace(/^\s+|\s+$/g,"");
}
var tn=dojo.doc().createElement("div");
tn.style.visibility="hidden";
dojo.body().appendChild(tn);
var _5a1="none";
if((/^<t[dh][\s\r\n>]/i).test(txt.replace(/^\s+/))){
txt="<table><tbody><tr>"+txt+"</tr></tbody></table>";
_5a1="cell";
}else{
if((/^<tr[\s\r\n>]/i).test(txt.replace(/^\s+/))){
txt="<table><tbody>"+txt+"</tbody></table>";
_5a1="row";
}else{
if((/^<(thead|tbody|tfoot)[\s\r\n>]/i).test(txt.replace(/^\s+/))){
txt="<table>"+txt+"</table>";
_5a1="section";
}
}
}
tn.innerHTML=txt;
if(tn["normalize"]){
tn.normalize();
}
var _5a2=null;
switch(_5a1){
case "cell":
_5a2=tn.getElementsByTagName("tr")[0];
break;
case "row":
_5a2=tn.getElementsByTagName("tbody")[0];
break;
case "section":
_5a2=tn.getElementsByTagName("table")[0];
break;
default:
_5a2=tn;
break;
}
var _5a3=[];
for(var x=0;x<_5a2.childNodes.length;x++){
_5a3.push(_5a2.childNodes[x].cloneNode(true));
}
tn.style.display="none";
dojo.html.destroyNode(tn);
return _5a3;
};
dojo.html.placeOnScreen=function(node,_5a6,_5a7,_5a8,_5a9,_5aa,_5ab){
if(_5a6 instanceof Array||typeof _5a6=="array"){
_5ab=_5aa;
_5aa=_5a9;
_5a9=_5a8;
_5a8=_5a7;
_5a7=_5a6[1];
_5a6=_5a6[0];
}
if(_5aa instanceof String||typeof _5aa=="string"){
_5aa=_5aa.split(",");
}
if(!isNaN(_5a8)){
_5a8=[Number(_5a8),Number(_5a8)];
}else{
if(!(_5a8 instanceof Array||typeof _5a8=="array")){
_5a8=[0,0];
}
}
var _5ac=dojo.html.getScroll().offset;
var view=dojo.html.getViewport();
node=dojo.byId(node);
var _5ae=node.style.display;
node.style.display="";
var bb=dojo.html.getBorderBox(node);
var w=bb.width;
var h=bb.height;
node.style.display=_5ae;
if(!(_5aa instanceof Array||typeof _5aa=="array")){
_5aa=["TL"];
}
var _5b2,_5b3,_5b4=Infinity,_5b5;
for(var _5b6=0;_5b6<_5aa.length;++_5b6){
var _5b7=_5aa[_5b6];
var _5b8=true;
var tryX=_5a6-(_5b7.charAt(1)=="L"?0:w)+_5a8[0]*(_5b7.charAt(1)=="L"?1:-1);
var tryY=_5a7-(_5b7.charAt(0)=="T"?0:h)+_5a8[1]*(_5b7.charAt(0)=="T"?1:-1);
if(_5a9){
tryX-=_5ac.x;
tryY-=_5ac.y;
}
if(tryX<0){
tryX=0;
_5b8=false;
}
if(tryY<0){
tryY=0;
_5b8=false;
}
var x=tryX+w;
if(x>view.width){
x=view.width-w;
_5b8=false;
}else{
x=tryX;
}
x=Math.max(_5a8[0],x)+_5ac.x;
var y=tryY+h;
if(y>view.height){
y=view.height-h;
_5b8=false;
}else{
y=tryY;
}
y=Math.max(_5a8[1],y)+_5ac.y;
if(_5b8){
_5b2=x;
_5b3=y;
_5b4=0;
_5b5=_5b7;
break;
}else{
var dist=Math.pow(x-tryX-_5ac.x,2)+Math.pow(y-tryY-_5ac.y,2);
if(_5b4>dist){
_5b4=dist;
_5b2=x;
_5b3=y;
_5b5=_5b7;
}
}
}
if(!_5ab){
node.style.left=_5b2+"px";
node.style.top=_5b3+"px";
}
return {left:_5b2,top:_5b3,x:_5b2,y:_5b3,dist:_5b4,corner:_5b5};
};
dojo.html.placeOnScreenPoint=function(node,_5bf,_5c0,_5c1,_5c2){
dojo.deprecated("dojo.html.placeOnScreenPoint","use dojo.html.placeOnScreen() instead","0.5");
return dojo.html.placeOnScreen(node,_5bf,_5c0,_5c1,_5c2,["TL","TR","BL","BR"]);
};
dojo.html.placeOnScreenAroundElement=function(node,_5c4,_5c5,_5c6,_5c7,_5c8){
var best,_5ca=Infinity;
_5c4=dojo.byId(_5c4);
var _5cb=_5c4.style.display;
_5c4.style.display="";
var mb=dojo.html.getElementBox(_5c4,_5c6);
var _5cd=mb.width;
var _5ce=mb.height;
var _5cf=dojo.html.getAbsolutePosition(_5c4,true,_5c6);
_5c4.style.display=_5cb;
for(var _5d0 in _5c7){
var pos,_5d2,_5d3;
var _5d4=_5c7[_5d0];
_5d2=_5cf.x+(_5d0.charAt(1)=="L"?0:_5cd);
_5d3=_5cf.y+(_5d0.charAt(0)=="T"?0:_5ce);
pos=dojo.html.placeOnScreen(node,_5d2,_5d3,_5c5,true,_5d4,true);
if(pos.dist==0){
best=pos;
break;
}else{
if(_5ca>pos.dist){
_5ca=pos.dist;
best=pos;
}
}
}
if(!_5c8){
node.style.left=best.left+"px";
node.style.top=best.top+"px";
}
return best;
};
dojo.html.scrollIntoView=function(node){
if(!node){
return;
}
if(dojo.render.html.ie){
if(dojo.html.getBorderBox(node.parentNode).height<=node.parentNode.scrollHeight){
node.scrollIntoView(false);
}
}else{
if(dojo.render.html.mozilla){
node.scrollIntoView(false);
}else{
var _5d6=node.parentNode;
var _5d7=_5d6.scrollTop+dojo.html.getBorderBox(_5d6).height;
var _5d8=node.offsetTop+dojo.html.getMarginBox(node).height;
if(_5d7<_5d8){
_5d6.scrollTop+=(_5d8-_5d7);
}else{
if(_5d6.scrollTop>node.offsetTop){
_5d6.scrollTop-=(_5d6.scrollTop-node.offsetTop);
}
}
}
}
};
dojo.provide("dojo.gfx.color");
dojo.gfx.color.Color=function(r,g,b,a){
if(dojo.lang.isArray(r)){
this.r=r[0];
this.g=r[1];
this.b=r[2];
this.a=r[3]||1;
}else{
if(dojo.lang.isString(r)){
var rgb=dojo.gfx.color.extractRGB(r);
this.r=rgb[0];
this.g=rgb[1];
this.b=rgb[2];
this.a=g||1;
}else{
if(r instanceof dojo.gfx.color.Color){
this.r=r.r;
this.b=r.b;
this.g=r.g;
this.a=r.a;
}else{
this.r=r;
this.g=g;
this.b=b;
this.a=a;
}
}
}
};
dojo.gfx.color.Color.fromArray=function(arr){
return new dojo.gfx.color.Color(arr[0],arr[1],arr[2],arr[3]);
};
dojo.extend(dojo.gfx.color.Color,{toRgb:function(_5df){
if(_5df){
return this.toRgba();
}else{
return [this.r,this.g,this.b];
}
},toRgba:function(){
return [this.r,this.g,this.b,this.a];
},toHex:function(){
return dojo.gfx.color.rgb2hex(this.toRgb());
},toCss:function(){
return "rgb("+this.toRgb().join()+")";
},toString:function(){
return this.toHex();
},blend:function(_5e0,_5e1){
var rgb=null;
if(dojo.lang.isArray(_5e0)){
rgb=_5e0;
}else{
if(_5e0 instanceof dojo.gfx.color.Color){
rgb=_5e0.toRgb();
}else{
rgb=new dojo.gfx.color.Color(_5e0).toRgb();
}
}
return dojo.gfx.color.blend(this.toRgb(),rgb,_5e1);
}});
dojo.gfx.color.named={white:[255,255,255],black:[0,0,0],red:[255,0,0],green:[0,255,0],lime:[0,255,0],blue:[0,0,255],navy:[0,0,128],gray:[128,128,128],silver:[192,192,192]};
dojo.gfx.color.blend=function(a,b,_5e5){
if(typeof a=="string"){
return dojo.gfx.color.blendHex(a,b,_5e5);
}
if(!_5e5){
_5e5=0;
}
_5e5=Math.min(Math.max(-1,_5e5),1);
_5e5=((_5e5+1)/2);
var c=[];
for(var x=0;x<3;x++){
c[x]=parseInt(b[x]+((a[x]-b[x])*_5e5));
}
return c;
};
dojo.gfx.color.blendHex=function(a,b,_5ea){
return dojo.gfx.color.rgb2hex(dojo.gfx.color.blend(dojo.gfx.color.hex2rgb(a),dojo.gfx.color.hex2rgb(b),_5ea));
};
dojo.gfx.color.extractRGB=function(_5eb){
var hex="0123456789abcdef";
_5eb=_5eb.toLowerCase();
if(_5eb.indexOf("rgb")==0){
var _5ed=_5eb.match(/rgba*\((\d+), *(\d+), *(\d+)/i);
var ret=_5ed.splice(1,3);
return ret;
}else{
var _5ef=dojo.gfx.color.hex2rgb(_5eb);
if(_5ef){
return _5ef;
}else{
return dojo.gfx.color.named[_5eb]||[255,255,255];
}
}
};
dojo.gfx.color.hex2rgb=function(hex){
var _5f1="0123456789ABCDEF";
var rgb=new Array(3);
if(hex.indexOf("#")==0){
hex=hex.substring(1);
}
hex=hex.toUpperCase();
if(hex.replace(new RegExp("["+_5f1+"]","g"),"")!=""){
return null;
}
if(hex.length==3){
rgb[0]=hex.charAt(0)+hex.charAt(0);
rgb[1]=hex.charAt(1)+hex.charAt(1);
rgb[2]=hex.charAt(2)+hex.charAt(2);
}else{
rgb[0]=hex.substring(0,2);
rgb[1]=hex.substring(2,4);
rgb[2]=hex.substring(4);
}
for(var i=0;i<rgb.length;i++){
rgb[i]=_5f1.indexOf(rgb[i].charAt(0))*16+_5f1.indexOf(rgb[i].charAt(1));
}
return rgb;
};
dojo.gfx.color.rgb2hex=function(r,g,b){
if(dojo.lang.isArray(r)){
g=r[1]||0;
b=r[2]||0;
r=r[0]||0;
}
var ret=dojo.lang.map([r,g,b],function(x){
x=new Number(x);
var s=x.toString(16);
while(s.length<2){
s="0"+s;
}
return s;
});
ret.unshift("#");
return ret.join("");
};
dojo.provide("dojo.lfx.Animation");
dojo.lfx.Line=function(_5fa,end){
this.start=_5fa;
this.end=end;
if(dojo.lang.isArray(_5fa)){
var diff=[];
dojo.lang.forEach(this.start,function(s,i){
diff[i]=this.end[i]-s;
},this);
this.getValue=function(n){
var res=[];
dojo.lang.forEach(this.start,function(s,i){
res[i]=(diff[i]*n)+s;
},this);
return res;
};
}else{
var diff=end-_5fa;
this.getValue=function(n){
return (diff*n)+this.start;
};
}
};
if((dojo.render.html.khtml)&&(!dojo.render.html.safari)){
dojo.lfx.easeDefault=function(n){
return (parseFloat("0.5")+((Math.sin((n+parseFloat("1.5"))*Math.PI))/2));
};
}else{
dojo.lfx.easeDefault=function(n){
return (0.5+((Math.sin((n+1.5)*Math.PI))/2));
};
}
dojo.lfx.easeIn=function(n){
return Math.pow(n,3);
};
dojo.lfx.easeOut=function(n){
return (1-Math.pow(1-n,3));
};
dojo.lfx.easeInOut=function(n){
return ((3*Math.pow(n,2))-(2*Math.pow(n,3)));
};
dojo.lfx.IAnimation=function(){
};
dojo.lang.extend(dojo.lfx.IAnimation,{curve:null,duration:1000,easing:null,repeatCount:0,rate:10,handler:null,beforeBegin:null,onBegin:null,onAnimate:null,onEnd:null,onPlay:null,onPause:null,onStop:null,play:null,pause:null,stop:null,connect:function(evt,_60a,_60b){
if(!_60b){
_60b=_60a;
_60a=this;
}
_60b=dojo.lang.hitch(_60a,_60b);
var _60c=this[evt]||function(){
};
this[evt]=function(){
var ret=_60c.apply(this,arguments);
_60b.apply(this,arguments);
return ret;
};
return this;
},fire:function(evt,args){
if(this[evt]){
this[evt].apply(this,(args||[]));
}
return this;
},repeat:function(_610){
this.repeatCount=_610;
return this;
},_active:false,_paused:false});
dojo.lfx.Animation=function(_611,_612,_613,_614,_615,rate){
dojo.lfx.IAnimation.call(this);
if(dojo.lang.isNumber(_611)||(!_611&&_612.getValue)){
rate=_615;
_615=_614;
_614=_613;
_613=_612;
_612=_611;
_611=null;
}else{
if(_611.getValue||dojo.lang.isArray(_611)){
rate=_614;
_615=_613;
_614=_612;
_613=_611;
_612=null;
_611=null;
}
}
if(dojo.lang.isArray(_613)){
this.curve=new dojo.lfx.Line(_613[0],_613[1]);
}else{
this.curve=_613;
}
if(_612!=null&&_612>0){
this.duration=_612;
}
if(_615){
this.repeatCount=_615;
}
if(rate){
this.rate=rate;
}
if(_611){
dojo.lang.forEach(["handler","beforeBegin","onBegin","onEnd","onPlay","onStop","onAnimate"],function(item){
if(_611[item]){
this.connect(item,_611[item]);
}
},this);
}
if(_614&&dojo.lang.isFunction(_614)){
this.easing=_614;
}
};
dojo.inherits(dojo.lfx.Animation,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Animation,{_startTime:null,_endTime:null,_timer:null,_percent:0,_startRepeatCount:0,play:function(_618,_619){
if(_619){
clearTimeout(this._timer);
this._active=false;
this._paused=false;
this._percent=0;
}else{
if(this._active&&!this._paused){
return this;
}
}
this.fire("handler",["beforeBegin"]);
this.fire("beforeBegin");
if(_618>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_619);
}),_618);
return this;
}
this._startTime=new Date().valueOf();
if(this._paused){
this._startTime-=(this.duration*this._percent/100);
}
this._endTime=this._startTime+this.duration;
this._active=true;
this._paused=false;
var step=this._percent/100;
var _61b=this.curve.getValue(step);
if(this._percent==0){
if(!this._startRepeatCount){
this._startRepeatCount=this.repeatCount;
}
this.fire("handler",["begin",_61b]);
this.fire("onBegin",[_61b]);
}
this.fire("handler",["play",_61b]);
this.fire("onPlay",[_61b]);
this._cycle();
return this;
},pause:function(){
clearTimeout(this._timer);
if(!this._active){
return this;
}
this._paused=true;
var _61c=this.curve.getValue(this._percent/100);
this.fire("handler",["pause",_61c]);
this.fire("onPause",[_61c]);
return this;
},gotoPercent:function(pct,_61e){
clearTimeout(this._timer);
this._active=true;
this._paused=true;
this._percent=pct;
if(_61e){
this.play();
}
return this;
},stop:function(_61f){
clearTimeout(this._timer);
var step=this._percent/100;
if(_61f){
step=1;
}
var _621=this.curve.getValue(step);
this.fire("handler",["stop",_621]);
this.fire("onStop",[_621]);
this._active=false;
this._paused=false;
return this;
},status:function(){
if(this._active){
return this._paused?"paused":"playing";
}else{
return "stopped";
}
return this;
},_cycle:function(){
clearTimeout(this._timer);
if(this._active){
var curr=new Date().valueOf();
var step=(curr-this._startTime)/(this._endTime-this._startTime);
if(step>=1){
step=1;
this._percent=100;
}else{
this._percent=step*100;
}
if((this.easing)&&(dojo.lang.isFunction(this.easing))){
step=this.easing(step);
}
var _624=this.curve.getValue(step);
this.fire("handler",["animate",_624]);
this.fire("onAnimate",[_624]);
if(step<1){
this._timer=setTimeout(dojo.lang.hitch(this,"_cycle"),this.rate);
}else{
this._active=false;
this.fire("handler",["end"]);
this.fire("onEnd");
if(this.repeatCount>0){
this.repeatCount--;
this.play(null,true);
}else{
if(this.repeatCount==-1){
this.play(null,true);
}else{
if(this._startRepeatCount){
this.repeatCount=this._startRepeatCount;
this._startRepeatCount=0;
}
}
}
}
}
return this;
}});
dojo.lfx.Combine=function(_625){
dojo.lfx.IAnimation.call(this);
this._anims=[];
this._animsEnded=0;
var _626=arguments;
if(_626.length==1&&(dojo.lang.isArray(_626[0])||dojo.lang.isArrayLike(_626[0]))){
_626=_626[0];
}
dojo.lang.forEach(_626,function(anim){
this._anims.push(anim);
anim.connect("onEnd",dojo.lang.hitch(this,"_onAnimsEnded"));
},this);
};
dojo.inherits(dojo.lfx.Combine,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Combine,{_animsEnded:0,play:function(_628,_629){
if(!this._anims.length){
return this;
}
this.fire("beforeBegin");
if(_628>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_629);
}),_628);
return this;
}
if(_629||this._anims[0].percent==0){
this.fire("onBegin");
}
this.fire("onPlay");
this._animsCall("play",null,_629);
return this;
},pause:function(){
this.fire("onPause");
this._animsCall("pause");
return this;
},stop:function(_62a){
this.fire("onStop");
this._animsCall("stop",_62a);
return this;
},_onAnimsEnded:function(){
this._animsEnded++;
if(this._animsEnded>=this._anims.length){
this.fire("onEnd");
}
return this;
},_animsCall:function(_62b){
var args=[];
if(arguments.length>1){
for(var i=1;i<arguments.length;i++){
args.push(arguments[i]);
}
}
var _62e=this;
dojo.lang.forEach(this._anims,function(anim){
anim[_62b](args);
},_62e);
return this;
}});
dojo.lfx.Chain=function(_630){
dojo.lfx.IAnimation.call(this);
this._anims=[];
this._currAnim=-1;
var _631=arguments;
if(_631.length==1&&(dojo.lang.isArray(_631[0])||dojo.lang.isArrayLike(_631[0]))){
_631=_631[0];
}
var _632=this;
dojo.lang.forEach(_631,function(anim,i,_635){
this._anims.push(anim);
if(i<_635.length-1){
anim.connect("onEnd",dojo.lang.hitch(this,"_playNext"));
}else{
anim.connect("onEnd",dojo.lang.hitch(this,function(){
this.fire("onEnd");
}));
}
},this);
};
dojo.inherits(dojo.lfx.Chain,dojo.lfx.IAnimation);
dojo.lang.extend(dojo.lfx.Chain,{_currAnim:-1,play:function(_636,_637){
if(!this._anims.length){
return this;
}
if(_637||!this._anims[this._currAnim]){
this._currAnim=0;
}
var _638=this._anims[this._currAnim];
this.fire("beforeBegin");
if(_636>0){
setTimeout(dojo.lang.hitch(this,function(){
this.play(null,_637);
}),_636);
return this;
}
if(_638){
if(this._currAnim==0){
this.fire("handler",["begin",this._currAnim]);
this.fire("onBegin",[this._currAnim]);
}
this.fire("onPlay",[this._currAnim]);
_638.play(null,_637);
}
return this;
},pause:function(){
if(this._anims[this._currAnim]){
this._anims[this._currAnim].pause();
this.fire("onPause",[this._currAnim]);
}
return this;
},playPause:function(){
if(this._anims.length==0){
return this;
}
if(this._currAnim==-1){
this._currAnim=0;
}
var _639=this._anims[this._currAnim];
if(_639){
if(!_639._active||_639._paused){
this.play();
}else{
this.pause();
}
}
return this;
},stop:function(){
var _63a=this._anims[this._currAnim];
if(_63a){
_63a.stop();
this.fire("onStop",[this._currAnim]);
}
return _63a;
},_playNext:function(){
if(this._currAnim==-1||this._anims.length==0){
return this;
}
this._currAnim++;
if(this._anims[this._currAnim]){
this._anims[this._currAnim].play(null,true);
}
return this;
}});
dojo.lfx.combine=function(_63b){
var _63c=arguments;
if(dojo.lang.isArray(arguments[0])){
_63c=arguments[0];
}
if(_63c.length==1){
return _63c[0];
}
return new dojo.lfx.Combine(_63c);
};
dojo.lfx.chain=function(_63d){
var _63e=arguments;
if(dojo.lang.isArray(arguments[0])){
_63e=arguments[0];
}
if(_63e.length==1){
return _63e[0];
}
return new dojo.lfx.Chain(_63e);
};
dojo.provide("dojo.html.color");
dojo.html.getBackgroundColor=function(node){
node=dojo.byId(node);
var _640;
do{
_640=dojo.html.getStyle(node,"background-color");
if(_640.toLowerCase()=="rgba(0, 0, 0, 0)"){
_640="transparent";
}
if(node==document.getElementsByTagName("body")[0]){
node=null;
break;
}
node=node.parentNode;
}while(node&&dojo.lang.inArray(["transparent",""],_640));
if(_640=="transparent"){
_640=[255,255,255,0];
}else{
_640=dojo.gfx.color.extractRGB(_640);
}
return _640;
};
dojo.provide("dojo.lfx.html");
dojo.lfx.html._byId=function(_641){
if(!_641){
return [];
}
if(dojo.lang.isArrayLike(_641)){
if(!_641.alreadyChecked){
var n=[];
dojo.lang.forEach(_641,function(node){
n.push(dojo.byId(node));
});
n.alreadyChecked=true;
return n;
}else{
return _641;
}
}else{
var n=[];
n.push(dojo.byId(_641));
n.alreadyChecked=true;
return n;
}
};
dojo.lfx.html.propertyAnimation=function(_644,_645,_646,_647,_648){
_644=dojo.lfx.html._byId(_644);
var _649={"propertyMap":_645,"nodes":_644,"duration":_646,"easing":_647||dojo.lfx.easeDefault};
var _64a=function(args){
if(args.nodes.length==1){
var pm=args.propertyMap;
if(!dojo.lang.isArray(args.propertyMap)){
var parr=[];
for(var _64e in pm){
pm[_64e].property=_64e;
parr.push(pm[_64e]);
}
pm=args.propertyMap=parr;
}
dojo.lang.forEach(pm,function(prop){
if(dj_undef("start",prop)){
if(prop.property!="opacity"){
prop.start=parseInt(dojo.html.getComputedStyle(args.nodes[0],prop.property));
}else{
prop.start=dojo.html.getOpacity(args.nodes[0]);
}
}
});
}
};
var _650=function(_651){
var _652=[];
dojo.lang.forEach(_651,function(c){
_652.push(Math.round(c));
});
return _652;
};
var _654=function(n,_656){
n=dojo.byId(n);
if(!n||!n.style){
return;
}
for(var s in _656){
try{
if(s=="opacity"){
dojo.html.setOpacity(n,_656[s]);
}else{
n.style[s]=_656[s];
}
}
catch(e){
dojo.debug(e);
}
}
};
var _658=function(_659){
this._properties=_659;
this.diffs=new Array(_659.length);
dojo.lang.forEach(_659,function(prop,i){
if(dojo.lang.isFunction(prop.start)){
prop.start=prop.start(prop,i);
}
if(dojo.lang.isFunction(prop.end)){
prop.end=prop.end(prop,i);
}
if(dojo.lang.isArray(prop.start)){
this.diffs[i]=null;
}else{
if(prop.start instanceof dojo.gfx.color.Color){
prop.startRgb=prop.start.toRgb();
prop.endRgb=prop.end.toRgb();
}else{
this.diffs[i]=prop.end-prop.start;
}
}
},this);
this.getValue=function(n){
var ret={};
dojo.lang.forEach(this._properties,function(prop,i){
var _660=null;
if(dojo.lang.isArray(prop.start)){
}else{
if(prop.start instanceof dojo.gfx.color.Color){
_660=(prop.units||"rgb")+"(";
for(var j=0;j<prop.startRgb.length;j++){
_660+=Math.round(((prop.endRgb[j]-prop.startRgb[j])*n)+prop.startRgb[j])+(j<prop.startRgb.length-1?",":"");
}
_660+=")";
}else{
_660=((this.diffs[i])*n)+prop.start+(prop.property!="opacity"?prop.units||"px":"");
}
}
ret[dojo.html.toCamelCase(prop.property)]=_660;
},this);
return ret;
};
};
var anim=new dojo.lfx.Animation({beforeBegin:function(){
_64a(_649);
anim.curve=new _658(_649.propertyMap);
},onAnimate:function(_663){
dojo.lang.forEach(_649.nodes,function(node){
_654(node,_663);
});
}},_649.duration,null,_649.easing);
if(_648){
for(var x in _648){
if(dojo.lang.isFunction(_648[x])){
anim.connect(x,anim,_648[x]);
}
}
}
return anim;
};
dojo.lfx.html._makeFadeable=function(_666){
var _667=function(node){
if(dojo.render.html.ie){
if((node.style.zoom.length==0)&&(dojo.html.getStyle(node,"zoom")=="normal")){
node.style.zoom="1";
}
if((node.style.width.length==0)&&(dojo.html.getStyle(node,"width")=="auto")){
node.style.width="auto";
}
}
};
if(dojo.lang.isArrayLike(_666)){
dojo.lang.forEach(_666,_667);
}else{
_667(_666);
}
};
dojo.lfx.html.fade=function(_669,_66a,_66b,_66c,_66d){
_669=dojo.lfx.html._byId(_669);
var _66e={property:"opacity"};
if(!dj_undef("start",_66a)){
_66e.start=_66a.start;
}else{
_66e.start=function(){
return dojo.html.getOpacity(_669[0]);
};
}
if(!dj_undef("end",_66a)){
_66e.end=_66a.end;
}else{
dojo.raise("dojo.lfx.html.fade needs an end value");
}
var anim=dojo.lfx.propertyAnimation(_669,[_66e],_66b,_66c);
anim.connect("beforeBegin",function(){
dojo.lfx.html._makeFadeable(_669);
});
if(_66d){
anim.connect("onEnd",function(){
_66d(_669,anim);
});
}
return anim;
};
dojo.lfx.html.fadeIn=function(_670,_671,_672,_673){
return dojo.lfx.html.fade(_670,{end:1},_671,_672,_673);
};
dojo.lfx.html.fadeOut=function(_674,_675,_676,_677){
return dojo.lfx.html.fade(_674,{end:0},_675,_676,_677);
};
dojo.lfx.html.fadeShow=function(_678,_679,_67a,_67b){
_678=dojo.lfx.html._byId(_678);
dojo.lang.forEach(_678,function(node){
dojo.html.setOpacity(node,0);
});
var anim=dojo.lfx.html.fadeIn(_678,_679,_67a,_67b);
anim.connect("beforeBegin",function(){
if(dojo.lang.isArrayLike(_678)){
dojo.lang.forEach(_678,dojo.html.show);
}else{
dojo.html.show(_678);
}
});
return anim;
};
dojo.lfx.html.fadeHide=function(_67e,_67f,_680,_681){
var anim=dojo.lfx.html.fadeOut(_67e,_67f,_680,function(){
if(dojo.lang.isArrayLike(_67e)){
dojo.lang.forEach(_67e,dojo.html.hide);
}else{
dojo.html.hide(_67e);
}
if(_681){
_681(_67e,anim);
}
});
return anim;
};
dojo.lfx.html.wipeIn=function(_683,_684,_685,_686){
_683=dojo.lfx.html._byId(_683);
var _687=[];
dojo.lang.forEach(_683,function(node){
var _689={};
var _68a,_68b,_68c;
with(node.style){
_68a=top;
_68b=left;
_68c=position;
top="-9999px";
left="-9999px";
position="absolute";
display="";
}
var _68d=dojo.html.getBorderBox(node).height;
with(node.style){
top=_68a;
left=_68b;
position=_68c;
display="none";
}
var anim=dojo.lfx.propertyAnimation(node,{"height":{start:1,end:function(){
return _68d;
}}},_684,_685);
anim.connect("beforeBegin",function(){
_689.overflow=node.style.overflow;
_689.height=node.style.height;
with(node.style){
overflow="hidden";
height="1px";
}
dojo.html.show(node);
});
anim.connect("onEnd",function(){
with(node.style){
overflow=_689.overflow;
height=_689.height;
}
if(_686){
_686(node,anim);
}
});
_687.push(anim);
});
return dojo.lfx.combine(_687);
};
dojo.lfx.html.wipeOut=function(_68f,_690,_691,_692){
_68f=dojo.lfx.html._byId(_68f);
var _693=[];
dojo.lang.forEach(_68f,function(node){
var _695={};
var anim=dojo.lfx.propertyAnimation(node,{"height":{start:function(){
return dojo.html.getContentBox(node).height;
},end:1}},_690,_691,{"beforeBegin":function(){
_695.overflow=node.style.overflow;
_695.height=node.style.height;
with(node.style){
overflow="hidden";
}
dojo.html.show(node);
},"onEnd":function(){
dojo.html.hide(node);
with(node.style){
overflow=_695.overflow;
height=_695.height;
}
if(_692){
_692(node,anim);
}
}});
_693.push(anim);
});
return dojo.lfx.combine(_693);
};
dojo.lfx.html.slideTo=function(_697,_698,_699,_69a,_69b){
_697=dojo.lfx.html._byId(_697);
var _69c=[];
var _69d=dojo.html.getComputedStyle;
if(dojo.lang.isArray(_698)){
dojo.deprecated("dojo.lfx.html.slideTo(node, array)","use dojo.lfx.html.slideTo(node, {top: value, left: value});","0.5");
_698={top:_698[0],left:_698[1]};
}
dojo.lang.forEach(_697,function(node){
var top=null;
var left=null;
var init=(function(){
var _6a2=node;
return function(){
var pos=_69d(_6a2,"position");
top=(pos=="absolute"?node.offsetTop:parseInt(_69d(node,"top"))||0);
left=(pos=="absolute"?node.offsetLeft:parseInt(_69d(node,"left"))||0);
if(!dojo.lang.inArray(["absolute","relative"],pos)){
var ret=dojo.html.abs(_6a2,true);
dojo.html.setStyleAttributes(_6a2,"position:absolute;top:"+ret.y+"px;left:"+ret.x+"px;");
top=ret.y;
left=ret.x;
}
};
})();
init();
var anim=dojo.lfx.propertyAnimation(node,{"top":{start:top,end:(_698.top||0)},"left":{start:left,end:(_698.left||0)}},_699,_69a,{"beforeBegin":init});
if(_69b){
anim.connect("onEnd",function(){
_69b(_697,anim);
});
}
_69c.push(anim);
});
return dojo.lfx.combine(_69c);
};
dojo.lfx.html.slideBy=function(_6a6,_6a7,_6a8,_6a9,_6aa){
_6a6=dojo.lfx.html._byId(_6a6);
var _6ab=[];
var _6ac=dojo.html.getComputedStyle;
if(dojo.lang.isArray(_6a7)){
dojo.deprecated("dojo.lfx.html.slideBy(node, array)","use dojo.lfx.html.slideBy(node, {top: value, left: value});","0.5");
_6a7={top:_6a7[0],left:_6a7[1]};
}
dojo.lang.forEach(_6a6,function(node){
var top=null;
var left=null;
var init=(function(){
var _6b1=node;
return function(){
var pos=_6ac(_6b1,"position");
top=(pos=="absolute"?node.offsetTop:parseInt(_6ac(node,"top"))||0);
left=(pos=="absolute"?node.offsetLeft:parseInt(_6ac(node,"left"))||0);
if(!dojo.lang.inArray(["absolute","relative"],pos)){
var ret=dojo.html.abs(_6b1,true);
dojo.html.setStyleAttributes(_6b1,"position:absolute;top:"+ret.y+"px;left:"+ret.x+"px;");
top=ret.y;
left=ret.x;
}
};
})();
init();
var anim=dojo.lfx.propertyAnimation(node,{"top":{start:top,end:top+(_6a7.top||0)},"left":{start:left,end:left+(_6a7.left||0)}},_6a8,_6a9).connect("beforeBegin",init);
if(_6aa){
anim.connect("onEnd",function(){
_6aa(_6a6,anim);
});
}
_6ab.push(anim);
});
return dojo.lfx.combine(_6ab);
};
dojo.lfx.html.explode=function(_6b5,_6b6,_6b7,_6b8,_6b9){
var h=dojo.html;
_6b5=dojo.byId(_6b5);
_6b6=dojo.byId(_6b6);
var _6bb=h.toCoordinateObject(_6b5,true);
var _6bc=document.createElement("div");
h.copyStyle(_6bc,_6b6);
if(_6b6.explodeClassName){
_6bc.className=_6b6.explodeClassName;
}
with(_6bc.style){
position="absolute";
display="none";
var _6bd=h.getStyle(_6b5,"background-color");
backgroundColor=_6bd?_6bd.toLowerCase():"transparent";
backgroundColor=(backgroundColor=="transparent")?"rgb(221, 221, 221)":backgroundColor;
}
dojo.body().appendChild(_6bc);
with(_6b6.style){
visibility="hidden";
display="block";
}
var _6be=h.toCoordinateObject(_6b6,true);
with(_6b6.style){
display="none";
visibility="visible";
}
var _6bf={opacity:{start:0.5,end:1}};
dojo.lang.forEach(["height","width","top","left"],function(type){
_6bf[type]={start:_6bb[type],end:_6be[type]};
});
var anim=new dojo.lfx.propertyAnimation(_6bc,_6bf,_6b7,_6b8,{"beforeBegin":function(){
h.setDisplay(_6bc,"block");
},"onEnd":function(){
h.setDisplay(_6b6,"block");
_6bc.parentNode.removeChild(_6bc);
}});
if(_6b9){
anim.connect("onEnd",function(){
_6b9(_6b6,anim);
});
}
return anim;
};
dojo.lfx.html.implode=function(_6c2,end,_6c4,_6c5,_6c6){
var h=dojo.html;
_6c2=dojo.byId(_6c2);
end=dojo.byId(end);
var _6c8=dojo.html.toCoordinateObject(_6c2,true);
var _6c9=dojo.html.toCoordinateObject(end,true);
var _6ca=document.createElement("div");
dojo.html.copyStyle(_6ca,_6c2);
if(_6c2.explodeClassName){
_6ca.className=_6c2.explodeClassName;
}
dojo.html.setOpacity(_6ca,0.3);
with(_6ca.style){
position="absolute";
display="none";
backgroundColor=h.getStyle(_6c2,"background-color").toLowerCase();
}
dojo.body().appendChild(_6ca);
var _6cb={opacity:{start:1,end:0.5}};
dojo.lang.forEach(["height","width","top","left"],function(type){
_6cb[type]={start:_6c8[type],end:_6c9[type]};
});
var anim=new dojo.lfx.propertyAnimation(_6ca,_6cb,_6c4,_6c5,{"beforeBegin":function(){
dojo.html.hide(_6c2);
dojo.html.show(_6ca);
},"onEnd":function(){
_6ca.parentNode.removeChild(_6ca);
}});
if(_6c6){
anim.connect("onEnd",function(){
_6c6(_6c2,anim);
});
}
return anim;
};
dojo.lfx.html.highlight=function(_6ce,_6cf,_6d0,_6d1,_6d2){
_6ce=dojo.lfx.html._byId(_6ce);
var _6d3=[];
dojo.lang.forEach(_6ce,function(node){
var _6d5=dojo.html.getBackgroundColor(node);
var bg=dojo.html.getStyle(node,"background-color").toLowerCase();
var _6d7=dojo.html.getStyle(node,"background-image");
var _6d8=(bg=="transparent"||bg=="rgba(0, 0, 0, 0)");
while(_6d5.length>3){
_6d5.pop();
}
var rgb=new dojo.gfx.color.Color(_6cf);
var _6da=new dojo.gfx.color.Color(_6d5);
var anim=dojo.lfx.propertyAnimation(node,{"background-color":{start:rgb,end:_6da}},_6d0,_6d1,{"beforeBegin":function(){
if(_6d7){
node.style.backgroundImage="none";
}
node.style.backgroundColor="rgb("+rgb.toRgb().join(",")+")";
},"onEnd":function(){
if(_6d7){
node.style.backgroundImage=_6d7;
}
if(_6d8){
node.style.backgroundColor="transparent";
}
if(_6d2){
_6d2(node,anim);
}
}});
_6d3.push(anim);
});
return dojo.lfx.combine(_6d3);
};
dojo.lfx.html.unhighlight=function(_6dc,_6dd,_6de,_6df,_6e0){
_6dc=dojo.lfx.html._byId(_6dc);
var _6e1=[];
dojo.lang.forEach(_6dc,function(node){
var _6e3=new dojo.gfx.color.Color(dojo.html.getBackgroundColor(node));
var rgb=new dojo.gfx.color.Color(_6dd);
var _6e5=dojo.html.getStyle(node,"background-image");
var anim=dojo.lfx.propertyAnimation(node,{"background-color":{start:_6e3,end:rgb}},_6de,_6df,{"beforeBegin":function(){
if(_6e5){
node.style.backgroundImage="none";
}
node.style.backgroundColor="rgb("+_6e3.toRgb().join(",")+")";
},"onEnd":function(){
if(_6e0){
_6e0(node,anim);
}
}});
_6e1.push(anim);
});
return dojo.lfx.combine(_6e1);
};
dojo.lang.mixin(dojo.lfx,dojo.lfx.html);
dojo.kwCompoundRequire({browser:["dojo.lfx.html"],dashboard:["dojo.lfx.html"]});
dojo.provide("dojo.lfx.*");
dojo.provide("dojo.lfx.toggle");
dojo.lfx.toggle.plain={show:function(node,_6e8,_6e9,_6ea){
dojo.html.show(node);
if(dojo.lang.isFunction(_6ea)){
_6ea();
}
},hide:function(node,_6ec,_6ed,_6ee){
dojo.html.hide(node);
if(dojo.lang.isFunction(_6ee)){
_6ee();
}
}};
dojo.lfx.toggle.fade={show:function(node,_6f0,_6f1,_6f2){
dojo.lfx.fadeShow(node,_6f0,_6f1,_6f2).play();
},hide:function(node,_6f4,_6f5,_6f6){
dojo.lfx.fadeHide(node,_6f4,_6f5,_6f6).play();
}};
dojo.lfx.toggle.wipe={show:function(node,_6f8,_6f9,_6fa){
dojo.lfx.wipeIn(node,_6f8,_6f9,_6fa).play();
},hide:function(node,_6fc,_6fd,_6fe){
dojo.lfx.wipeOut(node,_6fc,_6fd,_6fe).play();
}};
dojo.lfx.toggle.explode={show:function(node,_700,_701,_702,_703){
dojo.lfx.explode(_703||{x:0,y:0,width:0,height:0},node,_700,_701,_702).play();
},hide:function(node,_705,_706,_707,_708){
dojo.lfx.implode(node,_708||{x:0,y:0,width:0,height:0},_705,_706,_707).play();
}};
dojo.provide("dojo.widget.HtmlWidget");
dojo.declare("dojo.widget.HtmlWidget",dojo.widget.DomWidget,{templateCssPath:null,templatePath:null,lang:"",toggle:"plain",toggleDuration:150,initialize:function(args,frag){
},postMixInProperties:function(args,frag){
if(this.lang===""){
this.lang=null;
}
this.toggleObj=dojo.lfx.toggle[this.toggle.toLowerCase()]||dojo.lfx.toggle.plain;
},createNodesFromText:function(txt,wrap){
return dojo.html.createNodesFromText(txt,wrap);
},destroyRendering:function(_70f){
try{
if(this.bgIframe){
this.bgIframe.remove();
delete this.bgIframe;
}
if(!_70f&&this.domNode){
dojo.event.browser.clean(this.domNode);
}
dojo.widget.HtmlWidget.superclass.destroyRendering.call(this);
}
catch(e){
}
},isShowing:function(){
return dojo.html.isShowing(this.domNode);
},toggleShowing:function(){
if(this.isShowing()){
this.hide();
}else{
this.show();
}
},show:function(){
if(this.isShowing()){
return;
}
this.animationInProgress=true;
this.toggleObj.show(this.domNode,this.toggleDuration,null,dojo.lang.hitch(this,this.onShow),this.explodeSrc);
},onShow:function(){
this.animationInProgress=false;
this.checkSize();
},hide:function(){
if(!this.isShowing()){
return;
}
this.animationInProgress=true;
this.toggleObj.hide(this.domNode,this.toggleDuration,null,dojo.lang.hitch(this,this.onHide),this.explodeSrc);
},onHide:function(){
this.animationInProgress=false;
},_isResized:function(w,h){
if(!this.isShowing()){
return false;
}
var wh=dojo.html.getMarginBox(this.domNode);
var _713=w||wh.width;
var _714=h||wh.height;
if(this.width==_713&&this.height==_714){
return false;
}
this.width=_713;
this.height=_714;
return true;
},checkSize:function(){
if(!this._isResized()){
return;
}
this.onResized();
},resizeTo:function(w,h){
dojo.html.setMarginBox(this.domNode,{width:w,height:h});
if(this.isShowing()){
this.onResized();
}
},resizeSoon:function(){
if(this.isShowing()){
dojo.lang.setTimeout(this,this.onResized,0);
}
},onResized:function(){
dojo.lang.forEach(this.children,function(_717){
if(_717.checkSize){
_717.checkSize();
}
});
}});
dojo.kwCompoundRequire({common:["dojo.xml.Parse","dojo.widget.Widget","dojo.widget.Parse","dojo.widget.Manager"],browser:["dojo.widget.DomWidget","dojo.widget.HtmlWidget"],dashboard:["dojo.widget.DomWidget","dojo.widget.HtmlWidget"],svg:["dojo.widget.SvgWidget"],rhino:["dojo.widget.SwtWidget"]});
dojo.provide("dojo.widget.*");
dojo.provide("dojo.string.common");
dojo.string.trim=function(str,wh){
if(!str.replace){
return str;
}
if(!str.length){
return str;
}
var re=(wh>0)?(/^\s+/):(wh<0)?(/\s+$/):(/^\s+|\s+$/g);
return str.replace(re,"");
};
dojo.string.trimStart=function(str){
return dojo.string.trim(str,1);
};
dojo.string.trimEnd=function(str){
return dojo.string.trim(str,-1);
};
dojo.string.repeat=function(str,_71e,_71f){
var out="";
for(var i=0;i<_71e;i++){
out+=str;
if(_71f&&i<_71e-1){
out+=_71f;
}
}
return out;
};
dojo.string.pad=function(str,len,c,dir){
var out=String(str);
if(!c){
c="0";
}
if(!dir){
dir=1;
}
while(out.length<len){
if(dir>0){
out=c+out;
}else{
out+=c;
}
}
return out;
};
dojo.string.padLeft=function(str,len,c){
return dojo.string.pad(str,len,c,1);
};
dojo.string.padRight=function(str,len,c){
return dojo.string.pad(str,len,c,-1);
};
dojo.provide("dojo.string");
dojo.provide("dojo.io.common");
dojo.io.transports=[];
dojo.io.hdlrFuncNames=["load","error","timeout"];
dojo.io.Request=function(url,_72e,_72f,_730){
if((arguments.length==1)&&(arguments[0].constructor==Object)){
this.fromKwArgs(arguments[0]);
}else{
this.url=url;
if(_72e){
this.mimetype=_72e;
}
if(_72f){
this.transport=_72f;
}
if(arguments.length>=4){
this.changeUrl=_730;
}
}
};
dojo.lang.extend(dojo.io.Request,{url:"",mimetype:"text/plain",method:"GET",content:undefined,transport:undefined,changeUrl:undefined,formNode:undefined,sync:false,bindSuccess:false,useCache:false,preventCache:false,load:function(type,data,_733,_734){
},error:function(type,_736,_737,_738){
},timeout:function(type,_73a,_73b,_73c){
},handle:function(type,data,_73f,_740){
},timeoutSeconds:0,abort:function(){
},fromKwArgs:function(_741){
if(_741["url"]){
_741.url=_741.url.toString();
}
if(_741["formNode"]){
_741.formNode=dojo.byId(_741.formNode);
}
if(!_741["method"]&&_741["formNode"]&&_741["formNode"].method){
_741.method=_741["formNode"].method;
}
if(!_741["handle"]&&_741["handler"]){
_741.handle=_741.handler;
}
if(!_741["load"]&&_741["loaded"]){
_741.load=_741.loaded;
}
if(!_741["changeUrl"]&&_741["changeURL"]){
_741.changeUrl=_741.changeURL;
}
_741.encoding=dojo.lang.firstValued(_741["encoding"],djConfig["bindEncoding"],"");
_741.sendTransport=dojo.lang.firstValued(_741["sendTransport"],djConfig["ioSendTransport"],false);
var _742=dojo.lang.isFunction;
for(var x=0;x<dojo.io.hdlrFuncNames.length;x++){
var fn=dojo.io.hdlrFuncNames[x];
if(_741[fn]&&_742(_741[fn])){
continue;
}
if(_741["handle"]&&_742(_741["handle"])){
_741[fn]=_741.handle;
}
}
dojo.lang.mixin(this,_741);
}});
dojo.io.Error=function(msg,type,num){
this.message=msg;
this.type=type||"unknown";
this.number=num||0;
};
dojo.io.transports.addTransport=function(name){
this.push(name);
this[name]=dojo.io[name];
};
dojo.io.bind=function(_749){
if(!(_749 instanceof dojo.io.Request)){
try{
_749=new dojo.io.Request(_749);
}
catch(e){
dojo.debug(e);
}
}
var _74a="";
if(_749["transport"]){
_74a=_749["transport"];
if(!this[_74a]){
dojo.io.sendBindError(_749,"No dojo.io.bind() transport with name '"+_749["transport"]+"'.");
return _749;
}
if(!this[_74a].canHandle(_749)){
dojo.io.sendBindError(_749,"dojo.io.bind() transport with name '"+_749["transport"]+"' cannot handle this type of request.");
return _749;
}
}else{
for(var x=0;x<dojo.io.transports.length;x++){
var tmp=dojo.io.transports[x];
if((this[tmp])&&(this[tmp].canHandle(_749))){
_74a=tmp;
break;
}
}
if(_74a==""){
dojo.io.sendBindError(_749,"None of the loaded transports for dojo.io.bind()"+" can handle the request.");
return _749;
}
}
this[_74a].bind(_749);
_749.bindSuccess=true;
return _749;
};
dojo.io.sendBindError=function(_74d,_74e){
if((typeof _74d.error=="function"||typeof _74d.handle=="function")&&(typeof setTimeout=="function"||typeof setTimeout=="object")){
var _74f=new dojo.io.Error(_74e);
setTimeout(function(){
_74d[(typeof _74d.error=="function")?"error":"handle"]("error",_74f,null,_74d);
},50);
}else{
dojo.raise(_74e);
}
};
dojo.io.queueBind=function(_750){
if(!(_750 instanceof dojo.io.Request)){
try{
_750=new dojo.io.Request(_750);
}
catch(e){
dojo.debug(e);
}
}
var _751=_750.load;
_750.load=function(){
dojo.io._queueBindInFlight=false;
var ret=_751.apply(this,arguments);
dojo.io._dispatchNextQueueBind();
return ret;
};
var _753=_750.error;
_750.error=function(){
dojo.io._queueBindInFlight=false;
var ret=_753.apply(this,arguments);
dojo.io._dispatchNextQueueBind();
return ret;
};
dojo.io._bindQueue.push(_750);
dojo.io._dispatchNextQueueBind();
return _750;
};
dojo.io._dispatchNextQueueBind=function(){
if(!dojo.io._queueBindInFlight){
dojo.io._queueBindInFlight=true;
if(dojo.io._bindQueue.length>0){
dojo.io.bind(dojo.io._bindQueue.shift());
}else{
dojo.io._queueBindInFlight=false;
}
}
};
dojo.io._bindQueue=[];
dojo.io._queueBindInFlight=false;
dojo.io.argsFromMap=function(map,_756,last){
var enc=/utf/i.test(_756||"")?encodeURIComponent:dojo.string.encodeAscii;
var _759=[];
var _75a=new Object();
for(var name in map){
var _75c=function(elt){
var val=enc(name)+"="+enc(elt);
_759[(last==name)?"push":"unshift"](val);
};
if(!_75a[name]){
var _75f=map[name];
if(dojo.lang.isArray(_75f)){
dojo.lang.forEach(_75f,_75c);
}else{
_75c(_75f);
}
}
}
return _759.join("&");
};
dojo.io.setIFrameSrc=function(_760,src,_762){
try{
var r=dojo.render.html;
if(!_762){
if(r.safari){
_760.location=src;
}else{
frames[_760.name].location=src;
}
}else{
var idoc;
if(r.ie){
idoc=_760.contentWindow.document;
}else{
if(r.safari){
idoc=_760.document;
}else{
idoc=_760.contentWindow;
}
}
if(!idoc){
_760.location=src;
return;
}else{
idoc.location.replace(src);
}
}
}
catch(e){
dojo.debug(e);
dojo.debug("setIFrameSrc: "+e);
}
};
dojo.provide("dojo.string.extras");
dojo.string.substituteParams=function(_765,hash){
var map=(typeof hash=="object")?hash:dojo.lang.toArray(arguments,1);
return _765.replace(/\%\{(\w+)\}/g,function(_768,key){
if(typeof (map[key])!="undefined"&&map[key]!=null){
return map[key];
}
dojo.raise("Substitution not found: "+key);
});
};
dojo.string.capitalize=function(str){
if(!dojo.lang.isString(str)){
return "";
}
if(arguments.length==0){
str=this;
}
var _76b=str.split(" ");
for(var i=0;i<_76b.length;i++){
_76b[i]=_76b[i].charAt(0).toUpperCase()+_76b[i].substring(1);
}
return _76b.join(" ");
};
dojo.string.isBlank=function(str){
if(!dojo.lang.isString(str)){
return true;
}
return (dojo.string.trim(str).length==0);
};
dojo.string.encodeAscii=function(str){
if(!dojo.lang.isString(str)){
return str;
}
var ret="";
var _770=escape(str);
var _771,re=/%u([0-9A-F]{4})/i;
while((_771=_770.match(re))){
var num=Number("0x"+_771[1]);
var _774=escape("&#"+num+";");
ret+=_770.substring(0,_771.index)+_774;
_770=_770.substring(_771.index+_771[0].length);
}
ret+=_770.replace(/\+/g,"%2B");
return ret;
};
dojo.string.escape=function(type,str){
var args=dojo.lang.toArray(arguments,1);
switch(type.toLowerCase()){
case "xml":
case "html":
case "xhtml":
return dojo.string.escapeXml.apply(this,args);
case "sql":
return dojo.string.escapeSql.apply(this,args);
case "regexp":
case "regex":
return dojo.string.escapeRegExp.apply(this,args);
case "javascript":
case "jscript":
case "js":
return dojo.string.escapeJavaScript.apply(this,args);
case "ascii":
return dojo.string.encodeAscii.apply(this,args);
default:
return str;
}
};
dojo.string.escapeXml=function(str,_779){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_779){
str=str.replace(/'/gm,"&#39;");
}
return str;
};
dojo.string.escapeSql=function(str){
return str.replace(/'/gm,"''");
};
dojo.string.escapeRegExp=function(str){
return str.replace(/\\/gm,"\\\\").replace(/([\f\b\n\t\r[\^$|?*+(){}])/gm,"\\$1");
};
dojo.string.escapeJavaScript=function(str){
return str.replace(/(["'\f\b\n\t\r])/gm,"\\$1");
};
dojo.string.escapeString=function(str){
return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");
};
dojo.string.summary=function(str,len){
if(!len||str.length<=len){
return str;
}
return str.substring(0,len).replace(/\.+$/,"")+"...";
};
dojo.string.endsWith=function(str,end,_782){
if(_782){
str=str.toLowerCase();
end=end.toLowerCase();
}
if((str.length-end.length)<0){
return false;
}
return str.lastIndexOf(end)==str.length-end.length;
};
dojo.string.endsWithAny=function(str){
for(var i=1;i<arguments.length;i++){
if(dojo.string.endsWith(str,arguments[i])){
return true;
}
}
return false;
};
dojo.string.startsWith=function(str,_786,_787){
if(_787){
str=str.toLowerCase();
_786=_786.toLowerCase();
}
return str.indexOf(_786)==0;
};
dojo.string.startsWithAny=function(str){
for(var i=1;i<arguments.length;i++){
if(dojo.string.startsWith(str,arguments[i])){
return true;
}
}
return false;
};
dojo.string.has=function(str){
for(var i=1;i<arguments.length;i++){
if(str.indexOf(arguments[i])>-1){
return true;
}
}
return false;
};
dojo.string.normalizeNewlines=function(text,_78d){
if(_78d=="\n"){
text=text.replace(/\r\n/g,"\n");
text=text.replace(/\r/g,"\n");
}else{
if(_78d=="\r"){
text=text.replace(/\r\n/g,"\r");
text=text.replace(/\n/g,"\r");
}else{
text=text.replace(/([^\r])\n/g,"$1\r\n").replace(/\r([^\n])/g,"\r\n$1");
}
}
return text;
};
dojo.string.splitEscaped=function(str,_78f){
var _790=[];
for(var i=0,_792=0;i<str.length;i++){
if(str.charAt(i)=="\\"){
i++;
continue;
}
if(str.charAt(i)==_78f){
_790.push(str.substring(_792,i));
_792=i+1;
}
}
_790.push(str.substr(_792));
return _790;
};
dojo.provide("dojo.undo.browser");
try{
if((!djConfig["preventBackButtonFix"])&&(!dojo.hostenv.post_load_)){
document.write("<iframe style='border: 0px; width: 1px; height: 1px; position: absolute; bottom: 0px; right: 0px; visibility: visible;' name='djhistory' id='djhistory' src='"+(djConfig["dojoIframeHistoryUrl"]||dojo.hostenv.getBaseScriptUri()+"iframe_history.html")+"'></iframe>");
}
}
catch(e){
}
if(dojo.render.html.opera){
dojo.debug("Opera is not supported with dojo.undo.browser, so back/forward detection will not work.");
}
dojo.undo.browser={initialHref:(!dj_undef("window"))?window.location.href:"",initialHash:(!dj_undef("window"))?window.location.hash:"",moveForward:false,historyStack:[],forwardStack:[],historyIframe:null,bookmarkAnchor:null,locationTimer:null,setInitialState:function(args){
this.initialState=this._createState(this.initialHref,args,this.initialHash);
},addToHistory:function(args){
this.forwardStack=[];
var hash=null;
var url=null;
if(!this.historyIframe){
if(djConfig["useXDomain"]&&!djConfig["dojoIframeHistoryUrl"]){
dojo.debug("dojo.undo.browser: When using cross-domain Dojo builds,"+" please save iframe_history.html to your domain and set djConfig.dojoIframeHistoryUrl"+" to the path on your domain to iframe_history.html");
}
this.historyIframe=window.frames["djhistory"];
}
if(!this.bookmarkAnchor){
this.bookmarkAnchor=document.createElement("a");
dojo.body().appendChild(this.bookmarkAnchor);
this.bookmarkAnchor.style.display="none";
}
if(args["changeUrl"]){
hash="#"+((args["changeUrl"]!==true)?args["changeUrl"]:(new Date()).getTime());
if(this.historyStack.length==0&&this.initialState.urlHash==hash){
this.initialState=this._createState(url,args,hash);
return;
}else{
if(this.historyStack.length>0&&this.historyStack[this.historyStack.length-1].urlHash==hash){
this.historyStack[this.historyStack.length-1]=this._createState(url,args,hash);
return;
}
}
this.changingUrl=true;
setTimeout("window.location.href = '"+hash+"'; dojo.undo.browser.changingUrl = false;",1);
this.bookmarkAnchor.href=hash;
if(dojo.render.html.ie){
url=this._loadIframeHistory();
var _797=args["back"]||args["backButton"]||args["handle"];
var tcb=function(_799){
if(window.location.hash!=""){
setTimeout("window.location.href = '"+hash+"';",1);
}
_797.apply(this,[_799]);
};
if(args["back"]){
args.back=tcb;
}else{
if(args["backButton"]){
args.backButton=tcb;
}else{
if(args["handle"]){
args.handle=tcb;
}
}
}
var _79a=args["forward"]||args["forwardButton"]||args["handle"];
var tfw=function(_79c){
if(window.location.hash!=""){
window.location.href=hash;
}
if(_79a){
_79a.apply(this,[_79c]);
}
};
if(args["forward"]){
args.forward=tfw;
}else{
if(args["forwardButton"]){
args.forwardButton=tfw;
}else{
if(args["handle"]){
args.handle=tfw;
}
}
}
}else{
if(dojo.render.html.moz){
if(!this.locationTimer){
this.locationTimer=setInterval("dojo.undo.browser.checkLocation();",200);
}
}
}
}else{
url=this._loadIframeHistory();
}
this.historyStack.push(this._createState(url,args,hash));
},checkLocation:function(){
if(!this.changingUrl){
var hsl=this.historyStack.length;
if((window.location.hash==this.initialHash||window.location.href==this.initialHref)&&(hsl==1)){
this.handleBackButton();
return;
}
if(this.forwardStack.length>0){
if(this.forwardStack[this.forwardStack.length-1].urlHash==window.location.hash){
this.handleForwardButton();
return;
}
}
if((hsl>=2)&&(this.historyStack[hsl-2])){
if(this.historyStack[hsl-2].urlHash==window.location.hash){
this.handleBackButton();
return;
}
}
}
},iframeLoaded:function(evt,_79f){
if(!dojo.render.html.opera){
var _7a0=this._getUrlQuery(_79f.href);
if(_7a0==null){
if(this.historyStack.length==1){
this.handleBackButton();
}
return;
}
if(this.moveForward){
this.moveForward=false;
return;
}
if(this.historyStack.length>=2&&_7a0==this._getUrlQuery(this.historyStack[this.historyStack.length-2].url)){
this.handleBackButton();
}else{
if(this.forwardStack.length>0&&_7a0==this._getUrlQuery(this.forwardStack[this.forwardStack.length-1].url)){
this.handleForwardButton();
}
}
}
},handleBackButton:function(){
var _7a1=this.historyStack.pop();
if(!_7a1){
return;
}
var last=this.historyStack[this.historyStack.length-1];
if(!last&&this.historyStack.length==0){
last=this.initialState;
}
if(last){
if(last.kwArgs["back"]){
last.kwArgs["back"]();
}else{
if(last.kwArgs["backButton"]){
last.kwArgs["backButton"]();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("back");
}
}
}
}
this.forwardStack.push(_7a1);
},handleForwardButton:function(){
var last=this.forwardStack.pop();
if(!last){
return;
}
if(last.kwArgs["forward"]){
last.kwArgs.forward();
}else{
if(last.kwArgs["forwardButton"]){
last.kwArgs.forwardButton();
}else{
if(last.kwArgs["handle"]){
last.kwArgs.handle("forward");
}
}
}
this.historyStack.push(last);
},_createState:function(url,args,hash){
return {"url":url,"kwArgs":args,"urlHash":hash};
},_getUrlQuery:function(url){
var _7a8=url.split("?");
if(_7a8.length<2){
return null;
}else{
return _7a8[1];
}
},_loadIframeHistory:function(){
var url=(djConfig["dojoIframeHistoryUrl"]||dojo.hostenv.getBaseScriptUri()+"iframe_history.html")+"?"+(new Date()).getTime();
this.moveForward=true;
dojo.io.setIFrameSrc(this.historyIframe,url,false);
return url;
}};
dojo.provide("dojo.io.BrowserIO");
if(!dj_undef("window")){
dojo.io.checkChildrenForFile=function(node){
var _7ab=false;
var _7ac=node.getElementsByTagName("input");
dojo.lang.forEach(_7ac,function(_7ad){
if(_7ab){
return;
}
if(_7ad.getAttribute("type")=="file"){
_7ab=true;
}
});
return _7ab;
};
dojo.io.formHasFile=function(_7ae){
return dojo.io.checkChildrenForFile(_7ae);
};
dojo.io.updateNode=function(node,_7b0){
node=dojo.byId(node);
var args=_7b0;
if(dojo.lang.isString(_7b0)){
args={url:_7b0};
}
args.mimetype="text/html";
args.load=function(t,d,e){
while(node.firstChild){
dojo.dom.destroyNode(node.firstChild);
}
node.innerHTML=d;
};
dojo.io.bind(args);
};
dojo.io.formFilter=function(node){
var type=(node.type||"").toLowerCase();
return !node.disabled&&node.name&&!dojo.lang.inArray(["file","submit","image","reset","button"],type);
};
dojo.io.encodeForm=function(_7b7,_7b8,_7b9){
if((!_7b7)||(!_7b7.tagName)||(!_7b7.tagName.toLowerCase()=="form")){
dojo.raise("Attempted to encode a non-form element.");
}
if(!_7b9){
_7b9=dojo.io.formFilter;
}
var enc=/utf/i.test(_7b8||"")?encodeURIComponent:dojo.string.encodeAscii;
var _7bb=[];
for(var i=0;i<_7b7.elements.length;i++){
var elm=_7b7.elements[i];
if(!elm||elm.tagName.toLowerCase()=="fieldset"||!_7b9(elm)){
continue;
}
var name=enc(elm.name);
var type=elm.type.toLowerCase();
if(type=="select-multiple"){
for(var j=0;j<elm.options.length;j++){
if(elm.options[j].selected){
_7bb.push(name+"="+enc(elm.options[j].value));
}
}
}else{
if(dojo.lang.inArray(["radio","checkbox"],type)){
if(elm.checked){
_7bb.push(name+"="+enc(elm.value));
}
}else{
_7bb.push(name+"="+enc(elm.value));
}
}
}
var _7c1=_7b7.getElementsByTagName("input");
for(var i=0;i<_7c1.length;i++){
var _7c2=_7c1[i];
if(_7c2.type.toLowerCase()=="image"&&_7c2.form==_7b7&&_7b9(_7c2)){
var name=enc(_7c2.name);
_7bb.push(name+"="+enc(_7c2.value));
_7bb.push(name+".x=0");
_7bb.push(name+".y=0");
}
}
return _7bb.join("&")+"&";
};
dojo.io.FormBind=function(args){
this.bindArgs={};
if(args&&args.formNode){
this.init(args);
}else{
if(args){
this.init({formNode:args});
}
}
};
dojo.lang.extend(dojo.io.FormBind,{form:null,bindArgs:null,clickedButton:null,init:function(args){
var form=dojo.byId(args.formNode);
if(!form||!form.tagName||form.tagName.toLowerCase()!="form"){
throw new Error("FormBind: Couldn't apply, invalid form");
}else{
if(this.form==form){
return;
}else{
if(this.form){
throw new Error("FormBind: Already applied to a form");
}
}
}
dojo.lang.mixin(this.bindArgs,args);
this.form=form;
this.connect(form,"onsubmit","submit");
for(var i=0;i<form.elements.length;i++){
var node=form.elements[i];
if(node&&node.type&&dojo.lang.inArray(["submit","button"],node.type.toLowerCase())){
this.connect(node,"onclick","click");
}
}
var _7c8=form.getElementsByTagName("input");
for(var i=0;i<_7c8.length;i++){
var _7c9=_7c8[i];
if(_7c9.type.toLowerCase()=="image"&&_7c9.form==form){
this.connect(_7c9,"onclick","click");
}
}
},onSubmit:function(form){
return true;
},submit:function(e){
e.preventDefault();
if(this.onSubmit(this.form)){
dojo.io.bind(dojo.lang.mixin(this.bindArgs,{formFilter:dojo.lang.hitch(this,"formFilter")}));
}
},click:function(e){
var node=e.currentTarget;
if(node.disabled){
return;
}
this.clickedButton=node;
},formFilter:function(node){
var type=(node.type||"").toLowerCase();
var _7d0=false;
if(node.disabled||!node.name){
_7d0=false;
}else{
if(dojo.lang.inArray(["submit","button","image"],type)){
if(!this.clickedButton){
this.clickedButton=node;
}
_7d0=node==this.clickedButton;
}else{
_7d0=!dojo.lang.inArray(["file","submit","reset","button"],type);
}
}
return _7d0;
},connect:function(_7d1,_7d2,_7d3){
if(dojo.evalObjPath("dojo.event.connect")){
dojo.event.connect(_7d1,_7d2,this,_7d3);
}else{
var fcn=dojo.lang.hitch(this,_7d3);
_7d1[_7d2]=function(e){
if(!e){
e=window.event;
}
if(!e.currentTarget){
e.currentTarget=e.srcElement;
}
if(!e.preventDefault){
e.preventDefault=function(){
window.event.returnValue=false;
};
}
fcn(e);
};
}
}});
dojo.io.XMLHTTPTransport=new function(){
var _7d6=this;
var _7d7={};
this.useCache=false;
this.preventCache=false;
function getCacheKey(url,_7d9,_7da){
return url+"|"+_7d9+"|"+_7da.toLowerCase();
}
function addToCache(url,_7dc,_7dd,http){
_7d7[getCacheKey(url,_7dc,_7dd)]=http;
}
function getFromCache(url,_7e0,_7e1){
return _7d7[getCacheKey(url,_7e0,_7e1)];
}
this.clearCache=function(){
_7d7={};
};
function doLoad(_7e2,http,url,_7e5,_7e6){
if(((http.status>=200)&&(http.status<300))||(http.status==304)||(location.protocol=="file:"&&(http.status==0||http.status==undefined))||(location.protocol=="chrome:"&&(http.status==0||http.status==undefined))){
var ret;
if(_7e2.method.toLowerCase()=="head"){
var _7e8=http.getAllResponseHeaders();
ret={};
ret.toString=function(){
return _7e8;
};
var _7e9=_7e8.split(/[\r\n]+/g);
for(var i=0;i<_7e9.length;i++){
var pair=_7e9[i].match(/^([^:]+)\s*:\s*(.+)$/i);
if(pair){
ret[pair[1]]=pair[2];
}
}
}else{
if(_7e2.mimetype=="text/javascript"){
try{
ret=dj_eval(http.responseText);
}
catch(e){
dojo.debug(e);
dojo.debug(http.responseText);
ret=null;
}
}else{
if(_7e2.mimetype=="text/json"||_7e2.mimetype=="application/json"){
try{
ret=dj_eval("("+http.responseText+")");
}
catch(e){
dojo.debug(e);
dojo.debug(http.responseText);
ret=false;
}
}else{
if((_7e2.mimetype=="application/xml")||(_7e2.mimetype=="text/xml")){
ret=http.responseXML;
if(!ret||typeof ret=="string"||!http.getResponseHeader("Content-Type")){
ret=dojo.dom.createDocumentFromText(http.responseText);
}
}else{
ret=http.responseText;
}
}
}
}
if(_7e6){
addToCache(url,_7e5,_7e2.method,http);
}
_7e2[(typeof _7e2.load=="function")?"load":"handle"]("load",ret,http,_7e2);
}else{
var _7ec=new dojo.io.Error("XMLHttpTransport Error: "+http.status+" "+http.statusText);
_7e2[(typeof _7e2.error=="function")?"error":"handle"]("error",_7ec,http,_7e2);
}
}
function setHeaders(http,_7ee){
if(_7ee["headers"]){
for(var _7ef in _7ee["headers"]){
if(_7ef.toLowerCase()=="content-type"&&!_7ee["contentType"]){
_7ee["contentType"]=_7ee["headers"][_7ef];
}else{
http.setRequestHeader(_7ef,_7ee["headers"][_7ef]);
}
}
}
}
this.inFlight=[];
this.inFlightTimer=null;
this.startWatchingInFlight=function(){
if(!this.inFlightTimer){
this.inFlightTimer=setTimeout("dojo.io.XMLHTTPTransport.watchInFlight();",10);
}
};
this.watchInFlight=function(){
var now=null;
if(!dojo.hostenv._blockAsync&&!_7d6._blockAsync){
for(var x=this.inFlight.length-1;x>=0;x--){
try{
var tif=this.inFlight[x];
if(!tif||tif.http._aborted||!tif.http.readyState){
this.inFlight.splice(x,1);
continue;
}
if(4==tif.http.readyState){
this.inFlight.splice(x,1);
doLoad(tif.req,tif.http,tif.url,tif.query,tif.useCache);
}else{
if(tif.startTime){
if(!now){
now=(new Date()).getTime();
}
if(tif.startTime+(tif.req.timeoutSeconds*1000)<now){
if(typeof tif.http.abort=="function"){
tif.http.abort();
}
this.inFlight.splice(x,1);
tif.req[(typeof tif.req.timeout=="function")?"timeout":"handle"]("timeout",null,tif.http,tif.req);
}
}
}
}
catch(e){
try{
var _7f3=new dojo.io.Error("XMLHttpTransport.watchInFlight Error: "+e);
tif.req[(typeof tif.req.error=="function")?"error":"handle"]("error",_7f3,tif.http,tif.req);
}
catch(e2){
dojo.debug("XMLHttpTransport error callback failed: "+e2);
}
}
}
}
clearTimeout(this.inFlightTimer);
if(this.inFlight.length==0){
this.inFlightTimer=null;
return;
}
this.inFlightTimer=setTimeout("dojo.io.XMLHTTPTransport.watchInFlight();",10);
};
var _7f4=dojo.hostenv.getXmlhttpObject()?true:false;
this.canHandle=function(_7f5){
return _7f4&&dojo.lang.inArray(["text/plain","text/html","application/xml","text/xml","text/javascript","text/json","application/json"],(_7f5["mimetype"].toLowerCase()||""))&&!(_7f5["formNode"]&&dojo.io.formHasFile(_7f5["formNode"]));
};
this.multipartBoundary="45309FFF-BD65-4d50-99C9-36986896A96F";
this.bind=function(_7f6){
if(!_7f6["url"]){
if(!_7f6["formNode"]&&(_7f6["backButton"]||_7f6["back"]||_7f6["changeUrl"]||_7f6["watchForURL"])&&(!djConfig.preventBackButtonFix)){
dojo.deprecated("Using dojo.io.XMLHTTPTransport.bind() to add to browser history without doing an IO request","Use dojo.undo.browser.addToHistory() instead.","0.4");
dojo.undo.browser.addToHistory(_7f6);
return true;
}
}
var url=_7f6.url;
var _7f8="";
if(_7f6["formNode"]){
var ta=_7f6.formNode.getAttribute("action");
if((ta)&&(!_7f6["url"])){
url=ta;
}
var tp=_7f6.formNode.getAttribute("method");
if((tp)&&(!_7f6["method"])){
_7f6.method=tp;
}
_7f8+=dojo.io.encodeForm(_7f6.formNode,_7f6.encoding,_7f6["formFilter"]);
}
if(url.indexOf("#")>-1){
dojo.debug("Warning: dojo.io.bind: stripping hash values from url:",url);
url=url.split("#")[0];
}
if(_7f6["file"]){
_7f6.method="post";
}
if(!_7f6["method"]){
_7f6.method="get";
}
if(_7f6.method.toLowerCase()=="get"){
_7f6.multipart=false;
}else{
if(_7f6["file"]){
_7f6.multipart=true;
}else{
if(!_7f6["multipart"]){
_7f6.multipart=false;
}
}
}
if(_7f6["backButton"]||_7f6["back"]||_7f6["changeUrl"]){
dojo.undo.browser.addToHistory(_7f6);
}
var _7fb=_7f6["content"]||{};
if(_7f6.sendTransport){
_7fb["dojo.transport"]="xmlhttp";
}
do{
if(_7f6.postContent){
_7f8=_7f6.postContent;
break;
}
if(_7fb){
_7f8+=dojo.io.argsFromMap(_7fb,_7f6.encoding);
}
if(_7f6.method.toLowerCase()=="get"||!_7f6.multipart){
break;
}
var t=[];
if(_7f8.length){
var q=_7f8.split("&");
for(var i=0;i<q.length;++i){
if(q[i].length){
var p=q[i].split("=");
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+p[0]+"\"","",p[1]);
}
}
}
if(_7f6.file){
if(dojo.lang.isArray(_7f6.file)){
for(var i=0;i<_7f6.file.length;++i){
var o=_7f6.file[i];
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+o.name+"\"; filename=\""+("fileName" in o?o.fileName:o.name)+"\"","Content-Type: "+("contentType" in o?o.contentType:"application/octet-stream"),"",o.content);
}
}else{
var o=_7f6.file;
t.push("--"+this.multipartBoundary,"Content-Disposition: form-data; name=\""+o.name+"\"; filename=\""+("fileName" in o?o.fileName:o.name)+"\"","Content-Type: "+("contentType" in o?o.contentType:"application/octet-stream"),"",o.content);
}
}
if(t.length){
t.push("--"+this.multipartBoundary+"--","");
_7f8=t.join("\r\n");
}
}while(false);
var _801=_7f6["sync"]?false:true;
var _802=_7f6["preventCache"]||(this.preventCache==true&&_7f6["preventCache"]!=false);
var _803=_7f6["useCache"]==true||(this.useCache==true&&_7f6["useCache"]!=false);
if(!_802&&_803){
var _804=getFromCache(url,_7f8,_7f6.method);
if(_804){
doLoad(_7f6,_804,url,_7f8,false);
return;
}
}
var http=dojo.hostenv.getXmlhttpObject(_7f6);
var _806=false;
if(_801){
var _807=this.inFlight.push({"req":_7f6,"http":http,"url":url,"query":_7f8,"useCache":_803,"startTime":_7f6.timeoutSeconds?(new Date()).getTime():0});
this.startWatchingInFlight();
}else{
_7d6._blockAsync=true;
}
if(_7f6.method.toLowerCase()=="post"){
if(!_7f6.user){
http.open("POST",url,_801);
}else{
http.open("POST",url,_801,_7f6.user,_7f6.password);
}
setHeaders(http,_7f6);
http.setRequestHeader("Content-Type",_7f6.multipart?("multipart/form-data; boundary="+this.multipartBoundary):(_7f6.contentType||"application/x-www-form-urlencoded"));
try{
http.send(_7f8);
}
catch(e){
if(typeof http.abort=="function"){
http.abort();
}
doLoad(_7f6,{status:404},url,_7f8,_803);
}
}else{
var _808=url;
if(_7f8!=""){
_808+=(_808.indexOf("?")>-1?"&":"?")+_7f8;
}
if(_802){
_808+=(dojo.string.endsWithAny(_808,"?","&")?"":(_808.indexOf("?")>-1?"&":"?"))+"dojo.preventCache="+new Date().valueOf();
}
if(!_7f6.user){
http.open(_7f6.method.toUpperCase(),_808,_801);
}else{
http.open(_7f6.method.toUpperCase(),_808,_801,_7f6.user,_7f6.password);
}
setHeaders(http,_7f6);
try{
http.send(null);
}
catch(e){
if(typeof http.abort=="function"){
http.abort();
}
doLoad(_7f6,{status:404},url,_7f8,_803);
}
}
if(!_801){
doLoad(_7f6,http,url,_7f8,_803);
_7d6._blockAsync=false;
}
_7f6.abort=function(){
try{
http._aborted=true;
}
catch(e){
}
return http.abort();
};
return;
};
dojo.io.transports.addTransport("XMLHTTPTransport");
};
}
dojo.provide("dojo.io.cookie");
dojo.io.cookie.setCookie=function(name,_80a,days,path,_80d,_80e){
var _80f=-1;
if((typeof days=="number")&&(days>=0)){
var d=new Date();
d.setTime(d.getTime()+(days*24*60*60*1000));
_80f=d.toGMTString();
}
_80a=escape(_80a);
document.cookie=name+"="+_80a+";"+(_80f!=-1?" expires="+_80f+";":"")+(path?"path="+path:"")+(_80d?"; domain="+_80d:"")+(_80e?"; secure":"");
};
dojo.io.cookie.set=dojo.io.cookie.setCookie;
dojo.io.cookie.getCookie=function(name){
var idx=document.cookie.lastIndexOf(name+"=");
if(idx==-1){
return null;
}
var _813=document.cookie.substring(idx+name.length+1);
var end=_813.indexOf(";");
if(end==-1){
end=_813.length;
}
_813=_813.substring(0,end);
_813=unescape(_813);
return _813;
};
dojo.io.cookie.get=dojo.io.cookie.getCookie;
dojo.io.cookie.deleteCookie=function(name){
dojo.io.cookie.setCookie(name,"-",0);
};
dojo.io.cookie.setObjectCookie=function(name,obj,days,path,_81a,_81b,_81c){
if(arguments.length==5){
_81c=_81a;
_81a=null;
_81b=null;
}
var _81d=[],_81e,_81f="";
if(!_81c){
_81e=dojo.io.cookie.getObjectCookie(name);
}
if(days>=0){
if(!_81e){
_81e={};
}
for(var prop in obj){
if(obj[prop]==null){
delete _81e[prop];
}else{
if((typeof obj[prop]=="string")||(typeof obj[prop]=="number")){
_81e[prop]=obj[prop];
}
}
}
prop=null;
for(var prop in _81e){
_81d.push(escape(prop)+"="+escape(_81e[prop]));
}
_81f=_81d.join("&");
}
dojo.io.cookie.setCookie(name,_81f,days,path,_81a,_81b);
};
dojo.io.cookie.getObjectCookie=function(name){
var _822=null,_823=dojo.io.cookie.getCookie(name);
if(_823){
_822={};
var _824=_823.split("&");
for(var i=0;i<_824.length;i++){
var pair=_824[i].split("=");
var _827=pair[1];
if(isNaN(_827)){
_827=unescape(pair[1]);
}
_822[unescape(pair[0])]=_827;
}
}
return _822;
};
dojo.io.cookie.isSupported=function(){
if(typeof navigator.cookieEnabled!="boolean"){
dojo.io.cookie.setCookie("__TestingYourBrowserForCookieSupport__","CookiesAllowed",90,null);
var _828=dojo.io.cookie.getCookie("__TestingYourBrowserForCookieSupport__");
navigator.cookieEnabled=(_828=="CookiesAllowed");
if(navigator.cookieEnabled){
this.deleteCookie("__TestingYourBrowserForCookieSupport__");
}
}
return navigator.cookieEnabled;
};
if(!dojo.io.cookies){
dojo.io.cookies=dojo.io.cookie;
}
dojo.kwCompoundRequire({common:["dojo.io.common"],rhino:["dojo.io.RhinoIO"],browser:["dojo.io.BrowserIO","dojo.io.cookie"],dashboard:["dojo.io.BrowserIO","dojo.io.cookie"]});
dojo.provide("dojo.io.*");
dojo.provide("dojo.widget.ContentPane");
dojo.widget.defineWidget("dojo.widget.ContentPane",dojo.widget.HtmlWidget,function(){
this._styleNodes=[];
this._onLoadStack=[];
this._onUnloadStack=[];
this._callOnUnload=false;
this._ioBindObj;
this.scriptScope;
this.bindArgs={};
},{isContainer:true,adjustPaths:true,href:"",extractContent:true,parseContent:true,cacheContent:true,preload:false,refreshOnShow:false,handler:"",executeScripts:false,scriptSeparation:true,loadingMessage:"Loading...",isLoaded:false,postCreate:function(args,frag,_82b){
if(this.handler!==""){
this.setHandler(this.handler);
}
if(this.isShowing()||this.preload){
this.loadContents();
}
},show:function(){
if(this.refreshOnShow){
this.refresh();
}else{
this.loadContents();
}
dojo.widget.ContentPane.superclass.show.call(this);
},refresh:function(){
this.isLoaded=false;
this.loadContents();
},loadContents:function(){
if(this.isLoaded){
return;
}
if(dojo.lang.isFunction(this.handler)){
this._runHandler();
}else{
if(this.href!=""){
this._downloadExternalContent(this.href,this.cacheContent&&!this.refreshOnShow);
}
}
},setUrl:function(url){
this.href=url;
this.isLoaded=false;
if(this.preload||this.isShowing()){
this.loadContents();
}
},abort:function(){
var bind=this._ioBindObj;
if(!bind||!bind.abort){
return;
}
bind.abort();
delete this._ioBindObj;
},_downloadExternalContent:function(url,_82f){
this.abort();
this._handleDefaults(this.loadingMessage,"onDownloadStart");
var self=this;
this._ioBindObj=dojo.io.bind(this._cacheSetting({url:url,mimetype:"text/html",handler:function(type,data,xhr){
delete self._ioBindObj;
if(type=="load"){
self.onDownloadEnd.call(self,url,data);
}else{
var e={responseText:xhr.responseText,status:xhr.status,statusText:xhr.statusText,responseHeaders:xhr.getAllResponseHeaders(),text:"Error loading '"+url+"' ("+xhr.status+" "+xhr.statusText+")"};
self._handleDefaults.call(self,e,"onDownloadError");
self.onLoad();
}
}},_82f));
},_cacheSetting:function(_835,_836){
for(var x in this.bindArgs){
if(dojo.lang.isUndefined(_835[x])){
_835[x]=this.bindArgs[x];
}
}
if(dojo.lang.isUndefined(_835.useCache)){
_835.useCache=_836;
}
if(dojo.lang.isUndefined(_835.preventCache)){
_835.preventCache=!_836;
}
if(dojo.lang.isUndefined(_835.mimetype)){
_835.mimetype="text/html";
}
return _835;
},onLoad:function(e){
this._runStack("_onLoadStack");
this.isLoaded=true;
},onUnLoad:function(e){
dojo.deprecated(this.widgetType+".onUnLoad, use .onUnload (lowercased load)",0.5);
},onUnload:function(e){
this._runStack("_onUnloadStack");
delete this.scriptScope;
if(this.onUnLoad!==dojo.widget.ContentPane.prototype.onUnLoad){
this.onUnLoad.apply(this,arguments);
}
},_runStack:function(_83b){
var st=this[_83b];
var err="";
var _83e=this.scriptScope||window;
for(var i=0;i<st.length;i++){
try{
st[i].call(_83e);
}
catch(e){
err+="\n"+st[i]+" failed: "+e.description;
}
}
this[_83b]=[];
if(err.length){
var name=(_83b=="_onLoadStack")?"addOnLoad":"addOnUnLoad";
this._handleDefaults(name+" failure\n "+err,"onExecError","debug");
}
},addOnLoad:function(obj,func){
this._pushOnStack(this._onLoadStack,obj,func);
},addOnUnload:function(obj,func){
this._pushOnStack(this._onUnloadStack,obj,func);
},addOnUnLoad:function(){
dojo.deprecated(this.widgetType+".addOnUnLoad, use addOnUnload instead. (lowercased Load)",0.5);
this.addOnUnload.apply(this,arguments);
},_pushOnStack:function(_845,obj,func){
if(typeof func=="undefined"){
_845.push(obj);
}else{
_845.push(function(){
obj[func]();
});
}
},destroy:function(){
this.onUnload();
dojo.widget.ContentPane.superclass.destroy.call(this);
},onExecError:function(e){
},onContentError:function(e){
},onDownloadError:function(e){
},onDownloadStart:function(e){
},onDownloadEnd:function(url,data){
data=this.splitAndFixPaths(data,url);
this.setContent(data);
},_handleDefaults:function(e,_84f,_850){
if(!_84f){
_84f="onContentError";
}
if(dojo.lang.isString(e)){
e={text:e};
}
if(!e.text){
e.text=e.toString();
}
e.toString=function(){
return this.text;
};
if(typeof e.returnValue!="boolean"){
e.returnValue=true;
}
if(typeof e.preventDefault!="function"){
e.preventDefault=function(){
this.returnValue=false;
};
}
this[_84f](e);
if(e.returnValue){
switch(_850){
case true:
case "alert":
alert(e.toString());
break;
case "debug":
dojo.debug(e.toString());
break;
default:
if(this._callOnUnload){
this.onUnload();
}
this._callOnUnload=false;
if(arguments.callee._loopStop){
dojo.debug(e.toString());
}else{
arguments.callee._loopStop=true;
this._setContent(e.toString());
}
}
}
arguments.callee._loopStop=false;
},splitAndFixPaths:function(s,url){
var _853=[],_854=[],tmp=[];
var _856=[],_857=[],attr=[],_859=[];
var str="",path="",fix="",_85d="",tag="",_85f="";
if(!url){
url="./";
}
if(s){
var _860=/<title[^>]*>([\s\S]*?)<\/title>/i;
while(_856=_860.exec(s)){
_853.push(_856[1]);
s=s.substring(0,_856.index)+s.substr(_856.index+_856[0].length);
}
if(this.adjustPaths){
var _861=/<[a-z][a-z0-9]*[^>]*\s(?:(?:src|href|style)=[^>])+[^>]*>/i;
var _862=/\s(src|href|style)=(['"]?)([\w()\[\]\/.,\\'"-:;#=&?\s@]+?)\2/i;
var _863=/^(?:[#]|(?:(?:https?|ftps?|file|javascript|mailto|news):))/;
while(tag=_861.exec(s)){
str+=s.substring(0,tag.index);
s=s.substring((tag.index+tag[0].length),s.length);
tag=tag[0];
_85d="";
while(attr=_862.exec(tag)){
path="";
_85f=attr[3];
switch(attr[1].toLowerCase()){
case "src":
case "href":
if(_863.exec(_85f)){
path=_85f;
}else{
path=(new dojo.uri.Uri(url,_85f).toString());
}
break;
case "style":
path=dojo.html.fixPathsInCssText(_85f,url);
break;
default:
path=_85f;
}
fix=" "+attr[1]+"="+attr[2]+path+attr[2];
_85d+=tag.substring(0,attr.index)+fix;
tag=tag.substring((attr.index+attr[0].length),tag.length);
}
str+=_85d+tag;
}
s=str+s;
}
_860=/(?:<(style)[^>]*>([\s\S]*?)<\/style>|<link ([^>]*rel=['"]?stylesheet['"]?[^>]*)>)/i;
while(_856=_860.exec(s)){
if(_856[1]&&_856[1].toLowerCase()=="style"){
_859.push(dojo.html.fixPathsInCssText(_856[2],url));
}else{
if(attr=_856[3].match(/href=(['"]?)([^'">]*)\1/i)){
_859.push({path:attr[2]});
}
}
s=s.substring(0,_856.index)+s.substr(_856.index+_856[0].length);
}
var _860=/<script([^>]*)>([\s\S]*?)<\/script>/i;
var _864=/src=(['"]?)([^"']*)\1/i;
var _865=/.*(\bdojo\b\.js(?:\.uncompressed\.js)?)$/;
var _866=/(?:var )?\bdjConfig\b(?:[\s]*=[\s]*\{[^}]+\}|\.[\w]*[\s]*=[\s]*[^;\n]*)?;?|dojo\.hostenv\.writeIncludes\(\s*\);?/g;
var _867=/dojo\.(?:(?:require(?:After)?(?:If)?)|(?:widget\.(?:manager\.)?registerWidgetPackage)|(?:(?:hostenv\.)?setModulePrefix|registerModulePath)|defineNamespace)\((['"]).*?\1\)\s*;?/;
while(_856=_860.exec(s)){
if(this.executeScripts&&_856[1]){
if(attr=_864.exec(_856[1])){
if(_865.exec(attr[2])){
dojo.debug("Security note! inhibit:"+attr[2]+" from  being loaded again.");
}else{
_854.push({path:attr[2]});
}
}
}
if(_856[2]){
var sc=_856[2].replace(_866,"");
if(!sc){
continue;
}
while(tmp=_867.exec(sc)){
_857.push(tmp[0]);
sc=sc.substring(0,tmp.index)+sc.substr(tmp.index+tmp[0].length);
}
if(this.executeScripts){
_854.push(sc);
}
}
s=s.substr(0,_856.index)+s.substr(_856.index+_856[0].length);
}
if(this.extractContent){
_856=s.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_856){
s=_856[1];
}
}
if(this.executeScripts&&this.scriptSeparation){
var _860=/(<[a-zA-Z][a-zA-Z0-9]*\s[^>]*?\S=)((['"])[^>]*scriptScope[^>]*>)/;
var _869=/([\s'";:\(])scriptScope(.*)/;
str="";
while(tag=_860.exec(s)){
tmp=((tag[3]=="'")?"\"":"'");
fix="";
str+=s.substring(0,tag.index)+tag[1];
while(attr=_869.exec(tag[2])){
tag[2]=tag[2].substring(0,attr.index)+attr[1]+"dojo.widget.byId("+tmp+this.widgetId+tmp+").scriptScope"+attr[2];
}
str+=tag[2];
s=s.substr(tag.index+tag[0].length);
}
s=str+s;
}
}
return {"xml":s,"styles":_859,"titles":_853,"requires":_857,"scripts":_854,"url":url};
},_setContent:function(cont){
this.destroyChildren();
for(var i=0;i<this._styleNodes.length;i++){
if(this._styleNodes[i]&&this._styleNodes[i].parentNode){
this._styleNodes[i].parentNode.removeChild(this._styleNodes[i]);
}
}
this._styleNodes=[];
try{
var node=this.containerNode||this.domNode;
while(node.firstChild){
dojo.html.destroyNode(node.firstChild);
}
if(typeof cont!="string"){
node.appendChild(cont);
}else{
node.innerHTML=cont;
}
}
catch(e){
e.text="Couldn't load content:"+e.description;
this._handleDefaults(e,"onContentError");
}
},setContent:function(data){
this.abort();
if(this._callOnUnload){
this.onUnload();
}
this._callOnUnload=true;
if(!data||dojo.html.isNode(data)){
this._setContent(data);
this.onResized();
this.onLoad();
}else{
if(typeof data.xml!="string"){
this.href="";
data=this.splitAndFixPaths(data);
}
this._setContent(data.xml);
for(var i=0;i<data.styles.length;i++){
if(data.styles[i].path){
this._styleNodes.push(dojo.html.insertCssFile(data.styles[i].path,dojo.doc(),false,true));
}else{
this._styleNodes.push(dojo.html.insertCssText(data.styles[i]));
}
}
if(this.parseContent){
for(var i=0;i<data.requires.length;i++){
try{
eval(data.requires[i]);
}
catch(e){
e.text="ContentPane: error in package loading calls, "+(e.description||e);
this._handleDefaults(e,"onContentError","debug");
}
}
}
var _86f=this;
function asyncParse(){
if(_86f.executeScripts){
_86f._executeScripts(data.scripts);
}
if(_86f.parseContent){
var node=_86f.containerNode||_86f.domNode;
var _871=new dojo.xml.Parse();
var frag=_871.parseElement(node,null,true);
dojo.widget.getParser().createSubComponents(frag,_86f);
}
_86f.onResized();
_86f.onLoad();
}
if(dojo.hostenv.isXDomain&&data.requires.length){
dojo.addOnLoad(asyncParse);
}else{
asyncParse();
}
}
},setHandler:function(_873){
var fcn=dojo.lang.isFunction(_873)?_873:window[_873];
if(!dojo.lang.isFunction(fcn)){
this._handleDefaults("Unable to set handler, '"+_873+"' not a function.","onExecError",true);
return;
}
this.handler=function(){
return fcn.apply(this,arguments);
};
},_runHandler:function(){
var ret=true;
if(dojo.lang.isFunction(this.handler)){
this.handler(this,this.domNode);
ret=false;
}
this.onLoad();
return ret;
},_executeScripts:function(_876){
var self=this;
var tmp="",code="";
for(var i=0;i<_876.length;i++){
if(_876[i].path){
dojo.io.bind(this._cacheSetting({"url":_876[i].path,"load":function(type,_87c){
dojo.lang.hitch(self,tmp=";"+_87c);
},"error":function(type,_87e){
_87e.text=type+" downloading remote script";
self._handleDefaults.call(self,_87e,"onExecError","debug");
},"mimetype":"text/plain","sync":true},this.cacheContent));
code+=tmp;
}else{
code+=_876[i];
}
}
try{
if(this.scriptSeparation){
delete this.scriptScope;
this.scriptScope=new (new Function("_container_",code+"; return this;"))(self);
}else{
var djg=dojo.global();
if(djg.execScript){
djg.execScript(code);
}else{
var djd=dojo.doc();
var sc=djd.createElement("script");
sc.appendChild(djd.createTextNode(code));
(this.containerNode||this.domNode).appendChild(sc);
}
}
}
catch(e){
e.text="Error running scripts from content:\n"+e.description;
this._handleDefaults(e,"onExecError","debug");
}
}});
dojo.provide("dojo.html.iframe");
dojo.html.iframeContentWindow=function(_882){
var win=dojo.html.getDocumentWindow(dojo.html.iframeContentDocument(_882))||dojo.html.iframeContentDocument(_882).__parent__||(_882.name&&document.frames[_882.name])||null;
return win;
};
dojo.html.iframeContentDocument=function(_884){
var doc=_884.contentDocument||((_884.contentWindow)&&(_884.contentWindow.document))||((_884.name)&&(document.frames[_884.name])&&(document.frames[_884.name].document))||null;
return doc;
};
dojo.html.BackgroundIframe=function(node){
if(dojo.render.html.ie55||dojo.render.html.ie60){
var html="<iframe src='javascript:false'"+" style='position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;"+"z-index: -1; filter:Alpha(Opacity=\"0\");' "+">";
this.iframe=dojo.doc().createElement(html);
this.iframe.tabIndex=-1;
if(node){
node.appendChild(this.iframe);
this.domNode=node;
}else{
dojo.body().appendChild(this.iframe);
this.iframe.style.display="none";
}
}
};
dojo.lang.extend(dojo.html.BackgroundIframe,{iframe:null,onResized:function(){
if(this.iframe&&this.domNode&&this.domNode.parentNode){
var _888=dojo.html.getMarginBox(this.domNode);
if(_888.width==0||_888.height==0){
dojo.lang.setTimeout(this,this.onResized,100);
return;
}
this.iframe.style.width=_888.width+"px";
this.iframe.style.height=_888.height+"px";
}
},size:function(node){
if(!this.iframe){
return;
}
var _88a=dojo.html.toCoordinateObject(node,true,dojo.html.boxSizing.BORDER_BOX);
with(this.iframe.style){
width=_88a.width+"px";
height=_88a.height+"px";
left=_88a.left+"px";
top=_88a.top+"px";
}
},setZIndex:function(node){
if(!this.iframe){
return;
}
if(dojo.dom.isNode(node)){
this.iframe.style.zIndex=dojo.html.getStyle(node,"z-index")-1;
}else{
if(!isNaN(node)){
this.iframe.style.zIndex=node;
}
}
},show:function(){
if(this.iframe){
this.iframe.style.display="block";
}
},hide:function(){
if(this.iframe){
this.iframe.style.display="none";
}
},remove:function(){
if(this.iframe){
dojo.html.removeNode(this.iframe,true);
delete this.iframe;
this.iframe=null;
}
}});
dojo.provide("dojo.widget.Dialog");
dojo.declare("dojo.widget.ModalDialogBase",null,{isContainer:true,focusElement:"",bgColor:"black",bgOpacity:0.4,followScroll:true,closeOnBackgroundClick:false,trapTabs:function(e){
if(e.target==this.tabStartOuter){
if(this._fromTrap){
this.tabStart.focus();
this._fromTrap=false;
}else{
this._fromTrap=true;
this.tabEnd.focus();
}
}else{
if(e.target==this.tabStart){
if(this._fromTrap){
this._fromTrap=false;
}else{
this._fromTrap=true;
this.tabEnd.focus();
}
}else{
if(e.target==this.tabEndOuter){
if(this._fromTrap){
this.tabEnd.focus();
this._fromTrap=false;
}else{
this._fromTrap=true;
this.tabStart.focus();
}
}else{
if(e.target==this.tabEnd){
if(this._fromTrap){
this._fromTrap=false;
}else{
this._fromTrap=true;
this.tabStart.focus();
}
}
}
}
}
},clearTrap:function(e){
var _88e=this;
setTimeout(function(){
_88e._fromTrap=false;
},100);
},postCreate:function(){
with(this.domNode.style){
position="absolute";
zIndex=999;
display="none";
overflow="visible";
}
var b=dojo.body();
b.appendChild(this.domNode);
this.bg=document.createElement("div");
this.bg.className="dialogUnderlay";
with(this.bg.style){
position="absolute";
left=top="0px";
zIndex=998;
display="none";
}
b.appendChild(this.bg);
this.setBackgroundColor(this.bgColor);
this.bgIframe=new dojo.html.BackgroundIframe();
if(this.bgIframe.iframe){
with(this.bgIframe.iframe.style){
position="absolute";
left=top="0px";
zIndex=90;
display="none";
}
}
if(this.closeOnBackgroundClick){
dojo.event.kwConnect({srcObj:this.bg,srcFunc:"onclick",adviceObj:this,adviceFunc:"onBackgroundClick",once:true});
}
},uninitialize:function(){
this.bgIframe.remove();
dojo.html.removeNode(this.bg,true);
},setBackgroundColor:function(_890){
if(arguments.length>=3){
_890=new dojo.gfx.color.Color(arguments[0],arguments[1],arguments[2]);
}else{
_890=new dojo.gfx.color.Color(_890);
}
this.bg.style.backgroundColor=_890.toString();
return this.bgColor=_890;
},setBackgroundOpacity:function(op){
if(arguments.length==0){
op=this.bgOpacity;
}
dojo.html.setOpacity(this.bg,op);
try{
this.bgOpacity=dojo.html.getOpacity(this.bg);
}
catch(e){
this.bgOpacity=op;
}
return this.bgOpacity;
},_sizeBackground:function(){
if(this.bgOpacity>0){
var _892=dojo.html.getViewport();
var h=_892.height;
var w=_892.width;
with(this.bg.style){
width=w+"px";
height=h+"px";
}
var _895=dojo.html.getScroll().offset;
this.bg.style.top=_895.y+"px";
this.bg.style.left=_895.x+"px";
var _892=dojo.html.getViewport();
if(_892.width!=w){
this.bg.style.width=_892.width+"px";
}
if(_892.height!=h){
this.bg.style.height=_892.height+"px";
}
}
this.bgIframe.size(this.bg);
},_showBackground:function(){
if(this.bgOpacity>0){
this.bg.style.display="block";
}
if(this.bgIframe.iframe){
this.bgIframe.iframe.style.display="block";
}
},placeModalDialog:function(){
var _896=dojo.html.getScroll().offset;
var _897=dojo.html.getViewport();
var mb;
if(this.isShowing()){
mb=dojo.html.getMarginBox(this.domNode);
}else{
dojo.html.setVisibility(this.domNode,false);
dojo.html.show(this.domNode);
mb=dojo.html.getMarginBox(this.domNode);
dojo.html.hide(this.domNode);
dojo.html.setVisibility(this.domNode,true);
}
var x=_896.x+(_897.width-mb.width)/2;
var y=_896.y+(_897.height-mb.height)/2;
with(this.domNode.style){
left=x+"px";
top=y+"px";
}
},_onKey:function(evt){
if(evt.key){
var node=evt.target;
while(node!=null){
if(node==this.domNode){
return;
}
node=node.parentNode;
}
if(evt.key!=evt.KEY_TAB){
dojo.event.browser.stopEvent(evt);
}else{
if(!dojo.render.html.opera){
try{
this.tabStart.focus();
}
catch(e){
}
}
}
}
},showModalDialog:function(){
if(this.followScroll&&!this._scrollConnected){
this._scrollConnected=true;
dojo.event.connect(window,"onscroll",this,"_onScroll");
}
dojo.event.connect(document.documentElement,"onkey",this,"_onKey");
this.placeModalDialog();
this.setBackgroundOpacity();
this._sizeBackground();
this._showBackground();
this._fromTrap=true;
setTimeout(dojo.lang.hitch(this,function(){
try{
this.tabStart.focus();
}
catch(e){
}
}),50);
},hideModalDialog:function(){
if(this.focusElement){
dojo.byId(this.focusElement).focus();
dojo.byId(this.focusElement).blur();
}
this.bg.style.display="none";
this.bg.style.width=this.bg.style.height="1px";
if(this.bgIframe.iframe){
this.bgIframe.iframe.style.display="none";
}
dojo.event.disconnect(document.documentElement,"onkey",this,"_onKey");
if(this._scrollConnected){
this._scrollConnected=false;
dojo.event.disconnect(window,"onscroll",this,"_onScroll");
}
},_onScroll:function(){
var _89d=dojo.html.getScroll().offset;
this.bg.style.top=_89d.y+"px";
this.bg.style.left=_89d.x+"px";
this.placeModalDialog();
},checkSize:function(){
if(this.isShowing()){
this._sizeBackground();
this.placeModalDialog();
this.onResized();
}
},onBackgroundClick:function(){
if(this.lifetime-this.timeRemaining>=this.blockDuration){
return;
}
this.hide();
}});
dojo.widget.defineWidget("dojo.widget.Dialog",[dojo.widget.ContentPane,dojo.widget.ModalDialogBase],{templateString:"<div id=\"${this.widgetId}\" class=\"dojoDialog\" dojoattachpoint=\"wrapper\">\n\t<span dojoattachpoint=\"tabStartOuter\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\"\ttabindex=\"0\"></span>\n\t<span dojoattachpoint=\"tabStart\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n\t<div dojoattachpoint=\"containerNode\" style=\"position: relative; z-index: 2;\"></div>\n\t<span dojoattachpoint=\"tabEnd\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n\t<span dojoattachpoint=\"tabEndOuter\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n</div>\n",blockDuration:0,lifetime:0,closeNode:"",postMixInProperties:function(){
dojo.widget.Dialog.superclass.postMixInProperties.apply(this,arguments);
if(this.closeNode){
this.setCloseControl(this.closeNode);
}
},postCreate:function(){
dojo.widget.Dialog.superclass.postCreate.apply(this,arguments);
dojo.widget.ModalDialogBase.prototype.postCreate.apply(this,arguments);
},show:function(){
if(this.lifetime){
this.timeRemaining=this.lifetime;
if(this.timerNode){
this.timerNode.innerHTML=Math.ceil(this.timeRemaining/1000);
}
if(this.blockDuration&&this.closeNode){
if(this.lifetime>this.blockDuration){
this.closeNode.style.visibility="hidden";
}else{
this.closeNode.style.display="none";
}
}
if(this.timer){
clearInterval(this.timer);
}
this.timer=setInterval(dojo.lang.hitch(this,"_onTick"),100);
}
this.showModalDialog();
dojo.widget.Dialog.superclass.show.call(this);
},onLoad:function(){
this.placeModalDialog();
dojo.widget.Dialog.superclass.onLoad.call(this);
},fillInTemplate:function(){
},hide:function(){
this.hideModalDialog();
dojo.widget.Dialog.superclass.hide.call(this);
if(this.timer){
clearInterval(this.timer);
}
},setTimerNode:function(node){
this.timerNode=node;
},setCloseControl:function(node){
this.closeNode=dojo.byId(node);
dojo.event.connect(this.closeNode,"onclick",this,"hide");
},setShowControl:function(node){
node=dojo.byId(node);
dojo.event.connect(node,"onclick",this,"show");
},_onTick:function(){
if(this.timer){
this.timeRemaining-=100;
if(this.lifetime-this.timeRemaining>=this.blockDuration){
if(this.closeNode){
this.closeNode.style.visibility="visible";
}
}
if(!this.timeRemaining){
clearInterval(this.timer);
this.hide();
}else{
if(this.timerNode){
this.timerNode.innerHTML=Math.ceil(this.timeRemaining/1000);
}
}
}
}});
dojo.provide("dojo.html.selection");
dojo.html.selectionType={NONE:0,TEXT:1,CONTROL:2};
dojo.html.clearSelection=function(){
var _8a1=dojo.global();
var _8a2=dojo.doc();
try{
if(_8a1["getSelection"]){
if(dojo.render.html.safari){
_8a1.getSelection().collapse();
}else{
_8a1.getSelection().removeAllRanges();
}
}else{
if(_8a2.selection){
if(_8a2.selection.empty){
_8a2.selection.empty();
}else{
if(_8a2.selection.clear){
_8a2.selection.clear();
}
}
}
}
return true;
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.html.disableSelection=function(_8a3){
_8a3=dojo.byId(_8a3)||dojo.body();
var h=dojo.render.html;
if(h.mozilla){
_8a3.style.MozUserSelect="none";
}else{
if(h.safari){
_8a3.style.KhtmlUserSelect="none";
}else{
if(h.ie){
_8a3.unselectable="on";
}else{
return false;
}
}
}
return true;
};
dojo.html.enableSelection=function(_8a5){
_8a5=dojo.byId(_8a5)||dojo.body();
var h=dojo.render.html;
if(h.mozilla){
_8a5.style.MozUserSelect="";
}else{
if(h.safari){
_8a5.style.KhtmlUserSelect="";
}else{
if(h.ie){
_8a5.unselectable="off";
}else{
return false;
}
}
}
return true;
};
dojo.html.selectElement=function(_8a7){
dojo.deprecated("dojo.html.selectElement","replaced by dojo.html.selection.selectElementChildren",0.5);
};
dojo.html.selectInputText=function(_8a8){
var _8a9=dojo.global();
var _8aa=dojo.doc();
_8a8=dojo.byId(_8a8);
if(_8aa["selection"]&&dojo.body()["createTextRange"]){
var _8ab=_8a8.createTextRange();
_8ab.moveStart("character",0);
_8ab.moveEnd("character",_8a8.value.length);
_8ab.select();
}else{
if(_8a9["getSelection"]){
var _8ac=_8a9.getSelection();
_8a8.setSelectionRange(0,_8a8.value.length);
}
}
_8a8.focus();
};
dojo.html.isSelectionCollapsed=function(){
dojo.deprecated("dojo.html.isSelectionCollapsed","replaced by dojo.html.selection.isCollapsed",0.5);
return dojo.html.selection.isCollapsed();
};
dojo.lang.mixin(dojo.html.selection,{getType:function(){
if(dojo.doc()["selection"]){
return dojo.html.selectionType[dojo.doc().selection.type.toUpperCase()];
}else{
var _8ad=dojo.html.selectionType.TEXT;
var oSel;
try{
oSel=dojo.global().getSelection();
}
catch(e){
}
if(oSel&&oSel.rangeCount==1){
var _8af=oSel.getRangeAt(0);
if(_8af.startContainer==_8af.endContainer&&(_8af.endOffset-_8af.startOffset)==1&&_8af.startContainer.nodeType!=dojo.dom.TEXT_NODE){
_8ad=dojo.html.selectionType.CONTROL;
}
}
return _8ad;
}
},isCollapsed:function(){
var _8b0=dojo.global();
var _8b1=dojo.doc();
if(_8b1["selection"]){
return _8b1.selection.createRange().text=="";
}else{
if(_8b0["getSelection"]){
var _8b2=_8b0.getSelection();
if(dojo.lang.isString(_8b2)){
return _8b2=="";
}else{
return _8b2.isCollapsed||_8b2.toString()=="";
}
}
}
},getSelectedElement:function(){
if(dojo.html.selection.getType()==dojo.html.selectionType.CONTROL){
if(dojo.doc()["selection"]){
var _8b3=dojo.doc().selection.createRange();
if(_8b3&&_8b3.item){
return dojo.doc().selection.createRange().item(0);
}
}else{
var _8b4=dojo.global().getSelection();
return _8b4.anchorNode.childNodes[_8b4.anchorOffset];
}
}
},getParentElement:function(){
if(dojo.html.selection.getType()==dojo.html.selectionType.CONTROL){
var p=dojo.html.selection.getSelectedElement();
if(p){
return p.parentNode;
}
}else{
if(dojo.doc()["selection"]){
return dojo.doc().selection.createRange().parentElement();
}else{
var _8b6=dojo.global().getSelection();
if(_8b6){
var node=_8b6.anchorNode;
while(node&&node.nodeType!=dojo.dom.ELEMENT_NODE){
node=node.parentNode;
}
return node;
}
}
}
},getSelectedText:function(){
if(dojo.doc()["selection"]){
if(dojo.html.selection.getType()==dojo.html.selectionType.CONTROL){
return null;
}
return dojo.doc().selection.createRange().text;
}else{
var _8b8=dojo.global().getSelection();
if(_8b8){
return _8b8.toString();
}
}
},getSelectedHtml:function(){
if(dojo.doc()["selection"]){
if(dojo.html.selection.getType()==dojo.html.selectionType.CONTROL){
return null;
}
return dojo.doc().selection.createRange().htmlText;
}else{
var _8b9=dojo.global().getSelection();
if(_8b9&&_8b9.rangeCount){
var frag=_8b9.getRangeAt(0).cloneContents();
var div=document.createElement("div");
div.appendChild(frag);
return div.innerHTML;
}
return null;
}
},hasAncestorElement:function(_8bc){
return (dojo.html.selection.getAncestorElement.apply(this,arguments)!=null);
},getAncestorElement:function(_8bd){
var node=dojo.html.selection.getSelectedElement()||dojo.html.selection.getParentElement();
while(node){
if(dojo.html.selection.isTag(node,arguments).length>0){
return node;
}
node=node.parentNode;
}
return null;
},isTag:function(node,tags){
if(node&&node.tagName){
for(var i=0;i<tags.length;i++){
if(node.tagName.toLowerCase()==String(tags[i]).toLowerCase()){
return String(tags[i]).toLowerCase();
}
}
}
return "";
},selectElement:function(_8c2){
var _8c3=dojo.global();
var _8c4=dojo.doc();
_8c2=dojo.byId(_8c2);
if(_8c4.selection&&dojo.body().createTextRange){
try{
var _8c5=dojo.body().createControlRange();
_8c5.addElement(_8c2);
_8c5.select();
}
catch(e){
dojo.html.selection.selectElementChildren(_8c2);
}
}else{
if(_8c3["getSelection"]){
var _8c6=_8c3.getSelection();
if(_8c6["removeAllRanges"]){
var _8c5=_8c4.createRange();
_8c5.selectNode(_8c2);
_8c6.removeAllRanges();
_8c6.addRange(_8c5);
}
}
}
},selectElementChildren:function(_8c7){
var _8c8=dojo.global();
var _8c9=dojo.doc();
_8c7=dojo.byId(_8c7);
if(_8c9.selection&&dojo.body().createTextRange){
var _8ca=dojo.body().createTextRange();
_8ca.moveToElementText(_8c7);
_8ca.select();
}else{
if(_8c8["getSelection"]){
var _8cb=_8c8.getSelection();
if(_8cb["setBaseAndExtent"]){
_8cb.setBaseAndExtent(_8c7,0,_8c7,_8c7.innerText.length-1);
}else{
if(_8cb["selectAllChildren"]){
_8cb.selectAllChildren(_8c7);
}
}
}
}
},getBookmark:function(){
var _8cc;
var _8cd=dojo.doc();
if(_8cd["selection"]){
var _8ce=_8cd.selection.createRange();
_8cc=_8ce.getBookmark();
}else{
var _8cf;
try{
_8cf=dojo.global().getSelection();
}
catch(e){
}
if(_8cf){
var _8ce=_8cf.getRangeAt(0);
_8cc=_8ce.cloneRange();
}else{
dojo.debug("No idea how to store the current selection for this browser!");
}
}
return _8cc;
},moveToBookmark:function(_8d0){
var _8d1=dojo.doc();
if(_8d1["selection"]){
var _8d2=_8d1.selection.createRange();
_8d2.moveToBookmark(_8d0);
_8d2.select();
}else{
var _8d3;
try{
_8d3=dojo.global().getSelection();
}
catch(e){
}
if(_8d3&&_8d3["removeAllRanges"]){
_8d3.removeAllRanges();
_8d3.addRange(_8d0);
}else{
dojo.debug("No idea how to restore selection for this browser!");
}
}
},collapse:function(_8d4){
if(dojo.global()["getSelection"]){
var _8d5=dojo.global().getSelection();
if(_8d5.removeAllRanges){
if(_8d4){
_8d5.collapseToStart();
}else{
_8d5.collapseToEnd();
}
}else{
dojo.global().getSelection().collapse(_8d4);
}
}else{
if(dojo.doc().selection){
var _8d6=dojo.doc().selection.createRange();
_8d6.collapse(_8d4);
_8d6.select();
}
}
},remove:function(){
if(dojo.doc().selection){
var _8d7=dojo.doc().selection;
if(_8d7.type.toUpperCase()!="NONE"){
_8d7.clear();
}
return _8d7;
}else{
var _8d7=dojo.global().getSelection();
for(var i=0;i<_8d7.rangeCount;i++){
_8d7.getRangeAt(i).deleteContents();
}
return _8d7;
}
}});
dojo.provide("dojo.widget.PopupContainer");
dojo.declare("dojo.widget.PopupContainerBase",null,function(){
this.queueOnAnimationFinish=[];
},{isShowingNow:false,currentSubpopup:null,beginZIndex:1000,parentPopup:null,parent:null,popupIndex:0,aroundBox:dojo.html.boxSizing.BORDER_BOX,openedForWindow:null,processKey:function(evt){
return false;
},applyPopupBasicStyle:function(){
with(this.domNode.style){
display="none";
position="absolute";
}
},aboutToShow:function(){
},open:function(x,y,_8dc,_8dd,_8de,_8df){
if(this.isShowingNow){
return;
}
if(this.animationInProgress){
this.queueOnAnimationFinish.push(this.open,arguments);
return;
}
this.aboutToShow();
var _8e0=false,node,_8e2;
if(typeof x=="object"){
node=x;
_8e2=_8dd;
_8dd=_8dc;
_8dc=y;
_8e0=true;
}
this.parent=_8dc;
dojo.body().appendChild(this.domNode);
_8dd=_8dd||_8dc["domNode"]||[];
var _8e3=null;
this.isTopLevel=true;
while(_8dc){
if(_8dc!==this&&(_8dc.setOpenedSubpopup!=undefined&&_8dc.applyPopupBasicStyle!=undefined)){
_8e3=_8dc;
this.isTopLevel=false;
_8e3.setOpenedSubpopup(this);
break;
}
_8dc=_8dc.parent;
}
this.parentPopup=_8e3;
this.popupIndex=_8e3?_8e3.popupIndex+1:1;
if(this.isTopLevel){
var _8e4=dojo.html.isNode(_8dd)?_8dd:null;
dojo.widget.PopupManager.opened(this,_8e4);
}
if(this.isTopLevel&&!dojo.withGlobal(this.openedForWindow||dojo.global(),dojo.html.selection.isCollapsed)){
this._bookmark=dojo.withGlobal(this.openedForWindow||dojo.global(),dojo.html.selection.getBookmark);
}else{
this._bookmark=null;
}
if(_8dd instanceof Array){
_8dd={left:_8dd[0],top:_8dd[1],width:0,height:0};
}
with(this.domNode.style){
display="";
zIndex=this.beginZIndex+this.popupIndex;
}
if(_8e0){
this.move(node,_8df,_8e2);
}else{
this.move(x,y,_8df,_8de);
}
this.domNode.style.display="none";
this.explodeSrc=_8dd;
this.show();
this.isShowingNow=true;
},move:function(x,y,_8e7,_8e8){
var _8e9=(typeof x=="object");
if(_8e9){
var _8ea=_8e7;
var node=x;
_8e7=y;
if(!_8ea){
_8ea={"BL":"TL","TL":"BL"};
}
dojo.html.placeOnScreenAroundElement(this.domNode,node,_8e7,this.aroundBox,_8ea);
}else{
if(!_8e8){
_8e8="TL,TR,BL,BR";
}
dojo.html.placeOnScreen(this.domNode,x,y,_8e7,true,_8e8);
}
},close:function(_8ec){
if(_8ec){
this.domNode.style.display="none";
}
if(this.animationInProgress){
this.queueOnAnimationFinish.push(this.close,[]);
return;
}
this.closeSubpopup(_8ec);
this.hide();
if(this.bgIframe){
this.bgIframe.hide();
this.bgIframe.size({left:0,top:0,width:0,height:0});
}
if(this.isTopLevel){
dojo.widget.PopupManager.closed(this);
}
this.isShowingNow=false;
if(this.parent){
setTimeout(dojo.lang.hitch(this,function(){
try{
if(this.parent["focus"]){
this.parent.focus();
}else{
this.parent.domNode.focus();
}
}
catch(e){
dojo.debug("No idea how to focus to parent",e);
}
}),10);
}
if(this._bookmark&&dojo.withGlobal(this.openedForWindow||dojo.global(),dojo.html.selection.isCollapsed)){
if(this.openedForWindow){
this.openedForWindow.focus();
}
try{
dojo.withGlobal(this.openedForWindow||dojo.global(),"moveToBookmark",dojo.html.selection,[this._bookmark]);
}
catch(e){
}
}
this._bookmark=null;
},closeAll:function(_8ed){
if(this.parentPopup){
this.parentPopup.closeAll(_8ed);
}else{
this.close(_8ed);
}
},setOpenedSubpopup:function(_8ee){
this.currentSubpopup=_8ee;
},closeSubpopup:function(_8ef){
if(this.currentSubpopup==null){
return;
}
this.currentSubpopup.close(_8ef);
this.currentSubpopup=null;
},onShow:function(){
dojo.widget.PopupContainer.superclass.onShow.apply(this,arguments);
this.openedSize={w:this.domNode.style.width,h:this.domNode.style.height};
if(dojo.render.html.ie){
if(!this.bgIframe){
this.bgIframe=new dojo.html.BackgroundIframe();
this.bgIframe.setZIndex(this.domNode);
}
this.bgIframe.size(this.domNode);
this.bgIframe.show();
}
this.processQueue();
},processQueue:function(){
if(!this.queueOnAnimationFinish.length){
return;
}
var func=this.queueOnAnimationFinish.shift();
var args=this.queueOnAnimationFinish.shift();
func.apply(this,args);
},onHide:function(){
dojo.widget.HtmlWidget.prototype.onHide.call(this);
if(this.openedSize){
with(this.domNode.style){
width=this.openedSize.w;
height=this.openedSize.h;
}
}
this.processQueue();
}});
dojo.widget.defineWidget("dojo.widget.PopupContainer",[dojo.widget.HtmlWidget,dojo.widget.PopupContainerBase],{isContainer:true,fillInTemplate:function(){
this.applyPopupBasicStyle();
dojo.widget.PopupContainer.superclass.fillInTemplate.apply(this,arguments);
}});
dojo.widget.PopupManager=new function(){
this.currentMenu=null;
this.currentButton=null;
this.currentFocusMenu=null;
this.focusNode=null;
this.registeredWindows=[];
this.registerWin=function(win){
if(!win.__PopupManagerRegistered){
dojo.event.connect(win.document,"onmousedown",this,"onClick");
dojo.event.connect(win,"onscroll",this,"onClick");
dojo.event.connect(win.document,"onkey",this,"onKey");
win.__PopupManagerRegistered=true;
this.registeredWindows.push(win);
}
};
this.registerAllWindows=function(_8f3){
if(!_8f3){
_8f3=dojo.html.getDocumentWindow(window.top&&window.top.document||window.document);
}
this.registerWin(_8f3);
for(var i=0;i<_8f3.frames.length;i++){
try{
var win=dojo.html.getDocumentWindow(_8f3.frames[i].document);
if(win){
this.registerAllWindows(win);
}
}
catch(e){
}
}
};
this.unRegisterWin=function(win){
if(win.__PopupManagerRegistered){
dojo.event.disconnect(win.document,"onmousedown",this,"onClick");
dojo.event.disconnect(win,"onscroll",this,"onClick");
dojo.event.disconnect(win.document,"onkey",this,"onKey");
win.__PopupManagerRegistered=false;
}
};
this.unRegisterAllWindows=function(){
for(var i=0;i<this.registeredWindows.length;++i){
this.unRegisterWin(this.registeredWindows[i]);
}
this.registeredWindows=[];
};
dojo.addOnLoad(this,"registerAllWindows");
dojo.addOnUnload(this,"unRegisterAllWindows");
this.closed=function(menu){
if(this.currentMenu==menu){
this.currentMenu=null;
this.currentButton=null;
this.currentFocusMenu=null;
}
};
this.opened=function(menu,_8fa){
if(menu==this.currentMenu){
return;
}
if(this.currentMenu){
this.currentMenu.close();
}
this.currentMenu=menu;
this.currentFocusMenu=menu;
this.currentButton=_8fa;
};
this.setFocusedMenu=function(menu){
this.currentFocusMenu=menu;
};
this.onKey=function(e){
if(!e.key){
return;
}
if(!this.currentMenu||!this.currentMenu.isShowingNow){
return;
}
var m=this.currentFocusMenu;
while(m){
if(m.processKey(e)){
e.preventDefault();
e.stopPropagation();
break;
}
m=m.parentPopup||m.parentMenu;
}
},this.onClick=function(e){
if(!this.currentMenu){
return;
}
var _8ff=dojo.html.getScroll().offset;
var m=this.currentMenu;
while(m){
if(dojo.html.overElement(m.domNode,e)||dojo.html.isDescendantOf(e.target,m.domNode)){
return;
}
m=m.currentSubpopup;
}
if(this.currentButton&&dojo.html.overElement(this.currentButton,e)){
return;
}
this.currentMenu.closeAll(true);
};
};
dojo.provide("dojo.widget.DropdownContainer");
dojo.widget.defineWidget("dojo.widget.DropdownContainer",dojo.widget.HtmlWidget,{inputWidth:"7em",id:"",inputId:"",inputName:"",iconURL:dojo.uri.moduleUri("dojo.widget","templates/images/combo_box_arrow.png"),copyClasses:false,iconAlt:"",containerToggle:"plain",containerToggleDuration:150,templateString:"<span style=\"white-space:nowrap\"><input type=\"hidden\" name=\"\" value=\"\" dojoAttachPoint=\"valueNode\" /><input name=\"\" type=\"text\" value=\"\" style=\"vertical-align:middle;\" dojoAttachPoint=\"inputNode\" autocomplete=\"off\" /> <img src=\"${this.iconURL}\" alt=\"${this.iconAlt}\" dojoAttachEvent=\"onclick:onIconClick\" dojoAttachPoint=\"buttonNode\" style=\"vertical-align:middle; cursor:pointer; cursor:hand\" /></span>",templateCssPath:"",isContainer:true,attachTemplateNodes:function(){
dojo.widget.DropdownContainer.superclass.attachTemplateNodes.apply(this,arguments);
this.popup=dojo.widget.createWidget("PopupContainer",{toggle:this.containerToggle,toggleDuration:this.containerToggleDuration});
this.containerNode=this.popup.domNode;
},fillInTemplate:function(args,frag){
this.domNode.appendChild(this.popup.domNode);
if(this.id){
this.domNode.id=this.id;
}
if(this.inputId){
this.inputNode.id=this.inputId;
}
if(this.inputName){
this.inputNode.name=this.inputName;
}
this.inputNode.style.width=this.inputWidth;
this.inputNode.disabled=this.disabled;
if(this.copyClasses){
this.inputNode.style="";
this.inputNode.className=this.getFragNodeRef(frag).className;
}
dojo.event.connect(this.inputNode,"onchange",this,"onInputChange");
},onIconClick:function(evt){
if(this.disabled){
return;
}
if(!this.popup.isShowingNow){
this.popup.open(this.inputNode,this,this.buttonNode);
}else{
this.popup.close();
}
},hideContainer:function(){
if(this.popup.isShowingNow){
this.popup.close();
}
},onInputChange:function(){
},enable:function(){
this.inputNode.disabled=false;
dojo.widget.DropdownContainer.superclass.enable.apply(this,arguments);
},disable:function(){
this.inputNode.disabled=true;
dojo.widget.DropdownContainer.superclass.disable.apply(this,arguments);
}});
dojo.provide("dojo.date.common");
dojo.date.setDayOfYear=function(_904,_905){
_904.setMonth(0);
_904.setDate(_905);
return _904;
};
dojo.date.getDayOfYear=function(_906){
var _907=_906.getFullYear();
var _908=new Date(_907-1,11,31);
return Math.floor((_906.getTime()-_908.getTime())/86400000);
};
dojo.date.setWeekOfYear=function(_909,week,_90b){
if(arguments.length==1){
_90b=0;
}
dojo.unimplemented("dojo.date.setWeekOfYear");
};
dojo.date.getWeekOfYear=function(_90c,_90d){
if(arguments.length==1){
_90d=0;
}
var _90e=new Date(_90c.getFullYear(),0,1);
var day=_90e.getDay();
_90e.setDate(_90e.getDate()-day+_90d-(day>_90d?7:0));
return Math.floor((_90c.getTime()-_90e.getTime())/604800000);
};
dojo.date.setIsoWeekOfYear=function(_910,week,_912){
if(arguments.length==1){
_912=1;
}
dojo.unimplemented("dojo.date.setIsoWeekOfYear");
};
dojo.date.getIsoWeekOfYear=function(_913,_914){
if(arguments.length==1){
_914=1;
}
dojo.unimplemented("dojo.date.getIsoWeekOfYear");
};
dojo.date.shortTimezones=["IDLW","BET","HST","MART","AKST","PST","MST","CST","EST","AST","NFT","BST","FST","AT","GMT","CET","EET","MSK","IRT","GST","AFT","AGTT","IST","NPT","ALMT","MMT","JT","AWST","JST","ACST","AEST","LHST","VUT","NFT","NZT","CHAST","PHOT","LINT"];
dojo.date.timezoneOffsets=[-720,-660,-600,-570,-540,-480,-420,-360,-300,-240,-210,-180,-120,-60,0,60,120,180,210,240,270,300,330,345,360,390,420,480,540,570,600,630,660,690,720,765,780,840];
dojo.date.getDaysInMonth=function(_915){
var _916=_915.getMonth();
var days=[31,28,31,30,31,30,31,31,30,31,30,31];
if(_916==1&&dojo.date.isLeapYear(_915)){
return 29;
}else{
return days[_916];
}
};
dojo.date.isLeapYear=function(_918){
var year=_918.getFullYear();
return (year%400==0)?true:(year%100==0)?false:(year%4==0)?true:false;
};
dojo.date.getTimezoneName=function(_91a){
var str=_91a.toString();
var tz="";
var _91d;
var pos=str.indexOf("(");
if(pos>-1){
pos++;
tz=str.substring(pos,str.indexOf(")"));
}else{
var pat=/([A-Z\/]+) \d{4}$/;
if((_91d=str.match(pat))){
tz=_91d[1];
}else{
str=_91a.toLocaleString();
pat=/ ([A-Z\/]+)$/;
if((_91d=str.match(pat))){
tz=_91d[1];
}
}
}
return tz=="AM"||tz=="PM"?"":tz;
};
dojo.date.getOrdinal=function(_920){
var date=_920.getDate();
if(date%100!=11&&date%10==1){
return "st";
}else{
if(date%100!=12&&date%10==2){
return "nd";
}else{
if(date%100!=13&&date%10==3){
return "rd";
}else{
return "th";
}
}
}
};
dojo.date.compareTypes={DATE:1,TIME:2};
dojo.date.compare=function(_922,_923,_924){
var dA=_922;
var dB=_923||new Date();
var now=new Date();
with(dojo.date.compareTypes){
var opt=_924||(DATE|TIME);
var d1=new Date((opt&DATE)?dA.getFullYear():now.getFullYear(),(opt&DATE)?dA.getMonth():now.getMonth(),(opt&DATE)?dA.getDate():now.getDate(),(opt&TIME)?dA.getHours():0,(opt&TIME)?dA.getMinutes():0,(opt&TIME)?dA.getSeconds():0);
var d2=new Date((opt&DATE)?dB.getFullYear():now.getFullYear(),(opt&DATE)?dB.getMonth():now.getMonth(),(opt&DATE)?dB.getDate():now.getDate(),(opt&TIME)?dB.getHours():0,(opt&TIME)?dB.getMinutes():0,(opt&TIME)?dB.getSeconds():0);
}
if(d1.valueOf()>d2.valueOf()){
return 1;
}
if(d1.valueOf()<d2.valueOf()){
return -1;
}
return 0;
};
dojo.date.dateParts={YEAR:0,MONTH:1,DAY:2,HOUR:3,MINUTE:4,SECOND:5,MILLISECOND:6,QUARTER:7,WEEK:8,WEEKDAY:9};
dojo.date.add=function(dt,_92c,incr){
if(typeof dt=="number"){
dt=new Date(dt);
}
function fixOvershoot(){
if(sum.getDate()<dt.getDate()){
sum.setDate(0);
}
}
var sum=new Date(dt);
with(dojo.date.dateParts){
switch(_92c){
case YEAR:
sum.setFullYear(dt.getFullYear()+incr);
fixOvershoot();
break;
case QUARTER:
incr*=3;
case MONTH:
sum.setMonth(dt.getMonth()+incr);
fixOvershoot();
break;
case WEEK:
incr*=7;
case DAY:
sum.setDate(dt.getDate()+incr);
break;
case WEEKDAY:
var dat=dt.getDate();
var _930=0;
var days=0;
var strt=0;
var trgt=0;
var adj=0;
var mod=incr%5;
if(mod==0){
days=(incr>0)?5:-5;
_930=(incr>0)?((incr-5)/5):((incr+5)/5);
}else{
days=mod;
_930=parseInt(incr/5);
}
strt=dt.getDay();
if(strt==6&&incr>0){
adj=1;
}else{
if(strt==0&&incr<0){
adj=-1;
}
}
trgt=(strt+days);
if(trgt==0||trgt==6){
adj=(incr>0)?2:-2;
}
sum.setDate(dat+(7*_930)+days+adj);
break;
case HOUR:
sum.setHours(sum.getHours()+incr);
break;
case MINUTE:
sum.setMinutes(sum.getMinutes()+incr);
break;
case SECOND:
sum.setSeconds(sum.getSeconds()+incr);
break;
case MILLISECOND:
sum.setMilliseconds(sum.getMilliseconds()+incr);
break;
default:
break;
}
}
return sum;
};
dojo.date.diff=function(dtA,dtB,_938){
if(typeof dtA=="number"){
dtA=new Date(dtA);
}
if(typeof dtB=="number"){
dtB=new Date(dtB);
}
var _939=dtB.getFullYear()-dtA.getFullYear();
var _93a=(dtB.getMonth()-dtA.getMonth())+(_939*12);
var _93b=dtB.getTime()-dtA.getTime();
var _93c=_93b/1000;
var _93d=_93c/60;
var _93e=_93d/60;
var _93f=_93e/24;
var _940=_93f/7;
var _941=0;
with(dojo.date.dateParts){
switch(_938){
case YEAR:
_941=_939;
break;
case QUARTER:
var mA=dtA.getMonth();
var mB=dtB.getMonth();
var qA=Math.floor(mA/3)+1;
var qB=Math.floor(mB/3)+1;
qB+=(_939*4);
_941=qB-qA;
break;
case MONTH:
_941=_93a;
break;
case WEEK:
_941=parseInt(_940);
break;
case DAY:
_941=_93f;
break;
case WEEKDAY:
var days=Math.round(_93f);
var _947=parseInt(days/7);
var mod=days%7;
if(mod==0){
days=_947*5;
}else{
var adj=0;
var aDay=dtA.getDay();
var bDay=dtB.getDay();
_947=parseInt(days/7);
mod=days%7;
var _94c=new Date(dtA);
_94c.setDate(_94c.getDate()+(_947*7));
var _94d=_94c.getDay();
if(_93f>0){
switch(true){
case aDay==6:
adj=-1;
break;
case aDay==0:
adj=0;
break;
case bDay==6:
adj=-1;
break;
case bDay==0:
adj=-2;
break;
case (_94d+mod)>5:
adj=-2;
break;
default:
break;
}
}else{
if(_93f<0){
switch(true){
case aDay==6:
adj=0;
break;
case aDay==0:
adj=1;
break;
case bDay==6:
adj=2;
break;
case bDay==0:
adj=1;
break;
case (_94d+mod)<0:
adj=2;
break;
default:
break;
}
}
}
days+=adj;
days-=(_947*2);
}
_941=days;
break;
case HOUR:
_941=_93e;
break;
case MINUTE:
_941=_93d;
break;
case SECOND:
_941=_93c;
break;
case MILLISECOND:
_941=_93b;
break;
default:
break;
}
}
return Math.round(_941);
};
dojo.provide("dojo.date.supplemental");
dojo.date.getFirstDayOfWeek=function(_94e){
var _94f={mv:5,ae:6,af:6,bh:6,dj:6,dz:6,eg:6,er:6,et:6,iq:6,ir:6,jo:6,ke:6,kw:6,lb:6,ly:6,ma:6,om:6,qa:6,sa:6,sd:6,so:6,tn:6,ye:6,as:0,au:0,az:0,bw:0,ca:0,cn:0,fo:0,ge:0,gl:0,gu:0,hk:0,ie:0,il:0,is:0,jm:0,jp:0,kg:0,kr:0,la:0,mh:0,mo:0,mp:0,mt:0,nz:0,ph:0,pk:0,sg:0,th:0,tt:0,tw:0,um:0,us:0,uz:0,vi:0,za:0,zw:0,et:0,mw:0,ng:0,tj:0,gb:0,sy:4};
_94e=dojo.hostenv.normalizeLocale(_94e);
var _950=_94e.split("-")[1];
var dow=_94f[_950];
return (typeof dow=="undefined")?1:dow;
};
dojo.date.getWeekend=function(_952){
var _953={eg:5,il:5,sy:5,"in":0,ae:4,bh:4,dz:4,iq:4,jo:4,kw:4,lb:4,ly:4,ma:4,om:4,qa:4,sa:4,sd:4,tn:4,ye:4};
var _954={ae:5,bh:5,dz:5,iq:5,jo:5,kw:5,lb:5,ly:5,ma:5,om:5,qa:5,sa:5,sd:5,tn:5,ye:5,af:5,ir:5,eg:6,il:6,sy:6};
_952=dojo.hostenv.normalizeLocale(_952);
var _955=_952.split("-")[1];
var _956=_953[_955];
var end=_954[_955];
if(typeof _956=="undefined"){
_956=6;
}
if(typeof end=="undefined"){
end=0;
}
return {start:_956,end:end};
};
dojo.date.isWeekend=function(_958,_959){
var _95a=dojo.date.getWeekend(_959);
var day=(_958||new Date()).getDay();
if(_95a.end<_95a.start){
_95a.end+=7;
if(day<_95a.start){
day+=7;
}
}
return day>=_95a.start&&day<=_95a.end;
};
dojo.provide("dojo.i18n.common");
dojo.i18n.getLocalization=function(_95c,_95d,_95e){
dojo.hostenv.preloadLocalizations();
_95e=dojo.hostenv.normalizeLocale(_95e);
var _95f=_95e.split("-");
var _960=[_95c,"nls",_95d].join(".");
var _961=dojo.hostenv.findModule(_960,true);
var _962;
for(var i=_95f.length;i>0;i--){
var loc=_95f.slice(0,i).join("_");
if(_961[loc]){
_962=_961[loc];
break;
}
}
if(!_962){
_962=_961.ROOT;
}
if(_962){
var _965=function(){
};
_965.prototype=_962;
return new _965();
}
dojo.raise("Bundle not found: "+_95d+" in "+_95c+" , locale="+_95e);
};
dojo.i18n.isLTR=function(_966){
var lang=dojo.hostenv.normalizeLocale(_966).split("-")[0];
var RTL={ar:true,fa:true,he:true,ur:true,yi:true};
return !RTL[lang];
};
dojo.provide("dojo.date.format");
(function(){
dojo.date.format=function(_969,_96a){
if(typeof _96a=="string"){
dojo.deprecated("dojo.date.format","To format dates with POSIX-style strings, please use dojo.date.strftime instead","0.5");
return dojo.date.strftime(_969,_96a);
}
function formatPattern(_96b,_96c){
return _96c.replace(/([a-z])\1*/ig,function(_96d){
var s;
var c=_96d.charAt(0);
var l=_96d.length;
var pad;
var _972=["abbr","wide","narrow"];
switch(c){
case "G":
if(l>3){
dojo.unimplemented("Era format not implemented");
}
s=info.eras[_96b.getFullYear()<0?1:0];
break;
case "y":
s=_96b.getFullYear();
switch(l){
case 1:
break;
case 2:
s=String(s).substr(-2);
break;
default:
pad=true;
}
break;
case "Q":
case "q":
s=Math.ceil((_96b.getMonth()+1)/3);
switch(l){
case 1:
case 2:
pad=true;
break;
case 3:
case 4:
dojo.unimplemented("Quarter format not implemented");
}
break;
case "M":
case "L":
var m=_96b.getMonth();
var _975;
switch(l){
case 1:
case 2:
s=m+1;
pad=true;
break;
case 3:
case 4:
case 5:
_975=_972[l-3];
break;
}
if(_975){
var type=(c=="L")?"standalone":"format";
var prop=["months",type,_975].join("-");
s=info[prop][m];
}
break;
case "w":
var _978=0;
s=dojo.date.getWeekOfYear(_96b,_978);
pad=true;
break;
case "d":
s=_96b.getDate();
pad=true;
break;
case "D":
s=dojo.date.getDayOfYear(_96b);
pad=true;
break;
case "E":
case "e":
case "c":
var d=_96b.getDay();
var _975;
switch(l){
case 1:
case 2:
if(c=="e"){
var _97a=dojo.date.getFirstDayOfWeek(_96a.locale);
d=(d-_97a+7)%7;
}
if(c!="c"){
s=d+1;
pad=true;
break;
}
case 3:
case 4:
case 5:
_975=_972[l-3];
break;
}
if(_975){
var type=(c=="c")?"standalone":"format";
var prop=["days",type,_975].join("-");
s=info[prop][d];
}
break;
case "a":
var _97b=(_96b.getHours()<12)?"am":"pm";
s=info[_97b];
break;
case "h":
case "H":
case "K":
case "k":
var h=_96b.getHours();
switch(c){
case "h":
s=(h%12)||12;
break;
case "H":
s=h;
break;
case "K":
s=(h%12);
break;
case "k":
s=h||24;
break;
}
pad=true;
break;
case "m":
s=_96b.getMinutes();
pad=true;
break;
case "s":
s=_96b.getSeconds();
pad=true;
break;
case "S":
s=Math.round(_96b.getMilliseconds()*Math.pow(10,l-3));
break;
case "v":
case "z":
s=dojo.date.getTimezoneName(_96b);
if(s){
break;
}
l=4;
case "Z":
var _97d=_96b.getTimezoneOffset();
var tz=[(_97d<=0?"+":"-"),dojo.string.pad(Math.floor(Math.abs(_97d)/60),2),dojo.string.pad(Math.abs(_97d)%60,2)];
if(l==4){
tz.splice(0,0,"GMT");
tz.splice(3,0,":");
}
s=tz.join("");
break;
case "Y":
case "u":
case "W":
case "F":
case "g":
case "A":
dojo.debug(_96d+" modifier not yet implemented");
s="?";
break;
default:
dojo.raise("dojo.date.format: invalid pattern char: "+_96c);
}
if(pad){
s=dojo.string.pad(s,l);
}
return s;
});
}
_96a=_96a||{};
var _97f=dojo.hostenv.normalizeLocale(_96a.locale);
var _980=_96a.formatLength||"full";
var info=dojo.date._getGregorianBundle(_97f);
var str=[];
var _982=dojo.lang.curry(this,formatPattern,_969);
if(_96a.selector!="timeOnly"){
var _983=_96a.datePattern||info["dateFormat-"+_980];
if(_983){
str.push(_processPattern(_983,_982));
}
}
if(_96a.selector!="dateOnly"){
var _984=_96a.timePattern||info["timeFormat-"+_980];
if(_984){
str.push(_processPattern(_984,_982));
}
}
var _985=str.join(" ");
return _985;
};
dojo.date.parse=function(_986,_987){
_987=_987||{};
var _988=dojo.hostenv.normalizeLocale(_987.locale);
var info=dojo.date._getGregorianBundle(_988);
var _98a=_987.formatLength||"full";
if(!_987.selector){
_987.selector="dateOnly";
}
var _98b=_987.datePattern||info["dateFormat-"+_98a];
var _98c=_987.timePattern||info["timeFormat-"+_98a];
var _98d;
if(_987.selector=="dateOnly"){
_98d=_98b;
}else{
if(_987.selector=="timeOnly"){
_98d=_98c;
}else{
if(_987.selector=="dateTime"){
_98d=_98b+" "+_98c;
}else{
var msg="dojo.date.parse: Unknown selector param passed: '"+_987.selector+"'.";
msg+=" Defaulting to date pattern.";
dojo.debug(msg);
_98d=_98b;
}
}
}
var _98f=[];
var _990=_processPattern(_98d,dojo.lang.curry(this,_buildDateTimeRE,_98f,info,_987));
var _991=new RegExp("^"+_990+"$");
var _992=_991.exec(_986);
if(!_992){
return null;
}
var _993=["abbr","wide","narrow"];
var _994=new Date(1972,0);
var _995={};
for(var i=1;i<_992.length;i++){
var grp=_98f[i-1];
var l=grp.length;
var v=_992[i];
switch(grp.charAt(0)){
case "y":
if(l!=2){
_994.setFullYear(v);
_995.year=v;
}else{
if(v<100){
v=Number(v);
var year=""+new Date().getFullYear();
var _99b=year.substring(0,2)*100;
var _99c=Number(year.substring(2,4));
var _99d=Math.min(_99c+20,99);
var num=(v<_99d)?_99b+v:_99b-100+v;
_994.setFullYear(num);
_995.year=num;
}else{
if(_987.strict){
return null;
}
_994.setFullYear(v);
_995.year=v;
}
}
break;
case "M":
if(l>2){
if(!_987.strict){
v=v.replace(/\./g,"");
v=v.toLowerCase();
}
var _99f=info["months-format-"+_993[l-3]].concat();
for(var j=0;j<_99f.length;j++){
if(!_987.strict){
_99f[j]=_99f[j].toLowerCase();
}
if(v==_99f[j]){
_994.setMonth(j);
_995.month=j;
break;
}
}
if(j==_99f.length){
dojo.debug("dojo.date.parse: Could not parse month name: '"+v+"'.");
return null;
}
}else{
_994.setMonth(v-1);
_995.month=v-1;
}
break;
case "E":
case "e":
if(!_987.strict){
v=v.toLowerCase();
}
var days=info["days-format-"+_993[l-3]].concat();
for(var j=0;j<days.length;j++){
if(!_987.strict){
days[j]=days[j].toLowerCase();
}
if(v==days[j]){
break;
}
}
if(j==days.length){
dojo.debug("dojo.date.parse: Could not parse weekday name: '"+v+"'.");
return null;
}
break;
case "d":
_994.setDate(v);
_995.date=v;
break;
case "a":
var am=_987.am||info.am;
var pm=_987.pm||info.pm;
if(!_987.strict){
v=v.replace(/\./g,"").toLowerCase();
am=am.replace(/\./g,"").toLowerCase();
pm=pm.replace(/\./g,"").toLowerCase();
}
if(_987.strict&&v!=am&&v!=pm){
dojo.debug("dojo.date.parse: Could not parse am/pm part.");
return null;
}
var _9a4=_994.getHours();
if(v==pm&&_9a4<12){
_994.setHours(_9a4+12);
}else{
if(v==am&&_9a4==12){
_994.setHours(0);
}
}
break;
case "K":
if(v==24){
v=0;
}
case "h":
case "H":
case "k":
if(v>23){
dojo.debug("dojo.date.parse: Illegal hours value");
return null;
}
_994.setHours(v);
break;
case "m":
_994.setMinutes(v);
break;
case "s":
_994.setSeconds(v);
break;
case "S":
_994.setMilliseconds(v);
break;
default:
dojo.unimplemented("dojo.date.parse: unsupported pattern char="+grp.charAt(0));
}
}
if(_995.year&&_994.getFullYear()!=_995.year){
dojo.debug("Parsed year: '"+_994.getFullYear()+"' did not match input year: '"+_995.year+"'.");
return null;
}
if(_995.month&&_994.getMonth()!=_995.month){
dojo.debug("Parsed month: '"+_994.getMonth()+"' did not match input month: '"+_995.month+"'.");
return null;
}
if(_995.date&&_994.getDate()!=_995.date){
dojo.debug("Parsed day of month: '"+_994.getDate()+"' did not match input day of month: '"+_995.date+"'.");
return null;
}
return _994;
};
function _processPattern(_9a5,_9a6,_9a7,_9a8){
var _9a9=function(x){
return x;
};
_9a6=_9a6||_9a9;
_9a7=_9a7||_9a9;
_9a8=_9a8||_9a9;
var _9ab=_9a5.match(/(''|[^'])+/g);
var _9ac=false;
for(var i=0;i<_9ab.length;i++){
if(!_9ab[i]){
_9ab[i]="";
}else{
_9ab[i]=(_9ac?_9a7:_9a6)(_9ab[i]);
_9ac=!_9ac;
}
}
return _9a8(_9ab.join(""));
}
function _buildDateTimeRE(_9ae,info,_9b0,_9b1){
return _9b1.replace(/([a-z])\1*/ig,function(_9b2){
var s;
var c=_9b2.charAt(0);
var l=_9b2.length;
switch(c){
case "y":
s="\\d"+((l==2)?"{2,4}":"+");
break;
case "M":
s=(l>2)?"\\S+":"\\d{1,2}";
break;
case "d":
s="\\d{1,2}";
break;
case "E":
s="\\S+";
break;
case "h":
case "H":
case "K":
case "k":
s="\\d{1,2}";
break;
case "m":
case "s":
s="[0-5]\\d";
break;
case "S":
s="\\d{1,3}";
break;
case "a":
var am=_9b0.am||info.am||"AM";
var pm=_9b0.pm||info.pm||"PM";
if(_9b0.strict){
s=am+"|"+pm;
}else{
s=am;
s+=(am!=am.toLowerCase())?"|"+am.toLowerCase():"";
s+="|";
s+=(pm!=pm.toLowerCase())?pm+"|"+pm.toLowerCase():pm;
}
break;
default:
dojo.unimplemented("parse of date format, pattern="+_9b1);
}
if(_9ae){
_9ae.push(_9b2);
}
return "\\s*("+s+")\\s*";
});
}
})();
dojo.date.strftime=function(_9b8,_9b9,_9ba){
var _9bb=null;
function _(s,n){
return dojo.string.pad(s,n||2,_9bb||"0");
}
var info=dojo.date._getGregorianBundle(_9ba);
function $(_9bf){
switch(_9bf){
case "a":
return dojo.date.getDayShortName(_9b8,_9ba);
case "A":
return dojo.date.getDayName(_9b8,_9ba);
case "b":
case "h":
return dojo.date.getMonthShortName(_9b8,_9ba);
case "B":
return dojo.date.getMonthName(_9b8,_9ba);
case "c":
return dojo.date.format(_9b8,{locale:_9ba});
case "C":
return _(Math.floor(_9b8.getFullYear()/100));
case "d":
return _(_9b8.getDate());
case "D":
return $("m")+"/"+$("d")+"/"+$("y");
case "e":
if(_9bb==null){
_9bb=" ";
}
return _(_9b8.getDate());
case "f":
if(_9bb==null){
_9bb=" ";
}
return _(_9b8.getMonth()+1);
case "g":
break;
case "G":
dojo.unimplemented("unimplemented modifier 'G'");
break;
case "F":
return $("Y")+"-"+$("m")+"-"+$("d");
case "H":
return _(_9b8.getHours());
case "I":
return _(_9b8.getHours()%12||12);
case "j":
return _(dojo.date.getDayOfYear(_9b8),3);
case "k":
if(_9bb==null){
_9bb=" ";
}
return _(_9b8.getHours());
case "l":
if(_9bb==null){
_9bb=" ";
}
return _(_9b8.getHours()%12||12);
case "m":
return _(_9b8.getMonth()+1);
case "M":
return _(_9b8.getMinutes());
case "n":
return "\n";
case "p":
return info[_9b8.getHours()<12?"am":"pm"];
case "r":
return $("I")+":"+$("M")+":"+$("S")+" "+$("p");
case "R":
return $("H")+":"+$("M");
case "S":
return _(_9b8.getSeconds());
case "t":
return "\t";
case "T":
return $("H")+":"+$("M")+":"+$("S");
case "u":
return String(_9b8.getDay()||7);
case "U":
return _(dojo.date.getWeekOfYear(_9b8));
case "V":
return _(dojo.date.getIsoWeekOfYear(_9b8));
case "W":
return _(dojo.date.getWeekOfYear(_9b8,1));
case "w":
return String(_9b8.getDay());
case "x":
return dojo.date.format(_9b8,{selector:"dateOnly",locale:_9ba});
case "X":
return dojo.date.format(_9b8,{selector:"timeOnly",locale:_9ba});
case "y":
return _(_9b8.getFullYear()%100);
case "Y":
return String(_9b8.getFullYear());
case "z":
var _9c0=_9b8.getTimezoneOffset();
return (_9c0>0?"-":"+")+_(Math.floor(Math.abs(_9c0)/60))+":"+_(Math.abs(_9c0)%60);
case "Z":
return dojo.date.getTimezoneName(_9b8);
case "%":
return "%";
}
}
var _9c1="";
var i=0;
var _9c3=0;
var _9c4=null;
while((_9c3=_9b9.indexOf("%",i))!=-1){
_9c1+=_9b9.substring(i,_9c3++);
switch(_9b9.charAt(_9c3++)){
case "_":
_9bb=" ";
break;
case "-":
_9bb="";
break;
case "0":
_9bb="0";
break;
case "^":
_9c4="upper";
break;
case "*":
_9c4="lower";
break;
case "#":
_9c4="swap";
break;
default:
_9bb=null;
_9c3--;
break;
}
var _9c5=$(_9b9.charAt(_9c3++));
switch(_9c4){
case "upper":
_9c5=_9c5.toUpperCase();
break;
case "lower":
_9c5=_9c5.toLowerCase();
break;
case "swap":
var _9c6=_9c5.toLowerCase();
var _9c7="";
var j=0;
var ch="";
while(j<_9c5.length){
ch=_9c5.charAt(j);
_9c7+=(ch==_9c6.charAt(j))?ch.toUpperCase():ch.toLowerCase();
j++;
}
_9c5=_9c7;
break;
default:
break;
}
_9c4=null;
_9c1+=_9c5;
i=_9c3;
}
_9c1+=_9b9.substring(i);
return _9c1;
};
(function(){
var _9ca=[];
dojo.date.addCustomFormats=function(_9cb,_9cc){
_9ca.push({pkg:_9cb,name:_9cc});
};
dojo.date._getGregorianBundle=function(_9cd){
var _9ce={};
dojo.lang.forEach(_9ca,function(desc){
var _9d0=dojo.i18n.getLocalization(desc.pkg,desc.name,_9cd);
_9ce=dojo.lang.mixin(_9ce,_9d0);
},this);
return _9ce;
};
})();
dojo.date.addCustomFormats("dojo.i18n.calendar","gregorian");
dojo.date.addCustomFormats("dojo.i18n.calendar","gregorianExtras");
dojo.date.getNames=function(item,type,use,_9d4){
var _9d5;
var _9d6=dojo.date._getGregorianBundle(_9d4);
var _9d7=[item,use,type];
if(use=="standAlone"){
_9d5=_9d6[_9d7.join("-")];
}
_9d7[1]="format";
return (_9d5||_9d6[_9d7.join("-")]).concat();
};
dojo.date.getDayName=function(_9d8,_9d9){
return dojo.date.getNames("days","wide","format",_9d9)[_9d8.getDay()];
};
dojo.date.getDayShortName=function(_9da,_9db){
return dojo.date.getNames("days","abbr","format",_9db)[_9da.getDay()];
};
dojo.date.getMonthName=function(_9dc,_9dd){
return dojo.date.getNames("months","wide","format",_9dd)[_9dc.getMonth()];
};
dojo.date.getMonthShortName=function(_9de,_9df){
return dojo.date.getNames("months","abbr","format",_9df)[_9de.getMonth()];
};
dojo.date.toRelativeString=function(_9e0){
var now=new Date();
var diff=(now-_9e0)/1000;
var end=" ago";
var _9e4=false;
if(diff<0){
_9e4=true;
end=" from now";
diff=-diff;
}
if(diff<60){
diff=Math.round(diff);
return diff+" second"+(diff==1?"":"s")+end;
}
if(diff<60*60){
diff=Math.round(diff/60);
return diff+" minute"+(diff==1?"":"s")+end;
}
if(diff<60*60*24){
diff=Math.round(diff/3600);
return diff+" hour"+(diff==1?"":"s")+end;
}
if(diff<60*60*24*7){
diff=Math.round(diff/(3600*24));
if(diff==1){
return _9e4?"Tomorrow":"Yesterday";
}else{
return diff+" days"+end;
}
}
return dojo.date.format(_9e0);
};
dojo.date.toSql=function(_9e5,_9e6){
return dojo.date.strftime(_9e5,"%F"+!_9e6?" %T":"");
};
dojo.date.fromSql=function(_9e7){
var _9e8=_9e7.split(/[\- :]/g);
while(_9e8.length<6){
_9e8.push(0);
}
return new Date(_9e8[0],(parseInt(_9e8[1],10)-1),_9e8[2],_9e8[3],_9e8[4],_9e8[5]);
};
dojo.provide("dojo.date.serialize");
dojo.date.setIso8601=function(_9e9,_9ea){
var _9eb=(_9ea.indexOf("T")==-1)?_9ea.split(" "):_9ea.split("T");
_9e9=dojo.date.setIso8601Date(_9e9,_9eb[0]);
if(_9eb.length==2){
_9e9=dojo.date.setIso8601Time(_9e9,_9eb[1]);
}
return _9e9;
};
dojo.date.fromIso8601=function(_9ec){
return dojo.date.setIso8601(new Date(0,0),_9ec);
};
dojo.date.setIso8601Date=function(_9ed,_9ee){
var _9ef="^([0-9]{4})((-?([0-9]{2})(-?([0-9]{2}))?)|"+"(-?([0-9]{3}))|(-?W([0-9]{2})(-?([1-7]))?))?$";
var d=_9ee.match(new RegExp(_9ef));
if(!d){
dojo.debug("invalid date string: "+_9ee);
return null;
}
var year=d[1];
var _9f2=d[4];
var date=d[6];
var _9f4=d[8];
var week=d[10];
var _9f6=d[12]?d[12]:1;
_9ed.setFullYear(year);
if(_9f4){
_9ed.setMonth(0);
_9ed.setDate(Number(_9f4));
}else{
if(week){
_9ed.setMonth(0);
_9ed.setDate(1);
var gd=_9ed.getDay();
var day=gd?gd:7;
var _9f9=Number(_9f6)+(7*Number(week));
if(day<=4){
_9ed.setDate(_9f9+1-day);
}else{
_9ed.setDate(_9f9+8-day);
}
}else{
if(_9f2){
_9ed.setDate(1);
_9ed.setMonth(_9f2-1);
}
if(date){
_9ed.setDate(date);
}
}
}
return _9ed;
};
dojo.date.fromIso8601Date=function(_9fa){
return dojo.date.setIso8601Date(new Date(0,0),_9fa);
};
dojo.date.setIso8601Time=function(_9fb,_9fc){
var _9fd="Z|(([-+])([0-9]{2})(:?([0-9]{2}))?)$";
var d=_9fc.match(new RegExp(_9fd));
var _9ff=0;
if(d){
if(d[0]!="Z"){
_9ff=(Number(d[3])*60)+Number(d[5]);
_9ff*=((d[2]=="-")?1:-1);
}
_9ff-=_9fb.getTimezoneOffset();
_9fc=_9fc.substr(0,_9fc.length-d[0].length);
}
var _a00="^([0-9]{2})(:?([0-9]{2})(:?([0-9]{2})(.([0-9]+))?)?)?$";
d=_9fc.match(new RegExp(_a00));
if(!d){
dojo.debug("invalid time string: "+_9fc);
return null;
}
var _a01=d[1];
var mins=Number((d[3])?d[3]:0);
var secs=(d[5])?d[5]:0;
var ms=d[7]?(Number("0."+d[7])*1000):0;
_9fb.setHours(_a01);
_9fb.setMinutes(mins);
_9fb.setSeconds(secs);
_9fb.setMilliseconds(ms);
if(_9ff!==0){
_9fb.setTime(_9fb.getTime()+_9ff*60000);
}
return _9fb;
};
dojo.date.fromIso8601Time=function(_a05){
return dojo.date.setIso8601Time(new Date(0,0),_a05);
};
dojo.date.toRfc3339=function(_a06,_a07){
if(!_a06){
_a06=new Date();
}
var _=dojo.string.pad;
var _a09=[];
if(_a07!="timeOnly"){
var date=[_(_a06.getFullYear(),4),_(_a06.getMonth()+1,2),_(_a06.getDate(),2)].join("-");
_a09.push(date);
}
if(_a07!="dateOnly"){
var time=[_(_a06.getHours(),2),_(_a06.getMinutes(),2),_(_a06.getSeconds(),2)].join(":");
var _a0c=_a06.getTimezoneOffset();
time+=(_a0c>0?"-":"+")+_(Math.floor(Math.abs(_a0c)/60),2)+":"+_(Math.abs(_a0c)%60,2);
_a09.push(time);
}
return _a09.join("T");
};
dojo.date.fromRfc3339=function(_a0d){
if(_a0d.indexOf("Tany")!=-1){
_a0d=_a0d.replace("Tany","");
}
var _a0e=new Date();
return dojo.date.setIso8601(_a0e,_a0d);
};
dojo.provide("dojo.widget.DatePicker");
dojo.widget.defineWidget("dojo.widget.DatePicker",dojo.widget.HtmlWidget,{value:"",name:"",displayWeeks:6,adjustWeeks:false,startDate:"1492-10-12",endDate:"2941-10-12",weekStartsOn:"",staticDisplay:false,dayWidth:"narrow",classNames:{previous:"previousMonth",disabledPrevious:"previousMonthDisabled",current:"currentMonth",disabledCurrent:"currentMonthDisabled",next:"nextMonth",disabledNext:"nextMonthDisabled",currentDate:"currentDate",selectedDate:"selectedDate"},templateString:"<div class=\"datePickerContainer\" dojoAttachPoint=\"datePickerContainerNode\">\n\t<table cellspacing=\"0\" cellpadding=\"0\" class=\"calendarContainer\">\n\t\t<thead>\n\t\t\t<tr>\n\t\t\t\t<td class=\"monthWrapper\" valign=\"top\">\n\t\t\t\t\t<table class=\"monthContainer\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td class=\"monthCurve monthCurveTL\" valign=\"top\"></td>\n\t\t\t\t\t\t\t<td class=\"monthLabelContainer\" valign=\"top\">\n\t\t\t\t\t\t\t\t<span dojoAttachPoint=\"increaseWeekNode\" \n\t\t\t\t\t\t\t\t\tdojoAttachEvent=\"onClick: onIncrementWeek;\" \n\t\t\t\t\t\t\t\t\tclass=\"incrementControl increase\">\n\t\t\t\t\t\t\t\t\t<img src=\"${dojoWidgetModuleUri}templates/images/incrementMonth.png\" \n\t\t\t\t\t\t\t\t\talt=\"&darr;\" style=\"width:7px;height:5px;\" />\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t<span \n\t\t\t\t\t\t\t\t\tdojoAttachPoint=\"increaseMonthNode\" \n\t\t\t\t\t\t\t\t\tdojoAttachEvent=\"onClick: onIncrementMonth;\" class=\"incrementControl increase\">\n\t\t\t\t\t\t\t\t\t<img src=\"${dojoWidgetModuleUri}templates/images/incrementMonth.png\" \n\t\t\t\t\t\t\t\t\t\talt=\"&darr;\"  dojoAttachPoint=\"incrementMonthImageNode\">\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t<span \n\t\t\t\t\t\t\t\t\tdojoAttachPoint=\"decreaseWeekNode\" \n\t\t\t\t\t\t\t\t\tdojoAttachEvent=\"onClick: onIncrementWeek;\" \n\t\t\t\t\t\t\t\t\tclass=\"incrementControl decrease\">\n\t\t\t\t\t\t\t\t\t<img src=\"${dojoWidgetModuleUri}templates/images/decrementMonth.png\" alt=\"&uarr;\" style=\"width:7px;height:5px;\" />\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t<span \n\t\t\t\t\t\t\t\t\tdojoAttachPoint=\"decreaseMonthNode\" \n\t\t\t\t\t\t\t\t\tdojoAttachEvent=\"onClick: onIncrementMonth;\" class=\"incrementControl decrease\">\n\t\t\t\t\t\t\t\t\t<img src=\"${dojoWidgetModuleUri}templates/images/decrementMonth.png\" \n\t\t\t\t\t\t\t\t\t\talt=\"&uarr;\" dojoAttachPoint=\"decrementMonthImageNode\">\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t<span dojoAttachPoint=\"monthLabelNode\" class=\"month\"></span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td class=\"monthCurve monthCurveTR\" valign=\"top\"></td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</thead>\n\t\t<tbody>\n\t\t\t<tr>\n\t\t\t\t<td colspan=\"3\">\n\t\t\t\t\t<table class=\"calendarBodyContainer\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t<tr dojoAttachPoint=\"dayLabelsRow\">\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody dojoAttachPoint=\"calendarDatesContainerNode\" \n\t\t\t\t\t\t\tdojoAttachEvent=\"onClick: _handleUiClick;\">\n\t\t\t\t\t\t\t<tr dojoAttachPoint=\"calendarWeekTemplate\">\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t\t<td></td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t\t<tfoot>\n\t\t\t<tr>\n\t\t\t\t<td colspan=\"3\" class=\"yearWrapper\">\n\t\t\t\t\t<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" class=\"yearContainer\">\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td class=\"curveBL\" valign=\"top\"></td>\n\t\t\t\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t\t\t\t<h3 class=\"yearLabel\">\n\t\t\t\t\t\t\t\t\t<span dojoAttachPoint=\"previousYearLabelNode\"\n\t\t\t\t\t\t\t\t\t\tdojoAttachEvent=\"onClick: onIncrementYear;\" class=\"previousYear\"></span>\n\t\t\t\t\t\t\t\t\t<span class=\"selectedYear\" dojoAttachPoint=\"currentYearLabelNode\"></span>\n\t\t\t\t\t\t\t\t\t<span dojoAttachPoint=\"nextYearLabelNode\" \n\t\t\t\t\t\t\t\t\t\tdojoAttachEvent=\"onClick: onIncrementYear;\" class=\"nextYear\"></span>\n\t\t\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td class=\"curveBR\" valign=\"top\"></td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</table>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</tfoot>\n\t</table>\n</div>\n",templateCssString:".datePickerContainer {\n\twidth:164px; /* needed for proper user styling */\n}\n\n.calendarContainer {\n/*\tborder:1px solid #566f8f;*/\n}\n\n.calendarBodyContainer {\n\twidth:100%; /* needed for the explode effect (explain?) */\n\tbackground: #7591bc url(\"images/dpBg.gif\") top left repeat-x;\n}\n\n.calendarBodyContainer thead tr td {\n\tcolor:#293a4b;\n\tfont:bold 0.75em Helvetica, Arial, Verdana, sans-serif;\n\ttext-align:center;\n\tpadding:0.25em;\n\tbackground: url(\"images/dpHorizLine.gif\") bottom left repeat-x;\n}\n\n.calendarBodyContainer tbody tr td {\n\tcolor:#fff;\n\tfont:bold 0.7em Helvetica, Arial, Verdana, sans-serif;\n\ttext-align:center;\n\tpadding:0.4em;\n\tbackground: url(\"images/dpVertLine.gif\") top right repeat-y;\n\tcursor:pointer;\n\tcursor:hand;\n}\n\n\n.monthWrapper {\n\tpadding-bottom:2px;\n\tbackground: url(\"images/dpHorizLine.gif\") bottom left repeat-x;\n}\n\n.monthContainer {\n\twidth:100%;\n}\n\n.monthLabelContainer {\n\ttext-align:center;\n\tfont:bold 0.75em Helvetica, Arial, Verdana, sans-serif;\n\tbackground: url(\"images/dpMonthBg.png\") repeat-x top left !important;\n\tcolor:#293a4b;\n\tpadding:0.25em;\n}\n\n.monthCurve {\n\twidth:12px;\n}\n\n.monthCurveTL {\n\tbackground: url(\"images/dpCurveTL.png\") no-repeat top left !important;\n}\n\n.monthCurveTR {\n\t\tbackground: url(\"images/dpCurveTR.png\") no-repeat top right !important;\n}\n\n\n.yearWrapper {\n\tbackground: url(\"images/dpHorizLineFoot.gif\") top left repeat-x;\n\tpadding-top:2px;\n}\n\n.yearContainer {\n\twidth:100%;\n}\n\n.yearContainer td {\n\tbackground:url(\"images/dpYearBg.png\") top left repeat-x;\n}\n\n.yearContainer .yearLabel {\n\tmargin:0;\n\tpadding:0.45em 0 0.45em 0;\n\tcolor:#fff;\n\tfont:bold 0.75em Helvetica, Arial, Verdana, sans-serif;\n\ttext-align:center;\n}\n\n.curveBL {\n\tbackground: url(\"images/dpCurveBL.png\") bottom left no-repeat !important;\n\twidth:9px !important;\n\tpadding:0;\n\tmargin:0;\n}\n\n.curveBR {\n\tbackground: url(\"images/dpCurveBR.png\") bottom right no-repeat !important;\n\twidth:9px !important;\n\tpadding:0;\n\tmargin:0;\n}\n\n\n.previousMonth {\n\tbackground-color:#6782a8 !important;\n}\n\n.previousMonthDisabled {\n\tbackground-color:#a4a5a6 !important;\n\tcursor:default !important\n}\n.currentMonth {\n}\n\n.currentMonthDisabled {\n\tbackground-color:#bbbbbc !important;\n\tcursor:default !important\n}\n.nextMonth {\n\tbackground-color:#6782a8 !important;\n}\n.nextMonthDisabled {\n\tbackground-color:#a4a5a6 !important;\n\tcursor:default !important;\n}\n\n.currentDate {\n\ttext-decoration:underline;\n\tfont-style:italic;\n}\n\n.selectedDate {\n\tbackground-color:#fff !important;\n\tcolor:#6782a8 !important;\n}\n\n.yearLabel .selectedYear {\n\tpadding:0.2em;\n\tbackground-color:#9ec3fb !important;\n}\n\n.nextYear, .previousYear {\n\tcursor:pointer;cursor:hand;\n\tpadding:0;\n}\n\n.nextYear {\n\tmargin:0 0 0 0.55em;\n}\n\n.previousYear {\n\tmargin:0 0.55em 0 0;\n}\n\n.incrementControl {\n\tcursor:pointer;cursor:hand;\n\twidth:1em;\n}\n\n.increase {\n\tfloat:right;\n}\n\n.decrease {\n\tfloat:left;\n}\n\n.lastColumn {\n\tbackground-image:none !important;\n}\n\n\n",templateCssPath:dojo.uri.moduleUri("dojo.widget","templates/DatePicker.css"),postMixInProperties:function(){
dojo.widget.DatePicker.superclass.postMixInProperties.apply(this,arguments);
if(!this.weekStartsOn){
this.weekStartsOn=dojo.date.getFirstDayOfWeek(this.lang);
}
this.today=new Date();
this.today.setHours(0,0,0,0);
if(typeof (this.value)=="string"&&this.value.toLowerCase()=="today"){
this.value=new Date();
}else{
if(this.value&&(typeof this.value=="string")&&(this.value.split("-").length>2)){
this.value=dojo.date.fromRfc3339(this.value);
this.value.setHours(0,0,0,0);
}
}
},fillInTemplate:function(args,frag){
dojo.widget.DatePicker.superclass.fillInTemplate.apply(this,arguments);
var _a11=this.getFragNodeRef(frag);
dojo.html.copyStyle(this.domNode,_a11);
this.weekTemplate=dojo.dom.removeNode(this.calendarWeekTemplate);
this._preInitUI(this.value?this.value:this.today,false,true);
var _a12=dojo.lang.unnest(dojo.date.getNames("days",this.dayWidth,"standAlone",this.lang));
if(this.weekStartsOn>0){
for(var i=0;i<this.weekStartsOn;i++){
_a12.push(_a12.shift());
}
}
var _a14=this.dayLabelsRow.getElementsByTagName("td");
for(i=0;i<7;i++){
_a14.item(i).innerHTML=_a12[i];
}
if(this.value){
this.setValue(this.value);
}
},getValue:function(){
return dojo.date.toRfc3339(new Date(this.value),"dateOnly");
},getDate:function(){
return this.value;
},setValue:function(_a15){
this.setDate(_a15);
},setDate:function(_a16){
if(_a16==""){
this.value="";
this._preInitUI(this.curMonth,false,true);
}else{
if(typeof _a16=="string"){
this.value=dojo.date.fromRfc3339(_a16);
this.value.setHours(0,0,0,0);
}else{
this.value=new Date(_a16);
this.value.setHours(0,0,0,0);
}
}
if(this.selectedNode!=null){
dojo.html.removeClass(this.selectedNode,this.classNames.selectedDate);
}
if(this.clickedNode!=null){
dojo.debug("adding selectedDate");
dojo.html.addClass(this.clickedNode,this.classNames.selectedDate);
this.selectedNode=this.clickedNode;
}else{
this._preInitUI(this.value,false,true);
}
this.clickedNode=null;
this.onValueChanged(this.value);
},_preInitUI:function(_a17,_a18,_a19){
if(typeof (this.startDate)=="string"){
this.startDate=dojo.date.fromRfc3339(this.startDate);
}
if(typeof (this.endDate)=="string"){
this.endDate=dojo.date.fromRfc3339(this.endDate);
}
this.startDate.setHours(0,0,0,0);
this.endDate.setHours(24,0,0,-1);
if(_a17<this.startDate||_a17>this.endDate){
_a17=new Date((_a17<this.startDate)?this.startDate:this.endDate);
}
this.firstDay=this._initFirstDay(_a17,_a18);
this.selectedIsUsed=false;
this.currentIsUsed=false;
var _a1a=new Date(this.firstDay);
var _a1b=_a1a.getMonth();
this.curMonth=new Date(_a1a);
this.curMonth.setDate(_a1a.getDate()+6);
this.curMonth.setDate(1);
if(this.displayWeeks==""||this.adjustWeeks){
this.adjustWeeks=true;
this.displayWeeks=Math.ceil((dojo.date.getDaysInMonth(this.curMonth)+this._getAdjustedDay(this.curMonth))/7);
}
var days=this.displayWeeks*7;
if(dojo.date.diff(this.startDate,this.endDate,dojo.date.dateParts.DAY)<days){
this.staticDisplay=true;
if(dojo.date.diff(_a1a,this.endDate,dojo.date.dateParts.DAY)>days){
this._preInitUI(this.startDate,true,false);
_a1a=new Date(this.firstDay);
}
this.curMonth=new Date(_a1a);
this.curMonth.setDate(_a1a.getDate()+6);
this.curMonth.setDate(1);
var _a1d=(_a1a.getMonth()==this.curMonth.getMonth())?"current":"previous";
}
if(_a19){
this._initUI(days);
}
},_initUI:function(days){
dojo.dom.removeChildren(this.calendarDatesContainerNode);
for(var i=0;i<this.displayWeeks;i++){
this.calendarDatesContainerNode.appendChild(this.weekTemplate.cloneNode(true));
}
var _a20=new Date(this.firstDay);
this._setMonthLabel(this.curMonth.getMonth());
this._setYearLabels(this.curMonth.getFullYear());
var _a21=this.calendarDatesContainerNode.getElementsByTagName("td");
var _a22=this.calendarDatesContainerNode.getElementsByTagName("tr");
var _a23;
for(i=0;i<days;i++){
_a23=_a21.item(i);
_a23.innerHTML=_a20.getDate();
_a23.setAttribute("djDateValue",_a20.valueOf());
var _a24=(_a20.getMonth()!=this.curMonth.getMonth()&&Number(_a20)<Number(this.curMonth))?"previous":(_a20.getMonth()==this.curMonth.getMonth())?"current":"next";
var _a25=_a24;
if(this._isDisabledDate(_a20)){
var _a26={previous:"disabledPrevious",current:"disabledCurrent",next:"disabledNext"};
_a25=_a26[_a24];
}
dojo.html.setClass(_a23,this._getDateClassName(_a20,_a25));
if(dojo.html.hasClass(_a23,this.classNames.selectedDate)){
this.selectedNode=_a23;
}
_a20=dojo.date.add(_a20,dojo.date.dateParts.DAY,1);
}
this.lastDay=dojo.date.add(_a20,dojo.date.dateParts.DAY,-1);
this._initControls();
},_initControls:function(){
var d=this.firstDay;
var d2=this.lastDay;
var _a29,_a2a,_a2b,_a2c,_a2d,_a2e;
_a29=_a2a=_a2b=_a2c=_a2d=_a2e=!this.staticDisplay;
with(dojo.date.dateParts){
var add=dojo.date.add;
if(_a29&&add(d,DAY,(-1*(this._getAdjustedDay(d)+1)))<this.startDate){
_a29=_a2b=_a2d=false;
}
if(_a2a&&d2>this.endDate){
_a2a=_a2c=_a2e=false;
}
if(_a2b&&add(d,DAY,-1)<this.startDate){
_a2b=_a2d=false;
}
if(_a2c&&add(d2,DAY,1)>this.endDate){
_a2c=_a2e=false;
}
if(_a2d&&add(d2,YEAR,-1)<this.startDate){
_a2d=false;
}
if(_a2e&&add(d,YEAR,1)>this.endDate){
_a2e=false;
}
}
function enableControl(node,_a31){
dojo.html.setVisibility(node,_a31?"":"hidden");
}
enableControl(this.decreaseWeekNode,_a29);
enableControl(this.increaseWeekNode,_a2a);
enableControl(this.decreaseMonthNode,_a2b);
enableControl(this.increaseMonthNode,_a2c);
enableControl(this.previousYearLabelNode,_a2d);
enableControl(this.nextYearLabelNode,_a2e);
},_incrementWeek:function(evt){
var d=new Date(this.firstDay);
switch(evt.target){
case this.increaseWeekNode.getElementsByTagName("img").item(0):
case this.increaseWeekNode:
var _a34=dojo.date.add(d,dojo.date.dateParts.WEEK,1);
if(_a34<this.endDate){
d=dojo.date.add(d,dojo.date.dateParts.WEEK,1);
}
break;
case this.decreaseWeekNode.getElementsByTagName("img").item(0):
case this.decreaseWeekNode:
if(d>=this.startDate){
d=dojo.date.add(d,dojo.date.dateParts.WEEK,-1);
}
break;
}
this._preInitUI(d,true,true);
},_incrementMonth:function(evt){
var d=new Date(this.curMonth);
var _a37=new Date(this.firstDay);
switch(evt.currentTarget){
case this.increaseMonthNode.getElementsByTagName("img").item(0):
case this.increaseMonthNode:
_a37=dojo.date.add(_a37,dojo.date.dateParts.DAY,this.displayWeeks*7);
if(_a37<this.endDate){
d=dojo.date.add(d,dojo.date.dateParts.MONTH,1);
}else{
var _a38=true;
}
break;
case this.decreaseMonthNode.getElementsByTagName("img").item(0):
case this.decreaseMonthNode:
if(_a37>this.startDate){
d=dojo.date.add(d,dojo.date.dateParts.MONTH,-1);
}else{
var _a39=true;
}
break;
}
if(_a39){
d=new Date(this.startDate);
}else{
if(_a38){
d=new Date(this.endDate);
}
}
this._preInitUI(d,false,true);
},_incrementYear:function(evt){
var year=this.curMonth.getFullYear();
var _a3c=new Date(this.firstDay);
switch(evt.target){
case this.nextYearLabelNode:
_a3c=dojo.date.add(_a3c,dojo.date.dateParts.YEAR,1);
if(_a3c<this.endDate){
year++;
}else{
var _a3d=true;
}
break;
case this.previousYearLabelNode:
_a3c=dojo.date.add(_a3c,dojo.date.dateParts.YEAR,-1);
if(_a3c>this.startDate){
year--;
}else{
var _a3e=true;
}
break;
}
var d;
if(_a3e){
d=new Date(this.startDate);
}else{
if(_a3d){
d=new Date(this.endDate);
}else{
d=new Date(year,this.curMonth.getMonth(),1);
}
}
this._preInitUI(d,false,true);
},onIncrementWeek:function(evt){
evt.stopPropagation();
if(!this.staticDisplay){
this._incrementWeek(evt);
}
},onIncrementMonth:function(evt){
evt.stopPropagation();
if(!this.staticDisplay){
this._incrementMonth(evt);
}
},onIncrementYear:function(evt){
evt.stopPropagation();
if(!this.staticDisplay){
this._incrementYear(evt);
}
},_setMonthLabel:function(_a43){
this.monthLabelNode.innerHTML=dojo.date.getNames("months","wide","standAlone",this.lang)[_a43];
},_setYearLabels:function(year){
var y=year-1;
var that=this;
function f(n){
that[n+"YearLabelNode"].innerHTML=dojo.date.format(new Date(y++,0),{formatLength:"yearOnly",locale:that.lang});
}
f("previous");
f("current");
f("next");
},_getDateClassName:function(date,_a49){
var _a4a=this.classNames[_a49];
if((!this.selectedIsUsed&&this.value)&&(Number(date)==Number(this.value))){
_a4a=this.classNames.selectedDate+" "+_a4a;
this.selectedIsUsed=true;
}
if((!this.currentIsUsed)&&(Number(date)==Number(this.today))){
_a4a=_a4a+" "+this.classNames.currentDate;
this.currentIsUsed=true;
}
return _a4a;
},onClick:function(evt){
dojo.event.browser.stopEvent(evt);
},_handleUiClick:function(evt){
var _a4d=evt.target;
if(_a4d.nodeType!=dojo.dom.ELEMENT_NODE){
_a4d=_a4d.parentNode;
}
dojo.event.browser.stopEvent(evt);
this.selectedIsUsed=this.todayIsUsed=false;
if(dojo.html.hasClass(_a4d,this.classNames["disabledPrevious"])||dojo.html.hasClass(_a4d,this.classNames["disabledCurrent"])||dojo.html.hasClass(_a4d,this.classNames["disabledNext"])){
return;
}
this.clickedNode=_a4d;
this.setDate(new Date(Number(dojo.html.getAttribute(_a4d,"djDateValue"))));
},onValueChanged:function(date){
},_isDisabledDate:function(_a4f){
if(_a4f<this.startDate||_a4f>this.endDate){
return true;
}
return this.isDisabledDate(_a4f,this.lang);
},isDisabledDate:function(_a50,_a51){
return false;
},_initFirstDay:function(_a52,adj){
var d=new Date(_a52);
if(!adj){
d.setDate(1);
}
d.setDate(d.getDate()-this._getAdjustedDay(d,this.weekStartsOn));
d.setHours(0,0,0,0);
return d;
},_getAdjustedDay:function(_a55){
var days=[0,1,2,3,4,5,6];
if(this.weekStartsOn>0){
for(var i=0;i<this.weekStartsOn;i++){
days.unshift(days.pop());
}
}
return days[_a55.getDay()];
},destroy:function(){
dojo.widget.DatePicker.superclass.destroy.apply(this,arguments);
dojo.html.destroyNode(this.weekTemplate);
}});
dojo.kwCompoundRequire({common:["dojo.html.common","dojo.html.style"]});
dojo.provide("dojo.html.*");
dojo.provide("dojo.widget.DropdownDatePicker");
dojo.widget.defineWidget("dojo.widget.DropdownDatePicker",dojo.widget.DropdownContainer,{iconURL:dojo.uri.moduleUri("dojo.widget","templates/images/dateIcon.gif"),formatLength:"short",displayFormat:"",saveFormat:"",value:"",name:"",displayWeeks:6,adjustWeeks:false,startDate:"1492-10-12",endDate:"2941-10-12",weekStartsOn:"",staticDisplay:false,postMixInProperties:function(_a58,frag){
dojo.widget.DropdownDatePicker.superclass.postMixInProperties.apply(this,arguments);
var _a5a=dojo.i18n.getLocalization("dojo.widget","DropdownDatePicker",this.lang);
this.iconAlt=_a5a.selectDate;
if(typeof (this.value)=="string"&&this.value.toLowerCase()=="today"){
this.value=new Date();
}
if(this.value&&isNaN(this.value)){
var orig=this.value;
this.value=dojo.date.fromRfc3339(this.value);
if(!this.value){
this.value=new Date(orig);
dojo.deprecated("dojo.widget.DropdownDatePicker","date attributes must be passed in Rfc3339 format","0.5");
}
}
if(this.value&&!isNaN(this.value)){
this.value=new Date(this.value);
}
},fillInTemplate:function(args,frag){
dojo.widget.DropdownDatePicker.superclass.fillInTemplate.call(this,args,frag);
var _a5e={widgetContainerId:this.widgetId,lang:this.lang,value:this.value,startDate:this.startDate,endDate:this.endDate,displayWeeks:this.displayWeeks,weekStartsOn:this.weekStartsOn,adjustWeeks:this.adjustWeeks,staticDisplay:this.staticDisplay};
this.datePicker=dojo.widget.createWidget("DatePicker",_a5e,this.containerNode,"child");
dojo.event.connect(this.datePicker,"onValueChanged",this,"_updateText");
dojo.event.connect(this.inputNode,"onChange",this,"_updateText");
if(this.value){
this._updateText();
}
this.containerNode.explodeClassName="calendarBodyContainer";
this.valueNode.name=this.name;
},getValue:function(){
return this.valueNode.value;
},getDate:function(){
return this.datePicker.value;
},setValue:function(_a5f){
this.setDate(_a5f);
},setDate:function(_a60){
this.datePicker.setDate(_a60);
this._syncValueNode();
},_updateText:function(){
this.inputNode.value=this.datePicker.value?dojo.date.format(this.datePicker.value,{formatLength:this.formatLength,datePattern:this.displayFormat,selector:"dateOnly",locale:this.lang}):"";
if(this.value<this.datePicker.startDate||this.value>this.datePicker.endDate){
this.inputNode.value="";
}
this._syncValueNode();
this.onValueChanged(this.getDate());
this.hideContainer();
},onValueChanged:function(_a61){
},onInputChange:function(){
var _a62=dojo.string.trim(this.inputNode.value);
if(_a62){
var _a63=dojo.date.parse(_a62,{formatLength:this.formatLength,datePattern:this.displayFormat,selector:"dateOnly",locale:this.lang});
if(!this.datePicker._isDisabledDate(_a63)){
this.setDate(_a63);
}
}else{
if(_a62==""){
this.datePicker.setDate("");
}
this.valueNode.value=_a62;
}
if(_a62){
this._updateText();
}
},_syncValueNode:function(){
var date=this.datePicker.value;
var _a65="";
switch(this.saveFormat.toLowerCase()){
case "rfc":
case "iso":
case "":
_a65=dojo.date.toRfc3339(date,"dateOnly");
break;
case "posix":
case "unix":
_a65=Number(date);
break;
default:
if(date){
_a65=dojo.date.format(date,{datePattern:this.saveFormat,selector:"dateOnly",locale:this.lang});
}
}
this.valueNode.value=_a65;
},destroy:function(_a66){
this.datePicker.destroy(_a66);
dojo.widget.DropdownDatePicker.superclass.destroy.apply(this,arguments);
}});
dojo.provide("dojo.widget.Button");
dojo.widget.defineWidget("dojo.widget.Button",dojo.widget.HtmlWidget,{isContainer:true,caption:"",templateString:"<div dojoAttachPoint=\"buttonNode\" class=\"dojoButton\" style=\"position:relative;\" dojoAttachEvent=\"onMouseOver; onMouseOut; onMouseDown; onMouseUp; onClick:buttonClick; onKey:onKey; onFocus;\">\n  <div class=\"dojoButtonContents\" align=center dojoAttachPoint=\"containerNode\" style=\"position:absolute;z-index:2;\"></div>\n  <img dojoAttachPoint=\"leftImage\" style=\"position:absolute;left:0px;\">\n  <img dojoAttachPoint=\"centerImage\" style=\"position:absolute;z-index:1;\">\n  <img dojoAttachPoint=\"rightImage\" style=\"position:absolute;top:0px;right:0px;\">\n</div>\n",templateCssString:"/* ---- button --- */\n.dojoButton {\n\tpadding: 0 0 0 0;\n\tfont-size: 8pt;\n\twhite-space: nowrap;\n\tcursor: pointer;\n\tfont-family: Myriad, Tahoma, Verdana, sans-serif;\n}\n\n.dojoButton .dojoButtonContents {\n\tpadding: 2px 2px 2px 2px;\n\ttext-align: center;\t\t/* if icon and label are split across two lines, center icon */\n\tcolor: white;\n}\n\n.dojoButtonLeftPart .dojoButtonContents {\n\tpadding-right: 8px;\n}\n\n.dojoButtonDisabled {\n\tcursor: url(\"images/no.gif\"), default;\n}\n\n\n.dojoButtonContents img {\n\tvertical-align: middle;\t/* if icon and label are on same line, center them */\n}\n\n/* -------- colors ------------ */\n\n.dojoButtonHover .dojoButtonContents {\n}\n\n.dojoButtonDepressed .dojoButtonContents {\n\tcolor: #293a4b;\n}\n\n.dojoButtonDisabled .dojoButtonContents {\n\tcolor: #aaa;\n}\n\n\n/* ---------- drop down button specific ---------- */\n\n/* border between label and arrow (for drop down buttons */\n.dojoButton .border {\n\twidth: 1px;\n\tbackground: gray;\n}\n\n/* button arrow */\n.dojoButton .downArrow {\n\tpadding-left: 10px;\n\ttext-align: center;\n}\n\n.dojoButton.disabled .downArrow {\n\tcursor : default;\n}\n",templateCssPath:dojo.uri.moduleUri("dojo.widget","templates/ButtonTemplate.css"),inactiveImg:"templates/images/soriaButton-",activeImg:"templates/images/soriaActive-",pressedImg:"templates/images/soriaPressed-",disabledImg:"templates/images/soriaDisabled-",width2height:1/3,fillInTemplate:function(){
if(this.caption){
this.containerNode.appendChild(document.createTextNode(this.caption));
}
dojo.html.disableSelection(this.containerNode);
},postCreate:function(){
this._sizeMyself();
},_sizeMyself:function(){
if(this.domNode.parentNode){
var _a67=document.createElement("span");
dojo.html.insertBefore(_a67,this.domNode);
}
dojo.body().appendChild(this.domNode);
this._sizeMyselfHelper();
if(_a67){
dojo.html.insertBefore(this.domNode,_a67);
dojo.html.removeNode(_a67);
}
},_sizeMyselfHelper:function(){
var mb=dojo.html.getMarginBox(this.containerNode);
this.height=mb.height;
this.containerWidth=mb.width;
var _a69=this.height*this.width2height;
this.containerNode.style.left=_a69+"px";
this.leftImage.height=this.rightImage.height=this.centerImage.height=this.height;
this.leftImage.width=this.rightImage.width=_a69+1;
this.centerImage.width=this.containerWidth;
this.centerImage.style.left=_a69+"px";
this._setImage(this.disabled?this.disabledImg:this.inactiveImg);
if(this.disabled){
dojo.html.prependClass(this.domNode,"dojoButtonDisabled");
this.domNode.removeAttribute("tabIndex");
dojo.widget.wai.setAttr(this.domNode,"waiState","disabled",true);
}else{
dojo.html.removeClass(this.domNode,"dojoButtonDisabled");
this.domNode.setAttribute("tabIndex","0");
dojo.widget.wai.setAttr(this.domNode,"waiState","disabled",false);
}
this.domNode.style.height=this.height+"px";
this.domNode.style.width=(this.containerWidth+2*_a69)+"px";
},onMouseOver:function(e){
if(this.disabled){
return;
}
if(!dojo.html.hasClass(this.buttonNode,"dojoButtonHover")){
dojo.html.prependClass(this.buttonNode,"dojoButtonHover");
}
this._setImage(this.activeImg);
},onMouseDown:function(e){
if(this.disabled){
return;
}
dojo.html.prependClass(this.buttonNode,"dojoButtonDepressed");
dojo.html.removeClass(this.buttonNode,"dojoButtonHover");
this._setImage(this.pressedImg);
},onMouseUp:function(e){
if(this.disabled){
return;
}
dojo.html.prependClass(this.buttonNode,"dojoButtonHover");
dojo.html.removeClass(this.buttonNode,"dojoButtonDepressed");
this._setImage(this.activeImg);
},onMouseOut:function(e){
if(this.disabled){
return;
}
if(e.toElement&&dojo.html.isDescendantOf(e.toElement,this.buttonNode)){
return;
}
dojo.html.removeClass(this.buttonNode,"dojoButtonHover");
dojo.html.removeClass(this.buttonNode,"dojoButtonDepressed");
this._setImage(this.inactiveImg);
},onKey:function(e){
if(!e.key){
return;
}
var menu=dojo.widget.getWidgetById(this.menuId);
if(e.key==e.KEY_ENTER||e.key==" "){
this.onMouseDown(e);
this.buttonClick(e);
dojo.lang.setTimeout(this,"onMouseUp",75,e);
dojo.event.browser.stopEvent(e);
}
if(menu&&menu.isShowingNow&&e.key==e.KEY_DOWN_ARROW){
dojo.event.disconnect(this.domNode,"onblur",this,"onBlur");
}
},onFocus:function(e){
var menu=dojo.widget.getWidgetById(this.menuId);
if(menu){
dojo.event.connectOnce(this.domNode,"onblur",this,"onBlur");
}
},onBlur:function(e){
var menu=dojo.widget.getWidgetById(this.menuId);
if(!menu){
return;
}
if(menu.close&&menu.isShowingNow){
menu.close();
}
},buttonClick:function(e){
if(!this.disabled){
try{
this.domNode.focus();
}
catch(e2){
}
this.onClick(e);
}
},onClick:function(e){
},_setImage:function(_a76){
this.leftImage.src=dojo.uri.moduleUri("dojo.widget",_a76+"l.gif");
this.centerImage.src=dojo.uri.moduleUri("dojo.widget",_a76+"c.gif");
this.rightImage.src=dojo.uri.moduleUri("dojo.widget",_a76+"r.gif");
},_toggleMenu:function(_a77){
var menu=dojo.widget.getWidgetById(_a77);
if(!menu){
return;
}
if(menu.open&&!menu.isShowingNow){
var pos=dojo.html.getAbsolutePosition(this.domNode,false);
menu.open(pos.x,pos.y+this.height,this);
dojo.event.disconnect(this.domNode,"onblur",this,"onBlur");
}else{
if(menu.close&&menu.isShowingNow){
menu.close();
}else{
menu.toggle();
}
}
},setCaption:function(_a7a){
this.caption=_a7a;
this.containerNode.innerHTML=_a7a;
this._sizeMyself();
},setDisabled:function(_a7b){
this.disabled=_a7b;
this._sizeMyself();
}});
dojo.widget.defineWidget("dojo.widget.DropDownButton",dojo.widget.Button,{menuId:"",downArrow:"templates/images/whiteDownArrow.gif",disabledDownArrow:"templates/images/whiteDownArrow.gif",fillInTemplate:function(){
dojo.widget.DropDownButton.superclass.fillInTemplate.apply(this,arguments);
this.arrow=document.createElement("img");
dojo.html.setClass(this.arrow,"downArrow");
dojo.widget.wai.setAttr(this.domNode,"waiState","haspopup",this.menuId);
},_sizeMyselfHelper:function(){
this.arrow.src=dojo.uri.moduleUri("dojo.widget",this.disabled?this.disabledDownArrow:this.downArrow);
this.containerNode.appendChild(this.arrow);
dojo.widget.DropDownButton.superclass._sizeMyselfHelper.call(this);
},onClick:function(e){
this._toggleMenu(this.menuId);
}});
dojo.widget.defineWidget("dojo.widget.ComboButton",dojo.widget.Button,{menuId:"",templateString:"<div class=\"dojoButton\" style=\"position:relative;top:0px;left:0px; text-align:none;\" dojoAttachEvent=\"onKey;onFocus\">\n\n\t<div dojoAttachPoint=\"buttonNode\" class=\"dojoButtonLeftPart\" style=\"position:absolute;left:0px;top:0px;\"\n\t\tdojoAttachEvent=\"onMouseOver; onMouseOut; onMouseDown; onMouseUp; onClick:buttonClick;\">\n\t\t<div class=\"dojoButtonContents\" dojoAttachPoint=\"containerNode\" style=\"position:absolute;top:0px;right:0px;z-index:2;\"></div>\n\t\t<img dojoAttachPoint=\"leftImage\" style=\"position:absolute;left:0px;top:0px;\">\n\t\t<img dojoAttachPoint=\"centerImage\" style=\"position:absolute;right:0px;top:0px;z-index:1;\">\n\t</div>\n\n\t<div dojoAttachPoint=\"rightPart\" class=\"dojoButtonRightPart\" style=\"position:absolute;top:0px;right:0px;\"\n\t\tdojoAttachEvent=\"onMouseOver:rightOver; onMouseOut:rightOut; onMouseDown:rightDown; onMouseUp:rightUp; onClick:rightClick;\">\n\t\t<img dojoAttachPoint=\"arrowBackgroundImage\" style=\"position:absolute;top:0px;left:0px;z-index:1;\">\n\t\t<img src=\"${dojoWidgetModuleUri}templates/images/whiteDownArrow.gif\"\n\t\t  \t\tstyle=\"z-index:2;position:absolute;left:3px;top:50%;\">\n\t\t<img dojoAttachPoint=\"rightImage\" style=\"position:absolute;top:0px;right:0px;\">\n\t</div>\n\n</div>\n",splitWidth:2,arrowWidth:5,_sizeMyselfHelper:function(e){
var mb=dojo.html.getMarginBox(this.containerNode);
this.height=mb.height;
this.containerWidth=mb.width;
var _a7f=this.height/3;
if(this.disabled){
dojo.widget.wai.setAttr(this.domNode,"waiState","disabled",true);
this.domNode.removeAttribute("tabIndex");
}else{
dojo.widget.wai.setAttr(this.domNode,"waiState","disabled",false);
this.domNode.setAttribute("tabIndex","0");
}
this.leftImage.height=this.rightImage.height=this.centerImage.height=this.arrowBackgroundImage.height=this.height;
this.leftImage.width=_a7f+1;
this.centerImage.width=this.containerWidth;
this.buttonNode.style.height=this.height+"px";
this.buttonNode.style.width=_a7f+this.containerWidth+"px";
this._setImage(this.disabled?this.disabledImg:this.inactiveImg);
this.arrowBackgroundImage.width=this.arrowWidth;
this.rightImage.width=_a7f+1;
this.rightPart.style.height=this.height+"px";
this.rightPart.style.width=this.arrowWidth+_a7f+"px";
this._setImageR(this.disabled?this.disabledImg:this.inactiveImg);
this.domNode.style.height=this.height+"px";
var _a80=this.containerWidth+this.splitWidth+this.arrowWidth+2*_a7f;
this.domNode.style.width=_a80+"px";
},_setImage:function(_a81){
this.leftImage.src=dojo.uri.moduleUri("dojo.widget",_a81+"l.gif");
this.centerImage.src=dojo.uri.moduleUri("dojo.widget",_a81+"c.gif");
},rightOver:function(e){
if(this.disabled){
return;
}
dojo.html.prependClass(this.rightPart,"dojoButtonHover");
this._setImageR(this.activeImg);
},rightDown:function(e){
if(this.disabled){
return;
}
dojo.html.prependClass(this.rightPart,"dojoButtonDepressed");
dojo.html.removeClass(this.rightPart,"dojoButtonHover");
this._setImageR(this.pressedImg);
},rightUp:function(e){
if(this.disabled){
return;
}
dojo.html.prependClass(this.rightPart,"dojoButtonHover");
dojo.html.removeClass(this.rightPart,"dojoButtonDepressed");
this._setImageR(this.activeImg);
},rightOut:function(e){
if(this.disabled){
return;
}
dojo.html.removeClass(this.rightPart,"dojoButtonHover");
dojo.html.removeClass(this.rightPart,"dojoButtonDepressed");
this._setImageR(this.inactiveImg);
},rightClick:function(e){
if(this.disabled){
return;
}
try{
this.domNode.focus();
}
catch(e2){
}
this._toggleMenu(this.menuId);
},_setImageR:function(_a87){
this.arrowBackgroundImage.src=dojo.uri.moduleUri("dojo.widget",_a87+"c.gif");
this.rightImage.src=dojo.uri.moduleUri("dojo.widget",_a87+"r.gif");
},onKey:function(e){
if(!e.key){
return;
}
var menu=dojo.widget.getWidgetById(this.menuId);
if(e.key==e.KEY_ENTER||e.key==" "){
this.onMouseDown(e);
this.buttonClick(e);
dojo.lang.setTimeout(this,"onMouseUp",75,e);
dojo.event.browser.stopEvent(e);
}else{
if(e.key==e.KEY_DOWN_ARROW&&e.altKey){
this.rightDown(e);
this.rightClick(e);
dojo.lang.setTimeout(this,"rightUp",75,e);
dojo.event.browser.stopEvent(e);
}else{
if(menu&&menu.isShowingNow&&e.key==e.KEY_DOWN_ARROW){
dojo.event.disconnect(this.domNode,"onblur",this,"onBlur");
}
}
}
}});
dojo.provide("dojo.widget.Toolbar");
dojo.widget.defineWidget("dojo.widget.ToolbarContainer",dojo.widget.HtmlWidget,{isContainer:true,templateString:"<div class=\"toolbarContainer\" dojoAttachPoint=\"containerNode\"></div>",templateCssString:".toolbarContainer {\n\tborder-bottom : 0;\n\tbackground-color : #def;\n\tcolor : ButtonText;\n\tfont : Menu;\n\tbackground-image: url(images/toolbar-bg.gif);\n}\n\n.toolbar {\n\tpadding : 2px 4px;\n\tmin-height : 26px;\n\t_height : 26px;\n}\n\n.toolbarItem {\n\tfloat : left;\n\tpadding : 1px 2px;\n\tmargin : 0 2px 1px 0;\n\tcursor : pointer;\n}\n\n.toolbarItem.selected, .toolbarItem.down {\n\tmargin : 1px 1px 0 1px;\n\tpadding : 0px 1px;\n\tborder : 1px solid #bbf;\n\tbackground-color : #fafaff;\n}\n\n.toolbarButton img {\n\tvertical-align : bottom;\n}\n\n.toolbarButton span {\n\tline-height : 16px;\n\tvertical-align : middle;\n}\n\n.toolbarButton.hover {\n\tpadding : 0px 1px;\n\tborder : 1px solid #99c;\n}\n\n.toolbarItem.disabled {\n\topacity : 0.3;\n\tfilter : alpha(opacity=30);\n\tcursor : default;\n}\n\n.toolbarSeparator {\n\tcursor : default;\n}\n\n.toolbarFlexibleSpace {\n}\n",templateCssPath:dojo.uri.moduleUri("dojo.widget","templates/Toolbar.css"),getItem:function(name){
if(name instanceof dojo.widget.ToolbarItem){
return name;
}
for(var i=0;i<this.children.length;i++){
var _a8c=this.children[i];
if(_a8c instanceof dojo.widget.Toolbar){
var item=_a8c.getItem(name);
if(item){
return item;
}
}
}
return null;
},getItems:function(){
var _a8e=[];
for(var i=0;i<this.children.length;i++){
var _a90=this.children[i];
if(_a90 instanceof dojo.widget.Toolbar){
_a8e=_a8e.concat(_a90.getItems());
}
}
return _a8e;
},enable:function(){
for(var i=0;i<this.children.length;i++){
var _a92=this.children[i];
if(_a92 instanceof dojo.widget.Toolbar){
_a92.enable.apply(_a92,arguments);
}
}
},disable:function(){
for(var i=0;i<this.children.length;i++){
var _a94=this.children[i];
if(_a94 instanceof dojo.widget.Toolbar){
_a94.disable.apply(_a94,arguments);
}
}
},select:function(name){
for(var i=0;i<this.children.length;i++){
var _a97=this.children[i];
if(_a97 instanceof dojo.widget.Toolbar){
_a97.select(arguments);
}
}
},deselect:function(name){
for(var i=0;i<this.children.length;i++){
var _a9a=this.children[i];
if(_a9a instanceof dojo.widget.Toolbar){
_a9a.deselect(arguments);
}
}
},getItemsState:function(){
var _a9b={};
for(var i=0;i<this.children.length;i++){
var _a9d=this.children[i];
if(_a9d instanceof dojo.widget.Toolbar){
dojo.lang.mixin(_a9b,_a9d.getItemsState());
}
}
return _a9b;
},getItemsActiveState:function(){
var _a9e={};
for(var i=0;i<this.children.length;i++){
var _aa0=this.children[i];
if(_aa0 instanceof dojo.widget.Toolbar){
dojo.lang.mixin(_a9e,_aa0.getItemsActiveState());
}
}
return _a9e;
},getItemsSelectedState:function(){
var _aa1={};
for(var i=0;i<this.children.length;i++){
var _aa3=this.children[i];
if(_aa3 instanceof dojo.widget.Toolbar){
dojo.lang.mixin(_aa1,_aa3.getItemsSelectedState());
}
}
return _aa1;
}});
dojo.widget.defineWidget("dojo.widget.Toolbar",dojo.widget.HtmlWidget,{isContainer:true,templateString:"<div class=\"toolbar\" dojoAttachPoint=\"containerNode\" unselectable=\"on\" dojoOnMouseover=\"_onmouseover\" dojoOnMouseout=\"_onmouseout\" dojoOnClick=\"_onclick\" dojoOnMousedown=\"_onmousedown\" dojoOnMouseup=\"_onmouseup\"></div>",_getItem:function(node){
var _aa5=new Date();
var _aa6=null;
while(node&&node!=this.domNode){
if(dojo.html.hasClass(node,"toolbarItem")){
var _aa7=dojo.widget.manager.getWidgetsByFilter(function(w){
return w.domNode==node;
});
if(_aa7.length==1){
_aa6=_aa7[0];
break;
}else{
if(_aa7.length>1){
dojo.raise("Toolbar._getItem: More than one widget matches the node");
}
}
}
node=node.parentNode;
}
return _aa6;
},_onmouseover:function(e){
var _aaa=this._getItem(e.target);
if(_aaa&&_aaa._onmouseover){
_aaa._onmouseover(e);
}
},_onmouseout:function(e){
var _aac=this._getItem(e.target);
if(_aac&&_aac._onmouseout){
_aac._onmouseout(e);
}
},_onclick:function(e){
var _aae=this._getItem(e.target);
if(_aae&&_aae._onclick){
_aae._onclick(e);
}
},_onmousedown:function(e){
var _ab0=this._getItem(e.target);
if(_ab0&&_ab0._onmousedown){
_ab0._onmousedown(e);
}
},_onmouseup:function(e){
var _ab2=this._getItem(e.target);
if(_ab2&&_ab2._onmouseup){
_ab2._onmouseup(e);
}
},addChild:function(item,pos,_ab5){
var _ab6=dojo.widget.ToolbarItem.make(item,null,_ab5);
var ret=dojo.widget.Toolbar.superclass.addChild.call(this,_ab6,null,pos,null);
return ret;
},push:function(){
for(var i=0;i<arguments.length;i++){
this.addChild(arguments[i]);
}
},getItem:function(name){
if(name instanceof dojo.widget.ToolbarItem){
return name;
}
for(var i=0;i<this.children.length;i++){
var _abb=this.children[i];
if(_abb instanceof dojo.widget.ToolbarItem&&_abb._name==name){
return _abb;
}
}
return null;
},getItems:function(){
var _abc=[];
for(var i=0;i<this.children.length;i++){
var _abe=this.children[i];
if(_abe instanceof dojo.widget.ToolbarItem){
_abc.push(_abe);
}
}
return _abc;
},getItemsState:function(){
var _abf={};
for(var i=0;i<this.children.length;i++){
var _ac1=this.children[i];
if(_ac1 instanceof dojo.widget.ToolbarItem){
_abf[_ac1._name]={selected:_ac1._selected,enabled:!_ac1.disabled};
}
}
return _abf;
},getItemsActiveState:function(){
var _ac2=this.getItemsState();
for(var item in _ac2){
_ac2[item]=_ac2[item].enabled;
}
return _ac2;
},getItemsSelectedState:function(){
var _ac4=this.getItemsState();
for(var item in _ac4){
_ac4[item]=_ac4[item].selected;
}
return _ac4;
},enable:function(){
var _ac6=arguments.length?arguments:this.children;
for(var i=0;i<_ac6.length;i++){
var _ac8=this.getItem(_ac6[i]);
if(_ac8 instanceof dojo.widget.ToolbarItem){
_ac8.enable(false,true);
}
}
},disable:function(){
var _ac9=arguments.length?arguments:this.children;
for(var i=0;i<_ac9.length;i++){
var _acb=this.getItem(_ac9[i]);
if(_acb instanceof dojo.widget.ToolbarItem){
_acb.disable();
}
}
},select:function(){
for(var i=0;i<arguments.length;i++){
var name=arguments[i];
var item=this.getItem(name);
if(item){
item.select();
}
}
},deselect:function(){
for(var i=0;i<arguments.length;i++){
var name=arguments[i];
var item=this.getItem(name);
if(item){
item.disable();
}
}
},setValue:function(){
for(var i=0;i<arguments.length;i+=2){
var name=arguments[i],_ad4=arguments[i+1];
var item=this.getItem(name);
if(item){
if(item instanceof dojo.widget.ToolbarItem){
item.setValue(_ad4);
}
}
}
}});
dojo.widget.defineWidget("dojo.widget.ToolbarItem",dojo.widget.HtmlWidget,{templateString:"<span unselectable=\"on\" class=\"toolbarItem\"></span>",_name:null,getName:function(){
return this._name;
},setName:function(_ad6){
return (this._name=_ad6);
},getValue:function(){
return this.getName();
},setValue:function(_ad7){
return this.setName(_ad7);
},_selected:false,isSelected:function(){
return this._selected;
},setSelected:function(is,_ad9,_ada){
if(!this._toggleItem&&!_ad9){
return;
}
is=Boolean(is);
if(_ad9||!this.disabled&&this._selected!=is){
this._selected=is;
this.update();
if(!_ada){
this._fireEvent(is?"onSelect":"onDeselect");
this._fireEvent("onChangeSelect");
}
}
},select:function(_adb,_adc){
return this.setSelected(true,_adb,_adc);
},deselect:function(_add,_ade){
return this.setSelected(false,_add,_ade);
},_toggleItem:false,isToggleItem:function(){
return this._toggleItem;
},setToggleItem:function(_adf){
this._toggleItem=Boolean(_adf);
},toggleSelected:function(_ae0){
return this.setSelected(!this._selected,_ae0);
},isEnabled:function(){
return !this.disabled;
},setEnabled:function(is,_ae2,_ae3){
is=Boolean(is);
if(_ae2||this.disabled==is){
this.disabled=!is;
this.update();
if(!_ae3){
this._fireEvent(this.disabled?"onDisable":"onEnable");
this._fireEvent("onChangeEnabled");
}
}
return !this.disabled;
},enable:function(_ae4,_ae5){
return this.setEnabled(true,_ae4,_ae5);
},disable:function(_ae6,_ae7){
return this.setEnabled(false,_ae6,_ae7);
},toggleEnabled:function(_ae8,_ae9){
return this.setEnabled(this.disabled,_ae8,_ae9);
},_icon:null,getIcon:function(){
return this._icon;
},setIcon:function(_aea){
var icon=dojo.widget.Icon.make(_aea);
if(this._icon){
this._icon.setIcon(icon);
}else{
this._icon=icon;
}
var _aec=this._icon.getNode();
if(_aec.parentNode!=this.domNode){
if(this.domNode.hasChildNodes()){
this.domNode.insertBefore(_aec,this.domNode.firstChild);
}else{
this.domNode.appendChild(_aec);
}
}
return this._icon;
},_label:"",getLabel:function(){
return this._label;
},setLabel:function(_aed){
var ret=(this._label=_aed);
if(!this.labelNode){
this.labelNode=document.createElement("span");
this.domNode.appendChild(this.labelNode);
}
this.labelNode.innerHTML="";
this.labelNode.appendChild(document.createTextNode(this._label));
this.update();
return ret;
},update:function(){
if(this.disabled){
this._selected=false;
dojo.html.addClass(this.domNode,"disabled");
dojo.html.removeClass(this.domNode,"down");
dojo.html.removeClass(this.domNode,"hover");
}else{
dojo.html.removeClass(this.domNode,"disabled");
if(this._selected){
dojo.html.addClass(this.domNode,"selected");
}else{
dojo.html.removeClass(this.domNode,"selected");
}
}
this._updateIcon();
},_updateIcon:function(){
if(this._icon){
if(this.disabled){
this._icon.disable();
}else{
if(this._cssHover){
this._icon.hover();
}else{
if(this._selected){
this._icon.select();
}else{
this._icon.enable();
}
}
}
}
},_fireEvent:function(evt){
if(typeof this[evt]=="function"){
var args=[this];
for(var i=1;i<arguments.length;i++){
args.push(arguments[i]);
}
this[evt].apply(this,args);
}
},_onmouseover:function(e){
if(this.disabled){
return;
}
dojo.html.addClass(this.domNode,"hover");
this._fireEvent("onMouseOver");
},_onmouseout:function(e){
dojo.html.removeClass(this.domNode,"hover");
dojo.html.removeClass(this.domNode,"down");
if(!this._selected){
dojo.html.removeClass(this.domNode,"selected");
}
this._fireEvent("onMouseOut");
},_onclick:function(e){
if(!this.disabled&&!this._toggleItem){
this._fireEvent("onClick");
}
},_onmousedown:function(e){
if(e.preventDefault){
e.preventDefault();
}
if(this.disabled){
return;
}
dojo.html.addClass(this.domNode,"down");
if(this._toggleItem){
if(this.parent.preventDeselect&&this._selected){
return;
}
this.toggleSelected();
}
this._fireEvent("onMouseDown");
},_onmouseup:function(e){
dojo.html.removeClass(this.domNode,"down");
this._fireEvent("onMouseUp");
},onClick:function(){
},onMouseOver:function(){
},onMouseOut:function(){
},onMouseDown:function(){
},onMouseUp:function(){
},fillInTemplate:function(args,frag){
if(args.name){
this._name=args.name;
}
if(args.selected){
this.select();
}
if(args.disabled){
this.disable();
}
if(args.label){
this.setLabel(args.label);
}
if(args.icon){
this.setIcon(args.icon);
}
if(args.toggleitem||args.toggleItem){
this.setToggleItem(true);
}
}});
dojo.widget.ToolbarItem.make=function(wh,_afa,_afb){
var item=null;
if(wh instanceof Array){
item=dojo.widget.createWidget("ToolbarButtonGroup",_afb);
item.setName(wh[0]);
for(var i=1;i<wh.length;i++){
item.addChild(wh[i]);
}
}else{
if(wh instanceof dojo.widget.ToolbarItem){
item=wh;
}else{
if(wh instanceof dojo.uri.Uri){
item=dojo.widget.createWidget("ToolbarButton",dojo.lang.mixin(_afb||{},{icon:new dojo.widget.Icon(wh.toString())}));
}else{
if(_afa){
item=dojo.widget.createWidget(wh,_afb);
}else{
if(typeof wh=="string"||wh instanceof String){
switch(wh.charAt(0)){
case "|":
case "-":
case "/":
item=dojo.widget.createWidget("ToolbarSeparator",_afb);
break;
case " ":
if(wh.length==1){
item=dojo.widget.createWidget("ToolbarSpace",_afb);
}else{
item=dojo.widget.createWidget("ToolbarFlexibleSpace",_afb);
}
break;
default:
if(/\.(gif|jpg|jpeg|png)$/i.test(wh)){
item=dojo.widget.createWidget("ToolbarButton",dojo.lang.mixin(_afb||{},{icon:new dojo.widget.Icon(wh.toString())}));
}else{
item=dojo.widget.createWidget("ToolbarButton",dojo.lang.mixin(_afb||{},{label:wh.toString()}));
}
}
}else{
if(wh&&wh.tagName&&/^img$/i.test(wh.tagName)){
item=dojo.widget.createWidget("ToolbarButton",dojo.lang.mixin(_afb||{},{icon:wh}));
}else{
item=dojo.widget.createWidget("ToolbarButton",dojo.lang.mixin(_afb||{},{label:wh.toString()}));
}
}
}
}
}
}
return item;
};
dojo.widget.defineWidget("dojo.widget.ToolbarButtonGroup",dojo.widget.ToolbarItem,{isContainer:true,templateString:"<span unselectable=\"on\" class=\"toolbarButtonGroup\" dojoAttachPoint=\"containerNode\"></span>",defaultButton:"",postCreate:function(){
for(var i=0;i<this.children.length;i++){
this._injectChild(this.children[i]);
}
},addChild:function(item,pos,_b01){
var _b02=dojo.widget.ToolbarItem.make(item,null,dojo.lang.mixin(_b01||{},{toggleItem:true}));
var ret=dojo.widget.ToolbarButtonGroup.superclass.addChild.call(this,_b02,null,pos,null);
this._injectChild(_b02);
return ret;
},_injectChild:function(_b04){
dojo.event.connect(_b04,"onSelect",this,"onChildSelected");
dojo.event.connect(_b04,"onDeselect",this,"onChildDeSelected");
if(_b04._name==this.defaultButton||(typeof this.defaultButton=="number"&&this.children.length-1==this.defaultButton)){
_b04.select(false,true);
}
},getItem:function(name){
if(name instanceof dojo.widget.ToolbarItem){
return name;
}
for(var i=0;i<this.children.length;i++){
var _b07=this.children[i];
if(_b07 instanceof dojo.widget.ToolbarItem&&_b07._name==name){
return _b07;
}
}
return null;
},getItems:function(){
var _b08=[];
for(var i=0;i<this.children.length;i++){
var _b0a=this.children[i];
if(_b0a instanceof dojo.widget.ToolbarItem){
_b08.push(_b0a);
}
}
return _b08;
},onChildSelected:function(e){
this.select(e._name);
},onChildDeSelected:function(e){
this._fireEvent("onChangeSelect",this._value);
},enable:function(_b0d,_b0e){
for(var i=0;i<this.children.length;i++){
var _b10=this.children[i];
if(_b10 instanceof dojo.widget.ToolbarItem){
_b10.enable(_b0d,_b0e);
if(_b10._name==this._value){
_b10.select(_b0d,_b0e);
}
}
}
},disable:function(_b11,_b12){
for(var i=0;i<this.children.length;i++){
var _b14=this.children[i];
if(_b14 instanceof dojo.widget.ToolbarItem){
_b14.disable(_b11,_b12);
}
}
},_value:"",getValue:function(){
return this._value;
},select:function(name,_b16,_b17){
for(var i=0;i<this.children.length;i++){
var _b19=this.children[i];
if(_b19 instanceof dojo.widget.ToolbarItem){
if(_b19._name==name){
_b19.select(_b16,_b17);
this._value=name;
}else{
_b19.deselect(true,true);
}
}
}
if(!_b17){
this._fireEvent("onSelect",this._value);
this._fireEvent("onChangeSelect",this._value);
}
},setValue:this.select,preventDeselect:false});
dojo.widget.defineWidget("dojo.widget.ToolbarButton",dojo.widget.ToolbarItem,{fillInTemplate:function(args,frag){
dojo.widget.ToolbarButton.superclass.fillInTemplate.call(this,args,frag);
dojo.html.addClass(this.domNode,"toolbarButton");
if(this._icon){
this.setIcon(this._icon);
}
if(this._label){
this.setLabel(this._label);
}
if(!this._name){
if(this._label){
this.setName(this._label);
}else{
if(this._icon){
var src=this._icon.getSrc("enabled").match(/[\/^]([^\.\/]+)\.(gif|jpg|jpeg|png)$/i);
if(src){
this.setName(src[1]);
}
}else{
this._name=this._widgetId;
}
}
}
}});
dojo.widget.defineWidget("dojo.widget.ToolbarDialog",dojo.widget.ToolbarButton,{fillInTemplate:function(args,frag){
dojo.widget.ToolbarDialog.superclass.fillInTemplate.call(this,args,frag);
dojo.event.connect(this,"onSelect",this,"showDialog");
dojo.event.connect(this,"onDeselect",this,"hideDialog");
},showDialog:function(e){
dojo.lang.setTimeout(dojo.event.connect,1,document,"onmousedown",this,"deselect");
},hideDialog:function(e){
dojo.event.disconnect(document,"onmousedown",this,"deselect");
}});
dojo.widget.defineWidget("dojo.widget.ToolbarMenu",dojo.widget.ToolbarDialog,{});
dojo.widget.ToolbarMenuItem=function(){
};
dojo.widget.defineWidget("dojo.widget.ToolbarSeparator",dojo.widget.ToolbarItem,{templateString:"<span unselectable=\"on\" class=\"toolbarItem toolbarSeparator\"></span>",defaultIconPath:new dojo.uri.moduleUri("dojo.widget","templates/buttons/sep.gif"),fillInTemplate:function(args,frag,skip){
dojo.widget.ToolbarSeparator.superclass.fillInTemplate.call(this,args,frag);
this._name=this.widgetId;
if(!skip){
if(!this._icon){
this.setIcon(this.defaultIconPath);
}
this.domNode.appendChild(this._icon.getNode());
}
},_onmouseover:null,_onmouseout:null,_onclick:null,_onmousedown:null,_onmouseup:null});
dojo.widget.defineWidget("dojo.widget.ToolbarSpace",dojo.widget.ToolbarSeparator,{fillInTemplate:function(args,frag,skip){
dojo.widget.ToolbarSpace.superclass.fillInTemplate.call(this,args,frag,true);
if(!skip){
dojo.html.addClass(this.domNode,"toolbarSpace");
}
}});
dojo.widget.defineWidget("dojo.widget.ToolbarSelect",dojo.widget.ToolbarItem,{templateString:"<span class=\"toolbarItem toolbarSelect\" unselectable=\"on\"><select dojoAttachPoint=\"selectBox\" dojoOnChange=\"changed\"></select></span>",fillInTemplate:function(args,frag){
dojo.widget.ToolbarSelect.superclass.fillInTemplate.call(this,args,frag,true);
var keys=args.values;
var i=0;
for(var val in keys){
var opt=document.createElement("option");
opt.setAttribute("value",keys[val]);
opt.innerHTML=val;
this.selectBox.appendChild(opt);
}
},changed:function(e){
this._fireEvent("onSetValue",this.selectBox.value);
},setEnabled:function(is,_b2f,_b30){
var ret=dojo.widget.ToolbarSelect.superclass.setEnabled.call(this,is,_b2f,_b30);
this.selectBox.disabled=this.disabled;
return ret;
},_onmouseover:null,_onmouseout:null,_onclick:null,_onmousedown:null,_onmouseup:null});
dojo.widget.Icon=function(_b32,_b33,_b34,_b35){
if(!arguments.length){
throw new Error("Icon must have at least an enabled state");
}
var _b36=["enabled","disabled","hovered","selected"];
var _b37="enabled";
var _b38=document.createElement("img");
this.getState=function(){
return _b37;
};
this.setState=function(_b39){
if(dojo.lang.inArray(_b36,_b39)){
if(this[_b39]){
_b37=_b39;
var img=this[_b37];
if((dojo.render.html.ie55||dojo.render.html.ie60)&&img.src&&img.src.match(/[.]png$/i)){
_b38.width=img.width||img.offsetWidth;
_b38.height=img.height||img.offsetHeight;
_b38.setAttribute("src",dojo.uri.moduleUri("dojo.widget","templates/images/blank.gif").uri);
_b38.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+img.src+"',sizingMethod='image')";
}else{
_b38.setAttribute("src",img.src);
}
}
}else{
throw new Error("Invalid state set on Icon (state: "+_b39+")");
}
};
this.setSrc=function(_b3b,_b3c){
if(/^img$/i.test(_b3c.tagName)){
this[_b3b]=_b3c;
}else{
if(typeof _b3c=="string"||_b3c instanceof String||_b3c instanceof dojo.uri.Uri){
this[_b3b]=new Image();
this[_b3b].src=_b3c.toString();
}
}
return this[_b3b];
};
this.setIcon=function(icon){
for(var i=0;i<_b36.length;i++){
if(icon[_b36[i]]){
this.setSrc(_b36[i],icon[_b36[i]]);
}
}
this.update();
};
this.enable=function(){
this.setState("enabled");
};
this.disable=function(){
this.setState("disabled");
};
this.hover=function(){
this.setState("hovered");
};
this.select=function(){
this.setState("selected");
};
this.getSize=function(){
return {width:_b38.width||_b38.offsetWidth,height:_b38.height||_b38.offsetHeight};
};
this.setSize=function(w,h){
_b38.width=w;
_b38.height=h;
return {width:w,height:h};
};
this.getNode=function(){
return _b38;
};
this.getSrc=function(_b41){
if(_b41){
return this[_b41].src;
}
return _b38.src||"";
};
this.update=function(){
this.setState(_b37);
};
for(var i=0;i<_b36.length;i++){
var arg=arguments[i];
var _b44=_b36[i];
this[_b44]=null;
if(!arg){
continue;
}
this.setSrc(_b44,arg);
}
this.enable();
};
dojo.widget.Icon.make=function(a,b,c,d){
for(var i=0;i<arguments.length;i++){
if(arguments[i] instanceof dojo.widget.Icon){
return arguments[i];
}
}
return new dojo.widget.Icon(a,b,c,d);
};
dojo.widget.defineWidget("dojo.widget.ToolbarColorDialog",dojo.widget.ToolbarDialog,{palette:"7x10",fillInTemplate:function(args,frag){
dojo.widget.ToolbarColorDialog.superclass.fillInTemplate.call(this,args,frag);
this.dialog=dojo.widget.createWidget("ColorPalette",{palette:this.palette});
this.dialog.domNode.style.position="absolute";
dojo.event.connect(this.dialog,"onColorSelect",this,"_setValue");
},_setValue:function(_b4c){
this._value=_b4c;
this._fireEvent("onSetValue",_b4c);
},showDialog:function(e){
dojo.widget.ToolbarColorDialog.superclass.showDialog.call(this,e);
var abs=dojo.html.getAbsolutePosition(this.domNode,true);
var y=abs.y+dojo.html.getBorderBox(this.domNode).height;
this.dialog.showAt(abs.x,y);
},hideDialog:function(e){
dojo.widget.ToolbarColorDialog.superclass.hideDialog.call(this,e);
this.dialog.hide();
}});
dojo.provide("dojo.Deferred");
dojo.Deferred=function(_b51){
this.chain=[];
this.id=this._nextId();
this.fired=-1;
this.paused=0;
this.results=[null,null];
this.canceller=_b51;
this.silentlyCancelled=false;
};
dojo.lang.extend(dojo.Deferred,{getFunctionFromArgs:function(){
var a=arguments;
if((a[0])&&(!a[1])){
if(dojo.lang.isFunction(a[0])){
return a[0];
}else{
if(dojo.lang.isString(a[0])){
return dj_global[a[0]];
}
}
}else{
if((a[0])&&(a[1])){
return dojo.lang.hitch(a[0],a[1]);
}
}
return null;
},makeCalled:function(){
var _b53=new dojo.Deferred();
_b53.callback();
return _b53;
},repr:function(){
var _b54;
if(this.fired==-1){
_b54="unfired";
}else{
if(this.fired==0){
_b54="success";
}else{
_b54="error";
}
}
return "Deferred("+this.id+", "+_b54+")";
},toString:dojo.lang.forward("repr"),_nextId:(function(){
var n=1;
return function(){
return n++;
};
})(),cancel:function(){
if(this.fired==-1){
if(this.canceller){
this.canceller(this);
}else{
this.silentlyCancelled=true;
}
if(this.fired==-1){
this.errback(new Error(this.repr()));
}
}else{
if((this.fired==0)&&(this.results[0] instanceof dojo.Deferred)){
this.results[0].cancel();
}
}
},_pause:function(){
this.paused++;
},_unpause:function(){
this.paused--;
if((this.paused==0)&&(this.fired>=0)){
this._fire();
}
},_continue:function(res){
this._resback(res);
this._unpause();
},_resback:function(res){
this.fired=((res instanceof Error)?1:0);
this.results[this.fired]=res;
this._fire();
},_check:function(){
if(this.fired!=-1){
if(!this.silentlyCancelled){
dojo.raise("already called!");
}
this.silentlyCancelled=false;
return;
}
},callback:function(res){
this._check();
this._resback(res);
},errback:function(res){
this._check();
if(!(res instanceof Error)){
res=new Error(res);
}
this._resback(res);
},addBoth:function(cb,cbfn){
var _b5c=this.getFunctionFromArgs(cb,cbfn);
if(arguments.length>2){
_b5c=dojo.lang.curryArguments(null,_b5c,arguments,2);
}
return this.addCallbacks(_b5c,_b5c);
},addCallback:function(cb,cbfn){
var _b5f=this.getFunctionFromArgs(cb,cbfn);
if(arguments.length>2){
_b5f=dojo.lang.curryArguments(null,_b5f,arguments,2);
}
return this.addCallbacks(_b5f,null);
},addErrback:function(cb,cbfn){
var _b62=this.getFunctionFromArgs(cb,cbfn);
if(arguments.length>2){
_b62=dojo.lang.curryArguments(null,_b62,arguments,2);
}
return this.addCallbacks(null,_b62);
return this.addCallbacks(null,cbfn);
},addCallbacks:function(cb,eb){
this.chain.push([cb,eb]);
if(this.fired>=0){
this._fire();
}
return this;
},_fire:function(){
var _b65=this.chain;
var _b66=this.fired;
var res=this.results[_b66];
var self=this;
var cb=null;
while(_b65.length>0&&this.paused==0){
var pair=_b65.shift();
var f=pair[_b66];
if(f==null){
continue;
}
try{
res=f(res);
_b66=((res instanceof Error)?1:0);
if(res instanceof dojo.Deferred){
cb=function(res){
self._continue(res);
};
this._pause();
}
}
catch(err){
_b66=1;
res=err;
}
}
this.fired=_b66;
this.results[_b66]=res;
if((cb)&&(this.paused)){
res.addBoth(cb);
}
}});
dojo.provide("dojo.widget.RichText");
if(!djConfig["useXDomain"]||djConfig["allowXdRichTextSave"]){
if(dojo.hostenv.post_load_){
(function(){
var _b6d=dojo.doc().createElement("textarea");
_b6d.id="dojo.widget.RichText.savedContent";
_b6d.style="display:none;position:absolute;top:-100px;left:-100px;height:3px;width:3px;overflow:hidden;";
dojo.body().appendChild(_b6d);
})();
}else{
try{
dojo.doc().write("<textarea id=\"dojo.widget.RichText.savedContent\" "+"style=\"display:none;position:absolute;top:-100px;left:-100px;height:3px;width:3px;overflow:hidden;\"></textarea>");
}
catch(e){
}
}
}
dojo.widget.defineWidget("dojo.widget.RichText",dojo.widget.HtmlWidget,function(){
this.contentPreFilters=[];
this.contentPostFilters=[];
this.contentDomPreFilters=[];
this.contentDomPostFilters=[];
this.editingAreaStyleSheets=[];
if(dojo.render.html.moz){
this.contentPreFilters.push(this._fixContentForMoz);
}
this._keyHandlers={};
if(dojo.Deferred){
this.onLoadDeferred=new dojo.Deferred();
}
},{inheritWidth:false,focusOnLoad:false,saveName:"",styleSheets:"",_content:"",height:"",minHeight:"1em",isClosed:true,isLoaded:false,useActiveX:false,relativeImageUrls:false,_SEPARATOR:"@@**%%__RICHTEXTBOUNDRY__%%**@@",onLoadDeferred:null,fillInTemplate:function(){
dojo.event.topic.publish("dojo.widget.RichText::init",this);
this.open();
dojo.event.connect(this,"onKeyPressed",this,"afterKeyPress");
dojo.event.connect(this,"onKeyPress",this,"keyPress");
dojo.event.connect(this,"onKeyDown",this,"keyDown");
dojo.event.connect(this,"onKeyUp",this,"keyUp");
this.setupDefaultShortcuts();
},setupDefaultShortcuts:function(){
var ctrl=this.KEY_CTRL;
var exec=function(cmd,arg){
return arguments.length==1?function(){
this.execCommand(cmd);
}:function(){
this.execCommand(cmd,arg);
};
};
this.addKeyHandler("b",ctrl,exec("bold"));
this.addKeyHandler("i",ctrl,exec("italic"));
this.addKeyHandler("u",ctrl,exec("underline"));
this.addKeyHandler("a",ctrl,exec("selectall"));
this.addKeyHandler("s",ctrl,function(){
this.save(true);
});
this.addKeyHandler("1",ctrl,exec("formatblock","h1"));
this.addKeyHandler("2",ctrl,exec("formatblock","h2"));
this.addKeyHandler("3",ctrl,exec("formatblock","h3"));
this.addKeyHandler("4",ctrl,exec("formatblock","h4"));
this.addKeyHandler("\\",ctrl,exec("insertunorderedlist"));
if(!dojo.render.html.ie){
this.addKeyHandler("Z",ctrl,exec("redo"));
}
},events:["onBlur","onFocus","onKeyPress","onKeyDown","onKeyUp","onClick"],open:function(_b72){
if(this.onLoadDeferred.fired>=0){
this.onLoadDeferred=new dojo.Deferred();
}
var h=dojo.render.html;
if(!this.isClosed){
this.close();
}
dojo.event.topic.publish("dojo.widget.RichText::open",this);
this._content="";
if((arguments.length==1)&&(_b72["nodeName"])){
this.domNode=_b72;
}
if((this.domNode["nodeName"])&&(this.domNode.nodeName.toLowerCase()=="textarea")){
this.textarea=this.domNode;
var html=this._preFilterContent(this.textarea.value);
this.domNode=dojo.doc().createElement("div");
dojo.html.copyStyle(this.domNode,this.textarea);
var _b75=dojo.lang.hitch(this,function(){
with(this.textarea.style){
display="block";
position="absolute";
left=top="-1000px";
if(h.ie){
this.__overflow=overflow;
overflow="hidden";
}
}
});
if(h.ie){
setTimeout(_b75,10);
}else{
_b75();
}
if(!h.safari){
dojo.html.insertBefore(this.domNode,this.textarea);
}
if(this.textarea.form){
dojo.event.connect("before",this.textarea.form,"onsubmit",dojo.lang.hitch(this,function(){
this.textarea.value=this.getEditorContent();
}));
}
var _b76=this;
dojo.event.connect(this,"postCreate",function(){
dojo.html.insertAfter(_b76.textarea,_b76.domNode);
});
}else{
var html=this._preFilterContent(dojo.string.trim(this.domNode.innerHTML));
}
if(html==""){
html="&nbsp;";
}
var _b77=dojo.html.getContentBox(this.domNode);
this._oldHeight=_b77.height;
this._oldWidth=_b77.width;
this._firstChildContributingMargin=this._getContributingMargin(this.domNode,"top");
this._lastChildContributingMargin=this._getContributingMargin(this.domNode,"bottom");
this.savedContent=html;
this.domNode.innerHTML="";
this.editingArea=dojo.doc().createElement("div");
this.domNode.appendChild(this.editingArea);
if((this.domNode["nodeName"])&&(this.domNode.nodeName=="LI")){
this.domNode.innerHTML=" <br>";
}
if(this.saveName!=""&&(!djConfig["useXDomain"]||djConfig["allowXdRichTextSave"])){
var _b78=dojo.doc().getElementById("dojo.widget.RichText.savedContent");
if(_b78.value!=""){
var _b79=_b78.value.split(this._SEPARATOR);
for(var i=0;i<_b79.length;i++){
var data=_b79[i].split(":");
if(data[0]==this.saveName){
html=data[1];
_b79.splice(i,1);
break;
}
}
}
dojo.event.connect("before",window,"onunload",this,"_saveContent");
}
if(h.ie70&&this.useActiveX){
dojo.debug("activeX in ie70 is not currently supported, useActiveX is ignored for now.");
this.useActiveX=false;
}
if(this.useActiveX&&h.ie){
var self=this;
setTimeout(function(){
self._drawObject(html);
},0);
}else{
if(h.ie||this._safariIsLeopard()||h.opera){
this.iframe=dojo.doc().createElement("iframe");
this.iframe.src="javascript:void(0)";
this.editorObject=this.iframe;
with(this.iframe.style){
border="0";
width="100%";
}
this.iframe.frameBorder=0;
this.editingArea.appendChild(this.iframe);
this.window=this.iframe.contentWindow;
this.document=this.window.document;
this.document.open();
this.document.write("<html><head><style>body{margin:0;padding:0;border:0;overflow:hidden;}</style></head><body><div></div></body></html>");
this.document.close();
this.editNode=this.document.body.firstChild;
this.editNode.contentEditable=true;
with(this.iframe.style){
if(h.ie70){
if(this.height){
height=this.height;
}
if(this.minHeight){
minHeight=this.minHeight;
}
}else{
height=this.height?this.height:this.minHeight;
}
}
var _b7d=["p","pre","address","h1","h2","h3","h4","h5","h6","ol","div","ul"];
var _b7e="";
for(var i=0;i<_b7d.length;i++){
if(_b7d[i].charAt(1)!="l"){
_b7e+="<"+_b7d[i]+"><span>content</span></"+_b7d[i]+">";
}else{
_b7e+="<"+_b7d[i]+"><li>content</li></"+_b7d[i]+">";
}
}
with(this.editNode.style){
position="absolute";
left="-2000px";
top="-2000px";
}
this.editNode.innerHTML=_b7e;
var node=this.editNode.firstChild;
while(node){
dojo.withGlobal(this.window,"selectElement",dojo.html.selection,[node.firstChild]);
var _b80=node.tagName.toLowerCase();
this._local2NativeFormatNames[_b80]=this.queryCommandValue("formatblock");
this._native2LocalFormatNames[this._local2NativeFormatNames[_b80]]=_b80;
node=node.nextSibling;
}
with(this.editNode.style){
position="";
left="";
top="";
}
this.editNode.innerHTML=html;
if(this.height){
this.document.body.style.overflowY="scroll";
}
dojo.lang.forEach(this.events,function(e){
dojo.event.connect(this.editNode,e.toLowerCase(),this,e);
},this);
this.onLoad();
}else{
this._drawIframe(html);
this.editorObject=this.iframe;
}
}
if(this.domNode.nodeName=="LI"){
this.domNode.lastChild.style.marginTop="-1.2em";
}
dojo.html.addClass(this.domNode,"RichTextEditable");
this.isClosed=false;
},_hasCollapseableMargin:function(_b82,side){
if(dojo.html.getPixelValue(_b82,"border-"+side+"-width",false)){
return false;
}else{
if(dojo.html.getPixelValue(_b82,"padding-"+side,false)){
return false;
}else{
return true;
}
}
},_getContributingMargin:function(_b84,_b85){
if(_b85=="top"){
var _b86="previousSibling";
var _b87="nextSibling";
var _b88="firstChild";
var _b89="margin-top";
var _b8a="margin-bottom";
}else{
var _b86="nextSibling";
var _b87="previousSibling";
var _b88="lastChild";
var _b89="margin-bottom";
var _b8a="margin-top";
}
var _b8b=dojo.html.getPixelValue(_b84,_b89,false);
function isSignificantNode(_b8c){
return !(_b8c.nodeType==3&&dojo.string.isBlank(_b8c.data))&&dojo.html.getStyle(_b8c,"display")!="none"&&!dojo.html.isPositionAbsolute(_b8c);
}
var _b8d=0;
var _b8e=_b84[_b88];
while(_b8e){
while((!isSignificantNode(_b8e))&&_b8e[_b87]){
_b8e=_b8e[_b87];
}
_b8d=Math.max(_b8d,dojo.html.getPixelValue(_b8e,_b89,false));
if(!this._hasCollapseableMargin(_b8e,_b85)){
break;
}
_b8e=_b8e[_b88];
}
if(!this._hasCollapseableMargin(_b84,_b85)){
return parseInt(_b8d);
}
var _b8f=0;
var _b90=_b84[_b86];
while(_b90){
if(isSignificantNode(_b90)){
_b8f=dojo.html.getPixelValue(_b90,_b8a,false);
break;
}
_b90=_b90[_b86];
}
if(!_b90){
_b8f=dojo.html.getPixelValue(_b84.parentNode,_b89,false);
}
if(_b8d>_b8b){
return parseInt(Math.max((_b8d-_b8b)-_b8f,0));
}else{
return 0;
}
},_drawIframe:function(html){
var _b92=Boolean(dojo.render.html.moz&&(typeof window.XML=="undefined"));
if(!this.iframe){
var _b93=(new dojo.uri.Uri(dojo.doc().location)).host;
this.iframe=dojo.doc().createElement("iframe");
with(this.iframe){
style.border="none";
style.lineHeight="0";
style.verticalAlign="bottom";
scrolling=this.height?"auto":"no";
}
}
if(djConfig["useXDomain"]&&!djConfig["dojoRichTextFrameUrl"]){
dojo.debug("dojo.widget.RichText: When using cross-domain Dojo builds,"+" please save src/widget/templates/richtextframe.html to your domain and set djConfig.dojoRichTextFrameUrl"+" to the path on your domain to richtextframe.html");
}
this.iframe.src=(djConfig["dojoRichTextFrameUrl"]||dojo.uri.moduleUri("dojo.widget","templates/richtextframe.html"))+((dojo.doc().domain!=_b93)?("#"+dojo.doc().domain):"");
this.iframe.width=this.inheritWidth?this._oldWidth:"100%";
if(this.height){
this.iframe.style.height=this.height;
}else{
var _b94=this._oldHeight;
if(this._hasCollapseableMargin(this.domNode,"top")){
_b94+=this._firstChildContributingMargin;
}
if(this._hasCollapseableMargin(this.domNode,"bottom")){
_b94+=this._lastChildContributingMargin;
}
this.iframe.height=_b94;
}
var _b95=dojo.doc().createElement("div");
_b95.innerHTML=html;
this.editingArea.appendChild(_b95);
if(this.relativeImageUrls){
var imgs=_b95.getElementsByTagName("img");
for(var i=0;i<imgs.length;i++){
imgs[i].src=(new dojo.uri.Uri(dojo.global().location,imgs[i].src)).toString();
}
html=_b95.innerHTML;
}
var _b98=dojo.html.firstElement(_b95);
var _b99=dojo.html.lastElement(_b95);
if(_b98){
_b98.style.marginTop=this._firstChildContributingMargin+"px";
}
if(_b99){
_b99.style.marginBottom=this._lastChildContributingMargin+"px";
}
this.editingArea.appendChild(this.iframe);
if(dojo.render.html.safari){
this.iframe.src=this.iframe.src;
}
var _b9a=false;
var _b9b=dojo.lang.hitch(this,function(){
if(!_b9a){
_b9a=true;
}else{
return;
}
if(!this.editNode){
if(this.iframe.contentWindow){
this.window=this.iframe.contentWindow;
this.document=this.iframe.contentWindow.document;
}else{
if(this.iframe.contentDocument){
this.window=this.iframe.contentDocument.window;
this.document=this.iframe.contentDocument;
}
}
var _b9c=(function(_b9d){
return function(_b9e){
return dojo.html.getStyle(_b9d,_b9e);
};
})(this.domNode);
var font=_b9c("font-weight")+" "+_b9c("font-size")+" "+_b9c("font-family");
var _ba0="1.0";
var _ba1=dojo.html.getUnitValue(this.domNode,"line-height");
if(_ba1.value&&_ba1.units==""){
_ba0=_ba1.value;
}
dojo.html.insertCssText("body,html{background:transparent;padding:0;margin:0;}"+"body{top:0;left:0;right:0;"+(((this.height)||(dojo.render.html.opera))?"":"position:fixed;")+"font:"+font+";"+"min-height:"+this.minHeight+";"+"line-height:"+_ba0+"}"+"p{margin: 1em 0 !important;}"+"body > *:first-child{padding-top:0 !important;margin-top:"+this._firstChildContributingMargin+"px !important;}"+"body > *:last-child{padding-bottom:0 !important;margin-bottom:"+this._lastChildContributingMargin+"px !important;}"+"li > ul:-moz-first-node, li > ol:-moz-first-node{padding-top:1.2em;}\n"+"li{min-height:1.2em;}"+"",this.document);
dojo.html.removeNode(_b95);
this.document.body.innerHTML=html;
if(_b92||dojo.render.html.safari){
this.document.designMode="on";
}
this.onLoad();
}else{
dojo.html.removeNode(_b95);
this.editNode.innerHTML=html;
this.onDisplayChanged();
}
});
if(this.editNode){
_b9b();
}else{
if(dojo.render.html.moz){
this.iframe.onload=function(){
setTimeout(_b9b,250);
};
}else{
this.iframe.onload=_b9b;
}
}
},_applyEditingAreaStyleSheets:function(){
var _ba2=[];
if(this.styleSheets){
_ba2=this.styleSheets.split(";");
this.styleSheets="";
}
_ba2=_ba2.concat(this.editingAreaStyleSheets);
this.editingAreaStyleSheets=[];
if(_ba2.length>0){
for(var i=0;i<_ba2.length;i++){
var url=_ba2[i];
if(url){
this.addStyleSheet(dojo.uri.dojoUri(url));
}
}
}
},addStyleSheet:function(uri){
var url=uri.toString();
if(dojo.lang.find(this.editingAreaStyleSheets,url)>-1){
dojo.debug("dojo.widget.RichText.addStyleSheet: Style sheet "+url+" is already applied to the editing area!");
return;
}
if(url.charAt(0)=="."||(url.charAt(0)!="/"&&!uri.host)){
url=(new dojo.uri.Uri(dojo.global().location,url)).toString();
}
this.editingAreaStyleSheets.push(url);
if(this.document.createStyleSheet){
this.document.createStyleSheet(url);
}else{
var head=this.document.getElementsByTagName("head")[0];
var _ba8=this.document.createElement("link");
with(_ba8){
rel="stylesheet";
type="text/css";
href=url;
}
head.appendChild(_ba8);
}
},removeStyleSheet:function(uri){
var url=uri.toString();
if(url.charAt(0)=="."||(url.charAt(0)!="/"&&!uri.host)){
url=(new dojo.uri.Uri(dojo.global().location,url)).toString();
}
var _bab=dojo.lang.find(this.editingAreaStyleSheets,url);
if(_bab==-1){
dojo.debug("dojo.widget.RichText.removeStyleSheet: Style sheet "+url+" is not applied to the editing area so it can not be removed!");
return;
}
delete this.editingAreaStyleSheets[_bab];
var _bac=this.document.getElementsByTagName("link");
for(var i=0;i<_bac.length;i++){
if(_bac[i].href==url){
if(dojo.render.html.ie){
_bac[i].href="";
}
dojo.html.removeNode(_bac[i]);
break;
}
}
},_drawObject:function(html){
this.object=dojo.html.createExternalElement(dojo.doc(),"object");
with(this.object){
classid="clsid:2D360201-FFF5-11D1-8D03-00A0C959BC0A";
width=this.inheritWidth?this._oldWidth:"100%";
style.height=this.height?this.height:(this._oldHeight+"px");
Scrollbars=this.height?true:false;
Appearance=this._activeX.appearance.flat;
}
this.editorObject=this.object;
this.editingArea.appendChild(this.object);
this.object.attachEvent("DocumentComplete",dojo.lang.hitch(this,"onLoad"));
dojo.lang.forEach(this.events,function(e){
this.object.attachEvent(e.toLowerCase(),dojo.lang.hitch(this,e));
},this);
this.object.DocumentHTML="<!doctype HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">"+"<html><title></title>"+"<style type=\"text/css\">"+"    body,html { padding: 0; margin: 0; }"+(this.height?"":"    body,  { overflow: hidden; }")+"</style>"+"<body><div>"+html+"<div></body></html>";
this._cacheLocalBlockFormatNames();
},_local2NativeFormatNames:{},_native2LocalFormatNames:{},_cacheLocalBlockFormatNames:function(){
if(!this._native2LocalFormatNames["p"]){
var obj=this.object;
var _bb1=false;
if(!obj){
try{
obj=dojo.html.createExternalElement(dojo.doc(),"object");
obj.classid="clsid:2D360201-FFF5-11D1-8D03-00A0C959BC0A";
dojo.body().appendChild(obj);
obj.DocumentHTML="<html><head></head><body></body></html>";
}
catch(e){
_bb1=true;
}
}
try{
var _bb2=new ActiveXObject("DEGetBlockFmtNamesParam.DEGetBlockFmtNamesParam");
obj.ExecCommand(this._activeX.command["getblockformatnames"],0,_bb2);
var _bb3=new VBArray(_bb2.Names);
var _bb4=_bb3.toArray();
var _bb5=["p","pre","address","h1","h2","h3","h4","h5","h6","ol","ul","","","","","div"];
for(var i=0;i<_bb5.length;++i){
if(_bb5[i].length>0){
this._local2NativeFormatNames[_bb4[i]]=_bb5[i];
this._native2LocalFormatNames[_bb5[i]]=_bb4[i];
}
}
}
catch(e){
_bb1=true;
}
if(obj&&!this.object){
dojo.body().removeChild(obj);
}
}
return !_bb1;
},_isResized:function(){
return false;
},onLoad:function(e){
this.isLoaded=true;
if(this.object){
this.document=this.object.DOM;
this.window=this.document.parentWindow;
this.editNode=this.document.body.firstChild;
this.editingArea.style.height=this.height?this.height:this.minHeight;
if(!this.height){
this.connect(this,"onDisplayChanged","_updateHeight");
}
this.window._frameElement=this.object;
}else{
if(this.iframe&&!dojo.render.html.ie){
this.editNode=this.document.body;
if(!this.height){
this.connect(this,"onDisplayChanged","_updateHeight");
}
try{
this.document.execCommand("useCSS",false,true);
this.document.execCommand("styleWithCSS",false,false);
}
catch(e2){
}
if(dojo.render.html.safari){
this.connect(this.editNode,"onblur","onBlur");
this.connect(this.editNode,"onfocus","onFocus");
this.connect(this.editNode,"onclick","onFocus");
this.interval=setInterval(dojo.lang.hitch(this,"onDisplayChanged"),750);
}else{
if(dojo.render.html.mozilla||dojo.render.html.opera){
var doc=this.document;
var _bb9=dojo.event.browser.addListener;
var self=this;
dojo.lang.forEach(this.events,function(e){
var l=_bb9(self.document,e.substr(2).toLowerCase(),dojo.lang.hitch(self,e));
if(e=="onBlur"){
var _bbd={unBlur:function(e){
dojo.event.browser.removeListener(doc,"blur",l);
}};
dojo.event.connect("before",self,"close",_bbd,"unBlur");
}
});
}
}
}else{
if(dojo.render.html.ie){
if(!this.height){
this.connect(this,"onDisplayChanged","_updateHeight");
}
this.editNode.style.zoom=1;
}
}
}
this._applyEditingAreaStyleSheets();
if(this.focusOnLoad){
this.focus();
}
this.onDisplayChanged(e);
if(this.onLoadDeferred){
this.onLoadDeferred.callback(true);
}
},onKeyDown:function(e){
if((!e)&&(this.object)){
e=dojo.event.browser.fixEvent(this.window.event);
}
if((dojo.render.html.ie)&&(e.keyCode==e.KEY_TAB)){
e.preventDefault();
e.stopPropagation();
this.execCommand((e.shiftKey?"outdent":"indent"));
}else{
if(dojo.render.html.ie){
if((65<=e.keyCode)&&(e.keyCode<=90)){
e.charCode=e.keyCode;
this.onKeyPress(e);
}
}
}
},onKeyUp:function(e){
return;
},KEY_CTRL:1,onKeyPress:function(e){
if((!e)&&(this.object)){
e=dojo.event.browser.fixEvent(this.window.event);
}
var _bc2=e.ctrlKey?this.KEY_CTRL:0;
if(this._keyHandlers[e.key]){
var _bc3=this._keyHandlers[e.key],i=0,_bc5;
while(_bc5=_bc3[i++]){
if(_bc2==_bc5.modifiers){
e.preventDefault();
_bc5.handler.call(this);
break;
}
}
}
dojo.lang.setTimeout(this,this.onKeyPressed,1,e);
},addKeyHandler:function(key,_bc7,_bc8){
if(!(this._keyHandlers[key] instanceof Array)){
this._keyHandlers[key]=[];
}
this._keyHandlers[key].push({modifiers:_bc7||0,handler:_bc8});
},onKeyPressed:function(e){
this.onDisplayChanged();
},onClick:function(e){
this.onDisplayChanged(e);
},onBlur:function(e){
},_initialFocus:true,onFocus:function(e){
if((dojo.render.html.mozilla)&&(this._initialFocus)){
this._initialFocus=false;
if(dojo.string.trim(this.editNode.innerHTML)=="&nbsp;"){
this.placeCursorAtStart();
}
}
},blur:function(){
if(this.iframe){
this.window.blur();
}else{
if(this.object){
this.document.body.blur();
}else{
if(this.editNode){
this.editNode.blur();
}
}
}
},focus:function(){
if(this.iframe&&!dojo.render.html.ie){
this.window.focus();
}else{
if(this.object){
this.document.focus();
}else{
if(this.editNode&&this.editNode.focus){
this.editNode.focus();
}else{
dojo.debug("Have no idea how to focus into the editor!");
}
}
}
},onDisplayChanged:function(e){
},_activeX:{command:{bold:5000,italic:5023,underline:5048,justifycenter:5024,justifyleft:5025,justifyright:5026,cut:5003,copy:5002,paste:5032,"delete":5004,undo:5049,redo:5033,removeformat:5034,selectall:5035,unlink:5050,indent:5018,outdent:5031,insertorderedlist:5030,insertunorderedlist:5051,inserttable:5022,insertcell:5019,insertcol:5020,insertrow:5021,deletecells:5005,deletecols:5006,deleterows:5007,mergecells:5029,splitcell:5047,setblockformat:5043,getblockformat:5011,getblockformatnames:5012,setfontname:5044,getfontname:5013,setfontsize:5045,getfontsize:5014,setbackcolor:5042,getbackcolor:5010,setforecolor:5046,getforecolor:5015,findtext:5008,font:5009,hyperlink:5016,image:5017,lockelement:5027,makeabsolute:5028,sendbackward:5036,bringforward:5037,sendbelowtext:5038,bringabovetext:5039,sendtoback:5040,bringtofront:5041,properties:5052},ui:{"default":0,prompt:1,noprompt:2},status:{notsupported:0,disabled:1,enabled:3,latched:7,ninched:11},appearance:{flat:0,inset:1},state:{unchecked:0,checked:1,gray:2}},_normalizeCommand:function(cmd){
var drh=dojo.render.html;
var _bd0=cmd.toLowerCase();
if(_bd0=="formatblock"){
if(drh.safari){
_bd0="heading";
}
}else{
if(this.object){
switch(_bd0){
case "createlink":
_bd0="hyperlink";
break;
case "insertimage":
_bd0="image";
break;
}
}else{
if(_bd0=="hilitecolor"&&!drh.mozilla){
_bd0="backcolor";
}
}
}
return _bd0;
},_safariIsLeopard:function(){
var _bd1=false;
if(dojo.render.html.safari){
var tmp=dojo.render.html.UA.split("AppleWebKit/")[1];
var ver=parseFloat(tmp.split(" ")[0]);
if(ver>=420){
_bd1=true;
}
}
return _bd1;
},queryCommandAvailable:function(_bd4){
var ie=1;
var _bd6=1<<1;
var _bd7=1<<2;
var _bd8=1<<3;
var _bd9=1<<4;
var _bda=this._safariIsLeopard();
function isSupportedBy(_bdb){
return {ie:Boolean(_bdb&ie),mozilla:Boolean(_bdb&_bd6),safari:Boolean(_bdb&_bd7),safari420:Boolean(_bdb&_bd9),opera:Boolean(_bdb&_bd8)};
}
var _bdc=null;
switch(_bd4.toLowerCase()){
case "bold":
case "italic":
case "underline":
case "subscript":
case "superscript":
case "fontname":
case "fontsize":
case "forecolor":
case "hilitecolor":
case "justifycenter":
case "justifyfull":
case "justifyleft":
case "justifyright":
case "delete":
case "selectall":
_bdc=isSupportedBy(_bd6|ie|_bd7|_bd8);
break;
case "createlink":
case "unlink":
case "removeformat":
case "inserthorizontalrule":
case "insertimage":
case "insertorderedlist":
case "insertunorderedlist":
case "indent":
case "outdent":
case "formatblock":
case "inserthtml":
case "undo":
case "redo":
case "strikethrough":
_bdc=isSupportedBy(_bd6|ie|_bd8|_bd9);
break;
case "blockdirltr":
case "blockdirrtl":
case "dirltr":
case "dirrtl":
case "inlinedirltr":
case "inlinedirrtl":
_bdc=isSupportedBy(ie);
break;
case "cut":
case "copy":
case "paste":
_bdc=isSupportedBy(ie|_bd6|_bd9);
break;
case "inserttable":
_bdc=isSupportedBy(_bd6|(this.object?ie:0));
break;
case "insertcell":
case "insertcol":
case "insertrow":
case "deletecells":
case "deletecols":
case "deleterows":
case "mergecells":
case "splitcell":
_bdc=isSupportedBy(this.object?ie:0);
break;
default:
return false;
}
return (dojo.render.html.ie&&_bdc.ie)||(dojo.render.html.mozilla&&_bdc.mozilla)||(dojo.render.html.safari&&_bdc.safari)||(_bda&&_bdc.safari420)||(dojo.render.html.opera&&_bdc.opera);
},execCommand:function(_bdd,_bde){
var _bdf;
this.focus();
_bdd=this._normalizeCommand(_bdd);
if(_bde!=undefined){
if(_bdd=="heading"){
throw new Error("unimplemented");
}else{
if(_bdd=="formatblock"){
if(this.object){
_bde=this._native2LocalFormatNames[_bde];
}else{
if(dojo.render.html.ie){
_bde="<"+_bde+">";
}
}
}
}
}
if(this.object){
switch(_bdd){
case "hilitecolor":
_bdd="setbackcolor";
break;
case "forecolor":
case "backcolor":
case "fontsize":
case "fontname":
_bdd="set"+_bdd;
break;
case "formatblock":
_bdd="setblockformat";
}
if(_bdd=="strikethrough"){
_bdd="inserthtml";
var _be0=this.document.selection.createRange();
if(!_be0.htmlText){
return;
}
_bde=_be0.htmlText.strike();
}else{
if(_bdd=="inserthorizontalrule"){
_bdd="inserthtml";
_bde="<hr>";
}
}
if(_bdd=="inserthtml"){
var _be0=this.document.selection.createRange();
if(this.document.selection.type.toUpperCase()=="CONTROL"){
for(var i=0;i<_be0.length;i++){
_be0.item(i).outerHTML=_bde;
}
}else{
_be0.pasteHTML(_bde);
_be0.select();
}
_bdf=true;
}else{
if(arguments.length==1){
_bdf=this.object.ExecCommand(this._activeX.command[_bdd],this._activeX.ui.noprompt);
}else{
_bdf=this.object.ExecCommand(this._activeX.command[_bdd],this._activeX.ui.noprompt,_bde);
}
}
}else{
if(_bdd=="inserthtml"){
if(dojo.render.html.ie){
var _be2=this.document.selection.createRange();
_be2.pasteHTML(_bde);
_be2.select();
return true;
}else{
return this.document.execCommand(_bdd,false,_bde);
}
}else{
if((_bdd=="unlink")&&(this.queryCommandEnabled("unlink"))&&(dojo.render.html.mozilla)){
var _be3=this.window.getSelection();
var _be4=_be3.getRangeAt(0);
var _be5=_be4.startContainer;
var _be6=_be4.startOffset;
var _be7=_be4.endContainer;
var _be8=_be4.endOffset;
var a=dojo.withGlobal(this.window,"getAncestorElement",dojo.html.selection,["a"]);
dojo.withGlobal(this.window,"selectElement",dojo.html.selection,[a]);
_bdf=this.document.execCommand("unlink",false,null);
var _be4=this.document.createRange();
_be4.setStart(_be5,_be6);
_be4.setEnd(_be7,_be8);
_be3.removeAllRanges();
_be3.addRange(_be4);
return _bdf;
}else{
if((_bdd=="hilitecolor")&&(dojo.render.html.mozilla)){
this.document.execCommand("useCSS",false,false);
_bdf=this.document.execCommand(_bdd,false,_bde);
this.document.execCommand("useCSS",false,true);
}else{
if((dojo.render.html.ie)&&((_bdd=="backcolor")||(_bdd=="forecolor"))){
_bde=arguments.length>1?_bde:null;
_bdf=this.document.execCommand(_bdd,false,_bde);
}else{
_bde=arguments.length>1?_bde:null;
if(_bde||_bdd!="createlink"){
_bdf=this.document.execCommand(_bdd,false,_bde);
}
}
}
}
}
}
this.onDisplayChanged();
return _bdf;
},queryCommandEnabled:function(_bea){
_bea=this._normalizeCommand(_bea);
if(this.object){
switch(_bea){
case "hilitecolor":
_bea="setbackcolor";
break;
case "forecolor":
case "backcolor":
case "fontsize":
case "fontname":
_bea="set"+_bea;
break;
case "formatblock":
_bea="setblockformat";
break;
case "strikethrough":
_bea="bold";
break;
case "inserthorizontalrule":
return true;
}
if(typeof this._activeX.command[_bea]=="undefined"){
return false;
}
var _beb=this.object.QueryStatus(this._activeX.command[_bea]);
return ((_beb!=this._activeX.status.notsupported)&&(_beb!=this._activeX.status.disabled));
}else{
if(dojo.render.html.mozilla){
if(_bea=="unlink"){
return dojo.withGlobal(this.window,"hasAncestorElement",dojo.html.selection,["a"]);
}else{
if(_bea=="inserttable"){
return true;
}
}
}
var elem=(dojo.render.html.ie)?this.document.selection.createRange():this.document;
return elem.queryCommandEnabled(_bea);
}
},queryCommandState:function(_bed){
_bed=this._normalizeCommand(_bed);
if(this.object){
if(_bed=="forecolor"){
_bed="setforecolor";
}else{
if(_bed=="backcolor"){
_bed="setbackcolor";
}else{
if(_bed=="strikethrough"){
return dojo.withGlobal(this.window,"hasAncestorElement",dojo.html.selection,["strike"]);
}else{
if(_bed=="inserthorizontalrule"){
return false;
}
}
}
}
if(typeof this._activeX.command[_bed]=="undefined"){
return null;
}
var _bee=this.object.QueryStatus(this._activeX.command[_bed]);
return ((_bee==this._activeX.status.latched)||(_bee==this._activeX.status.ninched));
}else{
return this.document.queryCommandState(_bed);
}
},queryCommandValue:function(_bef){
_bef=this._normalizeCommand(_bef);
if(this.object){
switch(_bef){
case "forecolor":
case "backcolor":
case "fontsize":
case "fontname":
_bef="get"+_bef;
return this.object.execCommand(this._activeX.command[_bef],this._activeX.ui.noprompt);
case "formatblock":
var _bf0=this.object.execCommand(this._activeX.command["getblockformat"],this._activeX.ui.noprompt);
if(_bf0){
return this._local2NativeFormatNames[_bf0];
}
}
}else{
if(dojo.render.html.ie&&_bef=="formatblock"){
return this._local2NativeFormatNames[this.document.queryCommandValue(_bef)]||this.document.queryCommandValue(_bef);
}
return this.document.queryCommandValue(_bef);
}
},placeCursorAtStart:function(){
this.focus();
if(dojo.render.html.moz&&this.editNode.firstChild&&this.editNode.firstChild.nodeType!=dojo.dom.TEXT_NODE){
dojo.withGlobal(this.window,"selectElementChildren",dojo.html.selection,[this.editNode.firstChild]);
}else{
dojo.withGlobal(this.window,"selectElementChildren",dojo.html.selection,[this.editNode]);
}
dojo.withGlobal(this.window,"collapse",dojo.html.selection,[true]);
},placeCursorAtEnd:function(){
this.focus();
if(dojo.render.html.moz&&this.editNode.lastChild&&this.editNode.lastChild.nodeType!=dojo.dom.TEXT_NODE){
dojo.withGlobal(this.window,"selectElementChildren",dojo.html.selection,[this.editNode.lastChild]);
}else{
dojo.withGlobal(this.window,"selectElementChildren",dojo.html.selection,[this.editNode]);
}
dojo.withGlobal(this.window,"collapse",dojo.html.selection,[false]);
},replaceEditorContent:function(html){
html=this._preFilterContent(html);
if(this.isClosed){
this.domNode.innerHTML=html;
}else{
if(this.window&&this.window.getSelection&&!dojo.render.html.moz){
this.editNode.innerHTML=html;
}else{
if((this.window&&this.window.getSelection)||(this.document&&this.document.selection)){
this.execCommand("selectall");
if(dojo.render.html.moz&&!html){
html="&nbsp;";
}
this.execCommand("inserthtml",html);
}
}
}
},_preFilterContent:function(html){
var ec=html;
dojo.lang.forEach(this.contentPreFilters,function(ef){
ec=ef(ec);
});
if(this.contentDomPreFilters.length>0){
var dom=dojo.doc().createElement("div");
dom.style.display="none";
dojo.body().appendChild(dom);
dom.innerHTML=ec;
dojo.lang.forEach(this.contentDomPreFilters,function(ef){
dom=ef(dom);
});
ec=dom.innerHTML;
dojo.body().removeChild(dom);
}
return ec;
},_postFilterContent:function(html){
var ec=html;
if(this.contentDomPostFilters.length>0){
var dom=this.document.createElement("div");
dom.innerHTML=ec;
dojo.lang.forEach(this.contentDomPostFilters,function(ef){
dom=ef(dom);
});
ec=dom.innerHTML;
}
dojo.lang.forEach(this.contentPostFilters,function(ef){
ec=ef(ec);
});
return ec;
},_lastHeight:0,_updateHeight:function(){
if(!this.isLoaded){
return;
}
if(this.height){
return;
}
var _bfc=dojo.html.getBorderBox(this.editNode).height;
if(!_bfc){
_bfc=dojo.html.getBorderBox(this.document.body).height;
}
if(_bfc==0){
dojo.debug("Can not figure out the height of the editing area!");
return;
}
this._lastHeight=_bfc;
this.editorObject.style.height=this._lastHeight+"px";
this.window.scrollTo(0,0);
},_saveContent:function(e){
var _bfe=dojo.doc().getElementById("dojo.widget.RichText.savedContent");
_bfe.value+=this._SEPARATOR+this.saveName+":"+this.getEditorContent();
},getEditorContent:function(){
var ec="";
try{
ec=(this._content.length>0)?this._content:this.editNode.innerHTML;
if(dojo.string.trim(ec)=="&nbsp;"){
ec="";
}
}
catch(e){
}
if(dojo.render.html.ie&&!this.object){
var re=new RegExp("(?:<p>&nbsp;</p>[\n\r]*)+$","i");
ec=ec.replace(re,"");
}
ec=this._postFilterContent(ec);
if(this.relativeImageUrls){
var _c01=dojo.global().location.protocol+"//"+dojo.global().location.host;
var _c02=dojo.global().location.pathname;
if(_c02.match(/\/$/)){
}else{
var _c03=_c02.split("/");
if(_c03.length){
_c03.pop();
}
_c02=_c03.join("/")+"/";
}
var _c04=new RegExp("(<img[^>]* src=[\"'])("+_c01+"("+_c02+")?)","ig");
ec=ec.replace(_c04,"$1");
}
return ec;
},close:function(save,_c06){
if(this.isClosed){
return false;
}
if(arguments.length==0){
save=true;
}
this._content=this._postFilterContent(this.editNode.innerHTML);
var _c07=(this.savedContent!=this._content);
if(this.interval){
clearInterval(this.interval);
}
if(dojo.render.html.ie&&!this.object){
dojo.event.browser.clean(this.editNode);
}
if(this.iframe){
delete this.iframe;
}
if(this.textarea){
with(this.textarea.style){
position="";
left=top="";
if(dojo.render.html.ie){
overflow=this.__overflow;
this.__overflow=null;
}
}
if(save){
this.textarea.value=this._content;
}else{
this.textarea.value=this.savedContent;
}
dojo.html.removeNode(this.domNode);
this.domNode=this.textarea;
}else{
if(save){
if(dojo.render.html.moz){
var nc=dojo.doc().createElement("span");
this.domNode.appendChild(nc);
nc.innerHTML=this.editNode.innerHTML;
}else{
this.domNode.innerHTML=this._content;
}
}else{
this.domNode.innerHTML=this.savedContent;
}
}
dojo.html.removeClass(this.domNode,"RichTextEditable");
this.isClosed=true;
this.isLoaded=false;
delete this.editNode;
if(this.window._frameElement){
this.window._frameElement=null;
}
this.window=null;
this.document=null;
this.object=null;
this.editingArea=null;
this.editorObject=null;
return _c07;
},destroyRendering:function(){
},destroy:function(){
this.destroyRendering();
if(!this.isClosed){
this.close(false);
}
dojo.widget.RichText.superclass.destroy.call(this);
},connect:function(_c09,_c0a,_c0b){
dojo.event.connect(_c09,_c0a,this,_c0b);
},disconnect:function(_c0c,_c0d,_c0e){
dojo.event.disconnect(_c0c,_c0d,this,_c0e);
},disconnectAllWithRoot:function(_c0f){
dojo.deprecated("disconnectAllWithRoot","is deprecated. No need to disconnect manually","0.5");
},_fixContentForMoz:function(html){
html=html.replace(/<strong([ \>])/gi,"<b$1");
html=html.replace(/<\/strong>/gi,"</b>");
html=html.replace(/<em([ \>])/gi,"<i$1");
html=html.replace(/<\/em>/gi,"</i>");
return html;
}});
dojo.provide("dojo.widget.ColorPalette");
dojo.widget.defineWidget("dojo.widget.ColorPalette",dojo.widget.HtmlWidget,{palette:"7x10",_palettes:{"7x10":[["fff","fcc","fc9","ff9","ffc","9f9","9ff","cff","ccf","fcf"],["ccc","f66","f96","ff6","ff3","6f9","3ff","6ff","99f","f9f"],["c0c0c0","f00","f90","fc6","ff0","3f3","6cc","3cf","66c","c6c"],["999","c00","f60","fc3","fc0","3c0","0cc","36f","63f","c3c"],["666","900","c60","c93","990","090","399","33f","60c","939"],["333","600","930","963","660","060","366","009","339","636"],["000","300","630","633","330","030","033","006","309","303"]],"3x4":[["ffffff","00ff00","008000","0000ff"],["c0c0c0","ffff00","ff00ff","000080"],["808080","ff0000","800080","000000"]]},buildRendering:function(){
this.domNode=document.createElement("table");
dojo.html.disableSelection(this.domNode);
dojo.event.connect(this.domNode,"onmousedown",function(e){
e.preventDefault();
});
with(this.domNode){
cellPadding="0";
cellSpacing="1";
border="1";
style.backgroundColor="white";
}
var _c12=this._palettes[this.palette];
for(var i=0;i<_c12.length;i++){
var tr=this.domNode.insertRow(-1);
for(var j=0;j<_c12[i].length;j++){
if(_c12[i][j].length==3){
_c12[i][j]=_c12[i][j].replace(/(.)(.)(.)/,"$1$1$2$2$3$3");
}
var td=tr.insertCell(-1);
with(td.style){
backgroundColor="#"+_c12[i][j];
border="1px solid gray";
width=height="15px";
fontSize="1px";
}
td.color="#"+_c12[i][j];
td.onmouseover=function(e){
this.style.borderColor="white";
};
td.onmouseout=function(e){
this.style.borderColor="gray";
};
dojo.event.connect(td,"onmousedown",this,"onClick");
td.innerHTML="&nbsp;";
}
}
},onClick:function(e){
this.onColorSelect(e.currentTarget.color);
e.currentTarget.style.borderColor="gray";
},onColorSelect:function(_c1a){
}});
dojo.provide("dojo.widget.Editor");
dojo.deprecated("dojo.widget.Editor","is replaced by dojo.widget.Editor2","0.5");
dojo.widget.tags.addParseTreeHandler("dojo:Editor");
dojo.widget.Editor=function(){
dojo.widget.HtmlWidget.call(this);
this.contentFilters=[];
this._toolbars=[];
};
dojo.inherits(dojo.widget.Editor,dojo.widget.HtmlWidget);
dojo.widget.Editor.itemGroups={textGroup:["bold","italic","underline","strikethrough"],blockGroup:["formatBlock","fontName","fontSize"],justifyGroup:["justifyleft","justifycenter","justifyright"],commandGroup:["save","cancel"],colorGroup:["forecolor","hilitecolor"],listGroup:["insertorderedlist","insertunorderedlist"],indentGroup:["outdent","indent"],linkGroup:["createlink","insertimage","inserthorizontalrule"]};
dojo.widget.Editor.formatBlockValues={"Normal":"p","Main heading":"h2","Sub heading":"h3","Sub sub heading":"h4","Preformatted":"pre"};
dojo.widget.Editor.fontNameValues={"Arial":"Arial, Helvetica, sans-serif","Verdana":"Verdana, sans-serif","Times New Roman":"Times New Roman, serif","Courier":"Courier New, monospace"};
dojo.widget.Editor.fontSizeValues={"1 (8 pt)":"1","2 (10 pt)":"2","3 (12 pt)":"3","4 (14 pt)":"4","5 (18 pt)":"5","6 (24 pt)":"6","7 (36 pt)":"7"};
dojo.widget.Editor.defaultItems=["commandGroup","|","blockGroup","|","textGroup","|","colorGroup","|","justifyGroup","|","listGroup","indentGroup","|","linkGroup"];
dojo.widget.Editor.supportedCommands=["save","cancel","|","-","/"," "];
dojo.lang.extend(dojo.widget.Editor,{widgetType:"Editor",saveUrl:"",saveMethod:"post",saveArgName:"editorContent",closeOnSave:false,items:dojo.widget.Editor.defaultItems,formatBlockItems:dojo.lang.shallowCopy(dojo.widget.Editor.formatBlockValues),fontNameItems:dojo.lang.shallowCopy(dojo.widget.Editor.fontNameValues),fontSizeItems:dojo.lang.shallowCopy(dojo.widget.Editor.fontSizeValues),getItemProperties:function(name){
var _c1c={};
switch(name.toLowerCase()){
case "bold":
case "italic":
case "underline":
case "strikethrough":
_c1c.toggleItem=true;
break;
case "justifygroup":
_c1c.defaultButton="justifyleft";
_c1c.preventDeselect=true;
_c1c.buttonGroup=true;
break;
case "listgroup":
_c1c.buttonGroup=true;
break;
case "save":
case "cancel":
_c1c.label=dojo.string.capitalize(name);
break;
case "forecolor":
case "hilitecolor":
_c1c.name=name;
_c1c.toggleItem=true;
_c1c.icon=this.getCommandImage(name);
break;
case "formatblock":
_c1c.name="formatBlock";
_c1c.values=this.formatBlockItems;
break;
case "fontname":
_c1c.name="fontName";
_c1c.values=this.fontNameItems;
case "fontsize":
_c1c.name="fontSize";
_c1c.values=this.fontSizeItems;
}
return _c1c;
},validateItems:true,focusOnLoad:true,minHeight:"1em",_richText:null,_richTextType:"RichText",_toolbarContainer:null,_toolbarContainerType:"ToolbarContainer",_toolbars:[],_toolbarType:"Toolbar",_toolbarItemType:"ToolbarItem",buildRendering:function(args,frag){
var node=frag["dojo:"+this.widgetType.toLowerCase()]["nodeRef"];
var trt=dojo.widget.createWidget(this._richTextType,{focusOnLoad:this.focusOnLoad,minHeight:this.minHeight},node);
var _c21=this;
setTimeout(function(){
_c21.setRichText(trt);
_c21.initToolbar();
_c21.fillInTemplate(args,frag);
},0);
},setRichText:function(_c22){
if(this._richText&&this._richText==_c22){
dojo.debug("Already set the richText to this richText!");
return;
}
if(this._richText&&!this._richText.isClosed){
dojo.debug("You are switching richTexts yet you haven't closed the current one. Losing reference!");
}
this._richText=_c22;
dojo.event.connect(this._richText,"close",this,"onClose");
dojo.event.connect(this._richText,"onLoad",this,"onLoad");
dojo.event.connect(this._richText,"onDisplayChanged",this,"updateToolbar");
if(this._toolbarContainer){
this._toolbarContainer.enable();
this.updateToolbar(true);
}
},initToolbar:function(){
if(this._toolbarContainer){
return;
}
this._toolbarContainer=dojo.widget.createWidget(this._toolbarContainerType);
var tb=this.addToolbar();
var last=true;
for(var i=0;i<this.items.length;i++){
if(this.items[i]=="\n"){
tb=this.addToolbar();
}else{
if((this.items[i]=="|")&&(!last)){
last=true;
}else{
last=this.addItem(this.items[i],tb);
}
}
}
this.insertToolbar(this._toolbarContainer.domNode,this._richText.domNode);
},insertToolbar:function(_c26,_c27){
dojo.html.insertBefore(_c26,_c27);
},addToolbar:function(_c28){
this.initToolbar();
if(!(_c28 instanceof dojo.widget.Toolbar)){
_c28=dojo.widget.createWidget(this._toolbarType);
}
this._toolbarContainer.addChild(_c28);
this._toolbars.push(_c28);
return _c28;
},addItem:function(item,tb,_c2b){
if(!tb){
tb=this._toolbars[0];
}
var cmd=((item)&&(!dojo.lang.isUndefined(item["getValue"])))?cmd=item["getValue"]():item;
var _c2d=dojo.widget.Editor.itemGroups;
if(item instanceof dojo.widget.ToolbarItem){
tb.addChild(item);
}else{
if(_c2d[cmd]){
var _c2e=_c2d[cmd];
var _c2f=true;
if(cmd=="justifyGroup"||cmd=="listGroup"){
var _c30=[cmd];
for(var i=0;i<_c2e.length;i++){
if(_c2b||this.isSupportedCommand(_c2e[i])){
_c30.push(this.getCommandImage(_c2e[i]));
}else{
_c2f=false;
}
}
if(_c30.length){
var btn=tb.addChild(_c30,null,this.getItemProperties(cmd));
dojo.event.connect(btn,"onClick",this,"_action");
dojo.event.connect(btn,"onChangeSelect",this,"_action");
}
return _c2f;
}else{
for(var i=0;i<_c2e.length;i++){
if(!this.addItem(_c2e[i],tb)){
_c2f=false;
}
}
return _c2f;
}
}else{
if((!_c2b)&&(!this.isSupportedCommand(cmd))){
return false;
}
if(_c2b||this.isSupportedCommand(cmd)){
cmd=cmd.toLowerCase();
if(cmd=="formatblock"){
var _c33=dojo.widget.createWidget("ToolbarSelect",{name:"formatBlock",values:this.formatBlockItems});
tb.addChild(_c33);
var _c34=this;
dojo.event.connect(_c33,"onSetValue",function(item,_c36){
_c34.onAction("formatBlock",_c36);
});
}else{
if(cmd=="fontname"){
var _c33=dojo.widget.createWidget("ToolbarSelect",{name:"fontName",values:this.fontNameItems});
tb.addChild(_c33);
dojo.event.connect(_c33,"onSetValue",dojo.lang.hitch(this,function(item,_c38){
this.onAction("fontName",_c38);
}));
}else{
if(cmd=="fontsize"){
var _c33=dojo.widget.createWidget("ToolbarSelect",{name:"fontSize",values:this.fontSizeItems});
tb.addChild(_c33);
dojo.event.connect(_c33,"onSetValue",dojo.lang.hitch(this,function(item,_c3a){
this.onAction("fontSize",_c3a);
}));
}else{
if(dojo.lang.inArray(cmd,["forecolor","hilitecolor"])){
var btn=tb.addChild(dojo.widget.createWidget("ToolbarColorDialog",this.getItemProperties(cmd)));
dojo.event.connect(btn,"onSetValue",this,"_setValue");
}else{
var btn=tb.addChild(this.getCommandImage(cmd),null,this.getItemProperties(cmd));
if(cmd=="save"){
dojo.event.connect(btn,"onClick",this,"_save");
}else{
if(cmd=="cancel"){
dojo.event.connect(btn,"onClick",this,"_close");
}else{
dojo.event.connect(btn,"onClick",this,"_action");
dojo.event.connect(btn,"onChangeSelect",this,"_action");
}
}
}
}
}
}
}
}
}
return true;
},enableToolbar:function(){
if(this._toolbarContainer){
this._toolbarContainer.domNode.style.display="";
this._toolbarContainer.enable();
}
},disableToolbar:function(hide){
if(hide){
if(this._toolbarContainer){
this._toolbarContainer.domNode.style.display="none";
}
}else{
if(this._toolbarContainer){
this._toolbarContainer.disable();
}
}
},_updateToolbarLastRan:null,_updateToolbarTimer:null,_updateToolbarFrequency:500,updateToolbar:function(_c3c){
if(!this._toolbarContainer){
return;
}
var diff=new Date()-this._updateToolbarLastRan;
if(!_c3c&&this._updateToolbarLastRan&&(diff<this._updateToolbarFrequency)){
clearTimeout(this._updateToolbarTimer);
var _c3e=this;
this._updateToolbarTimer=setTimeout(function(){
_c3e.updateToolbar();
},this._updateToolbarFrequency/2);
return;
}else{
this._updateToolbarLastRan=new Date();
}
var _c3f=this._toolbarContainer.getItems();
for(var i=0;i<_c3f.length;i++){
var item=_c3f[i];
if(item instanceof dojo.widget.ToolbarSeparator){
continue;
}
var cmd=item._name;
if(cmd=="save"||cmd=="cancel"){
continue;
}else{
if(cmd=="justifyGroup"){
try{
if(!this._richText.queryCommandEnabled("justifyleft")){
item.disable(false,true);
}else{
item.enable(false,true);
var _c43=item.getItems();
for(var j=0;j<_c43.length;j++){
var name=_c43[j]._name;
var _c46=this._richText.queryCommandValue(name);
if(typeof _c46=="boolean"&&_c46){
_c46=name;
break;
}else{
if(typeof _c46=="string"){
_c46="justify"+_c46;
}else{
_c46=null;
}
}
}
if(!_c46){
_c46="justifyleft";
}
item.setValue(_c46,false,true);
}
}
catch(err){
}
}else{
if(cmd=="listGroup"){
var _c47=item.getItems();
for(var j=0;j<_c47.length;j++){
this.updateItem(_c47[j]);
}
}else{
this.updateItem(item);
}
}
}
}
},updateItem:function(item){
try{
var cmd=item._name;
var _c4a=this._richText.queryCommandEnabled(cmd);
item.setEnabled(_c4a,false,true);
var _c4b=this._richText.queryCommandState(cmd);
if(_c4b&&cmd=="underline"){
_c4b=!this._richText.queryCommandEnabled("unlink");
}
item.setSelected(_c4b,false,true);
return true;
}
catch(err){
return false;
}
},supportedCommands:dojo.widget.Editor.supportedCommands.concat(),isSupportedCommand:function(cmd){
var yes=dojo.lang.inArray(cmd,this.supportedCommands);
if(!yes){
try{
var _c4e=this._richText||dojo.widget.HtmlRichText.prototype;
yes=_c4e.queryCommandAvailable(cmd);
}
catch(E){
}
}
return yes;
},getCommandImage:function(cmd){
if(cmd=="|"){
return cmd;
}else{
return dojo.uri.moduleUri("dojo.widget","templates/buttons/"+cmd+".gif");
}
},_action:function(e){
this._fire("onAction",e.getValue());
},_setValue:function(a,b){
this._fire("onAction",a.getValue(),b);
},_save:function(e){
if(!this._richText.isClosed){
if(this.saveUrl.length){
var _c54={};
_c54[this.saveArgName]=this.getHtml();
dojo.io.bind({method:this.saveMethod,url:this.saveUrl,content:_c54});
}else{
dojo.debug("please set a saveUrl for the editor");
}
if(this.closeOnSave){
this._richText.close(e.getName().toLowerCase()=="save");
}
}
},_close:function(e){
if(!this._richText.isClosed){
this._richText.close(e.getName().toLowerCase()=="save");
}
},onAction:function(cmd,_c57){
switch(cmd){
case "createlink":
if(!(_c57=prompt("Please enter the URL of the link:","http://"))){
return;
}
break;
case "insertimage":
if(!(_c57=prompt("Please enter the URL of the image:","http://"))){
return;
}
break;
}
this._richText.execCommand(cmd,_c57);
},fillInTemplate:function(args,frag){
},_fire:function(_c5a){
if(dojo.lang.isFunction(this[_c5a])){
var args=[];
if(arguments.length==1){
args.push(this);
}else{
for(var i=1;i<arguments.length;i++){
args.push(arguments[i]);
}
}
this[_c5a].apply(this,args);
}
},getHtml:function(){
this._richText.contentFilters=this._richText.contentFilters.concat(this.contentFilters);
return this._richText.getEditorContent();
},getEditorContent:function(){
return this.getHtml();
},onClose:function(save,hide){
this.disableToolbar(hide);
if(save){
this._fire("onSave");
}else{
this._fire("onCancel");
}
},onLoad:function(){
},onSave:function(){
},onCancel:function(){
}});
dojo.provide("dojo.lang.type");
dojo.lang.whatAmI=function(_c5f){
dojo.deprecated("dojo.lang.whatAmI","use dojo.lang.getType instead","0.5");
return dojo.lang.getType(_c5f);
};
dojo.lang.whatAmI.custom={};
dojo.lang.getType=function(_c60){
try{
if(dojo.lang.isArray(_c60)){
return "array";
}
if(dojo.lang.isFunction(_c60)){
return "function";
}
if(dojo.lang.isString(_c60)){
return "string";
}
if(dojo.lang.isNumber(_c60)){
return "number";
}
if(dojo.lang.isBoolean(_c60)){
return "boolean";
}
if(dojo.lang.isAlien(_c60)){
return "alien";
}
if(dojo.lang.isUndefined(_c60)){
return "undefined";
}
for(var name in dojo.lang.whatAmI.custom){
if(dojo.lang.whatAmI.custom[name](_c60)){
return name;
}
}
if(dojo.lang.isObject(_c60)){
return "object";
}
}
catch(e){
}
return "unknown";
};
dojo.lang.isNumeric=function(_c62){
return (!isNaN(_c62)&&isFinite(_c62)&&(_c62!=null)&&!dojo.lang.isBoolean(_c62)&&!dojo.lang.isArray(_c62)&&!/^\s*$/.test(_c62));
};
dojo.lang.isBuiltIn=function(_c63){
return (dojo.lang.isArray(_c63)||dojo.lang.isFunction(_c63)||dojo.lang.isString(_c63)||dojo.lang.isNumber(_c63)||dojo.lang.isBoolean(_c63)||(_c63==null)||(_c63 instanceof Error)||(typeof _c63=="error"));
};
dojo.lang.isPureObject=function(_c64){
return ((_c64!=null)&&dojo.lang.isObject(_c64)&&_c64.constructor==Object);
};
dojo.lang.isOfType=function(_c65,type,_c67){
var _c68=false;
if(_c67){
_c68=_c67["optional"];
}
if(_c68&&((_c65===null)||dojo.lang.isUndefined(_c65))){
return true;
}
if(dojo.lang.isArray(type)){
var _c69=type;
for(var i in _c69){
var _c6b=_c69[i];
if(dojo.lang.isOfType(_c65,_c6b)){
return true;
}
}
return false;
}else{
if(dojo.lang.isString(type)){
type=type.toLowerCase();
}
switch(type){
case Array:
case "array":
return dojo.lang.isArray(_c65);
case Function:
case "function":
return dojo.lang.isFunction(_c65);
case String:
case "string":
return dojo.lang.isString(_c65);
case Number:
case "number":
return dojo.lang.isNumber(_c65);
case "numeric":
return dojo.lang.isNumeric(_c65);
case Boolean:
case "boolean":
return dojo.lang.isBoolean(_c65);
case Object:
case "object":
return dojo.lang.isObject(_c65);
case "pureobject":
return dojo.lang.isPureObject(_c65);
case "builtin":
return dojo.lang.isBuiltIn(_c65);
case "alien":
return dojo.lang.isAlien(_c65);
case "undefined":
return dojo.lang.isUndefined(_c65);
case null:
case "null":
return (_c65===null);
case "optional":
dojo.deprecated("dojo.lang.isOfType(value, [type, \"optional\"])","use dojo.lang.isOfType(value, type, {optional: true} ) instead","0.5");
return ((_c65===null)||dojo.lang.isUndefined(_c65));
default:
if(dojo.lang.isFunction(type)){
return (_c65 instanceof type);
}else{
dojo.raise("dojo.lang.isOfType() was passed an invalid type");
}
}
}
dojo.raise("If we get here, it means a bug was introduced above.");
};
dojo.lang.getObject=function(str){
var _c6d=str.split("."),i=0,obj=dj_global;
do{
obj=obj[_c6d[i++]];
}while(i<_c6d.length&&obj);
return (obj!=dj_global)?obj:null;
};
dojo.lang.doesObjectExist=function(str){
var _c71=str.split("."),i=0,obj=dj_global;
do{
obj=obj[_c71[i++]];
}while(i<_c71.length&&obj);
return (obj&&obj!=dj_global);
};
dojo.provide("dojo.lang.assert");
dojo.lang.assert=function(_c74,_c75){
if(!_c74){
var _c76="An assert statement failed.\n"+"The method dojo.lang.assert() was called with a 'false' value.\n";
if(_c75){
_c76+="Here's the assert message:\n"+_c75+"\n";
}
throw new Error(_c76);
}
};
dojo.lang.assertType=function(_c77,type,_c79){
if(dojo.lang.isString(_c79)){
dojo.deprecated("dojo.lang.assertType(value, type, \"message\")","use dojo.lang.assertType(value, type) instead","0.5");
}
if(!dojo.lang.isOfType(_c77,type,_c79)){
if(!dojo.lang.assertType._errorMessage){
dojo.lang.assertType._errorMessage="Type mismatch: dojo.lang.assertType() failed.";
}
dojo.lang.assert(false,dojo.lang.assertType._errorMessage);
}
};
dojo.lang.assertValidKeywords=function(_c7a,_c7b,_c7c){
var key;
if(!_c7c){
if(!dojo.lang.assertValidKeywords._errorMessage){
dojo.lang.assertValidKeywords._errorMessage="In dojo.lang.assertValidKeywords(), found invalid keyword:";
}
_c7c=dojo.lang.assertValidKeywords._errorMessage;
}
if(dojo.lang.isArray(_c7b)){
for(key in _c7a){
if(!dojo.lang.inArray(_c7b,key)){
dojo.lang.assert(false,_c7c+" "+key);
}
}
}else{
for(key in _c7a){
if(!(key in _c7b)){
dojo.lang.assert(false,_c7c+" "+key);
}
}
}
};
dojo.provide("dojo.AdapterRegistry");
dojo.AdapterRegistry=function(_c7e){
this.pairs=[];
this.returnWrappers=_c7e||false;
};
dojo.lang.extend(dojo.AdapterRegistry,{register:function(name,_c80,wrap,_c82,_c83){
var type=(_c83)?"unshift":"push";
this.pairs[type]([name,_c80,wrap,_c82]);
},match:function(){
for(var i=0;i<this.pairs.length;i++){
var pair=this.pairs[i];
if(pair[1].apply(this,arguments)){
if((pair[3])||(this.returnWrappers)){
return pair[2];
}else{
return pair[2].apply(this,arguments);
}
}
}
throw new Error("No match found");
},unregister:function(name){
for(var i=0;i<this.pairs.length;i++){
var pair=this.pairs[i];
if(pair[0]==name){
this.pairs.splice(i,1);
return true;
}
}
return false;
}});
dojo.provide("dojo.lang.repr");
dojo.lang.reprRegistry=new dojo.AdapterRegistry();
dojo.lang.registerRepr=function(name,_c8b,wrap,_c8d){
dojo.lang.reprRegistry.register(name,_c8b,wrap,_c8d);
};
dojo.lang.repr=function(obj){
if(typeof (obj)=="undefined"){
return "undefined";
}else{
if(obj===null){
return "null";
}
}
try{
if(typeof (obj["__repr__"])=="function"){
return obj["__repr__"]();
}else{
if((typeof (obj["repr"])=="function")&&(obj.repr!=arguments.callee)){
return obj["repr"]();
}
}
return dojo.lang.reprRegistry.match(obj);
}
catch(e){
if(typeof (obj.NAME)=="string"&&(obj.toString==Function.prototype.toString||obj.toString==Object.prototype.toString)){
return obj.NAME;
}
}
if(typeof (obj)=="function"){
obj=(obj+"").replace(/^\s+/,"");
var idx=obj.indexOf("{");
if(idx!=-1){
obj=obj.substr(0,idx)+"{...}";
}
}
return obj+"";
};
dojo.lang.reprArrayLike=function(arr){
try{
var na=dojo.lang.map(arr,dojo.lang.repr);
return "["+na.join(", ")+"]";
}
catch(e){
}
};
(function(){
var m=dojo.lang;
m.registerRepr("arrayLike",m.isArrayLike,m.reprArrayLike);
m.registerRepr("string",m.isString,m.reprString);
m.registerRepr("numbers",m.isNumber,m.reprNumber);
m.registerRepr("boolean",m.isBoolean,m.reprNumber);
})();
dojo.kwCompoundRequire({common:["dojo.lang.common","dojo.lang.assert","dojo.lang.array","dojo.lang.type","dojo.lang.func","dojo.lang.extras","dojo.lang.repr","dojo.lang.declare"]});
dojo.provide("dojo.lang.*");
dojo.provide("dojo.widget.Editor2Toolbar");
dojo.lang.declare("dojo.widget.HandlerManager",null,function(){
this._registeredHandlers=[];
},{registerHandler:function(obj,func){
if(arguments.length==2){
this._registeredHandlers.push(function(){
return obj[func].apply(obj,arguments);
});
}else{
this._registeredHandlers.push(obj);
}
},removeHandler:function(func){
for(var i=0;i<this._registeredHandlers.length;i++){
if(func===this._registeredHandlers[i]){
delete this._registeredHandlers[i];
return;
}
}
dojo.debug("HandlerManager handler "+func+" is not registered, can not remove.");
},destroy:function(){
for(var i=0;i<this._registeredHandlers.length;i++){
delete this._registeredHandlers[i];
}
}});
dojo.widget.Editor2ToolbarItemManager=new dojo.widget.HandlerManager;
dojo.lang.mixin(dojo.widget.Editor2ToolbarItemManager,{getToolbarItem:function(name){
var item;
name=name.toLowerCase();
for(var i=0;i<this._registeredHandlers.length;i++){
item=this._registeredHandlers[i](name);
if(item){
return item;
}
}
switch(name){
case "bold":
case "copy":
case "cut":
case "delete":
case "indent":
case "inserthorizontalrule":
case "insertorderedlist":
case "insertunorderedlist":
case "italic":
case "justifycenter":
case "justifyfull":
case "justifyleft":
case "justifyright":
case "outdent":
case "paste":
case "redo":
case "removeformat":
case "selectall":
case "strikethrough":
case "subscript":
case "superscript":
case "underline":
case "undo":
case "unlink":
case "createlink":
case "insertimage":
case "htmltoggle":
item=new dojo.widget.Editor2ToolbarButton(name);
break;
case "forecolor":
case "hilitecolor":
item=new dojo.widget.Editor2ToolbarColorPaletteButton(name);
break;
case "plainformatblock":
item=new dojo.widget.Editor2ToolbarFormatBlockPlainSelect("formatblock");
break;
case "formatblock":
item=new dojo.widget.Editor2ToolbarFormatBlockSelect("formatblock");
break;
case "fontsize":
item=new dojo.widget.Editor2ToolbarFontSizeSelect("fontsize");
break;
case "fontname":
item=new dojo.widget.Editor2ToolbarFontNameSelect("fontname");
break;
case "inserttable":
case "insertcell":
case "insertcol":
case "insertrow":
case "deletecells":
case "deletecols":
case "deleterows":
case "mergecells":
case "splitcell":
dojo.debug(name+" is implemented in dojo.widget.Editor2Plugin.TableOperation, please require it first.");
break;
case "inserthtml":
case "blockdirltr":
case "blockdirrtl":
case "dirltr":
case "dirrtl":
case "inlinedirltr":
case "inlinedirrtl":
dojo.debug("Not yet implemented toolbar item: "+name);
break;
default:
dojo.debug("dojo.widget.Editor2ToolbarItemManager.getToolbarItem: Unknown toolbar item: "+name);
}
return item;
}});
dojo.addOnUnload(dojo.widget.Editor2ToolbarItemManager,"destroy");
dojo.declare("dojo.widget.Editor2ToolbarButton",null,function(name){
this._name=name;
},{create:function(node,_c9d,_c9e){
this._domNode=node;
var cmd=_c9d.parent.getCommand(this._name);
if(cmd){
this._domNode.title=cmd.getText();
}
this.disableSelection(this._domNode);
this._parentToolbar=_c9d;
dojo.event.connect(this._domNode,"onclick",this,"onClick");
if(!_c9e){
dojo.event.connect(this._domNode,"onmouseover",this,"onMouseOver");
dojo.event.connect(this._domNode,"onmouseout",this,"onMouseOut");
}
},disableSelection:function(_ca0){
dojo.html.disableSelection(_ca0);
var _ca1=_ca0.all||_ca0.getElementsByTagName("*");
for(var x=0;x<_ca1.length;x++){
dojo.html.disableSelection(_ca1[x]);
}
},onMouseOver:function(){
var _ca3=dojo.widget.Editor2Manager.getCurrentInstance();
if(_ca3){
var _ca4=_ca3.getCommand(this._name);
if(_ca4&&_ca4.getState()!=dojo.widget.Editor2Manager.commandState.Disabled){
this.highlightToolbarItem();
}
}
},onMouseOut:function(){
this.unhighlightToolbarItem();
},destroy:function(){
this._domNode=null;
this._parentToolbar=null;
},onClick:function(e){
if(this._domNode&&!this._domNode.disabled&&this._parentToolbar.checkAvailability()){
e.preventDefault();
e.stopPropagation();
var _ca6=dojo.widget.Editor2Manager.getCurrentInstance();
if(_ca6){
var _ca7=_ca6.getCommand(this._name);
if(_ca7){
_ca7.execute();
}
}
}
},refreshState:function(){
var _ca8=dojo.widget.Editor2Manager.getCurrentInstance();
var em=dojo.widget.Editor2Manager;
if(_ca8){
var _caa=_ca8.getCommand(this._name);
if(_caa){
var _cab=_caa.getState();
if(_cab!=this._lastState){
switch(_cab){
case em.commandState.Latched:
this.latchToolbarItem();
break;
case em.commandState.Enabled:
this.enableToolbarItem();
break;
case em.commandState.Disabled:
default:
this.disableToolbarItem();
}
this._lastState=_cab;
}
}
}
return em.commandState.Enabled;
},latchToolbarItem:function(){
this._domNode.disabled=false;
this.removeToolbarItemStyle(this._domNode);
dojo.html.addClass(this._domNode,this._parentToolbar.ToolbarLatchedItemStyle);
},enableToolbarItem:function(){
this._domNode.disabled=false;
this.removeToolbarItemStyle(this._domNode);
dojo.html.addClass(this._domNode,this._parentToolbar.ToolbarEnabledItemStyle);
},disableToolbarItem:function(){
this._domNode.disabled=true;
this.removeToolbarItemStyle(this._domNode);
dojo.html.addClass(this._domNode,this._parentToolbar.ToolbarDisabledItemStyle);
},highlightToolbarItem:function(){
dojo.html.addClass(this._domNode,this._parentToolbar.ToolbarHighlightedItemStyle);
},unhighlightToolbarItem:function(){
dojo.html.removeClass(this._domNode,this._parentToolbar.ToolbarHighlightedItemStyle);
},removeToolbarItemStyle:function(){
dojo.html.removeClass(this._domNode,this._parentToolbar.ToolbarEnabledItemStyle);
dojo.html.removeClass(this._domNode,this._parentToolbar.ToolbarLatchedItemStyle);
dojo.html.removeClass(this._domNode,this._parentToolbar.ToolbarDisabledItemStyle);
this.unhighlightToolbarItem();
}});
dojo.declare("dojo.widget.Editor2ToolbarDropDownButton",dojo.widget.Editor2ToolbarButton,{onClick:function(){
if(this._domNode&&!this._domNode.disabled&&this._parentToolbar.checkAvailability()){
if(!this._dropdown){
this._dropdown=dojo.widget.createWidget("PopupContainer",{});
this._domNode.appendChild(this._dropdown.domNode);
}
if(this._dropdown.isShowingNow){
this._dropdown.close();
}else{
this.onDropDownShown();
this._dropdown.open(this._domNode,null,this._domNode);
}
}
},destroy:function(){
this.onDropDownDestroy();
if(this._dropdown){
this._dropdown.destroy();
}
dojo.widget.Editor2ToolbarDropDownButton.superclass.destroy.call(this);
},onDropDownShown:function(){
},onDropDownDestroy:function(){
}});
dojo.declare("dojo.widget.Editor2ToolbarColorPaletteButton",dojo.widget.Editor2ToolbarDropDownButton,{onDropDownShown:function(){
if(!this._colorpalette){
this._colorpalette=dojo.widget.createWidget("ColorPalette",{});
this._dropdown.addChild(this._colorpalette);
this.disableSelection(this._dropdown.domNode);
this.disableSelection(this._colorpalette.domNode);
dojo.event.connect(this._colorpalette,"onColorSelect",this,"setColor");
dojo.event.connect(this._dropdown,"open",this,"latchToolbarItem");
dojo.event.connect(this._dropdown,"close",this,"enableToolbarItem");
}
},setColor:function(_cac){
this._dropdown.close();
var _cad=dojo.widget.Editor2Manager.getCurrentInstance();
if(_cad){
var _cae=_cad.getCommand(this._name);
if(_cae){
_cae.execute(_cac);
}
}
}});
dojo.declare("dojo.widget.Editor2ToolbarFormatBlockPlainSelect",dojo.widget.Editor2ToolbarButton,{create:function(node,_cb0){
this._domNode=node;
this._parentToolbar=_cb0;
this._domNode=node;
this.disableSelection(this._domNode);
dojo.event.connect(this._domNode,"onchange",this,"onChange");
},destroy:function(){
this._domNode=null;
},onChange:function(){
if(this._parentToolbar.checkAvailability()){
var sv=this._domNode.value.toLowerCase();
var _cb2=dojo.widget.Editor2Manager.getCurrentInstance();
if(_cb2){
var _cb3=_cb2.getCommand(this._name);
if(_cb3){
_cb3.execute(sv);
}
}
}
},refreshState:function(){
if(this._domNode){
dojo.widget.Editor2ToolbarFormatBlockPlainSelect.superclass.refreshState.call(this);
var _cb4=dojo.widget.Editor2Manager.getCurrentInstance();
if(_cb4){
var _cb5=_cb4.getCommand(this._name);
if(_cb5){
var _cb6=_cb5.getValue();
if(!_cb6){
_cb6="";
}
dojo.lang.forEach(this._domNode.options,function(item){
if(item.value.toLowerCase()==_cb6.toLowerCase()){
item.selected=true;
}
});
}
}
}
}});
dojo.declare("dojo.widget.Editor2ToolbarComboItem",dojo.widget.Editor2ToolbarDropDownButton,{href:null,create:function(node,_cb9){
dojo.widget.Editor2ToolbarComboItem.superclass.create.apply(this,arguments);
if(!this._contentPane){
this._contentPane=dojo.widget.createWidget("ContentPane",{preload:"true"});
this._contentPane.addOnLoad(this,"setup");
this._contentPane.setUrl(this.href);
}
},onMouseOver:function(e){
if(this._lastState!=dojo.widget.Editor2Manager.commandState.Disabled){
dojo.html.addClass(e.currentTarget,this._parentToolbar.ToolbarHighlightedSelectStyle);
}
},onMouseOut:function(e){
dojo.html.removeClass(e.currentTarget,this._parentToolbar.ToolbarHighlightedSelectStyle);
},onDropDownShown:function(){
if(!this._dropdown.__addedContentPage){
this._dropdown.addChild(this._contentPane);
this._dropdown.__addedContentPage=true;
}
},setup:function(){
},onChange:function(e){
if(this._parentToolbar.checkAvailability()){
var name=e.currentTarget.getAttribute("dropDownItemName");
var _cbe=dojo.widget.Editor2Manager.getCurrentInstance();
if(_cbe){
var _cbf=_cbe.getCommand(this._name);
if(_cbf){
_cbf.execute(name);
}
}
}
this._dropdown.close();
},onMouseOverItem:function(e){
dojo.html.addClass(e.currentTarget,this._parentToolbar.ToolbarHighlightedSelectItemStyle);
},onMouseOutItem:function(e){
dojo.html.removeClass(e.currentTarget,this._parentToolbar.ToolbarHighlightedSelectItemStyle);
}});
dojo.declare("dojo.widget.Editor2ToolbarFormatBlockSelect",dojo.widget.Editor2ToolbarComboItem,{href:dojo.uri.moduleUri("dojo.widget","templates/Editor2/EditorToolbar_FormatBlock.html"),setup:function(){
dojo.widget.Editor2ToolbarFormatBlockSelect.superclass.setup.call(this);
var _cc2=this._contentPane.domNode.all||this._contentPane.domNode.getElementsByTagName("*");
this._blockNames={};
this._blockDisplayNames={};
for(var x=0;x<_cc2.length;x++){
var node=_cc2[x];
dojo.html.disableSelection(node);
var name=node.getAttribute("dropDownItemName");
if(name){
this._blockNames[name]=node;
var _cc6=node.getElementsByTagName(name);
this._blockDisplayNames[name]=_cc6[_cc6.length-1].innerHTML;
}
}
for(var name in this._blockNames){
dojo.event.connect(this._blockNames[name],"onclick",this,"onChange");
dojo.event.connect(this._blockNames[name],"onmouseover",this,"onMouseOverItem");
dojo.event.connect(this._blockNames[name],"onmouseout",this,"onMouseOutItem");
}
},onDropDownDestroy:function(){
if(this._blockNames){
for(var name in this._blockNames){
delete this._blockNames[name];
delete this._blockDisplayNames[name];
}
}
},refreshState:function(){
dojo.widget.Editor2ToolbarFormatBlockSelect.superclass.refreshState.call(this);
if(this._lastState!=dojo.widget.Editor2Manager.commandState.Disabled){
var _cc8=dojo.widget.Editor2Manager.getCurrentInstance();
if(_cc8){
var _cc9=_cc8.getCommand(this._name);
if(_cc9){
var _cca=_cc9.getValue();
if(_cca==this._lastSelectedFormat&&this._blockDisplayNames){
return this._lastState;
}
this._lastSelectedFormat=_cca;
var _ccb=this._domNode.getElementsByTagName("label")[0];
var _ccc=false;
if(this._blockDisplayNames){
for(var name in this._blockDisplayNames){
if(name==_cca){
_ccb.innerHTML=this._blockDisplayNames[name];
_ccc=true;
break;
}
}
if(!_ccc){
_ccb.innerHTML="&nbsp;";
}
}
}
}
}
return this._lastState;
}});
dojo.declare("dojo.widget.Editor2ToolbarFontSizeSelect",dojo.widget.Editor2ToolbarComboItem,{href:dojo.uri.moduleUri("dojo.widget","templates/Editor2/EditorToolbar_FontSize.html"),setup:function(){
dojo.widget.Editor2ToolbarFormatBlockSelect.superclass.setup.call(this);
var _cce=this._contentPane.domNode.all||this._contentPane.domNode.getElementsByTagName("*");
this._fontsizes={};
this._fontSizeDisplayNames={};
for(var x=0;x<_cce.length;x++){
var node=_cce[x];
dojo.html.disableSelection(node);
var name=node.getAttribute("dropDownItemName");
if(name){
this._fontsizes[name]=node;
this._fontSizeDisplayNames[name]=node.getElementsByTagName("font")[0].innerHTML;
}
}
for(var name in this._fontsizes){
dojo.event.connect(this._fontsizes[name],"onclick",this,"onChange");
dojo.event.connect(this._fontsizes[name],"onmouseover",this,"onMouseOverItem");
dojo.event.connect(this._fontsizes[name],"onmouseout",this,"onMouseOutItem");
}
},onDropDownDestroy:function(){
if(this._fontsizes){
for(var name in this._fontsizes){
delete this._fontsizes[name];
delete this._fontSizeDisplayNames[name];
}
}
},refreshState:function(){
dojo.widget.Editor2ToolbarFormatBlockSelect.superclass.refreshState.call(this);
if(this._lastState!=dojo.widget.Editor2Manager.commandState.Disabled){
var _cd3=dojo.widget.Editor2Manager.getCurrentInstance();
if(_cd3){
var _cd4=_cd3.getCommand(this._name);
if(_cd4){
var size=_cd4.getValue();
if(size==this._lastSelectedSize&&this._fontSizeDisplayNames){
return this._lastState;
}
this._lastSelectedSize=size;
var _cd6=this._domNode.getElementsByTagName("label")[0];
var _cd7=false;
if(this._fontSizeDisplayNames){
for(var name in this._fontSizeDisplayNames){
if(name==size){
_cd6.innerHTML=this._fontSizeDisplayNames[name];
_cd7=true;
break;
}
}
if(!_cd7){
_cd6.innerHTML="&nbsp;";
}
}
}
}
}
return this._lastState;
}});
dojo.declare("dojo.widget.Editor2ToolbarFontNameSelect",dojo.widget.Editor2ToolbarFontSizeSelect,{href:dojo.uri.moduleUri("dojo.widget","templates/Editor2/EditorToolbar_FontName.html")});
dojo.widget.defineWidget("dojo.widget.Editor2Toolbar",dojo.widget.HtmlWidget,function(){
dojo.event.connect(this,"fillInTemplate",dojo.lang.hitch(this,function(){
if(dojo.render.html.ie){
this.domNode.style.zoom=1;
}
}));
},{templateString:"<div dojoAttachPoint=\"domNode\" class=\"EditorToolbarDomNode\" unselectable=\"on\">\n\t<table cellpadding=\"3\" cellspacing=\"0\" border=\"0\">\n\t\t<!--\n\t\t\tour toolbar should look something like:\n\n\t\t\t+=======+=======+=======+=============================================+\n\t\t\t| w   w | style | copy  | bo | it | un | le | ce | ri |\n\t\t\t| w w w | style |=======|==============|==============|\n\t\t\t|  w w  | style | paste |  undo | redo | change style |\n\t\t\t+=======+=======+=======+=============================================+\n\t\t-->\n\t\t<tbody>\n\t\t\t<tr valign=\"top\">\n\t\t\t\t<td rowspan=\"2\">\n\t\t\t\t\t<div class=\"bigIcon\" dojoAttachPoint=\"wikiWordButton\"\n\t\t\t\t\t\tdojoOnClick=\"wikiWordClick; buttonClick;\">\n\t\t\t\t\t\t<span style=\"font-size: 30px; margin-left: 5px;\">\n\t\t\t\t\t\t\tW\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t</td>\n\t\t\t\t<td rowspan=\"2\">\n\t\t\t\t\t<div class=\"bigIcon\" dojoAttachPoint=\"styleDropdownButton\"\n\t\t\t\t\t\tdojoOnClick=\"styleDropdownClick; buttonClick;\">\n\t\t\t\t\t\t<span unselectable=\"on\"\n\t\t\t\t\t\t\tstyle=\"font-size: 30px; margin-left: 5px;\">\n\t\t\t\t\t\t\tS\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"StyleDropdownContainer\" style=\"display: none;\"\n\t\t\t\t\t\tdojoAttachPoint=\"styleDropdownContainer\">\n\t\t\t\t\t\t<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\"\n\t\t\t\t\t\t\theight=\"100%\" width=\"100%\">\n\t\t\t\t\t\t\t<tr valign=\"top\">\n\t\t\t\t\t\t\t\t<td rowspan=\"2\">\n\t\t\t\t\t\t\t\t\t<div style=\"height: 245px; overflow: auto;\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"headingContainer\"\n\t\t\t\t\t\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\t\t\t\t\t\tdojoOnClick=\"normalTextClick\">normal</div>\n\t\t\t\t\t\t\t\t\t\t<h1 class=\"headingContainer\"\n\t\t\t\t\t\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\t\t\t\t\t\tdojoOnClick=\"h1TextClick\">Heading 1</h1>\n\t\t\t\t\t\t\t\t\t\t<h2 class=\"headingContainer\"\n\t\t\t\t\t\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\t\t\t\t\t\tdojoOnClick=\"h2TextClick\">Heading 2</h2>\n\t\t\t\t\t\t\t\t\t\t<h3 class=\"headingContainer\"\n\t\t\t\t\t\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\t\t\t\t\t\tdojoOnClick=\"h3TextClick\">Heading 3</h3>\n\t\t\t\t\t\t\t\t\t\t<h4 class=\"headingContainer\"\n\t\t\t\t\t\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\t\t\t\t\t\tdojoOnClick=\"h4TextClick\">Heading 4</h4>\n\t\t\t\t\t\t\t\t\t\t<div class=\"headingContainer\"\n\t\t\t\t\t\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\t\t\t\t\t\tdojoOnClick=\"blahTextClick\">blah</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"headingContainer\"\n\t\t\t\t\t\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\t\t\t\t\t\tdojoOnClick=\"blahTextClick\">blah</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"headingContainer\"\n\t\t\t\t\t\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\t\t\t\t\t\tdojoOnClick=\"blahTextClick\">blah</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"headingContainer\">blah</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"headingContainer\">blah</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"headingContainer\">blah</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"headingContainer\">blah</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<!--\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<span class=\"iconContainer\" dojoOnClick=\"buttonClick;\">\n\t\t\t\t\t\t\t\t\t\t<span class=\"icon justifyleft\" \n\t\t\t\t\t\t\t\t\t\t\tstyle=\"float: left;\">&nbsp;</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\"iconContainer\" dojoOnClick=\"buttonClick;\">\n\t\t\t\t\t\t\t\t\t\t<span class=\"icon justifycenter\" \n\t\t\t\t\t\t\t\t\t\t\tstyle=\"float: left;\">&nbsp;</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\"iconContainer\" dojoOnClick=\"buttonClick;\">\n\t\t\t\t\t\t\t\t\t\t<span class=\"icon justifyright\" \n\t\t\t\t\t\t\t\t\t\t\tstyle=\"float: left;\">&nbsp;</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class=\"iconContainer\" dojoOnClick=\"buttonClick;\">\n\t\t\t\t\t\t\t\t\t\t<span class=\"icon justifyfull\" \n\t\t\t\t\t\t\t\t\t\t\tstyle=\"float: left;\">&nbsp;</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t-->\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr valign=\"top\">\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\tthud\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</div>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<!-- copy -->\n\t\t\t\t\t<span class=\"iconContainer\" dojoAttachPoint=\"copyButton\"\n\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\tdojoOnClick=\"copyClick; buttonClick;\">\n\t\t\t\t\t\t<span class=\"icon copy\" \n\t\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\t\tstyle=\"float: left;\">&nbsp;</span> copy\n\t\t\t\t\t</span>\n\t\t\t\t\t<!-- \"droppable\" options -->\n\t\t\t\t\t<span class=\"iconContainer\" dojoAttachPoint=\"boldButton\"\n\t\t\t\t\t\tunselectable=\"on\"\n\t\t\t\t\t\tdojoOnClick=\"boldClick; buttonClick;\">\n\t\t\t\t\t\t<span class=\"icon bold\" unselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class=\"iconContainer\" dojoAttachPoint=\"italicButton\"\n\t\t\t\t\t\tdojoOnClick=\"italicClick; buttonClick;\">\n\t\t\t\t\t\t<span class=\"icon italic\" unselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class=\"iconContainer\" dojoAttachPoint=\"underlineButton\"\n\t\t\t\t\t\tdojoOnClick=\"underlineClick; buttonClick;\">\n\t\t\t\t\t\t<span class=\"icon underline\" unselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class=\"iconContainer\" dojoAttachPoint=\"leftButton\"\n\t\t\t\t\t\tdojoOnClick=\"leftClick; buttonClick;\">\n\t\t\t\t\t\t<span class=\"icon justifyleft\" unselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class=\"iconContainer\" dojoAttachPoint=\"fullButton\"\n\t\t\t\t\t\tdojoOnClick=\"fullClick; buttonClick;\">\n\t\t\t\t\t\t<span class=\"icon justifyfull\" unselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class=\"iconContainer\" dojoAttachPoint=\"rightButton\"\n\t\t\t\t\t\tdojoOnClick=\"rightClick; buttonClick;\">\n\t\t\t\t\t\t<span class=\"icon justifyright\" unselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td>\n\t\t\t\t\t<!-- paste -->\n\t\t\t\t\t<span class=\"iconContainer\" dojoAttachPoint=\"pasteButton\"\n\t\t\t\t\t\tdojoOnClick=\"pasteClick; buttonClick;\" unselectable=\"on\">\n\t\t\t\t\t\t<span class=\"icon paste\" style=\"float: left;\" unselectable=\"on\">&nbsp;</span> paste\n\t\t\t\t\t</span>\n\t\t\t\t\t<!-- \"droppable\" options -->\n\t\t\t\t\t<span class=\"iconContainer\" dojoAttachPoint=\"undoButton\"\n\t\t\t\t\t\tdojoOnClick=\"undoClick; buttonClick;\" unselectable=\"on\">\n\t\t\t\t\t\t<span class=\"icon undo\" style=\"float: left;\" unselectable=\"on\">&nbsp;</span> undo\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class=\"iconContainer\" dojoAttachPoint=\"redoButton\"\n\t\t\t\t\t\tdojoOnClick=\"redoClick; buttonClick;\" unselectable=\"on\">\n\t\t\t\t\t\t<span class=\"icon redo\" style=\"float: left;\" unselectable=\"on\">&nbsp;</span> redo\n\t\t\t\t\t</span>\n\t\t\t\t</td>\t\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n</div>\n",templateCssString:".StyleDropdownContainer {\n\tposition: absolute;\n\tz-index: 1000;\n\toverflow: auto;\n\tcursor: default;\n\twidth: 250px;\n\theight: 250px;\n\tbackground-color: white;\n\tborder: 1px solid black;\n}\n\n.ColorDropdownContainer {\n\tposition: absolute;\n\tz-index: 1000;\n\toverflow: auto;\n\tcursor: default;\n\twidth: 250px;\n\theight: 150px;\n\tbackground-color: white;\n\tborder: 1px solid black;\n}\n\n.EditorToolbarDomNode {\n\tbackground-image: url(buttons/bg-fade.png);\n\tbackground-repeat: repeat-x;\n\tbackground-position: 0px -50px;\n}\n\n.EditorToolbarSmallBg {\n\tbackground-image: url(images/toolbar-bg.gif);\n\tbackground-repeat: repeat-x;\n\tbackground-position: 0px 0px;\n}\n\n/*\nbody {\n\tbackground:url(images/blank.gif) fixed;\n}*/\n\n.IEFixedToolbar {\n\tposition:absolute;\n\t/* top:0; */\n\ttop: expression(eval((document.documentElement||document.body).scrollTop));\n}\n\ndiv.bigIcon {\n\twidth: 40px;\n\theight: 40px; \n\t/* background-color: white; */\n\t/* border: 1px solid #a6a7a3; */\n\tfont-family: Verdana, Trebuchet, Tahoma, Arial;\n}\n\n.iconContainer {\n\tfont-family: Verdana, Trebuchet, Tahoma, Arial;\n\tfont-size: 13px;\n\tfloat: left;\n\theight: 18px;\n\tdisplay: block;\n\t/* background-color: white; */\n\tcursor: pointer;\n\tpadding: 1px 4px 1px 1px; /* almost the same as a transparent border */\n\tborder: 0px;\n}\n\n.dojoE2TBIcon {\n\tdisplay: block;\n\ttext-align: center;\n\tmin-width: 18px;\n\twidth: 18px;\n\theight: 18px;\n\t/* background-color: #a6a7a3; */\n\tbackground-repeat: no-repeat;\n\tbackground-image: url(buttons/aggregate.gif);\n}\n\n\n.dojoE2TBIcon[class~=dojoE2TBIcon] {\n}\n\n.ToolbarButtonLatched {\n    border: #316ac5 1px solid; !important;\n    padding: 0px 3px 0px 0px; !important; /* make room for border */\n    background-color: #c1d2ee;\n}\n\n.ToolbarButtonHighlighted {\n    border: #316ac5 1px solid; !important;\n    padding: 0px 3px 0px 0px; !important; /* make room for border */\n    background-color: #dff1ff;\n}\n\n.ToolbarButtonDisabled{\n    filter: gray() alpha(opacity=30); /* IE */\n    opacity: 0.30; /* Safari, Opera and Mozilla */\n}\n\n.headingContainer {\n\twidth: 150px;\n\theight: 30px;\n\tmargin: 0px;\n\t/* padding-left: 5px; */\n\toverflow: hidden;\n\tline-height: 25px;\n\tborder-bottom: 1px solid black;\n\tborder-top: 1px solid white;\n}\n\n.EditorToolbarDomNode select {\n\tfont-size: 14px;\n}\n \n.dojoE2TBIcon_Sep { width: 5px; min-width: 5px; max-width: 5px; background-position: 0px 0px}\n.dojoE2TBIcon_Backcolor { background-position: -18px 0px}\n.dojoE2TBIcon_Bold { background-position: -36px 0px}\n.dojoE2TBIcon_Cancel { background-position: -54px 0px}\n.dojoE2TBIcon_Copy { background-position: -72px 0px}\n.dojoE2TBIcon_Link { background-position: -90px 0px}\n.dojoE2TBIcon_Cut { background-position: -108px 0px}\n.dojoE2TBIcon_Delete { background-position: -126px 0px}\n.dojoE2TBIcon_TextColor { background-position: -144px 0px}\n.dojoE2TBIcon_BackgroundColor { background-position: -162px 0px}\n.dojoE2TBIcon_Indent { background-position: -180px 0px}\n.dojoE2TBIcon_HorizontalLine { background-position: -198px 0px}\n.dojoE2TBIcon_Image { background-position: -216px 0px}\n.dojoE2TBIcon_NumberedList { background-position: -234px 0px}\n.dojoE2TBIcon_Table { background-position: -252px 0px}\n.dojoE2TBIcon_BulletedList { background-position: -270px 0px}\n.dojoE2TBIcon_Italic { background-position: -288px 0px}\n.dojoE2TBIcon_CenterJustify { background-position: -306px 0px}\n.dojoE2TBIcon_BlockJustify { background-position: -324px 0px}\n.dojoE2TBIcon_LeftJustify { background-position: -342px 0px}\n.dojoE2TBIcon_RightJustify { background-position: -360px 0px}\n.dojoE2TBIcon_left_to_right { background-position: -378px 0px}\n.dojoE2TBIcon_list_bullet_indent { background-position: -396px 0px}\n.dojoE2TBIcon_list_bullet_outdent { background-position: -414px 0px}\n.dojoE2TBIcon_list_num_indent { background-position: -432px 0px}\n.dojoE2TBIcon_list_num_outdent { background-position: -450px 0px}\n.dojoE2TBIcon_Outdent { background-position: -468px 0px}\n.dojoE2TBIcon_Paste { background-position: -486px 0px}\n.dojoE2TBIcon_Redo { background-position: -504px 0px}\ndojoE2TBIcon_RemoveFormat { background-position: -522px 0px}\n.dojoE2TBIcon_right_to_left { background-position: -540px 0px}\n.dojoE2TBIcon_Save { background-position: -558px 0px}\n.dojoE2TBIcon_Space { background-position: -576px 0px}\n.dojoE2TBIcon_StrikeThrough { background-position: -594px 0px}\n.dojoE2TBIcon_Subscript { background-position: -612px 0px}\n.dojoE2TBIcon_Superscript { background-position: -630px 0px}\n.dojoE2TBIcon_Underline { background-position: -648px 0px}\n.dojoE2TBIcon_Undo { background-position: -666px 0px}\n.dojoE2TBIcon_WikiWord { background-position: -684px 0px}\n\n",templateCssPath:dojo.uri.moduleUri("dojo.widget","templates/EditorToolbar.css"),ToolbarLatchedItemStyle:"ToolbarButtonLatched",ToolbarEnabledItemStyle:"ToolbarButtonEnabled",ToolbarDisabledItemStyle:"ToolbarButtonDisabled",ToolbarHighlightedItemStyle:"ToolbarButtonHighlighted",ToolbarHighlightedSelectStyle:"ToolbarSelectHighlighted",ToolbarHighlightedSelectItemStyle:"ToolbarSelectHighlightedItem",postCreate:function(){
var _cd9=dojo.html.getElementsByClass("dojoEditorToolbarItem",this.domNode);
this.items={};
for(var x=0;x<_cd9.length;x++){
var node=_cd9[x];
var _cdc=node.getAttribute("dojoETItemName");
if(_cdc){
var item=dojo.widget.Editor2ToolbarItemManager.getToolbarItem(_cdc);
if(item){
item.create(node,this);
this.items[_cdc.toLowerCase()]=item;
}else{
node.style.display="none";
}
}
}
},update:function(){
for(var cmd in this.items){
this.items[cmd].refreshState();
}
},shareGroup:"",checkAvailability:function(){
if(!this.shareGroup){
this.parent.focus();
return true;
}
var _cdf=dojo.widget.Editor2Manager.getCurrentInstance();
if(this.shareGroup==_cdf.toolbarGroup){
return true;
}
return false;
},destroy:function(){
for(var it in this.items){
this.items[it].destroy();
delete this.items[it];
}
dojo.widget.Editor2Toolbar.superclass.destroy.call(this);
}});
dojo.provide("dojo.uri.cache");
dojo.uri.cache={_cache:{},set:function(uri,_ce2){
this._cache[uri.toString()]=_ce2;
return uri;
},remove:function(uri){
delete this._cache[uri.toString()];
},get:function(uri){
var key=uri.toString();
var _ce6=this._cache[key];
if(!_ce6){
_ce6=dojo.hostenv.getText(key);
if(_ce6){
this._cache[key]=_ce6;
}
}
return _ce6;
},allow:function(uri){
return uri;
}};
dojo.provide("dojo.lfx.shadow");
dojo.lfx.shadow=function(node){
this.shadowPng=dojo.uri.moduleUri("dojo.html","images/shadow");
this.shadowThickness=8;
this.shadowOffset=15;
this.init(node);
};
dojo.extend(dojo.lfx.shadow,{init:function(node){
this.node=node;
this.pieces={};
var x1=-1*this.shadowThickness;
var y0=this.shadowOffset;
var y1=this.shadowOffset+this.shadowThickness;
this._makePiece("tl","top",y0,"left",x1);
this._makePiece("l","top",y1,"left",x1,"scale");
this._makePiece("tr","top",y0,"left",0);
this._makePiece("r","top",y1,"left",0,"scale");
this._makePiece("bl","top",0,"left",x1);
this._makePiece("b","top",0,"left",0,"crop");
this._makePiece("br","top",0,"left",0);
},_makePiece:function(name,_cee,_cef,_cf0,_cf1,_cf2){
var img;
var url=this.shadowPng+name.toUpperCase()+".png";
if(dojo.render.html.ie55||dojo.render.html.ie60){
img=dojo.doc().createElement("div");
img.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+url+"'"+(_cf2?", sizingMethod='"+_cf2+"'":"")+")";
}else{
img=dojo.doc().createElement("img");
img.src=url;
}
img.style.position="absolute";
img.style[_cee]=_cef+"px";
img.style[_cf0]=_cf1+"px";
img.style.width=this.shadowThickness+"px";
img.style.height=this.shadowThickness+"px";
this.pieces[name]=img;
this.node.appendChild(img);
},size:function(_cf5,_cf6){
var _cf7=_cf6-(this.shadowOffset+this.shadowThickness+1);
if(_cf7<0){
_cf7=0;
}
if(_cf6<1){
_cf6=1;
}
if(_cf5<1){
_cf5=1;
}
with(this.pieces){
l.style.height=_cf7+"px";
r.style.height=_cf7+"px";
b.style.width=(_cf5-1)+"px";
bl.style.top=(_cf6-1)+"px";
b.style.top=(_cf6-1)+"px";
br.style.top=(_cf6-1)+"px";
tr.style.left=(_cf5-1)+"px";
r.style.left=(_cf5-1)+"px";
br.style.left=(_cf5-1)+"px";
}
}});
dojo.provide("dojo.widget.html.layout");
dojo.widget.html.layout=function(_cf8,_cf9,_cfa){
dojo.html.addClass(_cf8,"dojoLayoutContainer");
_cf9=dojo.lang.filter(_cf9,function(_cfb,idx){
_cfb.idx=idx;
return dojo.lang.inArray(["top","bottom","left","right","client","flood"],_cfb.layoutAlign);
});
if(_cfa&&_cfa!="none"){
var rank=function(_cfe){
switch(_cfe.layoutAlign){
case "flood":
return 1;
case "left":
case "right":
return (_cfa=="left-right")?2:3;
case "top":
case "bottom":
return (_cfa=="left-right")?3:2;
default:
return 4;
}
};
_cf9.sort(function(a,b){
return (rank(a)-rank(b))||(a.idx-b.idx);
});
}
var f={top:dojo.html.getPixelValue(_cf8,"padding-top",true),left:dojo.html.getPixelValue(_cf8,"padding-left",true)};
dojo.lang.mixin(f,dojo.html.getContentBox(_cf8));
dojo.lang.forEach(_cf9,function(_d02){
var elm=_d02.domNode;
var pos=_d02.layoutAlign;
with(elm.style){
left=f.left+"px";
top=f.top+"px";
bottom="auto";
right="auto";
}
dojo.html.addClass(elm,"dojoAlign"+dojo.string.capitalize(pos));
if((pos=="top")||(pos=="bottom")){
dojo.html.setMarginBox(elm,{width:f.width});
var h=dojo.html.getMarginBox(elm).height;
f.height-=h;
if(pos=="top"){
f.top+=h;
}else{
elm.style.top=f.top+f.height+"px";
}
if(_d02.onResized){
_d02.onResized();
}
}else{
if(pos=="left"||pos=="right"){
var w=dojo.html.getMarginBox(elm).width;
if(_d02.resizeTo){
_d02.resizeTo(w,f.height);
}else{
dojo.html.setMarginBox(elm,{width:w,height:f.height});
}
f.width-=w;
if(pos=="left"){
f.left+=w;
}else{
elm.style.left=f.left+f.width+"px";
}
}else{
if(pos=="flood"||pos=="client"){
if(_d02.resizeTo){
_d02.resizeTo(f.width,f.height);
}else{
dojo.html.setMarginBox(elm,{width:f.width,height:f.height});
}
}
}
}
});
};
dojo.html.insertCssText(".dojoLayoutContainer{ position: relative; display: block; overflow: hidden; }\n"+"body .dojoAlignTop, body .dojoAlignBottom, body .dojoAlignLeft, body .dojoAlignRight { position: absolute; overflow: hidden; }\n"+"body .dojoAlignClient { position: absolute }\n"+".dojoAlignClient { overflow: auto; }\n");
dojo.provide("dojo.dnd.DragAndDrop");
dojo.declare("dojo.dnd.DragSource",null,{type:"",onDragEnd:function(evt){
},onDragStart:function(evt){
},onSelected:function(evt){
},unregister:function(){
dojo.dnd.dragManager.unregisterDragSource(this);
},reregister:function(){
dojo.dnd.dragManager.registerDragSource(this);
}});
dojo.declare("dojo.dnd.DragObject",null,{type:"",register:function(){
var dm=dojo.dnd.dragManager;
if(dm["registerDragObject"]){
dm.registerDragObject(this);
}
},onDragStart:function(evt){
},onDragMove:function(evt){
},onDragOver:function(evt){
},onDragOut:function(evt){
},onDragEnd:function(evt){
},onDragLeave:dojo.lang.forward("onDragOut"),onDragEnter:dojo.lang.forward("onDragOver"),ondragout:dojo.lang.forward("onDragOut"),ondragover:dojo.lang.forward("onDragOver")});
dojo.declare("dojo.dnd.DropTarget",null,{acceptsType:function(type){
if(!dojo.lang.inArray(this.acceptedTypes,"*")){
if(!dojo.lang.inArray(this.acceptedTypes,type)){
return false;
}
}
return true;
},accepts:function(_d11){
if(!dojo.lang.inArray(this.acceptedTypes,"*")){
for(var i=0;i<_d11.length;i++){
if(!dojo.lang.inArray(this.acceptedTypes,_d11[i].type)){
return false;
}
}
}
return true;
},unregister:function(){
dojo.dnd.dragManager.unregisterDropTarget(this);
},onDragOver:function(evt){
},onDragOut:function(evt){
},onDragMove:function(evt){
},onDropStart:function(evt){
},onDrop:function(evt){
},onDropEnd:function(){
}},function(){
this.acceptedTypes=[];
});
dojo.dnd.DragEvent=function(){
this.dragSource=null;
this.dragObject=null;
this.target=null;
this.eventStatus="success";
};
dojo.declare("dojo.dnd.DragManager",null,{selectedSources:[],dragObjects:[],dragSources:[],registerDragSource:function(_d18){
},dropTargets:[],registerDropTarget:function(_d19){
},lastDragTarget:null,currentDragTarget:null,onKeyDown:function(){
},onMouseOut:function(){
},onMouseMove:function(){
},onMouseUp:function(){
}});
dojo.provide("dojo.dnd.HtmlDragManager");
dojo.declare("dojo.dnd.HtmlDragManager",dojo.dnd.DragManager,{disabled:false,nestedTargets:false,mouseDownTimer:null,dsCounter:0,dsPrefix:"dojoDragSource",dropTargetDimensions:[],currentDropTarget:null,previousDropTarget:null,_dragTriggered:false,selectedSources:[],dragObjects:[],dragSources:[],dropTargets:[],currentX:null,currentY:null,lastX:null,lastY:null,mouseDownX:null,mouseDownY:null,threshold:7,dropAcceptable:false,cancelEvent:function(e){
e.stopPropagation();
e.preventDefault();
},registerDragSource:function(ds){
if(ds["domNode"]){
var dp=this.dsPrefix;
var _d1d=dp+"Idx_"+(this.dsCounter++);
ds.dragSourceId=_d1d;
this.dragSources[_d1d]=ds;
ds.domNode.setAttribute(dp,_d1d);
if(dojo.render.html.ie){
dojo.event.browser.addListener(ds.domNode,"ondragstart",this.cancelEvent);
}
}
},unregisterDragSource:function(ds){
if(ds["domNode"]){
var dp=this.dsPrefix;
var _d20=ds.dragSourceId;
delete ds.dragSourceId;
delete this.dragSources[_d20];
ds.domNode.setAttribute(dp,null);
if(dojo.render.html.ie){
dojo.event.browser.removeListener(ds.domNode,"ondragstart",this.cancelEvent);
}
}
},registerDropTarget:function(dt){
this.dropTargets.push(dt);
},unregisterDropTarget:function(dt){
var _d23=dojo.lang.find(this.dropTargets,dt,true);
if(_d23>=0){
this.dropTargets.splice(_d23,1);
}
},getDragSource:function(e){
var tn=e.target;
if(tn===dojo.body()){
return;
}
var ta=dojo.html.getAttribute(tn,this.dsPrefix);
while((!ta)&&(tn)){
tn=tn.parentNode;
if((!tn)||(tn===dojo.body())){
return;
}
ta=dojo.html.getAttribute(tn,this.dsPrefix);
}
return this.dragSources[ta];
},onKeyDown:function(e){
},onMouseDown:function(e){
if(this.disabled){
return;
}
if(dojo.render.html.ie){
if(e.button!=1){
return;
}
}else{
if(e.which!=1){
return;
}
}
var _d29=e.target.nodeType==dojo.html.TEXT_NODE?e.target.parentNode:e.target;
if(dojo.html.isTag(_d29,"button","textarea","input","select","option")){
return;
}
var ds=this.getDragSource(e);
if(!ds){
return;
}
if(!dojo.lang.inArray(this.selectedSources,ds)){
this.selectedSources.push(ds);
ds.onSelected();
}
this.mouseDownX=e.pageX;
this.mouseDownY=e.pageY;
e.preventDefault();
dojo.event.connect(document,"onmousemove",this,"onMouseMove");
},onMouseUp:function(e,_d2c){
if(this.selectedSources.length==0){
return;
}
this.mouseDownX=null;
this.mouseDownY=null;
this._dragTriggered=false;
e.dragSource=this.dragSource;
if((!e.shiftKey)&&(!e.ctrlKey)){
if(this.currentDropTarget){
this.currentDropTarget.onDropStart();
}
dojo.lang.forEach(this.dragObjects,function(_d2d){
var ret=null;
if(!_d2d){
return;
}
if(this.currentDropTarget){
e.dragObject=_d2d;
var ce=this.currentDropTarget.domNode.childNodes;
if(ce.length>0){
e.dropTarget=ce[0];
while(e.dropTarget==_d2d.domNode){
e.dropTarget=e.dropTarget.nextSibling;
}
}else{
e.dropTarget=this.currentDropTarget.domNode;
}
if(this.dropAcceptable){
ret=this.currentDropTarget.onDrop(e);
}else{
this.currentDropTarget.onDragOut(e);
}
}
e.dragStatus=this.dropAcceptable&&ret?"dropSuccess":"dropFailure";
dojo.lang.delayThese([function(){
try{
_d2d.dragSource.onDragEnd(e);
}
catch(err){
var _d30={};
for(var i in e){
if(i=="type"){
_d30.type="mouseup";
continue;
}
_d30[i]=e[i];
}
_d2d.dragSource.onDragEnd(_d30);
}
},function(){
_d2d.onDragEnd(e);
}]);
},this);
this.selectedSources=[];
this.dragObjects=[];
this.dragSource=null;
if(this.currentDropTarget){
this.currentDropTarget.onDropEnd();
}
}else{
}
dojo.event.disconnect(document,"onmousemove",this,"onMouseMove");
this.currentDropTarget=null;
},onScroll:function(){
for(var i=0;i<this.dragObjects.length;i++){
if(this.dragObjects[i].updateDragOffset){
this.dragObjects[i].updateDragOffset();
}
}
if(this.dragObjects.length){
this.cacheTargetLocations();
}
},_dragStartDistance:function(x,y){
if((!this.mouseDownX)||(!this.mouseDownX)){
return;
}
var dx=Math.abs(x-this.mouseDownX);
var dx2=dx*dx;
var dy=Math.abs(y-this.mouseDownY);
var dy2=dy*dy;
return parseInt(Math.sqrt(dx2+dy2),10);
},cacheTargetLocations:function(){
dojo.profile.start("cacheTargetLocations");
this.dropTargetDimensions=[];
dojo.lang.forEach(this.dropTargets,function(_d39){
var tn=_d39.domNode;
if(!tn||!_d39.accepts([this.dragSource])){
return;
}
var abs=dojo.html.getAbsolutePosition(tn,true);
var bb=dojo.html.getBorderBox(tn);
this.dropTargetDimensions.push([[abs.x,abs.y],[abs.x+bb.width,abs.y+bb.height],_d39]);
},this);
dojo.profile.end("cacheTargetLocations");
},onMouseMove:function(e){
if((dojo.render.html.ie)&&(e.button!=1)){
this.currentDropTarget=null;
this.onMouseUp(e,true);
return;
}
if((this.selectedSources.length)&&(!this.dragObjects.length)){
var dx;
var dy;
if(!this._dragTriggered){
this._dragTriggered=(this._dragStartDistance(e.pageX,e.pageY)>this.threshold);
if(!this._dragTriggered){
return;
}
dx=e.pageX-this.mouseDownX;
dy=e.pageY-this.mouseDownY;
}
this.dragSource=this.selectedSources[0];
dojo.lang.forEach(this.selectedSources,function(_d40){
if(!_d40){
return;
}
var tdo=_d40.onDragStart(e);
if(tdo){
tdo.onDragStart(e);
tdo.dragOffset.y+=dy;
tdo.dragOffset.x+=dx;
tdo.dragSource=_d40;
this.dragObjects.push(tdo);
}
},this);
this.previousDropTarget=null;
this.cacheTargetLocations();
}
dojo.lang.forEach(this.dragObjects,function(_d42){
if(_d42){
_d42.onDragMove(e);
}
});
if(this.currentDropTarget){
var c=dojo.html.toCoordinateObject(this.currentDropTarget.domNode,true);
var dtp=[[c.x,c.y],[c.x+c.width,c.y+c.height]];
}
if((!this.nestedTargets)&&(dtp)&&(this.isInsideBox(e,dtp))){
if(this.dropAcceptable){
this.currentDropTarget.onDragMove(e,this.dragObjects);
}
}else{
var _d45=this.findBestTarget(e);
if(_d45.target===null){
if(this.currentDropTarget){
this.currentDropTarget.onDragOut(e);
this.previousDropTarget=this.currentDropTarget;
this.currentDropTarget=null;
}
this.dropAcceptable=false;
return;
}
if(this.currentDropTarget!==_d45.target){
if(this.currentDropTarget){
this.previousDropTarget=this.currentDropTarget;
this.currentDropTarget.onDragOut(e);
}
this.currentDropTarget=_d45.target;
e.dragObjects=this.dragObjects;
this.dropAcceptable=this.currentDropTarget.onDragOver(e);
}else{
if(this.dropAcceptable){
this.currentDropTarget.onDragMove(e,this.dragObjects);
}
}
}
},findBestTarget:function(e){
var _d47=this;
var _d48=new Object();
_d48.target=null;
_d48.points=null;
dojo.lang.every(this.dropTargetDimensions,function(_d49){
if(!_d47.isInsideBox(e,_d49)){
return true;
}
_d48.target=_d49[2];
_d48.points=_d49;
return Boolean(_d47.nestedTargets);
});
return _d48;
},isInsideBox:function(e,_d4b){
if((e.pageX>_d4b[0][0])&&(e.pageX<_d4b[1][0])&&(e.pageY>_d4b[0][1])&&(e.pageY<_d4b[1][1])){
return true;
}
return false;
},onMouseOver:function(e){
},onMouseOut:function(e){
}});
dojo.dnd.dragManager=new dojo.dnd.HtmlDragManager();
(function(){
var d=document;
var dm=dojo.dnd.dragManager;
dojo.event.connect(d,"onkeydown",dm,"onKeyDown");
dojo.event.connect(d,"onmouseover",dm,"onMouseOver");
dojo.event.connect(d,"onmouseout",dm,"onMouseOut");
dojo.event.connect(d,"onmousedown",dm,"onMouseDown");
dojo.event.connect(d,"onmouseup",dm,"onMouseUp");
dojo.event.connect(window,"onscroll",dm,"onScroll");
})();
dojo.provide("dojo.dnd.HtmlDragAndDrop");
dojo.declare("dojo.dnd.HtmlDragSource",dojo.dnd.DragSource,{dragClass:"",onDragStart:function(){
var _d50=new dojo.dnd.HtmlDragObject(this.dragObject,this.type);
if(this.dragClass){
_d50.dragClass=this.dragClass;
}
if(this.constrainToContainer){
_d50.constrainTo(this.constrainingContainer||this.domNode.parentNode);
}
return _d50;
},setDragHandle:function(node){
node=dojo.byId(node);
dojo.dnd.dragManager.unregisterDragSource(this);
this.domNode=node;
dojo.dnd.dragManager.registerDragSource(this);
},setDragTarget:function(node){
this.dragObject=node;
},constrainTo:function(_d53){
this.constrainToContainer=true;
if(_d53){
this.constrainingContainer=_d53;
}
},onSelected:function(){
for(var i=0;i<this.dragObjects.length;i++){
dojo.dnd.dragManager.selectedSources.push(new dojo.dnd.HtmlDragSource(this.dragObjects[i]));
}
},addDragObjects:function(el){
for(var i=0;i<arguments.length;i++){
this.dragObjects.push(dojo.byId(arguments[i]));
}
}},function(node,type){
node=dojo.byId(node);
this.dragObjects=[];
this.constrainToContainer=false;
if(node){
this.domNode=node;
this.dragObject=node;
this.type=(type)||(this.domNode.nodeName.toLowerCase());
dojo.dnd.DragSource.prototype.reregister.call(this);
}
});
dojo.declare("dojo.dnd.HtmlDragObject",dojo.dnd.DragObject,{dragClass:"",opacity:0.5,createIframe:true,disableX:false,disableY:false,createDragNode:function(){
var node=this.domNode.cloneNode(true);
if(this.dragClass){
dojo.html.addClass(node,this.dragClass);
}
if(this.opacity<1){
dojo.html.setOpacity(node,this.opacity);
}
var ltn=node.tagName.toLowerCase();
var isTr=(ltn=="tr");
if((isTr)||(ltn=="tbody")){
var doc=this.domNode.ownerDocument;
var _d5d=doc.createElement("table");
if(isTr){
var _d5e=doc.createElement("tbody");
_d5d.appendChild(_d5e);
_d5e.appendChild(node);
}else{
_d5d.appendChild(node);
}
var _d5f=((isTr)?this.domNode:this.domNode.firstChild);
var _d60=((isTr)?node:node.firstChild);
var _d61=_d5f.childNodes;
var _d62=_d60.childNodes;
for(var i=0;i<_d61.length;i++){
if((_d62[i])&&(_d62[i].style)){
_d62[i].style.width=dojo.html.getContentBox(_d61[i]).width+"px";
}
}
node=_d5d;
}
if((dojo.render.html.ie55||dojo.render.html.ie60)&&this.createIframe){
with(node.style){
top="0px";
left="0px";
}
var _d64=document.createElement("div");
_d64.appendChild(node);
this.bgIframe=new dojo.html.BackgroundIframe(_d64);
_d64.appendChild(this.bgIframe.iframe);
node=_d64;
}
node.style.zIndex=999;
return node;
},onDragStart:function(e){
dojo.html.clearSelection();
this.scrollOffset=dojo.html.getScroll().offset;
this.dragStartPosition=dojo.html.getAbsolutePosition(this.domNode,true);
this.dragOffset={y:this.dragStartPosition.y-e.pageY,x:this.dragStartPosition.x-e.pageX};
this.dragClone=this.createDragNode();
this.containingBlockPosition=this.domNode.offsetParent?dojo.html.getAbsolutePosition(this.domNode.offsetParent,true):{x:0,y:0};
if(this.constrainToContainer){
this.constraints=this.getConstraints();
}
with(this.dragClone.style){
position="absolute";
top=this.dragOffset.y+e.pageY+"px";
left=this.dragOffset.x+e.pageX+"px";
}
dojo.body().appendChild(this.dragClone);
dojo.event.topic.publish("dragStart",{source:this});
},getConstraints:function(){
if(this.constrainingContainer.nodeName.toLowerCase()=="body"){
var _d66=dojo.html.getViewport();
var _d67=_d66.width;
var _d68=_d66.height;
var _d69=dojo.html.getScroll().offset;
var x=_d69.x;
var y=_d69.y;
}else{
var _d6c=dojo.html.getContentBox(this.constrainingContainer);
_d67=_d6c.width;
_d68=_d6c.height;
x=this.containingBlockPosition.x+dojo.html.getPixelValue(this.constrainingContainer,"padding-left",true)+dojo.html.getBorderExtent(this.constrainingContainer,"left");
y=this.containingBlockPosition.y+dojo.html.getPixelValue(this.constrainingContainer,"padding-top",true)+dojo.html.getBorderExtent(this.constrainingContainer,"top");
}
var mb=dojo.html.getMarginBox(this.domNode);
return {minX:x,minY:y,maxX:x+_d67-mb.width,maxY:y+_d68-mb.height};
},updateDragOffset:function(){
var _d6e=dojo.html.getScroll().offset;
if(_d6e.y!=this.scrollOffset.y){
var diff=_d6e.y-this.scrollOffset.y;
this.dragOffset.y+=diff;
this.scrollOffset.y=_d6e.y;
}
if(_d6e.x!=this.scrollOffset.x){
var diff=_d6e.x-this.scrollOffset.x;
this.dragOffset.x+=diff;
this.scrollOffset.x=_d6e.x;
}
},onDragMove:function(e){
this.updateDragOffset();
var x=this.dragOffset.x+e.pageX;
var y=this.dragOffset.y+e.pageY;
if(this.constrainToContainer){
if(x<this.constraints.minX){
x=this.constraints.minX;
}
if(y<this.constraints.minY){
y=this.constraints.minY;
}
if(x>this.constraints.maxX){
x=this.constraints.maxX;
}
if(y>this.constraints.maxY){
y=this.constraints.maxY;
}
}
this.setAbsolutePosition(x,y);
dojo.event.topic.publish("dragMove",{source:this});
},setAbsolutePosition:function(x,y){
if(!this.disableY){
this.dragClone.style.top=y+"px";
}
if(!this.disableX){
this.dragClone.style.left=x+"px";
}
},onDragEnd:function(e){
switch(e.dragStatus){
case "dropSuccess":
dojo.html.removeNode(this.dragClone);
this.dragClone=null;
break;
case "dropFailure":
var _d76=dojo.html.getAbsolutePosition(this.dragClone,true);
var _d77={left:this.dragStartPosition.x+1,top:this.dragStartPosition.y+1};
var anim=dojo.lfx.slideTo(this.dragClone,_d77,300);
var _d79=this;
dojo.event.connect(anim,"onEnd",function(e){
dojo.html.removeNode(_d79.dragClone);
_d79.dragClone=null;
});
anim.play();
break;
}
dojo.event.topic.publish("dragEnd",{source:this});
},constrainTo:function(_d7b){
this.constrainToContainer=true;
if(_d7b){
this.constrainingContainer=_d7b;
}else{
this.constrainingContainer=this.domNode.parentNode;
}
}},function(node,type){
this.domNode=dojo.byId(node);
this.type=type;
this.constrainToContainer=false;
this.dragSource=null;
dojo.dnd.DragObject.prototype.register.call(this);
});
dojo.declare("dojo.dnd.HtmlDropTarget",dojo.dnd.DropTarget,{vertical:false,onDragOver:function(e){
if(!this.accepts(e.dragObjects)){
return false;
}
this.childBoxes=[];
for(var i=0,_d80;i<this.domNode.childNodes.length;i++){
_d80=this.domNode.childNodes[i];
if(_d80.nodeType!=dojo.html.ELEMENT_NODE){
continue;
}
var pos=dojo.html.getAbsolutePosition(_d80,true);
var _d82=dojo.html.getBorderBox(_d80);
this.childBoxes.push({top:pos.y,bottom:pos.y+_d82.height,left:pos.x,right:pos.x+_d82.width,height:_d82.height,width:_d82.width,node:_d80});
}
return true;
},_getNodeUnderMouse:function(e){
for(var i=0,_d85;i<this.childBoxes.length;i++){
with(this.childBoxes[i]){
if(e.pageX>=left&&e.pageX<=right&&e.pageY>=top&&e.pageY<=bottom){
return i;
}
}
}
return -1;
},createDropIndicator:function(){
this.dropIndicator=document.createElement("div");
with(this.dropIndicator.style){
position="absolute";
zIndex=999;
if(this.vertical){
borderLeftWidth="1px";
borderLeftColor="black";
borderLeftStyle="solid";
height=dojo.html.getBorderBox(this.domNode).height+"px";
top=dojo.html.getAbsolutePosition(this.domNode,true).y+"px";
}else{
borderTopWidth="1px";
borderTopColor="black";
borderTopStyle="solid";
width=dojo.html.getBorderBox(this.domNode).width+"px";
left=dojo.html.getAbsolutePosition(this.domNode,true).x+"px";
}
}
},onDragMove:function(e,_d87){
var i=this._getNodeUnderMouse(e);
if(!this.dropIndicator){
this.createDropIndicator();
}
var _d89=this.vertical?dojo.html.gravity.WEST:dojo.html.gravity.NORTH;
var hide=false;
if(i<0){
if(this.childBoxes.length){
var _d8b=(dojo.html.gravity(this.childBoxes[0].node,e)&_d89);
if(_d8b){
hide=true;
}
}else{
var _d8b=true;
}
}else{
var _d8c=this.childBoxes[i];
var _d8b=(dojo.html.gravity(_d8c.node,e)&_d89);
if(_d8c.node===_d87[0].dragSource.domNode){
hide=true;
}else{
var _d8d=_d8b?(i>0?this.childBoxes[i-1]:_d8c):(i<this.childBoxes.length-1?this.childBoxes[i+1]:_d8c);
if(_d8d.node===_d87[0].dragSource.domNode){
hide=true;
}
}
}
if(hide){
this.dropIndicator.style.display="none";
return;
}else{
this.dropIndicator.style.display="";
}
this.placeIndicator(e,_d87,i,_d8b);
if(!dojo.html.hasParent(this.dropIndicator)){
dojo.body().appendChild(this.dropIndicator);
}
},placeIndicator:function(e,_d8f,_d90,_d91){
var _d92=this.vertical?"left":"top";
var _d93;
if(_d90<0){
if(this.childBoxes.length){
_d93=_d91?this.childBoxes[0]:this.childBoxes[this.childBoxes.length-1];
}else{
this.dropIndicator.style[_d92]=dojo.html.getAbsolutePosition(this.domNode,true)[this.vertical?"x":"y"]+"px";
}
}else{
_d93=this.childBoxes[_d90];
}
if(_d93){
this.dropIndicator.style[_d92]=(_d91?_d93[_d92]:_d93[this.vertical?"right":"bottom"])+"px";
if(this.vertical){
this.dropIndicator.style.height=_d93.height+"px";
this.dropIndicator.style.top=_d93.top+"px";
}else{
this.dropIndicator.style.width=_d93.width+"px";
this.dropIndicator.style.left=_d93.left+"px";
}
}
},onDragOut:function(e){
if(this.dropIndicator){
dojo.html.removeNode(this.dropIndicator);
delete this.dropIndicator;
}
},onDrop:function(e){
this.onDragOut(e);
var i=this._getNodeUnderMouse(e);
var _d97=this.vertical?dojo.html.gravity.WEST:dojo.html.gravity.NORTH;
if(i<0){
if(this.childBoxes.length){
if(dojo.html.gravity(this.childBoxes[0].node,e)&_d97){
return this.insert(e,this.childBoxes[0].node,"before");
}else{
return this.insert(e,this.childBoxes[this.childBoxes.length-1].node,"after");
}
}
return this.insert(e,this.domNode,"append");
}
var _d98=this.childBoxes[i];
if(dojo.html.gravity(_d98.node,e)&_d97){
return this.insert(e,_d98.node,"before");
}else{
return this.insert(e,_d98.node,"after");
}
},insert:function(e,_d9a,_d9b){
var node=e.dragObject.domNode;
if(_d9b=="before"){
return dojo.html.insertBefore(node,_d9a);
}else{
if(_d9b=="after"){
return dojo.html.insertAfter(node,_d9a);
}else{
if(_d9b=="append"){
_d9a.appendChild(node);
return true;
}
}
}
return false;
}},function(node,_d9e){
if(arguments.length==0){
return;
}
this.domNode=dojo.byId(node);
dojo.dnd.DropTarget.call(this);
if(_d9e&&dojo.lang.isString(_d9e)){
_d9e=[_d9e];
}
this.acceptedTypes=_d9e||[];
dojo.dnd.dragManager.registerDropTarget(this);
});
dojo.kwCompoundRequire({common:["dojo.dnd.DragAndDrop"],browser:["dojo.dnd.HtmlDragAndDrop"],dashboard:["dojo.dnd.HtmlDragAndDrop"]});
dojo.provide("dojo.dnd.*");
dojo.provide("dojo.dnd.HtmlDragMove");
dojo.declare("dojo.dnd.HtmlDragMoveSource",dojo.dnd.HtmlDragSource,{onDragStart:function(){
var _d9f=new dojo.dnd.HtmlDragMoveObject(this.dragObject,this.type);
if(this.constrainToContainer){
_d9f.constrainTo(this.constrainingContainer);
}
return _d9f;
},onSelected:function(){
for(var i=0;i<this.dragObjects.length;i++){
dojo.dnd.dragManager.selectedSources.push(new dojo.dnd.HtmlDragMoveSource(this.dragObjects[i]));
}
}});
dojo.declare("dojo.dnd.HtmlDragMoveObject",dojo.dnd.HtmlDragObject,{onDragStart:function(e){
dojo.html.clearSelection();
this.dragClone=this.domNode;
if(dojo.html.getComputedStyle(this.domNode,"position")!="absolute"){
this.domNode.style.position="relative";
}
var left=parseInt(dojo.html.getComputedStyle(this.domNode,"left"));
var top=parseInt(dojo.html.getComputedStyle(this.domNode,"top"));
this.dragStartPosition={x:isNaN(left)?0:left,y:isNaN(top)?0:top};
this.scrollOffset=dojo.html.getScroll().offset;
this.dragOffset={y:this.dragStartPosition.y-e.pageY,x:this.dragStartPosition.x-e.pageX};
this.containingBlockPosition={x:0,y:0};
if(this.constrainToContainer){
this.constraints=this.getConstraints();
}
dojo.event.connect(this.domNode,"onclick",this,"_squelchOnClick");
},onDragEnd:function(e){
},setAbsolutePosition:function(x,y){
if(!this.disableY){
this.domNode.style.top=y+"px";
}
if(!this.disableX){
this.domNode.style.left=x+"px";
}
},_squelchOnClick:function(e){
dojo.event.browser.stopEvent(e);
dojo.event.disconnect(this.domNode,"onclick",this,"_squelchOnClick");
}});
dojo.provide("dojo.widget.ResizeHandle");
dojo.widget.defineWidget("dojo.widget.ResizeHandle",dojo.widget.HtmlWidget,{targetElmId:"",templateCssString:".dojoHtmlResizeHandle {\n\tfloat: right;\n\tposition: absolute;\n\tright: 2px;\n\tbottom: 2px;\n\twidth: 13px;\n\theight: 13px;\n\tz-index: 20;\n\tcursor: nw-resize;\n\tbackground-image: url(grabCorner.gif);\n\tline-height: 0px;\n}\n",templateCssPath:dojo.uri.moduleUri("dojo.widget","templates/ResizeHandle.css"),templateString:"<div class=\"dojoHtmlResizeHandle\"><div></div></div>",postCreate:function(){
dojo.event.connect(this.domNode,"onmousedown",this,"_beginSizing");
},_beginSizing:function(e){
if(this._isSizing){
return false;
}
this.targetWidget=dojo.widget.byId(this.targetElmId);
this.targetDomNode=this.targetWidget?this.targetWidget.domNode:dojo.byId(this.targetElmId);
if(!this.targetDomNode){
return;
}
this._isSizing=true;
this.startPoint={"x":e.clientX,"y":e.clientY};
var mb=dojo.html.getMarginBox(this.targetDomNode);
this.startSize={"w":mb.width,"h":mb.height};
dojo.event.kwConnect({srcObj:dojo.body(),srcFunc:"onmousemove",targetObj:this,targetFunc:"_changeSizing",rate:25});
dojo.event.connect(dojo.body(),"onmouseup",this,"_endSizing");
e.preventDefault();
},_changeSizing:function(e){
try{
if(!e.clientX||!e.clientY){
return;
}
}
catch(e){
return;
}
var dx=this.startPoint.x-e.clientX;
var dy=this.startPoint.y-e.clientY;
var newW=this.startSize.w-dx;
var newH=this.startSize.h-dy;
if(this.minSize){
var mb=dojo.html.getMarginBox(this.targetDomNode);
if(newW<this.minSize.w){
newW=mb.width;
}
if(newH<this.minSize.h){
newH=mb.height;
}
}
if(this.targetWidget){
this.targetWidget.resizeTo(newW,newH);
}else{
dojo.html.setMarginBox(this.targetDomNode,{width:newW,height:newH});
}
e.preventDefault();
},_endSizing:function(e){
dojo.event.disconnect(dojo.body(),"onmousemove",this,"_changeSizing");
dojo.event.disconnect(dojo.body(),"onmouseup",this,"_endSizing");
this._isSizing=false;
}});
dojo.provide("dojo.widget.FloatingPane");
dojo.declare("dojo.widget.FloatingPaneBase",null,{title:"",iconSrc:"",hasShadow:false,constrainToContainer:false,taskBarId:"",resizable:true,titleBarDisplay:true,windowState:"normal",displayCloseAction:false,displayMinimizeAction:false,displayMaximizeAction:false,_max_taskBarConnectAttempts:5,_taskBarConnectAttempts:0,templateString:"<div id=\"${this.widgetId}\" dojoAttachEvent=\"onMouseDown\" class=\"dojoFloatingPane\">\n\t<div dojoAttachPoint=\"titleBar\" class=\"dojoFloatingPaneTitleBar\"  style=\"display:none\">\n\t  \t<img dojoAttachPoint=\"titleBarIcon\"  class=\"dojoFloatingPaneTitleBarIcon\">\n\t\t<div dojoAttachPoint=\"closeAction\" dojoAttachEvent=\"onClick:closeWindow\"\n   \t  \t\tclass=\"dojoFloatingPaneCloseIcon\"></div>\n\t\t<div dojoAttachPoint=\"restoreAction\" dojoAttachEvent=\"onClick:restoreWindow\"\n   \t  \t\tclass=\"dojoFloatingPaneRestoreIcon\"></div>\n\t\t<div dojoAttachPoint=\"maximizeAction\" dojoAttachEvent=\"onClick:maximizeWindow\"\n   \t  \t\tclass=\"dojoFloatingPaneMaximizeIcon\"></div>\n\t\t<div dojoAttachPoint=\"minimizeAction\" dojoAttachEvent=\"onClick:minimizeWindow\"\n   \t  \t\tclass=\"dojoFloatingPaneMinimizeIcon\"></div>\n\t  \t<div dojoAttachPoint=\"titleBarText\" class=\"dojoFloatingPaneTitleText\">${this.title}</div>\n\t</div>\n\n\t<div id=\"${this.widgetId}_container\" dojoAttachPoint=\"containerNode\" class=\"dojoFloatingPaneClient\"></div>\n\n\t<div dojoAttachPoint=\"resizeBar\" class=\"dojoFloatingPaneResizebar\" style=\"display:none\"></div>\n</div>\n",templateCssString:"\n/********** Outer Window ***************/\n\n.dojoFloatingPane {\n\t/* essential css */\n\tposition: absolute;\n\toverflow: visible;\t\t/* so drop shadow is displayed */\n\tz-index: 10;\n\n\t/* styling css */\n\tborder: 1px solid;\n\tborder-color: ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight;\n\tbackground-color: ThreeDFace;\n}\n\n\n/********** Title Bar ****************/\n\n.dojoFloatingPaneTitleBar {\n\tvertical-align: top;\n\tmargin: 2px 2px 2px 2px;\n\tz-index: 10;\n\tbackground-color: #7596c6;\n\tcursor: default;\n\toverflow: hidden;\n\tborder-color: ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight;\n\tvertical-align: middle;\n}\n\n.dojoFloatingPaneTitleText {\n\tfloat: left;\n\tpadding: 2px 4px 2px 2px;\n\twhite-space: nowrap;\n\tcolor: CaptionText;\n\tfont: small-caption;\n}\n\n.dojoTitleBarIcon {\n\tfloat: left;\n\theight: 22px;\n\twidth: 22px;\n\tvertical-align: middle;\n\tmargin-right: 5px;\n\tmargin-left: 5px;\n}\n\n.dojoFloatingPaneActions{\n\tfloat: right;\n\tposition: absolute;\n\tright: 2px;\n\ttop: 2px;\n\tvertical-align: middle;\n}\n\n\n.dojoFloatingPaneActionItem {\n\tvertical-align: middle;\n\tmargin-right: 1px;\n\theight: 22px;\n\twidth: 22px;\n}\n\n\n.dojoFloatingPaneTitleBarIcon {\n\t/* essential css */\n\tfloat: left;\n\n\t/* styling css */\n\tmargin-left: 2px;\n\tmargin-right: 4px;\n\theight: 22px;\n}\n\n/* minimize/maximize icons are specified by CSS only */\n.dojoFloatingPaneMinimizeIcon,\n.dojoFloatingPaneMaximizeIcon,\n.dojoFloatingPaneRestoreIcon,\n.dojoFloatingPaneCloseIcon {\n\tvertical-align: middle;\n\theight: 22px;\n\twidth: 22px;\n\tfloat: right;\n}\n.dojoFloatingPaneMinimizeIcon {\n\tbackground-image: url(images/floatingPaneMinimize.gif);\n}\n.dojoFloatingPaneMaximizeIcon {\n\tbackground-image: url(images/floatingPaneMaximize.gif);\n}\n.dojoFloatingPaneRestoreIcon {\n\tbackground-image: url(images/floatingPaneRestore.gif);\n}\n.dojoFloatingPaneCloseIcon {\n\tbackground-image: url(images/floatingPaneClose.gif);\n}\n\n/* bar at bottom of window that holds resize handle */\n.dojoFloatingPaneResizebar {\n\tz-index: 10;\n\theight: 13px;\n\tbackground-color: ThreeDFace;\n}\n\n/************* Client Area ***************/\n\n.dojoFloatingPaneClient {\n\tposition: relative;\n\tz-index: 10;\n\tborder: 1px solid;\n\tborder-color: ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow;\n\tmargin: 2px;\n\tbackground-color: ThreeDFace;\n\tpadding: 8px;\n\tfont-family: Verdana, Helvetica, Garamond, sans-serif;\n\tfont-size: 12px;\n\toverflow: auto;\n}\n\n",templateCssPath:dojo.uri.moduleUri("dojo.widget","templates/FloatingPane.css"),fillInFloatingPaneTemplate:function(args,frag){
var _db3=this.getFragNodeRef(frag);
dojo.html.copyStyle(this.domNode,_db3);
dojo.body().appendChild(this.domNode);
if(!this.isShowing()){
this.windowState="minimized";
}
if(this.iconSrc==""){
dojo.html.removeNode(this.titleBarIcon);
}else{
this.titleBarIcon.src=this.iconSrc.toString();
}
if(this.titleBarDisplay){
this.titleBar.style.display="";
dojo.html.disableSelection(this.titleBar);
this.titleBarIcon.style.display=(this.iconSrc==""?"none":"");
this.minimizeAction.style.display=(this.displayMinimizeAction?"":"none");
this.maximizeAction.style.display=(this.displayMaximizeAction&&this.windowState!="maximized"?"":"none");
this.restoreAction.style.display=(this.displayMaximizeAction&&this.windowState=="maximized"?"":"none");
this.closeAction.style.display=(this.displayCloseAction?"":"none");
this.drag=new dojo.dnd.HtmlDragMoveSource(this.domNode);
if(this.constrainToContainer){
this.drag.constrainTo();
}
this.drag.setDragHandle(this.titleBar);
var self=this;
dojo.event.topic.subscribe("dragMove",function(info){
if(info.source.domNode==self.domNode){
dojo.event.topic.publish("floatingPaneMove",{source:self});
}
});
}
if(this.resizable){
this.resizeBar.style.display="";
this.resizeHandle=dojo.widget.createWidget("ResizeHandle",{targetElmId:this.widgetId,id:this.widgetId+"_resize"});
this.resizeBar.appendChild(this.resizeHandle.domNode);
}
if(this.hasShadow){
this.shadow=new dojo.lfx.shadow(this.domNode);
}
this.bgIframe=new dojo.html.BackgroundIframe(this.domNode);
if(this.taskBarId){
this._taskBarSetup();
}
dojo.body().removeChild(this.domNode);
},postCreate:function(){
if(dojo.hostenv.post_load_){
this._setInitialWindowState();
}else{
dojo.addOnLoad(this,"_setInitialWindowState");
}
},maximizeWindow:function(evt){
var mb=dojo.html.getMarginBox(this.domNode);
this.previous={width:mb.width||this.width,height:mb.height||this.height,left:this.domNode.style.left,top:this.domNode.style.top,bottom:this.domNode.style.bottom,right:this.domNode.style.right};
if(this.domNode.parentNode.style.overflow.toLowerCase()!="hidden"){
this.parentPrevious={overflow:this.domNode.parentNode.style.overflow};
dojo.debug(this.domNode.parentNode.style.overflow);
this.domNode.parentNode.style.overflow="hidden";
}
this.domNode.style.left=dojo.html.getPixelValue(this.domNode.parentNode,"padding-left",true)+"px";
this.domNode.style.top=dojo.html.getPixelValue(this.domNode.parentNode,"padding-top",true)+"px";
if((this.domNode.parentNode.nodeName.toLowerCase()=="body")){
var _db8=dojo.html.getViewport();
var _db9=dojo.html.getPadding(dojo.body());
this.resizeTo(_db8.width-_db9.width,_db8.height-_db9.height);
}else{
var _dba=dojo.html.getContentBox(this.domNode.parentNode);
this.resizeTo(_dba.width,_dba.height);
}
this.maximizeAction.style.display="none";
this.restoreAction.style.display="";
if(this.resizeHandle){
this.resizeHandle.domNode.style.display="none";
}
this.drag.setDragHandle(null);
this.windowState="maximized";
},minimizeWindow:function(evt){
this.hide();
for(var attr in this.parentPrevious){
this.domNode.parentNode.style[attr]=this.parentPrevious[attr];
}
this.lastWindowState=this.windowState;
this.windowState="minimized";
},restoreWindow:function(evt){
if(this.windowState=="minimized"){
this.show();
if(this.lastWindowState=="maximized"){
this.domNode.parentNode.style.overflow="hidden";
this.windowState="maximized";
}else{
this.windowState="normal";
}
}else{
if(this.windowState=="maximized"){
for(var attr in this.previous){
this.domNode.style[attr]=this.previous[attr];
}
for(var attr in this.parentPrevious){
this.domNode.parentNode.style[attr]=this.parentPrevious[attr];
}
this.resizeTo(this.previous.width,this.previous.height);
this.previous=null;
this.parentPrevious=null;
this.restoreAction.style.display="none";
this.maximizeAction.style.display=this.displayMaximizeAction?"":"none";
if(this.resizeHandle){
this.resizeHandle.domNode.style.display="";
}
this.drag.setDragHandle(this.titleBar);
this.windowState="normal";
}else{
}
}
},toggleDisplay:function(){
if(this.windowState=="minimized"){
this.restoreWindow();
}else{
this.minimizeWindow();
}
},closeWindow:function(evt){
dojo.html.removeNode(this.domNode);
this.destroy();
},onMouseDown:function(evt){
this.bringToTop();
},bringToTop:function(){
var _dc1=dojo.widget.manager.getWidgetsByType(this.widgetType);
var _dc2=[];
for(var x=0;x<_dc1.length;x++){
if(this.widgetId!=_dc1[x].widgetId){
_dc2.push(_dc1[x]);
}
}
_dc2.sort(function(a,b){
return a.domNode.style.zIndex-b.domNode.style.zIndex;
});
_dc2.push(this);
var _dc6=100;
for(x=0;x<_dc2.length;x++){
_dc2[x].domNode.style.zIndex=_dc6+x*2;
}
},_setInitialWindowState:function(){
if(this.isShowing()){
this.width=-1;
var mb=dojo.html.getMarginBox(this.domNode);
this.resizeTo(mb.width,mb.height);
}
if(this.windowState=="maximized"){
this.maximizeWindow();
this.show();
return;
}
if(this.windowState=="normal"){
this.show();
return;
}
if(this.windowState=="minimized"){
this.hide();
return;
}
this.windowState="minimized";
},_taskBarSetup:function(){
var _dc8=dojo.widget.getWidgetById(this.taskBarId);
if(!_dc8){
if(this._taskBarConnectAttempts<this._max_taskBarConnectAttempts){
dojo.lang.setTimeout(this,this._taskBarSetup,50);
this._taskBarConnectAttempts++;
}else{
dojo.debug("Unable to connect to the taskBar");
}
return;
}
_dc8.addChild(this);
},showFloatingPane:function(){
this.bringToTop();
},onFloatingPaneShow:function(){
var mb=dojo.html.getMarginBox(this.domNode);
this.resizeTo(mb.width,mb.height);
},resizeTo:function(_dca,_dcb){
dojo.html.setMarginBox(this.domNode,{width:_dca,height:_dcb});
dojo.widget.html.layout(this.domNode,[{domNode:this.titleBar,layoutAlign:"top"},{domNode:this.resizeBar,layoutAlign:"bottom"},{domNode:this.containerNode,layoutAlign:"client"}]);
dojo.widget.html.layout(this.containerNode,this.children,"top-bottom");
this.bgIframe.onResized();
if(this.shadow){
this.shadow.size(_dca,_dcb);
}
this.onResized();
},checkSize:function(){
},destroyFloatingPane:function(){
if(this.resizeHandle){
this.resizeHandle.destroy();
this.resizeHandle=null;
}
}});
dojo.widget.defineWidget("dojo.widget.FloatingPane",[dojo.widget.ContentPane,dojo.widget.FloatingPaneBase],{fillInTemplate:function(args,frag){
this.fillInFloatingPaneTemplate(args,frag);
dojo.widget.FloatingPane.superclass.fillInTemplate.call(this,args,frag);
},postCreate:function(){
dojo.widget.FloatingPaneBase.prototype.postCreate.apply(this,arguments);
dojo.widget.FloatingPane.superclass.postCreate.apply(this,arguments);
},show:function(){
dojo.widget.FloatingPane.superclass.show.apply(this,arguments);
this.showFloatingPane();
},onShow:function(){
dojo.widget.FloatingPane.superclass.onShow.call(this);
this.onFloatingPaneShow();
},destroy:function(){
this.destroyFloatingPane();
dojo.widget.FloatingPane.superclass.destroy.apply(this,arguments);
}});
dojo.widget.defineWidget("dojo.widget.ModalFloatingPane",[dojo.widget.FloatingPane,dojo.widget.ModalDialogBase],{windowState:"minimized",displayCloseAction:true,postCreate:function(){
dojo.widget.ModalDialogBase.prototype.postCreate.call(this);
dojo.widget.ModalFloatingPane.superclass.postCreate.call(this);
},show:function(){
this.showModalDialog();
dojo.widget.ModalFloatingPane.superclass.show.apply(this,arguments);
this.bg.style.zIndex=this.domNode.style.zIndex-1;
},hide:function(){
this.hideModalDialog();
dojo.widget.ModalFloatingPane.superclass.hide.apply(this,arguments);
},closeWindow:function(){
this.hide();
dojo.widget.ModalFloatingPane.superclass.closeWindow.apply(this,arguments);
}});
dojo.provide("dojo.widget.Editor2Plugin.AlwaysShowToolbar");
dojo.event.topic.subscribe("dojo.widget.Editor2::onLoad",function(_dce){
if(_dce.toolbarAlwaysVisible){
var p=new dojo.widget.Editor2Plugin.AlwaysShowToolbar(_dce);
}
});
dojo.declare("dojo.widget.Editor2Plugin.AlwaysShowToolbar",null,function(_dd0){
this.editor=_dd0;
this.editor.registerLoadedPlugin(this);
this.setup();
},{_scrollSetUp:false,_fixEnabled:false,_scrollThreshold:false,_handleScroll:true,setup:function(){
var tdn=this.editor.toolbarWidget;
if(!tdn.tbBgIframe){
tdn.tbBgIframe=new dojo.html.BackgroundIframe(tdn.domNode);
tdn.tbBgIframe.onResized();
}
this.scrollInterval=setInterval(dojo.lang.hitch(this,"globalOnScrollHandler"),100);
dojo.event.connect("before",this.editor.toolbarWidget,"destroy",this,"destroy");
},globalOnScrollHandler:function(){
var isIE=dojo.render.html.ie;
if(!this._handleScroll){
return;
}
var dh=dojo.html;
var tdn=this.editor.toolbarWidget.domNode;
var db=dojo.body();
if(!this._scrollSetUp){
this._scrollSetUp=true;
var _dd6=dh.getMarginBox(this.editor.domNode).width;
this._scrollThreshold=dh.abs(tdn,true).y;
if((isIE)&&(db)&&(dh.getStyle(db,"background-image")=="none")){
with(db.style){
backgroundImage="url("+dojo.uri.moduleUri("dojo.widget","templates/images/blank.gif")+")";
backgroundAttachment="fixed";
}
}
}
var _dd7=(window["pageYOffset"])?window["pageYOffset"]:(document["documentElement"]||document["body"]).scrollTop;
if(_dd7>this._scrollThreshold){
if(!this._fixEnabled){
var _dd8=dojo.html.getMarginBox(tdn);
this.editor.editorObject.style.marginTop=_dd8.height+"px";
if(isIE){
tdn.style.left=dojo.html.abs(tdn,dojo.html.boxSizing.MARGIN_BOX).x;
if(tdn.previousSibling){
this._IEOriginalPos=["after",tdn.previousSibling];
}else{
if(tdn.nextSibling){
this._IEOriginalPos=["before",tdn.nextSibling];
}else{
this._IEOriginalPos=["",tdn.parentNode];
}
}
dojo.body().appendChild(tdn);
dojo.html.addClass(tdn,"IEFixedToolbar");
}else{
with(tdn.style){
position="fixed";
top="0px";
}
}
tdn.style.width=_dd8.width+"px";
tdn.style.zIndex=1000;
this._fixEnabled=true;
}
if(!dojo.render.html.safari){
var _dd9=(this.height)?parseInt(this.editor.height):this.editor._lastHeight;
if(_dd7>(this._scrollThreshold+_dd9)){
tdn.style.display="none";
}else{
tdn.style.display="";
}
}
}else{
if(this._fixEnabled){
(this.editor.object||this.editor.iframe).style.marginTop=null;
with(tdn.style){
position="";
top="";
zIndex="";
display="";
}
if(isIE){
tdn.style.left="";
dojo.html.removeClass(tdn,"IEFixedToolbar");
if(this._IEOriginalPos){
dojo.html.insertAtPosition(tdn,this._IEOriginalPos[1],this._IEOriginalPos[0]);
this._IEOriginalPos=null;
}else{
dojo.html.insertBefore(tdn,this.editor.object||this.editor.iframe);
}
}
tdn.style.width="";
this._fixEnabled=false;
}
}
},destroy:function(){
this._IEOriginalPos=null;
this._handleScroll=false;
clearInterval(this.scrollInterval);
this.editor.unregisterLoadedPlugin(this);
if(dojo.render.html.ie){
dojo.html.removeClass(this.editor.toolbarWidget.domNode,"IEFixedToolbar");
}
}});
dojo.provide("dojo.widget.Editor2");
dojo.widget.Editor2Manager=new dojo.widget.HandlerManager;
dojo.lang.mixin(dojo.widget.Editor2Manager,{_currentInstance:null,commandState:{Disabled:0,Latched:1,Enabled:2},getCurrentInstance:function(){
return this._currentInstance;
},setCurrentInstance:function(inst){
this._currentInstance=inst;
},getCommand:function(_ddb,name){
var _ddd;
name=name.toLowerCase();
for(var i=0;i<this._registeredHandlers.length;i++){
_ddd=this._registeredHandlers[i](_ddb,name);
if(_ddd){
return _ddd;
}
}
switch(name){
case "htmltoggle":
_ddd=new dojo.widget.Editor2BrowserCommand(_ddb,name);
break;
case "formatblock":
_ddd=new dojo.widget.Editor2FormatBlockCommand(_ddb,name);
break;
case "anchor":
_ddd=new dojo.widget.Editor2Command(_ddb,name);
break;
case "createlink":
_ddd=new dojo.widget.Editor2DialogCommand(_ddb,name,{contentFile:"dojo.widget.Editor2Plugin.CreateLinkDialog",contentClass:"Editor2CreateLinkDialog",title:"Insert/Edit Link",width:"300px",height:"200px"});
break;
case "insertimage":
_ddd=new dojo.widget.Editor2DialogCommand(_ddb,name,{contentFile:"dojo.widget.Editor2Plugin.InsertImageDialog",contentClass:"Editor2InsertImageDialog",title:"Insert/Edit Image",width:"400px",height:"270px"});
break;
default:
var _ddf=this.getCurrentInstance();
if((_ddf&&_ddf.queryCommandAvailable(name))||(!_ddf&&dojo.widget.Editor2.prototype.queryCommandAvailable(name))){
_ddd=new dojo.widget.Editor2BrowserCommand(_ddb,name);
}else{
dojo.debug("dojo.widget.Editor2Manager.getCommand: Unknown command "+name);
return;
}
}
return _ddd;
},destroy:function(){
this._currentInstance=null;
dojo.widget.HandlerManager.prototype.destroy.call(this);
}});
dojo.addOnUnload(dojo.widget.Editor2Manager,"destroy");
dojo.lang.declare("dojo.widget.Editor2Command",null,function(_de0,name){
this._editor=_de0;
this._updateTime=0;
this._name=name;
},{_text:"Unknown",execute:function(para){
dojo.unimplemented("dojo.widget.Editor2Command.execute");
},getText:function(){
return this._text;
},getState:function(){
return dojo.widget.Editor2Manager.commandState.Enabled;
},destroy:function(){
}});
dojo.widget.Editor2BrowserCommandNames={"bold":"Bold","copy":"Copy","cut":"Cut","Delete":"Delete","indent":"Indent","inserthorizontalrule":"Horizental Rule","insertorderedlist":"Numbered List","insertunorderedlist":"Bullet List","italic":"Italic","justifycenter":"Align Center","justifyfull":"Justify","justifyleft":"Align Left","justifyright":"Align Right","outdent":"Outdent","paste":"Paste","redo":"Redo","removeformat":"Remove Format","selectall":"Select All","strikethrough":"Strikethrough","subscript":"Subscript","superscript":"Superscript","underline":"Underline","undo":"Undo","unlink":"Remove Link","createlink":"Create Link","insertimage":"Insert Image","htmltoggle":"HTML Source","forecolor":"Foreground Color","hilitecolor":"Background Color","plainformatblock":"Paragraph Style","formatblock":"Paragraph Style","fontsize":"Font Size","fontname":"Font Name"};
dojo.lang.declare("dojo.widget.Editor2BrowserCommand",dojo.widget.Editor2Command,function(_de3,name){
var text=dojo.widget.Editor2BrowserCommandNames[name.toLowerCase()];
if(text){
this._text=text;
}
},{execute:function(para){
this._editor.execCommand(this._name,para);
},getState:function(){
if(this._editor._lastStateTimestamp>this._updateTime||this._state==undefined){
this._updateTime=this._editor._lastStateTimestamp;
try{
if(this._editor.queryCommandEnabled(this._name)){
if(this._editor.queryCommandState(this._name)){
this._state=dojo.widget.Editor2Manager.commandState.Latched;
}else{
this._state=dojo.widget.Editor2Manager.commandState.Enabled;
}
}else{
this._state=dojo.widget.Editor2Manager.commandState.Disabled;
}
}
catch(e){
this._state=dojo.widget.Editor2Manager.commandState.Enabled;
}
}
return this._state;
},getValue:function(){
try{
return this._editor.queryCommandValue(this._name);
}
catch(e){
}
}});
dojo.lang.declare("dojo.widget.Editor2FormatBlockCommand",dojo.widget.Editor2BrowserCommand,{});
dojo.widget.defineWidget("dojo.widget.Editor2Dialog",[dojo.widget.HtmlWidget,dojo.widget.FloatingPaneBase,dojo.widget.ModalDialogBase],{templateString:"<div id=\"${this.widgetId}\" class=\"dojoFloatingPane\">\n\t<span dojoattachpoint=\"tabStartOuter\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\"\ttabindex=\"0\"></span>\n\t<span dojoattachpoint=\"tabStart\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n\t<div dojoAttachPoint=\"titleBar\" class=\"dojoFloatingPaneTitleBar\"  style=\"display:none\">\n\t  \t<img dojoAttachPoint=\"titleBarIcon\"  class=\"dojoFloatingPaneTitleBarIcon\">\n\t\t<div dojoAttachPoint=\"closeAction\" dojoAttachEvent=\"onClick:hide\"\n   \t  \t\tclass=\"dojoFloatingPaneCloseIcon\"></div>\n\t\t<div dojoAttachPoint=\"restoreAction\" dojoAttachEvent=\"onClick:restoreWindow\"\n   \t  \t\tclass=\"dojoFloatingPaneRestoreIcon\"></div>\n\t\t<div dojoAttachPoint=\"maximizeAction\" dojoAttachEvent=\"onClick:maximizeWindow\"\n   \t  \t\tclass=\"dojoFloatingPaneMaximizeIcon\"></div>\n\t\t<div dojoAttachPoint=\"minimizeAction\" dojoAttachEvent=\"onClick:minimizeWindow\"\n   \t  \t\tclass=\"dojoFloatingPaneMinimizeIcon\"></div>\n\t  \t<div dojoAttachPoint=\"titleBarText\" class=\"dojoFloatingPaneTitleText\">${this.title}</div>\n\t</div>\n\n\t<div id=\"${this.widgetId}_container\" dojoAttachPoint=\"containerNode\" class=\"dojoFloatingPaneClient\"></div>\n\t<span dojoattachpoint=\"tabEnd\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n\t<span dojoattachpoint=\"tabEndOuter\" dojoonfocus=\"trapTabs\" dojoonblur=\"clearTrap\" tabindex=\"0\"></span>\n\t<div dojoAttachPoint=\"resizeBar\" class=\"dojoFloatingPaneResizebar\" style=\"display:none\"></div>\n</div>\n",modal:true,width:"",height:"",windowState:"minimized",displayCloseAction:true,contentFile:"",contentClass:"",fillInTemplate:function(args,frag){
this.fillInFloatingPaneTemplate(args,frag);
dojo.widget.Editor2Dialog.superclass.fillInTemplate.call(this,args,frag);
},postCreate:function(){
if(this.contentFile){
dojo.require(this.contentFile);
}
if(this.modal){
dojo.widget.ModalDialogBase.prototype.postCreate.call(this);
}else{
with(this.domNode.style){
zIndex=999;
display="none";
}
}
dojo.widget.FloatingPaneBase.prototype.postCreate.apply(this,arguments);
dojo.widget.Editor2Dialog.superclass.postCreate.call(this);
if(this.width&&this.height){
with(this.domNode.style){
width=this.width;
height=this.height;
}
}
},createContent:function(){
if(!this.contentWidget&&this.contentClass){
this.contentWidget=dojo.widget.createWidget(this.contentClass);
this.addChild(this.contentWidget);
}
},show:function(){
if(!this.contentWidget){
dojo.widget.Editor2Dialog.superclass.show.apply(this,arguments);
this.createContent();
dojo.widget.Editor2Dialog.superclass.hide.call(this);
}
if(!this.contentWidget||!this.contentWidget.loadContent()){
return;
}
this.showFloatingPane();
dojo.widget.Editor2Dialog.superclass.show.apply(this,arguments);
if(this.modal){
this.showModalDialog();
}
if(this.modal){
this.bg.style.zIndex=this.domNode.style.zIndex-1;
}
},onShow:function(){
dojo.widget.Editor2Dialog.superclass.onShow.call(this);
this.onFloatingPaneShow();
},closeWindow:function(){
this.hide();
dojo.widget.Editor2Dialog.superclass.closeWindow.apply(this,arguments);
},hide:function(){
if(this.modal){
this.hideModalDialog();
}
dojo.widget.Editor2Dialog.superclass.hide.call(this);
},checkSize:function(){
if(this.isShowing()){
if(this.modal){
this._sizeBackground();
}
this.placeModalDialog();
this.onResized();
}
}});
dojo.widget.defineWidget("dojo.widget.Editor2DialogContent",dojo.widget.HtmlWidget,{widgetsInTemplate:true,loadContent:function(){
return true;
},cancel:function(){
this.parent.hide();
}});
dojo.lang.declare("dojo.widget.Editor2DialogCommand",dojo.widget.Editor2BrowserCommand,function(_de9,name,_deb){
this.dialogParas=_deb;
},{execute:function(){
if(!this.dialog){
if(!this.dialogParas.contentFile||!this.dialogParas.contentClass){
alert("contentFile and contentClass should be set for dojo.widget.Editor2DialogCommand.dialogParas!");
return;
}
this.dialog=dojo.widget.createWidget("Editor2Dialog",this.dialogParas);
dojo.body().appendChild(this.dialog.domNode);
dojo.event.connect(this,"destroy",this.dialog,"destroy");
}
this.dialog.show();
},getText:function(){
return this.dialogParas.title||dojo.widget.Editor2DialogCommand.superclass.getText.call(this);
}});
dojo.widget.Editor2ToolbarGroups={};
dojo.widget.defineWidget("dojo.widget.Editor2",dojo.widget.RichText,function(){
this._loadedCommands={};
},{toolbarAlwaysVisible:false,toolbarWidget:null,scrollInterval:null,toolbarTemplatePath:dojo.uri.cache.set(dojo.uri.moduleUri("dojo.widget","templates/EditorToolbarOneline.html"), "<div class=\"EditorToolbarDomNode EditorToolbarSmallBg\">\n\t<table cellpadding=\"1\" cellspacing=\"0\" border=\"0\">\n\t\t<tbody>\n\t\t\t<tr valign=\"top\" align=\"left\">\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"htmltoggle\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon\" \n\t\t\t\t\t\tstyle=\"background-image: none; width: 30px;\" >&lt;h&gt;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"copy\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Copy\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"paste\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Paste\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"undo\">\n\t\t\t\t\t\t<!-- FIXME: should we have the text \"undo\" here? -->\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Undo\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"redo\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Redo\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td isSpacer=\"true\">\n\t\t\t\t\t<span class=\"iconContainer\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Sep\"\tstyle=\"width: 5px; min-width: 5px;\"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"createlink\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Link\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"insertimage\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Image\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"inserthorizontalrule\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_HorizontalLine \">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"bold\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Bold\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"italic\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Italic\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"underline\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Underline\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"strikethrough\">\n\t\t\t\t\t\t<span \n\t\t\t\t\t\t\tclass=\"dojoE2TBIcon dojoE2TBIcon_StrikeThrough\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td isSpacer=\"true\">\n\t\t\t\t\t<span class=\"iconContainer\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Sep\" \n\t\t\t\t\t\t\tstyle=\"width: 5px; min-width: 5px;\"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"insertunorderedlist\">\n\t\t\t\t\t\t<span \n\t\t\t\t\t\t\tclass=\"dojoE2TBIcon dojoE2TBIcon_BulletedList\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"insertorderedlist\">\n\t\t\t\t\t\t<span \n\t\t\t\t\t\t\tclass=\"dojoE2TBIcon dojoE2TBIcon_NumberedList\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td isSpacer=\"true\">\n\t\t\t\t\t<span class=\"iconContainer\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Sep\" style=\"width: 5px; min-width: 5px;\"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"indent\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Indent\" \n\t\t\t\t\t\t\tunselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"outdent\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Outdent\" \n\t\t\t\t\t\t\tunselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td isSpacer=\"true\">\n\t\t\t\t\t<span class=\"iconContainer\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Sep\" style=\"width: 5px; min-width: 5px;\"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"forecolor\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_TextColor\" \n\t\t\t\t\t\t\tunselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"hilitecolor\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_BackgroundColor\" \n\t\t\t\t\t\t\tunselectable=\"on\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td isSpacer=\"true\">\n\t\t\t\t\t<span class=\"iconContainer\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Sep\" style=\"width: 5px; min-width: 5px;\"></span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"justifyleft\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_LeftJustify\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"justifycenter\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_CenterJustify\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"justifyright\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_RightJustify\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\n\t\t\t\t<td>\n\t\t\t\t\t<span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"justifyfull\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_BlockJustify\">&nbsp;</span>\n\t\t\t\t\t</span>\n\t\t\t\t</td>\t\n\t\t\t\t<td>\n\t\t\t\t\t<select class=\"dojoEditorToolbarItem\" dojoETItemName=\"plainformatblock\">\n\t\t\t\t\t\t<!-- FIXME: using \"p\" here inserts a paragraph in most cases! -->\n\t\t\t\t\t\t<option value=\"\">-- format --</option>\n\t\t\t\t\t\t<option value=\"p\">Normal</option>\n\t\t\t\t\t\t<option value=\"pre\">Fixed Font</option>\n\t\t\t\t\t\t<option value=\"h1\">Main Heading</option>\n\t\t\t\t\t\t<option value=\"h2\">Section Heading</option>\n\t\t\t\t\t\t<option value=\"h3\">Sub-Heading</option>\n\t\t\t\t\t\t<!-- <option value=\"blockquote\">Block Quote</option> -->\n\t\t\t\t\t</select>\n\t\t\t\t</td>\n\t\t\t\t<td><!-- uncomment to enable save button -->\n\t\t\t\t\t<!-- save -->\n\t\t\t\t\t<!--span class=\"iconContainer dojoEditorToolbarItem\" dojoETItemName=\"save\">\n\t\t\t\t\t\t<span class=\"dojoE2TBIcon dojoE2TBIcon_Save\">&nbsp;</span>\n\t\t\t\t\t</span-->\n\t\t\t\t</td>\n\t\t\t\t<td width=\"*\">&nbsp;</td>\n\t\t\t</tr>\n\t\t</tbody>\n\t</table>\n</div>\n"),toolbarTemplateCssPath:null,toolbarPlaceHolder:"",_inSourceMode:false,_htmlEditNode:null,toolbarGroup:"",shareToolbar:false,contextMenuGroupSet:"",editorOnLoad:function(){
dojo.event.topic.publish("dojo.widget.Editor2::preLoadingToolbar",this);
if(this.toolbarAlwaysVisible){
}
if(this.toolbarWidget){
this.toolbarWidget.show();
dojo.html.insertBefore(this.toolbarWidget.domNode,this.domNode.firstChild);
}else{
if(this.shareToolbar){
dojo.deprecated("Editor2:shareToolbar is deprecated in favor of toolbarGroup","0.5");
this.toolbarGroup="defaultDojoToolbarGroup";
}
if(this.toolbarGroup){
if(dojo.widget.Editor2ToolbarGroups[this.toolbarGroup]){
this.toolbarWidget=dojo.widget.Editor2ToolbarGroups[this.toolbarGroup];
}
}
if(!this.toolbarWidget){
var _dec={shareGroup:this.toolbarGroup,parent:this};
_dec.templateString=dojo.uri.cache.get(this.toolbarTemplatePath);
if(this.toolbarTemplateCssPath){
_dec.templateCssPath=this.toolbarTemplateCssPath;
_dec.templateCssString=dojo.uri.cache.get(this.toolbarTemplateCssPath);
}
if(this.toolbarPlaceHolder){
this.toolbarWidget=dojo.widget.createWidget("Editor2Toolbar",_dec,dojo.byId(this.toolbarPlaceHolder),"after");
}else{
this.toolbarWidget=dojo.widget.createWidget("Editor2Toolbar",_dec,this.domNode.firstChild,"before");
}
if(this.toolbarGroup){
dojo.widget.Editor2ToolbarGroups[this.toolbarGroup]=this.toolbarWidget;
}
dojo.event.connect(this,"close",this.toolbarWidget,"hide");
this.toolbarLoaded();
}
}
dojo.event.topic.registerPublisher("Editor2.clobberFocus",this,"clobberFocus");
dojo.event.topic.subscribe("Editor2.clobberFocus",this,"setBlur");
dojo.event.topic.publish("dojo.widget.Editor2::onLoad",this);
},toolbarLoaded:function(){
},registerLoadedPlugin:function(obj){
if(!this.loadedPlugins){
this.loadedPlugins=[];
}
this.loadedPlugins.push(obj);
},unregisterLoadedPlugin:function(obj){
for(var i in this.loadedPlugins){
if(this.loadedPlugins[i]===obj){
delete this.loadedPlugins[i];
return;
}
}
dojo.debug("dojo.widget.Editor2.unregisterLoadedPlugin: unknow plugin object: "+obj);
},execCommand:function(_df0,_df1){
switch(_df0.toLowerCase()){
case "htmltoggle":
this.toggleHtmlEditing();
break;
default:
dojo.widget.Editor2.superclass.execCommand.apply(this,arguments);
}
},queryCommandEnabled:function(_df2,_df3){
switch(_df2.toLowerCase()){
case "htmltoggle":
return true;
default:
if(this._inSourceMode){
return false;
}
return dojo.widget.Editor2.superclass.queryCommandEnabled.apply(this,arguments);
}
},queryCommandState:function(_df4,_df5){
switch(_df4.toLowerCase()){
case "htmltoggle":
return this._inSourceMode;
default:
return dojo.widget.Editor2.superclass.queryCommandState.apply(this,arguments);
}
},onClick:function(e){
dojo.widget.Editor2.superclass.onClick.call(this,e);
if(dojo.widget.PopupManager){
if(!e){
e=this.window.event;
}
dojo.widget.PopupManager.onClick(e);
}
},clobberFocus:function(){
},toggleHtmlEditing:function(){
if(this===dojo.widget.Editor2Manager.getCurrentInstance()){
if(!this._inSourceMode){
var html=this.getEditorContent();
this._inSourceMode=true;
if(!this._htmlEditNode){
this._htmlEditNode=dojo.doc().createElement("textarea");
dojo.html.insertAfter(this._htmlEditNode,this.editorObject);
}
this._htmlEditNode.style.display="";
this._htmlEditNode.style.width="100%";
this._htmlEditNode.style.height=dojo.html.getBorderBox(this.editNode).height+"px";
this._htmlEditNode.value=html;
with(this.editorObject.style){
position="absolute";
left="-2000px";
top="-2000px";
}
}else{
this._inSourceMode=false;
this._htmlEditNode.blur();
with(this.editorObject.style){
position="";
left="";
top="";
}
var html=this._htmlEditNode.value;
dojo.lang.setTimeout(this,"replaceEditorContent",1,html);
this._htmlEditNode.style.display="none";
this.focus();
}
this.onDisplayChanged(null,true);
}
},setFocus:function(){
if(dojo.widget.Editor2Manager.getCurrentInstance()===this){
return;
}
this.clobberFocus();
dojo.widget.Editor2Manager.setCurrentInstance(this);
},setBlur:function(){
},saveSelection:function(){
this._bookmark=null;
this._bookmark=dojo.withGlobal(this.window,dojo.html.selection.getBookmark);
},restoreSelection:function(){
if(this._bookmark){
this.focus();
dojo.withGlobal(this.window,"moveToBookmark",dojo.html.selection,[this._bookmark]);
this._bookmark=null;
}else{
dojo.debug("restoreSelection: no saved selection is found!");
}
},_updateToolbarLastRan:null,_updateToolbarTimer:null,_updateToolbarFrequency:500,updateToolbar:function(_df8){
if((!this.isLoaded)||(!this.toolbarWidget)){
return;
}
var diff=new Date()-this._updateToolbarLastRan;
if((!_df8)&&(this._updateToolbarLastRan)&&((diff<this._updateToolbarFrequency))){
clearTimeout(this._updateToolbarTimer);
var _dfa=this;
this._updateToolbarTimer=setTimeout(function(){
_dfa.updateToolbar();
},this._updateToolbarFrequency/2);
return;
}else{
this._updateToolbarLastRan=new Date();
}
if(dojo.widget.Editor2Manager.getCurrentInstance()!==this){
return;
}
this.toolbarWidget.update();
},destroy:function(_dfb){
this._htmlEditNode=null;
dojo.event.disconnect(this,"close",this.toolbarWidget,"hide");
if(!_dfb){
this.toolbarWidget.destroy();
}
dojo.widget.Editor2.superclass.destroy.call(this);
},_lastStateTimestamp:0,onDisplayChanged:function(e,_dfd){
this._lastStateTimestamp=(new Date()).getTime();
dojo.widget.Editor2.superclass.onDisplayChanged.call(this,e);
this.updateToolbar(_dfd);
},onLoad:function(){
try{
dojo.widget.Editor2.superclass.onLoad.call(this);
}
catch(e){
dojo.debug(e);
}
this.editorOnLoad();
},onFocus:function(){
dojo.widget.Editor2.superclass.onFocus.call(this);
this.setFocus();
},getEditorContent:function(){
if(this._inSourceMode){
return this._htmlEditNode.value;
}
return dojo.widget.Editor2.superclass.getEditorContent.call(this);
},replaceEditorContent:function(html){
if(this._inSourceMode){
this._htmlEditNode.value=html;
return;
}
dojo.widget.Editor2.superclass.replaceEditorContent.apply(this,arguments);
},getCommand:function(name){
if(this._loadedCommands[name]){
return this._loadedCommands[name];
}
var cmd=dojo.widget.Editor2Manager.getCommand(this,name);
this._loadedCommands[name]=cmd;
return cmd;
},shortcuts:[["bold"],["italic"],["underline"],["selectall","a"],["insertunorderedlist","\\"]],setupDefaultShortcuts:function(){
var exec=function(cmd){
return function(){
cmd.execute();
};
};
var self=this;
dojo.lang.forEach(this.shortcuts,function(item){
var cmd=self.getCommand(item[0]);
if(cmd){
self.addKeyHandler(item[1]?item[1]:item[0].charAt(0),item[2]==undefined?self.KEY_CTRL:item[2],exec(cmd));
}
});
}});
dojo.provide("coupa.widget.Button");
dojo.widget.defineWidget("coupa.widget.Button",dojo.widget.Button,{templateString:"<div dojoAttachPoint=\"buttonNode\" class=\"dojoButton\" style=\"position:relative;\" dojoAttachEvent=\"onMouseOver; onMouseOut; onMouseDown; onMouseUp; onClick:buttonClick; onKey:onKey; onFocus;\">\n  <div class=\"dojoButtonContents\" align=center dojoAttachPoint=\"containerNode\" style=\"position:absolute;z-index:2;\"></div>\n  <img dojoAttachPoint=\"leftImage\" style=\"position:absolute;left:0px;\" />\n  <img dojoAttachPoint=\"centerImage\" style=\"position:absolute;z-index:1;\" />\n  <img dojoAttachPoint=\"rightImage\" style=\"position:absolute;top:0px;right:0px;\" />\n  <input type=\"button\" value=\"\" dojoAttachPoint=\"inputNode\" style=\"border: 0px none; margin: 0px; padding: 0px; height: 0px; width: 0px; font-size: 0px;\" />\n</div>\n",templateCssString:"/* ---- button --- */\n.dojoButton {\n\tpadding: 0 0 0 0;\n\tfont-size: 8.5pt;\n\twhite-space: nowrap;\n\tcursor: pointer;\n\tfont-family: 'Trebuchet MS', 'Lucida Grande', Verdana, Arial, Sans-Serif;\n\tborder: 1px solid #999;\n}\n\n.dojoButton .dojoButtonContents {\n\tpadding: 2px 2px 2px 2px;\n\ttext-align: center;\t\t/* if icon and label are split across two lines, center icon */\n\tcolor: #369;\n}\n\n.dojoButtonLeftPart .dojoButtonContents {\n\tpadding-right: 8px;\n}\n\n.dojoButtonDisabled {\n\tcursor: url(\"images/no.gif\"), default;\n}\n\n\n.dojoButtonContents img {\n\tvertical-align: middle;\t/* if icon and label are on same line, center them */\n}\n\n/* -------- colors ------------ */\n\n.dojoButtonHover .dojoButtonContents {\n}\n\n.dojoButtonDepressed .dojoButtonContents {\n\tcolor: #293a4b;\n}\n\n.dojoButtonDisabled .dojoButtonContents {\n\tcolor: #eeeeee;\n}\n\n\n/* ---------- drop down button specific ---------- */\n\n/* border between label and arrow (for drop down buttons */\n.dojoButton .border {\n\twidth: 1px;\n\tbackground: gray;\n}\n\n/* button arrow */\n.dojoButton .downArrow {\n\tpadding-left: 10px;\n\ttext-align: center;\n}\n\n.dojoButton.disabled .downArrow {\n\tcursor : default;\n}\n",templateCssPath:dojo.uri.moduleUri("coupa","widget/templates/ButtonTemplate.css"),inactiveImg:"../../../coupa/widget/templates/images/coupaButton-",fillInTemplate:function(args,frag){
coupa.widget.Button.superclass.fillInTemplate.call(this,args,frag);
this.inputNode.value=this.containerNode.innerHTML;
}});
dojo.provide("coupa.widget.SubmitButton");
dojo.widget.defineWidget("coupa.widget.SubmitButton",coupa.widget.Button,{templateString:"<div dojoAttachPoint=\"buttonNode\" class=\"dojoButton\" style=\"position:relative;\" dojoAttachEvent=\"onMouseOver; onMouseOut; onMouseDown; onMouseUp; onClick:buttonClick; onKey:onKey; onFocus;\">\n  <div class=\"dojoButtonContents\" align=center dojoAttachPoint=\"containerNode\" style=\"position:absolute;z-index:2;\"></div>\n  <img dojoAttachPoint=\"leftImage\" style=\"position:absolute;left:0px;\" />\n  <img dojoAttachPoint=\"centerImage\" style=\"position:absolute;z-index:1;\" />\n  <img dojoAttachPoint=\"rightImage\" style=\"position:absolute;top:0px;right:0px;\" />\n  <input type=\"submit\" value=\"\" dojoAttachPoint=\"inputNode\" style=\"border: 0px none; margin: 0px; padding: 0px; height: 0px; width: 0px; font-size: 0px;\" />\n</div>\n",fillInTemplate:function(args,frag){
coupa.widget.SubmitButton.superclass.fillInTemplate.call(this,args,frag);
this.inputNode.value=this.containerNode.innerHTML;
},onClick:function(e){
this.inputNode.click();
return false;
}});
dojo.provide("coupa.widget.DropdownDatePicker");
dojo.widget.defineWidget("coupa.widget.DropdownDatePicker",dojo.widget.DropdownDatePicker,{fillInTemplate:function(args,frag){
dojo.widget.DropdownDatePicker.superclass.fillInTemplate.call(this,args,frag);
var _e0d={widgetContainerId:this.widgetId,lang:this.lang,value:this.value,startDate:this.startDate,endDate:this.endDate,displayWeeks:this.displayWeeks,templateCssString:".datePickerContainer {\n\twidth:164px; /* needed for proper user styling */\n}\n\n.calendarContainer {\n/*\tborder:1px solid #566f8f;*/\n}\n\n.calendarBodyContainer {\n\twidth:100%; /* needed for the explode effect (explain?) */\n\tbackground: #7591bc url(../../../dojo/src/widget/templates/images/dpBg.gif) top left repeat-x;\n}\n\n.calendarBodyContainer thead tr td {\n\tcolor:#293a4b;\n\tfont:bold 14pt;\n\ttext-align:center;\n\tpadding:0.25em;\n\tbackground: url(../../../dojo/src/widget/templates/images/dpHorizLine.gif) bottom left repeat-x;\n}\n\n.calendarBodyContainer tbody tr td {\n\tcolor:#fff;\n\tfont:bold 10pt;\n\ttext-align:center;\n\tpadding:0.4em;\n\tbackground: url(../../../dojo/src/widget/templates/images/dpVertLine.gif) top right repeat-y;\n\tcursor:pointer;\n\tcursor:hand;\n}\n\n\n.monthWrapper {\n\tpadding-bottom:2px;\n\tbackground: url(../../../dojo/src/widget/templates/images/dpHorizLine.gif) bottom left repeat-x;\n}\n\n.monthContainer {\n\twidth:100%;\n}\n\n.monthLabelContainer {\n\ttext-align:center;\n\tfont:bold;\n\tbackground: url(../../../dojo/src/widget/templates/images/dpMonthBg.png) repeat-x top left !important;\n\tcolor:#293a4b;\n\tpadding:0.25em;\n}\n\n.monthCurve {\n\twidth:12px;\n}\n\n.monthCurveTL {\n\tbackground: url(../../../dojo/src/widget/templates/images/dpCurveTL.png) no-repeat top left !important;\n}\n\n.monthCurveTR {\n\t\tbackground: url(../../../dojo/src/widget/templates/images/dpCurveTR.png) no-repeat top right !important;\n}\n\n\n.yearWrapper {\n\tbackground: url(../../../dojo/src/widget/templates/images/dpHorizLineFoot.gif) top left repeat-x;\n\tpadding-top:2px;\n}\n\n.yearContainer {\n\twidth:100%;\n}\n\n.yearContainer td {\n\tbackground:url(../../../dojo/src/widget/templates/images/dpYearBg.png) top left repeat-x;\n}\n\n.yearContainer .yearLabel {\n\tmargin:0;\n\tpadding:0.45em 0 0.45em 0;\n\tcolor:#fff;\n\tfont:bold 0.65em ;\n\ttext-align:center;\n}\n\n.curveBL {\n\tbackground: url(../../../dojo/src/widget/templates//images/dpCurveBL.png) bottom left no-repeat !important;\n\twidth:9px !important;\n\tpadding:0;\n\tmargin:0;\n}\n\n.curveBR {\n\tbackground: url(../../../dojo/src/widget/templates/images/dpCurveBR.png) bottom right no-repeat !important;\n\twidth:9px !important;\n\tpadding:0;\n\tmargin:0;\n}\n\n\n.previousMonth {\n\tbackground-color:#6782a8 !important;\n}\n\n.previousMonthDisabled {\n\tbackground-color:#a4a5a6 !important;\n\tcursor:default !important\n}\n.currentMonth {\n\tfont-size: 9pt;\n}\n\n.currentMonthDisabled {\n\tbackground-color:#bbbbbc !important;\n\tcursor:default !important\n}\n.nextMonth {\n\tbackground-color:#6782a8 !important;\n}\n.nextMonthDisabled {\n\tbackground-color:#a4a5a6 !important;\n\tcursor:default !important;\n}\n\n.currentDate {\n\ttext-decoration:underline;\n\tfont-style:italic;\n        font-size: 9pt;\n\n}\n\n.selectedItem {\n\tbackground-color:#fff !important;\n\tcolor:#6782a8 !important;\n}\n\n.yearLabel .selectedYear {\n\tpadding:0.2em;\n\tbackground-color:#9ec3fb !important;\n        font-size: 10pt;\n}\n\n.nextYear, .previousYear {\n\tcursor:pointer;cursor:hand;\n\tpadding:0;\n}\n\n.nextYear {\n\tmargin:0 0 0 0.55em;\n        font-size: 10pt;\n}\n\n.previousYear {\n\tmargin:0 0.55em 0 0;\n        font-size: 10pt;\n       \n}\n\n.incrementControl {\n\tcursor:pointer;cursor:hand;\n\twidth:1em;\n}\n\n.increase {\n\tfloat:right;\n}\n\n.decrease {\n\tfloat:left;\n}\n\n.lastColumn {\n\tbackground-image:none !important;\n}\n",templateCssPath:dojo.uri.moduleUri("coupa","widget/templates/DropdownDatePicker.css"),weekStartsOn:this.weekStartsOn,adjustWeeks:this.adjustWeeks,staticDisplay:this.staticDisplay};
this.datePicker=dojo.widget.createWidget("DatePicker",_e0d,this.containerNode,"child");
dojo.event.connect(this.datePicker,"onValueChanged",this,"_updateText");
if(this.value){
this._updateText();
}
this.containerNode.explodeClassName="calendarBodyContainer";
this.valueNode.name=this.name;
}});
dojo.provide("coupa.widget.Editor2");
dojo.widget.defineWidget("coupa.widget.Editor2",dojo.widget.Editor2,{open:function(_e0e){
if(this.onLoadDeferred.fired>=0){
this.onLoadDeferred=new dojo.Deferred();
}
var h=dojo.render.html;
if(!this.isClosed){
this.close();
}
dojo.event.topic.publish("dojo.widget.RichText::open",this);
this._content="";
if((arguments.length==1)&&(_e0e["nodeName"])){
this.domNode=_e0e;
}
if((this.domNode["nodeName"])&&(this.domNode.nodeName.toLowerCase()=="textarea")){
this.textarea=this.domNode;
var html=dojo.string.trim(this.textarea.value);
this.domNode=dojo.doc().createElement("div");
dojo.html.copyStyle(this.domNode,this.textarea);
var _e11=dojo.lang.hitch(this,function(){
with(this.textarea.style){
display="block";
position="absolute";
left=top="-1000px";
if(h.ie){
this.__overflow=overflow;
overflow="hidden";
}
}
});
if(h.ie){
setTimeout(_e11,10);
}else{
_e11();
}
if(!h.safari){
dojo.html.insertBefore(this.domNode,this.textarea);
}
if(this.textarea.form){
dojo.event.connect("before",this.textarea.form,"onsubmit",dojo.lang.hitch(this,function(){
this.textarea.value=this.getEditorContent();
}));
}
var _e12=this;
dojo.event.connect(this,"postCreate",function(){
dojo.html.insertAfter(_e12.textarea,_e12.domNode);
});
}else{
var html=this._preFilterContent(dojo.string.trim(this.domNode.innerHTML));
}
if(html==""){
html="&nbsp;";
}
var _e13=dojo.html.getContentBox(this.domNode);
this._oldHeight=_e13.height;
this._oldWidth=_e13.width;
this._firstChildContributingMargin=this._getContributingMargin(this.domNode,"top");
this._lastChildContributingMargin=this._getContributingMargin(this.domNode,"bottom");
this.savedContent=this.domNode.innerHTML;
this.domNode.innerHTML="";
this.editingArea=dojo.doc().createElement("div");
this.domNode.appendChild(this.editingArea);
if((this.domNode["nodeName"])&&(this.domNode.nodeName=="LI")){
this.domNode.innerHTML=" <br>";
}
if(this.saveName!=""){
var _e14=dojo.doc().getElementById("dojo.widget.RichText.savedContent");
if(_e14.value!=""){
var _e15=_e14.value.split(this._SEPARATOR);
for(var i=0;i<_e15.length;i++){
var data=_e15[i].split(":");
if(data[0]==this.saveName){
html=data[1];
_e15.splice(i,1);
break;
}
}
}
dojo.event.connect("before",window,"onunload",this,"_saveContent");
}
if(h.ie70&&this.useActiveX){
dojo.debug("activeX in ie70 is not currently supported, useActiveX is ignored for now.");
this.useActiveX=false;
}
if(this.useActiveX&&h.ie){
var self=this;
setTimeout(function(){
self._drawObject(html);
},0);
}else{
if(h.ie||this._safariIsLeopard()||h.opera){
this.iframe=dojo.doc().createElement("iframe");
this.iframe.src="javascript:void(0)";
this.editorObject=this.iframe;
with(this.iframe.style){
border="0";
width="100%";
}
this.iframe.frameBorder=0;
this.editingArea.appendChild(this.iframe);
this.window=this.iframe.contentWindow;
this.document=this.window.document;
this.document.open();
this.document.write("<html><head><style>body{margin:0;padding:0;border:0;overflow:hidden;}</style></head><body><div></div></body></html>");
this.document.close();
this.editNode=this.document.body.firstChild;
this.editNode.contentEditable=true;
with(this.iframe.style){
if(h.ie70){
if(this.height){
height=this.height;
}
if(this.minHeight){
minHeight=this.minHeight;
}
}else{
height=this.height?this.height:this.minHeight;
}
}
var _e19=["p","pre","address","h1","h2","h3","h4","h5","h6","ol","div","ul"];
var _e1a="";
for(var i=0;i<_e19.length;i++){
if(_e19[i].charAt(1)!="l"){
_e1a+="<"+_e19[i]+"><span>content</span></"+_e19[i]+">";
}else{
_e1a+="<"+_e19[i]+"><li>content</li></"+_e19[i]+">";
}
}
with(this.editNode.style){
position="absolute";
left="-2000px";
top="-2000px";
}
this.editNode.innerHTML=_e1a;
var node=this.editNode.firstChild;
while(node){
dojo.withGlobal(this.window,"selectElement",dojo.html.selection,[node.firstChild]);
var _e1c=node.tagName.toLowerCase();
this._local2NativeFormatNames[_e1c]=this.queryCommandValue("formatblock");
this._native2LocalFormatNames[this._local2NativeFormatNames[_e1c]]=_e1c;
node=node.nextSibling;
}
with(this.editNode.style){
position="";
left="";
top="";
}
this.editNode.innerHTML=html;
if(this.height){
this.document.body.style.overflowY="scroll";
}
dojo.lang.forEach(this.events,function(e){
dojo.event.connect(this.editNode,e.toLowerCase(),this,e);
},this);
this.onLoad();
}else{
this._drawIframe(html);
this.editorObject=this.iframe;
}
}
if(this.domNode.nodeName=="LI"){
this.domNode.lastChild.style.marginTop="-1.2em";
}
dojo.html.addClass(this.domNode,"RichTextEditable");
this.isClosed=false;
}});

