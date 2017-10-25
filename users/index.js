import React from 'react';
import ReactDOM from 'react-dom';
import { Modal,Button } from 'react-bootstrap';
import IndexCss from './index.css';
import TrendFun from '../lib/function';
import * as Navigation from '../lib/global.js';

//import Modal from '../plugs/modal';
let trendFun=new TrendFun();
let TMMS_WEB_ROOT=Navigation.TMMS_WEB_ROOT;

var TOP_GROUP_ID=1
var TREE_GROUP_ID=TOP_GROUP_ID; //current tree node id
var TREE_GROUP_NAME='Root';
var TOP_GROUP_PROFILE='';
var TREE_GROUP_PROFILE='';
var IS_GROUP=true; //current click tree nodes type: true=group false=user
var ENABLED_LDAP = false
var QUERY_KEY = '';
var QUERY_KEY_HINT = "User name or email";

var LAST_GROUP_ID=''
var LAST_GROUP_NAME=''
var LAST_QUERY_KEY = '';

var SORT_ORDER_FIELD=8; //user desc
var SORT_ORDER_BY='desc'; 

var status=$.getURLParam("status"); //from dashboard
var checkuserid=$.getURLParam("userid"); //from devices
var RENDER_TABLE=false;
let USER_STATUS=new Array();
let USER_ALT=new Array();
USER_STATUS[0]='user_status_offline.png';
USER_STATUS[1]='user_status_idle.png';
USER_STATUS[2]='user_status_online.png';
USER_ALT[0]="Offline";
USER_ALT[1]="Idle";
USER_ALT[2]="Active";

var EMAILHOST = false;

class ImportUserModal extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = { 
		};    
		this.closeImportFile = this.closeImportFile.bind(this);
	}
	
	componentDidMount(){
		new AjaxUpload($("#uploadUserList"), {//bind AjaxUpload
			action: TMMS_WEB_ROOT+'account/userfile/import/', //SERVER_URL "php.php",
			type:"POST",
			responseType: 'json',
			autoSubmit:true, 
			name:'filename', //html's file input name
			onChange:function(file,ext){//select file handle
				if(!(ext && /^(txt|csv)$/i.test(ext))) {
					alert("Unable to import users due to invalid file format. Choose a csv or txt file and try again.");
					return false;
				}
					
			},
			onSubmit: function (file, ext) {//callback before upload
				$(".loading").show();
				this.setData({
					"ext":ext,  // 1android  2  ios
					"filename":file,
					"csrfmiddlewaretoken": trendFun.GetCookie('csrftoken')
				})
			},
			onComplete: function (file, response) {//callback after upload
				$(".loading").hide();
				$("#messageboxtipdetail").text("{0}/{1} users imported successfully. Refresh the screen to view the latest records.".replace('{0}',response.data.success).replace('{1}',response.data.total));
				$("#messageBox").hide().show("slow");
				refreshUser();
				/*
				setInterval(function(){
					location.reload();
				},2000);
				*/
				$("#button_importfile").tmPopup("close");
				if(response.data.reminder){
					//$("#warning").html(str.replace('{0}',response.data.length));
					$(".warning").removeClass("displaynone");
				}
				
			}
		});
	}
	
	closeImportFile(){
		//this.setState({modalImportFile:false});
		this.props.closeModal();
	}

	render(){
		return (
			<Modal show={this.props.showModal} onHide={this.closeImportFile}>
				<Modal.Dialog>
					<Modal.Header closeButton>
						<Modal.Title>==Import Users</Modal.Title>
					</Modal.Header>
				  
					<Modal.Body>
						<div id="modalImportFile">
							<ul>
								<li>
								  <input id="uploadUserList" type="button" defaultValue="Browse..."/>
								  <span className="loading displaynone"><img src="../images/loading_16X16.gif"/></span>      
								</li>
								<li>
								    <div className="ddtip">
									<ol>
									      <li>
										      Supports only csv or txt file format. Data format:
									      </li>
									      <li>display_name1, login_name, email1, group1, password1(optional, default 123456)</li>
									      <li>display_name1, login_name, email2, group2, password2</li>
									      <li>...</li>
									</ol>
								      </div>
								</li>
								<li style={{'fontWeight':'bold', 'fontSize':'12px','paddingTop':'4px'}}>Note: Password is optional. The default password for users is 123456.</li>
								<li style={{'paddingTop':'10px', 'marginTop': '10px', 'fontSize':'12px', 'fontWeight':'bold', 'borderTop': '1px solid #b2b2b2'}}>
									<a href='example.csv' >Download the sample file</a>&nbsp;to ensure that your data is provided in the correct format.
								</li>
								    
							</ul>	    
						</div>
					</Modal.Body>
				  
					<Modal.Footer>
						<Button onClick={this.closeImportFile}>Close</Button>
					</Modal.Footer>
					  
				</Modal.Dialog>
			</Modal>
		);
	}
}

