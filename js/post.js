$(document).ready(function() {
	window.onmousewheel = function(){
		var window_height = $(window).height();
		var document_height = $(".row").height();
		var top_total = document_height - window_height/2;
		var offset_top = $(".row").offset().top;
		var set_abs = Math.abs(offset_top/top_total);
		var set = Math.round(set_abs*100)/100;
		NProgress.set(set);
	}

	$("#back-top").on("click",function(){
		$('html, body').animate({ scrollTop: 0 }, 'fast');
	})
	
	$("#back-top-image").on("click",function(){
		#("html,body").animate({scrollTop: 0},'fast');
	})
})
