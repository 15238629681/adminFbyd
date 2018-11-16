var uid,token;
var releaseexperienceactivity = {
    userinfo: null,
    loading: null,//加载提示窗
    shopNameArray: [],
    searchWayInfo: [
        {id:'searchWay1',name:'搜索方式一'},
        {id:'searchWay2',name:'搜索方式二'},
        {id:'searchWay3',name:'搜索方式三'},
        {id:'searchWay4',name:'搜索方式四'},
        {id:'searchWay5',name:'搜索方式五'}
    ],
    goodsUrl: null,
    messageWin: null,//弹窗
    getUserInfo: function(){
        this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
        uid = this.userinfo.uid;
        token = this.userinfo.token;
    },l
    getUserShop: function(){
        //获取用户店铺
        var me = this;
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apib/Experience/getshop",
            data: {
                uid: uid,
                token: token,
            },
            success: function(data) {
                if(data.state == 0) return;
                me.shopNameArray = data.data;
                if(me.shopNameArray.length == 0) {
                    //无数据
                    $('.noAddShopMask').show();
                } else {
                    me.judgeNormalSupply();                     //然后供应商类型
                    me.resetShopName();
                }
            },
            error: function(msg) {
                console.log(msg);
            }
        });
    },
    //创建加载中的动画对象
    createLoading: function(){
        this.loadingDom = document.createElement('div');
        this.loadingDom.style.cssText = 'width:70px;height:70px;display:none;position:absolute;top:50%;left:50%;text-align:center;margin-left: -35px;margin-top: -35px;z-index:9999;';
        this.loadingDom.innerHTML = '<img src="../img/public/downrefesh.gif"><br/><br/>正在提交中...';
        this.loadingDom.show = function(){
            this.style.display = 'block';
        };
        this.loadingDom.hide = function(){
            this.style.display = 'none';
        };
        $('body').append(this.loadingDom);
    },
    getActivityAndService: function(){
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apib/Experience/getService",
            data: {
                uid: uid,
                token: token
            },
            success: function(data) {
                if(data.state) {
                    //请求成功
                    var freeService = [],payService = [];
                    $('.freeService .activityInstructionWapper').empty();
                    $('.payService .activityInstructionWapper').empty();
                    $.each(data.data,function(index,item){
                        if(item.type == 1) {
                            var originalHTML = $('.freeService .activityInstructionWapper').html();
                            var htmlP = '<div class="radio"><label><input type="checkbox" name="service" data-id="'+ item.id +'"/>'+ item.content+'</label></div>';
                            originalHTML += htmlP;
                            $('.freeService .activityInstructionWapper').html(originalHTML);
                        } else if(item.type == 2) {
                            var originalHTML = $('.payService .activityInstructionWapper').html();
                            var money = parseInt(item.money) == 0 ? "0元" : parseInt(item.money) + "元/份"
                            var htmlP = '<div class="radio"><label><input type="checkbox" name="service" data-id="'+ item.id +'"/>'+ item.content+ '(' + money + ')</label></div>';
                            originalHTML += htmlP;
                            $('.payService .activityInstructionWapper').html(originalHTML);
                        }
                    });
                }
            },
            error: function(msg) {
                console.log(msg);
            }
        });
    },
    initDatetimepicker: function(){
        //var timestr = this.getTimeOfRange(2);
        $(".form-datetime").datetimepicker({
            weekStart: 1,
            autoclose: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1,
            //startDate: new Date(timestr),
            startDate: new Date(),
            format: "yyyy-mm-dd hh:ii"
        });
    },
    getTimeOfRange: function(dayNum){
        //根据传递过来的参数获取当前时间
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth()+1;
        var day = now.getDate() + dayNum;
        if(month < 10) month = "0" + month;
        if(day < 10) day = "0" + day;
        var timestr = year + "-" + month + '-' + day + ' 00:00:00';
        return timestr;
    },
    wordRangePrompt: function(){
        //文本超出范围提示
        $('.wordRangePrompt').keyup(function(){
            var content = $(this).val().length + "/" + $(this).attr('maxlength') + "字符";
            $(this).parent().find('.limitNumFlag').html(content);
        });
    },
    registerDropMenu: function(){
        //下拉菜单
        var me = this;
        $(".dropdown-menu li a").on('click', function() {
            var value = $(this).data('value');
            $(this).parent().parent().parent().find('input').val("" + $(this).html());
            $(this).parent().parent().parent().find('input').data('value',value);
            $(this).parent().parent().parent().find('input').trigger('change');
            if($(this).hasClass('shopType')) {
                $('input.experienceform-shopid').val('');
                me.resetShopName();
            }
        });
    },
    resetShopName: function(){
        var me = this,apps = '';
        if($('#shopPlatform').val() == '淘宝') {
            apps = 1;
        }
        if($('#shopPlatform').val() == '天猫') {
            apps = 2;
        }
        $(".shopNameDeatil .dropdown-menu").empty();
        if(!apps) return;
        for(var i = 0; i < me.shopNameArray.length; i++) {
            if(me.shopNameArray[i].apps == apps) {
                var shopNameLi = document.createElement("li");
                shopNameLi.setAttribute("data-value", me.shopNameArray[i].id)
                shopNameLi.innerHTML = '<a href="#">' + me.shopNameArray[i].shopname + '</a>';
                document.querySelector(".shopNameDeatil .dropdown-menu").appendChild(shopNameLi);
                $(shopNameLi).find('a').click(function(){
                    var value = $(this).parent().data('value');
                    $(this).parent().parent().parent().find('input').val("" + $(this).html());
                    $(this).parent().parent().parent().find('input').data('value',value);
                });
            }
        }
    },
    initCipher: function(){
        //生成暗号并且渲染
        //var codeArr = "FB";
        var codeArr = "";
        for(var i =0; i<6; i++) {
            codeArr += parseInt(Math.random()*10);
        }
        $('#cipherCode').val(codeArr);
    },
    copyCipher: function(){
        //复制暗号
        var me = this;
        $('.copyBtn').click(function(){
            var cipherCode = $('#cipherCode').val();
            var oInput = document.createElement('input');
            oInput.value = cipherCode;
            document.body.appendChild(oInput);
            oInput.select();
            document.execCommand("Copy");
            oInput.style.display='none';
            me.showMessage('<span style="font-size:16px;">复制成功</span>');
        });
    },
    showMessage: function(message){
        //显示弹窗
        if(this.messageWin) this.messageWin.hide();
        this.messageWin = new $.zui.Messager(message, {
            close: false,
            type: 'warning',
            placement: 'center',
            time: 2000
        }).show();
    },
    userPlaceOrderWay: function(){
        //用户下单方式
        $("input[name='ordertype']").change(function(){
            if($(this).hasClass('searchOrderType')) {
                $('#searchOrderBodyID').show();
                $('#tklOrderBodyID').hide();
                $('.searchPlaceOrder').css({'border-bottom': 'none','background-color':'#FFFFFF'});
                $('.tklPlaceOrder').css({'border-bottom': '1px solid #DEDEDE','background-color':'#F6F6F6'});
            } else {
                $('#searchOrderBodyID').hide();
                $('#tklOrderBodyID').show();
                $('.searchPlaceOrder').css({'border-bottom': '1px solid #DEDEDE','background-color':'#F6F6F6'});
                $('.tklPlaceOrder').css({'border-bottom': 'none','background-color':'#FFFFFF'});
            }
        });
    },
    searchWayOption: function(){
        var me = this;
        $('.searchWay').click(function(event){
            me.searchWayClick.call(this,event);
        });
    },
    registerSearchWay: function(){
        var me = this;
        $('.addSearchWay').click(function(){
            var length = $('.searchWay').size();
            if(length >= 5) {
                alert("您已超出上限");
                return;
            }
            var cloneWay = $($('.searchWay').get(0)).clone(true);               //获取clone节点
            var addCloneWay = cloneWay.removeClass('isFirst');
            addCloneWay.data('index',me.searchWayInfo[length].id);
            addCloneWay.find('span').get(0).innerHTML = me.searchWayInfo[length].name;
            $(this).before(addCloneWay);
            var cloneWayPanel = $($('.searchWaySubPanel').get(0)).clone(true);
            cloneWayPanel.attr('id',me.searchWayInfo[length].id);
            $('.searchOrderPanelBody').append(cloneWayPanel);
            $($('.searchWay').get(length)).click();
            $(cloneWayPanel).find('input').each(function(index,item){
                item.value = "";
            });
        });
    },
    searchWayClick: function(event){
        var subPanelId = $(this).data('index'),me = this;
        if($('.searchWay').size() == 1) {
            $('.searchWay').find('.rightTopClose').hide();
        } else {
            $('.searchWay').find('.rightTopClose').hide();
            $(this).find('.rightTopClose').show();
        }
        if(event.target.className.indexOf('rightTopClose') < 0) {
            $('.searchWaySubPanel').hide();
            $('#' + subPanelId).show();
            $('.searchWay').removeClass('isSelect');
            $(this).addClass('isSelect');
            if($('#' + subPanelId).find('.setChooseCondition input').is(':checked')) {
                $('#' + subPanelId).find('.filterConditionPanel').show();
            } else {
                $('#' + subPanelId).find('.filterConditionPanel').hide();
            }
        } else {
            $(this).remove();                       //移除搜索方式
            $('#' + subPanelId).remove();           //移除搜索方式对应的面板
            $('.searchWay').get(0).click();
            releaseexperienceactivity.toSortSearchWay();
        }
    },
    toSortSearchWay: function(){
        var me = this;
        $('.searchWay').each(function(index,item){
            $(item).data('index',me.searchWayInfo[index].id);
            $(item).find('span').get(0).innerHTML = me.searchWayInfo[index].name;
        });
        $('.searchWaySubPanel').each(function(index,item){
            $(item).attr('id',me.searchWayInfo[index].id);
        })
    },
    searchFilterCondition: function(){
        $('.setChooseCondition label input').click(function(){
            if($(this).is(':checked')) {
                $('.filterConditionPanel').show();
            } else {
                $('.filterConditionPanel').hide();
            }
        });
    },
    selectUploadImage: function(){
        //上传图片方式
        var me = this;
        $('.goodsSource .fillTypeContainerRight label input').click(function(){
            if($(this).val() == '1') {
                console.info('选用淘宝详情页');
                $('.uploadDetailImage').hide();
                $('.selectTBaoImage').show();
                if(!me.isReadDetailTabao) me.getTaboDetailPage();
            } else {
                console.info('上传详情页图片');
                $('.uploadDetailImage').show();
                $('.selectTBaoImage').hide();
            }
        });
    },
    getTaboDetailPage: function(){
        var newGoodsUrl = $('.goodsUrl').val(),me = this;
        if(!newGoodsUrl) {
            me.showMessage("请输入下单地址");
            $('#part-right').scrollTop(800);
            $('.goodsUrl').focus();
            return;
        }
        if(me.goodsUrl == newGoodsUrl) return;
        me.goodsUrl = newGoodsUrl;
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apib/Experience/getTaobao",
            data: {
                uid: uid,
                token: token,
                goodsurl: me.goodsUrl
            },
            success: function(data) {
                console.info(data);
                if(data.state == "1") {
                    var picData = data.data.image;
                    var details = data.data.details.descdata_imgs;                          //商品详情图
                    var mainPhotos = document.querySelectorAll(".selectTBaoImage .addmainimg .img");
                    //var goodsDetails = document.querySelectorAll(".goodsDetail .img");
                    for(var i = 0; i < mainPhotos.length; i++) {
                        if(!picData[i]) break;
                        mainPhotos[i].setAttribute("src", picData[i])
                    }
                    document.querySelector("#myEditor").innerHTML = details;
                } else {
                    alert("请输入正确的下单地址！");
                }
            },
            error: function(msg) {
                console.log(msg);
            }
        });
    },
    triggerUploadInput: function(){
        //触发上传图片标签
        $('.addmainimg').click(function(){
            $(this).find('input')[0].click();
        });
        $('.homePagePictureGroup').click(function(){
            $(this).find('input')[0].click();
        });
    },
    dragCommMainImage: function(){
        //拖拽商品主图
        $('#uploadMainImageList').sortable();
        $('#selectTBaoMainList').sortable();
    },
    uploadCommMainImage: function(){
        var me = this;
        //选用淘宝详情页图片上传控制
        $('.selectTBaoImage .addmainimg input').change(function(){
            var inputObj = this;
            if(this.files && this.files[0]) {
                //表示input已经上传图片了
                var uploadFile = this.files[0];
                if(!(uploadFile.type == 'image/jpeg' || uploadFile.type == ',image/jpg' || uploadFile.type == 'image/png')) {
                    inputObj.files[0] = null;
                    me.showMessage('图片类型仅支持png、jpg、jpeg');
                    return;
                }
                var img = $(this).parent().find('img')[0];
                var image = document.createElement('img');          //获取图片宽高载体
                var reader = new FileReader();
                reader.onload = function(event) {
                    image.src = event.target.result;
                    image.onload = function(){
                        if(image.width == image.height && uploadFile.size <= 512000) {
                            img.src = event.target.result;
                        } else {
                            me.showMessage('图片要求：尺寸为1:1，大小小于500K');
                            //img.src = '../img/activity/uploadMainPic.png';
                            inputObj.files[0] = null;
                        }
                    }
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        //选用上传详情页图片上传控制
        $('.uploadDetailImage .goodsMainPic .addmainimg input').change(function(){
            var inputObj = this;
            if(this.files && this.files[0]) {
                //表示input已经上传图片了
                var uploadFile = this.files[0];
                if(!(uploadFile.type == 'image/jpeg' || uploadFile.type == ',image/jpg' || uploadFile.type == 'image/png')) {
                    inputObj.files[0] = null;
                    me.showMessage('图片类型仅支持png、jpg、jpeg');
                    return;
                }
                var img = $(this).parent().find('img')[0];
                var image = document.createElement('img');          //获取图片宽高载体
                var reader = new FileReader();
                reader.onload = function(event) {
                    image.src = event.target.result;
                    image.onload = function(){
                        if(image.width == image.height && uploadFile.size <= 512000) {
                            img.src = event.target.result;
                        } else {
                            me.showMessage('图片要求：尺寸为1:1，大小小于500K');
                            //img.src = '../img/activity/uploadMainPic.png';
                            inputObj.files[0] = null;
                        }
                    }
                }
                reader.readAsDataURL(this.files[0]);
            }
        });


        //选用上传详情页图片上传控制
        $('.uploadDetailImage .goodsDetailPic .addmainimg input').change(function(){
            var inputObj = this;
            if(this.files && this.files[0]) {
                //表示input已经上传图片了
                var uploadFile = this.files[0];
                if(!(uploadFile.type == 'image/jpeg' || uploadFile.type == ',image/jpg' || uploadFile.type == 'image/png')) {
                    inputObj.files[0] = null;
                    me.showMessage('图片类型仅支持png、jpg、jpeg');
                    return;
                }
                var img = $(this).parent().find('img')[0];
                var reader = new FileReader();
                reader.onload = function(evt) {
                    img.src = evt.target.result;
                    var height = $(img).height();
                    if((184 - height) > 0) img.style.marginTop = (184 - height)/2 + "px";
                }
                reader.readAsDataURL(this.files[0]);
            }
        });


        //推荐主图
        $('.homePagePictureGroup input').change(function(){
            var inputObj = this;
            if(this.files && this.files[0]) {
                //表示input已经上传图片了
                var uploadFile = this.files[0];
                if(!(uploadFile.type == 'image/jpeg' || uploadFile.type == ',image/jpg' || uploadFile.type == 'image/png')) {
                    inputObj.files[0] = null;
                    me.showMessage('图片类型仅支持png、jpg、jpeg');
                    return;
                }
                var img = $(this).parent().find('img')[0];
                var image = document.createElement('img');          //获取图片宽高载体
                var reader = new FileReader();
                reader.onload = function(event) {
                    image.src = event.target.result;
                    image.onload = function(){
                        if(image.width == 710 && image.height == 400 && uploadFile.size <= 512000) {
                            img.src = event.target.result;
                        } else {
                            me.showMessage('图片要求：尺寸为710px*400px，大小小于500K');
                            //img.src = '../img/activity/uploadMainPic.png';
                            inputObj.files[0] = null;
                        }
                    }
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    },
    formInputStyle: ['experienceform-froms','experienceform-shopid','experienceform-postage','experienceform-starttime','experienceform-longtime','experienceform-beforeordertime','experienceform-qq',
        'experienceform-title','experienceform-shorttitle','experienceform-saleintroduce','experienceform-price','experienceform-category','experienceform-numbers','experienceform-sku','experienceform-goodsurl','experienceform-code'
    ],
    doSubmitExperienceGoods: function(){
        //提交体验活动订单
        var me = this;
        $('.submitSpan').click(function(){
            var canDoSubmit = true;
            for(var i = 0;i < me.formInputStyle.length; i++) {
                var value = $('input.' + me.formInputStyle[i]).val();
                if(value != 0 && !value) value = $('textarea.' + me.formInputStyle[i]).val();
                if(!value) {
                    $('span.' + me.formInputStyle[i]).show();
                    canDoSubmit = false;
                    continue;
                } else {
                    $('span.' + me.formInputStyle[i]).hide();
                }
            }
            if(canDoSubmit) {
                me.doSubmit(1);
            } else {
                $('#part-right').scrollTop(0);
            }
        });
    },
    doSubmit: function(subtype){
        //获取所有的json
        var me = this;
        var jsondata = this.getSubmitData();
        jsondata['token'] = token;
        jsondata['uid'] = uid;
        jsondata['id'] = this.draftID?this.draftID:'';
        jsondata['shopstatus'] = subtype;
        console.info(jsondata,'保存草稿数据');
        if(subtype == 1 && this.isNormalSupplier == true && this.isNeedPayToRelease == false) {
            //普通会员，发布数量大于5
            if(jsondata['numbers'] > 5) {
                $('.supplyType').show();
                return;
            }
        }
        if(subtype == 1 && this.isNeedPayToRelease == true) {
            //普通会员，并且已发布过一次体验商品
            $('.supplyType').show();
            return;
        }
        var keywordsHasNull = false;
        var keywordsPrompt = '请添加下单方式!';
        if(subtype == 1 && parseInt(jsondata['ordertype']) == 2) {
            var searchs = jsondata['tbcodes'];
            for(var i = 0; i< searchs.length; i++) {
                for(var index in searchs[i]) {
                    if(!searchs[i]['page']) {
                        keywordsPrompt = '排序大约在第几屏！';
                        keywordsHasNull = true;
                    }
                    if(!searchs[i]['ordertype']) {
                        keywordsPrompt = '请选择排序方式！';
                        keywordsHasNull = true;
                    }
                    if(!searchs[i]['keywords']) {
                        keywordsPrompt = '请填写关键词！';
                        keywordsHasNull = true;
                    }
                }
            }
        }
        if(keywordsHasNull) {
            $('.userPlaceOrder .warningText').html(keywordsPrompt);
            $('.userPlaceOrder .warningText').show();
            $('#part-right').scrollTop(1435);
            return;
        }
        if(subtype == 1) {
            jsondata['id'] = me.draftID;
            if(jsondata['pic'].length == 0) {
                //控制上传图片
                $('.fillTypeContainerRight .warningText').show();
                $('#part-right').scrollTop(2019);
                return;
            }
        }
        me.loadingDom.show();
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apib/Experience/insertExperience",
            data: jsondata,
            success: function (data) {
                if (data.state == 1 && subtype == 1) {
                    me.loadingDom.hide();
                    var shopid = data.data.shopid;
                    window.location.href = "gotofrozen.html?shopid=" + shopid + "";
                } else if(data.state == 1 && subtype == 0){
                    me.loadingDom.hide();
                    me.showMessage('<span style="font-size: 16px">保存草稿成功</span>');
                    if(!me.draftID)me.getDraftDataId();
                }
            },
            error: function (msg) {
                console.log(msg,22222);
            }
        });
    },
    doSaveDraft: function(){
        //保存草稿
        var me = this;
        $('.saveAsDraftSpan').click(function(){
            me.doSubmit(0);
        });
    },
    getSubmitData: function(){
        var me = this,jsonData={};
        for(var i = 0;i < me.formInputStyle.length; i++) {
            var value = "", item = $('input.' + me.formInputStyle[i]);//获取以experienceform-keyName为类名的input元素

            if(item.data('value') == 0 || item.data('value')) {//input存在data-value属性的话(下拉选择框,对应选项代表的值赋值给该属性)
                value = $('input.' + me.formInputStyle[i]).data('value');
            } else {
                value = item.val();
            }
            var key = me.formInputStyle[i].split('-')[1];
            if(value != 0 && !value)
                value = $('textarea.' + me.formInputStyle[i]).val();
            jsonData[key] = value;
        }
        //【活动提示】/【增值服务】
        var service = "";
        $.each($('input[name="service"]'),function(index,item){
            if($(item).is(':checked')) {
                service += service.length==0 ? $(item).data('id') : ','+$(item).data('id');
            }
        });
        jsonData['service'] = service;
        //【用户下单提示】
        var ordertypeDom =  $('input[name="ordertype"]:checked');
        jsonData['ordertype'] = ordertypeDom.val();
        if(ordertypeDom.hasClass('searchOrderType')) {
            //搜索下单
            var searchWay = [];
            $('.searchWaySubPanel').each(function(index,item){
                var keywords = $(item).find('input[name="keywords"]').val();
                var ordertype = !$(item).find('input[name="orderway"]').data('value')?"":$(item).find('input[name="orderway"]').data('value');
                var pricerange = '';
                var address = '';
                var categroy = '';
                //设置筛选条件
                if($(item).find('input[name="filtercondition"]').is(':checked')) {
                    var firstprice = $(item).find('input[name="firstprice"]').val();
                    var secondprice = $(item).find('input[name="secondprice"]').val();
                    pricerange = firstprice + '-' + secondprice;
                    address = $(item).find('input[name="address"]').val();
                    categroy = $(item).find('input[name="categroy"]').val();
                }
                var page = $(item).find('input[name="page"]').val();
                searchWay.push({keywords:keywords,ordertype:ordertype,pricerange:pricerange,address:address,device:categroy,page:page})
            });
            jsonData['tbcodes'] = searchWay;
            jsonData['tbcode'] = undefined;
        } else {
            //淘口令下单
            var tbcode = $('textarea[name="tbcode"]').val();
            jsonData['tbcode'] = tbcode;
            jsonData['tbcodes'] = undefined;
        }
        //首页推荐图
        var phonepic = "";
        $('.homePagePicture .homePagePictureGroup img').each(function(index, item){
            //商品主图
            if(item.src.indexOf('data:image') == 0) {
                phonepic = item.src;
                return;
            }
            if(item.src.indexOf('http://fanbaoyundian.com/') ==0) {
                var imageSource = $(item).parent().parent().find('input').attr('src');
                phonepic = imageSource;
                return;
            }
        });
        jsonData['phonepic'] = phonepic;
        /*$('.homePagePicture .homePagePictureGroup img').each(function(index, item){
            //商品主图
            if(item.src.indexOf('data:image') == 0) {
                pic.push(item.src);
                return;
            }
            if(item.src.indexOf('http://fanbaoyundian.com/') ==0) {
                var imageSource = $(item).parent().parent().find('input').attr('src');
                pic.push(imageSource);
                return;
            }
        });*/
        //【商品图片信息】
        var goodsImgDom =  $('input[name="goodsImg"]:checked');
        var type = goodsImgDom.val();
        jsonData['type'] = type;
        var pic = [];
        var details = [];
        if(type == '1') {
            //selectTBaoImage
            $('.selectTBaoImage .goodsMainPic .addmainimg img').each(function(index, item){
                pic.push(item.getAttribute('src'));
            });
            details = UM.getEditor('myEditor').getContent();
        } else {
            //uploadDetailImage
            console.info('上传详情页图片');
            $('.uploadDetailImage .goodsMainPic .addmainimg img').each(function(index, item){
                //商品主图
                if(item.src.indexOf('data:image') == 0) {
                    pic.push(item.src);
                    return;
                }
                if(item.src.indexOf('http://fanbaoyundian.com/') ==0) {
                    var imageSource = $(item).parent().parent().find('input').attr('src');
                    pic.push(imageSource);
                    return;
                }
            });
            details = [];
            $('.uploadDetailImage .goodsDetailPic .addmainimg img').each(function(index, item){
                //商品主图
                if(item.src.indexOf('data:image') == 0) {
                    details.push(item.src);
                    return;
                }
                if(item.src.indexOf('http://fanbaoyundian.com/') ==0) {
                    var imageSource = $(item).parent().parent().find('input').attr('src');
                    details.push(imageSource);
                    return;
                }
            });
        }
        jsonData['pic'] = pic;
        jsonData['details'] = details;
        return jsonData;
    },
    inputIsChange: function(){
        var me = this;
            $('input').on('change',function(){
            var value = $(this).val();
            $.each($(this)[0].classList,function(index,item){
                if(item.indexOf('experienceform')>=0) {
                    if(value) {
                        $('span.'+item).hide();
                    } else {
                        $('span.'+item).show();
                    }
                }
            });
            if($(this).attr('name') == 'goodsurl') {
                /*$('.goodsSource .upDetailImg').click();
                $('.goodsSource .chooseTbDetail').click();*/
                me.getTaboDetailPage();
            }
        });
    },
    isNormalSupplier: true,                     //是否是普通会员
    isNeedPayToRelease: true,                   //是否需要付费：默认需要付费
    judgeNormalSupply: function(){
        // 判断供应商类型
        var me = this;
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activitydelete/levelInfo",
            data: {
                uid: uid,
                token: token,
                timestamp:new Date().getTime()/1000
            },
            success: function(data) {
                me.isNormalSupplier = false;
                me.isNeedPayToRelease = true;
                if(me.shopNameArray.length == 0) return;
                if(data.state==0) {
                    //普通会员需要付费
                    me.isNeedPayToRelease = true;
                    $(".supplyType").css("display","block");
                    $(".supplyType .maskText").html("您当前为普通供应商，发布体验活动次数已用完。升级VIP后，发布次数和商品数量无限制。");
                    $(".alertTextNormalSupply").css("display","inline-block");
                    $(".numbersText").css("display","none");
                } else if (data.state==2) {
                    //有一次免费机会的普通会员
                    me.isNormalSupplier = true;
                    me.isNeedPayToRelease = false;
                    $(".supplyType").css("display","block");
                    $(".supplyType .maskText").html('您当前为普通供应商，仅可发布<span style="color: #D84C29;">1次</span>体验活动，且体验商品数量<span style="color: #D84C29;">仅限5份</span>。<br>升级VIP后，发布次数和商品数量无限制。');
                    $(".alertTextNormalSupply").css("display","inline-block");
                    $(".numbersText").css("display","none");
                } else if (data.state==1) {
                    //会员
                    me.isNeedPayToRelease = false;
                    $(".supplyType").css("display","none");
                    $(".alertTextNormalSupply").css("display","none");
                }
            },
            error: function(msg) {
                console.log(msg);
                //					alert(JSON.stringify(msg));
            }
        });
    },
    closeMaskDiv: function(){
        //关闭遮罩
        $('.closeSpan,.closeImg').on('click',function(){
            var maskDomCls = $(this).data('for');
            $('.'+maskDomCls).hide();
        });
    },
    isReadDetailTabao: false,
    /*readTBaoDetailMain: null,       //主图
     readTBaoDetailDetail: null,     //详情页*/
    setResponseDraftData: function(data){
        //设置草稿数据
        var me = this;
        if(data['starttime'].indexOf('1970') == 0) {
            data['starttime'] = "";
        }
        for(var index in data) {
            //遍历草稿数据
            if($('input[name='+index+']').length > 0){
                if(index == 'shopid') {
                    for(var i=0;i<me.shopNameArray.length;i++) {
                        if(me.shopNameArray[i].id == (data[index])){
                            $('input[name='+index+']').val(me.shopNameArray[i].shopname);
                            $('input[name='+index+']').data('value',me.shopNameArray[i].id);
                        }
                    }
                    continue;
                }
                if(index == 'service') {
                    $('.activityInstructionWapper input').each(function(subIndex,item){
                        if(data[index].indexOf($(item).data('id')) >= 0) {
                            $(item).click();
                        }
                    })
                    continue;
                }
                //搜索下单
                if(index == 'ordertype') {
                    if(data['ordertype'] == 2) {
                        for(var i = 0;i < data['search'].length;i++){
                            if(i == 0){
                                var search = data['search'][i];
                                $.each(data['search'][i],function(key,item){
                                    if(key == 'keywords') $($('.searchWaySubPanel').get(0)).find('input[name=keywords]').val(item);
                                    if(key == 'ordertype') {
                                        var $input = $($('.searchWaySubPanel').get(0)).find('input[name=orderway]');
                                        $input.parent().find('a').each(function(index,item){
                                            if(search[key] == $(item).data('value')) {
                                                $input.val(item.innerHTML);
                                                $input.data('value',$(item).data('value'));
                                            }
                                        });
                                    }
                                    if(key == 'filtercondition') $($('.searchWaySubPanel').get(0)).find('input[name=filtercondition]').val(item);
                                    if(key == 'pricerange' && item) {
                                        $($('.searchWaySubPanel').get(0)).find('input[name=filtercondition]').click();
                                        $($('.searchWaySubPanel').get(0)).find('input[name=firstprice]').val(item.split('-')[0]);
                                        $($('.searchWaySubPanel').get(0)).find('input[name=secondprice]').val(item.split('-')[1]);
                                    }
                                    if(key == 'address') $($('.searchWaySubPanel').get(0)).find('input[name=address]').val(item);
                                    if(key == 'categroy') $($('.searchWaySubPanel').get(0)).find('input[name=categroy]').val(item);
                                    if(key == 'page') $($('.searchWaySubPanel').get(0)).find('input[name=page]').val(item);
                                });
                                continue;
                            }
                            var cloneWay = $($('.searchWay').get(0)).clone(true);
                            var addCloneWay = cloneWay.removeClass('isFirst');
                            addCloneWay.data('index',me.searchWayInfo[i].id);
                            addCloneWay.find('span').get(0).innerHTML = me.searchWayInfo[i].name;
                            $('.addSearchWay').before(addCloneWay);
                            var cloneWayPanel = $($('.searchWaySubPanel').get(0)).clone(true);
                            cloneWayPanel.attr('id',me.searchWayInfo[i].id);
                            $('.searchOrderPanelBody').append(cloneWayPanel);
                            $(cloneWayPanel).find('input').val('');
                            if($(cloneWayPanel).find('input[name=filtercondition]').is(':checked')) {
                                $(cloneWayPanel).find('input[name=filtercondition]').click();
                                $(cloneWayPanel).find('.filterConditionPanel').hide();
                            }
                            var search = data['search'][i];
                            $.each(data['search'][i],function(key,item){
                                console.info(key,item,111);
                                if(key == 'keywords') $(cloneWayPanel).find('input[name=keywords]').val(item);
                                if(key == 'ordertype') {
                                    var $input = $(cloneWayPanel).find('input[name=orderway]');
                                    $input.parent().find('a').each(function(index,item){
                                        if(search[key] == $(item).data('value')) {
                                            $input.val(item.innerHTML);
                                            $input.data('value',$(item).data('value'));
                                        }
                                    });
                                }
                                if(key == 'filtercondition') $(cloneWayPanel).find('input[name=filtercondition]').val(item);
                                if(key == 'pricerange') {
                                    if(!YouXin.isEmpty(item) && item != '-'){
                                        if(!$(cloneWayPanel).find('input[name="filtercondition"]').is(':checked')) {
                                            $(cloneWayPanel).find('input[name="filtercondition"]').click();
                                        }
                                        $(cloneWayPanel).find('input[name=firstprice]').val(item.split('-')[0]);
                                        $(cloneWayPanel).find('input[name=secondprice]').val(item.split('-')[1]);
                                    }
                                }
                                if(key == 'address') {
                                    if(!YouXin.isEmpty(item)) {
                                        if(!$(cloneWayPanel).find('input[name="filtercondition"]').is(':checked')) {
                                            $(cloneWayPanel).find('input[name="filtercondition"]').click();
                                        }
                                        $(cloneWayPanel).find('.filterConditionPanel').show();
                                        $(cloneWayPanel).find('input[name=address]').val(item);
                                    }
                                }
                                if(key == 'categroy') $(cloneWayPanel).find('input[name=categroy]').val(item);
                                if(key == 'page') $(cloneWayPanel).find('input[name=page]').val(item);
                            });
                        }
                    } else {
                        $('.tklPlaceOrder input').click();
                    }
                    continue;
                }
                if($('input[name='+index+']').parent().hasClass('dropdown')) {
                    //是下拉列表
                    $($('input[name='+index+']').parent().find('a')).each(function(subIndex,item){
                        if($(item).data('value') == data[index]) {
                            $('input[name='+index+']').val($(item).html());
                            $('input[name='+index+']').data('value',$(item).data('value'));
                        }
                    })
                    continue;
                }
                $('input[name='+index+']').val(data[index]);
                continue;
            }
            if(index == 'type') {
                if(data[index] == 2) {
                    //上传详情页
                    for(var i=0; i < data['pic'].length; i++) {
                        $('.uploadDetailImage #uploadMainImageList .addmainimg img').get(i).src = data['pic'][i];
                        $($('.uploadDetailImage #uploadMainImageList .addmainimg img').get(i)).data('isdraft','1');
                        $($('.uploadDetailImage #uploadMainImageList .addmainimg input').get(i)).attr('src',data['pic'][i]);
                    }
                    for(var i=0; i < data['details'].length; i++) {
                        $('.uploadDetailImage .goodsDetailPic .addmainimg img').get(i).src = data['details'][i];
                        $($('.uploadDetailImage .goodsDetailPic .addmainimg input').get(i)).attr('src',data['pic'][i]);
                    }
                } else {
                    //淘宝详情页
                    me.isReadDetailTabao = true;                        //读取的草稿是淘宝详情页
                    $('.chooseTbDetail').click();
                    for(var i=0; i < data['pic'].length; i++) {
                        $('.selectTBaoImage #selectTBaoMainList .addmainimg img').get(i).src = data['pic'][i];
                        $($('.selectTBaoImage #selectTBaoMainList .addmainimg img').get(i)).data('isdraft','1');
                        $($('.selectTBaoImage #selectTBaoMainList .addmainimg input').get(i)).attr('src',data['pic'][i]);
                    }
                    UM.getEditor('myEditor').setContent(data['details']);
                }
                continue;
            }
            if(index == 'phonepic') {
                if(data[index]) {
                    $('.homePagePicture .homePagePictureGroup img')[0].src = data[index];
                    $($('.homePagePicture .homePagePictureGroup input')[0]).attr('src',data[index]);
                }
                continue;
            }
            if($('textarea[name='+index+']').length > 0){
                $('textarea[name='+index+']').val(data[index]);
                continue;
            }
        }
        $($('.searchWay').get(0)).click();              //最后选中第一个搜索下单方式
        this.resetShopName();
    },
    convertImgToBase64: function(url, callback, outputFormat){
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image();
        img.crossOrigin = '*';
        img.onload = function(){
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img,0,0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg');
            callback.call(this, dataURL);
            canvas = null;
        };
        img.src = url;
    },
    draftID: null,
    readSaveDraft: function(){
        //读取草稿
        var me = this;
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apib/Experience/getExperience",
            data: {
                uid: uid,
                token: token
            },
            success: function(data) {
                if(data.state == 0) return;
                if(data.state == 1) {
                    var draftdata = data.data;
                    if(draftdata.id) me.draftID = draftdata.id;
                    console.info(draftdata,'有草稿数据');
                    me.setResponseDraftData(draftdata);
                } else {
                    console.info('无草稿数据!');
                }
            },
            error: function(msg) {
                console.log(msg);
            }
        });
    },
    getDraftDataId: function(){
        var me = this;
        $.ajax({
            type: "post",
            url: "https://app.fanbaoyundian.com/apiapiextend/apib/Experience/getExperience",
            data: {
                uid: uid,
                token: token
            },
            success: function(data) {
                if(data.state == 0) return;
                if(data.state == 1) {
                    var draftdata = data.data;
                    if(draftdata.id) me.draftID = draftdata.id;
                } else {
                    console.info('无草稿数据!');
                }
            },
            error: function(msg) {
                console.log(msg);
            }
        });
    },
    initPageEvent: function(){
        this.registerDropMenu();            //下拉菜单设置
        this.initCipher();                  //初始化暗号
        this.initDatetimepicker();          //初始化时间控件
        this.wordRangePrompt();             //设置文本范围提示
        this.copyCipher();                  //复制暗号
        this.userPlaceOrderWay();           //【搜索下单】/【淘口令下单】切换选择面板
        this.searchWayOption();             //搜索下单方式点击操作
        this.registerSearchWay();           //添加搜索下单方式
        this.searchFilterCondition();       //设置筛选条件
        this.selectUploadImage();           //设置上传图片方式
        this.triggerUploadInput();          //触发上传图片标签
        this.dragCommMainImage();           //拖拽商品主图
        this.uploadCommMainImage();         //上传商品主图input标签改变之后
        this.doSubmitExperienceGoods();     //提交体验商品
        this.inputIsChange();               //选择框状态改变
        this.doSaveDraft();                 //保存草稿
        this.closeMaskDiv();                //手动关闭遮罩
    },
    initOperation: function(){
        //进入页面要进行的初始化操作
        var me = this;
        me.createLoading();
        this.getUserInfo();
        //获取用户信息
        this.getUserShop();                 //获取用户绑定的店铺
        this.getActivityAndService();       //用户对应的活动和增值服务并渲染
        this.readSaveDraft();               //读取保存的草稿数据
    },
    initPage: function(){
        //this.judge
        this.initOperation();
        this.initPageEvent();
    }
};
releaseexperienceactivity.initPage();

function convertImgToBase64(url, callback, outputFormat){
    return;
    console.info(url,11111111);             //后端返回
    url = 'http://img1.360buyimg.com/da/jfs/t16462/268/123651847/166148/c59dcd77/5a28a0ddNde1314d8.jpg';//淘宝的
    console.info(url,22222222);
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image();
    img.crossOrigin = '*';
    img.onload = function(){
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}