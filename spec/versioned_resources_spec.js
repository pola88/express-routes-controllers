describe('Resources', function () {
  describe('Versioned Resources Controller', function () {
    describe('when no "Accept" header', function () {
      beforeEach(function () {
        this.request.options.url += 'versioned_resources_controller';
      });

      it('call action with last version as default', function (done) {
        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('v2/versioned_resources_controller/index');

          done();
        });
      });

      it('call deprecated_member_action action with last version as default', function (done) {
        this.request.options.url += '/123/deprecated_member_action';
        this.request.options.method = 'get';

        this.request.execute(function (error, response, _body) {
          expect(response.statusCode).toEqual(406);
          done();
        });
      });
    });

    describe('when unexistent version on "Accept" header', function () {
      beforeEach(function () {
        this.request.options.url += 'versioned_resources_controller';
        this.request.options.headers = {};
        this.request.options.headers.Accept =
          'application/json, application/vnd.test.v5+json';
      });

      it('call index action using last version as default', function (done) {
        this.request.execute(function (error, response, _body) {
          expect(response.statusCode).toEqual(200);

          done();
        });
      });

      it('call deprecated_member_action using last version as default', function (done) {
        this.request.options.url += '/123/deprecated_member_action';
        this.request.options.method = 'get';

        this.request.execute(function (error, response, _body) {
          expect(response.statusCode).toEqual(406);
          done();
        });
      });
    });

    describe('when "Accept" header with application/vnd.test.v1+json', function () {
      beforeEach(function () {
        this.request.options.url += 'versioned_resources_controller';
        this.request.options.headers = {};
        this.request.options.headers.Accept =
          'application/json, application/vnd.test.v1+json';
      });

      it('call index action', function (done) {
        this.request.execute(function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(body.msg).toEqual('v1/versioned_resources_controller/index');

          done();
        });
      });

      it('call create action', function (done) {
        this.request.options.method = 'post';

        this.request.execute(function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(body.msg).toEqual('v1/versioned_resources_controller/create');

          done();
        });
      });

      it('call show action', function (done) {
        this.request.options.url += '/123';

        this.request.execute(function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(body.msg).toEqual(
            'v1/versioned_resources_controller/show_123',
          );
          done();
        });
      });

      it('call destroy action', function (done) {
        this.request.options.url += '/123';
        this.request.options.method = 'delete';

        this.request.execute(function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(body.msg).toEqual(
            'v1/versioned_resources_controller/destroy_123',
          );
          done();
        });
      });

      it('call update action', function (done) {
        this.request.options.url += '/123';
        this.request.options.method = 'put';

        this.request.execute(function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(body.msg).toEqual(
            'v1/versioned_resources_controller/update_123',
          );
          done();
        });
      });

      it('call collection_action action', function (done) {
        this.request.options.url += '/collection_action';
        this.request.options.method = 'get';

        this.request.execute(function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(body.msg).toEqual(
            'v1/versioned_resources_controller/collection_action',
          );
          done();
        });
      });

      it('call deprecated_member_action action', function (done) {
        this.request.options.url += '/123/deprecated_member_action';
        this.request.options.method = 'get';

        this.request.execute(function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(body.msg).toEqual(
            'v1/versioned_resources_controller/deprecated_member_action',
          );
          done();
        });
      });

      it('call member_action action', function (done) {
        this.request.options.url += '/123/member_action';
        this.request.options.method = 'post';

        this.request.execute(function (error, response, body) {
          expect(response.statusCode).toEqual(200);
          expect(body.msg).toEqual(
            'v1/versioned_resources_controller/member_action_123',
          );
          done();
        });
      });

      it('call unexisting member action', function (done) {
        this.request.options.url += '/123/unexisting_action';
        this.request.options.method = 'get';

        this.request.execute(function (error, response, _body) {
          expect(response.statusCode).toEqual(404);
          done();
        });
      });
    });

    describe('Changes default name', function () {
      describe('call with the file name', function () {
        beforeEach(function () {
          this.request.options.url += 'change_name_controller';
          this.request.options.headers = {};
          this.request.options.headers.Accept =
            'application/json, application/vnd.test.v1+json';
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
          this.request.options.url += 'versioned_custom_name';
          this.request.options.headers = {};
          this.request.options.headers.Accept =
            'application/json, application/vnd.test.v1+json';
        });

        it('call index action', function (done) {
          this.request.execute(function (error, response, body) {
            expect(body.msg).toEqual('v1/versioned_custom_name/index');

            done();
          });
        });

        it('call create action', function (done) {
          this.request.options.method = 'post';

          this.request.execute(function (error, response, body) {
            expect(body.msg).toEqual('v1/versioned_custom_name/create');

            done();
          });
        });

        it('call show action', function (done) {
          this.request.options.url += '/123';

          this.request.execute(function (error, response, body) {
            expect(body.msg).toEqual('v1/versioned_custom_name/show');
            done();
          });
        });

        it('call destroy action', function (done) {
          this.request.options.url += '/123';
          this.request.options.method = 'delete';

          this.request.execute(function (error, response, body) {
            expect(body.msg).toEqual('v1/versioned_custom_name/destroy');
            done();
          });
        });

        it('call update action', function (done) {
          this.request.options.url += '/123';
          this.request.options.method = 'put';

          this.request.execute(function (error, response, body) {
            expect(body.msg).toEqual('v1/versioned_custom_name/update');
            done();
          });
        });
      });
    });

    describe('Before', function () {
      beforeEach(function () {
        this.request.options.url += 'versioned_before_controllers';
        this.request.options.headers = {};
        this.request.options.headers.Accept =
          'application/json, application/vnd.test.v1+json';
      });

      it('call index action', function (done) {
        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'v1/versioned_before_controllers/index_foobar',
          );
          done();
        });
      });

      it('call create action', function (done) {
        this.request.options.method = 'post';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'v1/versioned_before_controllers/create_foo',
          );

          done();
        });
      });

      it('call show action', function (done) {
        this.request.options.url += '/123';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('v1/versioned_before_controllers/show_foo');
          done();
        });
      });

      it('call destroy action', function (done) {
        this.request.options.url += '/123';
        this.request.options.method = 'delete';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('v1/versioned_before_controllers/destroy');
          done();
        });
      });

      it('call update action', function (done) {
        this.request.options.url += '/123';
        this.request.options.method = 'put';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'v1/versioned_before_controllers/update_foo',
          );
          done();
        });
      });
    });

    describe('Nested Controller', function () {
      beforeEach(function () {
        this.request.options.url +=
          'versioned_resources_controller/2/versioned_nested_controller';
        this.request.options.headers = {};
        this.request.options.headers.Accept =
          'application/json, application/vnd.test.v1+json';
      });

      it('call index action', function (done) {
        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'versioned_resources_controller/2/v1/versioned_nested_controller/index',
          );

          done();
        });
      });

      it('call create action', function (done) {
        this.request.options.method = 'post';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'versioned_resources_controller/2/v1/versioned_nested_controller/create',
          );

          done();
        });
      });

      it('call show action', function (done) {
        this.request.options.url += '/123';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'versioned_resources_controller/2/v1/versioned_nested_controller/show_123',
          );
          done();
        });
      });

      it('call destroy action', function (done) {
        this.request.options.url += '/123';
        this.request.options.method = 'delete';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'versioned_resources_controller/2/v1/versioned_nested_controller/destroy_123',
          );
          done();
        });
      });

      it('call update action', function (done) {
        this.request.options.url += '/123';
        this.request.options.method = 'put';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'versioned_resources_controller/2/v1/versioned_nested_controller/update_123',
          );
          done();
        });
      });

      it('call collection_action action', function (done) {
        this.request.options.url += '/collection_action';
        this.request.options.method = 'get';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'versioned_resources_controller/2/v1/versioned_nested_controller/collection_action',
          );
          done();
        });
      });

      it('call member_action action', function (done) {
        this.request.options.url += '/123/member_action';
        this.request.options.method = 'post';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'versioned_resources_controller/2/v1/versioned_nested_controller/member_action_123',
          );
          done();
        });
      });

      it('call unexisting member action', function (done) {
        this.request.options.url += '/123/unexisting_action';
        this.request.options.method = 'get';

        this.request.execute(function (error, response, _body) {
          expect(response.statusCode).toEqual(404);
          done();
        });
      });
    });
  });

  describe('header with application/vnd.test.v2+json', function () {
    beforeEach(function () {
      this.request.options.url += 'versioned_resources_controller';
      this.request.options.headers = {};
      this.request.options.headers.Accept =
        'application/json, application/vnd.test.v2+json';
    });

    it('call index action', function (done) {
      this.request.execute(function (error, response, body) {
        expect(response.statusCode).toEqual(200);
        expect(body.msg).toEqual('v2/versioned_resources_controller/index');

        done();
      });
    });

    it('call create action', function (done) {
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(response.statusCode).toEqual(200);
        expect(body.msg).toEqual('v2/versioned_resources_controller/create');

        done();
      });
    });

    it('call show action', function (done) {
      this.request.options.url += '/123';

      this.request.execute(function (error, response, body) {
        expect(response.statusCode).toEqual(200);
        expect(body.msg).toEqual('v2/versioned_resources_controller/show_123');
        done();
      });
    });

    it('call destroy action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'delete';

      this.request.execute(function (error, response, body) {
        expect(response.statusCode).toEqual(200);
        expect(body.msg).toEqual(
          'v2/versioned_resources_controller/destroy_123',
        );
        done();
      });
    });

    it('call update action', function (done) {
      this.request.options.url += '/123';
      this.request.options.method = 'put';

      this.request.execute(function (error, response, body) {
        expect(response.statusCode).toEqual(200);
        expect(body.msg).toEqual(
          'v2/versioned_resources_controller/update_123',
        );
        done();
      });
    });

    it('call collection_action action', function (done) {
      this.request.options.url += '/collection_action';
      this.request.options.method = 'get';

      this.request.execute(function (error, response, body) {
        expect(response.statusCode).toEqual(200);
        expect(body.msg).toEqual(
          'v2/versioned_resources_controller/collection_action',
        );
        done();
      });
    });

    it('call deprecated_member_action action', function (done) {
      this.request.options.url += '/123/deprecated_member_action';
      this.request.options.method = 'get';

      this.request.execute(function (error, response, _body) {
        expect(response.statusCode).toEqual(406);
        done();
      });
    });

    it('call member_action action', function (done) {
      this.request.options.url += '/123/member_action';
      this.request.options.method = 'post';

      this.request.execute(function (error, response, body) {
        expect(response.statusCode).toEqual(200);
        expect(body.msg).toEqual(
          'v2/versioned_resources_controller/member_action_123',
        );
        done();
      });
    });
  });

  describe('Wildcard Versioned Resources Controller', function () {
    beforeEach(function () {
      this.request.options.url += 'wildcard_resources_controller';
      this.request.options.headers = {};
      this.request.options.headers.Accept =
        'application/json, application/vnd.test.v1+json';
    });

    it('call index action', function (done) {
      this.request.execute(function (error, response, body) {
        expect(body.msg).toEqual('wildcard_resources_controller/index');

        done();
      });
    });
  });

  describe('Mix of Versioned and Non Versioned Resources Controller', function () {
    describe('parent is not versioned but nested is', function () {
      beforeEach(function () {
        this.request.options.url +=
          'non_versioned_resources_controller/2/versioned_nested_controller';
        this.request.options.headers = {};
        this.request.options.headers.Accept =
          'application/json, application/vnd.test.v1+json';
      });

      it('call action of versioned_nested_controller/index', function (done) {
        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'non_versioned_resources_controller/2/v1/versioned_nested_controller/index',
          );

          done();
        });
      });
    });

    describe('parent is versioned but nested is not', function () {
      beforeEach(function () {
        this.request.options.url +=
          'versioned_resources_controller/2/non_versioned_nested_controller';
        this.request.options.headers = {};
        this.request.options.headers.Accept =
          'application/json, application/vnd.test.v1+json';
      });

      it('call action of non_versioned_nested_controller/index', function (done) {
        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'versioned_resources_controller/2/non_versioned_nested_controller/index',
          );

          done();
        });
      });
    });
  });

  describe('Fallback to previous versioned Resources Controller', function () {
    describe('fallback to v1', function () {
      it('call action of v1', function (done) {
        this.request.options.url += 'fallback_to_v1_resources_controller';
        this.request.options.headers = {};
        this.request.options.headers.Accept =
          'application/json, application/vnd.test.v2+json';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual('fallback_to_v1_resources_controller/index');

          done();
        });
      });
    });

    describe('fallback to base version', function () {
      it('call action of non_versioned_nested_controller/index', function (done) {
        this.request.options.url += 'fallback_to_base_resources_controller';
        this.request.options.headers = {};
        this.request.options.headers.Accept =
          'application/json, application/vnd.test.v2+json';

        this.request.execute(function (error, response, body) {
          expect(body.msg).toEqual(
            'fallback_to_base_resources_controller/index',
          );

          done();
        });
      });
    });
  });
});
