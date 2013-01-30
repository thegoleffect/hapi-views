var Fs = require('fs');
var Harness = require('../support/harness');
var options = {
    path: __dirname + '/fixtures/',
    viewPath: __dirname + '/../support/views/'
};


var main = function () {
    
    var engines = Harness.getEngines(options.path);
    
    for(var i in engines) {
        var name = engines[i];
        var TestSuite = new Harness(name, options);
        var output = TestSuite.run();
    }
};


main();