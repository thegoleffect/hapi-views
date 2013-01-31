var Fs = require('fs');
var Path = require('path');

module.exports = function (fixture, internals, expect) {

    if (fixture.disableComplex != true && Fs.existsSync(Path.join(internals.viewPath, 'complex.' + fixture.extension))) {
        internals.complexTemplateHandler = function (request) {

            request.reply.view('complex', internals.ctx).send();
        };
        internals.complexUrlPath = internals.urlPath + '/complex';
        internals.server.addRoute({ method: 'GET', path: internals.complexUrlPath, config: { handler: internals.complexTemplateHandler } });
        
        it('should render complex template', function (done) {

            internals.server.inject({ method: 'GET', url: internals.complexUrlPath }, function (res) {

                expect(res.result).to.exist;
                // console.log('complex result', typeof res.result, res.result)
                expect(res.result).to.contain(internals.ctx.message);
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    }
};

