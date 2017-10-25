import React from 'react';
import ReactDOM from 'react-dom';
import TrendFun from '../lib/function';
import CreateCss from './create.css';
import { Modal,Button } from 'react-bootstrap';
import * as Navigation from '../lib/global.js';

let trendFun = new TrendFun();
let TMMS_WEB_ROOT = Navigation.TMMS_WEB_ROOT;
let VMI_LANGUAGE_POLICY_ID = Navigation.VMI_LANGUAGE_POLICY_ID;
let VMI_WALLPAPER_POLICY_ID = Navigation.VMI_WALLPAPER_POLICY_ID;

var CURRENT_STEP=1;
var CURRENT_COPYFORM=0;
var TOTAL_APPS=[];
var TOTAL_PROFILE_NAMES = [];
var CURRENT_APPS = [];
var LANGUAGE_IDS = [];
var WALLPAPER_IDS = [];
var PUPLIC_APP={"datapackage":"","single_app":false, "app_id":0}; //single app
var PROFILE_TYPE=1,_PROFILE_TYPE=0;  //1 vmi 2 sandbox
var BLUETOOTH_LIST=[];
var TOP_BLUETOOTH_ID = 0;
var BLUETOOTH_RULE_LIST=[];
var TOP_BLUETOOTH_RULE_ID = 0;

class AddProfileAppModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	componentDidMount(){
		var TOTAL_APPS = [];
	
		function jsSearch(key) {
			var ids = [];
			$.each(TOTAL_APPS, function(i, e) {
				if (e.name.toLowerCase().indexOf(key.toLowerCase()) != -1) {
					ids.push(e.id);
				}
			});
			return ids;
		}
		var profile_type=PROFILE_TYPE;
		var app_list_url='app/?page_size='+999999;
		if(profile_type==2){
			//current_app_url='';
			app_list_url="app/loc-app-available/?page_size="+999999;
		}
		trendFun.jsGetRequest(app_list_url, function(response){
			var html='';
			var ids = [];
			$.each(CURRENT_APPS, function(i, e) {
				ids.push(parseInt(e, 10));
			});
			$.each(response.results, function(i,e){
				if ($.inArray(e.id, ids) == -1 && e.type!=3) {
						TOTAL_APPS.push(e);
						html+='<div id="addappview_'+e.id+'" data-aid="'+e.id+'" class="ember-view">';
						html+='	  <div id="app_'+e.id+'" class="cp_appviewall hmdm-app-summary">';
						html+='		  <img class="icon" src="'+ e.icon_url +'">';
						html+='		  <div class="name">'+e.name+'</div>';
						if(e.type==1 || profile_type==2){
							html+="		  <div class=\"summary\">Version:"+e.version+'</div>';
						}else{
							html+="		  <div class=\"summary\">Web Clip</div>";
						}
						html+='		  <div class="description">&nbsp;</div>';
						html+='		  <div class="iconRow">';
						html+='			  <div class="managedApp"></div>';
						html+='		  </div>';
						html+='		  <input type="checkbox" value="'+e.id+'" class="ember-checkbox">';
						html+='	  </div>';
						html+=' </div>';
				}
			});
			$(html).prependTo("#cp_listappall");
			
		}, function(){ 
			alert("Unable to access server. Check your network connection and try again.");
		});
		
		//checkbox over and out;
		$(document).on({
			'mouseover':function(){
				$(this).addClass("is-hovering");
				$(this).find(":input").show();
			},
			'mouseout':function(){
				$(this).removeClass("is-hovering");
				if(!$(this).find(":input").prop("checked")){
					$(this).find(":input").hide();
				}
			},
			'click':function(){
				 //if($(this).find(":input").attr("checked")){
					//$(this).find(":input").attr("checked",false)
					//$(this).removeClass("is-selected");
				 //}else{
					//$(this).find(":input").attr("checked",true)
					//$(this).addClass("is-selected");
				 //}
				 //var checknum=$(".appviewall input[type=checkbox][class=ember-checkbox]:checked").length;
				 //if(checknum>0){
					//$("#button_remove").removeClass("button_disabled");
				 //}else{
					//$("#button_remove").addClass("button_disabled");
				 //}
				 //$("#selectnumsall").text(checknum);
				 $(this).find(":input").click();
			}
		}, ".cp_appviewall");
		$(document).on("click", ".cp_appviewall input[type=checkbox][class=ember-checkbox]", function(){
			 //$(this).parent().click();
			 //return;
			 if($(this).prop("checked")){
				$(this).parent().addClass("is-selected");
			 }else{
				$(this).parent().removeClass("is-selected");
			 }
			 
			 var checknum=$(".cp_appviewall input[type=checkbox][class=ember-checkbox]:checked").length;
			 $("#cp_selectnumsall").text(checknum);
		});
		
		// cp_selectall
		$(".cp_selectall").click(function(e) {
		   var i=0;	
		   //$(".appviewall").mouseover();
		   $(".cp_appviewall input[type=checkbox][class=ember-checkbox]").each(function(index, element) {
			   if($(this).parent().parent().css("display")!="none"){
					$(this).prop("checked",true);
					$(this).parent().addClass("is-selected").mouseover();
					i++;
				}
			});
			$("#cp_selectnumsall").text(i);
		});
		//select none
		$(".cp_selectnone").click(function(e) {
		   $(".cp_appviewall").mouseout();
		   $(".cp_appviewall input[type=checkbox][class=ember-checkbox]").each(function(index, element) {
				$(this).prop("checked",false).hide();
				$(this).parent().removeClass("is-selected");
			});
			$("#cp_selectnumsall").text('0');
		});
		
		
		//search
		$("#cp_searchprofile").click(function(e) {
			var searchprofile=$.trim($("#cp_profilename").val());
			/*
			if(searchprofile==""){
				alert("Invalid Application name. Type a application name in the search field and try again.");
				$("#profilename").focus();
				return;
			}*/
			var ids=jsSearch(searchprofile);
			if(ids.length==0){
				alert("<TREND_L10N>ADDAPP_JS_SEARCH_BLANK</TREND_L10N>");
				$("#cp_profilename").focus();
				return;
			}
			
			
			$("#cp_listappall div[class=ember-view]").each(function(i, e) {
				if($.inArray(parseInt($(this).attr("data-aid")),ids)==-1){
					$(this).hide();
				}else{
					$(this).show();
				}
			});
		});
		$("#cp_profilename").keyup(function(e){  
			if(e.keyCode==13 || e.which==13){
			   $("#cp_searchprofile").click();
			   $("#cp_profilename").blur();
			   setTimeout(function(){$("#cp_profilename").focus();},200);
			}
		});
	}
	
	componentWillUnmount(){
		$(document).off('click', ".cp_appviewall");
		$(document).off('mouseover', ".cp_appviewall");
		$(document).off('mouseout', ".cp_appviewall");
		$(document).off('click', ".cp_appviewall input[type=checkbox][class=ember-checkbox]");
		$(document).off('click', ".cp_selectall");
		$(document).off('click', ".cp_selectnone");
	}
	
	closeModalAddApp(){
		this.props.closeModal();	
	}
	saveModalAddApp(){
		var ids=[];
		$("#cp_listappall input[type=checkbox][class=ember-checkbox]:checked").each(function(index, element) {
			ids.push(parseInt($(this).val(),10));
		});
		this.props.showApps(TOTAL_APPS, this.joinUniqueArray(CURRENT_APPS, ids));
		this.props.closeModal();
	}
	joinUniqueArray(total, newAdds) {
		var ret = [];
		$.each(newAdds, function(i, e) {
			if ($.inArray(e, total) == -1) {
				ret.push(e);
				total.push(e);
			}
		});
		
		return ret;
	}
	
	render(){
		return (
				<Modal show={this.props.showModal} onHide={this.closeModalAddApp.bind(this)}>
					<Modal.Dialog dialogClassName="modal-addbluetooth">
						<Modal.Header closeButton>
							<Modal.Title>Add Allowed Applications</Modal.Title>
						</Modal.Header>
					  
						<Modal.Body>
							<div id="modalAddProfileApp">
								<h4 className="title">
									<input name="cp_profilename" className="form-control" type="text" id="cp_profilename" style={{"width":"604px"}} maxLength="40"  placeholder="Type an application name to search."  />
									<Button id="cp_searchprofile">Search</Button>
								</h4>
								<div className="title titlefix">Select:
									<a href="javascript:;" className="cp_selectall">All</a> | <a href="javascript:;" className="cp_selectnone">None</a> (Selected: <span id="cp_selectnumsall">0</span>)
								</div>
								<div className="page_body">
									<div className="panel">
									  <div id="cp_listappall">
										<div className="clearboth"></div>
									  </div>
									</div>
								</div>
							</div>
						</Modal.Body>
					  
						<Modal.Footer>
							<Button onClick={this.closeModalAddApp.bind(this)}>Close</Button>
							<Button bsStyle="primary" onClick={this.saveModalAddApp.bind(this)}>Save</Button>
						</Modal.Footer>
					  
					</Modal.Dialog>
				</Modal>		
		)		
	}

}

class AddBluetoothModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	componentDidMount(){
		if(TOP_BLUETOOTH_ID == BLUETOOTH_LIST.length)
			$("#bluetooth_name").val('');
		else{
			$("#bluetooth_name").val(BLUETOOTH_LIST[TOP_BLUETOOTH_ID].bluetooth_name);
			$("#bluetooth_kind").val(BLUETOOTH_LIST[TOP_BLUETOOTH_ID].bluetooth_kind);
		}
	}
	
	closeModalAddBluetooth(){
		this.props.closeModal();	
	}
	
	saveModalAddBluetooth(){
		var name = $("#bluetooth_name").val();
		var kind = parseInt($("#bluetooth_kind").val(), 10);
		if (name == ""){
			alert("<TREND_L10N>PROFILE_CREATE_BLUETOOTH_NAME_ERROR</TREND_L10N>");
			return;
		}
		if(kind == 2){			
			var temp = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/;
			if (!temp.test(name))
			{
				alert("<TREND_L10N>PROFILE_CREATE_BLUETOOTH_MAC_ERROR</TREND_L10N>");
				return;
			}
		}
		
		if(TOP_BLUETOOTH_ID == BLUETOOTH_LIST.length){
			BLUETOOTH_LIST.push({
				"bluetooth_name": name,
				"bluetooth_kind": kind,
			})
		}
		else{
			BLUETOOTH_LIST[TOP_BLUETOOTH_ID].bluetooth_name = name;
			BLUETOOTH_LIST[TOP_BLUETOOTH_ID].bluetooth_kind = kind;
		}
		this.props.closeModal();
	}
	
	render(){
		return (
				<Modal show={this.props.showModal} onHide={this.closeModalAddBluetooth.bind(this)}>
					<Modal.Dialog dialogClassName="modal-addapp">
						<Modal.Header closeButton>
							<Modal.Title>Add Bluetooth UUID</Modal.Title>
						</Modal.Header>
					  
						<Modal.Body>
							<div id="modalbluetooth_detail">
								<div className="detail_settings" style={{"paddingLeft":"15px"}}>
									<li>
										Add Bluetooth UUID
										<select defaultValue="2" name="bluetooth_kind" id="bluetooth_kind"><option value="1">Device name</option><option value="2">MAC address (Android only)</option></select>
									</li>
									<li style={{"float":"left"}}>
										<input className="bluetooth_input form-control" id="bluetooth_name" maxLength="50" name="bluetooth_name" type="text"/>
									</li>
									<li style={{"clear":"both","paddingTop":"15px"}}>
										Information of the bluetooth device to be synced
									</li>
								</div>
							</div>
						</Modal.Body>
					  
						<Modal.Footer>
							<Button onClick={this.closeModalAddBluetooth.bind(this)}>Close</Button>
							<Button bsStyle="primary" onClick={this.saveModalAddBluetooth.bind(this)}>Save</Button>
						</Modal.Footer>
					  
					</Modal.Dialog>
				</Modal>
			
		
		)		
	}

}

class AddBluetoothRuleModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	componentDidMount(){
		if(TOP_BLUETOOTH_RULE_ID != BLUETOOTH_RULE_LIST.length){
			$("#device_uuid").val(BLUETOOTH_RULE_LIST[TOP_BLUETOOTH_RULE_ID].device_uuid);
			$("#service_uuid").val(BLUETOOTH_RULE_LIST[TOP_BLUETOOTH_RULE_ID].service_uuid);
			$("#out_channel").val(BLUETOOTH_RULE_LIST[TOP_BLUETOOTH_RULE_ID].out_channel);
			$("#in_channel").val(BLUETOOTH_RULE_LIST[TOP_BLUETOOTH_RULE_ID].in_channel);
		} else{
			$("#device_uuid").val('');
			$("#service_uuid").val('');
			$("#out_channel").val('');
			$("#in_channel").val('');
		}
	}
	
	closeModalAddBluetoothRule(){
		this.props.closeModal();	
	}
	
	saveModalAddBluetoothRule(){
		var uuid = $("#device_uuid").val();
		var service_uuid = $("#service_uuid").val();
		var out_channel = $("#out_channel").val();
		var in_channel = $("#in_channel").val();
		if (uuid == ''){
			alert("<TREND_L10N>PROFILE_CREATE_BLUETOOTH_EMPTY_ERROR</TREND_L10N>");
			return;
		}
		if (service_uuid == ''){
			alert("<TREND_L10N>PROFILE_CREATE_BLUETOOTH_EMPTY_SERVICE_ERROR</TREND_L10N>");
			return;
		}
		if (out_channel==''){
			alert("<TREND_L10N>PROFILE_CREATE_BLUETOOTH_EMPTY_OUT_ERROR</TREND_L10N>");
			return;
		}
		if (in_channel==''){
			alert("<TREND_L10N>PROFILE_CREATE_BLUETOOTH_EMPTY_IN_ERROR</TREND_L10N>");
			return;
		}
		var temp = /[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}/;
		if (!temp.test(uuid))
		{
			alert("<TREND_L10N>PROFILE_CREATE_BLUETOOTH_STRING_ERROR</TREND_L10N>");
			return;
		}
		if (!temp.test(service_uuid))
		{
			alert("<TREND_L10N>PROFILE_CREATE_BLUETOOTH_STRING_SERVICE_ERROR</TREND_L10N>");
			return;
		}
		if (!temp.test(out_channel))
		{
			alert("<TREND_L10N>PROFILE_CREATE_BLUETOOTH_STRING_OUT_ERROR</TREND_L10N>");
			return;
		}
		if (!temp.test(in_channel))
		{
			alert("<TREND_L10N>PROFILE_CREATE_BLUETOOTH_STRING_IN_ERROR</TREND_L10N>");
			return;
		}
		if (TOP_BLUETOOTH_RULE_ID == BLUETOOTH_RULE_LIST.length){
			BLUETOOTH_RULE_LIST.push({
				"device_uuid": uuid,
				"service_uuid": service_uuid,						
				"out_channel": out_channel,
				"in_channel": in_channel,
			});
		}
		else{
			BLUETOOTH_RULE_LIST[TOP_BLUETOOTH_RULE_ID].device_uuid = uuid;
			BLUETOOTH_RULE_LIST[TOP_BLUETOOTH_RULE_ID].service_uuid = service_uuid;
			BLUETOOTH_RULE_LIST[TOP_BLUETOOTH_RULE_ID].out_channel = out_channel;
			BLUETOOTH_RULE_LIST[TOP_BLUETOOTH_RULE_ID].in_channel = in_channel;
		}
		
		this.props.closeModal();
	}
	
	render(){
		return (
			<Modal show={this.props.showModal} onHide={this.closeModalAddBluetoothRule.bind(this)}>
				<Modal.Dialog dialogClassName="modal-addapp">
					<Modal.Header closeButton>
						<Modal.Title>Add Bluetooth UUID</Modal.Title>
					</Modal.Header>
				  
					<Modal.Body>
						<div id="bluetooth_rule_detail">
							<div className="detail_settings" style={{"paddingLeft":"15px"}}>
								<li style={{"paddingTop":"20px"}}>
									<dl>
										<dt>Device UUID</dt>
										<dd className="dd">
											<input name="device_uuid" className="form-control" type="text" id="device_uuid" maxLength="36"/>
										</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt>Service UUID</dt>
										<dd className="dd">
											<input name="service_uuid" className="form-control" type="text" id="service_uuid" maxLength="36"/>
										</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt>Outbound Channel</dt>
										<dd className="dd">
											<input name="out_channel" className="form-control" type="text" id="out_channel" maxLength="36"/>
										</dd>
									</dl>
								</li>
								<li>
									<dl>
										<dt>Inbound Channel</dt>
										<dd className="dd">
											<input name="in_channel" className="form-control" type="text" id="in_channel" maxLength="36"/>
										</dd>
									</dl>
								</li>
								<li style={{"paddingTop":"10px"}}>Information of the Bluetooth device allowed in this feature</li>
							</div>
						</div>
					</Modal.Body>
				  
					<Modal.Footer>
						<Button onClick={this.closeModalAddBluetoothRule.bind(this)}>Close</Button>
						<Button bsStyle="primary" onClick={this.saveModalAddBluetoothRule.bind(this)}>Save</Button>
					</Modal.Footer>
				  
				</Modal.Dialog>
			</Modal>
		
		)		
	}
}

