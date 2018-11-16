!function(){
    var uid,token;
    var AddBankCard = {
        activedType: 1,
        //获取用户信息
        getUserInfo: function(){
            var userinfo = JSON.parse(localStorage.getItem("userinfo"));
            uid = userinfo.uid;
            token = userinfo.token;
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
        //处理下拉列表事件
        registerDropMenu: function(){
            //注册下拉列表时间
            $('.dropdown-menu li a').click(function(event){
                var targetValue = this.innerHTML;
                var targetId = $(this).parent().data('id');
                var $targetInput = $(this).parent().parent().parent().find('input');
                $targetInput.val(targetValue);
                $targetInput.data('id',targetId);
            });
        },
        loadPageElement: function(){
            this.getUserInfo();                                     //获取用户信息
            this.createMessage();                                   //创建弹窗提示
        },
        //设置TabPanel
        setTabPanel: function(){
            var me = this;
            $('.accountPlatgorm input[name=accountPlatgorm]').change(function(){
                $('.contentBlockBody .contentPanel').hide();
                if($(this).val() == 1) {
                    $('.contentBlockBody .BankCard').show();        //银行卡
                    me.activedType = 1;
                }
                if($(this).val() == 2) {
                    $('.contentBlockBody .alipayPanel').show();     //支付宝
                    me.activedType = 2;
                }
                if($(this).val() == 3) {
                    $('.contentBlockBody .WXPanel').show();         //微信
                    me.activedType = 3;
                }
            });
        },
        //提交/取消按钮点击事件
        submitBtnClick: function(){
            var me = this;
            $('.addOperation .addSubmit').click(function(){
                if(me.activedType == 1) {
                    me.getParamsByBank();
                } else if(me.activedType == 2) {
                    me.getParamsByAplipay();
                } else if(me.activedType == 3) {
                    me.getParamsByWX();
                }
            });
            $('.addOperation .doCancel').click(function(){
                window.location.href = 'DrawDeposit.html';
            });
        },
        getParamsByBank: function(){
            var name = $('.bankAccount .addCardInfoInput').val();                       //账户名
            if(!name) {
                this.showMessage('请输入银行卡账户名!');
                return;
            }
            var code = $('.bankCard .bankCardInput').val();                             //银行卡号
            if(!code) {
                this.showMessage('请输入银行卡号!');
                return;
            }
            var bankname = $('.openAccountBank .openAccountBankInput').val();           //开户银行
            if(!bankname) {
                this.showMessage('请输入开户银行!');
                return;
            }
            var type = $('.openAccountBank .openAccountBankInput').data('id');
            var address = $('.openAccountBranch .openAccountBranchInput').val();                   //开户支行
            if(!address) {
                this.showMessage('请输入开户支行!');
                return;
            }
            var me = this;
            var params = {uid: uid,token: token,platform: 3,name: name,bankname:bankname,code: code,address:address,type:type};
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/addAccount';
            YouXin.getAsyncData(url, params, 'POST', me.getParamsByBankCallBack, me);
        },
        getParamsByBankCallBack: function(data){
            if(data.state != 1) return;
            window.location.href = 'DrawDeposit.html';
        },
        //支付宝参数
        getParamsByAplipay: function(){
            var code = $('.alipayPanel .alipayAcountInput').val();                       //支付宝账户
            if(!code) {
                this.showMessage('请输入支付宝账户!');
                return;
            }
            var name = $('.alipayPanel .alipayAcountNameInput').val();                  //支付宝认证姓名
            if(!name) {
                this.showMessage('请输入支付宝认证姓名!');
                return;
            }
            var me = this;
            var params = {uid: uid,token: token,platform: 1,name: name,bankname:'支付宝',code: code,address:'支付宝',type:1};
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/addAccount';
            YouXin.getAsyncData(url, params, 'POST', me.getParamsByBankCallBack, me);
        },
        //微信参数
        getParamsByWX: function(){
            var code = $('.WXPanel .WXAcountNameInput').val();                       //支付宝账户
            if(!code) {
                this.showMessage('请输入微信号!');
                return;
            }
            var me = this;
            var params = {uid: uid,token: token,platform: 2,name: code,bankname:'微信',code: code,address:'微信',type:2};
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/addAccount';
            YouXin.getAsyncData(url, params, 'POST', me.getParamsByBankCallBack, me);
        },
        setWXPrompt: function () {
            $('.WXPanel .yellowAlert').tooltip({
                html: 'true',
                title: '<img src="../img/finance/WXAccount.png">',
                //trigger: 'click',
                placement: 'right',
                tipClass: 'questionTooltip'
            });
        },
        //设置卡号控制
        controlCardInput: function(){
            /*console.info($('.bankCard .addCardInfoInput'),111);
            $('.bankCard .addCardInfoInput').keyup(function () {
                var reg = $(this).val().match(/\d+/);
                var txt = '';
                if (reg != null) {
                    txt = reg[0];
                }
                $(this).val(txt);
            });*/
        },
        registerPageEvents: function(){
            this.setTabPanel();                                     //设置选项卡
            this.submitBtnClick();                                  //提交/取消按钮点击事件
            this.registerDropMenu();                                //设置下拉列表
            this.controlCardInput();                                //设置卡号控制
            this.setWXPrompt();
        },
        initPage: function(){
            this.loadPageElement();                                 //获取用户信息
            this.registerPageEvents();                              //注册页面中的所有事件
        }
    };
    AddBankCard.initPage();
}();
