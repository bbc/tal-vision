require.def('lancaster-vision/appui/bootstrap',
  [
    'antie/application',
    'antie/widgets/container',
    'lancaster-vision/lib/authenticator',
    'lancaster-vision/lib/websocket'
  ],
  function(Application, Container, Authenticator, WebSocket) {
    var _appDiv;

    return Application.extend({
      init: function(appDiv, styleDir, imgDir, callback) {
        this._super(appDiv, styleDir, imgDir, callback);
        _appDiv = appDiv;
      },

      run: function() {
        var self = this;

        WebSocket.init(this);

        // Sets the root widget of the application to be an empty container
        var header_container = new Container();
        header_container.outputElement = _appDiv;
        self.setRootWidget(header_container);

        // Dismiss the PlayStation 3 overlay
        self.nativeCommand("dismissSplash");

        Authenticator(this.getDevice()).isAuthenticated(
          function success() {
            self.addComponentContainer("maincontainer", "lancaster-vision/appui/controller");
          },
          function failure() {
            self.addComponentContainer("maincontainer", "lancaster-vision/appui/components/login");
          }
        );
      },

      nativeCommand: function(command) {
        var hash = {
          command: command
        };
        var json = JSON.stringify(hash);
        window.external && window.external.user && window.external.user(json);
      },
    });
  }
);