class GroupSummary extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = { 
			userlist: [],
			modalCreateGroup : false,
			modalCreateUser : false,
			modalImportFile : false,
			modalEditGroup : false,
			checkAll : false,
			checkboxStatus : [],
			pageSize: 10,
		};    
		this.context = context;
		
		this.openCreateGroup = this.openCreateGroup.bind(this);
		this.closeModalCreateGroup = this.closeModalCreateGroup.bind(this);
		this.saveModalCreateGroup = this.saveModalCreateGroup.bind(this);
		
		this.openCreateUser = this.openCreateUser.bind(this);
		this.closeModalCreateUser = this.closeModalCreateUser.bind(this);
		this.saveModalCreateUser = this.saveModalCreateUser.bind(this);
		
		this.openImportFile = this.openImportFile.bind(this);
		this.closeModalImportFile = this.closeModalImportFile.bind(this);
		//this.saveModalImportFile = this.saveModalImportFile.bind(this);
		this.initGroup = this.initGroup.bind(this);
		
		this.openEditGroup = this.openEditGroup.bind(this);
		this.closeModalEditGroup = this.closeModalEditGroup.bind(this);
		this.saveModalEditGroup = this.saveModalEditGroup.bind(this);
		
	}
	
	componentDidMount() {
		this.initGroup();
		
		function checkCbxAll(tbody){
			var cbxAll= tbody.prev().find(".check_all_checkbox");
			var cbx= tbody.find(".cbx");
			var checkedCbx= tbody.find(".cbx:checked");
			checkedCbx.parent().parent().addClass("checked");
			if(checkedCbx.length == 0){
			    cbxAll.attr("checked", false).attr('indeterminate',false);
			}else if(checkedCbx.length == cbx.length){                                   
			    cbxAll.attr("checked", true).attr('indeterminate',false);
			}else{
			    cbxAll.attr("checked", false).attr('indeterminate',true);
			}
		}

		$(document).on('click.tmGrid', '.tmGrid input.cbx', function(){
			var cbx= $(this);
			var tr= cbx.parent().parent();
			var tbody= tr.parent();                                    
			if(!cbx.attr("checked")){
			    tr.removeClass("checked");
			}                               
			checkCbxAll(tbody);
		});
	    
		$(".tmGrid .header_title").each(
		    function(index, header){						
			var th= $(header).find("th");
			th.each(
			    function(index, col){
				var column= $(col);
				if(column.is(".sort_desc") || column.is(".sort_asc")){
				    column.bind("click", function(){
					var that= $(this);
					if(that.is(".sort_desc")){										
					    that.removeClass("sort_desc").addClass("sort_asc");
					}else{
					    that.removeClass("sort_asc").addClass("sort_desc");
					}
				    });
				}
			    }
			);
		    }
		);		
		
		if($.fn.disableSelection){
		    $(".tmGrid .button_group").disableSelection();
		}
		//checkCbxAll($(".tmGrid tbody"));
		$(document).on('click', '#ID_next', function(){
			var ID_pagertotalpage=parseInt($("#ID_pagertotalpage").text(),10);
			var nextpage=parseInt($("#ID_page_index").val(),10);
			if(nextpage==ID_pagertotalpage){return;}
			nextpage=nextpage+1;
			if(nextpage>ID_pagertotalpage) nextpage=ID_pagertotalpage;
			$("#ID_page_index").val(nextpage);
			this.ID_getRead();
		}.bind(this));
		$(document).on('click', '#ID_prev', function(){
			var prevpage=parseInt($("#ID_page_index").val(),10);
			if(prevpage==1){return;}
			prevpage=prevpage-1;
			if(prevpage<1) prevpage=1;
			$("#ID_page_index").val(prevpage);
			this.ID_getRead();
	  }.bind(this));
	}
	
	refreshTree() {
		TOP_GROUP_ID=1;
		var zTree = $.fn.zTree.getZTreeObj("treeView");
		var nodes = zTree.getNodes();
		zTree.selectNode(nodes[0]); //select root nodes
		//$("#button_refresh").click();
		setTimeout(function(){$("#button_refresh").click();},1000);
	}
	
	checkAllUsers(){
		var rowState = [];
		var allstatus = !this.state.checkAll;
		this.state.checkboxStatus.map(function(e, i){
			rowState[i] = allstatus==true?true:false;
		});
		this.setState({checkboxStatus:rowState, checkAll:allstatus});
		
		//this.props.callbackID_clickcheckbox();
		
		var cbxAll = $("#ID_check_all");
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
	checkUserBox(index){
		var rowState = [];
		//this.setState({checkboxStatus[index] : !this.state.checkboxStatus[index]});
		var result = true;
		this.state.checkboxStatus.map(function(e, i){
			rowState[i] = e;
			if (index == i)
				rowState[i] = !e;
			if (rowState[i] == false){
				result = false;
			}
		});
		this.setState({checkboxStatus:rowState, checkAll:result});
		
		//this.props.callbackID_clickcheckbox();
	}
	
	ID_getRead() {
		var page_size=parseInt(this.state.pageSize,10);
		if(isNaN(page_size)) page_size=20;
		var page_index=parseInt($("#ID_page_index").val(),10);
		if(isNaN(page_index)||page_index==""||page_index==0){
			page_index=0;
		}else{
			page_index=page_index-1;
		}
		this.ID_readData(page_size,page_index);
	}
	ID_readData(page_size,page_index) {
		//TREE_GROUP_ID
		var url = 'account/user/';
		url += '?page=' + (page_index+1);
		url += '&page_size=' + page_size;
		url += '&groups=' + this.props.treegroupid;
		url += '&order_field=' + SORT_ORDER_FIELD;
		url += '&order_by=' + SORT_ORDER_BY;
		if (QUERY_KEY.length > 0) {
			url += '&q=' + QUERY_KEY;
		}
		if(status!="" && status!=null && status!="null"){
			  url += '&status=' + status;
		}
		
		trendFun.jsGetRequest(url, function(response){
		    //$("#ID_row_container").empty();
			if(response.count<=0){
				$("#ID_page_index").val(page_index);
				$("#ID_pagecount").text('0');
				$("#ID_pagerendcont").text('0');
				this.setState({userlist:[]});
				return;
			}
  
			this.parseID(response);
			
			var tempCurrentpage=page_index+1;
			$("#ID_page_index").val(tempCurrentpage); //input
			var total_count=parseInt(response.count,10);
			if(!$.isNumeric(total_count)){total_count=0;}
			$("#ID_pagecount").text(total_count);
			
			var tempstartLine = page_size*page_index + 1;
			var temppageEndLine = page_size*(page_index + 1);
			var tempendLine = temppageEndLine > total_count ? total_count : temppageEndLine;
			if (tempstartLine > tempendLine) {
				tempstartLine = tempendLine;
			}
			$("#ID_pagerstartcont").text(tempstartLine);
			$("#ID_pagerendcont").text(tempendLine);
			
			if(total_count>page_size){
				$("#ID_page_index").removeAttr("disabled");
			}else{
				$("#ID_page_index").attr("disabled","disabled");
			}
			//total pager_total_page
			var pager_total_page = 1;
			if (total_count % page_size > 0) {
				pager_total_page = Math.floor(total_count/page_size) + 1;
			} else {
				pager_total_page = Math.ceil(total_count/page_size);
			}
			$("#ID_pagertotalpage").text(pager_total_page);
			

			if(tempCurrentpage>1 && tempCurrentpage<pager_total_page){
				$("#ID_first,#ID_prev,#ID_last,#ID_next").removeClass("disabled");
			}else if(tempCurrentpage==1 && tempCurrentpage != pager_total_page){
				$("#ID_first,#ID_prev").addClass("disabled");
				$("#ID_last,#ID_next").removeClass("disabled");
			}else  if(tempCurrentpage!=1 && tempCurrentpage == pager_total_page){
				$("#ID_first,#ID_prev").removeClass("disabled");
				$("#ID_last,#ID_next").addClass("disabled");
			}else if(tempCurrentpage==1 && 1 == pager_total_page){
				$("#ID_first,#ID_prev,#ID_last,#ID_next").addClass("disabled");
			}
			
		}.bind(this), function(){
		        this.setState({userlist:[]});
		});
	 
	}
	parseID(IDs) {
		//console.log("row"+rowState);
		this.setState({userlist:(IDs.results)});
	} 
  
	initGroup() {
		this.ID_getRead();
		var rowState = [];
		for(let i=0; i < this.state.pageSize; i++) {
			rowState[i] = false;
		}
		this.setState({checkboxStatus:rowState});
		
		var url= 'account/group/'+this.props.treegroupid+'/';
		trendFun.jsGetRequest(url, function(response){
				TREE_GROUP_PROFILE = response.policy.name;
				if (this.props.treegroupid == TOP_GROUP_ID) {
					TOP_GROUP_PROFILE = TREE_GROUP_PROFILE;
				}
				
				$("#group_name").text(response.name);
				$("#group_profile").text(response.policy.inherited?(response.policy.name + " (Inherited)") : response.policy.name);
				$("#site_name").text(response.site_name);
				
				if (response.removable) {
					$("#button_delete_group").show();
				}
				else {
					$("#button_delete_group").hide();
				}
				
		}.bind(this), function(){});
	}
	
	handlePageId(event){
		event.target.val(event.target.value.replace(/\D/g,''));
  	}
	
	viewUser(id, username){
		LAST_GROUP_ID=TREE_GROUP_ID;
		LAST_GROUP_NAME=TREE_GROUP_NAME
		LAST_QUERY_KEY = QUERY_KEY;

		TREE_GROUP_ID=id;
		TREE_GROUP_NAME=username;
		IS_GROUP=false;
		this.props.callbackUserView(id, username);
		QUERY_KEY = '';
		$("#searchkeyword").val(QUERY_KEY_HINT);
		
		//refreshData();
		//$("#backBtn").show();
	}
	
	openCreateGroup(){
		//$('#vmiModal_edit_user_profile').modal('show');
		this.setState({modalCreateGroup:true});
		//var profile=decodeURIComponent($.getURLParam("policy"));
		trendFun.jsGetRequest('policy/template-simple/', function(response){
			//var html = '<option value="-1">'+profile+' (Inherited)</option>';
			var html= "<option value='-1'>Inherit from the Root group</option>";
			$.each(response.results, function(i,e){
				html+='<option value="'+e.id+'">'+e.name+'</option>';
			});
			$(html).appendTo($("#profile"));
		}, function(){ 
				alert("Unable to access server. Check your network connection and try again.");
		});
		
		trendFun.jsGetRequest('system/site_list/', function(response){
			  var html='';
			  $.each(response.results,function(i,e){
				html += '<option value="' + e.id + '">'+e.name+'</option>';
			  });
			$("#site").append(html);
		});
	
	}
	closeModalCreateGroup(){
		this.setState({modalCreateGroup:false});
	}
	saveModalCreateGroup(){
		var groupname = $('#groupname').val();
		if(groupname==""||groupname.length<3||groupname.length>20) {
		    alert("Invalid Group name. The Group name must be between 3 and 20 characters long and contain the following characters: A to Z, a to z, 0 to 9, - or _.");
		    $('#groupname').focus();
		    return false;
		}
		var regexp=/^[A-Za-z0-9_-]*$/;
		if(!regexp.test(groupname)){
		    alert("Invalid Group name. The Group name must be between 3 and 20 characters long and contain the following characters: A to Z, a to z, 0 to 9, - or _.");
		    $('#groupname').focus();
		    return false;
		}
		
		    var request = {
			    "name": $("#groupname").val(),
			    "site_id": parseInt($("#site").val(),10),
			    "policy": $('#profile').val()
		    };
		    trendFun.jsPostRequest('account/group/', request, function(response){
			    //parent.refreshTree();
			    this.refreshTree();
			    this.setState({modalCreateGroup:false});
		    }.bind(this), function(response,status){
			    if(status==400){
				    if(response.code && response.code==4007){
					    alert("The group name already exists. Choose a different group name and try again.");
				    }else{
					    alert("Unable to access server. Check your network connection and try again.");
				    }
			    }else{
				    alert("Unable to access server. Check your network connection and try again.");
			    }
		    });
		    
	}
	
	
	openCreateUser(){
		//$('#vmiModal_edit_user_profile').modal('show');
		this.setState({modalCreateUser:true});
		trendFun.jsGetRequest('account/tree/?id=1', function(response){
			var html='';
			$.each(response,function(i,e){
			      html += '<option value="' + e.id + '">'+e.name+'</option>';
			});
			
			$("#group").empty();				
			$("#group").append(html);
			//$("#group").val(TREE_GROUP_ID);
		});
		      
		trendFun.jsGetRequest('policy/template-simple/', function(response){
			//var profile=decodeURIComponent($.getURLParam("policy"));
			//var html = '<option value="-1">'+profile+' (Inherited)</option>';
			var html= "<option value='-1'>Inherit from the selected group</option>";
			$.each(response.results, function(i,e){
				html+='<option value="'+e.id+'">'+e.name+'</option>';
			});
			$(html).appendTo($("#profile"));
		}, function(){ 
			alert("Unable to access server. Check your network connection and try again.");
		});
	
	}
	closeModalCreateUser(){
		this.setState({modalCreateUser:false});
	}
	saveModalCreateUser(){
		var username = $.trim($('#username').val());
		if(username==""||username.length<3||username.length>20) {
		    alert("Invalid User name. The User name must be between 3 and 20 characters long and contain the following characters: A to Z, a to z, 0 to 9, - or _.");
		    $('#username').focus();
		    return false;
		}
		var regexp=/^[A-Za-z0-9._-]*$/;
		if(!regexp.test(username)){
		    alert("Invalid User name. The User name must be between 3 and 20 characters long and contain the following characters: A to Z, a to z, 0 to 9, - or _.");
		    $('#username').focus();
		    return false;
		}
		//var regexp=/^[^\|\\\/"'&<>]*$/;
		    var regExp=/^[^\|"'&<>]*$/;
		if(!regExp.test($('#first_name').val())){
		    alert("Invalid First name. The First name can only contain the following characters: A to Z, a to z, 0 to 9, - or _.");
		    $('#first_name').focus();
		    return false;
		}
		if(!regExp.test($('#last_name').val())){
		    alert("Invalid Last name. The Last name can only contain the following characters: A to Z, a to z, 0 to 9, - or _.");
		    $('#last_name').focus();
		    return false;
		}
		
		    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		    var reg=/^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/;
		    var email=$.trim($("#email").val()).replace(/-/g, '');
		    if(!reg.test(email)){
		    alert("Invalid Email address. The length of the email address should not exceed 75 characters, and should be in the format: myname@example.com.");
		    $('#email').focus();
		    return false;
		    }
		    
		    var profile = $('#profile').val();	
		    var request = {
			    "username": $.trim($("#username").val()),
			    "first_name": $("#first_name").val(),
			    "last_name": $("#last_name").val(),
			    "email": $.trim($("#email").val()),
			    "groups": [parseInt($('#group').val(), 10)],
			    "policy": profile
		    };
		    trendFun.jsPostRequest('account/user/', request, function(response){
			    //parent.refreshUser();
			    //parent.popupClose(id);
			    this.initGroup();
			    this.setState({modalCreateUser:false});
		    }.bind(this), function(response,status){
			    if(status==400){
				    if(response.code && response.code==4007){
					    alert("This user name already exists.");
				    }else if(response.code && response.code==4039){
					    alert("Unable to add user. The current number of users has reached the maximum number of licensed seats. Please contact your sales representative to add more seats to your license.");
				    }else{
					    alert("Unable to access server. Check your network connection and try again.");
				    }
			    }else{
				    alert("Unable to access server. Check your network connection and try again.");
			    }
		    });
	}
	
	
	openImportFile(){
		//$('#vmiModal_edit_user_profile').modal('show');
		this.setState({modalImportFile:true});
	  
	}
	closeModalImportFile(){
		this.setState({modalImportFile:false});
	}
	
	openEditGroup(){
		this.setState({modalEditGroup:true});
		
		trendFun.jsGetRequest('account/group/'+TREE_GROUP_ID+'/', function(response){
			if (TREE_GROUP_ID == 1) {
				$(".root").remove();
				$("#needshow").css("visibility","visible");
			}
			var policy=response.policy;
			var site_id=response.site_id;
			var site_name=response.site_name;
			$('#modal_group_name').text(response.name);
			trendFun.jsGetRequest('policy/template-simple/', function(response){
				if(policy.inherited){
					$("#ploicy_name").text(policy.name);
					$("input[type=radio][name=r1]:eq(0)").attr("checked",true);
					$("#profile").attr("disabled",true);
				}else{
					$("#ploicy_name").text(policy.inherited_policy);
					$("input[type=radio][name=r1]:eq(1)").attr("checked",true);
					$("#profile").attr("disabled",false);
				}
				if(policy.inherited_policy_group){
					$("#parent_group_name").text(policy.inherited_policy_group);
				}
				var tempChecked="";
				var html='';
				$.each(response.results, function(i,e){
					tempChecked="";
					if(!policy.inherited && policy.id == e.id){
						tempChecked="selected";
					}
					
					html+='<option '+ tempChecked+' value="'+e.id+'">'+e.name+'</option>';
				});
				$(html).appendTo($("#profile"));
				
				var usersite=trendFun.GetCookie("site_id");
				trendFun.jsGetRequest('system/site_list/', function(response){
					var html='';
					if (TREE_GROUP_ID == 1) { //if group isnt root,  site admin only show itself list.
						html += '<option value="' + site_id + '">'+site_name+'</option>';
					}else{
						$.each(response.results,function(i,e){
						  html += '<option value="' + e.id + '">'+e.name+'</option>';
						});
					}
					  
					$("#site").append(html);
					$("#site").val(site_id); //select defalult
					
					if(TREE_GROUP_ID==1 && (response.results.length>1 || usersite>1 )){
						$("#site").prop("disabled",true);
						$("#profile").prop("disabled",true);
					}
				}.bind(this));
				
			}.bind(this), function(){ 
				alert("Unable to access server. Check your network connection and try again.");
			});
		}.bind(this), function(){ 
			alert("Unable to access server. Check your network connection and try again.");
		});
		
		$("input[type=radio][name=r1]").click(function(e) {
			if($(this).val()=="-1"){
				$("#profile").attr("disabled",true);	
			}else{
				$("#profile").attr("disabled",false);
			}
		});
	}
	closeModalEditGroup(){
		this.setState({modalEditGroup:false});
	}
	saveModalEditGroup(){
		var profile=$("input[type=radio][name=r1]:checked").val();
		if(profile!="-1"){ //-1 default inherited
			profile = $('#profile').val();
		}
		var site_id=parseInt($("#site").val(),10);
		var request = {
			"policy": profile,
			"site_id": site_id
		};
		trendFun.jsPutRequest('account/group/'+TREE_GROUP_ID+'/', request, function(response){
			//parent.refreshGroup();
			//parent.popupClose(id);
			this.initGroup();
			$("#button_refresh").triggerHandler("click");
			this.setState({modalEditGroup:false});
		}.bind(this), function(response){
			if(response.code==4009){
				alert("Unable to save settings. You cannot change the site of a sub group.");
			}else if(response.code==7002){
				alert("Unable to save settings. The selected profile does not belong to the selected site. Select the correct profile and try again.");
			}else{ 
				alert("Unable to access server. Check your network connection and try again.");
			}
		});
	}
	
	setPageSize(size){
		this.setState({pageSize:parseInt(size,10)},()=>{
			$("#page_index").val('1');
			this.ID_getRead();
		});	
	}
	
  
	render() {
		let usersdiv;

		if(this.state.userlist.length == 0)
			usersdiv = <tr><td><div  className="noDataToDisplay">No data to display.</div></td></tr>
		else {
			var icon = 'user_status_disable.png';
			var imgalt="Disable";
			
			usersdiv = this.state.userlist.map(function(e, index){
				if(e.is_active){
					icon = USER_STATUS[e.status];
					imgalt=USER_ALT[e.status];
				}
				
				return (	<tr id={"ID_tr_"+e.id} key={e.id} className={this.state.checkboxStatus[index]&&"checked"}>
								<td className="checkBoxAll"><input type="checkbox" defaultValue={e.id} data-active={e.is_active?"1":"0"} checked={this.state.checkboxStatus[index]} onChange={this.checkUserBox.bind(this, index)} className={e.is_active?"is-active cbx":"cbx"} id={'ID_tr_checkbox_'+e.id}/></td>
								<td id={e.id}><a href="javascript:;" data-userid={e.id} data-username={e.username} className="userinfo" onClick={this.viewUser.bind(this, e.id, e.username)}>{e.username}</a></td>
								<td className="visible-lg">{e.first_name+' '+e.last_name}</td>
								<td className="visible-lg">{e.email}</td>
								<td className="visible-lg">{e.policy.name}</td>
								<td className="visible-lg">{e.group_names.slice(0,10).join(", ")}</td>
								<td className="visible-lg" style={{textAlign:"center"}}>{e.is_vip? <img src='../images/icon_vip.png'/> : ""}</td>
								
								<td style={{textAlign:"center"}} id={"status_"+e.id}><img width="20" title={imgalt} src={"../images/"+icon}/></td>
								<td className="visible-lg">{(e.last_login == e.date_joined?'-':trendFun.to_locale_time(e.last_login))}</td>
							</tr>
						)
			}.bind(this));
			
			this.props.callbackID_clickcheckbox();
		}
		
		return (
			<div>
				<div className="groupsummary">
				   <ul className="sections">
                                          <li id="secondli">
                                                <dl>
                                                  <dt>Group:</dt>
                                                  <dd style={{'lineHeight':'25px', 'color':'#333'}} id="group_name">&nbsp;</dd>
                                                </dl>
                                                
                                                <dl>
                                                  <dt>Profile:</dt>
                                                  <dd>
                                                  	<span id="group_profile"></span>
                                                  	<span className="action_command g_moniter_admin moniter_admin_del"><a onClick={this.openEditGroup.bind(this)} id="button_edit_group">Change</a></span>
                                                  </dd>
                                                </dl>
                                                <dl>
                                                  <dt>Site:</dt>
                                                  <dd>
                                                  	<span id="site_name"></span>
                                                  	
                                                  </dd>
                                                </dl>
                                                
                                                <dl></dl>
					  </li>
				  </ul>
				</div>
				
				
				<div className="table-with-scrollbar sb-h">
					<div className="fixed-column pull-left">
					  <table className="table table-bordered table-hover">
						<thead>
						  <tr>
							<th>Display Name</th>
						  </tr>
						</thead>
						<tbody>
						  <tr className="">
							<td className="td-link"><a href="javascript:;">DDAN-CLUSTERS-01</a></td>
						  </tr>
						  <tr className="">
							<td className="td-link"><a href="javascript:;">DDAN-HA-MASTER-01</a></td>
						  </tr>
						  <tr className="">
							<td className="td-link"><a href="javascript:;">DDI-01</a></td>
						  </tr>
						  <tr className="">
							<td className="td-link"><a href="javascript:;">DDI-02</a></td>
						  </tr>
						  <tr className="">
							<td className="td-link"><a href="javascript:;">DDEI-01</a></td>
						  </tr>
						</tbody>
					  </table>
					</div>
					<div className="table-horizontal-scrollable pull-left mCustomHorizontalScrollbar mCustomScrollbar-dragger-fixed mCustomScrollbar _mCS_3"><div id="mCSB_3" className="mCustomScrollBox mCS-light mCSB_horizontal mCSB_inside" style={{"maxHeight":"none"}} tabIndex="0"><div id="mCSB_3_container" className="mCSB_container" style={{"position":"relative"," top":"0px","left":"0px","width":"2303px"}} dir="ltr">
					  <table className="table table-bordered table-hover">
						<thead>
						  <tr>
							<th>IP Address</th>
							<th>VA Image Name - 1</th>
							<th>VA Platform - 1</th>
							<th>VA Image Name - 2</th>
							<th>VA Platform - 2</th>
							<th>VA Image Name - 3</th>
							<th>VA Platform - 3</th>
							<th>Last Deployed Plan</th>
							<th>Product Name</th>
							<th>Agent Version</th>
							<th>Product GUID</th>
							<th>Registered</th>
						  </tr>
						</thead>
						<tbody>
						  <tr className="">
							<td>31.8.0.1</td>
							<td>Windows_7_SP1_x86.ova</td>
							<td>Microsoft Windows 7 Professional SP1 Build 7601 32bit</td>
							<td>Windows_8.1_x64.ova</td>
							<td>Microsoft Windows 8.1 Enterprise Build 9600 64bit</td>
							<td>N/A</td>
							<td>N/A</td>
							<td className="td-link"><a href="javascript:;">DDAN 5.8</a></td>
							<td>Deep Discovery Analyzer</td>
							<td>1.1.0.1048</td>
							<td>1F57E0DE-D7CC-4614-B9A8-66BD45F49C88</td>
							<td>2016-06-02 23:15:00</td>
						  </tr>
						  <tr className="">
							<td>31.8.0.1</td>
							<td>Windows_7_SP1_x86.ova</td>
							<td>Microsoft Windows 7 Professional SP1 Build 7601 32bit</td>
							<td>Windows_8.1_x64.ova</td>
							<td>Microsoft Windows 8.1 Enterprise Build 9600 64bit</td>
							<td>N/A</td>
							<td>N/A</td>
							<td className="td-link"><a href="javascript:;">DDAN 6.0</a></td>
							<td>Deep Discovery Analyzer</td>
							<td>1.1.0.1048</td>
							<td>9CC8C72A-8841-4B2A-9227-893B87933836</td>
							<td>2016-04-18 23:17:20</td>
						  </tr>
						  <tr className="">
							<td>1.54.0.1</td>
							<td>Windows_7_SP1_x86.ova</td>
							<td>Microsoft Windows 7 Professional SP1 Build 7601 32bit</td>
							<td>Windows_8.1_x64.ova</td>
							<td>Microsoft Windows 8.1 Enterprise Build 9600 64bit</td>
							<td>N/A</td>
							<td>N/A</td>
							<td className="td-link"><a href="javascript:;">DDI 3.8 SP5</a></td>
							<td>Deep Discovery Inspector</td>
							<td>1.1.0.1048</td>
							<td>5CB2E852-C419-4182-B05D-D03CB5E451C0</td>
							<td>2016-04-17 21:20:18</td>
						  </tr>
						  <tr className="">
							<td>1.54.0.2</td>
							<td>win7sp1-en</td>
							<td>Microsoft Windows 7 Professional SP1 Build 7601 32bit</td>
							<td>Windows_8.1_x64.ova</td>
							<td>Microsoft Windows 8.1 Enterprise Build 9600 64bit</td>
							<td>N/A</td>
							<td>N/A</td>
							<td className="td-link"><a href="javascript:;">DDI 3.8 SP5</a></td>
							<td>Deep Discovery Inspector</td>
							<td>1.1.0.1048</td>
							<td>6BD8F4059EBF-442B9728-3CA4-8AF4-1538</td>
							<td>2016-03-20 21:00:55</td>
						  </tr>
						  <tr className="">
							<td>1.56.0.1</td>
							<td>MAK_win7sp1en_offices_noab_ID8</td>
							<td>N/A</td>
							<td>xp-sp3</td>
							<td>Microsoft Windows 8.1 Enterprise Build 9600 64bit</td>
							<td>N/A</td>
							<td>N/A</td>
							<td className="td-link"><a href="javascript:;">DDEI 2.6</a></td>
							<td>Deep Discovery Email Inspector</td>
							<td>1.1.0.1048</td>
							<td>A975331E-D564-4500-AEA5-05486AA6FEEE</td>
							<td>2016-03-11 12:34:02</td>
						  </tr>
						</tbody>
					  </table>
					</div><div id="mCSB_3_scrollbar_horizontal" className="mCSB_scrollTools mCSB_3_scrollbar mCS-light mCSB_scrollTools_horizontal" style={{"display":"block"}}><div className="mCSB_draggerContainer"><div id="mCSB_3_dragger_horizontal" className="mCSB_dragger" style={{"position":"absolute","minWidth":"30px","display":"block","width":"716px","maxWidth":"1274px","left":"0px"}}><div className="mCSB_dragger_bar"></div></div><div className="mCSB_draggerRail"></div></div></div></div></div>
					<div className="table-pagination">
					  <div className="table-pagination-block">
						<div className="pagination-records">Records: 1-5 / 5</div>
						<div className="dropdown">
						  <button className="btn btn-xs btn-link dropdown-toggle" data-toggle="dropdown" type="button">
							<span className="caret"></span>10 per page
						  </button>
						  <ul className="dropdown-menu dropdown-menu-multi-select">
							<li className="selected"><a href="javascript:;">10</a></li>
							<li><a href="javascript:;">25</a></li>
							<li><a href="javascript:;">50</a></li>
							<li><a href="javascript:;">100</a></li>
						  </ul>
						</div>
						<div className="pagination-input"><input defaultValue="1" type="text"/> / 1</div>
						<div>
						  <ul className="pagination">
							<li>
							  <a href="javascript:;" aria-label="Previous">
								<span className="fa fa-angle-left" aria-hidden="true"></span>
							  </a>
							</li>
							<li>
							  <a href="javascript:;" aria-label="Next">
								<span className="fa fa-angle-right" aria-hidden="true"></span>
							  </a>
							</li>
						  </ul>
						</div>
					  </div>
					</div>
				  </div>
  
  
  
				<div className="groupsummary table-with-header">
					<table className="tmGrid table table-bordered table-hover" style={{'borderLeft':'none','borderRight':'none',"position":"relative"," top":"0px","left":"0px","width":"2303px"}}>
					  <thead>
						<tr className="sizing_row" style={{"display":"none"}}>
						  <th className="col_1"></th>
						  <th className="col_2"></th>
						  <th className="col_2 visible-lg"></th>
						  <th className="col_3 visible-lg"></th>
						  <th className="col_4 visible-lg"></th>
						  <th className="col_5 visible-lg"></th>
						  <th className="col_6 visible-lg"></th>
						  <th className="col_6"></th>
						  <th className="col_7 visible-lg"></th>
						</tr>
						
						<tr className="header_title" id="sort_title_list">
						  <th className="checkBoxAll"><input type="checkbox" checked={this.state.checkAll} id="ID_check_all" onClick={this.checkAllUsers.bind(this)} className="check_all_checkbox"/></th>
						  <th className="sort" data-ordertype="1"><div className="column_title">User Name</div></th>
						  <th className="sort visible-lg" data-ordertype="2"><div className="column_title">Full name</div></th>
						  <th className="sort visible-lg" data-ordertype="3"><div className="column_title">Email</div></th>
						  <th className="sort visible-lg" data-ordertype="4"><div className="column_title">Profile</div></th>
						  <th className="sort visible-lg" data-ordertype="9"><div className="column_title">Groups</div></th>
						  <th className="sort visible-lg" data-ordertype="5"><div className="column_title">VIP <img title="Users with enabled VIP setting will not be logged out automatically by the server. The users need to log out manually to disconnecct form the server." src="../images/icon_info_s.png" className="lstooltip"/></div></th>
						  <th className="sort" data-ordertype="6"><div className="column_title">Status</div></th>
						  <th className="sort visible-lg" data-ordertype="7"><div className="column_title">Last Logon</div></th>
						</tr>
					  </thead>
					  <tbody id="ID_row_container"  className="row_container">
							{usersdiv}
					  </tbody>
					</table>
					<div className="table-pagination">
						<div className="table-pagination-block">
							<div className="visible-lg pagination-records">Records: <span className="pager_start_cont" id="ID_pagerstartcont">1</span>&nbsp;-&nbsp;<span className="pager_end_cont" id="ID_pagerendcont"></span> / <span className="pager_total_cont" id="ID_pagecount"></span></div>
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
							<div className="pagination-input"><input defaultValue="1" name="page_index" type="text" disabled className="pager_current_page" id="ID_page_index" onKeyUp={this.handlePageId.bind(this)} onPaste={this.handlePageId.bind(this)}/> / <span className="pager_total_page" id="ID_pagertotalpage">1</span></div>
							<div>
								<ul className="pagination">
									<li>
										<a href="javascript:;" aria-label="Previous" id="ID_prev">
											<span className="fa fa-angle-left" aria-hidden="true"></span>
										</a>
									</li>
									<li>
										<a href="javascript:;" aria-label="Next" id="ID_next">
											<span className="fa fa-angle-right" aria-hidden="true"></span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				  
				{/*create Group*/}
				<Modal show={this.state.modalCreateGroup} onHide={this.closeModalCreateGroup}>
					<Modal.Dialog>
						<Modal.Header closeButton>
							<Modal.Title>Add A New Group</Modal.Title>
						</Modal.Header>
					  
						<Modal.Body>
							<div id="modalCreateGroup">
								<ul className="detailLists">
								  <li>
								    <dt>Group name <span className="red">*</span>:</dt>
								    <dd>
								      <input name="groupname" className="ad1" type="text" className="" id="groupname" maxLength="20"/>
								    </dd>
								  </li>
								  <li id="ddtip">Use A to Z, a to z, 0 to 9, - or _ and between 3 and 20 characters long.</li>
								  <li>
								    <dt>Profile:</dt>
								    <dd>
								      <select id="profile">
								      </select>
								    </dd>
								  </li>
								  <li>
								    <dt>Site:</dt>
								    <dd>
								      <select id="site">
								      </select>
								    </dd>
								  </li>
								</ul>
							</div>
						</Modal.Body>
					  
						<Modal.Footer>
							<Button onClick={this.closeModalCreateGroup}>Close</Button>
							<Button bsStyle="primary" onClick={this.saveModalCreateGroup}>Save</Button>
						</Modal.Footer>
					  
					</Modal.Dialog>
				</Modal>
				
				{/*create User*/}
				<Modal show={this.state.modalCreateUser} onHide={this.closeModalCreateUser}>
					<Modal.Dialog>
						<Modal.Header closeButton>
							<Modal.Title>Add A New User</Modal.Title>
						</Modal.Header>
					  
						<Modal.Body>
							<div id="modalCreateUser">
								    <ul className="detailLists">
									<li className="marginlist20" id="secondli">
									  <dl style={{'marginTop':'10px'}}>
									    <dt>User name <span className="red">*</span> :</dt>
									    <dd className="dd">
									      <input name="username" className="ad1 form-control" type="text" id="username" maxLength="20"/>
									    </dd>
									    <dd className="ddtip">Use A to Z, a to z, 0 to 9, - or _ and between 3 and 20 characters long.</dd>
									  </dl>
									  <dl>
									    <dt>First name:</dt>
									    <dd className="dd">
									      <input name="first_name" className="ad1 form-control" type="text" id="first_name" maxLength="20"/>
									    </dd>
									  </dl>
									  <dl>
									    <dt>Last name:</dt>
									    <dd className="dd">
									      <input name="last_name" className="ad1 form-control" type="text" id="last_name" maxLength="20"/>
									    </dd>
									  </dl>
									  <dl>
									    <dt>Email address <span className="red">*</span> :</dt>
									    <dd className="dd">
									      <input name="email" type="text" className="ad1 form-control" id="email" maxLength="75" style={{'width':'240px'}}/>
									    </dd>
									    <dd className="ddtip">For example: johnsmith@yourcompany.com </dd>
									  </dl>
									  <dl>
									    <dt>Group:</dt>
									    <dd className="dd">
										<select id="group"></select>
									    </dd>
									    <span style={{'clear':'both'}}></span>
									  </dl>
									  <dl style={{'marginTop':'10px'}}>
									    <dt>Profile:</dt>
									    <dd className="dd">
										<select id="profile"></select>
									    </dd>
									  </dl>
									  <dl style={{'clear':'both'}}></dl>
									</li>
								   </ul>
							</div>
						</Modal.Body>
					  
						<Modal.Footer>
							<Button onClick={this.closeModalCreateUser}>Close</Button>
							<Button bsStyle="primary" onClick={this.saveModalCreateUser}>Save</Button>
						</Modal.Footer>
					  
					</Modal.Dialog>
				</Modal>
				
				
				{/*import File*/}
				{this.state.modalImportFile && <ImportUserModal showModal={this.state.modalImportFile} closeModal={this.closeModalImportFile}/>}
				
				
				{/*edit group*/}
				<Modal show={this.state.modalEditGroup} onHide={this.closeModalEditGroup}>
					<Modal.Dialog>
						<Modal.Header closeButton>
							<Modal.Title>Edit Group</Modal.Title>
						</Modal.Header>
					  
						<Modal.Body>
							<div id="modalEditGroup">
								  <ul className="detailLists">
									<li><dt>Group:</dt> <span className="root">&nbsp;&nbsp;</span><span id="modal_group_name"></span></li>
									<li className="root">
										<dt>Profile:</dt>
										<dd><input name="r1" type="radio" defaultValue="-1"/>Inherit from parent group <span id="parent_group_name"></span>:<span id="ploicy_name"></span></dd>
									</li>
									<li><dt style={{"visibility":"hidden"}} id="needshow">Profile:</dt><input className="root" name="r1" type="radio" defaultValue="1"/><span className="root">Specified:</span> <select id="profile"></select></li>
								    <li>
								        <dt>Site:</dt>
								        <dd>
										<select id="site">
										</select>
								        </dd>
								    </li>
								</ul>  
							</div>
						</Modal.Body>
					  
						<Modal.Footer>
							<Button onClick={this.closeModalEditGroup}>Close</Button>
							<Button bsStyle="primary" onClick={this.saveModalEditGroup}>Save</Button>
						</Modal.Footer>
					  
					</Modal.Dialog>
				</Modal>
				
			</div>
		);
	}


}


var customizeId = trendFun.GetCookie('customize');
var g_user;
class EditUserModal extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = { 
		};    
		this.closeEditUser = this.closeEditUser.bind(this);
	}
	
	componentDidMount(){
		if(customizeId == 1){
			$(".vmi").hide();
			$(".szw").show();		
		}
		
		trendFun.jsGetRequest('account/user/'+this.props.user_id+'/', function(response){
				g_user = response;
				if(customizeId != 1){
					$("#usernameinfo").text(response.username);
					$("#usernameinfo2").text(response.username);
					$("#first_name").val(response.first_name);
					$("#last_name").val(response.last_name);
				} else{
					$("#usernameinfo").text(response.username);
					$("#usernameszw").text(response.first_name);
				}
				
				//jsGetRequest('account/group/?page_size=10000&parent=1', function(response){
				trendFun.jsGetRequest('account/tree/?id=1', function(response){
					var html='';
					$.each(response,function(i,e){
						html += '<option value="' + e.id + '">'+e.name+'</option>';
					});
			  
					$("#group").empty();				
					$("#group").append(html);
					if (g_user.groups.length>0) {
						$("#group").val(g_user.groups[0]);
						$.each(response,function(i,e){
							if (e.id == g_user.groups[0]) {
								$("#groupname").text(e.name);
							}
						});
					}else {
						$("#groupnamediv").hide();
					}
				});
				
				trendFun.jsGetRequest('policy/template-simple/', function(response){
					var policy = g_user.policy;
					var tempChecked="";
					//var html= '<option value="-1">'+ (policy.inherited?policy.name:policy.inherited_policy)+' (Inherited)</option>';
					var html= "<option value='-1'>Inherited from group</option>";
					$.each(response.results, function(i,e){
						tempChecked="";
						if(!policy.inherited && policy.id == e.id){
							tempChecked="selected";
						}
						
						html+='<option '+ tempChecked+' value="'+e.id+'">'+e.name+'</option>';
					});
					$(html).appendTo($("#profile"));
				}, function(){ 
					alert("Unable to access server. Check your network connection and try again.");
				});
		});
	}
	
	closeEditUser(){
		this.props.closeModal();
	}
	saveEditUser(){
		var request = null;
		var profile = $('#profile').val();
		if(customizeId != 1){
			var regExp=/^[^\|"'&<>]*$/;
			if(!regExp.test($("#first_name").val())){
				alert("Invalid First name. The First name can only contain the following characters: A to Z, a to z, 0 to 9, - or _.");
				$("#first_name").focus();
				return false;
			}
			if(!regExp.test($("#last_name").val())){
				alert("Invalid Last name. The Last name can only contain the following characters: A to Z, a to z, 0 to 9, - or _.");
				$("#last_name").focus();
				return false;
			}
			request = {
				'first_name': $("#first_name").val(),
				'last_name': $("#last_name").val(),
				"groups": [parseInt($('#group').val(), 10)],
				"policy": profile
			};
		} else{
			request = {
				"groups": [parseInt($('#group').val(), 10)],
				"policy": profile
			};
		}
		
		trendFun.jsPutRequest('account/user/'+g_user.id+'/', request, function(response) {
			this.props.refreshUser();
			this.props.closeModal();
		}.bind(this), function() {
			alert("Unable to access server. Check your network connection and try again.");
		});
	}

	render(){
		return (
			<Modal show={this.props.showModal} onHide={this.props.closeModal}>
				<Modal.Dialog>
					<Modal.Header closeButton>
						<Modal.Title>Edit User</Modal.Title>
					</Modal.Header>
				  
					<Modal.Body>
						<div id="modalEditUser" style={{'width':'500px'}}>
							<ul className="detailLists">
								<li id="secondli">
								  <dl style={{"marginTop":"10px"}}>
								    <dt className="dt">User name:</dt>
								    <dd style={{"lineHeight":"25px", "color":"#333"}} id="usernameinfo">&nbsp;
								    </dd>
								  </dl>
								  <dl className='szw' style={{'display':'none'}}>
								    <dt className="dt">User name:</dt>
								    <dd style={{"lineHeight":"25px", "color":"#333"}} id="usernameszw">&nbsp;
								    </dd>
								  </dl>
								  <dl className="vmi">
								    <dt className="dt">First name:</dt>
								    <dd>
								      <input name="first_name" className="" type="text" id="first_name" maxLength="20"/>
								    </dd>
								  </dl>
								  <dl className="vmi">
								    <dt className="dt">Last name:</dt>
								    <dd>
								      <input name="last_name" className="" type="text" id="last_name" maxLength="20"/>
								    </dd>
								  </dl>
								  <dl>
								    <dt className="dt">Group:</dt>
								    <dd>
									<select id="group" className="normaltext" ></select>
								    </dd>
								  </dl>
								  <dl>
								    <dt className="dt">Profile:</dt>
								    <dd>
									<select id="profile" className="normaltext" ></select>
								    </dd>
								  </dl>
								</li>
								
							</ul>
						</div>
					</Modal.Body>
				  
					<Modal.Footer>
						<Button onClick={this.closeEditUser.bind(this)}>Close</Button>
						<Button bsStyle="primary" onClick={this.saveEditUser.bind(this)}>Save</Button>
					</Modal.Footer>
				  
				</Modal.Dialog>
			</Modal>
		)
	}
}

