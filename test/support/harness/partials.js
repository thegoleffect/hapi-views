var Path = require('path');

module.exports = function (fixture, internals, expect) {

    if (fixture.partials) {
        internals.partialsTemplateHandler = function (request) {

            request.reply.view(fixture.partials.filename, internals.ctx).send();
        };
        internals.partialsUrlPath = internals.urlPath + '/partials';
        internals.server.addRoute({ method: 'GET', path: internals.partialsUrlPath, config: { handler: internals.partialsTemplateHandler } });
        
        // console.log("engines", internals.server.views.engines._e.html)
        
        it('should render partials template', function (done) {

            internals.server.inject({ method: 'GET', url: internals.partialsUrlPath }, function (res) {

                expect(res.result).to.exist;
                expect(res.result).to.contain(internals.ctx.message);
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    }
};


module.exports.init = function (fixture, options, internals) {

    if (fixture.partials) {
        options.views.partials = {
            path: Path.join(internals.viewPath, fixture.partials.path)
        };
    }
};

