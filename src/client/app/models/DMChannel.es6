class DMChannel extends Channel {

      constructor(currentUser, user) {
            // Calculate channel ID
            // Don't like repeating myself, but can't call static methood from constructor
            const username1 = currentUser.name;
            const username2 = user.name;
            let id;
            if(username1 < username2) {
                  id = username1 + '-' + username2;
            } else {
                  id = username2 + '-' + username1;
            }

            // Init parent
            super(id, user.name);
            // Set type to DM
            this.type = Channel.types().DM;
            this.user = user;
      }

      // Generates a unique ID by combining both usernames
      static idForUsernames(username1, username2) {
            // Order in alpha order
            if(username1 < username2) {
                  return username1 + '-' + username2;
            } else {
                  return username2 + '-' + username1;
            }
      }
}
