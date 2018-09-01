(function($){

//$(window).on('load', function(){


var projectModule = {};


projectModule.$descriptionWrapper = $('.project-description-container');
projectModule.$descrptionInnerContent = projectModule.$descriptionWrapper.find('.container-inner-wrapper');
projectModule.sticked = false;


projectModule.scrollStick = function(){
  projectModule.$descriptionWrapper.css({
    'position': 'absolute',
    'top': $('.photos-container').outerHeight() - $(window).height()
  })
  projectModule.sticked = true;
};


projectModule.scrollUnstick = function(){
  $('.project-description-container').attr('style', ' ');
  projectModule.sticked = false;
};


var transformPercentage;


projectModule.contentTransform = function(){

  //console.log('shall transform');

  var st = $(window).scrollTop();

  var overflowAmount = projectModule.$descrptionInnerContent.outerHeight() - projectModule.$descriptionWrapper.outerHeight()
  transformAmount = overflowAmount*($(window).scrollTop()/($(document).height()-$(window).height()-$('footer').outerHeight()));

  //console.log($(window).scrollTop())

  //console.log(transformAmount);

  //$('.project-description-container .container-inner-wrapper').css()

  projectModule.$descrptionInnerContent.css('transform', 'translateY('+ -transformAmount+'px)');

}


//var photosContainerHeight;


$(window).on('scroll', function(){

  if( $(window).width() > 640 ){

    var photosContainerHeight = $('.photos-container').outerHeight();

    if( projectModule.$descriptionWrapper.outerHeight() <= projectModule.$descrptionInnerContent.outerHeight() ){
      if( projectModule.sticked === false ){
        projectModule.contentTransform();
      }else{
        var overflowAmount = projectModule.$descrptionInnerContent.outerHeight() - projectModule.$descriptionWrapper.outerHeight()
        projectModule.$descrptionInnerContent.css('transform', 'translateY('+ -overflowAmount+'px)');
      }
    }

    //stick content to bottom when reaching it so content does not overlap footer

    /*if( $(window).scrollTop() + $(window).height() > photosContainerHeight && projectModule.sticked == false ){
      projectModule.scrollStick();
    }else if( $(window).scrollTop() + $(window).height() < photosContainerHeight ){
      projectModule.scrollUnstick();
    }*/

  }

});

//});


$('.read-more-link').on('click', function(e){
  e.preventDefault();
  var $textWrapper = $(this).closest('.additional-text').find('.inner-wrapper')
  $textWrapper.slideDown(function(){
    $textWrapper.addClass('open')
    $('.read-more-link').slideUp();
  });
});



})(jQuery);
