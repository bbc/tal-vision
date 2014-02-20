require.def('lancaster-vision/appui/controller',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/label",
    "antie/widgets/componentcontainer",
    "antie/widgets/verticallist",
    "antie/widgets/horizontallist"
  ],
  function(Component, Button, Label, ComponentContainer, VerticalList, HorizontalList) {

    var createLabelledButton = function (label, id, options){
      var button = new Button(id);
      var label = new Label(label);

      options = options || {};

      button.appendChildWidget(label);
      button.setDisabled(options.disabled || false);

      return button;
    };

    return Component.extend({
      init: function () {
        var self = this;

        this._super("maincontroller");

        // Vertical Skeleton Navigation
        var skeleton = new VerticalList('content-to-navigation');

        // Horizontal Menu
        var menu = new HorizontalList('app-navigation');
        menu.appendChildWidget(createLabelledButton('Home', 'trending'));
        menu.appendChildWidget(createLabelledButton('Browse', 'browse', { disabled: true }));
        menu.appendChildWidget(createLabelledButton('History', 'history', { disabled: true }));
        menu.appendChildWidget(createLabelledButton('Search', 'search'));

        // Launch the components
        menu.getChildWidgets().forEach(function(widget){
          widget.addEventListener('select', function(){
            skeleton.getChildWidget('content-container').pushComponent('lancaster-vision/appui/components/' + widget.id);
          });
        });

        // Ordering Elements
        this._content_container = new ComponentContainer('content-container');
        this._content_container.pushComponent('lancaster-vision/appui/components/trending');

        skeleton.appendChildWidget(this._content_container);
        skeleton.appendChildWidget(menu);

        //
        this._skeleton = skeleton;

        this.addEventListener("beforerender", function (e) {
          self._onBeforeRender(e);
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
      _onBeforeRender: function () {
        var self = this;

        self.appendChildWidget(this._skeleton);
      }
    });
  }
);