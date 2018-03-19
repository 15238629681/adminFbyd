!function(){
    var uid,token;
    var UpgradeRecord = {
        messageWindow: null,                                        //弹窗提示对象
        totalPage: 1,                                               //当前表格的总页数
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
        /*createRequestLoading: function(){
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
        },*/
        getTimeStamp: function(){
            return parseInt(new Date().getTime()/1000);
        },
        //初始化页面的相关元素
        initRelatedElement: function(){
            this.getUserInfo();
            this.createMessage();
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
        //初始化时间选择器
        initDatetimepicker: function(){
            $('.form-datetime').datetimepicker({
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                forceParse: 0,
                showMeridian: 1,
                format: 'yyyy-mm-dd hh:ii'
            });
        },
        searchPanelClick: function(){
            var me = this;
            $('.searchBtn .searchButton').click(function(){
                me.doSearchSubmit();
            });
        },
        //导出Excel表格
        doExportExcelEvent: function(){
            var me = this;
            $('.exportExcelBar .exportExcelBtn').click(function(){
                me.doExportExcelRequest();
            });
        },
        //获取查询条件
        getSearchCondition: function(){
            //等级变更时间
            var starttime = $('.gradechangetime .starttime').val();
            var endtime = $('.gradechangetime .endtime').val();
            //变更前等级
            var beforelevel = $('.gradechangebefore input').data('id');
            //变更后等级
            var afterlevel = $('.gradechangeafter input').data('id');
            //充值渠道
            var recharge = $('.rechargeChannel input').data('id');
            //变更状态
            var status = $('.changeStatus input').data('id');
            var params = {token:token,uid:uid,starttime:starttime,endtime:endtime,beforelevel:beforelevel,afterlevel: afterlevel,recharge:recharge,status:status,page:1,count:10};
            return params;
        },
        //查询按钮的点击事件
        doSearchSubmit: function(){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/upBalance';
            var params = me.getSearchCondition();
            me.currentPage = 1;
            //YouXin.apply(params,{});
            YouXin.getAsyncData(url, params, 'POST', me.doSearchSubmitCallBack, me);
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
        //设置激活页面
        activeCurrentPage: function(currentPage){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/upBalance';
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
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Panicbuying/upBalance';
            var params = me.getSearchCondition();
            params['page'] = me.currentPage;
            YouXin.apply(params,{excel:'1'});
            if(!params['starttime']) delete params.starttime;
            if(!params['endtime']) delete params.endtime;
            YouXin.getAsyncData(url, params, 'POST', me.openDownExcelWindow, me);
        },
        //打开下载窗口
        openDownExcelWindow: function(data){
            if(data.state != 1)  return;
            window.open(data.url);
        },
        doSearchSubmitCallBack: function(data){
            if(data.state != 1) return;
            var me = this;
            me.totalPage = data.num;
            me.gridRowsData = data.data;
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
                console.info(rowData);
                for(var index in rowData) {
                    if(!rowData[index]) rowData[index] = '';
                }
                var tr =  me.getGridRowDom();
                var result = YouXin.template(tr,rowData);
                var $tr = $(result);
                $tr.data('rowData',rowData);
                $('.detailTable tbody').append($tr);
            }
        },
        getGridRowDom: function(){
            var tr = '<tr>' +
                '<td>{ordernumber}</td>' +
                '<td>{checktime}</td>' +
                '<td>{money}</td>' +
                '<td>{primarylevel}</td>' +
                '<td>{changelevel}</td>' +
                '<td>{dealtype}</td>' +
                '<td>{changeexplain}</td>' +
                '<td>{termstarttime}</td>' +
                '<td>{changestate}</td>' +
                '<td>{levelchangetime}</td>' +
            '</tr>';
            return tr;
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
        //页面加载完成之后操作一些默认操作
        doDefault: function(){
            $('.searchBtn .searchButton').click();                                    //默认查询所有的
        },
        //初始化页面相关的事件
        initPageRelatedEvent: function(){
            this.registerDropMenu();						//下拉事件
            this.initDatetimepicker();                      //初始化时间选择器
            this.searchPanelClick();                        //提交按钮点击了
            this.doExportExcelEvent();                      //导出Excel表格
            this.registerPagingSearchBtn();                 //分页栏中的事件
            this.doDefault();
        },
        initPage: function(){
            this.initRelatedElement();
            this.initPageRelatedEvent();
        }
    };
    UpgradeRecord.initPage();
}();
