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

        this._socket.on('play', function(programme_id) {
          app.broadcastEvent(new Event('vod.show', { programme_id: programme_id }));
        });

        this._socket.on('pause', function(programme_id) {
          app.broadcastEvent(new Event('vod.pause'));
        });

        this._socket.on('resume', function(programme_id) {
          app.broadcastEvent(new Event('vod.resume'));
        });
      },
      getSocket: function() {
        return this._socket;
      }
    };
  });