class UserSummary extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = { 
			modalUserProfile : false,
			modalEditUser : false,
		};    
		this.context = context;
		this.enable_user = this.enable_user.bind(this);
		this.disable_user = this.disable_user.bind(this);
		this.vip_user = this.vip_user.bind(this);
		
		this.openEditProfile = this.openEditProfile.bind(this);
		this.closeModalUserProfile = this.closeModalUserProfile.bind(this);
		this.saveModalUserProfile = this.saveModalUserProfile.bind(this);
		
		this.openEditUser = this.openEditUser.bind(this);
		this.closeModalEditUser = this.closeModalEditUser.bind(this);
		this.refreshTreeandUser = this.refreshTreeandUser.bind(this);
		
	}
	
	componentDidMount() {
		this.initUser();
		
		$("#wipe_workspace").click(function(){
			if(confirm("All the user data will be removed from the cloud workspace.\nDo you really want to wipe the user data for this user?")){
				var request = { "id" : TREE_GROUP_ID };
				trendFun.jsPostRequest('account/user/wipe-data/', request, function(response){
					alert("The user data has been wiped successfully.");
				},function() {
					alert("Unable to access server. Check your network connection and try again. ");
				});
			}
		});
		
		$("#reset_password_workspace").click(function(){
			if(confirm("The user will need to set a new screen lock.\nDo you want to clear the current user cloud workspace screen lock?")){
				var request = { "id" : TREE_GROUP_ID };
				trendFun.jsPostRequest('account/user/rest-pattern/', request, function(response){
					alert("Cloud workspace screen lock has been cleared successfully.\nThe user will now need to set a new screen lock for the cloud workspace.");
				});
			}
		});
		
		$("#button_reset_password").click(function(){
			if(confirm("Do you want to reset the user password?")){
				var request = { "id" : TREE_GROUP_ID };
				trendFun.jsPostRequest('account/reset-password/', request, function(response){
					alert("You have successfully reset the user password. The new password is \"{0}\". The new password has been sent to the user in the email.".replace("{0}",response.detail));
				});
			}
		});
	}
	
	jsGetProfile(policy) {
 		return policy.inherited?(policy.name + " (Inherited)") : policy.name;
	}
  
	setUserStatus(active, status) {
		var icon = 'user_status_disable.png';
		if (active) {
			//icon = status==0?'user_status_offline.png':'user_status_online.png'
			if(status!=null)
				icon = USER_STATUS[status];
			$("#button_disable_user").unbind("click").removeClass("disableLink").bind("click",this.disable_user);
			$("#button_enable_user").addClass("disableLink").unbind("click",this.enable_user);
		}
		else {
			$("#button_enable_user").unbind("click").removeClass("disableLink").bind("click",this.enable_user);
			$("#button_disable_user").addClass("disableLink").unbind("click",this.disable_user);
		}
		
		$("#user_status").html('<img width="18" src="../images/' + icon + '"/>');
	}
	
	enable_user() {
		if(confirm("Enabling user allow the user from using cloud and local workspaces on the Virtual Mobile Infrastructure.\n\nDo you want to enable the user \"{0}\"?".replace("{0}",$("#username").text()))){
		      var request = {
			      "is_active" : true,
		      };
				
		      trendFun.jsPutRequest('account/user/'+TREE_GROUP_ID+'/', request, function(response) {
			      this.setUserStatus(true, 0);
		      }.bind(this), function(response,status) {
			      if(status==400){
				      if(response.code&&response.code==4039){
					      alert("Cannot enable user.  The current number of users has reached the maximum number of licensed seats. Please contact your sales representative to add more seats to your license.");
				      }else{
					      alert("Unable to access server. Check your network connection and try again. ");
				      }
			      }else{
				      alert("Unable to access server. Check your network connection and try again. ");
			      }
		      });
		}
	};
	disable_user() {
		if(confirm("Disabling user prevents the user from using cloud and local workspaces on the Virtual Mobile Infrastructure.\n\nDo you want to disable the user \"{0}\"?".replace("{0}",$("#username").text()))){
			var request = {
				"is_active" : false,
			};
				  
			trendFun.jsPutRequest('account/user/'+TREE_GROUP_ID+'/', request, function(response) {
				this.setUserStatus(false, null);
			}.bind(this), function() {
				alert("Unable to access server. Check your network connection and try again. ");
			});
		}
	};
	  
	vip_user(event){
		var str="Set a vip  will keep instance always alive. \n\nDo you want to continue?";
		if(!event.data.is_vip){
			str="Disabling a vip status. \n\nDo you want to continue?";
		}
		var ids=[];
		ids.push(parseInt(TREE_GROUP_ID,10)); 
		if(confirm(str)){
			var request = {
				"is_vip" : event.data.is_vip,
				"id": ids
			};
			trendFun.jsPostRequest('account/user/vip/', request, function(response) {
				this.setVIPStatus(event.data.is_vip);
			}.bind(this), function(response,states) {
				if(response.code && response.code==4020){
					var error_inof="Number of VIP users exceeds the maximum limit. You may disable the VIP user setting for one of the users and enable it for this user."
					alert(error_inof.replace("{0}",response.detail));
				}else{
					alert("Unable to access server. Check your network connection and try again.");
				}
			});
		}
	};
  
	setVIPStatus(is_vip) {
		if (is_vip) {
			$("#button_disable_vip").unbind("click").removeClass("disableLink").bind("click", {is_vip: false}, this.vip_user);
			$("#button_enable_vip").addClass("disableLink").unbind("click");
			$("#vip_status").html('<img width="18" src="../images/icon_vip.png"/>');
		}else{
			$("#button_disable_vip").unbind("click").addClass("disableLink");
			$("#button_enable_vip").unbind("click").removeClass("disableLink").bind("click", {is_vip: true}, this.vip_user);
			$("#vip_status").html('<img width="18" src="../images/icon_vip_grey.png"/>');
		}
		
	}
  
	initUser(){
		var url= 'account/user/'+TREE_GROUP_ID+'/';
		trendFun.jsGetRequest(url, function(response){
				TREE_GROUP_PROFILE = response.policy.name;
				if (TREE_GROUP_ID == TOP_GROUP_ID) {
					TOP_GROUP_PROFILE = TREE_GROUP_PROFILE;
				}
				
				if(IS_GROUP){
					$("#group_name").text(response.name);
					$("#group_profile").text(this.jsGetProfile(response.policy));
					$("#site_name").text(response.site_name);
					
					if (response.removable) {
						$("#button_delete_group").show();
					}
					else {
						$("#button_delete_group").hide();
					}
				}else{
					$("#user_title").text(response.username);
					$("#username").text(response.username);
					$("#full_name").text(response.first_name + ' ' + response.last_name);
					$("#user_email").text(response.email);
					$("#device_id").text(response.device_id);
					$("#user_site_name").text(response.site_name);
					$("#user_profile").text(this.jsGetProfile(response.policy));
					var temphtml='',temphtml2='';
					$.each(response.group_names,function(i,e){
						if(i>2){
							temphtml2+='<span class="moregroupspan displaynone">'+e+"<br></span>";
						}else{
							temphtml+='<span>'+e+"<br></span>";;
						}
					});
					if(response.group_names.length>3)
						temphtml+='<span><a href="javascript:;" class="moregroup">'+"More..."+'</a><br></span>';
					temphtml+=temphtml2;
					$("#userGroup").html(temphtml);
					$(".moregroup").unbind().click(function(e) {
						$(".moregroupspan").show("slow");
						$(this).parent().remove();
					});
					//$(".storagediv input[name=storage][value="+ response.request_size +"]").prop("checked",true);
					$("#user_last_login_time").text((response.last_login == response.date_joined?"Never":trendFun.to_locale_time(response.last_login)));
					$("#user_last_modified").text(trendFun.to_locale_time(response.last_modified));
					this.setUserStatus(response.is_active, response.status);
					this.setVIPStatus(response.is_vip);
					if(response.group_names[0]=="Root"){
						$("#button_delete_user").show();
					}
					
					if(RENDER_TABLE){
						reder_table(response.id);
					}
					
					this.device_table(response.id);
					//reset_password_workspace
					//wipe_workspace
					if(response.user_type==2){
						$("#reset_password_workspace").parent().parent().hide()
						//$("#wipe_workspace").parent().parent().hide()
					}else{
						$("#reset_password_workspace").parent().parent().show()
						//$("#wipe_workspace").parent().parent().show()
					}
					
					
				}
		}.bind(this), function(){});
	}
	
	//device table
	device_table(userid) {
		/**tab3 audit log**/
		var SORT_ORDER_FIELD=1; //user desc
		var SORT_ORDER_BY='desc'; 
		$("#sort_title_list3 .sort").click(function(e) {
			return;
			var that=$(this);
			var ordertype=parseInt(that.attr("data-ordertype"),10);
			SORT_ORDER_FIELD=ordertype;
			var orderby='';
			if(that.hasClass("sort_desc")){		
				SORT_ORDER_BY='ASC';							
				that.removeClass("sort_desc").addClass("sort_asc");
			}else{
				SORT_ORDER_BY='DESC';	
				that.removeClass("sort_asc").addClass("sort_desc");
			}
			$("#sort_title_list th[data-ordertype!='"+ordertype+"']").removeClass("sort_asc").removeClass("sort_desc");
		       
		       //1-7 =>User Name Email Profile Groups VIP Status Last Logon 
			$("#ID_page_index5").val('1');
			ID_getRead5();
		});
	
	
		$("#ID_page_size5").change(function(){
			$("#ID_page_index5").val('1');
			ID_getRead5();
		});
		var  tempCurrentPageIndex=1;
		$("#ID_page_index5").keydown(function(e) {
				 var key = e.which;
				 if (key == 13) {
					if(isNaN($("#ID_page_index5").val())){
						return;
					}
					if(parseInt(tempCurrentPageIndex,10)==parseInt($("#ID_page_index5").val(),10)){
						return;
					}else{
						tempCurrentPageIndex=$("#ID_page_index5").val();
					}
					//e.preventDefault();
					ID_getRead5();
				 }
		});
	  
		$("#ID_first5").click(function(){
			if(parseInt($("#ID_page_index5").val(),10)==1){
				return;
			}
			$("#ID_page_index5").val('1');
			ID_getRead5();
		});
		$("#ID_next5").click(function(){
		    var ID_pagertotalpage5=parseInt($("#ID_pagertotalpage5").text(),10);
			var nextpage=parseInt($("#ID_page_index5").val(),10);
			if(nextpage==ID_pagertotalpage5){return;}
			nextpage=nextpage+1;
			if(nextpage>ID_pagertotalpage5) nextpage=ID_pagertotalpage5;
			$("#ID_page_index5").val(nextpage);
			ID_getRead5();
		});
		$("#ID_prev5").click(function(){
			var prevpage=parseInt($("#ID_page_index5").val(),10);
			if(prevpage==1){return;}
			prevpage=prevpage-1;
			if(prevpage<1) prevpage=1;
			$("#ID_page_index5").val(prevpage);
			ID_getRead5();
		});
		$("#ID_last5").click(function(){
		    var ID_pagertotalpage5=parseInt($("#ID_pagertotalpage5").text(),10);
			if(parseInt($("#ID_page_index5").val(),10)==ID_pagertotalpage5){
				return;
			}
			$("#ID_page_index5").val(ID_pagertotalpage5);
			ID_getRead5();
		});
	
		//read data and show pages 
		var ID_readData5=function(page_size,page_index){
			$("#ID_row_container5").empty().append("<tr><td colspan=\"7\"><img src='../images/loading_16X16.gif' />loading...</td></tr>");
			
			var url = 'account/device_list/';
			url += '?userid=' + userid;
			url += '&order_field=' + SORT_ORDER_FIELD;
			url += '&order_by=' + SORT_ORDER_BY;
			url += '&page=' + (page_index+1);
			url += '&page_size=' + page_size;
			
			trendFun.jsGetRequest(url, function(response){
	
				if(response.count<=0){
					$("#ID_row_container5").empty().append('<tr><td colspan="7"><div  class="noDataToDisplay">'+'No data to display.'+'</div></td></tr>');
					$("#ID_page_index5").val(page_index);
					$("#ID_pagecount5").text('0');
					$("#ID_pagerendcont5").text('0');
					return;
				}
	  
				parseID5(response);
				
				var tempCurrentpage=page_index+1;
				$("#ID_page_index5").val(tempCurrentpage); //input
				var total_count=parseInt(response.count,10);
				if(!$.isNumeric(total_count)){total_count=0;}
				$("#ID_pagecount5,#totalcount").text(total_count);
				
				var tempstartLine = page_size*page_index + 1;
				var temppageEndLine = page_size*(page_index + 1);
				var tempendLine = temppageEndLine > total_count ? total_count : temppageEndLine;
				if (tempstartLine > tempendLine) {
					tempstartLine = tempendLine;
				}
				$("#ID_pagerstartcont5").text(tempstartLine);
				$("#ID_pagerendcont5").text(tempendLine);
				
				if(total_count>page_size){
					$("#ID_page_index5").removeAttr("disabled");
				}else{
					$("#ID_page_index5").attr("disabled","disabled");
				}
				//total pager_total_page
				var pager_total_page = 1;
				if (total_count % page_size > 0) {
					pager_total_page = Math.floor(total_count/page_size) + 1;
				} else {
					pager_total_page = Math.ceil(total_count/page_size);
				}
				$("#ID_pagertotalpage5").text(pager_total_page);
				
	
				if(tempCurrentpage>1 && tempCurrentpage<pager_total_page){
					$("#ID_first5,#ID_prev5,#ID_last5,#ID_next5").removeClass("disabled");
				}else if(tempCurrentpage==1 && tempCurrentpage != pager_total_page){
					$("#ID_first5,#ID_prev5").addClass("disabled");
					$("#ID_last5,#ID_next5").removeClass("disabled");
				}else  if(tempCurrentpage!=1 && tempCurrentpage == pager_total_page){
					$("#ID_first5,#ID_prev5").removeClass("disabled");
					$("#ID_last5,#ID_next5").addClass("disabled");
				}else if(tempCurrentpage==1 && 1 == pager_total_page){
					$("#ID_first5,#ID_prev5,#ID_last5,#ID_next5").addClass("disabled");
				}
				
			}, function(){$("#ID_row_container5").empty().append('<tr><td colspan="7"><div  class="noDataToDisplay">'+'No data to display.'+'</div></td></tr>');});
		}
		
		var ID_getRead5=function(){
				var page_size=parseInt($("#ID_page_size5").val(),10);
				if(isNaN(page_size)) page_size=20;
				var page_index=parseInt($("#ID_page_index5").val(),10);
				if(isNaN(page_index)||page_index==""||page_index==0){
					page_index=0;
				}else{
				       page_index=page_index-1;
				}
			ID_readData5(page_size,page_index);
		}
		var  parseID5=function(IDs){
			      var html='';
			      var device;
			      var types = ["N/A", "Corporate - Dedicated", "Corporate - Shared"
				      , "Employee Owned", "Undefined"];
			      var status = ["Inactive", "Active"
				      , "Inactive", "Policy Expired"];
	      
			      $.each(IDs.results,function(i,e){
				      html += '<tr id="ID_tr_'+e.id+'">';		
				      html += '   <td id="'+e.id+'"><a href="../devices/index.htm?platform='+e.platform+'&deviceid='+e.id+'"  deviceid="'+e.id+'" devicename="'+e.device_name+'" class="devicename">'+e.device_name+'</a></td>';
				      html += '   <td>'+types[e.ownership]+'</td>'
				      html += '   <td>'+e.vendor+'</td>'
				      html += '   <td>'+e.model+'</td>'
				      html += '   <td>'+e.imei+'</td>'
				      //html += '   <td id="'+e.policyid+'"><a href="javascript:;"  policyid="'+e.policyid+'" policyname="'+e.mdm_policy.name+'" class="mdmpolicy">'+e.mdmpolicy+'</td>';
				      html += '   <td>'+status[e.mdm_status]+'</td>'
				      html += '   <td>'+trendFun.to_locale_time(e.last_seen)+'</td>'    //!!!!!!calculate time
				      html += '</tr>'
	      
			      });
			      if(html!=''){					
				      $("#ID_row_container5").empty().append(html);
			      }else{
				      $("#ID_row_container5").empty().append("<tr><td colspan='7'><div  class='noDataToDisplay'>"+"No data to display."+"</div></td></tr>");
			      }
		} 
		//----------------show data list end---------------------------
      
		ID_getRead5();
	      
	};
	
	handlePageId(event){
		event.target.val(event.target.value.replace(/\D/g,''));
  	}
  
	handlePageBack(){
		this.context.history.goBack();
		return false;  
	}
	
	refreshTreeandUser(){
		this.initUser();
		TOP_GROUP_ID=1;
		var zTree = $.fn.zTree.getZTreeObj("treeView");
		var nodes = zTree.getNodes();
		zTree.selectNode(nodes[0]); 
		$("#button_refresh").click();
	}
	
	openEditProfile(){
		//$('#vmiModal_edit_user_profile').modal('show');
		this.setState({modalUserProfile:true});
		trendFun.jsGetRequest('account/user/'+TREE_GROUP_ID+'/', function(response){
			var policy=response.policy;
			$("#username").text(response.username);
			$("#parent_group_name").text(response.group_names.join());
			trendFun.jsGetRequest('policy/template-simple/?page_size=1000000', function(response){
				var tempChecked=""
				//var html= '<option value="-1">'+ (policy.inherited?policy.name:policy.inherited_policy)+' (Inherited)</option>';
				if(policy.inherited){
					$("#ploicy_name").text(policy.name);
					$("input[type=radio][name=r1]:eq(0)").attr("checked",true);
					$("#profile").attr("disabled",true);
				}else{
					$("#ploicy_name").text(policy.inherited_policy);
					$("input[type=radio][name=r1]:eq(1)").attr("checked",true);
					$("#profile").attr("disabled",false);
				}
				var html='';
				$.each(response.results, function(i,e){
					tempChecked="";
					if(!policy.inherited && policy.id == e.id){
						tempChecked="selected";
					}
					
					html+='<option '+ tempChecked+' value="'+e.id+'">'+e.name+'</option>';
				});
				$(html).appendTo($("#profile"));
			}, function(){ 
				alert("Unable to access server. Check your network connection and try again.");
			});
		}, function(){ 
			alert("Unable to access server. Check your network connection and try again.");
		});
		
		
		$("input[type=radio][name=r1]").click(function(e) {
		if($(this).val()=="-1"){
				$("#profile").attr("disabled",true);	
			}else{
				$("#profile").attr("disabled",false);
			}
		});
	}
	closeModalUserProfile(){
		this.setState({modalUserProfile:false});
	}
	saveModalUserProfile(){
		var profile=$("input[type=radio][name=r1]:checked").val();
		if(profile!="-1"){ //-1 default inherited
			profile = $('#profile').val();
		}
		var request = {
			"policy": profile
		};
		trendFun.jsPutRequest('account/user/'+TREE_GROUP_ID+'/', request, function(response){
			//parent.refreshUser();
			this.initUser();
			this.setState({modalUserProfile:false});
		}.bind(this), function(response){ 
			if(response.code==4009){
				alert("Unable to save settings. You cannot change the site of a sub group.");
			}else{ 
				alert("Unable to access server. Check your network connection and try again.");
			}
		});
	}
	
	openEditUser(){
		this.setState({modalEditUser:true});
	}
	closeModalEditUser(){
		this.setState({modalEditUser:false});
	}
  
	render() {
		//let editProfileBody = this.editUserProfile();
		return (
			<div>
				<div id="usersummary">
					<h4 className="title fixtitle" id="user_title"></h4>
                                        <ul className="sections">
                                              <li id="secondli">
                                                <dl style={{'display':'none'}}>
                                                  <dt>User name:</dt>
                                                  <dd style={{'lineHeight':'25px', 'color':'#333'}} id="username">&nbsp;</dd>
                                                </dl>
                                                
                                                <dl>
                                                  <dt>Full name:</dt>
                                                  <dd id="full_name"></dd>
                                                </dl>
                                                <dl>
                                                  <dt>Email:</dt>
                                                  <dd id="user_email"></dd>
                                                </dl>
                                                <dl id='reset_password_item'>
                                                  <dt>Password:</dt>
                                                  <dd>********<span className="action_command g_moniter_admin moniter_admin_del"><a href="javascript:;" id="button_reset_password">Reset</a></span></dd>
                                                </dl>
                                                <dl>
                                                  <dt>Group:</dt>
                                                  <dd id="userGroup"></dd>
                                                </dl>
                                                <dl>
                                                  <dt>Site:</dt>
                                                  <dd id="user_site_name"></dd>
                                                </dl>
                                                
                                                <dl style={{'borderBottom': '1px dashed #CCCCCC'}}></dl>
                                                <dl>
                                                  <dt>Device ActiveSync ID:</dt>
                                                  <dd>
                                                  	<span id="device_id"></span>
                                                  	
                                                  </dd>
                                                </dl>
                                                <dl>
                                                  <dt>Profile:</dt>
                                                  <dd>
                                                  	<span id="user_profile"></span>
                                                  	<span className="action_command g_moniter_admin moniter_admin_del"><a data-toggle="modal"  id="button_edit_user_profile" onClick={this.openEditProfile}>Change</a></span>
                                                  </dd>
                                                </dl>
						
                                                
                                                <dl>
                                                  <dt>Status:</dt>
                                                  <dd>
                                                  	<span id="user_status"></span>
                                                  	<span className="action_command g_moniter_admin moniter_admin_del" id="button_enable_user_span"><a href="javascript:;" id="button_enable_user">Enable</a></span>
                                                    <span className="action_command g_moniter_admin moniter_admin_del" id="button_disable_user_span"><a href="javascript:;" id="button_disable_user">Disable</a></span>
                                                  </dd>
                                                </dl>
                                                
                                                
                                                <dl>
                                                  <dt>VIP:</dt>
                                                  <dd>
                                                    <span id="vip_status"></span>
                                                  	<span className="action_command g_moniter_admin moniter_admin_del" id="button_enable_vip_span"><a href="javascript:;" id="button_enable_vip">Enable</a></span>
                                                    <span className="action_command g_moniter_admin moniter_admin_del" id="button_disable_vip_span"><a href="javascript:;" id="button_disable_vip">Disable</a></span>
                                                  </dd>
                                                </dl>
                                                <dl style={{'display':'none'}}>
                                                  <dt>Stroage:</dt>
                                                  <dd>
                                                    <span className="storagediv"><input name="storage" type="radio" value="0"/>No Limit <input name="storage" type="radio" value="16"/>16G <input name="storage" type="radio" value="32"/>32G <input name="storage" type="radio" value="64"/>64G <input name="storage" type="radio" value="128"/>128G</span>
                                                  </dd>
                                                </dl>

                                                <dl>
                                                  <dt>Wipe cloud workspace:</dt>
                                                  <dd><a id="wipe_workspace" href="javascript:;" className="g_moniter_admin moniter_admin_del">Wipe</a> <img title="All the user data will be removed from the cloud workspace. Once the data is removed, it cannot be recovered (Only for Android)." src="../images/icon_info_s.png" className="lstooltip"/></dd>
                                                </dl>
                                                <dl>
                                                  <dt>Clear cloud workspace screen lock:</dt>
                                                  <dd><a id="reset_password_workspace" href="javascript:;" className="g_moniter_admin moniter_admin_del">Clear</a> <img title="The user will be required to set a new screen lock for the mobile device." src="../images/icon_info_s.png" className="lstooltip"/></dd>
                                                </dl>
                                                <dl>
                                                  <dt>Last logon:</dt>
                                                  <dd id="user_last_login_time"></dd>
                                                </dl>
                                                <dl>
                                                  <dt>Last modified:</dt>
                                                  <dd id="user_last_modified"></dd>
                                                </dl>
                                               <dl style={{'borderBottom': '1px dashed #CCCCCC'}}></dl> 
                                                
                                                <dl style={{'display':'none'}} className="RENDER_TABLE">
                                                  <dt>Applications Used</dt>
                                                  <dd></dd>
                                                </dl>
                                                <div style={{'padding':'10px 0', 'display':'none'}} className="RENDER_TABLE">
                                                
                                                                  <table className="tmGrid" style={{'borderTop':'1px solid #b2b2b2', 'marginTop':'20px'}}>
                                                                  <thead>
                                                                    <tr className="sizing_row">
                                                                      <th className="col_1"></th>
                                                                      <th className="col_2"></th>
                                                                      <th className="col_4"></th>
                                                                    </tr>
                                                                    <tr className="behavior_button displaynone">
                                                                      <th colSpan="3"> <ul className="button_group">
                                                                          <li className="item_list" id="button_addprofile"> <span className="list_container button_addprofile">Export</span></li>
                                                                        </ul>
                                                                      </th>
                                                                    </tr>
                                                                    <tr className="header_title" id="sort_title_list2">
                                                                      <th className="sort"><div className="column_title">Serial</div></th>
                                                                      <th className="sort" data-ordertype="2"><div className="column_title">Application Name</div></th>
                                                                      <th className="sort" data-ordertype="3"><div className="column_title">Duration</div></th>
                                                                    </tr>
                                                                  </thead>
                                                                    <tbody id="ID_row_container4"  className="row_container">
                                                                        <tr><td colSpan="3"><div  className="noDataToDisplay">No data to display.</div></td></tr>
                                                                    </tbody>
                                                                    <tfoot>
                                                                      <tr>
                                                                        <td colSpan="3">
                                                                          <ul className="pagination">
                                                                              <li className="records">Records: <dt className="pager_start_cont" id="ID_pagerstartcont4">1</dt>&nbsp;-&nbsp;<dt className="pager_end_cont" id="ID_pagerendcont4"></dt> / <dt className="pager_total_cont" id="ID_pagecount4"></dt> </li>
                                                                              <li className="btn btn_first disabled" id="ID_first4"></li>
                                                                              <li className="btn btn_prev disabled" id="ID_prev4"></li>
                                                                              <li className="pageInput">Page&nbsp;&nbsp;
																				<input name="page_index" type="text" disabled className="pager_current_page" id="ID_page_index4" onKeyUp={this.handlePageId.bind(this)} onPaste={this.handlePageId.bind(this)} />&nbsp;&nbsp;/ 
																				<dt className="pager_total_page" id="ID_pagertotalpage4">1</dt>
																			  </li>
                                                                              <li className="btn btn_next disabled" id="ID_next4"></li>
                                                                              <li className="btn btn_last disabled" id="ID_last4"></li>
                                                                              <li className="per_page">
                                                                                  <select name="page_size" id="ID_page_size4"><option value="10">10</option><option value="20">20</option><option value="30">30</option></select>&nbsp;&nbsp;per page
                                                                              </li>
                                                                          </ul>
                                                                        
                                                                          </td>
                                                                      </tr>
                                                                    </tfoot>
                                                                  </table>
                                                
                                                
                                                </div>
                                                
						<dl className="DEVICE_TABLE">
                                                  <dt>Managed Devices</dt>
                                                  <dd></dd>
                                                </dl>						
						<div style={{'padding':'10px 0',"display":"none"}} className="DEVICE_TABLE">
							<table className="table table-bordered table-hover" style={{'borderTop':'1px solid #b2b2b2', 'marginTop':'20px'}}>
								<thead>
									<tr className="device_sizing_row">
										<th className="col_1"></th>
										<th className="col_2"></th>
										<th className="col_3"></th>
										<th className="col_4"></th>
										<th className="col_5"></th>
										<th className="col_6"></th>
										<th className="col_7"></th>
									</tr>
                                            
									<tr className="header_title" id="sort_title_list3">
										<th className="sort" data-ordertype="1"><div className="column_title">Device Name</div></th>
										<th className="sort" data-ordertype="2"><div className="column_title">Device Ownership</div></th>
										<th className="sort" data-ordertype="3"><div className="column_title">Vender</div></th>
										<th className="sort" data-ordertype="4"><div className="column_title">Model</div></th>
										<th className="sort" data-ordertype="5"><div className="column_title">IMEI</div></th>
										<th className="sort" data-ordertype="7"><div className="column_title">MDM Status</div></th>
										<th className="sort" data-ordertype="8"><div className="column_title">Last Seen</div></th>
									</tr>
								</thead>
								<tbody id="ID_row_container5"  className="row_container">
									<tr><td><div  className="noDataToDisplay">No data to display.</div></td></tr>
								</tbody>
								<tfoot>
									<tr>
										<td>
											<ul className="pagination">
												<li className="records">Records: <dt className="pager_start_cont" id="ID_pagerstartcont">1</dt>&nbsp;-&nbsp;<dt className="pager_end_cont" id="ID_pagerendcont5"></dt> / <dt className="pager_total_cont" id="ID_pagecount"></dt> </li>
												<li className="btn btn_first disabled" id="ID_first5"></li>
												<li className="btn btn_prev disabled" id="ID_prev5"></li>
												<li className="pageInput">Page&nbsp;&nbsp;
													<input name="page_index" type="text" disabled className="pager_current_page" id="ID_page_index5" onKeyUp={this.handlePageId.bind(this)} onPaste={this.handlePageId.bind(this)} />&nbsp;&nbsp;/ 
													<dt className="pager_total_page" id="ID_pagertotalpage">1</dt>
												</li>
												<li className="btn btn_next disabled" id="ID_next5"></li>
												<li className="btn btn_last disabled" id="ID_last5"></li>
												<li className="per_page">
													<select name="page_size" id="ID_page_size5"><option value="10">10</option><option value="20">20</option><option value="30">30</option></select>&nbsp;&nbsp;per page
												</li>
											</ul>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>                                                         

                                                
                                                <dl>
							<dt>
								<button id="backBtn" style={{"display":"none"}}>Back</button>
								<button style={{'display':'none'}} id="returnBtn" href="#" onClick={this.handlePageBack.bind(this)}>Return</button>
							</dt>
							<dd></dd>
                                                </dl>
                                                <dl></dl>
                                          </li>
                                        </ul>
				</div>
				
				{/*edit user profile*/}
				<Modal show={this.state.modalUserProfile} onHide={this.closeModalUserProfile}>
					<Modal.Dialog>
						<Modal.Header closeButton>
							<Modal.Title>Import Group or User from LDAP</Modal.Title>
						</Modal.Header>
					  
						<Modal.Body>
							<div id="modalEditProfile" style={{'width':'500px'}}>
								<ul className="detailLists">
									<li><dt>User:</dt> &nbsp;&nbsp;<span id="username"></span></li>
									<li>
										<dt>Profile:</dt>
										<dd><input name="r1" type="radio" value="-1"/>Inherit from parent group <span id="parent_group_name"></span>:<span id="ploicy_name"></span></dd>
									</li>
									<li><dt style={{'visibility':'hidden'}}>Profile:</dt><input name="r1" type="radio" defaultValue="1"/>Specified: <select id="profile"></select></li>
								</ul>
							</div>
						</Modal.Body>
					  
						<Modal.Footer>
							<Button onClick={this.closeModalUserProfile}>Close</Button>
							<Button bsStyle="primary" onClick={this.saveModalUserProfile}>Save</Button>
						</Modal.Footer>
					  
					</Modal.Dialog>
				</Modal>
				
				{/*edit user*/}
				{this.state.modalEditUser && <EditUserModal showModal={this.state.modalEditUser} user_id={TREE_GROUP_ID} closeModal={this.closeModalEditUser} refreshUser={this.refreshTreeandUser}/>}
				
				
			</div>
		)
	}
}


