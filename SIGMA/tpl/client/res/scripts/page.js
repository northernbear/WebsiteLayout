$(document).ready(function(){
  $(".owl-carousel").owlCarousel({
	loop:true,
	items:1,
	dots:true,
	nav:false,
	autoplay:true
  });
  $('.owl-product').owlCarousel({
    loop:false,
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
        690:{
            items:3,
            nav:true
        },
		767:{
            items:3,
            nav:true
        },
        992:{
            items:5,
            nav:true
        },
		1179:{
            items:5,
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
	var temp = 0, temp1 = 0, temp2 = 0;
	$('.xu-prodetail #thumbcarousel .item .pro-thumb').each(function (index) {
		if($(this).outerHeight() > temp)
		{
			temp = $(this).outerHeight();
		}          
    });
    $('.xu-prodetail .item .pro-thumb').css('height',temp);
	$('#xu-products h3.xu-product-title').each(function (index) {
      if($(this).outerHeight() > temp1)
      {
        temp1 = $(this).outerHeight();
      }          
     });
    $('#xu-products h3.xu-product-title').css('height',temp1);
	$('.xu-gallery .pro-list').each(function (index) {
      if($(this).outerHeight() > temp2)
      {
        temp2 = $(this).outerHeight();
      }          
     });
    $('.xu-gallery .pro-list').css('height',temp2);
	$('.top-bread .col-sm-5 .fa').click(function(){
		$('.pro-content .col-sm-9').addClass('xu-list');
	});
	$('.top-bread .col-sm-5 .fa.fa-th').click(function(){
		$('.pro-content .col-sm-9').removeClass('xu-list');
	});
});

