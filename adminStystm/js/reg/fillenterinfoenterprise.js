var isothershop; //其他平台店铺 0=》没有 1=》有
var apps = []; //第三方店铺  数组
var owneridcodejpgfront, owneridcodejpgback, owneridcodejpg;
var sfstart, sfend;

var isnewlicense=1;
var shoparr=[];

$(".threeInOne").on("click","input",function(){
	var index=$(this).attr("data-index");
	if(index==1){
		isnewlicense=1;
	}else if(index==0){
		isnewlicense=0;
	}
})

var owneridcodejpgfront,owneridcodejpgback,licensejpg;
var brandRegist=[];
var brandLicense=[];
function previewImage(file, width, height, keyName) {
	var MAXWIDTH = width;
	var MAXHEIGHT = height;
	var div = file.previousSibling.previousSibling;
	console.log(file, div)
	if(file.files && file.files[0]) {
		div.innerHTML = "<img class='img' onclick=$('.uploadimg').click()>";
		var img = div.getElementsByClassName("img")[0];
		img.onload = function() {
			img.width = width;
			img.height = height;
		}
		var reader = new FileReader();
		reader.onload = function(evt) {
			img.src = evt.target.result; //base64图片地址
			if(keyName == "owneridcodejpgfront") {
				owneridcodejpgfront = img.src;
			}
			if(keyName == "owneridcodejpgback") {
				owneridcodejpgback = img.src;
			}
			if(keyName == "licensejpg") {
				licensejpg = img.src;
			}
			if(keyName == "banklicensejpg") {
				banklicensejpg = img.src;
			}
			if(keyName == "report") {
				report = img.src;
			}
			if(keyName == "brandRegist") {
				brandRegist.push(img.src);
			}
			if(keyName == "report") {
				brandLicense.push(img.src);
			}
		}
		reader.readAsDataURL(file.files[0]);
	} else { //兼容IE
		console.log("取消图片选择！");
	}
}
//alert($(".form-datetime").datetimepicker())

//下拉列表
$(".dropdown-menu li a").on('click', function() {
	$(this).parent().parent().prev().val("    " + $(this).html());
})

// 选择时间和日期
//$(".form-datetime").datetimepicker({
//	language: "zh-CN",
//	weekStart: 1,
//	todayBtn: 1,
//	autoclose: 1,
//	todayHighlight: 1,
//	startView: 2,
//	minView: 2,
//	forceParse: 0,
//	format: "yyyy-mm-dd"
//});

//地区三级联动
//$("#distpicker5").distpicker({
//autoSelect: false,
//province: "请选择省/直辖市/特别行政区",
//city: "请选择城市",
//district: "请选择县区"
//});
//顶部标题
document.querySelector(".headTitle .leftTitle").addEventListener("click", function() {
	window.location.href="fillenterinfo.html";
});

//个人入驻	存在第三方店铺
document.querySelector(".enterpriseEnterWapper .thirdPlaygroundWapperChoose .yes ").addEventListener("click", function() {
	document.querySelector(".thirdPlaygroundWapper").style.display = "block";
	isothershop = 1;
})
document.querySelector(".enterpriseEnterWapper .thirdPlaygroundWapperChoose .no").addEventListener("click", function() {
	document.querySelector(".thirdPlaygroundWapper").style.display = "none";
	isothershop = 0;
})

var thirdLink = 2;
$(".thirdPlaygroundWapper").on("click", ".deletShopLink", function() {
	//	alert(thirdLink);
	thirdLink--;
	$(this).parent().parent().parent().remove();

})
$(".thirdPlaygroundWapper").on("click", ".addShopLink", function() {
	thirdLink++;
	$(".thirdPlaygroundWapper").append('<div class="inputBlock thirdPlayground addThirdPlayground" data-num=' + thirdLink + '><div class="fillWapper goodsSource"><div class="form-group clean"><span class="inputName">第三方店铺链接：</span><div class="dropdown"><input type="text" id="product-state" placeholder="请选择" readonly="readonly" data-toggle="dropdown" class="down froms"><ul class="dropdown-menu"><li><a href="#">淘宝</a></li><li><a href="#">天猫</a></li><li><a href="#">京东</a></li></ul></div><input type="text" class="longInput" placeholder="请输入第三方店铺链接" /><span class="deletShopLink" data-num=' + thirdLink + ' ></span><span class="addShopLink" data-num=' + thirdLink + '></span></div></div></div>');
	//	$(this).parent().parent().parent().parent()
})

