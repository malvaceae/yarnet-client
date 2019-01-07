$(function() {

  YarNet.map.addListener('click', function (e) {
    if (!e.placeId) return false;

    e.stop();

    var service = new google.maps.places.PlacesService(YarNet.map);
    service.getDetails({placeId: e.placeId}, function (place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) return;

      YarNet.infowindow.close();

      var $content = $(YarNet.infowindow.content);
      $content.data('place-id', e.placeId);

      // 観光地アイコン
      $content.find('.place-icon')
        .attr('src', place.icon);

      // 観光地名
      $content.find('.place-title')
        .text(place.name);

      // 国名
      $content.find('.place-country')
        .text(place.address_components[place.address_components.length - 2].long_name);

      // 住所
      $content.find('.place-address')
        .text(place.address_components[place.address_components.length - 1].long_name + ' ' + place.vicinity);

      if (localStorage['auth']) {
        $.ajax({
          cache    : false,
          dataType : 'json',
          url      : YarNet.api + '/users/' + localStorage['auth'] + '/favorite_spots',
        })
          .done(function (data) {
            if (data.some(function (place) { return place.place_id == e.placeId; })) {
              $content.removeClass('add').addClass('del');
            } else {
              $content.removeClass('del').addClass('add');
            }
          })
          .fail(function (data) {
            console.log(data);
          });
      }

      YarNet.infowindow.setPosition(place.geometry.location);
      YarNet.infowindow.open(YarNet.map);
    });
  });

  $(document).on('click', '.add-favorite-spot', function (e) {
    var placeId = $(YarNet.infowindow.content).data('place-id');

    $.ajax({
      cache    : false,
      data     : {place_id: placeId},
      dataType : 'json',
      type     : 'POST',
      url      : YarNet.api + '/users/' + localStorage['auth'] + '/favorite_spots',
    })
      .done(function(data) {
        // alert('お気に入りに追加しました。');

        $(YarNet.infowindow.content).removeClass('add').addClass('del');
      })
      .fail(function(data) {
        console.log(data);
      });
  });

  $(document).on('click', '.del-favorite-spot', function (e) {
    var $place = $(this).closest('.place');

    if ($place.length) {
      var placeId = $place.data('place-id');
      if (!confirm('本当に解除してよろしいですか？')) {
        return;
      }
    } else {
      var placeId = $(YarNet.infowindow.content).data('place-id');
    }

    $.ajax({
      cache    : false,
      data     : {place_id: placeId},
      dataType : 'json',
      type     : 'DELETE',
      url      : YarNet.api + '/users/' + localStorage['auth'] + '/favorite_spots',
    })
      .done(function(data) {
        // alert('お気に入りを解除しました。');

        if ($place.length) {
          $place.remove();

          if (!$('#favorite-spots-modal .place').length) {
            $('#favorite-spots-modal .modal-body').html('<div>お気に入り観光地がありません。</div>');
          }
        } else {
          $(YarNet.infowindow.content).removeClass('del').addClass('add');
        }
      })
      .fail(function(data) {
        console.log(data);
      });
  });

  $('#favorite-spots-modal').on('show.bs.modal', function (e) {
    $.ajax({
      cache    : false,
      dataType : 'json',
      url      : YarNet.api + '/users/' + localStorage['auth'] + '/favorite_spots',
    })
      .done(function(data) {
        if (data.length) {
          $('#favorite-spots-modal .modal-body').html('');

          var service = new google.maps.places.PlacesService(YarNet.map);

          data.forEach(function (place) {
            service.getDetails({placeId: place.place_id}, function (place, status) {
              if (status !== google.maps.places.PlacesServiceStatus.OK) return;

              var $place = $('<div class="place">');
              $place.data('place-id', place.place_id);
              $place.data('location', place.geometry.location);

              $place.append(
                $('<img class="place-icon" width="30" height="30">')
                  .attr('src', place.icon)
              );

              $place.append(
                $('<div class="place-title">')
                  .text(place.name)
              );

              $place.append(
                $('<button class="btn btn-danger btn-sm del-favorite-spot" type="button">')
                  .text('お気に入り解除')
              );

              $('#favorite-spots-modal .modal-body').append($place);
            });
          });
        } else {
          $('#favorite-spots-modal .modal-body').html('<div>お気に入り観光地がありません。</div>');
        }
      })
      .fail(function(data) {
        console.log(data);
      });
  });

});
