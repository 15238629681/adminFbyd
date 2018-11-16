/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.phonenumber = loginInfo.phonenumber || '';
		loginInfo.verifycode = loginInfo.verifycode || '';
		$.ajax({
			type:"post",
			url:"https://app.fanbaoyundian.com/appapi/login.app.php",
			data:{
				wx:loginInfo.wx,
				phonenumber:loginInfo.phonenumber,
				verifycode:loginInfo.verifycode,
				wxunionid:loginInfo.wxunionid
			},
			async:false,
			timeout:10000,
			success:function(data){
				//alert(JSON.stringify(data));
				localStorage.clear();
				var userinfo = JSON.stringify(data);
				localStorage.setItem("userinfo",userinfo);
				if(data.state==1){
					if(data.userinfo.wxinfo.openid==""){
						var bindwxPage = $.preload({
							id:"bindwxPage",
							url:"bindwx.html"
						})
						setTimeout(function(){					
							$.openWindow({
								id: 'bindwxPage'
							});
						},20)
						return;
					}
					plus.nativeUI.toast("登录成功");					
					$.openWindow({
						url: 'commont.html',
						id: 'commont',
						preload: true,
						show: {
							aniShow: 'pop-in'
						},
						styles: {
							popGesture: 'hide'
						},
						waiting: {
							autoShow: false
						}
					});
					
				}else{
					if(data.error==1){
						plus.nativeUI.toast("该手机号未注册或格式不正确");
					}else if(data.error==2){
						plus.nativeUI.toast("验证码错误，请重新输入");
					}else if(data.error==3){
						plus.nativeUI.toast("该微信用户未注册");
					}
				}
			},
			error:function(xhr,type,errorThrown){
				if(type=="timeout"){
					plus.nativeUI.toast("请求超时，请检查网络");
				}
				plus.nativeUI.toast(errorThrown);
			}
		});
	};

//	owner.createState = function(name, callback) {
//		var state = owner.getState();
//		state.phonenumber = name;
//		state.token = "token123456789";
//		owner.setState(state);
//		return callback();
//	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.phonenumber = regInfo.phonenumber || '';
		regInfo.verifycode = regInfo.verifycode || '';
		$.ajax({
			type:"post",
			url:"https://app.fanbaoyundian.com/appapi/register.app.php",
			data:{
				invitecode:regInfo.invitecode,
				phonenumber:regInfo.phonenumber,
				verifycode:regInfo.verifycode,
				wxinfo:regInfo.wxinfo
			},
			async:false,
			timeout:10000,
			success:function(data){
				//alert(JSON.stringify(data));
				if(data.state==1){
					plus.nativeUI.toast("注册成功");
					//注册成功代码块
					var userinfo = JSON.stringify(data);
					localStorage.setItem('userinfo', userinfo);
					localStorage.setItem("invite","1");
					$.openWindow({
						url: 'commont.html',
						id: 'commont',
						preload: true,
						show: {
							aniShow: 'pop-in'
						},
						styles: {
							popGesture: 'hide'
						},
						waiting: {
							autoShow: false
						}
					});
				}else{
					if(data.error==1){
						plus.nativeUI.toast("邀请码错误");
					}else if(data.error==2){
						plus.nativeUI.toast("手机号已被注册");
					}else if(data.error==3){
						plus.nativeUI.toast("验证码错误");
					}
				}
			},
			error:function(xhr,type,errorThrown){
				alert(JSON.stringify(type));
				alert(errorThrown);
				if(type=="timeout"){
					plus.nativeUI.toast("请求超时，请检查网络");
				}
			}
		});
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
	};
	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取本地是否安装客户端
		 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"weixin": "com.tencent.mm"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));