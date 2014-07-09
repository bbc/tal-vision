require.def('lancaster-vision/appui/components/recommendations',
  [
    "antie/application",
    "antie/widgets/component",
    "antie/datasource",
    "antie/widgets/carousel",
    "antie/widgets/label",
    "lancaster-vision/appui/formatters/basiccarouselformatter",
    "lancaster-vision/appui/datasources/recommendationsfeed",
    "antie/widgets/carousel/binder",
    "antie/widgets/carousel/keyhandlers/alignfirsthandler",
    "lancaster-vision/lib/dataevent",
    "antie/widgets/carousel/navigators/wrappingnavigator",
    "antie/widgets/carousel/strips/wrappingstrip"
  ],
  function(Application, Component, DataSource, Carousel, Label, CarouselFormatter, RecommendationsFeed, Binder, AlignFirstHandler, Event, WrappingNavigator, WrappingStrip) {

    // All components extend Component
    return Component.extend({
      init: function() {
        var self = this;
        this._super("recommendations_carousel_component");

        // Create a simple formatter and data feed that will be used to populate the carousel
        var formatter = new CarouselFormatter();
        var trendingFeed = new RecommendationsFeed(this);
        this._dataSource = new DataSource(this, trendingFeed, "loadData");

        // Create a new carousel and append it to the component
        this._carousel = new Carousel("recommendations_carousel", Carousel.orientations.HORIZONTAL);

        // Use both the wrapping navigator and the wrapping strip
        this._carousel.setNavigator(WrappingNavigator);
        this._carousel.setWidgetStrip(WrappingStrip);

        // Set the align point to be center of viewport, and center of each widget (programme item)
        this._carousel.setNormalisedAlignPoint(0.5);
        this._carousel.setNormalisedWidgetAlignPoint(0.5);

        // Setup event listeners to set focus on first widget after data binding
        this._carousel.addEventListener("databound", function(evt) {
          self._onDataBound(evt);
        });

        // Bind data to the carousel
        var binder = new Binder(formatter, this._dataSource);
        binder.appendAllTo(this._carousel);

        // Attach keyhandlers to support left right keyboard navigation
        var keyhandler = new AlignFirstHandler();
        keyhandler.attach(this._carousel);

        this.addEventListener("beforerender", function(ev) {
          self._onBeforeRender(ev);
        });
      },

      // Set correct focus once data is loaded
      _onDataBound: function(evt) {
        var children = this._carousel.getChildWidgets();
        this._carousel.alignToIndex(0);
        children[0].focus();

        // Emit vod.show event when a programme is selected
        this._carousel.getChildWidgets().forEach(function(widget) {
          widget.addEventListener('select', function(e) {
            try {
              console.log(e.target.getDataItem());
              widget.bubbleEvent(new Event('vod.show', e.target.getDataItem()));
            }
            catch (e) {
              console.log(e.message);
            }
          });
        });
      },

      // Appending widgets on beforerender ensures they're still displayed
      // if the component is hidden and subsequently reinstated.
      _onBeforeRender: function() {
        this.appendChildWidget(this._carousel);
      }
    });
  }
);
