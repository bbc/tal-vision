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
        var app, self, label, button, image, playLabel, pauseLabel;
        self = this;
        app = this.getCurrentApplication();
        this._device = app.getDevice();

        // It is important to call the constructor of the superclass
        this._super("home");

        this._videoPlayer = this._device.createPlayer("player", "video");

        // Scrub bar
        this._scrub = new ScrubBar('scrub', 0, 0.01, 0.1, 1);
        this._outer_list = new VerticalList('gui');
        this._outer_list.appendChildWidget(this._scrub);
        
        this._scrub.addEventListener("sliderchangeend", function () {
            var time = self._videoPlayer.getDuration() * self._scrub.getValue();
            self._videoPlayer.setCurrentTime(time)
            self._videoPlayer.play();
        });

        this._controls = new HorizontalList();
        this._outer_list.appendChildWidget(this._controls);

        // Pause/play button
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

        var back = new Button('back');
        back.appendChildWidget(new Label('Back'));
        back.addEventListener('select', function(evt) {
            self.parentWidget.back();
        });

        this._controls.appendChildWidget(back);

        this.addEventListener("beforerender", function (ev) {
          self._onBeforeRender(ev);
        });

        // calls Application.ready() the first time the component is shown
        // the callback removes itself once it's fired to avoid multiple calls.
        this.addEventListener("aftershow", function appReady() {
          self.getCurrentApplication().ready();
          self.removeEventListener('aftershow', appReady);
        });
      },

      // Appending widgets on beforerender ensures they're still displayed
      // if the component is hidden and subsequently reinstated.
      _onBeforeRender: function (e) {
        this.queueVideo(e.args.programme_id);
        this.appendChildWidget(this._videoPlayer);
        this.appendChildWidget(this._outer_list);
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