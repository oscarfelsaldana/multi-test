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

  it("abre opción de agendar citas", () => {
    cy.get('[href="/citas/agendar-cita"').should("contain", "Agendar cita");
    cy.get('[href="/citas/agendar-cita"]').click();
    cy.get("h2").contains("Agendar cita").should("be.visible");
  });

  it.only("Revisar agendas y crea cita", () => {
    // const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    // const diaAgenda = moment(fechaAgenda).add(1, "days").date();
    const fechaAgenda = Cypress.env().testDate
    const diaAgenda = String(parseInt(fechaAgenda.split("-")[2], 10));

    cy.visit(`${Cypress.env().hostName}/citas/agendar-cita`);

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(0).type(Cypress.env().dataPatients[0].documentNumber);
    cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).click();
    
    cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.get("button").contains(diaAgenda).eq(0).click();    

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(1).type(Cypress.env().dataServices[0].code);
    cy.get("span").contains(Cypress.env().dataServices[0].code).should("be.visible");
    cy.get("span").contains(Cypress.env().dataServices[0].code).click();

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(2).type(Cypress.env().dataOffices[0].code);
    cy.get("span").contains(Cypress.env().dataOffices[0].code).should("be.visible");
    cy.get("span").contains(Cypress.env().dataOffices[0].code).click();

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(3).type(Cypress.env().dataDoctors[0].documentNumber);
    cy.get("span").contains(Cypress.env().dataDoctors[0].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataDoctors[0].documentNumber).click();

    cy.get('button').contains('Asignar').eq(-1).click({ force: true });
    cy.contains('Presencial').click();

    cy.get('#notes').type('Agendada cypress');

    cy.get('button').contains('Agendar').click();
    cy.contains('Cita creada exitosamente').should('be.visible');
  });
});
