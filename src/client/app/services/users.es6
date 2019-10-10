class Users {

      constructor(socket, $http, SocketEvent) {
            this.socket = socket;
            this.$http = $http;
            this.SocketEvent = SocketEvent;

            this.activeUsers = [];
            this.user = {};
            this.hasDownloadUsers = false;
      }

      // generates random ID for a username
      randomID(length) {
            // If length not present, then use default length
            length = length || 5;
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 5; i++ ) {
                  text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
      }

      removeUserWithUsername(username) {
            console.log('removing user ' + username);
            // Remove user
            for(var i = 0; i < this.activeUsers.length; i++) {
                  if(this.activeUsers[i].name === username) {
                        console.log('found removing user ' + username);

                        // Remove from array
                        this.activeUsers.splice(i, 1);
                        break;
                  }
            }
      }

      getExistingUsersRequest() {
            return $http({method: 'get', url: '/users'});
      }

      // Gets currently active users from server
      getExistingActiveUsers() {
            var self = this;
            getExistingUsersRequest().then(function successCallback(response) {
                  var users = response.data;
                  // self.removeUserWithUsername(user.name, users);
                  self.activeUsers = users;
                  self.hasDownloadUsers = true;
            });
      }

      sendNewUserToServer(user) {
            // Tell the server your username
            this.socket.emit(this.SocketEvent.ADD_USER, user.name);
      }

      // Adds user to active users
      addUser(user) {
            this.activeUsers.push(user);
            this.sendNewUserToServer(user);
      }

      getUser() {
            return this.user;
      }

      // Sets current user and send new user message to server
      setUser(username = this.randomID()) {
            this.user = new User(username);
            this.socket.emit('add user', username);
      }
}

Users.$inject = ['socket','$http', 'SocketEvent'];
angular.module('WebChat').service('Users', Users);
