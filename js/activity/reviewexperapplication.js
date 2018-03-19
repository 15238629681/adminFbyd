var uid,token;
(function(){
	var reviewexperapplication = {
        userinfo: null,										//当前登录用户的信息
        issueGoodsListArr: null,							//已发布的商品数组
        gridRowsData: [],
        totalPage: 1,                                       //当前表格的总页数
        currentPage: 1,                                     //当前所处页面数
        messageWindow: null,                                //弹窗提示对象
        isShowEvaluatePage: false,                          //是否显示了评价页
        //获取用户信息
		getUserInfo: function(){
            this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
            uid = this.userinfo.uid;
            token = this.userinfo.token;
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
        //获取用户发布的商品
        getUserIssueGoods: function(){
			var me = this;
            $.ajax({
                type: "post",
                url: "https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/getAllgood",
                data: {
                    token: token,
                    uid: uid
                },
                success: function(data) {
                	if(data.state != 1) return;
                	me.issueGoodsListArr = data.data;
                    if(me.issueGoodsListArr.length == 0) {
                        alert("请先去发布体验商品，再来审核！");
                    } else {
                    	$('.activityGoods .dropdown-menu').empty();
                        for(var i = 0; i < me.issueGoodsListArr.length; i++) {
                            $(".activityGoods .dropdown-menu").append('<li data-id=' + me.issueGoodsListArr[i].id + '><a>' + me.issueGoodsListArr[i].shorttitle + '</a></li>');
                        }
                        me.doRegisterPageFirstEvent();
                    }
                },
                error: function(msg) {
                    console.log(msg);
                }
            });
		},
        //搜索查询按钮点击：所有申请者
        searchButtonClick: function(){
			var me = this;
			$('.SearchButton').click(function(event){
                //if(!me.currentRowData) return;
			    if($(this).hasClass('activeLi'))  return;
				$('.search-status-button-panel li').each(function(index,item){
					$(item).removeClass('activeLi');
				});
				$(this).addClass('activeLi');
				me.searchActiveExperiencer(false);
			});
			$('.formSearchButton').click(function(event){
                me.searchActiveExperiencer(true);
            });
		},
        getSearchCondition: function(){
        	//获取查询条件
			var condition = {};
			var shopid =  $('#activityGoodID').data('id');
            condition['shopid'] = shopid;
			var page =  $('.pageWapper li.active').find('a').html();
			if(page) {
                condition['page'] = page;
            } else {
                condition['page'] = 1;
			}
            condition['count'] = 10;
			var status = $('#searchOrderTypeID').data('id');
            condition['status'] = status;
            var content = $('#isFillExcuse').data('id');
            condition['content'] = content;
            var type = 1;
            $('.search-status-button-panel li').each(function(index,item){
            	if($(item).hasClass('activeLi')) {
            		type = $(item).data('id');
				}
			});
            condition['type'] = type;
            var order = $('#searchOrderContent').val();
            condition['order'] = !order?"":order;
            return condition;
		},
        //触发查询活动商品对应的体验者
        searchActiveExperiencer: function(flag){
            var me = this;
            var condition = me.getSearchCondition();
            if(flag) {
                condition['type'] = 0;
                $($('.contentBlock .SearchButton').get(0)).click();
            }
            this.doSubmitSearchData(condition,flag);
            if(!flag) this.doQueryGroupData(condition);
		},
        searchActiveExperiencerByPage: function(flag,currentPage){
            var me = this;
            var condition = me.getSearchCondition();
            this.doSubmitSearchData(condition,flag,currentPage);
        },
        doExportExcelRequest: function(){
            var me = this;
            if($('.detailTable tbody').find('tr').length == 0) {
                me.messageWindow.update('无匹配的数据!');
                me.messageWindow.show();
                return;
            }
            var condition = me.getSearchCondition();
            YouXin.apply(condition,{excel:'1'});
            this.doSubmitSearchData(condition,false,me.currentPage);
        },
        //查询请求的数据
        doSubmitSearchData: function(condition, flag, currentPage){
			var me = this;
            condition['token'] = token;
            condition['uid'] = uid;
            if(currentPage) {
                condition['page'] = currentPage;
                me.currentPage = currentPage;
            } else {
                condition['page'] = 1;
                me.currentPage = 1;
            }
            console.info(condition);
            $.ajax({
                type: "post",
                url: "https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/getAlluser",
                data: condition,
                success: function(data) {
                    if(condition['excel']) {
                        window.open(data);
                        return;
                    }
                    if(data.state == 2) {
                        $('.detailTable tbody').html('<div style="position: absolute;text-align: center;width: 100%;margin-top: 50px;">无匹配的数据</div>');
                        $('.pageWapper').hide();
                        return;
                    }
                	if(data.state != 1) return;
                    me.gridRowsData = data.data.data;                       //当前显示也得行记录
                    if(flag) me.setStatusTypeNum(data.data.typenum);        //显示状态按钮数据
                    //me.setStatusTypeNum(data.data.typenum);               //显示状态按钮数据
                    me.totalPage = data.data.sum;
                    me.renderGridData();
                    me.setPagingBar();
                    if(me.totalPage > 1) {
                        $('.pageWapper').show();
                    } else {
                        $('.pageWapper').hide();
                    }
                },
                error: function(msg) {
                    console.log(msg);
                }
            });
		},
        //查询所有的分类数据
        doQueryGroupData: function(condition){
            var me = this;
            condition['token'] = token;
            condition['uid'] = uid;
            condition['page'] = 1;
            condition['type'] = 0;
            console.info(condition);
            $.ajax({
                type: "post",
                url: "https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/getAlluser",
                data: condition,
                success: function(data) {
                    if(data.state == 2) {
                        $('.detailTable tbody').html('<div style="position: absolute;text-align: center;width: 100%;margin-top: 50px;">无匹配的数据</div>');
                        $('.pageWapper').hide();
                        return;
                    }
                    if(data.state != 1) return;
                    me.setStatusTypeNum(data.data.typenum);        //显示状态按钮数据
                },
                error: function(msg) {
                    console.log(msg);
                }
            });
        },
        //grid渲染完成之后，设置分页工具栏
        setPagingBar: function(){
            var me = this;
            Page({
                num: me.totalPage, //页码数
                startnum: me.currentPage, //指定页码
                elem: $('#page2'), //指定的元素
                callback: me.toAssignPage.bind(me)
            });
        },
        toAssignPage: function(num){
            var me = this;
            me.searchActiveExperiencerByPage(false,num);
        },
        //根据行记录数据渲染Grid数据
        renderGridData: function(){
            var me = this;
            $('.detailTable tbody').empty();
            if(me.gridRowsData.length == 0) {
                $('.detailTable tbody').html('无匹配的数据');
                return;
            }
            //if(me.totalPage == 1) $('.pageWapper').hide();
            for(var index = 0;index < me.gridRowsData.length; index++) {
                var rowData = me.gridRowsData[index];
                var aliwangwang = rowData['aliwangwang'];       //阿里旺旺
                var createtime = rowData['createtime'];         //申请时间
                var headimgurl = rowData['headimgurl'];         //体验者头像
                var id = rowData['id'];                         //申请体验id
                var ordernumber = rowData['ordernumber'];       //订单号
                var phone = rowData['phone'];                    //手机号
                var reportscore = rowData['reportscore'];       //报告评分
                var singlerating = rowData['singlerating'];     //下单评分
                var status = rowData['status'];                  //当前状态值
                var statusvalue = rowData['statusvalue'];       //体验状态
                var sum = rowData['sum'];                        //
                var taskid = rowData['taskid'];                  //体验产品id
                var userid = rowData['userid'];                  //申请体验用户id
                var username = rowData['username'];              //用户名
                var wechat = rowData['wechat'];                  //微信名
                var tuihui = rowData['tuihui'];                  //退回
                var from = rowData['from'];                      //来源平台
                var tr =  me.getGridRowDom();
                //设置头像
                $(tr).find('.headImg').attr('src',headimgurl);
                //设置用户名
                $(tr).find('.userName').html(username);
                //设置下单评分
                $(tr).find('.orderAppraise span').html('下单' + me.isEmptyReturnDetafult(singlerating,'0.0') + "：");
                $(tr).find('.orderAppraise .appraiseScore').css({'width':singlerating/5*100 + '%'});
                //设置报告
                $(tr).find('.placeOrder span').html('报告' + me.isEmptyReturnDetafult(reportscore,'0.0') + "：");
                $(tr).find('.placeOrder .appraiseScore').css({'width':reportscore/5*100 + '%'});
                //设置网店账号/手机号
                $(tr).find('.applyForPhone .accountNum span').html(me.isEmptyReturnDetafult(aliwangwang,'无'));
                $(tr).find('.applyForPhone .phoneNum span').html(me.isEmptyReturnDetafult(phone,'无'));
                //设置申请时间
                $(tr).find('.applyForTime').html(me.isEmptyReturnDetafult(createtime,'无'));
                //设置体验状态
                $(tr).find('.applyForStatus').html(me.isEmptyReturnDetafult(statusvalue,'无'));
                //设置体验状态
                $(tr).find('.applyForOrderNum .currentOrderNumber').html(me.isEmptyReturnDetafult(ordernumber,'无'));
                if(from == 1) {
                    $(tr).find('.applyForOrderNum img').attr('src','../img/activity/tb.gif');
                } else {
                    $(tr).find('.applyForOrderNum img').attr('src','../img/activity/tm.gif');
                }
                console.info(rowData,status);
                //设置用户操作
                switch (parseInt(status)) {
                    case 1:
                        console.info('申请，待审核/体验资格已释放');
                        $(tr).find('.applyForOption').html('<span class="agreeExperienceBtn">同意体验资格</span>');
                        break;
                    case -2:
                        console.info('申请未通过/未完成');
                        $(tr).find('.applyForOption').html('');
                        $(tr).find('applyForStatus').html('申请未通过');
                        break;
                    case 2:
                        console.info('已通过，待下单');
                        if(tuihui == 1) {
                            $(tr).find('.applyForOption').html('<span class="releaseExperienceBtn">释放</span><span class="releaseExperiencePrompt">!</span>');
                        } else {
                            $(tr).find('.applyForOption').html('');
                        }
                        break;
                    case 3:
                        console.info('已下单，待审核单号');
                        $(tr).find('.applyForOption').html('<span class="checkOrderNumBtn">审核订单号</span><span class="checkOrderNumPrompt">!</span>');
                        break;
                    case 4:
                        console.info('已确认订单号,待提交体验报告');
                        $(tr).find('.applyForOption').html('');
                        break;
                    case 5:
                        console.info('已提交体验报告,待返款');
                        $(tr).find('.applyForOption').html('<span class="verifyOrderCompleteBtn">确认体验报告</span><span class="verifyOrderCompletePrompt">!</span><span class="checkExperienceReportBtn">查看体验报告</span>');
                        break;
                    case 6:
                        console.info('已完成');
                        $(tr).find('.applyForOption').html('<span class="checkExperienceReportBtn">查看体验报告</span><span class="evaluateExperiencerBtn">评价体验者</span>');
                        break;
                    case 8:
                        console.info('待修改');
                        $(tr).find('.applyForOption').html('');
                        $(tr).find('.applyForOrderNum .orderInfoBlock span').addClass('lastOrderNumber');
                        break;
                    case 7:
                        console.info('报告已评价');
                        $(tr).find('.applyForOption').html('<span class="checkExperienceReportBtn">查看体验报告</span>');
                        $(tr).find('.applyForStatus').html('已完成');
                        break;
                    case 888:
                        $(tr).find('.applyForOption').html('');
                        $(tr).find('.applyForStatus').html(rowData.statusvalue);
                        break;
                }
                $(tr).data('rowdata',rowData);
                $('.detailTable tbody').append(tr);
            }
            me.getGridRowDom();
            me.registerWithGrid();      //注册Grid中的相关事件
        },
        //判断是否为空，并返回默认值
        isEmptyReturnDetafult: function(value,emptyStr){
            return value?value:emptyStr + "";
        },
        //获取Grid中的行对象
        getGridRowDom: function(){
            var gridRowStr = '<tr><td class="userInfoTd applyForUser"><div class="userInfo"><img class="headImg" src="../img/activity/tb.gif" alt=""><div class="detailInfo"><div class="userNameBlock">' +
			'<span class="userName">荷塘月色</span><span class="searchUserInfoBtn">用户信息</span></div><div class="orderAppraise"><span>下单3.5：</span><div class="startList"><div class="appraiseScore"></div></div></div>' +
			'<div class="placeOrder"><span>报告3.5：</span>	<div class="startList"><div class="appraiseScore"></div>	</div></div></div></div></td>' +
			'<td class="accountInfo applyForPhone"><div class="accountNum">淘宝账号：<span>taobao123</span></div><div class="phoneNum">手机号: <span>123456789100</span>	</div></td>' +
            '<td class="applyForTime">2017-07-14 10:00:00</td><td class="applyForStatus">已通过,待下单</td><td class="orderInfoTd applyForOrderNum"><img src="../img/activity/tm.gif" alt="">' +
            '<div class="orderInfoBlock"><span class="currentOrderNumber">1234567891023</span></div></td>' +
            '<td class="userOperateTd applyForOption"><span class="releaseExperienceBtn">释放</span><span class="releaseExperiencePrompt">!</span></td></tr>';
            return $(gridRowStr).get(0);
        },
        setStatusTypeNum: function(statusData){
            //设置状态数据
            $('.search-status-button-panel li').each(function(index,item){
                //console.info(item);
                var hasData = false;
                var keyData = 0;
                for(var key in statusData) {
                    if($(item).hasClass(key)) {
                        hasData = true;
                        keyData = statusData[key];
                    }
                }
                if(hasData) {
                    $(item).find('span')[0].innerHTML = '(' + keyData +')'
                } else {
                    $(item).find('span')[0].innerHTML = '(' + keyData +')';
                }
            });
        },
        //注册事件
        doRegisterPageFirstEvent: function(){
        	this.registerDropMenu();                        //下拉列表事件
            this.registerPagingSearchBtn();                 //搜索分页中的按钮点击事件
            this.doExportExcelEvent();                      //设置导出Excel
        	this.doDefaultOption();                         //执行默认操作，选中【申请中，待审核】按钮
		},
        doExportExcelEvent: function(){
            var me = this;
            $('.search-status-button-panel .exportExcelBtn').click(function(event){
                me.doExportExcelRequest();
            });
        },
        registerPagingSearchBtn: function(){
            var me = this;
            $('#searchPageBtnID').show();
            $('#searchPageBtnID').on('click',function(event){
                var $input = $(this).parent().find('.pageInput');
                var inputVal = $input.val();
                if(inputVal<=0) {
                    me.messageWindow.update('输入的值不正确');
                    me.messageWindow.show();
                    $input.val('');
                    return;
                }
                if(inputVal > me.totalPage) {
                    me.messageWindow.update('输入的值过大');
                    me.messageWindow.show();
                    $input.val('');
                    return;
                }
                me.searchActiveExperiencerByPage(false,inputVal);
                $input.val('');
            });
        },
        registerEvalPageEvent: function(){
            this.toSelectImgEvaluate();                     //输入评分/报告评分
            this.doSubmitEvalute();                         //提交评价用户数据
            this.searchButtonClick();                       //搜索按钮事件
            this.evalPageLookReport();                      //评论页查看体验报告
        },
        //评论页查看体验报告
        evalPageLookReport: function(){
            var me = this;
            $('#evaluateUserID .lookReportBtn').click(function(){
                me.lookExperienceReport();
            });
        },
        registerHistoryEvent: function(){
            var me = this;
            window.onpopstate = function(event) {
                if(me.isShowEvaluatePage) {
                    me.isShowEvaluatePage = false;
                    $('#part-right .right-container').show();
                    $('#loaction').html('当前位置:管理后台>活动管理>审核体验申请');
                    $('#evaluateUserID').hide();
                    return;
                }
                if(event.state.page) {
                    me.isShowEvaluatePage = true;
                    $('#part-right .right-container').hide();
                    $('#loaction').html('当前位置:管理后台>活动管理>审核体验申请>评价体验者');
                    $('#evaluateUserID').show();
                }
            };
        },
        //下单评分/报告评分
        toSelectImgEvaluate: function(){
            var me = this;
            $('.placeOrderScore .placeOrderInput img').mouseenter(function(event){
                if(!me.currentRowData) return;
                $(this).prevAll().attr('src','../img/activity/onestart2x.png');
                $(this).prevAll().data('isSelect','1');
                $(this).attr('src','../img/activity/onestart2x.png');
                $(this).data('isSelect','1');
                $(this).nextAll().attr('src','../img/activity/nostart2x.png');
                $(this).nextAll().data('isSelect','0');
            });
            $('.placeReportScore .placeOrderInput img').mouseenter(function(event){
                if(!me.currentRowData) return;
                $(this).prevAll().attr('src','../img/activity/onestart2x.png');
                $(this).prevAll().data('isSelect','1');
                $(this).attr('src','../img/activity/onestart2x.png');
                $(this).data('isSelect','1');
                $(this).nextAll().attr('src','../img/activity/nostart2x.png');
                $(this).nextAll().data('isSelect','0');
            });
        },
        doSubmitEvalute: function(){
            //提交评分
            var me = this;
            $('.evaluateUser .submitBtn').click(function(){
                if(!me.currentRowData) return;
                var singlerating = 0;
                var reportscore = 0;
                $('.placeOrderScore .placeOrderInput img').each(function(index,item){
                    if($(item).data('isSelect') == 1 || $(item).data('isSelect') === undefined) {
                        singlerating++;
                    }
                });
                $('.placeReportScore .placeOrderInput img').each(function(index,item){
                    if($(item).data('isSelect') == 1 || $(item).data('isSelect') === undefined) {
                        reportscore++;
                    }
                });
                var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/evaluate';
                var id = me.currentRowData.id;
                var userid = me.currentRowData.userid;
                var params = {token:token,uid:uid,id:id,userid:userid,singlerating:singlerating,reportscore:reportscore};
                YouXin.getAsyncData(url, params, 'POST', me.doSubmitEvaluteCallBack, me);
            });
        },
        doSubmitEvaluteCallBack: function(data){
            if(data.state != 1) return;
            this.messageWindow.update('评价成功!');
            this.messageWindow.show();
            history.back();
            $('.formSearchButton').click();
        },
        //注册Grid中元素事件
        registerWithGrid: function(){
        	this.setGridRelatedPrompt();                //设置Grid中的提示窗口
            this.setGridRelatedBtn();                   //设置Grid中的按钮操作动作
            this.setMaskWindowClose();                  //设置遮罩关闭操作
            this.setAuditOrderNum();
		},
        //设置Grid中相关提示框
        setGridRelatedPrompt: function(){
            $('.detailTable .releaseExperiencePrompt').tooltip({
                title: '改体验者48小时内未提交订单号，您可以点击释放此体验名额给其他申请体验者。',
                tipClass: 'tooltip-info',
                placement: 'bottom'
            });
            $('.detailTable .checkOrderNumPrompt').tooltip({
                title: '若体验者提交的订单号有误，报错后系统将提示体验者修改订单号，否则无法完成返款。',
                tipClass: 'tooltip-info',
                placement: 'bottom'
            });
            $('.detailTable .verifyOrderCompletePrompt').tooltip({
                title: '请先核实体验者已确认收货后再确认体验报告，确认体验报告后，系统将把您冻结的货款返款给体验者。',
                tipClass: 'tooltip-info',
                placement: 'bottom'
            });
            $('.orderAppraise span,.orderAppraise .startList').tooltip({
                title: '体验者的下单评分：指该体验者历次活动中是否严格按照要求完成下单购买的过程',
                tipClass: 'tooltip-info',
                placement: 'bottom'
            });
            $('.placeOrder span,.placeOrder .startList').tooltip({
                title: '体验者的报告评分：指该体验者历次体验活动中提交的体验报告的质量高低。',
                //tipClass: 'promptTooltip',
                tipClass: 'tooltip-info',
                placement: 'bottom'
            });
		},
        //设置Grid中按钮操作的事件
        currentRowData: null,              //当操作行的记录
        setGridRelatedBtn: function(){
            var me = this;
            $('.searchUserInfoBtn').click(function(event){
                me.currentRowData = $(this).parent().parent().parent().parent().parent().data('rowdata');
                me.lookUserInfo();
            });
            $('.agreeExperienceBtn').click(function(event){
                me.currentRowData = $(this).parent().parent().data('rowdata');
                me.agreeExperiencer();
            });
            $('.releaseExperienceBtn').click(function(event){
                me.currentRowData = $(this).parent().parent().data('rowdata');
                console.info('释放体验资格');
                me.releaseExperience();
            });
            $('.checkOrderNumBtn').click(function(event){
                //console.info(this,'审核订单号');
                me.currentRowData = $(this).parent().parent().data('rowdata');
                $('.affirmCheckOrder').show();
            });
            $('.verifyOrderCompleteBtn').click(function(event){
                me.currentRowData = $(this).parent().parent().data('rowdata');
                me.verifyOrderComplete();
            });
            $('.checkExperienceReportBtn').click(function(event){
                me.currentRowData = $(this).parent().parent().data('rowdata');
                me.lookExperienceReport();
            });
            $('.evaluateExperiencerBtn').click(function(event){
                me.currentRowData = $(this).parent().parent().data('rowdata');
                me.toEvaluateExperiencer();
            });
        },
        //查看用户信息
        lookUserInfo: function(){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/userRecord';
            var shopid = $('#activityGoodID').data('id');
            var userid = me.currentRowData.userid;
            var time = me.currentRowData.createtime;
            var goodid = shopid;
            var params = {uid:uid,token:token,userid:userid,goodid:goodid,time:time};
            YouXin.getAsyncData(url,params,'POST',this.lookUserInfoCallBack,this);
        },
        //查看用户信息 - 回调
        lookUserInfoCallBack: function(data){
            if(data.state != 1) return;
            var me = this;
            var userInfo = data.data;
            //设置数据
            //$('.userInfoWindow .userInfoContentTop .userHeadImage img').attr('src',me.currentRowData.headimgurl);       //头像
            $('.userInfoWindow .userInfoContentTop .userHeadImage').css({'background': 'url(' + me.currentRowData.headimgurl + ') no-repeat','background-size': '100% 100%','border-radius': '50%'})
            $('.userInfoWindow .userInfoContentTop .userName').html(me.currentRowData.username);                        //用户名
            $('.userInfoContentBody .userInfoLine .totalTime').html(userInfo.zong);                                     //总申请次数
            $('.userInfoContentBody .userInfoLine .successTime').html(userInfo.success);                                //申请成功次数
            $('.userInfoContentBody .userInfoLine .placeOrderNum').html(userInfo.xia);                                  //下单次数
            var placeScale = (userInfo.xia/userInfo.success * 100).toFixed(2);
            $('.userInfoContentBody .userInfoLine .placeOrderScale').html(userInfo.xiadanlv);                           //下单率
            $('.userInfoContentBody .userInfoLine .reportTime').html(userInfo.bao);                                     //提交报告次数
            var reportScale = (userInfo.bao/userInfo.xia * 100).toFixed(2);
            $('.userInfoContentBody .userInfoLine .reportScale').html(userInfo.baogaolv);                               //提交报告率
            $('.userInfoContentBody .userInfoLine .createtime').html(userInfo.time.substring(0,10));                    //本次申请时间
            $('.userInfoContentBody .monthToPlaceTime').html(userInfo.sanshi);                                          //30天内下单数
            $('.userInfoContentBody .applyForCause').html(userInfo.content);                                            //申请理由
            $('.userInfoWindow').show();
        },
        //同意体验者资格
        agreeExperiencer: function(){
            var me = this;
            var shopid = $('#activityGoodID').data('id');
            var id = me.currentRowData.id;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/agree';
            var params = {token: token,uid: uid,shopid: shopid,id: id};
            YouXin.getAsyncData(url,params,'POST',this.agreeExperiencerCallBack,this);
        },
        //释放体验资格
        releaseExperience: function(){
            var me = this;
            var shopid = $('#activityGoodID').data('id');
            var id = me.currentRowData.id;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/boHui';
            var params = {token: token,uid: uid,shopid: shopid,id: id};
            YouXin.getAsyncData(url,params,'POST',this.releaseExperienceCallBack,this);
        },
        releaseExperienceCallBack: function(data){
            if(data.state != 1) return;
            this.messageWindow.update('释放成功!');
            $('.formSearchButton').click();
        },
        //同意体验者资格 - 请求成功回调
        agreeExperiencerCallBack: function(data){
            if(data.state != 1) return;
            this.messageWindow.update('同意操作成功!');
            $('.formSearchButton').click();
        },
        //设置审核订单号遮罩操作
        setAuditOrderNum: function(){
            var me = this;
            $('.affirmCheckOrder .reportRight').click(function(event){
                me.toAuditExperiencer(true)
            });
            $('.affirmCheckOrder .reportError').click(function(event){
                //$('.affirmCheckOrder').hide();
                me.toAuditExperiencer(false);
            });
        },
        //审核订单号：正确/报错
        toAuditExperiencer: function(flag){
            var me = this;
            var url = flag?'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/istrue':'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/isBaocuo';
            var id = me.currentRowData.id;
            var params = {token:token,uid:uid,id:id};
            YouXin.getAsyncData(url, params, 'POST', this.toAuditExperiencerCallBack, this);
        },
        //审核订单号 - 回调
        toAuditExperiencerCallBack: function(data){
            if(data.state == 2) {
                this.messageWindow.update(data.message);
                this.messageWindow.show();
                return;
            }
            if(data.state != 1) return;
            $('.affirmCheckOrder').hide();
            this.messageWindow.update('操作成功!');
            this.messageWindow.show();
            $('.formSearchButton').click();
        },
        //查看体验报告
        lookExperienceReport: function(){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/lookreport';
            var userid = me.currentRowData.userid;
            var shopid = $('#activityGoodID').data('id');
            var params = {uid:uid,token:token,userid:userid,shopid:shopid};
            YouXin.getAsyncData(url, params, 'POST', this.lookExperienceReportCallBack, this);
        },
        lookExperienceReportCallBack: function(data){
            if(data.state != 1) return;
            var reportDetail = data.listreport[0];
            $('.lookExperienceReport .experienceReportContent').empty();
            $('.lookExperienceReport .experienceReportTop .time').html(reportDetail.addtime);           //时间
            $('.lookExperienceReport .experienceReportTop .title').html(reportDetail.title);            //标题
            var mobileMainPic = document.createElement('img');                                          //主图
            mobileMainPic.src = reportDetail.pic;
            mobileMainPic.style.display = 'block';
            var mobileContent = $(reportDetail.content).find('video').attr('poster','../img/public/videocover.png');
            $('.lookExperienceReport .experienceReportContent').append(mobileMainPic);
            $(reportDetail.content).each(function(index,item){
                if($(item).hasClass('videoDiv')) {
                    $(item).find('video').attr('poster','../img/public/videocover.png');
                }
                $('.lookExperienceReport .experienceReportContent').append(item);
            });
            $('.lookExperienceReport').show();
        },
        //【确认体验报告】
        verifyOrderComplete: function(){
            var me = this;
            var id = me.currentRowData.id;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/isTiyan';
            var params = {uid:uid,token:token,id:id};
            console.info(me.currentRowData,params);
            YouXin.getAsyncData(url, params, 'POST', this.verifyOrderCompleteCallBack, this);
        },
        verifyOrderCompleteCallBack: function(data){
            if(data.state != 1) return;
            $('.formSearchButton').click();
        },
        //评价体验者
        toEvaluateExperiencer: function() {
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/scorez';
            var id = me.currentRowData.id;
            var params = {token:token,uid:uid,id:id}
            YouXin.getAsyncData(url, params, 'POST', this.toEvaluateExperiencerCallBack, this);
        },
        toEvaluateExperiencerCallBack: function(data){
            if(data.state != 1) return;
            var me = this;
            var list = data.list[0];
            $('#part-right .right-container').hide();
            $('#loaction').html('当前位置:管理后台>活动管理>审核体验申请>评价体验者');
            var evaluatePage = $('#evaluateUserID');
            evaluatePage.find('.activeGoodsName img').attr('src',list.mainpic);
            evaluatePage.find('.activeGoodsName .activeGoodsNameFont').html(list.username);
            evaluatePage.find('.TBaccount').html(list.aliwangwang);
            evaluatePage.find('.orderNumber').html(list.ordernumber);
            evaluatePage.show();
            me.isShowEvaluatePage = true;
            history.pushState({page: 1}, "title 1", "?isEval=true");
        },
        //遮罩点击关闭事件
        setMaskWindowClose: function(){
            $('.maskDiv .closeImg').click(function(event){
                console.info('关闭了');
                $('.' + $(this).data('for')).hide();
            });
            $('.userInfoWindow .userInfoWindowBtn').click(function(event){
                $('.' + $(this).data('for')).hide();
            });
            /*$('.lookExperienceReport').click(function(event){
                if(event.target.className.indexOf('lookExperienceReport') >= 0) {
                    $(this).hide();
                }
            });*/
        },
        //执行默认操作，选中【申请中，待审核】按钮
        doDefaultOption: function(){
            $($('.activityGoods .dropdown-menu li a').get(0)).click();						//活动商品第一个下来列表点击
			$($('.fill-order-number .dropdown-menu li a').get(3)).click();					//【搜索项】默认选中订单号
            $($('.fill-excuse .dropdown-menu li a').get(0)).click();						//【是否填写申请理由】默认选中所有

            this.setActiveGoodsByUrlSearch();
            $('.formSearchButton').click();                                                 //查询所有的按钮
            //$($('.SearchButton').get(1)).click();										    //【申请中，待审核】按钮点击
		},
        setActiveGoodsByUrlSearch: function(){
            var shopid = YouXin.getUrlParamsValue('shopid');
            if(shopid) {
                $('.activityGoods .dropdown-menu li').each(function(index,item){
                    if(parseInt($(item).data('id')) == parseInt(shopid)) {
                        $(item).find('a').click();
                    }
                });
            }
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
        //初始化页面操作
		initPage: function(){
            this.createMessage();                           //创建弹窗提示
			this.getUserInfo();
			this.getUserIssueGoods();
            this.registerHistoryEvent();                    //注册历史节点
            this.registerEvalPageEvent();                   //注册评价页面相关事件
		}
	};
	reviewexperapplication.initPage();
})();
