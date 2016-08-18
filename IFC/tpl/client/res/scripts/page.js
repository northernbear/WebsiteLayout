$(document).ready(function(){
  $(".owl-carousel").owlCarousel({
	loop:true,
	items:1,
	dots:true,
	nav:false,
	autoplay:true
  });
  $('.owl-carousel-p').owlCarousel({
    loop:true,
    margin:41,
	dots:false,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        480:{
            items:2,
            nav:true
        },
        600:{
            items:3,
            nav:true
        },
		768:{
            items:4,
            nav:true
        },
        960:{
            items:5,
            nav:true
        },
		1200:{
            items:6,
            nav:true,
            loop:false
        }
    }
	});
	$('.owl-carousel-meet').owlCarousel({
    loop:true,
    margin:27,
	dots:false,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        480:{
            items:2,
            nav:true
        },
        600:{
            items:2,
            nav:true
        },
		768:{
            items:3,
            nav:true
        },
        960:{
            items:4,
            nav:true
        },
		1200:{
            items:4,
            nav:true,
            loop:false
        }
    }
	});
	var temp = 0;
	$('.build').each(function (index) {
      if($(this).outerHeight() > temp)
      {
        temp = $(this).outerHeight();
      }          
     });
    $('.build .build-content').css('min-height',temp);
	$(".nav .btn-menu").click(function(){
		$(".nav ul li+li").toggle();
	});
	/*$(".nav .btn-menu").click(function(){
		$(".nav ul li+li").show();
	});*/
	// Configure/customize these variables.
    var showChar = 135;  // How many characters are shown by default
    var ellipsestext = "...";
    var moretext = '<img src="tpl/client/res/images/ico/icon_show.png" alt="show"/>';
    var lesstext = '<img src="tpl/client/res/images/ico/icon_hide.png" alt="show"/>';
    

    $('.meecontent p').each(function() {
        var content = $(this).html();
 
        if(content.length > showChar) {
 
            var c = content.substr(0, showChar);
            var h = content.substr(showChar, content.length - showChar);
 
            var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span><a href="" class="morelink">' + moretext + '</a></span>';
 
            $(this).html(html);
        }
 
    });
 
    $(".morelink").click(function(){
        if($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
});

