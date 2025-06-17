describe("Test aseguradoras", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
    });
  });

  it("abre opción de aseguradoras", () => {
    cy.get("button").contains("Configuración").should("be.visible");
    cy.get("button").contains("Configuración").click();
    cy.get('[href="/citas/configuracion/aseguradoras"').should("contain", "Aseguradoras");
    cy.get('[href="/citas/configuracion/aseguradoras"]').click();
    cy.get("h2").contains("Aseguradoras").should("be.visible");
  });

  it("crea aseguradoras", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/aseguradoras`);
    cy.get("button").contains("Nueva aseguradora").should("be.visible");

    Cypress.env().dataHealthCompanies.forEach((healthCompanie) => {
      cy.get("button").contains("Nueva aseguradora").click();
      cy.get("p").contains("Cree o actualice los datos básicos y servicios de la aseguradora").should("be.visible");
      cy.get("#code").type(healthCompanie.code);
      cy.get("#taxIDNumber").type(healthCompanie.taxIDNumber);
      cy.get("#name").type(healthCompanie.name);
      cy.get("span").contains("Seleccione una opción").click();
      cy.get("span").contains(healthCompanie.regime).should("be.visible");
      cy.get("span").contains(healthCompanie.regime).click();
      cy.get("#address").type(healthCompanie.address);
      cy.intercept("POST", `${Cypress.env().urlApi}/v1/health-companies`).as("creacionCorrecta");
      cy.get("button").contains("Guardar").click();
      cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);
    });
  });

  it("busca y edita aseguradora", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/aseguradoras`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/health-companies?search=${Cypress.env().dataHealthCompanies[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("aseguradoraEncontrada");
    cy.get('#search').type(Cypress.env().dataHealthCompanies[0].code);
    // cy.wait("@aseguradoraEncontrada").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#modify').click();
    cy.get("p").contains("Cree o actualice los datos básicos y servicios de la aseguradora");
    cy.get("#name").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Aseguradora actualizada exitosamente").should("be.visible");
  });

  it("revisa estatus de servicio y lo agrega a una aseguradora", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/services?search=${Cypress.env().dataServices[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("servicioADesactivar");
    cy.get('#search').type(Cypress.env().dataServices[0].code);
    // cy.wait("@servicioADesactivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#statusModify').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/aseguradoras`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/health-companies?search=${Cypress.env().dataHealthCompanies[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("aseguradoraEncontradaIni");
    cy.get('#search').type(Cypress.env().dataHealthCompanies[0].code);
    // cy.wait("@aseguradoraEncontradaIni").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#modify').click();
    cy.get("button").contains("Servicios").click();
    cy.contains("Filtre en el campo de servicios y seleccione el que desee agregar").should("be.visible");

    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/services?order=desc&status=true&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
    // ).as("servicioNoEncontrado");
    cy.get('#service').type(Cypress.env().dataServices[0].code);
    // cy.wait("@servicioNoEncontrado").its("response.body.data.totalRecords").should("eq", 0);

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/services?search=${Cypress.env().dataServices[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("servicioAActivar");
    cy.get('#search').type(Cypress.env().dataServices[0].code);
    // cy.wait("@servicioAActivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#statusModify').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/aseguradoras`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/health-companies?search=${Cypress.env().dataHealthCompanies[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("aseguradoraEncontradaFin");
    cy.get('#search').type(Cypress.env().dataHealthCompanies[0].code);
    // cy.wait("@aseguradoraEncontradaFin").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#modify').click();
    cy.get("button").contains("Servicios").click();

    Cypress.env().dataHealthCompanies.forEach(healthCompanie => {
      cy.visit(`${Cypress.env().hostName}/citas/configuracion/aseguradoras`);

      // cy.intercept(
      //   "GET",
      //   `${Cypress.env().urlApi}/v1/health-companies?search=${healthCompanie.code}&status=&order=desc&take=20&skip=0&page=0`
      // ).as("aseguradoraEncontradaFin");
      cy.get('#search').type(healthCompanie.code);
      // cy.wait("@aseguradoraEncontradaFin").its("response.body.data.totalRecords").should("eq", 1);
      cy.get('#modify').click();
      cy.get("button").contains("Servicios").click();
      // cy.intercept(
      //   "GET",
      //   `${Cypress.env().urlApi}/v1/services?order=desc&status=true&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
      // ).as("servicioEncontrado1");
      cy.get('#service').type(Cypress.env().dataServices[0].code);
      // cy.wait("@servicioEncontrado1").its("response.body.data.totalRecords").should("eq", 1);
      cy.get("span").contains(`${Cypress.env().dataServices[0].code} -`).should("be.visible");
      cy.get("span").contains(`${Cypress.env().dataServices[0].code} -`).click();
      cy.get("td").contains(Cypress.env().dataServices[0].description).should("be.visible");
    });
  });

  it("elimina y vuelve a agregar servicio", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/aseguradoras`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/health-companies?search=${Cypress.env().dataHealthCompanies[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("aseguradoraEncontrada");
    cy.get('#search').type(Cypress.env().dataHealthCompanies[0].code);
    // cy.wait("@aseguradoraEncontrada").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#modify').click();

    cy.get("button").contains("Servicios").click();

    cy.get("button").contains("Eliminar").eq(0).should("be.visible");
    cy.get("button").contains("Eliminar").eq(0).click();

    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/services?order=desc&status=true&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
    // ).as("servicioEncontrado");
    cy.get('#service').type(Cypress.env().dataServices[0].code);
    // cy.wait("@servicioEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get("span").contains(`${Cypress.env().dataServices[0].code} -`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataServices[0].code} -`).click();

    cy.get("td").contains(Cypress.env().dataServices[0].description).should("be.visible");
  });

  it.only("cambio estado y filtro de estado", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/aseguradoras`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/health-companies?search=${Cypress.env().dataHealthCompanies[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("aseguradoraEncontrada");
    cy.get('#search').type(Cypress.env().dataHealthCompanies[0].code);
    // cy.wait("@aseguradoraEncontrada").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#statusModify').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/health-companies?search=${Cypress.env().dataHealthCompanies[0].code}&status=false&order=desc&take=20&skip=0&page=0`
    // ).as("servicioInactivoEncontrado");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    // cy.wait("@servicioInactivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#statusModify').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/health-companies?search=${Cypress.env().dataHealthCompanies[0].code}&status=true&order=desc&take=20&skip=0&page=0`
    // ).as("servicioActivoEncontrado");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    // cy.wait("@servicioActivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#modify').click();
  });
});
