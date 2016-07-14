/*Featured Image Zoomer (May 8th, 2010)
* This notice must stay intact for usage 
* Author: Dynamic Drive at http://www.dynamicdrive.com/
* Visit http://www.dynamicdrive.com/ for full source code
*/

// Feb 21st, 2011: Script updated to v1.5, which now includes new feature by jscheuer1 (http://www.dynamicdrive.com/forums/member.php?u=2033) to show optional "magnifying lens" while over thumbnail image.
// March 1st, 2011: Script updated to v1.51. Minor improvements to inner workings of script.
// July 9th, 12': Script updated to v1.5.1, which fixes mouse wheel issue with script when used with a more recent version of jQuery.

// jQuery.noConflict()

jQuery('head').append('<style type="text/css">.featuredimagezoomerhidden {visibility: hidden!important;}</style>');

(function($){
     $.fn.extend({
          center: function (options) {
               var options =  $.extend({ // Default values
                    inside:window, // element, center into window
                    transition: 0, // millisecond, transition time
                    minX:0, // pixel, minimum left element value
                    minY:0, // pixel, minimum top element value
                    vertical:true, // booleen, center vertical
                    withScrolling:true, // booleen, take care of element inside scrollTop when minX < 0 and window is small or when window is big
                    horizontal:true // booleen, center horizontal
               }, options);
               return this.each(function() {
                    var props = {position:'absolute'};
                    if (options.vertical) {
                         var top = ($(options.inside).height() - $(this).outerHeight()) / 2;
                         if (options.withScrolling) top += $(options.inside).scrollTop() || 0;
                         top = (top > options.minY ? top : options.minY);
                         $.extend(props, {top: top+'px'});
                    }
                    if (options.horizontal) {
                          var left = ($(options.inside).width() - $(this).outerWidth()) / 2;
                          if (options.withScrolling) left += $(options.inside).scrollLeft() || 0;
                          left = (left > options.minX ? left : options.minX);
                          $.extend(props, {left: left+'px'});
                    }
                    if (options.transition > 0) $(this).animate(props, options.transition);
                    else $(this).css(props);
                    return $(this);
               });
          }
     });
})(jQuery);

