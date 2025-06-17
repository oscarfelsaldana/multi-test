describe("Test especialidades", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
    });
  });

  it("abre especialidades", () => {
    cy.get("button").contains("Configuración").should("be.visible");
    cy.get("button").contains("Configuración").click();
    cy.get('[href="/citas/configuracion/especialidades"').should("contain", "Especialidades");
    cy.get('[href="/citas/configuracion/especialidades"]').click();
    cy.get("h2").contains("Especialidades").should("be.visible");
  });

  it("crea especialidades", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/especialidades`);
    cy.get("button").contains("Nueva especialidad").should("be.visible");

    Cypress.env().dataSpecializations.forEach((specialization) => {
      cy.get("button").contains("Nueva especialidad").click();
      cy.get("p").contains("Cree o actualice una especialidad").should("be.visible");
      cy.get("#code").type(specialization.code);
      cy.get("#description").type(specialization.description);
      cy.intercept("POST", `${Cypress.env().urlApi}/v1/specializations`).as("creacionCorrecta");
      cy.get("button").contains("Guardar").click();
      cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);
    });
  });

  it("busca y edita especialidad", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/especialidades`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/specializations?search=${Cypress.env().dataSpecializations[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("especialidadEncontrada");
    cy.get('#search').type(Cypress.env().dataSpecializations[0].code);
    // cy.wait("@especialidadEncontrada").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#modify').click();
    cy.get("p").contains("Cree o actualice una especialidad").should("be.visible");
    cy.get("#description").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Especialidad actualizada exitosamente").should("be.visible");
  });

  it.only("cambio estado y filtro de estado", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/especialidades`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/specializations?search=${Cypress.env().dataSpecializations[0].code}&status=&order=desc&take=20&skip=0&page=0`
      
    // ).as("especialidadEncontrada");
    cy.get('#search').type(Cypress.env().dataSpecializations[0].code);
    // cy.wait("@especialidadEncontrada").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#statusModify').eq(0).click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/specializations?search=${Cypress.env().dataSpecializations[0].code}&status=false&order=desc&take=20&skip=0&page=0`
    // ).as("especialidadInactivaEncontrada");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    // cy.wait("@especialidadInactivaEncontrada").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#statusModify').eq(0).click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/specializations?search=${Cypress.env().dataSpecializations[0].code}&status=true&order=desc&take=20&skip=0&page=0`
    // ).as("especialidadActivaEncontrada");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    // cy.wait("@especialidadActivaEncontrada").its("response.body.data.totalRecords").should("eq", 1);
  });
});
