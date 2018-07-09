.. _webapp-overview:

نوبت دهی از طریق وبسایت چگونه است ؟ 
===================

صفحه اصلی
----------

.. image:: static/img/index.png

ثبت نام
~~~~~~~

.. image:: static/img/logup.png

بعد از ثبت نام یا احراز هویت میتوانید از منوی سمت راست به جست و جوی بانک داخواه پرداخته 

و با کلیک بر روی ایتم مورد نظر موقعیت دقیق بانک خود را پیدا کنید

همچنین با کلیلک بر روری نماد بانک میتونید تعدادا افراد داخل صف را مشاهده و اقدام به دریافت نوبت کنید


.. image:: static/img/get.png


بررسی کد و ساختار
--------

wireframe صفحه اصلی

.. image:: static/img/index_structure.jpg

wireframe صفحه ثبت نام

.. image:: static/img/signin_structure.jpg

بررسی  ساختار پوشه ها
---------------------

.. image:: static/img/folder_structure.jpg



بررسی کد های مربوطه
---------------------


index.html
~~~~~~~~~~~~


.. code-block:: html


		<title>log up</title>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
	    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.min.css">
	<script src='https://www.google.com/recaptcha/api.js'></script>
	    <link href='http://www.fontonline.ir/css/BMitra.css' rel='stylesheet' type='text/css'>


	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

	<style type="text/css">
		*{
		  font-family:'BMitra',Sans-Serif!important;
		  font-size:14px;
		 }
		 h2{
		 	font-size: 18px !important;
		 }
		#loadingDiv{
			position: absolute;
			left: 50%;
			top: 50%;
		}
		#error_success{
			text-shadow: 1px 1px 1px black;
		}
		#success{
			margin: -4% 0% -16% 0%;
			text-shadow: 1px 1px 1px black;
		}
		#hidden_success{
			margin: -10% 0% -10% 0%;
			text-shadow: 1px 1px 1px black;
		}
	</style>

	    <link rel="stylesheet" type="text/css" href="gotest.logup/gotest.logup.css">



	<script>
		
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

	function isEmail(email) {
	  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  return regex.test(email);
	}

	function setCookie(cname, cvalue) {
	    //var d = new Date();
	    //d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    //var expires = "expires="+ d.toUTCString();
	    document.cookie = "username="+ cname + ";path=/";
	    document.cookie = "password="+ cvalue + ";path=/";
	}


	  function send() {
	  	var response = grecaptcha.getResponse();


	  	var v = grecaptcha.getResponse();
	    if(v.length == 0)
	    {
	        $("#Error").css("display", "block");
	        return false;
	    }
	    else
	    {
	    	// Check Text is not Empty
	    	$("#Error").css("display", "none");
	        var txtName = $("#name").val();
	        var txtPassword = $("#password").val();
	        var txtEmail = $("#email").val();
	        var txtPhone = $("#phone_number").val();
	        if(txtName != "" && txtPhone != ""){
	        	$("#ErrorName").css("display", "none");
	        	$("#ErrorPhone").css("display", "none");
	        	$("#ErrorEmail").css("display", "none");
	        	if(txtEmail !=""){
	        		if(isEmail(txtEmail)){
	        			var person = {
			          	  name: txtName,
			          	  phone_number:txtPhone,
			          	  email:txtEmail,
			          	  password:txtPhone,
			          	  turn_number:0,
			          	  status:0
			       		}
	        		}else{
	        			$("#ErrorEmail").css("display", "block");
	        			return;
	        		}
	        		
		       	}else if(txtPassword !=""){
		       		var person = {
			         	  name: txtName,
			          	  phone_number:txtPhone,
			          	  email:"noEmail@email.com",
			          	  password:txtPassword,
			          	  turn_number:0,
			          	  status:0
			       		 }
		       	}else if(txtEmail !="" && txtPassword !=""){
		       		var person = {
			         	  name: txtName,
			          	  phone_number:txtPhone,
			          	  email:txtEmail,
			          	  password:txtPassword,
			          	  turn_number:0,
			          	  status:0
			       		 }
		       	}else{
		       		var person = {
		          	  name: txtName,
		          	  phone_number:txtPhone,
		          	  email:"noEmail@email.com",
		          	  password:txtPhone,
		          	  turn_number:0,
		          	  status:0
		       		 }
		       	}
	        	
	        }else{
	        	// important txtName and txtPhone not Empty
	        	if(txtName == ""){
	        		$("#ErrorName").css("display", "block");
	        		return;	
	        	}else if(txtPhone == ""){
	        		$("#ErrorPhone").css("display", "block");
	        		return;
	        	}else{
		        	$("#ErrorName").css("display", "block");
					$("#ErrorPhone").css("display", "block");
		        	return;
	        	}
				
	        }
	       
	        
	        
			$('#loadingDiv').show();



	        $.ajax({
	            url: 'http://gotest.com:8088/users',
	            type: 'post',
	            dataType: 'json',
	            crossDomain: true,
	            success: function (data) {
	                // TODO
	                console.log("Success Add User");
	                setCookie(txtName,txtPhone);
	                $('#loadingDiv').hide();
	                $('#error_success').hide();
	                $('#hidden_success').hide();
	                $('#success').show();
	                window.location.replace("http://gotest.com/gotest/index.html");
	            },
	            error: function (response) {
		           //Handle error
		           console.log("Error Add User");
		           $("#loadingDiv").hide();
		           $('#error_success').show();
				},
	            data: JSON.stringify(person)
	        });

	       
	    }
		



	  	
	    }


	</script>

	


