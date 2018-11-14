$(window).scroll(function(){
  $('div.title').each(function(){
    if (inView($(this))) {
      if ($(this).find('p').hasClass('animated')) {
      $(this).find('p').css('display','block');
      $(this).find('p').addClass('rotateInUpLeft');
    }
  }
  });
});

function inView(elem){
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top - 50;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
