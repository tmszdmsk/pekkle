var bus_stops = require('bus_stops');
Pebble.addEventListener('ready', function(e) {
  console.log('PebbleKit JS ready! '+e.ready);
  Pebble.sendAppMessage({
    'PebbleJSAppStarted': true
  });
});


Pebble.addEventListener('appmessage', function (e) {
  console.log('Message received', e);
  window.navigator.geolocation.getCurrentPosition(function(position){
    bus_stops.loadBusStops(position, function(stops){
      console.log('stops returned');
      Pebble.sendAppMessage({
        'StopFound': stops[0].przystanek.id,
        'StopDistance': stops[0].distance
      }, function(){console.log("stop sent")}, function(){console.log("stop sent failed")});
    })
  },{},{"enableHighAccuracy": true});
});

console.log('#1')
