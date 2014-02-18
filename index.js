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

  app.use(express.cookieParser('e9034305e1978a8d27f2b33eafa1b00f708d8620f148245bceb7'));
  app.use(express.session({ secret: "d563697315a1894a6f3152658cfd7e9034305e1" }));

  require('./src/templates/helpers')(hbs);
});

app.use('/components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/static'));

app.use(require('./src/helpers/tal')(app));
app.get('/', require('./src/routes/home'));
app.get('/auth', require('./src/routes/auth'));

app.listen(process.env.PORT || process.env.npm_package_config_port);