'use strict';

var tal = require('tal');
var t = new tal();

module.exports = function(app){
  return function(req, res, next){
    var app_id = process.env.npm_package_tal_default_application_id || 'default_tal_app';

    var deviceConfig = t.getDeviceConfigFromRequest(req.query, {
      'application': app_id
    });

    res.type(t.getMimeType(deviceConfig));

    app.locals({
      tal: {
        app_id: app_id,
        doctype: t.getDocType(deviceConfig),
        rootTag: t.getRootHtmlTag(deviceConfig),
        deviceHeaders: t.getDeviceHeaders(deviceConfig),
        deviceBody: t.getDeviceBody(deviceConfig),
        config: {
          framework: {
            deviceConfiguration: deviceConfig
          }
        }
      }
    });

    next();
  };
};