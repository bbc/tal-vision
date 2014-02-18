/*
 * Session authentication functions
 */

var guestUser = {
  id: null,
  name: null,
  username: null
};

var users = {
  "1234": {
    id: 2,
    name: "Ross Wilson",
    username: "wilsonr6"
  }
};

function getUserModel(userCode) {
  return users[userCode] || guestUser;
}

module.exports = function verifySession(req, res) {
  // checking authentication
  if (req.params.auth_code === undefined) {
    if (req.session.userCode && users[req.session.userCode]) {
      res.json(200, getUserModel(req.session.userCode));
    }
    else {
      res.json(401, {});
    }
  }
  // requesting authentication
  else {
    var user = getUserModel(req.params.auth_code);

    if (user.id){
      req.session.userCode = req.params.auth_code;
      res.json(200, user);
    }
    else {
      res.json(401, {});
    }
  }
};