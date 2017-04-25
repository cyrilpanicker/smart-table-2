var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 10000;
app.listen(port, ipaddress, function() {
    console.log('listening at : http://'+ipaddress+':'+port);
});