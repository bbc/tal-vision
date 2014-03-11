require.def('lancaster-vision/appui/bootstrap',
  [
    'antie/application',
    'antie/widgets/container',
    'lancaster-vision/lib/authenticator',
    'antie/widgets/verticallist',
    'lancaster-vision/lib/user'
  ],
  function(Application, Container, Authenticator, VerticalList, User) {

    return Application.extend({
      init: function(appDiv, styleDir, imgDir, callback) {
        var self;
        self = this;

        self._super(appDiv, styleDir, imgDir, callback);

        // Sets the root widget of the application to be
        // an empty container
        self._setRootContainer = function() {
          var vertical_layout = new VerticalList();
          vertical_layout.outputElement = appDiv;

          var header_container = new Container();
          vertical_layout.appendChildWidget(header_container);

          self.setRootWidget(vertical_layout);
        };

      },

      run: function() {
        var self = this;

        this._setRootContainer();

        self.nativeCommand("dismissSplash");

        Authenticator(this.getDevice()).isAuthenticated(
          function success(response){
            response = JSON.parse(response);
            User.setUserId(response.user_id);
            self.addComponentContainer("maincontainer", "lancaster-vision/appui/controller");
          },
          function failure(response){
            self.addComponentContainer("maincontainer", "lancaster-vision/appui/components/login");
          }
        );
      },

      nativeCommand: function (command) {
          var hash = {
            command: command
          };
          var json = JSON.stringify(hash);
          window.external && window.external.user && window.external.user(json);
      },
    });
  }
);