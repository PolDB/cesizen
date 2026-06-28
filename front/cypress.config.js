const { defineConfig } = require('cypress');

process.env.TS_NODE_PROJECT = './cypress/tsconfig.json';

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081',
    setupNodeEvents(on, config) {},
  },
});