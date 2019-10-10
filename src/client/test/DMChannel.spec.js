describe("DMChannel", function() {

      var user1 = {name: 'ben'};
      var user2 = {name: 'jack'};
      var channel;

      beforeEach(function() {
            channel = new DMChannel(user1, user2);
      });

      it('should generate unique ID by combining usernames in any order', function() {
            var expectedID = 'ben-jack';
            expect(DMChannel.idForUsernames(user1.name, user2.name)).toEqual(expectedID);
            expect(DMChannel.idForUsernames(user2.name, user1.name)).toEqual(expectedID);
      });


      it('should create DM Channel for users', function() {
            var expectedID = 'ben-jack';
            expect(channel.id).toEqual(expectedID);
            console.log(channel.name);
            expect(channel.name).toEqual(user2.name);
            expect(channel.user).toEqual(user2);
      });

      it('is DM', function() {
            expect(channel.isDM).toBe(true);
      });

      it('is not channel', function() {
            expect(channel.isChannel).toBe(false);
      });
});
