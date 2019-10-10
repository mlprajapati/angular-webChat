class Channels {

      constructor(Users) {
            this.presetChannels = ['general'];
            // currently active channel, this will be a reference to an object in channels
            this.activeChannel = {};

            this.channels = {};
            this.channelCollection = [];
            this.Users = Users;
            // create and add channels for all preset channels
            this.addChannelsWithNames(this.presetChannels);
      }

      // Convenience function to create a channel for each name in names
      addChannelsWithNames(names) {
            // Create conversations
            names.forEach((name) => {
                  const channel = new Channel(name, name);
                  this.addChannel(channel);
            });
      }

      // Checks whether a channel with id exists in hash
      hasChannelWithID(id) {
            return this.channels.hasOwnProperty(id);
      }

      // Sets current active channel to channel with channelID
      setChannelForChannelID(channelID) {
            this.activeChannel = this.channels[channelID];
            if(this.activeChannel) {
                  this.activeChannel.markAsRead();
            }
      }

      // Convenience function to create a direct message channel
      // between current user and a specific user
      createDMChannelForUser(user) {
            return new DMChannel(this.Users.getUser(), user);
      }

      // Convenience function to which creates and adds a DMChannel for each user in users
      addDMChannelsForUsers(users) {
            const self = this;
            users.forEach((user) => {
                  var userChannel = self.createDMChannelForUser(new User(user.name));
                  self.addChannel(userChannel);
            });
      }

      // Adds a channel to hash channels
      addChannel(channel) {
            this.channels[channel.id] = channel;
            this.channelCollection.push(this.channels[channel.id]);
      }

      // Removes a specific channel with channel id
      removeChannelWithID(channelID) {
            // Remove from hash
            delete this.channels[channelID];
            // Remove channel from array
            for(var i = 0; i < this.channelCollection.length; i++) {
                  if(this.channelCollection[i].id === channelID) {
                        this.channelCollection.splice(i, 1);
                        break;
                  }
            }
      }

      /**
       Adds a message to channel with ID
       If no channelID is provided, default to activeChannel
       */
      addMessageToChannelWithID(message, channelID = this.activeChannel.id) {
            this.channels[channelID].addMessage(message);
            if(this.activeChannel.id !== channelID) {
                  // Update unreadCount
                  this.channels[channelID].unreadCount += 1;
            }
      }

}

angular.module('WebChat').service( 'Channels', Channels);
Channels.$inject = ['Users'];
