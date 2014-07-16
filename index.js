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

//io.set('origins', '*');

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

var socket_rooms = {};
var socket_connections = {};

// Websocket routing
io.on('connection', function(socket) {
  console.log('WS_CONNECT %s', socket.id);

  socket_connections[socket.id] = socket;
  socket.user_id = -1;

  socket.on('set_room', function(msg) {
    console.log('SET_ROOM for user ID %s', msg.user_id);

    // Create custom room if not exist
    if(!socket_rooms[msg.user_id]) {
      socket_rooms[msg.user_id] = [];
    }

    // Push this new room subscription to the user's room
    socket_rooms[msg.user_id].push({
      device_name: msg.device_name,
      can_playback: msg.can_playback,
      socket_id: socket.id,
      user_agent: msg.user_agent
    });

    socket.user_id = msg.user_id;
    socket.join(msg.user_id);

    // Announce the new device to the user's other devices
    io.to(msg.user_id).emit('connected_devices', socket_rooms[msg.user_id]);
  });

  socket.on('disconnect', function() {
    console.log('WS_DISCONNECT for user ID %s', socket.user_id);

    // Remove the device from the user's devices room
    if(socket_rooms[socket.user_id]) {
      for(var i = socket_rooms[socket.user_id].length -1; i >= 0 ; i--){
        if(socket_rooms[socket.user_id][i].socket_id == socket.id) {
          socket_rooms[socket.user_id].splice(i, 1);
        }
      }
    }

    // Remove our user ID <=> socket ID reference
    delete socket_connections[socket.id];

    // Announce the new device to the user's other devices
    io.to(socket.user_id).emit('connected_devices', socket_rooms[socket.user_id]);
  });

  socket.on('login', function(msg) {
    io.to(socket.user_id).emit('login', msg);
  });

  socket.on('play', function(req) {
    if (socket_connections[req.socket_id]) {
      socket_connections[req.socket_id].emit('play', req);
      console.log("WS_PLAY from socket %s to %s, user ID %s", socket.socket_id, req.socket_id, req.user_id);
    } else {
      console.log("WS_PLAY_SOCKET_UNKNOWN from socket %s to %s, user ID %s", socket.socket_id, req.socket_id, req.user_id);
    }
  });

  socket.on('pause', function(req) {
    if (socket_connections[req.socket_id]) {
      socket_connections[req.socket_id].emit('pause');
      console.log("WS_PAUSE from socket %s to %s, user ID %s", socket.socket_id, req.socket_id, req.user_id);
    } else {
      console.log("WS_PAUSE_SOCKET_UNKNOWN from socket %s to %s, user ID %s", socket.socket_id, req.socket_id, req.user_id);
    }
  });

//  socket.on('resume', function() {
//    io.to(socket.user_id).emit('resume');
//    console.log("Resume command for user ID = %s", socket.user_id);
//  });
});

http.listen(process.env.PORT || process.env.npm_package_config_port);
