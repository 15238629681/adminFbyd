(function() {
	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			scrollIndicator: "none"
		})
	})
})();

var userinfo = JSON.parse(localStorage.getItem("userinfo"));
//加入发送
//加入发送请求参数
var addSendList = {
	token: userinfo.token,
	timestamp: parseInt(new Date().getTime() / 1000),
	gid: "",
	uid: userinfo.userinfo.uid,
	action: "1"
}

//加入发送
mui(".mui-content").on("tap", ".addSend", function(e) {
	var that = this;
	var masking = this.parentNode.parentNode.getElementsByClassName("maskDiv")[0];
	var gid = this.parentNode.parentNode.getAttribute("data-id");
	addSendList.gid = gid;
	var choose = this.parentNode.parentNode.getAttribute("data-choose");
	if(choose == "1") { //取消加入发送
		addSendList.timestamp = parseInt(new Date().getTime() / 1000);
		addSendList.action = '0';
		addSend_request(that);
	} else { //加入发送
		addSendList.timestamp = parseInt(new Date().getTime() / 1000);
		addSendList.action = '1';
		addSend_request(that);
	}
	//				}
	e.stopPropagation();
});

function addSend_request(that) {
	addSendList.timestamp = parseInt(new Date().getTime() / 1000);
	mui.ajax(
		"https://app.fanbaoyundian.com/appapi/choose.app.php", {
			data: {
				token: addSendList.token,
				timestamp: addSendList.timestamp,
				gid: addSendList.gid,
				uid: addSendList.uid,
				action: addSendList.action
			},
			dataType: 'json',
			type: "post",
			success: function(data) {
				if(data.state == "0") {
					plus.nativeUI.toast(data.message);
				} else {
					if(data.message == "加入发送成功") {
						plus.nativeUI.toast("加入发送成功");
						var masking = that.parentNode.parentNode.getElementsByClassName("maskDiv")[0];
						masking.className = "maskDiv";
						masking.setAttribute("data-choose", "1");
						that.parentNode.parentNode.setAttribute("data-choose", "1");
						that.innerHTML = "取消发送";
					} else {
						plus.nativeUI.toast("取消发送成功");
						var masking = that.parentNode.parentNode.getElementsByClassName("maskDiv")[0];
						masking.classList.add("maskDivNone");
						masking.setAttribute("data-choose", "0");

						that.parentNode.parentNode.setAttribute("data-choose", "0");

						that.innerHTML = "加入发送";
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				if(type == "timeout") {
					plus.nativeUI.toast("请求超时，请检查网络");
				}
				plus.nativeUI.toast(errorThrown);
			}
		})
}

//马上推广
mui(".mui-content").on("tap", ".spread", function(e) {
	//				alert("推广页面");
	//				alert(e.target.nodeName)
	if(e.target.nodeName == "SPAN" && e.target.getAttribute("class") == "spread") {
		var sharePage = mui.preload({
			"id": 'sharePage',
			"url": '../storehouse/share.html'
		});
		var gid = this.getAttribute("data-id");
		var num_iid = this.getAttribute("data-numiid");
		setTimeout(function() {
			mui.fire(sharePage, 'shareinfo', {
				gid: gid,
				num_iid: num_iid
			});
			mui.openWindow({
				id: "sharePage"
			});
		}, 250)
	}
	e.stopPropagation();
});
mui(".mui-content").on("tap", ".right", function(e) {
	e.stopPropagation();
})
//商品详情页
mui('.mui-content').on('tap', '.goodsBlock', function(e) {
	e.stopPropagation();
	var goodsdetail = mui.preload({
		"id": 'goodsdetail',
		"url": '../storehouse/goodsdetail.html'
	});
	var id = this.getAttribute("id");
	//触发详情页的newsId事件         预加载页面/自定义事件名/传递的参数
	var gid = this.getAttribute("data-id");
	var num_iid = this.getAttribute("data-numiid");
	var cid = this.getAttribute("data-cid");
	//打开详情页面
	setTimeout(function() {
		mui.fire(goodsdetail, 'transTodetail', {
			gid: gid,
			num_iid: num_iid,
			cid: cid
		});
		mui.openWindow({
			id: "goodsdetail"
		});
	}, 250)
});

//综合排序模块  
function comprehensiveRankTextFn() { //综合排序文字  的点击事件
	if(noGoods) {
		return;
	}
	if(!zhpxFlag) {
		document.getElementsByClassName("zhpxList")[0].style.display = "block";
		zhpxText.getElementsByClassName("downArrow")[0].style.display = "none";
		zhpxText.getElementsByClassName("upArrow")[0].style.display = "inline-block";
	} else {
		document.getElementsByClassName("zhpxList")[0].style.display = "none";
		zhpxText.getElementsByClassName("downArrow")[0].style.display = "inline-block";
		zhpxText.getElementsByClassName("upArrow")[0].style.display = "none";
	}
	zhpxFlag = !zhpxFlag;
};

//等待加载动画
function waitingLoadingFn() {
	partRefresh = true;
	document.getElementsByClassName("goodsList")[0].innerHTML = '<div id="waitingLoading"></div>';
}

var zhpxText = document.getElementsByClassName("zhpxText")[0];
zhpxText.addEventListener("tap", comprehensiveRankTextFn);

mui(".zhpxList").on("tap", "li", function() {
	zhpxFlag = false;
	partRefresh=true;
//	waitingLoadingFn();

	var orderText = this.getElementsByTagName("a")[0].innerHTML;
	document.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].innerHTML = orderText;

	//重置所有样式
	mui(".zhpxList li").each(function() {
		this.style.color = "#727171";
		this.getElementsByClassName("selectIcon")[0].style.display = "none";
	});
	//显示对号
	var index = this.getAttribute("data-index");
	document.getElementsByClassName("selectIcon")[index].style.display = "inline-block";

	this.style.color = "#FBBF00";
	this.style.borderBottom = "727171";
	this.classList.remove("mui-active");
	//					关闭排序的内容列表
	mui(".zhpxList")[0].style.display = "none";
	zhpxText.style.color = "#FBBD00";
	zhpxText.getElementsByClassName("upArrow")[0].style.display = "none";
	zhpxText.getElementsByClassName("downArrow")[0].style.display = "inline-block";

//	document.getElementsByClassName("goodsList")[0].innerHTML = "";
	waitingLoadingFn();
	//				partRefresh = true; 
	//				listArr = [];
	//				var nowFqcat = localStorage.getItem("nowFqcat");
	//				goodsList.fqcat = nowFqcat;
	//				goodsList.order = this.getAttribute("data-order");
	//				localStorage.setItem("nowOrderStoreCategory", goodsList.order);
	//				if(localStorage.getItem("sxConditionStoreCategory")) {
	//					var param = JSON.parse(localStorage.getItem("sxConditionStoreCategory"));
	//					goodsList.price = param.price;
	//					goodsList.lirun = param.price;
	//					goodsList.volume = param.volume;
	//					goodsList.brand = param.brand;
	//					goodsList.sea = param.sea;
	//				}
	//				list_request(nowFqcat);

	var nowOrder = this.getAttribute("data-order");
	localStorage.setItem("nowOrderStoreCategory", nowOrder);
	var getcategory = new Getcategory(fqcat, fqcat, mui, nowOrder);
	getcategory.list_request();
	getcategory.Init2();

});

//滚动窗口   关闭zhpxList
//用户进行上下滑动,如果综合排序的列表出现的话,就关闭
var mybody = document.getElementsByTagName('body')[0];
var startX, startY, moveEndX, moveEndY, X, Y;
mybody.addEventListener('touchstart', function(e) {
	// e.preventDefault(); 
	startX = e.touches[0].pageX;
	startY = e.touches[0].pageY;
}, false);
mybody.addEventListener('touchmove', function(e) {
	// e.preventDefault();
	moveEndX = e.changedTouches[0].pageX;
	moveEndY = e.changedTouches[0].pageY;
	X = moveEndX - startX;
	Y = moveEndY - startY;
	if(Math.abs(X) > Math.abs(Y) && X > 0) {
		// right alert('向右'); 

	} else if(Math.abs(X) > Math.abs(Y) && X < 0) {
		// left alert('向左');

	} else if(Math.abs(Y) > Math.abs(X) && Y > 0) {
		// down alert('向下'); 
		//关闭综合排序列表
		if(zhpxFlag) {
			document.getElementsByClassName("zhpxList")[0].style.display = "none";
			document.getElementsByClassName("zhpxText")[0].getElementsByClassName("upArrow")[0].style.display = "none";
			document.getElementsByClassName("zhpxText")[0].getElementsByClassName("downArrow")[0].style.display = "inline-block";
			e.stopPropagation();
		}
		zhpxFlag = false;
	} else if(Math.abs(Y) > Math.abs(X) && Y < 0) {
		// up alert('向上');
		//关闭综合排序列表
		if(zhpxFlag) {
			document.getElementsByClassName("zhpxList")[0].style.display = "none";
			document.getElementsByClassName("zhpxText")[0].getElementsByClassName("upArrow")[0].style.display = "none";
			document.getElementsByClassName("zhpxText")[0].getElementsByClassName("downArrow")[0].style.display = "inline-block";
			e.stopPropagation();
		}
		zhpxFlag = false;
	} else {
		//没有发生滑动 alert('没有发生滑动'); 
	}
});