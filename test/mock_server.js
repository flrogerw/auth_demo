const express = require('express');
const resolve = require('json-refs').resolveRefs;
const YAML = require('js-yaml');
const fs = require('fs');
const OpenApiValidator = require('express-openapi-validator');
const { init } = require('../src/routes');


/**
 * Set up Constants.
 */
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const app = express();

/**
 * Body Parsers
 */
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

/**
 *  Set up swagger validator middleware.
 */
app.use(OpenApiValidator.middleware({ apiSpec: YAML.load(fs.readFileSync('./src/static/auth_swagger.yaml').toString())}));

/**
 * Error function required by the swagger validator.
 */
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (!err.status && !err.errors) {
        res.status(500).json({ error: [{ message: err.message }] });
    } else {
        res.status(err.status).json({ errors: err.message });
    }
});

init(app);
app.listen(PORT);
module.exports = { app, url: `http://localhost:${PORT}` };

