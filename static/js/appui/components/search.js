require.def('lancaster-vision/appui/components/search',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/keyboard",
    "antie/widgets/label",
    "antie/widgets/verticallist",
    "antie/widgets/container",
    "bbcrd/widgets/input-text",
    "lancaster-vision/lib/dataevent"
  ],
  function(Component, Button, Keyboard, Label, List, Container, InputText, Event) {

    return Component.extend({
      init: function () {
        var self = this;
        this._app = this.getCurrentApplication();

        this._super("search");

        this._outer_list = new List();

        var search_label = new Label("Search");
        search_label.addClass("heading");
        this._outer_list.appendChildWidget(search_label);

        this._form = new Container('search-form');

        var list = new List();

        this._input = new InputText('e.g. Top Gear, Doctor Who, The Big Bang Theory', { placeholder: true });

        this._button = new Button('ok')
        this._button.appendChildWidget(new Label("Search"));
        this._button.addClass('okButton');
        this._button.setDisabled(true);

        var keyboard = new Keyboard('search_', 10, 4, '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ__- ');
        keyboard.setActiveChildKey('1');

        list.appendChildWidget(this._input);
        list.appendChildWidget(keyboard);
        list.appendChildWidget(this._button);
        this._form.appendChildWidget(list);

        this._outer_list.appendChildWidget(this._form);

        // Events
        keyboard.addEventListener('textchange', function(e){
          self._input.setText(e.text);
        });

        this._input.addEventListener('empty', function(){
          self._button.setDisabled(true);
        });
        this._input.addEventListener('not-empty', function(){
          self._button.setDisabled(false);
        });

        // Emit search event when the search button is selected
        this._button.addEventListener('select', function() {
          self.bubbleEvent(new Event('search-results', self._input.getText()));
        });

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
      _onBeforeRender: function () {
        this.appendChildWidget(this._outer_list);
      }
    });
  }
);