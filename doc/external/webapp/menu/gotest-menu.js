
(function() {
  $(document).ready(function() {
    $('#navbox-trigger').click(function() {
      return $('#top-bar').toggleClass('navbox-open');
    });
    return $(document).on('click', function(e) {
      var $target, boxClicked, triggerClicked;
      $target = $(e.target);
      boxClicked = $target.closest('.navbox').length;
      triggerClicked = $target.closest('#navbox-trigger').length;
      if (!boxClicked && !triggerClicked) {
        return $('#top-bar').removeClass('navbox-open');
      }
    });
  });

}).call(this);
