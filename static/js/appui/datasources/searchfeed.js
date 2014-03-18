require.def('lancaster-vision/appui/datasources/searchfeed',
  [
      "antie/class"
  ],
  function(Class) {
    return Class.extend({
      init : function(search_term, app) {
        this._search_term = search_term;
        this._app = app;
      },

      loadData : function(callbacks) {
        var app = this._app.getCurrentApplication();
        var device = app.getDevice();

        var url = "http://10.42.32.184/search2.php?start=0&rows=10&url=%2Ffuture%2Fselect&wt=json&send_filters=false&sort=score%2Bdesc";
        url += "&q=*" + this._search_term + "*";

        device.loadURL(url, {
          onLoad: function(responseObject) {
            var json = JSON.parse(responseObject);
            var search_results = [];

            // Filter search results to check VOD is available
            json.response.docs.forEach(function(programme) {
              if(!programme.not_available) {
                search_results.push(programme);
              }
            });

            callbacks.onSuccess(search_results);
          },
          onError: function(response) {
            console.log(response);
            callbacks.onSuccess([]);
          }
        });
      }
    });
  });
