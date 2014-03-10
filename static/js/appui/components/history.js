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
    "antie/widgets/verticallist"
  ],
  function (Application, Component, DataSource, Carousel, Label, HistoryFormatter, HistoryFeed, Binder, AlignFirstHandler, Event, VerticalList) {

    // All components extend Component
    return Component.extend({
      init: function () {
        var self = this;
        this._super("history");

        // Get the user's history
        var historyFeed = new HistoryFeed(this);
        this._dataSource = new DataSource(this, historyFeed, "loadData");

        this._list = new VerticalList();

        var history_label = new Label("History");
        history_label.addClass("carousel_heading");
        this._list.appendChildWidget(history_label);

        // Create a new carousel and append it to the component
        this._carousel = new Carousel("history_carousel", Carousel.orientations.HORIZONTAL);
        this._list.appendChildWidget(this._carousel);

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
        this._carousel.getChildWidgets().forEach(function(prog_widget) {
          var buttons_list = prog_widget.getChildWidget("prog_details").getChildWidget("buttons_list");

          var play = buttons_list.getChildWidget("play_button");
          var resume = buttons_list.getChildWidget("resume_button");

          play.addEventListener('select', function(e) {
            prog_widget.bubbleEvent(new Event('vod.show', prog_widget.getDataItem()));
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