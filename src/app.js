var busStops = require('bus_stops');
var Q = require('q');
var location = require('location');
var UI = require('ui');

var splashScreen = new UI.Card({
  "title": "Loading",
  "body": "wait patiently"
});
splashScreen.show();
var closestStop = Q.all([location.location(), busStops.busStops()])
.spread(busStops.sortByDistance)
.then(function(allStops){
  return allStops[0];
});
var scheduleInfo = closestStop.then(function(stop){return stop.przystanek.id;}).then(busStops.scheduleInfo);

Q.all([closestStop, scheduleInfo])
.spread(function(closestStop, scheduleInfo){
  console.log('stops returned');
  console.log(JSON.stringify(closestStop));
  console.log(JSON.stringify(scheduleInfo));
  var closestBusStopInfo = new UI.Card({
    "title": closestStop.przystanek.properties.stop_name,
    "subtitle": closestStop.distance+"m",
    "body": scheduleInfo.success.times.map(function(singleTime){
      return singleTime.line+"->"+singleTime.direction+": "+singleTime.minutes+"min";
    }).reduce(function(prev, elem){return prev+elem+"\n";}, "")
  });
  closestBusStopInfo.show();
  splashScreen.hide();
}).done();