export default class CreateProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		modalAddApp : false,
		modalAddBluetooth : false,
		modalAddBluetoothRule : false,
		bluetoothlist: [],
		bluetoothCheckboxStatus: [],
		checkBluetoothAll: false,
		pageSize: 10,
		startid: 0,
		
		bluetoothRulelist: [],
		bluetoothRuleCheckboxStatus: [],
		checkBluetoothRuleAll: false,
		rulePageSize: 10,
		ruleStartid: 0,
	};    
	this.switchButton = this.switchButton.bind(this);
  }
  
  componentDidMount(){
		CURRENT_STEP = 1;
		PROFILE_TYPE = 1,
		_PROFILE_TYPE = 0;
		$("#profile_type").on("change",function(){
			$(".sandbox_div").toggle();	
			$(".vmi_div").toggle();
			$("#listapp").empty();
			
		});
		$("#profile_type").val(1); // reset refresh issue.
		
		
			//bluetooth list
		//EADS_check_all
		$(document).on('click', "#ID_row_container input[type=checkbox][class='cbx']", function(){
			  clickcheckbox();
		  });
		  $(document).on("click", "#EADS_check_all", function(){
			  clickcheckbox();
		  });
		
		  function clickcheckbox(){
			  var cbxchecklength=$("#ID_row_container input[type=checkbox][class='cbx']:checked").length;
			  if(cbxchecklength>0){
				  $("#button_delete_bluetooth").removeClass("button_disabled")
			  }else{
				  $("#button_delete_bluetooth").addClass("button_disabled");
			  }
		  
		  }
		  function selectBluetoothItems(){
				var tempActionId=$("#ID_row_container input[type=checkbox][class='cbx']:checked");
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
		  //bluetooth list
		
		
		   
		  //getRead();
		  $("#page_size").change(function(){
			$("#page_index").val('1');
			this.getRead();
		  });
		  
		  var tempCurrentPageIndex=parseInt($("#page_index").val(),10);
		  if(isNaN(tempCurrentPageIndex)) tempCurrentPageIndex=1;
		  $("#page_index").keydown(function(e) {
			 var key = e.which;
			 if (key == 13) {
				if(isNaN($("#page_index").val())){
					return;
				}
				if(parseInt(tempCurrentPageIndex,10)==parseInt($("#page_index").val(),10)){
					return;
				}else{
					tempCurrentPageIndex=$("#page_index").val();
				}
				this.getRead();
			 }
		  }.bind(this));
		  
		  $("#EADS_first").click(function(){
				if(parseInt($("#page_index").val(),10)==1){
					return;
				}
				$("#page_index").val('1');
				this.getRead();
		  }.bind(this));
		  $("#EADS_next").click(function(){
				var EADS_pagertotalpage=parseInt($("#EADS_pagertotalpage").text(),10);
				var nextpage=parseInt($("#page_index").val(),10);
				if(nextpage==EADS_pagertotalpage){return;}
				nextpage=nextpage+1;
				if(nextpage>EADS_pagertotalpage) nextpage=EADS_pagertotalpage;
				$("#page_index").val(nextpage);
				this.getRead();
		  }.bind(this));
		  $("#EADS_prev").click(function(){
				var prevpage=parseInt($("#page_index").val(),10);
				if(prevpage==1){return;}
				prevpage=prevpage-1;
				if(prevpage<1) prevpage=1;
				$("#page_index").val(prevpage);
				this.getRead();
		  }.bind(this));
		  $("#EADS_last").click(function(){
				var EADS_pagertotalpage=parseInt($("#EADS_pagertotalpage").text(),10);
				if(parseInt($("#page_index").val(),10)==EADS_pagertotalpage){
					return;
				}
				$("#page_index").val(EADS_pagertotalpage);
				this.getRead();
		  }.bind(this));
		
		//$("#button_add_bluetooth").click(function(){
			//TOP_BLUETOOTH_ID = BLUETOOTH_LIST.length;
			////popupAddBluetooth("button_add_bluetooth","<TREND_L10N>PROFILE_CREATE_BLUETOOTH_INFO_ADD</TREND_L10N>");
			//this.setState({modalAddBluetooth:true});
		//}.bind(this));
		$("#button_delete_bluetooth").click(function(){
			var deleteItem = selectBluetoothItems();
			var deleteNum = 0;
			$.each(deleteItem,function(i,e){
				BLUETOOTH_LIST.splice(e-deleteNum,1);
				deleteNum += 1;
			});
			this.getRead();
		}.bind(this));
		//$(document).on("click", ".bluetoothstatus", function(){
			//var listID = $(this).attr("value");
			//TOP_BLUETOOTH_ID = listID;
			//$("#bluetooth_name").val(BLUETOOTH_LIST[listID].bluetooth_name);
			//$("#bluetooth_kind").val(BLUETOOTH_LIST[listID].bluetooth_kind);
	
			////popupAddBluetooth("button_add_bluetooth","<TREND_L10N>PROFILE_CREATE_BLUETOOTH_INFO_EDIT</TREND_L10N>");
			//this.setState({modalAddBluetooth:true});
		//}.bind(this));
		
		
			//bluetooth rule list
		//EADS_check_all
		$(document).on("click", "#ID_row_container1 input[type=checkbox][class='cbx']", function(){
			  clickcheckbox1();
		});
		$(document).on("click", "#EADS_check_all1", function(){
			  clickcheckbox1();
		});
		
		  function clickcheckbox1(){
			  var cbxchecklength1=$("#ID_row_container1 input[type=checkbox][class='cbx']:checked").length;
			  if(cbxchecklength1>0){
				  $("#button_delete_rule").removeClass("button_disabled")
			  }else{
				  $("#button_delete_rule").addClass("button_disabled");
			  }
		  
		  }
		  function selectBluetoothRuleItems(){
				var tempActionId1=$("#ID_row_container1 input[type=checkbox][class='cbx']:checked");
				var tempActionIdList1='';
				$.each(tempActionId1,function(i,e){
					tempActionIdList1=tempActionIdList1+e.value+',';
				 });
				 if(tempActionIdList1!=""){
					tempActionIdList1 = tempActionIdList1.substring(0,tempActionIdList1.length-1);
					tempActionIdList1=tempActionIdList1.split(",");
					$.each(tempActionIdList1,function(i,e){
						tempActionIdList1[i]=parseInt(e,10);
					});
				 }
				 if(tempActionIdList1.length==0){
					return [];
				 }
				 return tempActionIdList1;
		  }
		  //bluetooth list
		
		
		   
		  //getRead();
		  $("#page_size1").change(function(){
			$("#page_index1").val('1');
			this.getRead1();
		  }.bind(this));
		  
		  var tempCurrentPageIndex=parseInt($("#page_index1").val(),10);
		  if(isNaN(tempCurrentPageIndex)) tempCurrentPageIndex=1;
		  $("#page_index1").keydown(function(e) {
			 var key = e.which;
			 if (key == 13) {
				if(isNaN($("#page_index1").val())){
					return;
				}
				if(parseInt(tempCurrentPageIndex,10)==parseInt($("#page_index1").val(),10)){
					return;
				}else{
					tempCurrentPageIndex=$("#page_index1").val();
				}
				this.getRead1();
			 }
		  }.bind(this));
		  
		  $("#EADS_first1").click(function(){
				if(parseInt($("#page_index1").val(),10)==1){
					return;
				}
				$("#page_index1").val('1');
				this.getRead1();
		  }.bind(this));
		  $("#EADS_next1").click(function(){
				var EADS_pagertotalpage=parseInt($("#EADS_pagertotalpage1").text(),10);
				var nextpage=parseInt($("#page_index1").val(),10);
				if(nextpage==EADS_pagertotalpage){return;}
				nextpage=nextpage+1;
				if(nextpage>EADS_pagertotalpage) nextpage=EADS_pagertotalpage;
				$("#page_index1").val(nextpage);
				this.getRead1();
		  }.bind(this));
		  $("#EADS_prev1").click(function(){
				var prevpage=parseInt($("#page_index1").val(),10);
				if(prevpage==1){return;}
				prevpage=prevpage-1;
				if(prevpage<1) prevpage=1;
				$("#page_index1").val(prevpage);
				this.getRead1();
		  }.bind(this));
		  $("#EADS_last1").click(function(){
				var EADS_pagertotalpage=parseInt($("#EADS_pagertotalpage1").text(),10);
				if(parseInt($("#page_index1").val(),10)==EADS_pagertotalpage){
					return;
				}
				$("#page_index1").val(EADS_pagertotalpage);
				this.getRead1();
		  }.bind(this));
		
		//$("#button_add_rule").click(function(){
			//TOP_BLUETOOTH_RULE_ID = BLUETOOTH_RULE_LIST.length;
			////popupAddBluetoothRule("button_add_rule","<TREND_L10N>PROFILE_CREATE_BLUETOOTH_RULE_UUID_ADD</TREND_L10N>");
			//this.setState({modalAddBluetoothRule:true});
		//}.bind(this));
		$("#button_delete_rule").click(function(){
			var deleteItem = selectBluetoothRuleItems();
			var deleteNum = 0;
			$.each(deleteItem,function(i,e){
				BLUETOOTH_RULE_LIST.splice(e-deleteNum,1);
				deleteNum += 1;
			});
			this.getRead1();
		}.bind(this));
		//$(document).on("click", ".bluetoothrulestatus", function(){
			//var listID = $(this).attr("value");
			//TOP_BLUETOOTH_RULE_ID = listID;
			//$("#device_uuid").val(BLUETOOTH_RULE_LIST[listID].device_uuid);
			//$("#service_uuid").val(BLUETOOTH_RULE_LIST[listID].service_uuid);
			//$("#out_channel").val(BLUETOOTH_RULE_LIST[listID].out_channel);
			//$("#in_channel").val(BLUETOOTH_RULE_LIST[listID].in_channel);
			
			////popupAddBluetoothRule("button_add_rule","<TREND_L10N>PROFILE_CREATE_BLUETOOTH_RULE_UUID_EDIT</TREND_L10N>");
			//this.setState({modalAddBluetoothRule:true});
		//}.bind(this));	
		
		//step2
		trendFun.jsGetRequest('policy/template-simple/', function(response){
			var html = '';
			$.each(response.results, function(i,e){
				if(e.profile_type==1){
					html+='<option value="'+e.id+'">'+e.name+'</option>';
				}
				TOTAL_PROFILE_NAMES.push(e.name.toLowerCase());
			});
			
			$(html).appendTo($("#copyform"));
			$("#copyform").val("1"); //set default select to default profile.
			
		}, function(){ 
			alert("Unable to access server. Check your network connection and try again.");
		});
		
		$(document).on('click', '.previewdiv img', function(){
			$("#preview").attr("src", $(this).attr("src"));
			$("#wallpaper_id").val($(this).attr("id"));
		});
		
		$("#systemsetting").css("visibility","hidden"); 
		trendFun.jsGetRequest('policy/', function(response){
			var language_html = '';
			var wallpaper_html = '';
			$.each(response.results, function(i,e){
				if (e.id == VMI_LANGUAGE_POLICY_ID) {
					$.each(e.values, function(ii,ee) {
						LANGUAGE_IDS.push(ee.id);
						language_html+='<option value="'+ee.id+'">'+ee.value+'</option>';
					});
				}
				else if (e.id == VMI_WALLPAPER_POLICY_ID) {
					$("#preview").attr("src", e.values[0].value);
					$("#wallpaper_id").val(e.values[0].id);
					$.each(e.values, function(ii,ee) {
						WALLPAPER_IDS.push(ee.id);
						wallpaper_html += '<li><a><img src="'+ee.value+'" id="'+ee.id+'" alt="'+ee.detail+'" width="120" height="120" /></a></li>';
					});
				}
				else {
					alert("Unable to access server. Check your network connection and try again.");
				}
			});
			$(language_html).appendTo($("#language_sel"));
			$(wallpaper_html).appendTo($("#wallpaper_ul"));
			
			//wallppaper
			//$(".mixedContent .jCarouselLite").jCarouselLite({
			  //btnNext: ".mixedContent .next",
			  //btnPrev: ".mixedContent .prev",
			  //visible: 5,
			  //circular: false
			//});
			$(document).on("click", ".previewdiv img", function() {
				  $("#preview").attr("src", $(this).attr("src"));
				  $("#wallpaper_id").val($(this).attr("id"));
			})
			$("#systemsetting").css("visibility","visible"); 	
			$("#systemsetting").hide(); 
			$("#mdmsetting").css("visibility","visible"); 
			$("#mdmsetting").hide();
			
			if($("#wallpaper_ul li").length<=5){
				$("button[class=next]").prop("disabled",true);
			}
	
			
		
		}, function(){ 
			alert("Unable to access server. Check your network connection and try again.");
		});
		
		$(".saveBtn").hide();
		$(".backBtn").hide();
		// systemsetting must be hide after jCarouselLite.
		$("#applicationssetting").hide();
		
		//step4
		trendFun.jsGetRequest('mdm/mdm_policy/ready/', function(response){
			if(!response.ready || PROFILE_TYPE==2){
				$("#mdm_enable").prop("disabled", true);
			}
		}, function(){ 
			alert("Unable to access server. Check your network connection and try again.");
		});
		
		
		//from edit
		//checkbox over and out;
		$(document).on({
			'mouseover':function(){
				$(this).addClass("is-hovering");
				$(this).find(":input").show();
			},
			'mouseout':function(){
				$(this).removeClass("is-hovering");
				if(!$(this).find(":input").prop("checked")){
					$(this).find(":input").hide();
				}
			},
			'click':function(){
				 //if($(this).find(":input").attr("checked")){
					//$(this).find(":input").attr("checked",false)
					//$(this).removeClass("is-selected");
				 //}else{
					//$(this).find(":input").attr("checked",true)
					//$(this).addClass("is-selected");
				 //}
				 //var checknum=$(".cp_appview input[type=checkbox][class=ember-checkbox]:checked").length;
				 //if(checknum>0){
					//$("#button_remove").removeClass("button_disabled");
				 //}else{
					//$("#button_remove").addClass("button_disabled");
				 //}
				 //$("#cp_selectnums").text(checknum);
				 $(this).find(":input").click();
			}
		}, ".cp_appview");
		
		$(document).on("click", ".cp_appview input[type=checkbox][class=ember-checkbox]", function(event){
			 //$(this).parent().click();
			 //return;
			 if($(this).prop("checked")){
				$(this).parent().addClass("is-selected");
			 }else{
				$(this).parent().removeClass("is-selected");
			 }
			 
			 var checknum=$(".cp_appview input[type=checkbox][class=ember-checkbox]:checked").length;
			 $("#cp_selectnums").text(checknum);
			 event.stopPropagation();
		});
		
		var selectItems=function(){
				var tempActionId=$(".cp_appview input[type=checkbox][class='ember-checkbox']:checked");
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
		//button remove
		//$("#button_remove").click(function(e) {
			 ////$(".cp_appview input[type=checkbox][class=ember-checkbox]:checked")
			  //if($(this).hasClass("button_disabled")){
			  //}else{
				  //if (confirm("<TREND_L10N>PROFILE_JS_CREATE_CONFIRM_REMOVE_APP</TREND_L10N>")) {
						//$.each($(".cp_appview input[type=checkbox]:checked"),function(i,e){
							  //$(this).parent().parent().hide("slow",function(){$(this).remove()});
							  //var removedId = parseInt($(this).val(), 10);
							  //CURRENT_APPS = $.grep(CURRENT_APPS, function(e) {
								  //return e != removedId;
							  //});
						//});
						//$("#button_remove").addClass('button_disabled');
						//$("#cp_selectnums").text("0");
				//}
			//}
		
		//});
		
		// cp_selectall
		$(".cp_selectall").click(function(e) {
		   $(".cp_appview").mouseover();
		   $(".cp_appview input[type=checkbox][class=ember-checkbox]").each(function(index, element) {
				$(this).prop("checked",true);
				$(this).parent().addClass("is-selected");
			});
			var checknum=$(".cp_appview input[type=checkbox][class=ember-checkbox]:checked").length;
			$("#cp_selectnums").text(checknum);
			//if(CURRENT_APPS.length>0){
				//$("#button_remove").removeClass("button_disabled");
			//}
		});
		//select none
		$(".cp_selectnone").click(function(e) {
		   $(".cp_appview").mouseout();
		   $(".cp_appview input[type=checkbox][class=ember-checkbox]").each(function(index, element) {
				$(this).prop("checked",false).hide();
				$(this).parent().removeClass("is-selected");
			});
			//$("#button_remove").addClass("button_disabled");
			$("#cp_selectnums").text('0');
		});
		$("#watermark_enable").on("change",function(){
			$("#watermark_text").prop("disabled",!$(this).prop("checked"));
		});
		
		//site list
		trendFun.jsGetRequest('system/site_list/', function(response){
			  var html='';
			  $.each(response.results,function(i,e){
				html += '<option value="' + e.id + '">'+e.name+'</option>';
			  });
			  
			//$("#group").empty();				
			$("#site").append(html);
		});
					
		//bluetooth
		$("#bluetooth_enable").on("change",function(){
			if($("#bluetooth_enable").prop("checked")==true){
				$("#bluetooth_filter").show();
				$("#bluetooth_need_rule").show();
			} else{
				$("#bluetooth_filter").hide();
				$("#bluetooth_need_rule").hide();
			}
			
			if($("#bluetooth_enable").prop("checked")==true && $("#bluetooth_filter_kind").val()!=0){
				$("#bluetooth_list").show();
			} else{
				$("#bluetooth_list").hide();
			}
			if($("#bluetooth_enable").prop("checked")==true && $("#bluetooth_enable_rule").prop("checked")==true){
				$("#bluetooth_rule").show();
			} else{
				$("#bluetooth_rule").hide();
			}
		});
		
		$("#bluetooth_filter_kind").on("change",function(){
			if($("#bluetooth_filter_kind").val()==1 || $("#bluetooth_filter_kind").val()==2){
				$("#bluetooth_list").show();
			} else{
				$("#bluetooth_list").hide();
			}
		});
		
		$("#bluetooth_enable_rule").on("change",function(){
			if($("#bluetooth_enable_rule").prop("checked")==true){
				$("#bluetooth_rule").show();
			} else{
				$("#bluetooth_rule").hide();
			}
		});
  
  }
  componentWillUnmount(){
		$(document).off('click', ".cp_appview");
		$(document).off('mouseover', ".cp_appview");
		$(document).off('mouseout', ".cp_appview");
		$(document).off('click', ".cp_appview input[type=checkbox][class=ember-checkbox]");
		$(document).off('click', ".cp_selectall");
		$(document).off('click', ".cp_selectnone");
		//$(document).off('click', "#button_remove");
	}
  
  nextButton(){
		this.switchButton("next");
  }
  saveButton(){
		var policies = [];
		policies[0] = parseInt($("#language_sel").val(), 10);
		policies[1] = parseInt($("#wallpaper_id").val(), 10);
		
		CURRENT_APPS = [];
		$("#listapp input[type=checkbox]:checked").each(function(){
			CURRENT_APPS.push(parseInt($(this).val(), 10));		
		});			
		var request = {
			"site_info":parseInt($("#site").val(), 10),
			"name": $("#profilename").val(),
			"detail": $("#descripton").val(),
			"storage_limit": parseInt($("#storage_limit").val(),10),
			"priority": -1,
			"policies": policies,
			"apps": (PROFILE_TYPE==1) ? CURRENT_APPS:[],
			"local_apps": (PROFILE_TYPE==2) ? CURRENT_APPS:[],
			"watermark_enable": $("#watermark_enable").prop("checked"),
			"watermark_text": $("#watermark_text").val(),
			"bluetooth_enable": $("#bluetooth_enable").prop("checked"),
			"bluetooth_filter_kind": parseInt($("#bluetooth_filter_kind").val(),10),
			"bluetooth_list": BLUETOOTH_LIST,
			'bluetooth_enable_rule': $("#bluetooth_enable_rule").prop("checked"),
			"bluetooth_rule_list": BLUETOOTH_RULE_LIST,
			"package_name":PUPLIC_APP.datapackage,//single app
			"single_app":PUPLIC_APP.single_app,
			"app_id":PUPLIC_APP.app_id,
			"mdm_enable": $("#mdm_enable").prop("checked"),
			//"mdm_enable": (PROFILE_TYPE==1) ? $("#mdm_enable").prop("checked"): false, //mdm settings
			 "sandbox_setting":{
				  "encrypt_file":$("#encrypt_file").prop("checked"),
				  "restrict_cut":$("#restrict_cut").prop("checked"),
				  "restrict_share":$("#restrict_share").prop("checked"),
				  "restrict_capture":$("#restrict_capture").prop("checked"),
				  "enforce_encryption":$("#enforce_encryption").prop("checked"),
				  "root_check":$("#root_check").prop("checked"),
				  "offline_period":parseInt($("#offline_period").val(),10)
			 },
			  "profile_type":PROFILE_TYPE
			
		};
		
		trendFun.jsPostRequest('policy/template/', request, function(response){
			location.href="#/profiles?t="+(new Date()).getTime();
		}, function(){});
  }
  backButton(){
		this.switchButton("back");
  }
  cancelButton(){
		location.href="#/profiles?t="+(new Date()).getTime();
  }
  switchButton(buttonType){
			if(buttonType=="next"){
				  if(CURRENT_STEP==1){
					  var  profilename=$("#profilename").val();
					  if(profilename==""||profilename.length<3||profilename.length>20) {
						  alert("<TREND_L10N>PROFILE_JS_CREATE_ALERT_INVALID_PROFILE_NAME</TREND_L10N>");
						  $('#profilename').focus();
						  return false;
					  }
					  
					  if ($.inArray(profilename.toLowerCase(), TOTAL_PROFILE_NAMES) != -1) {
						  alert("<TREND_L10N>PROFILE_JS_CREATE_ALERT_EXIST_PROFILE_NAME</TREND_L10N>");
						  $('#profilename').focus();
						  return false;
					  }
					  
					  var regexp=/^[A-Za-z0-9_-]*$/;
					  if(!regexp.test(profilename)){
						  alert("<TREND_L10N>PROFILE_JS_CREATE_ALERT_INVALID_PROFILE_NAME</TREND_L10N>");
						  $("#profilename").focus();
						  return;
					  }
					  
					  $("#basicinfo").hide();
					  $("#systemsetting").show();
					  $("#applicationssetting").hide();
					  $("#mdmsetting").hide();
					  
					  CURRENT_STEP=2;
					  $(".backBtn").show();
					  PROFILE_TYPE= parseInt($("#profile_type").val(),10);
					  if(PROFILE_TYPE==2){
						  $("#water_option").hide();
						  $("#bluetooth_option").hide();
					  }else{
						  $("#water_option").show();
						  $("#bluetooth_option").show();
					  }
					  
					 //if(CURRENT_COPYFORM != parseInt($("#copyform").val(),10)){
					 if(_PROFILE_TYPE != parseInt($("#profile_type").val(),10) ){	 
						 var current_app_url='policy/template/'+$("#copyform").val()+'/';
						 var app_list_url='app/?page_size='+999999;
						 if(PROFILE_TYPE==2){
							 //current_app_url='';
							 app_list_url="app/loc-app/?page_size="+999999;
						 }
						 trendFun.jsGetRequest(current_app_url, function(response){
							CURRENT_APPS = response.apps;
							if(PROFILE_TYPE==2){
								CURRENT_APPS =[]; //sandbox,app list is null
							}
							var app_id=response.app_id; //single app
							if(!response.single_app){
								app_id=0;
							}
							PUPLIC_APP.app_id=response.app_id;
							PUPLIC_APP.datapackage=response.package_name;
							PUPLIC_APP.single_app=response.single_app;
							
							$("#watermark_text").val(response.watermark_text).prop("disabled",!response.watermark_enable);
							$("#watermark_enable").prop("checked",response.watermark_enable);
							$("#bluetooth_enable").prop("checked",response.bluetooth_enable);
							//bluetooth
							$("#bluetooth_enable_rule").prop("checked",response.bluetooth_enable_rule);
							if(typeof(response.bluetooth_filter_kind) != "undefined")
								$("#bluetooth_filter_kind").val(response.bluetooth_filter_kind);
							if($("#bluetooth_enable").prop("checked")==true){
								$("#bluetooth_filter").show();
								$("#bluetooth_need_rule").show();
								if($("#bluetooth_filter_kind").val()==1 || $("#bluetooth_filter_kind").val()==2){
									$("#bluetooth_list").show();
								} else{
									$("#bluetooth_list").hide();
								}
								if($("#bluetooth_enable_rule").prop("checked")==true){
									$("#bluetooth_rule").show();
								}else{
									$("#bluetooth_rule").hide();
								}
							} else{
								$("#bluetooth_filter").hide();
								$("#bluetooth_list").hide();
								$("#bluetooth_need_rule").hide();
								$("#bluetooth_rule").hide();
							}
							if(typeof(response.bluetooth_list) != "undefined"){
								   BLUETOOTH_LIST = response.bluetooth_list;
							}
							this.getRead();
							if(typeof(response.bluetooth_rule_list) != "undefined"){
								BLUETOOTH_RULE_LIST = response.bluetooth_rule_list;
							}
							this.getRead1();
				 
							$("#mdm_enable").prop("checked",response.mdm_enable);
	
							$.each(response.policies, function(i,e){
								if($.inArray(e, LANGUAGE_IDS)!=-1){
									$("#language_sel").val(e);
								}
								else if($.inArray(e, WALLPAPER_IDS)!=-1){
									$("#wallpaper_id").val(e);
								}
							});
							if(PROFILE_TYPE==2){
								$("#wallpaper_id").val(WALLPAPER_IDS[0]); //wall paper set the first.
								$("#mdm_enable").prop("checked",false);  //sandbox profile must be unchecked.
							}
							
							
							$(".previewdiv img").each(function(index, element) {
								if($(this).attr("id")==$("#wallpaper_id").val()){
									$("#preview").attr("src", $(this).attr("src"));
									return false; //skip each
								}
							});
							
							trendFun.jsGetRequest(app_list_url, function(response){
								TOTAL_APPS=response.results;
								this.showApps(TOTAL_APPS, CURRENT_APPS,app_id);	//single app	
							}.bind(this), function(){ 
								alert("Unable to access server. Check your network connection and try again.");
							});
							
						 }.bind(this), function(){ 
								alert("Unable to access server. Check your network connection and try again.");
						 });
						 _PROFILE_TYPE=parseInt($("#profile_type").val(),10);
					 }
		
				  }else if(CURRENT_STEP==2){
					  $("#basicinfo").hide();
					  $("#systemsetting").hide();
					  $("#applicationssetting").show();
					  $("#mdmsetting").hide();
	
					  CURRENT_STEP=3;
					  $(".backBtn").show();
					  if(PROFILE_TYPE==2){ //sandbox, no mdm option,so hide mdm panle.
						 // $(".saveBtn").show();
						  //nextButton.hide();
						  $(".vmi_div").hide();
					  }else{
						 // $(".saveBtn").hide();
						 // nextButton.show();
						  $(".vmi_div").show();
					   }
					  
					  
				  }else if(CURRENT_STEP==3){
					  $("#basicinfo").hide();
					  $("#systemsetting").hide();
					  $("#applicationssetting").hide();
					  $("#mdmsetting").show();
					  
					  CURRENT_STEP=4;
					  $(".nextBtn").hide();
					  $(".backBtn").show();
					  $(".saveBtn").show();
				  }else{
					self.location.reload();
				  }
			 }
			if(buttonType=="back"){
				  if(CURRENT_STEP==2){
					  $("#basicinfo").show();
					  $("#systemsetting").hide();
					  $("#applicationssetting").hide();
					  $("#mdmsetting").hide();
					  CURRENT_STEP=1;
					  $(".backBtn").hide();
					  $(".saveBtn").hide();
					  $(".nextBtn").show();
				  }else if(CURRENT_STEP==3){
					  $("#basicinfo").hide();
					  $("#systemsetting").show();
					  $("#applicationssetting").hide();
					  $("#mdmsetting").hide();
					  CURRENT_STEP=2;
					  $(".nextBtn").show();
					  $(".backBtn").show();
					  $(".saveBtn").hide();
				  }else if(CURRENT_STEP==4){
					  $("#basicinfo").hide();
					  $("#systemsetting").hide();
					  $("#applicationssetting").show();
					  $("#mdmsetting").hide();
					  CURRENT_STEP=3
					  $(".nextBtn").show();
					  $(".backBtn").show();
					  $(".saveBtn").hide();
				  }else{
					self.location.reload();
				  }
			 }
		}
	
	showApps(total_apps,current_apps,app_id){
			var html='';
			var showflag="";
			var flag=0;
			var showimg='';
			$.each(total_apps, function(i,e){
				if(e.type != 3){
					var isCurrent = ($.inArray(e.id, current_apps)!=-1);
					var isChecked = isCurrent?'checked="checked"':'';
					var isSelected = isCurrent?'is-selected':'';
					var isDisplay = isCurrent?'style="display: inline;"':'';
					if($("#appview_"+e.id).length<=0){
						html+='<div id="appview_'+e.id+'" class="ember-view col-lg-2 col-md-5">';
						html+='	  <div id="app_'+e.id+'" class="cp_appview hmdm-app-summary '+isSelected+'">';
						html+='		  <img class="icon" src="'+ e.icon_url +'">';
						html+='		  <div class="name">'+e.name+'</div>';
						if(e.type==1 || e.type==3 || PROFILE_TYPE==2){
							html+="		  <div class=\"summary\">Version:"+e.version+'</div>';
						
							
							showflag="style='display:block'";
							flag=0;
							showimg="<img src='../images/single_app_on.png'  style='vertical-align:middle'>";
							if(app_id>0 && e.id==app_id){
								flag=1;
								showimg="<img src='../images/single_app_off.png'  style='vertical-align:middle'>";
							}
						}else{
							html+="		  <div class=\"summary\">Web Clip</div>";
							
							showflag="style='display:none'";
							flag=0;
							showimg="";
						}
						if(PROFILE_TYPE==2){
							showimg="";
						}
						
						html+='		  <div class="description">'+ "<a "+showflag+" data-package="+e.package+" data-flag='"+flag+"' data-id='"+e.id+"' class='editapp' href='javascript:;'>"+showimg+"</a>" +'</div>'; //single app
						html+='		  <div class="iconRow" id="icon_'+e.id+'">';
						html+='			  <div class="managedApp"></div>';
						html+='		  </div>';
						html+='		  <input type="checkbox" value="'+e.id+'" '+isChecked+' class="ember-checkbox" '+isDisplay+'>';
						html+='	  </div>';
						html+=' </div>';
					}
				}
			});
			$(html).prependTo("#listapp");
			var checknum=$(".cp_appview input[type=checkbox][class=ember-checkbox]:checked").length;
			$("#cp_selectnums").text(checknum);
			
			//single app
			$(".editapp").off("click");
			$(document).on("click", ".editapp", function(e){
				var a_id=$(this).data("id");
				var datapackage=$(this).data("package");
				var flag=parseInt($(this).data("flag"),10);
				//$("div.iconRow:not([id='icon_"+a_id+"'])").hide();
				$(".editapp").data("flag",0).html("<img src='../images/single_app_on.png' style='vertical-align:middle'>");
				if(flag!=1){
					PUPLIC_APP.single_app=true;
					$(this).data("flag",1);
					//$("#icon_"+a_id).show();
					$(this).html("<img src='../images/single_app_off.png' style='vertical-align:middle'>");
				}else{
					PUPLIC_APP.single_app=false;
					$(this).data("flag",0);
					//$("#icon_"+a_id).hide();
					$(this).html("<img src='../images/single_app_on.png' style='vertical-align:middle'>");
				}
				
				PUPLIC_APP.app_id=parseInt(a_id,10);
				PUPLIC_APP.datapackage=datapackage;
				return false;
				//e.preventDefault();
			});
		}
		
		getRead(){
			  var page_size=parseInt($("#page_size").val(),10);
			  if(isNaN(page_size)) page_size=20;
			  var page_index=parseInt($("#page_index").val(),10);
			  
			  var EADS_pagertotalpage=parseInt($("#EADS_pagertotalpage").text(),10);
			  if(page_index>EADS_pagertotalpage){
				page_index=EADS_pagertotalpage;
			  }
			  if(isNaN(page_index)||page_index==""||page_index==0){
				  page_index=0;
			  }else{
				 page_index=page_index-1;
			  }
			  
			  this.ID_readData(page_size,page_index);
		}
		ID_readData(page_size,page_index){
			if(BLUETOOTH_LIST.length<=0){
				//$("#ID_row_container").empty().append("<tr><td colspan=\"3\"><div  class=\"noDataToDisplay\">No data to display.</div></td></tr>");
				this.setState({bluetoothlist: [], startid: 0});
				$("#page_index").val(page_index);
				$("#EADS_pagecount").text('0');
				$("#EADS_count").text('(0)');
				$("#EADS_pagerendcont").text('0');
				return;
			}
			//var bluetooth_showlist = BLUETOOTH_LIST.slice(page_size*page_index, page_size*(page_index+1));
			
			this.parseID(BLUETOOTH_LIST, page_size*page_index);
			//tableSort();
			var tempCurrentpage=page_index+1;
			$("#page_index").val(tempCurrentpage); //input
			var total_count=BLUETOOTH_LIST.length;
				$("#EADS_pagecount").text(total_count);
			if(total_count>0){
				$("#EADS_count").text('('+total_count+')');
			}
				
			var tempstartLine = page_size*page_index + 1;
			var temppageEndLine = page_size*(page_index + 1);
			var tempendLine = temppageEndLine > total_count ? total_count : temppageEndLine;
				if (tempstartLine > tempendLine) {
				tempstartLine = tempendLine;
			}
			$("#EADS_pagerstartcont").text(tempstartLine);
			$("#EADS_pagerendcont").text(tempendLine);
			
				if(total_count>page_size){
				$("#page_index").removeAttr("disabled");
			}else{
				$("#page_index").attr("disabled","disabled");
			}
				//total pager_total_page
			var pager_total_page = 1;
			if (total_count % page_size > 0) {
				pager_total_page = Math.floor(total_count/page_size) + 1;
				} else {
					pager_total_page = Math.ceil(total_count/page_size);
			}
			$("#EADS_pagertotalpage").text(pager_total_page);
			
			if(tempCurrentpage>1 && tempCurrentpage<pager_total_page){
				$("#EADS_first,#EADS_prev,#EADS_last,#EADS_next").removeClass("disabled");
			}else if(tempCurrentpage==1 && tempCurrentpage != pager_total_page){
				$("#EADS_first,#EADS_prev").addClass("disabled");
				$("#EADS_last,#EADS_next").removeClass("disabled");
			}else  if(tempCurrentpage!=1 && tempCurrentpage == pager_total_page){
				$("#EADS_first,#EADS_prev").removeClass("disabled");
				$("#EADS_last,#EADS_next").addClass("disabled");
			}else if(tempCurrentpage==1 && 1 == pager_total_page){
				$("#EADS_first,#EADS_prev,#EADS_last,#EADS_next").addClass("disabled");
			}
		}
		parseID(bluetoothList, startId){
			var rowState = [];
			for(var i=0; i<bluetoothList.length; i++)
				rowState[i] = false;
			this.setState({bluetoothlist: bluetoothList, startid: startId, bluetoothCheckboxStatus:rowState, checkBluetoothAll:false});
		} 
		  
		getRead1(){
			  var page_size=parseInt($("#page_size1").val(),10);
			  if(isNaN(page_size)) page_size=20;
			  var page_index=parseInt($("#page_index1").val(),10);
			  
			  var EADS_pagertotalpage=parseInt($("#EADS_pagertotalpage1").text(),10);
			  if(page_index>EADS_pagertotalpage){
				page_index=EADS_pagertotalpage;
			  }
			  if(isNaN(page_index)||page_index==""||page_index==0){
				  page_index=0;
			  }else{
				 page_index=page_index-1;
			  }
			  
			  this.ID_readData1(page_size,page_index);
		  }
		  ID_readData1(page_size,page_index){
			if(BLUETOOTH_RULE_LIST.length<=0){
				this.setState({bluetoothRulelist: [], startid: 0});
				//$("#ID_row_container1").empty().append("<tr><td colspan=\"4\"><div  class=\"noDataToDisplay\">No data to display.</div></td></tr>");
				$("#page_index1").val(page_index);
				$("#EADS_pagecount1").text('0');
				$("#EADS_count1").text('(0)');
				$("#EADS_pagerendcont1").text('0');
				return;
			}
			//var bluetooth_rulelist = BLUETOOTH_RULE_LIST.slice(page_size*page_index, page_size*(page_index+1));
			
			this.parseID1(BLUETOOTH_RULE_LIST, page_size*page_index);
			//tableSort();
			var tempCurrentpage=page_index+1;
			$("#page_index1").val(tempCurrentpage); //input
			var total_count=BLUETOOTH_RULE_LIST.length;
				$("#EADS_pagecount1").text(total_count);
			if(total_count>0){
				$("#EADS_count1").text('('+total_count+')');
			}
				
			var tempstartLine = page_size*page_index + 1;
			var temppageEndLine = page_size*(page_index + 1);
			var tempendLine = temppageEndLine > total_count ? total_count : temppageEndLine;
				if (tempstartLine > tempendLine) {
				tempstartLine = tempendLine;
			}
			$("#EADS_pagerstartcont1").text(tempstartLine);
			$("#EADS_pagerendcont1").text(tempendLine);
			
				if(total_count>page_size){
				$("#page_index1").removeAttr("disabled");
			}else{
				$("#page_index1").attr("disabled","disabled");
			}
				//total pager_total_page
			var pager_total_page = 1;
			if (total_count % page_size > 0) {
				pager_total_page = Math.floor(total_count/page_size) + 1;
			} else {
				pager_total_page = Math.ceil(total_count/page_size);
			}
			$("#EADS_pagertotalpage1").text(pager_total_page);
			
			if(tempCurrentpage>1 && tempCurrentpage<pager_total_page){
				$("#EADS_first1,#EADS_prev1,#EADS_last1,#EADS_next1").removeClass("disabled");
			}else if(tempCurrentpage==1 && tempCurrentpage != pager_total_page){
				$("#EADS_first1,#EADS_prev1").addClass("disabled");
				$("#EADS_last1,#EADS_next1").removeClass("disabled");
			}else  if(tempCurrentpage!=1 && tempCurrentpage == pager_total_page){
				$("#EADS_first1,#EADS_prev1").removeClass("disabled");
				$("#EADS_last1,#EADS_next1").addClass("disabled");
			}else if(tempCurrentpage==1 && 1 == pager_total_page){
				$("#EADS_first1,#EADS_prev1,#EADS_last1,#EADS_next1").addClass("disabled");
			}
		}
		parseID1(bluetoothRuleList, startId){

			this.setState({bluetoothRulelist: bluetoothRuleList, ruleStartid: startId});
		  } 
		
  handlePageId(event){
		event.target.val(event.target.value.replace(/\D/g,''));
  }
  
  //addApplication(){
		//this.setState({modalAddApp: true});  
  //}
  //closeModalAddApp(){
		//this.setState({modalAddApp: false});  
  //}
  
  addBluetooth(){
		//$("#bluetooth_name").val('');
		TOP_BLUETOOTH_ID = BLUETOOTH_LIST.length;
		this.setState({modalAddBluetooth: true}); 
  }
  closeModalAddBluetooth(){
		this.setState({modalAddBluetooth: false});  
		this.getRead();
  }
  editBluetooth(index){
		TOP_BLUETOOTH_ID = index;
		//popupAddBluetooth("button_add_bluetooth","<TREND_L10N>PROFILE_CREATE_BLUETOOTH_INFO_EDIT</TREND_L10N>");
		this.setState({modalAddBluetooth:true});
  }
  checkBluetoothBox(index){
		var rowState = [];
		//this.setState({checkboxStatus[index] : !this.state.checkboxStatus[index]});
		var result = true;
		this.state.bluetoothCheckboxStatus.map(function(e, i){
			rowState[i] = e;
			if (index == i)
				rowState[i] = !e;
			if (rowState[i] == false){
				result = false;
			}
		});
		this.setState({bluetoothCheckboxStatus:rowState, checkBluetoothAll:result});
  }
  checkAllBluetooth(){
		var rowState = [];
		var allstatus = !this.state.checkBluetoothAll;
		this.state.bluetoothCheckboxStatus.map(function(e, i){
			rowState[i] = allstatus;
		});
		this.setState({bluetoothCheckboxStatus:rowState, checkBluetoothAll:allstatus});
		
		//this.props.callbackID_clickcheckbox();
		
		var cbxAll = $("#EADS_check_all");
		var tbody= cbxAll.parent().parent().parent().next();
		var tr= tbody.children("tr");
		var cbx= tbody.find(".cbx"); 
		var checked = cbxAll.attr("checked");
		if(allstatus){
		    cbx.attr("checked", true);
		    tr.addClass("checked");
		}else{
		    cbx.attr("checked", false);
		    tr.removeClass("checked");
		}
  }
  
  addBluetoothRule(){
		TOP_BLUETOOTH_RULE_ID = BLUETOOTH_RULE_LIST.length;
		this.setState({modalAddBluetoothRule: true});  
  }
  closeModalAddBluetoothRule(){
		this.setState({modalAddBluetoothRule: false});
		this.getRead1();
  }
  editBluetoothRule(index){
		TOP_BLUETOOTH_RULE_ID = index;		
		//popupAddBluetoothRule("button_add_rule","<TREND_L10N>PROFILE_CREATE_BLUETOOTH_RULE_UUID_EDIT</TREND_L10N>");
		this.setState({modalAddBluetoothRule:true});
  }
  checkBluetoothRuleBox(index){
		var rowState = [];
		//this.setState({checkboxStatus[index] : !this.state.checkboxStatus[index]});
		var result = true;
		this.state.bluetoothRuleCheckboxStatus.map(function(e, i){
			rowState[i] = e;
			if (index == i)
				rowState[i] = !e;
			if (rowState[i] == false){
				result = false;
			}
		});
		this.setState({bluetoothRuleCheckboxStatus:rowState, checkBluetoothRuleAll:result});
  }
  checkAllBluetoothRule(){
		var rowState = [];
		var allstatus = !this.state.checkBluetoothRuleAll;
		this.state.bluetoothRuleCheckboxStatus.map(function(e, i){
			rowState[i] = allstatus;
		});
		this.setState({bluetoothRuleCheckboxStatus:rowState, checkBluetoothRuleAll:allstatus});
		
		//this.props.callbackID_clickcheckbox();
		
		var cbxAll = $("#EADS_check_all1");
		var tbody= cbxAll.parent().parent().parent().next();
		var tr= tbody.children("tr");
		var cbx= tbody.find(".cbx"); 
		var checked = cbxAll.attr("checked");
		if(allstatus){
		    cbx.attr("checked", true);
		    tr.addClass("checked");
		}else{
		    cbx.attr("checked", false);
		    tr.removeClass("checked");
		}
  }
  
  setWallpaper(id){
  }
  
	setPageSize(size){
		this.setState({pageSize:parseInt(size,10)},()=>{
			$("#page_index").val('1');
			this.getRead();
		});	
		
	}
	
	setRulePageSize(size){
		this.setState({rulePageSize:parseInt(size,10)},()=>{
			$("#page_index1").val('1');
			this.getRead1();
		});	
		
	}

  
  render(){
		let bluetoothListDiv;
		if(this.state.bluetoothlist.length == 0)
			bluetoothListDiv = <tr><td><div className="noDataToDisplay">No data to display.</div></td></tr>
		else {
			
			bluetoothListDiv = this.state.bluetoothlist.map(function(e, index){
				if(e.bluetooth_name!="")
					return (	
								<tr id={"ID_tr"+e.index} key={index}>
									<td className="checkBoxAll">
										<input id={"ID_tr_checkbox_"+index} className="cbx" checked={this.state.bluetoothCheckboxStatus[index+this.state.startid]} onChange={this.checkBluetoothBox.bind(this, index+this.state.startid)} value={(index+this.state.startid)} type="checkbox"/>
									</td>
									<td id={index}>
										<a className="bluetoothstatus" onClick={this.editBluetooth.bind(this, (index+this.state.startid))} value={(index+this.state.startid)}>{e.bluetooth_name}</a>
									</td>
									<td><span className="centerspan">{e.bluetooth_kind==1 ? "Device name" : "MAC address (Android only)"}</span></td>
								</tr>
					)
			}.bind(this));
			
		}
		
		let bluetoothRuleListDiv;
		if(this.state.bluetoothRulelist.length == 0)
			bluetoothRuleListDiv = <tr><td><div className="noDataToDisplay">GLOBAL_JS_NO_DATA_TO_DISPLAY=1=</div></td></tr>
		else {
			
			bluetoothRuleListDiv = this.state.bluetoothRulelist.map(function(e, index){
				if(e.bluetooth_name!="")
					return (	
								<tr id={"ID_tr1"+e.index} key={index}>
									<td className="checkBoxAll">
										<input id={"ID_tr1_checkbox_"+index} className="cbx" checked={this.state.bluetoothRuleCheckboxStatus[index+this.state.ruleStartid]} onChange={this.checkBluetoothRuleBox.bind(this, index+this.state.ruleStartid)} value={(index+this.state.ruleStartid)} type="checkbox"/>
									</td>
									<td id={index}>
										<a className="bluetoothrulestatus" onClick={this.editBluetoothRule.bind(this, (index+this.state.ruleStartid))} value={(index+this.state.ruleStartid)}>{e.device_uuid}</a>
									</td>
									<td><span className="centerspan">{e.service_uuid}</span></td>
									<td><span className="centerspan">{e.out_channel}</span></td>
									<td><span className="centerspan">{e.in_channel}</span></td>
								</tr>
					)
			}.bind(this));
			
		}
	
	return (
	  <div id="create_profile">
		<div className="panel headerSetting" id="basicinfo">
            <h4 className="title">Step 1: Basic Information</h4>
            <div className="content">
              <ul className="detailLists">
                <li>
                  <dt>Profile name:<span className="redstar">*</span></dt>
                  <input type="text" maxLength="20" className="settingInputtext" id="profilename" name="profilename" />
                  <div className="f_comment">Use A to Z, a to z, 0 to 9, - or _ and between 3 and 20 characters long.</div>
                </li>
                <li className="dashedline">
                  <dt>Description:</dt>
                  <textarea name="descripton" className="settingTextarea" rows="6" id="descripton"></textarea>
                </li>
                
                <li>
                  <dt>Profile type:</dt>
                  <select id="profile_type">
                  	<option value="1">Cloud Workspace</option>
                    <option value="2">Local Workspace</option>
                  </select>
                </li>
                
                <li className="sandbox_div" style={{"display":"none"}}>
                	<dt>Setting:</dt>
                        <ul style={{"float":"left"}}>
                            <li style={{"display":"none"}}>
                              <input name="block_clipboard" type="checkbox" id="block_clipboard" defaultValue="1"/>Ignore clipboard in local applications.
                            </li>
                            <li>
                              <input name="encrypt_file" type="checkbox" id="encrypt_file" defaultValue="1"/>Enable data encryption
                            </li>
							<li>
                              <input name="restrict_cut" type="checkbox" id="restrict_cut" defaultValue="1"/>Disable copy-and-paste from/to applications installed on mobile device
                            </li>
                            <li>
                              <input name="restrict_capture" type="checkbox" id="restrict_capture" defaultValue="1"/>Disable screenshots (Android only)
                            </li>
                            <li>
                              <input name="restrict_share" type="checkbox" id="restrict_share" defaultValue="1"/>Disable file sharing to applications installed on mobile device
                            </li>
                            <li>
                              <input name="enforce_encryption" type="checkbox" id="enforce_encryption" defaultValue="1"/>Disable local apps on non-encrypted devices (Android only)
                            </li>
                            <li>
                              <input name="root_check" type="checkbox" id="root_check" defaultValue="1"/>Disable local apps on rooted devices (Android only)
                            </li>
                            <li style={{"display":"none"}}>
                              Maximum offline time
                               <select name="offline_period" id="offline_period">
                                 <option value="3">3 days</option>
                                 <option value="7">7 days</option>
                                 <option value="10">10 days</option>
                                 <option value="12">12 days</option>
                                 <option value="20">20 days</option>
                               </select>
                            </li>
                        </ul>
                </li>
                <li className="clearboth" style={{"minHeight":"0"}}></li>
                
                 <li className="vmi_div">
                        <ul>
                            <li>
                              <dt>Copy from:</dt>
                              <select id="copyform">
                              </select>
                            </li>
                            <li>
                              <dt>Site:</dt>
                                    <select name="site" id="site">
                                    </select>
                            </li>
                            <li className="dashedline">
                              <dt>Storage limit:</dt>
                              <select id="storage_limit" defaultValue="0">
                                    <option value="1">1G</option>
                                    <option value="4">4G</option>
                                    <option value="8">8G</option>
                                    <option value="16">16G</option>
                                    <option value="0">No Limit</option>
                              </select>
                            </li>
                            <li style={{"lineHeight":"14px","color":"#666","marginTop":"10px"}}>
                              Note:<br/>
                                - Trend Micro recommends not to reduce the user storage limit once it is configured. Reducing the storage limit may cause some users to lose their data in their workspace.<br/>
                                - The changes will take some time to take effect, depending on the amount of data in a user workspace.<br/>
                                - Users need to log in again for the changes to appear.<br/>
                                - The server can automatically send an alert email to user when the user storage is 80% full. Enable this setting here: Administration > System Settings > <a href='../administration/systemsettings.htm?tab=2'>Mobile Client</a><br/>
                            </li>
                        </ul>
                </li>
                
              </ul>
            </div>
          </div>
          <div className="panel footerSetting" id="systemsetting">
            <h4 className="title vmi_div">Step 2: Cloud Workspace System Settings</h4>
            <h4 className="title sandbox_div" style={{"display":"none"}}>Step 2: Local Workspace System Settings</h4>
            <div className="content">
              <ul className="detailLists">
                <li  className="dashedline" style={{"display":"none"}}>
                  <dt>Language:
                    <span className="redstar">*</span></dt>
                  <select id="language_sel">
                  </select>
                </li>
                <li>
                  <dt>Wallpaper:</dt>
                  <div>
                      <div className="previewdiv dropdown">
							<input type="hidden" id="wallpaper_id" />
							<img src="../images/noicon.png" id="preview" width="140" height="150" className="btn-link dropdown-toggle" data-target="#" data-toggle="dropdown" href="#"/>
							<ul className="dropdown-menu dropdown-menu-multi-select" id="wallpaper_ul">

							</ul>
					  </div>
                    </div>
                </li>
                <li style={{"borderBottom":"1px dashed #b2b2b2"}}>Note: To manage wallpapers, navigate to Applications > Wallpaper Management. Recommended dimensions: 600 x 800 pixels or 640 x 1066 pixels.</li>
                
                <div style={{"borderBottom":"1px dashed #b2b2b2"}} id="water_option">
                    <li style={{"marginTop":"10px"}}>
                       <input type="checkbox" id="watermark_enable" />Enable watermark in cloud workspace
                    </li>
                    <li>
                      <input type="text" maxLength="50" className="settingInputtext form-control" id="watermark_text" name="watermark_text" />
                    </li>
                    <li>Note: Enable this option to display watermark on users' cloud workspaces. If you keep the text field blank, the workspace will display user name and login time as watermark.</li>
                </div>
		
		<div id="bluetooth_option" className="vmi_div">
			<li style={{"marginTop":"10px"}} className="vmi_div">
			   <input type="checkbox" id="bluetooth_enable" />Enable Bluetooth in cloud workspace
			</li>
			
			<li id="bluetooth_filter" style={{"display":"none"}}>
				Device synchronization:
				<select id="bluetooth_filter_kind" defaultValue="0">
					<option value="0">All</option>
					<option value="1">Approved list</option>
					<option value="2">Blocked list</option>
				</select>
			</li>
			<div className="table-with-header" id="bluetooth_list" style={{"display":"none"}}>
				<div className="toolbar">
					<div className="items-block">
						<button type="button"  id="button_add_bluetooth" className="btn btn-primary" onClick={this.addBluetooth.bind(this)}><span className="fa fa-plus"></span>Add</button>
					</div>
					<div className="items-block">
						<button type="button" id="button_delete_bluetooth" className="btn btn-default"><span className="fa fa-plus"></span>Delete</button>
					</div>
				</div>
				<table className="table table-bordered table-hover" id="bluetoothData">
					<thead>
						<tr className="sizing_row" style={{"display":"none"}}>
						    <th className="col_1"></th>
						    <th className="col_2"></th>
						    <th className="col_3"></th>
						</tr>
				  
						<tr className="header_title">
						    <th className="checkBoxAll"><input type="checkbox" checked={this.state.checkBluetoothAll} id="EADS_check_all" onClick={this.checkAllBluetooth.bind(this)} className="check_all_checkbox"/></th>
						    <th><div className="column_title">Bluetooth Device</div></th>
						    <th><div className="column_title">Description</div></th>
						</tr>
					</thead>
					<tbody className="row_container" id="ID_row_container">
						{bluetoothListDiv}
					</tbody>                            

				</table>    
				<div className="table-pagination">
					<div className="table-pagination-block">
						<div className="visible-lg pagination-records">Records: <span className="pager_start_cont" id="EADS_pagerstartcont">1</span>&nbsp;-&nbsp;<span className="pager_end_cont" id="EADS_pagerendcont"></span> / <span className="pager_total_cont" id="EADS_pagecount"></span></div>
						<div className="visible-lg dropdown">
						  <button className="btn btn-xs btn-link dropdown-toggle" data-toggle="dropdown" href="#" type="button">
							<span className="caret"></span>{this.state.pageSize} per page
						  </button>
						  <ul className="dropdown-menu dropdown-menu-multi-select">
								<li className={this.state.pageSize==10?"selected":""}><a onClick={this.setPageSize.bind(this, 10)}>10</a></li>
								<li className={this.state.pageSize==25?"selected":""}><a onClick={this.setPageSize.bind(this, 25)}>25</a></li>
								<li className={this.state.pageSize==50?"selected":""}><a onClick={this.setPageSize.bind(this, 50)}>50</a></li>
								<li className={this.state.pageSize==100?"selected":""}><a onClick={this.setPageSize.bind(this, 100)}>100</a></li>
						  </ul>
						</div>
						<div className="pagination-input"><input defaultValue="1" name="page_index" type="text" disabled className="pager_current_page" id="page_index" onKeyUp={this.handlePageId.bind(this)} onPaste={this.handlePageId.bind(this)}/> / <span className="pager_total_page" id="EADS_pagertotalpage">1</span></div>
						<div>
							<ul className="pagination">
								<li>
									<a href="javascript:;" aria-label="Previous" id="EADS_prev">
										<span className="fa fa-angle-left" aria-hidden="true"></span>
									</a>
								</li>
								<li>
									<a href="javascript:;" aria-label="Next" id="EADS_next">
										<span className="fa fa-angle-right" aria-hidden="true"></span>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			
			
			
			<li id="bluetooth_need_rule" style={{"display":"none"}}>
			   <input type="checkbox" id="bluetooth_enable_rule" />Enable Bluetooth 3.0 conversion on iOS devices
			</li>
			<div className="table-with-header" id="bluetooth_rule" style={{"display":"none"}}>
				<div className="toolbar">
					<div className="items-block">
						<button type="button"  id="button_add_rule" onClick={this.addBluetoothRule.bind(this)} className="btn btn-primary"><span className="fa fa-plus"></span>Add</button>
					</div>
					<div className="items-block">
						<button type="button" id="button_delete_rule" className="btn btn-default"><span className="fa fa-plus"></span>Delete</button>
					</div>
				</div>
				<table className="table table-bordered table-hover" id="bluetoothRule">
					<thead>
						<tr className="sizing_row" style={{"display":"none"}}>
						    <th className="col_1"></th>
						    <th className="col_2"></th>
						    <th className="col_3"></th>
						    <th className="col_4"></th>
						    <th className="col_5"></th>
						</tr>
				  
						<tr className="header_title">
						    <th className="checkBoxAll"><input type="checkbox" checked={this.state.checkBluetoothRuleAll} id="EADS_check_all1" onClick={this.checkAllBluetoothRule.bind(this)} className="check_all_checkbox"/></th>
						    <th><div className="column_title">Device UUID</div></th>
						    <th><div className="column_title">Service UUID</div></th>
						    <th><div className="column_title">Outbound Channel</div></th>
						    <th><div className="column_title">Inbound Channel</div></th>
						</tr>
					</thead>
					<tbody className="row_container" id="ID_row_container1">
						{bluetoothRuleListDiv}
					</tbody>                            
				</table>
				<div className="table-pagination">
					<div className="table-pagination-block">
						<div className="visible-lg pagination-records">==Records: <span className="pager_start_cont" id="EADS_pagerstartcont1">1</span>&nbsp;-&nbsp;<span className="pager_end_cont" id="EADS_pagerendcont1"></span> / <span className="pager_total_cont" id="EADS_pagecount1"></span></div>
						<div className="visible-lg dropdown">
						  <button className="btn btn-xs btn-link dropdown-toggle" data-toggle="dropdown" href="#" type="button">
							<span className="caret"></span>{this.state.rulePageSize} per page
						  </button>
						  <ul className="dropdown-menu dropdown-menu-multi-select">
								<li className={this.state.rulePageSize==10?"selected":""}><a onClick={this.setRulePageSize.bind(this, 10)}>10</a></li>
								<li className={this.state.rulePageSize==25?"selected":""}><a onClick={this.setRulePageSize.bind(this, 25)}>25</a></li>
								<li className={this.state.rulePageSize==50?"selected":""}><a onClick={this.setRulePageSize.bind(this, 50)}>50</a></li>
								<li className={this.state.rulePageSize==100?"selected":""}><a onClick={this.setRulePageSize.bind(this, 100)}>100</a></li>
						  </ul>
						</div>
						<div className="pagination-input"><input defaultValue="1" name="page_index" type="text" disabled className="pager_current_page" id="page_index1" onKeyUp={this.handlePageId.bind(this)} onPaste={this.handlePageId.bind(this)}/> / <span className="pager_total_page" id="EADS_pagertotalpage1">1</span></div>
						<div>
							<ul className="pagination">
								<li>
									<a href="javascript:;" aria-label="Previous" id="EADS_prev1">
										<span className="fa fa-angle-left" aria-hidden="true"></span>
									</a>
								</li>
								<li>
									<a href="javascript:;" aria-label="Next" id="EADS_next1">
										<span className="fa fa-angle-right" aria-hidden="true"></span>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			
			<li className="vmi_div">Note: Enable this option to turn on Bluetooth in users' cloud workspaces. Changes to this option only takes effect for the cloud workspace from the next time user signs in. </li>

                </div>
		
		
              </ul>
            </div>
          </div>
          <div className="panel fontSetting" id="applicationssetting">
            <h4 className="title ui-widget-header">Step 3:  Applications</h4>
            <div className="content">
              <ul className="detailLists">
                
                <li>
                  <dt style={{"width":"auto","fontWeight":"normal"}}>Select: <a href="javascript:;" className="cp_selectall">All</a> | <a href="javascript:;" className="cp_selectnone">None</a> (Selected: <span id="cp_selectnums">0</span>)</dt>
                </li>
                <li>
                     <div className="results">
                        <div className="clearfix" id="listapp">
                               
                        </div> 
                     </div>  
                </li>
                <li className="vmi_div">Note:<img src="../images/single_app_off.png" style={{"verticalAlign":"middle"}}/>indicates that this app will be launched automatically after users signs in.</li>
                
              </ul>
            </div>
          </div>
		<div className="panel footerSetting" id="mdmsetting">
            <h4 className="title">Step 4:  MDM Setting</h4>
            <div className="content">
              <ul className="detailLists">
		        <li>
                   <input type="checkbox" id="mdm_enable" />Enforce MDM
                </li>
                <li style={{"lineHeight":"14px","color":"#666","marginTop":"10px"}}>
                    Note:<br/>
                    - You MUST configure MDM settings before selecting “Enforce MDM” feature. Refer to the topic <a href="http://docs.trendmicro.com/all/ent/tmsmw/v5.5/en-us/tmvmi_5.5_webhelp/c_configr_mdm.html#task_fkp_4ll_jz" target="_blank">Configuring MDM Settings</a> in the OLH for the procedure.<br/>
                </li>
              </ul>
            </div>
          </div>
          <ul className="buttonGrp" style={{"marginLeft":"17px"}}>
            <Button className="backBtn" onClick={this.backButton.bind(this)}>Back</Button>
            <Button bsStyle="primary" className="nextBtn" onClick={this.nextButton.bind(this)}>Next</Button>
            <Button bsStyle="primary" className="saveBtn" onClick={this.saveButton.bind(this)}>Save</Button>
            <Button className="cancelBtn" onClick={this.cancelButton.bind(this)}>Cancel</Button>
          </ul>
		  
			{/*add app*/}
			{this.state.modalAddApp && <AddProfileAppModal showModal={this.state.modalAddApp} closeModal={this.closeModalAddApp.bind(this)} showApps={this.showApps}/>}
	
			{/*add bluetooth*/}
			{this.state.modalAddBluetooth && <AddBluetoothModal showModal={this.state.modalAddBluetooth} closeModal={this.closeModalAddBluetooth.bind(this)}/>}
			
			{/*add bluetooth rule*/}
			{this.state.modalAddBluetoothRule && <AddBluetoothRuleModal showModal={this.state.modalAddBluetoothRule} closeModal={this.closeModalAddBluetoothRule.bind(this)}/>}
			
			
	  </div>
	)
  }
  
}