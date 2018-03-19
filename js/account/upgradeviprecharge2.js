var userinfo = JSON.parse(localStorage.getItem("userinfo"));

//alert(localStorage.getItem("userinfo"))

//获取可提现余额
function getPayLevel(parameName) {
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

		return args[parameName];
	}
}

//viptype选择接口
var upgraderecordid,supplierbalanceid;
function vipTypeChoose() {
	var vipType = getPayLevel("paylevel");
	var money;
	if(vipType == "1") {
		money = 2988.00;
	}
	if(vipType == "2") {
		money = 5688.00;
	}
	if(vipType == "3") {
		money = 36888.00;
	}
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activitydelete/annualfee",
		data: {
			token: userinfo.token,
			timestamp: new Date().getTime() / 1000,
			uid: userinfo.uid,
			money:money,
			paylevel:vipType
		},
		success: function(data) {
			console.info(data);
			if(data.state=="1"){
				upgraderecordid=data.data.upgraderecordid;
				supplierbalanceid=data.data.supplierbalanceid;
				getOrderNum(upgraderecordid,supplierbalanceid);
				
			}
		},
		error: function(msg) {
			console.log(msg);
		}
	});

}
vipTypeChoose();
function getOrderNum(upgraderecordid,supplierbalanceid){
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activitydelete/yearSear",
		data: {
			token: userinfo.token,
			timestamp: new Date().getTime() / 1000,
			uid: userinfo.uid,
			upgraderecordid:upgraderecordid,
			supplierbalanceid:supplierbalanceid
			
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.state=="1"){
				var list=data.list;
				$(".orderDetailBlock .orderNum").html("订单号："+list.balance[0].ordernumber);
				$(".orderDetailBlock .serviceTime .startTime").html(list.upgrade[0].termstarttime);
				$(".orderDetailBlock .serviceTime .endTime").html(list.upgrade[0].termendtime);
			}
		},
		error: function(msg) {
			console.log(msg);
		}
	});
}

var getMesageContClick = false;
var userphone;
var canWithDrawMoney;

function getWithDrawNum() {
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/bandshopbalanceSear",
		data: {
			token: userinfo.token,
			timestamp: new Date().getTime() / 1000,
			uid: userinfo.uid
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.message == "成功") {
				//可提现金额
				var allNum = data.balancelist[0].managerbalance;
				canWithDrawMoney = allNum;
				document.querySelector(".accountBalanceBlock .withDrawNumWapper .withDrawNum").innerHTML = data.balancelist[0].managerbalance;
				var payLevel = getPayLevel("paylevel");
				var money;
				if(payLevel == "1") {
					money = 2988.00;
				}
				if(payLevel == "2") {
					money = 5688.00;
				}
				if(payLevel == "3") {
					money = 36888.00;
				}
				if(parseFloat(allNum) < money) {
					getMesageContClick = true;
					document.querySelector(".accountBalanceBlock .payDetailBlock .inputWapper input").style.cssText = "border:1px solid #C0C0C0;"
					document.querySelector(".accountBalanceBlock .payDetailBlock .inputWapper .getMessageCode").style.cssText = "background:#a0a0a0;";

					//					document.querySelector(".getMessageCode .alertWrong").style.cssText = "background: #fff;padding-left:0;display:inline-block;";

					document.querySelector(".accountBalanceBlock .payDetailBlock .inputWapper .balanceAlert ").style.display = "inline-block";
					document.querySelector(".accountBalanceBlock .balanceAlert").innerHTML = "余额不足，请使用其他支付方式";
				}

				var str = data.balancelist[0].phone;
				userphone = data.balancelist[0].phone;
				document.querySelector(".accountBalanceBlock .userPhoneWapper .phoneNum").innerHTML = "(" + str.substring(0, 3) + "***" + str.substring(8, 11) + ")";

			} else {
				alert("网络错误，请刷新重试！")
			}
		},
		error: function(msg) {
			console.log(msg);
		}
	})
}

