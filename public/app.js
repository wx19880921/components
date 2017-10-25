import React from 'react';
import ReactDOM from 'react-dom';
import Publisher from './publisher.jsx';  //如果不指定./路径，会从node-moudles里查询
import $ from 'jquery';


let datalist={
    "count": 2, 
    "next": null, 
    "previous": null, 
    "results": [
        {
            "applied_users": [], 
            "applied_groups": ["Root"], 
            "id": 1, 
            "name": "Default profile777777777", 
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
            "name": "Default profile88888888888888888", 
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
        }    ]
}

ReactDOM.render(<Publisher datalist={datalist} />,document.getElementById('container'));