require.def('lancaster-vision/appui/datasources/trendingfeed',
  [
      "antie/class"
  ],
  function(Class) {
    return Class.extend({
      init : function(app) {
        this._app = app;
      },

      loadData : function(callbacks) {
        var app = this._app.getCurrentApplication();
        var device = app.getDevice();

        // Real API URL: http://10.42.32.199:2000/trending
        // Stub API URL: /api_stubs/trending.json
        device.loadURL("http://10.42.32.199:2000/trending", {
          onLoad: function(responseObject) {

            var all_programmes = JSON.parse(responseObject);
            var vod_programmes = Array();

            all_programmes.forEach(function(programme) {
                if(programme.live == "0") {
                  vod_programmes.push(programme)
                }
            });

            callbacks.onSuccess(vod_programmes);
          },
          onError: function(response) {
            console.log(response);
            callbacks.onSuccess([]);
          }
        });
      }
    });
  });
