// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
import user from "../fixtures/testUser.json";

Cypress.Commands.add("apiLogin", (email, password) => {
  cy.request("POST", Cypress.config("backendBaseUrl") + "auth/login", {
    email: email || user.email,
    password: password || user.password,
  }).then(({ body, status }) => {
    expect(status).to.eq(200);
    cy.log(body);
    // without quotes "" the token will not work
    localStorage.setItem("token", `"${body.token}"`);
  });
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
