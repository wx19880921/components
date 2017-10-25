import React from 'react';
import ReactDOM from 'react-dom';
import TrendFun from '../lib/function';
let trendFun=new TrendFun();

var styleObject={
			"font-size":"14px;",
			"color":"#222222",
			"font-family":"Arial, Helvetica, sans-serif;"
	}
	var subStyleObject={
			"font-size":"12px;",
			"color":"#777777",
			"font-family":"Arial, Helvetica, sans-serif;"
	}
	var itemStyleObject={
			"font-size":"10px;",
			"font-family":"Arial, Helvetica, sans-serif;"
	}


$(function(){
	(function (H) {
        if (/Trident.*?11\.0/.test(navigator.userAgent)) {
            H.wrap(H.Legend.prototype, 'positionItem', function (proceed, item) {
                var legend = this;
                setTimeout(function () {
                    proceed.call(legend, item);
                });
            });
        }
}(Highcharts));
	
})


class Usageoverview extends React.Component {
	constructor(...props) {
      super(...props);
      this.state = {
		usercount: 0,
      };    
    }
	
	componentDidMount(){ 

		this.chart1();
		this.chart2();
		this.chart6();
		this.chart7();
	}
	
	chart1(){
		trendFun.jsGetRequest('dashboard/topuser/?limit=5', function(res){
				this.setState({
					chart1: res
				});
	
				trendFun.jsGetRequest('account/usercount/', function(res){
					this.render_char1(res);
					this.setState({usercount: res});
				}.bind(this),function(){
				  this.render_char1(0);
				});         
				//this.render_char1(3);
	
		}.bind(this),function(res){
			$("#chartContainer1").html("<div class='nodatatodisplay'>No data to display.</div>");
		});
	}
	render_char1(total){
				let res=this.state.chart1;
				//console.log('res:');
				//console.log(res);
				var chart5data=[];	
				var Categories=[];
				var total_online_time=0;
				var temphour=0;
				$.each(res.results,function(i,e){
				  Categories.push(e.username);
				  temphour=Math.floor(e.total_online_time/60);
				  chart5data.push([e.username,temphour]);
				  total_online_time+=e.total_online_time;
				});
				if(total_online_time==0){
				  $("#chartContainer1").html("<div class='nodatatodisplay'>No data to display.</div>");
				  return;
				}
				new Highcharts.Chart({
					  chart: {
						renderTo: 'chartContainer1',
						height:'248',
						marginTop: 30,
						marginRight: 30,
						type: 'bar'
					  },
					  
					  title: {
						text: null,
						align: "left",
						style:styleObject,
						useHTML:true,
						margin:0,
					  },/*
					  subtitle:{
						text: "==(Total users: "+total+')',
						align: "left",
						floating:false,
						style:subStyleObject,
						margin:0,
						y:-5,
						x:60,
					  },*/
					  xAxis: {
								categories: Categories,
								title: {
									text: null
								}
							},
					  yAxis: {
						min: 1,
						allowDecimals:false,
						title:{
						  text:null
						}
					  },								
					  colors: ['#33abd6','#33ba72','#fe9967','#45cce7','#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a'],
					  tooltip: {
						formatter: function() {
						  //return this.x +' '+ this.y+ "";
						  return  this.x +' '+ trendFun.formatSeconds2(this.y*60)+ "";
						}
					  },
					  legend:{
						enabled:false,
						align: "right",
						layout:"vertical",
						itemStyle:itemStyleObject,
						labelFormatter:function(){
							  return this.name+': '+Highcharts.numberFormat(this.y,0)+" users";
						}
					  },
					  credits:{
						enabled:false
					  },
					  exporting:{ 
						enabled:false //set print and export
					  },
					  series: [{
						type: 'bar',
						name: 'Top 5 Users',
						data:chart5data
					  }]
				});
	}
	chart2(){
		trendFun.jsGetRequest('dashboard/user/', function(res){
				this.setState({
					chart2: res
				});
				this.render_char2(res);
	
		}.bind(this),function(res){
			$("#chartContainer2").html("<div class='nodatatodisplay'>No data to display.</div>");
		});
	}
	render_char2(res){
          //var res=this.state.chart2;
					var user_count = 0;
					var chart5data=new Array();	
					var status=-1;
					$.each(res.results,function(i,e){
						if(e.key=='Active'){
							e.key="Active";
							status=2;
						}else if(e.key=='Idle'){
							e.key="Idle";
							status=1;
						}else if(e.key=='Offline'){
							e.key="Offline";
							status=0;
						}else if(e.key=='Disabled'){
							e.key="Disabled";
							status=3;
						}
						chart5data.push([e.key,e.value,status]);
						user_count += e.value;
					});
					if(user_count==0){
						$("#chartContainer2").html("<div class='nodatatodisplay'>No data to display.</div>");
						return;
					}
          //alert(user_count);
					new Highcharts.Chart({
								chart: {
									renderTo: 'chartContainer2',
									height:'248',
									plotBackgroundColor: null,
									plotBorderWidth: null,
									plotShadow: false
								},
								title: {
									text: null,
									//align: "left",
									style:styleObject
								},/*
								subtitle:{
									text: "==(Total users: "+user_count+')',
									//align: "right",
									floating:true,
									style:subStyleObject
									//y:15
								},*/
								colors: ['#33ba72','#fe9967','#bbbbbb','#e56669','#45cce7', '#7883e5', '#09dab7', '#b2d56a', '#faca2a', '#e07ad3'],
								tooltip: {
									formatter: function() {
										return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +'% (' + Highcharts.numberFormat(this.y,0)+" Users) ";
									}
								},
								plotOptions: {
									pie: {
										allowPointSelect: true,
										cursor: 'pointer',
										dataLabels: {
											enabled: false,
											formatter:function(){
												return'<b>'+this.point.name+'</b>: '+ Highcharts.numberFormat(this.y,0)+'==Users';
											}
										},
										events: {
											click: function(e) {
												//console.log(e);
												location.href = '../users/index.htm?status='+e.point.config[2]; //
												return;
											}
										},
										point: {
												events: {
													legendItemClick: function(e) {
														//console.log(this);
														location.href = '../users/index.htm?status='+this.config[2]; //
														return false;
													}
												}
										},										
										showInLegend: true
									}
									
								},
								legend:{
									enabled:true,
									//align: "right",
									//layout:"vertical",
									itemStyle:itemStyleObject,
									labelFormatter:function(){
												return this.name+' ('+Highcharts.numberFormat(this.y,0)+")";
									}
								},
								credits:{
									enabled:false
								},
								exporting:{ 
								   enabled:false //set print and export
								},
								series: [{
									type: 'pie',
									name: 'User Status',
									data:chart5data
								}]
					});
				
	}

