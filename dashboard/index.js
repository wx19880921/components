import React from 'react';
import ReactDOM from 'react-dom';
import {
	Router,
	Route,
	hashHistory,
	browserHistory,
	IndexRoute,
	Link
}
from 'react-router';
//import Button from '../plugs/Button';
import Modal from '../plugs/modal';
import Nav from '../plugs/nav';
import Lang from '../lang/string';
import TrendFun from '../lib/function';
import DbCss from './dashboard.css';
import Chartshow from './chartshow';
import ProfilesIndex from '../profiles/index';
import EditProfile from '../profiles/edit';
import CreateProfile from '../profiles/create';
import UsersIndex from '../users/index';
import CloudApplications from '../apps/index';
import LocalApplications from '../apps/localapp';
import WallpaperManagement from '../apps/wallpaper';
import ServersIndex from '../servers/index';
import ViewPro from '../servers/viewpro';
import EditServer from '../servers/edit';
import LDAP from '../systemsetting/ldap';
import MobileClient from '../systemsetting/mobileclient';
import ExchangeServer from '../systemsetting/exchangeserver';
import Proxy from '../systemsetting/proxy';
import Syslog from '../systemsetting/syslog';
import Advanced from '../systemsetting/advanced';

import AdminLogin from '../login';
import Global from '../css/vmi-global.css';
import DefaultCss from '../css/default.css';
import DisplayCss from '../css/display.css';
import ResponsiveCss from '../css/responsive.css';
import * as Navigation from '../lib/global.js';

let navigation=Navigation.default;
let selectIndex = 0; //当前菜单选中那一项从navigation数组0开始
let trendFun = new TrendFun(); //公共函数库
//console.log(trendFun.to_locale_time());

trendFun.setCookie("test_cookie", '123456', 10);
//console.log(trendFun.GetCookie("test_cookie"));

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectIndex: 0,
		};
		trendFun.resolve_role_type();
	}

	//changeIndex(index){
	//  this.setState({
	//              selectIndex: index
	//          });
	//}

	render() {
		var breadcrumb;
		var selectIndex = this.props.children.props.route.index;
		navigation.children.map(function(e,i){
			if(e.id==selectIndex){
				breadcrumb = <ol className="breadcrumb"><li className="active">{e.title}</li></ol>
			}
			if(e.id==parseInt(selectIndex/10)){
				e.children.map(function(ee, index){
					if(ee.id==selectIndex)
						breadcrumb = <ol className="breadcrumb">
											<li><a id="breadcrumb_root" href={e.url}>{e.title}</a></li>
											<li className="active">{ee.title}</li>
									 </ol>
				})
			}
		}.bind(this));

		var childIndex = parseInt(selectIndex, 10);
		return (
		<div className="main-container">
				
				<header id="header" role="banner" className="site-header">
					<div  className={Global.banner+''} >
							<a href="../dashboard/index.htm">
								<img src="../img/logo.png" alt="Trend Micro Virtual Mobile Infrastructure" />
								{/*<h1>Trend Micro Virtual Mobile Infrastructure</h1>*/}
							</a>
			
								<ul className="nav navbar-nav navbar-right">
									{/*<li><a href="javascript:;"><span className="icon icon-alert"></span></a></li>*/}
									<li className="dropdown">
										<a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">
											<span className="icon icon-user"></span>{trendFun.GetCookie('TMMS_SESSION_KEY')}<span className="caret"></span>
										</a>
										<ul className="dropdown-menu" role="menu" style={{"right":0}}>
											<li><a href="#">Login Out</a></li>
										</ul>
									</li>
								</ul>
					</div>    
				</header>
				<div className="navigation_menu">
					<div className="navbar navbar-default ">
							<div className="logo_s col-xs-10"><a href=""><img src="../img/logo_mobile.png" style={{"maxWidth":"100%", "height":"50px"}} alt="Trend Micro Virtual Mobile Infrastructure" /></a></div>
							<div className="navbar-header">
								<button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
								</button>
							</div>
							<Nav selectIndex = {childIndex}/>
					</div>
				</div>
				<ACWarning/>
				
			<div>
				<main>
					{breadcrumb}
					{this.props.children}
				</main>
			</div> 
		</div>
		)

	}
}

