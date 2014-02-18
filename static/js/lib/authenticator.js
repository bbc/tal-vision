require.def('lancaster-vision/lib/authenticator', [], function(){
  var endpoint = '/auth?code=';

  return function(device){
    return {
      verify: function(successCallback, failureCallback){
        device.loadURL(endpoint, {
          onLoad: successCallback,
          onError: failureCallback
        });
      }
    };
  };
});