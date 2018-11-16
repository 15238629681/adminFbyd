//每个页面的   综合排序  销量优先  优惠力度  


//商品详情页
mui('.mui-content').on('tap', '.storeGoodsBlock', function(e) {
	e.stopPropagation();
	var categorygoodsdetail = mui.preload({
		"id": 'categorygoodsdetail',
//		"url": '../../../category2/goodsdetail2.html'
		"url": '../cloudstore/goodsdetail.html'
	});
	//var id = this.getAttribute("id");
	//触发详情页的newsId事件         预加载页面/自定义事件名/传递的参数
	var gid = this.getAttribute("data-id");
	var num_iid = this.getAttribute("data-numiid");
	var cid = this.getAttribute("data-cid");
	//打开详情页面
	setTimeout(function() {
		mui.fire(categorygoodsdetail, 'transTodetail', {
			gid: gid,
			num_iid: num_iid,
			cid: cid
		});
		mui.openWindow({
			id: "categorygoodsdetail"
		});
	}, 250)
});

(function() {
	mui.plusReady(function() {
		plus.webview.currentWebview().setStyle({
			scrollIndicator: "none"
		});
		plus.nativeUI.closeWaiting();
	})
})();


var partRefresh = false;

//滚动到一定高度   固定排序方式
var yheight1 = 0;
window.addEventListener("scroll", function(e) {
	
	var searchListOffsetTop = document.getElementsByClassName("storeGoodsList")[0].offsetTop;
	//	console.log("searchListOffsetTop==="+searchListOffsetTop);
	yheight1 = window.scrollY;
	//	console.log("滑动的高度yheight1---" + yheight1);
	if(yheight1 >= 110) {
		yheight1 = 110;
		document.getElementsByClassName("publicOrder")[0].style.display = "block";
	} else {
		document.getElementsByClassName("publicOrder")[0].style.display = "none";
		var a = searchListOffsetTop - yheight1;

		//		document.getElementById("waitingLoading").style.cssText="height:calc( 100% - 153px );";
	}
});
//用户进行上下滑动,如果综合排序的列表出现的话,就关闭
var mybody = document.getElementsByTagName('body')[0];
var startX, startY, moveEndX, moveEndY, X, Y;
mybody.addEventListener('touchstart', function(e) {
	startX = e.touches[0].pageX;
	startY = e.touches[0].pageY;
}, false);
mybody.addEventListener('touchmove', function(e) {
	var nowOrder = localStorage.getItem("cloudstorecategoryOrder");
	moveEndX = e.changedTouches[0].pageX;
	moveEndY = e.changedTouches[0].pageY;
	X = moveEndX - startX;
	Y = moveEndY - startY;
	if(Math.abs(X) > Math.abs(Y) && X > 0) {
		// right alert('向右'); 
	} else if(Math.abs(X) > Math.abs(Y) && X < 0) {
		// left alert('向左');
	} else if(Math.abs(Y) > Math.abs(X) && Y > 0) {
		var zhpxLists = document.getElementsByClassName("zhpxList");
		for(var i = 0; i < zhpxLists.length; i++) {
			zhpxLists[i].style.display = "none";
		}
		zhpxFlag = false;
		var upArrows = document.getElementsByClassName("upArrow");
		if(nowOrder == "2" || nowOrder == "6") {
			upArrows[0].style.cssText = "border-top:6px solid #333;border-bottom:none;";
			upArrows[1].style.cssText = "border-top:6px solid #333;border-bottom:none;";
		} else {
			upArrows[0].style.cssText = "border-top:6px solid #FBBD00;border-bottom:none;";
			upArrows[1].style.cssText = "border-top:6px solid #FBBD00;border-bottom:none;";
		}
	} else if(Math.abs(Y) > Math.abs(X) && Y < 0) {
		var zhpxLists = document.getElementsByClassName("zhpxList");
		for(var i = 0; i < zhpxLists.length; i++) {
			zhpxLists[i].style.display = "none";
		}
		zhpxFlag = false;
		var upArrows = document.getElementsByClassName("upArrow");
		if(nowOrder == "2" || nowOrder == "6") {
			upArrows[0].style.cssText = "border-top:6px solid #333;border-bottom:none;";
			upArrows[1].style.cssText = "border-top:6px solid #333;border-bottom:none;";
		} else {
			//			alert(nowOrder)
			upArrows[0].style.cssText = "border-top:6px solid #FBBD00;border-bottom:none;";
			upArrows[1].style.cssText = "border-top:6px solid #FBBD00;border-bottom:none;";
		}
	} else {}
});

