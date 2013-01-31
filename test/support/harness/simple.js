module.exports = function (fixture, internals, expect) {

    internals.simpleTemplateHandler = function (request) {

        request.reply.view('index', internals.ctx).send();
    };
    internals.simpleUrlPath = internals.urlPath;
    internals.server.addRoute({ method: 'GET', path: internals.simpleUrlPath, config: { handler: internals.simpleTemplateHandler } });
    
    it('should render simple template', function (done) {

        internals.server.inject({ method: 'GET', url: internals.simpleUrlPath }, function (res) {

            expect(res.result).to.exist;
            expect(res.result).to.contain(internals.ctx.message);
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
}