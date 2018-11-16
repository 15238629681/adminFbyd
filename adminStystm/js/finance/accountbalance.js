var userinfo = JSON.parse(localStorage.getItem("userinfo"));

function getDataReq() {
	var nowTime = new Date().getTime();
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Bannersearch/lookbalance",
		data: {
			token: userinfo.token,
			uid: userinfo.uid
		},
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.state=="1"){
				var list=data.list[0];
				$(".withDrawBlock .withDrawNum").html("￥"+list.managerbalance);
				$(".frozenBlock .withDrawNum").html("￥"+list.managerbond);
			}else if(data.state=="3"){
				alert("网络错误，请刷新网络！")
			}
		},
		error: function(msg) {
			console.log(msg);
		}
	})
}
getDataReq();
function toUnfreezzMoney() {
    var userinfo = JSON.parse(localStorage.getItem("userinfo"));
    var token = userinfo.token;
    var uid = userinfo.uid;
    $.ajax({
        type: "post",
        url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activityupdate/thawmoney",
        data: {
            token:token,
            uid:uid,
            timestamp: parseInt(new Date().getTime()/1000)
        },
        success: function(data) {
            if(data.state==1){
            	console.info('执行计算成功');
            }

        },
        error: function(msg) {
            console.log(msg);
        }
    });
}
toUnfreezzMoney();


