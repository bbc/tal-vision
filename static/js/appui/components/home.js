require.def('lancaster-vision/appui/components/home',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/label",
    "antie/widgets/verticallist",
    "lancaster-vision/appui/components/recommendations",
    "lancaster-vision/appui/components/trending",
    "antie/widgets/componentcontainer"
  ],
  function(Component, Button, Label, VerticalList, Recommendations, Trending, ComponentContainer) {

    return Component.extend({
      init: function () {
        var self = this;
        this._super("home");

        this._list = new VerticalList();
        
        this._recommendations_container = new ComponentContainer('recommendations-container');
        this._recommendations_container.pushComponent('lancaster-vision/appui/components/recommendations');

        this._trending_container = new ComponentContainer('trending-container');
        this._trending_container.pushComponent('lancaster-vision/appui/components/trending');

        var recommendations_label = new Label("Recommendations");
        recommendations_label.addClass("heading");
        recommendations_label.addClass("first");

        var trending_label = new Label("Trending");
        trending_label.addClass("heading");

        this._list.appendChildWidget(recommendations_label);
        this._list.appendChildWidget(this._recommendations_container);
        
        this._list.appendChildWidget(trending_label);
        this._list.appendChildWidget(this._trending_container);

        this.addEventListener("beforerender", function (e) {
          self._onBeforeRender(e);
        });

      },

      // Appending widgets on beforerender ensures they're still displayed
      // if the component is hidden and subsequently reinstated.
      _onBeforeRender: function (e) {
        var self = this;
        self.appendChildWidget(this._list);
      }
    });
  }
);