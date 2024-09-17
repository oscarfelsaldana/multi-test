describe("Test paciente", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Administrador",
    });
  });

  it("abre opcion de operadores", () => {
    cy.get('[href="/admin/operadores"]').should("contain", "Operadores");
    cy.get('[href="/admin/operadores"]').click();
    cy.get("h2").contains("Operadores").should("be.visible");
  });

  it("crea operador", () => {
    cy.visit(`${Cypress.env().hostName}/admin/operadores`);
    cy.get("button").contains("Nuevo operador").should("be.visible");
    cy.get("button").contains("Nuevo operador").click();
    cy.get("p").contains("Cree o actualice un operador").should("be.visible");
    cy.get("span").contains("Seleccione una opción").eq(0).click();
    cy.get("span").contains(Cypress.env().dataOperators[0].documentType).should("be.visible");
    cy.get("span").contains(Cypress.env().dataOperators[0].documentType).click();
    cy.get("#documentNumber").type(Cypress.env().dataOperators[0].documentNumber);
    cy.get("#firstName").type(Cypress.env().dataOperators[0].firstName);
    cy.get("#firstSurname").type(Cypress.env().dataOperators[0].firstSurname);
    cy.get("span").contains("Seleccione una opción").eq(0).click();
    cy.get("span").contains(Cypress.env().dataOperators[0].gender).should("be.visible");
    cy.get("span").contains(Cypress.env().dataOperators[0].gender).click();
    cy.get('input[placeholder="AAAA-MM-DD"]').type(Cypress.env().dataOperators[0].birthDate);
    cy.get("#phoneNumber").type(Cypress.env().dataOperators[0].phoneNumber);
    cy.get("#email").type(Cypress.env().dataOperators[0].email);
    cy.get("#password").type(Cypress.env().dataOperators[0].password);
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').type(Cypress.env().dataOffices[0].code);
    cy.get("span").contains(`${Cypress.env().dataOffices[0].code} -`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataOffices[0].code} -`).click();
    cy.intercept("POST", "https://api-dev.citas-multisalud.com/v1/patients").as("creacionCorrecta");
    cy.get("button").contains("Guardar").click();
    cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);
  });

  it.only("Asigna empresa a super admin", () => {
    cy.visit(`${Cypress.env().hostName}/admin/operadores`);

    //Busca operdador
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataOperators[0].documentNumber);
    cy.get("td").contains(Cypress.env().dataOperators[0].email).should("be.visible")
   
    //Abre formulario y asigna empresa
    cy.get('svg[data-permission="admin.operator.modify"]').click();
    cy.get("p").contains("Cree o actualice un operador");

    //Asigna empresa
    cy.get("span").contains("Seleccione una opción").eq(2).click();
    cy.get("span").contains("Seleccione una opción").last().click();
    cy.get("span").contains(Cypress.env().dataCompanies[0].name).should("be.visible");
    cy.get("span").contains(Cypress.env().dataCompanies[0].name).click();

    //Guarda
    cy.get("button").contains("Guardar");

  });

  it("busca y edita operador", () => {
    cy.visit(`${Cypress.env().hostName}/admin/operadores`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/operators?order=desc&status=&search=${
        Cypress.env().dataOperators[0].documentNumber
      }&skip=0&take=20`
    ).as("pacienteEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataOperators[0].documentNumber);
    cy.wait("@pacienteEncontrado").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg[data-permission="admin.operator.modify"]').click();
    cy.get("p").contains("Cree o actualice un operador");
    cy.get("#firstName").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Operador actualizado exitosamente").should("be.visible");
  });

  it("cambio estado y filtro de estado", () => {
    cy.visit("https://dev.citas-multisalud.com/admin/operadores");
    cy.intercept(
      "GET",
      `https://api-dev.citas-multisalud.com/v1/operators?order=desc&status=&search=${
        Cypress.env().dataOperators[0].documentNumber
      }&skip=0&take=20`
    ).as("pacienteEncontrado");
    cy.get('input[placeholder="Nº. Documento, nombres"]').type(Cypress.env().dataOperators[0].documentNumber);
    cy.wait("@pacienteEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    cy.intercept(
      "GET",
      `https://api-dev.citas-multisalud.com/v1/operators?order=desc&status=false&search=${
        Cypress.env().dataOperators[0].documentNumber
      }&skip=0&take=20`
    ).as("pacienteInactivoEncontrado");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    cy.wait("@pacienteInactivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);

    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    cy.intercept(
      "GET",
      `https://api-dev.citas-multisalud.com/v1/operators?order=desc&status=true&search=${
        Cypress.env().dataOperators[0].documentNumber
      }&skip=0&take=20`
    ).as("pacienteActivoEncontrado");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    cy.wait("@pacienteActivoEncontrado").its("response.body.data.totalRecords").should("eq", 1);
  });
});
