/**
 * Created by Administrator on 2017/11/24.
 */
//是否保存过活动信息
var allSaveInfo;

function saveActivityInfo() {
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apib/Experience/getExperience",
		data: {
			uid: userinfo.uid,
			token: userinfo.token
		},
		success: function(data) {
			console.log("所有的数据----" + JSON.stringify(data));
			if(data.message == "暂无数据") {

			} else {
				allSaveInfo = data.data;
				id = allSaveInfo.id;
				setSaveInfo(allSaveInfo);
			}
		},
		error: function(msg) {
			console.log(msg);
			//					alert(JSON.stringify(msg));
		}
	});

}

saveActivityInfo();
//保存的数据填充到页面
function setSaveInfo(info) {
	if(info.froms == "1") {
		$(".froms").val("淘宝");
	} else if(info.froms == "2") {
		$(".froms").val("天猫");
	} else if(info.from == "3") {
		$(".froms").val("京东");
	}

	if(info.postage == "7") {
		$(".postage").val("7元");
	} else if(info.postage == "10") {
		$(".postage").val("全国包邮");
	}
	if(info.starttime!=0){
		$(".starttime").val(reverseTime(info.starttime));
	}
	if((info.endtime - info.starttime)!=0){
		$(".longtime").val((info.endtime - info.starttime) / 60 / 60 / 24 + "天");
	}
	if(info.beforeordertime!=0){
		$(".beforeordertime").val(info.beforeordertime + "小时");
	}

	//网店名称
	console.log(shopNameArray);
	$(".shopid").val(shopNameArray[info.shopid]);

	$(".qq").val(info.qq);

	$(".title").val(info.title);
	$(".shorttitle").val(info.shorttitle);
	$(".saleintroduce").val(info.saleintroduce);

	$(".price").val(info.price);

	//分类
	var categoryText = ["女装", "男装", "内衣", "母婴", "包包", "居家", "鞋品", "美食", "文体", "家电", "其他", "配饰", "数码", "美妆"];
	var category = (parseInt(info.category));
	//categoryText(parseInt(info.category-1))
	//category = categoryText.indexOf(goodsCategory) + 1;
	if(category >= 1 && category <= 5) {
		$(".category").val(categoryText[category - 1]);
	} else if(category >= 7) {
		$(".category").val(categoryText[category - 2]);
	} else if(category == "341") {
		$(".category").val(categoryText[13]);
	}

	$(".numbers").val(info.numbers);

	$(".goodsUrl").val(info.goodsurl);

	$(".sku").val(info.sku);

	$(".code").val(info.code);

	//服务
	var service = info.service;
	
	console.log(serviceArray);
	var allSeriviceRadio = document.querySelectorAll(".allSerivice input");
	if(service==""){}else{
		var serviceArray = service.split(",");
		for(var i = 0; i < serviceArray.length; i++) {
			var index = parseInt(serviceArray[i]) - 1;
			document.querySelectorAll(".allSerivice input")[index].setAttribute("checked", "checked");
		}
	}
	

	//搜索下单
	if(info.ordertype == 2) {
		document.querySelector(".userPlaceOrderWapper .search").style.background = "rgb(238,238,238)";
		document.querySelector(".userPlaceOrderWapper .tkl").style.background = "#fff";

		document.querySelector(".userPlaceOrderWapper .tklOrderType").checked = false;
		document.querySelector(".userPlaceOrderWapper .searchOrderType").checked = true;

		document.querySelector(".userPlaceOrder .searchOrder").style.display = "block";
		document.querySelector(".userPlaceOrder .tklOrder").style.display = "none";

		var search = info.search;
		for(var i = 0; i < search.length; i++) {
			if(search.length == 1) {
				document.querySelector(".searchOrder .keywords").value = info.search[0].keywords;
				if(info.search[0].ordertype == "0") {
					document.querySelector(".searchOrder .ordertype").innerHTML = "销量优先（推荐）";
				} else if(info.search[0].ordertype == "1") {
					document.querySelector(".searchOrder .ordertype").innerHTML = "综合排序";
				} else if(info.search[0].ordertype == "2") {
					document.querySelector(".searchOrder .ordertype").innerHTML = "信用";
				} else if(info.search[0].ordertype == "3") {
					document.querySelector(".searchOrder .ordertype").innerHTML = "价格由高到低";
				} else if(info.search[0].ordertype == "4") {
					document.querySelector(".searchOrder .ordertype").innerHTML = "价格由低到高";
				} else {
					document.querySelector(".searchOrder .ordertype").innerHTML = "";
				}

				var priceArr = info.search[0].pricerange.split("-");
				document.querySelector(".searchOrder .firstprice").value = priceArr[0];
				document.querySelector(".searchOrder .secondprice").value = priceArr[1];

				document.querySelector(".searchOrder .address").value = info.search[0].address;
				document.querySelector(".searchOrder .page").value = info.search[0].page;
				return;
			} else {
				i++;
				var wordArr = ["一", "二", "三", "三", "四", "五"];
				var newSpan = document.createElement("span");
				newSpan.innerHTML = '<span class="searchWay newAddSearchWay" data-num=' + parseInt(i + 1) + '>搜索方式' + wordArr[i] + '<img class="delateSearchWay" src="../img/activity/delate.png" alt="" /><img class="okSearchWay" src="../img/activity/ok.png" alt="" /></span>';
				document.querySelector(".searchWayList").insertBefore(newSpan, document.querySelector("#addSearchWay"));

				document.querySelector(".searchOrder .keywords").value = info.search[0].keywords;
				if(info.search[0].ordertype == "0") {
					document.querySelector(".searchOrder .ordertype").innerHTML = "销量优先（推荐）";
				} else if(info.search[0].ordertype == "1") {
					document.querySelector(".searchOrder .ordertype").innerHTML = "综合排序";
				} else if(info.search[0].ordertype == "2") {
					document.querySelector(".searchOrder .ordertype").innerHTML = "信用";
				} else if(info.search[0].ordertype == "3") {
					document.querySelector(".searchOrder .ordertype").innerHTML = "价格由高到低";
				} else if(info.search[0].ordertype == "4") {
					document.querySelector(".searchOrder .ordertype").innerHTML = "价格由低到高";
				} else {
					document.querySelector(".searchOrder .ordertype").innerHTML = "";
				}

				var priceArr = info.search[0].pricerange.split("-");
				document.querySelector(".searchOrder .firstprice").value = priceArr[0];
				document.querySelector(".searchOrder .secondprice").value = priceArr[1];

				document.querySelector(".searchOrder .address").value = info.search[0].address;
				document.querySelector(".searchOrder .page").value = info.search[0].page;
			}
		}
	}
	//淘口令下单
	if(info.ordertype == 1) {
		document.querySelector(".userPlaceOrder .tkl").style.background = "rgb(238,238,238)";
		document.querySelector(".userPlaceOrder .search").style.background = "#fff";
		document.querySelector(".userPlaceOrder .tkl input").checked = true;
		document.querySelector(".userPlaceOrder .search input").checked = false;
		document.querySelector(".userPlaceOrder .tklOrder").style.display = "block";
		document.querySelector(".userPlaceOrder .searchOrder").style.display = "none";

		document.querySelector(".userPlaceOrder .tbcode").innerHTML = info.tbcode;
	}

	//图片   淘宝  自己上传
	if(info.type == "1") { //淘宝
		document.querySelectorAll(".goodsPhotoInfo .titleDiv input")[0].checked = true;
		document.querySelectorAll(".goodsPhotoInfo .titleDiv input")[1].checked = false;
		if(info.goodsurl) {
			//商品主图
			$.ajax({
				type: "post",
				url: "https://app.fanbaoyundian.com/apiapiextend/apib/Experience/getTaobao",
				data: {
					uid: userinfo.uid,
					token: userinfo.token,
					goodsurl: info.goodsurl, //根据下单地址去获取淘宝图片
					//              goodsurl: "https://detail.tmall.com/item.htm?spm=a223v.7914393.2320796782.7.4f9c530aYB8zu3&abtest=_AB-LR972-PR972&pos=7&abbucket=_AB-M972_B0&acm=03683.1003.1.670563&id=553509209592&scm=1003.1.03683.ITEM_553509209592_670563",
				},
				success: function(data) {
					console.log("淘宝选取的图片----" + JSON.stringify(data));
					//			console.log("淘宝选取的图片----" + JSON.stringify(data));
					var picData = data.data.image;
					var details = data.data.details.descdata_imgs;
					var mainPhotos = document.querySelectorAll(".mainPhoto .img");
					var goodsDetails = document.querySelectorAll(".goodsDetail .img");
					for(var i = 0; i < mainPhotos.length; i++) {
						mainPhotos[i].setAttribute("src", picData[i])
					}

					console.log(details);
					document.querySelector(".edui-container").style.display = "block";
					document.querySelector("#myEditor").style.display = "block";
					document.querySelector("#myEditor").innerHTML = details;
					var allUpImg = document.querySelectorAll(".goodsDetail .addmainimg1");
					for(var i = 0; i < allUpImg.length; i++) {
						allUpImg[i].style.display = "none";
					}
				},
				error: function(msg) {
					console.log(msg);
					//					alert(JSON.stringify(msg));
				}
			});
			//详情图

		}

	} else if(info.type == "2") { //自己上传
		document.querySelectorAll(".goodsPhotoInfo .titleDiv input")[0].checked = false;
		document.querySelectorAll(".goodsPhotoInfo .titleDiv input")[1].checked = true;
		var pic = info.pic;
		for(var i = 0; i < pic.length; i++) {
			//var mainImg=document.querySelectorAll(".mainPhoto img");
			var mainImg = document.querySelector(".mainPhoto").getElementsByTagName("img");
			console.log(document.querySelector(".mainPhoto").getElementsByTagName("img")[i]);

			mainImg[i].setAttribute("src", pic[i]);
		}

		var details = info.details;
		for(var i = 0; i < details.length; i++) {
			//var mainImg=document.querySelectorAll(".goodsDetail img");
			var goodsDetail = document.querySelector(".goodsDetail").getElementsByTagName("img");
			console.log(document.querySelector(".mainPhoto").getElementsByTagName("img")[i]);

			goodsDetail[i].setAttribute("src", details[i]);
		}
	}
}

