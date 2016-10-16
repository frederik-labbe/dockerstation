const Bridge = require('./bridge');

var Images = {};

var d = {
    cmd: 'images',
    columns: [
        'REPOSITORY',
        'TAG',
        'IMAGE ID',
        'CREATED',
        'SIZE'
    ]
};

Images.queryList = function(connection) {
    new Bridge(connection).queryInfo(d.cmd, [], d.columns);
}

module.exports = Images;
