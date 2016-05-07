var busStops = require('bus_stops');
var Q = require('q');
var location = require('location');

Pebble.addEventListener('ready', function(e) {
  console.log('PebbleKit JS ready! '+e.ready);
  Pebble.sendAppMessage({
    'PebbleJSAppStarted': true
  });
});


Pebble.addEventListener('appmessage', function (e) {
  console.log('Message received', e);
  Q.all([location.location(), busStops.busStops()]).spread(busStops.sortByDistance)
  .then(function(stops){
    console.log('stops returned');
    Pebble.sendAppMessage({
      'StopName': stops[0].przystanek.properties.stop_name,
      'StopDistance': stops[0].distance,
      'StopId': stops[0].przystanek.id
    }, function(){console.log("stop sent")}, function(){console.log("stop sent failed")});
  });
});

console.log('#1')
