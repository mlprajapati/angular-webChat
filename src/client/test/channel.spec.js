describe("Channel", function() {

      var channelID = 'myChannelID';
      var channelName = 'myChannelName';
      var channel;

      beforeEach(function() {
            channel = new Channel(channelID, channelName);
      });

      it('should create channel with ID and name', function() {

            expect(channel.id).toEqual(channelID);
            expect(channel.name).toEqual(channelName);
            expect(channel.type).toEqual(Channel.types().CHANNEL);
      });

      it('is channel', function() {
            expect(channel.isChannel).toBe(true);
      });

      it('should not be DM', function() {
            expect(channel.isDM).toBe(false);
      });

      it('should add message', function() {
            var message = {
                  message: 'my message text',
                  user: {name: 'my_user'},
                  type: 'message',
                  createdAt: new Date()
            };
            var originalUnread = channel.unreadCount;
            channel.addMessage(message);
            // Check that message has been added
            expect(channel.messages).toContain(message);

      });

      it('should return empty string if not status is present', function() {
            expect(channel.conversationStatus).toEqual('');
      });

      it('should get status', function() {
            var status = 'Matt is typing';
            channel.status = status;
            expect(channel.conversationStatus).toEqual(status);
      })

      it('should reset unreadCount', function() {
            channel.unreadCount = 10;
            expect(channel.unreadCount).toEqual(10);
            channel.markAsRead();
            expect(channel.unreadCount).toEqual(0);
      });
});
