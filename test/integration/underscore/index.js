var Chai = require('chai');
var Hapi = require('hapi');


// Declare internals

var internals = {};


// Test shortcuts

var expect = Chai.expect;


describe('Underscore template', function () {

    var viewPath = __dirname + '/views';
    var message = "Hello, World";
    var handler = function (request) {

        request.reply.view('index', { message: message }).send();
    };
    
    var server = new Hapi.Server({
        views: {
            path: viewPath,
            engines: {
                'tmpl': {
                    module: 'underscore',
                    map: {
                        compile: function (engine) {

                            return engine.template;
                        }
                    }
                }
            }
        }
    });
    server.addRoute({ method: 'GET', path: '/underscore', config: { handler: handler } });


    it('should', function (done) {

        server.inject({ method: 'GET', url: '/underscore'}, function (res) {

            expect(res.result).to.exist;
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
});