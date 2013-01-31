var Chai = require('chai');
var Hapi = require('hapi');
var Path = require('path');
var Fs = require('fs');
var Utils = Hapi.Utils;
var expect = Chai.expect;

// harness = "meta" internals

var harness = {};

harness.tests = {};


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
            console.log('[WARN]: no such fixture found for', this.fixture)
            this.run = function(){};
        }
    }
    
    // Set some parametric default behaviors
    
    this.fixture.module = this.fixture.module || this.fixture.name;
    this.fixture.extension = this.fixture.extension || this.fixture.name;
};

// Auto-load tests

(function() {

    var files = Fs.readdirSync(__dirname);
    for(var i in files) {
        var file = files[i];
        var name = Path.basename(file, '.js');
        
        if (file.indexOf('.js') < 0) {
            continue; // skip non .js files
        }
        
        if (file == 'index.js') {
            continue; // skip this file
        }
        
        harness.tests[name] = 1;
        harness.Harness.prototype[name] = require(Path.join(__dirname, file));
    }
})();


harness.Harness.prototype._defaultSettings = {
    path: '',
    viewPath: ''
};


harness.Harness.prototype.run = function () {

    var self = this;
    var fixture = this.fixture;
    var internals = {};
    internals.counts = {};
    
    internals.engine = require(fixture.module);
    internals.viewPath = this.settings.viewPath + fixture.views;
    internals.urlPath = '/' + fixture.name;
    internals.ctx = {
        message: "Hello, World"
    };
    Utils.merge(internals.ctx, fixture.ctx);
    internals.desc = harness.capitalize(fixture.name) + ' templating engine';
    internals.test = function () {

        var options = {
            views: {
                path: internals.viewPath,
                cache: false,
                engines: {}
            },
        };
        options.views.engines[fixture.extension] = {
            module: internals.engine,
            map: fixture.map
        };
        
        // Set options if the test requires it
        
        if (!internals.counts['init']) {
            internals.counts['init'] = 0;
            Object.keys(harness.tests)
                .forEach(function(el, i, arr) {
                    if (self[el].hasOwnProperty('init')) {
                        self[el].init(fixture, options, internals);
                        ++internals.counts['init'];
                    }
                });
        }
        
        internals.server = new Hapi.Server(options);

        // Add tests
        
        if (!internals.counts['tests']) {
            internals.counts['tests'] = {};
            Object.keys(harness.tests)
                .forEach(function(el, i, arr) {
                    self[el](fixture, internals, expect);
                    internals.counts['tests'][el] = 1;
                });
        }
    };

    describe(internals.desc, internals.test);
    
    return internals;
};

module.exports.getEngines = function (path) {

    var files = Fs.readdirSync(path);
    return files.map(function(d){
        return d.slice(0, -3);
    });
};