class AlertUserModal extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = { 
		};    
		this.closeAlertUser = this.closeAlertUser.bind(this);
		this.searchGroup = this.searchGroup.bind(this);
	}
	
	componentDidMount(){
		$("#group_search_txt").focus();
		//if($.browser.msie){
			//if(parseInt(document.documentMode,10) == 9){
				//$("#panel").css("overflow-y", "scroll");
			//}
		//}
		$(".tmmsgbox .close_btn").bind("click", function(){
			$(this).parent().hide("slow",function(){$("#messageboxtipdetail").html('&nbsp;');});
		});
		
		
		trendFun.jsGetRequest('cfg/?page_size=1000000&group=email', function(response){
			$.each(response.results, function(i, e){
				if(e.name=="host" && e.value!=""){
					  EMAILHOST=true;
				}
			});
		}, function(response,status){});
		
		this.searchGroup();
		
		//$(".sendmail").live("click",function(){
			//var single_user=$(this).data("name");
			//if(single_user){
				//jsContinue('',false,single_user)
			//}
		//});
		$(document).on('click', '.sendmail', function(){
			var single_user=$(this).data("name");
			if(single_user){
				jsContinue('',false,single_user)
			}
		});
		//page events
  
		$("#ID_page_size6").change(function(){
		      $("#ID_page_index6").val('1');
		      this.searchGroup();
		}.bind(this));
		$("#ID_page_index6").keydown(function(e) {
					var tempCurrentPageIndex=parseInt($("#ID_page_index6").val(),10);
					if(!$.isNumeric(tempCurrentPageIndex)) tempCurrentPageIndex=1;
				       var key = e.which;
				       if (key == 13) {
					      if(isNaN($("#ID_page_index6").val())){
						      return;
					      }
					      if(parseInt(tempCurrentPageIndex,10)==parseInt($("#ID_page_index6").val(),10)){
						      return;
					      }else{
						      tempCurrentPageIndex=$("#ID_page_index6").val();
					      }
					      this.searchGroup();
				       }
		}.bind(this));
		
		$("#ID_first6").click(function(){
			      if(parseInt($("#ID_page_index6").val(),10)==1){
				      return;
			      }
			      $("#ID_page_index6").val('1');
			      this.searchGroup();
		}.bind(this));
		$("#ID_next6").click(function(){
			var ID_pagertotalpage=parseInt($("#ID_pagertotalpage6").text(),10);
			var nextpage=parseInt($("#ID_page_index6").val(),10);
			if(nextpage==ID_pagertotalpage){return;}
			nextpage=nextpage+1;
			if(nextpage>ID_pagertotalpage) nextpage=ID_pagertotalpage;
			$("#ID_page_index6").val(nextpage);
			this.searchGroup();
		}.bind(this));
		$("#ID_prev6").click(function(){
			      var prevpage=parseInt($("#ID_page_index6").val(),10);
			      if(prevpage==1){return;}
			      prevpage=prevpage-1;
			      if(prevpage<1) prevpage=1;
			      $("#ID_page_index6").val(prevpage);
			      this.searchGroup();
		}.bind(this));
		$("#ID_last6").click(function(){
			var ID_pagertotalpage=parseInt($("#ID_pagertotalpage6").text(),10);
			if(parseInt($("#ID_page_index6").val(),10)==ID_pagertotalpage){
				return;
			}
			$("#ID_page_index6").val(ID_pagertotalpage);
			this.searchGroup();
		}.bind(this));
		      
		$(".close").click(function(e) {
			$(this).parent().hide();
		});
		
		$("#groups_check_all").click(function(){
			var checkall = $(this).prop("checked");
			$("#row_container6 input:checkbox").prop("checked", checkall);
		});
		    
		$("#group_search_txt").bind('keyup', function(event){
			if (event.keyCode == '13') {
			    this.searchGroup();
			}
		}.bind(this));
	}
	
	sendEmail(is_all, single_user){
		if(EMAILHOST==false){
			alert("Unable to send email because the SMTP server settings are not configured. Configure the SMTP server settings in Administration > System Settings > Email Notifications and try again.");
			return;
		}
		var users = [];
		if(!single_user){
			$.each($("#row_container6 input[checked='checked']:checkbox"), function(i,e){
				users.push($(e).val());
			});
		}else{
			users.push(single_user);
		}
		if(!is_all){
			if (users.length == 0) {
				alert("Select at least one user from the search results to send mail.");
				return;
			}
		}
		var url='account/user/udstatalert-sendemail/';
		var request={
			"users":users,
			"is_all": is_all==1?true:false
		}
		trendFun.jsPostRequest(url, request, function(response){
			if(single_user){
			   $("#tm_alert_success").hide().show("slow");
			   return;
			}
			
			var message="All of selected users email sent successfully. ";
			$(window.parent.document).find("#messageboxtipdetail").text(message);
			$(window.parent.document).find("#messageBox").show("slow");
			if(id){
				parent.popupClose(id);
			}
		// parent.refreshTree();
		}, function(){
			alert("Unable to access server. Check your network connection and try again.");
		});
	}

	setGroupResultData(data, in_table) {
		if (in_table == null)
			data = '<tr><td colspan="5" style="text-align:center;padding:10px 0">'+data+'</td></tr>';
		$("#row_container6").empty().append(data);
	}
	searchGroup(){
		var page_size=parseInt($("#ID_page_size6").val(),10);
		if(isNaN(page_size)) page_size=20;
		var page_index=parseInt($("#ID_page_index6").val(),10);
		if(isNaN(page_index)||page_index==""||page_index==0){
			page_index=0;
		}else{
		    page_index=page_index-1;
		}
      
		this.setGroupResultData('<img src="../images/loading_32X32.gif">');
		var url='account/user/udstatalert-data/?p=' + $("#group_search_txt").val() + "&page_size=" + page_size + "&page=" + (page_index+1);
		trendFun.jsGetRequest(url, function(response){
			if (response) {
				      if(response.length==0){
					      alert("No entry matched your search. Type a new keyword and try again.");
					      this.setGroupResultData("No data to display.");
					      return false;
				      }
				      
			var html='';
				       $.each(response.data,function(i,e){
					      html+='<tr>';
					      html+='   <td class="checkBoxAll"><input type="checkbox" value="'+e.name+'" class="cbx"></td>';
					      html+='   <td>'+e.name+'</a></td>';
					      html+='   <td>'+e.email+'</td>';
					      html+='   <td>'+"Storage is a total of less than {0}%".replace('{0}',e.disk_free)+'</td>';
					      html+='   <td>'+"<a href='javascript:;' class='sendmail' data-name='"+ e.name +"'>"+"Send Email"+'</td>';
					      html+='</tr>';
				      });
			if (html == ""){
				this.setGroupResultData("No user is currently using more than 80% of the allocated storage capacity.");
			}else{
				this.setGroupResultData(html, true);
			}
				      // page event
				      var tempCurrentpage=page_index+1;
				      $("#ID_page_index6").val(tempCurrentpage); //input
				      var total_count=parseInt(response.count,10);
				      if(!$.isNumeric(total_count)){total_count=0;}
				      $("#ID_pagecount6").text(total_count);
				      
				      var tempstartLine = page_size*page_index + 1;
				      var temppageEndLine = page_size*(page_index + 1);
				      var tempendLine = temppageEndLine > total_count ? total_count : temppageEndLine;
				      if (tempstartLine > tempendLine) {
					      tempstartLine = tempendLine;
				      }
				      $("#ID_pagerstartcont6").text(tempstartLine);
				      $("#ID_pagerendcont6").text(tempendLine);
				      
				      if(total_count>page_size){
					      $("#ID_page_index6").removeAttr("disabled");
				      }else{
					      $("#ID_page_index6").attr("disabled","disabled");
				      }
				      //total pager_total_page
				      var pager_total_page = 1;
				      if (total_count % page_size > 0) {
					      pager_total_page = Math.floor(total_count/page_size) + 1;
				      } else {
					      pager_total_page = Math.ceil(total_count/page_size);
				      }
				      $("#ID_pagertotalpage6").text(pager_total_page);
				      
	      
				      if(tempCurrentpage>1 && tempCurrentpage<pager_total_page){
					      $("#ID_first6,#ID_prev6,#ID_last6,#ID_next6").removeClass("disabled");
				      }else if(tempCurrentpage==1 && tempCurrentpage != pager_total_page){
					      $("#ID_first6,#ID_prev6").addClass("disabled");
					      $("#ID_last6,#ID_next6").removeClass("disabled");
				      }else  if(tempCurrentpage!=1 && tempCurrentpage == pager_total_page){
					      $("#ID_first6,#ID_prev6").removeClass("disabled");
					      $("#ID_last6,#ID_next6").addClass("disabled");
				      }else if(tempCurrentpage==1 && 1 == pager_total_page){
					      $("#ID_first6,#ID_prev6,#ID_last6,#ID_next6").addClass("disabled");
				      }
				      
					     
		  }
	      }.bind(this),
	      function(error){
		  this.setGroupResultData("No data to display.");
	      }.bind(this)
	  );
	}
	handlePageId(event){
		event.target.val(event.target.value.replace(/\D/g,''));
  	}
	closeAlertUser(){
		this.props.closeModal();	
	}
	
	render(){
		return (
			<Modal show={this.props.showModal} onHide={this.closeAlertUser} backdrop={true}>
				<Modal.Dialog dialogClassName="modal-alertuser">
					<Modal.Header closeButton>
						<Modal.Title>Users with Low Storage</Modal.Title>
					</Modal.Header>
				  
					<Modal.Body style={{"padding":"0px"}}>
						<div id="modalAlertUser">
							<div className="tm-alert tm-alert-success displaynone" id="tm_alert_success">
								<button type="button" className="close" data-dismiss="alert">x</button>
								Email sent successfully.
							</div>
							<div className="tmmsgbox info2013">
								<span className="close_btn" data-flag="info"></span>
								<span className="msgcontent2013">
								<span className="text_span">Send an alert email to user when the user storage is 80% full.</span>                    
								</span>
							</div>          
							<table className="tmGrid" style={{'width':'100%'}}>
								<thead>
									<tr className="sizing_row">
										<th className="col_1"></th>
										<th className="col_2"></th>
										<th className="col_3"></th>
										<th className="col_4"></th>
										<th className="col_5"></th>
									</tr>
									<tr className="behavior_button">
										<th colSpan="5" style={{'paddingBottom':'5px'}}>
										    <ul className="button_group">
											<li className="item_list">
											    <input type="text" style={{'width':'300px'}} id="group_search_txt" name="group_search_txt" />
											    <input type="button" defaultValue="Search" onClick={this.searchGroup}/>
											    <img title="Type a user name (last name or first name or full name) to search." src="../images/icon_info_s.png" className="lstooltip"/>
											</li>
											
										     </ul>                                                                   
										 </th>
									</tr>
									
									<tr className="header_title">
										<th className="checkBoxAll"><input type="checkbox" id="groups_check_all" className="check_all_checkbox"/></th>
										<th><div className="column_title">User Name</div></th>
										<th><div className="column_title">Email</div></th>
										<th><div className="column_title">Description</div></th>
										<th><div className="column_title">Action</div></th>
									</tr>
								</thead>
								<tbody className="row_container" id="row_container6">
								</tbody>
								<tfoot>
									<tr>
										<td colSpan="5">
										    <ul className="pagination">
											<li className="records">Records: <dt className="pager_start_cont" id="ID_pagerstartcont6">1</dt>&nbsp;-&nbsp;<dt className="pager_end_cont" id="ID_pagerendcont6"></dt> / <dt className="pager_total_cont" id="ID_pagecount6"></dt> </li>
											<li className="btn btn_first disabled" id="ID_first6"></li>
											<li className="btn btn_prev disabled" id="ID_prev6"></li>
											<li className="pageInput">Page&nbsp;&nbsp;
												<input name="page_index" type="text" disabled className="pager_current_page" id="ID_page_index6" onKeyUp={this.handlePageId.bind(this)} onPaste={this.handlePageId.bind(this)} />&nbsp;&nbsp;/ 
												<dt className="pager_total_page" id="ID_pagertotalpage6">1</dt>
											</li>
											<li className="btn btn_next disabled" id="ID_next6"></li>
											<li className="btn btn_last disabled" id="ID_last6"></li>
											<li className="per_page">
												Query size: &nbsp;
												<select name="page_size" id="ID_page_size6" defaultValue="30">
													<option value="10">10</option>
													<option value="20">20</option>
													<option value="30">30</option>
												</select>
											</li>
										    </ul>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</Modal.Body>
				  
					<Modal.Footer>
						<Button bsStyle="primary" onClick={this.sendEmail.bind(this, 0)}>Send to Selected</Button>
						<Button onClick={this.closeAlertUser}>Close</Button>
						<Button bsStyle="primary" onClick={this.sendEmail.bind(this, 1)}>Send to All</Button>
					</Modal.Footer>
				  
				</Modal.Dialog>
			</Modal>
		
		)
	}
}

