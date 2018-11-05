var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
  }

};

app.initialize();


//地図の初期化
var initMap = (function() {
  function codeAddress(address) {
    // google.maps.Geocoder()コンストラクタのインスタンスを生成
    var geocoder = new google.maps.Geocoder();

    // 地図表示に関するオプション
    var mapOptions = {
      zoom              : 16,
      mapTypeControl    : false,
      scaleControl      : false,
      streetViewControl : false,
      fullscreenControl : false
    };

    // 地図を表示させるインスタンスを生成
    var map = new google.maps.Map(document.getElementById("maps"), mapOptions);

    //マーカー変数用意
    var marker;

    // geocoder.geocode()メソッドを実行
    geocoder.geocode( { 'address': address}, function(results, status) {

      // ジオコーディングが成功した場合
      if (status == google.maps.GeocoderStatus.OK) {

        // 変換した緯度・経度情報を地図の中心に表示
        map.setCenter(results[0].geometry.location);

        //☆表示している地図上の緯度経度
        //document.getElementById('lat').value=results[0].geometry.location.lat();
        //document.getElementById('lng').value=results[0].geometry.location.lng();

        // マーカー設定
        marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });

        // ジオコーディングが成功しなかった場合
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }

    });

    //マップクリック時に半径3km内のホテルを検索
    var markers = [];
    var infowindows = [];
    map.addListener('click', function(e){
      var x= e.latLng.lat();
      var y= e.latLng.lng();
      var hotelspot_url='https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426?applicationId=1094029776062152274&datumType=1&searchRadius=3.0&latitude=' + x + '&longitude='+y;
      console.log(hotelspot_url);
      markers.forEach(m => m.setMap(null));
      markers.splice(0, markers.length);
      infowindows.splice(0,infowindows.length);
      //開始時刻
      var startTime = new Date();
      //ホテルの位置
      $.ajax({
        url:hotelspot_url,
        type:'GET',
        dataType:'json',
        error:function(){
          console.log("miss");
        },
        success:function(data){
          //終了時刻
          var endTime = new Date();
          console.log(endTime.getTime() - startTime.getTime()+"/1000秒 楽天トラベルのurlリクエストに掛かった時間");
          data.hotels.forEach(hotel => {
            var hotelInfo_url = ""
            var hotelPosition = {
              lat:hotel.hotel[0].hotelBasicInfo.latitude,
              lng:hotel.hotel[0].hotelBasicInfo.longitude
            };
            var marker = new google.maps.Marker({
              position:hotelPosition,
              map:map,
              //アイコンの変更
              icon: './img/hotel-marker.png'
            });
            markers.push(marker);
            var infoWindow = new google.maps.InfoWindow({
              content:hotel.hotel[0].hotelBasicInfo.hotelName +"<br>"+
              "<a href=" + hotel.hotel[0].hotelBasicInfo.hotelInformationUrl + " target='_blank'>楽天トラベルページ</a><br>"+
              hotel.hotel[0].hotelBasicInfo.telephoneNo+"<br>一泊の値段:"+
              hotel.hotel[0].dailyCharge.rakutenCharge,
              //chargeFlagが0なら一泊,1なら一室
            });
            infowindows.push(infoWindow);
            marker.addListener('click',function(){
              infowindows.forEach(i => i.close());
              infoWindow.open(map,marker);
            });

            //contactタブにホテル検索結果を表示
            $("#hotelImages").append("<img src =" + hotel.hotel[0].hotelBasicInfo.hotelImageUrl +" class='HotelImages'>");

            $(".HotelImages").on('click',function(){
              window.open(hotel.hotel[0].hotelBasicInfo.hotelInformationUrl,'_blank');
            });
            ('mouseover',function(){
              console.log("test");
            });
          });
        }
      });
    });




    // マップをクリックで位置変更
    map.addListener('click', function(e) {
      getClickLatLng(e.latLng, map);

      // 住所を取得
      var address = e.placeId;
      room = peer.joinRoom(address);

      chatlog('<i>' + address + '</i>に入室しました');

      // チャットを受信
      room.on('data', function(data){
        chatlog('ID: ' + data.src + '> ' + data.data); // data.src = 送信者のpeerid, data.data = 送信されたメッセージ
      });

      var service = new google.maps.places.PlacesService(map);
      service.getDetails({placeId: address}, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          $("#address").val(results.name);
          $('#search_form').submit();
        }
      });
    });


    function getClickLatLng(lat_lng, map) {

      //☆表示している地図上の緯度経度
      //document.getElementById('lat').value=lat_lng.lat();
      //document.getElementById('lng').value=lat_lng.lng();

      // マーカーを設置
      marker.setMap(null);
      marker = new google.maps.Marker({
        position: lat_lng,
        map: map
      });

      // 座標の中心をずらす
      map.panTo(lat_lng);
    }

  }

  //inputのvalueで検索して地図を表示
  return {
    getAddress: function() {
      // ボタンに指定したid要素を取得
      var button = $("#map_button");

      // ボタンが押された時の処理
      button.on('click', function() {
        // フォームに入力された住所情報を取得
        var address = $("#address").val();
        // 取得した住所を引数に指定してcodeAddress()関数を実行
        codeAddress(address);
      });

      //読み込まれたときに地図を表示
      $(window).on('load', function(){
        // フォームに入力された住所情報を取得
        var address = $("#address").val();
        // 取得した住所を引数に指定してcodeAddress()関数を実行
        codeAddress(address);
      });
    }

  };

})();