var featuredimagezoomer={
	loadinggif: 'spinningred.gif', //full path or URL to "loading" gif
	magnifycursor: 'crosshair', //Value for CSS's 'cursor' attribute, added to original image

	/////NO NEED TO EDIT BEYOND HERE////////////////
	dsetting: { //default settings
			magnifierpos: 'right',
			magnifiersize:[600, 500],
			cursorshadecolor: '#fff',
			cursorshadeopacity: 0.3,
			cursorshadeborder: '1px solid black',
			cursorshade: false,
			leftoffset: 15, //offsets here are used (added to) the width of the magnifyarea when
			rightoffset: 30 //calculating space requirements and to position it visa vis any drop shadow
		},
	isie: (function(){/*@cc_on @*//*@if(@_jscript_version >= 5)return true;@end @*/return false;})(), //is this IE?

	showimage: function($, $tracker, $mag, showstatus){
		var specs=$tracker.data('specs'), d=specs.magpos, fiz=this;
		var coords=$tracker.data('specs').coords //get coords of tracker (from upper corner of document)
		specs.windimensions={w:$(window).width(), h:$(window).height()}; //remember window dimensions
		var magcoords={} //object to store coords magnifier DIV should move to
		magcoords.left = coords.left + (d === 'left'? -specs.magsize.w - specs.lo : $tracker.width() + specs.ro);
		//switch sides for magnifiers that don't have enough room to display on the right if there's room on the left:
		if(d!=='left' && magcoords.left + specs.magsize.w + specs.lo >= specs.windimensions.w && coords.left - specs.magsize.w >= specs.lo){
			magcoords.left = coords.left - specs.magsize.w - specs.lo;
		} else if(d==='left' && magcoords.left < specs.ro) { //if there's no room on the left, move to the right
			magcoords.left = coords.left + $tracker.width() + specs.ro;
		}
		$mag.css({left: magcoords.left, top:coords.top}).show(); //position magnifier DIV on page
		
	},

	hideimage: function($tracker, $mag, showstatus){
		var specs=$tracker.data('specs');
		$mag.hide();
		if (showstatus)
			this.hidestatusdiv(specs);
	},

	showstatusdiv: function(specs, fadedur, showdur){
		clearTimeout(specs.statustimer)
		specs.$statusdiv.fadeIn(fadedur) //show status div
		specs.statustimer=setTimeout(function(){featuredimagezoomer.hidestatusdiv(specs)}, showdur) //hide status div after delay
	},

	hidestatusdiv: function(specs){
		specs.$statusdiv.stop(true, true).hide()
	},

	getboundary: function(b, val, specs){ //function to set x and y boundaries magnified image can move to (moved outside moveimage for efficiency)
		if (b=="left"){
			var rb=-specs.imagesize.w*specs.curpower+specs.magsize.w
			return (val>0)? 0 : (val<rb)? rb : val
		}
		else{
			var tb=-specs.imagesize.h*specs.curpower+specs.magsize.h
			return (val>0)? 0 : (val<tb)? tb : val
		}
	},

	moveimage: function($tracker, $maginner, $cursorshade, e){
		var specs=$tracker.data('specs'), csw = Math.round(specs.magsize.w/specs.curpower), csh = Math.round(specs.magsize.h/specs.curpower),
		csb = specs.csborder, fiz = this, imgcoords=specs.coords, pagex=(e.pageX || specs.lastpagex), pagey=(e.pageY || specs.lastpagey),
		x=pagex-imgcoords.left, y=pagey-imgcoords.top;
		$cursorshade.css({ // keep shaded area sized and positioned proportionately to area being magnified
			visibility: '',
			width: csw,
			height: csh,
			top: Math.min(specs.imagesize.h-csh-csb, Math.max(0, y-(csb+csh)/2)) + imgcoords.top,
			left: Math.min(specs.imagesize.w-csw-csb, Math.max(0, x-(csb+csw)/2)) + imgcoords.left
		});
		var newx=-x*specs.curpower+specs.magsize.w/2 //calculate x coord to move enlarged image
		var newy=-y*specs.curpower+specs.magsize.h/2
		$maginner.css({left:fiz.getboundary('left', newx, specs), top:fiz.getboundary('top', newy, specs)})
		specs.$statusdiv.css({left:pagex-10, top:pagey+20, color: '#000000'})
		specs.lastpagex=pagex //cache last pagex value (either e.pageX or lastpagex), as FF1.5 returns undefined for e.pageX for "DOMMouseScroll" event
		specs.lastpagey=pagey
	},



	init: function($, $img, options){
		var setting=$.extend({}, this.dsetting, options), w = $img.width(), h = $img.height(), o = $img.offset(),
		fiz = this, $tracker, $cursorshade, $statusdiv, $magnifier, lastpage = {pageX: 0, pageY: 0};
		setting.largeimage = setting.largeimage || $img.get(0).src;
		$magnifier=$('<div class="magnifyarea" style="position:absolute;width:'+setting.magnifiersize[0]+'px;height:'+setting.magnifiersize[1]+'px;left:-10000px;top:-10000px;visibility:hidden;overflow:hidden;border:1px solid black;" />')
			.append('<div style="position:relative;left:0;top:0;" />')
			.appendTo(document.body) //create magnifier container
		//following lines - create featured image zoomer divs, and absolutely positioned them for placement over the thumbnail and each other:
		if(setting.cursorshade){
			$cursorshade = $('<div class="cursorshade" style="visibility:hidden;position:absolute;left:0;top:0;" />')
				.css({border: setting.cursorshadeborder, opacity: setting.cursorshadeopacity, backgroundColor: setting.cursorshadecolor})
				.appendTo(document.body);
		} else { 
			$cursorshade = $('<div />'); //dummy shade div to satisfy $tracker.data('specs')
		}
		$statusdiv = $('<div class="zoomstatus preloadevt" style="position:absolute;visibility:hidden;left:0;top:0;" />')
			.html('<img src="'+this.loadinggif+'" />')
			.appendTo(document.body); //create DIV to show "loading" gif/ "Current Zoom" info
		$tracker = $('<div class="zoomtracker" style="cursor:progress;position:absolute;left:'+o.left+'px;top:'+o.top+'px;height:'+h+'px;width:'+w+'px;" />')
			.css({backgroundImage: (this.isie? 'url(cannotbe)' : 'none')})
			.appendTo(document.body);
		$(window).resize(function(){ //in case resizing the window repostions the image
				var o = $img.offset();
				$tracker.css({left: o.left, top: o.top});
			});

		function getspecs($maginner, $bigimage){ //get specs function
			var magsize={w:$magnifier.width(), h:$magnifier.height()}
			var imagesize={w:w, h:h}
			var power=(setting.zoomrange)? setting.zoomrange[0] : ($bigimage.width()/w).toFixed(5)
			$tracker.data('specs', {
				$statusdiv: $statusdiv,
				statustimer: null,
				magnifier: {$outer:$magnifier, $inner:$maginner, $image:$bigimage},
				magsize: magsize,
				magpos: setting.magnifierpos,
				imagesize: imagesize,
				curpower: power,
				coords: getcoords(),
				csborder: $cursorshade.outerWidth(),
				lo: setting.leftoffset,
				ro: setting.rightoffset
			})
		}

		function getcoords(){ //get coords of thumb image function
			var offset=$tracker.offset() //get image's tracker div's offset from document
			return {left:offset.left, top:offset.top}
		}

		$tracker.mouseover(function(e){
					$cursorshade.add($magnifier).add($statusdiv).removeClass('featuredimagezoomerhidden');
					$tracker.data('premouseout', false);
			}).mouseout(function(e){
					$cursorshade.add($magnifier).add($statusdiv.not('.preloadevt')).addClass('featuredimagezoomerhidden');
					$tracker.data('premouseout', true);
			}).mousemove(function(e){ //save tracker mouse position for initial magnifier appearance, if needed
				lastpage.pageX = e.pageX;
				lastpage.pageY = e.pageY;
			})/*.click(function(e){
				var fullS = $('#fullSize');
				$('#fullSizeImg').attr('src',$('#main-image').attr('src'));
				$('#overlay').css('display','block');
				fullS.css('display','block');
				
				fullS.center();
				$(window).bind('resize', function() {
					fullS.center({transition:300});
				});
				$('#closeBtn').css('left',fullS.css('width')+5+'px');
			})*//*Do yeu cau cua Huan nen tam thoi tat chuc nang click*/;

		$tracker.one('mouseover', function(e){
			var $maginner=$magnifier.find('div:eq(0)')
			var $bigimage=$('<img src="'+setting.largeimage+'"/>').appendTo($maginner)
			var showstatus=setting.zoomrange && setting.zoomrange[1]>setting.zoomrange[0]
			$img.css({opacity:0.1}) //"dim" image while large image is loading
			var imgcoords=getcoords()
			$statusdiv.css({left:imgcoords.left+w/2-$statusdiv.width()/2, top:imgcoords.top+h/2-$statusdiv.height()/2, visibility:'visible'})
			$bigimage.bind('loadevt', function(){ //magnified image ONLOAD event function (to be triggered later)
				$img.css({opacity:1}) //restore thumb image opacity
				$statusdiv.empty().css({border:'1px solid black', background:'#C0C0C0', padding:'4px', font:'bold 13px Arial', opacity:0.8}).hide().removeClass('preloadevt');
				if($tracker.data('premouseout')){
					$statusdiv.addClass('featuredimagezoomerhidden');
				}
				if (setting.zoomrange){ //if set large image to a specific power
					var nd=[w*setting.zoomrange[0], h*setting.zoomrange[0]] //calculate dimensions of new enlarged image
					$bigimage.css({width:nd[0], height:nd[1]})
				}
				getspecs($maginner, $bigimage) //remember various info about thumbnail and magnifier
				$magnifier.css({display:'none', visibility:'visible'})
				$tracker.mouseover(function(e){ //image onmouseover
					$tracker.data('specs').coords=getcoords() //refresh image coords (from upper left edge of document)
					fiz.showimage($, $tracker, $magnifier, showstatus)
				})
				$tracker.mousemove(function(e){ //image onmousemove
					fiz.moveimage($tracker, $maginner, $cursorshade, e)
				})
				if (!$tracker.data('premouseout')){
					fiz.showimage($, $tracker, $magnifier, showstatus);
					fiz.moveimage($tracker, $maginner, $cursorshade, lastpage);
				}
				$tracker.mouseout(function(e){ //image onmouseout
					fiz.hideimage($tracker, $magnifier, showstatus)
				}).css({cursor: fiz.magnifycursor});
				if (setting.zoomrange && setting.zoomrange[1]>setting.zoomrange[0]){ //if zoom range enabled
					$tracker.bind('DOMMouseScroll mousewheel', function(e){
						fiz.magnifyimage($tracker, e, setting.zoomrange);
						e.preventDefault();
					});
				}
			})	//end $bigimage onload
			if ($bigimage.get(0).complete){ //if image has already loaded (account for IE, Opera not firing onload event if so)
				$bigimage.trigger('loadevt')
			}
			else{
				$bigimage.bind('load', function(){$bigimage.trigger('loadevt')})
			}
		})
	},

	iname: (function(){var itag = jQuery('<img />'), iname = itag.get(0).tagName; itag.remove(); return iname;})()
};

