const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();

const express = require('express');
const authRoute = require('./auth');

const init = (server) => {
  server.get('/health-check', (req, res) => {
    res.send('OK');
  });

  server.use('/auth', authRoute);
  const options = { index: 'index.html' };

  server.use('/auth/docs', (req, res) => res.redirect('/docs'));
  server.use('/docs', express.static('src/static', options));
  ['swagger-ui.css', 'swagger-ui.js', 'swagger-ui-bundle.js', 'swagger-ui-standalone-preset.js'].forEach((file) => {
    server.get(`/docs/${file}`, (req, res) => {
      res.sendFile(`${swaggerUiAssetPath}/${file}`);
    });
  });
};

module.exports = {
  init
};
