var UI = require('ui');
var Vibe = require('ui/vibe');

var showErrorCard = function(error){
  var card = new UI.Card({
    'title': 'Oh! no! error!',
    'body': JSON.stringify(error)
  });
  card.show();
  Vibe.vibrate('double');
}

this.exports = {
  showError: showErrorCard
};
