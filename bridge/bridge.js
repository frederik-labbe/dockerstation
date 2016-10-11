const spawn = require('child_process').spawn;

var Bridge = function(connection) {
    this.connection = connection;
	this.message = '';
	this.error = '';
};

function spawnQuery(cmd, args) {
    var dockerArgs = [cmd];
    dockerArgs = dockerArgs.concat(args);
    return spawn('docker', dockerArgs);
}

Bridge.prototype.spawnQuery = spawnQuery;

function sendEvent(type, value, descr) {
    var msg = {
        type: type,
        value: value
    };
}

Bridge.prototype.sendEvent = sendEvent;

Bridge.prototype.queryInfo = function(cmd, args, columns) {
    var query = spawnQuery(cmd, args);
    
    query.stdout.on('data', (data) => {
        this.message += data;
    });

    query.stderr.on('data', (data) => {
        this.error += error;
    });

    query.on('close', (code) => {
        if (this.message.length > 0) {
            var lines = this.message.split('\n');
            var header = lines[0];
            
            col_pos = [];
            columns.forEach(function(column) {
                col_pos.push(header.indexOf(column));
            });
            lines.shift();
            lines.pop();
            
            var info = [];
            lines.forEach(function(line) {
                var row = {};
                columns.forEach(function(column, i) {
                    row[column] = line.substring(col_pos[i], i < columns.length - 1 ? col_pos[i+1] : line.length).trim();
                });
                info.push(row);
            });
            
            var response = {
                type: cmd + 'Update',
                value: info
            };
            
            this.connection.sendUTF(JSON.stringify(response));
        } else {
            console.log('stderr: ' + this.error);
        }
    });
};

Bridge.prototype.queryUpdate = function(cmd, args, columns) {
    var query = spawnQuery(cmd, args);
    
    query.stdout.on('data', (data) => {
        console.log('UPDATE:' + data);
    });
    
    query.on('close', (code) => {
        console.log('exited iwth ' + code);
    });
};

module.exports = Bridge;


