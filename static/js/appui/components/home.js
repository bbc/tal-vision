require.def('lancaster-vision/appui/components/home',
  [
    "antie/widgets/component",
    "antie/widgets/label"
  ],
  function(Component, Label) {

    return Component.extend({
      init: function () {
        var self = this;
        var widgets = [];

        this._super("home");

        widgets.push(new Label("Homescreen"));

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