var RESONSEDATE = {};
class ImportGroupModal extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = { 
		};    
		this.closeImportGroup = this.closeImportGroup.bind(this);
	}
	
	componentDidMount(){
		$("#groups_check_all").click(function(){
			var checkall = $(this).prop("checked");
			$("#row_container7 input:checkbox").prop("checked", checkall);
		});
		    
		$("#group_search_txt").bind('keyup', function(event){
			if (event.keyCode == '13') {
			    this.searchGroup();
			}
		}.bind(this));
		
		$("#group_search_txt").focus();
		//if($.browser.msie){
			//if(parseInt(document.documentMode,10) == 9){
				//$("#panel").css("overflow-y", "scroll");
			//}
		//}
		
		trendFun.jsGetRequest('cfg/?page_size=1000000&group=email', function(response){
			$.each(response.results, function(i, e){
				if(e.name=="host" && e.value!=""){
					  EMAILHOST=true;
				}
			});
		}, function(response,status){});
		
		trendFun.jsGetRequest('system/site_list/', function(response){
			  var html='';
			  $.each(response.results,function(i,e){
				html += '<option value="' + e.id + '">'+e.name+'</option>';
			  });
			  $("#site").append(html);
		});
		  //sort
		  
	
		function sortByKey(array, key,SORT_ORDER_BY) {
			return array.sort(function(a, b) {
				if(key=='cn'){
					if(typeof(a['cn'])=='undefined'){
						if(typeof(b['cn'])=='undefined'){
							 var x = a['ou'][0]; var y = b['ou'][0];
						}else{
							  var x = a['ou'][0]; var y = b['cn'][0];
						}
					}else{
						if(typeof(b['cn'])=='undefined'){
							 var x = a['cn'][0]; var y = b['ou'][0];
						}else{
							  var x = a['cn'][0]; var y = b['cn'][0];
						}
						
					}
					//var x = a[key][0]; var y = b[key][0];
				
				}else{
					var x = a[key]; var y = b[key];
				}
				if(SORT_ORDER_BY=='ASC'){
				   return ((x < y) ? -1 : ((x > y) ? 1 : 0));	
				}else if(SORT_ORDER_BY=='DESC'){
					return ((x < y) ? 1 : ((x > y) ? -1 : 0));	
				}
			});
		}
		  
		$("#sort_title_list7 .sort").click( function(e){
			var that=$(this);
			var ordertype=parseInt(that.attr("data-ordertype"),10);
			SORT_ORDER_FIELD=ordertype;
			var orderby='';
			if(that.hasClass("sort_desc")){		
				SORT_ORDER_BY='ASC';							
				that.removeClass("sort_desc").addClass("sort_asc");
			}else{
				SORT_ORDER_BY='DESC';	
				that.removeClass("sort_asc").addClass("sort_desc");
			}
			$("#sort_title_list7 th[data-ordertype!='"+ordertype+"']").removeClass("sort_asc").removeClass("sort_desc");
			
			//1 name 2 type, 3 dn 3 status
			var FLIST=[];
			FLIST[1]='cn';
			FLIST[2]='type';
			FLIST[3]='dn';
			FLIST[4]='is_in_db';
			//console.log(FLIST[ordertype]);
			RESONSEDATE = sortByKey(RESONSEDATE, FLIST[ordertype],SORT_ORDER_BY);
			this.parseHtml(RESONSEDATE);
			//console.log(RESONSEDATE);
			// to do
		 
		}.bind(this));
	}
	
	closeImportGroup(){
		this.props.closeModal();	
	}
	
	importGroup(mailflag){
		var request = [];
		$.each($("#row_container7 input[type=checkbox]:checked"), function(i,e){
			var group = {};
			group["name"] = $(e).attr("data-cn");
			group["dn"] = $(e).attr("data-dn");
			group["type"] = $(e).attr("data-type");
			request.push(group);
		});
	    
		if (request.length == 0) {
			alert("Select at least one group from the search results to import.");
			return;
		}
		var site_id=$("#site").val();
		var url='account/import-groups/?site_id='+site_id;
		if(mailflag==1){
			url='account/import-groups/?mail=1&site_id='+site_id; // send mail
			if(EMAILHOST==false){
				alert("Unable to send email because the SMTP server settings are not configured. Configure the SMTP server settings in Administration > System Settings > Email Notifications and try again.");
				return;
			}
		}
	    
		trendFun.jsPostRequest(url, request, function(response){
			var message="{0} out of {1} users or groups imported successfully. ".replace("{0}",response.detail.success).replace("{1}",response.detail.total);
			$(window.parent.document).find("#messageboxtipdetail").text(message);
			$(window.parent.document).find("#messageBox").show("slow");
			//parent.popupClose(id);
			//parent.refreshTree();
			//parent.check_seatstatus();
			
			this.props.closeModal();
			this.props.refreshTree();
			this.props.checkSeatStatus();
		}.bind(this), function(){
			alert("Unable to access server. Check your network connection and try again.");
		});
	}
	searchGroup(){
		if($("#group_search_txt").val()==""){
			alert("Invalid Group name. Type a group name in the search field and try again.");
			$("#group_search_txt").focus();
			return;
		}
		this.setGroupResultData('<img src="../images/loading_32X32.gif">');
		var type = 3;
		var url='account/ldap/groupou/?key=' + $("#group_search_txt").val() + "&size=" + $("#page_size7").val() + "&type=" + type;
		trendFun.jsGetRequest(url, function(response){
			if (response) {
				if(response.length>100){
					alert("More than 100 entries found. Refine your search by typing a longer keyword.");
					return false;
				}
				if(response.length==0){
					alert("No entry matched your search. Type a new keyword and try again.");
					this.setGroupResultData("No data to display.");
					return false;
				}
				RESONSEDATE=response;
				this.parseHtml(RESONSEDATE);
			}
		}.bind(this),
		function(error){
			this.setGroupResultData("Failed to connect to the LDAP server. Please check your configuration and verify that the LDAP server is running."); 
		}
	    );
	}
	parseHtml(response){
                var str = "";
                for (var i in response) {
                    var name, type, checkbox_txt = "", status="Imported";
                    if (response[i]["ou"] != null) {
                        name = response[i]['ou'][0];
                        //type = "Organizational Unit";
                    }else if (response[i]['cn'] != null) {
                        name = response[i]['cn'][0];
                       // type = "Group";
                    }
					if (response[i]["type"]=="group"){
						type = "Group";
					}else if (response[i]["type"]=="ou"){
						type = "Organizational Unit";
					}else if (response[i]["type"]=="person"){
						type = "User";
					}
					
                    if (response[i]['is_in_db'] == null || !response[i]['is_in_db']) {
                        checkbox_txt = '<input type="checkbox" class="check_all_checkbox" data-dn="'+response[i]['dn']+'" data-type="'+response[i]["type"]+'" data-cn="'+name+'" />';
                        status = "Not Imported";
                    }
                    str += '<tr><td class="checkBoxAll">' + checkbox_txt + '</td><td class="tmAlignLeft" title="'+name+'">'+name+'</td><td class="tmAlignLeft">'+type+'</td><td class="tmAlignLeft" title="'+response[i]['dn']+'">'+response[i]['dn']+'</td><td class="tmAlignLeft">'+status+'</td></tr>';
                }
                if (str == ""){
                    this.setGroupResultData("No groups found by the search filter.");
		}else{
                    this.setGroupResultData(str, true);       
                }
	
	}
	setGroupResultData(data, in_table) {
		if (in_table == null)
			data = '<tr><td colspan="5" style="text-align:center;padding:10px 0">'+data+'</td></tr>';
		$("#row_container7").empty().append(data);
	}
	
	render(){
		return(
			<Modal show={this.props.showModal} onHide={this.closeImportGroup}>
				<Modal.Dialog dialogClassName="modal-importgroup">
					<Modal.Header closeButton>
						<Modal.Title>Import Group or User from LDAP</Modal.Title>
					</Modal.Header>
				  
					<Modal.Body style={{"padding":"0px"}}>
						<div id="modalImportGroup">        
							<table className="tmGrid" style={{"width":"100%"}}>
							    <thead>
								<tr className="sizing_row">
								    <th className="col_1"></th>
								    <th className="col_2"></th>
								    <th className="col_3"></th>
								    <th className="col_4"></th>
								    <th className="col_5"></th>
								</tr>
								<tr className="behavior_button">
								    <th colSpan="5" style={{"paddingBottom":"5px"}}>
									<ul className="button_group">
									    <li className="item_list">
										<input type="text" style={{"width":"300px"}} id="group_search_txt" name="group_search_txt" />
										<input type="button" value="Search" onClick={this.searchGroup.bind(this)}/>
										<img title="Type a group name or user name (last name or first name or full name) to search." src="../images/icon_info_s.png" className="lstooltip"/>
									    </li>
									    
									 </ul>                                                                   
								     </th>
								</tr>
								<tr className="behavior_button">
								    <th colSpan="5" style={{"paddingBottom":"5px", "textAlign":"left", "paddingLeft":"2px"}}>
									   <span>Selected groups or users will be imported to site:</span> <select id="site"></select>
								     </th>
								</tr>
								
								<tr className="header_title" id="sort_title_list7">
								    <th className="checkBoxAll"><input type="checkbox" id="groups_check_all" className="check_all_checkbox"/></th>
								    <th className="sort" data-ordertype="1"><div className="column_title">Name</div></th>
								    <th className="sort" data-ordertype="2"><div className="column_title">Type</div></th>
								    <th className="sort" data-ordertype="3"><div className="column_title">Distinguished Name</div></th>
								    <th className="sort" data-ordertype="4"><div className="column_title">Status</div></th>
								</tr>
							    </thead>
							    <tbody className="row_container" id="row_container7">
							    </tbody>                            
							    <tfoot style={{"display":"none"}}>
								<tr>
								    <td colSpan="5">
									<ul className="pagination">                                   
									    <li className="per_page">
										Query size: &nbsp;
										<select defaultValue="30" name="page_size" id="page_size7">
											<option value="10">10</option>
											<option value="20">20</option>
											<option value="30">30</option>
										</select>
									    </li>
									</ul>
								    </td>
								</tr>
							    </tfoot>
							</table>              
						</div>
					</Modal.Body>
				  
					<Modal.Footer>
						<Button bsStyle="primary" onClick={this.importGroup.bind(this, 1)}>Import & Send Invitation</Button>
						<Button onClick={this.closeImportGroup}>Close</Button>
						<Button bsStyle="primary" onClick={this.importGroup.bind(this, 0)}>Import</Button>
					</Modal.Footer>
				  
				</Modal.Dialog>
			</Modal>
		
		)
	}
}
	
