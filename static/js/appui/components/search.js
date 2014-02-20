require.def('lancaster-vision/appui/components/search',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/keyboard",
    "antie/widgets/label",
    "antie/widgets/verticallist",
    "antie/widgets/container"

  ],
  function(Component, Button, Keyboard, Label, List, Container) {

    return Component.extend({
      init: function () {
        var self = this;

        this._super("login");

        this._form = new Container('search-form');

        var list = new List();
        var input = new Label();
        input.addClass('fakeInput');
        input.addClass('placeholder')

        var button = new Button('ok')
        button.appendChildWidget(new Label("Search"));
        button.addClass('okButton');
        button.setDisabled(true);

        var keyboard = new Keyboard('search_', 13, 4, '1234567890_- QWERTYUIOP___ASDFGHJKL____ZXCVBNM______');
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