var YouXin = {

    isEmpty: function (str){
        if(str==null||str.length==0)
            return true;
        return false;
    },
    tranNullVal: function(val){
        if(!(!!val)){
            val = '';
        }
        return val;
    },

    tranNullValToDefault: function(val,defVal){
        if(!(!!val)){
            val = defVal;
        }
        return val;
    },
    apply: function(scope,config){
        for(var i in config){
            scope[i] = config[i];
        }
        return scope;
    },
    applyIf: function(scope,config){
        for(var i in config){
            if(!scope[i])
                scope[i] = config[i];
        }
        return scope;
    },
    //模板处理
    template: function(str,o,regexp){
        return str.replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
            return (o[name] === undefined) ? '' : o[name];
        });
    },

    //同步获取数据
    getData: function(url,params,method){
        var data = {state:0,message:"访问失败"};
        $.ajax({
            url: url,
            data: params,
            async: false,
            type: method==null?'POST':method,
            success: function(data) {
                data = data;
                console.info(data,'成功');
            },
            error: function(msg) {
                data = msg;
            }
        });
        return data;
    },


    //异步获取数据
    getAsyncData: function(url, params, method, callback, scope){
        $.ajax({
            url: url,
            data : params,
            type : method==null?'POST':method,
            success : function(response) {
                if(callback)
                    callback.call(scope,response);
            },
            failure : function(msg){
                if(callback)
                    console.info(msg);
            }
        });
    },
    //获取url中搜索的参数
    getUrlParamsObj: function(){
        if(!location.search) return {};
        var query = location.search.substring(1);
        var params = query.split('&');
        var o = {};
        for(var index in params) {
            var el = params[index];
            var key = el.split('=')[0];
            var value = el.split('=')[1];
            o[key] = value;
        }
        return o;
    },
    getUrlParamsValue: function(search){
        var obj = this.getUrlParamsObj();
        return obj[search];
    },
    //检测字符串是否为纯数字
    checkNumber: function(numStr){
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(numStr)) {
            return true;
        }
        return false;
    },

    // 创建加载中的动画对象
    createLoading:function(){
        this.loadingDom = document.createElement("div");
        this.loadingDom.style.cssText = 'width: 70px,height: 70px;display: none;position: absolute;top: 50%;left: 50%;text-align: center;margin-left: -35px;margin-top: -35px;z-index: 9999;';
        this.loadingDom.innerHTML = '<img src="downfresh.gif"><br/><br/>正在提交中。。。';
        this.loadingDom.show = function(){
            this.style.display = 'block';
        };
        this.loadingDom.hide = function(){
            this.style.display = 'none';
        };
        $('body').append(this.loadingDom);
    },

    // 初始化函数
    initOperation: function(){
        var _this = this;
        _this.createLoading(); //初始化加载动画
    },
    reqData:function(){
        var _this = this;
        _this.loadingDom.show();
        // 数据请求完毕
        _this.loadingDom.hide();
    }



};








