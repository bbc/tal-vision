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
    "antie/widgets/verticallist",
    "antie/widgets/horizontalprogress",
    "antie/widgets/carousel/navigators/wrappingnavigator"
  ],
  function (Application, Component, DataSource, Carousel, Label, HistoryFormatter, HistoryFeed, Binder, AlignFirstHandler, Event, VerticalList, HorizontalProgress, WrappingNavigator) {

    // All components extend Component
    return Component.extend({
      init: function () {
        var self = this;
        this._super("history");

        this._list = new VerticalList();

        var history_label = new Label("History");
        history_label.addClass("carousel_heading");
        this._list.appendChildWidget(history_label);

        // Progress bar
        this._progress = new HorizontalProgress("history_progress", true);
        this._list.appendChildWidget(this._progress);

        // Create a new carousel and append it to the component
        this._carousel = new Carousel("history_carousel", Carousel.orientations.HORIZONTAL);
        this._carousel.setNavigator(WrappingNavigator);
        this._list.appendChildWidget(this._carousel);

        this._carousel.addEventListener("afteralign", function(ev) {
          var index = ev.alignedIndex;
          var total = self._carousel.items().length;
          
          self._progress.setValue(index/(total - 1));
          self._progress.setText((index + 1) + " of " + total);
        });

        // Setup event listeners to set focus on first widget after data binding
        this._carousel.addEventListener("databound", function (evt) {
          self._onDataBound(evt);
        });

        // Bind data to the carousel
        this.load_data();

        // Attach keyhandlers to support up down keyboard navigation
        var keyhandler = new AlignFirstHandler();
        keyhandler.attach(this._carousel);

        this.addEventListener("beforerender", function (ev) {
          self._onBeforeRender(ev);
        });
      },

      load_data: function() {
        var historyFormatter = new HistoryFormatter();
        this._dataSource = new DataSource(this, new HistoryFeed(this), "loadData");
        var binder = new Binder(historyFormatter, this._dataSource);
        this._carousel.removeChildWidgets();
        binder.appendAllTo(this._carousel);
      },

      // Set correct focus once data is loaded
      _onDataBound: function (evt) {
        var children = this._carousel.getChildWidgets();
        this._carousel.alignToIndex(0);
        children[0].focus();

        // Emit vod.show event when a programme is selected
        this._carousel.getChildWidgets().forEach(function(prog_widget) {
          var buttons_list = prog_widget.getChildWidget("prog_details").getChildWidget("buttons_list");

          var play = buttons_list.getChildWidget("play_button");
          var resume = buttons_list.getChildWidget("resume_button");

          play.addEventListener('select', function(e) {
            var programme = prog_widget.getDataItem();
            programme.tal_resume_from = null;
            prog_widget.bubbleEvent(new Event('vod.show', programme));
          });

          resume.addEventListener('select', function(e) {
            var programme = prog_widget.getDataItem();
            programme.tal_resume_from = programme.last_known_position;
            prog_widget.bubbleEvent(new Event('vod.show', programme));
          });
        });
      },

      // Appending widgets on beforerender ensures they're still displayed
      // if the component is hidden and subsequently reinstated.
      _onBeforeRender: function () {
        this.appendChildWidget(this._list);
      }
    });
  }
);