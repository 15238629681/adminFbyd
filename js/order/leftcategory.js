function leftCategory(){
	var leftDiv=document.createElement("div");
	leftDiv.innerHTML='<div class="pageLogo"><img src="../../img/public/orderlogo.png" alt="" />订单管理</div><div class="itemList"><div><a href="allorder.html">全部订单</a></div><div><a href="nodeliveryorder.html">未发货订单</a></div><div><a href="waitingreturngoods.html">待处理退货订单</a></div><div><a href="returngoods.html">已处理退货订单</a></div><div><a href="refundorder.html">退款订单</a></div></div>';
	$(".leftWapper").html(leftDiv);
}
leftCategory();