//余额支付  获取短信验证码
//账户余额支付  发短信
var nextGetFlag = false;
document.querySelector(".accountBalanceBlock .getMessageCode").addEventListener("click", function() {
	if(getMesageContClick) {
		return;
	}

	//开始倒计时
	if(!nextGetFlag) {
		//		var IsBy = $.idcode.validateCode(); //调用返回值，返回值结果为true或者false
		//发短信   开始倒计时
		var lastTime = 60;
		if(!nextGetFlag) {
			$(this).html("获取短信验证码");
			nextGetFlag = true;
			getCodeTime = new Date().getTime() / 1000;
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
					} else {
						var interval = setInterval(function() {
							lastTime--;
							$(".accountBalanceBlock .inputWapper .getMessageCode").html("重新获取" + lastTime + "s");
							if(lastTime == 0) {
								$(".accountBalanceBlock .inputWapper .getMessageCode").html("获取短信验证码");
								clearInterval(interval);
								nextGetFlag = false;
							}
						}, 1000);
					}
				},
				error: function(msg) {
					console.log(msg);
				}
			});
		}
	}
})

//获取vip类型
var paylevel, money, id;

function getUrlAttribute(parameName) {
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
		if(paylevel == 1) {
			$(".upgradeType").html("黄金VIP");
			//			支付金额
			$(".orderDetailBlock .payNumBlock span").html("￥2988.00");
			$(".choosePayBlockTitle .payNum").html("￥2988.00");

		}
		if(paylevel == 2) {
			$(".upgradeType").html("钻石VIP");
			//			支付金额
			$(".orderDetailBlock .payNumBlock span").html("￥5688.00");
			$(".choosePayBlockTitle .payNum").html("￥5688.00");
		}
		if(paylevel == 3) {
			$(".upgradeType").html("KA会员");
			//			支付金额
			$(".orderDetailBlock .payNumBlock span").html("￥36888.00");
			$(".choosePayBlockTitle .payNum").html("￥36888.00");
		}
		getWithDrawNum();
		//根据键名获取值
		//		return args[parameName];
	}
	//	return null;
}

getUrlAttribute("paylevel");

//订单信息

//支付方式选择

//余额支付
var balanceNoChoose = true;
$(".accountBalanceBlock .chooseBlock").on("click", function() {
	if(balanceNoChoose) { //选中
		$(".accountBalanceBlock .chooseBlock img").attr("src", "../img/account/choose.png");
		$(".accountBalanceBlock .payDetailBlock").css("display", "block");

		if(!otherNoChoose) { //打开状态
			$(".otherPayBlock .chooseBlock img").attr("src", "../img/account/nochoose.png");
			$(".otherPayBlock .payDetailBlock").css("display", "none");
			otherNoChoose = !otherNoChoose;
		}
		var payLevel = getPayLevel("paylevel");
		var money;
		if(payLevel == "1") {
			money = 2988.00;
		}
		if(payLevel == "2") {
			money = 5688.00;
		}
		if(payLevel == "3") {
			money = 36888.00;
		}
		if(parseFloat(canWithDrawMoney) < money) {
			document.querySelector(".operateBlock .nextStap").style.cssText = "background:#a0a0a0;";
		}
	} else { //取消选中
		$(".accountBalanceBlock .chooseBlock img").attr("src", "../img/account/nochoose.png");
		$(".accountBalanceBlock .payDetailBlock").css("display", "none");
	}
	balanceNoChoose = !balanceNoChoose;
	document.querySelector(".operateBlock .nextStap").innerHTML = "去支付";
})
var otherNoChoose = true;
$(".otherPayBlock .chooseBlock").on("click", function() {
	if(otherNoChoose) { //选中
		$(".otherPayBlock .chooseBlock img").attr("src", "../img/account/choose.png");
		$(".otherPayBlock .payDetailBlock").css("display", "block");

		if(!balanceNoChoose) {
			$(".accountBalanceBlock .chooseBlock img").attr("src", "../img/account/nochoose.png");
			$(".accountBalanceBlock .payDetailBlock").css("display", "none");
			balanceNoChoose = !balanceNoChoose;
		}
		//		添加支付宝支付链接
		if(paylevel == 1) {
			//			document.querySelector(".operateBlock .nextStap").innerHTML = '<a href="https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?uid=' + userinfo.uid + '&token=' + userinfo.token + '&money=2988.00&body=-1" style="color:#333;" target="_blank">去支付</a>';
			document.querySelector(".operateBlock .nextStap").innerHTML = '<a href="https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?uid=' + userinfo.uid + '&token=' + userinfo.token + '&money=2988.00&ordertype=6&shopid=1&id='+supplierbalanceid+'" style="color:#333;" target="_blank">去支付</a>';
		}
		if(paylevel == 2) {
			document.querySelector(".operateBlock .nextStap").innerHTML = '<a href="https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?uid=' + userinfo.uid + '&token=' + userinfo.token + '&money=5688.00&ordertype=6&shopid=2&id='+supplierbalanceid+'" style="color:#333;" target="_blank">去支付</a>';
		}
		if(paylevel == 3) {

			document.querySelector(".operateBlock .nextStap").innerHTML = '<a href="https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?uid=' + userinfo.uid + '&token=' + userinfo.token + '&money=36888.00&ordertype=6&shopid=3&id='+supplierbalanceid+'" style="color:#333;" target="_blank">去支付</a>';

		}
		document.querySelector(".operateBlock .nextStap").style.cssText = "background:#FF3A46;";

	} else { //取消选中
		$(".otherPayBlock .chooseBlock img").attr("src", "../img/account/nochoose.png");
		$(".otherPayBlock .payDetailBlock").css("display", "none");
		document.querySelector(".operateBlock a").setAttribute("href", "");
	}
	otherNoChoose = !otherNoChoose;
})

