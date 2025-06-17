describe("Test paciente", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
    });
  });

  it("abre opción de pacientes", () => {
    cy.get("button").contains("Configuración").should("be.visible");
    cy.get("button").contains("Configuración").click();
    cy.get('[href="/citas/configuracion/pacientes"').should("contain", "Pacientes");
    cy.get('[href="/citas/configuracion/pacientes"]').click();
    cy.get("h2").contains("Pacientes").should("be.visible");
  });

  it("crea pacientes", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/pacientes`);
    cy.get("button").contains("Nuevo paciente").should("be.visible");

    Cypress.env().dataPatients.forEach(patient => {
      cy.get("button").contains("Nuevo paciente").click();
      cy.get("p").contains("Cree o actualice un paciente.").should("be.visible");
      cy.get("span").contains("Seleccione una opción").eq(0).click();    
      cy.get("span").contains(patient.documentType).click();
      cy.get("#documentNumber").type(patient.documentNumber);
      cy.get("#firstName").type(patient.firstName);
      cy.get("#firstSurname").type(patient.firstSurname);
      cy.get("#rhFactor").type(patient.rhFactor);
      cy.get("span").contains("Seleccione una opción").eq(0).click();
      cy.get("span").contains(patient.gender).should("be.visible");
      cy.get("span").contains(patient.gender).click();
      cy.get("span").contains("Seleccione una opción").eq(0).click();
      cy.get("span").contains(patient.ethnicity).should("be.visible");
      cy.get("span").contains(patient.ethnicity).click();
      cy.get('input[placeholder="AAAA-MM-DD"]').type(patient.birthDate);
      cy.get("span").contains("Seleccione una opción").eq(0).click();
      cy.get("span").contains(patient.regime).should("be.visible");
      cy.get("span").contains(patient.regime).click();
      cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(1).type("Villavicencio");
      cy.get("span").contains(`${patient.municipality} - Meta`).should("be.visible");
      cy.get("span").contains(`${patient.municipality} - Meta`).click();
      cy.get("span").contains("Seleccione una opción").click();
      cy.get("span").contains(patient.academicLevel).should("be.visible");
      cy.get("span").contains(patient.academicLevel).click();
      cy.get("#phoneNumber").type(patient.phoneNumber);
      cy.get("#secondPhoneNumber").type(patient.phoneNumber);
      cy.get("#address").type(patient.address);
      cy.get("#email").type(patient.email);
      cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(3).type(Cypress.env().dataHealthCompanies[0].code);
      cy.get("span").contains(`${Cypress.env().dataHealthCompanies[0].code} -`).should("be.visible");
      cy.get("span").contains(`${Cypress.env().dataHealthCompanies[0].code} -`).click();

      cy.intercept("POST", `${Cypress.env().urlApi}/v1/patients`).as("creacionCorrecta");
      cy.get("button").contains("Guardar").click();
      cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);
    });
  });

  it("busca y edita paciente", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/pacientes`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/patients/countSearch?search=${Cypress.env().dataPatients[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("pacienteEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataPatients[0].documentNumber);
    // cy.wait("@pacienteEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg').eq(27).click();
    cy.get("p").contains("Cree o actualice un paciente.");
    cy.get("#firstName").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Paciente actualizada exitosamente").should("be.visible");
  });  

  it("cambio estado y filtro de estado", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/pacientes`);
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/patients/countSearch?search=${Cypress.env().dataPatients[0].documentNumber}&status=&order=desc&take=20&skip=0&page=0`
    // ).as("pacienteEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataPatients[0].documentNumber);
    // cy.wait("@pacienteEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    // cy.get('button[role="switch"]').click();
    cy.get('button[role="switch"]').then(($elements) => {
      if ($elements.length > 0) {
        cy.wrap($elements.eq(0)).click();
      } 
    });

    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/patients/countSearch?search=${Cypress.env().dataPatients[0].documentNumber}&status=false&order=desc&take=20&skip=0&page=0`
    // ).as("pacienteInactivoEncontrado");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    // cy.wait("@pacienteInactivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    // cy.get('button[role="switch"]').click();
    cy.get('button[role="switch"]').then(($elements) => {
      if ($elements.length > 0) {
        cy.wrap($elements.eq(0)).click();
      } 
    });

    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // cy.intercept(
    //   "GET",
    //   `${Cypress.env().urlApi}/v1/patients/countSearch?search=${Cypress.env().dataPatients[0].documentNumber}&status=true&order=desc&take=20&skip=0&page=0`
    // ).as("pacienteActivoEncontrado");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    // cy.wait("@pacienteActivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
  });
});
