describe('OverrideDefaultActions Controller', function () {
  beforeEach(function () {
    this.request.options.url += 'override_default_actions';
  });

  it('call create action', function (done) {
    this.request.options.method = 'post';
    this.request.options.url += '/123';

    this.request.execute(function (error, response, body) {
      expect(body.msg).toEqual('override_default_actions/create_123');

      done();
    });
  });

  it('call create action', function (done) {
    this.request.options.method = 'put';

    this.request.execute(function (error, response, body) {
      expect(body.msg).toEqual('override_default_actions/update');

      done();
    });
  });
});
