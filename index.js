'use strict';

var express = require('express');
var hbs = require('express-hbs');
var app = express();

app.configure(function(){
  app.engine('hbs', hbs.express3({
    layoutsDir: __dirname + '/src/templates/layout',
    //partialsDir: __dirname + '/src/templates/partials',
    defaultLayout:  __dirname + '/src/templates/layout/tv'
  }));

  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/src/templates');

  require('./src/templates/helpers')(hbs);
});

app.use('/components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/static'));

app.get('/', require('./src/routes/home'));

app.listen(process.env.PORT || process.env.npm_package_config_port);