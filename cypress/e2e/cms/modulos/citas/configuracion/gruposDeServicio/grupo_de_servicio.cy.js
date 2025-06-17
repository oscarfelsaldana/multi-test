describe("Test grupos de servicio", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
    });
  });

  it("abre grupo de servicios", () => {
    cy.get("button").contains("Configuración", { waitBefore: true }).should("be.visible");
    cy.get("button").contains("Configuración").click();
    cy.get('[href="/citas/configuracion/grupos-servicio"]').should("contain", "Grupos de servicio");
    cy.get('[href="/citas/configuracion/grupos-servicio"]').click();
    cy.get("h2").contains("Grupos de servicio").should("be.visible");
  });

  it("crea grupo de servicio", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/grupos-servicio`);
    cy.get("button").contains("Nuevo grupo de servicio").should("be.visible");
    cy.get("button").contains("Nuevo grupo de servicio").click();

    cy.get("p").contains("Cree o actualice un grupo de servicio").should("be.visible");
    cy.get("#code").type(`${Cypress.env().dataServiceGroup[0].code}`);
    cy.get("#description").type(`${Cypress.env().dataServiceGroup[0].description}`);
    cy.intercept("POST", `${Cypress.env().urlApi}/v1/service-groups`).as("creacionCorrecta");
    cy.get("button").contains("Guardar").click();
    cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);

    cy.get("button").contains("Nuevo grupo de servicio").click();

    cy.get("#code").type(`${Cypress.env().dataServiceGroup[0].code}`);
    cy.get("#description").type("PCy-grupo incorrecto");
    cy.intercept("POST", `${Cypress.env().urlApi}/v1/service-groups`).as("creacionIncorrecta");
    cy.get("button").contains("Guardar").click();
    cy.wait("@creacionIncorrecta").its("response.statusCode").should("eq", 417);
  });

  it("busca y edita grupo de servicio", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/grupos-servicio`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/service-groups?search=${Cypress.env().dataServiceGroup[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("grupoEncontrado");
    cy.get('#search').type(`${Cypress.env().dataServiceGroup[0].code}`);
    // cy.wait("@grupoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#modify').click();
    cy.get("p").contains("Cree o actualice un grupo de servicio").should("be.visible");
    cy.get("#description").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Grupo de servicio actualizado exitosamente").should("be.visible");
  });

  it("cambio estado y filtro de estado", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/grupos-servicio`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/service-groups?search=${Cypress.env().dataServiceGroup[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("grupoEncontrado");
    cy.get('#search').type(`${Cypress.env().dataServiceGroup[0].code}`);
    // cy.wait("@grupoEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#statusModify').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/service-groups?search=${Cypress.env().dataServiceGroup[0].code}&status=false&order=desc&take=20&skip=0&page=0`
    // ).as("grupoInactivoEncontrado");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    // cy.wait("@grupoInactivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#statusModify').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/service-groups?search=${Cypress.env().dataServiceGroup[0].code}&status=true&order=desc&take=20&skip=0&page=0`
    // ).as("grupoActivoEncontrado");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    // cy.wait("@grupoActivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#modify').click();
  });
});
