require.def('lancaster-vision/appui/formatters/trendingformatter',
  [
    "antie/formatter",
    "antie/widgets/label",
    "antie/widgets/button",
    "antie/widgets/image"
  ],
  function(Formatter, Label, Button, Image) {
    return Formatter.extend({
      format : function (iterator) {
        var button, item;
        item = iterator.next();

        item.image_url = "http://148.88.32.64/cache/320x180-2/programmes/" + item.image;

        button = new Button("trending_" + item.programme_id);
        button.appendChildWidget(new Image("trending_img_" + item.programme_id, item.image_url, { width : 320, height: 180}));
        button.appendChildWidget(new Label(item.programme_name));
        button.setDataItem(item);

        return button;
      }
    });
  }
);