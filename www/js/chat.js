
// 入室
let room = null;

//チャット履歴の取得
$.ajax({
  cache       : false,
  contentType : false,
  dataType    : 'json',
  processData : false,
  type        : 'GET',
  url         : 'https://api.yarnet.ml/messages',
})
  .done(function(data) {
    console.log(data);
  })
  .fail(function(data){
    console.log("チャットの取得に失敗しました");
  });

$('#join').click(function(){

});

// チャットを送信
$('#send').click(function(){
    var msg = $('#msg').val();
    room.send(msg);

    //chatlog('自分> ' + msg, 'mychat');
    $('#chatLog').append(
      '<div class ="right message">' +
      '<div class="body">' + msg + '</div>'+
      '<div class="date">' + '00:00' + '</div>'+
      '</div>'
    );

    //送信したチャットをデータベースに格納
    $.ajax({
      cache       : false,
      dataType    : 'json',
      type        : 'POST',
      url         : 'https://api.yarnet.ml/messages',
      data        : {'date':date,'name':name,'body':msg},
    })
      .done(function(data){
        //データベースに送信
        console.log(data);
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
