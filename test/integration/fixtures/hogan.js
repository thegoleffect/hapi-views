module.exports = {
    name: "hogan",
    module: 'hogan.js',
    views: "mustache",
    extension: 'html',
    ctx: {
        'engine': 'Hogan.js'
    },
    map: {
        compile: (function(engine){
            return engine.compile;
        })
    }
}