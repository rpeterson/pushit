var config = require('config').Server;

var ZMQ = require('zmq');
var Socket = ZMQ.socket('push');
var Gith = require('gith').create( config.web );
var MsgPack = require('msgpack');

Socket.bindSync('tcp://*:' + config.zmq);
console.log('Producer bound to port ' + config.zmq);

Gith({
  repo: '(.*)'
}).on( 'all', function( payload ) {
  Socket.send(MsgPack.pack(payload));
});
