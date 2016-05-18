var Q = require('q');

var location = function() {
  console.log('location requested');
  var deferred = Q.defer();
  navigator.geolocation.getCurrentPosition(
    function(location){
      deferred.resolve(location);
    },
    function(error){
      deferred.reject(error);
    }
  );
  return deferred.promise;
}

this.exports = {
  location: location
};
