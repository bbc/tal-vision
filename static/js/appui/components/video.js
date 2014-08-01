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
    "antie/widgets/scrubbar",
    "lancaster-vision/lib/user",
    'lancaster-vision/lib/websocket'
  ],
  function(Container, Component, Button, Label, Image, MediaSource, HorizontalList,
    VerticalList, ScrubBar, User, WebSocket) {

    return Component.extend({
      init: function() {
        var self = this;

        // It is important to call the constructor of the superclass
        this._super("home");

        this._app = this.getCurrentApplication();
        this._device = this._app.getDevice();
        this._videoPlayer = this._device.createPlayer("player", "video");

        // GUI vertical list
        this._gui_list = new VerticalList('gui');

        // Scrub bar
        this._scrub = new ScrubBar('scrub', 0, 0.01, 0.05, 1);
        this._scrub.addEventListener("sliderchangeend", function() {
          self._scrubbing = false;
          var time = self._videoPlayer.getDuration() * self._scrub.getValue();
          self._videoPlayer.setCurrentTime(time)
        });
        this._scrub.addEventListener("sliderchange", function() {
          self._scrubbing = true;
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

        this.addEventListener('vod.pause', function(e) {
          self._videoPlayer.pause();
        });

        this.addEventListener('vod.resume', function(e) {
          self._videoPlayer.play();
        });

        this.addEventListener('vod.stop', function(e) {
          self._videoPlayer.stop();
        });

        this._controls.appendChildWidget(this._playPause);

        // Back button
        var back = new Button('back');
        back.appendChildWidget(new Label('Back'));
        back.addEventListener('select', function(evt) {
          self.parentWidget.back();
        });

        this._controls.appendChildWidget(back);

        this.addEventListener("beforerender", function(ev) {
          self._onBeforeRender(ev);
        });

        this.addEventListener("beforehide", function(ev) {
          self.showHeader();
          self.showControls();
          self.clearControlsHideTimeout();
          self._app.getRootWidget().getChildWidget("maincontainer").getChildWidget("maincontroller").getMenu().removeEventListener("focus", self._focusNavBar);
        });

        this.addEventListener("focus", function(ev) {
          self.showControls();
          self.setControlsHideTimeout();
        });

        this._focusNavBar = function(ev) {
          self.showControls();
          self.setControlsHideTimeout();
        };

        self._app.getRootWidget().getChildWidget("maincontainer").getChildWidget("maincontroller").getMenu().addEventListener("focus", self._focusNavBar);

        this._videoPlayer.addEventListener("timeupdate", function() {
          var player = self._videoPlayer;
          var current_pos = player.getCurrentTime();

          // Set scrubbar current position indicator
          if(!self._scrubbing) {
            self._scrub.setValue(current_pos / player.getDuration());
          }

          // Set scrubbar buffered media area
          var buffer = player.getBuffered();

          if(buffer.length != 0)
            self._scrub.setBufferedRange({
              start: 0,
              end: buffer.end(buffer.length - 1) / player.getDuration()
            });

          var currentSeconds = Math.floor(player.getCurrentTime());

          // Only true once per second
          if(currentSeconds != this._last_segment_second) {
            if(currentSeconds % 5 == 0 && (currentSeconds != null)) {
              if(currentSeconds < this._last_segment_second || currentSeconds > this._last_segment_second + 5) {
                self._last_segment_start = currentSeconds;
              }

              self.logPlayerSegment(self._last_segment_start, currentSeconds);
              this._last_segment_second = currentSeconds;

              // Broadcast the 5 second time update over Socket
              WebSocket.getSocket().emit('progress_update', {
                user_id: User.getUserId(),
                programme_id: self.programme.programme_id,
                position: currentSeconds
              });
            }
          }

        });

        // calls Application.ready() the first time the component is shown
        // the callback removes itself once it's fired to avoid multiple calls.
        this.addEventListener("aftershow", function(ev) {
          document.getElementById("player").addEventListener("loadedmetadata", function() {
            self._videoPlayer.setCurrentTime(self._start_time);
          });

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

        self._timeout = window.setTimeout(function() {
          self.hideControls();
        }, 4000);
      },

      clearControlsHideTimeout: function() {
        clearTimeout(this._timeout);
      },

      // Appending widgets on beforerender ensures they're still displayed
      // if the component is hidden and subsequently reinstated.
      _onBeforeRender: function(e) {
        this.programme = e.args;

        this.hideHeader();
        this.appendChildWidget(this._videoPlayer);
        this.appendChildWidget(this._gui_list);
        this.setControlsHideTimeout();
        this.logPlayerInstance(this.programme);
        this.queueVideo(e.args);
      },

      queueVideo: function(programme) {
        this._start_time = programme.tal_resume_from || 0;

        console.log("Following programme is about to play: %j", programme);

        this._last_segment_start = this._start_time;
        this._last_segment_second = this._start_time;

        this._videoPlayer.setSources([
          new MediaSource("http://148.88.32.70/" + programme.programme_id + ".mp4", "video/mp4")
        ]);
        this._videoPlayer.load();
        this._videoPlayer.play();
      },

      logPlayerInstance: function(programme) {
        this._heartbeat_id = CryptoJS.SHA1("tal" + Math.random() + programme.programme_id).toString();

        console.log("Logging player instance, heartbeat ID: %s", this._heartbeat_id);

        var file_url = "http://148.88.32.70/" + programme.programme_id + ".mp4";

        $.ajax({
          url: "http://10.42.32.75:9110/capture/player_instance",
          type: "get",
          data: {
            api: "53e659a15aff4a402de2d51b98703fa1ade5b8c5",
            heartbeat_id: this._heartbeat_id,
            user_id: User.getUserId(),
            programme_id: programme.programme_id,
            file_id: file_url
          }
        });

        // Log a TAL specific playback log
        $.ajax({
          url: "http://10.42.32.75:9110/capture/log",
          type: "get",
          data: {
            api: "53e659a15aff4a402de2d51b98703fa1ade5b8c5",
            log_type: "TAL_PLAYBACK",
            user_id: User.getUserId(),
            attributes: JSON.stringify({
              programme_id: programme.programme_id,
              file_id: file_url
            })
          }
        });

      },

      logPlayerSegment: function(start, end) {
        $.ajax({
          url: "http://10.42.32.75:9110/capture/heartbeat",
          type: "get",
          data: {
            api: "53e659a15aff4a402de2d51b98703fa1ade5b8c5",
            heartbeat_id: this._heartbeat_id,
            user_id: User.getUserId(),
            start: start,
            end: end
          }
        });
      }
    });
  }
);
