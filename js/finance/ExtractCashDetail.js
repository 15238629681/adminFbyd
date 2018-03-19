!function(){
    var uid,token;
    var ExtractCashDetail = {
        messageWindow: null,                                        //弹窗提示对象
        totalPage: 1,                                               //当前表格的总页数
        currentPage: 1,                                             //当前所处页面数
        gridRowsData: [],                                           //当前页面的表格数据
        currentRowData: null,                                       //当前操作行数据
        loading: null,                                              //加载动画
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
                placement: 'center',
                cssClass: 'messageWindowCls'
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
        //搜索下拉事件改变
        searchLatelytimeEvent: function(){
            var me = this;
            $('#dateSelectInputID').change(function(){
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
        //搜索按钮点击事件
        searchPanelClick: function(){
            var me = this;
            $('#part-right .contentBlock .searchBtn').click(function(){
                me.doSearchSubmit();
            });
        },
        getSearchCondition: function(){
            var latelytime = $('#dateSelectInputID').data('id');									//搜索时间
            var time_start = $('.beginTimePicker .starttime').val();								//开始时间
            var time_end = $('.beginTimePicker .endtime').val();									//结束时间
            var withstatus = $('#extractCashStateID').data('id');								    //提现状态
            var dealtype = $('#extractCashTypeID').data('id');                                      //提现账户类型
            var params = {
                token: token,
                timestamp: this.getTimeStamp(),
                uid: uid,
                latelytime: latelytime,
                time_start: time_start,
                time_end: time_end,
                dealtype: dealtype,
                withstatus: withstatus,
                count: 10,
                page: 1
            };
            return params;
        },
        //查询请求
        doSearchSubmit: function(){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Accountbalance/withdrawals';
            var params = me.getSearchCondition();
            me.currentPage = 1;
            YouXin.getAsyncData(url, params, 'POST', me.doSearchSubmitCallBack, me);
        },
        //设置激活页面
        activeCurrentPage: function(currentPage){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Accountbalance/withdrawals';
            var params = me.getSearchCondition();
            params['page'] = currentPage;
            me.currentPage = currentPage;
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
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apia/Accountbalance/withdrawals';
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
            me.gridRowsData = data.list;
            me.renderGridData();
            me.setPagingBar();
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
                    case 3:
                        rowData['dealtypename'] = '支付宝';
                        rowData['bankname'] = '-';
                        rowData['address'] = '-';
                        break;
                    case 4:
                        rowData['dealtypename'] = '微信';
                        rowData['bankname'] = '-';
                        rowData['address'] = '-';
                        break;
                    case 5:
                        rowData['dealtypename'] = '网银';
                        break;
                }
                switch (parseInt(rowData['state'])) {
                    case 0:
                        rowData['statename'] = '审核中';
                        break;
                    case 1:
                        rowData['statename'] = '已提现';
                        break;
                }
                console.info(rowData);
                var result = YouXin.template(tr,rowData);
                var $tr = $(result);
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
                '<td>{dealtypename}</td>' +
                '<td>{payaccount}</td>' +
                '<td>{name}</td>' +
                '<td>{bankname}</td>' +
                '<td>{address}</td>' +
                '<td>{statename}</td>' +
            '</tr>';
            return tr;
        },
        //设置页面导出
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
        doDefault: function(){
            $($('.dateSelectItem .dropdown-menu li a').get(0)).click();						//搜索默认选择全部
            $($('.extractCashStateItem .dropdown-menu li a').get(0)).click();				//提现状态
            $($('.extractCashTypeItem .dropdown-menu li a').get(0)).click();                //提现账户类型
            $('.searchPanel .searchButton').click();                                        //默认查询所有的
        },
        //初始化页面相关的事件
        initPageRelatedEvent: function(){
            this.registerDropMenu();						//下拉事件
            this.searchLatelytimeEvent();					//搜索类型和时间区间改变事件
            this.searchPanelClick();						//搜索按钮点击事件
            this.doExportExcelEvent();                      //设置Excel导出
            this.registerPagingSearchBtn();                 //分页栏中的事件
            this.doDefault();                               //页面加载完成之后操作一些默认操作
        },
        initPage: function(){
            this.initRelatedElement();
            this.initPageRelatedEvent();
        }
    };
    ExtractCashDetail.initPage();
}();
















