$(function(){
   $('.form-register').on('submit', function(){
     var name = $('#inputName').val();
     var mail = $('#inputEmail').val();
     var pass = $('#inputPassword').val();
     var re_pass = $('#inputRePassword').val();
//サーバー側に送ってエラーが返ってきたらメッセージ
     $.ajax({
       'url': 'https://api.yarnet.ml/users',
       'data': {'name': name, 'mail': mail, 'pass': pass, 're_pass': re_pass},
       'type': 'post',
       'dataType': 'json',
     }).done(function(data) {
//エラーがなかったらここに画面遷移とか
       $('.register').fadeOut('fast', () => $('.main').fadeIn());
     }).fail(data => {
       if (data.responseJSON.error !== undefined) {
         $('.alert#name_alert').text(data.responseJSON.error.name || '');
         $('.alert#mail_alert').text(data.responseJSON.error.mail || '');
         $('.alert#pass_alert').text(data.responseJSON.error.pass || '');
         $('.alert#re_alert').text(data.responseJSON.error.re_pass || '');
       }
     });

    return false;
    });
})
