'use strict';

// Simply serves the TAL application
module.exports = function tvGetRoute(req, res) {
  res.render('default', {
    title: "Vision - TAL Interface"
  });
};