//if(document.querySelector(".personEnterWapper .thirdPlaygroundWapperChoose .yes ").getAttribute("checked")){
//	document.querySelector(".thirdPlaygroundWapper").style.display="block";
//}
//if(document.querySelector(".personEnterWapper .thirdPlaygroundWapperChoose .no ").getAttribute("checked")){
//	document.querySelector(".thirdPlaygroundWapper").style.display="none";
//}


//添加商标信息
document.querySelector(".addBrandInfo span").addEventListener("click",function(){
	$(".supplierBrandInfo .inputBlockWapper .blockBox").append('<div class="leftWapper"><div class="inputBlock enterUserName"><span class="inputName">商标名称：</span><input type="text" placeholder="请填写商标名称" /></div><div class="inputBlock"><span class="inputName">商标注册号：</span><input type="text" placeholder="请填写商标注册号" /></div><div class="inputBlock imgUpload clean"><span class="inputName">商标注册证：</span><div class="addmainimg1 clean"><div class="addimg1"><div class="clean"><img src="../img/reg/addimg_03.png" class="img" border="0" onclick="$(this).parent().next().click();"></div><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" onchange="previewImage(this,170,170)" class="uploadimg mainPhotoInput"></div></div></div><div class="inputBlock imgUpload clean"><span class="inputName">品牌授权证明：</span><div class="addmainimg1 clean"><div class="addimg1"><div class="clean"><img src="../img/reg/addimg_03.png" class="img" border="0" onclick="$(this).parent().next().click();"></div><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" onchange="previewImage(this,170,170)" class="uploadimg mainPhotoInput"></div></div></div><div class="inputBlock brandValidityPeriod"><span class="inputName">品牌授权有效期：</span><div class="form-group clean beginTime"><!--<span class="fillTitle" style="float:left;">体验活动时间：</span>--><div class="input-group date form-datetime" data-date="1979-09-16T05:25:07Z" data-date-format="dd MM yyyy - HH:ii p" data-link-field="dtp_input1"><!--<span class="input-group-addon"><span class="icon-calendar"></span></span>--><input placeholder="请选择时间" class="form-control starttime" size="16" type="text" value="" readonly=""></div><!--<span class="warningText starttimeText">请输入体验活动时间！</span>--></div><span class="zhi">至</span><div class="form-group clean finishTime"><!--<span class="fillTitle" style="float:left;">体验活动时间：</span>--><div class="input-group date form-datetime" data-date="1979-09-16T05:25:07Z" data-date-format="dd MM yyyy - HH:ii p" data-link-field="dtp_input1"><!--<span class="input-group-addon"><span class="icon-calendar"></span></span>--><input placeholder="请选择时间" class="form-control starttime" size="16" type="text" value="" readonly=""></div><!--<span class="warningText starttimeText">请输入体验活动时间！</span>--></div></div></div>');
	
});


