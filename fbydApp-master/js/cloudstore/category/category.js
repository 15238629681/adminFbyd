
var Getcategory = function(marks, fqcat, $,chooseCondition,sxConditionFlag) {
	var that = this;
	var userinfo = JSON.parse(localStorage.getItem("userinfo"));
	var marks=localStorage.getItem("nowFqcat");
	var fqcat=marks;
//	alert("fqcat1---"+fqcat);
	
	var banner = {
		token: userinfo.token,
		timestamp: parseInt(new Date().getTime() / 1000), //获取时间戳
		position: "cloudstorecategory",
		marks: marks //首页
	};

	//banner图数据请求
	this.banner_request = function() { //marks就是fqcat
		mui.ajax(
			"https://app.fanbaoyundian.com/appapi/cloudstorebanner.app.php", {
				data: {
					token: banner.token,
					timestamp: banner.timestamp,
					position: banner.position,
					marks: banner.marks
				},
				dataType: 'json',
				type: "post",
				success: function(data) {
					console.log("云店分类页   图片" + JSON.stringify(data));
					if(data.error == "0") {
						var slide = data.slide;
						var banner = document.getElementsByClassName("banner")[0];
						//						alert("marks---"+marks);
						banner.getElementsByTagName("a")[0].setAttribute("href", slide[0].url);
						banner.getElementsByTagName("img")[0].setAttribute("src", "https://app.fanbaoyundian.com/" + slide[0].img);
					}
//					alert("1---"+banner.innerHTML)
				},
				error: function(xhr, type, errorThrown) {
					if(type == "timeout") {
						plus.nativeUI.toast("请求超时，请检查网络");
					}
					console.log(type);
					//							plus.nativeUI.toast(errorThrown);
				}
			})
	};
	
	var listArr = "";
	var nowPageNum = 0;
	var oneceLoad = true; //第一次载入的背景图 
	var goodsList = {
		count: 10,
		start: 0,
		order: 1, //商品默认的排序方式  最新
		keyword: "all", //搜索的关键字
		fqcat: fqcat, //商品分类编号
		token: userinfo.token,
		uid: userinfo.userinfo.uid,
		timestamp: parseInt(new Date().getTime() / 1000), //获取时间戳
		price: {
			state: "0",
			range: {
				start: "",
				end: ""
			}
		},
		lirun: {
			state: "0",
			range: {
				start: "",
				end: ""
			}
		},
		volume: {
			state: "0",
			range: {
				start: "",
				end: ""
			}
		},
		brand: 0,
		sea: 0
	};

	this.updataData = function() {
		if(localStorage.getItem("cloudstorecategoryOrder")) {
			goodsList.order = localStorage.getItem("cloudstorecategoryOrder");
		}

		if(localStorage.getItem("cloudstorecategorySxCondition")) {
			var param = JSON.parse(localStorage.getItem("cloudstorecategorySxCondition"));
			goodsList.price = param.price;
			goodsList.lirun = param.price;
			goodsList.volume = param.volume;
			goodsList.brand = param.brand;
			goodsList.sea = param.sea;
		}
	}
	//首页的数据请求
	this.list_request = function() {
		goodsList.fqcat=localStorage.getItem("nowFqcat");
		
		var storeGoodsList = document.getElementsByClassName("storeGoodsList")[0];
		console.log("页数---"+goodsList.start);
		console.log("商品数据--"+JSON.stringify(goodsList));
		that.updataData();
//		alert(goodsList.fqcat);
//		alert("order--"+goodsList.order+"---params"+JSON.stringify(goodsList.volume));
		mui.ajax(
			"https://app.fanbaoyundian.com/appapi/storehousesearch.app.php", {
				data: {
					count: goodsList.count,
					start: goodsList.start,
					order: goodsList.order,
					keyword: goodsList.keyword,
					fqcat: goodsList.fqcat,
					token: goodsList.token,
					timestamp: goodsList.timestamp,
					uid: goodsList.uid,
					price: {
						state: goodsList.price.state,
						range: {
							start: goodsList.price.range.start,
							end: goodsList.price.range.end
						}
					},
					lirun: {
						state: goodsList.lirun.state,
						range: {
							start: goodsList.lirun.range.start,
							end: goodsList.lirun.range.end
						}
					},
					volume: {
						state: goodsList.volume.state,
						range: {
							start: goodsList.volume.range.start,
							end: goodsList.volume.range.end
						}
					},
					brand: goodsList.brand,
					sea: goodsList.sea
				},
				dataType: 'json',
				type: "post",
				success: function(data) {
					if(data.error == "0") {
						//取消load图
							if(oneceLoad) {
								setTimeout(function() {
									document.getElementById("loading").style.display = "none";
								}, 0)
							}
							oneceLoad = false;
						if(partRefresh) {
								//局部刷新的话，关闭等待框
								document.getElementById("waitingLoading").style.display = "none";
								partRefresh = !partRefresh;
							}
						if(sxConditionFlag){
							document.getElementsByClassName("storeGoodsList")[0].innerHTML="";
						}
						var goodsList = data.goodslist;
						console.log("返回数据---"+JSON.stringify(goodsList));
						//console.log("商品列表" + JSON.stringify(goodsList));
						var storeGoodsList = document.getElementsByClassName("storeGoodsList")[0];
						if(goodsList.length == 0) {
							if(document.getElementsByClassName("storeGoodsBlock").length == 0) {
								noGoods = true;
								var storeGoodsList = document.getElementsByClassName("storeGoodsList")[0];
								storeGoodsList.style.minHeight = (document.documentElement.clientHeight - 200) + "px";
								//没有搜索到相应商品  或者  某个筛选条件下没有商品
								storeGoodsList.innerHTML = '<div class="storeGoodsBlock" style=""><div class="noGoodsDiv" style="font-size:14px;width:3.54rem;height:5.535rem;position:absolute;top:50%;left:50%;margin:-0.7675rem 0 0  -1.77rem ;text-align: center;;"><img src="../images/cloudstore/icons/cloudstoresearchlistCantfindthepage.png" alt="" style="width:3.9rem;height:4.35rem;"/><div style="color:#000;">非常抱歉</div><div style="color:#959595;">没有找到相关宝贝</div></div></div>';
								document.addEventListener('touchmove', function() {}, false); //阻止默认滑动事件
								 mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                				mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
							} else {
								mui.toast('暂时没有更多商品！', {
									duration: 'long',
									type: 'div'
								});
							}
						} else {
//							 mui('#refreshContainer').pullRefresh.endPullupToRefresh(false);
							//console.log("goodsList.length-----"+goodsList.length);
							var goodsListHtml = "";
//							storeGoodsList.innerHTML="";
							for(var i = 0; i < goodsList.length; i++) {
								if(goodsList[i].pic_url.indexOf("http") == -1) {
									goodsList[i].pic_url = "http:" + goodsList[i].pic_url;
								}
								goodsListHtml += '<div class="storeGoodsBlock mui-clearfix" data-id=' + goodsList[i].id + '  data-numiid=' + goodsList[i].num_iid + '  data-cid=' + goodsList[i].cid + '><div class="goodsImg"><img src="' + goodsList[i].pic_url + '_300x300.jpg" alt=""></div><div class="storeGoodsDetail"><p class="goodsName">' + goodsList[i].title + '</p><div class="goodsDetailT"><span class="fbPrice">翻宝价<span class="priceFlag">￥</span><span class="fbPriceNum">' + goodsList[i].quanhou_price + '</span></span><span class="sellNum">优惠劵'+goodsList[i].quan+'元</span></div><div class="goodsDetailB"><span class="tbPrice">淘宝价<span class="tbPriceNum">￥' + goodsList[i].coupon_price + '</span></span><span class="costPrice">销量' + goodsList[i].volume + '</span></div></div></div>';
							}
//							goodsListHtml += "";
							
//							if(!(document.getElementsByClassName("storeGoodsBlock"))) {
//								storeGoodsList.innerHTML="";
//								storeGoodsList.innerHTML = goodsListHtml;
//							} else {
								var mainDiv = document.createElement("div");
								mainDiv.innerHTML = goodsListHtml;
								if(data.start > 1) {
									mainDiv.style.cssText = "margin-top:-6px;";
								}
								storeGoodsList.appendChild(mainDiv);
//							}
							
							
//							listArr = "1";
//							alert(document.getElementsByClassName("storeGoodsBlock").length);
						}
					}
				},
				error: function(xhr, type, errorThrown) {
					if(type == "timeout") {
						//noGoods = true;
						var storeGoodsList = document.getElementsByClassName("storeGoodsList")[0];
						storeGoodsList.innerHTML = '<div class="storeGoodsBlock" style=""><div class="noGoodsDiv" style="font-size:14px;width:3.54rem;height:5.535rem;position:absolute;top:50%;left:50%;margin:-2.7675rem 0 0  -1.77rem ;text-align: center;;"><img src="../images/cloudstore/icons/cloudstoresearchlistCantfindthepage.png" alt="" style="width:3.9rem;height:4.35rem;"/><div style="color:#000;">网络请求超时</div><div style="color:#959595;">请检查网络！</div></div></div>';
						document.addEventListener('touchmove', function() {}, false); //阻止默认滑动事件
						mui('#refreshContainer').pullRefresh().setStopped(true);
					}
				}
			})

	};

	this.Init2 = function() {
		$.init({
			pullRefresh: {
				container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
					color: '#fbbd00', //可选，默认“#2BD009” 下拉刷新控件颜色
					height: '50px', //可选,默认50px.下拉刷新控件的高度,
					range: '100px', //可选 默认100px,控件可下拉拖拽的范围
					offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
					auto: false, //可选,默认false.首次加载自动上拉刷新一次
					//					callback: that.downflash //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
					callback: function() {
//						alert("下拉刷新")
						listArr = "";
						goodsList.time = parseInt(new Date().getTime() / 1000);
						goodsList.start = 0;
						document.getElementById("loading").style.display = "block";
						oneceLoad = true;
						document.getElementsByClassName("banner")[0].innerHtml='<div class="banner"><a href=""><img src="" alt="" /></a></div>';
						document.getElementsByClassName("storeGoodsList")[0].innerHTML="";
						//that.updataData();
						that.list_request();
						that.banner_request();
						setTimeout(function() {
							mui.toast('已经是最新数据！', {
								duration: 'short',
								type: 'div'
							});
							mui('#refreshContainer').pullRefresh().endPulldown(true);
						}, 1200)
						
//						$('#refreshContainer').pullRefresh().endPulldown(true);
					}
				},
				up: {
					height: 35, //可选.默认50.触发上拉加载拖动距离
					auto: false, //可选,默认false.自动上拉加载一次
					contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
					contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
					//			      callback :that.upflash //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
					callback: function() {
						
						goodsList.start++;
						//						that.updataData();
						that.list_request();
						setTimeout(function() {
							$('#refreshContainer').pullRefresh().endPullupToRefresh(true); //结束上拉加载
							$('#refreshContainer').pullRefresh().refresh(true); //重置上拉加载
						}, 1000);
					}
				}
			}
		});
	}
}
//(function($,doc){
//	var getcategory = new Getcategory("1","0");
//	getcategory.Init();
//	getcategory.list_request();
//	getcategory.banner_request();
//})(mui.document)

//下拉刷新
//	this.downflash = function() {
//		listArr = "";
//		goodsList.time = parseInt(new Date().getTime() / 1000);
//		goodsList.start = 0;
//		that.list_request();
//		$('#refreshContainer').pullRefresh().endPulldown(true);
//	}
//上拉加载
//	this.upflash = function() {
//		goodsList.start++;
//		alert("upflash上拉加载that.order---" + that.order);
//		if(that.order) {
//			goodsList.order = that.order;
//		}
//		alert("上拉加载goodsList.order---" + goodsList.order);
//		that.list_request();
//		setTimeout(function() {
//			$('#refreshContainer').pullRefresh().endPullupToRefresh(true); //结束上拉加载
//			$('#refreshContainer').pullRefresh().refresh(true); //重置上拉加载
//		}, 1000);
//	}



