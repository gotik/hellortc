var io = require('socket.io').listen(3000);

var sockets = {};
var reverse = {};

io.sockets.on('connection', function (socket) {
	socket.on('register', function(uid) {
		console.log('DEBUG register', uid);
		socket.uid = uid;
		sockets[uid] = socket;
	});

	socket.on('call', function(uid) {
		console.log('DEBUG call', socket.uid, '->', uid);
		sockets[uid].emit('call', socket.uid);

		reverse[uid] = socket;
		reverse[socket.uid] = sockets[uid];

	});

	socket.on('offer', function(offer) {
		console.log('DEBUG offer', socket.uid);
		reverse[socket.uid].emit('offer', offer);
	});

	socket.on('answer', function(answer) {
		console.log('DEBUG answer', socket.uid);
		reverse[socket.uid].emit('answer', answer);
	});

	socket.on('ice', function(ice) {
		console.log('DEBUG ice', socket.uid);
		reverse[socket.uid].emit('ice', ice);
	});
});