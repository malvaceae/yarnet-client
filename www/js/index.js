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

function initMap() {
  var map = new google.maps.Map(document.getElementById('maps'), {
    center: {lat: 34.985, lng: 135.752},
    zoom: 15
  });
}

var getMap = (function() {
  function codeAddress(address) {
    // google.maps.Geocoder()コンストラクタのインスタンスを生成
    var geocoder = new google.maps.Geocoder();

    // 地図表示に関するオプション
    var mapOptions = {
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
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

    map.addListener('center_changed', function() {
      console.log(map);
      console.log(marker);
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
    $('#search_form').submit(function(){ //クリックしたら
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
$('ul').circleMenu({
    item_diameter: 40,
    circle_radius: 100,
    direction: 'bottom-left'
});
getMap.getAddress();
