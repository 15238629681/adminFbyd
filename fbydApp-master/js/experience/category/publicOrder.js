//固定在顶部的排序方式



//每个选项卡的   综合排序
var nowFqcat = localStorage.getItem("nowFqcat");
var muiContent = document.getElementsByClassName("mui-content")[0];//所有选项卡


var publicOrder = document.getElementsByClassName("publicOrder")[0];
var publicOrderZhpxText=publicOrder.getElementsByClassName("zhpxText")[0];
var publicOrderZhpxList=publicOrder.getElementsByClassName("zhpxList")[0];

var publicOrderXlText=
publicOrder.getElementsByClassName("xlText")[0];
var publicOrderYhldText=publicOrder.getElementsByClassName("yhldText")[0];

//var zhpxFlag = false;
//综合排序文字
publicOrderZhpxText.addEventListener("tap",function(){
	var nowOrder=localStorage.getItem("cloudstorecategoryOrder");
//	alert(nowOrder);
	if(!zhpxFlag) { //目前是隐藏的,显示列表	
		publicOrder.style.display="block";
		publicOrder.getElementsByClassName("zhpxList")[0].style.display = "block";
		publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[1].style.cssText="border-bottom:6px solid #FBBF00;border-top:none;";
//		muiContent.getElementsByClassName("upArrow")[0].style.cssText="border-bottom:6px solid #FBBD00;border-top:none;";
		if(nowOrder=="2" || nowOrder=="6" ){
			publicOrder.getElementsByClassName("upArrow")[0].style.cssText="border-bottom:6px solid #333;border-top:none;";
		}else{
			publicOrder.getElementsByClassName("upArrow")[0].style.cssText="border-bottom:6px solid #FBBD00;border-top:none;";
		}
	} else {
		publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";
		publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[1].style.cssText="border-top:6px solid #FBBF00;border-bottom:none;";
		if(nowOrder=="2" || nowOrder=="6" ){
			publicOrder.getElementsByClassName("upArrow")[0].style.cssText="border-top:6px solid #333;border-bottom:none;";
		}else{
//			alert(nowOrder)
			publicOrder.getElementsByClassName("upArrow")[0].style.cssText="border-top:6px solid #FBBD00;border-bottom:none;";
		}
	}
	zhpxFlag = !zhpxFlag;
});


//综合排序列表点击事件
mui(".publicOrder .zhpxList").on("tap", "li", function() {
	zhpxFlag = false;
	waitingLoadingFn();
	//重置公共   zhpxList所有样式
	var lists = this.parentNode.getElementsByTagName("li");
	for(var i = 0; i < lists.length; i++) {
		lists[i].getElementsByClassName("selectIcon")[0].style.display = "none";
		lists[i].getElementsByTagName("a")[0].style.cssText = "color:#727171";
	}
	
	//重置对应选项卡    list所有样式
	var muiContentLists=muiContent.getElementsByTagName("li");
	for(var i = 0; i < muiContentLists.length; i++) {
		muiContentLists[i].getElementsByClassName("selectIcon")[0].style.display = "none";
		muiContentLists[i].getElementsByTagName("a")[0].style.cssText = "color:#727171";
	}
	
	//显示对号
	this.getElementsByClassName("selectIcon")[0].style.display = "inline-block";
	this.getElementsByTagName("a")[0].style.color = "#FBBF00";
	//选项卡    找到对应li  显示对应样式
	var index=this.getAttribute("data-index");
	muiContent.getElementsByTagName("li")[index].getElementsByClassName("selectIcon")[0].style.display = "inline-block";
	muiContent.getElementsByTagName("li")[index].getElementsByTagName("a")[0].style.color = "#FBBF00";
	
	var orderText = this.getElementsByTagName("a")[0].innerHTML;
	var ulIndex = this.parentNode.getAttribute("data-index");//获取当前ul的index
	muiContent.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].innerHTML = orderText;
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].innerHTML = orderText;
	
	muiContent.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color="#FBBF00";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color="#FBBF00";
	
	muiContent.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[1].style.cssText = "border-top: 6px solid #FBBF00;";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[1].style.cssText = "border-top: 6px solid #FBBF00;";

	//重置另两个样式
	muiContent.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color="#727171";
	publicOrder.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color="#727171";
	
	muiContent.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color="#727171";
	publicOrder.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color="#727171";

	//关闭排序的内容列表
	this.parentNode.style.display = "none";
	muiContent.getElementsByClassName("zhpxList")[0].style.display = "none";
	
