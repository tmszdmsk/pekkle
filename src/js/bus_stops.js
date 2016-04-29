
if (typeof(Number.prototype.toRadians) === "undefined") {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }
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

var loadBusStops = function(position, callback2){
console.log('got position');
var method = 'GET';
var url = 'http://www.poznan.pl/mim/plan/map_service.html?mtype=pub_transport&co=cluster';

// Create the request
var request = new XMLHttpRequest();

// Specify the callback for when the request is completed
request.onload = function() {
  console.log('got response');
  var przystanki = JSON.parse(this.responseText);
  callback2(przystanki.features.map(function(elem){
    var distance = measure_distance(position.coords, {latitude: elem.geometry.coordinates[1], longitude:elem.geometry.coordinates[0]});
    return {przystanek: elem, distance: distance}
  }).sort(function(a,b){return a.distance-b.distance}));
};

// Send the request
request.open(method, url);
request.send();
};

this.exports = {
  "loadBusStops" : loadBusStops
};
