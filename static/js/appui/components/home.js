require.def('lancaster-vision/appui/components/home',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/label"
  ],
  function(Component, Button, Label) {

    return Component.extend({
      init: function () {
        var self, label, button;

        self = this;
        // It is important to call the constructor of the superclass
        this._super("home");

        // Hello World
        label = new Label("Trending Programmes");
        this._trending_button = new Button();
        this._trending_button.appendChildWidget(label);

        this._trending_button.addEventListener("select", function(evt) {
          self.getCurrentApplication().pushComponent("maincontainer", "lancaster-vision/appui/components/trending");
        });

        this.addEventListener("beforerender", function (ev) {
          self._onBeforeRender(ev);
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
        this.appendChildWidget(this._trending_button);
      }
    });
  }
);