var Q = require('q');

var location = function() {
  console.log('location requested');
  var deferred = Q.defer();
  window.navigator.geolocation.getCurrentPosition(function(location){
    console.log('location returned');
    deferred.resolve(location);
  });
  return deferred.promise;
}

this.exports = {
  location: location
};
