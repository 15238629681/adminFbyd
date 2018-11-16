!function(){
    var uid,token;
    var DrawDeposit = {
        selectCard: null,
        //获取用户信息
        getUserInfo: function(){
            var userinfo = JSON.parse(localStorage.getItem("userinfo"));
            uid = userinfo.uid;
            token = userinfo.token;
        },
        //初始化页面相关的事件
        initRelatedElement: function(){
            this.getUserInfo();
            this.createMessage();
        },
        //获取时间戳
        getTimeStamp: function(){
            return parseInt(new Date().getTime()/1000);
        },
        //创建弹窗提示
        createMessage: function(){
            this.messageWindow = new $.zui.Messager('测试', {
                close: false,
                time: 3000,
                type: 'warning',
                placement: 'center'
            });
        },
        //显示对应的提示信息
        showMessage: function(message){
            this.messageWindow.update(message);
            this.messageWindow.show();
        },
        //设置图形验证码
        setVerifyCode: function(){
            $.idcode.setCode();
        },
        //银行卡选中事件
        bankCardClickEvent: function(){
            var me = this;
            var index = 1;
            var TimeFn = null;
            $('.rowBankCard .cardList .bankCard').click(function(){
                var that = this;
                clearTimeout(TimeFn);
                TimeFn = setTimeout(function(){
                    if(index > 0) {
                        me.showMessage('双击可对提现账户进行修改!');
                        index--;
                    }
                    $('.rowBankCard .cardList .bankCard').each(function(index,item){
                        $(item).removeClass('activeCard');
                        $(item).removeClass('doubleSelect');
                    });
                    $(that).addClass('activeCard');
                    me.selectCard = $(that).data('carddata');
                },300);
            });
            $('.rowBankCard .cardList .bankCard').dblclick(function(){
                clearTimeout(TimeFn);
                index--;
                $('.rowBankCard .cardList .bankCard').each(function(index,item) {
                    $(item).removeClass('activeCard');
                    $(item).removeClass('doubleSelect');
                });
                $(this).addClass('activeCard');
                $(this).addClass('doubleSelect');
                me.selectCard = $(this).data('carddata');
            });
            //更新卡片
            $('.rowBankCard .bankCard .editCard').click(function(){
                me.editCardEvent();
            });
            //删除卡片
            $('.rowBankCard .bankCard .deleteCard').click(function(){
                me.deleteCard();
            });
        },
        //更新卡片
        editCardEvent: function(){
            window.location.href = 'UpdateBankCard.html?cardID='+this.selectCard.id;
        },
        deleteCard: function(){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/delAccount';
            var params = {id: this.selectCard.id,token:token,uid:uid};
            YouXin.getAsyncData(url, params, 'POST', me.deleteCardCallBack, me);
        },
        deleteCardCallBack: function(data){
            if(data.state != 1) return;
            this.showMessage('删除成功');
            this.getUserRelativeInfo();
        },
        //添加银行卡点击事件
        addBandCard: function(){
            $('.rowBankCard .addCashCard').click(function(){
                window.location.href = 'AddBankCard.html';
            });
        },
        //更改手机号点击事件
        changePhoneNumber: function(){
            $('.bindingPhobeNum .changePhoneNum').click(function(){
                console.info("更改手机号");
            });
        },
        //获取短信验证码
        getSMSVerifyCode: function(){
            var me = this;
            $('.SMSVerify .getSMSCode').click(function(){
                me.getSMSVerifyCodeClick();
            });
        },
        getSMSFlag: false,                                                          //是否发送过
        getSMSTimer: null,                                                          //获取短信的定时器
        //获取短信验证码请求
        getSMSVerifyCodeClick: function(){
            var me = this;
            if(me.getSMSFlag) {
                me.showMessage('验证码已发送，请查收！');
                return;
            }
            me.getSMSFlag = true;
            var lastTime = 60;
            me.getSMSTimer = setInterval(function(){
                lastTime--;
                $(".SMSVerify .rowlineRight .getSMSCode").html("重新获取" + lastTime + "s");
                if(lastTime <= 0) {
                    $(".SMSVerify .rowlineRight .getSMSCode").html("获取短信验证码");
                    clearInterval(me.getSMSTimer);
                    me.getSMSFlag = false;
                }
            },1000);
            var userphone = $('.bindingPhobeNum .rowlineRight .phoneNum').val();
            console.info(userphone);
            var url = 'https://app.fanbaoyundian.com/h5api/verifycode.app.php';
            var params = {phonenumber: userphone,action: "login"};
            YouXin.getAsyncData(url, params, 'POST', me.getSMSVerifyCodeRequestCallBack, me);
        },
        getSMSVerifyCodeRequestCallBack: function(data){
            var me = this;
            if(parseInt(data.state) == 0) {
                $(".SMSVerify .rowlineRight .getSMSCode").html("获取短信验证码");
                clearInterval(me.getSMSTimer);
                me.showMessage('手机号码有误!');
                me.getSMSFlag = false;
            }
        },
        //确认提现
        affirmDeposit: function(){
            var me = this;
            $('.opration .affirmDeposit').click(function(){
                me.doAffirmDepositOpation();
            });
        },
        //获取提现接口参数
        getAffirmOptionParams: function(){
            var money = $('.balance input[name=balance]').val();                    //提现金额
            var imageVerify = $('.verifyCode input[name=imageVerify]').val();       //图形验证码
            var phoneNum = $('.bindingPhobeNum .rowlineRight .phoneNum').val();     //绑定手机号
            var SMSVerify = $('.SMSVerify input[name=SMSVerify]').val();            //短信验证码
            var params = {uid:uid,token:token,money:money,imageVerify:imageVerify,phoneNum:phoneNum,SMSVerify:SMSVerify};
            return params;
        },
        //执行提现操作
        doAffirmDepositOpation: function(){
            var me = this;
            if(!this.selectCard) {
                this.showMessage('请选择提现账户!');
                return;
            }
            var params = this.getAffirmOptionParams();
            if(!params.money) {
                this.showMessage('请输入提现金额!');
                return;
            }
            var balance = $('.allowbalance .rowlineRight span').html();
            if(parseFloat(params.money) > parseFloat(balance)) {
                this.showMessage('提现金额超支!');
                return;
            }
            if(!params.imageVerify) {
                this.showMessage('请输入图形验证码!');
                return;
            }
            if(!$.idcode.validateCode()) {
                this.showMessage('验证码不正确，请重新录入!');
                return;
            }
            if(!params.SMSVerify) {
                this.showMessage('请输入短信验证码!');
                return;
            }
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/tphone';
            var params = {token:token,timestamp:this.getTimeStamp(),uid:uid,phone:params.phoneNum,code:params.SMSVerify};
            YouXin.getAsyncData(url, params, 'POST', me.doAffirmDepositOpationCallBack, me);
        },
        //获取提现相关参数
        getDoSubmitParams: function(){
            var money = $('.balance input[name=balance]').val();                    //提现金额
            var dealtype = 1;
            var payaccount = this.selectCard.code;
            if(this.selectCard.platform == 1) {
                //=2：支付宝
                dealtype = 3;
            } else if(this.selectCard.platform == 2) {
                //=2：微信
                dealtype = 4;
            } else {
                // =3：银行
                dealtype = 5;
            }
            var params = {uid:uid,token:token,money:money,dealtype:dealtype,payaccount: payaccount,payname:this.selectCard.name};
            return params;
        },
        doAffirmDepositOpationCallBack: function(data){
            if(data.state == 4) {
                this.showMessage(data.message);
                return;
            }
            if(data.state != 1) return;
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/toWithdrawals';
            var params = this.getDoSubmitParams();
            YouXin.getAsyncData(url, params, 'POST', me.doSubmitInfoSuccess, me);
        },
        //提交提现信息成功
        doSubmitInfoSuccess: function(data){
            if(data.state == 2) {
                this.showMessage('提现金额超支!');
                return;
            }
            if(data.state != 1) return;
            this.showMessage('提现申请提交成功!');
            $('.balance input[name=balance]').val('');                  //提现金额
            $('.verifyCode input[name=imageVerify]').val('');           //图形验证码
            $('.SMSVerify input[name=SMSVerify]').val('');              //短信验证码
            this.setVerifyCode();
            setTimeout(function(){
                window.location.href = 'ExtractCashDetail.html';
            },1500);
        },
        //取消提现
        cancelDeposit: function(){
            $('.opration .cancelDeposit').click(function(){
                window.location.href = 'accountbalance.html';
            });
        },
        //获取当前登录用户的相关数据
        getUserRelativeInfo: function(){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/getAccountList';
            var params = {uid:uid,token:token};
            YouXin.getAsyncData(url, params, 'POST', me.getUserRelativeInfoCallBack, me);
        },
        //获取用户数据
        getUserRelativeInfoCallBack: function(data){
            if(data.state != 1) return;
            this.setUserCard(data.data);
            this.setUserBlanceAndPhone(data.manager.money, data.manager.tel);
            this.bankCardClickEvent();                                      //设置卡片的相关事件
        },
        //设置相关数据
        setUserCard: function(list){
            var me = this;
            $('.rowBankCard .cardList').empty();
            for(var i=0; i<list.length; i++) {
                console.info(list[i]);
                var cardTemp = me.getCardTemplate();
                if(list[i].platform == 2) {
                    list[i].code = "";
                }
                var result = YouXin.template(cardTemp,list[i]);
                var $card = $(result);
                $card.data('carddata',list[i]);
                $('.rowBankCard .cardList').append($card);
            }
        },
        //设置用户余额和手机号
        setUserBlanceAndPhone: function(blance,phone){
            $('.allowbalance .rowlineRight span').html(blance);         //设置用户余额
            $('.bindingPhobeNum .rowlineRight .phoneNum').val(phone);   //设置手机号
        },
        //获取卡片模板
        getCardTemplate: function(){
            var temp = '<div class="bankCard">' +
                    '<div class="bankCardType">' +
                        /*'<span class="bankTypeImage"><img src="../img/finance/drawdeposit/bank{type}.png"></span>' +
                        '<span class="bankTypeName">{bankname}</span>' +*/
                        '<img class="bankLogo" src="../img/finance/drawdeposit/bank{type}.png">' +
                        '<img class="editCard" title="更新" src="../img/finance/drawdeposit/editCard.png">' +
                        '<img class="deleteCard" title="删除" src="../img/finance/drawdeposit/deleteCard.png">' +
                    '</div>' +
                    '<div class="bankCardNumber">{code}</div>' +
                    '<div class="bankCardAccount">{name}</div>' +
                '</div>';
            return temp;
        },
        controlMoneyInput: function(){
            $('.balance input[name="balance"]').keyup(function () {
                var reg = $(this).val().match(/\d+\.?\d{0,2}/);
                var txt = '';
                if (reg != null) {
                    txt = reg[0];
                }
                $(this).val(txt);
            });
        },
        //默认操作
        doDefault: function(){
            var $cardList = $('.rowBankCard .cardList .bankCard');
            if($cardList.length >0 ) $($cardList.get(0)).click();       //默认选中第一个银行卡
        },
        //注册相关事件
        registerEvent: function(){
            this.addBandCard();                                         //添加银行卡点击事件
            this.changePhoneNumber();                                   //更改手机号
            this.getSMSVerifyCode();                                    //获取短信验证码
            this.affirmDeposit();                                       //确认提现
            this.cancelDeposit();                                       //取消提现
            this.controlMoneyInput();
            this.doDefault();
        },
        initPage: function(){
            this.initRelatedElement();                                  //初始化页面相关的事件
            this.getUserRelativeInfo();                                 //获取用户的相关银行卡信息等
            this.setVerifyCode();                                       //设置图形验证码
            this.registerEvent();                                       //注册事件
        }
    };
    DrawDeposit.initPage();
}();








