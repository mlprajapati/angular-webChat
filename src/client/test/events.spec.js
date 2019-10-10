describe('Events Service', function() {

      var Events;
      var Users;
      var socket;
      var SocketEvent;
      var Notifications;
      var Channels
      // Before each test load our web chat module
      beforeEach(angular.mock.module('WebChat'));

      // Before each test set our injected Events factory (_Events_) to our local Events variable
       beforeEach(inject(function(_Events_,_Users_,_socket_,_SocketEvent_,_Notifications_, _Channels_) {
         Events = _Events_;
         Users = _Users_;
         socket = _socket_;
         SocketEvent = _SocketEvent_;
         Notifications = _Notifications_;
         Channels = _Channels_;
       }));

       // A simple test to verify the Events factory exists
       it('should exist', function() {
             expect(Events).toBeDefined();
      });

      // Test user join
      it('should add user and send notification when user joins', function() {
            var username = 'test123';
            var user = {name: username};

            spyOn(Events, "showNotification");
            Events.userJoined({username: username});

            // Check that new user is in active users
            expect(Users.activeUsers[Users.activeUsers.length - 1].name).toEqual(username);

            // Check that it sends a notification
            expect(Events.showNotification).toHaveBeenCalled();
      });

      // Test user join doesn't add current user
      it('should not add user and send notification when current user joins', function() {
            var username = 'myUser';
            Users.setUser(username);

            spyOn(Events, "showNotification");
            var result = Events.userJoined({username: username});
            expect(result).toBe(false);
            // Check that new user is not in active users
            expect(Users.activeUsers).not.toContain({name: username});
            expect(Events.showNotification).not.toHaveBeenCalled();
            console.log(Users.activeUsers);

      });

      it('should remove user and send notification when user leaves', function() {
            var user = {name: 'leavingUser'};
            Users.addUser(user);
            spyOn(Events, "showNotification");

            Events.userLeft({username: user.name});
            expect(Users.activeUsers).not.toContain(user);
            expect(Events.showNotification).toHaveBeenCalled();
      });

      it('should emit typing event on socket', function() {
            spyOn(socket, "emit");
            Events.sendTypingNotification();
            expect(socket.emit).toHaveBeenCalledWith('user typing', jasmine.any(Object));
      });

      it('should emit stop typing event on socket', function() {
            spyOn(socket, "emit");
            Events.sendStopTypingNotification();
            expect(socket.emit).toHaveBeenCalledWith('stop typing', jasmine.any(Object));
      });


      it('should send message via socket and add message to conversation', function() {
            // Setup spies
            spyOn(socket, 'emit');
            spyOn(Channels, 'addMessageToChannelWithID');

            var messageText = 'my message';
            Events.sendMessage(messageText);
            // Check that it calls add message
            expect(Channels.addMessageToChannelWithID).toHaveBeenCalled();
            // Check that emits to socket
            expect(socket.emit).toHaveBeenCalledWith(SocketEvent.NEW_MESSAGE, jasmine.any(Object));
      });

      it('should receive message, add message to conversation and show notification', function() {
            var channel = 'testChannel';
            var message = {
                  message: 'hello',
                  user: {name: 'testUser123'},
                  type: 'message',
                  createdAt: new Date(),
                  channel: channel
            };

            // Setup spies
            spyOn(Channels, 'addMessageToChannelWithID');
            spyOn(Notifications, 'send');
            Events.receiveMessage(message);

            expect(Channels.addMessageToChannelWithID).toHaveBeenCalledWith(jasmine.any(Object), channel);
            expect(Notifications.send).toHaveBeenCalled();
      });

      it('should send notifcation and add system message to conversation', function() {
            var notificationText = 'Benjamin has left the building';
            // Setup spies
            spyOn(Channels, 'addMessageToChannelWithID');
            spyOn(Notifications, 'send');

            Events.showNotification(notificationText);
            expect(Channels.addMessageToChannelWithID).toHaveBeenCalled();
            expect(Notifications.send).toHaveBeenCalled();

      });

});