  chart6(total,stype){
        
        $("#app_use").on("change",function(e){
          let stype=$("#app_use").val(); //dont use $(this)
          this.render_chart6(this.state.app_count,stype);          
        }.bind(this));
        
        trendFun.jsGetRequest('app/appcount/', function(res){
                  this.setState({
                    app_count: res
                  });
                  this.render_chart6(res,1);

          }.bind(this),function(res){
              $("#chartContainer6").html("<div class='nodatatodisplay'>No data to display.</div>");
          });
  }

	 render_chart6(total,stype){  
     let url=(stype==1 ? 'dashboard/topapp/?limit=5':"dashboard/used_app/?limit=5");
     trendFun.jsGetRequest(url, function(res){
            
            //this.render_char2(res);
					var chart5data=new Array();	
					var Categories=new Array();
					var Categories2=new Array();
					var total_launch_number=0;
					$.each(res.results,function(i,e){
						Categories.push(e.name.substr(0,10));
						Categories2.push(e.name);
						if(stype==1){
							chart5data.push([e.name,e.launch_number]); 
							total_launch_number+=e.launch_number;
						}else{
							chart5data.push([e.name,e.use_time/60]);
							total_launch_number+=e.use_time;
						}
					});
					var title="Top 5 Applications Used (Launched Times)";
					if(stype==2){
						title="Top 5 Applications Used (Minutes)";
					}
					this.setState({chart6title: title, appcount: total});
					
					var from_min=0;
					if(total_launch_number==0){
						from_min=1;
					}
					if(total==0 || total_launch_number==0){
						$("#chartContainer6").html("<div class='nodatatodisplay'>No data to display.</div>");
						return;
					}
					new Highcharts.Chart({
								chart: {
									renderTo: 'chartContainer6',
									height:'248',
									marginTop: 30,
									marginRight: 30,
									type: 'bar'
								},
								title: {
									text: null,
									//align: "left",
									style:styleObject
								},/*
								subtitle:{
									text: "==(Total mobile apps: "+total+')',
									//align: "right",
									floating:true,
									style:subStyleObject
									//y:15
								},*/
								 xAxis: {
                					categories: Categories,
                					title: {
                    					text: null
                					}
            					},
								yAxis: {
									min: from_min,
									allowDecimals:false,
									title:{
										text:null
									}
								},								
								colors: ['#33abd6','#33ba72','#fe9967','#45cce7','#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a'],
								tooltip: {
									formatter: function() {
										var x=this.x;
										$.each(Categories2,function(i,e){
											if(x==e.substr(0,10)){
												x=e;
												return false;
											}
										});
										if(stype==1){
											return  x +' '+ this.y+ "";
										}else{
											return  x +' '+ trendFun.formatSeconds2(this.y*60)+ "";
										}
										//return '<b>'+ this.series.name +'</b>'+ this.x +' '+ this.y+ "";
									}
								},
								legend:{
									enabled:false,
									//align: "right",
									//layout:"vertical",
									itemStyle:itemStyleObject,
									labelFormatter:function(){
												return this.name+': '+Highcharts.numberFormat(this.y,0)+" users";
									}
								},
								credits:{
									enabled:false
								},
								exporting:{ 
								   enabled:false //set print and export
								},
								series: [{
									type: 'bar',
									name: 'Top 5 Applications Used',
									data:chart5data
								}]
					});
          //end
		}.bind(this),function(res){
			$("#chartContainer6").html("<div class='nodatatodisplay'>No data to display.</div>");
		});

      
	}


