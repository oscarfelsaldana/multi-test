Cypress.Commands.add("login", ({ email, password, module }) => {

  cy.visit(Cypress.env().hostName);
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get("button").contains("Iniciar sesión").click();
  cy.get('body', { waitBefore: true }).contains(module);

  cy.contains(module).click();
});

Cypress.Commands.add("permiso", ({ permiso, id }) => {});

import '@4tw/cypress-drag-drop';
import 'cypress-real-events/support';
