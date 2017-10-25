

class UserSummary extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = { 
			//isOpen：false,
		};    
		
		this.saveProfile = this.saveProfile.bind(this);
		this.openEditProfile = this.openEditProfile.bind(this);
		this.closeModalUserProfile = this.closeModalUserProfile.bind(this);
		this.saveModalUserProfile = this.saveModalUserProfile.bind(this);
		
	}
	
	componentDidMount(){
		trendFun.jsGetRequest('account/user/'+this.props.user_id+'/', function(response){
			var policy=response.policy;
			$("#username").text(response.username);
			$("#parent_group_name").text(response.group_names.join());
			trendFun.jsGetRequest('policy/template-simple/?page_size=1000000', function(response){
				var tempChecked=""
				//var html= '<option value="-1">'+ (policy.inherited?policy.name:policy.inherited_policy)+' (Inherited)</option>';
				if(policy.inherited){
					$("#ploicy_name").text(policy.name);
					$("input[type=radio][name=r1]:eq(0)").attr("checked",true);
					$("#profile").attr("disabled",true);
				}else{
					$("#ploicy_name").text(policy.inherited_policy);
					$("input[type=radio][name=r1]:eq(1)").attr("checked",true);
					$("#profile").attr("disabled",false);
				}
				var html='';
				$.each(response.results, function(i,e){
					tempChecked="";
					if(!policy.inherited && policy.id == e.id){
						tempChecked="selected";
					}
					
					html+='<option '+ tempChecked+' value="'+e.id+'">'+e.name+'</option>';
				});
				$(html).appendTo($("#profile"));
			}, function(){ 
				alert("Unable to access server. Check your network connection and try again.");
			});
		}, function(){ 
			alert("Unable to access server. Check your network connection and try again.");
		});
		
		
		$("input[type=radio][name=r1]").click(function(e) {
		if($(this).val()=="-1"){
				$("#profile").attr("disabled",true);	
			}else{
				$("#profile").attr("disabled",false);
			}
		});	
	}
	
	
	
	closeModalUserProfile(){
		this.setState({modalUserProfile:false});
	}
	
	saveModalUserProfile(){
			
	}
	
	render(){
		<Modal show={this.props.isOpen} onHide={this.closeModalUserProfile}>
			<Modal.Dialog>
				<Modal.Header closeButton>
					<Modal.Title>Import Group or User from LDAP</Modal.Title>
				</Modal.Header>
			  
				<Modal.Body>
					<div id="modalEditProfile" style={{'width':'500px'}}>
						<ul className="detailLists">
							<li><dt>User:</dt> &nbsp;&nbsp;<span id="username"></span></li>
							<li>
								<dt>Profile:</dt>
								<dd><input name="r1" type="radio" value="-1"/>=CHANGEUSERPROFILE_INHERIT_PARENTGROUP=-= <span id="parent_group_name"></span>:<span id="ploicy_name"></span></dd>
							</li>
							<li><dt style={{'visibility':'hidden'}}>Profile:</dt><input name="r1" type="radio" defaultValue="1"/>Specified: <select id="profile"></select></li>
						</ul>
					</div>
				</Modal.Body>
			  
				<Modal.Footer>
					<Button onClick={this.closeModalUserProfile}>Close</Button>
					<Button bsStyle="primary" onClick={this.saveModalUserProfile}>Save</Button>
				</Modal.Footer>
			  
			</Modal.Dialog>
		</Modal>	
	
	}
	
}