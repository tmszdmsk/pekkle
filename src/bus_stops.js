var Q = require('q');
var settings = require('settings');
var ajax = require('ajax');

if (typeof(Number.prototype.toRadians) === "undefined") {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  };
}

var measure_distance = function(a,b){

  var R = 6371000; // metres
  var φ1 = a.latitude.toRadians();
  var φ2 = b.latitude.toRadians();
  var Δφ = (b.latitude-a.latitude).toRadians();
  var Δλ = (b.longitude-a.longitude).toRadians();

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
  Math.cos(φ1) * Math.cos(φ2) *
  Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = R * c;
  return d;
}

var loadBusStops = function(){
  console.log('loading bus stops');
  var deferred = Q.defer();

  var stops_cache = settings.data('stops_cache');
  if(stops_cache){
    console.log('returning stops from cache');
    deferred.resolve(stops_cache);
  }

  ajax({
    'url': 'http://www.poznan.pl/mim/plan/map_service.html?mtype=pub_transport&co=cluster',
    'method': 'GET',
    'type': 'json'
  }, function(response){
    console.log('bus stops loaded');
    settings.data('stops_cache', stops);
    deferred.resolve(response);
  }, function(error){
    console.log('error while loading bus stops');
    console.log(error);
    deferred.reject(error);
  })
  return deferred.promise;
};

var closest = function(position, busStops){
  console.log("sorting bus stops by distance");
  return busStops.features.map(function(elem){
    var distance = measure_distance(position.coords, {latitude: elem.geometry.coordinates[1], longitude:elem.geometry.coordinates[0]});
    return {przystanek: elem, distance: Math.round(distance)};
  }).sort(function(a,b){return a.distance-b.distance;});
};

var pekaInfo = function(busStopId){
  var deferred = Q.defer();
  console.log("pekaInfo in");
  ajax({
    'url':'https://www.peka.poznan.pl/vm/method.vm',
    'method': 'POST',
    'type': undefined,
    'data': {
      'method': 'getTimes',
      'p0':"{'symbol':'"+busStopId+"'}"
    }
  }, function(responseText){
    console.log('pekaInfo reponse');
    deferred.resolve(JSON.parse(responseText));
  }, function(error){
    console.log('error downloading stop timetable');
    deferred.reject(error);
  });
  return deferred.promise;
}


this.exports = {
  "busStops" : loadBusStops,
  "sortByDistance" : closest,
  "scheduleInfo": pekaInfo
};
