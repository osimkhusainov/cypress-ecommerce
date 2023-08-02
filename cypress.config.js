const { defineConfig } = require('cypress');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  
  e2e: {
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return config;
    },
    baseUrl: 'https://pern-store.netlify.app/',
    backendBaseUrl: 'https://pern-store.onrender.com/api/',
    env: {
      allureReuseAfterSpec: true
  }
    
  },
 
  viewportHeight: 860,
  viewportWidth: 1265,
  chromeWebSecurity: false,
});
