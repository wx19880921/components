import React from 'react';
import ReactDOM from 'react-dom';
import TrendFun from '../lib/function';

let trendFun = new TrendFun();
var PUTSAVEDATA;
var NAT_DATA={};
var NAR_FLAG=false;
var server;
export default class EditServer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}
	
	componentDidMount(){
		var id = parseInt(this.props.params.id,10);
		if(!$.isNumeric(id)){
			alert("error server id");
			return;
		}
		
		$(".tmmsgbox .close_btn").bind("click", function(){
			$(this).parent().hide("slow",function(){$("#messageboxtipdetail").html('&nbsp;');});
		});
		
		//init
		var url = "system/servers/detail/"+id+"/";
		trendFun.jsPostRequest(url,null, function (response) {
			    PUTSAVEDATA=response;
				server = response.data;
				
				
				$("#servername1,#servername2,#servername3").text(server.name);
				$("#servername").val(server.name);
				$("#description").val(server.desc);
				$("#ipaddress").val(server.managedIP);
				$("#ipaddress2").text(server.managedIP);
				
				if(!$.isEmptyObject(server.nat_if_conf)){
					$("#NAT_ipaddr").text(server.nat_if_conf.ipaddr);
					$("#NAT_netmask").text(server.nat_if_conf.netmask);
					$("#NAT_DNS").text(server.nat_if_conf.dns1);
					$("#NAT_DNS2").text(server.nat_if_conf.dns2);
				}
				
				function checkprobe(){
					var url="system/servers/probe/0/"
					trendFun.jsPostRequest(url,{"managedIP":server.managedIP},function(response){
							if(!response.data){
								 alert("<TREND_L10N>SERVER_EDIT_JS_ALERT_ERROR_NETWROKCARD</TREND_L10N>");
								 return;
							}
							if(!response.data.ifs){
								 alert("<TREND_L10N>SERVER_EDIT_JS_ALERT_ERROR_NETWROKCARD</TREND_L10N>");
								 return;
							}
							//PUTSAVEDATA.data.ifs=response.data.ifs;
							$.each(response.data.ifs,function(i,e){
								if(e.name=="eth1"){
									$("#iprange").val(e.range);
									$("#mask").val(e.netmask);
									$("#gateway").val(e.gateway);
									$("#DNS").val(e.dns);
								}
							});
						}, function(){}
					);
				}
				if(server.nat_disable==false){
					NAR_FLAG=true;
					$("input[type=radio][name=nettype]:eq(0)").prop("checked",true);
					if(server.nat_ifs_bak.length>1){
						$.each(server.nat_ifs_bak,function(i,e){
							if(e.name=="eth1"){
								$("#iprange").val(e.range);
								$("#mask").val(e.netmask);
								$("#gateway").val(e.gateway);
								$("#DNS").val(e.dns);
							}
						});
					}else{
						checkprobe();
					}
				}else{
					NAR_FLAG=false;
					$("input[type=radio][name=nettype]:eq(1)").prop("checked",true);
					if(server.ifs.length>1){
						$.each(server.ifs,function(i,e){
							if(e.name=="eth1"){
								$("#iprange").val(e.range);
								$("#mask").val(e.netmask);
								$("#gateway").val(e.gateway);
								$("#DNS").val(e.dns);
							}
						});
					}else{
						checkprobe();
					}
				}
				$("input[type=radio][name=nettype]:checked").click();
				
			},
			function () {}
		);
		//getNatData();

		
		
		// init button
		var saveBtn= $(".saveBtn"),
			cancelBtn= $(".cancelBtn");
		if($.fn.buttonBuild){
			saveBtn.buttonBuild({
				name: "<TREND_L10N>GLOBAL_JS_BUTTON_SAVE</TREND_L10N>",
				disabled:false,
				click: function() {
					
				}
			});
			cancelBtn.buttonBuild({
				name: "<TREND_L10N>GLOBAL_JS_BUTTON_CANCEL</TREND_L10N>",
				disabled:false,
				click: function() {
					location.href="viewpro.htm?id="+id;
					//$(".tmmsgbox .close_btn").trigger("click");
				}
			});
		}
					
		$("input[type=radio][name=nettype]").click(function(){
				if($(this).val()=="True"){ //nat
					$("#nat_ui").show();
					$("#non_nat_ui").hide();	
				}else{
					$("#nat_ui").hide();
					$("#non_nat_ui").show();	
				}
		});
	}
	
	saveServer(){
		var id=parseInt(this.props.params.id,10);
		if($("input[type=radio][name=nettype]:checked").val()=="True"){ //Nat
			if(this.setNatData()){
				PUTSAVEDATA.data.nat_disable=false;
				//PUTSAVEDATA.data.managedIP=$("#ipaddress").val();
				PUTSAVEDATA.data.desc=$("#description").val();
				PUTSAVEDATA.data.name=$("#servername").val();
			}else{
				return;
			}
		}
		$("#loading").show();
		$(".saveBtn").attr("disabled", true);
		var url="system/servers/detail/"+id+"/";
		trendFun.jsPutRequest(url,PUTSAVEDATA.data,function(response){
			if(response.code && response.code==4011){
					alert("<TREND_L10N>GLOBAL_JS_SERVER_ERROR</TREND_L10N>");
					$("#servername").focus();
					$(".saveBtn").attr("disabled", true);
					return;
			}
			location.href="#/servers/viewpro/"+this.props.params.id;
		}.bind(this), function(){
			$("#loading").hide();
			$(".saveBtn").attr("disabled", true);
			alert("<TREND_L10N>GLOBAL_JS_SERVER_ERROR</TREND_L10N>");
		});
	}
	
	cancelServer(){
		location.href="#/servers/viewpro/"+this.props.params.id;
	}
	
	setNatData(){
		//return true; //only show that don't save nat'valus.
		var regexp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
		var range=$.trim($("#NAT_ipaddr").val());
		//range=range.split("-");
		
		if($("#servername").val()==""){
			alert("<TREND_L10N>SERVER_EDIT_JS_ALERT_INVALID_SERVER_NAME</TREND_L10N>");
			$("#servername").focus();
			return false;
		}
		var regExp=/^[A-Za-z0-9_-]*$/;
		if($("#servername").val().match(regexp)==null){
			if(!regExp.test($("#servername").val())){
				alert("<TREND_L10N>SERVER_EDIT_JS_ALERT_INVALID_SERVER_NAME_ERROR_FORMAT</TREND_L10N>");
				$("#servername").focus();
				return false;
			}
		}
		return true;
	}
	
	render(){
		return (
			<div className="main_content">
                <h2 className="pageTitle config-name" id="servername2">&nbsp;</h2>
                <span id="id-span-message-tips"></span>
				<div className="column top" style={{"display":"none"}}></div>
                <div className="column left" style={{"display":"none"}}></div>
                <div className="column middle" style={{"width":"100%","clear":"both"}}>
                    <div className="messageBox tmmsgbox info displaynone" id="messageBox">
                      <div className="close_btn"></div>
                      <div className="msgcontent">
                        <p className="normaltext14">GLOBAL_STRING_SUCCESS</p>
                        <p className="normaltext" id="messageboxtipdetail" style={{"marginTop":"10px"}}>&nbsp;</p>
                      </div>
                    </div>
					<div className="panel headerSetting" id="id-div-message-config">
						<div className="topDiv config-top-description displaynone">
							Edit server
						</div>
                        <div className="firstSection" id="id-div-email-settings">
							<h4 className="title">SERVER_EDIT_CONTENT_BASIC_INFORMATION</h4>
							<div className="content">
								<ul>
									<li>
										<label><strong>SERVER_ADD_CONTENT_TITLE_SERVER_NAME<span className="redstar">*</span>:</strong></label>
										<input name="servername" type="text" id="servername" maxLength="20"/>
									</li>
									<li>
										<label><strong>SERVER_ADD_CONTENT_TITLE_IP_ADDR<span className="redstar">*</span>:</strong></label>
                                         <span id="ipaddress2"></span>
										<input type="hidden" name="ipaddress" id="ipaddress"/>
									</li>
									<li>
										<label className="topLabel"><strong>SERVER_ADD_CONTENT_TITLE_DESCRIPTION</strong></label>
                                        <textarea name="description" cols="50" rows="5"  id="description"></textarea>
									</li>
								</ul>
							</div>
						</div>   
                        <div className="firstSection" id="eth1">
							<h4 className="title">SERVER_EDIT_CONTENT_TITLE_NETWORK_INTERFACES</h4>
							<div className="content">	
								<ul>
                                    <li><strong>SERVER_ADD_CONTENT_IP0_TITLE</strong></li>
								    <li>
									<label className="topLabel">SERVER_ADD_CONTENT_TITLE_IP_ADDRESS</label>
									  <span id="NAT_ipaddr">&nbsp;</span>
									</li>
                                    <li>
									<label className="topLabel">SERVER_ADD_CONTENT_TITLE_DNS</label>
									  <span id="NAT_DNS">&nbsp;</span>
									</li>
                                    <li>
									<label className="topLabel">SERVER_ADD_CONTENT_TITLE_SECOND_DNS</label>
									  <span id="NAT_DNS2">&nbsp;</span>
									</li>
                                    
								    <li>
									<label className="topLabel">SERVER_ADD_CONTENT_TITLE_SUBNET_MASK</label>
									  <span id="NAT_netmask">&nbsp;</span>
									</li>
                                    
								</ul>
							</div>
						</div>                        
                        
						<div className="firstSection" id="natlist" style={{"display":"none"}}>
							<h4 className="title">SERVER_EDIT_CONTENT_WORKSPACE_NETWORK_SETTINGS</h4>
							<div className="content">
								<ul style={{"float":"left"}}>
                                    <li style={{"lineHeight":"20px"}}>
										<input name="nettype" type="radio" defaultValue="True" defaultChecked/>SERVER_ADD_CONTENT_USE_NAT
										<span style={{"display":"none"}}><input name="nettype" type="radio" value="False"/>SERVER_ADD_CONTENT_USE_IPRANGE</span>
                                    </li>
								</ul>
								<ul id="non_nat_ui" style={{"float":"left","borderLeft":"1px dashed","marginLeft":"40px","paddingLeft":"20px","minHeight":"145px"}} className="displaynone">
									<li>
										<label><strong>SERVER_ADD_CONTENT_TITLE_WORKSPACE_IP<span className="redstar">*</span>:</strong></label>
										<input name="iprange" type="text" id="iprange" maxLength="1000" placeholder="SERVER_ADD_CONTENT_IP_PLACEHOLDER"/>
									</li>
									<li>
										<label className="bottomLabel" style={{"marginLeft":"152px"}}>SERVER_ADD_CONTENT_IP_EXAMPLE</label>
									</li>
								  <li>
									<label className="topLabel"><strong>SERVER_ADD_CONTENT_SETP3_SUBNET_MASK<span className="redstar">*</span>:</strong></label>
									  <input name="mask" type="text" id="mask" maxLength="1000" placeholder="SERVER_ADD_CONTENT_MASK_PLACEHOLDER"/>
									</li>
								  <li>
									<label className="topLabel"><strong>SERVER_ADD_CONTENT_SETP3_GATEWAY<span className="redstar">*</span>:</strong></label>
									  <input name="gateway" type="text" id="gateway" maxLength="1000" placeholder="SERVER_ADD_CONTENT_GATEWAY_PLACEHOLDER"/>
									</li>
								  <li>
									<label className="topLabel"><strong>SERVER_ADD_CONTENT_SETP3_DNS<span className="redstar">*</span>:</strong></label>
									  <input name="DNS" type="text" id="DNS" maxLength="1000" placeholder="SERVER_ADD_CONTENT_DNS_PLACEHOLDER"/>
									</li>
								</ul>
								<ul id="nat_ui" style={{"float":"left","marginLeft":"40px","paddingLeft":"20px","minHeight":"145px"}}>
								</ul>
                                <div style={{"clear":"both"}}></div>
							</div>
						</div>
						
					</div>
                    <div id="loading" className="displaynone"><img src="../images/loading_16X16.gif"/></div>
					<ul className="buttonGrp">
						<button className="saveBtn btn btn-default" onClick={this.saveServer.bind(this)}>Save</button>
						<button className="cancelBtn btn btn-default" onClick={this.cancelServer.bind(this)}>Cancel</button>
					</ul>
				</div>
				<div className="column right" style={{"display":"none"}}></div>
				<div className="column bottom" style={{"display":"none"}}></div>
			</div>
		
		)
	}
}