describe("Test paciente", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: "jhohanf.silva@gmail.com",
      password: "Multisalud@2023",
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
      cy.get("span").contains(patient.documentType).should("be.visible");
      cy.get("span").contains(patient.documentType).click();
      cy.get("#documentNumber").type(patient.documentNumber);
      cy.get("#firstName").type(patient.firstName);
      cy.get("#firstSurname").type(patient.firstSurname);
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
      cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(0).type(patient.municipality);
      cy.get("span").contains(`${patient.municipality} - Meta`).should("be.visible");
      cy.get("span").contains(`${patient.municipality} - Meta`).click();
      cy.get("span").contains("Seleccione una opción").click();
      cy.get("span").contains(patient.academicLevel).should("be.visible");
      cy.get("span").contains(patient.academicLevel).click();
      cy.get("#phoneNumber").type(patient.phoneNumber);
      cy.get("#secondPhoneNumber").type(patient.phoneNumber);
      cy.get("#email").type(patient.email);
      cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(1).type(patient.healthCompanyCode);
      cy.get("span").contains(`${patient.healthCompanyCode} -`).should("be.visible");
      cy.get("span").contains(`${patient.healthCompanyCode} -`).click();

      cy.intercept("POST", `${Cypress.env().urlApi}/v1/patients`).as("creacionCorrecta");
      cy.get("button").contains("Guardar").click();
      cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);
    });
  });

  it("busca y edita paciente", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/pacientes`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/patients?order=desc&status=&search=${Cypress.env().dataPatients[3].documentNumber}&skip=0&take=20`
    ).as("pacienteEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataPatients[3].documentNumber);
    cy.wait("@pacienteEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('svg[data-permission="citas.configuration.patient.modify"]').click();
    cy.get("p").contains("Cree o actualice un paciente.");
    cy.get("#firstName").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Paciente actualizada exitosamente").should("be.visible");
  });  

  it("cambio estado y filtro de estado", () => {
    cy.visit(`${Cypress.env().hostName}/citas/configuracion/pacientes`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/patients?order=desc&status=&search=${Cypress.env().dataPatients[3].documentNumber}&skip=0&take=20`
    ).as("pacienteEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataPatients[3].documentNumber);
    cy.wait("@pacienteEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/patients?order=desc&status=false&search=${Cypress.env().dataPatients[3].documentNumber}&skip=0&take=20`
    ).as("pacienteInactivoEncontrado");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    cy.wait("@pacienteInactivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/patients?order=desc&status=true&search=${Cypress.env().dataPatients[3].documentNumber}&skip=0&take=20`
    ).as("pacienteActivoEncontrado");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    cy.wait("@pacienteActivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
  });
});
