require.def('lancaster-vision/appui/formatters/basiccarouselformatter',
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

        var width = 302;
        var height = 165;

        item.image_url = "http://148.88.32.64/cache/" + width + "x" + height + "-2/programmes/" + item.image;

        button = new Button("trending_" + item.programme_id);
        button.appendChildWidget(new Image("trending_img_" + item.programme_id, item.image_url, { width : width, height: height}));
        
        var prog_name = new Label(item.programme_name);
        prog_name.addClass("prog_name");
        button.appendChildWidget(prog_name);
        
        var synopsis = new Label(item.synopsis);
        synopsis.addClass("synopsis");
        button.appendChildWidget(synopsis);
        button.setDataItem(item);

        return button;
      }
    });
  }
);