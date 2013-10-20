exports.createServer = function(io) {
	var sockets = {};
	var reverse = {};

	io.sockets.on('connection', function (socket) {
		socket.on('hello:register', function(uid) {
			socket.uid = uid;
			sockets[uid] = socket;
		});

		socket.on('hello:call', function(uid) {
			sockets[uid].emit('hello:call', socket.uid);

			reverse[uid] = socket;
			reverse[socket.uid] = sockets[uid];
		});

		socket.on('hello:offer', function(offer) {
			if (reverse[socket.uid]) {
				reverse[socket.uid].emit('hello:offer', offer);
			} else {
				socket.emit('hello:error');
			}
		});

		socket.on('hello:answer', function(answer) {
			if (reverse[socket.uid]) {
				reverse[socket.uid].emit('hello:answer', answer);
			} else {
				socket.emit('hello:error');
			}
		});

		socket.on('hello:ice', function(ice) {
			if (reverse[socket.uid]) {
				reverse[socket.uid].emit('hello:ice', ice);
			} else {
				socket.emit('hello:error');
			}
		});

		socket.on('disconnect', function() {
			delete sockets[socket.uid];
			if (reverse[socket.uid]) {
				reverse[socket.uid].emit('hello:disconnect', socket.uid);
			}
		});
	});
};