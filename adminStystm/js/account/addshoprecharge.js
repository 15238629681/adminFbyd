var userinfo = JSON.parse(localStorage.getItem("userinfo"));

//获取路径中的店铺id
//获取路径中的id
function getUrlAttribute(parameName)
{
    //location.search是从当前URL的?号开始的字符串，即查询字符串
    var query = (location.search.length > 0 ? location.search.substring(1) : null);
    if(null!=query)
    {
        var args = new Object( );
        var pairs = query.split("&");
        for(var i = 0; i < pairs.length; i++)
        {
            var pos = pairs[i].indexOf("=");
            if (pos == -1)
                continue;
            var argname = pairs[i].substring(0,pos);
            var value = pairs[i].substring(pos+1);
            value = decodeURIComponent(value);
            args[argname] = value;
        }
        //根据键名获取值
        var id=args[parameName];
//      document.querySelector(".operateBlock .nextStap").innerHTML='<a href="https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?uid='+userinfo.uid+'&token='+userinfo.token+'&money=798.00&body='+id+'">去支付</a>';

//document.querySelector(".operateBlock a").setAttribute("href","https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?uid="+userinfo.uid+"&token="+userinfo.token+"&money=798.00&body="+id+"");
        return args[parameName];
    }
    return null;
}

var id=getUrlAttribute("id");           //用户id
var subalanceid=getUrlAttribute("subalanceid");     //店铺id
console.info(id, subalanceid);


//可提现金额
var canWithDrawMoney;
var getMesageContClick=false;
function getWithDrawNum() {
    $.ajax({
        type: "post",
        url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/bandshopbalanceSear",
        data: {
            token: userinfo.token,
            timestamp: new Date().getTime() / 1000,
            uid: userinfo.uid
        },
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.message == "成功") {
                //可提现金额
                var allNum = data.balancelist[0].managerbalance;
                canWithDrawMoney = allNum;
//				canWithDrawMoney = 10000;
                document.querySelector(".accountBalanceBlock .withDrawNumWapper .withDrawNum").innerHTML = data.balancelist[0].managerbalance;
                if(parseFloat(allNum) <798.00) {
                    getMesageContClick = true;
                    document.querySelector(".accountBalanceBlock .payDetailBlock .inputWapper input").style.cssText = "border:1px solid #C0C0C0;"
                    document.querySelector(".accountBalanceBlock .payDetailBlock .inputWapper .getMessageCode").style.cssText = "background:#a0a0a0;";

                    //					document.querySelector(".getMessageCode .alertWrong").style.cssText = "background: #fff;padding-left:0;display:inline-block;";

                    document.querySelector(".accountBalanceBlock .payDetailBlock .inputWapper .balanceAlert ").style.display = "inline-block";
                    document.querySelector(".accountBalanceBlock .balanceAlert").innerHTML = "余额不足，请使用其他支付方式";
                }

                var str = data.balancelist[0].phone;
                userphone = data.balancelist[0].phone;
                document.querySelector(".accountBalanceBlock .userPhoneWapper .phoneNum").innerHTML = "(" + str.substring(0, 3) + "***" + str.substring(8, 11) + ")";

            } else {
                alert("网络错误，请刷新重试！")
            }
        },
        error: function(msg) {
            console.log(msg);
        }
    })
}
getWithDrawNum();



//余额支付
var balanceNoChoose = true;
$(".accountBalanceBlock .chooseBlock").on("click", function() {
    if(balanceNoChoose) { //选中
        $(".accountBalanceBlock .chooseBlock img").attr("src", "../img/account/choose.png");
        $(".accountBalanceBlock .payDetailBlock").css("display", "block");

        if(!otherNoChoose) { //打开状态
            $(".otherPayBlock .chooseBlock img").attr("src", "../img/account/nochoose.png");
            $(".otherPayBlock .payDetailBlock").css("display", "none");
            otherNoChoose = !otherNoChoose;
        }
        if(parseFloat(canWithDrawMoney) < 798.00) {
            document.querySelector(".operateBlock .nextStap").style.cssText = "background:#a0a0a0;";
        }
    } else { //取消选中
        $(".accountBalanceBlock .chooseBlock img").attr("src", "../img/account/nochoose.png");
        $(".accountBalanceBlock .payDetailBlock").css("display", "none");
    }
    balanceNoChoose = !balanceNoChoose;
    document.querySelector(".operateBlock .nextStap").innerHTML = "去支付";
})

var otherNoChoose = true;
$(".otherPayBlock .chooseBlock").on("click", function() {
    if(otherNoChoose) { //选中
        $(".otherPayBlock .chooseBlock img").attr("src", "../img/account/choose.png");
        $(".otherPayBlock .payDetailBlock").css("display", "block");
        if(!balanceNoChoose) {
            $(".accountBalanceBlock .chooseBlock img").attr("src", "../img/account/nochoose.png");
            $(".accountBalanceBlock .payDetailBlock").css("display", "none");
            balanceNoChoose = !balanceNoChoose;
        }
        //		添加支付宝支付链接
        document.querySelector(".operateBlock .nextStap").innerHTML = '<a href="https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?uid=' + userinfo.uid + '&token=' + userinfo.token + '&money=798.00&id='+subalanceid + '&shopid=' + id + '&ordertype=5' + '" style="color:#333;" target="_blank">去支付</a>';
        document.querySelector(".operateBlock .nextStap").style.cssText = "background:#FF3A46;";

    } else { //取消选中
        $(".otherPayBlock .chooseBlock img").attr("src", "../img/account/nochoose.png");
        $(".otherPayBlock .payDetailBlock").css("display", "none");
        document.querySelector(".operateBlock a").setAttribute("href", "");
    }
    otherNoChoose = !otherNoChoose;
})