export default class UserIndex extends React.Component {
	constructor(props, context) {
	super(props);
	this.state = { 
	      userview: false,
	      ldap: false,
	      treegroupid: TOP_GROUP_ID,
	      modalAlertUser: false,
	      modalImportGroup: false,
	};    
	this.context = context;
	this.refreshData = this.refreshData.bind(this);
	
	this.openAlertUser = this.openAlertUser.bind(this);
	this.closeModalAlertUser = this.closeModalAlertUser.bind(this);
	
	this.openImportGroup = this.openImportGroup.bind(this);
	this.closeModalImportGroup = this.closeModalImportGroup.bind(this);
  }
  
	
  componentDidMount() {
	var length;
	var initclosed;
	if(document.body.clientWidth > 1024){
		length = 200;
		initclosed = false;
	} else{
		length = $("#webConsole").width();
		initclosed = true;
	}
	
      var userlayout = $("#webConsole").layout({
		  west__paneSelector: ".ui-layout-west",
			togglerContent_open:"<img src='../images/toggle-lt.gif'>", 
    		togglerContent_closed:"<img>",
		  spacing_open: 5,
		  spacing_close: 5,
		  fxName: "none",
		  west__size: length,
		  initClosed: initclosed
      });
	  $(window).resize(function() {
			if(document.getElementById("webConsole") != null){
				if(document.body.clientWidth > 1024){
					length = 200;
					initclosed = false;
					if($("#id-div-tree").is(":visible") == false)
						userlayout.toggle("west");
				} else{
					length = $("#webConsole").width();
					initclosed = true;
					if($("#id-div-tree").is(":visible"))
						userlayout.toggle("west");
				}
				userlayout.sizePane("west", length);
				
			}
	  });
      $('.ui-layout-resizer').css("z-index", 0);
      
      //$("#backBtn, #ImportGroupButton,#ExprotGroupButton, #button_addgroup, #button_adduser, #button_importfile, #button_edit_user, #button_delete_user, #ResendInvitation,#ResendInvitations, #button_delete_users, #reset_password_item").hide();
	trendFun.jsGetRequest('cfg/ldap/check/', function(response){
		$("#loading").hide();
		if (response.detail) {
			//ENABLED_LDAP = true;
			//$("#ImportGroupButton,#ExprotGroupButton,#ExprotGroupButton").show();
			this.setState({ldap:true});
		}else{
			//$("#button_addgroup, #button_adduser, #button_importfile, #reset_password_item").show();
		}
	}.bind(this),function(response,status){
		$("#loading").hide();
		alert("Unable to access server. Check your network connection and try again.");
		return;
	});
	
	this.check_seatstatus();
	
	var zNodes ={
				id:TOP_GROUP_ID,
				name:"Root",
				open:true,
				isParent:true, 
				iconSkin:"pIcon01",
				children:[]
	};
	var intervalTimer = null; 
	var setting = {
		async: {
			enable: true,
			url:TMMS_WEB_ROOT+"account/tree/",
			autoParam:["id","name=n", "level=lv","tId"],
			otherParam: {"t":Math.round(Math.random()*47842)},
			dataFilter: filter,
			datatype:'json',
			type:"GET",
			contentType: "application/json"
		},
		callback: {
			onClick: function(event, treeId, treeNode,clickFlag){
				 clearTimeout(intervalTimer);
        		 intervalTimer = setTimeout(function() {
					  TREE_GROUP_ID=treeNode.id;
					  TREE_GROUP_NAME=treeNode.name;
					  IS_GROUP=treeNode.isParent;
					  
					  QUERY_KEY = '';
					  $("#searchkeyword").val(QUERY_KEY_HINT);
					  $("#ID_page_index").val('1');
					  this.refreshData();
					 //alert(treeNode.tId+'--'+treeNode.id + ", " + treeNode.name+'|'+treeId+'--'+ treeNode+'--'+clickFlag);
					}.bind(this), 500);
			}.bind(this),
			beforeClick: beforeClick,
			onAsyncError: onAsyncError,
			onDblClick:onDbClickFunction,
			onAsyncSuccess: onAsyncSuccess
		}
	
	};
	function onDbClickFunction(){
		clearTimeout(intervalTimer); 
	}
	function beforeClick(treeId, treeNode) {
	}
	function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
		//alert("[ "+(new Date).getTime()+" onAsyncError ]&nbsp;&nbsp;&nbsp;&nbsp;" + ((!!treeNode && !!treeNode.name) ? treeNode.name : "root") );
	}
	function onAsyncSuccess(event, treeId, treeNode, msg) {
		//alert("refresh ritht table.");
		//alert("[ "+msg+':'+(new Date).getTime()+" onAsyncSuccess ]&nbsp;&nbsp;&nbsp;&nbsp;" + ((!!treeNode && !!treeNode.name) ? treeNode.name : "root") );
	}
	function filter(treeId, parentNode, childNodes) {
		if (!childNodes) return null;
		for (var i=0, l=childNodes.length; i<l; i++) {
			childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
			if(childNodes[i].isParent){
				childNodes[i].iconSkin="pIcon01";
			}else{
				childNodes[i].iconSkin="icon01";
			}
		}
		return childNodes;
	}
	
	    
	trendFun.jsGetRequest('account/tree/?id='+TOP_GROUP_ID, function(response){
		for (var i=0, l=response.length; i<l; i++) {
			response[i].name = response[i].name.replace(/\.n/g, '.');
			if(response[i].isParent){
				response[i].iconSkin="pIcon01";
			}else{
				response[i].iconSkin="icon01";
			}
		}
	    zNodes.children=response;
		$.fn.zTree.init($("#treeView"), setting, zNodes);
		//this.refreshData().bind(this);
	}.bind(this));
	