.. image:: static/img/bar.png


.. code-block:: html
		
		<div class="top-bar navbox-open" id="top-bar">
		  <div class="bar">
		    <button class="navbox-trigger" id="navbox-trigger"><i class="fa fa-lg fa-th"></i></button>
		  </div>


		  <div id="before_signin" class="navbox">
		        <br><br>
		        <div class="material-textbox" id="first-name-input">
		        <input id="username" class="material-input" required="required">
		        <span class="material-label">نام کاربری</span>
		        </div>
		        <br><br>
		        <div class="material-textbox" id="first-name-input">
		        <input id="password" class="material-input" required="required">
		        <span class="material-label">شماره تلفن</span>
		        </div>
		        <br>
		        <div class="navbox-tiles">
		          <a style="width: 98%;margin-bottom: 4%;" id="signin" class="tile"><div class="icon"><i style="color: white;" class="fa fa-sign-in"></i></div><span style="color: white;" class="title">ورود</span></a><!--
		          <a href="#" style="color: #3498db;font-size: 24px;">فراموشی کلمه عبور</a>
		          <br><br>-->
		          <a class="tile" href="gotest.logup.html" style="width: 98%"><div class="icon"><i class="fa fa-user-plus"></i></div><span class="title">ثبت نام</span></a>
		        </div>
		  </div>


		<!-- after sign in -->
		   <div id="after_signin" class="navbox" style="display: none;">
		        <p style="color: #3498db;margin-bottom: -24px;font-size: 25px;direction: rtl;padding-top: 5%;text-align: center;" id="welcome_by_username">سلام <p style="color:white;display:inline;text-shadow:1px 0px 2px white;direction:rtl;font-size:25px;"></p><br></p><br>
		        <a style="color: #b7ddf7;margin-left: 50%;direction: rtl;font-size: 25px;" href="" onclick="deleteCookie()">خروج</a>
		        <br><br>
		        
		  </div>



		</div>

.. image:: static/img/sidebar.png

