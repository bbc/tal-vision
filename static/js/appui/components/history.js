require.def('lancaster-vision/appui/components/history',
  [
    "antie/application",
    "antie/widgets/component",
    "antie/datasource",
    "antie/widgets/carousel",
    "antie/widgets/label",
    "lancaster-vision/appui/formatters/historyformatter",
    "lancaster-vision/appui/datasources/historyfeed",
    "antie/widgets/carousel/binder",
    "antie/widgets/carousel/keyhandlers/alignfirsthandler",
    "lancaster-vision/lib/dataevent",
    "antie/widgets/carousel/navigators/wrappingnavigator",
    "antie/widgets/carousel/strips/wrappingstrip"
  ],
  function (Application, Component, DataSource, Carousel, Label, HistoryFormatter, HistoryFeed, Binder, AlignFirstHandler, Event, WrappingNavigator, WrappingStrip) {

    // All components extend Component
    return Component.extend({
      init: function () {
        var self = this;
        this._super("history");

        // Get the user's history
        var historyFeed = new HistoryFeed(this);
        this._dataSource = new DataSource(this, historyFeed, "loadData");

        // Create a new carousel and append it to the component
        this._carousel = new Carousel("history_carousel", Carousel.orientations.VERTICAL);

        // Setup event listeners to set focus on first widget after data binding
        this._carousel.addEventListener("databound", function (evt) {
          self._onDataBound(evt);
        });

        // Bind data to the carousel
        var historyFormatter = new HistoryFormatter();
        var binder = new Binder(historyFormatter, this._dataSource);
        binder.appendAllTo(this._carousel);

        // Attach keyhandlers to support up down keyboard navigation
        var keyhandler = new AlignFirstHandler();
        keyhandler.attach(this._carousel);

        this.addEventListener("beforerender", function (ev) {
          self._onBeforeRender(ev);
        });
      },

      // Set correct focus once data is loaded
      _onDataBound: function (evt) {
        var children = this._carousel.getChildWidgets();
        this._carousel.alignToIndex(0);
        children[0].focus();

        // Emit vod.show event when a programme is selected
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