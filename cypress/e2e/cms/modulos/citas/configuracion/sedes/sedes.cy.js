describe("Test sedes", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
    });
  });

  it("abre opción de sedes", () => {
    cy.get("button").contains("Configuración").should("be.visible");
    cy.get("button").contains("Configuración").click();

    cy.get('[href="/citas/configuracion/sedes"').should("contain", "Sedes");
    cy.get('[href="/citas/configuracion/sedes"]').click();
    cy.get("h2").contains("Sedes").should("be.visible");
  });

  it("crea sedes", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/sedes`);
    cy.get("button").contains("Nueva sede").should("be.visible");

    Cypress.env().dataOffices.forEach((office) => {
      cy.get("button").contains("Nueva sede").click();
      cy.get("p").contains("Cree o actualice una sede.").should("be.visible");
      
      cy.get("#code").type(office.code);
      cy.get("#name").type(office.name);
      cy.get("#address").type(office.address);
      cy.get("#district").type(office.district);
      cy.get('#municipalityId').type(office.municipality);
      cy.get("span").contains(`${office.municipality} - Meta`).should("be.visible");
      cy.get("span").contains(`${office.municipality} - Meta`).click();
      cy.get("span").contains("Seleccione una opción").should("be.visible");
      cy.get("span").contains("Seleccione una opción").click();
      cy.get("span").contains("Urbana").should("be.visible");
      cy.get("span").contains("Urbana").click();
      cy.get("#phoneNumber").type(office.phoneNumber);
      cy.get("#email").type(office.email);
      cy.get("#manager").type(office.manager);
      // cy.get("#startHourAttention").type(office.startHourAttention);
      // cy.get("#endHourAttention").type(office.endHourAttention);
      cy.get("#enablingCode").type(office.enablingCode);
      cy.intercept("POST", `${Cypress.env().urlApi}/v1/offices`).as("creacionCorrecta1");
      cy.get("button").contains("Guardar").click();
      cy.wait("@creacionCorrecta1").its("response.statusCode").should("eq", 200);
    });    
  });

  it("busca y edita sede", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/sedes`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/offices?search=${Cypress.env().dataOffices[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("sedeEncontrada");
    cy.get('#search').type(Cypress.env().dataOffices[0].code);
    // cy.wait("@sedeEncontrada").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#modify').click();
    cy.get("p").contains("Cree o actualice una sede.").should("be.visible");
    cy.get("#name").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Sede actualizada exitosamente").should("be.visible");
  });

  it("revisa estatus de servicio y lo agrega a una sede", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/services?search=${Cypress.env().dataServices[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("servicioADesactivar");
    cy.get('#search').type(Cypress.env().dataServices[0].code);
    // cy.wait("@servicioADesactivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#statusModify').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/sedes`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/offices?search=${Cypress.env().dataOffices[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("sedeEncontradaIni");
    cy.get('#search').type(Cypress.env().dataOffices[0].code);
    // cy.wait("@sedeEncontradaIni").its("response.body.data.totalRecords").should("eq", 1);
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

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/sedes`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/offices?search=${Cypress.env().dataOffices[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("sedeEncontradaFin");
    cy.get('#search').type(Cypress.env().dataOffices[0].code);
    // cy.wait("@sedeEncontradaFin").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#modify').click();
    cy.get("button").contains("Servicios").click();
    cy.contains("Filtre en el campo de servicios y seleccione el que desee agregar").should("be.visible");

    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/services?order=desc&status=true&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
    // ).as("servicioEncontrado");
    cy.get('#service').type(Cypress.env().dataServices[0].code);
    // cy.wait("@servicioEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get("span").contains(`${Cypress.env().dataServices[0].code} -`).should("be.visible");

    Cypress.env().dataOffices.forEach(office => {
      cy.visit(`${Cypress.env().hostName}/citas/configuracion/sedes`);
      // cy.intercept(
      //   "GET",
      //   `${Cypress.env().urlApi}/v1/offices?order=desc&status=&search=${office.code}&skip=0&take=20`
      // ).as("sedeEncontradaFin");
      cy.get('#search').type(office.code);
      // cy.wait("@sedeEncontradaFin").its("response.body.data.totalRecords").should("eq", 1);

      cy.get('#modify').click();
      cy.get("button").contains("Servicios").click();
      cy.contains("Filtre en el campo de servicios y seleccione el que desee agregar").should("be.visible");

      // cy.intercept(
      //   "GET",
      //   `${Cypress.env().urlApi}/v1/services?order=desc&status=true&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
      // ).as("servicioEncontrado1");
      cy.get('#service').type(Cypress.env().dataServices[0].code);
      // cy.wait("@servicioEncontrado1").its("response.body.data.totalRecords").should("eq", 1);
      cy.get("span").contains(`${Cypress.env().dataServices[0].code} -`).should("be.visible");
      cy.get("span").contains(`${Cypress.env().dataServices[0].code} -`).click();
      cy.get("td").contains(`${Cypress.env().dataServices[0].description}`).should("be.visible");
    });
  });

  it.only("elimina y vuelve a agregar servicio", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/sedes`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/offices?search=${Cypress.env().dataOffices[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("sedeEncontradaFin");
    cy.get('#search').type(Cypress.env().dataOffices[0].code);
    // cy.wait("@sedeEncontradaFin").its("response.body.data.totalRecords").should("eq", 1);
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

  it("cambio estado y filtro de estado", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/sedes`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/offices?search=${Cypress.env().dataOffices[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("sedeEncontrada");
    cy.get('#search').type(Cypress.env().dataOffices[0].code);
    // cy.wait("@sedeEncontrada").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#statusModify').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/offices?search=${Cypress.env().dataOffices[0].code}&status=false&order=desc&take=20&skip=0&page=0`
    // ).as("servicioInactivoEncontrado");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    // cy.wait("@servicioInactivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('#statusModify').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/offices?search=${Cypress.env().dataOffices[0].code}&status=true&order=desc&take=20&skip=0&page=0`
    // ).as("servicioActivoEncontrado");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    // cy.wait("@servicioActivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('#modify').click();
  });
});
