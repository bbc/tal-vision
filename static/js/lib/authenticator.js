require.def('lancaster-vision/lib/authenticator',
  [
    'antie/storageprovider',
    'lancaster-vision/lib/user'
  ],
  function(StorageProvider, User) {
    return function(device) {
      var self = {
        verify: function(token, successCallback, failureCallback) {
          device.loadURL('/auth/' + token, {
            onLoad: function(response) {
              response = JSON.parse(response);

              // Store the user ID in a local cookie
              var storage = device.getStorage(StorageProvider.STORAGE_TYPE_PERSISTENT, "vision-v0.1");
              storage.setItem("user_id", response.user_id);
              User.setUserId(response.user_id);

              successCallback(response);
            },
            onError: function(response) {
              failureCallback(response);
            }
          });
        },
        isAuthenticated: function(successCallback, failureCallback) {
          var storage = device.getStorage(StorageProvider.STORAGE_TYPE_PERSISTENT, "vision-v0.1");
          var user_id = storage.getItem("user_id");

          if(user_id) {
            User.setUserId(user_id);
            successCallback(user_id);
          } else {
            failureCallback();
          }
        },
        logout: function() {
          var storage = device.getStorage(StorageProvider.STORAGE_TYPE_PERSISTENT, "vision-v0.1");
          storage.removeItem("user_id");
        },
        set_session: function(user_id) {
          console.log("Setting user_id to %s", user_id);
          var storage = device.getStorage(StorageProvider.STORAGE_TYPE_PERSISTENT, "vision-v0.1");
          storage.setItem("user_id", user_id);
          User.setUserId(user_id);
        }
      };

      return self;
    };
  });
