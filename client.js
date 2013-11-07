var config = require('config').Client
var Program = require('commander');
var Service = require('node-mac').Service;
var spotify = require('spotify-node-applescript');
var ZMQ = require('zmq');
var Socket = ZMQ.socket('pull');
var MsgPack = require('msgpack');

/**
 * App Methods
 */

var start = function () {
	Socket.connect(config.server);
}

var play = function (){
	spotify.playTrack('spotify:track:0GugYsbXWlfLOgsmtsdxzg', function(){
	     spotify.jumpTo(42, function(){
	        setTimeout(function(){
	            spotify.pause(function(){
	                console.log("Done.");
	            });
	        }, 11500);
	     });
	});
}

Socket.on('message', function (msgpack_payload) {
	var payload = MsgPack.unpack(msgpack_payload);
	console.log(payload);
  	// play();
});

/**
 * Mac Service
 */
// Create a new service object
var svc = new Service({
  name:'GitPushIt',
  description: 'Push It Real Good Git Style.',
  script: __dirname + 'client.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  	svc.start();
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function () {
	  console.log('Uninstall complete.');
	  console.log('The service exists: ', svc.exists);
});

svc.on('alreadyinstalled', function () {
  	console.log("GitPushIt is already installed.");
});

svc.on('invalidinstallation', function () {
  	console.log("GitPushIt is installed but missing files. Try doing an npm install.");
});

svc.on('start', function () {
	start();
});

svc.on('stop', function () {
  
});

svc.on('error', function () {
  
});

// CLI Options
Program
	.version('0.0.1')
	.on('install', svc.install)
	.on('uninstall', svc.uninstall)
	.on('start', svc.start)
	.on('stop', svc.stop)
	.on('debug', start)
	.on('play', play)
	.parse(process.argv);