jQuery.fn.addimagezoom=function(options){
	var $=jQuery;
	return this.each(function(){ //return jQuery obj
		if (this.tagName !== featuredimagezoomer.iname)
			return true; //skip to next matched element
		featuredimagezoomer.init($, $(this), options);
	});
}

/* show thumbnail div */
jQuery(window).load (function () { 
      jQuery('#imgLoading').hide();
	  jQuery('#piGal').fadeIn('slow');
	  jQuery('#main-image').addimagezoom({
		zoomrange: [3, 10],
		magnifierpos: 'right',
		cursorshade: true
	})
	jQuery('#overlay').hover(function() {
			showContent();
		});
	jQuery('#closeBtn').hover(function() {
			showContent();
		});
  });

/* init thumbnail and main image*/
jQuery(document).ready(function($) {

	if ($('.product-thumbnail', '#piGal').length > 0) {

			var thumbWidth = 84;
			var thumbHeight = 96;	
		$('.product-thumbnail').each(function() {
			var mainSize = new Array(350, 500);
			var ratio = 1;
			var currentImg = $(this);

			var curWidth = (currentImg.attr('width'));
			var curHeight = (currentImg.attr('height'));
			var mainImg = $('#main-image');
			console.log(curHeight);
			
			if ((thumbWidth/curWidth) <= (thumbHeight/curHeight))
				ratio = (thumbWidth/curWidth);
			else ratio = (thumbHeight/curHeight);
			
			currentImg.width(curWidth*ratio+'px');
			currentImg.height(curHeight*ratio+'px');

			if ((mainSize[0]/curWidth) <= (mainSize[1]/curHeight))
				mainSize[1] = (mainSize[0]/curWidth)*curHeight;
			else mainSize[0] = (mainSize[1]/curHeight)*curWidth;
			
			currentImg.hover(function(event) {
				$('.zoomtracker').remove();
				mainImg.attr('src',currentImg.attr('src')).width(mainSize[0]+'px').height(mainSize[1]+'px').addimagezoom({
				zoomrange: [3, 10],
				magnifierpos: 'right',
				cursorshade: true,
				largeimage: currentImg.attr('src')
				})
			});
		});
		
			/* init first image */
			var mainSize = new Array(350, 500);
			var ratio = 1;
			var firstImg = $('.product-thumbnail', '#piGal').first();
			var firstWidth = (firstImg.attr('width'));
			var firstHeight = (firstImg.attr('height'));
			
			if ((mainSize[0]/firstWidth) <= (mainSize[1]/firstHeight))
				mainSize[1] = (mainSize[0]/firstWidth)*firstHeight;
			else mainSize[0] = (mainSize[1]/firstHeight)*firstWidth;
			$('#main-image').attr('src',firstImg.attr('src')).width(mainSize[0]+'px').height(mainSize[1]+'px');
			
	}
	
});

// function showContent() {
// 	jQuery('#overlay').hide();
// 	jQuery('#fullSize').hide();
// 	jQuery('#fullSizeImg').removeAttr('src');
// };
