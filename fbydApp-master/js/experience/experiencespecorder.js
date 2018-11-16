//体验首页的排序方式   
//体验模块


//参考仓库搜索结果页     当前排序方式存在缓存   nowOrderExperiencespec
//  体验首页和体验搜索结果页公用当前js，打开不同页面的时候会初始化缓存中的排序方式为综合排序“1”
//综合排序点击事件
var zhpxFlag = false;
noGoods = false;
var publicOrder = document.getElementsByClassName("publicOrder")[0];
var zhpxText = document.getElementsByClassName("zhpxText")[0];
//综合排序模块  
function comprehensiveRankTextFn() { //综合排序文字  的点击事件
	if(noGoods) {
		return;
	}
	var nowOrder = localStorage.getItem("nowOrderExperiencespec");
	if(!zhpxFlag) { //目前是隐藏的
		publicOrder.getElementsByClassName("zhpxList")[0].style.display = "block";
		//		alert(nowOrder);
		if(nowOrder == "2" || nowOrder == "6") {
			publicOrder.getElementsByClassName("upArrow")[0].style.cssText = "border-bottom: 6px solid #727171;border-top:none;";
		} else {
			publicOrder.getElementsByClassName("upArrow")[0].style.cssText = "border-bottom: 6px solid #FBBF00;border-top:none;";
		}
	} else {
		publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";
		if(nowOrder == "2" || nowOrder == "6") {
			publicOrder.getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #727171;border-bottom:none;";
		} else {
			publicOrder.getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #FBBF00;border-bottom:none;";
		}
	}
	zhpxFlag = !zhpxFlag;

};

zhpxText.addEventListener("tap", comprehensiveRankTextFn);
//综合排序列表点击事件
mui(".publicOrder .zhpxList").on("tap", "li", function() {
	zhpxFlag = false;
	//重置公共   zhpxList所有样式
	var lists = this.parentNode.getElementsByTagName("li");
	for(var i = 0; i < lists.length; i++) {
		lists[i].getElementsByClassName("selectIcon")[0].style.display = "none";
		lists[i].getElementsByTagName("a")[0].style.cssText = "color:#727171";
	}

	//显示对号
	this.getElementsByClassName("selectIcon")[0].style.display = "inline-block";
	this.getElementsByTagName("a")[0].style.color = "#FBBF00";

	var orderText = this.getElementsByTagName("a")[0].innerHTML;
	var ulIndex = this.parentNode.getAttribute("data-index"); //获取当前ul的index
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].innerHTML = orderText;

	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#FBBF00";

	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[1].style.cssText = "border-top: 6px solid #FBBF00;";

	//重置另两个样式
	publicOrder.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color = "#727171";

	publicOrder.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color = "#727171";

	//关闭排序的内容列表
	this.parentNode.style.display = "none";

	//	sliderCard.getElementsByClassName("storeGoodsList")[ulIndex].innerHTML = "";
	partRefresh = true; //开始局部刷新
	listArr = [];
	//	document.getElementsByClassName("boxLeft")[0].innerHTML="";
//	document.getElementsByClassName("boxRight")[0].innerHTML="";
	goodsList.order = this.getAttribute("data-order");
	nowOrder = this.getAttribute("data-order");
	goodsList.start = "0";
	localStorage.setItem("nowOrderExperiencespec", goodsList.order);
	//获取当前的筛选条件
	if(localStorage.getItem("sxConditionSearchList")) {
		var param = JSON.parse(localStorage.getItem("sxConditionSearchList"));
		goodsList.price = param.price;
		goodsList.lirun = param.price;
		goodsList.volume = param.volume;
		goodsList.brand = param.brand;
		goodsList.sea = param.sea;
	}
	var nowFqcat = localStorage.getItem("nowFqcat");
	goodsList.fqcat = nowFqcat;
	list_request(nowFqcat);
});

//人气
var publicOrderXlText = publicOrder.getElementsByClassName("xlText")[0];
publicOrderXlText.addEventListener("tap", function() {
	if(noGoods) {
		return;
	}
	zhpxFlag = false;
	publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";
	this.getElementsByTagName("span")[0].style.color = "#FBBF00";
	//重置另两个样式
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("zhpxSpan")[0].innerHTML = "综合排序";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #595757;";
	//重置所有样式   包含公共部分
	mui(".zhpxList li").each(function() {
		this.getElementsByTagName("a")[0].style.color = "#595757";
		this.getElementsByClassName("selectIcon")[0].style.display = "none";
	});
	publicOrder.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	partRefresh = true; //开始局部刷新
	//置空商品列表
	listArr = [];
	//	document.getElementsByClassName("boxLeft")[0].innerHTML="";
//	document.getElementsByClassName("boxRight")[0].innerHTML="";
	
	
	goodsList.order = publicOrder.getElementsByClassName("xlText")[0].getAttribute("data-order");
	//				localStorage.setItem("zhpxOrder", goodsList.order);
	localStorage.setItem("nowOrderExperiencespec", goodsList.order);
	//获取当前的筛选条件
	if(localStorage.getItem("sxConditionSearchList")) {
		var param = JSON.parse(localStorage.getItem("sxConditionSearchList"));
		goodsList.price = param.price;
		goodsList.lirun = param.price;
		goodsList.volume = param.volume;
		goodsList.brand = param.brand;
		goodsList.sea = param.sea;
	}
	goodsList.start = "0";
	list_request();
	//	localStorage.setItem("nowOrderFlag","2");
})

