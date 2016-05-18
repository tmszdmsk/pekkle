var Q = require('q');

var location = function() {
  console.log('location requested');
  var deferred = Q.defer();
  navigator.geolocation.getCurrentPosition(
    function(location){
      deferred.resolve(location);
    },
    function(error){
      deferred.reject("error while getting position, " + JSON.stringify(error));
    },
    {
      'enableHighAccuracy': false,
      'timeout': 30000
    }
  );
  return deferred.promise;
}

this.exports = {
  location: location
};