.. code-block:: html

		
		<a class="scrollbar-show-hide rightarrowdiv slide-right-left js-rightplanel" href="javascript:void(0);" onclick="rightscroll();" style=""><span class="rightarrow"></span></a>


		<a class="scrollbar-show-hide leftarrowdiv hide" href="javascript:void(0);" onclick="leftscroll('main');"><span class="leftarrow"></span></a>


		<div id="directionsPanel" class="direction-right-block slide-right-left js-rightplanel directionsPanel" style="right: 0px;">
	  <div class="pr clearfix">


	<script>
	function myFunction() {
	    // Declare variables
	    var input, filter, ul, li, a, i;
	    input = document.getElementById('myInput');
	    filter = input.value.toUpperCase();
	    ul = document.getElementById("myUL");
	    li2 = ul.getElementsByTagName('div');
	    li = ul.getElementsByTagName('li');

	    // Loop through all list items, and hide those who don't match the search query
	    /*
	      li[i].getElementsByTagName("p")[i];
	    */
	    for (i = 0; i < li.length; i++) {
	        aـcity = li[i].getElementsByTagName("p")[2];
	        a_bank_name = li[i].getElementsByTagName("p")[0];

	        if (aـcity.innerHTML.toUpperCase().indexOf(filter) > -1 || a_bank_name.innerHTML.toUpperCase().indexOf(filter) > -1) {
	            li[i].style.display = "";

	        } else {
	            li[i].style.display = "none";
	            
	        }
	    }
	}
	</script>

	<!--search-->

	  <div class="grid">

	    <form class="search"> 

	      <div class="form__field">
	        <input type="search" onkeyup="myFunction()" id="myInput" name="search" style="direction: rtl;" placeholder="جست و جو" class="form__input">
	      </div>

	    </form>
	  </div>
	  <br>

	  <div class="list">
	  
		<ul id="myUL">
		  <div class="list-item-container">
		    
		  <div class="list-title">دی</div><a onclick="zoomin(35.70457077026367,51.37739944458008)"></a><div class="div-conatiner"><a onclick="zoomin(35.70457077026367,51.37739944458008)"></a><div class="list-item"><a onclick="zoomin(35.70457077026367,51.37739944458008)"><div class="list-item-icon"></div></a><div class="list-item-text"><a onclick="zoomin(35.70457077026367,51.37739944458008)"><li><p class="p-bank-list"> بانک: دی</p><p class="p-bank-list"> شعبه: 1</p><p class="p-bank-list"> آدرس: تهران، ستارخان، خیابان راشدی، پلاک ۷</p></li></a></div></div><hr></div><div class="list-title">مسکن</div><a onclick="zoomin(34.635589599609375,50.87074279785156)"></a><div class="div-conatiner"><a onclick="zoomin(34.635589599609375,50.87074279785156)"></a><div class="list-item"><a onclick="zoomin(34.635589599609375,50.87074279785156)"><div class="list-item-icon"></div></a><div class="list-item-text"><a onclick="zoomin(34.635589599609375,50.87074279785156)"></a><li><a onclick="zoomin(34.635589599609375,50.87074279785156)"><p class="p-bank-list"> بانک: مسکن</p><p class="p-bank-list"> شعبه: 1</p><p class="p-bank-list"> آدرس: قم ، میدان محمدی ، پلاک ۲۳۱</p></a></li></div></div><hr></div><div class="list-title">صادرات</div><a onclick="zoomin(32.66017150878906,51.67631912231445)"></a><div class="div-conatiner"><a onclick="zoomin(32.66017150878906,51.67631912231445)"></a><div class="list-item"><a onclick="zoomin(32.66017150878906,51.67631912231445)"><div class="list-item-icon"></div></a><div class="list-item-text"><a onclick="zoomin(32.66017150878906,51.67631912231445)"></a><li><a onclick="zoomin(32.66017150878906,51.67631912231445)"><p class="p-bank-list"> بانک: صادرات</p><p class="p-bank-list"> شعبه: 3</p><p class="p-bank-list"> آدرس: 
		اصفهان ، میدان محمدی ، پلاک ۲۳۱</p></a></li></div></div><hr></div><a onclick="zoomin(32.662662506103516,51.670257568359375)"></a><div class="div-conatiner"><a onclick="zoomin(32.662662506103516,51.670257568359375)"></a><div class="list-item"><a onclick="zoomin(32.662662506103516,51.670257568359375)"><div class="list-item-icon"></div></a><div class="list-item-text"><a onclick="zoomin(32.662662506103516,51.670257568359375)"></a><li><a onclick="zoomin(32.662662506103516,51.670257568359375)"><p class="p-bank-list"> بانک: صادرات</p><p class="p-bank-list"> شعبه: 2</p><p class="p-bank-list"> آدرس: 
		اصفهان ، میدان محمدی ، پلاک ۲۳۱</p></a></li></div></div><hr></div><a onclick="zoomin(31.898123,54.341729)"></a><div class="div-conatiner"><a onclick="zoomin(31.898123,54.341729)"></a><div class="list-item"><a onclick="zoomin(31.898123,54.341729)"><div class="list-item-icon"></div></a><div class="list-item-text"><a onclick="zoomin(31.898123,54.341729)"></a><li><a onclick="zoomin(31.898123,54.341729)"><p class="p-bank-list"> بانک: صادرات</p><p class="p-bank-list"> شعبه: 5</p><p class="p-bank-list"> آدرس: یزد ، میدان ابوحمزه ، پلاک ۴۳</p></a></li></div></div><hr></div></div>
		  </ul>
		</div>

		<!--
		 <div class="direction-right-block-in clearfix">
		      <div class="direction-top-block clearfix">
		        <div class="clearfix">
		          <p class="menu-direction hide"><a href="#" title="Menu">Menu</a></p>
		          <ul class="direction-list clearfix">
		            <li class="snowflake fa fa-snowflake-o" id=""><a href="javascript:void(0);" onclick=""></a></li>
		            <li class="zone travlemode fa fa-map-marker" id=""><a href="javascript:void(0);" onclick=""></a></li>
		            
		            <li class="travel travelmode" id="travelmode"><a href="javascript:void(0);" onclick="setdirectionstravel('travelmode');">Travel mode</a></li>
		            <li class="drive travelmode" id="driving"><a href="javascript:void(0);" onclick="setdirectionstravel('driving');">Drive</a></li>
		            <li class="train travelmode" id="transit"><a href="javascript:void(0);" onclick="setdirectionstravel('transit');">Train</a></li>
		            <li class="walk travelmode" id="walking"><a href="javascript:void(0);" onclick="setdirectionstravel('walking');">Walk</a></li>
		            
		            <li class="cycle travelmode" id="bicycling"><a href="javascript:void(0);" onclick="setdirectionstravel('bicycling');">Cycle</a></li>
		          </ul>
		        </div>
		        <div class="form-border-bot clearfix">
		          <form class="form-direction clearfix ng-pristine ng-valid">
		            <div class="input-block">
		              <p class="clearfix path-from"><label><span>From</span></label><input type="text" onfocus="routedirection('search','','');" onchange="routedirection('search','','');" value="chennai" id="dirSource" placeholder="Enter a location" autocomplete="off"><span class="bg-search">search</span></p>
		              <p class="clearfix path-to"><label><span>To</span></label><input type="text" value="" onfocus="routedirection('search','','');" onchange="routedirection('search','','');" id="dirDestination" placeholder="Enter a location" autocomplete="off"><span class="bg-search">search</span></p>
		            </div>
		            <div class="up-down-block">
		              <p onclick="swap();" class="btn-up-down"><span>up and down</span></p>
		            </div>
		            <input id="directionstravel" type="hidden" value="driving">
		          </form>
		        </div>
		      </div>




		</div>
		-->
		      <div id="panel" class="route-map-rgt" style="direction: ltr;">
		      </div>


		    
		  </div>
		</div>

