Pebble.addEventListener('ready', function(e) {
  console.log('PebbleKit JS ready! '+e.ready);
  Pebble.sendAppMessage({
    'PebbleJSAppStarted': true
  });
  window.navigator.geolocation.getCurrentPosition(function(position){
    console.log('position = '+position);
  });
});


Pebble.addEventListener('appmessage', function (e) {
  console.log('Message received', e);
});

console.log('#1')
