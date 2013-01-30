module.exports = {
    name: "ejs",
    views: "ejs",
    extension: 'ejs',
    map: {
        compile: (function(engine){
            return engine.compile;
        }),
    }
}