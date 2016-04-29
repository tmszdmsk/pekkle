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
        'StopName': stops[0].przystanek.properties.stop_name,
        'StopDistance': stops[0].distance,
        'StopId': stops[0].przystanek.id
      }, function(){console.log("stop sent")}, function(){console.log("stop sent failed")});
    })
  },{},{"enableHighAccuracy": true});
});

console.log('#1')
