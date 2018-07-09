/*from new_map.js */

function rightscroll() {
  scrollhide = 'yes';
  $(".leftarrowdiv").removeClass('hide');
  $(".js-rightplanel").animate({
      "right": "-400px"
    }, 500,
    function() {
      $(".rightarrowdiv").addClass('hide');
    });
  $('.footer-logo, #btn-map, #btn-satellite').animate({
    'margin-right': '0px'
  }, 500);
}

function leftscroll() {
  $(".leftarrowdiv").addClass('hide');
  $(".js-rightplanel").animate({
      "right": "0px"
    }, 500,
    function() {
      $(".rightarrowdiv").attr("style", "");
      $(".rightarrowdiv").removeClass('hide');
    });
  var screensize = $(window).width();
  var rightplane = $('.slide-right-left').width();
  $('.footer-logo').animate({
    'margin-right': (rightplane / 2) + 'px'
  }, 300);
  $('#btn-map, #btn-satellite').animate({
    'margin-right': rightplane + 'px'
  }, 125);
}

function setdirectionstravel(travelmode) {
  $('#directionstravel').val(travelmode);
  $('.travelmode').removeClass('active');
  $('#' + travelmode).addClass('active');
  //routedirection('search','',''); set map and choice of travel directions
}

function swap() {
  var dirSource = $('#dirSource').val();
  var dirDestination = $('#dirDestination').val();
  $('#dirSource').val(dirDestination);
  $('#dirDestination').val(dirSource);
  routedirection('search', '', '');
}
/* end new_map.js */

$('.direction-list li.fa').on('mouseover', function() {
  $(this).css('opacity', 1.0)
})
$('.direction-list li.fa').on('mouseout', function() {

  if ($(this).hasClass('active')) {

  } else {
    $(this).css('opacity', 0.5)
  }
})

$('.direction-list li.fa').on('click', function() {
  $('#directionsPanel .active').removeClass('active')
  $('.direction-list li.fa').css('opacity', '0.5')
  $(this).addClass('active');
  $(this).css('opacity', '1.0')
})

$('.travel a, .drive a, .walk a, .cycle a').on('click', function() {
  $('.direction-list li.fa').css('opacity', '0.5');
  $('.direction-list li.fa').removeClass('active');
})








var json = [{ 
    "lat": 57.95, 
    "lng": 14.65, 
    "content":"test content1" 
}, 
{ 
    "lat": 57.9, 
    "lng": 14.6, 
    "content":"test content2" 
}, 
{ 
    "lat": 57.85, 
    "lng": 14.55,
    "content":"test content3"
}];

function initialize() {
        var latitude = 57.95,
            longitude = 14.65,
            radius = 8000, //how is this set up
            center = new google.maps.LatLng(latitude,longitude),
            bounds = new google.maps.Circle({center: center, radius: radius}).getBounds(),
            mapOptions = {
                center: center,
                zoom: 9,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        setMarkers(center, radius, map);
    }

    function setMarkers(center, radius, map) {

        var circle = new google.maps.Circle({
                strokeColor: '#000000',
                strokeOpacity: 0.25,
                strokeWeight: 1.0,
                fillColor: '#ffffff',
                fillOpacity: 0.1,
                clickable: false,
                map: map,
                center: center,
                radius: radius
            });
        var bounds = circle.getBounds();

        //loop between each of the json elements
        for (var i = 0, length = json.length; i < length; i++) {
            var data = json[i],
            latLng = new google.maps.LatLng(data.lat, data.lng); 



            //if(bounds.contains(latLng)) {
                // Creating a marker and putting it on the map
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: data.content
                });
                infoBox(map, marker, data);
            //}
        }

        circle.bindTo('center', marker, 'position');
    }

    function infoBox(map, marker, data) {
        var infoWindow = new google.maps.InfoWindow();
        // Attaching a click event to the current marker
        google.maps.event.addListener(marker, "click", function(e) {
            infoWindow.setContent(data.content);
            infoWindow.open(map, marker);
        });

        // Creating a closure to retain the correct data 
        // Note how I pass the current data in the loop into the closure (marker, data)
        (function(marker, data) {
          // Attaching a click event to the current marker
          google.maps.event.addListener(marker, "click", function(e) {
            infoWindow.setContent(data.content);
            infoWindow.open(map, marker);
          });
        })(marker, data);
    }

   google.maps.event.addDomListener(window, 'load', initialize);

