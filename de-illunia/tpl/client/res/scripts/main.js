$(document).ready(function(){
	$("#big-image img:eq(0)").nextAll().hide();
    $(".small-images ul li").click(function(e){
        var index = $(this).index();
        $("#big-image img").eq(index).show().siblings().hide();
    });
	var temp = 0;
	$('.pro-detail').each(function (index) {
      if($(this).outerHeight() > temp)
      {
        temp = $(this).outerHeight();
      }          
     });
    $('#pro-detail-left').css('min-height',temp);
	$('#pro-detail-right').css('min-height',temp - 200);
	/****************/
	$(".owl-carousel").owlCarousel({
		loop:true,
		items:1,
		dots:true,
		nav:false,
		autoplay:true
	});
	$('.owl-carousel-recently').owlCarousel({
		loop:false,
		margin:10,
		dots:false,
		responsiveClass:true,
		responsive:{
			0:{
				items:1,
				nav:false
			},
			600:{
				items:4,
				nav:true
			},
			960:{
				items:6,
				nav:true
			},
			1200:{
				items:6,
				nav:true,
				loop:false
			}
		}
	});
	/**************/
	$(window).scroll(function() {
		if($(window).width() >= 1024){
			if($(window).scrollTop() != 0) {
				$('#top').fadeIn();
			} else {
				$('#top').fadeOut();
			}
		}
	});
	$('#top').click(function() {
		$('html, body').animate({scrollTop:0},500);
	});
});
$(function () {
    $("#btnredirect").click(function () {
        var seconds = 5;
        $("#dvCountDown").show();
        $("#lblCount").html(seconds);
        setInterval(function () {
            seconds--;
            $("#lblCount").html(seconds);
            if (seconds == 0) {
                $("#dvCountDown").hide();
                window.location = "Homepage.html";
            }
        }, 1000);
    });
});