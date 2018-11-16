(function(){
	function getQueryString(name) {
	    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	        return unescape(r[2]);
	    }
	    return null;
	}
	var headLEFT = document.createElement("div");
	headLEFT.id = "logo";
//	headLEFT.innerHTML = "<img src='../img/public/logo.png' /><b>供应商管理后台</b>";
	headLEFT.innerHTML = "<img src='../img/public/logo.png'/>";
	var headMID = document.createElement("ul");
	headMID.className = "clean";
	var tabArr = ['首页','商品管理','订单管理','活动管理','供应商管理','违规管理','财务管理','账户管理'];
	var tabHref = ['../index/myjob.html?type=0','../product/productlist.html?type=1','../order/allorder.html?type=2','../activity/releaseexperienceactivity.html?type=3','#','#','../finance/accountbalance.html?type=6','../account/shopmanage.html?type=7'];
	for(var i = 0;i < 8;i++){
		var tabLi= document.createElement("li");
		var tabA = document.createElement("a");
		tabA.innerHTML = tabArr[i];
		tabA.href = tabHref[i];
		tabLi.className = "";
		if(getQueryString("type") == i){
			tabLi.className = "active";
		}
		tabLi.appendChild(tabA);
		headMID.appendChild(tabLi);
	}
    var userinfo=JSON.parse(localStorage.getItem("userinfo"));
    var headerinfo=JSON.parse(localStorage.getItem("headerinfo"));
	var headRIGHT = document.createElement("div");
	headRIGHT.id = "userinfo";
	if(headerinfo) headRIGHT.innerHTML = "<div id='user-name'>" +
			"<img src='../img/public/usericon.png' style='display: none;'/>" + headerinfo.username + " " +
			"<span class='downArrow'></span>" +
		"</div>" +
		"<div id='user-tab'>" +
			"<span>消息（<b>0</b>）</span>" +
			"<span class='onlineCustomService'>在线客服</span>" +
			"<span>规则中心</span>" +
		"</div>";


	var tapWrap = document.createElement("div");
	tapWrap.id = "tap-wrap";
	tapWrap.className = "clean";
	tapWrap.appendChild(headLEFT);
	tapWrap.appendChild(headMID);
	tapWrap.appendChild(headRIGHT);
	var Head = document.createElement("div");
	Head.id = "head";
	Head.appendChild(tapWrap);
	$("body").prepend(Head);
	if(!userinfo || !headerinfo){
		window.location.href="../index.html";
	}else{
        var page = getPageName();
		$.ajax({
			type: "post",
			url: "https://app.fanbaoyundian.com/apiapiextend/apia/Backlanding/VerificationC",
			data: {
				token: userinfo.token,
				uid: userinfo.uid,
				timestamp: new Date().getTime() / 1000,
                page: page
			},
			success: function(data) {
                $('#part-right').find('#loading').css({'display':'none'});
				if(parseInt(data.state) == 1) {
					//有权限
				}
                if(parseInt(data.state) == 2) {
                    //无权限
                    resetPageToEnter();
                }
				if(data.state == "3") {
					window.location.href="../index.html";
				}
			},
			error: function(msg) {
				console.log(msg);
			}
		})
	}
	function resetPageToEnter() {
        var location = $('#part-right').find('#loaction');
        $('#part-right').empty();
        $('#part-right').append(location);
        addImagePrompt();
	}
	function addImagePrompt() {
		var promptContainer = document.createElement('div');
        promptContainer.classList.add('promptContainer');
        promptContainer.innerHTML = '<div class="upPromptImage" style="background: url(../img/public/up_prompt.png) no-repeat;"></div>' +
			'<span class="prompt_title">抱歉，您非翻宝云店商品供应商，如需成为商品供应商，请提交相应资质入驻！</span>' +
			'<a class="toPromptButton" href="/admin/test/reg/fillenterinfo.html">前往入驻</a>' +
			'<span class="copyright">杭州牛啦网络科技有限公司 Copyright@翻宝云店2017 浙ICP备16047970号-3</span>';
        $('#part-right').append(promptContainer);
	}
	function getPageName() {
		var pathname = window.location.pathname;
        var pathArr = pathname.split('/');
		return pathArr[pathArr.length - 1];
	}
})();

/*
$(function(){
    var loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = '<img class="loadingImg" src="../img/public/downrefesh.gif"/><span class="loadingFont">加载中...</span>';
    loading.style.cssText = 'width:100%;height:100%;position:absolute;background-color: #FFFFFF;top: 0;left:0;';
    $('#part-right').append(loading);
});*/
/*function onlineCustomSevice(){
	console.info('移动上去了');
}*/
var windowFlag = false;
$('.onlineCustomService').click(function(event){
    if(windowFlag && event.target.className == 'onlineCustomService') {
    	customServiceWin.hide();
        windowFlag = false;
    } else {
    	customServiceWin.show();
        windowFlag = true;
    }
});
var customServiceWin = "";
function createCustomService(){
    customServiceWin = document.createElement('div');
    customServiceWin.className = 'customServiceWinCls';
    customServiceWin.id = 'customServiceWinID'
    customServiceWin.innerHTML =
		'<div class="workTimeCls">' +
			'<div class="box-bottom">' +
				'<span class="time1">工作时间</span><br/>' +
				'<span class="time2">周一至周日 9:00-23:00</span>' +
			'</div>' +
		'</div>' +
		'<div class="QQAndWx">' +
			'<div class="LeftPanelQQ">' +
				'<span>QQ客服</span>' +
				'<img src="../img/public/QQChat.png"/>' +
				'<span style="margin-top: 15px;">电话客服</span><br/>' +
				'<span>0571-28121129</span>' +
			'</div>' +
    		'<div class="LeftPanelWX">' +
				'<span>微信客服</span>' +
        		'<img src="../img/public/WXChat.png"/>' +
			'</div>' +
		'</div>' +
		'<div class="serviceMail">' +
			'<span>服务邮箱</span><br/>' +
        	'<span>CS@FANBAOYUNDIAN.COM</span>' +
        '</div>';
    $('.onlineCustomService').get(0).appendChild(customServiceWin);
    customServiceWin.show = function(){
        customServiceWin.style.display = 'block';
	}
    customServiceWin.hide = function(){
        customServiceWin.style.display = 'none';
    }
    $('.onlineCustomService .LeftPanelQQ img').click(function(){
    	window.open('http://wpa.qq.com/msgrd?v=3&uin=261521028&site=qq&menu=yes');
	});
}
createCustomService();
