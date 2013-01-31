module.exports = {
    name: "hogan",
    module: 'hogan.js',
    views: "mustache",
    extension: 'html',
    disableComplex: true,
    ctx: {
        'engine': 'Hogan.js',
        'complex': {
            'message': "Hello, Complex World!"
        }
    },
    map: {
        compile: (function(engine){
            return engine.compile;
        }),
        execute: (function() {
            return function (engine, compiled, ctx, options, partials) {
                return function(ctx, options) {
                    return compiled.render(ctx, partials || {});
                }
            }
        })
    }
}