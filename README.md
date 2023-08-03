# Cypress e-commerce automated testing
## Instruction how to run tests
### Before running commands in a code editor's terminal follow the steps below:
1. Install `VS Code` - https://code.visualstudio.com/download
2. Install `Node` via `nvm` - https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/
3. The demo website used in the project - https://pern-store.netlify.app/



### Steps to run tests from a terminal:
#### Note: Tests contain 3 UI bugs that caught by automated scripts.
1. Download / clone current repository (`git clone https://github.com/osimkhusainov/cypress-ecommerce.git`)
2. Use `npm install` in the VSCode terminal
3. Use `npm run cy:run` to run tests headlessly or `npm run cy:open` to open Cypress in browser
4. Once it's done, use `npm run report:open` to open an HTML report in browser


### Folder structure:
- Test spec files are in `cypress/e2e/` (UI and API)    
- Mock data files are in `cypress/fixtures/`
- Reports are in `cypress/reports`


### Helpful resources:
Cypress documentation - https://docs.cypress.io/api

Mochawesome HTML reporter - https://github.com/LironEr/cypress-mochawesome-reporter#readme


## Screenshot examples 
### Mochawesome reporter 
![mochreport](https://github.com/osimkhusainov/cypress-ecommerce/assets/57813114/be557ad0-e280-4200-8d87-d2fb88059489)

### Terminal
![trmnl cypress](https://github.com/osimkhusainov/cypress-ecommerce/assets/57813114/f2c15f77-6cdf-4776-b3cf-9825353824e4)


## Video example


https://github.com/osimkhusainov/cypress-ecommerce/assets/57813114/5cb1a80c-35fb-463c-90b4-4c0247667ed9




