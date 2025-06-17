describe("Test médico", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
    });
  });

  it("abre opción de médicos", () => {
    cy.get("button").contains("Configuración").should("be.visible");
    cy.get("button").contains("Configuración").click();
    cy.get('[href="/citas/configuracion/medicos"').should("contain", "Médicos");
    cy.get('[href="/citas/configuracion/medicos"]').click();
    cy.get("h2").contains("Médicos").should("be.visible");
  });

  it("crea médicos", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    cy.get("button").contains("Nuevo médico").should("be.visible");

    Cypress.env().dataDoctors.forEach(doctor => {
      cy.get("button").contains("Nuevo médico").click();
      cy.get("p").contains("Cree o actualice los datos básicos y especialidades de un médico").should("be.visible");
      cy.get("span").contains("Seleccione una opción").eq(0).click();
      cy.get("span").contains(doctor.documentType).click();
      cy.get("#documentNumber").type(doctor.documentNumber);
      cy.get("#firstName").type(doctor.firstName);
      cy.get("#firstSurname").type(doctor.firstSurname);
      cy.get("span").contains("Seleccione una opción").click();
      cy.get("span").contains(doctor.gender).should("be.visible");
      cy.get("span").contains(doctor.gender).click();
      cy.get('input[placeholder="AAAA-MM-DD"]').type(doctor.birthDate);
      cy.get("#phoneNumber").type(doctor.phoneNumber);
      cy.get("#medicalRecord").type(doctor.medicalRecord);
      cy.get("#email").type(doctor.email);

      cy.intercept("POST", `${Cypress.env().urlApi}/v1/doctors`).as("creacionCorrecta");
      cy.get("button").contains("Guardar").click();
      cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);
    });
  });

  it("busca y edita médico", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("doctorEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    // cy.wait("@doctorEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('svg').eq(23).click();
    cy.get("p").contains("Cree o actualice los datos básicos y especialidades de un médico");
    cy.get("#firstName").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Médico actualizada exitosamente").should("be.visible");
  });

  it("revisa estatus de especialidad y lo agrega a un médico", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/especialidades`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/specializations?search=${Cypress.env().dataSpecializations[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("especialidadADesactivar");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataSpecializations[0].code);
    // cy.wait("@especialidadADesactivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('button[role="switch"]').eq(0).click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("doctorEncontradoIni");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    // cy.wait("@doctorEncontradoIni").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg').eq(23).click();
    cy.get("button").contains("Especialidades").click();
    cy.contains(
      "Filtre en el campo especialidades y seleccione la que requiera para que se agregue a la tabla."
    ).should("be.visible");

    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/specializations?order=desc&status=true&search=${Cypress.env().dataSpecializations[0].code}&skip=0&take=20`
    // ).as("especialidadNoEncontrada");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataSpecializations[0].code);
    // cy.wait("@especialidadNoEncontrada").its("response.body.data.totalRecords").should("eq", 0);

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/especialidades`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/specializations?search=${Cypress.env().dataSpecializations[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("especialidadAActivar");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataSpecializations[0].code);
    // cy.wait("@especialidadAActivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('button[role="switch"]').eq(0).click();
    cy.contains("Estado actualizado exitosamente").should("be.visible"); 

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("doctorEncontradoFin");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    // cy.wait("@doctorEncontradoFin").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg').eq(23).click();
    cy.get("button").contains("Especialidades").click();
    cy.contains(
      "Filtre en el campo especialidades y seleccione la que requiera para que se agregue a la tabla."
    ).should("be.visible");

    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/specializations?order=desc&status=true&search=${Cypress.env().dataSpecializations[0].code}&skip=0&take=20`
    // ).as("especialidadEncontrada");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataSpecializations[0].code);
    // cy.wait("@especialidadEncontrada").its("response.body.data.totalRecords").should("eq", 1);
    cy.get("span").contains(`${Cypress.env().dataSpecializations[0].code} -`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataSpecializations[0].code} -`).click();
    cy.get("td").contains(Cypress.env().dataSpecializations[0].description).should("be.visible");
  });

  it("elimina y vuelve a agregar especialidad", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("doctorEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    // cy.wait("@doctorEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg').eq(23).click();

    cy.get("button").contains("Especialidades").click();

    cy.get("button").contains("Eliminar").should("be.visible");
    cy.get("button").contains("Eliminar").click();

    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/specializations?order=desc&status=true&search=${Cypress.env().dataSpecializations[0].code}&skip=0&take=20`
    // ).as("especialidadEncontrada");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataSpecializations[0].code);
    // cy.wait("@especialidadEncontrada").its("response.body.data.totalRecords").should("eq", 1);
    cy.get("span").contains(`${Cypress.env().dataSpecializations[0].code} -`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataSpecializations[0].code} -`).click();

    cy.get("td").contains(Cypress.env().dataSpecializations[0].description).should("be.visible");
  });

  it.only("revisa estatus de servicio y lo agrega a un médico", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/services?search=${Cypress.env().dataServices[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("servicioADesactivar");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataServices[0].code);
    // cy.wait("@servicioADesactivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('button[role="switch"]').eq(1).click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("doctorEncontradoIni");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    // cy.wait("@doctorEncontradoIni").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg').eq(23).click();
    cy.get("button").contains("Servicios").click();
    cy.contains("Filtre en el campo de servicios y seleccione el que desee agregar").should("be.visible");

    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/services?order=desc&status=true&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
    // ).as("servicioNoEncontrado");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataServices[0].code);
    cy.get('#service').type(Cypress.env().dataServices[0].code);
    // cy.wait("@servicioNoEncontrado").its("response.body.data.totalRecords").should("eq", 0);

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/servicios`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/services?search=${Cypress.env().dataServices[0].code}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("servicioAActivar");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataServices[0].code);
    // cy.wait("@servicioAActivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('button[role="switch"]').eq(1).click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("doctorEncontradoIni");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    // cy.wait("@doctorEncontradoIni").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg').eq(23).click();
    cy.get("button").contains("Servicios").click();

    Cypress.env().dataDoctors.forEach(doctor => {
      cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);

      // cy.intercept(
      //   "GET",
      //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
      // ).as("doctorEncontradoFin");
      cy.get('input[placeholder="Nº. Documento, nombres"]').type(doctor.documentNumber);
      cy.wait(5000);
      // cy.wait("@doctorEncontradoFin").its("response.body.data.totalRecords").should("eq", 1);
      cy.get('svg').eq(23).click();
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
      cy.contains("Se agrego con éxito el servicio").should("be.visible");
    });
  });

  it("elimina y vuelve a agregar servicio", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("doctorEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    // cy.wait("@doctorEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg').eq(23).click();

    cy.get("button").contains("Servicios").click();

    cy.get("button").contains("Eliminar").eq(0).should("be.visible");
    cy.get("button").contains("Eliminar").eq(0).click();

    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/services?order=desc&status=true&search=${Cypress.env().dataServices[0].code}&skip=0&take=20`
    // ).as("servicioEncontrado");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataServices[0].code);
    // cy.wait("@servicioEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get("span").contains(`${Cypress.env().dataServices[0].code} -`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataServices[0].code} -`).click();

    cy.get("td").contains(Cypress.env().dataServices[0].description).should("be.visible");
  });

  it("cambio estado y filtro de estado", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("doctorEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    // cy.wait("@doctorEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    // cy.get('button[role="switch"]').eq(0).click();
    cy.get('button[role="switch"]').then(($elements) => {
      if ($elements.length > 0) {
        cy.wrap($elements.eq(0)).click();
      } 
    });

    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=false&order=desc&take=20&skip=0&page=0`
    // ).as("medicoInactivoEncontrado");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    // cy.wait("@medicoInactivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    // cy.get('button[role="switch"]').eq(0).click();
    cy.get('button[role="switch"]').then(($elements) => {
      if ($elements.length > 0) {
        cy.wrap($elements.eq(0)).click();
      } 
    });



    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/doctors?search=${Cypress.env().dataDoctors[0].documentNumber}&status=true&order=desc&take=20&skip=0&page=0`
    // ).as("servicioActivoEncontrado");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    // cy.wait("@servicioActivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
  });
});