کد های نقشه و موقعیت مکانی در نقشه

.. code-block:: javascript

		<div id="map" style="border: 2px solid #3872ac;"></div>

		<script type="text/javascript">

			/*

			Url Set

			&

			Icon set 

			https://cdn1.iconfinder.com/data/icons/business-bicolor-4/512/bank_location-32.png

			*/ 
			var map;
			var icon = "https://cdn1.iconfinder.com/data/icons/business-bicolor-4/512/bank_location-32.png";
			//alert(window.url)
			var json = window.url;
			var infowindow = new google.maps.InfoWindow();

			var map,lati,lon


			function initialize() {

			    var mapProp = {
			        center: new google.maps.LatLng(32.8220323,55.7591143), //ZOOM ON IRAN 
			        zoom: 5,
			        mapTypeId: google.maps.MapTypeId.ROADMAP,
			        mapTypeControl: true,
			          mapTypeControlOptions: {
			              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			              position: google.maps.ControlPosition.BOTTOM_CENTER
			          },
			          zoomControl: true,
			          zoomControlOptions: {
			              position: google.maps.ControlPosition.LEFT_CENTER
			          },
			          scaleControl: true,
			          streetViewControl: true,
			          streetViewControlOptions: {
			              position: google.maps.ControlPosition.LEFT_CENTER
			          },
			          fullscreenControl: true,
			          fullscreenControlOptions: {
			            position: google.maps.ControlPosition.LEFT_TOP

			          }

			          
			    };

			    map = new google.maps.Map(document.getElementById("map"), mapProp);

			    $.getJSON(json, function(json1) {
			      
			   /* var json1 = {
			        "universities": [
			            {
			                "title": "Aberystwyth University",
			                "website": "www.aber.ac.uk",
			                "phone": "+44 (0)1970 623 111",
			                "lat": 52.415524,
			                "lng": -4.063066},
			            {
			                "title": "Bangor University",
			                "website": "www.bangor.ac.uk",
			                "phone": "+44 (0)1248 351 151",
			                "lat": 53.229520,
			                "lng": -4.129987},
			            {
			                "title": "Cardiff Metropolitan University",
			                "website": "www.cardiffmet.ac.uk",
			                "phone": "+44 (0)2920 416 138",
			                "lat": 51.482708,
			                "lng": -3.165881}
			        ]
			    };*/
			    $.each(json1, function (key, data) {

			//  For x y pin map
			        var latLng = new google.maps.LatLng(data.x, data.y);
			        var d = parseInt(data.turns_number)-parseInt(data.active_turns_number)
			        var marker = new google.maps.Marker({
			            position: latLng,
			            map: map,
			            icon: icon,
			            title: "بانک: "+data.name + "\nتعداد افراد داخل صف: "+d+"\n آدرس: " + data.address
			        });


			       
			        var bank_id = data.bank_id;
			        var details;

			        if(getCookie("password")>4){

			            if(getCookie("bankid")==bank_id){
			              $.when(getUser()).done(function(turn_number){
			                var res = String((parseInt(turn_number)-data.active_turns_number)-1);
			              details = "بانک: "+data.name +"<hr>"
			                      +"نوبت شما: "+turn_number+ "<br> مانده به شما: "+ res +"<hr><br> آدرس: " + data.address ;
			              
			              //a=1;
			              });
			              document.cookie = "bankx="+ data.x + ";path=/";
			              document.cookie = "banky="+ data.y + ";path=/";
			              
			            }else{
			              details  = "بانک: "+data.name + "<br>تعداد افراد داخل صف: "+data.active_turns_number+"<hr><br> آدرس: " + data.address ;
			            }
			          }
			          else{
			            details  = "بانک: "+data.name + "<br>تعداد افراد داخل صف: "+data.active_turns_number+"<hr><br> آدرس: " + data.address ;
			          }


			        bindInfoWindow(marker, map, infowindow, details,bank_id);
			       

			    });

			});
			}

			 // Try HTML5 geolocation.
			        if (navigator.geolocation) {
			          navigator.geolocation.getCurrentPosition(function(position) {

			            var pos = {
			              lat: position.coords.latitude,
			              lng: position.coords.longitude
			            };
			        var marker = new google.maps.Marker({
			                  position: pos,
			                  icon: {
			                    path: google.maps.SymbolPath.CIRCLE,
			                    scale: 3,
			                          strokeWeight:2,
			                          strokeColor:"#1976D2"
			                  },
			                  map: map
			                });

			           /* infowindow.setPosition(pos);
			            infowindow.setContent('aaaaa');
			            infowindow.open(map);*/
			            map.setCenter(pos);
			          }, function() {
			            handleLocationError(true, infowindow, map.getCenter());
			          });
			        } else {
			          // Browser doesn't support Geolocation
			          handleLocationError(false, infowindow, map.getCenter());
			        }
			      

			     

			function handleLocationError(browserHasGeolocation, infoWindow, pos) {
			        infowindow.setPosition(pos);
			        infowindow.setContent(browserHasGeolocation ?
			                              'Error: The Geolocation service failed.' :
			                              'Error: Your browser doesn\'t support geolocation.');
			        infowindow.open(map);
			      }

			function zoomin(lat, lng) {

			  /*
			   parseInt not correct work
			   initialize() for find `map` object
			  */
			      initialize()
			      var pt = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
			      map.setCenter(pt);
			      map.setZoom(18);
			    }

			function bindInfoWindow(marker, map, infowindow, strDescription,bank_id) {
			  
			    google.maps.event.addListener(marker, 'click', function () {
			        infowindow.setContent("<div class='details'><a onclick='get("+ bank_id +")' href='#' style='color:#000000;text-shadow:1px 1px 1px #9e9e9e;float:left;'><i class='em em-ticket'></i></a>"+strDescription+"</div>");
			        infowindow.open(map, marker);
			    });
			}

			google.maps.event.addDomListener(window, 'load', initialize);


			function myLocation(){

			// not best work because get location in chrome 
			 $.getJSON("http://ip-api.com/json", function(data) {
			            var table_body = "";
			            $.each(data, function(k, v) {
			                
			                if(k == "lat"){
			                  lati = v

			                }
			                if(k == "lon"){
			                  lon = v
			                }
			                if(lati !="" && lon !=""){

			                var pt = new google.maps.LatLng(lati, lon);
			                var pos = {
			                  lat: lati,
			                  lng: lon
			                };

			                var marker = new google.maps.Marker({
			                position: pos,
			                icon: {
			                  path: google.maps.SymbolPath.CIRCLE,
			                  scale: 3,
			                        strokeWeight:2,
			                        strokeColor:"#1976D2"
			                },
			                map: map
			              });



			                map.setCenter(pt);
			                map.setZoom(16);
			                }
			            });
			            
			        });



			  
			}

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
			    </script>
			    <div class="myLocation">
			      <i class="fa fa-user-o" onclick="myLocation()" aria-hidden="true"></i>
			    </div>

