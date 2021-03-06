const db = require('./db.js'),
	  socketioJwt = require('socketio-jwt');

var group = {};

db.findGroupMembers('test-group', function (err, success) {
	group = success;
})

function markOnline (username) {
	group = group.map(function (user) {
		if (user.username === username) {
			user.status = 'online';
		}

		return user;
	})
}

module.exports = function (server) {
	const io = require('socket.io').listen(server);


	io.on('connection', socketioJwt.authorize({
		secret: require('./util.js').secret,
		timeout: 15000
	})).on('authenticated', function(socket) {	    
	    socket.on('post_message', function(msg) {
	        db.saveMessage(msg, function (err, key) {
	        	if (err || !key)
	        		throw err;
	        	
	        	msg.id = key;
	        	io.emit('new_message', msg);
	        })
	    });

	    socket.on('i_am_online', function () {
	    	var username = socket.decoded_token.username,
	    		group_name = 'test-group';

	    	markOnline(username);

	    	io.emit('user_online', group);
	    })
	});

	return io;
}