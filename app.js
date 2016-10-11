var images = require('./bridge/images');
var containers = require('./bridge/containers');
var Pull = require('./bridge/pull');

//images.getList();
//containers.getList();

new Pull('flabbe/jenkins').queryUpdate();
