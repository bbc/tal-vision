require.def('lancaster-vision/appui/components/trending',
  [
    "antie/widgets/component",
    "antie/datasource",
    "antie/widgets/carousel",
    "antie/widgets/label",
    "lancaster-vision/appui/formatters/simpleformatter",
    "lancaster-vision/appui/datasources/trendingfeed",
    "antie/widgets/carousel/binder",
    "antie/widgets/carousel/keyhandlers/alignfirsthandler",
    "antie/widgets/button",
    "antie/widgets/label"
  ],
  function (Component, DataSource, Carousel, Label, SimpleFormatter, TrendingFeed, Binder, AlignFirstHandler, Button, Label) {

    // All components extend Component
    return Component.extend({
      init: function () {
        var self = this;
        this._super("trending_carousel_component");

        // Create a simple formatter and data feed that will be used to populate the carousel
        var trendingFormatter = new SimpleFormatter();
        var trendingFeed = new TrendingFeed(this);
        this._dataSource = new DataSource(this, trendingFeed, "loadData");

        // Create a new carousel and append it to the component
        this._carousel = new Carousel("trending_carousel", Carousel.orientations.HORIZONTAL);
        this.appendChildWidget(this._carousel);
        
        // Setup event listeners to set focus on first widget after data binding
        this._carousel.addEventListener("databound", function (evt) {
          self._onDataBound(evt);
        });

        // Bind data to the carousel
        var binder = new Binder(trendingFormatter, this._dataSource);
        binder.appendAllTo(this._carousel);

        // Attach keyhandlers to support left right keyboard navigation
        var keyhandler = new AlignFirstHandler();
        keyhandler.attach(this._carousel);

        // Return to menu button
        label = new Label("Return to Menu");
        this._return_button = new Button();
        this._return_button.appendChildWidget(label);

        this.addEventListener("beforerender", function (ev) {
          self._onBeforeRender(ev);
        });
      },

      _onDataBound: function (evt) {
        var children = this._carousel.getChildWidgets();
        children[0].focus();
      },

      // Appending widgets on beforerender ensures they're still displayed
      // if the component is hidden and subsequently reinstated.
      _onBeforeRender: function () {
        this.appendChildWidget(this._return_button);
      }
    });
  }
);