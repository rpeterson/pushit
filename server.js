var config = require('config').Server;

var ZMQ = require('zmq');
var Socket = ZMQ.socket('push');
var Gith = require('gith').create( config.web );
var MsgPack = require('msgpack');

Socket.bindSync('tcp://*:' + config.zmq);

console.log('ZeroMQ ' + config.zmq);
console.log('Githook ' + config.web);

Gith({
  repo: '(.*)'
}).on( 'all', function( payload ) {
  Socket.send(MsgPack.pack(payload));
});
