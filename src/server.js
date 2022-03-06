const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const resolve = require('json-refs').resolveRefs;
const YAML = require('js-yaml');
const fs = require('fs');
const OpenApiValidator = require('express-openapi-validator');

/**
 * Set up Constants.
 */
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const app = express();

/**
 * Handle UnHandled errors.
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * Enable CORS
 */
app.use(cors());

/**
 * Body Parsers
 */
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

/**
 * Hide server type. (No need to broadcast)
 */
app.disable('x-powered-by');

/**
 *  Compile swagger docs from references
 */
const root = YAML.load(fs.readFileSync('./src/static/swagger/root.yaml').toString());
const options = {
  filter: ['relative', 'remote'],
  loaderOptions: {
    processContent: (res, callback) => {
      callback(null, YAML.load(res.text));
    }
  }
};

/**
 *  Set up swagger validator middleware.
 */
resolve(root, options).then((results) => {
  app.use(OpenApiValidator.middleware({ apiSpec: results.resolved }));
  fs.writeFile('./src/static/auth_swagger.yaml', YAML.dump(results.resolved), (err) => {
    if (err) { logger.error(`Could not create swagger.yaml: ${err.message}`); }
  });

/**
 * Expose public folder to webserver.
 */
app.use(express.static( __dirname + '/public'));


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

  routes.init(app);
  app.listen(PORT, HOST);
  console.log(`Running on http://${HOST}:${PORT}`);
});
