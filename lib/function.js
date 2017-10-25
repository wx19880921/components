import * as GS from '../lib/global.js';
console.log( GS.TMMS_WEB_ROOT)
let navigation=GS.default;

export default class trendFun {

 to_locale_time(date) {
	//var d="2013-08-20T09:55:57+00:00";
	if(!date) return '-';
	if(isNaN(Date.parse(date))){
		date=date.replace(/-/g,"\/").replace("T"," ").replace("+00:00","Z");
	}
	var date=Date.parse(date);
	var d = new Date(date);
    var pad = function(n, c){
        if((n = n + "").length < c){
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
	return d.getFullYear()+'/'+pad((d.getMonth()+1),2)+'/'+pad(d.getDate(),2)+' '+pad(d.getHours(),2)+':'+pad(d.getMinutes(),2)+':'+pad(d.getSeconds(),2);
}

/**
 * The same to php date function.
 * @param  {string} format    Y-m-d 
 * @param  {int}    timestamp  The length is 10 numbers. default is current time
 * @return {string}           
 * Exp: alert(date('Y-m-d','1350052653')); date('Y-m-d');
 */
 date(format, timestamp){
        var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
        var pad = function(n, c){
            if((n = n + "").length < c){
                return new Array(++c - n.length).join("0") + n;
            } else {
                return n;
            }
        };
        var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};
        var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var f = {
            // Day
            d: function(){return pad(f.j(), 2)},
            D: function(){return f.l().substr(0,3)},
            j: function(){return jsdate.getDate()},
            l: function(){return txt_weekdays[f.w()]},
            N: function(){return f.w() + 1},
            S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'},
            w: function(){return jsdate.getDay()},
            z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0},
        
            // Week
            W: function(){
                var a = f.z(), b = 364 + f.L() - a;
                var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
                if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
                    return 1;
                } else{
                    if(a <= 2 && nd >= 4 && a >= (6 - nd)){
                        nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                        return date("W", Math.round(nd2.getTime()/1000));
                    } else{
                        return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                    }
                }
            },
        
            // Month
            F: function(){return txt_months[f.n()]},
            m: function(){return pad(f.n(), 2)},
            M: function(){return f.F().substr(0,3)},
            n: function(){return jsdate.getMonth() + 1},
            t: function(){
                var n;
                if( (n = jsdate.getMonth() + 1) == 2 ){
                    return 28 + f.L();
                } else{
                    if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
                        return 31;
                    } else{
                        return 30;
                    }
                }
            },
        
