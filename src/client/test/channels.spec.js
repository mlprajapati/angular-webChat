describe('Channels Service', function() {

      var Users;
      var Channels;

      // Before each test load our web chat module
      beforeEach(angular.mock.module('WebChat'));

      // Before each test set our injected Messages factory (_Messages_) to our local Messages variable
       beforeEach(inject(function(_Users_,_Channels_) {
         Users = _Users_;
         Channels = _Channels_;
         Users.setUser('testUser');
       }));

       // A simple test to verify the Channels service exists
       it('should exist', function() {
             expect(Channels).toBeDefined();
      });

       it('should have channel with ID if it exists', function() {
            var channelID = 'my_channel_id';
            var channel = new Channel(channelID, 'channel_name');
            Channels.channels[channelID] = channel;
            expect(Channels.hasChannelWithID(channelID)).toBe(true);
       });

       it('should not have channel with ID it doesnt exists', function() {
            var channelID = 'abc123';
            expect(Channels.hasChannelWithID(channelID)).toBe(false);
       });


       it('should create DMChannel for current user and other user', function() {
             var user = new User('alex');
             var dmChannelForUser = Channels.createDMChannelForUser(user);
             expect(dmChannelForUser).toEqual(jasmine.any(DMChannel));
             expect(dmChannelForUser.user).toEqual(user);
             expect(dmChannelForUser.id).toEqual(DMChannel.idForUsernames('testUser', user.name));

       });

       it('should add channel', function() {
            var channelID = 'test123';
            var channel = new Channel(channelID, 'channel_name');
            Channels.addChannel(channel);
            expect(Channels.channels[channelID]).toEqual(channel);
       });

       it('should add message to channel with ID', function() {
             var user = new User('alex');
             var channel = Channels.createDMChannelForUser(user);

             var message = {
                  message: 'my message',
                  user: Users.getUser(),
                  type: 'message',
                  createdAt: new Date()
            };

            Channels.addChannel(channel);
            Channels.addMessageToChannelWithID(message, channel.id);
            expect(channel.messages).toContain(message);
       });


       it('should add DMChannels for each user', function() {
             var users = [{name: 'alex'}, {name: 'Pete'}];
             Channels.addDMChannelsForUsers(users);
             var alexDM = Channels.createDMChannelForUser(users[0]);
             var peteDM = Channels.createDMChannelForUser(users[1]);

             expect( Channels.channels[alexDM.id]).toBeDefined();
             expect( Channels.channels[peteDM.id]).toBeDefined();

      });

 });
