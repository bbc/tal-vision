require.def('lancaster-vision/appui/components/trending',
  [
    "antie/application",
    "antie/widgets/component",
    "antie/datasource",
    "antie/widgets/carousel",
    "antie/widgets/label",
    "lancaster-vision/appui/formatters/trendingformatter",
    "lancaster-vision/appui/datasources/trendingfeed",
    "antie/widgets/carousel/binder",
    "antie/widgets/carousel/keyhandlers/alignfirsthandler",
    "lancaster-vision/lib/dataevent"
  ],
  function (Application, Component, DataSource, Carousel, Label, TrendingFormatter, TrendingFeed, Binder, AlignFirstHandler, Event) {

    // All components extend Component
    return Component.extend({
      init: function () {
        var self = this;
        this._super("trending_carousel_component");

        // Create a simple formatter and data feed that will be used to populate the carousel
        var trendingFormatter = new TrendingFormatter();
        var trendingFeed = new TrendingFeed(this);
        this._dataSource = new DataSource(this, trendingFeed, "loadData");

        // Create a new carousel and append it to the component
        this._carousel = new Carousel("trending_carousel", Carousel.orientations.HORIZONTAL);

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

        this.addEventListener("beforerender", function (ev) {
          self._onBeforeRender(ev);
        });
      },

      _onDataBound: function (evt) {
        var children = this._carousel.getChildWidgets();
        children[0].focus();

        // Launch the components
        this._carousel.getChildWidgets().forEach(function(widget) {
          widget.addEventListener('select', function(e) {
            try {
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
      _onBeforeRender: function () {
        this.appendChildWidget(this._carousel);
      }
    });
  }
);