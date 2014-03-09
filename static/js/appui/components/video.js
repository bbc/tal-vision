require.def('lancaster-vision/appui/components/video',
  [
    "antie/widgets/componentcontainer",
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/label",
    "antie/widgets/image",
    "antie/mediasource",
    "antie/widgets/horizontallist",
    "antie/widgets/verticallist",
    "antie/widgets/scrubbar"
  ],
  function(Container, Component, Button, Label, Image, MediaSource, HorizontalList, VerticalList, ScrubBar) {

    return Component.extend({
      init: function (test) {
        var self, label, button, image, playLabel, pauseLabel;
        self = this;

        // It is important to call the constructor of the superclass
        this._super("home");

        this._app = this.getCurrentApplication();;
        this._device = this._app.getDevice();
        this._videoPlayer = this._device.createPlayer("player", "video");

        // GUI vertical list
        this._gui_list = new VerticalList('gui');

        // Scrub bar
        this._scrub = new ScrubBar('scrub', 0, 0.01, 0.05, 1);        
        this._scrub.addEventListener("sliderchangeend", function () {
            var time = self._videoPlayer.getDuration() * self._scrub.getValue();
            self._videoPlayer.setCurrentTime(time)
            self._videoPlayer.play();
        });
        this._scrub.addEventListener("sliderchange", function () {
            self.showControls();
            self.setControlsHideTimeout();
        });

        this._gui_list.appendChildWidget(this._scrub);

        // Buttons below scrub bar: Play/Pause, Back
        this._controls = new HorizontalList();
        this._gui_list.appendChildWidget(this._controls);

        // Pause/Play toggling button
        this._playPause = new Button("pausePlay");
        this._playPauseLabel = new Label("Pause");
        this._playPause.appendChildWidget(this._playPauseLabel);

        this._playPauseState = "pause";

        this._playPause.addEventListener('select', function(e) {
          if(self._playPauseState == "pause") {
            self._videoPlayer.pause();  
            self._playPauseState = "play";   
            self._playPauseLabel.setText("Play");       
          } else if(self._playPauseState == "play") {
            self._videoPlayer.play();  
            self._playPauseState = "pause";   
            self._playPauseLabel.setText("Pause");       
          }
        });

        this._controls.appendChildWidget(this._playPause);

        // Back button
        var back = new Button('back');
        back.appendChildWidget(new Label('Back'));
        back.addEventListener('select', function(evt) {
            self.parentWidget.back();
        });

        this._controls.appendChildWidget(back);

        this.addEventListener("beforerender", function (ev) {
          self._onBeforeRender(ev);
        });

        this.addEventListener("beforehide", function(ev) {
          self.clearControlsHideTimeout();
          self.showHeader();
          self.showControls();
        });

        this.addEventListener("focus", function(ev) {
          self.showControls();
          self.setControlsHideTimeout();
        });

        self._app.getRootWidget().getChildWidget("maincontainer").getChildWidget("maincontroller").getMenu().addEventListener("focus", function(ev) {
          self.showControls();
          self.setControlsHideTimeout();
        });

        this._videoPlayer.addEventListener("progress", function () {
          var player = self._videoPlayer;

          var buffer = player.getBuffered();
          var current_pos = player.getCurrentTime();

          self._scrub.setBufferedRange({
            start: 0,
            end: buffer.end(buffer.length - 1) / player.getDuration()
          });
        });

        // calls Application.ready() the first time the component is shown
        // the callback removes itself once it's fired to avoid multiple calls.
        this.addEventListener("aftershow", function appReady() {
          self.getCurrentApplication().ready();
          self.removeEventListener('aftershow', appReady);
        });
      },

      hideHeader: function() {
        $("#header").addClass("offscreen");
        $("#app").addClass("playback");
      },

      showHeader: function() {
        $("#header").removeClass("offscreen");
        $("#app").removeClass("playback");
      },

      hideControls: function() {
        $("#gui").addClass("offscreen");
        $("#app-navigation").addClass("offscreen");
      },

      showControls: function() {
        $("#gui").removeClass("offscreen");
        $("#app-navigation").removeClass("offscreen");
      },

      setControlsHideTimeout: function() {
        var self = this;

        self.clearControlsHideTimeout();

        self._timeout = window.setTimeout(function () {
          self.hideControls();
        }, 4000);
      },

      clearControlsHideTimeout: function() {
        var self = this;
        clearTimeout(self._timeout);
      },

      // Appending widgets on beforerender ensures they're still displayed
      // if the component is hidden and subsequently reinstated.
      _onBeforeRender: function (e) {
        var self = this;

        this.hideHeader();

        this.appendChildWidget(this._videoPlayer);
        this.appendChildWidget(this._gui_list);
        this.queueVideo(e.args.programme_id);

        self.setControlsHideTimeout();
      },

      queueVideo: function(id) {
        this._videoPlayer.setSources([
          new MediaSource("http://148.88.32.70/" + id + ".mp4", "video/mp4")
        ]);
        this._videoPlayer.load();
        this._videoPlayer.play();
      }
    });
  }
);