gotest.logup.html
~~~~~~~~~~~~~~~~~

کد ها مربوط به head و javascipt و ثبت نام پروژه

.. code-block:: javascript


	<title>log up</title>
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.min.css">
	<script src='https://www.google.com/recaptcha/api.js'></script>
	<link href='http://www.fontonline.ir/css/BMitra.css' rel='stylesheet' type='text/css'>


	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

	<style type="text/css">
		*{
		  font-family:'BMitra',Sans-Serif!important;
		  font-size:14px;
		 }
		 h2{
		 	font-size: 18px !important;
		 }
		#loadingDiv{
			position: absolute;
			left: 50%;
			top: 50%;
		}
		#error_success{
			text-shadow: 1px 1px 1px black;
		}
		#success{
			margin: -4% 0% -16% 0%;
			text-shadow: 1px 1px 1px black;
		}
		#hidden_success{
			margin: -10% 0% -10% 0%;
			text-shadow: 1px 1px 1px black;
		}
	</style>

	    <link rel="stylesheet" type="text/css" href="gotest.logup/gotest.logup.css">



	<script>
		
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

	function isEmail(email) {
	  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  return regex.test(email);
	}

	// برای احراز هوبت با نام کاربری و شماره تلفن
	function setCookie(cname, cvalue) {
	    //var d = new Date();
	    //d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    //var expires = "expires="+ d.toUTCString();
	    document.cookie = "username="+ cname + ";path=/";
	    document.cookie = "password="+ cvalue + ";path=/";
	}


	  function send() {
	  	var response = grecaptcha.getResponse();


	  	var v = grecaptcha.getResponse();
	    if(v.length == 0)
	    {
	        $("#Error").css("display", "block");
	        return false;
	    }
	    else
	    {
	    	// Check Text is not Empty
	    	$("#Error").css("display", "none");
	        var txtName = $("#name").val();
	        var txtPassword = $("#password").val();
	        var txtEmail = $("#email").val();
	        var txtPhone = $("#phone_number").val();
	        if(txtName != "" && txtPhone != ""){
	        	$("#ErrorName").css("display", "none");
	        	$("#ErrorPhone").css("display", "none");
	        	$("#ErrorEmail").css("display", "none");
	        	if(txtEmail !=""){
	        		if(isEmail(txtEmail)){
	        			var person = {
			          	  name: txtName,
			          	  phone_number:txtPhone,
			          	  email:txtEmail,
			          	  password:txtPhone,
			          	  turn_number:0,
			          	  status:0
			       		}
	        		}else{
	        			$("#ErrorEmail").css("display", "block");
	        			return;
	        		}
	        		
		       	}else if(txtPassword !=""){
		       		var person = {
			         	  name: txtName,
			          	  phone_number:txtPhone,
			          	  email:"noEmail@email.com",
			          	  password:txtPassword,
			          	  turn_number:0,
			          	  status:0
			       		 }
		       	}else if(txtEmail !="" && txtPassword !=""){
		       		var person = {
			         	  name: txtName,
			          	  phone_number:txtPhone,
			          	  email:txtEmail,
			          	  password:txtPassword,
			          	  turn_number:0,
			          	  status:0
			       		 }
		       	}else{
		       		var person = {
		          	  name: txtName,
		          	  phone_number:txtPhone,
		          	  email:"noEmail@email.com",
		          	  password:txtPhone,
		          	  turn_number:0,
		          	  status:0
		       		 }
		       	}
	        	
	        }else{
	        	// important txtName and txtPhone not Empty
	        	if(txtName == ""){
	        		$("#ErrorName").css("display", "block");
	        		return;	
	        	}else if(txtPhone == ""){
	        		$("#ErrorPhone").css("display", "block");
	        		return;
	        	}else{
		        	$("#ErrorName").css("display", "block");
					$("#ErrorPhone").css("display", "block");
		        	return;
	        	}
				
	        }
	       
	        
	        
			$('#loadingDiv').show();

			// ثبت کاربر و فرستادن مقادیر برای سرور که شامل نام کاربری و شماره تلفن میباشد

	        $.ajax({
	            url: 'http://gotest.com:8088/users',
	            type: 'post',
	            dataType: 'json',
	            crossDomain: true,
	            success: function (data) {
	                // TODO
	                console.log("Success Add User");
	                setCookie(txtName,txtPhone);
	                $('#loadingDiv').hide();
	                $('#error_success').hide();
	                $('#hidden_success').hide();
	                $('#success').show();
	                window.location.replace("http://gotest.com/gotest/index.html");
	            },
	            error: function (response) {
		           //Handle error
		           console.log("Error Add User");
		           $("#loadingDiv").hide();
		           $('#error_success').show();
				},
	            data: JSON.stringify(person)
	        });

	       
	    }
		



	  	
	    }


	</script>


