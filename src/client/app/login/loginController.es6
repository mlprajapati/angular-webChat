class LoginController {

      constructor(Users, $scope, $location, $http) {
            this.Users = Users;
            this.username = '';
            this.$location = $location;
            this.$http = $http;
      }

      // Checks with the server that the username is available, if it is, login the user
      attemptToLogin(username) {
            const self = this;
            this.$http({method: 'get', url: '/users/available?username=' + username}).then(function successCallback(response) {
                  if(response.data.isAvailable) {
                        self.login(username);
                  } else {
                        // Display error message
                        self.info = 'username is not available. Try something else';
                  }
            });
      }

      // Performs login operation and reroutes view
      login(username) {
            // Login user
            this.Users.setUser(username);
            // Show Chat view
            this.$location.path('/chat');
      }

      // Called when form is submitted
      processLogin(shouldGenerateUsername) {
            // Check if should generate a random username
            if(shouldGenerateUsername) {
                  this.attemptToLogin(this.Users.randomID());
            } else {
                  const username = this.username;
                  this.attemptToLogin(username);
            }
      }
}

angular.module('WebChat').controller( 'LoginController', LoginController);
LoginController.$inject = ['Users', '$scope', '$location', '$http'];
