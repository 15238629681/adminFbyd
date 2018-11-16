!function(){
    var uid,token;
    var UpdateBankCard = {
        cardInfo: null,
        cardID: null,               //当前更新ID
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
        //提交/取消按钮点击事件
        submitBtnClick: function(){
            var me = this;
            $('.addOperation .addSubmit').click(function(){
                var activedType = $('.accountPlatgorm input[name=accountPlatgorm]:checked').val();
                console.info(activedType);
                if(!me.cardID) {
                    me.showMessage('无更新数据');
                    window.location.href = 'accountbalance.html';
                    return;
                }
                if(activedType == 1) {
                    me.getParamsByBank();
                } else if(activedType == 2) {
                    me.getParamsByAplipay();
                } else if(activedType == 3) {
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
            var params = {uid: uid,token: token,platform: 3,name: name,bankname:bankname,code: code,address:address,type:type,id:this.cardID};
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/addAccount';
            YouXin.getAsyncData(url, params, 'POST', me.getParamsByBankCallBack, me);
        },
        getParamsByBankCallBack: function(data){
            if(data.state == 2) {
                this.showMessage('操作不当!');
                window.location.href = 'DrawDeposit.html';
                return;
            }
            if(data.state == 3) {
                this.showMessage('该账户有未完成订单，暂时不允许修改!');
                window.location.href = 'DrawDeposit.html';
                return;
            }
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
            var params = {uid: uid,token: token,platform: 1,name: name,bankname:'支付宝',code: code,address:'支付宝',type:1,id:this.cardID};
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
            var params = {uid: uid,token: token,platform: 2,name: code,bankname:'微信',code: code,address:'微信',type:2,id:this.cardID};
            console.info()
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/addAccount';
            YouXin.getAsyncData(url, params, 'POST', me.getParamsByBankCallBack, me);
        },
        registerPageEvents: function(){
            this.registerDropMenu();                                //设置下拉列表
            this.submitBtnClick();                                  //提交按钮点击事件
        },
        //获取要更新卡片的信息
        getUpdateCardInfo: function(){
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/getOne';
            this.cardID = YouXin.getUrlParamsValue('cardID')
            var params = {token:token,uid:uid,id:this.cardID};
            YouXin.getAsyncData(url, params, 'POST', this.getUpdateCardInfoCallBack, this);
        },
        getUpdateCardInfoCallBack: function(data){
            if(data.state != 1) return;
            this.cardInfo = data.data;
            if(!this.cardInfo) return;
            if(parseInt(this.cardInfo.type) === 1) {
                //支付宝
                this.setActiveRelatePanel(2);
                $('.contentBlockBody .alipayPanel').show();     //支付宝
                this.setAplipayPanelValue();
            } else if(parseInt(this.cardInfo.type) === 2) {
                //微信
                this.setActiveRelatePanel(3);
                $('.contentBlockBody .WXPanel').show();         //微信
                this.setWXPanelValue();
            } else {
                //银行卡
                this.setActiveRelatePanel(1);
                $('.contentBlockBody .BankCard').show();        //银行卡
                this.setBankCardPanelValue();
            }
        },
        setActiveRelatePanel: function(value){
            $('.contentBlockBody .contentPanel').hide();
            $('.accountPlatgorm input[name=accountPlatgorm]').each(function(index,item){
                if(parseInt($(item).val()) == value) {
                    $(item).attr('checked','checked');
                    $(item).attr('disabled','disabled');
                } else {
                    $(item).attr('disabled','disabled');
                }
            });
        },
        //设置支付宝面板的值
        setAplipayPanelValue: function(){
            var code = this.cardInfo.code;
            $('.alipayPanel .alipayAcountInput').val(code);
            var name =this.cardInfo.name;
            $('.alipayPanel .alipayAcountNameInput').val(name);
        },
        //设置微信面板中的值
        setWXPanelValue: function(){
            var code = this.cardInfo.code;
            $('.WXPanel .WXAcountNameInput').val(code);
        },
        //设置银行卡面板中的值
        setBankCardPanelValue: function(){
            var name = this.cardInfo.name;
            $('.bankAccount .addCardInfoInput').val(name);                       //账户名
            var code = this.cardInfo.code;
            $('.bankCard .bankCardInput').val(code);                             //银行卡号
            var bankname = this.cardInfo.bankname;
            $('.openAccountBank .openAccountBankInput').val(bankname);           //开户银行
            var type = this.cardInfo.type;
            $('.openAccountBank .openAccountBankInput').data('id',type);
            var address = this.cardInfo.address;
            $('.openAccountBranch .openAccountBranchInput').val(address);
        },
        initPage: function(){
            this.loadPageElement();                                 //获取用户信息
            this.getUpdateCardInfo();                               //获取更新的银行卡信息
            this.registerPageEvents();                              //注册页面中的所有事件
        }
    };
    UpdateBankCard.initPage();
}();
