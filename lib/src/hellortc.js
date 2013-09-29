window.RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
window.RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var DEBUG = true;

var log = function() {
	if(DEBUG && window.console) {
		// http://stackoverflow.com/a/14250078
		var i = -1, l = arguments.length, args = [], fn = 'console.log("DEBUG", args)';
		while(++i<l) {
			args.push('args['+i+']');
		}
		fn = new Function('args',fn.replace(/args/,args.join(',')));
		fn(arguments);
	}
};

var Hello = function(options) {
	this.options = options;
	var self = this;
	var socket = io.connect('http://localhost:3000');
	var peerConnection = new RTCPeerConnection(
		{
			'iceServers': [
				{ url: 'stun:23.21.150.121' },
				{ url: 'stun:stun.l.google.com:19302' }
			]
		},
		{
			optional: [
				{ RtpDataChannels: true }
			]
		}
	);

	var createAnswer = function(answer) {
		log('created answer', answer);
		peerConnection.setLocalDescription(answer);

		socket.emit('answer', answer);
	};

	peerConnection.onaddstream = function(event) {
		log('remote stream', event);
		// remote url video
		this.options.remote.src = URL.createObjectURL(event.stream);
	}.bind(this);

	peerConnection.onicecandidate = function(event) {
		log('local ice', event);
		if (event.candidate) {
			socket.emit('ice', event.candidate);
			peerConnection.onicecandidate = null;
		}
	};

	peerConnection.onopen = function() {
		log('open', arguments);
	};

	socket.on('offer', function(offer) {
		log('offer', offer);
		peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

		peerConnection.createAnswer(createAnswer);
	});

	socket.on('answer', function(answer) {
		log('answer', answer);
		peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
	}.bind(this));

	socket.on('ice', function(candidate) {
		log('remote ice', candidate);
		peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
	});

	socket.on('call', function(uid) {
		log(uid, 'is calling you');
		this.pendingCalls[uid] = new Date();
	}.bind(this));


	this.socket = socket;
	this.stream = null; // local strem
	this.pendingCalls = {};
	this.peerConnection = peerConnection;
};

Hello.prototype.register = function(uid) {
	this.socket.emit('register', uid);
};

Hello.prototype.call = function(uid) {

	var config = {
		audio: true,
		video: true
	};

	var onSuccessMedia = function(stream) {
		// local stream
		this.stream = stream;
		this.peerConnection.addStream(this.stream);
		this.options.local.src = URL.createObjectURL(stream);
		this.socket.emit('call', uid);
	}.bind(this);

	var onErrorMedia = function() {
		console.error(arguments);
	};

	navigator.getUserMedia(config, onSuccessMedia, onErrorMedia);
};

Hello.prototype.answer = function(uid) {
	var cid = this.pendingCalls[uid];

	var config = {
		audio: true,
		video: true
	};

	if (cid) {
		var onSuccessMedia = function(stream) {
			// local stream
			this.stream = stream;
			this.options.local.src = URL.createObjectURL(stream);
			this.peerConnection.addStream(this.stream);

			this.peerConnection.createOffer(function(offer) {
				this.peerConnection.setLocalDescription(offer);
				this.socket.emit('offer', offer);
			}.bind(this));


		}.bind(this);

		var onErrorMedia = function() {
			console.error(arguments);
		};

		navigator.getUserMedia(config, onSuccessMedia, onErrorMedia);
	}
};