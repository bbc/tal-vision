'use strict';

// node.js app to serve the Lancaster Vision TAL application and provide a
// wrapper around an existing remote authentication API

var express = require('express');
var session = require('cookie-session')
var hbs = require('express-hbs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tal = require('tal');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var util = require('util');

// We're using HBS for templating
app.engine('hbs', hbs.express3({
  layoutsDir: __dirname + '/src/templates/layout',
  defaultLayout: __dirname + '/src/templates/layout/default'
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/src/templates');

var cookieLength = 1000 * 60 * 60 * 24 * 30; // 30 days

// Setup signed cookies and session storage in Redis
app.use(cookieParser("T2zCPeTvNX28Q2Zt233R4cUy3kS0q0hbLGk8NB73Ypf1k1cnDuvCMxU5rg2K"));
app.use(session({
  name: "vision-tal-v1.4",
  keys: ['T2zCPeTvNX28Q2Zt233R4cUy3kS0q0hbLGk8NB73Ypf1k1cnDuvCMxU5rg2K'],
  expires: new Date(Date.now() + cookieLength),
  httpOnly: true,
  maxage: cookieLength
}));

// Include view helpers
require('./src/templates/helpers')(hbs);

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

// Simple request logger
app.use(function(req, res, next) {
  console.log('%s %s %j', req.method, req.url);
  next();
});

// Inject TAL middleware
app.use(tal.middleware());

// App routing
app.get('/', require('./src/routes/home'));
app.get('/iplayer', require('./src/routes/home'));
app.get('/auth/:auth_code?', require('./src/routes/auth'));

// Websocket routing
io.on('connection', function(socket){
  console.log('Session connected');

  socket.on('disconnect', function(){
    console.log('Session disconnected');
  });

  socket.on('login', function(msg){
    io.emit('login', msg);
  });

  socket.on('play', function(msg){
    io.emit('play', msg);
  });
});

http.listen(process.env.PORT || process.env.npm_package_config_port);
