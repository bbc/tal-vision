require.def('lancaster-vision/lib/authenticator', [], function(){
  return function(device){
    return {
      verify: function(token, successCallback, failureCallback){
        device.loadURL('/auth/' + token, {
          onLoad: successCallback,
          onError: failureCallback
        });
      },
      isAuthenticated: function(successCallback, failureCallback){
        device.loadURL('/auth', {
          onLoad: successCallback,
          onError: failureCallback
        });
      }
    };
  };
});