function SpecialActiveList(config) {
    YouXin.apply(this,config);
    this.initPage();
}
SpecialActiveList.prototype = {
    initPage: function () {}
}
new SpecialActiveList({
    uid: null,                                                  //用户id
    token: null,                                                //token
    type: 1,											        //选择的type类型
    messageWindow: null,                                        //弹窗提示对象
    loading: null,                                              //加载动画
    //获取用户信息
    getUserInfo: function(){
        var userinfo = JSON.parse(localStorage.getItem("userinfo"));
        this.uid = userinfo.uid;
        this.token = userinfo.token;
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
    //获取时间戳
    getTimeStamp: function(){
        return parseInt(new Date().getTime()/1000);
    },
    //初始化页面的相关元素
    initRelatedElement: function(){
        this.getUserInfo();
        this.createMessage();
    },
    //设置li点击事件
    setTypeClickEvent: function(){
        var me = this;
        $('.selectActiveTypeBlock .listItem').click(function(event){
            if($(this).hasClass('avtive')) return;
            $(this).siblings('.avtive').removeClass('avtive');
            $(this).addClass('avtive');
            me.type = $(this).data('type');
        });
    },
    //设置下一步点击事件
    setNextStepBtnClickEvent: function(){
        var me = this;
        $('.submitBlock .clickSpan').click(function(){
            console.info(me.type);
            window.location.href = 'SpecialActiveFill.html?Specialtype=' + me.type;
        });
    },
    //初始化页面相关事件
    initRegisterEvent: function(){
        this.setTypeClickEvent();                   //设置li点击事件
        this.setNextStepBtnClickEvent();            //设置下一步点击事件
    },
    initPage: function(){
        this.initRelatedElement();                  //初始化页面相关元素
        this.initRegisterEvent();                   //初始化页面相关事件
    }
});










