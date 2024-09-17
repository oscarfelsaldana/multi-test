describe("Test médico", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: "jhohanf.silva@gmail.com",
      password: "Multisalud@2023",
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
      cy.get("span").contains(doctor.documentType).should("be.visible");
      cy.get("span").contains(doctor.documentType).click();
      cy.get("#documentNumber").type(doctor.documentNumber);
      cy.get("#firstName").type(doctor.firstName);
      cy.get("#firstSurname").type(doctor.firstSurname);
      cy.get("span").contains("Seleccione una opción").click();
      cy.get("span").contains(doctor.gender).should("be.visible");
      cy.get("span").contains(doctor.gender).click();
      cy.get('input[placeholder="AAAA-MM-DD"]').type(doctor.birthDate);
      cy.get("#phoneNumber").type(doctor.phoneNumber);
      cy.get("#email").type(doctor.email);

      cy.intercept("POST", `${Cypress.env().urlApi}/v1/doctors`).as("creacionCorrecta");
      cy.get("button").contains("Guardar").click();
      cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);
    });
  });

  it("busca y edita médico", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/doctors?order=desc&status=&search=${Cypress.env().dataDoctors[0].documentNumber}&skip=0&take=20`
    ).as("doctorEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    cy.wait("@doctorEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('svg[data-permission="citas.configuration.doctor.modify"]').click();
    cy.get("p").contains("Cree o actualice los datos básicos y especialidades de un médico");
    cy.get("#firstName").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Médico actualizada exitosamente").should("be.visible");
  });

  it("revisa estatus de especialidad y lo agrega a un médico", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/especialidades`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/specializations?order=desc&status=&search=${Cypress.env().dataSpecializations[0].code}&skip=0&take=20`
    ).as("especialidadADesactivar");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataSpecializations[0].code);
    cy.wait("@especialidadADesactivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/doctors?order=desc&status=&search=${Cypress.env().dataDoctors[0].documentNumber}&skip=0&take=20`
    ).as("doctorEncontradoIni");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    cy.wait("@doctorEncontradoIni").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg[data-permission="citas.configuration.doctor.modify"]').click();
    cy.get("button").contains("Especialidades").click();
    cy.contains(
      "Filtre en el campo especialidades y seleccione la que requiera para que se agregue a la tabla."
    ).should("be.visible");

    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/specializations?order=desc&status=true&search=${Cypress.env().dataSpecializations[0].code}&skip=0&take=20`
    ).as("especialidadNoEncontrada");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataSpecializations[0].code);
    cy.wait("@especialidadNoEncontrada").its("response.body.data.totalRecords").should("eq", 0);

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/especialidades`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/specializations?order=desc&status=&search=${Cypress.env().dataSpecializations[0].code}&skip=0&take=20`
    ).as("especialidadAActivar");
    cy.get('input[placeholder="Código, descripción"]').type(Cypress.env().dataSpecializations[0].code);
    cy.wait("@especialidadAActivar").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible"); 

    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/doctors?order=desc&status=&search=${Cypress.env().dataDoctors[0].documentNumber}&skip=0&take=20`
    ).as("doctorEncontradoFin");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    cy.wait("@doctorEncontradoFin").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg[data-permission="citas.configuration.doctor.modify"]').click();
    cy.get("button").contains("Especialidades").click();
    cy.contains(
      "Filtre en el campo especialidades y seleccione la que requiera para que se agregue a la tabla."
    ).should("be.visible");

    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/specializations?order=desc&status=true&search=${Cypress.env().dataSpecializations[0].code}&skip=0&take=20`
    ).as("especialidadEncontrada");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataSpecializations[0].code);
    cy.wait("@especialidadEncontrada").its("response.body.data.totalRecords").should("eq", 1);
    cy.get("span").contains(`${Cypress.env().dataSpecializations[0].code} -`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataSpecializations[0].code} -`).click();
    cy.get("td").contains(Cypress.env().dataSpecializations[0].description).should("be.visible");
  });

  it("elimina y vuelve a agregar especialidad", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/doctors?order=desc&status=&search=${Cypress.env().dataDoctors[0].documentNumber}&skip=0&take=20`
    ).as("doctorEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    cy.wait("@doctorEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg[data-permission="citas.configuration.doctor.modify"]').click();

    cy.get("button").contains("Especialidades").click();

    cy.get("button").contains("Eliminar").should("be.visible");
    cy.get("button").contains("Eliminar").click();

    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/specializations?order=desc&status=true&search=${Cypress.env().dataSpecializations[0].code}&skip=0&take=20`
    ).as("especialidadEncontrada");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataSpecializations[0].code);
    cy.wait("@especialidadEncontrada").its("response.body.data.totalRecords").should("eq", 1);
    cy.get("span").contains(`${Cypress.env().dataSpecializations[0].code} -`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataSpecializations[0].code} -`).click();

    cy.get("td").contains(Cypress.env().dataSpecializations[0].description).should("be.visible");
  });

  it("cambio estado y filtro de estado", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/medicos`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/doctors?order=desc&status=&search=${Cypress.env().dataDoctors[0].documentNumber}&skip=0&take=20`
    ).as("doctorEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataDoctors[0].documentNumber);
    cy.wait("@doctorEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/doctors?order=desc&status=false&search=${Cypress.env().dataDoctors[0].documentNumber}&skip=0&take=20`
    ).as("servicioInactivoEncontrado");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    cy.wait("@servicioInactivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/doctors?order=desc&status=true&search=${Cypress.env().dataDoctors[0].documentNumber}&skip=0&take=20`
    ).as("servicioActivoEncontrado");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    cy.wait("@servicioActivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
  });
});
