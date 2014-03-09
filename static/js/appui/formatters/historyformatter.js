require.def('lancaster-vision/appui/formatters/historyformatter',
  [
    "antie/formatter",
    "antie/widgets/label",
    "antie/widgets/button",
    "antie/widgets/image",
    "antie/widgets/horizontallist",
    "antie/widgets/verticallist"
  ],
  function(Formatter, Label, Button, Image, HorizontalList, VerticalList) {
    return Formatter.extend({
      format : function (iterator) {
        var button, item, list;
        item = iterator.next();

        var list = new HorizontalList("history_" + item.programme_id);

        var width = 302;
        var height = 165;
        item.image_url = "http://148.88.32.64/cache/" + width + "x" + height + "-2/programmes/" + item.image;

        list.appendChildWidget(new Image("trending_img_" + item.programme_id, item.image_url, { width : width, height: height}));

        var prog_details_list = new VerticalList();
        prog_details_list.addClass("prog_details");
        var prog_name_label = new Label(item.programme_name);
        prog_name_label.addClass("prog_name");
        prog_details_list.appendChildWidget(prog_name_label);
        
        var synopsis = new Label(item.synopsis);
        synopsis.addClass("synopsis");
        prog_details_list.appendChildWidget(synopsis);
        list.appendChildWidget(prog_details_list);

        var buttons_list = new HorizontalList();

        var play = new Button();
        play.appendChildWidget(new Label("Play From Begining"));
        play.addClass("play_button");
        buttons_list.appendChildWidget(play);

        var resume = new Button();
        resume.appendChildWidget(new Label("Resume"));
        resume.addClass("resume_button");
        buttons_list.appendChildWidget(resume);

        prog_details_list.appendChildWidget(buttons_list);

        list.setDataItem(item);
        return list;
      }
    });
  }
);