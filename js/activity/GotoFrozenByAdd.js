(function(){
    var uid,token;
    var GotoFrozenByAdd = {
        addFrozenInfo: null,
        userBalance: null,              //用户总金额
        neddForzenInfo: null,           //需要冻结的金额
        messageWindow: null,            //提示弹窗
        //获取用户信息
        getUserInfo: function(){
            var userinfo = JSON.parse(localStorage.getItem("userinfo"));
            uid = userinfo.uid;
            token = userinfo.token;
        },
        //获取追加的冻结信息
        getAddFrozenInfo: function(){
            this.addFrozenInfo = JSON.parse(sessionStorage.getItem('addFrozenInfo'));
        },
        renderDataToPage: function(){
            if(!this.addFrozenInfo) {
                this.messageWindow.update('追加操作完成，请前往【体验活动列表查看】');
                this.messageWindow.show();
                return;
            }
            document.querySelector(".price").innerHTML = this.addFrozenInfo.price;
            document.querySelector(".number").innerHTML = this.addFrozenInfo.addnum;
            this.neddForzenInfo = this.addFrozenInfo.addnum * this.addFrozenInfo.price;
            document.querySelector(".shopmoney").innerHTML = (this.neddForzenInfo).toFixed(2);
            document.querySelector(".num").innerHTML = (this.neddForzenInfo).toFixed(2);
        },
        //查询用户余额
        searchUserBalance: function(){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Activitydelete/shopbalanceSear';
            var params = {token:token,uid:uid,timestamp:parseInt(new Date().getTime()/1000)};
            YouXin.getAsyncData(url, params, 'POST', me.searchUserBalanceCallBack, me);
        },
        searchUserBalanceCallBack: function(data){
            if(data.state != 1) return;
            var me = this;
            me.userBalance = data.balancelist[0].managerbalance;
            if(me.userBalance < me.neddForzenInfo) {
                $('.noMoneyPrompt').show();
            }
        },
        //注册事件
        registerEvent: function(){
            this.closeMaskShade();              //关闭遮罩
            this.toAccountRechargePage();       //前往充值页面
            this.toFrozenCaptial();             //点击冻结金额按钮
        },
        closeMaskShade: function(){
            //关闭遮罩
            $('.closeMask').on('click',function(){
                var maskClass = $(this).data('for');
                $('.' + maskClass).hide();
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
                if(me.userBalance < me.neddForzenInfo) {
                    //账户余额小余冻结金额
                    $('.noMoneyPrompt').show();
                } else {
                    //冻结金额
                    me.gotoFrozen();
                }
            });
        },
        //体验商品追加冻结金额请求
        gotoFrozen: function(){
            var me = this;
            if(!sessionStorage.getItem('addFrozenInfo')) {
                me.messageWindow.update('本次追加的体验商品，请返回首页查看!');
                me.messageWindow.show();
                return;
            }
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/addNumber';
            var params = {uid: uid,token:token,timestamp:parseInt(new Date().getTime()/1000),shopid:me.addFrozenInfo.shopid,number: me.addFrozenInfo.addnum};
            YouXin.getAsyncData(url, params, 'POST', me.gotoFrozenCallBack, me);
        },
        //冻结金额请求 - 回调
        gotoFrozenCallBack: function(data){
            var me = this;
            if(parseInt(data.state) == 6) {
                $('.supplyType').show();
                return;
            }
            if(data.state == 2) {
                $('.noMoneyPrompt').show();
                return;
            }
            if(data.state == 1) {
                sessionStorage.removeItem('addFrozenInfo');                             //移除本次操作
                window.location.href="frozenreleasesuccess.html";
                return;
            }
        },
        //创建弹窗提示
        createMessage: function(){
            this.messageWindow = new $.zui.Messager('测试', {
                close: false,
                time: 3000,
                type: 'warning',
                placement: 'center',
                cssClass: {'zIndex':99999}
            });
        },
        initPage: function(){
            this.getUserInfo();
            this.createMessage();
            this.getAddFrozenInfo();
            this.renderDataToPage();
            this.registerEvent();
            this.searchUserBalance();					//查询用户余额
        }
    };
    GotoFrozenByAdd.initPage();
})();