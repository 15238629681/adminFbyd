var userinfo=JSON.parse(localStorage.getItem("userinfo"));

$(".dropdown-menu li a").on('click', function() {
	$(this).parent().parent().prev().val($(this).html());
});

//时间选择
var timeContClick = false;
var timeContClick2 = false;
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
$(".beginRage").datetimepicker("setEndDate", getTodyTime());
$(".endRage").datetimepicker("setEndDate", getTodyTime());


$(".timeChooseList").on("click", "li", function() {
	var timeText = $(this).find("a").html().trim();
	if(timeText == "全部") {
		timeContClick = true;
		//		getAgoTime("hour",7);
		document.querySelector(".postOrderTimeWapper .beginRage input").value = "";
		document.querySelector(".postOrderTimeWapper .endRage input").value = "";
		$('.form-date').datetimepicker('remove');
	}
	
	if(timeText == "最近24小时") {
		timeContClick = true;
		getAgoTime("hour", 24);
		$('.form-date').datetimepicker('remove');
	}
	if(timeText == "最近48小时") {
		timeContClick = true;
		getAgoTime("hour", 48);
		$('.form-date').datetimepicker('remove');
	}
	if(timeText == "最近7天") {
		timeContClick = true;
		getAgoTime("day", 7);
		$('.form-date').datetimepicker('remove');
	}
	if(timeText == "最近30天") {
		timeContClick = true;
		getAgoTime("day", 30);
		$('.form-date').datetimepicker('remove');
	}
	
	if(timeText == "自定义") {
		timeContClick = false;
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
		$(".beginRage").datetimepicker("setEndDate", getTodyTime());
		$(".endRage").datetimepicker("setEndDate", getTodyTime());
	}
})

function getNowTime() {
	var time = new Date();
	return time.getFullYear() + "-" + (parseInt(time.getMonth()) + 1) + "-" + time.getDate();
}

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
	//	console.log("当前时间---" + formatTime);
	return formatTime;
}

function getAgoTime(type, num) {
	var nowTime = parseInt(new Date().getTime());
	if(type == "hour") {
		var agoTime = new Date(nowTime - 60 * 60 * num * 1000);
		var timeString = agoTime.getFullYear() + "-" + (parseInt(agoTime.getMonth()) + 1) + "-" + agoTime.getDate();
		document.querySelector(".postOrderTimeWapper .beginRage input").value = timeString;
	}
	if(type == "day") {
		var agoTime = new Date(nowTime - 60 * 60 * 24 * num * 1000);
		var timeString = agoTime.getFullYear() + "-" + (parseInt(agoTime.getMonth()) + 1) + "-" + agoTime.getDate();
		document.querySelector(".postOrderTimeWapper .beginRage input").value = timeString;
	}
	document.querySelector(".postOrderTimeWapper .endRage input").value = getNowTime();
}

//数据追加到表中
//		商品信息表
function CreateTd(frozenlist) {
	$(".frozenTable tbody").html("");
//	activitylist = activitylist.date;
	for(var j = 0; j < frozenlist.length; j++) {
		var tr = document.createElement("tr");
//		tr.setAttribute("data-id", activitylist[j].id);
//		tr.setAttribute("data-trindex", j);
		for(var i = 0; i <= 4; i++) {
			var td = document.createElement("td");
			if(i == 0) {
				td.innerHTML =frozenlist[j].createtime ;
			} else if(i == 1) {
				td.innerHTML =frozenlist[j].money ;
			} else if(i == 2) {
				if(frozenlist[j].frozenstatus==1){
					td.innerHTML ="冻结中";
				}
				if(frozenlist[j].frozenstatus==2){
					td.innerHTML ="已解冻";
				}
				if(frozenlist[j].frozenstatus==3){
					td.innerHTML ="已支付";
				}
			} else if(i == 3) {
//				解冻时间
				if(frozenlist[j].checktime=="1970-01-01 08:00:00"){
					td.innerHTML="";
				}else{
					td.innerHTML =frozenlist[j].checktime ;
				}
				
			} else if(i == 4) {
				td.innerHTML ="体验活动商品贷款冻结";
			}
			tr.appendChild(td);
		}
		$(".frozenTable tbody").append(tr);
	}

}