//setSaveInfo(allSaveInfo);
//动态修改当前输入的字符个数
function wordStatic1(input) {
        // 获取要显示已经输入字数文本框对象 
        var content = document.getElementsByClassName('titleLimit')[0]; 
        if (content && input) { 
            // 获取输入框输入内容长度并更新到界面 
            var value = input.value; 
            // 将换行符不计算为单词数 
            value = value.replace(/\n|\r/gi,""); 
            // 更新计数 
            content .innerText = value.length+"/60字符"; 
        } 
} 
function wordStatic2(input) {
        // 获取要显示已经输入字数文本框对象 
        var content = document.getElementsByClassName('shorttitleLimit')[0]; 
        if (content && input) { 
            // 获取输入框输入内容长度并更新到界面 
            var value = input.value; 
            // 将换行符不计算为单词数 
            value = value.replace(/\n|\r/gi,""); 
            // 更新计数 
            content .innerText = value.length+"/24字符"; 
        } 
} 
function wordStatic3(input) {
        // 获取要显示已经输入字数文本框对象 
        var content = document.getElementsByClassName('saleintroduceLimit')[0]; 
        if (content && input) { 
            // 获取输入框输入内容长度并更新到界面 
            var value = input.value; 
            // 将换行符不计算为单词数 
            value = value.replace(/\n|\r/gi,""); 
            // 更新计数 
            content .innerText = value.length+"/140字符"; 
        } 
} 