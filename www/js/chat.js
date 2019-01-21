
// 入室
let room = null;

$('#join').click(function(){

});

// チャットを送信
$('#send').click(function(){
    var msg = $('#msg').val();



    //送信したチャットをデータベースに格納
    $.ajax({
      cache       : false,
      dataType    : 'json',
      type        : 'POST',
      url         : 'https://api.yarnet.ml/messages',
      data        : {'name':name,'body':msg,'address':$("#chat-roomname").data('address')},
    })
      .done(function(data){
        //データベースに送信
        console.log(data);

        //chatlog('自分> ' + msg, 'mychat');
        $('#chatLog').append(
          '<div class ="right message">' +
          '<div class="body">' + data.body + '</div>'+
          '<div class="date">' + data.date + '</div>'+
          '</div>'
        );
        room.send({
          'date': data.date,
          'body': data.body,
        });

      })
      .fail(function(data){
        console.log("チャットの送信に失敗しました");
      });
});

// 退室
$('#leave').click(function(){
    room.close();
    chatlog('<i>' + $('#roomName').val() + '</i>から退室しました', 'system');
})

$('#chat-form').on("submit",function(){
  return false;
});

// チャットログに記録するための関数
function chatlog(msg, type){
    $('#chatLog').append('<div class="' + type + '">' + '<p>' + msg + '</p>' + '</div>');

}
