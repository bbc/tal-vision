require.def('lancaster-vision/appui/bootstrap',
  [
    'antie/application',
    'antie/widgets/container',
    'lancaster-vision/lib/authenticator'
  ],
  function(Application, Container, Authenticator) {

    return Application.extend({
      init: function(appDiv, styleDir, imgDir, callback) {
        var self;
        self = this;

        self._super(appDiv, styleDir, imgDir, callback);

        // Sets the root widget of the application to be
        // an empty container
        self._setRootContainer = function() {
          var container = new Container();
          container.outputElement = appDiv;
          self.setRootWidget(container);
        };
      },

      run: function() {
        var self = this;

        this._setRootContainer();

        Authenticator(this.getDevice()).isAuthenticated(
          function success(response){
            self.addComponentContainer("maincontainer", "lancaster-vision/appui/controller");
          },
          function failure(response){
            self.addComponentContainer("maincontainer", "lancaster-vision/appui/components/login");
          }
        );
      }
    });
  }
);