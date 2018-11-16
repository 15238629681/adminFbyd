var userinfo = JSON.parse(localStorage.getItem("userinfo"));
console.log(userinfo.uid);

var money;
//余额支付  可提现金额
var contClick = false;
var paylevel;
var id;
//获取路径中的id
function getUrlAttribute(parameName) {
	//location.search是从当前URL的?号开始的字符串，即查询字符串
	var query = (location.search.length > 0 ? location.search.substring(1) : null);
	if(null != query) {
		var args = new Object();
		var pairs = query.split("&");
		for(var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf("=");
			if(pos == -1)
				continue;
			var argname = pairs[i].substring(0, pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[argname] = value;
		}

		paylevel = args[parameName];
		var money;
		if(paylevel == 1) {
			var allMoneyNum = document.querySelectorAll(".moneyNum");
			for(var i = 0; i < allMoneyNum.length; i++) {
				allMoneyNum[i].innerHTML = "2988.00";
				money = 2988.00;
				id=-1;
			}
			document.querySelector(".showText").innerHTML = "通过支付宝支付2988.00元";
			document.querySelector(".operateBlock a").setAttribute("href", "https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?uid=" + userinfo.uid + "&token=" + userinfo.token + "&money=2988.00&body=-1");

		}
		if(paylevel == 2) {
			var allMoneyNum = document.querySelectorAll(".moneyNum");
			for(var i = 0; i < allMoneyNum.length; i++) {
				allMoneyNum[i].innerHTML = "5688.00";
				money = 5688.00;
				id=-2;
			}
			document.querySelector(".showText").innerHTML = "通过支付宝支付5688.00元";
			document.querySelector(".operateBlock a").setAttribute("href", "https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?uid=" + userinfo.uid + "&token=" + userinfo.token + "&money=5688.00&body=-2");
		}
		if(paylevel == 3) {
			var allMoneyNum = document.querySelectorAll(".moneyNum");
			for(var i = 0; i < allMoneyNum.length; i++) {
				allMoneyNum[i].innerHTML = "36888.00";
				money = 36888.00;
				id=-3;
			}
			document.querySelector(".showText").innerHTML = "通过支付宝支付36888.00元";
			document.querySelector(".operateBlock a").setAttribute("href", "https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?uid=" + userinfo.uid + "&token=" + userinfo.token + "&money=36888.00&body=-3");
		}
		getWithDrawNum();
	
	console.log("id---"+id)
	console.log("money---"+money)

		//根据键名获取值
//		return args[parameName];
	}
//	return null;
}
 
getUrlAttribute("paylevel");

function getWithDrawNum() {
	console.log(userinfo.token)
	console.log(userinfo.uid);
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/bandshopbalanceSear",
		data: {
			token: userinfo.token,
			timestamp: new Date().getTime()/1000,
			uid: userinfo.uid
			//				token: 'OWYxNzFmNDM5MTFlMGUwNjkyMjEyNzk5',
			//				timestamp: new Date().getTime()/1000,
			//				uid: '21668' 
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.message == "成功") {
				//					可提现金额
				var allNum = data.balancelist[0].managerbalance;
//				alert(allNum);
				document.querySelector(".balanceRecharge .withDrawNum").innerHTML = data.balancelist[0].managerbalance;
				
				if(id=="-1"){
					money=2988.00;
				}if(id=="-2"){
					money=5688.00;
				}if(id=="-3"){
					money=36888.00;
				}
				if(parseFloat(allNum) < money) {
					contClick = true;
					document.querySelector(".getMessageCode input").style.cssText = "border:1px solid #C0C0C0;"
					document.querySelector(".getMessageCode .getCodeSpan").style.cssText = "background:#a0a0a0;";
					document.querySelector(".getMessageCode .alertWrong").style.cssText = "background: #fff;padding-left:0;display:inline-block;";
					document.querySelector(".menuWapper .sureToRecharge").style.cssText = "background:#a0a0a0;";
					//						document.querySelector(".getMessageCode .alertWrong").style.background="#fff";
					document.querySelector(".getMessageCode .alertWrong").innerHTML = "您的账户余额不足，请使用支付宝或微信";
				}

				var str = data.balancelist[0].phone;
				userphone = data.balancelist[0].phone;
				document.querySelector(".balanceRecharge .userPhoneNum").innerHTML = "(" + str.substring(0, 3) + "***" + str.substring(8, 11) + ")";

			} else {
				alert("网络错误，请刷新重试！")
			}
		},
		error: function(msg) {
			console.log(msg);
		}
	})
}

