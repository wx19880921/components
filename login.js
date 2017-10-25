import React from 'react';
import ReactDOM from 'react-dom';
import { Modal,Button } from 'react-bootstrap';
import LoginCss from './login.css';
import MainCss from './css/main.css';
import TrendFun from './lib/function';
import * as Navigation from './lib/global.js';

let trendFun=new TrendFun();
let TMMS_SESSION_KEY=Navigation.TMMS_SESSION_KEY;

export default class AdminLogin extends React.Component {
    constructor(props, context) {
	super(props);
	this.state = { 
	};
	this.id = (props.location.query) ? props.location.query.error_id : "";
    }
    
    componentDidMount(){
		var error_id= this.id;
		//var appwrap_flag= parseInt($.getURLParam("appwrap"),10);
		if(error_id==403){
			$("#errortip").css({"display":function(i,v){
				$("#error_message").text("<TREND_L10N>LOGIN_JS_TIMEOUT</TREND_L10N>"); //+document.documentMode
				return 'block';
			}});
		}
		
		if(!(navigator.cookieEnabled)){
			$("#errortip").css({"display":function(i,v){
				$("#error_message").text("<TREND_L10N>LOGIN_JS_COOKIE_CLOSE</TREND_L10N>"); //+document.documentMode
				return 'block';
			}});
		}	
		$("#closeBtn").click(function(e) {
				$("#errortip").css({"display":function(i,v){
					$("#error_message").text("");
					return 'none';
				}});
		});
		//if($.browser.msie){
			//if(parseInt($.browser.version)<9){
				//$("#login_btn").buttonBuild({name: "Login",disabled:true});
				//$("#errortip").css({"display":function(i,v){
					//$("#error_message").html("<TREND_L10N>LOGIN_JS_COMPATIBILITY_VIEW</TREND_L10N>"); //+$.browser.version
					//return 'block';
				//}});
			//}else{
				//if(parseInt(document.documentMode,10)<9){
					//$("#login_btn").buttonBuild({name: "Login",disabled:true});
					//$("#errortip").css({"display":function(i,v){
						//$("#error_message").html("<TREND_L10N>LOGIN_JS_COMPATIBILITY_VIEW2</TREND_L10N>"); //+$.browser.version
						//return 'block';
					//}});
				//}
			//}
		//}
		
		$("#username,#password").keyup(function(e){  
			if(e.keyCode==13 || e.which==13){
			   this.clickLogin();
			}
		}.bind(this));
		//DeleteCookie(TMMS_SESSION_KEY);
		trendFun.deleteCookie(TMMS_SESSION_KEY);
			
		$("#login_form_container .message_box .close").bind("click",function(){
			$(this).parent().hide();
		});
	
    
    } 
    ajaxErrorHandler(response,states){
		var tipMessage="<TREND_L10N>LOGIN_JS_UNABLE_TO_ACCESS_SERVER</TREND_L10N>";
		if(response.code && response.code==4000){
			tipMessage="<TREND_L10N>LOGIN_JS_UNABLE_LOGIN</TREND_L10N>";
		}
		if(response.code && response.code==5003){
				window.location.href = 'administration/licenseFirstNewAC.htm?error_id='+response.code;
				return;
		}
		$("#errortip").css({"display":function(i,v){
			$("#error_message").text(tipMessage);
			return 'block';
		}});
    }
    
    clickLogin(){
	if($('#username').val()==""){
		$('#username').focus();
		return;
	}
	if($('#password').val()==""){
		$('#password').focus();
		return;
	}
	
	var request = {
			"username" : $('#username').val(),
			"password" : $('#password').val() //encrypt_with_pkcs7_bf($('#username').val()+VMI_MAGIC_CODE, $('#password').val())
		};
	trendFun.jsPostRequest('account/login/', request,function(response){
		trendFun.setCookie("vmi_dashboard_tip","enable",1);
		trendFun.setCookie("vmi_app_tip","enable",1);
		trendFun.setCookie("TMMS_SESSION_KEY",$('#username').val(),1);
		//if(appwrap_flag==1){
		//	window.location.href = 'apps/appwrap.htm';
		//}else{
			window.location.href = '#/dashboard';
		//}
		return;
	},	this.ajaxErrorHandler);
    }
    
    
    render(){
	return (
		<div className="container-fluid" style={{"background":"#eee"}}>
		<div className="login_form_container">
            <div className="log-on-banner">                
                <div className="log-on-brand">
                    <img className="log-on-brand-logo" src="images/banner_product.png"/>
                </div>
            </div>
            <div className="log-on-form-container">
                <div className="log-on-content">  
                    <div className="alert alert-danger fade in" id="errortip" role="alert" style={{"display":"none"}}>
                          <span id="error_message"></span>
                          <a href="#" className="cancel pull-right" data-dismiss="alert" aria-label="close"><span className="icon icon-cancel"></span></a>
					</div>
                    <h2 className="log-on-title">Log On</h2>  
                    <form className="log-on-form">
                        <div className="form-group">
                            <input autoFocus="" size="32" maxLength="32" className="form-control" id="username" placeholder="User Name or Domain\User Name" type="text"/>
                        </div>
                        <div className="form-group">
                            <input className="form-control" placeholder="Password" id="password" type="password"/>
                        </div>
                        <div className="form-group">
                            <button className="log-on-submit btn btn-danger" type="submit" onClick={this.clickLogin.bind(this)}>Log On</button> 
                        </div>
                    </form>
                </div>
            </div> 
            <footer className="footer">                 
                <a href="#" className="footer-logo hidden-desktop" title="Trend Micro"><img src="images/footer-product-logo.png"/></a>
                <p className="copyright">Copyright © 1999-2016 Trend Micro Incorporated.   All rights reserved.</p>
                <ul className="footer-links">
                    <li><a href="#">Legal Policies &amp; Privacy</a></li>
                    <li><a href="#">Contact us</a></li>
                    <li><a href="#">TrendMicro.com</a></li>
                </ul>
            </footer>
        
		</div>
		</div>
	)
    }

}