	//disable or enable button
	if(this.state.userview==false){
	      //$("#ID_check_all").attr("checked",false);
	      
	      $("#button_enable_users").addClass("button_disabled").unbind("click",this.enable_users);
	      $("#button_disable_users").addClass("button_disabled").unbind("click",this.disable_users);
	      $("#button_delete_users").addClass("button_disabled").unbind("click",this.delete_users);
	      $("#ResendInvitations").addClass("button_disabled").unbind("click",this.ResendInvitation);
	}
	
	function getIconZone(target) {	
		var position = target.offset();
		var width = target.width();
		var iconZone = position.left + width + 23 - 20;
		return iconZone;
	}

		$(".tmGrid .searchBox")
		    .unbind(".tmGrid")
		    .bind({	
			"keyup.tmGrid": function(e){
			    if(e.keyCode == 13){
					//var that= $(this);
					var that = $("#searchkeyword");
					if(that.val()==""){
						that.val(QUERY_KEY_HINT);
					}
					that.removeClass("active");
					QUERY_KEY=$.trim($("#searchkeyword").val());
					if(QUERY_KEY==QUERY_KEY_HINT){
						QUERY_KEY = '';
					}
					$("#ID_page_index").val('1');
					this.refs.getGroupSummary.ID_getRead();
					$("#searchkeyword").blur();
			    }
			}.bind(this),
			"click.tmGrid": function(e){
			    var that= $(this);
			    var iconZone = getIconZone(that);												
			    if (e.pageX > iconZone) {							
				if(that.is(".active")){
							    that.val(QUERY_KEY_HINT).removeClass("active").trigger("blur.tmGrid");
				}else{
				    that.trigger("blur.tmGrid");
							    if(that.val()==""){
								    that.val(QUERY_KEY_HINT);
							    }
				}																
			    }else {						
						    if(that.val()==QUERY_KEY_HINT){
				    that.val("");
				}
				that.addClass("active");							
			    }						
			},					
			"mousemove.tmGrid": function(e){
			    var that= $(this);
			    var iconZone = getIconZone(that);						
			    if (e.pageX > iconZone) {
				that.addClass("clickable");
			    }else {
				that.removeClass("clickable");
			    }
			},
			"mouseout.tmGrid": function(){
			    $(this).removeClass("clickable");
			},
			"blur.tmGrid": function(e){
				var that= $(this);
				that.removeClass("active");
				if(that.val()==""){
				that.val(QUERY_KEY_HINT);
				}
			}
		});
		