var frozenlist,latelyfrozentime,frozentime_start,frozentime_end,frozenstatus;
document.querySelector(".searchSpan").addEventListener("click",function(){
	var latelyfrozentime=document.querySelector(".timeChooseList input").value.trim();
	if(latelyfrozentime=="最近24小时"){
		latelyfrozentime=1;
	}else if(latelyfrozentime=="最近48小时"){
		latelyfrozentime=2;
	}else if(latelyfrozentime=="最近7天"){
		latelyfrozentime=3;
	}else if(latelyfrozentime=="最近30天"){
		latelyfrozentime=4;
	}else {
		latelyfrozentime="";
	}

	var frozentime_start=document.querySelector(".frozentime_start").value;
	var frozentime_end=document.querySelector(".frozentime_end").value;
	var frozenstatus=document.querySelector(".frozenstatus").value.trim();
	if(frozenstatus=="全部"){
		frozenstatus="";
	}else if(frozenstatus=="冻结中"){
		frozenstatus=2;
	}else if(frozenstatus=="已解冻"){
		frozenstatus=3;
	}else if(frozenstatus=="已支付"){
		frozenstatus=4;
	}
	
//	查询的时候直接进行导出操作
	var nowTime = new Date().getTime() / 1000;
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Accountbalance/frozenSearchs",
		data: {
			token: userinfo.token,
			timestamp: nowTime,
			uid: userinfo.uid,
			latelyfrozentime:latelyfrozentime,
			frozentime_start:frozentime_start,
			frozentime_end:frozentime_end,
			frozenstatus:frozenstatus,
			page: 1
		},
		success: function(data) {
			//			alert(JSON.stringify(data))
			console.log(JSON.stringify(data));
			if(data.error == "0") {
				frozenlist = data.frozenlist.date;
				
				allPageNumber = data.frozenlist.num;
				if(allPageNumber == 0) {
					alert("该时间段内没有发布体验活动！");
				}
				
				CreateTd(frozenlist);
//				console.log("nowPage---" + nowPage);
				var nowPage=1;
				exportExcelFn(nowPage);

				Page({
					num: allPageNumber, //页码数
					startnum: 1, //指定页码
					elem: $('#page2'), //指定的元素
					callback: function(nowPage) { //回调函数
						//						请求相应页码的数据
						skipToPage(nowPage);
						nowPage = nowPage;
					}
				});
				if(document.querySelector(".pageWapper .active")) {
					document.querySelector(".pageWapper .active").style.background = "#FBBD00 !important";
				}

			}
		},
		error: function(msg) {
			console.log(msg);
		}
	});


})

function exportExcelFn(nowPage) {
	var nowTime = new Date().getTime();
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Accountbalance/frozenPhpexcel",
		data: {
			token: userinfo.token,
			timestamp: nowTime,
			uid: userinfo.uid,
			
			latelyfrozentime:latelyfrozentime,
			frozentime_start:frozentime_start,
			frozentime_end:frozentime_end,
			frozenstatus:frozenstatus,
			page: nowPage,
			excel: "1"
		},
		success: function(data) {
			//			console.log(JSON.stringify(data));
			console.log("nowPage---" + nowPage);
			console.log("已发起导出请求"+JSON.stringify(data));
			document.querySelector(".exportToExcelWapper a").setAttribute("href", data);
		},
		error: function(msg) {
			console.log(msg);
		}
	});

}


function skipToPage(nowPage) {
	var nowTime = new Date().getTime()
	var latelyfrozentime=document.querySelector(".timeChooseList input").value.trim();
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Accountbalance/frozenSearchs",
		data: {
			token: userinfo.token,
			timestamp: nowTime,
			uid: userinfo.uid,
			latelyfrozentime:latelyfrozentime,
			frozentime_start:frozentime_start,
			frozentime_end:frozentime_end,
			frozenstatus:frozenstatus,
			page: nowPage
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			console.log("skip-----nowPage---" + nowPage);
			if(data.error == "0") {
				console.log(data.frozenlist.date)
				frozenlist = data.frozenlist.date;
				allPageNumber = data.frozenlist.num;
				CreateTd(frozenlist);
				exportExcelFn(nowPage);
			}
		},
		error: function(msg) {
			console.log(msg);
		}
	});

}


$(".exportToExcelWapper span").on("click", function() {
	if(!$(this).find("a").attr("href")) {
		alert("导出失败！");
	}
})

//冻结金额
function getFrozenNum(){
	var nowTime = new Date().getTime() / 1000;
	$.ajax({
		type: "post",
		url: "https://app.fanbaoyundian.com/apiapiextend/apia/Accountbalance/frozenMoneySear",
		data: {
			token: userinfo.token,
			timestamp: nowTime,
			uid: userinfo.uid,
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.message=="成功"){
				document.querySelector(".frozenNum").innerHTML=data.money[0].managerbond;
			}
		},
		error: function(msg) {
			console.log(msg);
		}
	});
}
getFrozenNum();


