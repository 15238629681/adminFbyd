(function(){
    var uid, token;
    var systemrecharge = {
        messageWindow: null,								//提示窗
        lastMoney: null,                                    //最后到账
        needApplyForMoney: 0,								//需要支付的金额
        loading: null,										//加载中动画
		isApplyFor: false,
        selectType: 0,                                      //0表示支付宝，1表示微信转账
        //获取用户信息
        getUserInfo: function(){
            var userinfo = JSON.parse(localStorage.getItem("userinfo"));
            uid = userinfo.uid;
            token = userinfo.token;
        },
        createMessage: function(){
            this.messageWindow = new $.zui.Messager('测试', {
                close: false,
                time: 3000,
                type: 'warning',
                placement: 'center',
                cssClass: {'zIndex':99999,backgroundColor:'#FBBE05'}
            });
        },
    	//设置选项卡
        setTabPanel: function(){
            var me = this;
            $('.tabPanelTitle li').click(function(){
            	if($(this).hasClass('spaceFillCell')) return;
                var index = $(this).index();
                me.selectType = index;                      //设置选择的类型
                $(this).addClass("titleActive").siblings().removeClass("titleActive");
                $('.tabPanelBody li').eq(index).show().siblings().hide();
            });
		},
		//输入金额框
        chargeMoneyInputEvent: function(){
        	var me = this
        	$('.inputWapper .payNumInput').change(function(){
                var userEnter;
        		if($(this).val()) {
                    userEnter = parseFloat($(this).val());
				} else {
                    userEnter = 0.00;
				}
        		var proceduce = userEnter * 0.0055 + userEnter * 0.0055 * 0.0055;
        		$('.inputWapper .serviceCharge span').html((Math.ceil(proceduce * 100)) / 100);
                me.needApplyForMoney = Math.ceil((userEnter + proceduce) * 100)/100;
                me.lastMoney = userEnter;
        		$('.tabPanelBody .actualApplyFor span').html(me.needApplyForMoney);
        		$('.transferPrompt .inputValue').html(me.lastMoney);
			});
		},
		//执行下一步骤
        doNextStep: function(){
        	var me = this;
        	$('.nextBar .nextButton').click(function(){
        	    if(me.selectType == 1) {
                    me.messageWindow.update('微信系统转账功能暂未开放,请选择自助转账!');
                    me.messageWindow.show();
                    return;
                }
        		if(me.isApplyFor) {
                    me.messageWindow.update('您当前处于正在支付状态!');
                    me.messageWindow.show();
                    return;
				}
        		if(me.needApplyForMoney == 0) {
        			me.messageWindow.update('请录入转账金额!');
                    me.messageWindow.show();
                    $('.inputWapper .payNumInput').val('');
                    $('.inputWapper .payNumInput').focus();
        			return;
				}
                me.loading.show();
        		me.toApplyTransByZFB();
        		me.monitorApplyStatus();
        		me.isApplyFor = true;
			});
		},
        //支付
        toApplyTransByZFB: function(){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Bannersearch/detailed';
            var params = {token:token,uid:uid,ordertype:0,money:me.needApplyForMoney};
            //var params = {token:token,uid:uid,ordertype:0,money:0.01};
            window.open('https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/code?token=' + params.token +'&uid=' + params.uid + '&ordertype=' + params.ordertype + '&money=' + params.money);
        },
        getTimeStamp: function(){
            return parseInt(new Date().getTime()/1000);
        },
        //支付情况回调
        toApplyTransByZFBCallBack: function(data){},
        getStatusTimer: null,                       //支付状态监听时间器
        //监听支付情况
        monitorApplyStatus: function(time){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Nativenotify/getStatus';
            if(!time) time = "";
            var params = {token:token,uid:uid,time:time};
            setTimeout(function() {
                YouXin.getAsyncData(url,params,'POST',me.getStatusCallBack,me);
            },1000);
        },
        getStatusCallBack: function(data){
            var me = this;
            if(parseInt(data.state) === 0) {
                me.monitorApplyStatus(data.data);
            }
            if(parseInt(data.state) === 1) {
                $('.contentBlock').hide();
                me.loading.hide();
                me.isApplyFor = false;
                $('.successPrompt2 span').html(me.lastMoney);
                $('.applyForSuccess').show();
                return;
            }
        },
        createRequestLoading: function(){
            this.loading = document.createElement('div');
            this.loading.style.cssText = 'width:70px;height:70px;display:none;position:absolute;top:50%;left:50%;text-align:center;margin-left: -35px;margin-top: -35px;z-index:9999;';
            this.loading.innerHTML = '<img src="../img/public/downrefesh.gif"><br/><br/>正在支付中...';
            this.loading.show = function(){
                this.style.display = 'block';
            }
            this.loading.hide = function(){
                this.style.display = 'none';
            }
            $('#part-right').append(this.loading);
        },
        controlMoneyInput: function(){
            console.info($('.noBottomLine .floatRight .payNumInput'));
            $('.noBottomLine .floatRight .payNumInput').keyup(function () {
                var reg = $(this).val().match(/\d+\.?\d{0,2}/);
                var txt = '';
                if (reg != null) {
                    txt = reg[0];
                }
                $(this).val(txt);
            });
        },
		//注册事件
        registerPageEvent: function(){
        	this.chargeMoneyInputEvent();					//充值input框事件
			this.doNextStep();                              //进行下一步支付
            this.controlMoneyInput();
		},
        initPage: function(){
            this.getUserInfo();
        	this.createMessage();							//创建提示弹窗
        	this.setTabPanel();								//设置选项卡
			this.createRequestLoading();					//设置加载中动画效果
			this.registerPageEvent();
		}
    };
    systemrecharge.initPage();
})();
