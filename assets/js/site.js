var generalFunctions = {};

(function($){

})(jQuery);

(function($){

  //disabling scrolling

  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  var keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1};

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
  }

  function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
          preventDefault(e);
          return false;
      }
  }

  //disable scroll
  generalFunctions.disableScroll = function() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
  }

  //enable scroll
  generalFunctions.enableScroll = function() {
      if (window.removeEventListener)
          window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
  }

var homepageModule = {};

// Get the href of the .archives link attribute
homepageModule.initialArchiveLink = $('.archives-link').attr('href');

// Declared function to change the archive link to what the current homepageModule link is
homepageModule.changeArchiveLink = function(){
  $('.archives-link').attr('href', homepageModule.archiveLink );
}

// Declared function to adjust the active filters. It defaults to dimming all elements.
homepageModule.adjustActiveFilters = function(){
  // If the homepageModule active filter is not equal to *, dim all element of the navbar and sidebar.
  if(homepageModule.activeFilter != '*' ){
    $('.filter').addClass('inactive');
    $('.nav-right').addClass('filtering-active');
  }else{
  // If remove and undim all navbar and sidebar elements.
    $('.nav-right').removeClass('filtering-active');
    $('.filter').removeClass('inactive');
  }

// Select the element that has the active filter highlighted, and remove the class, so that this element becomes selected.
  $('.filter[data-filter="'+homepageModule.activeFilter+'"]').removeClass('inactive');

}

// Function to check the hash which is before tagged elements
homepageModule.checkHash = function(){
  // Local hash will
  var locHash = window.location.hash.substr(1);
  homepageModule.activeFilter = '';
  if( locHash.length > 0 ){
    homepageModule.activeFilter = locHash;
    homepageModule.archiveLink = $('[data-filter="' + locHash + '"]').attr('data-archive');
    // Does the sidebar and/or navbar add an active filter or not?
    $('.filter[data-filter='+locHash+']').addClass('active');
  }else{
    homepageModule.activeFilter = '*';
  }
}
homepageModule.checkHash();
homepageModule.changeArchiveLink();

/*
activeFilter:"git"
adjustActiveFilters: ƒ ()
adjustName: ƒ ($item)
archiveLink: "http://localhost:4000/tag-de-projet/git"
changeArchiveLink: ƒ ()
checkHash: ƒ ()
filter: ƒ ()
grid: a.fn.init [div.projects-grid, selector: ".projects-grid", prevObject: n.fn.init(1), context: document]
initialArchiveLink: "http://localhost:4000/projets"
__proto__:Object

activeFilter:"concours"
adjustActiveFilters: ƒ ()
adjustName:ƒ ($item)
archiveLink:"https://a-rr.ch/tag-de-projet/concours/"
changeArchiveLink:ƒ ()
checkHash: ƒ ()
filter: ƒ ()
grid: a.fn.init [div.projects-grid, selector: ".projects-grid", prevObject: n.fn.init(1), context: document]
initialArchiveLink: "https://a-rr.ch/projets/"
__proto__: Object

*/

homepageModule.filter = function(){
  homepageModule.grid.isotope({ filter: function(){
    return homepageModule.activeFilter === '*' || $(this).hasClass(homepageModule.activeFilter) || $(this).hasClass('archives-link')
  }
  });
  homepageModule.changeArchiveLink();
  homepageModule.adjustActiveFilters();
}


homepageModule.adjustName = function($item){
  var posTop = $item.outerHeight()/2 + $item.find('img').height()/2 ;
  $item.find('.project-name').css('top', posTop);
}


// Toggle css active for clicked element. Remove filtered on hover options, which bold elements when container images are highlighted.
$('.filter').on('click', function(){

  $this = $(this);
  // Remove any other active filter that is not this.
  $('.filter').not($(this)).removeClass('active');
  // Toggle this class active
  $this.toggleClass('active');
  // Remove filtered on hover class , which boldens elements when hovered on.
  $('.nav-right').removeClass('filtered-on-hover');
  // If chosen class is active, change the activeFilter and archiveLink respectively.
  if( $this.hasClass('active') ){
    homepageModule.activeFilter = $this.attr('data-filter');
    homepageModule.archiveLink = $this.attr('data-archive');
  }else{
    homepageModule.activeFilter = '*';
  }
// Error here - "homepageModule is not defined"
  homepageModule.filter();

});

