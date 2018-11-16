!function(){
    var personalaccountrecharge = {
        selectApplyMethod: null,                                //选择转账的方式
        //设置选择的支付方式
        setSelectApplyMethod: function(){
            var me = this;
            $('.systemImg').click(function(event){
                me.selectApplyMethod = 1;
                $(this).attr({"src":"../img/finance/system2.png"});
                $('.personalImg').attr({"src":"../img/finance/personal1.png"});
            });
            $('.personalImg').click(function(event){
                me.selectApplyMethod = 2;
                $(this).attr({"src":"../img/finance/personal2.png"});
                $('.systemImg').attr({"src":"../img/finance/system1.png"});
            });
        },
        //跳转到指令的页面
        toSkipAssignPage: function(){
            var me = this;
            $('.sureBtnChoosePayWay').click(function(){
                if(!me.selectApplyMethod) {
                    me.messageWindow.update('请选择转账方式！');
                    me.messageWindow.show();
                    return;
                }
                if(me.selectApplyMethod == 1) {
                    window.location.href = "systemrecharge.html";
                    return;
                }
                if(me.selectApplyMethod == 2) {
                    window.location.href = "SelfServiceCharge.html";
                    return;
                }
            });
        },
        //创建提示弹窗
        createMessage: function(){
            this.messageWindow = new $.zui.Messager('测试', {
                close: false,
                time: 3000,
                type: 'warning',
                placement: 'center'
            });
        },
        registerPageEvent: function(){
            this.setSelectApplyMethod();                        //设置选择的支付方式
            this.toSkipAssignPage();                            //跳转到指令的页面
        },
        initPage: function(){
            this.createMessage();
            this.registerPageEvent()
        }
    };
    personalaccountrecharge.initPage();
}()