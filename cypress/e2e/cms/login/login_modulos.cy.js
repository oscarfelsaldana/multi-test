describe("test login", () => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.visit(Cypress.env().hostName);
  });

  it("acceso incorrecto", () => {
    cy.get("#email").type("usuarioincorrecto@email.com");
    cy.get("#password").type("passwordincorrecta");
    
    cy.intercept("POST", `${Cypress.env().hostName}/api/auth/callback/credentials?`).as("auth");
    cy.get("button").contains("Iniciar sesión").click();
    cy.wait('@auth').its('response.statusCode').should('eq', 401)
  });

  it("acaceso correcto y comprueba modulos", () => {
    cy.get("#email").type(Cypress.env().dataOperators[0].email);
    cy.get("#password").type(Cypress.env().dataOperators[0].password);

    cy.intercept("GET", `${Cypress.env().urlApi}/v1/modules/operator`).as("modulos");

    cy.get("button").contains("Iniciar sesión").click();
    cy.get("h2").contains("MultiSalud SAS").should("be.visible");

    var modules = [];
    cy.wait("@modulos").then((interception) => {
      modules = interception.response.body.data;

      if (modules.some((x) => x.value == "administrador")) {
        cy.log("entro admin");
        cy.get("a").contains("Administrador").should("be.visible");
      }

      if (modules.some((x) => x.value == "citas")) {
        cy.log("entro citas");
        cy.get("a").contains("Citas").should("be.visible");
      }

      if (modules.some((x) => x.value == "digiturno")) {
        cy.log("entro digiturno");
        cy.get("a").contains("Digiturno").should("be.visible");
      }
    });
  });
});
