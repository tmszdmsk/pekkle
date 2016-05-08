var busStops = require('bus_stops');
var Q = require('q');
var location = require('location');
var UI = require('UI');

var splashScreen = new UI.Card({
  "title": "Loading",
  "body": "wait patiently"
});
splashScreen.show();
Q.all([location.location(), busStops.busStops()])
.spread(busStops.sortByDistance)
.then(function(stops){
  console.log('stops returned');
  var closestBusStopInfo = UI.Card({
    "title": stops[0].przystanek.properties.stop_name,
    "subtitle": "Distance: "+stops[0].distance+"m"
  });
  closestBusStopInfo.show();
  splashScreen.hide();
});