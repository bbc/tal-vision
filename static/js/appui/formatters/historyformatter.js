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

        var list = new VerticalList("history_" + item.programme_id);

        var width = 310;
        var height = 182;
        item.image_url = "http://148.88.32.64/cache/" + width + "x" + height + "-2/programmes/" + item.image;

        list.appendChildWidget(new Image("trending_img_" + item.programme_id, item.image_url, { width : width, height: height}));

        var prog_details_list = new VerticalList("prog_details");
        prog_details_list.addClass("prog_details");

        var prog_name_label = new Label(item.programme_name);
        prog_name_label.addClass("prog_name");
        prog_details_list.appendChildWidget(prog_name_label);
        
        var formatted_date = moment(item.watched_at).fromNow();
        var datetime = new Label("Watched " + formatted_date);
        datetime.addClass("watched_at");
        prog_details_list.appendChildWidget(datetime);

        var synopsis = new Label(item.synopsis);
        synopsis.addClass("synopsis");
        prog_details_list.appendChildWidget(synopsis);
        list.appendChildWidget(prog_details_list);

        var buttons_list = new VerticalList("buttons_list");

        // Resume button
        this._resume = new Button("resume_button");

        var resume_text;

        if(item.percentage_watched < 50) {

          if(item.last_known_position < 60) {
            resume_text = item.last_known_position <= 1 ? "1 second watched" : item.last_known_position + " seconds watched";
          } else {
            var minutes = Math.floor(item.last_known_position/60);
            resume_text = minutes == 1 ? "1 minute watched" : minutes + " minutes watched";
          }

        } else {
          resume_text = item.minutes_remaining + " minutes remaining";
        }

        var resume_label = new Label("Resume (" + resume_text + ")")
        this._resume.appendChildWidget(resume_label);
        this._resume.addClass("resume_button");
        buttons_list.appendChildWidget(this._resume);

        // Play button
        this._play = new Button("play_button");
        this._play.appendChildWidget(new Label("Play From Begining"));
        this._play.addClass("play_button");
        buttons_list.appendChildWidget(this._play);

        prog_details_list.appendChildWidget(buttons_list);

        // Check the VOD is available
        if(item.vod_status != "COMPLETE") {
          this._play.setDisabled(true);
          this._resume.setDisabled(true);
        }

        list.setDataItem(item);
        return list;
      }
    });
  }
);