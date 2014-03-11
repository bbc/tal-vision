require.def('lancaster-vision/appui/components/search',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/keyboard",
    "antie/widgets/label",
    "antie/widgets/verticallist",
    "antie/widgets/container",
    "bbcrd/widgets/input-text"
  ],
  function(Component, Button, Keyboard, Label, List, Container, InputText) {

    return Component.extend({
      init: function () {
        var self = this;

        this._super("login");

        this._outer_list = new List();

        var search_label = new Label("Search");
        search_label.addClass("carousel_heading");
        this._outer_list.appendChildWidget(search_label);

        this._form = new Container('search-form');

        var list = new List();

        var input = new InputText('e.g. Top Gear, Doctor Who, The Big Bang Theory', { placeholder: true });

        var button = new Button('ok')
        button.appendChildWidget(new Label("Search"));
        button.addClass('okButton');
        button.setDisabled(true);

        var keyboard = new Keyboard('search_', 13, 4, '1234567890_- _QWERTYUIOP____ASDFGHJKL_____ZXCVBNM___');
        keyboard.setActiveChildKey('1');

        list.appendChildWidget(input);
        list.appendChildWidget(keyboard);
        list.appendChildWidget(button);
        this._form.appendChildWidget(list);

        this._outer_list.appendChildWidget(this._form);

        // Events
        keyboard.addEventListener('textchange', function(e){
          input.setText(e.text);
        });

        input.addEventListener('empty', function(){
          button.setDisabled(true);
        });
        input.addEventListener('not-empty', function(){
          button.setDisabled(false);
        });

        button.addEventListener('select', function(){
          button.setDisabled(true);
          button.getChildWidgets('label').setText('Searching…');

          // Perform the ajaz search and populate
          /*

           */
        });

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