//剩余分数最多
var publicOrderYhldText = publicOrder.getElementsByClassName("yhldText")[0];
publicOrderYhldText.addEventListener("tap", function() {
	if(noGoods) {
		return;
	}
	zhpxFlag = false;
	this.getElementsByTagName("span")[0].style.color = "#FBBF00";

	//	zhpxText.getElementsByClassName("downArrow")[0].style.display="inline-block";
	//重置另两个样式
	publicOrder.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("zhpxSpan")[0].innerHTML = "综合排序";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #595757;";
	//重置所有样式   包含公共部分
	mui(".zhpxList li").each(function() {
		this.getElementsByTagName("a")[0].style.color = "#595757";
		this.getElementsByClassName("selectIcon")[0].style.display = "none";
	});

	partRefresh = true; //开始局部刷新
	listArr = [];
	//	document.getElementsByClassName("boxLeft")[0].innerHTML="";
//	document.getElementsByClassName("boxRight")[0].innerHTML="";
	
	goodsList.order = publicOrder.getElementsByClassName("yhldText")[0].getAttribute("data-order");
	//				localStorage.setItem("zhpxOrder", goodsList.order);
	localStorage.setItem("nowOrderExperiencespec", goodsList.order);
	//获取当前的筛选条件
	if(localStorage.getItem("sxConditionSearchList")) {
		var param = JSON.parse(localStorage.getItem("sxConditionSearchList"));
		goodsList.price = param.price;
		goodsList.lirun = param.price;
		goodsList.volume = param.volume;
		goodsList.brand = param.brand;
		goodsList.sea = param.sea;
	}
	goodsList.start = "0";
	list_request();
	//	localStorage.setItem("nowOrderFlag","5");
});

//筛选事件
var chooseCondition = false;
var hiddenPopDiv = true;
var publicOrder = document.getElementsByClassName("publicOrder")[0];
var sxText = publicOrder.getElementsByClassName("sxText")[0];

sxText.addEventListener("tap", function() {
	if(chooseCondition == false && noGoods == true) {
		return;

	}
	//关闭综合排序列表
	publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";
	zhpxFlag = false;
	
	if(hiddenPopDiv) {

		document.getElementsByClassName("popDiv")[0].style.display = "block";
		document.getElementById("backdrop").style.display = "block";
	} else {
		document.getElementsByClassName("popDiv")[0].style.display = "none";
		document.getElementById("backdrop").style.display = "none";
	}
	hiddenPopDiv = !hiddenPopDiv;
	
});

// 遮罩层点击事件
document.getElementById("backdrop").addEventListener('tap', function(e) {
	event.detail.gesture.preventDefault();
	e.stopPropagation();
	this.style.display = "none";
	document.getElementsByClassName("popDiv")[0].style.display = "none";
	hiddenPopDiv = true;
});

//筛选选项  点击事件
//所有
var allType = document.getElementsByClassName("allType")[0];
allType.addEventListener("tap", function(e) {
	this.style.cssText = "color:#FBBD00";
	document.getElementsByClassName("playingType")[0].style.cssText = "color:#333";
	document.getElementById("backdrop").style.display = "none";
	document.getElementsByClassName("popDiv")[0].style.display = "none";
	e.stopPropagation();
	hiddenPopDiv = true;
	partRefresh=true;
	
//	带着当前的排序方式    进行筛选
	
});

//体验申请中	
var playingType = document.getElementsByClassName("playingType")[0];
playingType.addEventListener("tap", function(e) {
	this.style.cssText = "color:#FBBD00";
	document.getElementsByClassName("allType")[0].style.cssText = "color:#333";
	document.getElementById("backdrop").style.display = "none";
	document.getElementsByClassName("popDiv")[0].style.display = "none";
	e.stopPropagation();
	hiddenPopDiv = true;
	partRefresh=true;
	//	带着当前的排序方式    进行筛选
	
	
})

//			筛选条件下,进行的数据请求,局部刷新;筛选条件下，初始排序方式是综合排序即order为1
window.addEventListener("reRequest", function(event) {
	var nowFqcat = localStorage.getItem("nowFqcat");

	chooseCondition = true; //筛选条件下
	partRefresh = true; //要进行局部刷新
	//	document.getElementById("waitingLoading").style.display = "block";
	listArr = [];
	goodsList.order = localStorage.getItem("nowOrderExperiencespec");
	//				alert(goodsList.order)
	//				localStorage.setItem("zhpxOrder", goodsList.order);
	goodsList.start = "0";
	nowPageNum = "0";
	var param = JSON.parse(localStorage.getItem("sxConditionSearchList"));
	goodsList.price = param.price;
	goodsList.lirun = param.price;
	goodsList.volume = param.volume;
	goodsList.brand = param.brand;
	goodsList.sea = param.sea;

	if(!event.detail.noChoose) { //当前条件下  筛选条件不为空
		document.getElementsByClassName("publicOrder")[0].getElementsByClassName("sxText")[0].getElementsByTagName("span")[0].style.color = "#FBBD00";
		document.getElementsByClassName("publicOrder")[0].getElementsByClassName("sxText")[0].getElementsByClassName("sxIcon")[0].style.cssText = "display:none;";
		document.getElementsByClassName("publicOrder")[0].getElementsByClassName("sxText")[0].getElementsByClassName("sxIconColor")[0].style.cssText = "display:inline-block;";
	}

	console.log("自定义函数----请求的参数--" + JSON.stringify(goodsList));
	list_request();

});