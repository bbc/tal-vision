require.def('lancaster-vision/appui/components/login',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/keyboard",
    "antie/widgets/label",
    "antie/widgets/verticallist",
    "antie/widgets/componentcontainer",
    "lancaster-vision/lib/authenticator",
    "bbcrd/widgets/input-text"

  ],
  function(Component, Button, Keyboard, Label, List, Container, Authenticator, InputText) {

    return Component.extend({
      init: function () {
        var self = this;
        var app = this.getCurrentApplication();
        var device = app.getDevice();

        this._super("login");

        this._outer_list = new List("outer_login_list");

        var instructions = new Container('instructions');
        instructions.appendChildWidget(new Label("This is a trial project where you can access Vision via your PlayStation or Smart TV<br><br>Visit Vision on your computer and get your login code, you should only have to do this once."));
        this._outer_list.appendChildWidget(instructions);

        this._form = new Container('signin-form');
        this._outer_list.appendChildWidget(this._form);

        this._form.appendChildWidget(new Label("Please enter your login code:"));

        var list = new List();
        var input = new InputText("********", { placeholder: true });

        //input.addClass('fakeInput');
        //input.addClass('placeholder')

        var button = new Button('ok')
        button.appendChildWidget(new Label("Sign In"));
        button.addClass('okButton');
        button.setDisabled(true);

        input.addEventListener('empty', function(){
          button.setDisabled(true);
        });
        input.addEventListener('not-empty', function(){
          button.setDisabled(false);
        });

        button.addEventListener('select', function(e){
          button.setDisabled(true);

          Authenticator(device).verify(keyboard.getText(), function(user){
            app.showComponent('maincontainer', 'lancaster-vision/appui/controller');
          }, function(){
            keyboard.setActiveChildKey('1');
            input.setText('');
            keyboard.setText('');
          })
        });

        var keyboard = new Keyboard('auth_key', 12, 1, '1234567890_-');
        keyboard.setActiveChildKey('1');
        keyboard.addEventListener('textchange', function(e){
          input.setText(e.text);
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
        this.appendChildWidget(this._outer_list);
      }
    });
  }
);