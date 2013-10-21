# helloRTC

## Example

### Server

npm install hellortc
```javascript
var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, hellortc = require('hellortc').createServer(io);

app.listen(3000);

function handler(req, res) {
	res.writeHead(200);
	res.end();
}
```

### Client

Sending a call:

```javascript
var hello = new Hello({
	remote: document.getElementById('remove-video'),
	local: document.getElementById('local-video')
});
hello.register(0);
hello.call(1);
```

Receiving a call:

```javascript
var hello = new Hello({
	remote: document.getElementById('remove-video'),
	local: document.getElementById('local-video')
});
hello.register(1);
hello.on('call', function(uid) {
	hello.answer(uid);
});
```