//企业入驻   提交  数据没有检验是否为空
document.querySelector(".enterpriseEnterWapper .submitBlock span").addEventListener("click", function() {
	var type = 1;
	var managername = document.querySelector(".enterpriseEnterWapper .managername").value.trim();
	var managermail = document.querySelector(".enterpriseEnterWapper .managermail").value.trim();
	var managerphone = document.querySelector(".enterpriseEnterWapper .managerphone").value.trim();
	var managerwechat = document.querySelector(".enterpriseEnterWapper .managerwechat").value.trim();
	var managerqq = document.querySelector(".enterpriseEnterWapper .managerqq").value.trim();
//	var managerpcode = document.querySelector(".enterpriseEnterWapper .managerpcode").value.trim();

	var goodsCategory = document.querySelector(".categoryid").value.trim();
	var categoryText = ["女装", "男装", "内衣", "母婴", "包包", "居家", "鞋品", "美食", "文体", "家电", "其他", "配饰", "数码", "美妆"];
	categoryid = categoryText.indexOf(goodsCategory) + 1;
	if(categoryid >= 1 && categoryid <= 5) {
		
	} else if(categoryid >= 6) {
		categoryid += 1;
	} else if(categoryid == 14) {
		categoryid = "341";
	}
	console.log("categoryid---" + categoryid + "--categoryText--" + goodsCategory);

	//			是否有第三方店铺
//	if(document.querySelector(".personEnterWapper .thirdPlaygroundWapperChoose .yes ").getAttribute("checked") || document.querySelector(".personEnterWapper .thirdPlaygroundWapperChoose .no ").getAttribute("checked")) {
//		//	document.querySelector(".thirdPlaygroundWapper").style.display="block";
//		 isothershop = 1;
//	} else {
//		 isothershop = 0;
//	}
	
	if(isothershop==1){
		var allThirdPlaygroundId = document.querySelectorAll(".enterpriseEnterWapper .thirdPlayground .appsId");
	var allThirdPlaygroundLink = document.querySelectorAll(".enterpriseEnterWapper .thirdPlayground .appsLink");
	for(var i = 0; i < allThirdPlaygroundId.length; i++) {
		var arrElem={};
		if(allThirdPlaygroundId[i].value.trim() == "淘宝") {
			arrElem.id = 1;
		}
		if(allThirdPlaygroundId[i].value.trim() == "天猫") {
			arrElem.id = 2;
		}
		if(allThirdPlaygroundId[i].value.trim() == "京东") {
			arrElem.id = 3;
		}
		//		apps[i].id = allThirdPlaygroundId.value;
//		alert(allThirdPlaygroundLink[i].value);
		arrElem.links = allThirdPlaygroundLink[i].value;
		apps.push(arrElem);
	}
	console.log("apps---" + JSON.stringify(apps));
	}else{
		apps=[];
	}
//	是否三证合一
	console.log("isnewlicense-----"+isnewlicense);
	var ownermail = document.querySelector(".enterpriseEnterWapper .ownermail").value.trim();
	var ownerphone = document.querySelector(".enterpriseEnterWapper .ownerphone").value.trim();
	var owneridcode = document.querySelector(".enterpriseEnterWapper .owneridcode").value.trim();
	
	var managerwechat = document.querySelector(".enterpriseEnterWapper .managerwechat").value.trim();
	var managerqq = document.querySelector(".enterpriseEnterWapper .managerqq").value.trim();
//	var managerpcode = document.querySelector(".enterpriseEnterWapper .managerpcode").value.trim();
	
//	公司经营地址
	var province = document.querySelector(".enterpriseEnterWapper .province").value.trim();
	var city = document.querySelector(".enterpriseEnterWapper .city").value.trim();
	var managerwechat = document.querySelector(".enterpriseEnterWapper .managerwechat").value.trim();
	var xian = document.querySelector(".enterpriseEnterWapper .xian").value.trim();
	var home = document.querySelector(".enterpriseEnterWapper .home").value.trim();
	var licensecode = document.querySelector(".enterpriseEnterWapper .licensecode").value.trim();
	
	
	//	法人身份证正面照
	console.log("---owneridcodejpgback---" + owneridcodejpgback);

	//	身份证有效期
	//	sfstart sfend
	//var sfstart = docuzment.querySelector(".enterpriseEnterWapper .sfstart").value.trim();
	//var sfend = document.querySelector(".enterpriseEnterWapper .sfend").value.trim();
	
	sfstart = "2012-02-02";
	sfend = "2018-02-02";
	
//	供应商商标信息 brandRegist  brandLicense
	var brandInfoBlock=document.querySelector(".supplierBrandInfo .leftWapper");
	for(var i=0;i<brandInfoBlock.length;i++){
		var elem={};
		elem.name=document.querySelector(".supplierBrandInfo .leftWapper .name").value;
		elem.code=document.querySelector(".supplierBrandInfo .leftWapper .code").value;
		
		elem.tradepaper=brandRegist[i];
		elem.empowerjpg=brandLicense[i];
		shoparr.push(elem);
	}
	empowerstarttime="2017-10-10";
	empowerendtime="2017-10-10";
	
	var timestamp=new Date().getTime()/1000;
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Backlanding/personalInfo",
		data: {
			token:"MTE1ODJhN2YxZDdiMDA0MjQzMmZmZTlh",
			timestamp: timestamp,
			uid: 100029,
			type:type,
			managername:managername,
			managermail:managermail,
			managerphone:managerphone,
			managerwechat:managerwechat,
			managerqq:managerqq,
			categoryid:categoryid,
			isothershop:isothershop,
			isnewlicense:isnewlicense,
			ownermail:ownermail,
			ownerphone:ownerphone,
			owneridcode:owneridcode,
			licensecode:licensecode,
			province:province,
			city:city,
			xian:xian,
			home:home,
			owneridcodejpgfront:owneridcodejpgfront,
			owneridcodejpgback:owneridcodejpgback,
			sfstart:sfstart,
			sfend:sfend,
			licensejpg:licensejpg,
			banklicensejpg:banklicensejpg,
			report:report,
			shoparr:shoparr
			
//			managerpcode:managerpcode,
//			owneridcodejpgfront:owneridcodejpgfront,
//			owneridcodejpgback:owneridcodejpgback,
//			owneridcodejpg:owneridcodejpg,
//			sfstart:sfstart,
//			sfend:sfend,
//			isothershop:isothershop,
//			apps:apps,
		},
		success: function(data) {
			console.log("------" + JSON.stringify(data));
//			activitylist = data.Activitylist[0];
//
//			document.querySelector(".activityBeginTime").value = activitylist.day;
//			document.querySelector(".activityNum").value = activitylist.hour.substring(0, activitylist.hour.indexOf("-")) + ":00场";
//
//			document.querySelector(".goodsIdInput").value = activitylist.goodsid;
//			document.querySelector(".goodsTitleInput").value = activitylist.activitytitle;
//			document.querySelector(".goodsPriceInput").value = activitylist.price;
//			document.querySelector(".img").setAttribute("src", activitylist.activitypic);
//			photoInput = activitylist.activitypic;
//
//			document.querySelector(".submitBtn").innerHTML = "确认修改";
		},
		error: function(msg) {
			console.log(msg);
		}
	});

})
//企业入驻   提交  数据没有检验是否为空
document.querySelector(".enterpriseEnterWapper .submitBlock span").addEventListener("click", function() {
	var type = 2;
	var managername = document.querySelector(".enterpriseEnterWapper .managername").value.trim();
	var managermail = document.querySelector(".enterpriseEnterWapper .managermail").value.trim();
	var managerphone = document.querySelector(".enterpriseEnterWapper .managerphone").value.trim();
	var managerwechat = document.querySelector(".enterpriseEnterWapper .managerwechat").value.trim();
	var managerqq = document.querySelector(".enterpriseEnterWapper .managerqq").value.trim();
//	var managerpcode = document.querySelector(".enterpriseEnterWapper .managerpcode").value.trim();

	var goodsCategory = document.querySelector(".categoryid").value.trim();
	var categoryText = ["女装", "男装", "内衣", "母婴", "包包", "居家", "鞋品", "美食", "文体", "家电", "其他", "配饰", "数码", "美妆"];
	categoryid = categoryText.indexOf(goodsCategory) + 1;
	if(categoryid >= 1 && categoryid <= 5) {
		
	} else if(categoryid >= 6) {
		categoryid += 1;
	} else if(categoryid == 14) {
		categoryid = "341";
	}
	console.log("categoryid---" + categoryid + "--categoryText--" + goodsCategory);

	//			是否有第三方店铺
//	if(document.querySelector(".personEnterWapper .thirdPlaygroundWapperChoose .yes ").getAttribute("checked") || document.querySelector(".personEnterWapper .thirdPlaygroundWapperChoose .no ").getAttribute("checked")) {
//		//	document.querySelector(".thirdPlaygroundWapper").style.display="block";
//		 isothershop = 1;
//	} else {
//		 isothershop = 0;
//	}
	
	if(isothershop==1){
		var allThirdPlaygroundId = document.querySelectorAll(".enterpriseEnterWapper .thirdPlayground .appsId");
	var allThirdPlaygroundLink = document.querySelectorAll(".enterpriseEnterWapper .thirdPlayground .appsLink");
	for(var i = 0; i < allThirdPlaygroundId.length; i++) {
		var arrElem={};
		if(allThirdPlaygroundId[i].value.trim() == "淘宝") {
			arrElem.id = 1;
		}
		if(allThirdPlaygroundId[i].value.trim() == "天猫") {
			arrElem.id = 2;
		}
		if(allThirdPlaygroundId[i].value.trim() == "京东") {
			arrElem.id = 3;
		}
		//		apps[i].id = allThirdPlaygroundId.value;
//		alert(allThirdPlaygroundLink[i].value);
		arrElem.links = allThirdPlaygroundLink[i].value;
		apps.push(arrElem);
	}
	console.log("apps---" + JSON.stringify(apps));
	}else{
		apps=[];
	}
	

	//	管理人身份证正面照
	console.log("---owneridcodejpgback---" + owneridcodejpgback);

	//	身份证有效期
	//	sfstart sfend
	sfstart = "2012-02-02";
	sfend = "2018-02-02";
	
//	各种照片
	
//	供应商资质信息

//供应商商标信息

	
	var timestamp=new Date().getTime()/1000;
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Backlanding/personalInfo",
		data: {
			token:"MDRhNWY1NzczZmJjYzZhOTljMDE0ODQx",
			timestamp: timestamp,
			uid: 100028,
			type:type,
			managername:managername,
			managermail:managermail,
			managerphone:managerphone,
			managerwechat:managerwechat,
			managerqq:managerqq,
			categoryid:categoryid,
			isothershop:isothershop,
			apps:apps,
//			managerpcode:managerpcode,
			isnewlicense:isnewlicense,
			ownermail:ownermail,
			ownerphone:ownerphone,
			owneridcode:owneridcode,
			licensecode:licensecode,
			province:province,
			city:city,
			xian:xian,
			home:home,
			
			owneridcodejpgfront:owneridcodejpgfront,
			owneridcodejpgback:owneridcodejpgback,
			sfstart:sfstart,
			sfend:sfend,
			licensejpg:licensejpg,
			banklicensejpg:banklicensejpg,
			report:report,
			shoparr:shoparr
			
//			owneridcodejpg:owneridcodejpg,
			
			
			
		},
		success: function(data) {
			console.log("------" + JSON.stringify(data));
//			activitylist = data.Activitylist[0];
//
//			document.querySelector(".activityBeginTime").value = activitylist.day;
//			document.querySelector(".activityNum").value = activitylist.hour.substring(0, activitylist.hour.indexOf("-")) + ":00场";
//
//			document.querySelector(".goodsIdInput").value = activitylist.goodsid;
//			document.querySelector(".goodsTitleInput").value = activitylist.activitytitle;
//			document.querySelector(".goodsPriceInput").value = activitylist.price;
//			document.querySelector(".img").setAttribute("src", activitylist.activitypic);
//			photoInput = activitylist.activitypic;
//
//			document.querySelector(".submitBtn").innerHTML = "确认修改";
		},
		error: function(msg) {
			console.log(msg);
		}
	});

})