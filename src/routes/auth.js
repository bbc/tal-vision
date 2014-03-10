var http = require('http');

/*
 * Session authentication functions
 */

module.exports = function verifySession(req, res) {

  // Checking authentication
  if (req.params.auth_code === undefined) {
    if (req.session.userCode) {
      res.json(200, { user_id: req.session.userCode });
    }
    else {
      res.json(401, { user_id: null });
    }
  }
  // Requesting authentication
  else {

    var options = {
      host: 'vision.lancs.ac.uk',
      port: 9110,
      path: '/user/verify_external_pin?api=53e659a15aff4a402de2d51b98703fa1ade5b8c5&pin=' + req.params.auth_code
    };

    var api_req = http.get(options, function(api_res) {
    
      if(api_res.statusCode == 500) {
        console.log("Craig's API returned HTTP 500, probably because PIN code isn't valid")
        res.json(401, { user_id: null });
      }

      api_res.setEncoding('utf8');
      api_res.on('data', function (body) {
        var json_body = JSON.parse(body);
        console.log(json_body);

        if(json_body.num_res > 0) {
          var user_id = json_body.data[0].user_id;
          req.session.userCode = user_id;
          res.json(200, { user_id: user_id });
        } else {
          res.json(401, { user_id: null });
        }

      });

    }).on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

  }
};