var nextGetFlag = false;
//账户余额支付  发短信
document.querySelector(".getMessageCode .getCodeSpan").addEventListener("click", function() {
	if(contClick) {
		return;
	}

	//开始倒计时
	if(!nextGetFlag) {
		//		var IsBy = $.idcode.validateCode(); //调用返回值，返回值结果为true或者false
		//发短信   开始倒计时
		var lastTime = 60;
		if(!nextGetFlag) {
			$(".getCodeSpan").html("重新获取60s");
			nextGetFlag = true;
			getCodeTime = new Date().getTime() / 1000;
			phoneNum = $(".phone").val();
			$.ajax({
				type: "post",
				url: "https://app.fanbaoyundian.com/h5api/verifycode.app.php",
				data: {
					phonenumber: userphone,
					action: "login"
				},

				success: function(data) {
					console.log(JSON.stringify(data));
					if(data.message == "发送失败，稍后再试") {
						alert("发送失败，稍后再试!");
					}
				},
				error: function(msg) {
					console.log(msg);
				}
			});

			var interval = setInterval(function() {
				lastTime--;
				$(".getCodeSpan").html("重新获取" + lastTime + "s");
				if(lastTime == 0) {
					$(".getCodeSpan").html("获取短信验证码");
					clearInterval(interval);
					nextGetFlag = false;
				}
			}, 1000);
		}
	}
})

//余额支付   上一步
document.querySelector(".menuWapper .lastStap").addEventListener("click", function() {
	window.location.href = "upgradevip.html";
});

//余额支付  确认支付
document.querySelector(".menuWapper .sureToRecharge").addEventListener("click", function() {
	if(contClick) {
		return;
	}
	document.querySelector(".getMessageCode .alertWrong").style.display = "none";
	if(!document.querySelector(".getMessageCode input").value) {
		document.querySelector(".getMessageCode .alertWrong").style.display = "inline-block";
		document.querySelector(".getMessageCode .alertWrong").innerHTML = "请输入验证码！";
		return;
	}
	//	验证手机验证码
	var code = document.querySelector(".getMessageCode input").value;
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/tphone",
		data: {
			token: userinfo.token,
			timestamp: new Date().getTime() / 1000,
			uid: userinfo.uid,
			//				token: 'OWYxNzFmNDM5MTFlMGUwNjkyMjEyNzk5',
			//				timestamp:new Date().getTime()/1000,
			//				uid: '21668',
			phone: userphone,
			code: code,
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.message == "成功") {
				//余额支付接口
				balanceRechargeRequest();
			}
			if(data.message == "验证码错误") {
				//余额支付接口
				document.querySelector(".getMessageCode .alertWrong").style.display = "inline-block";
				document.querySelector(".getMessageCode .alertWrong").innerHTML = "验证码错误！";
			}
			if(data.message == "验证码失效请重新获取验证码") {
				//余额支付接口
				document.querySelector(".getMessageCode .alertWrong").style.display = "inline-block";
				document.querySelector(".getMessageCode .alertWrong").innerHTML = "验证码失效请重新获取验证码！";
			}
		},
		error: function(msg) {
			console.log(msg);
		}
	})

});
//余额支付
function balanceRechargeRequest() {
	if(id=="-1"){
		money=2988.00;
	}
	if(id=="-2"){
		money=5688.00;
	}
	if(id=="-3"){
		money=36888.00;
	}
	
	alert("money---"+money);
	alert("paylevel----"+paylevel)
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activitydelete/shopbalance",
		data: {

			//							timestamp:timestamp,
			//				token: 'OWYxNzFmNDM5MTFlMGUwNjkyMjEyNzk5',
			//				uid: '21668',
			token: userinfo.token,
			timestamp: new Date().getTime() / 1000,
			uid: userinfo.uid,
			money: money,
			paylevel: paylevel
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.message == "成功") {
				window.location.href = "upgradevipsuccess.html?paylevel" + paylevel + "";
			}
			if(data.message == "余额不足") {
				alert("请用支付宝或微信支付！");
			}
		},
		error: function(msg) {
			console.log(msg);
		}
	})
}

