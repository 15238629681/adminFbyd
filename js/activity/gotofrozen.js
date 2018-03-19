var uid,token;
var gotofrozen = {
	userBalance: null,						//用户余额
    shopid: null,								//当前绑定的用户id
    shopmoney: null,							//冻结总结金额
    getUserInfo: function(){
        this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
        uid = this.userinfo.uid;
        token = this.userinfo.token;
    },
    getUrlAttribute: function(parameName){
        //location.search是从当前URL的?号开始的字符串，即查询字符串
        var query = (location.search.length > 0 ? location.search.substring(1) : null);
        if(null!=query) {
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
            return args[parameName];
        }
        return null;
    },
    searchUserBalance: function(){
    	//查询用户余额
		var me = this;
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activitydelete/shopbalanceSear",
            data: {
                uid: uid,
                timestamp: parseInt(new Date().getTime()/1000),
                token: token
            },
            success: function (data) {
            	if(data.state != 1) return;
            	me.userBalance = data.balancelist[0].managerbalance;
            	me.getShopInfoData();
            },
            error: function (msg) {
                console.log(msg,22222);
            }
        });
	},
    getShopInfoData: function(){
    	//获取店铺相关信息
		var me = this;
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apia/Accountbalance/shopSearch",
            data: {
                uid: uid,
                token: token,
                timestamp: new Date().getTime() / 1000,
                id: me.shopid
            },
            success: function(data) {
            	if(data.state != 1) return;
            	console.info(data.tasklise[0],data.shopmoney);
                document.querySelector(".price").innerHTML = data.tasklise[0].price;
                document.querySelector(".number").innerHTML = data.tasklise[0].numbers;
                document.querySelector(".shopmoney").innerHTML = data.shopmoney;
                document.querySelector(".num").innerHTML = data.shopmoney;
                me.shopmoney = data.shopmoney;
                me.initPageLogic();
            },
            error: function(msg) {
                console.log(msg);
            }
        });
	},
    initPageLogic: function(){
    	if(this.userBalance < this.shopmoney) {
    		//账户余额小余冻结金额
			$('.maskDiv').show();
		}
	},
    closeMaskShade: function(){
    	//关闭遮罩
        $('.close').on('click',function(){
            $('.maskDiv').hide();
        });
	},
    toAccountRechargePage: function(){
    	//前往充值页面
		var me = this;
		$('.accountRecharge').on('click',function(){
            window.location.href="../finance/personalaccountrecharge.html?shopmoney="+me.shopmoney+"";
        });
	},
    toFrozenCaptial: function(){
    	//冻结金额
		var me = this;
		$('.gotoFrozen').click(function(){
            if(me.userBalance < me.shopmoney) {
                //账户余额小余冻结金额
                $('.maskDiv').show();
            } else {
            	//冻结金额
				me.gotoFrozen();
			}
		});
	},
    gotoFrozen: function(){
    	//冻结金额
		var me = this;
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apia/Accountbalance/frozenMoney",
            data: {
                uid: uid,
                token:token,
                timestamp: new Date().getTime() / 1000,
                id: me.shopid,
                shopmoney: me.shopmoney
            },
            success: function(data) {
                if(data.state == 7) {
                    alert('活动已结束无法冻结保证金');
                    return;
                }
                if(data.state == 1) {
                    window.location.href="releasesuccess.html";
                }
                if(data.state == 0) {
                	alert('您已付款');
                	return;
				}
            },
            error: function(msg) {
            	console.info(msg);
            }
        });
	},
    initEvent: function(){
    	this.closeMaskShade();						//关闭遮罩
		this.toAccountRechargePage();				//账户充值按钮事件
		this.toFrozenCaptial();						//冻结资金按钮事件点击
	},
    initPage: function(){
    	this.getUserInfo();
        this.shopid = this.getUrlAttribute('shopid');
    	this.searchUserBalance();					//查询用户余额
		this.initEvent();
	}
};

gotofrozen.initPage();