homepageModule.grid = $('.projects-grid').isotope({
  itemSelector: '.project-item',
  // stagger: 5,
  transitionDuration: '0.4s',

  filter: function(){
    return homepageModule.activeFilter === '*' || $(this).hasClass(homepageModule.activeFilter) || $(this).hasClass('archives-link')
  }
});

homepageModule.grid.on( 'arrangeComplete', function( event, filteredItems ) {
  $(window).trigger('scroll');
});

if( $('body').hasClass('home') ){
  homepageModule.adjustActiveFilters();
}

$('.project-item:not(.archives-link)').on('mouseenter', function(){

  if( $(this).find('img').hasClass('loaded') ){
    homepageModule.adjustName( $(this) );
  }

  var category = $(this).attr('class').replace('project-item ', '');
  $('.filter').addClass('highlight');

  if( category.split(' ').length > 1 ){
    var categories = category.split(' ');
    for( var i = 0; i<categories.length; i++ ){
      $('.filter[data-filter="'+categories[i]+'"]').removeClass('highlight');
    }
  }else{
    $('.filter[data-filter="'+category+'"]').removeClass('highlight');
  }

  if( $('nav .nav-right .filter.highlight').length >= 1 ){
    $('.nav-right').addClass('filtered-on-hover');
  }else{
    $('.nav-right').removeClass('filtered-on-hover');
  }

});


$('.project-item').on('mouseleave', function(){
  $('.filter.highlight').removeClass('highlight');
  $('.nav-right').removeClass('filtered-on-hover');
});


$(function() {
  $('.lazy').Lazy({
    afterLoad: function(element){
      $(element).addClass('loaded');
    }
  });
});




//mobile filters

var filtersOpen = false;

$('.filters-mobile-link').on('click', function(){
  if( filtersOpen ){
    $('.sidebar-wrapper .sidebar').removeClass('open').stop().slideUp(300);
    filtersOpen = false;
  }else{
    $('.sidebar-wrapper .sidebar').stop().slideDown(300, function(){
      $(this).addClass('open');
    });
    filtersOpen = true;
  }
  $(this).toggleClass('active');
});


//responsive menu

var menuOpen = false;

$('.menu-trigger').on('click', function(){
  if( menuOpen ){
    menuOpen = false;
    generalFunctions.enableScroll();
  }else{
    menuOpen = true;
    generalFunctions.disableScroll();
  }
  $('.mobile-links').toggleClass('open');
  $('body').toggleClass('menu-open');
  $(this).toggleClass('active');
});

$('nav .overlay').on('click', function(){
  if( menuOpen ){
    menuOpen = false;
    generalFunctions.enableScroll();
  }
  $('.mobile-links').toggleClass('open');
  $('body').toggleClass('menu-open');
  $('.menu-trigger').toggleClass('active');
});



$('.project-item').on('click', function(){
  window.location.hash = '';
});


//team members on phones

$('.team-member-wrapper').on('click', function(e){

  e.stopPropagation();

  if( window.innerWidth < 1025 ){

    $('.team-member-wrapper').not($(this)).removeClass('touched');

    if( $(this).attr('href') && $(this).attr('href').length > 0 ){

      if( !$(this).hasClass('touched') ){
        $(this).addClass('touched');
        e.preventDefault();
      }

    }else{
      $(this).toggleClass('touched');
    }
  }

});


$(window).on('click', function(){
  if( window.innerWidth < 1025 ){
    $('.team-member-wrapper').removeClass('touched');
  }
});


$(window).bind("pageshow", function(event) {
    if (event.originalEvent.persisted) {
      window.location.reload();
    }
});


//animate splash logo

//localStorage.setItem('splashShown', '');

// $(window).on('load', function(){
//   if( localStorage.getItem('splashShown') !== 'true' ){
//     window.setTimeout(function(){
//       $('.splash-overlay').fadeOut( 800);
//     }, 200)
//     //localStorage.setItem('splashShown', 'true');
//   }
// });






})(jQuery);



