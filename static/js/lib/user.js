require.def('lancaster-vision/lib/user', [], function() {
  return {
    setUserId: function(user_id) {
      this._user_id = user_id;
    },
    getUserId: function() {
      return this._user_id;
    }
  };
});