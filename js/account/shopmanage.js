var userinfo=JSON.parse(localStorage.getItem("userinfo"));



$("table").on("click",".dropdown-menu li a",function(){
	$(this).parent().parent().prev().val($(this).html());
})

$("table").on("blur",".firstPageLink",function(){
	document.querySelector(".alertWrongLink").style.display="none";
	var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
   	if(!reg.test(this.value.trim())){
   		document.querySelector(".alertWrongLink").style.display="inline-block";
   		document.querySelector(".alertWrongLink").innerHTML="请输入正确的网址！";
	}
})
$("table").on("blur",".shopLink",function(){
	document.querySelector(".alertWrongLink2").style.display="none";
	var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
   	if(!reg.test(this.value.trim())){
   		document.querySelector(".alertWrongLink2").style.display="inline-block";
   		document.querySelector(".alertWrongLink2").innerHTML="请输入正确的网址！";
	}
})


var code,id;
//function getVCode(){
//	var timestamp = new Date().getTime();
//	$.ajax({
//		type: "post",
//		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/Vcode",
//		data: {
////			token:"OWYxNzFmNDM5MTFlMGUwNjkyMjEyNzk5",
////			timestamp:new Date().getTime()/1000,
////			uid:21668
//			token:userinfo.token,
//			timestamp:new Date().getTime()/1000,
//			uid:userinfo.uid,
//		},
//		success: function(data) {
//			console.log(JSON.stringify(data));
//			if(data.error=="0"){
//				console.log(JSON.stringify(data));
//				code=data.codelist[0].code;
//				id=data.codelist[0].id;
//				
//			}
//		},
//		error: function(msg) {
//			alert("获取验证码失败！")
//			console.log(msg);
//		}
//	});	
//}
//getVCode();


/*document.querySelector(".onlyAddBtn span").addEventListener("click",function(){
	document.querySelector(".onlyAddBtn").style.display="none";
//	document.querySelector(".shopTable tbody").innerHTML='<tr class="addShopTr addShopDetail" ><td colspan="4" class="shopInfoWapper"><div class="shopInfo"><div class="shopContent"><div class="infoTitle">绑定网店</div><div class="inputBlock firstInputBlock playgroundBlock"><span class="inputName">平台：</span><div class="dropdown" style="display:inline-block;"><input  class="playgroundInput down froms" style="background:url(../img/order/arrowicon.png) right center no-repeat;" type="text" id="product-state" placeholder="请选择商品来源" readonly="readonly" data-toggle="dropdown"><ul class="dropdown-menu"><li><a href="#">淘宝</a></li><li><a href="#">天猫</a></li><li><a href="#">京东</a></li></ul></div><span class="alertPlayground alertText">请输入商品来源！</span></div><div class="inputBlock"><span class="inputName">网店店名：</span><input class="shopNameInput" type="text" /><span class="alertShopName">请输入网店店名！</span></div><div class="inputBlock"><span class="inputName">网店首页链接：</span><input type="text" class="firstPageLink"/><span class="alertWrongLink">请输入正确的网址！</span></div><div class="inputBlock"><span class="inputName testInputName">验证码：</span><span class="testCode"></span><span class="copyBtn">复制验证码</span><!--<span class="alertWrong">未检测到您的验证码，请将该验证码复制到您所提供的商品标题上!</span>--><span class="alertWrong">验证码尚未添加或添加错误，请重新添加正确后再确认后绑定。</span></div><div class="shopInfoExample"><div class="exampleTitle">1、将验证码添加到您的网店里某个商品的标题上，如下所示：</div><div class="exampleImg"><img src="../img/account/shopinfoexample_03.png" alt="" /><span class="codeSpan"></span></div><div class="exampleTitle">2、将这个商品的链接,复制到一下输入框。</div><div class="shopUrl"><span class="shopUrlText">商品链接(URL):</span><input type="text" class="shopLink"/><span class="alertWrongLink2">请输入正确的网址！</span></div></div><div class="addShopDiv">绑定网店</div></div></div></td></tr>';

	document.querySelector(".inputBlock .testCode").innerHTML=code;
	document.querySelector(".exampleImg .codeSpan").innerHTML=code;
})*/

//绑定网店
document.querySelector(".onlyAddBtn .bindBtn").addEventListener("click",function(){
    $.ajax({
        type: "post",
        url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/bangSearch",
        data: {
            token:userinfo.token,
            timestamp: new Date().getTime()/1000,
            uid:userinfo.uid
        },
        success: function(data) {
            console.info(data);
            if(data.bshoplist && data.bshoplist.length != 0) {
                window.location.href="addshopinputinfo.html";
            } else {
                window.location.href="addfreeshopform.html";
            }
        },
        error: function(msg) {
        }
    });
});

