describe('Resource', function () {
  describe('Resource Controller', function () {
    beforeEach(function () {
      this.request.options.url += 'resource_controller';
    });

    it('call index action', function (done) {
      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resource_controller/index');

        done();
      });
    });

    it('call create action', function (done) {
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resource_controller/create');

        done();
      });
    });

    it('call destroy action', function (done) {
      this.request.options.method = 'delete';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resource_controller/destroy');
        done();
      });
    });

    it('call update action', function (done) {
      this.request.options.method = 'put';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resource_controller/update');
        done();
      });
    });

    describe('with id', function () {
      it('call update action', function (done) {
        this.request.options.url += '/123';
        this.request.options.method = 'put';

        this.request.execute(function (error, response, _body) {
          expect(response.statusCode).toEqual(404);
          done();
        });
      });

      it('call destroy action', function (done) {
        this.request.options.url += '/123';
        this.request.options.method = 'delete';

        this.request.execute(function (error, response, _body) {
          expect(response.statusCode).toEqual(404);
          done();
        });
      });

      it('call show action', function (done) {
        this.request.options.url += '/123';

        this.request.execute(function (error, response, _body) {
          expect(response.statusCode).toEqual(404);
          done();
        });
      });
    });
  });

  describe('Changes default name', function () {
    describe('call with the new name', function () {
      beforeEach(function () {
        this.request.options.url += 'resource_custom_name';
      });

      it('call index action', function (done) {
        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('custom_name/index');

          done();
        });
      });

      it('call create action', function (done) {
        this.request.options.method = 'post';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('custom_name/create');

          done();
        });
      });

      it('call destroy action', function (done) {
        this.request.options.method = 'delete';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('custom_name/destroy');
          done();
        });
      });

      it('call update action', function (done) {
        this.request.options.method = 'put';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('custom_name/update');
          done();
        });
      });

      describe('with id', function () {
        it('call update action', function (done) {
          this.request.options.url += '/123';
          this.request.options.method = 'put';

          this.request.execute(function (error, response, _body) {
            expect(response.statusCode).toEqual(404);
            done();
          });
        });

        it('call destroy action', function (done) {
          this.request.options.url += '/123';
          this.request.options.method = 'delete';

          this.request.execute(function (error, response, _body) {
            expect(response.statusCode).toEqual(404);
            done();
          });
        });

        it('call show action', function (done) {
          this.request.options.url += '/123';

          this.request.execute(function (error, response, _body) {
            expect(response.statusCode).toEqual(404);
            done();
          });
        });
      });
    });
  });
});
