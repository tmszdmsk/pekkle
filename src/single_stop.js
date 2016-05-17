var UI = require('ui');
var Q = require('q');
var _ = require('underscore');
var busStops = require('bus_stops');

var openStopWindow = function(aggregate){
  var stopWindow = new UI.Menu({
    "sections": [
      {
        "title": aggregate.name,
        "items": [
          {"title": "loading..."}
        ]
      }
    ]
  });
  stopWindow.show();
  Q.all(aggregate.stops.map(function(stop){return busStops.scheduleInfo(stop.id);}))
  .then(function(stopsSchedules){
    console.log("got schedules");
    var itemz = _.chain(stopsSchedules).map(function(schedule){
      return schedule.success.times;
    })
    .flatten()
    .sortBy('minutes')
    .map(function(time){
      return {
        "title": time.line+" "+time.minutes+"min",
        "subtitle": "-> "+time.direction
      };
    }).value();
    stopWindow.items(0, itemz);
  }).done();
};

this.exports = {
  "openWindow": openStopWindow
};
