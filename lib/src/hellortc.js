
/**
 * @param {Object} options
 * @param {Object} options.remote
 * @param {Object} options.local
 * @param {Object} options.socket [http://localhost:3000]
 * @param {Object} options.iceServers
 *   [
 *	  { url: 'stun:23.21.150.121' },
 *	  { url: 'stun:stun.l.google.com:19302' }
 *   ]
 * @public
 * @namespace
 */
var Hello = function(options) {
	this.options = options;
	this._events = {};

	// define default options
	options.socket = options.socket || '';
	options.iceServers = options.iceServers || [
		{ url: 'stun:23.21.150.121' },
		{ url: 'stun:stun.l.google.com:19302' }
	];

	var socket = typeof options.socket === 'string' ? io.connect(options.socket) : options.socket;
	var peerConnection = new RTCPeerConnection(
		{ 'iceServers': options.iceServers },
		{ optional: [{ RtpDataChannels: true }]}
	);

	var createAnswer = function(answer) {
		if (DEBUG) console.log('created answer', answer);
		peerConnection.setLocalDescription(answer);

		socket.emit('hello:answer', answer);
	};

	peerConnection.onaddstream = function(event) {
		if (DEBUG) console.log('remote stream', event);
		// remote url video
		this.options.remote.src = URL.createObjectURL(event.stream);
	}.bind(this);

	peerConnection.onicecandidate = function(event) {
		if (DEBUG) console.log('local ice', event);
		if (event.candidate) {
			socket.emit('hello:ice', event.candidate);
			peerConnection.onicecandidate = null;
		}
	};

	peerConnection.onopen = function() {
		if (DEBUG) console.log('open', arguments);
	};

	socket.on('hello:offer', function(offer) {
		if (DEBUG) console.log('offer', offer);
		peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

		peerConnection.createAnswer(createAnswer);
	});

	socket.on('hello:answer', function(answer) {
		if (DEBUG) console.log('answer', answer);
		peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
	}.bind(this));

	socket.on('hello:ice', function(candidate) {
		if (DEBUG) console.log('remote ice', candidate);
		peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
	});

	socket.on('hello:call', function(uid) {
		if (DEBUG) console.log(uid, 'is calling you');
		this.pendingCalls[uid] = new Date();
		if (this._events['call']) {
			this._events['call'](uid);
		}
	}.bind(this));


	this.socket = socket;
	this.stream = null; // local strem
	this.pendingCalls = {};
	this.peerConnection = peerConnection;
};

/**
 * @param {String} eventName
 * @param {Function} callback
 * @public
 */
Hello.prototype.on = function(eventName, callback) {
 this._events[eventName] = callback;
};

/**
 * @param {String|Number} uid
 * @public
 */
Hello.prototype.register = function(uid) {
	this.socket.emit('hello:register', uid);
};

/**
 * @param {String|Number} uid
 * @public
 */
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
		this.socket.emit('hello:call', uid);
	}.bind(this);

	var onErrorMedia = function() {
		console.error(arguments);
	};

	navigator.getUserMedia(config, onSuccessMedia, onErrorMedia);
};

/**
 * @param {String|Number} uid
 * @public
 */
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
				this.socket.emit('hello:offer', offer);
			}.bind(this));


		}.bind(this);

		var onErrorMedia = function() {
			console.error(arguments);
		};

		navigator.getUserMedia(config, onSuccessMedia, onErrorMedia);
	}
};