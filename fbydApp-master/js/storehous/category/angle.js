(function controlAngleFn(){
	mui.plusReady(function(){
		var self=plus.webview.currentWebview();
		var index=self.index;
	
		var parent=self.parent();
		document.addEventListener("swipeleft",function(event){
		console.log("左划");
		var angle=event.detail.angle;
		amgle=Math.abs(angle);
		if(angle > 80 && angle > 185 ){
			parentEvent(parent,index,"left");
		}
	});
	document.addEventListener("swiperight",function(event){
//		console.log("右滑");
		var angle=event.detail.angle;
		angle=Math.abs(angle);
		if(angle<20){
//			parentEvent(parent,index,"right");
		}
	});
	
	})
	
	
	
	
	function parentEvent(parentWbview,index,direction){
		mui.fire(parentWbview,"swiper_event",{
			direction:direction,
			index:index
		});
	}
	
	
})();
