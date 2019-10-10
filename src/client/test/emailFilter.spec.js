describe('Filter: email', function() {
  var emailFilter;

  beforeEach(angular.mock.module('WebChat'));
  beforeEach(inject(function(_emailFilter_) {
    emailFilter = _emailFilter_;
  }));

  it('should return true if input is a valid email', function() {
        expect(emailFilter('user@gmail.com')).toBe(true);
 });

 it('should return false if input is not a valid email', function() {
       expect(emailFilter('Benjamin')).toBe(false);
 });

});
