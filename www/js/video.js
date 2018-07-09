let localStream = null;
let peer = null;
let existingCall = null;

navigator.mediaDevices.getUserMedia({video: true, audio: true})
.then(function (stream) {
  // Success
  $('#my-video').get(0).srcObject = stream;
  localStream = stream;
}).catch(function (error) {
  // Error
  console.error('mediaDevice.getUserMedia() error:', error);
  return;
});

peer = new Peer({
  key: '987f8d84-8021-40f2-9bf9-aac9a6722c10',
  debug: 3
});

peer.on('open', function(id){
  console.log(id);
  $('#my-id').text(peer.id);
});

peer.on('error', function(err){
  alert(err.message);
});

peer.on('close', function(){
});

peer.on('disconnected', function(){
});

$('#make-call').submit(function(e){
  e.preventDefault();
  const call = peer.call($('#callto-id').val(), localStream);
  setupCallEventHandlers(call);
});

$('#end-call').on('submit', function(){
  if (existingCall) {
    existingCall.close();
  }
  return false;
});

peer.on('call', function(call){
  $('#video').addClass('open');
  //応答
  $('#answer-call').one('click',function(){
    call.answer(localStream);
    setupCallEventHandlers(call);
    $('#answer-call').css('display','none');
    $('#no-call').css('display','none');
  });
  //拒否
  $('#no-call').one('click',function(){
    setupMakeCallUI();
    $('#video').removeClass('open');
  });
});

function setupCallEventHandlers(call){
  if (existingCall) {
    existingCall.close();
  };

  existingCall = call;

  call.one('stream', function(stream){
    addVideo(call,stream);
    setupEndCallUI();
    $('#their-id').text(call.remoteId);
  });
  call.one('close', function(){
    setupMakeCallUI();
    $('#video').removeClass('open');
  });
}

function addVideo(call,stream){
  $('#video').addClass('open');
  $('#their-video').get(0).srcObject = stream;
}

function setupMakeCallUI(){
  $('#make-call').show();
  $('#end-call').hide();
}

function setupEndCallUI() {
  $('#make-call').hide();
  $('#end-call').show();
}
