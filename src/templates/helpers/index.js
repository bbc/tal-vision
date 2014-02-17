'use strict';

module.exports = function(hbs){
  ['text'].forEach(function(helperBundle){
    require(__dirname + '/' + helperBundle + '.js')(hbs);
  });
};