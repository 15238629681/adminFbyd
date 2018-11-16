var userinfo = JSON.parse(localStorage.getItem("userinfo"));

//鼠标经过卡片时
/*$(".commontBlock").mouseenter(function(){
    $(".commontBlock").each(function(index,item){
        $(item).attr('isover',0);
        lessenState(item);
    });
    largenState.call(this);
});*/
/*function largenState() {
    //放大状态
    $(this).css({'width': '450px','z-index':2,'margin-left':'-29px','margin-top':'-33px'});
    $(this).find('.commontTitle').css({'height': '154px','line-height': '144px'});
    $(this).find('.commontPrice').css({'height': '154px'});
    $(this).find('.commontBlockWapper').css({'opacity':1});         //遮罩
    $(this).attr('isover',1);
    $(".commontBlock").each(function(index,item){
        if(parseInt($(item).attr('isover')) == 1) return;
        $(item).find('.knowMore').css("display", "block");
        $(item).find(".knowMoreDetail").css("display", "none");
        $(item).find('.chooseProtocol').css("display", "none");
        $(item).find('.gotoUpdata').css({'background':'#fb7a82'});
        $(item).attr('isselect',0);
        $(item).find('.chooseProtocol img').attr("src", "../img/account/radio_07.png");
    });
}
function lessenState(item) {
    //变小状态
    $(item).css({'width': '392px','z-index':1,'margin-left':'0px','margin-top':'0px'});
    $(item).find('.commontBlockWapper').css({'opacity':0.5});
    $(item).find('.commontTitle').css({'height': '134px','line-height': '134px'});
    $(item).find('.commontPrice').css({'height': '134px'});
}*/

//卡片点击时
/*$(".commontBlock").on("click",function(){
    $(".commontBlock").each(function(index,item){
        cancelClickedCard(item);
    });
    clickedCard.call(this);
});*/

/*function cancelClickedCard(item) {
    //取消掉卡片点击选中
    $(item).find(".chooseProtocol").css("display","none");
}*/

/*function clickedCard() {
    //卡片点击选中
    $(this).find(".chooseProtocol").css("display","inline-block");
}*/

//"了解更多"点击
$(".commontBlock .knowMore").click(function(event) {
    $(this).css("display", "none");
    $(this).parent().find(".knowMoreDetail").css("display", "block");
});
//"隐藏更多"点击
$(".commontBlock .hideMore").click(function(event) {
    var $card = $(this).parent().parent();
    $card.find('.knowMore').show();
    $card.find(".knowMoreDetail").css("display", "none");
});
var myMessager = null;
//立即升级点击
$('.gotoUpdata').click(function(){
    switch($(this).parent().parent().attr('id')) {
        case 'goldBlock':
            window.location.href = "upgradeviprecharge2.html?paylevel=1";
            break;
        case 'diamondBlock':
            window.location.href = "upgradeviprecharge2.html?paylevel=2";
            break;
        default:
            window.location.href = "upgradeviprecharge2.html?paylevel=3";
    }
    /*if(parseInt($(this).parent().parent().attr('isselect')) == 1) {
        switch($(this).parent().parent().attr('id')) {
            case 'goldBlock':
                window.location.href = "upgradeviprecharge2.html?paylevel=1";
                break;
            case 'diamondBlock':
                window.location.href = "upgradeviprecharge2.html?paylevel=2";
                break;
            default:
                window.location.href = "upgradeviprecharge2.html?paylevel=3";
        }
    } else {
        //alert('请阅读协议');
        if(myMessager) myMessager.hide();
        myMessager = new $.zui.Messager('<span style="font-size: 16px;">请阅读协议</span>', {
            close: false,
            placement: 'center',
            type: 'warning',
            time: 2000
        }).show();
    }*/
});

//协议点击
$(".chooseProtocol").click(function(){
    if(parseInt($(this).parent().attr('isselect')) == 1) {
        //表示选中
        $(this).parent().attr('isselect',0);
        $(this).find("img").attr("src", "../img/account/radio_07.png");
        $(this).parent().find('.gotoUpdata').css({'background':'#fb7a82'});
    } else {
        $(".commontBlock").each(function(index,item){
            //将其他所有的全部掷为未选中
            $(item).attr('isselect',0);
            $(item).find('.gotoUpdata').css({'background':'#fb7a82'});
            $(item).find(".chooseProtocol img").attr("src", "../img/account/radio_07.png");
        });
        $(this).parent().attr('isselect',1);
        $(this).find("img").attr("src", "../img/account/radiochoose_03.png");
        $(this).parent().find('.gotoUpdata').css({'background':'#FF3A46'});
    }
});

var paylevel;
function getVipLevel() {
    $.ajax({
        type: "post",
        url: "https://app.fanbaoyundian.com/apiapiextend/apia/Activitydelete/levelSearch",
        data: {
            token: userinfo.token,
            uid: userinfo.uid,
            timestamp: new Date().getTime() / 1000
        },
        success: function(data) {
            //console.log(data,1111);
            if(data.message == "成功") {
                paylevel = data.levellist[0].paylevel;
                setVipLevel();
            }
        },
        error: function(msg) {
            //console.log(msg);
        }
    })
}
getVipLevel();
function setVipLevel() {
    //	普通会员
    if(paylevel == 0) {
        var allGotoUpdata = document.querySelectorAll(".gotoUpdata");
        for(var i = 0; i < allGotoUpdata.length; i++) {
            allGotoUpdata[i].innerHTML = "立即升级";
        }
    }
    //	黄金会员
    if(paylevel == 1) {
        var allGotoUpdata = document.querySelectorAll(".gotoUpdata");
        for(var i = 0; i < allGotoUpdata.length; i++) {
            allGotoUpdata[i].innerHTML = "立即升级";
        }
        document.querySelectorAll(".goldBlock .gotoUpdata").innerHTML = "立即续费";
    }
    //	钻石会员
    if(paylevel == 2) {
        var allGotoUpdata = document.querySelectorAll(".gotoUpdata");
        for(var i = 0; i < allGotoUpdata.length; i++) {
            allGotoUpdata[i].innerHTML = "立即升级";
        }
        document.querySelectorAll(".goldBlock .gotoUpdata").innerHTML = "立即续费";
        document.querySelectorAll(".diamondBlock .gotoUpdata").innerHTML = "立即续费";
    }
    //	ka会员
    if(paylevel == 3) {
        document.querySelectorAll(".goldBlock .gotoUpdata").innerHTML = "立即续费";
        document.querySelectorAll(".diamondBlock .gotoUpdata").innerHTML = "立即续费";
        document.querySelectorAll(".kaBlock .gotoUpdata").innerHTML = "立即续费";
    }
}


//$($(".commontBlock").get(1)).mouseenter();