class ACWarning extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			display: 'none',
			content: '',
			state: 'warning'
		};
	}

	componentDidMount() {
		this.checkAC();
	}

	checkAC() {
		trendFun.jsGetRequest('cfg/license/reminder/', function (response) {
			if (response.code != 0x60010111) {
				trendFun.jsGetRequest('cfg/license/', function (response2) {
					var STATUS = [];
					STATUS[4] = "Your Trend Micro Virtual Mobile Infrastructure has been activated.";
					STATUS[3] = "Your Trend Micro Virtual Mobile Infrastructure license will expire on " + date('m/d/Y', response2.expires) + '.';
					STATUS[2] = "Your Trend Micro Virtual Mobile Infrastructure license expired on " + date('m/d/Y', response2.expires) + " Grace Period: " + response2.grace_period + " month(s).";
					STATUS[1] = "Your Trend Micro Virtual Mobile Infrastructure has expired.";
					if (response.code == 0x60010114) {
						this.setState({
							display: '',
							state: 'warning',
							content: STATUS[3]
						});
					} else if (response.code == 0x60010113) {
						this.setState({
							display: '',
							state: 'warning',
							content: STATUS[2]
						});
					} else if (response.code == 0x60010112) {
						this.setState({
							display: '',
							state: 'danger',
							content: STATUS[1]
						});
					}
				}.bind(this));
			} else {
				//if(GetCookie("vmi_dashboard_tip")=="enable"){
				//dont shwo active success info:Your Trend Micro Virtual Mobile Infrastructure has been activated.
				//$(".info").removeClass("displaynone");
				//$(".info span[class=text_span]").html("==DASHBOARD_JS_LICENSE_4");
				//}
			}
		}.bind(this), function(response, states) {
			//alert(states);
		});
	}
	render() {
		return (
			<div className={"alert alert-"+this.state.state+" fade in"} role="alert" style={{'display': this.state.display}}>
				<span className="icon icon-warn"> </span>
				{this.state.content}
				<a href="javascript:;">More Information</a>
				<a className="cancel pull-right" href="#" data-dismiss="alert" aria-label="close">
					<span className="icon icon-cancel"></span>
				</a>
			</div> 
		)
	}
}

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
				<Chartshow page={this.props.route.page}/>
		)

	}
}

class About extends React.Component {
	render() {
		return (
			 <div>
				About {this.props.location.query.id}
				params: {this.props.params.id}
				{ /*about?id=3 得到地址栏参数 后一个得到这样: http://localhost:8888/build/test/router.htm#/about/15*/
				}
			 </div> 
		);
	}
}


let rs =
<Router history={hashHistory}>
	<Route path="/" component={Index}>
		<IndexRoute index="1" component={Dashboard}/>
		<Route path="dashboard" index="1">
				<IndexRoute index="11"  component={Dashboard} page="1"/>
				<Route path="usage" index="11" component={Dashboard} page="1"/>
				<Route path="system" index="12" component={Dashboard} page="2"/>	
		</Route>
		<Route path="user" index="2">
				<IndexRoute index="21"  component={UsersIndex}/>
				<Route path="users" index="21" component={UsersIndex}/>
				<Route path="devices" index="22"/>		
		</Route>
		<Route path="profiles">
				<IndexRoute index="3" component={ProfilesIndex}/>
				<Route path="edit/:id" index="31" component={EditProfile}/>
				<Route path="create" index="32" component={CreateProfile}/>
		</Route>
		<Route path="applications" index="4">
				<IndexRoute index="41" component={CloudApplications}/>
				<Route path="app" index="41" component={CloudApplications}/>
				<Route path="localapp" index="42" component={LocalApplications}/>
				<Route path="wallpaper" index="43" component={WallpaperManagement}/>
		</Route>
		<Route path="servers" index="5">
				<IndexRoute index="5" component={ServersIndex}/>
				<Route path="viewpro/:id" index="51" component={ViewPro}/>
				<Route path="edit/:id" index="52" component={EditServer}/>
		</Route>
		<Route path="systemsetting" index="9">
				<IndexRoute index="91" component={LDAP}/>
				<Route path="ldap" index="91" component={LDAP}/>
				<Route path="mobileclient" index="92" component={MobileClient}/>
				<Route path="exchangeserver" index="93" component={ExchangeServer}/>
				<Route path="proxy" index="94" component={Proxy}/>
				<Route path="syslog" index="95" component={Syslog}/>
				<Route path="advanced" index="96" component={Advanced}/>
		</Route>
		<Route path="/about" component={About}/>
		<Route path="/about/:id" component={About}/>
	</Route>
	<Route path="/login" component={AdminLogin}></Route>
</Router>;

ReactDOM.render(rs, document.getElementById('container'));