.. image:: static/img/signup-bar.png

.. code-block:: html

	<div class="top-bar navbox-open" id="top-bar">
	  <div class="bar">
	    <button class="navbox-trigger" id="navbox-trigger"><i class="fa fa-lg fa-th"></i></button>
	  </div>
	  <div class="navbox">
	        
	        <div class="navbox-tiles">
	          <a class="tile" href="index.html" style="width: 100%"><div class="icon"><i class="fa fa-home"></i></div><span class="title">Home</span></a>
	        </div>
	  </div>
	</div>


.. image:: static/img/signup-form.png


.. code-block:: html
	
	<div class="signup" style="margin-top: 13px;">
			<ul class="singup-list">
				<li><div id="error_success" style="display: none;color: red;text-align: center;font-size: 50px;">لطفا اطلاعات خود را بررسی کنید</div></li><br><br>
				<li><div id="success" style="display: none;color: green;text-align: center;font-size: 50px;">با موفقیت ثبت شد</div></li><br><br><br><br>
				<li><div id="hidden_success" style="color: #3498db;text-align: center;font-size: 50px;">ثبت نام</div></li><br><br><br><br><br>
				<h2 id="ErrorName" style="display: none;color: red;fon">لطفا نام کاربری خود را وارد کنید</h2>
				<br>
				<li class="signup-item">
					<input id="name" type="text" placeholder="Abc123" class="signup-input" required="">
					<label for="" class="signup-label">نام کاربری</label>
				</li>
				<!--<li class="signup-item">
					<input id="password" type="password" placeholder="*******" class="signup-input">
					<label for="" class="signup-label">کلمه عبور</label>
				</li>-->
				<h2 id="ErrorEmail" style="display: none;color: red;">لطفا پست الکترونیکی معتبر وارد کنید</h2>
				<br>
				<li class="signup-item">
					<input id="email" type="email" placeholder="user@gmail.com" class="signup-input">
					<label for="" class="signup-label">پست الکترونیکی</label>
				</li>
					<h2 id="ErrorPhone" style="display: none;color: red;">لطفا شماره تلفن خود را وارد کنید</h2>
					<br>
				<li class="signup-item">
					<input id="phone_number" type="text" placeholder="093------44" class="signup-input" required="">
					<label for="" class="signup-label">شماره تلفن</label>
				</li>
				<!--<li class="signup-item">
					<div class="signup-select">
						<label for="" class="signup-label">Country</label>
						<span class="signup-select-text">Bulgaria</span>
						<div class="signup-select-menu">
							<ul>
								<li class="singup-select__list-item">
									<a href="#" class="signup-select__item">Europe</a>
								</li>
								<li class="singup-select__list-item">
									<a href="#" class="signup-select__item">Australia</a>
								</li>
								<li class="singup-select__list-item">
									<a href="#" class="signup-select__item">Asia</a>
								</li>
							</ul>
						</div>
					</div>
				</li>-->
				<span id="captchaError" style="margin-left:100px;color:red">
					<h2 id="Error" style="display: none;">لطفا کد امنیتی را انتخاب کنید</h2>
				</span>
				<br>
				<div class="g-recaptcha" id="rcaptcha" data-sitekey="6Lc3SyoUAAAAAKNzXZwNcQHWf7nABSV1PyqgcE-0"><div style="width: 304px; height: 78px;"><div><iframe src="https://www.google.com/recaptcha/api2/anchor?k=6Lc3SyoUAAAAAKNzXZwNcQHWf7nABSV1PyqgcE-0&amp;co=aHR0cDovL2dvdGVzdC5jb206ODA.&amp;hl=en&amp;v=r20170816175713&amp;size=normal&amp;cb=foko2gp7g2iz" title="recaptcha widget" width="304" height="78" frameborder="0" scrolling="no" sandbox="allow-forms  allow-same-origin allow-scripts allow-top-navigation allow-modals allow-popups allow-popups-to-escape-sandbox"></iframe></div><textarea id="g-recaptcha-response" name="g-recaptcha-response" class="g-recaptcha-response" style="width: 250px; height: 40px; border: 1px solid #c1c1c1; margin: 10px 25px; padding: 0px; resize: none;  display: none; "></textarea></div></div><br><br>
				
				<li class="signup-item">
					<button onclick="send()" id="submit" class="signup-submit">ارسال</button>
					
				</li>
			</ul>
		


	</div>