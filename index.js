'use strict';

// node.js app to serve the Lancaster Vision TAL application and provide a
// wrapper around an existing remote authentication API

var express = require('express');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var hbs = require('express-hbs');
var app = express();
var tal = require('tal');
var fs = require('fs');

app.configure(function(){

  // We're using HBS for templating
  app.engine('hbs', hbs.express3({
    layoutsDir: __dirname + '/src/templates/layout',
    defaultLayout:  __dirname + '/src/templates/layout/default'
  }));

  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/src/templates');

  // Setup signed cookies and session storage in Redis
  app.use(express.cookieParser('T2zCPeTvNX28Q2Zt233R4cUy3kS0q0hbLGk8NB73Ypf1k1cnDuvCMxU5rg2K'));
  app.use(express.session({
    secret: "SqmL4rxRWcKA96CKZYNOfiLNivDpgboPRYfpT8FuJa9A3aKPRLqaEH5iRW1R",
    store: new redisStore({
      host: "localhost",
      db: "lancaster-vision-tal",
      url : process.env.REDISTOGO_URL || null
    }),
    cookie: {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    }
  }));

  require('./src/templates/helpers')(hbs);
});

// Simple request logger
app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
});

// Express logger
var logFile = fs.createWriteStream('./tal.log', {flags: 'a'});
app.use(express.logger({stream: logFile}));

// Detect custom test devices and populate device and model req params
app.use(function(req, res, next) {
  var user_agent = req.headers['user-agent'];
  var is_samsung = user_agent.indexOf("Maple2012") != -1;

  if(is_samsung) {
    req.query.brand = "custom";
    req.query.model = "samsung";
  }

  next();
});

// Serve static assets and Bower components
app.use('/components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/static'));

// Inject TAL middleware
app.use(tal.middleware());
//app.configure(require('./src/helpers/lancasterAPI')(app));

// App routing
app.get('/', require('./src/routes/home'));
app.get('/iplayer', require('./src/routes/home'));
app.get('/auth/:auth_code?', require('./src/routes/auth'));

app.listen(process.env.PORT || process.env.npm_package_config_port);
