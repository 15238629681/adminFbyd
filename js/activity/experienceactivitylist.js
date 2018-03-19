(function(){
    var uid,token;
    var experienceactivitylist = {
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
                placement: 'center',
                cssClass: {'zIndex':99999}
            });
        },
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
        //获取活动列表
        getSearchCondition: function(){
            var timestamp = this.getTimeStamp();
            var page = 1;
            var count = 5;
            var title = $('.search-form-panel .gooodsNameInput .title').val();
            var activity = $('#productStateID').data('id');
            var starttime = $('.beginTimeGroup .beginRange .starttime').val();
            var endtime = $('.beginTimeGroup .endRange .endtime').val();
            var params = {token:token,uid:uid,timestamp:timestamp,page:page,count:count};
            if(title) params['title'] = title;
            if(activity) params['activity'] = activity;
            if(starttime) params['starttime'] = starttime;
            if(endtime) params['endtime'] = endtime;
            return params;
        },
        //初始化页面的相关元素
        initRelatedElement: function(){
            this.getUserInfo();
            this.createMessage();
            this.createRequestLoading();
            //this.getActiveGoodsList();
        },
        //注册【开始时间范围】时间控件
        resiterDateTimePicker: function(){
            $('.form-datetime').datetimepicker({
                weekStart: 1,
                todayBtn:  1,
                autoclose: true,
                todayHighlight: 1,
                startView: 2,
                forceParse: 0,
                showMeridian: 1,
                format: "yyyy-mm-dd hh:ii"
            });
        },
        //注册查询按钮的事件
        registerSearchBtnEvent: function(){
            var me = this;
            $('.search-form-panel .searchButton').click(function(){
                me.doSearchSubmit();
            });
        },
        //导出Excel点击事件
        doExportExcelEvent: function(){
            var me = this;
            $('.exportExcelBar .exportExcelBtn').click(function(){
                me.doExportExcelRequest();
            });
        },
        //添加商品操作遮罩中相关事件
        doAddGoodsOptionEvent: function(){
            var me = this;
            $('.addGoodsMask .closeMask').click(function(){
                var maskClass = $(this).data('for');
                $('.' + maskClass).hide();
            });
            //添加体验商品数量
            $('.addGoodsMask .addGoodsRight').click(function(){
                var addNums = $('.addGoodsMask input').val();
                if(!addNums) {
                    me.messageWindow.update('请输入追加的商品数量!');
                    me.messageWindow.show();
                    return;
                }
                sessionStorage.setItem('addFrozenInfo',JSON.stringify({addnum: addNums,price: me.currentRowData.price,shopid: me.currentRowData.id}));
                window.location.href = 'GotoFrozenByAdd.html?shopid=' + me.currentRowData.id + '&addnum=' + addNums + '&price' + me.currentRowData.price + '';
            });
        },
        //查询处理
        doSearchSubmit: function(){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/applyList';
            var params = me.getSearchCondition();
            me.currentPage = 1;
            YouXin.getAsyncData(url, params, 'POST', me.doSubmitEvaluteCallBack, me);
        },
        //导出数据到Excel
        doExportExcelRequest: function(){
            var me = this;
            if($('.detailTable tbody').find('tr').length == 0) {
                me.messageWindow.update('无匹配的数据!');
                me.messageWindow.show();
                return;
            }
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/applyList';
            var params = me.getSearchCondition();
            params['page'] = me.currentPage;
            YouXin.apply(params,{excel:'1'});
            YouXin.getAsyncData(url, params, 'POST', me.openDownExcelWindow, me);
        },
        openDownExcelWindow: function(data){
            window.open(data);
        },
        activeCurrentPage: function(currentPage){
            var me = this;
            var url = 'https://app.fanbaoyundian.com/apiapiextend/apib/Supplier/applyList';
            var params = me.getSearchCondition();
            params['page'] = currentPage;
            me.currentPage = currentPage;
            YouXin.getAsyncData(url, params, 'POST', me.doSubmitEvaluteCallBack, me);
        },
        //查询处理 - 请求回调
        doSubmitEvaluteCallBack: function(data){
            /*if(data.state == 2) {
             $('.detailTable tbody').html('<div style="position: absolute;text-align: center;width: 100%;margin-top: 50px;">无匹配的数据</div>');
             $('.pageWapper').hide();
             return;
             }*/
            if(data.state != 1) return;
            var me = this;
            me.totalPage = data.data.sum;
            me.gridRowsData = data.data.list;
            me.renderGridData();
            me.setPagingBar();
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
        //渲染Grid中的元素
        renderGridData: function(){
            var me = this;
            $('.detailTable tbody').empty();
            if(me.gridRowsData.length == 0) {
                $('.detailTable tbody').html('<div style="position: absolute;text-align: center;width: 100%;margin-top: 50px;">无匹配的数据</div>');
                $('.pageWapper').hide();
                return;
            }
            for(var index = 0;index < me.gridRowsData.length; index++) {
                var rowData = me.gridRowsData[index];
                var temp = rowData;
                var tr =  me.getGridRowDom();
                //设置已冻结贷款的单元格
                if(parseInt(rowData.shopstatusA) == 1) {
                    rowData['freezeMoneyTd'] = '<span class="freezeMoney">￥0.00</span><br/>' +
                        '<span class="promptMark">!</span><span>待冻结<span class="needFreezeMoney">' + (rowData.money).toFixed(2)+'</span>元</span>'
                } else {
                    rowData['freezeMoneyTd'] = '<span class="freezeMoney">￥' + (rowData.money).toFixed(2) + '</span>'
                }
                console.info(rowData);
                switch (parseInt(rowData.shopstatusA)) {
                    case 1:
                        if(parseInt(rowData['statusAB']) === 1) {
                            rowData['userOptionTd'] = '';
                            rowData['shopstatusS'] = '<span>活动已结束</span>';
                        } else {
                            rowData['userOptionTd'] = '<span class="userOptionCls freezeMoneyOperation">立即冻结保证金</span>';
                        }
                        break;
                    case 2:
                        rowData['userOptionTd'] = '';
                        break;
                    case 3:
                        rowData['userOptionTd'] = '';
                        break;
                    case 4:
                        rowData['userOptionTd'] = '<span class="userOptionCls addExperienceGoods">追加份数</span><span class="userOptionCls auditUser">审核用户</span><span class="userOptionCls checkExperienceReport">查看体验报告</span>';
                        break;
                    case 5:
                        rowData['userOptionTd'] = '<span class="userOptionCls lookUser">查看用户</span><span class="userOptionCls checkExperienceReport">查看体验报告</span>';
                        break;
                    case 6:
                        rowData['userOptionTd'] = '<span class="userOptionCls addExperienceGoods">追加份数</span>';
                        break;
                    case 7:
                        rowData['userOptionTd'] = '';
                        break;
                }

                if(rowData.addnumber) {
                    rowData['haveAddGoods'] = '<span class="alreadyAddPrompt">(其中已追加<span class="alreadyAddNum">' + rowData.addnumber + '</span>份)</span>';
                } else {
                    rowData['haveAddGoods'] = '';
                }
                var result = YouXin.template(tr,rowData);
                var $tr = $(result);
                $('.detailTable tbody').append($tr);
                $tr.data('rowdata',temp);
            }
            me.registerEventWithGrid();
        },
        //Grid行模板
        getGridRowDom: function(){
            var gridRowStr = '<tr>' +
                '<td class="commodityNameTd">' +
                    '<img class="commodityImage" src="{mainpic}">' +
                    '<span class="commodityName">{shorttitle}</span>' +
                '</td>' +
                '<td>' +
                    '<span class="beginTimeOne">{starttime}</span><br/>' +
                    '- <br/>' +
                    '<span class="beginTimeTwo">{endtime}</span>' +
                '</td>' +
                '<td>' +
                    '<span class="activeSchedule">{shopstatusS}</span>' +
                '</td>' +
                '<td>' +
                    '<span class="applyForNums">{all}</span>' +
                '</td>' +
                '<td>' +
                    '<span class="applyForNumsDetail">{success}/{numbers}</span>{haveAddGoods}' +
                '</td>' +
                '<td>' +
                    '{freezeMoneyTd}' +
                '</td>' +
                '<td class="userOperateTd">' +
                    '{userOptionTd}' +
                '</td>' +
            '</tr>';
            return gridRowStr;
        },
        //表格中的相关事件
        registerEventWithGrid: function(){
            var me = this;
            $('.detailTable .userOperateTd .freezeMoneyOperation').click(function(){
                console.info('立即冻结保证金');
                me.currentRowData = $(this).parent().parent().data('rowdata');
                var shopid = me.currentRowData.id;
                window.location.href = "gotofrozen.html?shopid=" + shopid + "";
            });
            $('.detailTable .userOperateTd .addExperienceGoods').click(function(){
                me.currentRowData = $(this).parent().parent().data('rowdata');
                $('.addGoodsMask').show();
            });
            $('.detailTable .userOperateTd .auditUser').click(function(){
                console.info('审核用户');
                me.currentRowData = $(this).parent().parent().data('rowdata');
                var shopid = me.currentRowData.id;
                window.location.href = "reviewexperapplication.html?shopid=" + shopid;
            });
            $('.detailTable .userOperateTd .checkExperienceReport').click(function(){
                console.info('查看体验报告');
                me.currentRowData = $(this).parent().parent().data('rowdata');
                var shopid = me.currentRowData.id;
                window.location.href = "reviewexperapplication.html?shopid=" + shopid;
            });
            $('.detailTable .userOperateTd .lookUser').click(function(){
                console.info('查看用户');
                me.currentRowData = $(this).parent().parent().data('rowdata');
                var shopid = me.currentRowData.id;
                window.location.href = "reviewexperapplication.html?shopid=" + shopid;
            });
        },
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
            $('.search-form-panel .searchButton').click();
        },
        //注册首次进入到页面时的事件
        registerPageFirstEvent: function(){
            this.registerDropMenu();                            //处理下拉列表事件
            this.resiterDateTimePicker();                       //初始化时间选择器
            this.registerSearchBtnEvent();                      //查询按钮点击事件
            this.doExportExcelEvent();                          //导出Excel点击事件
            this.doAddGoodsOptionEvent();                       //添加商品操作事件
            this.registerPagingSearchBtn();                     //分页栏中的事件

            this.doDefault();
        },
        initPage: function(){
            this.initRelatedElement();
            this.registerPageFirstEvent();
        }
    };
    experienceactivitylist.initPage();
})();




