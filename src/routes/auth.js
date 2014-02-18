/*
 * Session authentication functions
 */

function getUserModel(userCode) {
  var anonymous = {
    valid: false,
    user: {
      id: null,
      name: null,
      username: null
    }
  };

  var valid_user = {
    valid: true,
    user: {
      id: 2,
      name: "Ross Wilson",
      username: "wilsonr6"
    }
  };

  return userCode === "1234" ? valid_user : anonymous;
}

module.exports = function verifySession(req, res) {
  var userCode = req.param('code', null) || req.session.userCode;
  var httpStatus = 403;

  if(userCode) {
    req.session.userCode = userCode;
    httpStatus = 200;
  }

  res.json(httpStatus, getUserModel(userCode));
};