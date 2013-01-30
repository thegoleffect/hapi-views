var Harness = require('../support/harness');
var engines = [
    'eco',
    'ejs',
    'hogan',
    'swig',
    'underscore'
];
var options = {
    path: __dirname + '/fixtures/',
};


var main = function () {
    for(var i in engines) {
        var name = engines[i];
        var TestSuite = new Harness(name, options);
        TestSuite.run();
    }
};


main();