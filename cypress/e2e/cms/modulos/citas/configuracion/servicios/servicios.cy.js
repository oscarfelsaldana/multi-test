describe("Test servicio", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
    });
  });

  it("status grupo de servicio en servicio", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/grupos-servicio`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/service-groups?order=desc&status=&search=${Cypress.env().dataServiceGroup[0].code}&skip=0&take=20`
    ).as("grupoADesactivar");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataServiceGroup[0].code);
    cy.wait("@grupoADesactivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    cy.get("button").contains("Nuevo servicio").should("be.visible");
    cy.get("button").contains("Nuevo servicio").click();
    cy.get("p").contains("Cree o actualice un servicio").should("be.visible");
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/service-groups?order=desc&status=true&search=${Cypress.env().dataServiceGroup[0].code}&skip=0&take=20`
    ).as("grupoNoEncontrado");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataServiceGroup[0].code);
    cy.wait("@grupoNoEncontrado").its("response.body.data.totalRecords").should("eq", 0);

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/grupos-servicio`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/service-groups?order=desc&status=&search=${Cypress.env().dataServiceGroup[0].code}&skip=0&take=20`
    ).as("grupoAActivar");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataServiceGroup[0].code);
    cy.wait("@grupoAActivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    cy.get("button").contains("Nuevo servicio").should("be.visible");
    cy.get("button").contains("Nuevo servicio").click();
    cy.get("p").contains("Cree o actualice un servicio").should("be.visible");
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/service-groups?order=desc&status=true&search=${Cypress.env().dataServiceGroup[0].code}&skip=0&take=20`
    ).as("grupoEncontrado");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataServiceGroup[0].code);
    cy.wait("@grupoNoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
  });

  it("abre opción de servicios", () => {
    cy.get("button").contains("Configuración").should("be.visible");
    cy.get("button").contains("Configuración").click();

    cy.get('[href="/citas/configuracion/servicios"').should("contain", "Servicios");
    cy.get('[href="/citas/configuracion/servicios"]').click();
    cy.get("h2").contains("Servicios").should("be.visible");
  });

  it("crea servicios", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    cy.get("button").contains("Nuevo servicio").should("be.visible");

    Cypress.env().dataServices.forEach((service) => {
      cy.get("button").contains("Nuevo servicio").click();
      cy.intercept(
        "GET",
        `${Cypress.env().urlApi}/v1/service-groups?order=desc&status=true&search=${Cypress.env().dataServiceGroup[0].code}&skip=0&take=20`
      ).as("grupoEncontrado");
      cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataServiceGroup[0].code);
      cy.wait("@grupoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
      cy.get("span").contains(`${Cypress.env().dataServiceGroup[0].code} -`).click();
      cy.get("#code").type(service.code);
      cy.get("#description").type(service.description);
      cy.intercept("POST", `${Cypress.env().urlApi}/v1/services`).as("creacionCorrecta");
      cy.get("button").contains("Guardar").click();
      cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);
    });
  });

  it("busca y edita servicio", () => {
    var cod = 2;

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/services?order=desc&status=&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
    ).as("servicioEncontrado");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataServices[0].code);
    cy.wait("@servicioEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg[data-permission="citas.configuration.service.modify"]').click();
    cy.get("p").contains("Cree o actualice un servicio").should("be.visible");
    cy.get("#description").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Servicio actualizado exitosamente").should("be.visible");
  });

  it("cambia estado web de un servicio", () => {
    var cod = 2;

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/services?order=desc&status=&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
    ).as("servicioEncontrado");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataServices[0].code);
    cy.wait("@servicioEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('button[role="switch"]').eq(0).click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    cy.get('button[role="switch"]').eq(0).click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
  });

  it("cambio estado y filtro de estado", () => {
    var cod = 2;

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/services?order=desc&status=&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
    ).as("servicioEncontrado");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataServices[0].code);
    cy.wait("@servicioEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('button[role="switch"]').eq(1).click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/services?order=desc&status=false&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
    ).as("servicioInactivoEncontrado");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    cy.wait("@servicioInactivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('button[role="switch"]').eq(1).click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/services?order=desc&status=true&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
    ).as("servicioActivoEncontrado");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    cy.wait("@servicioActivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
  });
});
