class Events {

      constructor(Users, socket, $http, SocketEvent, Notifications, Channels) {

            // Setup dependencies
            this.Users = Users;
            this.socket = socket;
            this.$http = $http;
            this.SocketEvent = SocketEvent;
            this.Notifications = Notifications;
            this.Channels = Channels;
            // Set active channel
            Channels.setChannelForChannelID('general');
            // Register to receive socket messages
            this.registerSocketEvents();
            // Get existing users already connected
            this.getExistingActiveUsers();
      }

      // Register callbacks for all the socket events emitted from the server
      registerSocketEvents() {
            const self = this;
            const socket = this.socket;
            const SocketEvent = this.SocketEvent;
            // Register socket event
            socket.on(SocketEvent.NEW_MESSAGE, function(data) {
                  self.receiveMessage(data);
            });

            socket.on(SocketEvent.USER_JOINED, function(data) {
                  self.userJoined(data);
            });

            socket.on(SocketEvent.USER_LEFT, function(data) {
                  self.userLeft(data);
            });

            socket.on(SocketEvent.USER_TYPING, function(data) {
                  self.userStartedTyping(data);
            });

            socket.on(SocketEvent.USER_STOPPED_TYPING, function(data) {
                  self.userStoppedTyping(data);
            });

            socket.on(SocketEvent.RECONNECT, function(data) {
                  console.log('Reconnected...');
            });
      }

      // Gets currently active users from server
      getExistingActiveUsers() {
            var self = this;
            this.$http({method: 'get', url: '/users'}).then(function successCallback(response) {
                  var users = response.data;
                  // self.removeUserWithUsername(user.name, users);
                  self.activeUsers = users;
                  self.hasDownloadUsers = true;
                  const currentUsername = self.Users.getUser().name;
                  // Remove current user from list
                  users = users.filter(user => user.name != currentUsername);
                  // Create a DMChannel for each user
                  self.Channels.addDMChannelsForUsers(users);
            });
      }

      // Sends a typing notification to users in current conversation
      sendTypingNotification() {
            const data = {channel: this.Channels.activeChannel.id, user: this.Users.getUser(), type: 'user_typing'};
            this.socket.emit(this.SocketEvent.USER_TYPING, data);
      };

      // Sends a stop typing notification to users in current conversation
      sendStopTypingNotification() {
            const data = {channel: this.Channels.activeChannel.id, user: this.Users.getUser(), type: 'user_stopped_typing'};
            this.socket.emit(this.SocketEvent.USER_STOPPED_TYPING, data);
      }

      // Send Messages
      sendMessage(text) {

            console.log('Sending Message ' + message);
            const message = new Message(text, this.Users.getUser());
            // Add message
            this.Channels.addMessageToChannelWithID(message);

            message.setChannelID(this.Channels.activeChannel.id);
            var serverMessage = {
                  message: {text: text}
            };

            serverMessage['channel'] = this.Channels.activeChannel.id;
            this.socket.emit(this.SocketEvent.NEW_MESSAGE, serverMessage);
      }

      // Receive Message from other user
      receiveMessage(data) {
            console.log('Receiving Message');
            const text = data.message.text;
            const message = new Message(text, data.user, data.createdAt);

            this.Channels.addMessageToChannelWithID(message, data.channel);
            this.Notifications.send(message.user.name + ': ' + message.text);
      }

      // Convenience method to show notification and post system message for text
      showNotification(text) {
            const message =  new NotificationMessage(text);
            this.Channels.addMessageToChannelWithID(message);
            this.Notifications.send(text);
      }

      // Called when user has joined
      userJoined(data) {
            console.log(data.username + ' joined');
            // Append to active users if not current user
            if(data.username !== this.Users.getUser().name) {
                  // Add user to active users
                  const joinedUser = new User(data.username);
                  this.Users.addUser(joinedUser);
                  // Create a channel for user
                  const dmChannel = this.Channels.createDMChannelForUser(joinedUser);
                  // Add channel
                  this.Channels.addChannel(dmChannel);
                  // Show notification
                  var userJoinedMessage = data.username + ' joined'
                  this.showNotification(userJoinedMessage);
                  return true;
            } else {
                  return false;
            }
      }

      // Called when user left the chat room
      userLeft(data) {
            // Remove user
            this.Users.removeUserWithUsername(data.username);
            // Remove channel
            const dmChannelID = DMChannel.idForUsernames(this.Users.user.name , data.username);
            this.Channels.removeChannelWithID(dmChannelID);
            // Send notification
            const leftMessage = data.username + ' left';
            this.showNotification(leftMessage);
      }

      // Called when server sends user started typing message
      userStartedTyping(data) {
            const name = data.user.name;
            this.Channels.channels[data.channel].status = `${name} is typing...`;
      };

      // Called when server sends user stopped typing message
      userStoppedTyping(data) {
            this.Channels.channels[data.channel].status = '';
      };
}


angular.module('WebChat').service('Events', Events);
Events.$inject = ['Users', 'socket', '$http', 'SocketEvent','Notifications', 'Channels'];