$(function($) {
  WindowHeight = $(window).height();
  $('.drawr').css('height', WindowHeight); //メニューをwindowの高さいっぱいにする

  $(document).ready(function() {
    $('#search_form').on('submit', function(){ //クリックしたら

      if ($('#nav-twitter-tab').hasClass('active')) {
        $.getJSON('https://api.yarnet.ml/tweets', {'q': $("#address").val()}).done(function(tweets) {
          $('article').remove();
          console.log(tweets);
          tweets.forEach(tweet => {
            console.log(tweet);

            $article = $('<article class "Tweet_List">');
            $header = $('<header>');
            $header.append($('<img class ="profile_img">').attr('src', tweet.user_profile_img));//prof img
            $header.append($('<div class ="user_name">').text(tweet.user_name));//userid
            $header.append($('<div class ="screen_name">').text(tweet.user_screem_name));
            $header.append($('<div class ="date">').text(tweet.date));//投稿時刻
            $header.append($('<div class ="body">').text(tweet.body));

            $photos = $('<div class="photos_' + tweet.photos.length + '">');

            for (var i = 0; i < tweet.photos.length; i++) {
              $wrapper = $('<div class="photos_img_wrapper_' + i + '">');
              $wrapper.append($('<img src="' + tweet.photos[i] + '">'));

              $photos.append($wrapper);
            }

            $header.append($photos);
            $article.append($header);

            $('#nav-content').append($article);
          });
        });
      }

      if ($('#nav-wikipedia-tab').hasClass('active')) {
        WikipediaAPI();
      }


      if($('.drawr').is(":animated")){
        return false;
      }else{
        $('.drawr').animate({width:'toggle'}); //animateで表示・非表示
        $(this).toggleClass('peke'); //toggleでクラス追加・削除
        return false;
      }
    });
  });

  //別領域をクリックでメニューを閉じる
  $(document).click(function(event) {
    if (!$(event.target).closest('.drawr').length) {
      $('.search_button').removeClass('peke');
      $('.drawr').hide();
    }
  });

  //右ドロワー
  $(function($) {
    WindowHeight = $(window).height();
    $('.right-nav-drawer').css('height', WindowHeight); //メニューをwindowの高さいっぱいにする

    $(document).ready(function() {
      $('#right-btn').click(function(){ //クリックしたら
        if($('.right-nav-drawer').is(":animated")){
          return false;
        }else{
          $('.right-nav-drawer').animate({width:'toggle'}); //animateで表示・非表示
          $(this).toggleClass('peke'); //toggleでクラス追加・削除
          return false;
        }
      });
    });

    //別領域をクリックでメニューを閉じる
    $(document).click(function(event) {
      if (!$(event.target).closest('.right-nav-drawer').length) {
        $('#right-btn').removeClass('peke');
        $('.right-nav-drawer').hide();
      }
    });
  });
});

//Circle Menu
$('#menu-circle').circleMenu({
    item_diameter: 40,
    circle_radius: 100,
    direction: 'bottom-left'
});

$('#nav-tab .nav-link').on('click', function() {
  $('#search_form').submit();
});

//wiki
function WikipediaAPI() {
	//検索語
	var query = $('#address').val();
	//API呼び出し
	$.ajax({
		url: 'http://wikipedia.simpleapi.net/api',
		data: {
			output: 'json',
			keyword: query
		},
		type: 'GET',
		dataType: 'jsonp',			//Access-Control-Allow-Origin対策
		timeout: 1000,
		success: function(json) {
			if (json != null && json.length > 0) {
				$('#word').html('');
				//結果表示
				for (i = 0; i < json.length; i++) {
					$('#word').append(
						'<dt>' + (i + 1) + '：<a href="' +
						json[i].url + '">' +
						json[i].title + '</a>' +
					 	'&nbsp;(' + json[i].datetime +
					 	' 更新)</dt>' +
				 		'<dd>' + json[i].body + '</dd>'
				 	);
				}
			} else {
				$('#word').html('検索結果なし');
			}
		}
	});
}
initMap.getAddress();
