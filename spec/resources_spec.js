describe('Resources', function () {
  describe('Resources Controller', function () {
    beforeEach(function () {
      this.request.options.url += 'resources_controller';
    });

    it('call index action', function (done) {
      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resources_controller/index');

        done();
      });
    });

    it('call index action', function (done) {
      this.request.execute(function (error, response, _body) {
        expect(response.statusCode).not.toEqual(404);

        done();
      });
    });

    it('call create action', function (done) {
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resources_controller/create');

        done();
      });
    });

    it('call show action', function (done) {
      this.request.options.url += '/123';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resources_controller/show_123');
        done();
      });
    });

    it('call destroy action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'delete';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resources_controller/destroy_123');
        done();
      });
    });

    it('call update action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'put';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resources_controller/update_123');
        done();
      });
    });

    it('call collection_action action', function (done) {
      this.request.options.url += '/collection_action';
      this.request.options.method = 'get';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resources_controller/collection_action');
        done();
      });
    });

    it('call member_action action', function (done) {
      this.request.options.url += '/123/member_action';
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('resources_controller/member_action_123');
        done();
      });
    });
  });

  describe('Changes default name', function () {
    describe('call with the file name', function () {
      beforeEach(function () {
        this.request.options.url += 'change_name_controller';
      });

      it('returns statusCode 404', function (done) {
        this.request.execute(function (error, response, _body) {
          expect(response.statusCode).toEqual(404);

          done();
        });
      });
    });

    describe('call with the new name', function () {
      beforeEach(function () {
        this.request.options.url += 'custom_name';
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

      it('call show action', function (done) {
        this.request.options.url += '/123';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('custom_name/show');
          done();
        });
      });

      it('call destroy action', function (done) {
        this.request.options.url += '/123';
        this.request.options.method = 'delete';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('custom_name/destroy');
          done();
        });
      });

      it('call update action', function (done) {
        this.request.options.url += '/123';
        this.request.options.method = 'put';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('custom_name/update');
          done();
        });
      });
    });
  });

  describe('Before', function () {
    beforeEach(function () {
      this.request.options.url += 'before_controllers';
    });

    it('call index action', function (done) {
      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('before_controllers/index_foobarzoo');

        done();
      });
    });

    it('call create action', function (done) {
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('before_controllers/create_foo');

        done();
      });
    });

    it('call show action', function (done) {
      this.request.options.url += '/123';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('before_controllers/show_foo');
        done();
      });
    });

    it('call destroy action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'delete';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('before_controllers/destroy');
        done();
      });
    });

    it('call update action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'put';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('before_controllers/update_foo');
        done();
      });
    });
  });

  describe('Nested Controller', function () {
    beforeEach(function () {
      this.request.options.url += 'resources_controller/2/nested_controller';
    });

    it('call index action', function (done) {
      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/index',
        );

        done();
      });
    });

    it('call create action', function (done) {
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/create',
        );

        done();
      });
    });

    it('call show action', function (done) {
      this.request.options.url += '/123';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/show_123',
        );
        done();
      });
    });

    it('call destroy action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'delete';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/destroy_123',
        );
        done();
      });
    });

    it('call update action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'put';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/update_123',
        );
        done();
      });
    });

    it('call collection_action action', function (done) {
      this.request.options.url += '/collection_action';
      this.request.options.method = 'get';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/collection_action',
        );
        done();
      });
    });

    it('call member_action action', function (done) {
      this.request.options.url += '/123/member_action';
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/member_action_123',
        );
        done();
      });
    });
  });

  describe('Double Nested Controller', function () {
    beforeEach(function () {
      this.request.options.url +=
        'resources_controller/2/nested_controller/3/double_nested_controller';
    });

    it('call index action', function (done) {
      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/3/double_nested_controller/index',
        );

        done();
      });
    });

    it('call create action', function (done) {
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/3/double_nested_controller/create',
        );

        done();
      });
    });

    it('call show action', function (done) {
      this.request.options.url += '/123';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/3/double_nested_controller/show_123',
        );
        done();
      });
    });

    it('call destroy action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'delete';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/3/double_nested_controller/destroy_123',
        );
        done();
      });
    });

    it('call update action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'put';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/3/double_nested_controller/update_123',
        );
        done();
      });
    });

    it('call collection_action action', function (done) {
      this.request.options.url += '/collection_action';
      this.request.options.method = 'get';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/3/double_nested_controller/collection_action',
        );
        done();
      });
    });

    it('call member_action action', function (done) {
      this.request.options.url += '/123/member_action';
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/nested_controller/3/double_nested_controller/member_action_123',
        );
        done();
      });
    });
  });

  describe('Double Nested Controller', function () {
    beforeEach(function () {
      this.request.options.url +=
        'resources_controller/2/after_double_nested_controller';
    });

    it('call index action', function (done) {
      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/after_double_nested_controller/index',
        );

        done();
      });
    });

    it('call create action', function (done) {
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/after_double_nested_controller/create',
        );

        done();
      });
    });

    it('call show action', function (done) {
      this.request.options.url += '/123';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/after_double_nested_controller/show_123',
        );
        done();
      });
    });

    it('call destroy action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'delete';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/after_double_nested_controller/destroy_123',
        );
        done();
      });
    });

    it('call update action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'put';

      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual(
          'resources_controller/2/after_double_nested_controller/update_123',
        );
        done();
      });
    });
  });
});
