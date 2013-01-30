module.exports = {
    name: "handlebars",
    module: 'handlebars',
    views: "mustache",
    extension: 'html',
    ctx: {
        'engine': 'Handlebars',
        'complex': {
            'message': "Hello, Complex World!"
        }
    },
    partials: {
        path: 'partials/',
        filename: 'partial'
    }
};