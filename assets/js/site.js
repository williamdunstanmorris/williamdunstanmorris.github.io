var generalFunctions = {};

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


/*
arr page hompageModule initial object properties

datafilter="" : activeFilter: "*"
adjustActiveFilters: ƒ ()
adjustName: ƒ ($item)
changeArchiveLink: ƒ ()
checkHash: ƒ ()
filter: ƒ ()
grid: a.fn.init [div.projects-grid, selector: ".projects-grid", prevObject: n.fn.init(1), context: document]
initialArchiveLink: "https://a-rr.ch/projets/"
__proto__: Object

*/

/*
this page hompageModule initial object properties

activeFilter:"*"
adjustActiveFilters: ƒ ()
adjustName: ƒ ($item)
changeArchiveLink: ƒ ()
checkHash: ƒ ()
filter: ƒ ()
grid: a.fn.init [div.projects-grid, selector: ".projects-grid", prevObject: n.fn.init(1), context: document]
initialArchiveLink: "http://localhost:4000/projets"
__proto__: Object

*/



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

// archiveLink: "https://a-rr.ch/tag-de-projet/concours/"
// archiveLink: "http://localhost:4000/tag-de-projet/git"

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
