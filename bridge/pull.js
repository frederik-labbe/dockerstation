const Bridge = require('./bridge');

var Pull = function(dockerImage) {
    this.dockerImage = dockerImage;
    this.total = 0;
    this.completed = 0;
    this.cmd = 'pull';
};

const Events = {
    pullUpToData: 'pullUpToDate',
    pullStart: 'pullStart',
    pullAddTotal: 'pullAddToTotal',
    pullProgress: 'pullProgress',
    pullEnd: 'pullEnd'
};

Pull.prototype.queryUpdate = function(connection) {
    var bridge = new Bridge(connection);
    var query = bridge.spawnQuery(this.cmd, this.dockerImage);
    
    var _this = this;
    
    query.stdout.on('data', (data) => {
        var lines = data.toString().split('\n');
        lines.pop();
        
        lines.forEach(function(line) {
            if (line.indexOf('up to date') != -1) {
                bridge.sendEvent(Events.pullUpToData, _this.dockerImage);
            } else if (line.indexOf('Pulling from') != -1) {
                bridge.sendEvent(Events.pullStart, _this.dockerImage);
            } else if (line.indexOf('Pulling') != -1) {
                _this.total++;
                bridge.sendEvent(Events.pullAddTotal, 1);
            } else if (line.indexOf('Download complete') != -1) {
                _this.completed++;
                bridge.sendEvent(Events.pullProgress, 100*(_this.completed / _this.total) >> 0);
            } else if (line.indexOf('Downloaded') != -1) {
                this.completed = _this.total;
                bridge.sendEvent(Events.pullEnd, _this.dockerImage);
            }
        });
    });
    
    query.on('close', (code) => {
        console.log('exited with ' + code);
    });
};

module.exports = Pull;
