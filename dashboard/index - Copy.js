import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory,browserHistory,IndexRoute,Link } from 'react-router';
//import Button from '../plugs/Button';
import Modal from '../plugs/modal';
import Nav from '../plugs/nav';
import Lang from '../lang/string';
import TrendFun from '../lib/function';


let selectIndex=0;//当前菜单选中那一项从navigation数组0开始
let trendFun=new TrendFun(); //公共函数库
//console.log(trendFun.to_locale_time());

trendFun.setCookie("test_cookie",'123456',10);
//console.log(trendFun.GetCookie("test_cookie"));

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myModal: 1,
      myModal2: 2,
      myModal3: 3,
    };    
  }
  _openModal() {
      $('#myModal'+this.state.myModal).modal();
  }
  _closeModal() {
      $('#myModal'+this.state.myModal).modal('hide');
      alert("你关闭了");
   }
  _saveBtn() {
      alert("你save了");
  }
  _test(){
    alert("你save了");
  }

  render () {
    //const myModalID=this.state.myModal;
    //ReactDOM.render(<Modal modalName={myModalID} closeModal={this._closeModal.bind(this)} saveBtn={this._saveBtn.bind(this)} />, document.getElementById('moday_div'));
    return (
      
      <section>
        <a id="Buttons"></a>
        <h2 className="page-header">React Buttons</h2>

          

          <br/><br/>
          <button type="button" className="btn btn-default btn-icon-only"><span className="fa fa-comment"></span></button>
          <button type="button" className="btn btn-default btn-border"><span className="fa fa-wrench"></span>Settings</button>
          <button type="button" onClick={this._openModal.bind(this)} className="btn btn-danger btn-lg">Open Modal</button>

      </section>
    );
  }
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
	var itemStyleObject={
			"font-size":"10px;",
			"font-family":"Arial, Helvetica, sans-serif;"
	}


class Chartshow extends React.Component {
    constructor(...props) {
      super(...props);
      this.state = {
        chart1: [],
        chart2: []
      };    
    }
//componentWillMount 组件出现前 就是dom还没有渲染到html文档里面
//componentDidMount 组件渲染完成 已经出现在dom文档里

componentDidMount(){ 
        console.log('componentDidMount run time:'+ (new Date()).toLocaleString()); 
        this.chart1();
        //console.log(this.state.chart1);
       
       /*
       this.serverRequest=$.getJSON('ajax_json.json', function(response) { 
                this.setState({
                    datalist: response                
                });
            
        }.bind(this));
        */
};

chart1(){

  trendFun.jsGetRequest('ds_top_user.json', function(res){
          this.setState({
              chart1: res
          });
          this.render_char1(3);

  }.bind(this),function(res){
    $("#chartContainer1").html("<div class='nodata'>Top 5 Users By Online Time (Minutes)"+'</div>'+"<div class='nodatatodisplay'>No data to display.</div>");
  });



}
render_char1(total){
            let res=this.state.chart1;
            console.log('res:');
            console.log(res);
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
              $("#chartContainer1").html("<div class='nodata'>Top 5 Users By Online Time (Minutes)"+'</div>'+"<div class='nodatatodisplay'>No data to display.</div>");
              return;
            }
            new Highcharts.Chart({
                  chart: {
                    renderTo: 'chartContainer1',
                    height:'200',
                    marginTop: 60,
                    marginRight: 30,
                    type: 'bar'
                  },
                  title: {
                    text: "Top 5 Users By Online Time (Minutes)",
                    //align: "left",
                    style:styleObject
                  },
                  subtitle:{
                    text: "(Total users: "+total+')',
                    //align: "right",
                    floating:true,
                    style:subStyleObject
                    //y:15
                  },
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
                  colors: ['#33a02c','#ff7f00','#6a3d9a','#1f78b4','#999999', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
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

    render () {
      //console.log(this.state.chart1);
      return (
          <div className="drilldown_details">
              <div className="chart left">                                
                  <div id="chartContainer1" className="fusionObj"><img src="../images/loading_32X32.gif"/></div>
              </div>
              
              <div className="chart right">
                <div id="chartContainer2" className="fusionObj"><img src="../images/loading_32X32.gif" /></div>
              </div>

              <div className="chart left">
                  <div style={{float: 'left', left: 15 + 'px', position: 'relative',  top: 50 + 'px', zIndex: '1000', marginTop: -20 + 'px' }}>
                      <select id="app_use">
                        <option value="1">Launched Times</option>
                        <option value="2">Duration</option>
                      </select>
                  </div>
                  <div id="chartContainer6" className="fusionObj"><img src="../images/loading_32X32.gif" /></div>
              </div>

            <div className="chart right">
              <div id="chartContainer7" className="fusionObj"><img src="../images/loading_32X32.gif" /></div>
            </div>
              
              <div className="chart left">
                  <div id="chartContainer5" className="fusionObj"><img src="../images/loading_32X32.gif" /></div>
              </div>

              <div className="chart right">
                <div id="chartContainer4" className="fusionObj"><img src="../images/loading_32X32.gif" /></div>
              </div>
              
              <div style={{clear:'both'}}></div>

              <div className="chart all">
                <div id="chartContainer3" className="fusionObj"><img src="../images/loading_32X32.gif"/></div>
              </div>
              
          </div>

      );    
    }

}


let settingBtn=new Example();


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};    
  }
  render () {
    return (
    <div>
      <Nav selectIndex={selectIndex} /> 
      <div id="sb">
        {this.props.children}
      </div>
      <Modal modalName={settingBtn.state.myModal} closeModal={settingBtn._closeModal.bind(settingBtn)} saveBtn={settingBtn._saveBtn.bind(settingBtn)} />
      <Modal modalName={settingBtn.state.myModal2} closeModal={settingBtn._test.bind(settingBtn)} saveBtn={settingBtn._saveBtn.bind(settingBtn)} />
      <Modal modalName={settingBtn.state.myModal3} closeModal={settingBtn._closeModal.bind(settingBtn)} saveBtn={settingBtn._saveBtn.bind(settingBtn)} />
      
    </div>      
    )

  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};    
  }
  render () {
    return (
    <div>
      <Example />
      <Chartshow />
    </div>      
    )

  }
}


class Report extends React.Component {
  
  render () {
    console.log(trendFun.GetCookie("test_cookie"));
    return (
      <div>
      test reqbout
      Reportxxxxxxxxxxxxxxxxxxxx</div>
    );
  }
}
class About extends React.Component {
  render () {
    return (
      <div>
      About {this.props.location.query.id} params:{this.props.params.id}
       {/*about?id=3 得到地址栏参数 后一个得到这样: http://localhost:8888/build/test/router.htm#/about/15*/}
      </div>     
    );
  }
}

let rs=
<Router history={hashHistory}>
    <Route path="/" component={Index}>  
        <IndexRoute component={Dashboard}/>      
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/report" component={Report}/>
        <Route path="/about" component={About}/>
        <Route path="/about/:id" component={About}/>
    </Route>
</Router>;

ReactDOM.render(rs, document.getElementById('container'));

