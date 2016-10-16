var Bridge = require('./bridge');

var Containers = {};

var d = {
    cmd: 'ps',
    columns: [
        'CONTAINER ID',
        'IMAGE',
        'COMMAND',
        'CREATED',
        'STATUS',
        'PORTS',
        'NAMES'
    ]
};

Containers.queryList = function(connection) {
    new Bridge(connection).queryInfo(d.cmd, ['-a'], d.columns);
};

module.exports = Containers;