  //chart webclip begin
  chart7(){
        trendFun.jsGetRequest('app/webclipcount/', function(res){        
				this.setState({webappcount: res});
				this.render_chart7(res);
          }.bind(this),function(res){
              $("#chartContainer7").html("<div class='nodatatodisplay'>No data to display.</div>");
          });  
  }

  render_chart7(total){ 
      let url='dashboard/topwebclip/?limit=5';
      trendFun.jsGetRequest(url, function(res){			
					var chart5data=new Array();	
					var Categories=new Array();
					var Categories2=new Array();
					var total_launch_number=0;
					$.each(res.results,function(i,e){
						Categories.push(e.name.substr(0,10));
						Categories2.push(e.name);
						chart5data.push([e.name,e.launch_number]);
						total_launch_number+=e.launch_number;
					});
					if(total==0){
						$("#chartContainer7").html("<div class='nodatatodisplay'>No data to display.</div>");
						return;
					}
					
					var from_min=0;
					if(total_launch_number==0){
						from_min=1;
					}
					new Highcharts.Chart({
								chart: {
									renderTo: 'chartContainer7',
									height:'248',
									marginTop: 30,
									marginRight: 30,
									type: 'bar'
								},
								title: {
									text: null,
									//align: "left",
									style:styleObject
								},
								 xAxis: {
                					categories: Categories,
                					title: {
                    					text: null
                					}
            					},
								yAxis: {
									allowDecimals:false,
									title:{
										text:null
									},
									min:from_min
								},								
								colors: ['#33abd6','#33ba72','#fe9967','#45cce7','#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a', '#e07ad3'],
								tooltip: {
									formatter: function() {
										var x=this.x;
										$.each(Categories2,function(i,e){
											if(x==e.substr(0,10)){
												x=e;
												return false;
											}
										});
										return  x +' '+ this.y+ "";
										//return '<b>'+ this.series.name +'</b>'+ this.x +' '+ this.y+ "";
									}
								},
								legend:{
									enabled:false,
									//align: "right",
									//layout:"vertical",
									itemStyle:itemStyleObject,
									labelFormatter:function(){
												return this.name+': '+Highcharts.numberFormat(this.y,0)+" users";
									}
								},
								credits:{
									enabled:false
								},
								exporting:{ 
								   enabled:false //set print and export
								},
								series: [{
									type: 'bar',
									name: 'Top 5 Web Clips Used',
									data:chart5data
								}]
					});
					//var timepolling=setTimeout(function(){chart1()},30000);
      });
  }