//			综合排序
var nowFqcat = localStorage.getItem("nowFqcat");
//localStorage.setItem("nowOrderFlag","1");
//每个选项卡的   综合排序
var muiContent = document.getElementsByClassName("mui-content")[0];
var publicOrder = document.getElementsByClassName("publicOrder")[0];
var zhpxText = muiContent.getElementsByClassName("zhpxText");
for(var index = 0; index < zhpxText.length; index++) {
	zhpxText[index].index = index;
	zhpxText[index].addEventListener("tap", function() {
		zhpxTextFn(this.index);
	});
}

//点击综合排序   直接默认排序方式就是 综合排序
//var zhpxFlag=false;
function zhpxTextFn(index) {
	var nowOrder = localStorage.getItem("cloudstorecategoryOrder");
	//	alert("1")
	//	var nowOrder=localStorage.getItem("cloudstorecategoryOrder");
	if(!zhpxFlag) { //目前是隐藏的,显示排序列表
		muiContent.getElementsByClassName("zhpxList")[index].style.display = "block";
		publicOrder.getElementsByClassName("zhpxList")[0].style.display = "block";
		if(nowOrder == "2" || nowOrder == "6") {
			muiContent.getElementsByClassName("upArrow")[0].style.cssText = "border-bottom:6px solid #333;border-top:none;";
		} else {
			//			alert("我应该")
			muiContent.getElementsByClassName("upArrow")[0].style.cssText = "border-bottom:6px solid #FBBD00;border-top:none;";
		}
	} else { //隐藏排序列表
		muiContent.getElementsByClassName("zhpxList")[index].style.display = "none";
		publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";
		if(nowOrder == "2" || nowOrder == "6") {
			muiContent.getElementsByClassName("upArrow")[0].style.cssText = "border-top:6px solid #333;border-bottom:none;";
		} else {
			//			alert("哈哈哈")
			muiContent.getElementsByClassName("upArrow")[0].style.cssText = "border-top:6px solid #FBBD00;border-bottom:none;";
		}
	}
	zhpxFlag = !zhpxFlag;
}
//等待加载动画
function waitingLoadingFn() {
	partRefresh = true;
	document.getElementsByClassName("storeGoodsList")[0].innerHTML = '<div id="waitingLoading"></div>';
	var bodyHeight = parseFloat(window.screen.height);
	document.getElementById("waitingLoading").style.cssText = "height:" + (bodyHeight - 255 + yheight1 + 40) + "px;";
}

