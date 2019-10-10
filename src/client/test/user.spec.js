describe('User Factory', function() {

      // Before each test load our web chat module
      beforeEach(angular.mock.module('WebChat'));



       // A simple test to verify the Messages factory exists
       it('should create a user object', function() {
             let user = new User('my_user');
             expect(user).toBeDefined();
             expect(user.name).toEqual('my_user');
      });

      it('should return true if username is email', function() {
                  const email = "ben@gmail.com";
                  const username = 'benji';
                  let user = new User(email);
                  // Check isEmail returns true if username is email
                  expect(user.isEmail()).toBe(true);
                  // Check isEmail returns false if username is not email
                  let user2 = new User(username);
                  expect(user2.isEmail()).toBe(false);
      });
});
