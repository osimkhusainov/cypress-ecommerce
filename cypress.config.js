const { defineConfig } = require("cypress");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportPageTitle: "custom-title",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    videoOnFailOnly: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      screenshotOnRunFailure = true;
    },
    specPattern: [
      "cypress/e2e/main.cy.js",
      "cypress/e2e/item.cy.js",
      "cypress/e2e/cart.cy.js",
      "cypress/e2e/checkout.cy.js",
      "cypress/e2e/api/**",
    ],
    baseUrl: "https://pern-store.netlify.app/",
    backendBaseUrl: `https://pern-store.onrender.com/api/`,
  },

  viewportHeight: 860,
  viewportWidth: 1265,
  chromeWebSecurity: false,
});
