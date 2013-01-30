var Chai = require('chai');
var Hapi = require('hapi');
var Path = require('path');
var Utils = Hapi.Utils;
var expect = Chai.expect;


var harness = {};


harness.capitalize = function (str) {

    return str.charAt(0).toUpperCase() + str.slice(1);
};


exports = module.exports = harness.Harness = function (fixture, settings) {

    this.fixture = fixture || {};
    this.settings = Utils.applyToDefaults(this._defaultSettings, settings || {});
    
    if (typeof this.fixture == 'string') {
        filename = Path.join(this.settings.path, this.fixture);
        try {
            this.fixture = require(filename);
        }
        catch (e) {
            console.log('no such fixture found for', this.fixture)
            this.run = function(){};
        }
    }
    
    this.fixture.module = this.fixture.module || this.fixture.name;
    this.fixture.extension = this.fixture.extension || this.fixture.name;
};


harness.Harness.prototype._defaultSettings = {
    path: '',
    viewPath: '/../support/views/'
};


harness.Harness.prototype.run = function () {

    var fixture = this.fixture;
    var internals = {};
    
    internals.engine = require(fixture.module);
    internals.viewPath = __dirname + this.settings.viewPath + fixture.views;
    internals.urlPath = '/' + fixture.name;
    internals.ctx = {
        message: "Hello, World"
    };
    Utils.merge(internals.ctx, fixture.ctx);
    internals.handler = function (request) {

        request.reply.view('index', internals.ctx).send();
    };

    internals.desc = harness.capitalize(fixture.name) + ' templating engine';
    internals.test = function () {

        var options = {
            views: {
                path: internals.viewPath,
                engines: {}
            },
        };
        options.views.engines[fixture.extension] = {
            module: internals.engine,
            map: fixture.map
        };
        
        var server = new Hapi.Server(options);
        server.addRoute({ method: 'GET', path: internals.urlPath, config: { handler: internals.handler } });


        it('should render basic template', function (done) {

            server.inject({ method: 'GET', url: internals.urlPath }, function (res) {

                expect(res.result).to.exist;
                expect(res.result).to.contain(internals.ctx.message);
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    };

    describe(internals.desc, internals.test);
    
    return internals;
};

