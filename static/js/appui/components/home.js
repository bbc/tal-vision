require.def('lancaster-vision/appui/components/home',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/label",
    "antie/widgets/componentcontainer",
    "antie/widgets/verticallist",
    "antie/widgets/horizontallist"
  ],
  function(Component, Button, Label, ComponentContainer, VerticalList, HorizontalList) {

    var createLabelledButton = function (label, id){
      var button = new Button(id);
      var label = new Label(label);

      button.appendChildWidget(label);

      return button;
    };

    return Component.extend({
      init: function () {
        var self = this;
        var widgets = [];

        this._super("home");

        // Vertical Skeleton Navigation
        var skeleton = new VerticalList('content-to-navigation');

        // Horizontal Menu
        var menu = new HorizontalList();
        menu.appendChildWidget(createLabelledButton('Home'));
        menu.appendChildWidget(createLabelledButton('Browse'));
        menu.appendChildWidget(createLabelledButton('History'));
        menu.appendChildWidget(createLabelledButton('Search'));
        menu.appendChildWidget(createLabelledButton('Trending'));

        // Ordering Elements
        skeleton.appendChildWidget(new ComponentContainer('content-container'));
        skeleton.appendChildWidget(menu);

        //
        widgets.push(skeleton);

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