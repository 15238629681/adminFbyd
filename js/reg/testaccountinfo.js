var userinfo = JSON.parse(localStorage.getItem("userinfo"));

//图形验证码提示
document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/alert.png) no-repeat 0px center;color:#999;";
document.querySelector(".imgVerifyWapper .alertSpan span").html = "字母为6-20个字符，请使用字母加数字或下划线组合密码。";

//短信验证码提示
document.querySelector(".messageTextWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/alert.png) no-repeat 0px center;color:#999;";
document.querySelector(".messageTextWapper .alertSpan span").html = "请输入手机验证码，不区分大小写。";

//手机号验证
document.querySelector(".phoneWapper").addEventListener("input", function() {
	//	var userNameValue = document.querySelector(".userNameWapper input").value.trim();
	//	if(!userNameValue){
	//		document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:none;";
	//		document.querySelector(".userNameWapper .passImg").style.cssText="display:none";
	//	}
});

//手机号  失去焦点
var phoneOk = true;
document.querySelector(".phone").addEventListener("blur", function() {
	document.querySelector(".phoneWapper .alertSpan").style.cssText = "display:none;";
	//	document.querySelector(".phoneWapper .passImg").style.cssText = "display:none";
	phoneOk = true;

	var phone = document.querySelector(".phone").value.trim();

	if(!(/^1[34578]\d{9}$/.test(phone))) {
		document.querySelector(".phoneWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".phoneWapper .alertSpan span").innerHTML = "手机号码格式不正确！";
		phoneOk = false;
	}

	//	验证通过
	//	alert("userNameOk----"+userNameOk);
	if(phoneOk == true) {
		document.querySelector(".phoneWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/pass.png) no-repeat 0px center;color:#FBBD00;";
		document.querySelector(".phoneWapper .alertSpan span").innerHTML = "此手机号可作为登录手机号，并作为提现时接收验证码的初始手机号。";
	}
});

//图形验证码  失去焦点
var imgCodeOk = true;
$.idcode.setCode();
document.querySelector("#Txtidcode").addEventListener("blur", function() {
	document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:none;";
	document.querySelector(".imgVerifyWapper .passImg").style.cssText = "display:none";
	imgCodeOk = true;

	var IsBy = $.idcode.validateCode();
	if(!IsBy) {
		document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".imgVerifyWapper .alertSpan span").innerHTML = "您的验证码填写不正确！";
		imgCodeOk = false;
	}
	if(imgCodeOk) {
		document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:none;";
		document.querySelector(".imgVerifyWapper .passImg").style.cssText = "display:inline-block";
	}
});

//短信验证码
var messageCodeOk = true;
document.querySelector(".messageNum").addEventListener("blur", function() {
	document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:none;";
	document.querySelector(".imgVerifyWapper .passImg").style.cssText = "display:none";
	messageCodeOk = true;

	if(!document.querySelector(".messageNum").value) {
		document.querySelector(".messageTextWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".messageTextWapper .alertSpan span").innerHTML = "请输入短信验证码！";
		//		document.querySelector(".messageTextWapper .passImg").style.cssText = "display:inline-block";
		messageCodeOk = false;
	}
	if(messageCodeOk) {
		document.querySelector(".messageTextWapper .alertSpan").style.cssText = "display:none;";
		document.querySelector(".messageTextWapper .passImg").style.cssText = "display:inline-block";
	}
});

//获取短信验证码
//手机号登陆      获取短信验证码
var nextGetFlag = false;
var phoneNum; //获取手机号验证码
var getCodeTime; //获取手机验证码的开始时间
$(".getMessageCode").on("click", function() {
	//	$(".alertMessage").css("display", "none");
	var IsBy = $.idcode.validateCode();

	if(!$(".phone").val()) {
		document.querySelector(".phoneWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".phoneWapper .alertSpan span").innerHTML = "请输入手机号！";
		phoneOk = false;
		return;
	} else if(!(/^1[34578]\d{9}$/.test($(".phone").val()))) {
		document.querySelector(".phoneWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".phoneWapper .alertSpan span").innerHTML = "手机号码格式不正确！";
		phoneOk = false;
		return;
	} else if(!$("#Txtidcode").val()) {
		document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".imgVerifyWapper .alertSpan span").innerHTML = "请输入验证码！";
		imgCodeOk = false;
		return;
	} else if(!IsBy) {
		document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".imgVerifyWapper .alertSpan span").innerHTML = "您的验证码填写不正确！";
		imgCodeOk = false;
		return;
	}
	//				不变验证码的情况下,开始倒计时
	if(!nextGetFlag) {
		var IsBy = $.idcode.validateCode(); //调用返回值，返回值结果为true或者false
		//发短信   开始倒计时
		var lastTime = 60;
		if(!nextGetFlag) {
			$(".getMessageCode").html("重新获取60s");
			nextGetFlag = true;
			getCodeTime = new Date().getTime() / 1000;
			phoneNum = $(".phone").val();
			//			获取短信验证码
			$.ajax({
				type: "post",
				url: "https://app.fanbaoyundian.com/h5api/verifycode.app.php",
				data: {
					phonenumber: $('.phone').val(),
					action: "reg"
				},
				success: function(data) {
					console.log(JSON.stringify(data));
					if(data.message == "该手机号已注册") { //手机号已注册
						//alert("手机号绑定失败");
						nextGetFlag = false;
                        $(".getMessageCode").html("获取短信验证码");
						document.querySelector(".phoneWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
						document.querySelector(".phoneWapper .alertSpan span").innerHTML = "手机号码已绑定其他用户！";
						return;
					} else if(data.message == "发送失败，稍后再试") {
						alert("发送失败，稍后再试!");
						return;
					}else{
						var interval = setInterval(function() {
							lastTime--;
							$(".getMessageCode").html("重新获取" + lastTime + "s");
							if(lastTime == 0) {
								$(".getMessageCode").html("获取短信验证码");
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

//提交
document.querySelector("#submit").addEventListener("click", function() {
	//	document.querySelector(".phoneWapper .alertSpan").style.cssText = "display:none;";
	//	document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:none;";
	//	document.querySelector(".messageTextWapper .alertSpan").style.cssText = "display:none;";

	var phone = document.querySelector(".phone").value.trim();

	var Txtidcode = document.querySelector("#Txtidcode").value.trim();
	var messageNum = document.querySelector(".messageNum").value.trim();
	//	var txtVerification = document.querySelector(".txtVerification").value.trim();

	if(!phone) {
		//		alert(phone)
		document.querySelector(".phoneWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".phoneWapper .alertSpan span").innerHTML = "请填写手机号！";
		return;
	}
	//	if(phone){
	//		document.querySelector(".phoneWapper .alertSpan span").style.cssText = "此手机号可作为登录手机号，并作为提现时接收验证码的初始手机号。";
	//	}
	if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone))) {
		document.querySelector(".phoneWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".phoneWapper .alertSpan span").innerHTML = "手机号码格式不正确！";
		phoneOk = false;
		return;
	}
	if(!Txtidcode) {
		document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".imgVerifyWapper .alertSpan span").innerHTML = "请填写图形验证码！";
		return;
	}
	var IsBy = $.idcode.validateCode();
	if(!IsBy) {
		document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".imgVerifyWapper .alertSpan span").innerHTML = "您的验证码填写不正确！";
		imgCodeOk = false;
		return;
	}
	if(!messageNum) {
		document.querySelector(".messageTextWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".messageTextWapper .alertSpan span").innerHTML = "验证码为空！";
		return;
	}

	var subCodeTime = new Date().getTime() / 1000;
	if(parseInt(subCodeTime) - parseInt(getCodeTime) > 600) {
		document.querySelector(".messageTextWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".messageTextWapper .alertSpan span").innerHTML = "此验证码已失效，请重新获取验证码！";
		return;
	}

	console.log(phoneOk, imgCodeOk, messageCodeOk)
	if(phoneOk && imgCodeOk && messageCodeOk) {
		var timestamp = new Date().getTime() / 1000;
		if(!phoneNum) {
			phoneNum = phone;
		}
		$.ajax({
			type: "post",
			url: "https://app.fanbaoyundian.com/apiapiextend/apia/Backlanding/phoneRegister",
			data: {
				token: userinfo.token,
				timestamp: timestamp,
				uid: userinfo.uid,
				phone: phoneNum,
				code: messageNum,
			},
			success: function(data) {
				//				var data=JSON.stringify(data);
				console.log(JSON.stringify(data))
				if(data.message == "验证信息不存在或验证码错误") {
					document.querySelector(".messageTextWapper .passImg").style.cssText = "display:none;";
					document.querySelector(".messageTextWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
					document.querySelector(".messageTextWapper .alertSpan span").innerHTML = "验证码错误！";
				}
				if(data.message == "手机号绑定失败") {
					alert("手机号绑定失败");
				}
				if(data.message == "该手机号已注册") { //手机号已注册
					//alert("手机号绑定失败");
					document.querySelector(".phoneWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
					document.querySelector(".phoneWapper .alertSpan span").innerHTML = "手机号码已绑定其他用户！";
				}
				if(data.message == "非法请求") {
					alert("非法请求");
				}
				if(data.message == "验证码失效请重新获取验证码") {
					document.querySelector(".messageTextWapper .passImg").style.cssText = "display:none;";
					document.querySelector(".messageTextWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
					document.querySelector(".messageTextWapper .alertSpan span").innerHTML = "此验证码已失效，请重新获取验证码！";
				}
				if(data.message == "成功") {
					window.location.href = "regsuccess.html";
				}
			},
			error: function(msg) {
				console.log(msg);
			}
		});
	}
})

//验证密码  安全等级
function AnalyzePasswordSecurityLevel(password) {
	var pwdArray = new Array();
	var securityLevelFlag = 0;
	if(password.length < 6) {
		return 0;
	} else {
		var securityLevelFlagArray = new Array(0, 0, 0, 0);
		for(var i = 0; i < password.length; i++) {
			var asciiNumber = password.substr(i, 1).charCodeAt();
			if(asciiNumber >= 48 && asciiNumber <= 57) {
				securityLevelFlagArray[0] = 1; //digital
			} else if(asciiNumber >= 97 && asciiNumber <= 122) {
				securityLevelFlagArray[1] = 1; //lowercase
			} else if(asciiNumber >= 65 && asciiNumber <= 90) {
				securityLevelFlagArray[2] = 1; //uppercase
			} else {
				securityLevelFlagArray[3] = 1; //specialcase
			}
		}

		for(var i = 0; i < securityLevelFlagArray.length; i++) {
			if(securityLevelFlagArray[i] == 1) {
				securityLevelFlag++;
			}
		}
		return securityLevelFlag;
	}
}