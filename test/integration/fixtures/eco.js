module.exports = {
    name: "eco",
    views: "eco",
    extension: 'eco',
    map: {
        compile: (function(engine){
            return engine.compile;
        }),
    }
}