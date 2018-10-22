$('#login-form').on('submit', e => {
  e.preventDefault();

  let settings = {};
  settings.cache       = false;
  settings.contentType = false;
  settings.data        = new FormData($('#login-form')[0]);
  settings.dataType    = 'json';
  settings.method      = 'POST';
  settings.processData = false;
  settings.url         = 'https://api.yarnet.ml/login';

  $.ajax(settings)
      .done(data => {
        $('.login').fadeOut('fast', () => $('.main').fadeIn());
      })
      .fail(data => {
        alert('ログインに失敗しました。');
      });
});

$('[data-toggle="login"]').on('click', e => {
  $('.main').fadeOut('fast', () => $('.login').fadeIn());
});

$('[data-dismiss="login"]').on('click', e => {
  $('.login').fadeOut('fast', () => $('.main').fadeIn());
});
