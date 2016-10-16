const WebSocketServer = require('websocket').server;
const http = require('http');

const DockerImages = require('../bridge/images');
const DockerContainers = require('../bridge/containers');

var BridgeServer = function(port) {
    this.port = port;
};

BridgeServer.prototype.start = function() {
    var server = http.createServer(function(request, response) {
        response.writeHead(404);
        response.end();
    });
    server.listen(this.port);
    
    console.log('Bridge server listening on port ' + this.port);

    wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    wsServer.on('request', function(request) {
        var connection = request.accept('echo-protocol', request.origin);
        DockerImages.queryList(connection);
        DockerContainers.queryList(connection);
    });
};

module.exports = BridgeServer;
