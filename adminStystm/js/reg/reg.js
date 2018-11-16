//账号提示
document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/alert.png) no-repeat 0px center;color:#999;";
document.querySelector(".userNameWapper .alertSpan span").html = "请输入3-25位字符，推荐使用中文用户名。";

//密码提示
document.querySelector(".passWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/alert.png) no-repeat 0px center;color:#999;";
document.querySelector(".passWordWapper .alertSpan span").html = "字母为6-20个字符，请使用字母加数字或下划线组合密码。";

//图形验证码提示
document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/alert.png) no-repeat 0px center;color:#999;";
document.querySelector(".imgVerifyWapper .alertSpan span").html = "字母为6-20个字符，请使用字母加数字或下划线组合密码。";

////所有的输入框在输入的时候提示  蓝色标识
//document.querySelector(".username").addEventListener("focus",function(){
//});

//用户名验证
document.querySelector(".username").addEventListener("input", function() {
//	var userNameValue = document.querySelector(".userNameWapper input").value.trim();
//	if(!userNameValue){
//		document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:none;";
//		document.querySelector(".userNameWapper .passImg").style.cssText="display:none";
//	}
});

//用户名  失去焦点
var userNameOk=true;
document.querySelector(".username").addEventListener("blur", function() {
	document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:none;";
	document.querySelector(".userNameWapper .passImg").style.cssText="display:none";
	userNameOk=true;
	
	var username = document.querySelector(".username").value.trim();
	
	var sum = 0;
	for(var i = 0; i < username.length; i++) {
		if((username.charCodeAt(i) < 0) || (username.charCodeAt(i) > 255)) {
			sum += 2;
		} else {
			sum += 1;
		}
	}
	if(sum < 3 || sum > 25) {
		document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".userNameWapper .alertSpan span").innerHTML = "用户名为3-25位字符！";
		userNameOk=false;
	}

	if(!(/^.*[^\d].*$/).test(username)) {
		document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".userNameWapper .alertSpan span").innerHTML = "用户名不能为纯数字！";
		userNameOk=false;
	}

	if(username.replace(/_/g, "") == "") {
		document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".userNameWapper .alertSpan span").innerHTML = "用户名不能全为下划线！";
		userNameOk=false;
	}

	if((/\s/).test(username)) {
		document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".userNameWapper .alertSpan span").innerHTML = "用户名不能包含空格！";
		userNameOk=false;
	}

	var threePattern = /^[\da-zA-Z_\u4e00-\u9f5a]{1,25}$/;
	if(!threePattern.test(username)) {
		document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".userNameWapper .alertSpan span").innerHTML = "用户名只支持中英文、数字、下划线！";
		userNameOk=false;
	}
//	验证通过
//	alert("userNameOk----"+userNameOk);
	if(userNameOk==true){
		document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:none;";
		document.querySelector(".userNameWapper .passImg").style.cssText="display:inline-block";
	}
});

