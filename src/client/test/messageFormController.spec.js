describe('MessageFormController', function() {

      var $controller;
      var $http;
      var mfController;
      var $scope;
      var Events
      var Channels;
      // Before each test load our web chat module
      beforeEach(angular.mock.module('WebChat'));

      // Before each test set our injected Messages factory (_Messages_) to our local Messages variable
       beforeEach(inject(function(_$controller_, _$http_, _Events_, _Channels_) {
         $controller = _$controller_;
         $http = _$http_;
         Events = _Events_;
         Channels = _Channels_;
         $scope = {};
         mfController = $controller('MessageFormController', { $scope: $scope });
       }));

       // A simple test to verify the Message Form Controller exists
       it('should exist', function() {
            expect(mfController).toBeDefined();
      });

      it('isTyping should be _typing', function() {
            expect(mfController.isTyping).toBe(mfController._typing);
      });

      it('should verify messages with length equal to 0 with false', function() {
            expect(mfController.messageIsValid('')).toBe(false);
      });

      it('should verify messages with length > 0 with true', function() {
            expect(mfController.messageIsValid('m')).toBe(true);
      });

      it('return true if timeDifference is greater than timeout while typing', function() {
            expect(mfController.didReachTypingTimeout(100,10, true));
      });

      it('return false if timeDifference is less than timeout while typing', function() {
            expect(mfController.didReachTypingTimeout(10, 100, true));
      })

      it('return false if not typing ', function() {
            expect(mfController.didReachTypingTimeout(100,10, false));
      });

      it('it should set isTyping to true if not and send typing notification', function() {
            mfController._typing = false;
            spyOn(Events, "sendTypingNotification");
            mfController.isTyping = true;
            // Check if value was sent
            expect(mfController.isTyping).toBe(true);
            // Check if notification was sent
            expect(Events.sendTypingNotification).toHaveBeenCalled();
      });

      it('it should not send typing notification when isTyping is set to true, if already typing', function() {
            mfController._typing = true;
            spyOn(Events, "sendTypingNotification");
            mfController.isTyping = true;
            // Check if notification was sent
            expect(Events.sendTypingNotification).not.toHaveBeenCalled();
      });

      it('it should set isTyping to false if typing and send notification', function() {
            mfController._typing = true;
            spyOn(Events, "sendStopTypingNotification");
            mfController.isTyping = false;
            // Check if value was sent
            expect(mfController.isTyping).toBe(false);
            // Check if notification was sent
            expect(Events.sendStopTypingNotification).toHaveBeenCalled();
      });

      it('it should send message and reset message', function(){
            spyOn(Events, "sendMessage");
            const message = {text:'some stuff'};
            mfController.message = message;
            mfController._typing = false;
            mfController.send();

            expect(Events.sendMessage).toHaveBeenCalledWith('some stuff');
            expect(mfController.isTyping).toBe(false);
            // Check resets message
            expect(mfController.message, {});
      });
});
