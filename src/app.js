var busStops = require('bus_stops');
var Q = require('q');
var location = require('location');
var UI = require('ui');
var _ = require('underscore');
var singleStop = require('single_stop');
var Vibe = require('ui/vibe');
var Light = require('ui/light');

var sortedStops = Q.all([location.location(), busStops.busStops()])
.spread(busStops.sortByDistance);
var closestStop = sortedStops
.then(function(allStops){
  return allStops[0];
});
var scheduleInfo = closestStop.then(function(stop){return stop.przystanek.id;}).then(busStops.scheduleInfo);

sortedStops.then(function(stops){
  var stopAggregates = stops.map(function(stop){
    return {
      "name": stop.przystanek.properties.stop_name,
      "id": stop.przystanek.id,
      "distance": stop.distance,
      "headsigns": stop.przystanek.properties.headsigns.split(", ")
    };
  }).reduce(function(all, elem){
    var stopAggregate = _.findWhere(all, {"name": elem.name});
    if(_.isUndefined(stopAggregate)){
      all.push({"name": elem.name, "stops": [elem]});
    } else {
      stopAggregate.stops.push(elem);
    }
    return all;
  }, []);

  var menu = new UI.Menu({
    "sections": [{
      "items": _.first(stopAggregates,10).map(function(aggragate){
        return {
          "title": aggragate.name,
          "subtitle": _.uniq(_.flatten(aggragate.stops.map(function(stop){return stop.headsigns}))).join(" "),
          "aggregate": aggragate
        };
      })
    }]
  });
  menu.on('select', function(selected) {singleStop.openWindow(selected.item.aggregate)});
  menu.show();
  Vibe.vibrate('short');
  Light.trigger();
}).done();