	render(){
		return (
			<div id="usage">
		      
				<div className="drilldown_details">
					<div className="chart left">  
						<h3 className="segment-panel-title">Top 5 Users By Online Time (Minutes) <span className="subtitle visible-lg">(Total users: {this.state.usercount})</span></h3>
						<div id="chartContainer1" className="fusionObj"><span className="loader loader-large"></span></div>
					</div>
					
					<div className="chart right">
						<h3 className="segment-panel-title">User Status <span className="subtitle visible-lg">(Total users: {this.state.usercount})</span></h3>
						<div id="chartContainer2" className="fusionObj"><span className="loader loader-large"></span></div>
					</div>
					
					<div style={{clear:'both'}}></div>
					
					<div className="chart left">
						<h3 className="segment-panel-title">{this.state.chart6title} <span className="subtitle visible-lg">(Total mobile apps: {this.state.appcount})</span></h3>

						<div style={{float: 'right', right: 15 + 'px', position: 'relative',  top: 70 + 'px', zIndex: '1', marginTop: -20 + 'px' }}>
							<select id="app_use" className="visible-lg">
							  <option value="1">Launched Times</option>
							  <option value="2">Duration</option>
							</select>
						</div>
						<div id="chartContainer6" className="fusionObj"><span className="loader loader-large"></span></div>
					</div>
			  
					<div className="chart right">
						<h3 className="segment-panel-title">Top 5 Web Clips Used (Launched Times) <span className="subtitle visible-lg">(Total web apps: {this.state.webappcount})</span></h3>
						<div id="chartContainer7" className="fusionObj"><span className="loader loader-large"></span></div>
					</div>
					
					<div style={{clear:'both'}}></div>
					
				</div>

		      </div> );
	}
}

class Systemstatus extends React.Component {
	constructor(...props) {
      super(...props);
      this.state = {
      };    
    }
	
	componentDidMount(){ 
			this.chart3();
			this.chart4();
			this.chart5(); 
	}
	
