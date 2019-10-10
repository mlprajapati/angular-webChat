describe('Filter: channel', function() {
      var channelFilter;

      beforeEach(angular.mock.module('WebChat'));
      beforeEach(inject(function(_channelFilter_) {
            channelFilter = _channelFilter_;
      }));

      it('should insert a hashtag in front of channel name', function() {
            expect(channelFilter('general')).toEqual('#general');
      });

      it('should insert @ in front of DM channel name', function() {
            expect(channelFilter('Benjamin', true)).toEqual('@Benjamin');
      });

});
