require.def('lancaster-vision/lib/dataevent', ['antie/events/event'], function(Event) {

  return Event.extend({
    init: function(type) {
      this.args = Array.prototype.slice.call(arguments, 1);
      this._super(type);
    }
  });
});
