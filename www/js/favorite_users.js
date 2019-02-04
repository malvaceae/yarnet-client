$('#favorite-spots-modal').on('show.bs.modal', function (e) {
  console.log("aaa");
  $.ajax({
    cache    : false,
    dataType : 'json',
    url      : YarNet.api + '/users/' + localStorage['auth'] + '/favorite_users',
  })
    .done(function(data) {
      if (data.length) {
        $('#nav-users').html('');
        data.forEach(function (user) {
          var $user = $('<div class="user">');
          $user.data('user-id', user.user_id);

          $user.append(
            $('<div class="user-name">')
            .text(user.user_name)
          );

          $('#nav-users').append($user);
        });
      }
    });
  });
