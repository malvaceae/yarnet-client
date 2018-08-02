
// 入室
let room = null;

$('#join').click(function(){
});

// チャットを送信
$('#send').click(function(){
    var msg = $('#msg').val();
    room.send(msg);
    chatlog('自分> ' + msg);
});

// 退室
$('#leave').click(function(){
    room.close();
    chatlog('<i>' + $('#roomName').val() + '</i>から退室しました');
})


// チャットログに記録するための関数
function chatlog(msg){
    $('#chatLog').append('<p>' + msg + '</p>');
}
