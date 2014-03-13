require.def('lancaster-vision/appui/components/searchresults',
  [
    "antie/application",
    "antie/widgets/component",
    "antie/datasource",
    "antie/widgets/carousel",
    "antie/widgets/label",
    "lancaster-vision/appui/formatters/searchformatter",
    "lancaster-vision/appui/datasources/searchfeed",
    "antie/widgets/carousel/binder",
    "antie/widgets/carousel/keyhandlers/alignfirsthandler",
    "lancaster-vision/lib/dataevent",
    "antie/widgets/verticallist",
    "antie/widgets/horizontalprogress",
    "antie/widgets/carousel/navigators/wrappingnavigator",
    "antie/widgets/button"
  ],
  function (Application, Component, DataSource, Carousel, Label, SearchFormatter, SearchFeed, Binder, AlignFirstHandler, Event, VerticalList, HorizontalProgress, WrappingNavigator, Button) {

    // All components extend Component
    return Component.extend({
      init: function () {
        var self = this;
        this._app = this.getCurrentApplication();;
        this._super("search");

        this._list = new VerticalList("extended_carousel_view");

        var search_label = new Label("Search Results");
        search_label.addClass("heading");
        this._list.appendChildWidget(search_label);

        // Progress bar
        this._progress = new HorizontalProgress("search_progress", true);
        this._list.appendChildWidget(this._progress);

        // Create a new carousel and append it to the component
        this._carousel = new Carousel("search_carousel", Carousel.orientations.HORIZONTAL);
        this._carousel.setNavigator(WrappingNavigator);
        this._list.appendChildWidget(this._carousel);

        this._back_button = new Button("back_button");
        this._back_button.appendChildWidget(new Label("No search results found<br><br>Return to search keyboards"));
        this._back_button.addEventListener('select', function(e) {
          self.parentWidget.back();
        });

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

        // Attach keyhandlers to support up down keyboard navigation
        var keyhandler = new AlignFirstHandler();
        keyhandler.attach(this._carousel);

        this.addEventListener("beforerender", function (ev) {
          self._onBeforeRender(ev);
        });
      },

      load_data: function(search_term) {
        var searchFormatter = new SearchFormatter();
        this._dataSource = new DataSource(this, new SearchFeed(search_term, this), "loadData");
        var binder = new Binder(searchFormatter, this._dataSource);
        this._carousel.removeChildWidgets();
        binder.appendAllTo(this._carousel);
      },

      // Set correct focus once data is loaded
      _onDataBound: function (evt) {
        var children = this._carousel.getChildWidgets();

        if(children.length == 0) {
          this._list.appendChildWidget(this._back_button);
          this._back_button.focus();
        } else {
          this._carousel.alignToIndex(0);
          children[0].focus();

          // Emit vod.show event when a programme is selected
          this._carousel.getChildWidgets().forEach(function(prog_widget) {
            var buttons_list = prog_widget.getChildWidget("prog_details").getChildWidget("buttons_list");

            var play = buttons_list.getChildWidget("play_button");

            play.addEventListener('select', function(e) {
              var programme = prog_widget.getDataItem();
              programme.tal_resume_from = null;
              prog_widget.bubbleEvent(new Event('vod.show', programme));
            });
          });
        }

      },

      // Appending widgets on beforerender ensures they're still displayed
      // if the component is hidden and subsequently reinstated.
      _onBeforeRender: function (ev) {
        var search_term = ev.args;
        console.log("Received search term %s", search_term);

        // Bind data to the carousel
        this.load_data(search_term);

        this.appendChildWidget(this._list);
      }
    });
  }
);