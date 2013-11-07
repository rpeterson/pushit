var config = require('config').Server;

var ZMQ = require('zmq');
var Socket = ZMQ.socket('push');
var Gith = require('gith').create( config.web );
var MsgPack = require('msgpack');
var Express = require('express');
var App = Express();

Socket.bindSync('tcp://*:' + config.zmq);

Gith({
  repo: '.*'
}).on( 'all', function( payload ) {
	console.log(payload);
  	Socket.send(MsgPack.pack(payload));
});

// Web App
App.all('/', function(req, res){
  res.send('Push It. Push It Real Good.');
});

App.listen(config.port);

console.log('ZeroMQ '  + config.zmq);
console.log('Githook ' + config.web);
console.log('Web App ' + config.port);