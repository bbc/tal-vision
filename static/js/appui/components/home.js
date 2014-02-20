require.def('lancaster-vision/appui/components/home',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/label"
  ],
  function(Component, Button, Label) {

    return Component.extend({
      init: function () {
        var self = this;
        var widgets = [];

        this._super("home");

        // Hello World
        var button = new Button();
        button.appendChildWidget(new Label("Trending Programmes"));

        button.addEventListener("select", function(evt) {
          self.getCurrentApplication().pushComponent("maincontainer", "lancaster-vision/appui/components/trending");
        });

        widgets.push(button);

        this.addEventListener("beforerender", function (e) {
          self._onBeforeRender(e, widgets);
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
      _onBeforeRender: function (e, widgets) {
        var self = this;

        widgets.forEach(function(widget){
          self.appendChildWidget(widget);
        });
      }
    });
  }
);