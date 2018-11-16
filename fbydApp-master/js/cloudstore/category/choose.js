//筛选


function chooseFn(menu10){
	//筛选
	var menu10=menu10;
//var main,  mask = mui.createMask(_closeMenu);
var main,  mask = mui.createMask(_closeMenu);
var showMenu = false,
	mode = 'menu-move';


//			判断处理左划  菜单是否显示
//			页面返回之前处理的函数
function back() {
	if(showMenu) {
		closeMenu();
		return false;
	} else {
		//菜单隐藏的时候,执行返回的时,先close菜单页面,然后执行mui.back逻辑关闭主窗口
	}
}

/*
 * 显示菜单菜单
 */
function openMenu() {
	if(!showMenu) {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "static";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
		}

		//侧滑菜单处于隐藏状态，则立即显示出来；
		//显示完毕后，根据不同动画效果移动窗体；
		menu10.show('none', 0, function() {
			switch(mode) {
				case 'menu-move':
					menu10.setStyle({
						left: '30%',
						transition: {
							duration: 150
						}
					});
					break;
			}
		});
		//显示主窗体遮罩
		mask.show();
		showMenu = true;
	}
};

//			关闭侧滑菜单
function closeMenu() {
//	alert("1");
	_closeMenu();
	//	menu10=null;
	//关闭遮罩层
	mask.close();
//		alert("1")
}

/**
 * 关闭侧滑菜单(业务部分)
 */
function _closeMenu() {
//	mask.close();
//	alert("关闭策划菜单")
	showMenu = true;
	if(showMenu) {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			//						document.querySelector("header.mui-bar").style.position = "fixed";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
		}

		switch(mode) {
			case 'main-move':
				//主窗体开始侧滑；
				main.setStyle({
					left: '0',
					transition: {
						duration: 150
					}
				});
				break;
			case 'menu-move':
				//主窗体开始侧滑；
				menu10.setStyle({
					left: '100%',
					transition: {
						duration: 150
					}
				});
				break;
			case 'all-move':
				//主窗体开始侧滑；
				main.setStyle({
					left: '0',
					transition: {
						duration: 150
					}
				});
				//menu页面同时移动
				menu10.setStyle({
					left: '100%',
					transition: {
						duration: 150
					}
				});

				break;
		}
		//等窗体动画结束后，隐藏菜单webview，节省资源；
		var main = plus.webview.currentWebview().opener(); //获取父页面A对象
		mui.fire(main,"changeBackground2");
		setTimeout(function() {
			plus.webview.close(plus.webview.getWebviewById("menu10"));
//			alert("关闭")
			
		}, 300);
		showMenu = false;
	}
	return true;
}

//在android4.4中的swipe事件，需要preventDefault一下，否则触发不正常
//故，在dragleft，dragright中preventDefault
window.addEventListener('dragright', function(e) {
	e.detail.gesture.preventDefault();
});
window.addEventListener('dragleft', function(e) {
	e.detail.gesture.preventDefault();
});
//主界面向左滑动，若菜单未显示，则显示菜单；否则不做任何操作；
//window.addEventListener("swipeleft", openMenu);
//主界面向右滑动，若菜单已显示，则关闭菜单；否则，不做任何操作；
//window.addEventListener("swiperight", closeMenu);

//menu页面向右滑动，关闭菜单；
window.addEventListener("menu10:swiperight", closeMenu);
window.addEventListener("closeSX", closeMenu);

//重写mui.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
mui.menu10 = function() {
	if(showMenu) {
		closeMenu();
	} else {
		openMenu();
	}
}

//筛选事件
var sxText = document.getElementsByClassName("sxText");
for(var i = 0; i < sxText.length; i++) {
	sxText[i].index = i;
	sxText[i].addEventListener("tap", function() {
		sxTextFn(this.index);
	});
}

function sxTextFn(index) {
	var main = plus.webview.currentWebview().opener(); //获取父页面A对象
	mui.fire(main,"changeBackground"); 
//	mui.fire(main, "openMenu");
	//关闭综合排序列表
	document.getElementsByClassName("zhpxList")[index].style.display = "none";
	zhpxFlag = false;
//	setTimeout(function() {
		openMenu();
//	}, 500);

}


var chooseCondition = false;
//			筛选条件下,进行的数据请求,局部刷新;筛选条件下，初始排序方式是综合排序即order为1
window.addEventListener("reRequest", function(event) {
	var main = plus.webview.currentWebview().opener(); //获取父页面A对象
	mui.fire(main,"changeBackground2");
	
	//	alert(localStorage.getItem("nowFqcat"))
	document.getElementsByClassName("storeGoodsList")[0].innerHTML = "";
	chooseCondition = true;

	waitingLoadingFn();
	var nowFqcat = localStorage.getItem("nowFqcat");
	if(event.detail.noChoose == false) { //当前条件下  筛选条件不为空    有筛选条件
		chooseCondition = true; //筛选条件下
		document.getElementsByClassName("sxText")[0].getElementsByTagName("span")[0].style.color = "#FBBD00";
		document.getElementsByClassName("sxText")[0].getElementsByClassName("sxIcon")[0].style.cssText = "display:none;";
		document.getElementsByClassName("sxText")[0].getElementsByClassName("sxIconColor")[0].style.cssText = "display:inline-block;";
	} else { //没有筛选条件
		document.getElementsByClassName("sxText")[0].getElementsByTagName("span")[0].style.color = "#FBBD00";
		document.getElementsByClassName("sxText")[0].getElementsByClassName("sxIcon")[0].style.cssText = "display:none;";
		document.getElementsByClassName("sxText")[0].getElementsByClassName("sxIconColor")[0].style.cssText = "display:inline-block;";
	}

	partRefresh = true; //要进行局部刷新
	listArr = [];

	var nowOrder = localStorage.getItem("cloudstorecategoryOrder");
	var param = localStorage.getItem("cloudstorecategorySxCondition");

	var sxConditionFlag = true;
	//				localStorage.setItem("cloudstorecategoryOrder", nowOrder);
	var getcategory = new Getcategory(nowFqcat, nowFqcat, mui, nowOrder, param, chooseCondition, sxConditionFlag);
	getcategory.list_request();
	getcategory.Init2();

	if(!event.detail.noChoose) { //当前条件下  筛选条件不为空
		document.getElementsByClassName("sxText")[0].getElementsByTagName("span")[0].style.color = "#FBBD00";
		document.getElementsByClassName("sxText")[0].getElementsByClassName("sxIcon")[0].style.cssText = "display:none;";
		document.getElementsByClassName("sxText")[0].getElementsByClassName("sxIconColor")[0].style.cssText = "display:inline-block;";
	}
});


}

// 监听点击遮罩关闭事件
//          document.getElementsByClassName("mui-backdrop")[0].addEventListener('tap', function() {
//              event.detail.gesture.preventDefault();
//             var main = plus.webview.currentWebview().opener(); //获取父页面A对象
//				mui.fire(main,"changeBackground2");
//				alert("1")
//          });


