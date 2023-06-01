const { ONE_SIGNAL_CONFIG } = require("C:/Users/yosry/classy/back/serveur/config.js");
const https = require("https");

function SendNotif(data, callback) {
  var headers = {
    "Authorization": "Basic " + ONE_SIGNAL_CONFIG.API_KEY,
  };
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/notif",
    method: "POST",
    headers: headers
  };

  var req = https.request(options, function (res) {
    res.on("data", function (data) {
      console.log(JSON.parse(data));
      return callback(null, JSON.parse(data));
    });
  });

  req.on("error", function (e) {
    return callback({
      message: e
    });
  });

  req.write(JSON.parse(data));

  req.end();
}

module.exports = {
  SendNotif
};
