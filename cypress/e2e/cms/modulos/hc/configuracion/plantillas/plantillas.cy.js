describe("Test grupos de servicio", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Historias clinicas",
    });
  });

  it("abre opcion de plantillas", () => {
    cy.get("button").contains("Configuración", { waitBefore: true }).should("be.visible");
    cy.get("button").contains("Configuración").click();
    cy.get('[href="/hc/configuracion/plantillas"]').should("contain", "Plantillas");
    cy.get('[href="/hc/configuracion/plantillas"]').click();
    cy.get("h2").contains("Plantillas").should("be.visible");
  });

  it("crea plantilla", () => {
    cy.visit(`${Cypress.env().hostName}/hc/configuracion/plantillas`);
    cy.get("button").contains("Nueva plantilla").should("be.visible");
    cy.get("button").contains("Nueva plantilla").click();

    cy.get("p").contains("Cree o actualice una plantilla").should("be.visible");
    cy.get("#name").type(`${Cypress.env().dataTemplates[0].name}`);
    cy.get("#description").type(`${Cypress.env().dataTemplates[0].description}`);
    cy.intercept("POST", `${Cypress.env().urlApi}/v1/templates`).as("creacionCorrecta");
    cy.get("button").contains("Guardar").click();
    cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);
  });

  it("busca y agrega etiqueta a una plantilla", () => {
    cy.visit(`${Cypress.env().hostName}/hc/configuracion/plantillas`);
    cy.get('#search').type(`${Cypress.env().dataTemplates[0].name}`);
    cy.get(`#${Cypress.env().dataTemplates[0].name}_labels`).click();
    cy.intercept("POST", `**/v1/template-template-labels`).as("etiquetaAgregada");
    cy.get(`#label_0`).click();
    cy.wait("@etiquetaAgregada").its("response.statusCode").should("eq", 200);
  });

  it("busca y elimina etiqueta a una plantilla", () => {
    cy.visit(`${Cypress.env().hostName}/hc/configuracion/plantillas`);
    cy.get('#search').type(`${Cypress.env().dataTemplates[0].name}`);
    cy.intercept("DELETE", `**/v1/template-template-labels/delete`).as("etiquetaEliminada");
    cy.get('button').contains('✕').click();
    cy.wait("@etiquetaEliminada").its("response.statusCode").should("eq", 200);
  });

  it("busca y archiva una plantilla", () => {
    cy.visit(`${Cypress.env().hostName}/hc/configuracion/plantillas`);
    cy.get('#search').type(`${Cypress.env().dataTemplates[0].name}`);
    cy.get(`#${Cypress.env().dataTemplates[0].name}_menu`).click();
    cy.get("button").contains("Archivar").click();
    cy.get("button").contains("Confirmar").click();
    cy.contains("Se actualizó el estado correctamente").should("be.visible");
  });

  it("busca y restaura una plantilla", () => {
    cy.visit(`${Cypress.env().hostName}/hc/configuracion/plantillas`);
    cy.get('#search').type(`${Cypress.env().dataTemplates[0].name}`);
    cy.get('#status').click();
    cy.get('span').contains('Archivada').click();
    cy.get(`#${Cypress.env().dataTemplates[0].name}_menu`).click();
    cy.get("button").contains("Restaurar").click();
    cy.get("button").contains("Confirmar").click();
    cy.contains("Se actualizó el estado correctamente").should("be.visible");
  });

  it("busca y revisa versiones de una plantilla", () => {
    cy.visit(`${Cypress.env().hostName}/hc/configuracion/plantillas`);
    cy.get('#search').type(`${Cypress.env().dataTemplates[0].name}`);
    cy.get(`#${Cypress.env().dataTemplates[0].name}_menu`).click();
    cy.get("button").contains("Ver versiones").click();
    cy.contains("Versiones de plantilla").should("be.visible");
  });
});
