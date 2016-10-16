var Routes = {};

Routes.applyTo = function(app, bridge_port) {
    app.get('/', function (req, res) {
        res.render('index', {
            ip: req.hostname,
            port: bridge_port
        });
    });
    
    app.get('/console/:dockerId', function(req, res) {
        res.render('console', req.params);
    });
};

module.exports = Routes;
