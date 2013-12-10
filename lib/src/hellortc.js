
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

	// chrome defaults
	var peerConfig = {
		iceServers: [
			{ url: 'stun:stun.l.google.com:19302' }
		]
	};
	var mediaConstraints = {
		mandatory: {
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: true
		},
		optional: [
			{
				DtlsSrtpKeyAgreement: true
			}
		]
	};

	if (webrtcDetectedBrowser === 'firefox') {
		peerConfig.iceServers = [
			{ url: 'stun:23.21.150.121' }
		];

		mediaConstraints = {
			mandatory: {
				OfferToReceiveAudio: true,
				OfferToReceiveVideo: true,
				MozDontOfferDataChannel: true
			}
      	}
	}

	// define default options
	options.socket = options.socket || '';
	peerConfig.iceServers = options.iceServers || peerConfig.iceServers;

	var socket = typeof options.socket === 'string' ? io.connect(options.socket) : options.socket;
	var peerConnection = new RTCPeerConnection(
		peerConfig,
		mediaConstraints
	);

	var createAnswer = function(answer) {
		if (DEBUG) console.log('created answer', answer);
		peerConnection.setLocalDescription(answer);

		socket.emit('hello:answer', answer);
	};

	peerConnection.onaddstream = function(event) {
		var src = URL.createObjectURL(event.stream);
		if (DEBUG) console.log('remote stream', event);
		// remote url video
		if (this.options.remote) {
			attachMediaStream(this.options.remote, event.stream);
		}

		if (this.options.remoteCallback) {
			this.options.remoteCallback(src);
		}
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

		peerConnection.createAnswer(createAnswer, function() {});
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

	socket.on('hello:disconnect', function(uid) {
		if (DEBUG) console.log(uid, ' disconnect');
		if (this._events['disconnect']) {
			this._events['disconnect'](uid);
		}

		if (this.options.remote) {
			this.options.remote.src = '';
		}

		if (this.options.remoteCallback) {
			this.options.remoteCallback('');
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
 * @todo refactor call and answer duplicate code
 */

/**
 * @param {String|Number} uid
 * @param {Object} options
 * @public
 */
Hello.prototype.call = function(uid, options) {

	var config = {
		audio: true,
		video: true
	};

	options = options || {};

	if (options.remote) {
		this.options.remote = options.remote;
	}

	if (options.local) {
		this.options.local = options.local;
	}

	if (options.callbacks) {
		this.options.remoteCallback = options.callbacks.remote;
	}

	var onSuccessMedia = function(stream) {
		var src = URL.createObjectURL(stream);

		// local stream
		this.stream = stream;

		this.peerConnection.addStream(this.stream);

		if (this.options.local) {
			attachMediaStream(this.options.local, stream);
		}

		if (options.callbacks && options.callbacks.local && typeof options.callbacks.local === 'function') {
			options.callbacks.local(src)
		}

		this.socket.emit('hello:call', uid);
	}.bind(this);

	var onErrorMedia = function() {
		console.error(arguments);
	};

	navigator.getUserMedia(config, onSuccessMedia, onErrorMedia);
};

/**
 * @param {String|Number} uid
 * @param {Object} options
 * @public
 */
Hello.prototype.answer = function(uid, options) {
	var cid = this.pendingCalls[uid];

	var config = {
		audio: true,
		video: true
	};

	options = options || {};

	if (options.remote) {
		this.options.remote = options.remote;
	}

	if (options.local) {
		this.options.local = options.local;
	}

	if (options.callbacks) {
		this.options.remoteCallback = options.callbacks.remote;
	}

	if (cid) {
		var onSuccessMedia = function(stream) {
			var src = URL.createObjectURL(stream);

			// local stream
			this.stream = stream;

			if (this.options.local) {
				attachMediaStream(this.options.local.src, stream);
			}

			if (options.callbacks && options.callbacks.local && typeof options.callbacks.local === 'function') {
				options.callbacks.local(src)
			}

			this.peerConnection.addStream(this.stream);

			this.peerConnection.createOffer(function(offer) {
				this.peerConnection.setLocalDescription(offer);
				this.socket.emit('hello:offer', offer);
			}.bind(this), function() {});


		}.bind(this);

		var onErrorMedia = function() {
			console.error(arguments);
		};

		navigator.getUserMedia(config, onSuccessMedia, onErrorMedia);
	}
};