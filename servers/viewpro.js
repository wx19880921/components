import React from 'react';
import ReactDOM from 'react-dom';
import TrendFun from '../lib/function';

let trendFun = new TrendFun();

export default class ServersIndex extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		  
	  };    
	}
	
	componentDidMount(){
		var id=parseInt(this.props.params.id,10);
		if(!$.isNumeric(id)){
			alert("error server id");
			return;
		}
		
		$(".tmmsgbox .close_btn").bind("click", function(){
			$(this).parent().hide("slow",function(){$("#messageboxtipdetail").html('&nbsp;');});
		});
		
		var stopFlag=parseInt($.getURLParam("stopFlag"),10);
		var startFlag=parseInt($.getURLParam("startFlag"),10);
		
		if(stopFlag==1){
			$("#messageboxtipdetail").text("<TREND_L10N>SERVERS_JS_STOP_SERVER_TIP</TREND_L10N>");
			$("#messageBox").show("slow");
		}else if(startFlag==1){
			$("#messageboxtipdetail").text("<TREND_L10N>SERVERS_JS_START_SERVER_TIP</TREND_L10N>");
			$("#messageBox").show("slow");
		}
		
		
		
		
		var styleObject={
				"font-size":"14px;",
				"color":"#000000",
				"font-family":"Arial, Helvetica, sans-serif;"
		}
		var subStyleObject={
				"font-size":"12px;",
				"color":"#777777",
				"font-family":"Arial, Helvetica, sans-serif;"
		}
	
		var url = "system/servers/sysinfo/"+id+"/";
		trendFun.jsPostRequest(url,null, function (response) {
			if(response.code==0){
				var sysinfo=response.data;
				var percent;
	
				var memory_total=(sysinfo.memory.total/1024).toFixed(1);
				var memory_used=((sysinfo.memory.total-sysinfo.memory.free-sysinfo.memory.buffers-sysinfo.memory.cached)/1024).toFixed(1);
				
				$("#memory_used").text(this.fmoney(memory_used));
				$("#memory_total").text(this.fmoney(memory_total));
				if(memory_total>0){
					percent= memory_used/memory_total;
					percent=percent.toFixed(2)*100;
					if(percent>=80){
						$("#memory_percent").css("background-color","#ff0000");
					}
					$("#memory_percent").css("width",percent+"%");
				}
				
				var storage_total=0;
				var storage_used=0;
				$.each(sysinfo.storage.results,function(i,e){
					storage_total+=e.value;
					if(e.key=='Used'){
						storage_used=e.value;
					}
				});
				$("#storage_used").text((storage_used/1024).toFixed(1));
				$("#storage_total").text((storage_total/1024).toFixed(1));
				if(storage_total>0){
					percent= storage_used/storage_total;
					percent=percent.toFixed(2)*100;
					if(percent>=80){
						$("#storage_percent").css("background-color","#ff0000");
					}
					$("#storage_percent").css("width",percent+"%");
				}
				
				/////////////////////////
				var chart5data=new Array();	
				var Categories=new Array();
				var Values=new Array();
				var max_Y=0;
				var colorvalue='';
				var cpu_data=sysinfo.cpu_statistics.results;
				var cpu_length=cpu_data.length-1;
				$.each(sysinfo.cpu_statistics.results,function(i,e){
					Categories.push(date("H:i",e.key));
					var temp1=e.value.toFixed(1);
					Values.push(parseFloat(temp1));
					if(e.value>max_Y) max_Y=e.value;
					//if(e.value>=80) colorvalue='#ff0000';
				});
				if(cpu_length>0 && cpu_data[cpu_length].value>=80) colorvalue='#ff0000'; // if last time is more than 80, red line
				
				max_Y=parseInt(max_Y.toFixed(0))+1;
				if(max_Y>100){
					max_Y=100;
				}
				chart5data.push({name:"CPU",data:Values});
				var step=Math.floor(sysinfo.cpu_statistics.results.length/10);   
				///* Math.ceil*/
				new Highcharts.Chart({
							chart: {
								renderTo: 'chartContainer3',
								height:'200',
								type: 'line'
							},
							title: {
								text: "CPU Usage Trend<",
								style:styleObject
							},
							subtitle:{
								//text: '(Time Recorded)',
								//style:subStyleObject
							},
							xAxis: {
								categories:Categories, // ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\
								 //tickInterval: 2,
								 labels: {
									 step: 2
									// rotation:-45
								 },
								 title:{
									text:"Time Recorded"
								 }
							},
							yAxis: {
								title: {
									text: '%'
								},
								min:0,
								max:max_Y,
								plotLines: [{
									value: 0,
									width: 1,
									color: '#808080'
								}]
							},
							tooltip: {
								enabled:true,
								formatter: function() {
										return '<b>'+ this.series.name +'</b><br/>'+
										this.x +' '+ this.y+ "%";
								}
							},
							plotOptions:{
								series: {
										 color: colorvalue,
								},
								line: {
									lineWidth: 2,
									states: {
										hover: {
											lineWidth: 2
										}
									},
									marker: {
										enabled: false
									}
								}
							},
							legend:{
								enabled:false	
							},
							credits:{
								enabled:false
							},
							exporting:{ 
							   enabled:false //set print and export
							},
							series: chart5data
				});
				
				
				$("#cpu_model").html(response.data.cpuinfo.model);
				$("#cpu_count").html(response.data.cpuinfo.count);
			}
		  }.bind(this),function(response,status){}
		);
		
		
		var url = "system/servers/detail/"+id+"/";
		var SERVER_STATE=new Array();
		SERVER_STATE[1]="Ready";
		SERVER_STATE[2]="Running";
		SERVER_STATE[3]="Error";
		SERVER_STATE[8]="Upgrading";
		var SERVER_IMG=new Array();
		SERVER_IMG[1]="server_status_defined.png";
		SERVER_IMG[2]="server_status_running.png";
		SERVER_IMG[3]="server_status_error.png";
		SERVER_IMG[8]="server_status_upgrade.png";
		var server;
		trendFun.jsPostRequest(url,null, function (response) {
			if(response.code==0){
				server = response.data;
				$("#servername1,#servername2,#servername3").text(server.name);
				$("#description").text(server.desc);
				$("#ipaddress").text(server.managedIP);
				$("#serverstatusimg").attr("src","../images/"+SERVER_IMG[server.state]);
				$("#serverstatus").html(SERVER_STATE[server.state]);
				$("#session_total").text(server.actual_capacity);
				var active=parseInt(server.active_user_number,10);
				if(!$.isNumeric(active)) active=0;
				$("#session_active").text(active);
				if(server.actual_capacity && server.actual_capacity>0){
					var percent= active/server.actual_capacity;
					percent=percent.toFixed(2)*100;
					$("#session_percent").css("width",percent+"%");
				}
				
				if(server.state==1){
					$("#startServers").removeClass("disabled disabledstart");
					$("#stopServers").addClass("disabled disabledstop");
				}else if(server.state==2){
					$("#startServers").addClass("disabled disabledstart");
					$("#stopServers").removeClass("disabled disabledstop");
				}else if(server.state==3){
					$("#startServers").addClass("disabled disabledstart");
					$("#stopServers").addClass("disabled disabledstop");
				}else if(server.state==8){
					$("#startServers").addClass("disabled disabledstart");
					$("#stopServers").addClass("disabled disabledstop");
				}
				
				if(server.nat_if_conf){
					$("#NAT_ipaddr").text(server.nat_if_conf.ipaddr);
					$("#NAT_netmask").text(server.nat_if_conf.netmask);
					$("#NAT_DNS").text(server.nat_if_conf.dns1);
					$("#NAT_DNS2").text(server.nat_if_conf.dns2);
				}
				
				/*
				if(server.ifs.length>0){
					$.each(server.ifs,function(i,e){
						if(e.name=="eth1"){
							$("#iprange").text(e.range);
							$("#mask").text(e.netmask);
							$("#gateway").text(e.gateway);
							$("#DNS").text(e.dns);
						}
						if(e.name=="eth0"){
							$("#NAT_ipaddr").text(e.ip);
							$("#NAT_netmask").text(e.netmask);
							if(!e.dns){
								$("#NAT_DNS").text($("#NAT_DNS2").text());
							}else{
								$("#NAT_DNS").text(e.dns);
							}
						}
					});
				}
				*/
				if(!server.nat_disable){
					$("#iprangeDiv").hide();
					$("#iprangeleftDiv").hide();
				}
				else
				{
					$("#natleftDiv").hide();
				}
				
			  }
        },
        function () {}
	);
		
		
	  $("#startServers").click(function(e) {
		  if($(this).hasClass("disabled")){
		  }else{
				var iDs=[id]; 
				onStartServer(iDs);
		 }
      });
	   function onStartServer(iDs){
			if(confirm( "<TREND_L10N>SERVERS_JS_CONFIRM_START_SERVER</TREND_L10N>")){
				var url="system/servers/start/"+id+"/";
				var request = {
							  "ids":iDs
				};
                $("#doingMsg").empty().html(" <img src='../images/loading_16X16.gif' /> <TREND_L10N>VIEWPRO_JS_SERVER_STARTING</TREND_L10N>");
				$("#startServers").addClass("disabled disabledstart");
				trendFun.jsPostRequest(url,request,function(response){
				   if(response.code==5001){
						alert("<TREND_L10N>VIEWPRO_JS_SERVER_STARTING_FAIL_INVALID_IP</TREND_L10N>");
						location.href="edit.htm?id="+id;
				   }else if(response.code==5002){
						alert("<TREND_L10N>VIEWPRO_JS_SERVER_STARTING_FAIL_INVALID_NATCONFIG</TREND_L10N>");
						location.href="edit.htm?id="+id;
				   }else if(response.code==5005){
						alert("<TREND_L10N>VIEWPRO_JS_SERVER_STARTING_FAIL_INVALID_PORTAL</TREND_L10N>");
						$("#startServers").removeClass("disabled disabledstart");
				   }else{
					    self.location.href="viewpro.htm?id="+id+"&startFlag=1&t="+(new Date()).getTime();
						//self.location.reload();
				   }
				},function(response,status){
						$("#doingMsg").empty();
						$("#startServers").removeClass("disabled disabledstart");
						alert("<TREND_L10N>GLOBAL_JS_SERVER_ERROR</TREND_L10N>");
				});
			}
	  }
	  $("#stopServers").click(function(e) {
		  if($(this).hasClass("disabled")){
		  }else{
			var iDs=[id]; 
			onStopServer(iDs);
		 }
      });
	   function onStopServer(iDs){
			if(confirm( "<TREND_L10N>SERVERS_JS_CONFIRM_STOP_SERVER</TREND_L10N>")){
				var url="system/servers/stop/"+id+"/";
				var request = {
							  "ids":iDs
				};
				var timeoutstamr;
				$("#stopServers").addClass("disabled disabledstop");
				trendFun.jsPostRequest(url,request,function(response){
				   if(response.code==5000){
					  $("#doingMsg").empty().html(" <img src='../images/loading_16X16.gif' /> <TREND_L10N>VIEWPRO_JS_STOPING_SERVER</TREND_L10N>");
							function ping(){	
								var url="system/servers/ping/"+id+"/";
								jsPostRequest(url,null,function(response){
									if(response.state && response.state==2){
										timeoutstamr=setTimeout(function(){ping()},1500);
									}else{
					    				self.location.href="viewpro.htm?id="+id+"&stopFlag=1&t="+(new Date()).getTime();
										//self.location.reload();
									}
								},function(response,status){
									clearTimeout(timeoutstamr);
									$("#doingMsg").empty();
									$("#stopServers").removeClass("disabled disabledstop");
									alert("<TREND_L10N>GLOBAL_JS_SERVER_ERROR</TREND_L10N>");
								})
							}
							ping();
					}else{
						self.location.href="viewpro.htm?id="+id;
						//self.location.reload();
					}
				},function(){$("#stopServers").removeClass("disabled disabledstop");});
			}
		}
	}
	
	fmoney(s, n){   
		//fmoney("12345.675910", 3) return:12,345.676
	   n = n > 0 && n <= 20 ? n : 2;   
	   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
	   var l = s.split(".")[0].split("").reverse(),   
	   r = s.split(".")[1];   
	   var t = "";   
	   for(let i = 0; i < l.length; i ++ ){   
		  t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
	   }   
	   //return t.split("").reverse().join("") + "." + r;   
	   return t.split("").reverse().join("");   
	} 
	
	handleblur(){
		$("#startServers").blur();
		$("#stopServers").blur();
	}
	
	editServer(){
		location.href="#/servers/edit/"+this.props.params.id;	
	}
	
	render(){
		return (
			<div className="main_content">
                <h2 className="pageTitle config-name" id="servername2"></h2>
                <span id="id-span-message-tips"></span>
				<div className="column top" style={{"display":"none"}}></div>
                <div className="column left" style={{"display":"none"}}></div>
                <div className="column middle" style={{"width":"100%","clear":"both"}}>
                  <div className="messageBox tmmsgbox info displaynone" id="messageBox">
                    <div className="close_btn"></div>
                    <div className="msgcontent">
                      <p className="normaltext14">Success</p>
                      <p className="normaltext" style={{"marginTop":"10px"}} id="messageboxtipdetail">&nbsp;</p>
                    </div>
                  </div>
					<div className="panel headerSetting" id="id-div-message-config">
                        <div className="firstSection" id="id-div-email-settings">
							<h4 className="title">Basic Information</h4>
							<div className="content">	
								<ul>
									<li className="displaynone">
										<label><strong>Server name:</strong></label>
										<span id="servername2">&nbsp;</span>
									</li>
									<li className="displaynone">
										<label><strong>Description:</strong></label>
										<span id="description">&nbsp;</span>
									</li>
									<li className="displaynone">
										<label><strong>IP address:</strong></label>
										<span id="ipaddress">&nbsp;</span>
									</li>
                                	<li className="displaynone" style={{"borderBottom":"#CCC dashed 1px"}}></li>
                                    <li> 
                                        <label><strong>Status:</strong></label>
                                    	<span><img id="serverstatusimg" src="../images/server_status_running.png" style={{"verticalAlign":"middle"}} /></span>
                                        <span id="serverstatus" style={{"margin":"0 55px 0 10px"}}></span>
                                       
                                        <span className="g_moniter_admin moniter_admin">
											<a href="javascript:;" id="startServers" className="btnboot btn-small2" onFocus={this.handleblur}><i className="icon-star"></i> Start</a><a href="javascript:;" id="stopServers" className="btnboot btnboot2 btn-small3"  onFocus={this.handleblur}><i className="icon-stop"></i> Stop</a>
                                        </span> 
                                        <span id="doingMsg"></span>
                                    </li>
 								
 								</ul>
							</div>
						</div> 
                        <div className="firstSection" id="id-div-email-settings">
							<h4 className="title">Performance</h4>
							<div className="content">	
								<ul>
									<li>
										<div style={{"float":"left"}}><label className="topLabel"><strong>User sessions:</strong></label></div>
                                        <div className="progress" style={{"float":"left"}}><div id="session_percent" className="bar"></div></div>
                                        <div style={{"float":"left","marginLeft":"20px"}}>Active: <span id="session_active">0</span> / Server Capacity: <span id="session_total">0</span></div>
                                        <div style={{"clear":"both"}}></div>
									</li>
									<li>
										<div style={{"float":"left"}}><label className="topLabel"><strong>Memory (MB):</strong></label></div>
                                        <div className="progress" style={{"float":"left"}}><div id="memory_percent" className="bar"></div></div>
                                        <div style={{"float":"left","marginLeft":"20px"}}>Used: <span id="memory_used">&nbsp;</span> / Server Capacity: <span id="memory_total"></span></div>
                                        <div style={{"clear":"both"}}></div>
									</li>
									<li>
										<div style={{"float":"left"}}>
										  <label className="topLabel"><strong>Storage (GB):</strong></label></div>
                                        <div className="progress" style={{"float":"left"}}><div id="storage_percent" className="bar"></div></div>
                                        <div style={{"float":"left","marginLeft":"20px"}}>Used: <span id="storage_used">&nbsp;</span> / Server Capacity: <span id="storage_total"></span></div>
                                        <div style={{"clear":"both"}}></div>
									</li>
									<li style={{"marginTop":"20px"}}>
										<label className="topLabel"><strong>CPU:</strong></label>
                                        <span id="cpu_model"> </span>  x  <span id="cpu_count"></span>
									</li>
                                    <li>
                                    	<div id="chartContainer3" style={{"width":"670px"}}>No data to display.</div>
                                    </li>
 								
 									</ul>
							</div>
						</div>     
                        
						<div className="firstSection">
							<h4 className="title">Network Interfaces</h4>
							<div className="content">
								<ul>
                                    <li><strong>Network Interface for Accessing Server</strong></li>
								    <li>
									<label className="topLabel">IP Address:</label>
									  <span id="NAT_ipaddr">&nbsp;</span>
									</li>
                                    <li>
									<label className="topLabel">Primary DNS:</label>
									  <span id="NAT_DNS">&nbsp;</span>
									</li>
                                    <li>
									<label className="topLabel">Secondary DNS:</label>
									  <span id="NAT_DNS2">&nbsp;</span>
									</li>
								    <li>
									<label className="topLabel">Subnet mask:</label>
									  <span id="NAT_netmask">&nbsp;</span>
									</li>
                                    
								</ul>
							</div>
						</div>
                                                
						<div className="firstSection" style={{"display":"none"}}>
							<h4 className="title">Workspace Network Settings</h4>
							<div className="content">
 								<ul id="iprangeleftDiv" style={{"float":"left"}}>
                                    <li ><strong>Using IP Range</strong></li>
                                    <li>Assigned individual IP addresses to all workspaces.</li>
								</ul>		
								<ul id="natleftDiv" style={{"float":"left"}}>
									<li ><strong>Using NAT</strong></li>
                                    <li>Sharing server IP address with workspaces.</li>
								</ul>	                           
                            
                                <ul  id="iprangeDiv" style={{"float":"left","borderLeft":"1px dashed","marginLeft":"40px","paddingLeft":"20px","minHeight":"145px"}}>
									<li>
										<label><strong>Workspace IP range:</strong></label>
										<span id="iprange"></span>
									</li>
								    <li>
									<label className="topLabel"><strong>Subnet mask:</strong></label>
                                    <span id="mask"></span>
									</li>
								    <li>
									<label className="topLabel"><strong>Gateway IP address:</strong></label>
									  <span id="gateway"></span>
									</li>
								    <li>
									<label className="topLabel"><strong>DNS server IP address:</strong></label>
									  <span id="DNS"></span>
									</li>
                                 </ul>
                                  <div style={{"clear":"both"}}></div>
							</div>
						</div>
						
					</div>
					<ul className="buttonGrp g_moniter_admin moniter_admin">
						<button className="saveBtn btn btn-default" onClick={this.editServer.bind(this)}>Edit</button>
					</ul>
				</div>
				<div className="column right" style={{"display":"none"}}></div>
				<div className="column bottom" style={{"display":"none"}}></div>
			</div>
		
		)
	}
	
}