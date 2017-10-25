import React from 'react';
import ReactDOM from 'react-dom';
import { Modal,Button } from 'react-bootstrap';
import IndexCss from './index.css';
import TrendFun from '../lib/function';

let trendFun = new TrendFun();
var TOTAL_APPS={};

export default class CloudApplications extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = {
		}
	}
	
	componentDidMount(){
		var VIRUS_RANK=new Array();
			VIRUS_RANK[6]="<span><TREND_L10N>APPS_JS_VIRUS_RANK_WRAP</TREND_L10N></span>";
			VIRUS_RANK[5]="<span><TREND_L10N>APPS_JS_VIRUS_RANK_UNKNOWN</TREND_L10N></span>";
			VIRUS_RANK[0]="<span class='color_green'><TREND_L10N>APPS_JS_VIRUS_RANK_SAFE_0</TREND_L10N></span>";
			VIRUS_RANK[100]="<span class='color_green'><TREND_L10N>APPS_JS_VIRUS_RANK_SAFE</TREND_L10N></span>";
			VIRUS_RANK[200]="<span class='color_yellow'><TREND_L10N>APPS_JS_VIRUS_RANK_NOTABLE</TREND_L10N></span>";
			VIRUS_RANK[250]="<span class='color_yellow'><TREND_L10N>APPS_JS_VIRUS_RANK_NOTABLE</TREND_L10N></span>";
			VIRUS_RANK[300]="<span class='color_red'><TREND_L10N>APPS_JS_VIRUS_RANK_NOTABLE_300</TREND_L10N></span>";
			VIRUS_RANK[400]="<span class='color_red'><TREND_L10N>APPS_JS_VIRUS_RANK_MALICIOUS</TREND_L10N></span>";
		  var VIRUS_RANK_IMG=new Array();
			VIRUS_RANK_IMG[6]="<img src='../images/icon_risk_wrap.png' width='18'>";
			VIRUS_RANK_IMG[5]="<img src='../images/icon_risk_unknow.png' width='18'>";
			VIRUS_RANK_IMG[0]="<img src='../images/icon_risk_safe.png' width='18'>";
			VIRUS_RANK_IMG[100]="<img src='../images/icon_risk_safe.png' width='18'>";
			VIRUS_RANK_IMG[200]="<img src='../images/icon_risk_low.png' width='18'>";
			VIRUS_RANK_IMG[250]="<img src='../images/icon_risk_low.png' width='18'>";
			VIRUS_RANK_IMG[300]="<img src='../images/icon_risk_high.png' width='18'>";
			VIRUS_RANK_IMG[400]="<img src='../images/icon_risk_malicious.png' width='18'>";

		  
		var VariskLevel=[2,10,1000,4,200,1,4000,800000,800,10000,20000,40000,10000000,20000000,40000000,4000000];
		var getMarsHtml=function(rank,variskbitmap){
			var rank= parseInt(rank,10);
			if(!$.isNumeric(rank)) rank=5;
			if(!$.isNumeric(variskbitmap)){
				variskbitmap=0;
			}
			
			rank=VIRUS_RANK[rank];
			var s=variskbitmap;
			//s=48841;
			var tmp =1;
			var highcount=0;
			var mediumcount=0;
			var lowcount=0;
			for(var i=0;i<28;i++){
				if((s & tmp) > 0){
					//alert(tmp.toString(16));
					var temp=parseInt(tmp.toString(16),10);
					if($.inArray(temp,VariskLevel)!=-1){
						highcount++;
					}
				}
				tmp=tmp<<1;
			}
			s=s.toString(16)+""; //400180000
			var ssize=s.length;
			tmp = 1;
			var value = 0;
			var base = parseInt(s.substring(0,ssize-7),16);
			var value_str="0000000";
			for(var i=1;i<=12;i++){
				if((base & tmp) > 0){
					var temp = parseInt((tmp.toString(16) + value_str), 10);
					if($.inArray(temp,VariskLevel)!=-1){
						highcount++;
					}
				}
				tmp=tmp<<1;
			}
				
			var temphtml=[
				'<ul class="sub_items">',
				  '<li>'+rank+'</li>',
				  '<li><span style="float:left">'+"Detected risky behavior"+'</span><span style="float:right;padding-right:10px;">'+highcount+'</span></li>',
				 // '<li><span style="float:left">Medium risk behavior</span><span style="float:right;padding-right:10px;">'+mediumcount+'</span></li>',
				 // '<li><span style="float:left">Low risk behavior</span><span style="float:right;padding-right:10px;">'+lowcount+'</span></li>',
				'</ul>'
			]
			return temphtml.join("");
		}	
		var qtipInit=function(){
			$('.managedApp').qtip({
				content: {
					text: function(){
						var rank= parseInt($(this).data("rank"),10);
						var variskbitmap= parseInt($(this).data("variskbitmap"),10);
						return getMarsHtml(rank,variskbitmap); //$(this).attr("rel");
					}
				},
				style: {
					width:200,
					height:90,
					tip:{
						width:20,
						height:20,
						corner: true,
						 mimic: false,
						 border: true,
						 offset: 0
					},
					classes: 'qtip-light qtip-rounded trendclass'
				},
				position:{
					my:"top right",
					adjust:{
					}
				}
			});
		
		}
	  
	  
		trendFun.jsGetRequest('app/?page_size='+999999, function(response){
			TOTAL_APPS=response.results;//newfeature
			showApps(response.results);
			showApps_build_in(response.results); //newfeature
			
			qtipInit();		
			
		}, function(){ 
			alert("Unable to access server. Check your network connection and try again.");
		});
		var showApps=function(total_apps){
			var html='';
			//type=1 app 2: web apps
			var tempShowStatus;
			$.each(total_apps, function(i,e){
				//newfeature
				if(e.type!=3){
					html+='<div id="appview_'+e.id+'" data-type="'+e.type+'" class="ember-view">';
					html+='	  <div id="app_'+e.id+'" class="appview hmdm-app-summary">';
					var icon_url=e.icon_url;
					if(!icon_url){
						if(e.type==1)
							icon_url="../images/noicon.png";
						else
							icon_url="../images/noicon_app.png";
					}
					html+='		  <img class="icon" src="'+ icon_url +'">';
					html+='		  <div class="name">'+replaceRevStr(e.name)+'</div>';
					if(e.type==1){
						html+="		  <div class=\"summary visible-lg\">Version: "+e.version+'</div>';
					}else{
						html+="		  <div class=\"summary visible-lg\">Web Clip</div>";
					}
					html+='		  <div class="description visible-lg super_admin g_moniter_admin moniter_admin"><a id="link_'+e.id+'" class="editapp" poststr="'+encodeURIComponent(JSON.stringify(e))+'"  href="javascript:;">'+"Edit"+'</a></div>';
					html+='		  <div class="iconRow">';
					
					if(e.type==1){
							html+='			  <div class="managedApp" data-rank="'+e.risklevel+'" data-variskbitmap="'+e.riskbitmap+'">'+VIRUS_RANK_IMG[e.risklevel]+'</div>';
					}	
					html+='		  </div>';
					html+='		  <input type="checkbox" id="cb_'+e.id+'" value="'+e.id+'" class="ember-checkbox">';
					html+='	  </div>';
					html+=' </div>';
				}
			});
			if(html!=''){
				html+='<div class="clearboth"></div>';
				$("#listapp").empty(); //newfeature
				$(html).prependTo("#listapp");
				//$("input[type=radio][name='recommended_filter_group'][value=0]").prop("checked",true);
				$("input[type=radio][name='recommended_filter_group']:checked").click();
				trendFun.resolve_role_type();
			}else{
				$("#listapp").empty();
				$('<div class="nodata">'+"<TREND_L10N>APPS_JS_NO_APPLICATIONS</TREND_L10N>"+'</div> ').prependTo("#listapp");
			}
		}
		
		//newfeature
		var showApps_build_in=function(total_apps){
			total_apps.sort(function(x, y){
			  return x['name'].localeCompare(y['name']);
			});
			var html='';
			//type=1 app 2: web apps
			var tempShowStatus;
			$.each(total_apps, function(i,e){
				if(e.type==3 && e.id!=9){ //e.id==9 or package=com.android.settings hide.
					html+='<div id="appview_'+e.id+'" data-type="'+e.type+'" class="ember-view">';
						html+='	  <div id="app_'+e.id+'" class="hmdm-app-summary hmdm-app-summary2">';
					var icon_url=e.icon_url;
					if(!icon_url){
						icon_url="../images/noicon_app.png";
					}
					html+='		  <img class="icon" src="'+ icon_url +'">';
					html+='		  <div class="name">'+e.name+'</div>';
					html+="		  <div class=\"summary visible-lg\">Version: "+e.version+'</div>';
					html+='		  <div class="description visible-lg">Built-in App</div>';
					if(e.remove==0){  //1.disabled 0.enabled
						tempShowStatus="<img src='../images/icon_built_enable.png'>";
					}else{
						tempShowStatus="<img src='../images/icon_built_disable.png'>";
					}
					html+='   <div class="iconUp super_admin g_moniter_admin moniter_admin" data-id="'+e.id+'" data-remove="'+e.remove+'">'+tempShowStatus+'</div>';
					html+='		  <div class="iconRow">';
					html+='			  <div class="managedApp" data-rank="'+e.risklevel+'" data-variskbitmap="'+e.riskbitmap+'">'+VIRUS_RANK_IMG[e.risklevel]+'</div>';
					html+='		  </div>';
					html+='		  <input type="checkbox" id="cb_'+e.id+'" value="'+e.id+'" class="ember-checkbox">';
					html+='	  </div>';
					html+=' </div>';
				}
			});
			if(html!=''){
				$(html).prependTo("#listapp_build_in");
				trendFun.resolve_role_type()
			}else{
				$('<div class="nodata">'+"<TREND_L10N>APPS_JS_NO_APPLICATIONS</TREND_L10N>"+'</div> ').prependTo("#listapp_build_in");
			}
		}
		
		//$(".editapp").live("click",function(e,mars_type){
		$(document).on("click", ".editapp", function(e,mars_type){
			var responseData=$.parseJSON(decodeURIComponent($(this).attr("poststr")));
			var type=responseData.type;
			var upload_status=responseData.upload_status;
			
			var title="Edit Application";
			if(type==2){
				title="Edit Web Clip";
			}
			var id=$(this).attr("id");
			$("#"+id).tmPopup({
				title: title,
				url: "editMobileApp.htm?type="+type+"&rank="+responseData.risklevel+"&upload_status="+upload_status+"&variskbitmap="+encodeURIComponent(responseData.riskbitmap)+"&app_id="+responseData.id+"&frame_id="+id,
				openRefresh: false,
				open:function(){
					var iframe_target=$("#ui-tmPopup-Content-Iframe-ui-dialog-title-"+id).contents();
					// if upload a app and have pre-config, then show pre-config setting and hide mars ui at once.
					// this is flag OF "marsHide" and trigger it  by link of "edit" on about line 426.
					if(mars_type=="marsHide"){
						iframe_target.find(".marssetting").hide();
					}
					
					iframe_target.find("#iddescription").val($('<div/>').html(responseData.description).text());
					iframe_target.find('#appname').val($('<div/>').html(responseData.name).text());
					iframe_target.find('#app_id').val(responseData.id);
					iframe_target.find('#virusname').val(responseData.virusname);
					if(responseData.risklevel==4){
						$("#virusnameDiv").show();
					}
					if(type==1){
						iframe_target.find('#app_version').text(responseData.version);
						var app_size=(responseData.size>0)? (responseData.size / (1000*1000)).toFixed(2)+' MB':'-';
						iframe_target.find('#app_size').text(app_size);
						iframe_target.find('#appname').val($('<div/>').html(responseData.name).text());
						iframe_target.find('.webapp').hide();
						iframe_target.find('#sso_enable').prop("checked", responseData.sso_enable);
					}else if(type==2){
						iframe_target.find('#URL').text(responseData.package);
						iframe_target.find('.mobileapp').hide();
						iframe_target.find('#appname').val($('<div/>').html(responseData.name).text());
						iframe_target.find('#compare_app_name').val(responseData.name);
						iframe_target.find('#app_type').val(type);
					}
					iframe_target.find('#icon_img').html('<img width="68" height="68" src="' + responseData.icon_url + '" />');
				},
				buttons:{
					"<TREND_L10N>GLOBAL_JS_BUTTON_CANCEL</TREND_L10N>": {
						click: function() {
							$("#"+id).tmPopup("close");
						}
					},
					"<TREND_L10N>GLOBAL_JS_BUTTON_DONE</TREND_L10N>": {
						click:function() {
							var returnbool=$("#ui-tmPopup-Content-Iframe-ui-dialog-title-"+id)[0].contentWindow.saveData(id);
							if(returnbool){
								$("#"+id).tmPopup("close");
							}
						}
					}
				}
			});
			$("#"+id).tmPopup("open");
			return false;
			//e.preventDefault();
		});	
		
		//$(".hmdm-app-summary2").live({ 
		$(document).on({
			'mouseover':function(){
				  $(this).addClass("is-hovering");
			},
			'mouseout':function(){
				  $(this).removeClass("is-hovering");
			},
			'click':function(){
			}
		}, ".hmdm-app-summary2");
		
		//$(".iconUp").live("click",function(){
		$(document).on("click", ".iconUp", function(){
			var remove=$(this).data("remove");
			var id=$(this).data("id");
			var url;
			if(remove==1){
				url='app/enable-buildin-app/';
			}else{
				url='app/disable-buildin-app/';
				if(!confirm("<TREND_L10N>APPS_JS_BUILT_IN_APP_TOOLTIP</TREND_L10N>")){
					return;
				}
			}
			var that=$(this);
			jsPostRequest(url, {"id":id}, function(response){
						that.data("remove",Math.abs(remove-1));
						var newremove=that.data("remove");
						if(newremove==0){  //1.disabled 0.enabled
							var tempShowStatus="<img src='../images/icon_built_enable.png'  title='"+"<TREND_L10N>APPS_JS_BUILT_IN_APP_TOOLTIP</TREND_L10N>"+"'>";
						}else{
							var tempShowStatus="<img src='../images/icon_built_disable.png' title='"+"<TREND_L10N>APPS_JS_BUILT_IN_APP_TOOLTIP</TREND_L10N>"+"'>";
	
						}
						that.html(tempShowStatus);
			});
		});
		
		//checkbox over and out;
		//$(".appview").live({ 
		$(document).on({
			'mouseover':function(){
				  $(this).addClass("is-hovering");
				  $(this).find(":input").show();
			},
			'mouseout':function(){
				  $(this).removeClass("is-hovering");
				  if(!$(this).find(":input").attr("checked")){
					  $(this).find(":input").hide();
				  }
			},
			'click':function(){
				 if($(this).find(":input").attr("checked")){
					$(this).find(":input").attr("checked",false)
					$(this).removeClass("is-selected");
				 }else{
					$(this).find(":input").attr("checked",true)
					$(this).addClass("is-selected");
				 }
				 var checknum=$(".appview input[type=checkbox][class=ember-checkbox]:checked").length;
				 if(checknum>0){
					$("#button_remove").removeClass("button_disabled");
				 }else{
					$("#button_remove").addClass("button_disabled");
				 }
				 $("#selectnums").text(checknum);
			}
		}, ".appview");
		//$(".appview input[type=checkbox][class=ember-checkbox]").live("click",function(){
		$(document).on("click", ".appview input[type=checkbox][class=ember-checkbox]", function(){
			 if($(this).attr("checked")){
				$(this).attr("checked",false)
				$(this).parent().addClass("is-selected");
			 }else{
				 $(this).attr("checked",true)
				$(this).parent().removeClass("is-selected");
			 }
			 
			 var checknum=$(".appview input[type=checkbox][class=ember-checkbox]:checked").length;
			 if(checknum>0){
				$("#button_remove").removeClass("button_disabled");
			 }else{
				$("#button_remove").addClass("button_disabled");
			 }
			 $("#selectnums").text(checknum);
		
		});
		var selectItems=function(){
				var tempActionId=$(".appview input[type=checkbox][class='ember-checkbox']:checked");
				var tempActionIdList='';
				$.each(tempActionId,function(i,e){
					tempActionIdList=tempActionIdList+e.value+',';
				 });
				 if(tempActionIdList!=""){
					tempActionIdList = tempActionIdList.substring(0,tempActionIdList.length-1);
					tempActionIdList=tempActionIdList.split(",");
					$.each(tempActionIdList,function(i,e){
						tempActionIdList[i]=parseInt(e,10);
					});
				 }
				 if(tempActionIdList.length==0){
					return [];
				 }
				 return tempActionIdList;
		  }
		//button set
		$("#button_set").click(function(e) {
				location.href='../administration/hideapp_list.htm';	
				return false;
	   });
	
		//button remove
		$("#button_remove").click(function(e) {
			  if($(this).hasClass("button_disabled")){
			  }else{
				  if (confirm("<TREND_L10N>APPS_JS_CONFIRM_DELETE_APP</TREND_L10N>")) {
					 var request = {
							  "ids":selectItems()
					  };
					  jsPostRequest('app/remove-apps/', request, function(response){
							if(response.code==0){
								$("#messageboxtipdetail").text("<TREND_L10N>APPS_JS_CONFIRM_DELETE_APP_SUCCESS</TREND_L10N>");
								$("#messageBox").show("slow");
								
								//update all for taibao
								/*
								$.each($(".appview input[type=checkbox]:checked"),function(i,e){
									  $(this).parent().parent().hide("slow",function(){
										  $(this).remove();
										  var remainums=$(".appview input[type=checkbox][class=ember-checkbox]").length;
										  if(remainums==0){
											  $("#listapp").empty();
											  $('<div class="nodata">'+"<TREND_L10N>APPS_JS_NO_APPLICATIONS</TREND_L10N>"+'</div> ').prependTo("#listapp");
										  }
									  });
								});*/
								trendFun.jsGetRequest('app/?page_size='+999999, function(response){
									TOTAL_APPS=response.results;//newfeature
									showApps(response.results);
									
									qtipInit();		
									
								}, function(){ 
									alert("Unable to access server. Check your network connection and try again.");
								});
								
								$("#button_remove").addClass('button_disabled');
								$("#selectnums").text("0");
							}else if(response.code==4034){
								alert("<TREND_L10N>APPS_JS_DELETE_APP_FAILED</TREND_L10N>");
							}
					  }, function(){} );
					  
				}
			}
		
		});
		// button_add
		$("#button_add").click(function(e) {
			//check license
			trendFun.jsGetRequest('cfg/license/', function(response){
				if(response.status==1){
					  //$("#warning").html(str.replace('{0}',response.data.length));
					alert("<TREND_L10N>APPS_JS_UPLOAD_LICENSE_ERROR</TREND_L10N>");
					return;
				}
				var id="button_add";
				$("#"+id).tmPopup({
					title: "<TREND_L10N>APPS_JS_ADD_APP_POPUP_TITLE</TREND_L10N>",
					url: "addMobileApp.htm?type=1&frame_id="+id,
					openRefresh: false,
					buttons:{
						"<TREND_L10N>GLOBAL_JS_BUTTON_CANCEL</TREND_L10N>": {
							click: function() {
								var iframe_target=$("#ui-tmPopup-Content-Iframe-ui-dialog-title-"+id).contents();
								iframe_target.find("#cacelFlag").val("true");
								$("#"+id).tmPopup("close");
							}
						}
					}
				});
				$("#"+id).tmPopup("open");
				
			}, function(response,states){ 
				alert("Unable to access server. Check your network connection and try again.");
			});
		});
		//button_add_Webclip
		$("#button_add_Webclip").click(function(e) {
			//check license
			trendFun.jsGetRequest('cfg/license/', function(response){
				if(response.status==1){
					  //$("#warning").html(str.replace('{0}',response.data.length));
					alert("<TREND_L10N>APPS_JS_UPLOAD_LICENSE_ERROR</TREND_L10N>");
					return;
				}
				
				var id="button_add_Webclip";
				$("#"+id).tmPopup({
					title: "<TREND_L10N>APPS_JS_POPUP_TITLE_ADD_WEB_CLIP</TREND_L10N>",
					url: "addWebApp.htm?type=2",
					openRefresh: false,
					buttons:{
						"<TREND_L10N>GLOBAL_JS_BUTTON_CANCEL</TREND_L10N>": {
							click: function() {
								$("#"+id).tmPopup("close");
							}
						},
						"<TREND_L10N>GLOBAL_JS_BUTTON_ADD</TREND_L10N>": {
							click:function() {
								var iframe_target=$("#ui-tmPopup-Content-Iframe-ui-dialog-title-"+id).contents();
								if(iframe_target.find("#loading").css("display")!="none"){
									alert("<TREND_L10N>APPS_JS_ALERT_UPLOADING</TREND_L10N>");
									return;
								}
								var returnbool=$("#ui-tmPopup-Content-Iframe-ui-dialog-title-"+id)[0].contentWindow.saveDatabefroe(id);
								if(returnbool){
									$("#"+id).tmPopup("close");
								}
							}
						}
					}
				});
				$("#"+id).tmPopup("open");
			}, function(response,states){ 
				alert("Unable to access server. Check your network connection and try again.");
			});
			
		});
		
		
		// selectall
		$(".selectall").click(function(e) {
		   //$(".appview").mouseover();
		   $(".appview input[type=checkbox][class=ember-checkbox]").each(function(index, element) {
				if($(this).parent().parent().css("display")!="none"){
					$(this).parent().mouseover();
					$(this).attr("checked",true);
					$(this).parent().addClass("is-selected");
				}
			});
			var templength=$(".appview input[type=checkbox][class=ember-checkbox]:checked").length;
			$("#selectnums").text(templength);
			if(templength>0){
				$("#button_remove").removeClass("button_disabled");
			}
		});
		//select none
		$(".selectnone").click(function(e) {
		   $(".appview").mouseout();
		   $(".appview input[type=checkbox][class=ember-checkbox]").each(function(index, element) {
				$(this).attr("checked",false).hide();
				$(this).parent().removeClass("is-selected");
			});
			$("#button_remove").addClass("button_disabled");
			$("#selectnums").text('0');
		});
		
		//trggic
		var add_app_id=$.getURLParam("app_id");
		if(add_app_id){
			trendFun.jsGetRequest('app/settings/?index=1&app='+add_app_id, function(response){
				if(response.count>0){
					if(document.getElementById("link_"+add_app_id)){
						$("#link_"+add_app_id).trigger("click","marsHide");
						return false;
					}else{
						setTimeout(function(){
							$("#link_"+add_app_id).trigger("click","marsHide");;
							return false;
						},1000);
					}
				}
			})
		}
		
		
		function initApplist(order_by){
			var url='app/?page_size='+999999;
			if(order_by!=""){
				url=url+"&order_by="+order_by;
			}
			trendFun.jsGetRequest(url, function(response){
				showApps(response.results);
				qtipInit();		
			}, function(){ 
				alert("Unable to access server. Check your network connection and try again.");
			});
		}
		//newfeature
		//$(".sortapp").live("click", function(e) {
		$(document).on("click", ".sortapp", function(e) {
			var index=parseInt($(this).data('sorttype'),10);
			var order_by='asc';
			if(index==1){
				order_by='asc';
			}else{
				order_by='desc';
			}
			initApplist(order_by);
			
			$("#selectnums").text('0');
			$("#button_remove").addClass("button_disabled");
			//$(".selectnone").click();
			
			
		});
		
		
		$('.high').click(function(e){
			var id=$(this).data("pid");
			$("#"+id).toggle();
			
			if($(this).find("img").attr("src")=='../images/icon_accordion_open.png'){
				$(this).find("img").attr("src","../images/icon_accordion_close.png");
			}else if($(this).find("img").attr("src")=='../images/icon_accordion_close.png'){
				$(this).find("img").attr("src","../images/icon_accordion_open.png");
			}
		});
	}
		
	recommendedFilter(filter_type){
		if(filter_type=="0"){
			$("#listapp div[class='ember-view']").css("display","");
		}else if(filter_type=="2"){
			$("#listapp div[class='ember-view'][data-type='"+filter_type+"']").css("display","");
			$("#listapp div[class='ember-view'][data-type!='"+filter_type+"']").css("display","none");
		}else if(filter_type!="2"){
			$("#listapp div[class='ember-view'][data-type!='2']").css("display","");
			$("#listapp div[class='ember-view'][data-type='2']").css("display","none");
		}
		$(".selectnone").click();
	
	}
	
	
	render(){
		return (
			 <div className="panel" id="appIndex">
          
				<div className="messageBox tmmsgbox info displaynone" id="messageBox">
				  <div className="close_btn"></div>
				  <div className="msgcontent">
					<p className="normaltext14">Success</p>
					<p className="normaltext" style={{"marginTop":"10px"}} id="messageboxtipdetail">&nbsp;</p>
				  </div>
				</div>
				 
				 <div className="fontSetting" style={{"marginBottom":"0"}}>
					  <div className="title buttongroup">
						<ul className="button_group">
							<li className="item_list high"  data-pid="high_2" style={{"cursor":"pointer"}}>
							<span><img id="high_img" src="../images/icon_accordion_open.png"/></span>Build-in Applications                        
							</li>                                
						</ul>            
					  </div>
					  <div className="content" id="high_2">
						  <div className="tmmsgbox info2013">
							  <span className="close_btn" data-flag="info"></span>
							  <span className="msgcontent2013">
								  ==APPS_CONTENT_TIP
							  </span>
						  </div>          
						<ul className="detailLists">
						  <li>
							   <div className="results">
								  <div id="listapp_build_in">
										 <div style={{"clear":"both"}}></div>
								  </div> 
							   </div>  
						  </li>
						</ul>
					  </div>
	  
	  
	  
	  
					  <div className="title buttongroup" style={{"borderTop":"1px solid #dcdcdc"}}>
						<ul className="button_group">
							<li className="item_list high" data-pid="high_1" style={{"cursor":"pointer"}}>
							<span><img id="high_img" className="high_img" src="../images/icon_accordion_open.png"/></span>Server Applications and Web Clips
							</li>                                
						</ul>            
					  </div>
					  <div className="visible-lg title buttongroup super_admin g_moniter_admin moniter_admin">
						<ul className="button_group">
							<li className="item_list">
								<span>Show:</span>								
								<div className="radio-inline">
									<input id="filter1" className="input-radio" name="recommended_filter_group" defaultChecked="checked" type="radio" onClick={this.recommendedFilter.bind(this, 0)}/>
									<label htmlFor="filter1">All</label>
								</div>
								<div className="radio-inline">
									<input id="filter2" className="input-radio" name="recommended_filter_group" type="radio" onClick={this.recommendedFilter.bind(this, 1)}/>
									<label htmlFor="filter2">Applications</label>
								</div>
								<div className="radio-inline">
									<input id="filter3" className="input-radio" name="recommended_filter_group" type="radio" onClick={this.recommendedFilter.bind(this, 2)}/>
									<label htmlFor="filter3">Web Clips</label>
								</div>
							</li>
							<li className="item_list" style={{"backgroundImage":"none"}}>
								<span className="list_container button_add" id="button_add">Add Application</span>
							</li>
							<li className="item_list">
								<span id="button_add_tour" style={{"padding":"0"}}><img src="../images/icon_info_s.png" style={{"verticalAlign":"middle","marginTop":"-5px"}} title="You can also use the TMVMI App Push app to push applications from an Android device to the Virtual Mobile Infrastructure server. Search &quot;TMVMI App Push&quot; in Goolge Play to install it." /></span>
							</li>
	  
							<li className="item_list">
								<span className="list_container button_add" id="button_add_Webclip">Add Web Clip</span>
							</li>
							<li className="item_list" id="button_set">
								<span className="list_container button_set">Hide Application</span>
							</li>                                
							<li className="item_list button_disabled" id="button_remove">
								<span className="list_container button_remove">Delete</span>
							</li>   
						</ul>            
					  </div>
					  <div className="content" id="high_1">
						<ul className="detailLists">
						  <li className="visible-lg">
							<div style={{"float":"left","lineHeight":"20px","paddingRight":"20px"}}>Sort: <a href="javascript:;" data-sorttype='1' className="sortapp">From A-Z</a> | <a href="javascript:;"  data-sorttype='2'  className="sortapp">From Z-A</a></div>  
							<div style={{"float":"left","lineHeight":"20px"}}>Select: <a href="javascript:;" className="selectall">All</a> | <a href="javascript:;" className="selectnone">None</a> (Selected: <span id="selectnums">0</span>)</div>
							<div style={{"clear":"both"}}></div>
						  </li>
						  <li>
							   <div className="results">
								  <div style={{"minHeight":"400px"}} id="listapp">
										 <div className="clearboth"></div>
								  </div> 
							   </div>  
						  </li>
						</ul>
					  </div>
				</div>
	  
			  </div>
		
		
		
		);
	}
}