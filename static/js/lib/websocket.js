require.def('lancaster-vision/lib/websocket',
  [
    "lancaster-vision/lib/authenticator",
    "lancaster-vision/lib/dataevent"
  ],
  function(Authenticator, Event) {
    return {
      init: function(app) {
        this._socket = io();

        this._socket.on('login', function(user_id) {
          console.log('Got a login request for user %s', user_id);
          var device = app.getDevice();
          Authenticator(device).set_session(user_id);
          location.reload();
        });

        this._socket.on('play', function(req) {
          console.log("Got a play request: ", req);
          app.broadcastEvent(new Event('vod.show', {
            programme_id: req.programme_id,
            tal_resume_from: req.start_at
          }));
        });

        this._socket.on('pause', function() {
          app.broadcastEvent(new Event('vod.pause'));
        });

        this._socket.on('resume', function() {
          app.broadcastEvent(new Event('vod.resume'));
        });

        this._socket.on('connected_devices', function(msg) {
          console.log("connected_devices: ", msg);
        });
      },
      getSocket: function() {
        return this._socket;
      }
    };
  });