// JavaScript Document
$ = jQuery;
var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var h280 = (280*h) / 1298;
var md = new MobileDetect(window.navigator.userAgent);
document.addEventListener('DOMContentLoaded', function(){
	if($(".single-product").length){
		h280 = ((280*h) / 1298);
		$(".single-product .specifiche").css({"top": h280+"px"});
	}
	$(document).on("change","#nazione", function(){
		var naz = $(this).val();
		var titoletto = $(".singola h2").html();
		if(naz){
			$.ajax({
				type: "POST",
				url: "https://www.fru.it/ajax-storelocator/",
				cache: true,
				data: {
					val: naz,
					articolo: titoletto
				},
				beforeSend: function() {
					$("#layStore").html("");
					if(naz != "ITA"){
						$("#layStore").append("<div class='backnero'></div>");
						$("#regione").closest('.styled-select').remove();
						TweenMax.to($("#layStore"), 1, {autoAlpha: 1, ease: Expo.easeOut});
						TweenMax.set($("html"), {overflow: "hidden"});
					}else{
						$("#layStore").append("<img src='https://www.fru.it/site/wp-content/themes/fruit2019/img/720.gif' alt='fru.it' id='loading'>");
					}
				},
				success: function(e) {
					var a = $.parseJSON(e);
					if(a.regione){
						$("#loading").remove();
						$("#store_loc").append(a.regione);
					}
					if(a.lista){
						$("#layStore").append(a.lista);
					}
				}
			});
		}else{
			$("#regione").closest('.styled-select').remove();
		}
	});
	$(document).on("change","#regione", function(){
		var freg = $(this).val();
		var titoletto = $(".singola h2").html();

		if(freg){
			$.ajax({
				type: "POST",
				url: "https://www.fru.it/ajax-storelocator/",
				cache: true,
				data: {
					reg: freg,
					articolo: titoletto
				},
				beforeSend: function() {
					$("#layStore").html("");
					$("#layStore").append("<div class='backnero'></div>");
						TweenMax.to($("#layStore"), 1, {autoAlpha: 1, ease: Expo.easeOut});
						TweenMax.set($("html"), {overflow: "hidden"});
				},
				success: function(e) {
					var a = $.parseJSON(e);
					if(a.regione){
						$("#store_loc").append(a.regione);
					}
					if(a.lista){
						$("#layStore").append(a.lista);
					}
				}
			});
		}
	});
	$(document).on("click","#lisclose", function(){
		TweenMax.to($("#layStore"), 1, {autoAlpha: 0, ease: Expo.easeOut});
		TweenMax.set($("html"), {overflow: "inherit"});
		$("#store_loc .styled-select").eq(1).remove();
		$('#store_loc select option:first').attr('selected',true);
	});
	$('.lazy').lazy({
        effect: "fadeIn",
        effectTime: 300,
        threshold: 0,
        scrollDirection: 'vertical',
        visibleOnly: true,
        afterLoad: function(element) {
            element.removeClass("loading");
        }
      });
	$(document).on("click","#cerca", function(){
		if(!$(this).hasClass("open")){
			TweenMax.to($("#search_form"), .3,{autoAlpha:1,ease: Power0.easeOut});
			TweenMax.set($(this),{delay:.3, className:"+=open"});
			TweenMax.set($("#shoppingMenu"),{zIndex:"5"});
		}else{
			var inschars = $( "#search_form input" ).val();
			var nchars = inschars.length;
			if(nchars > 0){
				$.ajax({
					type: "POST",
					url: "https://www.fru.it/test-search",
					cache: true,
					data: {
						ss: inschars
					},
					beforeSend: function() {
						TweenMax.to($("#search"), .3,{autoAlpha:1,ease: Power0.easeOut});
						TweenMax.set($("#search"),{delay:.3, overflowY:"scroll", className:"+=open"});
						TweenMax.set($("body"),{delay:.3,overflow:"hidden"});
						$("#search .result").html("<img src='https://www.fru.it/site/wp-content/themes/fruit2019/img/720.gif' alt='fru.it' id='load-search'>");
					},
					success: function(e) {

						$("#search .result").html(e);
					}
				});
			}else{
				TweenMax.to($("#search_form"), .3,{autoAlpha:0,ease: Power0.easeOut});
				TweenMax.set($(this),{delay:.3, className:"-=open"});
				TweenMax.set($("#shoppingMenu"),{delay:.3, zIndex:"1"});
			}

		}
		return false;
	});
	$( "#search_form input" ).keyup(function() {
            var conta = $(this).val();
            var n = conta.length;

                if(n > 2){
					if(!$("#search").hasClass("open")){
						TweenMax.to($("#search"), .3,{autoAlpha:1,ease: Power0.easeOut});
						TweenMax.set($("#search"),{delay:.3, overflowY:"scroll", className:"+=open"});
						TweenMax.set($("body"),{delay:.3,overflow:"hidden"});
					}
                        $.ajax({
                            type: "POST",
                            url: "https://www.fru.it/test-search",
                            cache: true,
                            data: {
                                ss: conta
                            },
                            beforeSend: function() {
                                $("#search .result").html("<img src='https://www.fru.it/site/wp-content/themes/fruit2019/img/720.gif' alt='fru.it' id='load-search'>");
                            },
                            success: function(e) {
                                $("#search .result").html(e);
                            }
                        });


                }else{
                    $("#search .result").html("");
					TweenMax.to($("#search"), .3,{autoAlpha:0,ease: Power0.easeOut});
						TweenMax.set($("#search"),{delay:.3, className:"-=open"});
					TweenMax.set($("body"),{delay:.3,overflow:"inherit"});
                }

          });
	var videoHome = $('#videoHome')[0];
			$(document).on("click","#elenco-video .controlli .fa-play", function(){
				var video_el = $(this).closest(".vid").find("video").attr("id");
				var this_vid = $("#"+video_el)[0];
				TweenMax.to($(this).closest(".vid").find("h2"), 1, {top:"+=10%",opacity: 0, ease: Expo.easeOut});
				TweenMax.to($(this).closest(".vid").find("h3"), 1, {top:"+=10%",opacity: 0, ease: Expo.easeOut});
				$("video").each(function(){
					if($(this).hasClass("playing")){
						$(this)[0].pause();
						$(this)[0].currentTime = 0;
						$(this)[0].load();
						TweenMax.to($(this).closest(".vid").find("h2"), 1, {top:"-=10%",opacity: 1, ease: Expo.easeOut});
						TweenMax.to($(this).closest(".vid").find("h3"), 1, {top:"-=10%",opacity: 1, ease: Expo.easeOut});
						$(this).closest(".vid").find(".controlli i").removeClass('fa-pause').addClass('fa-play');
						$(this).removeClass("playing");
					}
				});
				TweenMax.to($("#"+video_el).closest(".vid").find(".controlli i"),0.4,{opacity:0,delay:1.5})
				setTimeout(function(){
					this_vid.play();
					$("#"+video_el).addClass("playing");
					$("#"+video_el).closest(".vid").find(".controlli i").removeClass('fa-play').addClass('fa-pause');
				},200);
			});
			$(document).on("click","#elenco-video .controlli .fa-pause", function(){
				var video_el = $(this).closest(".vid").find("video").attr("id");
				var this_vid = $("#"+video_el)[0];
				TweenMax.to($("#"+video_el).closest(".vid").find(".controlli i"),0.4,{opacity:1})
				$("#"+video_el).closest(".vid").find(".controlli i").removeClass('fa-pause').addClass('fa-play');
				$("#"+video_el).removeClass("playing");
				this_vid.pause();
			});
			$( ".vid .controlli" )
			.mouseenter(function() {
					TweenMax.to($(this).find(".fa-pause"), .3,{opacity:1,ease: Power0.easeOut});
					TweenMax.to($(this).find(".fa-play"), .3,{opacity:1,ease: Power0.easeOut});

			})
			.mouseleave(function() {
				if($(this).closest("video").hasClass("playing")){
					TweenMax.to($(this).find(".fa-play"), .3,{opacity:0,ease: Power0.easeOut});
					TweenMax.to($(this).find(".fa-pause"), .3,{opacity:0,ease: Power0.easeOut});
				}
			});
			$(".home .video").bind('inview', function(event, visible) {
					if(visible){
						videoHome.load();
					}
				});
			$(document).on('click','.home .video a',function(){
				if($(this).find('i').hasClass('fa-play')){
					$(this).find('i').removeClass("fa-play");
					$(this).find('i').addClass("fa-pause");
					videoHome.play();
				}else{
					$(this).find('i').removeClass("fa-pause");
					$(this).find('i').addClass("fa-play");
					videoHome.pause();
				}
				return false;
			});
			$( ".home .video a" )
			.mouseenter(function() {
				TweenMax.to($(this).find("i"), .3,{opacity:1,ease: Power0.easeOut});
			})
			.mouseleave(function() {
				TweenMax.to($(this).find("i"), .3,{opacity:0,ease: Power0.easeOut});
			});

			if(videoHome){
				videoHome.onended = function(e) {
					$(".video a i").removeClass("fa-pause");
					$(".video a i").addClass("fa-play");
					videoHome.load();
				};
			}
			$(document).on("click", ".reset_variations", function() {
                $(".variations div").each(function() {
                    $(this).removeClass("selec")
                });
			});
			$(document).on("click", ".hamburger", function() {
				if(!md.mobile()){
					if($(this).hasClass("close")){
						TweenMax.to($(this).find('span').eq(0), .3,{top:"14px",ease: Expo.easeOut, onComplete: function(){
							TweenMax.to($('.hamburger span').eq(0), .3,{rotation:45,ease: Expo.easeOut});
						}});
						TweenMax.to($(this).find('span').eq(2), .3,{top:"14px",ease: Expo.easeOut, onComplete: function(){
							TweenMax.to($('.hamburger span').eq(2), .3,{rotation:-45,ease: Expo.easeOut});
						}});
						TweenMax.set($(this).find('span').eq(1), {delay:.3,opacity:0});
						TweenMax.set($(this), {delay:.3,className:"-=close"});
						TweenMax.to($('#layerMenu'), 1.2,{autoAlpha:1,ease: Expo.easeOut});
					}else{
						TweenMax.to($(this).find('span').eq(0), .3,{rotation:0,ease: Expo.easeOut, onComplete: function(){
							TweenMax.to($('.hamburger span').eq(0), .3,{top:"5px",ease: Expo.easeOut});
						}});
						TweenMax.to($(this).find('span').eq(2), .3,{rotation:0,ease: Expo.easeOut, onComplete: function(){
							TweenMax.to($('.hamburger span').eq(2), .3,{top:"23px",ease: Expo.easeOut});
						}});
						TweenMax.set($(this).find('span').eq(1), {delay:.3,opacity:1});
						TweenMax.set($(this), {delay:.3,className:"+=close"});
						TweenMax.to($('#layerMenu'), 1.2,{autoAlpha:0,ease: Expo.easeOut});
					}
				}else{
					if($(this).hasClass("close")){
						TweenMax.to($(this).find('span').eq(0), .3,{top:"7px",ease: Expo.easeOut, onComplete: function(){
							TweenMax.to($('.hamburger span').eq(0), .3,{rotation:45,ease: Expo.easeOut});
						}});
						TweenMax.to($(this).find('span').eq(2), .3,{top:"7px",ease: Expo.easeOut, onComplete: function(){
							TweenMax.to($('.hamburger span').eq(2), .3,{rotation:-45,ease: Expo.easeOut});
						}});
						TweenMax.set($(this).find('span').eq(1), {delay:.3,opacity:0});
						TweenMax.set($(this), {delay:.3,className:"-=close"});
						TweenMax.to($('#layerMenu'), 1.2,{autoAlpha:1,ease: Expo.easeOut});
					}else{
						TweenMax.to($(this).find('span').eq(0), .3,{rotation:0,ease: Expo.easeOut, onComplete: function(){
							TweenMax.to($('.hamburger span').eq(0), .3,{top:"0px",ease: Expo.easeOut});
						}});
						TweenMax.to($(this).find('span').eq(2), .3,{rotation:0,ease: Expo.easeOut, onComplete: function(){
							TweenMax.to($('.hamburger span').eq(2), .3,{top:"14px",ease: Expo.easeOut});
						}});
						TweenMax.set($(this).find('span').eq(1), {delay:.3,opacity:1});
						TweenMax.set($(this), {delay:.3,className:"+=close"});
						TweenMax.to($('#layerMenu'), 1.2,{autoAlpha:0,ease: Expo.easeOut});
					}
				}
			});
			$(document).on("change", ".prod-variations .variations .value div input:radio", function() {
                var e = $(this);
				$(".prod-variations .variations .value div").removeClass("selec");
				e.closest("div").addClass("selec");
			});
			$(".prod-variations .variations .value div input").each(function() {
				$stat = $(this)[0].checked, !0 === $stat && $(this).closest("div").addClass("selec");
			});
			$('#cart-button').click(function(e){

                    if($('.single-product').length){
                        woofc_show_cart();
                    }else{
                        window.open("https://www.fru.it/carrello/","_self");
                    }
                    return false;
                });


});
window.addEventListener('resize', function(event){
  w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	if($(".single-product .dascrollare").length){
  		h280 = ((280*h) / 1298);
  		$(".single-product .specifiche").css({"top": h280+"px"});
	}
});
window.addEventListener('scroll', function() {
	if(window.pageYOffset >= 140){
		$("header").addClass("head-fix");
	}else{
		$("header").removeClass("head-fix");
	}
});

// Foundation enable

$(document).foundation();
