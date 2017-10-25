import React from 'react';
import ReactDOM from 'react-dom';
import { Modal,Button } from 'react-bootstrap';
import TrendFun from '../lib/function';

let trendFun=new TrendFun();
var g_ldap_enabled = false;
var g_outh_enabled = false;
var old_password = "";
var DEFAULT_DATA =
    {
        ldap_host:"",
        ldap_base_dn:"",
        ldap_user:"",
        ldap_password:"",
        ldap_use_tls:"False",
        ldap_sync_frequency:"240",
        ldap_group_attr_map_email:"mail",
        ldap_user_attr_map_first_name:"givenName",
        ldap_user_attr_map_last_name:"sn",
        ldap_group_attr_map_email:"mail"
    };

var DIFF_DEFAULT_DATA =
    {
        ad:
        {
            ldap_port:"389",
            ldap_tls_port:"636",
            ldap_group_search_filter:"(objectClass=group)",
            ldap_group_attr_map_user:"member",
            ldap_user_search_filter:"(objectClass=person)",
            ldap_user_attr_map_username:"sAMAccountName"
        },
        apache:
        {
            ldap_port:"10389",
            ldap_tls_port:"10636",
            ldap_group_search_filter:"(objectClass=groupOfUniqueNames)",
            ldap_group_attr_map_user:"uniqueMember",
            ldap_user_search_filter:"(objectClass=person)",
            ldap_user_attr_map_username:"cn"
        },
        389:
        {
            ldap_port:"389",
            ldap_tls_port:"636",
            ldap_group_search_filter:"(objectClass=groupOfName)",
            ldap_group_attr_map_user:"member",
            ldap_user_search_filter:"(objectClass=inetOrgPerson)",
            ldap_user_attr_map_username:"uid"
        },
        tivoli:
        {
            ldap_port:"389",
            ldap_tls_port:"636",
            ldap_group_search_filter:"(objectClass=groupOfUniqueNames)",
            ldap_group_attr_map_user:"uniqueMember",
            ldap_user_search_filter:"(objectClass=person)",
            ldap_user_attr_map_username:"uid"
        },
        novell:
        {
            ldap_port:"389",
            ldap_tls_port:"636",
            ldap_group_search_filter:"(objectClass=groupOfName)",
            ldap_group_attr_map_user:"member",
            ldap_user_search_filter:"(objectClass=person)",
            ldap_user_attr_map_username:"cn"
        },
        openldap:
        {
            ldap_port:"389",
            ldap_tls_port:"636",
            ldap_group_search_filter:"(objectClass=groupOfUniqueNames)",
            ldap_group_attr_map_user:"uniqueMember",
            ldap_user_search_filter:"(objectClass=inetOrgPerson)",
            ldap_user_attr_map_username:"cn"
        },
        others:
        {
            ldap_port:"389",
            ldap_tls_port:"636",
            ldap_group_search_filter:"(objectClass=groupOfName)",
            ldap_group_attr_map_user:"member",
            ldap_user_search_filter:"(objectClass=person)",
            ldap_user_attr_map_username:"cn"
        }
    };
export default class LDAP extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = {
		}
	}
	
	componentDidMount(){
		$("form span").tooltip({
			template: '<div class="tooltip right" role="tooltip"><div class="tooltip-inner tooltip-inner-light"></div></div>'
		});
		
		var EMAILHOST=false;
		trendFun.jsGetRequest('cfg/?page_size=1000000&group=email', function(response){
			$.each(response.results, function(i, e){
				if(e.name=="host" && e.value!=""){
					  EMAILHOST=true;
				}
			});
		}, function(){});
	}	
	
	render(){
		return (
		<div className="panel-noborder">
			<form className="checkbox">
			  <input name="ldap_enable_ldap" id="ldap_enable_ldap" className="input-checkbox" type="checkbox"/>
			  <label htmlFor="ldap_enable_ldap">Use LDAP 
				<span className="icon icon-info-sign" data-toggle="tooltip" data-placement="right" title="" style={{"marginTop":"2px"}} data-original-title="Exchange Server is only available when Use LDAP checkbox is selected."></span>
			  </label>

			  <div className="form-group">
				  <label className="control-label" htmlFor="ldap_server_type">LDAP Server Type:</label>
				  <select name="ldap_server_type" defaultValue="ad" id="ldap_server_type" className="form-control">
					  <option value="ad">Microsoft Active Directory</option>
					  <option value="openldap">Open LDAP</option>
				  </select>
			  </div>
			  <div className="form-group">
				<label className="control-label" htmlFor="ldap_host">Server name or IP address:
					<span className="icon icon-info-sign" data-toggle="tooltip" data-placement="right" title="" style={{"marginTop":"2px"}} data-original-title="For example: 1.1.1.1 or example.com"></span>
				</label>
				<input className="form-control" name="ldap_host" id="ldap_host" maxLength="320" type="text"/>
			  </div>
			  <div className="form-group">
				<label className="control-label" htmlFor="ldap_port">Server port:
					<span className="icon icon-info-sign" data-toggle="tooltip" data-placement="right" title="" style={{"marginTop":"2px"}} data-original-title="Use port 389 to connect to the Domain Controller, or use port 3268 to connect to Global Catalog."></span>
				</label>
				<input className="form-control" name="ldap_port" id="ldap_port" maxLength="320" type="text"/>
			  </div>
			  <div className="form-group">
				  <label className="control-label" htmlFor="ldap_base_dns">Base DN:
						<a id="manual_config" href="javascript:;" style={{"color":"#0066CC","paddingLeft":"12px"}}>Edit</a> 
						<input type="hidden" name="select_base_dn" id="select_base_dn" value=""/>						
						<span className="icon icon-info-sign" data-toggle="tooltip" data-placement="right" title="" style={{"marginTop":"2px"}} data-original-title="Select the top level Base DN."></span>				  
				  </label>
				  <select name="ldap_base_dns" defaultValue="ad" id="ldap_base_dns" className="form-control">
				  </select>
			  </div>
			  <div className="form-group">
				<label className="control-label" htmlFor="ldap_user">User name:
					<span className="icon icon-info-sign" data-toggle="tooltip" data-placement="right" title="" style={{"marginTop":"2px"}} data-original-title="Type a domain and a user name to connect to the LDAP server. For example: Domain\Username"></span>
				</label>
				<input className="form-control" name="ldap_user" id="ldap_user" maxLength="320" type="text"/>
			  </div>
			  <div className="form-group">
				<label className="control-label" htmlFor="ldap_password">Password:</label>
				<input className="form-control" name="ldap_password" id="ldap_password" maxLength="320" type="password"/>
			  </div>
			  <div className="form-group">
				  <label className="control-label" htmlFor="ldap_sync_frequency">Update frequency:
					<button className="btn btn-default btn-xs" style={{"marginBottom":"3px"}}>Manual Update</button>
				  </label>
				  <select name="ldap_sync_frequency" defaultValue="ad" id="ldap_sync_frequency" className="form-control">
				  </select>
			  </div>
			  <div className="form-group">
				<button className="btn btn-default">Test Connection</button>
			  </div>
			  
			</form>
			<button className="btn btn-primary">Submit</button>
		</div>
		
		
		);
	}
}