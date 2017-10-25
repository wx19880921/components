import React from 'react';
import style from './publisher.css';

export default class Publisher extends React.Component {
    constructor(...args) {
        super(...args);
        // 定义 state
        this.state = {
            content: '',
            datalist: {
                "count": 3, 
                "next": null, 
                "previous": null, 
                "results": [
                    {
                        "applied_users": [], 
                        "applied_groups": ["Root"], 
                        "id": 1, 
                        "name": "Default profile111111111111111", 
                        "detail": "Default profile for all users that do not use any specific profile.", 
                        "priority": 1, 
                        "created_time": null, 
                        "last_modified_time": "2016-10-27T06:17:35+00:00", 
                        "storage_limit": 0, 
                        "single_app": false, 
                        "package_name": "", 
                        "app_id": 0, 
                        "watermark_enable": true, 
                        "watermark_text": "", 
                        "policies": [7, 10], 
                        "apps": [1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1113, 1114, 1115]
                    },
                    {
                        "applied_users": [], 
                        "applied_groups": ["Root"], 
                        "id": 1, 
                        "name": "Default profile2222222222222", 
                        "detail": "Default profile for all users that do not use any specific profile.", 
                        "priority": 1, 
                        "created_time": null, 
                        "last_modified_time": "2016-10-27T06:17:35+00:00", 
                        "storage_limit": 0, 
                        "single_app": false, 
                        "package_name": "", 
                        "app_id": 0, 
                        "watermark_enable": true, 
                        "watermark_text": "", 
                        "policies": [7, 10], 
                        "apps": [1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1113, 1114, 1115]
                    }
                ]
            }
        }
    }

    /**
    * 获取焦点
    **/
    handleFocus() {
        // 改变边框颜色
        this.refs.textElDiv.style.borderColor = '#fa7d3c';
        // 切换右上角内容
        this.refs.hot.style.display = 'none';
        this.refs.tips.style.display = 'block';
    }

    /**
    * 失去焦点
    **/
    handleBlur() {
        // 改变边框颜色
        this.refs.textElDiv.style.borderColor = '#cccccc';
        // 切换右上角内容
        this.refs.hot.style.display = 'block';
        this.refs.tips.style.display = 'none';
		$("#hot_new").html($("#hot_new").html()+(new Date).getTime());
    }

    /**
    * 输入框内容发生变化
    **/
    handleChange(e) {
        // 改变状态值
        this.setState({
            content: e.target.value
        });
       // this.state.datalist.results[0].name="手动修改这个值 看看"; //只要值 一变化，使用这个值的就会整个变化 
    }
    componentDidMount(){ 
        console.log('componentDidMount run time:'+ (new Date()).toLocaleString());       
        this.serverRequest=$.getJSON('ajax_json.json', function(response) {         
            
                //this.state.datalist.results[0].name="手动修改这个值 看看"; //只要值 一变化，使用这个值的就会整个变化 
                this.setState({
                    datalist: response                
                });
            
        }.bind(this));
    };

    componentWillUnmount() {  
        //当异步加载数据的时候， 使用 componentWillUnmount 来取消任何未完成的请求 在组件卸载之前
        console.log('componentWillUnmount run time:'+ (new Date()).toLocaleString());
        this.serverRequest.abort();  
  }  

    Alert(){
        console.log(this);
        console.log(this.state);
        this.state.datalist.results[0].name="弹出alertDefault profile55555555555555"; //只要值 一变化，使用这个值的就会整个变化 
       
        alert(this.props.datalist.count);
    }

    render() {
        return (
            <div className="root">
            <div className={style.publisher}>
                <div className={style.title}>
                    <div ref="hot">
                        <a href="#" id="hot_new" onClick={this.Alert.bind(this)}>网友曝光两女孩蹲着等地铁,称没教养,你怎么看(投票)</a>
                    </div>
                    <div className={style.tips} ref="tips">
                        <span>{this.state.content.length > 140 ? '已超出' : '还可以输入'}</span><strong>{this.state.content.length > 140 ? this.state.content.length - 140 : 140 - this.state.content.length}</strong>字
                    </div>
                </div>            
                <div className={style.textElDiv} ref="textElDiv">
                    <textarea onFocus={this.handleFocus.bind(this)} onBlur={this.handleBlur.bind(this)} onChange={this.handleChange.bind(this)}></textarea>
                </div>
                <div className={style.btnWrap}>
                    <a className={style.publishBtn + ((this.state.content.length > 0 && this.state.content.length <= 140) ? '' : ' ' + style.disabled)} href="javascript:void(0)">发布</a>
                </div>
            </div>

            <div>
             <ul>
                {
                    
                    this.state.datalist.results.map(function (e){
                        return <li>
                        {e.name}
                        </li>;
                        
                    })
               }
               {
                        this.props.datalist.results.map(function (e){
                            return <li>
                            {e.name}
                            </li>;
                            
                        })
               }
             </ul>            
            </div>
            </div>
        );
    }
}

Publisher.propTypes = {
  count: React.PropTypes.number
};
Publisher.defaultProps = {
    datalist:{
    "count": 1, 
    "next": null, 
    "previous": null, 
    "results": [
        {
            "applied_users": [], 
            "applied_groups": ["Root"], 
            "id": 1, 
            "name": "Default profile33333", 
            "detail": "Default profile for all users that do not use any specific profile.", 
            "priority": 1, 
            "created_time": null, 
            "last_modified_time": "2016-10-27T06:17:35+00:00", 
            "storage_limit": 0, 
            "single_app": false, 
            "package_name": "", 
            "app_id": 0, 
            "watermark_enable": true, 
            "watermark_text": "", 
            "policies": [7, 10], 
            "apps": [1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1113, 1114, 1115]
        },
        {
            "applied_users": [], 
            "applied_groups": ["Root"], 
            "id": 1, 
            "name": "Default profile4444444444444", 
            "detail": "Default profile for all users that do not use any specific profile.", 
            "priority": 1, 
            "created_time": null, 
            "last_modified_time": "2016-10-27T06:17:35+00:00", 
            "storage_limit": 0, 
            "single_app": false, 
            "package_name": "", 
            "app_id": 0, 
            "watermark_enable": true, 
            "watermark_text": "", 
            "policies": [7, 10], 
            "apps": [1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1113, 1114, 1115]
        }
        
        ]
    }
}