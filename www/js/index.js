var YarNet = {};

$(function() {

  var styledMapType = new google.maps.StyledMapType(
    [
      {elementType :           'geometry', stylers : [{color : '#ebe3cd'}]},
      {elementType :   'labels.text.fill', stylers : [{color : '#523735'}]},
      {elementType : 'labels.text.stroke', stylers : [{color : '#f5f1e6'}]},
      {
        featureType : 'administrative',
        elementType : 'geometry.stroke',
        stylers     : [{color : '#c9b2a6'}]
      },
      {
        featureType : 'administrative.land_parcel',
        elementType : 'geometry.stroke',
        stylers     : [{color : '#dcd2be'}]
      },
      {
        featureType : 'administrative.land_parcel',
        elementType : 'labels.text.fill',
        stylers     : [{color : '#ae9e90'}]
      },
      {
        featureType : 'landscape.natural',
        elementType : 'geometry',
        stylers     : [{color : '#dfd2ae'}]
      },
      {
        featureType : 'poi',
        elementType : 'geometry',
        stylers     : [{color : '#dfd2ae'}]
      },
      {
        featureType : 'poi',
        elementType : 'labels.text.fill',
        stylers     : [{color : '#93817c'}]
      },
      {
        featureType : 'poi.park',
        elementType : 'geometry.fill',
        stylers     : [{color : '#a5b076'}]
      },
      {
        featureType : 'poi.park',
        elementType : 'labels.text.fill',
        stylers     : [{color : '#447530'}]
      },
      {
        featureType : 'road',
        elementType : 'geometry',
        stylers     : [{color : '#f5f1e6'}]
      },
      {
        featureType : 'road.arterial',
        elementType : 'geometry',
        stylers     : [{color : '#fdfcf8'}]
      },
      {
        featureType : 'road.highway',
        elementType : 'geometry',
        stylers     : [{color : '#f8c967'}]
      },
      {
        featureType : 'road.highway',
        elementType : 'geometry.stroke',
        stylers     : [{color : '#e9bc62'}]
      },
      {
        featureType : 'road.highway.controlled_access',
        elementType : 'geometry',
        stylers     : [{color : '#e98d58'}]
      },
      {
        featureType : 'road.highway.controlled_access',
        elementType : 'geometry.stroke',
        stylers     : [{color : '#db8555'}]
      },
      {
        featureType : 'road.local',
        elementType : 'labels.text.fill',
        stylers     : [{color : '#806b63'}]
      },
      {
        featureType : 'transit.line',
        elementType : 'geometry',
        stylers     : [{color : '#dfd2ae'}]
      },
      {
        featureType : 'transit.line',
        elementType : 'labels.text.fill',
        stylers     : [{color : '#8f7d77'}]
      },
      {
        featureType : 'transit.line',
        elementType : 'labels.text.stroke',
        stylers     : [{color : '#ebe3cd'}]
      },
      {
        featureType : 'transit.station',
        elementType : 'geometry',
        stylers     : [{color : '#dfd2ae'}]
      },
      {
        featureType : 'water',
        elementType : 'geometry.fill',
        stylers     : [{color : '#b9d3c2'}]
      },
      {
        featureType : 'water',
        elementType : 'labels.text.fill',
        stylers     : [{color : '#92998d'}]
      }
    ],
    {
      name : 'Styled Map'
    }
  );

  YarNet.map = new google.maps.Map($('#map')[0], {
    center : {
      lat :  34.98584900000000, // 京都駅の緯度
      lng : 135.75876670000002, // 京都駅の経度
    },
    mapTypeControlOptions : {
      mapTypeIds: ['styled_map']
    },
    fullscreenControl : false,
    mapTypeControl    : false,
    streetViewControl : false,
    zoom              : 15,
  });

  YarNet.map.mapTypes.set('styled_map', styledMapType);
  YarNet.map.setMapTypeId('styled_map');

  if (!Array.isArray(history.state)) {
    history.replaceState([], false);
  }

  var state = history.state.slice(0);
  state.push('top-content');
  history.replaceState(state, false);

  /**
   * 画面遷移を行うメソッドです。
   *
   * @param {string} hideMethod   - 前画面のアニメーションメソッド
   * @param {string} showMethod   - 次画面のアニメーションメソッド
   * @param {number} hideDuration - 前画面のアニメーション時間 (default: 200ms)
   * @param {number} showDuration - 次画面のアニメーション時間 (default: 400ms)
   */
  $.fn.transition = function(hideMethod, showMethod, hideDuration, showDuration) {
    if (!$.prototype[hideMethod]) throw new ReferenceError(hideMethod + ' は定義されていません。');
    if (!$.prototype[showMethod]) throw new ReferenceError(showMethod + ' は定義されていません。');

    hideDuration = (hideDuration || 200); // default: 200ms
    showDuration = (showDuration || 400); // default: 400ms

    var hide = function($content) { $content.trigger('hide.start')[hideMethod](hideDuration, function() { $(this).trigger('hide.end'); }); };
    var show = function($content) { $content.trigger('show.start')[showMethod](showDuration, function() { $(this).trigger('show.end'); }); };

    // 現在開いているセクションを閉じたあと新しいセクションを開きます。
    hide($('.content:visible').one('hide.end', show.bind(null, this)));
  };

  $(document).on('click', '[data-toggle="transition"]', function(e) {
    $($(this).attr('data-target')).transition('fadeOut', 'fadeIn');
  });

  $(document).on('click', '[data-toggle="goBackward"]', function(e) {
    var state = history.state.slice(0);
    state.pop();
    history.replaceState(state, false);

    $('#' + history.state.slice(-1)[0])
      .transition('fadeOut', 'fadeIn');
  });

  $('.content').on('show.start', function(e) {
    var lastState = history.state.slice(-1);
    if (lastState[0] == e.target.id) return;

    var state = history.state.slice(0);
    state.push(e.target.id);
    history.replaceState(state, false);
  });

});