//综合排序列表点击事件
mui(".mui-content .zhpxList").on("tap", "li", function() {
	zhpxFlag = false;
	waitingLoadingFn();
	//	alert(document.getElementById("waitingLoading").style.display)

	//重置zhpxList所有样式
	var lists = this.parentNode.getElementsByTagName("li");
	for(var i = 0; i < lists.length; i++) {
		lists[i].getElementsByClassName("selectIcon")[0].style.display = "none";
		lists[i].getElementsByTagName("a")[0].style.cssText = "color:#727171";
	}
	//重置publicOrder   list所有样式
	var publicOrderLists = document.getElementsByClassName("publicOrder")[0].getElementsByTagName("li");
	for(var i = 0; i < publicOrderLists.length; i++) {
		publicOrderLists[i].getElementsByClassName("selectIcon")[0].style.display = "none";
		publicOrderLists[i].getElementsByTagName("a")[0].style.cssText = "color:#727171";
	}

	//显示对号
	this.getElementsByClassName("selectIcon")[0].style.display = "inline-block";
	this.getElementsByTagName("a")[0].style.color = "#FBBF00";
	//publicOrder  找到对应li  显示对应样式
	var index = this.getAttribute("data-index");
	publicOrder.getElementsByTagName("li")[index].getElementsByClassName("selectIcon")[0].style.display = "inline-block";
	publicOrder.getElementsByTagName("li")[index].getElementsByTagName("a")[0].style.color = "#FBBF00";

	var orderText = this.getElementsByTagName("a")[0].innerHTML;
	var ulIndex = this.parentNode.getAttribute("data-index"); //获取当前ul的index
	muiContent.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].innerHTML = orderText;
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].innerHTML = orderText;

	muiContent.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#FBBF00";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#FBBF00";

	muiContent.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[1].style.cssText = "border-top: 6px solid #FBBF00;";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[1].style.cssText = "border-top: 6px solid #FBBF00;";

	//重置另两个样式
	muiContent.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color = "#727171";
	publicOrder.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color = "#727171";

	muiContent.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color = "#727171";
	publicOrder.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color = "#727171";

	//	publicOrder.getElementsByClassName("selectIcon")[ulIndex].style.display = "inline-block";
	//	publicOrder.getElementsByTagName("li")[ulIndex].style.color = "#FBBD00";
	//	publicOrder.getElementsByTagName("li")[ulIndex].style.borderBottom = "727171";
	//	publicOrder.getElementsByTagName("li")[ulIndex].classList.remove("mui-active");

	//关闭排序的内容列表
	this.parentNode.style.display = "none";
	publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";

	//	muiContent.getElementsByClassName("storeGoodsList")[0].innerHTML = "";

	var nowOrder = this.getAttribute("data-order");
	//	alert(nowOrder);
	localStorage.setItem("cloudstorecategoryOrder", nowOrder);
	var getcategory = new Getcategory(fqcat, fqcat, mui, nowOrder);
	getcategory.list_request();
	getcategory.Init2();

	//	partRefresh = true; //开始局部刷新
	//	listArr = [];
	//	goodsList.order = this.getAttribute("data-order");
	//	localStorage.setItem("nowOrder", goodsList.order);
	//	goodsList.start = "0";
	//	if(localStorage.getItem("sxConditionSearchList")) {
	//		var param = JSON.parse(localStorage.getItem("sxConditionSearchList"));
	//		goodsList.price = param.price;
	//		goodsList.lirun = param.price;
	//		goodsList.volume = param.volume;
	//		goodsList.brand = param.brand;
	//		goodsList.sea = param.sea;
	//	}
	//	var nowFqcat = localStorage.getItem("nowFqcat");
	//	goodsList.fqcat = nowFqcat;
	//	list_request(nowFqcat);
	//	localStorage.setItem("nowOrderFlag","1");
});

//销量优先
var xlText = muiContent.getElementsByClassName("xlText");
for(var i = 0; i < xlText.length; i++) {
	xlText[i].index = i;
	xlText[i].addEventListener("tap", function() {
		xlTextFn(this.index);
	});
}

