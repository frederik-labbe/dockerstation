const express = require('express');
var app = express();

const Routes = require('./routes');
const BridgeServer = require('./connection/bridge_server');

var app_port = 8080;
var bridge_port = 8081;

new BridgeServer(bridge_port).start();
Routes.applyTo(app, bridge_port);

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.listen(app_port, function () {
    console.log('App listening on port ' + app_port + '!');
});
