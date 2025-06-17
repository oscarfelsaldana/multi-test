import moment from "moment";

describe("Test paciente", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
    });
  });

  it("abre opción de agenda de medicos", () => {
    cy.get('[href="/citas/agenda-medicos"').should("contain", "Agenda médicos");
    cy.get('[href="/citas/agenda-medicos"]').click();
    cy.get("h2").contains("Agenda médicos").should("be.visible");
  });

  it("aperturar agendas", () => {
    cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);
    cy.get('button').contains('Aperturar agenda').should("be.visible");
    cy.get('button').contains('Aperturar agenda').click();
    cy.get("h2").contains("Apertura agenda médico").should("be.visible");

    
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(3).type(Cypress.env().dataDoctors[0].documentNumber);
    cy.get("span").contains(Cypress.env().dataDoctors[0].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataDoctors[0].documentNumber).click();

    cy.get("span").contains("Seleccione una opción").eq(0).click();
    cy.get("span").contains(Cypress.env().dataServices[0].code).should("be.visible");
    cy.get("span").contains(Cypress.env().dataServices[0].code).click();

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(4).type(Cypress.env().dataOffices[0].code);
    cy.get("span").contains(Cypress.env().dataOffices[0].code).should("be.visible");
    cy.get("span").contains(Cypress.env().dataOffices[0].code).click();      

    const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    // cy.get('input[placeholder="AAAA-MM-DD"]').eq(1).type(fechaAgenda);
    cy.get('input[placeholder="AAAA-MM-DD"]').eq(1).type(Cypress.env().testDate);
    cy.get('input[type="number"]').clear();
    cy.get('input[type="number"]').type("30");
    cy.get('input[type="number"]').clear();
    cy.get('input[type="number"]').type("20");

    cy.get('input[placeholder="Seleccione horario"]').type("{downarrow}");
    cy.get("span").contains("12:00-12:20").click();
    cy.get("span").contains("12:20-12:40").click();
    cy.get("span").contains("12:40-13:00").click();
    cy.get("span").contains("13:00-13:20").click();
    cy.get("span").contains("13:20-13:40").click();
    cy.get("span").contains("13:40-14:00").click();
    cy.get("span").contains("14:00-14:20").click();
    cy.get("span").contains("14:20-14:40").click();
    cy.get("span").contains("14:40-15:00").click();
    cy.get("span").contains("15:00-15:20").click();
    cy.get("span").contains("15:20-15:40").click();
    cy.get("span").contains("15:40-16:00").click();

    cy.get("button").contains("Guardar").click();
    cy.contains("Agenda creada correctamente", { timeout: 15000 });
  });

  it("Bloquea y desbloquea una agenda", () => {
    cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);
    cy.get('#tableView').click();

    const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    const diaAgenda = moment().add(1, "days").date();  
    // cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    // cy.get("button").contains(diaAgenda).eq(0).click();
    // cy.get("button").contains(diaAgenda).eq(0).click();

    cy.get("tr").find("svg").last().click();
    cy.get('#lock').click();
    cy.contains("Estado actualizado exitosamente")

    cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);
    cy.get("span").contains("Activa").click();
    cy.get("span").contains("Bloqueada").click();
    cy.get('#tableView').click();
    // cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    // cy.get("button").contains(diaAgenda).eq(0).click();
    // cy.get("button").contains(diaAgenda).eq(0).click();
    cy.get("tr").find("svg").click();
    cy.get('#unlock').click();
    cy.contains("Estado actualizado exitosamente")   
  });

  it("Busca agendas en tabla y tranfiere una agenda", () => {
    cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);
    cy.get('#tableView').click();

    const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    const diaAgenda = moment().add(1, "days").date();  
    // cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    // cy.get("button").contains(diaAgenda).eq(0).click();
    // cy.get("button").contains(diaAgenda).eq(0).click();

    cy.get("tr").find("svg").last().click();
    cy.get('#toTransfer').click();
    cy.get("h2").contains("Transferir Agenda").should("be.visible");

    // cy.get('input[placeholder="AAAA-MM-DD"]').eq(1).type(fechaAgenda);
    cy.get('input[placeholder="AAAA-MM-DD"]').eq(1).type(Cypress.env().testDate);
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]')
      .eq(3)
      .type(Cypress.env().dataDoctors[1].documentNumber);
    cy.get("span")
      .contains(`${Cypress.env().dataDoctors[1].documentNumber} - ${Cypress.env().dataDoctors[1].firstName}`)
      .should("be.visible");
    cy.get("span")
      .contains(`${Cypress.env().dataDoctors[1].documentNumber} - ${Cypress.env().dataDoctors[1].firstName}`)
      .click();
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(4).type(Cypress.env().dataOffices[0].code);
    cy.get("span")
      .contains(`${Cypress.env().dataOffices[0].code} - ${Cypress.env().dataOffices[0].name}`)
      .should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataOffices[0].code} - ${Cypress.env().dataOffices[0].name}`).click();
    cy.get("button").eq(116).click();
    cy.get("button").contains("Confirmar").click();
    cy.contains("Agenda transferida exitosamente")
  });

  it("Busca agenda en tabla y cancela", () => {
    cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);
    
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').first().type(Cypress.env().dataDoctors[1].documentNumber);
    cy.get("span").contains(`${Cypress.env().dataDoctors[1].documentNumber}`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataDoctors[1].documentNumber}`).click();
    cy.get('div[class="w-fit"]').eq(2).click();
    const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    const diaAgenda = moment().add(1, "days").date();
    // cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    // cy.get("button").contains(diaAgenda).eq(0).click();
    // cy.get("button").contains(diaAgenda).eq(0).click();

    cy.get("tr").find("svg").click();
    cy.get('#toCancel').click();
    cy.get("button").contains("Confirmar").click();
    cy.contains("Estado actualizado exitosamente");
  });

  it("Transfiere un bloque de agendas", () => {
    cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);
    cy.get('div[class="w-fit"]').eq(2).click();

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').first().type(Cypress.env().dataDoctors[1].documentNumber);
    cy.get("span").contains(`${Cypress.env().dataDoctors[1].documentNumber}`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataDoctors[1].documentNumber}`).click();

    const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    const diaAgenda = moment().add(1, "days").date();
    
    // cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    // cy.get("button").contains(diaAgenda).eq(0).click();
    // cy.get("button").contains(diaAgenda).eq(0).click();

    cy.get("button").contains("Transferir Agenda").first().click();
    // cy.get('input[placeholder="AAAA-MM-DD"]').eq(1).type(fechaAgenda);
    cy.get('input[placeholder="AAAA-MM-DD"]').eq(1).type(Cypress.env().testDate);
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(3).type(Cypress.env().dataDoctors[0].documentNumber);
    cy.get("span").contains(Cypress.env().dataDoctors[0].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataDoctors[0].documentNumber).click();

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(4).type(Cypress.env().dataOffices[0].code);
    cy.get("span").contains(Cypress.env().dataOffices[0].code).should("be.visible");
    cy.get("span").contains(Cypress.env().dataOffices[0].code).click();

    cy.get('input[type="checkbox"]').eq(-1).click();
    cy.get('input[type="checkbox"]').eq(-2).click();
    cy.get('input[type="checkbox"]').eq(-3).click();

    // cy.get('input[placeholder="AAAA-MM-DD"]').eq(2).type(fechaAgenda);
    cy.get('input[placeholder="AAAA-MM-DD"]').eq(2).type(Cypress.env().testDate);
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(5).type(Cypress.env().dataDoctors[1].documentNumber);
    cy.get("span").contains(Cypress.env().dataDoctors[1].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataDoctors[1].documentNumber).click();

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(6).type(Cypress.env().dataOffices[0].code);
    cy.get("span").contains(Cypress.env().dataOffices[0].code).should("be.visible");
    cy.get("span").contains(Cypress.env().dataOffices[0].code).click();

    cy.get('button').contains('Transferir agenda').click();
    cy.contains('Agenda transferida exitosamente').should('be.visible');
  });
});
