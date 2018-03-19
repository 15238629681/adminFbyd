var orderInfo = {
	search: "0",
	orderType: "0",
	orderStatus: "0",
	payWay: "0",
	goodsPrice: {
		beginPrice: "0",
		finishPrice: "0"
	},
	settlePrice: {
		beginPrice: "0",
		finishPrice: "0"
	},
	postOrderTime: {
		heginTime: "0",
		finishTime: "0"
	}
}

//搜索
$(".searchItem li").click(function() {

})
//订单类型
//订单状态
//支付方式
//商品金额

function getTodyTime() {
	var nowTime = new Date();
	var year = nowTime.getFullYear();
	var month = parseInt(nowTime.getMonth()) + 1;
	var day = nowTime.getDate();
	var hour = nowTime.getHours();
	var minute = nowTime.getMinutes();
	var second = nowTime.getSeconds();

	if(month < 10) {
		month = "0" + month;
	}
	if(day < 10) {
		day = "0" + day;
	}
	if(hour < 10) {
		hour = "0" + hour;
	}
	if(minute < 10) {
		minute = "0" + minute;
	}
	if(second < 10) {
		second = "0" + second;
	}
	var formatTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	console.log("今天---" + formatTime);
	return formatTime;
}

// 仅选择日期
$(".form-date").datetimepicker({
	weekStart: 1,
	todayBtn: 1,
	autoclose: 1,
	todayHighlight: 1,
	startView: 2,
	forceParse: 0,
	showMeridian: 1,
	format: "yyyy-mm-dd hh:ii"
});
$(".form-datetime").datetimepicker("setEndDate", getTodyTime());


$(".dropdown-menu li a").on('click', function() {
	$(this).parent().parent().prev().val("    " + $(this).html());
})