document.querySelector(".operateBlock .nextStap").addEventListener("click", function() {
	if(balanceNoChoose && otherNoChoose) {
		alert("请选择支付方式!");
		return;
	}
	var payLevel = getPayLevel("paylevel");
	var money;
	if(payLevel == "1") {
		money = 2988.00;
		id=-1;
	}
	if(payLevel == "2") {
		money = 5688.00;
		id=-2;
	}
	if(payLevel == "3") {
		money = 36888.00;
		id=-3;
	}
	if(!balanceNoChoose) { //余额支付  去支付
		if(!document.querySelector(".accountBalanceBlock .inputWapper input").value && parseFloat(canWithDrawMoney) > money) {
			document.querySelector(".accountBalanceBlock .inputWapper .balanceAlert").style.display = "inline-block";
			document.querySelector(".accountBalanceBlock .inputWapper .balanceAlert").innerHTML = "请输入验证码！";
			return;
		}
		//	验证手机验证码
		var code = document.querySelector(".accountBalanceBlock .inputWapper input").value;
		$.ajax({
			type: "post",
			url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/tphone",
			data: {
				token: userinfo.token,
				timestamp: new Date().getTime() / 1000,
				uid: userinfo.uid,
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
					document.querySelector(".accountBalanceBlock .balanceAlert").style.display = "inline-block";
					document.querySelector(".accountBalanceBlock .balanceAlert").innerHTML = "验证码错误！";
				}
				if(data.message == "验证码失效请重新获取验证码") {
					//余额支付接口
					document.querySelector(".accountBalanceBlock .balanceAlert").style.display = "inline-block";
					document.querySelector(".accountBalanceBlock .balanceAlert").innerHTML = "验证码失效请重新获取验证码！";
				}
			},
			error: function(msg) {
				console.log(msg);
			}
		})

	}

	if(!otherNoChoose) { //支付宝支付
		$('.beingAlipay').show();
		var timestamp = "";
		var getStatus = setInterval(function() {
			console.info({token: userinfo.token,uid: userinfo.uid,time: timestamp,money: money});
			$.ajax({
				type: "post",
				url: "https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/getStatus",
				data: {
					token: userinfo.token,
					uid: userinfo.uid,
					time: timestamp
					//money: money
					//body: id
				},
				success: function(data) {
                    timestamp = data.data;
					if(data.message == "成功") {
                        $('.beingAlipay').hide();
						window.location.href = "upgradevipsuccess.html?paylevel=" + paylevel + "";
						getStatus.clearInterval();
					}
				},
				error: function(msg) {
					console.log(msg);
				}
			})

		}, 1000);

	}
})

//余额支付
function balanceRechargeRequest() {
	console.log("id---"+id);
	if(paylevel == "1") {
		money = 2988.00;
	}
	if(paylevel == "2") {
		money = 5688.00;
	}
	if(paylevel == "3") {
		money = 36888.00;
	}

	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activitydelete/shopbalance",
		data: {
			token: userinfo.token,
			timestamp: new Date().getTime() / 1000,
			uid: userinfo.uid,
			money: money,
			paylevel: paylevel,
			supplierbalanceid:supplierbalanceid,
			upgraderecordid:upgraderecordid
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.message == "成功") {
				window.location.href = "upgradevipsuccess.html?paylevel=" + paylevel + "";
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