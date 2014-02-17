'use strict';

module.exports = function(hbs){
  hbs.registerHelper('json', function(object, options){
    return JSON.stringify(object, null, options.hash.compact ? 0 : 2);
  });
};