var config = require('config').Server
var ZMQ = require('zmq');
var Socket = zmq.socket('push');
var Gith = require('gith').create( config.ports.web );
var MsgPack = require('msgpack');

Socket.bindSync('tcp://*:' + config.ports.zmq);
console.log('Producer bound to port ' + config.ports.zmq);

Gith({
  repo: '(.*)'
}).on( 'all', function( payload ) {
  Socket.send(MsgPack.pack(payload));
});
