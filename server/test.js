var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , hellortc = require('./app').createServer(io);

app.listen(3000);

function handler(req, res) {
	res.writeHead(200);
	res.end();
}