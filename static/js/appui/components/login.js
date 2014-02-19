require.def('lancaster-vision/appui/components/login',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/keyboard",
    "antie/widgets/label",
    "antie/widgets/verticallist",
    "antie/widgets/componentcontainer",
    "lancaster-vision/lib/authenticator"

  ],
  function(Component, Button, Keyboard, Label, List, Container, Authenticator) {

    return Component.extend({
      init: function () {
        var self = this;
        var app = this.getCurrentApplication();
        var device = app.getDevice();

        this._super("login");

        this._form = new Container('signin-form');
        this._form.appendChildWidget(new Label("Please authenticate to continue."));

        var list = new List();
        var input = new Label("********");
        input.addClass('fakeInput');
        input.addClass('placeholder')

        var button = new Button('ok')
        button.appendChildWidget(new Label("Verify"));
        button.addClass('okButton');
        button.setDisabled(true);

        button.addEventListener('select', function(e){
          button.setDisabled(true);

          Authenticator(device).verify(keyboard.getText(), function(user){
            app.showComponent('maincontainer', 'lancaster-vision/appui/components/home');
          }, function(){
            button.setDisabled(false);
            keyboard.setActiveChildKey('1');
            input.setText('********');
            keyboard.setText('');
          })
        });

        var keyboard = new Keyboard('auth_key', 12, 1, '1234567890_-');
        keyboard.setActiveChildKey('1');
        keyboard.addEventListener('textchange', function(e){
          input.setText(e.text);

          if (e.text.length) {
            input.removeClass('placeholder');
            button.setDisabled(false);
          }
          else {
            input.addClass('placeholder');
            input.setText('********');
            button.setDisabled(true);
          }
        });

        list.appendChildWidget(input);
        list.appendChildWidget(keyboard);
        list.appendChildWidget(button);
        this._form.appendChildWidget(list);

        this.addEventListener("beforerender", function(e){
          self._onBeforeRender(e);
        });

        // calls Application.ready() the first time the component is shown
        // the callback removes itself once it's fired to avoid multiple calls.
        this.addEventListener("aftershow", function appReady() {
          self.getCurrentApplication().ready();
          self.removeEventListener('aftershow', appReady);
        });
      },

      // Appending widgets on beforerender ensures they're still displayed
      // if the component is hidden and subsequently reinstated.
      _onBeforeRender: function () {
        this.appendChildWidget(this._form);
      }
    });
  }
);