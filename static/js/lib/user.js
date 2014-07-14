require.def('lancaster-vision/lib/user',
  [
    'lancaster-vision/lib/websocket'
  ],
  function(WebSocket) {
    return {
      setUserId: function(user_id) {
        var self = this;
        this._user_id = user_id;

        WebSocket.getSocket().on('connect', function() {
          console.log("Connected, sending set_room");
          self.setRoom();
        });

        WebSocket.getSocket().on('reconnect', function() {
          console.log("WS reconnected");
        });
      },
      getUserId: function() {
        return this._user_id || null;
      },
      setRoom: function() {
        console.log("Set_room function for user ID ", this._user_id);

        WebSocket.getSocket().emit('set_room', {
          user_id: this._user_id,
          device_name: 'TAL Client',
          can_playback: true,
          user_agent: navigator.userAgent
        });
      }
    };
  });