//密码  失去焦点
var pwdOk=true;
document.querySelector(".password").addEventListener("blur", function() {
	document.querySelector(".passWordWapper .alertSpan").style.cssText = "display:none;";
	document.querySelector(".passWordWapper .passImg").style.cssText="display:none";
	document.querySelector(".passWordWapper .safeSpan").style.cssText ="display:none";
	pwdOk=true;
	
	var pwd = document.querySelector(".password").value.trim();

	if(!(/^.*[^\d].*$/).test(pwd)) {
		document.querySelector(".passWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".passWordWapper .alertSpan span").innerHTML = "密码不能为纯数字！";
		pwdOk=false;
	}

	var alphabetPattern = /^[A-Za-z]+$/;
	if(alphabetPattern.test(pwd)) {
		document.querySelector(".passWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".passWordWapper .alertSpan span").innerHTML = "密码不能为纯字母！";
		pwdOk=false;
	}

	if(pwd.replace(/_/g, "") == "") {
		document.querySelector(".passWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".passWordWapper .alertSpan span").innerHTML = "密码不能全为下划线！";
		pwdOk=false;
	}

	var nullPattern = /\s/;
	if(nullPattern.test(pwd)) {
		document.querySelector(".passWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".passWordWapper .alertSpan span").innerHTML = "密码不能包含空格！";
		pwdOk=false;
	}

	var threePattern = /^[\da-zA-Z_]{6,20}$/;
	if(!threePattern.test(pwd)) {
		document.querySelector(".passWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".passWordWapper .alertSpan span").innerHTML = "密码只支持英文、数字、下划线！";
		pwdOk=false;
	}

	if(pwd.length < 6 || pwd.length > 20) {
		document.querySelector(".passWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".passWordWapper .alertSpan span").innerHTML = "密码为6-20字符！";
		pwdOk=false;
	}
	
//	验证码不为空的情况下,密码框和确认框是否相同
	var surePwd = document.querySelector(".surePwd").value.trim();
	if(surePwd.length != 0) {
		if(surePwd != pwd) {
//			alert("不同")
			document.querySelector(".surePassWordWapper .passImg").style.cssText="none";
			document.querySelector(".surePassWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
			document.querySelector(".surePassWordWapper .alertSpan span").innerHTML = "您输入的密码不一致，请重新输入！";
//			pwdOk=false;
		}
	}
	
	//	验证通过
	if(pwdOk==true){
		document.querySelector(".passWordWapper .alertSpan").style.cssText = "display:none;";
		document.querySelector(".passWordWapper .passImg").style.cssText="display:inline-block";
		if(surePwd.length != 0) {
			if(surePwd == pwd) {
				document.querySelector(".surePassWordWapper .alertSpan").style.cssText = "display:none;";
				document.querySelector(".surePassWordWapper .passImg").style.cssText="display:inline-block";
			}
		}
		//	 验证密码安全等级
		var safeLevel = AnalyzePasswordSecurityLevel(pwd);
		if(safeLevel == 1) {
			document.querySelector(".passWordWapper .alertSpan").style.cssText = "display: none;";
			document.querySelector(".passWordWapper .safeSpan").style.cssText = "background:url(../img/reg/leval1.png) no-repeat left center;display:inline-block;"
		} else if(safeLevel == 2) {
			document.querySelector(".passWordWapper .alertSpan").style.cssText = "display: none;";
			document.querySelector(".passWordWapper .safeSpan").style.cssText = "background:url(../img/reg/leval2.png) no-repeat left center;display:inline-block;"
		} else if(safeLevel == 3) {
			document.querySelector(".passWordWapper .alertSpan").style.cssText = "display: none;";
			document.querySelector(".passWordWapper .safeSpan").style.cssText = "background:url(../img/reg/leval3.png) no-repeat left center;display:inline-block;"
		} else if(safeLevel == 4) {
			document.querySelector(".passWordWapper .alertSpan").style.cssText = "display: none;";
			document.querySelector(".passWordWapper .safeSpan").style.cssText = "background:url(../img/reg/leval4.png) no-repeat left center;display:inline-block;"
		}
	}
	
	if(pwdOk){
		//	 验证密码安全等级
		var safeLevel = AnalyzePasswordSecurityLevel(pwd);
		if(safeLevel == 1) {
			document.querySelector(".passWordWapper .alertSpan").style.cssText = "display: none;";
			document.querySelector(".passWordWapper .safeSpan").style.cssText = "background:url(../img/reg/leval1.png) no-repeat left center;display:inline-block;"
		} else if(safeLevel == 2) {
			document.querySelector(".passWordWapper .alertSpan").style.cssText = "display: none;";
			document.querySelector(".passWordWapper .safeSpan").style.cssText = "background:url(../img/reg/leval2.png) no-repeat left center;display:inline-block;"
		} else if(safeLevel == 3) {
			document.querySelector(".passWordWapper .alertSpan").style.cssText = "display: none;";
			document.querySelector(".passWordWapper .safeSpan").style.cssText = "background:url(../img/reg/leval3.png) no-repeat left center;display:inline-block;"
		} else if(safeLevel == 4) {
			document.querySelector(".passWordWapper .alertSpan").style.cssText = "display: none;";
			document.querySelector(".passWordWapper .safeSpan").style.cssText = "background:url(../img/reg/leval4.png) no-repeat left center;display:inline-block;"
		}	
	}
	
	
});

//确认密码  失去焦点
var surePwdOk=true;
document.querySelector(".surePwd").addEventListener("blur", function() {
	document.querySelector(".surePassWordWapper .alertSpan").style.cssText = "display:none;";
	document.querySelector(".surePassWordWapper .passImg").style.cssText="display:none";
	surePwdOk=true;
	
	var surePwd = document.querySelector(".surePwd").value.trim();
	if(surePwd.length != 0) {
		var pwd = document.querySelector(".password").value.trim();
		if(surePwd != pwd) {
			document.querySelector(".surePassWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
			document.querySelector(".surePassWordWapper .alertSpan span").innerHTML = "您输入的密码不一致，请重新输入！";
			surePwdOk=false;
		}
		//	验证通过
		if(surePwdOk==true&&pwdOk){
			document.querySelector(".surePassWordWapper .alertSpan").style.cssText = "display:none;";
			document.querySelector(".surePassWordWapper .passImg").style.cssText="display:inline-block";
		}
	}
});

//图形验证码  失去焦点
var imgCodeOk=true;
$.idcode.setCode();
document.querySelector("#Txtidcode").addEventListener("blur", function() {
	document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:none;";
	document.querySelector(".imgVerifyWapper .passImg").style.cssText="display:none";
	imgCodeOk=true;
	
	var IsBy = $.idcode.validateCode();
	if(!IsBy) {
		document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".imgVerifyWapper .alertSpan span").innerHTML = "您的验证码填写不正确！";
		imgCodeOk=false;
	}
	if(imgCodeOk){
		document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:none;";
		document.querySelector(".imgVerifyWapper .passImg").style.cssText="display:inline-block";
	}
});

//document.querySelector(".surePassWordWapper input").addEventListener("focus",function(){
//	document.querySelector(".surePassWordWapper .alertSpan").style.display="inline-block";
//	document.querySelector(".surePassWordWapper .alertSpan").cssText="display:inline-block;background:url(../../img/reg/alert.png) no-repeat 0px center;color:#999;";
//	document.querySelector(".surePassWordWapper .alertSpan").html="字母为6-20个字符，请使用字母加数字或下划线组合密码。";
//});
//document.querySelector(".imgVerifyWapper input").addEventListener("focus",function(){
//	document.querySelector(".imgVerifyWapper .alertSpan").style.display="inline-block";
//	document.querySelector(".imgVerifyWapper .alertSpan").cssText="display:inline-block;background:url(../../img/reg/alert.png) no-repeat 0px center;color:#999;";
//	document.querySelector(".imgVerifyWapper .alertSpan").html="请输入图形验证码，不区分大小写。";
//});


//注册
document.querySelector("#register").addEventListener("click", function() {
	var username = document.querySelector(".username").value.trim();
	var pwd = document.querySelector(".password").value.trim();
	var surePwd = document.querySelector(".surePwd").value.trim();
	var txtVerification = document.querySelector(".txtVerification").value.trim();
	
	if(!username){
		document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".userNameWapper .alertSpan span").innerHTML = "请输入用户名！";
		return;
	}
	if(!pwd){
		document.querySelector(".passWordWapper .safeSpan").style.cssText="display:none;";
		document.querySelector(".passWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".passWordWapper .alertSpan span").innerHTML = "请输入密码！";
		return;
	}
	if(!surePwd){
		document.querySelector(".surePassWordWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".surePassWordWapper .alertSpan span").innerHTML = "请再次输入密码！";
		return;
	}
	if(!txtVerification){
		document.querySelector(".imgVerifyWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
		document.querySelector(".imgVerifyWapper .alertSpan span").innerHTML = "请再次验证码！";
		return;
	}
	if(userNameOk&&pwdOk&&surePwdOk&&imgCodeOk){
		if(!$('.userProtocol input').is(':checked')) {
			alert('请阅读用户使用协议!');
			return;
		}
		$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Backlanding/register",
		data: {
			username: username,
			password: pwd
		},
		success: function(data) {
			if(data.state==1){
                localStorage.setItem("userinfo",JSON.stringify(data.data));
                localStorage.setItem("headerinfo",JSON.stringify(data.datas[0]));
				window.location.href="testaccountinfo.html"
			}
			if(data.state==2){
				document.querySelector(".userNameWapper .passImg").style.cssText="display:none;";
				document.querySelector(".userNameWapper .alertSpan").style.cssText = "display:inline-block;background:url(../img/reg/wrong.png) no-repeat 0px center;color:#ff3a46;";
				document.querySelector(".userNameWapper .alertSpan span").innerHTML = "您注册的用户名已经被注册，请重新更换新的用户名！";
			}
			console.log(JSON.stringify(data));
		},
		error: function(msg) {
			console.log(msg);
		}
		});

	}
//	console.log("userNameValue----" + userNameValue);
//	console.log("passWordValue----" + passWordValue);
	
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
$('.openDealMaskWin').click(function(){
    $('.dealMaskWin').show();
});
$('.dealMaskWin .closeBtn').click(function(){
	$('.' + $(this).data('for')).hide();
})