            // Year
            L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0},
            //o not supported yet
            Y: function(){return jsdate.getFullYear()},
            y: function(){return (jsdate.getFullYear() + "").slice(2)},
        
            // Time
            a: function(){return jsdate.getHours() > 11 ? "pm" : "am"},
            A: function(){return f.a().toUpperCase()},
            B: function(){
                // peter paul koch:
                var off = (jsdate.getTimezoneOffset() + 60)*60;
                var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
                var beat = Math.floor(theSeconds/86.4);
                if (beat > 1000) beat -= 1000;
                if (beat < 0) beat += 1000;
                if ((String(beat)).length == 1) beat = "00"+beat;
                if ((String(beat)).length == 2) beat = "0"+beat;
                return beat;
            },
            g: function(){return jsdate.getHours() % 12 || 12},
            G: function(){return jsdate.getHours()},
            h: function(){return pad(f.g(), 2)},
            H: function(){return pad(jsdate.getHours(), 2)},
            i: function(){return pad(jsdate.getMinutes(), 2)},
            s: function(){return pad(jsdate.getSeconds(), 2)},
            //u not supported yet
        
            // Timezone
            //e not supported yet
            //I not supported yet
            O: function(){
                var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
                if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
                return t;
            },
            P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))},
            //T not supported yet
            //Z not supported yet
        
            // Full Date/Time
            c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()},
            //r not supported yet
            U: function(){return Math.round(jsdate.getTime()/1000)}
        };
       
        return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
            let ret;
            if( t!=s ){
                // escaped
                ret = s;
            } else if( f[s] ){
                // a date function exists
                ret = f[s]();
            } else{
                // nothing special
                ret = s;
            }
            return ret;
        });
    }

    //replace string
    replaceRevStr(str){
            var str=str;
            if(str=="") return "";
            //var regObj = {"&lt;":"<","&gt;":">"};
            var regObj = {"<":"&lt;",">":"&gt;"};
            for(var reg in regObj){
                str = str.replace(new RegExp(reg,"g"),regObj[reg]);
            }
            return str;
    }
    
    // 02:15:56
    formatSeconds2(a) {
        if(isNaN(a)){
            return "-";   
        } 
        var hh = parseInt(a/3600);  
        if(hh<10) hh = "0" + hh;  
        var mm = parseInt((a-hh*3600)/60);  
        if(mm<10) mm = "0" + mm;  
        var ss = parseInt((a-hh*3600)%60);  
        if(ss<10) ss = "0" + ss;  
        var length = hh + ":" + mm + ":" + ss;  
        if(a>0){  
            return length;  
        }else{  
            return "-";  
        }  
    }

    //****cookie setting**/
   //write cookie
   setCookie(NameOfCookie, value, expiredays){ 
        var ExpireDate = new Date (); 
        ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000)); 
       // document.cookie = NameOfCookie + "=" + escape(value) +  ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString()+"; secure;path=/"); 
       //1 secure属性 当设置为true时，表示创建的 Cookie 会被以安全的形式向服务器传输，也就是只能在 HTTPS 连接中被浏览器传递到服务器端进行会话验证，如果是 HTTP 连接则不会传递该信息，所以不会被窃取到Cookie 的具体内容。
       document.cookie = NameOfCookie + "=" + escape(value) +  ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString()+"; path=/"); 
    }
    GetCookie(name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        //console.log('GetCookie in:'+clen);
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg)
            return this.GetCookieVal (j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return null;
    }    
    
    GetCookieVal(offset) {         
        var endstr = document.cookie.indexOf (";", offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    }
     //这个未用
     DeleteCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=this.GetCookie(name);
        if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
     deleteCookie(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 24 * 3600*1000);
        var cval=this.GetCookie(name);
        if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString()+"; path=/";
    };



    //ajax setting
    /*
    * common function for ajax success handler
    * dependency: global.js
    */

    jsGetRequest(url, on_success, on_error, timeout, on_before, on_complete) {
        this.jsAjaxRequest('GET', url, null, on_success, on_error, timeout, on_before, on_complete);
    }
    jsPostRequest(url, data, on_success, on_error, timeout, on_before, on_complete) {
        this.jsAjaxRequest('POST', url, data, on_success, on_error, timeout, on_before, on_complete);
    }

    jsDelRequest(url, on_success, on_error, timeout, on_before, on_complete) {
        this.jsAjaxRequest('DELETE', url, false, on_success, on_error, timeout, on_before, on_complete);
    }

    jsPutRequest(url, data, on_success, on_error, timeout, on_before, on_complete) {
        this.jsAjaxRequest('PUT', url, data, on_success, on_error, timeout, on_before, on_complete);
    }

    jsAjaxRequest(method, url, data, on_success, on_error, timeout, on_before, on_complete) {	
        var request = {
            type: method,
            url: GS.TMMS_WEB_ROOT+url,   // GS.TMMS_WEB_ROOT+url
            data: data ? $.toJSON(data) : '',
            beforeSend: function (XHR, setting) {
                if (on_before) {
                    on_before(XHR, setting);
                }
            },
            complete: function (XHR, setting) {
                if (on_complete) {
                    on_complete(XHR, setting);
                }
            },
            error: function (XHR, textStatus, errorThrown) {
                this.onAjaxError(XHR, textStatus, errorThrown, on_error,url);
            }.bind(this),
            success: function (response, textStatus) {
                this.onAjaxSuccess(response, textStatus, on_success);
            }.bind(this),
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Cache-Control":"no-cache",
                "X-CSRFToken": this.GetCookie('csrftoken')
            },
            cache:false,
            dataType:"json"
        };
        
        if (timeout) {
            request["timeout"] = timeout;
        }
	$.ajaxSetup({
	    dataFilter : function(data, type){
	       if(data == ""){
		   return "{}";
	       }else{
		   return data;
	       }
	   }
	})

        return $.ajax(request);
    }

    onAjaxSuccess(response, textStatus, on_success) {
        if (!response) {
            response = {};
        }

        if ("string" == typeof (response)) {
            try {
                response = $.secureEvalJSON(response);
            } catch (e) {
                alert("Unable to access server. Check your network connection and try again.");
                return;
            }
        }

        if (on_success) {
            on_success(response);
        }
    }
    onAjaxError(XHR, textStatus, errorThrown, on_error,url) {
        var response = XHR.responseText;
        if(XHR.status==403 && url.indexOf("cfg/license/?from=index")!=-1){
            window.parent.location.href="../login.htm?error_id=403";
            return;
        }
        if ("string" == typeof (response) && response.length > 0) {
            try {
                response = $.secureEvalJSON(response);
            } catch (e) {
                alert("Unable to access server. Check your network connection and try again.");
                return;
            }
        }
        else {
            response = {"detail": errorThrown}
        }
        if(url.indexOf("account/logout/")!=-1){
            window.parent.location.href="../login?error_id=logout_fail";
            return;
        }
        
        if(XHR.status==403){
            var filename=this.getFileName(window.parent.location.href).toLowerCase();
            if(filename.indexOf("login.htm")==-1){
                window.parent.location.href="#/login?error_id=403";
            }else{
                alert("Unable to access server. Check your network connection and try again.");
            }
            return;
        }
        if(XHR.status!=400 && XHR.status!=0){
            alert("Unable to access server. Check your network connection and try again.");
            return;
        }
        
        if (on_error && XHR.status!=0) {	
            on_error(response,XHR.status);  //XHR.status  400
        }
    }
    //ajax setting end

    getFileName(url) {
	var pos = url.lastIndexOf("/");
	if(pos == -1) {
	   pos = url.lastIndexOf("\\")
	}
	var filename = url.substr(pos +1)
	return filename;
    };

	resolve_role_type(){
		var role_type=this.GetCookie('role_type');  //  0 globle super admin,1 super admin,2 moniter
		var site_id=this.GetCookie('site_id');
		if(site_id==1){ //default site
				if(role_type==2){
					//$(".g_moniter_admin").hide();  //global moniter
					$(".g_moniter_admin").remove();
				}
		}else{ // sub site
				if(role_type==0){
					//
				}else if(role_type==1){
					$(".super_admin").hide(); //hide class=super_admin;
					$(".super_admin_del").remove(); //remove class.dom
					navigation.children[5].children[1].status="hide"; //log
					navigation.children[6].children[1].status="hide"; //email
					navigation.children[6].children[3].status="hide"; //cert
					navigation.children[6].children[5].status="hide"; //license
					navigation.children[1].children[1].status="hide"; //device bind
					navigation.children[6].children[2].status="hide"; //system 
					
				}else if(role_type==2){
					$(".moniter_admin").hide();
					$(".moniter_admin_del").remove();
					navigation.children[5].children[1].status="hide"; //log
					navigation.children[6].children[1].status="hide"; //email
					navigation.children[6].children[2].status="hide"; //system setting
					navigation.children[6].children[3].status="hide"; //cert
					navigation.children[6].children[5].status="hide"; //license
					navigation.children[1].children[1].status="hide"; //device bind
					
					navigation.children[6].children[2].status="hide"; //system 
				}
			
		}
	}
}