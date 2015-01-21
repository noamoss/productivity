"use strict";angular.module("clientApp",["ngAnimate","ngCookies","ngSanitize","config","LocalStorageModule","ui.bootstrap","ui.router"]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function(a,b,c){var d=["$state","Auth","$timeout",function(a,b,c){b.isAuthenticated()||c(function(){a.go("403")})}];a.state("homepage",{url:"/",controller:"HomepageCtrl",resolve:{account:["Account",function(a){return a.get()}]}}).state("login",{url:"/login",templateUrl:"views/login.html",controller:"LoginCtrl"}).state("dashboard",{"abstract":!0,url:"",templateUrl:"views/dashboard/main.html",controller:"DashboardCtrl",onEnter:d,resolve:{account:["Account",function(a){return a.get()}]}}).state("dashboard.tracking-form",{url:"/tracking/{username:string}/{year:int}/{month:int}/{day:string}/{id:string}",templateUrl:"views/dashboard/tracking-form.html",controller:"TrackingFormCtrl",onEnter:d,resolve:{projects:["$stateParams","Projects",function(a,b){return b.get()}],tracking:["$stateParams","Tracking",function(a,b){return b.get(a.year,a.month,a.username)}]}}).state("dashboard.tracking",{url:"/tracking/{year:int}/{month:int}",templateUrl:"views/dashboard/tracking.html",controller:"TrackingCtrl",onEnter:d}).state("dashboard.tracking-table",{url:"/tracking-table/{year:int}/{month:int}",templateUrl:"views/dashboard/tracking-table.html",controller:"TrackingTableCtrl",onEnter:d,resolve:{tracking:["$stateParams","Tracking",function(a,b){return b.get(a.year,a.month)}]}}).state("dashboard.tracking.track",{url:"/tracking-table/{trackId:int}",templateUrl:"views/dashboard/tracking-table.html",controller:"TrackingCtrl",onEnter:d,resolve:{tracking:["$stateParams","Tracking",function(a,b){return b.get(a.year,a.month)}]}}).state("dashboard.account",{url:"/my-account",templateUrl:"views/dashboard/account/account.html",controller:"AccountCtrl",onEnter:d,resolve:{account:["Account",function(a){return a.get()}]}}).state("403",{url:"/403",templateUrl:"views/403.html"}),b.otherwise("/"),c.interceptors.push(["$q","Auth","localStorageService",function(a,b,c){return{request:function(a){return a.url.match(/login-token/)||(a.headers={"access-token":c.get("access_token")}),a},response:function(a){return a.data.access_token&&c.set("access_token",a.data.access_token),a},responseError:function(c){return 401===c.status&&b.authFailed(),a.reject(c)}}}])}]).run(["$rootScope","$state","$stateParams","$log","Config",function(a,b,c,d,e){a.$state=b,a.$stateParams=c,e.debugUiRouter&&(a.$on("$stateChangeStart",function(a,b,c){d.log("$stateChangeStart to "+b.to+"- fired when the transition begins. toState,toParams : \n",b,c)}),a.$on("$stateChangeError",function(){d.log("$stateChangeError - fired when an error occurs during transition."),d.log(arguments)}),a.$on("$stateChangeSuccess",function(a,b){d.log("$stateChangeSuccess to "+b.name+"- fired once the state transition is complete.")}),a.$on("$viewContentLoaded",function(a){d.log("$viewContentLoaded - fired after dom rendered",a)}),a.$on("$stateNotFound",function(a,b,c,e){d.log("$stateNotFound "+b.to+"  - fired when a state cannot be found by its name."),d.log(b,c,e)}))}]),angular.module("config",[]).constant("Config",{backend:"http://localhost/productivity.io/www",debugUiRouter:!0}).value("debug",!0),angular.module("clientApp").controller("HomepageCtrl",["$scope","$state","account","$log",function(a,b,c){if(c){var d=new Date,e=d.getDate(),f=d.getMonth()+1,g=d.getFullYear();b.go("dashboard.tracking-form",{username:c.label,year:g,month:f,day:e,id:"new"})}else b.go("login")}]),angular.module("clientApp").controller("AccountCtrl",["$scope","account",function(a,b){a.account=b}]),angular.module("clientApp").controller("TrackingCtrl",["$scope","tracking","$stateParams","$log",function(a,b,c){function d(){var a=d3.select(this).node().parentNode;d3.select(a).selectAll("circle").style("display","none"),d3.select(a).selectAll("text.value").style("display","block")}function e(){var a=d3.select(this).node().parentNode;d3.select(a).select("text").style("display","none"),d3.select(a).select("text.value").style("display","block")}function f(){var a=d3.select(this).node().parentNode;d3.select(a).selectAll("circle").style("display","block"),d3.select(a).selectAll("text.value").style("display","none")}function g(a){var b={};return angular.forEach(a,function(a){void 0==a.employee&&("regular"==a.type&&(a.employee=a.projectName),a.employee=a.type),void 0==b[a.employee]&&(b[a.employee]=[]),"day"==a.length.period&&(a.length.interval=8*parseInt(a.length.interval)),"regular"!=a.type&&(a.projectName=a.type,a.length.interval=8),void 0==b[a.employee]&&(b[a.employee]=[]),b[a.employee].push([a.day,a.length.interval,a.projectName,a.type])}),b}a.tracking=b,a.selectedTrack=null,a.year=c.year,a.month=c.month;var h=1024,i=1,j=30,k=d3.scale.category20c(),l=d3.scale.linear().range([0,h]),m=d3.svg.axis().scale(l).orient("top"),n=d3.select(".tracking-data");l.domain([i,j]);var o=d3.scale.linear().domain([i,j]).range([0,h]);n.append("g").attr("class","x axis").attr("transform","translate(0,0)").call(m);var p=g(b),q=0;angular.forEach(p,function(a,b){var c=n.append("g").attr("class","journal"),g=c.selectAll("circle").data(a).enter().append("circle"),i=c.selectAll("text").data(a).enter().append("text"),j=c.selectAll("button").data(a).enter().append("text").on("mouseover",e).on("mouseout",f),l=d3.scale.linear().domain([0,d3.max(a,function(a){return a[1]})]).range([2,9]);g.attr("cx",function(a){return o(a[0])}).attr("cy",20*q+20).attr("r",function(a){return l(a[1])}).attr("class",function(a){return a[3]}).attr("data-toggle","tooltip").attr("data-placement","top").attr("title",function(a){return a[2]}),j.attr("y",20*q+25).attr("x",function(a){return o(a[0])-5}).attr("data-toggle","tooltip").attr("data-placement","top").style("display","none").text(function(a){return a[2]}).attr("title",function(a){return a[2]}),i.attr("y",20*q+25).attr("x",function(a){return o(a[0])-5}).attr("class","value").text(function(a){return a[1]}).style("fill",function(){return k(q)}).style("display","none"),c.append("text").attr("y",20*q+25).attr("x",h+20).attr("class","label").text(b).style("fill",function(){return k(q)}).on("mouseover",d).on("mouseout",f),q++}),$(function(){$('[data-toggle="tooltip"]').tooltip()});var r=function(b){a.selectedTrack=null,angular.forEach(a.tracking,function(c){c.id==b&&(a.selectedTrack=c)})};c.trackId&&r(c.trackId)}]),angular.module("clientApp").controller("TrackingFormCtrl",["$scope","$stateParams","$state","$log","projects","Tracking","tracking",function(a,b,c,d,e,f,g){a.tracking=g,console.log(g);var h=new Date(b.year,b.month,0).getDate();a.days=[];for(var i=1;h>=i;i++)a.days.push(i);a.month=b.month,a.year=b.year,a.day=b.day,a.creating=!1,a.projects=e,a.message="",a.messageClass="alert-success","new"==b.id||"undefined"==b.id?(a.title="What have you done on the "+b.day+"/"+b.month+"/"+b.year+" ?",a.data={},a.data.type="regular",a.data.employee=b.username):(a.title="Your report for the "+b.day+"/"+b.month+"/"+b.year+" ?",angular.forEach(g[b.day],function(c){c.id==b.id&&(a.data=c)})),a.save=function(d){a.creating=!0,d.debug=0;var e=b.year+"-"+b.month+"-"+b.day;d.date=new Date(e).getTime()/1e3,console.log(d),f.save(d).then(function(d){if(a.creating=!1,d.error)return a.messageClass="alert-danger",void(a.message="Error Saving.");a.messageClass="alert-success",a.message="Saved successfully.";var e=d.data[0];e["new"]&&(g[e.day].push(e),b.id=e.id),c.go("dashboard.tracking-form",{username:e.employee,year:b.year,month:b.month,day:e.day,id:e.id},{reload:!0})})}}]),angular.module("clientApp").controller("TrackingTableCtrl",["$scope","tracking","$stateParams","$log",function(a,b,c){for(var d=new Date(c.year,c.month,0).getDate(),e=[],f=1;d>=f;f++)e.push(f);a.employeeRows=b,a.year=c.year,a.month=c.month,a.days=e,console.log(a.employeeRows)}]),angular.module("clientApp").controller("LoginCtrl",["$scope","Auth","$state",function(a,b,c){a.loginButtonEnabled=!0,a.loginFailed=!1,a.login=function(d){a.loginButtonEnabled=!1,b.login(d).then(function(){c.go("homepage")},function(){a.loginButtonEnabled=!0,a.loginFailed=!0})}}]),angular.module("clientApp").controller("DashboardCtrl",["$scope","Auth","$state","account","$log",function(a,b,c,d){var e=new Date;a.day=e.getDate(),a.month=e.getMonth()+1,a.year=e.getFullYear(),a.employee=d.label,a.logout=function(){b.logout(),c.go("login")}}]),angular.module("clientApp").service("Account",["$q","$http","$timeout","Config","$rootScope","$log",function(a,b,c,d,e){function f(){var c=a.defer(),e=d.backend+"/api/me/";return b({method:"GET",url:e,transformResponse:g}).success(function(a){j(a[0]),c.resolve(a[0])}),c.promise}function g(a){return(a=angular.fromJson(a).data)?(angular.forEach(a[0].companies,function(b,c){a[0].companies[c].id=parseInt(b.id)}),a):void 0}var h={},i="ProductivityAccountChange";this.get=function(){return a.when(h.data||f())};var j=function(a){h={data:a,timestamp:new Date},c(function(){h={}},6e4),e.$broadcast(i)};e.$on("clearCache",function(){h={}})}]),angular.module("clientApp").service("Auth",["$injector","$rootScope","Utils","localStorageService","Config",function(a,b,c,d,e){this.login=function(b){return a.get("$http")({method:"GET",url:e.backend+"/api/login-token",headers:{Authorization:"Basic "+c.Base64.encode(b.username+":"+b.password)}})},this.logout=function(){d.remove("access_token"),b.$broadcast("clearCache"),a.get("$state").go("login")},this.isAuthenticated=function(){return!!d.get("access_token")},this.authFailed=function(){this.logout()}}]),angular.module("clientApp").service("Utils",function(){var a=this;this.Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(b){var c,d,e,f,g,h,i,j="",k=0;for(b=a.Base64._utf8_encode(b);k<b.length;)c=b.charCodeAt(k++),d=b.charCodeAt(k++),e=b.charCodeAt(k++),f=c>>2,g=(3&c)<<4|d>>4,h=(15&d)<<2|e>>6,i=63&e,isNaN(d)?h=i=64:isNaN(e)&&(i=64),j=j+this._keyStr.charAt(f)+this._keyStr.charAt(g)+this._keyStr.charAt(h)+this._keyStr.charAt(i);return j},_utf8_encode:function(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b}}}),angular.module("clientApp").service("Tracking",["$q","$http","$timeout","Config","$rootScope","localStorageService",function(a,b,c,d,e){var f={};this.get=function(b,c,d){return a.when(f.data||g(b,c,d))},this.save=function(c){var e=a.defer(),f=d.backend+"/api/tracking",g="POST";return c.id&&(g="PATCH",f+="/"+c.id),c.debug&&(f+="?XDEBUG_SESSION_START=11049"),b({method:g,url:f,data:c}).success(function(a){a.error=!1,e.resolve(a)}).error(function(a){a.error=!0,e.resolve(a)}),e.promise};var g=function(c,e,f){var g=a.defer(),h=d.backend+"/api/tracking?year="+c+"&month="+e;return void 0!=f&&(h+="&employee="+f),console.log(h),b({method:"GET",url:h}).success(function(a){g.resolve(a.data)}),g.promise};e.$on("clearCache",function(){f={}})}]),angular.module("clientApp").service("Projects",["$q","$http","$timeout","Config","$rootScope","localStorageService",function(a,b,c,d,e){var f={},g="ProductivityProjectsChange";this.get=function(){return a.when(f.data||h())},this.save=function(c){var e=a.defer(),f=d.backend+"/api/projects";return b({method:"POST",url:f,data:c}).success(function(){}),e.promise};var h=function(){var c=a.defer(),e=d.backend+"/api/projects";return b({method:"GET",url:e}).success(function(a){i(a.data),c.resolve(a.data)}),c.promise},i=function(a){f={data:a,timestamp:new Date},c(function(){f.data={}},6e4),e.$broadcast(g)};e.$on("clearCache",function(){f={}})}]),angular.module("clientApp").directive("spinner",function(){return{template:'<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',restrict:"E"}});