function FillEnterInfo(config){
	YouXin.apply(this,config);
	this.initPage();
}
FillEnterInfo.prototype = {
    initPage: function(){}
}
new FillEnterInfo({
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
    //创建请求加载动画
    createRequestLoading: function(){
        this.loading = document.createElement('div');
        this.loading.style.cssText = 'width:70px;height:70px;display:none;position:absolute;top:50%;left:50%;text-align:center;margin-left: -35px;margin-top: -35px;z-index:9999;';
        //this.loading.innerHTML = '<i class="icon icon-spin icon-spinner-indicator icon-5x" style="color:#777777;"></i><br/><br/>正在加载中...';
        this.loading.innerHTML = '<img src="../img/public/downrefesh.gif"><br/><br/>正在加载中...';
        this.loading.show = function(){
            this.style.display = 'block';
        }
        this.loading.hide = function(){
            this.style.display = 'none';
        }
        $('#part-right').append(this.loading);
    },
    getTimeStamp: function(){
        return parseInt(new Date().getTime()/1000);
    },
    //初始化页面的相关元素
    initRelatedElement: function(){
        this.getUserInfo();
        this.createMessage();
        this.createRequestLoading();
    },
    //设置下拉菜单
    registerDropMenu: function(){
        //下拉菜单事件
        var me = this;
        $(".dropdown-menu li a").on('click', function() {
            var value = $(this).data('value');
            $(this).parent().parent().parent().find('input').val("" + $(this).html());
            $(this).parent().parent().parent().find('input').data('value',value);
            $(this).parent().parent().parent().find('input').trigger('change');
        });
    },
    //注册上传图片事件
    doUploadPicture: function(){
        $('.clickUpload').click(function(){
            $(this).parent().find('input[type="file"]').click();
        });
        //个人入驻 - 供应商资质信息
        $('.personEnterPanel .supplierInfo .inputBlock input[type="file"]').change(function(){
            if(this.files && this.files[0]) {
                //表示input已经上传图片了
                var img = $(this).parent().find('.addUploadImage')[0];
                var reader = new FileReader();
                reader.onload = function(evt) {
                    img.src = evt.target.result;
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        //个人入驻 - 供应商商标信息
        $('.personEnterPanel .brandMarkInfo .inputBlock input[type="file"]').change(function(){
            if(this.files && this.files[0]) {
                //表示input已经上传图片了
                var img = $(this).parent().find('.addUploadImage')[0];
                var reader = new FileReader();
                reader.onload = function(evt) {
                    img.src = evt.target.result;
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        //企业入驻 - 供应商资质信息
        $('.companyEnterPanel .companyQualificat .inputBlock input[type="file"]').change(function(){
            if(this.files && this.files[0]) {
                //表示input已经上传图片了
                var img = $(this).parent().find('.addUploadImage')[0];
                var reader = new FileReader();
                reader.onload = function(evt) {
                    img.src = evt.target.result;
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        //企业入驻 - 供应商商标信息
        $('.companyEnterPanel .companyBrandMarkInfo .inputBlock input[type="file"]').change(function(){
            if(this.files && this.files[0]) {
                //表示input已经上传图片了
                var img = $(this).parent().find('.addUploadImage')[0];
                var reader = new FileReader();
                reader.onload = function(evt) {
                    img.src = evt.target.result;
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    },
    //初始化时间选择器
    initDatetimepicker: function(){
        $('.form-datetime').datetimepicker({
            language:  "zh-CN",
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0,
            format: "yyyy-mm-dd"
        });
    },
    //设置入驻类型
    setSelectEnterType: function(){
    	var me = this;
    	$('.selectEnterType div').click(function(){
            $('.selectEnterType div').each(function (index,item) {
				$(item).removeClass('active');
            });
            $(this).addClass('active');
            if($(this).data('type') == 1) {
                $('.companyEnterPanel').hide();
            	$('.personEnterPanel').show();
                me.type = 1;
                document.title = '(个人入驻)填写注册信息---杭州牛啦网络科技有限公司';
			} else {
                $('.companyEnterPanel').show();
                $('.personEnterPanel').hide();
                me.type = 2;
                document.title = '(企业入驻)填写注册信息---杭州牛啦网络科技有限公司';
			}
		});
	},
	//个人入驻 - 第三方平台控制增删模块显示与隐藏
    selectThirdPlatform1: function(){
    	$('.personEnterPanel .enterBaseInfo .thirdPlaygroundWapperChoose input[name="isothershop"]').change(function(){
			if(parseInt($(this).val()) == 1) {
                $('.personEnterPanel .enterBaseInfo .thirdPlaygroundWapper').show();
			} else {
                $('.personEnterPanel .enterBaseInfo .thirdPlaygroundWapper').hide();
			}
		});
	},
    //个人入驻 - 选择商标信息：自由品牌/代理品牌
    selectBrandMarkInfo1: function(){
    	$('.personEnterPanel .brandMarkInfo .selectBrandType input[name="selfbrand"]').change(function(){
            var currentBrand = $(this).parent().parent().parent();
    		if(parseInt($(this).val()) == 1) {
    			//自有品牌
                currentBrand.find('.ownBrandPanel').show();
                currentBrand.find('.agencyBrandPanel').hide();
			} else {
                //代理品牌
                currentBrand.find('.ownBrandPanel').hide();
                currentBrand.find('.agencyBrandPanel').show();
			}
		});
	},
    //个人入驻 - 删除第三方店铺
    deleteThridShopClick1: function(){
        $('.personEnterPanel .thirdPlayElement .deletShopLink').click(function(){
            var $brforeThridElements = $('.personEnterPanel .thirdPlayElement');
            var removeThirdElement = $(this).parent();
            removeThirdElement.remove();                                        //移除当前节点
            var $afterThridElements = $('.personEnterPanel .thirdPlayElement');
            if($afterThridElements.length == 1) {
                $afterThridElements.find('.deletShopLink').hide();
                $afterThridElements.find('.addShopLink').show();
                return;
            }
            $($afterThridElements.get($afterThridElements.length - 1)).find('.deletShopLink').show();
            $($afterThridElements.get($afterThridElements.length - 1)).find('.addShopLink').show();
        });
    },
    //个人入驻 - 添加第三方店铺
    addThridShopClick1: function(){
        $('.personEnterPanel .thirdPlayElement .addShopLink').click(function(){
            var $brforeThridElements = $('.personEnterPanel .thirdPlayElement');
            $($brforeThridElements.get(0)).clone(true).insertAfter($(this).parent());
            var $afterThridElements = $('.personEnterPanel .thirdPlayElement');
            $afterThridElements.each(function(index,item){
                if($afterThridElements.length-1 == index) {
                    //最后一个：添加显示，删除显示
                    $(item).find('.deletShopLink').show();
                    $(item).find('.addShopLink').show();
                    $(item).find('input').val('');
                    $(item).find('input[name="ids"]').data('value','');
                    return;
                }
                $(item).find('.deletShopLink').show();
                $(item).find('.addShopLink').hide();
            });
        });
    },
    //个人入驻 - 添加商标信息
    addCrandMarkClick1: function(){
        var me = this;
        $('.personEnterPanel .brandMarkInfo .addBrandCard span').click(function(){
            var $cloneDom = $($(this).parent().parent().find('.brandMarkInfoElement').get(0)).clone();
            $cloneDom.insertBefore($(this).parent().get(0));
            var $elementList = $('.brandMarkInfo .brandMarkInfoElement');
            var $lasrCloneDom = $($elementList.get($elementList.length -1));             //获取真正的复制jqeury对象
            //重置上传了的图片
            $lasrCloneDom.find('.inputBlock .addUploadImage').attr('src','../img/reg/addimg_03.png');
            //重置文件上传表单元素
            $lasrCloneDom.find('.inputBlock input[type="file"]').each(function(index, item){
                if(item.files && item.files[0]) {
                    item.files[0] = null;
                }
            });
            //重置input的值
            $lasrCloneDom.find('input').each(function(index,item){
                if($(item).attr('type') == 'radio') {
                    return;
                } else {
                    $(item).val('');
                }
            });
            //重置时间选择器
            $lasrCloneDom.find('.agencyBrandPanel .form-datetime').datetimepicker({
                language:  "zh-CN",
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                format: "yyyy-mm-dd"
            });
            //重置自由品牌/代理品牌事件
            $lasrCloneDom.find('.selectBrandType input[name="selfbrand"]').change(function(){
                var currentBrand = $(this).parent().parent().parent();
                console.info(currentBrand,$(this).val());
                if(parseInt($(this).val()) == 1) {
                    //自有品牌
                    currentBrand.find('.ownBrandPanel').show();
                    currentBrand.find('.agencyBrandPanel').hide();
                } else {
                    //代理品牌
                    currentBrand.find('.ownBrandPanel').hide();
                    currentBrand.find('.agencyBrandPanel').show();
                }
            });
            $($lasrCloneDom.find('.selectBrandType input').get(0)).click();

            //重置上传图片
            $lasrCloneDom.find('.clickUpload').click(function(){
                $(this).parent().find('input[type="file"]').click();
            });
            //企业入驻 - 供应商商标信息
            $lasrCloneDom.find('.inputBlock input[type="file"]').change(function(){
                if(this.files && this.files[0]) {
                    //表示input已经上传图片了
                    var img = $(this).parent().find('.addUploadImage')[0];
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        img.src = evt.target.result;
                    }
                    reader.readAsDataURL(this.files[0]);
                }
            });
        });
    },
    //企业入驻 - 第三方平台控制增删模块显示与隐藏
    selectThirdPlatform2: function () {
        $('.companyEnterPanel .enterBaseInfo .thirdPlaygroundWapperChoose input[name="isothershop"]').change(function(){
            if(parseInt($(this).val()) == 1) {
                $('.companyEnterPanel .enterBaseInfo .thirdPlaygroundWapper').show();
            } else {
                $('.companyEnterPanel .enterBaseInfo .thirdPlaygroundWapper').hide();
            }
        });
    },
    //企业入驻 - 选择商标：自由品牌/代理品牌
    selectBrandMarkInfo2: function(){
        $('.companyEnterPanel .companyBrandMarkInfo .selectBrandType input').change(function(){
            if(parseInt($(this).val()) == 1) {
                //自有品牌
                $('.companyEnterPanel .companyBrandMarkInfo .companyBrandMarkInfoContainer .ownBrandPanel').show();
                $('.companyEnterPanel .companyBrandMarkInfo .companyBrandMarkInfoContainer .agencyBrandPanel').hide();
            } else {
                //代理品牌
                $('.companyEnterPanel .companyBrandMarkInfo .companyBrandMarkInfoContainer .ownBrandPanel').hide();
                $('.companyEnterPanel .companyBrandMarkInfo .companyBrandMarkInfoContainer .agencyBrandPanel').show();
            }
        });
	},
    //企业入驻 - 删除第三方店铺
    deleteThridShopClick2: function(){
        $('.companyEnterPanel .thirdPlayElement .deletShopLink').click(function(){
            var $brforeThridElements = $('.personEnterPanel .thirdPlayElement');
            var removeThirdElement = $(this).parent();
            removeThirdElement.remove();                                        //移除当前节点
            var $afterThridElements = $('.companyEnterPanel .thirdPlayElement');
            if($afterThridElements.length == 1) {
                $afterThridElements.find('.deletShopLink').hide();
                $afterThridElements.find('.addShopLink').show();
                return;
            }
            $($afterThridElements.get($afterThridElements.length - 1)).find('.deletShopLink').show();
            $($afterThridElements.get($afterThridElements.length - 1)).find('.addShopLink').show();
        });
    },
    //企业入驻 - 点击添加第三方店铺
    addThridShopClick2: function(){
        $('.companyEnterPanel .thirdPlayElement .addShopLink').click(function(){
            var $brforeThridElements = $('.companyEnterPanel .thirdPlayElement');
            $($brforeThridElements.get(0)).clone(true).insertAfter($(this).parent());
            var $afterThridElements = $('.companyEnterPanel .thirdPlayElement');
            $afterThridElements.each(function(index,item){
                if($afterThridElements.length-1 == index) {
                    //最后一个：添加显示，删除显示
                    $(item).find('.deletShopLink').show();
                    $(item).find('.addShopLink').show();
                    $(item).find('input').val('');
                    $(item).find('input[name="ids"]').data('value','');
                    return;
                }
                $(item).find('.deletShopLink').show();
                $(item).find('.addShopLink').hide();
            });
        });
    },
    //企业入驻 - 添加商标信息
    addCrandMarkClick2: function(){
        $('.companyEnterPanel .companyBrandMarkInfo .addBrandCard span').click(function(){
            console.info('点击添加');
            var $cloneDom = $($(this).parent().parent().find('.companyBrandMarkInfoElement').get(0)).clone();
            $cloneDom.insertBefore($(this).parent().get(0));
            var $elementList = $('.companyBrandMarkInfo .companyBrandMarkInfoElement');
            var $lasrCloneDom = $($elementList.get($elementList.length -1));             //获取真正的复制jqeury对象
            //重置上传了的图片
            $lasrCloneDom.find('.inputBlock .addUploadImage').attr('src','../img/reg/addimg_03.png');
            //重置文件上传表单元素
            $lasrCloneDom.find('.inputBlock input[type="file"]').each(function(index, item){
                if(item.files && item.files[0]) {
                    item.files[0] = null;
                }
            });
            //重置input的值
            $lasrCloneDom.find('input').each(function(index,item){
                if($(item).attr('type') == 'radio') {
                    return;
                } else {
                    $(item).val('');
                }
            });
            //重置时间选择器
            $lasrCloneDom.find('.agencyBrandPanel .form-datetime').datetimepicker({
                language:  "zh-CN",
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                format: "yyyy-mm-dd"
            });
            //重置自由品牌/代理品牌事件
            $lasrCloneDom.find('.selectBrandType input[name="selfbrand"]').change(function(){
                var currentBrand = $(this).parent().parent().parent();
                if(parseInt($(this).val()) == 1) {
                    //自有品牌
                    currentBrand.find('.ownBrandPanel').show();
                    currentBrand.find('.agencyBrandPanel').hide();
                } else {
                    //代理品牌
                    currentBrand.find('.ownBrandPanel').hide();
                    currentBrand.find('.agencyBrandPanel').show();
                }
            });
            $($lasrCloneDom.find('.selectBrandType input').get(0)).click();

            //重置上传图片
            $lasrCloneDom.find('.clickUpload').click(function(){
                $(this).parent().find('input[type="file"]').click();
            });
            //企业入驻 - 供应商商标信息
            $lasrCloneDom.find('.inputBlock input[type="file"]').change(function(){
                if(this.files && this.files[0]) {
                    //表示input已经上传图片了
                    var img = $(this).parent().find('.addUploadImage')[0];
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        img.src = evt.target.result;
                    }
                    reader.readAsDataURL(this.files[0]);
                }
            });
        });
    },
    //获取个人入驻提交信息
    getPersonEnterParams: function(){
        var me = this;
        var params = {};
        /**** 入驻人基本信息：基本信息 *****/
        var enterBaseInfo = $('#enterBaseInfoID').serializeArray();
        var enterBaseParams = {};
        $.each(enterBaseInfo,function(index,item){
            //去除第三方平台店铺链接
            if(item.name == 'ids' || item.name == 'links') {
                return;
            }
            if(item.name == 'categoryid') {
                item.value = $('.personEnterPanel .goodsSource .categoryid').data('value');
            }
            enterBaseParams[item.name] = item.value;
        });
        var apps = [];
        $('.personEnterPanel .thirdPlayElement').each(function(index,item){
            var appsEle = {};
            var ids = $(item).find('input[name="ids"]').data('value');
            var links = $(item).find('input[name="links"]').val();
            appsEle.ids = ids;
            appsEle.links = links;
            apps.push(appsEle);
        });
        if(parseInt(enterBaseParams.isothershop) === 1) {
            enterBaseParams.apps = apps;
        }
        YouXin.apply(params,enterBaseParams);
        //供应商资质信息
        var supplierInfoParams = {};
        var supplierInfo = $('#supplierInfoID').serializeArray();
        $.each(supplierInfo,function(index,item){
            supplierInfoParams[item.name] = item.value;
        });
        //入驻人身份证正面照
        var managecodejpgfront = this.getUploadBase64Data('.supplierInfo .identityCardFront .addUploadImage');
        supplierInfoParams.managecodejpgfront = managecodejpgfront;
        //入驻人身份证反面照
        var managecodejpgback = this.getUploadBase64Data('.supplierInfo .identityCardBack .addUploadImage');
        supplierInfoParams.managecodejpgback = managecodejpgback;
        //入驻人手持身份证半身照
        var managecodejpg = this.getUploadBase64Data('.supplierInfo .identityCardBody .addUploadImage');
        supplierInfoParams.managecodejpg = managecodejpg;
        YouXin.apply(params, supplierInfoParams);
        //供应商商标信息
        var shoparr = [];
        $('#tradeMarkInfoID .brandMarkInfoElement').each(function(index,item){
            var shopEle = {};
            if($($(item).find('.selectBrandType input').get(0)).is(':checked')) {
                //自由品牌
                shopEle.selfbrand = 1;
                //商品名称
                var name = $(item).find('.ownBrandPanel input[name="name"]').val();
                shopEle.name = name;
                //商品注册号
                var code = $(item).find('.ownBrandPanel input[name="code"]').val();
                shopEle.code = code;
                //商标注册证
                var tradepaper = me.getUploadBase64DataByDom($(item).find('.ownBrandPanel .registerCredential .addUploadImage'));
                shopEle.tradepaper = tradepaper;
                //质量报告
                var report = me.getUploadBase64DataByDom($(item).find('.ownBrandPanel .qualityReport .addUploadImage'));
                shopEle.report = report;
                //进口货物单
                var importedgoods = me.getUploadBase64DataByDom($(item).find('.ownBrandPanel .entranceGoodsReport .addUploadImage'));
                shopEle.importedgoods = importedgoods;
            }
            else {
                //代理品牌
                shopEle.selfbrand = 2;
                //商品名称
                var name = $(item).find('.agencyBrandPanel .managerphone').val();
                shopEle.name = name;
                //商品注册号
                var code = $(item).find('.agencyBrandPanel .managerphone').val();
                shopEle.code = code;
                //商标注册证
                var tradepaper = me.getUploadBase64DataByDom($(item).find('.agencyBrandPanel .uploadRegisterCredential .addUploadImage'));
                shopEle.tradepaper = tradepaper;
                //品牌授权证明
                var empowerjpg = me.getUploadBase64DataByDom($(item).find('.agencyBrandPanel .uploadBrandAccredit .addUploadImage'));
                shopEle.empowerjpg = empowerjpg;
                //品牌授权有效期
                var empowerstarttime = $(item).find('.brandAccreditDate .starttime').val();
                shopEle.empowerstarttime = empowerstarttime;
                var empowerendtime = $(item).find('.brandAccreditDate .endtime').val();
                shopEle.empowerendtime = empowerendtime;
                //质量报告
                var report = me.getUploadBase64DataByDom($(item).find('.agencyBrandPanel .qualityReport .addUploadImage'));
                shopEle.report = report;
                //进口货物报关单
                var importedgoods = me.getUploadBase64DataByDom($(item).find('.agencyBrandPanel .entranceOrder .addUploadImage'));
                shopEle.importedgoods = importedgoods;
            }
            shoparr.push(shopEle);
        });
        params.shoparr = shoparr;
        return params;
    },
    //获取base64数据
    getUploadBase64Data: function(selector){
        var dataSrc = $(selector).attr('src');
        if(dataSrc.indexOf('data:image') ==0) {
            return dataSrc;
        }
        return;
    },
    //获取base64数据
    getUploadBase64DataByDom: function(selectorDom){
        var dataSrc = selectorDom.attr('src');
        if(dataSrc.indexOf('data:image') ==0) {
            return dataSrc;
        }
        return;
    },
    //提交个人入驻信息
    doSubmitByPersonEnterPanel: function(){
        var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Backlanding/personalInfo',me = this;
        var params = this.getPersonEnterParams();
        var flag = this.verifyPersonEnterParams(params);
        if(!flag) return;
        YouXin.apply(params,{token:this.token,uid:this.uid,timestamp: this.getTimeStamp(),type:1});
        YouXin.getAsyncData(url, params, 'POST', me.doSubmitByPersonEnterPanelCallBack, me);
    },
    //验证个人入驻 - 参数
    verifyPersonEnterParams: function(params){
        //入驻人基本信息
        if(!params['managername']) {
            $('.personEnterPanel .enterBaseInfo input[name="managername"]').focus();
            $('body').scrollTop(0);
            this.showMessage('请填写入驻人姓名');
            return false;
        }
        if(!params['managermail']) {
            $('.personEnterPanel .enterBaseInfo input[name="managermail"]').focus();
            $('body').scrollTop(0);
            this.showMessage('请填写入驻人邮箱');
            return false;
        }
        if(!params['managerphone']) {
            $('.personEnterPanel .enterBaseInfo input[name="managerphone"]').focus();
            $('body').scrollTop(0);
            this.showMessage('请填写入驻人手机');
            return false;
        }
        if(!params['managerpcode']) {
            $('.personEnterPanel .enterBaseInfo input[name="managerpcode"]').focus();
            $('body').scrollTop(0);
            this.showMessage('请填写入驻人身份证号');
            return false;
        }
        if(!params['categoryid']) {
            //$('.personEnterPanel .enterBaseInfo input[name="categoryid"]').focus();
            $('body').scrollTop(0);
            this.showMessage('请选择主营类目');
            return false;
        }
        var appsFlag = true;
        if(parseInt(params['isothershop']) == 1) {
            if(params['apps'].length == 0) appsFlag = false;
            for(var i=0; i<=params['apps'].length-1; i++) {
                var ids = params['apps'][i]['ids'];
                var links = params['apps'][i]['links'];
                if(YouXin.isEmpty(ids) || YouXin.isEmpty(links)) appsFlag = false;
            }
        }
        if(!appsFlag) {
            $('body').scrollTop(0);
            this.showMessage('请完善第三方店铺链接');
            return false;
        }
        //供应商资质信息
        if(!params['managecodejpgfront']) {
            $('body').scrollTop(500);
            this.showMessage('请上传身份证正面照');
            return false;
        }
        if(!params['managecodejpgback']) {
            $('body').scrollTop(500);
            this.showMessage('请上传身份证反面照');
            return false;
        }
        if(!params['sfstart']) {
            $('body').scrollTop(500);
            this.showMessage('请填写身份证有效期');
            return false;
        }
        if(!params['sfend']) {
            $('body').scrollTop(500);
            this.showMessage('请填写身份证有效期');
            return false;
        }
        if(!params['managecodejpg']) {
            $('body').scrollTop(500);
            this.showMessage('请上传身份证半身照');
            return false;
        }
        //供应商商标信息
        var shopFlag = true;
        for(var key=0; key <= params['shoparr'].length - 1;key++) {
            var brandJson = params['shoparr'][key];
            console.info(brandJson,222);
            for(var brand in brandJson) {
                if(YouXin.isEmpty(brandJson[brand])) shopFlag = false;
            }
        }
        if(!shopFlag) {
            //$('body').scrollTop(883);
            this.showMessage('请完善商标信息');
            return false;
        }
        return true;
    },
    doSubmitByPersonEnterPanelCallBack: function(data){
        if(data.state != 1)return;
        window.location.href = 'fillenteraudit.html';
    },
    //获取企业入驻提交信息
    getCompanyEnterParams: function(){
        var me = this;
        var params = {};
        /**** 供应商管理人信息：基本信息 *****/
        var companySupplierInfo = $('#companySupplierInfoID').serializeArray();
        var enterBaseParams = {};
        $.each(companySupplierInfo,function(index,item){
            //去除第三方平台店铺链接
            if(item.name == 'ids' || item.name == 'links') {
                return;
            }
            if(item.name == 'categoryid') {
                item.value = $('.companySupplierInfo .goodsSource .categoryid').data('value');
            }
            enterBaseParams[item.name] = item.value;
        });
        var apps = [];
        $('.companySupplierInfo .thirdPlayElement').each(function(index,item){
            var appsEle = {};
            var ids = $(item).find('input[name="ids"]').data('value');
            var links = $(item).find('input[name="links"]').val();
            appsEle.ids = ids;
            appsEle.links = links;
            apps.push(appsEle);
        });
        /********选择的是存在第三方平台店铺******/
        if(parseInt(enterBaseParams.isothershop) === 1) {
            enterBaseParams.apps = apps;
        }
        YouXin.apply(params,enterBaseParams);
        //console.info(params,1111);
        /******** 供应商企业信息 *********/
        var companyInfoForm = $('#companyBaseInfoID').serializeArray();
        var companyInfoParams = {};
        $.each(companyInfoForm,function(index,item){
            companyInfoParams[item.name] = item.value;
        });
        companyInfoParams.province = $('#provinceID option:selected').html();
        companyInfoParams.city = $('#cityID option:selected').html();
        companyInfoParams.xian = $('#xianID option:selected').html();
        YouXin.apply(params,companyInfoParams);
        /******** 供应商资质信息 *********/
        var companyQualificat = $('#companyQualificatID').serializeArray();
        var companyQualificatParams = {};
        $.each(companyQualificat,function(index,item){
            companyQualificatParams[item.name] = item.value;
        });
        //入驻人身份证正面照
        var owneridcodejpgfront = this.getUploadBase64Data('.companyQualificat .identityCardFront .addUploadImage');
        companyQualificatParams.owneridcodejpgfront = owneridcodejpgfront;
        //入驻人身份证反面照
        var owneridcodejpgback = this.getUploadBase64Data('.companyQualificat .identityCardBack .addUploadImage');
        companyQualificatParams.owneridcodejpgback = owneridcodejpgback;
        //入驻人身份证反面照
        var owneridcodejpgback = this.getUploadBase64Data('.companyQualificat .identityCardBack .addUploadImage');
        companyQualificatParams.owneridcodejpgback = owneridcodejpgback;
        //营业执照
        var licensejpg = this.getUploadBase64Data('.companyQualificat .businessLicense .addUploadImage');
        companyQualificatParams.licensejpg = licensejpg;
        //许可证
        var banklicensejpg = this.getUploadBase64Data('.companyQualificat .banklicensejpg .addUploadImage');
        companyQualificatParams.banklicensejpg = banklicensejpg;
        //一般纳税人资格证书
        var normaltaxjpg = this.getUploadBase64Data('.companyQualificat .normaltaxjpg .addUploadImage');
        companyQualificatParams.normaltaxjpg = normaltaxjpg;
        //食品经营许可证
        var foodlicense = this.getUploadBase64Data('.companyQualificat .foodlicense .addUploadImage');
        companyQualificatParams.foodlicense = foodlicense;
        YouXin.apply(params,companyQualificatParams);
        /********** 供应商商标信息 **********/
        var companyBrandMarkInfo = $('#companyBrandMarkInfoID').serializeArray();
        var shoparr = [];
        $('#companyBrandMarkInfoID .companyBrandMarkInfoElement').each(function(index,item){
            var shopEle = {};
            if($($(item).find('.selectBrandType input').get(0)).is(':checked')) {
                //自由品牌
                shopEle.selfbrand = 1;
                //商品名称
                var name = $(item).find('.ownBrandPanel input[name="name"]').val();
                shopEle.name = name;
                //商品注册号
                var code = $(item).find('.ownBrandPanel input[name="code"]').val();
                shopEle.code = code;
                //商标注册证
                var tradepaper = me.getUploadBase64DataByDom($(item).find('.ownBrandPanel .registerCredential .addUploadImage'));
                shopEle.tradepaper = tradepaper;
                //质量报告
                var report = me.getUploadBase64DataByDom($(item).find('.ownBrandPanel .qualityReport .addUploadImage'));
                shopEle.report = report;
                //进口货物单
                var importedgoods = me.getUploadBase64DataByDom($(item).find('.ownBrandPanel .entranceGoodsReport .addUploadImage'));
                shopEle.importedgoods = importedgoods;
            } else {
                //代理品牌
                shopEle.selfbrand = 2;
                //商品名称
                var name = $(item).find('.agencyBrandPanel .managerphone').val();
                shopEle.name = name;
                //商品注册号
                var code = $(item).find('.agencyBrandPanel .managerphone').val();
                shopEle.code = code;
                //商标注册证
                var tradepaper = me.getUploadBase64DataByDom($(item).find('.agencyBrandPanel .uploadRegisterCredential .addUploadImage'));
                shopEle.tradepaper = tradepaper;
                //品牌授权证明
                var empowerjpg = me.getUploadBase64DataByDom($(item).find('.agencyBrandPanel .uploadBrandAccredit .addUploadImage'));
                shopEle.empowerjpg = empowerjpg;
                //品牌授权有效期
                var empowerstarttime = $(item).find('.brandAccreditDate .starttime').val();
                shopEle.empowerstarttime = empowerstarttime;
                var empowerendtime = $(item).find('.brandAccreditDate .endtime').val();
                shopEle.empowerendtime = empowerendtime;
                //质量报告
                var report = me.getUploadBase64DataByDom($(item).find('.agencyBrandPanel .qualityReport .addUploadImage'));
                shopEle.report = report;
                //进口货物报关单
                var importedgoods = me.getUploadBase64DataByDom($(item).find('.agencyBrandPanel .entranceOrder .addUploadImage'));
                shopEle.importedgoods = importedgoods;
            }
            shoparr.push(shopEle);
        });
        params.shoparr = shoparr;
        return params;
    },
    doSubmitByCompanyEnterPanel: function(){
        var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Backlanding/personalInfo',me = this;
        var params = this.getCompanyEnterParams();
        var flag = this.verifyCompanyEnterParams(params);
        YouXin.apply(params,{token:this.token,uid:this.uid,timestamp: this.getTimeStamp(),type:2});
        YouXin.getAsyncData(url, params, 'POST', me.doSubmitByPersonEnterPanelCallBack, me);
    },
    //验证企业入驻 - 参数
    verifyCompanyEnterParams: function(params){
        //验证供应商管理人信息
        if(!params['managername']) {
            $('.companyEnterPanel .companySupplierInfo input[name="managername"]').focus();
            $('body').scrollTop(0);
            this.showMessage('请填写管理人姓名');
            return false;
        }
        if(!params['managermail']) {
            $('.companyEnterPanel .companySupplierInfo input[name="managermail"]').focus();
            $('body').scrollTop(0);
            this.showMessage('请填写管理人邮箱');
            return false;
        }
        if(!params['managerphone']) {
            $('.companyEnterPanel .companySupplierInfo input[name="managerphone"]').focus();
            $('body').scrollTop(0);
            this.showMessage('请填写管理人手机');
            return false;
        }
        if(!params['categoryid']) {
            $('body').scrollTop(0);
            this.showMessage('请选择主营类目');
            return false;
        }
        var appsFlag = true;
        if(parseInt(params['isothershop']) == 1) {
            if(params['apps'].length == 0) appsFlag = false;
            for(var i=0; i<=params['apps'].length-1; i++) {
                var ids = params['apps'][i]['ids'];
                var links = params['apps'][i]['links'];
                if(YouXin.isEmpty(ids) || YouXin.isEmpty(links)) appsFlag = false;
            }
        }
        if(!appsFlag) {
            $('body').scrollTop(0);
            this.showMessage('请完善第三方店铺链接');
            return false;
        }
        /****************验证供应商企业信息******************/
        if(!params['companynames']) {
            $('.companyEnterPanel .companyBaseInfo input[name="companynames"]').focus();
            $('body').scrollTop(466);
            this.showMessage('请填写公司名称');
            return false;
        }
        if(!params['ownername']) {
            $('.companyEnterPanel .companyBaseInfo input[name="ownername"]').focus();
            $('body').scrollTop(466);
            this.showMessage('请填写企业法人姓名');
            return false;
        }
        if(!params['ownermail']) {
            $('.companyEnterPanel .companyBaseInfo input[name="ownermail"]').focus();
            $('body').scrollTop(466);
            this.showMessage('请填写企业法人邮箱');
            return false;
        }
        if(!params['ownerphone']) {
            $('.companyEnterPanel .companyBaseInfo input[name="ownerphone"]').focus();
            $('body').scrollTop(466);
            this.showMessage('请填写企业法人手机');
            return false;
        }
        if(!params['owneridcode']) {
            $('.companyEnterPanel .companyBaseInfo input[name="owneridcode"]').focus();
            $('body').scrollTop(466);
            this.showMessage('请填写企业法人身份证号');
            return false;
        }
        if(!params['home']) {
            $('.companyEnterPanel .companyBaseInfo input[name="home"]').focus();
            $('body').scrollTop(466);
            this.showMessage('请填写公司具体地址');
            return false;
        }
        if(!params['unifiedcredicode']) {
            $('.companyEnterPanel .companyBaseInfo input[name="unifiedcredicode"]').focus();
            $('body').scrollTop(466);
            this.showMessage('请填写统一社会信用代码');
            return false;
        }
        /*********** 供应商资质信息 ************/
        if(!params['owneridcodejpgfront']) {
            $('body').scrollTop(767);
            this.showMessage('请上传身份证正面照');
            return false;
        }
        if(!params['owneridcodejpgback']) {
            $('body').scrollTop(767);
            this.showMessage('请上传身份证反面照');
            return false;
        }
        if(!params['sfstart']) {
            $('body').scrollTop(767);
            this.showMessage('请填写身份证有效期');
            return false;
        }
        if(!params['sfend']) {
            $('body').scrollTop(767);
            this.showMessage('请填写身份证有效期');
            return false;
        }
        if(!params['licensejpg']) {
            $('body').scrollTop(767);
            this.showMessage('请上传营业执照');
            return false;
        }
        if(!params['banklicensejpg']) {
            $('body').scrollTop(767);
            this.showMessage('请上传开户许可证');
            return false;
        }
        if(!params['normaltaxjpg']) {
            $('body').scrollTop(767);
            this.showMessage('请上传一般纳税人资格证书');
            return false;
        }
        /********** 供应商商标信息 ************/
        var shopFlag = true;
        for(var key=0; key <= params['shoparr'].length - 1;key++) {
            var brandJson = params['shoparr'][key];
            for(var brand in brandJson) {
                if(YouXin.isEmpty(brandJson[brand])) shopFlag = false;
            }
        }
        if(!shopFlag) {
            this.showMessage('请完善商标信息');
            return false;
        }
        return true;
    },
    submitBtnClick: function(){
        var me = this;
        $('.submitBar .submitBtn').click(function(){
            if(me.type == 1) {
                me.doSubmitByPersonEnterPanel();                //提交个人入驻信息
            } else {
                me.doSubmitByCompanyEnterPanel();               //提交企业入驻信息
            }
        });
    },
    //设置地址选择下拉列表
    setAddressSelect: function(){
        region_init("provinceID","cityID","xianID");
    },
    //设置统一社会信用代码示例
    setComponyCodeAlert: function(){
        $('.companyBaseInfo .enterCompanyCodeExample').tooltip({
            html: 'true',
            title: '<img src="../img/reg/companyCodeExample.png">',
            //trigger: 'click',
            placement: 'right',
            tipClass: 'questionTooltip'
        });
    },
    //个人入驻面板相关事件
    registerPersonEnterEvent: function(){
    	this.selectThirdPlatform1();							    //个人入驻 - 第三方平台控制增删模块显示与隐藏
		this.selectBrandMarkInfo1();							    //个人入驻 - 选择商标：自由品牌/代理品牌
        this.deleteThridShopClick1();                               //个人入驻 - 删除第三方店铺
        this.addThridShopClick1();                                  //个人入驻 - 点击添加第三方店铺
        this.addCrandMarkClick1();                                  //个人入驻 - 点击添加商标信息
	},
	//企业入驻面板相关事件
    registerCompanyEnterEvent: function(){
        this.selectThirdPlatform2();							    //企业入驻 - 第三方平台控制增删模块显示与隐藏
		this.selectBrandMarkInfo2();							    //企业入驻 - 选择商标：自由品牌/代理品牌
        this.deleteThridShopClick2();                               //企业入驻 - 删除第三方店铺
        this.addThridShopClick2();                                  //企业入驻 - 点击添加第三方店铺
        this.addCrandMarkClick2();                                  //企业入驻 - 添加商标信息
        this.setAddressSelect();                                    //设置地址选择下拉列表
        this.setComponyCodeAlert();                                     //设置企业代码
	},
    initRegisterEvent: function(){
        this.initRelatedElement();
    	this.setSelectEnterType();								    //设置入驻类型
        this.registerDropMenu();                                    //注册下拉列表
        this.doUploadPicture();                                     //注册上传图片事件
        this.initDatetimepicker();                                  //初始化时间选择器
		this.registerPersonEnterEvent();						    //个人入驻面板相关事件
        this.registerCompanyEnterEvent();						    //企业入驻面板相关事件
        this.submitBtnClick();                                      //提交按钮点击了

        //this.doTest();
	},
    doTest: function(){
        $('.companyEnter').click();
    },
    initPage: function(){
		this.initRegisterEvent();
	}
});