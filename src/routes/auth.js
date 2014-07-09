var request = require('request');
var API_KEY = "53e659a15aff4a402de2d51b98703fa1ade5b8c5";

// Session authentication functions
module.exports = function verifySession(req, res) {

  // Checking authentication
  if(req.params.auth_code === undefined) {
    if(req.session.user_id) {
      replySuccess(req.session.user_id);
    } else {
      replyFailure();
    }
  }
  // Requesting authentication
  else {

    // Build URL and fire request to Vision authentication API
    var url = "http://vision.lancs.ac.uk:9110/user/verify_external_pin?api=" + API_KEY + "&pin=" + req.params.auth_code;
    request({url: url, json: true}, function(error, response, body) {

      // Vision's auth api either returns HTTP 500, or empty JSON document
      if(response.statusCode == 500 || error) {
        console.log("[Core API] HTTP 500, probably because PIN code isn't valid");
        replyFailure();
        return;
      }

      // If credentials are valid the JSON document will contain a user record
      if(body.num_res > 0) {
        var user_id = parseInt(body.data[0].user_id);
        console.log("[Core API] Successful auth for user %d", user_id);
        req.session.user_id = user_id;
        replySuccess(user_id);
      } else {
        console.log("[Core API] Unsuccessful auth for PIN %d", req.params.auth_code);
        req.session.user_id = null;
        replyFailure();
      }

    });

  }

  function replySuccess(user_id) {
    res.json(200, { user_id: user_id });
  };

  function replyFailure() {
    res.json(401, { user_id: null });
  }

};
