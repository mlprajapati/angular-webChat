describe('LoginController', function() {

      var $controller;
      var Users;
      var loginController;
      var $scope;
      var $location;
      // Before each test load our web chat module
      beforeEach(angular.mock.module('WebChat'));

      // Before each test set our injected Messages factory (_Messages_) to our local Messages variable
       beforeEach(inject(function(_$controller_, _Users_, _$location_) {
         $controller = _$controller_;
         Users = _Users_;
         $scope = {};
         $location = _$location_;
         loginController = $controller('LoginController', { $scope: $scope });
       }));

       // A simple test to verify the Login Controller exists
       it('should exist', function() {
             expect($controller).toBeDefined();
      });

      it('should set user and change location to chat route', function() {
            loginController.username = 'my_user';
            spyOn(Users, 'setUser');
            loginController.login( 'my_user');

            // Check that it sets a new user
            expect(Users.setUser).toHaveBeenCalledWith('my_user');
            // Check location route
            expect($location.path()).toBe('/chat');

      });


});
