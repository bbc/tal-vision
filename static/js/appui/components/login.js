require.def('lancaster-vision/appui/components/login',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/keyboard",
    "antie/widgets/label",
    "antie/widgets/verticallist",
    "antie/widgets/componentcontainer",
    "lancaster-vision/lib/authenticator",
    "bbcrd/widgets/input-text",
    "antie/widgets/image",
  ],
  function(Component, Button, Keyboard, Label, List, Container, Authenticator, InputText, Image) {
    return Component.extend({
      init: function() {
        var self = this;
        var app = this.getCurrentApplication();
        var device = app.getDevice();

        this._super("login");

        this._outer_list = new List("outer_login_list");

        var instructions = new Container('instructions');
        instructions.appendChildWidget(new Label("Vision is Lancaster University's IPTV service, providing access to over 25,000 recorded programmes from the last 30 days."));

        var pin_screenshot = new Image('pin_screenshot', "/img/pin_code.png");
        instructions.appendChildWidget(pin_screenshot);

        instructions.appendChildWidget(new Label("screenshot_caption", "Visit Vision on your computer to get your one-time login code."));

        this._outer_list.appendChildWidget(instructions);

        this._form = new Container('signin-form');
        this._outer_list.appendChildWidget(this._form);

        var list = new List();
        var input = new InputText("******", { placeholder: true });

        var button = new Button('ok')
        button.appendChildWidget(new Label("Sign In"));
        button.addClass('okButton');
        button.setDisabled(true);

        input.addEventListener('empty', function() {
          button.setDisabled(true);
        });
        input.addEventListener('not-empty', function() {
          button.setDisabled(false);
        });

        button.addEventListener('select', function(e) {
          button.setDisabled(true);

          Authenticator(device).verify(keyboard.getText(), function() {
            app.showComponent('maincontainer', 'lancaster-vision/appui/controller');
          }, function() {
            keyboard.setActiveChildKey('1');
            input.setText('');
            keyboard.setText('');
          });
        });

        var keyboard = new Keyboard('auth_key', 12, 1, '1234567890_-');
        keyboard.setActiveChildKey('1');
        keyboard.addEventListener('textchange', function(e) {
          input.setText(e.text);
        });

        list.appendChildWidget(input);
        list.appendChildWidget(keyboard);
        list.appendChildWidget(button);
        this._form.appendChildWidget(list);

        this.addEventListener("beforerender", function(e) {
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
      _onBeforeRender: function() {
        this.appendChildWidget(this._outer_list);
      }
    });
  }
);
