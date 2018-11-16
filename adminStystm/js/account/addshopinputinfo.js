var userinfo=JSON.parse(localStorage.getItem("userinfo"));



$(".shopBlock").on("click",".dropdown-menu li a",function(){
	$(this).parent().parent().prev().val($(this).html());
})

$(".shopBlock").on("blur",".firstPageLink",function(){
	document.querySelector(".alertWrongLink").style.display="none";
	//var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
   	if(!IsURL(this.value.trim())){
   		document.querySelector(".alertWrongLink").style.display="inline-block";
   		document.querySelector(".alertWrongLink").innerHTML="请输入正确的网址！";
	} else {
        document.querySelector(".alertWrongLink").style.display = 'none';
	}
})
$(".shopBlock").on("blur",".shopLink",function(){
	document.querySelector(".alertWrongLink2").style.display="none";
	//var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
   	if(!IsURL(this.value.trim())){
   		document.querySelector(".alertWrongLink2").style.display="inline-block";
   		document.querySelector(".alertWrongLink2").innerHTML="请输入正确的网址！";
	}
})
var code,id;
function getVCode(){
	var timestamp = new Date().getTime();
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/Vcode",
		data: {
			token:userinfo.token,
			timestamp:timestamp,
			uid:userinfo.uid
			
		},
		success: function(data) {
			if(data.error=="0"){
				console.log(JSON.stringify(data));
				code=data.codelist[0].code;
				id=data.codelist[0].id;
				document.querySelector(".codeSpan").innerHTML=code;
				document.querySelector(".testCode").innerHTML=code;
			}
		},
		error: function(msg) {
			alert("刷新网络，获取验证码！")
			console.log(msg);
		}
	});	
}
getVCode();

//复制验证码
document.querySelector(".copyBtn").addEventListener("click",function(){
	if(document.querySelector(".testCode").innerHTML.trim()){
		copyText();
	}else{
		alert("网络错误，请刷新页面重新获取验证码！")
	}
})

function copyText()
{
	var Url2=document.querySelector(".testCode").innerText;
	var oInput = document.createElement('input');
	oInput.value = Url2;
	document.body.appendChild(oInput);
	oInput.select(); // 选择对象
	document.execCommand("Copy"); // 执行浏览器复制命令
	oInput.className = 'oInput';
	oInput.style.display='none';
	alert('复制成功！');
}

$(".maskDiv").on("click",".freesureBtn",function(){
    window.location.href = "addfreeshopsuccess.html";
});
$(".maskDiv").on("click",".sureBtn",function(){
    window.location.href='addshoprecharge.html?id='+id+'';
});

$(".onlyAddBtn").on("click",".freebindShop",function(){
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

    //var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    if(!IsURL(firstPageLink)){
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
    //var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    if(!IsURL(shopLink)){
        document.querySelector(".alertWrongLink").style.display="inline-block";
        document.querySelector(".alertWrongLink").innerHTML="请输入正确的网址！";
        return;
    }
    var timestamp = new Date().getTime()/1000;
    //https://item.taobao.com/item.htm?spm=a219r.lm5179.14.1.6b219bc6Obss0G&id=550050795485&ns=1&abbucket=14#detail
    $.ajax({
        type: "post",
        url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/Bindshop",
        data: {
            token:userinfo.token,
            timestamp:new Date().getTime()/1000,
            uid:userinfo.uid,
            apps:apps,
            shopurl:firstPageLink,
            shopname:shopNameInput,
            urls:shopLink,
            code:code,
			//code:"GMAW-3819",
            id:id
        },
        success: function(data) {
			console.info(data);
            if(data.message=="验证码与标题验证码不一致"){
                document.querySelector(".alertWrong").style.display="inline-block";
                document.querySelector(".alertWrong").innerHTML="验证码尚未添加或添加错误，请重新添加正确后再确认后绑定。";
            }

            if(data.message=="商品链接地址错误,请输入正确的链接地址"){
                document.querySelector(".alertWrong").style.display="inline-block";
                document.querySelector(".alertWrong").innerHTML="商品链接地址错误,请输入正确的链接地址。";
            }
//			第一次
            if(data.message=="成功"){
                if(data.data.ispay==1){
                    window.location.href='addshoprecharge.html?id='+id+'';
            	}
                if(data.data.ispay==2){
                    window.location.href = "addfreeshopsuccess.html";
                }
            }
        },
        error: function(msg) {
            window.location.href="shopmanage.html";
        }
    });
});


function IsURL(str_url){
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re=new RegExp(strRegex);
    if (re.test(str_url)){
        return (true);
    } else {
        return (false);
    }
}
$(".onlyAddBtn").on("click",".bindShop",function(){
	/*alert("11111");
    window.location.href="addshoprecharge.html";
    return;*/
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
   	if(!IsURL(firstPageLink)){
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
   	if(!IsURL(shopLink)){
   		document.querySelector(".alertWrongLink").style.display="inline-block";
   		document.querySelector(".alertWrongLink").innerHTML="请输入正确的网址！";
		return;
	}
	var timestamp = new Date().getTime()/1000;
	//https://item.taobao.com/item.htm?spm=a219r.lm5179.14.1.6b219bc6Obss0G&id=550050795485&ns=1&abbucket=14#detail
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/Bindshop",
		data: {
			token:userinfo.token,
			timestamp:new Date().getTime()/1000,
			uid:userinfo.uid,
			apps:apps,
			shopurl:firstPageLink,
			shopname:shopNameInput,
			urls:shopLink,
			code:code,
			//code:"GMAW-3819",
			id:id
		},
		success: function(data) {
			if(data.message=="验证码与标题验证码不一致"){
				document.querySelector(".alertWrong").style.display="inline-block";
				document.querySelector(".alertWrong").innerHTML="验证码尚未添加或添加错误，请重新添加正确后再确认后绑定。";
			}
			
			if(data.message=="商品链接地址错误,请输入正确的链接地址"){
				document.querySelector(".alertWrong").style.display="inline-block";
				document.querySelector(".alertWrong").innerHTML="商品链接地址错误,请输入正确的链接地址。";
			}
//			第一次
			if(data.message=="成功"){
				if(data.data.ispay==1){
					window.location.href='addshoprecharge.html?id='+id+'&subalanceid='+data.data.subalanceid;
				}
				if(data.data.ispay==2){
					window.location.href="shopmanage.html";
				}
			}
		},
		error: function(msg) {
            window.location.href="shopmanage.html";
		}
	});
})