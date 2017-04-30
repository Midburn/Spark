const auth = require('./auth')();
const unless = require('express-unless');

const devApi = path => path.startsWith('/dev');
const loginUrl = path => path.startsWith('/jwt-login');

const containLoginToken = req => (req.cookies && req.cookies[auth.SessionCookieName]) || false;

module.exports = app => {
    app.use(auth.initialize());

    const authenticate = auth.authenticate();
    authenticate.unless = unless;

    app.use(authenticate.unless(req => devApi(req.path) || (loginUrl(req.path) && !containLoginToken(req))));

    return auth;
};
