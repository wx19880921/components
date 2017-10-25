import React from 'react';
import ReactDOM from 'react-dom';
import TrendFun from '../lib/function';
import IndexCss from './index.css';

let trendFun = new TrendFun();

export default class ProfilesIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		profilelist : [],
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
		
	$(".tmmsgbox .close_btn").bind("click", function(){
		$(this).parent().hide("slow",function(){$("#messageboxtipdetail").html('&nbsp;');});
	});

	 //----------------show userlist data begin------------
		
	  $("#button_addprofile").click(function(){
	  	location.href="#/profiles/create?t="+(new Date()).getTime();
	  });
	
	  $("#button_adjust").click(function(){
			popupOpenSave('button_adjust', "<TREND_L10N>PROFILE_JS_CHANGE_PROFILE_ORDER</TREND_L10N>", "adjust_order.htm");
		    return;
			$("#messageboxtipdetail").text("The Selected item(s) has been changed order..");
			$("#messageBox").show("slow");
	  });
	  
	
	  //EADS_check_all
	  $(document).on('click', "#ID_row_container input[type=checkbox][class='cbx']", function(){
		  clickcheckbox();
	  });
	  $(document).on('click', '#EADS_check_all', function(){
		  clickcheckbox();
	  });
	
	  var clickcheckbox=function(){
		  var cbxchecklength=$("#ID_row_container input[type=checkbox][class='cbx']:checked").length;
		  if(cbxchecklength>0){
			  $("#button_delete_profile").removeClass("button_disabled")
		  }else{
			  $("#button_delete_profile").addClass("button_disabled");
		  }
	  
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
			  if (confirm("<TREND_L10N>PROFILE_JS_CONFIRM_DELETE_PROFILE</TREND_L10N>")) {
					var request = {
					 		  "action": "delete",
							  "ids":selectItems()  //"invitation_id_vec":[123, 465]
					};
					trendFun.jsPostRequest('policy/template/batch/', request, function(response) {
						  $("#messageboxtipdetail").text("<TREND_L10N>PROFILE_JS_CONFIRM_DELETE_PROFILE_SUCCESS</TREND_L10N>");
						  $("#messageBox").show("slow");
						  //$.each($("#ID_row_container input[type=checkbox]:checked"),function(i,e){
								//$(this).parent().parent().remove();
						  //});
						  $("#button_delete_profile").addClass('button_disabled')
						  $("#EADS_check_all").attr("checked",false);
						  
						  //$("#ID_row_container td[class=order]").each(function(i, e) {
								//$(this).text(i+1);
  						  //});
						  this.getRead();
						 
						}.bind(this), function() {
							alert("Unable to access server. Check your network connection and try again.");
						});
				    }
		    }
	  }.bind(this));
	
	  this.getRead();
	  //$("#page_size").change(function(){
			//$("#page_index").val('1');
			//this.getRead();
	  //});
	  
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
	  });
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
  
  }
	
	//read data and show pages 
	ID_readData(page_size,page_index){
		  //TREE_GROUP_ID
		  //$("#ID_row_container").empty().append("<tr><td colspan=\"8\"><img src='../images/loading_16X16.gif' /><TREND_L10N>GLOBAL_JS_LOADING</TREND_L10N></td></tr>");
		  var url = 'policy/template/';
		  url += '?page=' + (page_index+1)
		  url += '&page_size=' + page_size
		  
		  
		  trendFun.jsGetRequest(url, function(response){
				//$("#ID_row_container").empty();
				if(response.count<=0){
					//$("#ID_row_container").empty().append("<tr><td colspan=\"8\"><div  class=\"noDataToDisplay\">No data to display.</div></td></tr>");
					$("#page_index").val(page_index);
					$("#EADS_pagecount").text('0');
					$("#EADS_count").text('(0)');
					$("#EADS_pagerendcont").text('0');
					return;
				}
				this.parseID(response);
				//tableSort();
				var tempCurrentpage=page_index+1;
				$("#page_index").val(tempCurrentpage); //input
				var total_count=parseInt(response.count,10);
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
				
				
				
		  }.bind(this), function(){
			  //$("#ID_row_container").empty().append("<tr><td colspan=\"8\"><div  class=\"noDataToDisplay\">No data to display.</div></td></tr>");
			  this.setState({profilelist:[]});
		  });
		 
	}
	  
	getRead(){
		  var page_size=this.state.pageSize;
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
	  
	parseID(IDs){
		var rowState = [];
		//IDs.results.map(function(e, i){
		for(let i=0; i<IDs.results.length; i++) {
			rowState[i] = false;
		}
		//console.log("row"+rowState);
		this.setState({profilelist:(IDs.results), checkboxStatus:rowState});
	} 
  
	handlePageId(event){
		  event.target.val(event.target.value.replace(/\D/g,''));
	}
	
	checkProfileBox(index){
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
	
	checkAllProfiles(){
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
	
	setPageSize(size){
		this.setState({pageSize:parseInt(size,10)},()=>{
			$("#page_index").val('1');
			this.getRead();
		});	
		
	}

	render () {
	  let bodyDiv;
	  if(this.state.profilelist.length == 0)
		  bodyDiv = <tr><td><div  className="noDataToDisplay">No data to display.</div></td></tr>
	  else {
		  var PROFILE_TYPE=[];
		  PROFILE_TYPE[1]="VMI";
		  PROFILE_TYPE[2]="Sandbox";	
		  bodyDiv = this.state.profilelist.map(function(e,index){
		  
			  return (
				  <tr id={"ID_tr_"+e.id} key={e.id} className={this.state.checkboxStatus[index]&&"checked"}>
						{(e.applied_users.length>0 || e.applied_groups.length>0 || e.id == 1) ? 
							<td></td> : 
							<td className="checkBoxAll"><input type="checkbox" defaultValue={e.id} checked={this.state.checkboxStatus[index]} onClick={this.checkProfileBox.bind(this, index)} className="cbx" id={'ID_tr_checkbox_'+e.id}/></td>
						}
						<td className="order visible-lg">{index+1}</td>
						<td id={e.id}>
							<a className="defaultstatus" href={"#/profiles/edit/"+e.id} name={e.name}>{e.name}</a>
						</td>
						<td>{PROFILE_TYPE[e.profile_type]}</td>
						<td className="visible-lg">{e.site_name}</td>
						<td className="visible-lg">{e.applied_users.concat(e.applied_groups).slice(0,50).join(', ')}</td>
						<td className="visible-lg">{trendFun.replaceRevStr(e.detail)}</td>
						<td className="visible-lg">{trendFun.to_locale_time(e.last_modified_time)}</td>
				  </tr>
			  )
		  }.bind(this));
	  }
	  return (
		<div id="profileIndex">
				<div className="messageBox tmmsgbox info displaynone" id="messageBox">
				  <div className="close_btn"></div>
				  <div className="msgcontent">
					<p className="normaltext14">Success</p>
					<p className="normaltext" style={{"marginTop":"10px"}} id="messageboxtipdetail">&nbsp;</p>
				  </div>
				</div>
				
				  <div className="table-with-header table-page" id="profileDiv">
						<div className="toolbar">
							<div className="items-block">
								<button type="button"  id="button_addprofile" className="btn btn-primary"><span className="fa fa-plus"></span>Add</button>
							</div>
							<div className="items-block visible-lg">
								<button type="button" id="button_adjust" className="btn btn-primary"><span className="fa fa-wrench"></span>Change Order</button>
							</div>
							<div className="items-block visible-lg">
								<button type="button" id="button_delete_profile" className="btn btn-primary"><span className="fa fa-trash"></span>Delete</button>
							</div>
						</div>
						<table className="table table-bordered table-hover" id="profileData">
						  <thead>
							  <tr className="sizing_row" style={{"display":"none"}}>
								  <th className="col_1"></th>
								  <th className="col_2 visible-lg"></th>
								  <th className="col_3"></th>
								  <th className="col_3"></th>
								  <th className="col_3 visible-lg"></th>
								  <th className="col_4 visible-lg"></th>
								  <th className="col_5 visible-lg"></th>
								  <th className="col_6 visible-lg"></th>
							  </tr>
							  <tr className="header_title">
								  <th className="checkBoxAll"><input type="checkbox" id="EADS_check_all" checked={this.state.checkAll} onClick={this.checkAllProfiles.bind(this)} className="check_all_checkbox"/></th>
								  <th className="visible-lg"><div className="column_title">Order</div></th>
								  <th><div className="column_title">Profile Name</div></th>
								  <th><div className="column_title">Profile Type</div></th>
								  <th className="visible-lg"><div className="column_title">Site Name</div></th>
								  <th className="visible-lg"><div className="column_title">Applied Users/Groups</div></th>
								  <th className="visible-lg"><div className="column_title">Description</div></th>
								  <th className="visible-lg"><div className="column_title">Last Modified</div></th>
							  </tr>
						  </thead>
						  <tbody className="row_container" id="ID_row_container">
							{bodyDiv}
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
		</div>
  
	  );
	}
}

