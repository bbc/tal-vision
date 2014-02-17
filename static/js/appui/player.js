require.def('lancaster-vision/appui/player',
  [
    "antie/widgets/component",
    "antie/videosource"
  ],
  function(Component, MediaSource){
  return Component.extend({
    init: function(){
      var self = this;
      self._super('vistatv-player');

      var device = this.getCurrentApplication().getDevice();
      this._videoPlayer = device.createPlayer("player", "video");

      this._videoPlayer.setSources([
        new MediaSource("/20120814_213000_bbchd_luther-lo.mp4", "video/mp4")
      ]);

      this._videoPlayer.load();

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
    _onBeforeRender: function () {
      this.appendChildWidget(this._videoPlayer);
    }
  });
});