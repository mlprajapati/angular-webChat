describe('Message Object', function() {

      var user = {name: 'steve'};

       it('should create a message object', function() {
             const date = new Date();
             const messageText = 'my message';
             const message = new Message(messageText, user, new Date());
             // Assertions
             expect(message).toBeDefined();
             expect(message.text).toEqual(messageText);
             expect(message.createdAt).toEqual(date);
      });

      it('should create a message without date parameter', function() {
            const messageText = 'my message';
            const message = new Message(messageText, user);
            // Assertions
            expect(message).toBeDefined();
            expect(message.text).toEqual(messageText);
            expect(message.createdAt).toEqual(jasmine.Any(Date));
            expect(message.user).toEqual(user);
      })

      it('is user message', function() {
            const message = new Message('test', user);
            expect(message.isUserMessage).toBe(true);
      });

      it('it is not notification', function() {
            const message = new Message('test', user);
            expect(message.isNotification).toBe(undefined);
      });
});

describe('NotificationMessage Object', function() {

      it('should create a notification message', function() {
            const text = 'my notification';
            const notificationMessage = new NotificationMessage(text);

            expect(notificationMessage).toBeDefined();
            expect(notificationMessage.text).toEqual(text);
            expect(notificationMessage.createdAt).toEqual(jasmine.Any(Date));
            expect(notificationMessage.user).toEqual({name: 'System'});
      });

      it('is a notification message', function() {
            const text = 'my notification';
            const notificationMessage = new NotificationMessage(text);
            expect(notificationMessage.isNotification).toBe(true);
      });

      it('is not a user message', function() {
            const text = 'my notification';
            const notificationMessage = new NotificationMessage(text);
            expect(notificationMessage.isUserMessage).toBe(false);
      });



})
