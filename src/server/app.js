// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var users  = [];
var channels = ["general"];
var socketsByUsername = {};
var numUsers = 0;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('./src/client/'));

// Get all the current users in json
app.get('/users', function(req, res){
	res.send(users);
});

// Get all channels available in json
app.get('/channels', function(req, res) {
      res.send(channels);
});

// Route used to check whether username is available
app.get('/users/available', function(req, res) {
      const username = req.query.username;
      // Check if username is available
      res.send({isAvailable: !socketsByUsername.hasOwnProperty(username)});
});


// Chatroom
function deleteUserWithUsername(username) {
      for(var i = 0; i < users.length; i++) {
            if(users[i].name === username) {
                  console.log('found removing user ' + username);
                  // Remove from array
                  users.splice(i, 1);
                  break;
            }
      }
}


function userForUsername(username) {
      for(var i = 0; i < users.length; i++) {
            if (users[i].name == username) {
                  return users[i];
            }
      }

      return false;
}

function isDMChannel(channelID) {
      const dmChannelRegex = "/.{1,}-.{1,}/";
      return channelID.match(dmChannelRegex);
}

// Removes user from server by deleting from users and socket collection
function removeUserForSocket(socket) {
      deleteUserWithUsername(socket.username);
      delete socketsByUsername[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
}

// Caculates the dm channelID for two usernames
function getConversationID(sender, recipient) {
      // Order in alpha order
      if(sender < recipient) {
            return sender + '-' + recipient;
      } else {
            return recipient + '-' + sender;
      }
}

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
        console.log('New message channel:' + data.channel);
       // TODO Improve security by implemented broadcasting to specific rooms
       // tell the client to execute 'new message'
             socket.broadcast.emit('new message', {
               user: {name: socket.username},
               message: data.message,
               createdAt: new Date(),
               channel: data.channel
             });

  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;
    console.log('Added user ' + username);

    // we store the username in the socket session for this client
    socket.username = username;
    // Add to users list

    socketsByUsername[socket.username] = socket;
    if(!userForUsername(username)) {
          users.push({name: username});
          ++numUsers;
          addedUser = true;
          socket.emit('login', { numUsers: numUsers});
          // echo globally (all clients) that a person has connected
          socket.broadcast.emit('user joined', {
           username: socket.username,
           numUsers: numUsers
          });
   }
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('user typing', function (typingData) {
        console.log(socket.username + ' is typing...');
        socket.broadcast.emit('user typing', typingData);
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function (typingData) {
        console.log(socket.username + ' stopped typing');
        socket.broadcast.emit('stop typing', typingData);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      removeUserForSocket(socket);
    }
  });
});