		$("#breadcrumb_root").click(function(){
			IS_GROUP = true;
			TREE_GROUP_ID = 1;
			this.setState({userview:!IS_GROUP, treegroupid:TREE_GROUP_ID});	
		});
  }
  
  check_seatstatus() {
	trendFun.jsGetRequest('account/check_seatstatus/', function(response){
		  if(response.reminder){
			  $(".warning").removeClass("displaynone");
		  }
	});
  }
  
  ResendInvitation() {
		   if(ENABLED_LDAP){
			   if (!confirm("Virtual Mobile Infrastructure will send a new invitation email to the selected users.\n\nDo you want to continue?")) {
				   return;
			   }
		   }else{
			   if (!confirm("Sending a new invitation email will reset the user passwords for the selected users and will send the new passwords in the invitation email. \n\nDo you want to continue?")) {
				   return;
			   }
		   }
			trendFun.jsGetRequest('cfg/?page_size=1000000&group=email', function(response){
		  		var emilhost=false;
				$.each(response.results, function(i, e){
					if(e.name=="host" && e.value!=""){
						emilhost=true;
						trendFun.jsPostRequest('account/user/batch/', this.getReqestData('resend-invitation'), function(response){
							$("#messageboxtipdetail").text("The invitation email is sent to the selected users.");
							$("#messageBox").hide().show("slow");
							//$("#ID_check_all").attr("checked",false);
							this.ID_clickcheckbox();
						}.bind(this), function(response,status){
							alert("Unable to access server. Check your network connection and try again.");
						});
					}
			  	}.bind(this));
				if(emilhost==false){
					alert("Unable to send email because the SMTP server settings are not configured. Configure the SMTP server settings in Administration > System Settings > Email Notifications and try again.");
				}
			}.bind(this), function(response,status){
					alert("Unable to access server. Check your network connection and try again.");
			});
						
						
   }
   
   ID_clickcheckbox() {
	  	var checkboxes = this.refs.getGroupSummary.state.checkAll ? $("#ID_row_container input[type=checkbox]") : $("#ID_row_container input[type=checkbox]:checked");
	  	var enables = 0;
	  	var disables = 0;
		//if(this.refs.getGroupSummary.state.checkAll)
			//checkboxes = $("#ID_row_container input[type=checkbox]");
		//else
			//checkboxes = $("#ID_row_container input[type=checkbox]:checked");
	  	
	  	$.each(checkboxes, function(i,e){
	  		var active = $("#ID_tr_checkbox_"+e.value).attr('data-active');
	  		if (active == "0") {
	  			disables = disables + 1;
	  		}
	  		else {
	  			enables = enables + 1;
	  		}
		});
		
		//$.each(this.refs.getGroupSummary.state.checkboxStatus, function(i, e){
		//})
		
		this.updateButton(enables+disables, "#button_delete_users", this.delete_users.bind(this));
		this.updateButton(enables, "#button_disable_users", this.disable_users.bind(this));
		this.updateButton(disables, "#button_enable_users", this.enable_users.bind(this));
		this.updateButton(enables+disables, "#ResendInvitations", this.ResendInvitation.bind(this));
  }
  
  updateButton(count, button, func) {
	  	if (count > 0) {
	  		 $(button).removeClass("button_disabled").unbind("click", func);
	  		 $(button).removeClass("button_disabled").bind("click", func);
	  	}
	  	else {
			$(button).addClass("button_disabled").unbind("click", func);
	  	}
  }
  
	enable_users() {
  		trendFun.jsPostRequest('account/user/batch/', this.getReqestData('enable'), function(response){
			$("#messageboxtipdetail").text("The selected users have been enabled.");
			$("#messageBox").show("slow");
			$.each($("#ID_row_container input[type=checkbox]:checked"),function(i,e){
				$("#status_"+e.value).html('<img width="20" src="../images/user_status_offline.png" title="Offline"/>')
				$("#ID_tr_checkbox_"+e.value).attr('data-active', "1");
			});
			this.ID_clickcheckbox();
			
		}.bind(this), function(response,status) {
			if(status==400){
				if(response.code&&response.code==4039){
					alert("Cannot enable user.  The current number of users has reached the maximum number of licensed seats. Please contact your sales representative to add more seats to your license.");
				}else{
					alert("Unable to access server. Check your network connection and try again.");
				}
			}else{
				alert("Unable to access server. Check your network connection and try again.");
			}
		});
	};
	
	disable_users() {
	      if(confirm("Disabling users will forbid them from using cloud and local workspaces on the Virtual Mobile Infrastructure. \n\nDo you want to disable the selected users?")){
	      trendFun.jsPostRequest('account/user/batch/', this.getReqestData('disable'), function(response){
		      $("#messageboxtipdetail").text("The selected users have been disabled.");
		      $("#messageBox").show("slow");
		      $.each($("#ID_row_container input[type=checkbox]:checked"),function(i,e){
			      $("#status_"+e.value).html('<img width="20" src="../images/user_status_disable.png" title="Disable"/>')
			      $("#ID_tr_checkbox_"+e.value).attr('data-active', "0");
		      });
		      this.ID_clickcheckbox();
		      
	      }.bind(this), function(response){
		      alert("Unable to access server. Check your network connection and try again.");
	      });
	      }
	};
	delete_users() {
	      if(confirm("Do you want to delete the selected users?")){	
		trendFun.jsPostRequest('account/user/batch/', this.getReqestData('delete'), function(response){
			$("#messageboxtipdetail").text("The selected users have been deleted.");
			$("#messageBox").show("slow");
			var delnumtemp=0;
			$.each($("#ID_row_container input[type=checkbox]:checked"),function(i,e){
				$(this).parent().parent().remove();
				delnumtemp++;
			});
			//$("#ID_check_all").attr("checked",false);
			$("#ID_pagecount").text(parseInt($("#ID_pagecount").text())-delnumtemp);
			$("#ID_pagerendcont").text(parseInt($("#ID_pagerendcont").text())-delnumtemp);
			this.ID_clickcheckbox();
			//refreshUser();
			this.initGroup();
		}.bind(this), function(response){
			alert("Unable to access server. Check your network connection and try again.");
		});
	      }
	};
	
	getReqestData(action) {
		var tempActionId=$("#ID_row_container input[type=checkbox][class='cbx']:checked");
		var ids = []
		$.each(tempActionId,function(i,e){
			ids.push(parseInt(e.value, 10));
		});
		var request = {
			"action": action,
			"ids": ids
		}
		return request;
	}
	    

	handlePageId(event){
	    event.target.val(event.target.value.replace(/\D/g,''));
	}
	
	refreshAll(){
	      this.refreshNode();
	}
	refreshData() {
		this.setState({userview:!IS_GROUP, treegroupid:TREE_GROUP_ID});
		if(IS_GROUP == true)	      
			this.refs.getGroupSummary.initGroup();
		else
			this.refs.getUserSummary.initUser();
	}
	
	
	refreshNode(){
	      this.refreshData();
		      var zTree = $.fn.zTree.getZTreeObj("treeView");
		      var nodes = zTree.getSelectedNodes();
		      if (nodes.length == 0) {
			      var nodes = zTree.getNodes();
			      if (nodes.length>0) {
				      zTree.selectNode(nodes[0]); //select root nodes
			      } else{
				      //alert("please select a node to refresh.");
				      return;
			      }
		      }
		      var silent=false;
		      for (var i=0, l=nodes.length; i<l; i++) {
			      zTree.reAsyncChildNodes(nodes[i], "refresh", silent);
			      if (!silent) zTree.selectNode(nodes[i]);
		      }
	}
	refreshRootNode(){
		TREE_GROUP_ID = TOP_GROUP_ID;
		IS_GROUP = true
						  
		var zTree = $.fn.zTree.getZTreeObj("treeView");
		var nodes = zTree.getNodes();
		if (nodes.length > 0) {
			zTree.selectNode(nodes[0]); //select root nodes
		}
		this.refreshNode();
	}
      
	checkUser(id, username){
	      this.setState({userview:1, treegroupid:TREE_GROUP_ID});
	}
	
	editUser(){
		this.refs.getUserSummary.openEditUser();
	}
	
	createGroup(){
	      this.refs.getGroupSummary.openCreateGroup();
	}
	
	createUser(){
	      this.refs.getGroupSummary.openCreateUser();
	}
	
	importFile(){
	      this.refs.getGroupSummary.openImportFile();
	}

	openAlertUser(){
		//$('#vmiModal_edit_user_profile').modal('show');
		this.setState({modalAlertUser:true});
	}
	closeModalAlertUser(){
		this.setState({modalAlertUser:false});
	}
	
	deleteUser(){
		if (!confirm("Do you want to delete the user \"{0}\"?".replace("{0}",TREE_GROUP_NAME))) {
			return;
		}
	   
		trendFun.jsDelRequest('account/user/'+TREE_GROUP_ID+'/', function(response) {
				$("#ID_page_index").val('1');
				this.refreshRootNode();
			}.bind(this), function() {
				alert("Unable to access server. Check your network connection and try again.");
		});
	}
	deleteGroup(){
		if (!confirm("Do you want to delete the group \"{0}\"?".replace("{0}",TREE_GROUP_NAME))) {
			return;
		}
	   
		trendFun.jsDelRequest('account/group/'+TREE_GROUP_ID+'/', function(response) {
				$("#ID_page_index").val('1');
				this.refreshRootNode();
			}.bind(this), function(response) {
				if(response.code && response.code==4015){
					alert("It is importing user data, Do not allow delete user or group.");
				}else{
					alert("Unable to access server. Check your network connection and try again.");
				}
		});
	}
	
	exportGroup(){
		var group_id=[];
		var ids=[];
		if(IS_GROUP){
			var checkboxes = $("#ID_row_container input[type=checkbox]:checked");
			$.each(checkboxes, function(i,e){
				ids.push(parseInt(e.value));
			});
			if(ids.length==0){
				group_id.push(TREE_GROUP_ID);
			}
		}else{
			ids.push(TREE_GROUP_ID);
		}
		trendFun.jsPostRequest('account/export/', {"ids":ids,"group_id":group_id}, function(response){
			location.href="../../users/"+response.filename;
		})	
	}
	
	openImportGroup(){
		this.setState({modalImportGroup:true});
	}
	closeModalImportGroup(){
		this.setState({modalImportGroup:false});
	}
	
  
  render () {
    //const myModalID=this.state.myModal;
    //ReactDOM.render(<Modal modalName={myModalID} closeModal={this._closeModal.bind(this)} saveBtn={this._saveBtn.bind(this)} />, document.getElementById('moday_div'));
    

    
    return (
    <div className="panel panel-default">
	  <div className="messageBox tmmsgbox2 warning displaynone">
                <span className="close_btn"></span>
                <span className="msgcontent2">
                    <span className="text_span" id="warning">Unable to add users because the number of users has reached the maximum number of seats available under your license. Contact your sales representative to add more seats for your license and try again.</span>
                </span>
            </div>  
          <div className="messageBox tmmsgbox info displaynone" id="messageBox">
            <div className="close_btn"></div>
            <div className="msgcontent">
              <p className="normaltext14">Success</p>
              <p className="normaltext" id="messageboxtipdetail" style={{'marginTop':'10px'}}>&nbsp;</p>
            </div>
          </div>
          <div id="loading"><img src="../images/loading_16X16.gif" /></div>
	  
          <div className="panel-heading">
                  <table className="tmGrid" style={{'border':'none'}}>
                        <thead>
                             <tr className="behavior_button">
                               <th> 
                                 <ul className="button_group">
                                    { !this.state.userview && this.state.ldap && <div className="visible-lg items-block"><button className="btn btn-default super_admin_del g_moniter_admin moniter_admin_del" id="ImportGroupButton" onClick={this.openImportGroup.bind(this)} type="button"> <span className="fa fa-users">{"Import Users"}</span></button></div> }
                                    { !this.state.userview && !this.state.ldap && <div className="visible-lg items-block"><button className="btn btn-default super_admin_del g_moniter_admin moniter_admin_del" id="button_addgroup" onClick={this.createGroup.bind(this)} type="button"> <span className="fa fa-plus-square">{"Add Group"}</span></button></div> }
                                    { !this.state.userview && !this.state.ldap && <div className="visible-lg items-block"><button className="btn btn-default super_admin_del g_moniter_admin moniter_admin_del" id="button_adduser" onClick={this.createUser.bind(this)} type="button"> <span className="fa fa-plus-user-plus">{"Add User"}</span></button></div> }
                                    { !this.state.userview && !this.state.ldap && <div className="visible-lg items-block"><button className="btn btn-default super_admin_del g_moniter_admin moniter_admin_del" id="button_importfile" onClick={this.importFile.bind(this)} type="button"> <span className="fa fa-users">{"Import Users"}</span></button></div> }
                                   
                                    { this.state.userview && !this.state.ldap && <div className="visible-lg items-block"><button className="btn btn-default g_moniter_admin moniter_admin_del" onClick={this.editUser.bind(this)} id="button_edit_user" type="button"> <span className="fa fa-edit">{"Edit User"}</span></button></div> }
                                    { !this.state.userview && <div className="items-block"><button className="btn btn-default g_moniter_admin moniter_admin_del" id="button_enable_users" type="button"> <span className="fa fa-check-circle-o">{"Enable Users"}</span></button></div> }
                                    { !this.state.userview && <div className="items-block"><button className="btn btn-default g_moniter_admin moniter_admin_del" id="button_disable_users" type="button"> <span className="fa fa-minus-circle">{"Disable Users"}</span></button></div> }
                                    { !this.state.userview && !this.state.ldap && <div className="visible-lg items-block"><button className="btn btn-default super_admin_del g_moniter_admin moniter_admin_del" id="button_delete_users" type="button"> <span className="fa fa-trash">{"Delete User"}</span></button></div> }
                                    { this.state.userview && <div className="visible-lg items-block"><button className="btn btn-default super_admin_del g_moniter_admin moniter_admin_del" onClick={this.deleteUser.bind(this)} id="button_delete_user" type="button"> <span className="fa fa-trash">{"Delete User"}</span></button></div> }
                                    { !this.state.userview && <div className="visible-lg items-block"><button className="btn btn-default super_admin_del g_moniter_admin moniter_admin_del" onClick={this.deleteGroup.bind(this)} id="button_delete_group" type="button"> <span className="fa fa-trash">{"Delete Group"}</span></button></div> }
                                    { !this.state.userview && <div className="visible-lg items-block"><button className="btn btn-default g_moniter_admin moniter_admin_del" id="ResendInvitations" type="button"> <span className="fa fa-envelope-o">{"Resend Invitation"}</span></button></div> }
                                    { this.state.userview && <div className="visible-lg items-block"><button className="btn btn-default g_moniter_admin moniter_admin_del" id="ResendInvitation" onClick={this.ResendInvitation.bind(this)} type="button"> <span className="fa fa-envelope-o">{"Resend Invitation"}</span></button></div> }
                                    <div className="visible-lg items-block"><button className="btn btn-default" id="alentUserButton" onClick={this.openAlertUser.bind(this)} type="button"> <span className="fa fa-exclamation-triangle">{"Alert User"}</span></button></div>
                                    { !this.state.userview && this.state.ldap && <div className="visible-lg items-block"><button className="btn btn-default super_admin_del g_moniter_admin moniter_admin_del" onClick={this.exportGroup.bind(this)} id="ExprotGroupButton" type="button"> <span className="fa fa-paste">{"Export Device ID"}</span></button></div> }
                                    <div className="visible-lg items-block"><button className="btn btn-default" id="button_refresh" onClick={this.refreshAll.bind(this)} type="button"> <span className="fa fa-refresh">{"Refresh"}</span></button></div>
                                  </ul>
										{ !this.state.userview && <span className="search_box visible-lg">
										<input type="text" size="25" defaultValue={QUERY_KEY_HINT} id="searchkeyword" className="searchBox text ui-widget-content"/> 
										<span style={{'float':'right', 'marginTop':'2px', 'fontSize':'12px'}}>{"Search in selected group:"} &nbsp;</span>
                                  </span>}
                                  </th>
                               </tr>
                         </thead>
                    </table>
          </div>

              
				<div id="webConsole" style={{'height':'510px'}}>
						<div className="ui-layout-west" id="id-div-tree" style={{'height':'98%'}}>
								<ul className="ztree" id="treeView">
								</ul>
						</div>
						<div className="ui-layout-center" style={{'height':'98%'}}>
								{ this.state.userview==0 && <GroupSummary treegroupid={this.state.treegroupid} ref="getGroupSummary" callbackID_clickcheckbox={this.ID_clickcheckbox.bind(this)} callbackUserView={this.checkUser.bind(this)}/> }
								{ this.state.userview==1 && <UserSummary treegroupid={this.state.treegroupid} ref="getUserSummary"/> }
						</div>
				</div>

	  
		{/*alert User*/}
		{this.state.modalAlertUser && <AlertUserModal showModal={this.state.modalAlertUser} closeModal={this.closeModalAlertUser}/>}
	
		{/*import LDAP*/}
		{this.state.modalImportGroup && <ImportGroupModal showModal={this.state.modalImportGroup} closeModal={this.closeModalImportGroup} refreshTree={this.refs.getGroupSummary.refreshTree} checkSeatStatus={this.check_seatstatus.bind(this)}/>}
	  
    </div>
    );
  }
}