function xlTextFn(index) {
	//	if(localStorage.getItem("nowOrderFlag")=="2"){
	//		return;
	//	}
	zhpxFlag = false;
	waitingLoadingFn();
	muiContent.getElementsByClassName("zhpxList")[index].style.display = "none";
	publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";

	xlText[index].getElementsByTagName("span")[0].style.color = "#FBBF00";
	publicOrder.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color = "#FBBF00";

	//重置另两个样式
	muiContent.getElementsByClassName("zhpxText")[index].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#595757";

	muiContent.getElementsByClassName("zhpxText")[index].getElementsByClassName("zhpxSpan")[0].innerHTML = "综合排序";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("zhpxSpan")[0].innerHTML = "综合排序";

	muiContent.getElementsByClassName("zhpxText")[index].getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #595757;";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #595757;";

	//重置所有样式   包含公共部分
	mui(".zhpxList li").each(function() {
		this.getElementsByTagName("a")[0].style.color = "#595757";
		this.getElementsByClassName("selectIcon")[0].style.display = "none";
	});
	muiContent.getElementsByClassName("yhldText")[index].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color = "#595757";

	//	muiContent.getElementsByClassName("storeGoodsList")[0].innerHTML = "";

	var nowOrder = muiContent.getElementsByClassName("xlText")[index].getAttribute("data-order");
	localStorage.setItem("cloudstorecategoryOrder", nowOrder);
	var getcategory = new Getcategory(fqcat, fqcat, mui, nowOrder);
	getcategory.list_request();
	getcategory.Init2();

	//	partRefresh = true; //开始局部刷新
	//	listArr = [];
	//	var nowFqcat = localStorage.getItem("nowFqcat");
	//	goodsList.fqcat = nowFqcat;
	//	goodsList.order = document.getElementsByClassName("xlText")[index].getAttribute("data-order");
	//	localStorage.setItem("nowOrder", goodsList.order);
	//	if(localStorage.getItem("sxCondition")) {
	//		var param = JSON.parse(localStorage.getItem("sxCondition"));
	//		goodsList.price = param.price;
	//		goodsList.lirun = param.price;
	//		goodsList.volume = param.volume;
	//		goodsList.brand = param.brand;
	//		goodsList.sea = param.sea;
	//	}
	//	list_request(nowFqcat);
}

//			优惠力度
var yhldText = muiContent.getElementsByClassName("yhldText");
for(var i = 0; i < yhldText.length; i++) {
	yhldText[i].index = i;
	yhldText[i].addEventListener("tap", function() {
		yhldTextFn(this.index);
	});
}

function yhldTextFn(index) {
	//	if(localStorage.getItem("nowOrderFlag")=="5"){
	//		return;
	//	}
	zhpxFlag = false;
	waitingLoadingFn();
	yhldText[index].getElementsByTagName("span")[0].style.color = "#FBBF00";
	publicOrder.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color = "#FBBF00";

	//	zhpxText.getElementsByClassName("downArrow")[0].style.display="inline-block";
	//重置另两个样式
	muiContent.getElementsByClassName("xlText")[index].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color = "#595757";

	muiContent.getElementsByClassName("zhpxList")[index].style.display = "none";
	publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";

	muiContent.getElementsByClassName("zhpxText")[index].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#595757";

	muiContent.getElementsByClassName("zhpxText")[index].getElementsByClassName("zhpxSpan")[0].innerHTML = "综合排序";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("zhpxSpan")[0].innerHTML = "综合排序";

	muiContent.getElementsByClassName("zhpxText")[index].getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #595757;";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #595757;";

	//重置所有样式   包含公共部分
	mui(".zhpxList li").each(function() {
		this.getElementsByTagName("a")[0].style.color = "#595757";
		this.getElementsByClassName("selectIcon")[0].style.display = "none";
	});

	//	muiContent.getElementsByClassName("storeGoodsList")[0].innerHTML = "";

	var nowOrder = document.getElementsByClassName("yhldText")[index].getAttribute("data-order");
	localStorage.setItem("cloudstorecategoryOrder", nowOrder);
	//	alert("nowOrder---"+localStorage.getItem("cloudstorecategoryOrder"));
	var getcategory = new Getcategory(fqcat, fqcat, mui, nowOrder);
	getcategory.list_request();
	getcategory.Init2();
	//	partRefresh = true; //开始局部刷新
	//	listArr = [];
	//	var nowFqcat = localStorage.getItem("nowFqcat");
	//	goodsList.fqcat = nowFqcat;
	//	goodsList.order = document.getElementsByClassName("yhldText")[index].getAttribute("data-order");
	//	localStorage.setItem("nowOrder", goodsList.order);
	//	if(localStorage.getItem("sxCondition")) {
	//		var param = JSON.parse(localStorage.getItem("sxCondition"));
	//		goodsList.price = param.price;
	//		goodsList.lirun = param.price;
	//		goodsList.volume = param.volume;
	//		goodsList.brand = param.brand;
	//		goodsList.sea = param.sea;
	//	}
	//	list_request(nowFqcat);
}


