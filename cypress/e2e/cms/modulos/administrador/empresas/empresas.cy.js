describe("Test empresas", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Administrador",
    });
  });

  it("abre opcion de empresas", () => {
    cy.get('[href="/admin/empresas"]').should("contain", "Empresas");
    cy.get('[href="/admin/empresas"]').click();
    cy.get("h2").contains("Empresas").should("be.visible");
  });

  it("crea empresa", () => {
    cy.visit(`${Cypress.env().hostName}/admin/empresas`);
    cy.get("button").contains("Nueva empresa").should("be.visible");
    cy.get("button").contains("Nueva empresa").click();
    cy.get("p").contains("Cree o actualice una empresa").should("be.visible");
    cy.get("span").contains("Seleccione una opción").eq(0).click();
    cy.get("span").contains(Cypress.env().dataCompanies[0].documentType).should("be.visible");
    cy.get("span").contains(Cypress.env().dataCompanies[0].documentType).click();
    cy.get("#documentNumber").type(Cypress.env().dataCompanies[0].documentNumber);
    cy.get('#dv').type(Cypress.env().dataCompanies[0].dv);
    cy.get("span").contains("Seleccione una opción").eq(0).click();
    cy.get("span").contains(Cypress.env().dataCompanies[0].legalNature).should("be.visible");
    cy.get("span").contains(Cypress.env().dataCompanies[0].legalNature).click();
    cy.get("#name").type(Cypress.env().dataCompanies[0].name);
    cy.get("#phoneNumber").type(Cypress.env().dataCompanies[0].phoneNumber);
    cy.get("#address").type(Cypress.env().dataCompanies[0].address);
    cy.get('#district').type(Cypress.env().dataCompanies[0].district);
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(0).type(Cypress.env().dataCompanies[0].municipality);
    cy.get("span").contains(`${Cypress.env().dataCompanies[0].municipality} - Meta`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataCompanies[0].municipality} - Meta`).click();
    cy.get("#fax").type(Cypress.env().dataCompanies[0].fax);
    cy.get("#email").type(Cypress.env().dataCompanies[0].email);
    cy.get('#legalAgent').type(Cypress.env().dataCompanies[0].legalAgent);
    cy.get('#domain').type(Cypress.env().dataCompanies[0].domain);
    cy.get('#logo').type(Cypress.env().dataCompanies[0].logo);
    cy.intercept("POST", `${Cypress.env().urlApi}/v1/companies`).as("creacionCorrecta");
    cy.get("button").contains("Guardar").click();
    cy.wait("@creacionCorrecta").its("response.statusCode").should("eq", 200);
  });

  it("busca y edita empresa", () => {
    cy.visit(`${Cypress.env().hostName}/admin/empresas`);
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/companies?order=desc&status=&search=${Cypress.env().dataCompanies[0].phoneNumber}&skip=0&take=20`
    ).as("empresaEncontrada");
    cy.get('input[placeholder="Nombre, email, dirección, teléfono"]').type(`${Cypress.env().dataCompanies[0].phoneNumber}`);
    cy.wait("@empresaEncontrada").its("response.body.data.totalRecords").should("eq", 1);
    cy.get('svg[data-permission="admin.company.modify"]').click();
    cy.get("p").contains("Cree o actualice una empresa").should("be.visible");
    cy.get("#name").type("-Edit");
    cy.get("button").contains("Guardar").click();
    cy.contains("Empresa actualizada exitosamente").should("be.visible");
  });

  it("cambio estado y filtro de estado", () => {
    cy.visit(`${Cypress.env().hostName}/admin/empresas`);

    //Busca empresa
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/companies?order=desc&status=&search=${Cypress.env().dataCompanies[0].phoneNumber}&skip=0&take=20`
    ).as("peticion1");
    cy.get('input[placeholder="Nombre, email, dirección, teléfono"]').type(`${Cypress.env().dataCompanies[0].phoneNumber}`);
    // cy.wait("@peticion1").its("response.body.data.totalRecords").should("eq", 1);
    cy.wait("@peticion1").then((response)=> {cy.log(response)})

    //Cambia estado de la empresa
    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    // Busca nuevamente empresa
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/companies?order=desc&status=false&search=${Cypress.env().dataCompanies[0].phoneNumber}&skip=0&take=20`
    ).as("peticion2");
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    cy.wait("@peticion2").its("response.body.data.totalRecords").should("eq", 1);

    // Vuelve a cambiar estatus
    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    // Vuelve a buscar
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/companies?order=desc&status=true&search=${Cypress.env().dataCompanies[0].phoneNumber}&skip=0&take=20`
    ).as("peticion3");
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    cy.wait("@peticion3").its("response.body.data.totalRecords").should("eq", 1);
  });
});
