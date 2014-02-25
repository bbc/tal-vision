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
            callbacks.onSuccess(JSON.parse(responseObject));
          },
          onError: function(response) {
            console.log(response);
            callbacks.onSuccess([]);
          }
        });
      }
    });
  });
