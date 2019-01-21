let peer         = null;
let existingCall = null;

// SkyWayのシグナリングサーバと接続する。
peer = new Peer({key: '987f8d84-8021-40f2-9bf9-aac9a6722c10', debug: 0});

peer.on('open', function(id) {
  $('#my-id').text(peer.id);
});

peer.on('error', function(err) {
  // alert(err.message);
});

peer.on('close', function() {
});

peer.on('disconnected', function() {
});

$('#make-call').submit(function(e) {
  e.preventDefault();

  getLocalStream(function(stream) {
    var call = peer.call($('#callto-id').val(), stream);
    setupCallEventHandlers(call);
  });

  $('#sampleModal').modal('hide');
  $('#video-content').transition('fadeOut', 'fadeIn');
});

$('#end-call').on('submit', function() {
  $('#video-content [data-toggle="goBackward"]').click();

  if (existingCall) {
    existingCall.close();
  }

  return false;
});

peer.on('call', function(call) {
  $('#video-alert').addClass('show');

  // 応答
  $('#answer-call').one('click',function() {
    getLocalStream(function(stream) {
      call.answer(stream);
      setupCallEventHandlers(call);
    });

    $('#video-alert').removeClass('show');
    $('#video-content').transition('fadeOut', 'fadeIn');
  });

  // 拒否
  $('#no-call').one('click',function() {
    call.close();
    setupMakeCallUI();
    $('#video-alert').removeClass('show');
  });
});

function setupCallEventHandlers(call) {
  if (existingCall) {
    existingCall.close();
  }

  existingCall = call;

  call.on('stream', function(stream) {
    addVideo(call, stream);
    setupEndCallUI();
    $('#their-id').text(call.remoteId);
  });

  call.on('close', function() {
    setupMakeCallUI();
    $('#video-content [data-toggle="goBackward"]').click();
  });
}

function getLocalStream(callback) {
  navigator.mediaDevices.getUserMedia({video: true, audio: true}).catch(alert).then(function(stream) {
    $('.m-video')[0].srcObject = stream;
    callback(stream);
  });
}

function addVideo(call, stream) {
  $('.t-video')[0].srcObject = stream;
  $('.t-video').addClass('main-video');
  $('.m-video').removeClass('main-video');
}

function setupMakeCallUI() {
  // $('#make-call').show();
  // $('#end-call').hide();
}

function setupEndCallUI() {
  // $('#make-call').hide();
  // $('#end-call').show();
}

// $('#video-content').on('click', 'video', function() {
//   $('.t-video').toggleClass('main-video');
//   $('.m-video').toggleClass('main-video');
// });
