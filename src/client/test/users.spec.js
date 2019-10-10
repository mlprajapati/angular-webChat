describe('Users Service', function() {

      var Users;

      // Before each test load our web chat module
      beforeEach(angular.mock.module('WebChat'));

      // Before each test set our injected Users factory (_Users_) to our local Messages variable
       beforeEach(inject(function(_Users_) {
         Users = _Users_;
       }));

       // A simple test to verify the Users factory exists
       it('should exist', function() {
             expect(Users).toBeDefined();
       });

       // Test random ID function
       it('should generate random id', function() {
             var id = Users.randomID();
             // Check that it exists
             expect(id).toBeDefined();
             // Check that it is string
             expect(id).toEqual(jasmine.any(String));
             // Check that string length is greater than 0
             expect(id.length).toBeGreaterThan(0);
       });

       it('should set user', function() {
             var username = 'unit_tester';
             Users.setUser(username);
             expect(Users.user).toBeDefined();
             expect(Users.user.name).toEqual(username);
       });

       it('should get user', function() {
            var username = 'unit_tester';
            Users.setUser(username);
            var currentUser = Users.getUser();
       });

       it('should add user', function() {
             var username = 'tester';
             var user = new User(username);
             // Add test user
             Users.addUser(user);
             // Check that active users is not empty
             expect(Users.activeUsers.length).toBeGreaterThan(0);

             // Check that the last user is the user we just added
             var lastUser = Users.activeUsers[Users.activeUsers.length - 1];
             expect(lastUser).toEqual(user);
             expect(Users.activeUsers).toContain(user);
       });

       it('should remove user', function() {
            var username = 'user_to_remove';
            var user = {name: username};
            // Add test user
            Users.addUser(user);
            // Check that user is now in active users
            expect(Users.activeUsers).toContain(user);
            // Remove user
            Users.removeUserWithUsername(username);
            // Check that user is no longer in active users
            expect(Users.activeUsers).not.toContain(user);

       });

       it('should get existing users from server', function() {
             // Calls the right correct

             // Sets active user
       });

       it('should send user to server via socket', function() {

       });

});