	chart3(){			
	  trendFun.jsGetRequest('dashboard/memory/', function(res){	
					var chart5data=new Array();	
					var total=0;
					$.each(res.results,function(i,e){
						if(e.key=='Free'){
							e.key="Free";
						}else if(e.key=='Used'){
							e.key="Used";
						}
						chart5data.push([e.key,e.value]);
						total+=e.value;
					});
					
					this.setState({chart3total: Highcharts.numberFormat(total,0)});
					new Highcharts.Chart({
								chart: {
									renderTo: 'chartContainer4',
									height:'248',
									plotBackgroundColor: null,
									plotBorderWidth: null,
									plotShadow: false
								},
								title: {
									text: null,
									//align: "left",
									style:styleObject
								},
								colors: ['#bbbbbb','#fe9967','#33ba72','#45cce7','#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a', '#e07ad3'],
								
								tooltip: {
									formatter: function() {
										return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +'% (' + Highcharts.numberFormat(this.y,0)+" MB) ";
									}
								},
								plotOptions: {
									pie: {
										allowPointSelect: true,
										cursor: 'pointer',
										dataLabels: {
											enabled: false,
											formatter:function(){
												return'<b>'+this.point.name+'</b>: '+ Highcharts.numberFormat(this.y,0)+'MB';
											}
										},
										showInLegend: true
									}
								},
								credits:{
									enabled:false
								},
								legend:{
									enabled:true,
									//align: "right",
									//layout:"vertical",
									itemStyle:itemStyleObject,
									labelFormatter:function(){
												return this.name+': '+Highcharts.numberFormat(this.y,0)+" MB";
									}
								},
								exporting:{ 
								   enabled:false //set print and export
								},
								series: [{
									type: 'pie',
									name: 'Memory Usage',
									data:chart5data
								}]
	
	
					});			
	  }.bind(this));
	}
	//chart3();

