'use strict';

var express = require('express');
var redisStore = require('connect-redis')(express);
var hbs = require('express-hbs');
var app = express();
var tal = require('tal');

app.configure(function(){
  app.engine('hbs', hbs.express3({
    layoutsDir: __dirname + '/src/templates/layout',
    defaultLayout:  __dirname + '/src/templates/layout/tv'
  }));

  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/src/templates');

  app.use(express.cookieParser('e9034305e1978a8d27f2b33eafa1b00f708d8620f148245bceb7'));
  app.use(express.session({
    secret: "d563697315a1894a6f3152658cfd7e9034305e1",
    store: new redisStore({
      host: "localhost",
      db: "lancaster-vision-tal",
      url : process.env.REDISTOGO_URL || null
    })
  }));

  require('./src/templates/helpers')(hbs);
});

// Simple request logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.use('/components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/static'));

// App Specific Middlewares
app.use(tal.middleware());
app.configure(require('./src/helpers/lancasterAPI')(app));

// Routing
app.get('/', require('./src/routes/home'));
app.get('/iplayer', require('./src/routes/home'));
app.get('/auth/:auth_code?', require('./src/routes/auth'));

app.listen(process.env.PORT || process.env.npm_package_config_port);