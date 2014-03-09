require.def('lancaster-vision/appui/datasources/historyfeed',
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

        var url = "http://10.42.32.75:9110/analysis/viewing_history?user_id=202&api=53e659a15aff4a402de2d51b98703fa1ade5b8c5&range_days=";

        // Real API URL: http://10.42.32.75:9110/recommender/get_recommendations?user_id=202&seed=history&api=53e659a15aff4a402de2d51b98703fa1ade5b8c5
        // Stub API URL: /api_stubs/recommendations.json
        device.loadURL(url, {
          onLoad: function(responseObject) {
            var programmes = JSON.parse(responseObject);
            callbacks.onSuccess(programmes);
          },
          onError: function(response) {
            console.log(response);
            callbacks.onSuccess([]);
          }
        });
      }
    });
  });
