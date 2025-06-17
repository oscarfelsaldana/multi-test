import moment from "moment";

describe("Test gestinar citas", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
    });
  });

  it("abre opción de getsionar citas", () => {
    cy.get('[href="/citas/gestionar-citas"').should("contain", "Gestionar citas");
    cy.get('[href="/citas/gestionar-citas"]').click();
    cy.get("h2").contains("Gestionar citas").should("be.visible");
  });

  it("Busca cita", () => {
    // const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    // const diaAgenda = moment(fechaAgenda).add(1, "days").date();
    const fechaAgenda = Cypress.env().testDate
    const diaAgenda = String(parseInt(fechaAgenda.split("-")[2], 10));

    cy.visit(`${Cypress.env().hostName}/citas/gestionar-citas`); 

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]')
      .eq(0)
      .type(Cypress.env().dataPatients[0].documentNumber);
    cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).click();

    cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.contains(Cypress.env().dataDoctors[0].firstName).should("be.visible");
  });

  // it.only("Re agendar cita", () => {
  //   const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
  //   const diaAgenda = moment().add(1, "days").date();

  //   cy.visit(`${Cypress.env().hostName}/citas/gestionar-citas`);

  //   cy.get('input[placeholder="Digite para iniciar la búsqueda"]')
  //     .eq(0)
  //     .type(Cypress.env().dataPatients[0].documentNumber);
  //   cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).should("be.visible");
  //   cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).click();

  //   cy.get('input[placeholder="AAAA-MM-DD"]').clear();
  //   cy.get("button").contains(diaAgenda).eq(0).click();
  //   cy.get("button").contains(diaAgenda).eq(0).click();

  //   cy.get("td").contains(Cypress.env().dataPatients[0].documentNumber).should("be.visible");

  //   cy.get('svg').eq(30).click();

  //   cy.contains("Reagendar").click();
  //   cy.get('input[placeholder="AAAA-MM-DD"]').last().click();
  //   cy.get("button.flex.items-center").contains("12").click();
    

  //   cy.get('#notes').type('Cita reprogramada por cypress');
    
  // });

  it("Transferir cita", () => {
    cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);
    cy.get('button').contains('Aperturar agenda').should("be.visible");
    cy.get('button').contains('Aperturar agenda').click();
    cy.get("h2").contains("Apertura agenda médico").should("be.visible");

    
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(3).type(Cypress.env().dataDoctors[1].documentNumber);
    cy.get("span").contains(Cypress.env().dataDoctors[1].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataDoctors[1].documentNumber).click();

    cy.get("span").contains("Seleccione una opción").eq(0).click();
    cy.get("span").contains(Cypress.env().dataServices[0].code).should("be.visible");
    cy.get("span").contains(Cypress.env().dataServices[0].code).click();

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(4).type(Cypress.env().dataOffices[0].code);
    cy.get("span").contains(Cypress.env().dataOffices[0].code).should("be.visible");
    cy.get("span").contains(Cypress.env().dataOffices[0].code).click();      

    // cy.get('input[placeholder="AAAA-MM-DD"]').eq(1).type(fechaAgenda);
    cy.get('input[placeholder="AAAA-MM-DD"]').eq(1).type(Cypress.env().testDate);
    
    cy.get('input[placeholder="Seleccione horario"]').type("{downarrow}");
    cy.get("span").contains("15:20-15:40").click();
    cy.get("body").type("{esc}");

    cy.get("button").contains("Guardar").click();
    cy.contains("Agenda creada correctamente", { timeout: 15000 });

    const fechaAgenda = Cypress.env().testDate
    const diaAgenda = String(parseInt(fechaAgenda.split("-")[2], 10));

    cy.visit(`${Cypress.env().hostName}/citas/gestionar-citas`);

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]')
      .eq(0)
      .type(Cypress.env().dataPatients[0].documentNumber);
    cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).click();

    cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.get("button").contains(diaAgenda).eq(0).click();

    cy.get("td").contains(Cypress.env().dataPatients[0].documentNumber).should("be.visible");

    cy.get('svg').eq(30).click();

    cy.contains("Transferir").click();
    cy.get("button").contains("Seleccionar").click();
    cy.get("button").contains("Transferir").click();
    cy.get("button").contains("Confirmar").click();

    cy.contains('Cita transferida exitosamente').should('be.visible');
  });

  it("Cancelar cita", () => {
    const fechaAgenda = Cypress.env().testDate
    const diaAgenda = String(parseInt(fechaAgenda.split("-")[2], 10));

    cy.visit(`${Cypress.env().hostName}/citas/gestionar-citas`);

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]')
      .eq(0)
      .type(Cypress.env().dataPatients[0].documentNumber);
    cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).click();

    cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.get("button").contains(diaAgenda).eq(0).click();

    cy.get("td").contains(Cypress.env().dataPatients[0].documentNumber).should("be.visible");
    cy.get('svg').eq(30).click();

    cy.contains("Cancelar").click();
    cy.get("button").contains("Confirmar").click();
    cy.get(".custom-primary-button").last().click();

    cy.contains('Estado actualizado exitosamente').should('be.visible');
  });
});
