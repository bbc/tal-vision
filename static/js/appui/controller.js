require.def('lancaster-vision/appui/controller',
  [
    "antie/widgets/component",
    "antie/widgets/button",
    "antie/widgets/label",
    "antie/widgets/componentcontainer",
    "antie/widgets/verticallist",
    "antie/widgets/horizontallist",
    "lancaster-vision/lib/authenticator"
  ],
  function(Component, Button, Label, ComponentContainer, VerticalList, HorizontalList, Authenticator) {

    var createLabelledButton = function(label, id, options) {
      var button = new Button(id);
      var label = new Label(label);

      options = options || {};

      button.appendChildWidget(label);
      button.setDisabled(options.disabled || false);

      return button;
    };

    return Component.extend({
      init: function() {
        var self = this;

        this._super("maincontroller");

        // Vertical Skeleton Navigation
        var skeleton = new VerticalList('content-to-navigation');

        // Horizontal Menu
        var menu = new HorizontalList('app-navigation');
        this._menu = menu;
        menu.appendChildWidget(createLabelledButton('Home', 'home'));
        // menu.appendChildWidget(createLabelledButton('Browse', 'browse', { disabled: true }));
        menu.appendChildWidget(createLabelledButton('History', 'history'));
        menu.appendChildWidget(createLabelledButton('Search', 'search'));

        // Launch the components
        menu.getChildWidgets().forEach(function(widget) {
          widget.addEventListener('select', function() {
            skeleton.getChildWidget('content-container').pushComponent('lancaster-vision/appui/components/' + widget.id);
          });
        });

        // Debug reload button
        var reloadButton = createLabelledButton('Reload', 'reload')
        menu.appendChildWidget(reloadButton);
        reloadButton.addEventListener('select', function() {
          location.reload();
        });

        // Logout button
        var app = this.getCurrentApplication();

        var logoutButton = createLabelledButton('Logout', 'logout')
        menu.appendChildWidget(logoutButton);
        logoutButton.addEventListener('select', function() {
          console.log("Logout button pressed");
          Authenticator(app.getDevice()).logout();
          location.reload();
        });

        // Ordering Elements
        this._content_container = new ComponentContainer('content-container');
        this._content_container.pushComponent('lancaster-vision/appui/components/home');

        // VOD playback request
        this._content_container.addEventListener('vod.show', function(e) {
          var programme = e.args[0];
          skeleton.getChildWidget('content-container').pushComponent('lancaster-vision/appui/components/video', programme);
        });

        // Search results
        this._content_container.addEventListener('search-results', function(e) {
          var search_term = e.args[0];
          skeleton.getChildWidget('content-container').pushComponent('lancaster-vision/appui/components/searchresults', search_term);
        });

        // Search form
        this._content_container.addEventListener('search', function(e) {
          skeleton.getChildWidget('content-container').pushComponent('lancaster-vision/appui/components/search');
        });

        // // Navigation bar hide
        // this._content_container.addEventListener('nav.hide', function(e){
        //   var programme = e.args[0];
        //   skeleton.getChildWidget('content-container').pushComponent('lancaster-vision/appui/components/video', programme);
        // });

        skeleton.appendChildWidget(this._content_container);
        skeleton.appendChildWidget(menu);

        //
        this._skeleton = skeleton;

        this.addEventListener("beforerender", function(e) {
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
      _onBeforeRender: function() {
        var self = this;

        self.appendChildWidget(this._skeleton);
      },

      getContainer: function() {
        return this._skeleton.getChildWidget('content-container');
      },

      getMenu: function() {
        return this._menu;
      }
    });
  }
);
