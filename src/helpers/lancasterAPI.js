'use strict';

module.exports = function(app){
  return function (){
    // Checking Application Key
    if (!process.env.APPLICATION_KEY){
      console.log("Lancaster Application Key is missing. Update lancasterAPI.js when ready to deploy in production.");
      //throw new Error("Lancaster Application Key is missing. Please refer to README.md to configure it.");
    }

    app.locals.APPLICATION_KEY = process.env.APPLICATION_KEY;
  };
};