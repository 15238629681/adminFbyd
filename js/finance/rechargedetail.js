!function(){
    var uid,token;
    var rechargedetail = {
        messageWindow: null,                                        //弹窗提示对象
        totalPage: 1,                                               //当前表格的总页数
        currentPage: 1,                                             //当前所处页面数
        gridRowsData: [],                                           //当前页面的表格数据
        currentRowData: null,                                       //当前操作行数据
        loading: null,                                              //加载动画
        currentPage: 1,                                             //当前页面
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
		//搜索下拉事件改变
        searchLatelytimeEvent: function(){
        	var me = this;
        	$('#searchItemInputID').change(function(){
        		var dataId =  $(this).data('id');
                var $starttime = $('.beginTimePicker .starttime');
                var $time_end = $('.beginTimePicker .endtime');
        		if(parseInt(dataId) == 5) {
        			//自定义
                    $(".form-datetime").datetimepicker({
                        weekStart: 1,
                        todayBtn: 1,
                        autoclose: 1,
                        todayHighlight: 1,
                        startView: 2,
                        forceParse: 0,
                        showMeridian: 1,
                        format: 'yyyy-mm-dd hh:ii'
                    });
                    $(".beginRage").datetimepicker("setEndDate", me.getTodyTime());
                    $(".endRage").datetimepicker("setEndDate", me.getTodyTime());
                    return;
                }
                $('.form-datetime').datetimepicker('remove');
                if(parseInt(dataId) == 0) {
                    $starttime.val('');
                    $time_end.val('');
                    return;
                }
                var dayNum = 1;
                if(parseInt(dataId) == 1) {
                    dayNum = 1;
                } else if(parseInt(dataId) == 2) {
                    dayNum = 2;
                } else if(parseInt(dataId) == 3) {
                    dayNum = 7;
                } else if(parseInt(dataId) == 4) {
                    dayNum = 30;
                }
                $starttime.val(me.getTodyTime(dayNum));
                $time_end.val(me.getTodyTime());
			});
		},
		//获取今天的时间
        getTodyTime: function(dayNum) {
            var nowTime = new Date();
            if(dayNum) nowTime.setDate(nowTime.getDate() - dayNum);
            var year = nowTime.getFullYear();
            var month = parseInt(nowTime.getMonth()) + 1;
            var day = nowTime.getDate();
            var hour = nowTime.getHours();
            var minute = nowTime.getMinutes();
            var second = nowTime.getSeconds();
            if(month < 10) month = "0" + month;
            if(day < 10)  day = "0" + day;
            if(hour < 10) hour = "0" + hour;
            if(minute < 10) minute = "0" + minute;
            if(second < 10) second = "0" + second;
            var formatTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            return formatTime;
        },
		//下拉事件
        registerDropMenu: function(){
            $('.dropdown-menu li a').click(function(event){
                var targetValue = this.innerHTML;
                var targetId = $(this).parent().data('id');
                var $targetInput = $(this).parent().parent().parent().find('input');
                $targetInput.val(targetValue);
                $targetInput.data('id',targetId);
                $targetInput.change();
            });
		},
        searchPanelClick: function(){
        	var me = this;
        	$('#part-right .contentBlock .searchBtn').click(function(){
        		me.doSearchSubmit();
			});
		},
		//查询按钮的点击事件
        doSearchSubmit: function(){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Bannersearch/detailed';
            var params = me.getSearchCondition();
            if(parseInt(params['latelytime']) == 0) params['latelytime'] = '';
            me.currentPage = 1;
            YouXin.getAsyncData(url, params, 'POST', me.doSearchSubmitCallBack, me);
        },
        //设置激活页面
        activeCurrentPage: function(currentPage){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Bannersearch/detailed';
            var params = me.getSearchCondition();
            params['page'] = currentPage;
            me.currentPage = currentPage;
            if(parseInt(params['latelytime']) == 0) params['latelytime'] = '';
            YouXin.getAsyncData(url, params, 'POST', me.doSearchSubmitCallBack, me);
        },
        //导出数据到Excel
        doExportExcelRequest: function(){
            var me = this;
            if($('.detailTable tbody').find('tr').length == 0) {
                me.messageWindow.update('无匹配的数据!');
                me.messageWindow.show();
                return;
            }
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Bannersearch/detailed';
            var params = me.getSearchCondition();
            params['page'] = me.currentPage;
            YouXin.apply(params,{excel:'1'});
            YouXin.getAsyncData(url, params, 'POST', me.openDownExcelWindow, me);
        },
        //打开下载窗口
        openDownExcelWindow: function(data){
            window.open(data);
        },
        doSearchSubmitCallBack: function(data){
        	if(data.state != 1) return;
        	var me = this;
            me.totalPage = data.num;
            me.gridRowsData = data.detailedlist;
            me.renderGridData();
            me.setPagingBar();
            me.setGridBodyEvent();
		},
        //渲染GridPanel
        renderGridData: function(){
            var me = this;
            $('.detailTable tbody').empty();
            if(me.gridRowsData.length == 0) {
                $('.detailTable tbody').html('<div style="position: absolute;text-align: center;width: 100%;margin-top: 50px;">无匹配的数据</div>');
                $('.pageWapper').hide();
                return;
            }
            for(var i=0; i<me.gridRowsData.length; i++) {
                var rowData = me.gridRowsData[i];
                var tr =  me.getGridRowDom();
                switch (parseInt(rowData['dealtype'])) {
                    case 0:
                        rowData['rechargeType'] = '系统转账';
                        rowData['dealtypeName'] = '支付宝';
                        break;
                    case 1:
                        rowData['rechargeType'] = '系统转账';
                        rowData['dealtypeName'] = '微信';
                        break;
                    case 2:
                        rowData['rechargeType'] = '系统转账';
                        rowData['dealtypeName'] = '网银';
                        break;
                    case 3:
                        rowData['rechargeType'] = '自助转账';
                        rowData['dealtypeName'] = '支付宝';
                        break;
                    case 4:
                        rowData['rechargeType'] = '自助转账';
                        rowData['dealtypeName'] = '微信';
                        break;
                    case 5:
                        rowData['rechargeType'] = '自助转账';
                        rowData['dealtypeName'] = '网银';
                        break;
                }
                switch (parseInt(rowData['state'])) {
                    case 0:
                        rowData['stateName'] = '待审核';
                        rowData['checktimeName'] = '-';
                        break;
                    case 1:
                        rowData['stateName'] = '交易成功';
                        rowData['checktimeName'] = rowData['checktime'];
                        break;
                    case 2:
                        console.info(rowData);
                        rowData['stateName'] = '交易失败'  + '<span class="rechargeFailure">失败原因</span>';
                        rowData['checktimeName'] = '-';
                        break;
                }
                var result = YouXin.template(tr,rowData);
                var $tr = $(result);
                $tr.data('rowData',rowData)
                $('.detailTable tbody').append($tr);
            }
        },
        //设置Grid的分页栏
        setPagingBar: function(){
            var me = this;
            if(me.totalPage > 1) {
                $('.pageWapper').show();
            } else {
                $('.pageWapper').hide();
            }
            Page({
                num: me.totalPage, //页码数
                startnum: me.currentPage, //指定页码
                elem: $('#page2'), //指定的元素
                callback: me.toAssignPage.bind(me)
            });
        },
        //设置GridBody区域的事件
        setGridBodyEvent: function(){
            var me = this;
            $('.detailTable tbody .rechargeFailure').each(function(index,item){
                console.info($(item).parent().parent().data('rowData'),item);
                var title = $(item).parent().parent().data('rowData').explain;
                $(item).tooltip({
                    title: title,
                    tipClass: 'tooltip-info',
                    placement: 'bottom'
                });
            });
        },
        toAssignPage: function(currentPage){
            var me = this;
            me.activeCurrentPage(currentPage);
        },
		//获取Grid中的行记录
        getGridRowDom: function(){
        	var tr = '<tr>' +
                '<td>{ordernumber}</td>' +
                '<td>{createtime}</td>' +
                '<td>{money}</td>' +
                '<td>{sxuf}</td>' +
                '<td>{totalmoney}</td>' +
                '<td>{rechargeType}</td>' +
                '<td>{dealtypeName}</td>' +
                '<td>{stateName}</td>' +
                '<td>{checktimeName}</td>' +
			'</tr>';
        	return tr;
		},
		//获取查询条件
        getSearchCondition: function(){
            var latelytime = $('#searchItemInputID').data('id');								//搜索时间
            var time_start = $('.beginTimePicker .starttime').val();							//开始时间
            var time_end = $('.beginTimePicker .endtime').val();								//结束时间
            var rechargeType = $('.rechargeTypeItem .rechargeTypeItemInput').data('id');		//充值类型
            var dealtype = $('.rechargeChannel .rechargeChannelInput').data('id');				//充值渠道
            var state = $('.transferStatus .transferStatusInput').data('id');					//到账状态
        	var params = {
        		token: token,
				timestamp: this.getTimeStamp(),
				uid: uid,
				page: 1,
				latelytime: latelytime,
				time_start: time_start,
				time_end: time_end,
                rechargetype: rechargeType,
                dealtype: dealtype,
                state: state
        	};
        	return params;
		},
        //导出Excel表格
        doExportExcelEvent: function(){
            var me = this;
            $('.exportExcelBar .exportExcelBtn').click(function(){
                me.doExportExcelRequest();
            });
        },
        //页面加载完成之后操作一些默认操作
        registerPagingSearchBtn:function(){
            var me = this;
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
                me.activeCurrentPage(inputVal);
                $input.val('');
            });
        },
		//页面加载完成之后操作一些默认操作
        doDefault: function(){
        	$($('.searchItem .dropdown-menu li a').get(0)).click();						//搜索默认选择全部
            $($('.rechargeTypeItem .dropdown-menu li a').get(0)).click();				//充值类型默认选择全部
            $($('.rechargeChannel .dropdown-menu li a').get(0)).click();				//充值渠道默认选择全部
            $($('.transferStatus .dropdown-menu li a').get(0)).click();					//到账状态默认选择全部
            $('.searchPanel .searchButton').click();                                    //默认查询所有的
		},
		//初始化页面相关的事件
        initPageRelatedEvent: function(){
        	this.searchLatelytimeEvent();					//搜索类型改变事件
        	this.registerDropMenu();						//下拉事件
			this.searchPanelClick();						//搜索按钮点击事件
            this.doExportExcelEvent();                      //导出Excel表格
            this.registerPagingSearchBtn();                 //分页栏中的事件
			this.doDefault();
		},
    	initPage: function(){
    		this.initRelatedElement();
    		this.initPageRelatedEvent();
		}
	};
    rechargedetail.initPage();
}()