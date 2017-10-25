import React from 'react';
import ReactDOM from 'react-dom';
export default class ProfilesIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};    
  }

  render () {
    //const myModalID=this.state.myModal;
    //ReactDOM.render(<Modal modalName={myModalID} closeModal={this._closeModal.bind(this)} saveBtn={this._saveBtn.bind(this)} />, document.getElementById('moday_div'));
    return (
      <div>  
      <table className="table table-bordered table-hover table-sortable">
      <thead>
        <tr>
          <th className="gutter">
          <div className="checkbox">
            <input type="checkbox" name="tablecheckboxs" id="tablecheckboxs1" className="input-checkbox checkbox-partial"/>
            <label htmlFor="tablecheckboxs1"></label>
          </div>
          </th>
          <th className="sortabled">Deployment Plan <span className="glyphicon glyphicon-sort-by-alphabet" aria-hidden="true"></span></th>
          <th>Type</th>
          <th>Appliance</th>
          <th>Deployed</th>
          <th>Creator</th>
        </tr>
      </thead>
      <tbody>
        <tr className="active">
          <td scope="row">
            <div className="checkbox">
              <input type="checkbox" name="tablecheckboxs" id="tablecheckboxs2" className="input-checkbox checked"/>
              <label htmlFor="tablecheckboxs2"></label>
            </div>
          </td>
          <td>Hotfix_DDEI</td>
          <td>Hotfix</td>
          <td>8</td>
          <td>2016/06/02 23:15:00</td>
          <td>Administrator</td>
        </tr>
        <tr>
          <td scope="row">
            <div className="checkbox disabled">
              <input type="checkbox" name="tablecheckboxs" id="tablecheckboxs3" className="input-checkbox disabled" disabled=""/>
              <label htmlFor="tablecheckboxs3"></label>
            </div>
          </td>
          <td>Hotfix_DDI_01</td>
          <td>Virtual Analyzer image</td>
          <td>12</td>
          <td>2016/04/18 23:17:20</td>
          <td>Administrator</td>
        </tr>
        <tr>
          <td scope="row">
            <div className="checkbox disabled">
              <input type="checkbox" name="tablecheckboxs" id="tablecheckboxs4" className="input-checkbox disabled" disabled=""/>
              <label htmlFor="tablecheckboxs4"></label>
            </div>
          </td>
          <td>TW_Patch_01_DDI</td>
          <td>Firmware</td>
          <td>29</td>
          <td>2016/04/17 21:20:18</td>
          <td>Operator</td>
        </tr>
      </tbody>
    </table>

   <div className="table-pagination">
      <div className="table-pagination-block">
        <div className="pagination-records">Records: 1-25 / 250</div>
        <div className="dropdown">
          <button className="btn btn-xs btn-link dropdown-toggle" data-toggle="dropdown" type="button">
            25 per page <span className="caret"></span>
          </button>
          <ul className="dropdown-menu dropdown-menu-multi-select">
            <li><a href="javascript:;">10</a></li>
            <li className="selected"><a href="javascript:;">25</a></li>
            <li><a href="javascript:;">50</a></li>
            <li><a href="javascript:;">100</a></li>
          </ul>
        </div>
        <div className="pagination-input"><input type="text" defaultValue="1"/> / 20</div>
        <div>
          <ul className="pagination">
            <li>
              <a href="javascript:;" aria-label="Previous">
                <span className="fa fa-angle-left" aria-hidden="true"></span>
              </a>
            </li>
            <li>
              <a href="javascript:;" aria-label="Next">
                <span className="fa fa-angle-right" aria-hidden="true"></span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>

    );
  }
}

