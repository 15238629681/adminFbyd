!function(){
    var uid, token;
    var SelfServiceCharge = {
        messageWindow: null,								//提示窗
        loading: null,										//加载中动画
        selectType: 0,                                      //选择的支付类型：0代表支付宝转账，1代表微信转账，2代表银行转账
        //获取用户相关信息
        getUserInfo: function(){
            var userinfo = JSON.parse(localStorage.getItem("userinfo"));
            uid = userinfo.uid;
            token = userinfo.token;
        },
        //创建提示信息窗口
        createMessage: function(){
            this.messageWindow = new $.zui.Messager('测试', {
                close: false,
                //time: 300000,
                time: 3000,
                type: 'warning',
                placement: 'center',
                //cssClass: {marginLeft:'75px','zIndex':99999,backgroundColor:'#FBBE05'}
                cssClass: 'testMessageCls'
            });
        },
        //创建加载中的动画对象
        createLoading: function(){
            this.loading = document.createElement('div');
            this.loading.style.cssText = 'width:70px;height:70px;display:none;position:absolute;top:50%;left:50%;text-align:center;margin-left: -35px;margin-top: -35px;z-index:9999;';
            this.loading.innerHTML = '<img src="../img/public/downrefesh.gif"><br/><br/>正在支付中...';
            this.loading.show = function(){
                this.style.display = 'block';
            };
            this.loading.hide = function(){
                this.style.display = 'none';
            };
            $('#part-right').append(this.loading);
        },
        //下拉事件
        registerDropMenu: function(){
            $('.dropdown-menu li a').click(function(event){
                var $dropMenu = $(this).parent().parent();
                $dropMenu.find('li').each(function (index,item) {
                    $(item).removeClass('active');
                });
                $(this).parent().addClass('active');
                var targetValue = this.innerHTML;
                var targetId = $(this).parent().data('id');
                var $targetInput = $dropMenu.parent().find('input');
                $targetInput.val(targetValue);
                $targetInput.data('id',targetId);
                $targetInput.change();
            });
        },
        //获取十位的时间戳
        getTimeStamp: function(){
            return parseInt(new Date().getTime()/1000);
        },
        //加载页面元素
        loadPageElement: function(){
            this.getUserInfo();                             //获取用户信息
            this.createMessage();							//创建提示弹窗
            this.createLoading();                           //创建加载中动画
        },
        //设置选项卡
        setTabPanel: function(){
            var me = this;
            $('.tabPanelTitle li').click(function(){
                if($(this).hasClass('spaceFillCell')) return;
                var index = $(this).index();
                me.selectType = index;
                $(this).addClass("titleActive").siblings().removeClass("titleActive");
                $('.tabPanelBody li').eq(index).show().siblings().hide();
            });
        },
        //控制Input输入框输入
        setApplyInputsEvent: function(){
            //输入 -> 充值金额
            $('.tabPanelBody .rechargeAmount input').keyup(function () {
                var reg = $(this).val().match(/\d+\.?\d{0,2}/);
                var txt = '';
                if (reg != null) {
                    txt = reg[0];
                }
                $(this).val(txt);
            });
            //输入框的值改变之后
            $('.tabPanelBody .rechargeAmount input').change(function(){
                if(!this.value) {
                    $(this).parent().parent().find('.moneyError1').show();
                } else {
                    $(this).parent().parent().find('.moneyError1').hide();
                }
            });
            //输入 -> 订单号：
            $('.tabPanelBody .orderNumber .orderNumberInput').keyup(function () {
                var reg = $(this).val().match(/\d+/);
                var txt = '';
                if (reg != null) {
                    txt = reg[0];
                }
                $(this).val(txt);
            });
            //订单号输入框的值改变之后
            $('.tabPanelBody .orderNumber .orderNumberInput').change(function(){
                if(!this.value) {
                    $(this).parent().parent().find('.orderError2').show();
                    $(this).parent().parent().find('.orderError1').hide();
                    return;
                }
                /* else if(this.value.length != 32) {
                    $(this).parent().parent().find('.orderError1').show();
                    $(this).parent().parent().find('.orderError2').hide();
                    return;
                }*/
                $(this).parent().parent().find('.orderError1').hide();
                $(this).parent().parent().find('.orderError2').hide();
            });
        },
        //确认提交
        affirmSubmit: function(){
            var me = this;
            $('.nextBar .nextButton').click(function(){
                switch (parseInt(me.selectType)) {
                    case 1:
                        //微信转账
                        me.doWXApplyTransfer();
                        break;
                    case 2:
                        //银行卡转账
                        me.doBlankTransfer();
                        break;
                    default:
                        //支付宝转账
                        me.doApplyTransfer();
                }
            });
        },
        //支付宝转账
        doApplyTransfer: function(){
            var flag = this.verifyApplyTransfer();                  //验证表单
            if(!flag) return;
            var me = this;
            var money = $('.applyTransfer .rechargeAmount input').val();
            var thirdordernumber = $('.applyTransfer .orderNumber .orderNumberInput').val();
            var params = {token:token,timestamp:me.getTimeStamp(),uid:uid,dealtype:3,money:money,thirdordernumber:thirdordernumber};
            this.doSubmitTransferAccount(params);
        },
        //微信转账
        doWXApplyTransfer: function(){
            var flag = this.verifyWXTransfer();                     //验证表单
            if(!flag) return;
            var me = this;
            var money = $('.WXTransfer .rechargeAmount input').val();
            var thirdordernumber = $('.WXTransfer .orderNumber .orderNumberInput').val();
            var params = {token:token,timestamp:me.getTimeStamp(),uid:uid,dealtype:4,money:money,thirdordernumber:thirdordernumber};
            this.doSubmitTransferAccount(params);
        },
        //银行卡转账
        doBlankTransfer: function(){
            var flag = this.verifyBankTransfer();                  //验证表单
            if(!flag) return;
            var me = this;
            var money = $('.bankTransfer .rechargeAmount input').val();
            var payname = $('.bankTransfer .bankAccountName input').val();
            var payaccount = $('.bankTransfer .bankAccount input').val();
            var backnames = $('.bankTransfer .bankAccountType .backnames').val();
            var params = {token:token,timestamp:me.getTimeStamp(),uid:uid,dealtype:5,money:money,payname:payname,payaccount:payaccount,backnames:backnames};
            this.doSubmitTransferAccount(params);
        },
        doSubmitTransferAccount: function(params){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Accountbalance/BalanceInfo';
            YouXin.getAsyncData(url, params, 'POST', me.doSubmitTransferAccountCallBack, me);
        },
        doSubmitTransferAccountCallBack: function(data){
            if(data.state != 1) return;
            this.messageWindow.update('本次转账信息提交成功!');
            this.messageWindow.show();
            $($('.tabPanelBody li').get(this.selectType)).find('input').val('');
            setTimeout(function(){
                window.location.href = 'accountbalance.html';
            },1500);
        },
        verifyApplyTransfer: function(){
            //验证充值金额
            var chargeAmount = $('.applyTransfer .rechargeAmount input').val();
            if(!chargeAmount) {
                $('.applyTransfer .rechargeAmount .moneyError1').show();
                $('.applyTransfer .rechargeAmount .moneyError2').hide();
                return false;
            }
            if(chargeAmount.indexOf('-')>=0 || chargeAmount.indexOf('e')>=0 || chargeAmount.indexOf('E')>=0) {
                $('.applyTransfer .rechargeAmount .moneyError1').hide();
                $('.applyTransfer .rechargeAmount .moneyError2').show();
                return false;
            }
            //验证表单
            var orderNum = $('.applyTransfer .orderNumber .orderNumberInput').val();
            if(!orderNum) {
                $('.applyTransfer .orderNumber .orderError1').hide();
                $('.applyTransfer .orderNumber .orderError2').show();
                return false;
            }
            /*if(orderNum.length != 32) {
                $('.applyTransfer .orderNumber .orderError1').show();
                $('.applyTransfer .orderNumber .orderError2').hide();
                return false;
            }*/
            return true;
        },
        verifyWXTransfer: function(){
            //验证微信充值金额
            var chargeAmount = $('.WXTransfer .rechargeAmount input').val();
            if(!chargeAmount) {
                $('.WXTransfer .rechargeAmount .moneyError1').show();
                $('.WXTransfer .rechargeAmount .moneyError2').hide();
                return false;
            }
            if(chargeAmount.indexOf('-')>=0 || chargeAmount.indexOf('e')>=0 || chargeAmount.indexOf('E')>=0) {
                $('.WXTransfer .rechargeAmount .moneyError1').hide();
                $('.WXTransfer .rechargeAmount .moneyError2').show();
                return false;
            }
            //验证微信订单号
            var orderNum = $('.WXTransfer .orderNumber .orderNumberInput').val();
            if(!orderNum) {
                $('.WXTransfer .orderNumber .orderError1').hide();
                $('.WXTransfer .orderNumber .orderError2').show();
                return false;
            }
            /*if(orderNum.length != 32) {
                $('.WXTransfer .orderNumber .orderError1').show();
                $('.WXTransfer .orderNumber .orderError2').hide();
                return false;
            }*/
            return true;
        },
        verifyBankTransfer: function(){
            var chargeAmount = $('.bankTransfer .rechargeAmount input').val();
            if(!chargeAmount) {
                $('.bankTransfer .rechargeAmount .moneyError1').show();
                $('.bankTransfer .rechargeAmount .moneyError2').hide();
                return false;
            }
            var bankAccountName = $('.bankTransfer .bankAccountName input').val();
            if(!bankAccountName) {
                $('.bankTransfer .bankAccountName .error1').show();
                return false;
            }
            var bankAccount = $('.bankTransfer .bankAccount input').val();
            if(!bankAccount) {
                $('.bankTransfer .bankAccount .error2').show();
                return false;
            }
            if(!YouXin.checkNumber(bankAccount)) {
                $('.bankTransfer .bankAccount .error1').show();
                return false;
            }
            return true;
        },
        //设置问号图片的相关提示
        setQuestionAlert: function(){
            var me = this;
            $('.applyTransfer .yellowAlert').tooltip({
                html: 'true',
                title: '<img src="../img/finance/zfbexampleimg.png">',
                //trigger: 'click',
                placement: 'right',
                tipClass: 'questionTooltip'
            });
            $('.WXTransfer .yellowAlert').tooltip({
                html: 'true',
                title: '<img src="../img/finance/weichartexampleimg.png">',
                //trigger: 'click',
                placement: 'right',
                tipClass: 'questionTooltip'
            });
        },
        registerPageEvents: function(){
            this.registerDropMenu();						//下拉事件
            this.setTabPanel();								//设置选项卡
            this.setApplyInputsEvent();                     //设置输入框
            this.setQuestionAlert();                        //设置相关提示
            this.affirmSubmit();                            //确认提交
        },
        initPage: function(){
            this.loadPageElement();                         //加载页面需要元素
            this.registerPageEvents();                      //注册页面中的所有事件
        }
    };
    SelfServiceCharge.initPage();
}();

