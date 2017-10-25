import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory,browserHistory,IndexRoute,Link } from 'react-router';
//import $ from 'jquery';
import Global from '../css/vmi-global.css';
//import Navigation,{TMMS_WEB_ROOT as api} from '../lib/global.js';
import * as Navigation from '../lib/global.js';
/*第一个是导出默认成员， 后一个是导出发webroot 重命名为api*/
//console.log(Navigation);
let navigation=Navigation.default;

export default class Nav extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			navExpand: false,
			selectedItem: 0,
			showItem: 0,
		};
    }
	
	componentDidMount(){
		let selectIndex = this.props.selectIndex;
	    if(selectIndex>10)
		    this.setState({showItem:parseInt(selectIndex/10)});
		else
			this.setState({showItem:selectIndex});
			
		if(document.body.clientWidth<767){
			$("#navigation-items li ul").addClass("collapse");
			$("#navigation-items li ul").removeClass("dropdown-menu");
		}
		
		$(window).resize(function() {
			if(document.body.clientWidth<767){
				$("#navigation-items li ul").addClass("collapse");
				$("#navigation-items li ul").removeClass("dropdown-menu");
				if($("#navbar-main").hasClass("in"))
					$(".navbar-toggle").click();
			}
			else{
				$("#navigation-items li ul").addClass("dropdown-menu");
				$("#navigation-items li ul").removeClass("collapse");
			}
		});
	}
	
	changeItem(id){
		this.setState({selectedItem:id, showItem:id});	
		$(".navbar-toggle").click();
	}
	
	selectItem(id){
		this.setState({selectedItem:id});	
	}
    
	createMenu(){
  
		let selectIndex= this.props.selectIndex; //当前菜单选中那一项从navigation数组0开始    
		let childrenDiv;
			if(navigation.children){
				childrenDiv = navigation.children.map(function(e,i){
					//console.log(e.title);
					if(e.children.length==0 || e.showchild=="none"){
						var selected = (e.id==this.state.selectedItem || e.id==this.state.showItem);
						return (
							<li key={i} onClick={this.changeItem.bind(this, e.id)} className={selected?'active firstlevel':'firstlevel'}>
								<a href={e.url}>
									<i className={"nav-icon-"+e.id}></i>
									<span>{e.title}</span>
								</a>
							</li>);
					}else{
							var isShow = (e.id==this.state.selectedItem?"":"none");
							var selected = (e.id==this.state.selectedItem || e.id==this.state.showItem);
							return (
								<li key={i} onClick={this.selectItem.bind(this, e.id)} data-toggle={this.state.navExpand==true?"collapsed":""} className={selected?'active firstlevel dropdown':'firstlevel dropdown'}>
									<a href="#" className="dropdown-toggle collapse" data-toggle="dropdown" role="button" aria-expanded="false" aria-haspopup="true" data-parent="#navigation-items" data-target={"#sub-navigation-items"+e.id}>
										{e.title}									
									</a> 
									<ul className="dropdown-menu open" id={"sub-navigation-items"+e.id} role="menu" aria-expanded="false">
										{e.children.map(function(ee,ii){
											if(ee.status=="show")
											 return (<li onClick={this.changeItem.bind(this, e.id)} className={ee.id==selectIndex?"page-item active":"page-item"} key={ii}><a href={ee.url}>{ee.title}</a></li>);
											}.bind(this))
										}
									</ul>
								</li>
							)
					}
				}.bind(this));
	
			}
			
		return childrenDiv;  
	  
  }
  
  changeNav(){
	
	if(this.state.navExpand == true)
		this.setState({navExpand:0, selectedItem:0});
	else
		this.setState({navExpand:1});
  }
  
  render() {   
	let contentDiv = this.createMenu();
    return (
		
		<div className="navbar-collapse collapse col-xs-12" id="navbar-main">
			<nav id="vmi-navigation" className="navlist navbar-nav">
					{/* Brand and toggle get grouped for better mobile display */}
					{/* <div className="navbar-header">*
							<button type="button" className="sidebar-toggle" onClick={this.changeNav.bind(this)} type="button">
								<span className="sr-only"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<a className="navbar-brand" href="#">
							</a>  */}
						{/* </div>*/}
		
						{/* Collect the nav links, forms, and other content for toggling */}
						<ul className="list-unstyled nav navbar-nav" id="navigation-items">
							
								{contentDiv}
										   
							
						</ul> 
			</nav>
		</div>
		)
  }
}