//支付宝支付  上一步
document.querySelector(".operateBlock .lastStap").addEventListener("click", function() {
	window.location.href = "upgradevip.html";
});
////支付宝支付
document.querySelector(".operateBlock .nextStap").addEventListener("click", function() {
	console.log(id);
	if(id=="-1"){
		money=2988.00;
	}
	if(id=="-2"){
		money=5688.00;
	}
	if(id=="-3"){
		money=36888.00;
	}
	console.log(money)
//	alert(id+"----"+id)
	var timestamp = new Date().getTime() / 1000;
	var getStatus = setInterval(function() {
		$.ajax({
			type: "post",
			url: "https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/getStatus",
			data: {
				token: userinfo.token,
				uid: userinfo.uid,
				timestamp: timestamp,
				time: timestamp,
				money: money,
				body:id
			},
			success: function(data) {
				console.log(JSON.stringify(data));
				if(data.message == "成功") {
					window.location.href = "upgradevipsuccess.html";
					getStatus.clearInterval();
				}
			},
			error: function(msg) {
				console.log(msg);
			}
		})

	}, 1000);

});

//选择支付方式
document.querySelector(".balanceDiv label").addEventListener("click", function() {
	payWayFlay = 5;
	document.querySelector(".zfbContent").style.cssText = "display:none;";
	document.querySelector(".operateBlock").style.cssText = "display:none;";

	//	document.querySelector(".weiChartRecharge").style.cssText = "display:none;";

	document.querySelector(".balanceRecharge").style.cssText = "display:block;";
	document.querySelector(".menuWapper").style.cssText = "display:block;";
})
document.querySelector(".zhbDiv label").addEventListener("click", function() {
	payWayFlay = 3;
	document.querySelector(".zfbContent").style.cssText = "display:block;";
	document.querySelector(".operateBlock").style.cssText = "display:block;";

	//	document.querySelector(".weiChartRecharge").style.cssText = "display:none;";
	document.querySelector(".balanceRecharge").style.cssText = "display:none;";
	document.querySelector(".menuWapper").style.cssText = "display:none;";
})
document.querySelector(".weiChartDiv label").addEventListener("click", function() {
	payWayFlay = 4;
	document.querySelector(".zfbContent").style.cssText = "display:none;";
	document.querySelector(".operateBlock").style.cssText = "display:none;";

	//	document.querySelector(".weiChartRecharge").style.cssText = "display:block;";
	document.querySelector(".balanceRecharge").style.cssText = "display:none;";
})

document.querySelector(".zhbDiv input").addEventListener("click", function() {
	payWayFlay = 3;
	document.querySelector(".zfbContent").style.cssText = "display:block;";
	document.querySelector(".operateBlock").style.cssText = "display:block;";

	//	document.querySelector(".weiChartRecharge").style.cssText = "display:none;";
	document.querySelector(".balanceRecharge").style.cssText = "display:none;";
	document.querySelector(".menuWapper").style.cssText = "display:none;";
})
document.querySelector(".weiChartDiv input").addEventListener("click", function() {
	payWayFlay = 4;
	document.querySelector(".zfbContent").style.cssText = "display:none;";
	document.querySelector(".operateBlock").style.cssText = "display:none;";

	//	document.querySelector(".weiChartRecharge").style.cssText = "display:block;";
	document.querySelector(".balanceRecharge").style.cssText = "display:none;";
	document.querySelector(".menuWapper").style.cssText = "display:none;";
})
document.querySelector(".balanceDiv input").addEventListener("click", function() {
	payWayFlay = 5;
	document.querySelector(".zfbContent").style.cssText = "display:none;";
	document.querySelector(".operateBlock").style.cssText = "display:none;";

	//	document.querySelector(".weiChartRecharge").style.cssText = "display:none;";
	document.querySelector(".balanceRecharge").style.cssText = "display:block;";
	document.querySelector(".menuWapper").style.cssText = "display:block;";
})