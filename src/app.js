var busStops = require('bus_stops');
var Q = require('q');
var location = require('location');
var UI = require('ui');
var _ = require('underscore');

var splashScreen = new UI.Card({
  "banner": "IMAGE_PEKKLE_ICON",
  "backgroundColor": "white"
});
splashScreen.show();
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
  menu.on('select', function(selected){
    var aggregate = selected.item.aggregate;
    var stopWindow = new UI.Card({"title": aggregate.name, "scrollable": true, "body": "LOADING"});
    stopWindow.show();
    Q.all(aggregate.stops.map(function(stop){return busStops.scheduleInfo(stop.id);}))
    .then(function(stopsSchedules){
      var content = _.flatten(stopsSchedules.map(function(schedule){
        return schedule.success.times.map(function(singleTime){
          return singleTime.line+"->"+singleTime.direction+": "+singleTime.minutes+"min";
        });
      })).join("\n");
      stopWindow.body(content);
    }).done();
  });
  splashScreen.hide();
  menu.show();
}).done();

// Q.all([closestStop, scheduleInfo])
// .spread(function(closestStop, scheduleInfo){
//   console.log('stops returned');
//   console.log(JSON.stringify(closestStop));
//   console.log(JSON.stringify(scheduleInfo));
//   var closestBusStopInfo = new UI.Card({
//     "title": closestStop.przystanek.properties.stop_name,
//     "subtitle": closestStop.distance+"m",
//     "scrollable": true,
//     "body": scheduleInfo.success.times.map(function(singleTime){
//       return singleTime.line+"->"+singleTime.direction+": "+singleTime.minutes+"min";
//     }).reduce(function(prev, elem){return prev+elem+"\n";}, "")
//   });
//   closestBusStopInfo.show();
//   splashScreen.hide();
// }).done();