//	muiContent.getElementsByClassName("storeGoodsList")[0].innerHTML = "";
	
	
	var nowOrder = this.getAttribute("data-order");
	localStorage.setItem("cloudstorecategoryOrder", nowOrder);
	var getcategory = new Getcategory(fqcat, fqcat, mui, nowOrder);
	getcategory.list_request();
	getcategory.Init2();
//	alert("1")
});

//销量优先文字
publicOrderXlText.addEventListener("tap",function(){
//	if(localStorage.getItem("nowOrderFlag")=="2"){
//		return;
//	}
	zhpxFlag = false;
	waitingLoadingFn();
	muiContent.getElementsByClassName("zhpxList")[0].style.display = "none";
	publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";
	
	muiContent.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color = "#FBBF00";
	this.getElementsByTagName("span")[0].style.color = "#FBBF00";
	
	//重置另两个样式
	muiContent.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	
	muiContent.getElementsByClassName("zhpxText")[0].getElementsByClassName("zhpxSpan")[0].innerHTML = "综合排序";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("zhpxSpan")[0].innerHTML = "综合排序";
	
	muiContent.getElementsByClassName("zhpxText")[0].getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #595757;";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #595757;";


	//重置所有样式   包含公共部分
	mui(".zhpxList li").each(function() {
		this.getElementsByTagName("a")[0].style.color = "#595757";
		this.getElementsByClassName("selectIcon")[0].style.display = "none";
	});
	muiContent.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color = "#595757";

//	muiContent.getElementsByClassName("storeGoodsList")[0].innerHTML = "";
	
	var nowOrder = document.getElementsByClassName("xlText")[index].getAttribute("data-order");
	localStorage.setItem("cloudstorecategoryOrder", nowOrder);
	var getcategory = new Getcategory(fqcat, fqcat, mui, nowOrder);
	getcategory.list_request();
	getcategory.Init2();
	
})

//优惠力度
publicOrderYhldText.addEventListener("tap",function(){
//	if(localStorage.getItem("nowOrderFlag")=="5"){
//		return;
//	}
	zhpxFlag = false;
	waitingLoadingFn();
	muiContent.getElementsByClassName("yhldText")[0].getElementsByTagName("span")[0].style.color = "#FBBF00";
	this.getElementsByTagName("span")[0].style.color = "#FBBF00";

	//	zhpxText.getElementsByClassName("downArrow")[0].style.display="inline-block";
	//重置另两个样式
	muiContent.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("xlText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	
	muiContent.getElementsByClassName("zhpxList")[0].style.display = "none";
	publicOrder.getElementsByClassName("zhpxList")[0].style.display = "none";
	
	
	muiContent.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByTagName("span")[0].style.color = "#595757";
	
	muiContent.getElementsByClassName("zhpxText")[0].getElementsByClassName("zhpxSpan")[0].innerHTML = "综合排序";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("zhpxSpan")[0].innerHTML = "综合排序";
	
	muiContent.getElementsByClassName("zhpxText")[0].getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #595757;";
	publicOrder.getElementsByClassName("zhpxText")[0].getElementsByClassName("upArrow")[0].style.cssText = "border-top: 6px solid #595757;";

	//重置所有样式   包含公共部分
	mui(".zhpxList li").each(function() {
		this.getElementsByTagName("a")[0].style.color = "#595757";
		this.getElementsByClassName("selectIcon")[0].style.display = "none";
	});

//	muiContent.getElementsByClassName("storeGoodsList")[0].innerHTML = "";
	
		var nowOrder = document.getElementsByClassName("yhldText")[index].getAttribute("data-order");
	localStorage.setItem("cloudstorecategoryOrder", nowOrder);
	var getcategory = new Getcategory(fqcat, fqcat, mui, nowOrder);
	getcategory.list_request();
	getcategory.Init2();
	
})

