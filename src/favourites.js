var favourites = [];

var saveToFavourites = function(aggregate){
  favourites.push(aggregate);
};

var listFavourites = function(){
  return favourites;
};

var removeFromFavourites = function(aggregate){
};

var isInFavourtes = function(aggregate){
  
};

this.exports = {
  "add": saveToFavourites,
  "list": listFavourites,
  "remove":removeFromFavourites,
  "is": isInFavourtes
};