
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory,browserHistory,IndexRoute,Link } from 'react-router';


class App extends React.Component {
  render () {
    return (
      <div>
      app:{this.props.children}
       <ul>
          <li><Link to="/about">about</Link></li>
          <li><Link to='/report'>report</Link></li>
          <li><Link to='/about/15'>/report/15</Link></li>
          
        </ul>
      
      </div>
    );
  }
}
class Report extends React.Component {
  render () {
    return (
      <div>Report</div>
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
    <Route path="/" component={App}>
        <IndexRoute component={Report}/>
        <Route path="/report" component={Report}/>
        <Route path="/about" component={About}/>
        <Route path="/about/:id" component={About}/>
    </Route>
</Router>;

ReactDOM.render(rs, document.getElementById('container'));