	// line charts	 of cpu
		chart4(){    
			trendFun.jsGetRequest('dashboard/cpu/', function(res){
					var chart5data=new Array();	
					var Categories=new Array();
					var Values=new Array();
					var max_Y=0;
					$.each(res.results,function(i,e){
						Categories.push(trendFun.date("H:i",e.key));
						var temp1=e.value.toFixed(1);
						Values.push(parseFloat(temp1));
						if(e.value>max_Y) max_Y=e.value;
					});
					max_Y=parseInt(max_Y.toFixed(0))+1;
					if(max_Y>100){
						max_Y=100;
					}
					chart5data.push({name:"CPU",data:Values});
					var step=Math.floor(res.results.length/10);   
					///* Math.ceil*/
					new Highcharts.Chart({
								chart: {
									renderTo: 'chartContainer3',
									height:'248',
									type: 'line'
								},
								title: {
									text: null,
									style:styleObject
								},
								xAxis: {
									categories:Categories, // ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']\
									 //tickInterval: 2,
									 labels: {
           								 step: step
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
										color: '#e56669'
									}]
								},
								tooltip: {
									enabled:true,
									formatter: function() {
											return '<b>'+ this.series.name +'</b><br/>'+ this.x +' '+ this.y+ "%";
									}
								},
								plotOptions:{
									line: {
										lineWidth: 2,
										states: {
											hover: {
												lineWidth: 2
											}
										},
										marker: {
											enabled: true
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
          /*
					STAYTIME++;
					if(STAYTIME>40){ //800'
						location.href="../login.htm?error_id=403";
						return false;
					}*/
					//var timepolling=setTimeout(function(){chart4()},20000);			
		});
    //uncaught exception: Highcharts error #13: www.highcharts.com/errors/13
    //var timepolling=setTimeout(()=>this.chart4(),60*1000);
	}

	//chart4();	

    //pie charts	 of Storage
	chart5(){
			trendFun.jsGetRequest('dashboard/storage/', function(res){
					var chart5data=new Array();	
					var total=0;
					$.each(res.results,function(i,e){
						if(e.key=='Free'){
							e.key="Free";
						}else if(e.key=='Used'){
							e.key="Used";
						}
						chart5data.push([e.key,e.value]);
						total+=e.value;
					});
					
					this.setState({chart5total: Highcharts.numberFormat(total,0)});
					new Highcharts.Chart({
								chart: {
									renderTo: 'chartContainer5',
									height:'248',
									plotBackgroundColor: null,
									plotBorderWidth: null,
									plotShadow: false
								},
								title: {
									text: null,
									//align: "left",
									style:styleObject
								},
								colors: ['#bbbbbb','#33ba72','#fe9967','#45cce7','#e56669', '#7883e5', '#09dab7', '#b2d56a', '#faca2a'],
								tooltip: {
									formatter: function() {
										return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +'% (' + Highcharts.numberFormat(this.y,0)+" MB) ";
									}
								},
								plotOptions: {
									pie: {
										allowPointSelect: true,
										cursor: 'pointer',
										dataLabels: {
											enabled: false,
											formatter:function(){
												return'<b>'+this.point.name+'</b>: '+Highcharts.numberFormat(this.y,0)+"GB";
											}
										},
										showInLegend: true
									}
								},
								legend:{
									enabled:true,
									//align: "right",
									//layout:"vertical",
									itemStyle:itemStyleObject,
									labelFormatter:function(){
												return this.name+': '+Highcharts.numberFormat(this.y,0)+" MB";
									}
								},
								credits:{
									enabled:false
								},
								exporting:{ 
								   enabled:false //set print and export
								},
								series: [{
									type: 'pie',
									name: 'Storage Usage',
									data:chart5data
								}]
					});				
			}.bind(this));
	};

	render(){
		return (
			<div id="system">
				<div className="drilldown_details">
					<div className="chart left">
						<h3 className="segment-panel-title">Storage Usage of All Servers <span className="subtitle visible-lg">(Total: {this.state.chart5total} MB)</span></h3>
						<div id="chartContainer5" className="fusionObj"><span className="loader loader-large"></span></div>
					</div>
			  
					<div className="chart right">
						<h3 className="segment-panel-title">Memory Usage of All Servers <span className="subtitle visible-lg">(Total: {this.state.chart3total} MB)</span></h3>
						<div id="chartContainer4" className="fusionObj"><span className="loader loader-large"></span></div>
					</div>
					
					<div style={{clear:'both'}}></div>
			  
					<div className="chart all">
						<h3 className="segment-panel-title">CPU Usage Trend of All Servers</h3>
						<div id="chartContainer3" className="fusionObj"><img src="../img/loading_32X32.gif"/></div>
					</div>
					
					<div style={{clear:'both'}}></div>
				</div>
			</div>
		);
	}

}

export default class Chartshow extends React.Component {
    constructor(...props) {
      super(...props);
      this.state = {
        chart1: [],
        chart2: [],
        app_count:0,
	display: 0
      };    
    }
//componentWillMount 组件出现前 就是dom还没有渲染到html文档里面
//componentDidMount 组件渲染完成 已经出现在dom文档里 可以操作dom
componentWillMount(){
  console.log('componentWillMount run time:'+ (new Date()).toLocaleString()); 
}
componentDidMount(){ 
        //console.log('componentDidMount run time:'+ (new Date()).toLocaleString()); 
	$(".breadcrumb").css("background","#eeeeee");
	$(".breadcrumb").css("border-color","#eeeeee");
	//$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		////获取已激活的标签页的名称
		////var activeTab = $(e.target).text();
		//if(this.state.display == 0){
			//this.chart3();
			//this.chart4();
			//this.chart5(); 
			//this.state.display = 1;
		//}
        //}.bind(this));
};
componentWillUnmount(){ 
        //console.log('componentDidMount run time:'+ (new Date()).toLocaleString()); 
	$(".breadcrumb").css("background","transparent");
	$(".breadcrumb").css("border-color","transparent");
	//$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		////获取已激活的标签页的名称
		////var activeTab = $(e.target).text();
		//if(this.state.display == 0){
			//this.chart3();
			//this.chart4();
			//this.chart5(); 
			//this.state.display = 1;
		//}
        //}.bind(this));
};
	

	//chart5();
	
    
   render () {
		var show1 = this.props.page==1?"":"none";
		var show2 = this.props.page==2?"":"none";
      //console.log(this.state.chart1);
		if(this.props.page==2)       
			return (
			  <div className="ui-tabs" className="container-fluid" style={{"backgroundColor":"#eeeeee"}}>
					<Systemstatus />
			  </div>      
			);
		else
			return (
			  <div className="ui-tabs" className="container-fluid" style={{"backgroundColor":"#eeeeee"}}>
					<Usageoverview />
			  </div>      
			);
    }

}