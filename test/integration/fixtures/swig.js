module.exports = {
    name: "swig",
    views: "swig",
    extension: 'swig',
    map: {
        compile: (function(engine){
            return engine.compile;
        })
    }
}