document.querySelector(".operateBlock .nextStap").addEventListener("click", function() {
    if(balanceNoChoose && otherNoChoose) {
        alert("请选择支付方式!");
        return;
    }
    if(!balanceNoChoose) { //余额支付  去支付
        if(parseFloat(canWithDrawMoney) < 798.00){
            return;
        }
        if(!document.querySelector(".accountBalanceBlock .inputWapper input").value && parseFloat(canWithDrawMoney) >= 798.00) {
            document.querySelector(".accountBalanceBlock .inputWapper .balanceAlert").style.display = "inline-block";
            document.querySelector(".accountBalanceBlock .inputWapper .balanceAlert").innerHTML = "请输入验证码！";
            return;
        }
        //	验证手机验证码
        var code = document.querySelector(".accountBalanceBlock .inputWapper input").value;
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/tphone",
            data: {
                token: userinfo.token,
                timestamp: new Date().getTime() / 1000,
                uid: userinfo.uid,
                phone: userphone,
                code: code,
                id: id,
                money: 798.00,
                subalanceid: subalanceid
            },
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.message == "成功") {
                    //余额支付接口
                    balanceRechargeRequest();
                }
                if(data.message == "验证码错误") {
                    //余额支付接口
                    document.querySelector(".balanceAlert").style.display = "inline-block";
                    document.querySelector(".balanceAlert").innerHTML = "验证码错误！";
                }
                if(data.message == "验证码失效请重新获取验证码") {
                    //余额支付接口
                    document.querySelector(".getMessageCode .alertWrong").style.display = "inline-block";
                    document.querySelector(".getMessageCode .alertWrong").innerHTML = "验证码失效请重新获取验证码！";
                }
            },
            error: function(msg) {
                console.log(msg);
            }
        })
    }

    if(!otherNoChoose) { //支付宝支付
        var timestamp = '';
        $('.beingAlipay').show();
        var getStatus = setInterval(function() {
            console.info({
                token: userinfo.token,
                    uid: userinfo.uid,
                    time: timestamp
            });
            $.ajax({
                type: "post",
                url: "https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/getStatus",
                data: {
                    token: userinfo.token,
                    uid: userinfo.uid,
                    time: timestamp
                },
                success: function(data) {
                    timestamp = data.data;
                    if(data.message == "成功") {
                        $('.beingAlipay').hide();
                        window.location.href = "addshopsuccess.html";
                        getStatus.clearInterval();
                    }
                },
                error: function(msg) {
                    console.log(msg);
                }
            })

        }, 1000);
    }
})

function balanceRechargeRequest(){
    $.ajax({
        type: "post",
        url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/bandshopbalance",
        data: {
            token:userinfo.token,
            uid:userinfo.uid,
            timestamp:new Date().getTime()/1000,
            money:798.00,
            id:id,
            subalanceid: subalanceid
        },
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.message == "成功") {
                //余额支付接口
                window.location.href="addshopsuccess.html";
            }
            if(data.message == "余额不足") {
                //余额支付接口
                alert("请用支付宝或微信支付！");
            }
        },
        error: function(msg) {
            console.log(msg);
        }
    })
}

//余额支付  获取短信验证码
//账户余额支付  发短信
var nextGetFlag = false;
document.querySelector(".accountBalanceBlock .getMessageCode").addEventListener("click", function() {
    if(getMesageContClick) {
        return;
    }

    //开始倒计时
    if(!nextGetFlag) {
        //		var IsBy = $.idcode.validateCode(); //调用返回值，返回值结果为true或者false
        //发短信   开始倒计时
        var lastTime = 60;
        if(!nextGetFlag) {
            $(this).html("获取短信验证码");
            nextGetFlag = true;
            getCodeTime = new Date().getTime() / 1000;
            $.ajax({
                type: "post",
                url: "https://app.fanbaoyundian.com/h5api/verifycode.app.php",
                data: {
                    phonenumber: userphone,
                    action: "login"
                },
                success: function(data) {
                    console.log(JSON.stringify(data));
                    if(data.message == "发送失败，稍后再试") {
                        alert("发送失败，稍后再试!");
                    } else {
                        var interval = setInterval(function() {
                            lastTime--;
                            $(".accountBalanceBlock .inputWapper .getMessageCode").html("重新获取" + lastTime + "s");
                            if(lastTime == 0) {
                                $(".accountBalanceBlock .inputWapper .getMessageCode").html("获取短信验证码");
                                clearInterval(interval);
                                nextGetFlag = false;
                            }
                        }, 1000);
                    }
                },
                error: function(msg) {
                    console.log(msg);
                }
            });
        }
    }
})

function getCuyrrentApply() {
    $.ajax({
        type: "post",
        url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/shopbalaceS",
        data: {
            token: userinfo.token,
            uid: userinfo.uid,
            timestamp: new Date().getTime()/1000,
            id: id,
			subalanceid: subalanceid
        },
        success: function(data) {
        	document.querySelector('.orderDetailBlock .orderNum').innerText = '订单号：' + data.list.balance[0].ordernumber;
            document.querySelector('.orderDetailBlock .upgradeType').innerText = data.list.shop[0].shopname;
            var platform = "";
            switch(parseInt(data.list.shop[0].apps)) {
                case 1:
                    platform = "淘宝";
                    break;
                case 2:
                    platform = '天猫';
                    break;
                default:
                    platform = '京东';
            }
            document.querySelector('.orderDetailBlock .shopPlayground').innerText = platform;
        },
        error: function(msg) {
            console.log(msg,'2222222222222');
        }
    });
}
getCuyrrentApply();















