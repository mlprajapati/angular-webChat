// A channel object contains information about a chat room and it's messages
class Channel {

      // If no name is provided use the channel id
      constructor(id, name = id) {
            this.id = id;
            this.name = name;

            if(name === 'general') {
                  this.isGeneral = true;
            }

            this.created = new Date();
            this.type = Channel.types().CHANNEL;
            this.messages = [];
            this.unreadCount = 0;
      }

      static types() {
            return {
                  CHANNEL: 0,
                   DM: 1
            };
      }

      // Checks if channel is public to all users
      get isChannel() {
            return this.type == Channel.types().CHANNEL;
      };

      // Checks if channel is a private channel (direct message betwen users)
      get isDM() {
            return this.type == Channel.types().DM;
      };

      // Adds a message to the messages array
      addMessage(message) {
            this.messages.push(message);
      }

      get conversationStatus() {
            if(this.status) {
                  return this.status;
            } else {
                  return '';
            }
      }

      get hasUnreadMessage() {
            return this.unreadCount > 0;
      }

      // Resets the unread count
      markAsRead() {
            this.unreadCount = 0;
      }
}
