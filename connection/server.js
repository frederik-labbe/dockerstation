var WebSocketServer = require('websocket').server;
var http = require('http');

var DockerImages = require('../bridge/images');
var DockerContainers = require('../bridge/containers');

var server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});
server.listen(8085);

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);
    DockerImages.queryList(connection);
    DockerContainers.queryList(connection);
});
