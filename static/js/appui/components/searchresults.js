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
    "antie/widgets/button",
    "lancaster-vision/lib/user"
  ],
  function(Application, Component, DataSource, Carousel, Label, SearchFormatter, SearchFeed, Binder, AlignFirstHandler, Event, VerticalList, HorizontalProgress, WrappingNavigator, Button, User) {

    // All components extend Component
    return Component.extend({
      init: function() {
        var self = this;
        this._super("search_results");

        this._list = new VerticalList("extended_carousel_view");

        var search_label = new Label("Search Results");
        search_label.addClass("heading");
        this._list.appendChildWidget(search_label);

        // Progress bar
        this._progress = new HorizontalProgress("search_progress", true);

        // Create a new carousel and append it to the component
        this._carousel = new Carousel("search_carousel", Carousel.orientations.HORIZONTAL);
        this._carousel.setNavigator(WrappingNavigator);

        this._back_button = new Button("back_button");
        this._back_button.appendChildWidget(new Label("No search results found<br><br>Return to search keyboard"));

        this._back_button.addEventListener('select', function(e) {
          self.bubbleEvent(new Event('search'));
        });

        this._carousel.addEventListener("afteralign", function(ev) {
          var index = ev.alignedIndex;
          var total = self._carousel.items().length;

          self._progress.setValue(index / (total - 1));
          self._progress.setText((index + 1) + " of " + total);
        });

        // Attach keyhandlers to support up down keyboard navigation
        var keyhandler = new AlignFirstHandler();
        keyhandler.attach(this._carousel);

        // Setup event listeners to set focus on first widget after data binding
        this._carousel.addEventListener("databound", function(ev) {
          self._onDataBound(ev);
        });

        this.addEventListener("beforerender", function(ev) {
          self._onBeforeRender(ev);
        });

        // calls Application.ready() the first time the component is shown
        // the callback removes itself once it's fired to avoid multiple calls.
        this.addEventListener("aftershow", function(ev) {
          self.getCurrentApplication().ready();
          self.removeEventListener('aftershow', appReady);
        });
      },

      load_data: function(search_term) {
        var searchFormatter = new SearchFormatter();
        this._dataSource = new DataSource(this, new SearchFeed(search_term, this), "loadData");
        var binder = new Binder(searchFormatter, this._dataSource);
        this._carousel.removeChildWidgets();
        binder.appendAllTo(this._carousel);
      },

      _onDataBound: function(ev) {
        var children = this._carousel.getChildWidgets();

        if(children.length == 0) {
          this._list.removeChildWidget(this._progress);
          this._list.removeChildWidget(this._carousel);

          this._list.appendChildWidget(this._back_button);
          this._back_button.focus();
        } else {
          this._list.removeChildWidget(this._back_button);

          this._list.appendChildWidget(this._progress);
          this._list.appendChildWidget(this._carousel);
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

        this._list.focus();

      },

      // Appending widgets on beforerender ensures they're still displayed
      // if the component is hidden and subsequently reinstated.
      _onBeforeRender: function(ev) {
        var search_term = ev.args;
        console.log("Received search term %s", search_term);

        // Bind data to the carousel
        try {
          this.load_data(search_term);
          this._onDataBound();
        } catch (err) {
          console.log(err);
        }

        this.appendChildWidget(this._list);

        // Log the search request
        $.ajax({
          url: "http://10.42.32.75:9110/capture/log",
          type: "get",
          data: {
            api: "53e659a15aff4a402de2d51b98703fa1ade5b8c5",
            log_type: "TAL_SEARCH_REQUEST",
            user_id: User.getUserId(),
            attributes: JSON.stringify({ search_term: search_term })
          }
        });
      }

    });
  }
);
