module.exports = {
    name: "underscore",
    views: "underscore",
    extension: 'tmpl',
    map: {
        compile: (function(engine){
            return (function (tmpl, options, ctx) {
                return engine.template(tmpl, ctx || null, options || null);
            });
        })
    }
}