$("table").on("click",".addShopDiv",function(){
	document.querySelector(".playgroundBlock .alertPlayground").style.display="none";
	document.querySelector(".alertShopName").style.display="none";
	document.querySelector(".alertWrongLink").style.display="none";
	document.querySelector(".alertWrongLink2").style.display="none";
	
	
	var playgroundText=document.querySelector(".playgroundBlock .playgroundInput").value.trim();
	if(!playgroundText){
		document.querySelector(".playgroundBlock .alertPlayground").style.display="inline-block";
		return;
	}
	if(playgroundText=="淘宝"){
		apps=1;
	}if(playgroundText=="天猫"){
		apps=2;
	}if(playgroundText=="京东"){
		apps=3;
	}
	var shopNameInput=document.querySelector(".shopNameInput").value.trim();
	if(!shopNameInput){
		document.querySelector(".alertShopName").style.display="inline-block";
		return;
	}
	
	var firstPageLink=document.querySelector(".firstPageLink").value.trim();
	if(!firstPageLink){
		document.querySelector(".alertWrongLink").style.display="inline-block";
		document.querySelector(".alertWrongLink").innerHTML="请输入网店首页链接！";
		return;
	}
	
	var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
   	if(!reg.test(firstPageLink)){
   		document.querySelector(".alertWrongLink").style.display="inline-block";
   		document.querySelector(".alertWrongLink").innerHTML="请输入正确的网址！";
		return;
	}
	
	var shopLink=document.querySelector(".shopLink").value.trim();
	if(!shopLink){
		document.querySelector(".alertWrongLink2").style.display="inline-block";
		document.querySelector(".alertWrongLink2").innerHTML="请输入商品链接(URL)！";
		return;
	}
	var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
   	if(!reg.test(shopLink)){
   		document.querySelector(".alertWrongLink").style.display="inline-block";
   		document.querySelector(".alertWrongLink").innerHTML="请输入正确的网址！";
		return;
	}
	var timestamp = new Date().getTime()/1000;
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/Bindshop",
		data: {
			token:userinfo.token,
			timestamp:timestamp,
			uid:userinfo.uid,
			apps:apps,
			shopurl:firstPageLink,
			shopname:shopNameInput,
			urls:shopLink,
			code:code,
			id:id
		},
		success: function(data) {
			console.log(JSON.stringify(data));
//			alert(getLocalTime(timestamp));
			if(data.message=="验证码与标题上验证码不一致或商品标题后无验证码"){
				document.querySelector(".alertWrong").style.display="inline-block";
				document.querySelector(".alertWrong").innerHTML="验证码尚未添加或添加错误，请重新添加正确后再确认后绑定。";
			}
			if(data.message=="余额不足请充值"){
				window.location.href="../finance/accountrecharge.html";
			}
			if(data.message=="商品链接地址错误,请输入正确的链接地址"){
				document.querySelector(".alertWrong").style.display="inline-block";
				document.querySelector(".alertWrong").innerHTML="商品链接地址错误,请输入正确的链接地址。";
			}
			if(data.message=="成功"){
				document.querySelector(".shopTable tbody").innerHTML='<tr class="yetAddShopTr"><td>'+playgroundText+'</td><td>'+shopNameInput+'</td><td>'+firstPageLink+'</td><td>'+getLocalTime(timestamp)+'</td></tr><tr class="addShopTr goToBuy"><td colspan="4"><span>购买网店</span><div class="tiShi">（绑定网店数已达到上限，若需绑定更多网店请点击购买网店）</div></td></tr>';
			}
		},
		error: function(msg) {
			console.log(msg);
			//					alert(JSON.stringify(msg));
		}
	});	
})

    function getLocalTime(nS) {     
       return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");      
    }     
   
   $(".shopTable").on("click",".goToBuy span",function(){
   		document.querySelector(".maskDiv").style.cssText="display:block;";
   })
   
// 复制验证码
    $(".shopTable").on("click",".copyBtn",function(){
   		var codeText=document.querySelector(".testCode").innerHTML;
// 		window.clipboardData.setData("Text",codeText);
   		document.execCommand("Copy");
   })
   
	$(".maskDiv").on("click",".cancelBtn",function(){
   		document.querySelector(".maskDiv").style.cssText="display:none;";
   		
	});
     
     
// 所有店铺列表  表格数据初始化
var shopInfoArr=[];
function getAllShopList(){
	console.info({token: userinfo.token,timestamp: new Date().getTime() / 1000,uid: userinfo.uid });
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/bangSearch",
		data: {
			token:userinfo.token,
			timestamp:new Date().getTime()/1000,
			uid:userinfo.uid,
		},
		success: function(data) {
			if(data.message=="成功"){  //查询到店铺
				console.info(data,'888888888');
				shopInfoArr=data.bshoplist;
				addInfoTable();
				document.querySelector(".onlyAddBtn .upLimitText").style.display="inline-block";
				document.querySelector(".onlyAddBtn .upLimitText").innerHTML="若需绑定更多网店,需支付798元/家";
			}else{
//				失败  还有一次绑定的机会
//				alert("您还有一次绑定店铺的机会！");
				document.querySelector(".onlyAddBtn .upLimitText").style.display="inline-block";
				document.querySelector(".onlyAddBtn .upLimitText").innerHTML="目前还可以免费绑定1家网店,若需绑定更多网店，需支付798元/家";
			}
		},
		error: function(msg) {
			console.log(msg);
		}
	});	
}
getAllShopList();
function addInfoTable(){
	for(var i=0;i<shopInfoArr.length;i++){
		var infoTr=document.createElement("tr");
		
		for(var j=0;j<4;j++){
			var infoTd=document.createElement("td");
			if(j==0){
				if(shopInfoArr[i].apps == "1"){
					infoTd.innerHTML="淘宝";
				}if(shopInfoArr[i].apps == "2"){
					infoTd.innerHTML="天猫";
				}
				if(shopInfoArr[i].apps == "3"){
					infoTd.innerHTML="京东";
				}
			}else if(j==1){
				infoTd.innerHTML=shopInfoArr[i].shopname;
			}else if(j==2){
				infoTd.innerHTML=shopInfoArr[i].shopurl;
			}else if(j==3){
				infoTd.innerHTML=shopInfoArr[i].addtime;
				console.log(shopInfoArr[i].addtime)
			}
			infoTr.appendChild(infoTd);
		}
		document.querySelector(".shopTable tbody").appendChild(infoTr);
	}
	
}






