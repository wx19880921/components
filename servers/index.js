import React from 'react';
import ReactDOM from 'react-dom';
import TrendFun from '../lib/function';
import IndexCss from './index.css';

let trendFun = new TrendFun();

var SERVER_STATE=[];
SERVER_STATE[1]="Ready";
SERVER_STATE[2]="Running";
SERVER_STATE[3]="Error";
SERVER_STATE[8]="Upgrading";
var HA_STATE=[];
HA_STATE[0]="&nbsp;";
HA_STATE[1]="Primary";
HA_STATE[2]="Secondary";
var connectFlag=0;
export default class ServersIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		serverlist : [],
		checkboxStatus : [],
		checkAll : false,
		pageSize : 10,
	};    
  }
  
  componentDidMount(){
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
	//EADS_check_all
	  $(document).on('click', "#ID_row_container input[type=checkbox][class='cbx']", function(){
		  clickcheckbox();
	  });
	  $(document).on('click', '#EADS_check_all', function(){
		  clickcheckbox();
	  });
	  
    function getIconZone(target) {	
        var position = target.offset();
        var width = target.width();
        var iconZone = position.left + width + 23 - 20;
        return iconZone;
    }
	
    $(".tmGrid .header_title").each(
        function(index, header){						
            var th= $(header).find("th");
            th.each(
                function(index, col){
                    var column= $(col);
                    if(column.is(".sort_desc") || column.is(".sort_asc")){
                        column.bind("click", function(){
                            var that= column;
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
    checkCbxAll($(".tmGrid tbody"));
	
	$(".tmmsgbox .close_btn").bind("click", function(){
		$(".tmmsgbox .close_btn").parent().hide("slow",function(){$("#messageboxtipdetail").html('&nbsp;');});
	});

      var checkServerState=function(){
		  var url="system/hypervisors/tree/0/";
		  trendFun.jsPostRequest(url,null,function(res){
			 //var response =res[0].children[0];
			 var response =res;
			  if(response.state&&(response.state=="lock"||response.state=="failed")){
				  $("#doingMsg").html(response.message+" please wait...");
				  $("#profileDiv").hide();
				  $("#lockstate").show();
			  }
		  },function(){
			  //location.href="index.htm?t="+(new Date()).getTime();
		  })
	  }
      checkServerState();
		
	  $("#addButton").click(function(e) {
		    //button_disabled
			$("#addButton>span").addClass("button_disabled");
		  	trendFun.jsGetRequest('cfg/?page_size=1000000&group=external', function(response){
				$.each(response.results, function(i, e){
					if(e.name=="nfs_enable"){
						if(e.value=="True"){
							location.href="add.htm";  
						}else{
							$("#addButton>span").removeClass("button_disabled");
							alert("Unable to add Virtual Mobile Infrastructure server because the External Storage is not configured. Stop the server and then click External Storage to configure it.");
						}
					}
				});
			},function(){
				$("#addButton>span").removeClass("button_disabled");
				alert("Unable to add Virtual Mobile Infrastructure server because the External Storage is not configured. Stop the server and then click External Storage to configure it.");
			});
      });
	  $("#button_refresh").click(function(e) {
      	  location.href="index.htm?t="+(new Date()).getTime();  
      });	
		
	  //EADS_check_all
	  $(document).on('click', '#ID_row_container input[type=checkbox][class="cbx"]', function(){
		  clickcheckbox();
	  });
	  $(document).on('click', '#EADS_check_all', function(){
		  clickcheckbox();
	  });
	
	  var clickcheckbox=function(){
		  var cbxchecklength=$("#ID_row_container input[type=checkbox][class='cbx']:checked").length;
		  var server_ready=0,server_running=0,server_error=0,server_upgrade=0;
		  var localhost_flag=false;
		  var ha_state=0;
		  $("#ID_row_container input[type=checkbox][class='cbx']:checked").each(function(i, e) {
               if($(this).data("state")==1){
			   		server_ready++;
			   }else if($(this).data("state")==2){
			   		server_running++;
			   }else if($(this).data("state")==3){
			   		server_error++;
			   }else if($(this).data("state")==8){
			   		server_upgrade++;
			   }
			   
			   if($(this).data("hastate")==1 || $(this).data("hastate")==2){
				   ha_state++;
			   }
			   
			   if($(this).val()=="1"){
			   		localhost_flag=true;
			   }
          });
		  // ready can start
		  if(cbxchecklength>0 && server_running==0 && server_error==0 && server_upgrade==0){
		  	$("#startServers").removeClass("button_disabled")
		  }else{
		  	$("#startServers").addClass("button_disabled");
		  }
		  // runnng can stop
		  if(cbxchecklength>0 && server_ready==0 && server_error==0 && server_upgrade==0){
		  	$("#stopServers").removeClass("button_disabled")
		  }else{
		  	$("#stopServers").addClass("button_disabled");
		  }
		  // error or ready can remove
		  if(cbxchecklength>0 && server_running==0 && server_upgrade==0){
		  	$("#button_delete_profile").removeClass("button_disabled")
		  }else{
		  	$("#button_delete_profile").addClass("button_disabled");
		  }
		  
		  if(localhost_flag){ //localhost
		  		$("#button_delete_profile").addClass("button_disabled");
		  }
		  
		  if(ha_state>0){ //passive mode or active mode
		  		$("#button_delete_profile").addClass("button_disabled");
		  }
		  
		  /*
		  if(cbxchecklength>0){
			  $("#button_delete_profile").removeClass("button_disabled")
			  $("#startServers").removeClass("button_disabled")
			  $("#stopServers").removeClass("button_disabled")
		  }else{
			  $("#button_delete_profile").addClass("button_disabled");
			  $("#startServers").addClass("button_disabled");
			  $("#stopServers").addClass("button_disabled");
			  
		  }*/
	  
	  }
	  var selectItems=function(){
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
	  $("#button_delete_profile").click(function(){
		  if($("#button_delete_profile").hasClass("button_disabled")){
		  }else{
			  if (confirm("Do you want to remove this server?")) {
					 var request = {
							  "ids":selectItems()  //"invitation_id_vec":[123, 465]
					  };
				    trendFun.jsPostRequest('system/servers/remove/0/', request, function(response) {
						  $("#messageboxtipdetail").text("The Selected item(s) has been removed.");
						  $("#messageBox").show("slow");
						  $.each($("#ID_row_container input[type=checkbox]:checked"),function(i,e){
								$(this).parent().parent().remove();
						  });
						  $("#button_delete_profile").addClass('button_disabled')
						  $("#EADS_check_all").attr("checked",false);
						  
						  $("#ID_row_container td[class=order]").each(function(i, e) {
								$(this).text(i+1);
  						  });
						 
						}, function() {
							alert("Unable to access server. Check your network connection and try again.");
						});
				    }
		    }
	  });
	  
	  $("#startServers").click(function(e) {
		  if($("#startServers").hasClass("button_disabled")){
		  }else{
				var iDs=selectItems(); 
				if(iDs.length==0){
					alert("Select at least one server.");
					return;
				}
				onStartServer(iDs);
		 }
      });
	   function onStartServer(iDs){
			if(confirm( "Do you want to start this server now?")){
				var url="system/servers/start/0/";
				var request = {
							  "ids":iDs
				};
				$("#loading").show();
				$("#startServers").addClass("button_disabled");
				trendFun.jsPostRequest(url,request,function(response){
				   if(response.code==5001){
						alert("Invalid Workspace IP range. Type an IP range and try again.");
						self.location.reload();
						//location.href="edit.htm?id=1";
					}else{
						$("#EADS_check_all").attr("checked",false);
						self.location.reload();
					}
				},function(){
					self.location.reload();
				});
			}
	  }
	  $("#stopServers").click(function(e) {
		  if($("#stopServers").hasClass("button_disabled")){
		  }else{
			var iDs=selectItems(); 
			if(iDs.length==0){
				alert("Select at least one server.");
				return;
			}
			onStopServer(iDs);
		 }
      });
	   function onStopServer(iDs){
			if(confirm( "Stopping the server will prevent users from accessing cloud workspaces on this server.\n\nDo you want to stop this server now?")){
				var url="system/servers/stop/0/";
				var request = {
							  "ids":iDs
				};
				var timeoutstamr;
				//$("#loading").show();
				$("#profileDiv").hide();
				$("#lockstate").show();
				$("#doingMsg").html("stopping server, please wait...");
				$("#stopServers").addClass("button_disabled");
				trendFun.jsPostRequest(url,request,function(response){
				   if(response.code==5000){
							function ping(){	
								var url="system/servers/ping/0/";
								trendFun.jsPostRequest(url,request,function(response){
									//location.href="index.htm?t="+(new Date()).getTime();
									var runningserver_num=0;
									$.each(response,function(i,e){
										if(e.state==2){
											runningserver_num++;
										}
									});
									if(runningserver_num>0){
										timeoutstamr=setTimeout(function(){ping()},1500);
									}else{
										location.href="index.htm?t="+(new Date()).getTime();
									}
								},function(response,status){
									clearTimeout(timeoutstamr);
									alert("Unable to access server. Check your network connection and try again.");
									location.href="index.htm?t="+(new Date()).getTime();
								})
							}
							ping();
						
					}else{
						self.location.reload();
					}
				},function(){self.location.reload();});
			}
	  }
	 
	  //read data and show pages 
	  var ID_readData=function(page_size,page_index){
		  //TREE_GROUP_ID
		  //$("#ID_row_container").empty().append('<tr><td colspan="6"><img src="../images/loading_16X16.gif" />'+"loading..."+'</td></tr>');
		  var url="system/servers/hypervisor/1/";
		  
		  trendFun.jsGetRequest(url, function(response){
				if(!response.data){
					$("#ID_row_container").empty().append('<tr><td colspan="6"><div  class="noDataToDisplay">'+"No data to display."+'</div></td></tr>');
					$("#ID_page_index").val(page_index);
					$("#ID_pagecount").text('0');
					$("#ID_pagerendcont").text('0');
					return;
				}
				parseID(response);
				checkAlertStart();
				
		  }, function(){$("#ID_row_container").empty().append('<tr><td colspan="6"><div  class="noDataToDisplay">'+"No data to display."+'</div></td></tr>')});
		 
	  }
	  

	var parseID=function(IDs){
		var rowState = [];
		//IDs.results.map(function(e, i){
		for(let i=0; i<IDs.data.servers.length; i++) {
			rowState[i] = false;
		}
		//console.log("row"+rowState);
		this.setState({serverlist:(IDs.data.servers), checkboxStatus:rowState});
		
	}.bind(this);
	ID_readData(1000,0);
	  
	  
	  function checkAlertStart(){
		trendFun.jsGetRequest('dashboard/statalert/', function(response){
			if(response.code==0){
				$.each(response.data,function(i,e){
					//i_status_yellow.png
			         $('<img src="../images/riskicon_medium.png">').appendTo("#s_"+e.server_ip.replace(/\./g, ""));
				});
		     }
		});
	  }
  }
  
  checkServerBox(index){
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
	}
	
	checkAllServers(){
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
	
  render(){
	let bodyDiv;
	  if(this.state.serverlist.length == 0)
		  bodyDiv = <tr><td><div  className="noDataToDisplay">No data to display.</div></td></tr>
	  else {
			var ready_count=0,started_count=0,failed_count=0;
			var error_id_list=[];
			bodyDiv = this.state.serverlist.map(function(e,index){
				if(e.state==1){
					ready_count++;
				}else if(e.state==2){
					started_count++;
				}if(e.state==3){
					failed_count++;
					error_id_list.push(e.id);
				}
				var percent=0;
				var active=parseInt(e.active_user_number,10);
				if(!$.isNumeric(active)) active=0;
				if(e.actual_capacity && e.actual_capacity>0){
					var percent= active/e.actual_capacity;
					percent=percent.toFixed(2)*100;
				}
				var percentData = percent + "%";
				
				var ha_status = HA_STATE[e.ha_status];
				if (e.ha_status == 0 && this.state.serverlist.length == 1)
					ha_status = HA_STATE[1];
				
				return (
				  <tr id={"ID_tr_"+e.id} key={e.id} className={this.state.checkboxStatus[index]&&"checked"}>
						<td className="checkBoxAll"><input type="checkbox" defaultValue={e.id} checked={this.state.checkboxStatus[index]} onClick={this.checkServerBox.bind(this, index)} className="cbx" id={'ID_tr_checkbox_'+e.id}/></td>
						<td id={"s_"+e.managedIP.replace(/\./g, "")}><a href={"#/servers/viewpro/"+e.id}>{replaceRevStr(e.name)}</a></td>
						<td>{SERVER_STATE[e.state]}</td>
						<td>{e.server_version}</td>
						<td><span id={"t_"+e.id}>{ha_status}</span></td>
						<td>
							<div className="progress-warpper">
								<div className="progress-container">
									<div className="progress">
										<div className="progress-bar active" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" style={{"width":percentData}}>
										</div>
									</div>
								</div>
							</div>
							<div className="progress_number">
								<span className="session_active">{e.active_user_number}</span> / 
								<span className="session_total">{e.actual_capacity}</span>
							</div>
						</td>
				  </tr>
			)}.bind(this));
		  
	  }
	  
	return (
	  <div id="serverIndex">
		<div className="messageBox tmmsgbox info displaynone" id="messageBox">
            <div className="close_btn"></div>
            <div className="msgcontent">
              <p className="normaltext14">Success</p>
              <p className="normaltext" style={{"marginTop":"10px"}} id="messageboxtipdetail">&nbsp;</p>
            </div>
		</div>
		<div style={{"width":"100%","textAlign":"center"}} className="displaynone" id="lockstate">
			<img src="../images/lock.png" title="lock"></img><p><b style={{"padding":"10px"}} id="lockMsg"></b></p>
			<p id="doingMsg">&nbsp;</p>
		</div>
		<div style={{"margin":"10px 0"}} className="displaynone" id="loading">
			<img src="../images/loading_16X16.gif" title="lock" />
		</div>
		<div className="table-with-header table-page" id="serverDiv">
			<div className="toolbar">
				<div className="items-block">
					<button type="button"  id="addButton" className="btn btn-primary"><span className="fa fa-plus"></span>Add Server</button>
				</div>
				<div className="items-block">
					<button type="button"  id="startServers" className="btn btn-primary"><span className="fa fa-plus"></span>Start Server</button>
				</div>
				<div className="items-block">
					<button type="button"  id="stopServers" className="btn btn-primary"><span className="fa fa-plus"></span>Stop Server</button>
				</div>
				<div className="items-block super_admin">
					<button type="button"  id="button_storage" className="btn btn-primary"><span className="fa fa-plus"></span>External Storage</button>
				</div>
				<div className="items-block visible-lg">
					<button type="button" id="button_delete_server" className="btn btn-primary"><span className="fa fa-trash"></span>==Delete</button>
				</div>
			</div>
			<table className="tmGrid table table-bordered" id="profileData">
				<thead>
					<tr className="sizing_row" style={{"display":"none"}}>
						<th className="col_1"></th>
						<th className="col_2"></th>
						<th className="col_3"></th>
						<th className="col_4 visible-lg"></th>
						<th className="col_5 visible-lg"></th>
						<th className="col_6 visible-lg"></th>
					</tr>
					
					<tr className="header_title">
						<th className="checkBoxAll"><input type="checkbox" id="EADS_check_all" checked={this.state.checkAll} onClick={this.checkAllServers.bind(this)} className="check_all_checkbox"/></th>
						<th><div className="column_title">Server Name</div></th>
						<th><div className="column_title">State</div></th>
						<th><div className="column_title visible-lg">Version</div></th>
						<th><div className="column_title visible-lg">Type</div></th>
						<th><div className="column_title visible-lg">User Sessions (Active User Session / Server Session Capacity)</div></th>
					</tr>
				</thead>
				<tbody className="row_container" id="ID_row_container">
					{bodyDiv}
				</tbody>
			</table>     
			<div className="table-pagination">
				<div className="table-pagination-block">
					<div className="pagination">
						Ready: <span id="status_ready">0</span> | Running: <span id="status_start">0</span> | Error: <span id="status_failed">0</span>
					</div>
					
				</div>
			</div>
		</div>
	
	  </div>
	);
  }
  
}