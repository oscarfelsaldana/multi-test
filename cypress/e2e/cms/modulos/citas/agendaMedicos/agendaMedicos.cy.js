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
    cy.get('[data-permission="citas.doctor-schedule.create"]').should("be.visible");
    cy.get('[data-permission="citas.doctor-schedule.create"]').click();
    cy.get("h2").contains("Apertura agenda médico").should("be.visible");

    for (let i = 0; i < 2; i++) {
      cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(3).type(Cypress.env().dataServices[0].code);
      cy.get("span").contains(Cypress.env().dataServices[0].code).should("be.visible");
      cy.get("span").contains(Cypress.env().dataServices[0].code).click();
      cy.get('input[placeholder="Digite para iniciar la búsqueda"]')
        .eq(4)
        .type(Cypress.env().dataDoctors[i].documentNumber);
      cy.get("span").contains(Cypress.env().dataDoctors[i].documentNumber).should("be.visible");
      cy.get("span").contains(Cypress.env().dataDoctors[i].documentNumber).click();
      cy.get("p").contains("Presencial").click();
      cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(5).type(Cypress.env().dataOffices[0].code);
      cy.get("span").contains(Cypress.env().dataOffices[0].code).should("be.visible");
      cy.get("span").contains(Cypress.env().dataOffices[0].code).click();

      const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
      cy.get('input[placeholder="AAAA-MM-DD"]').eq(1).type(fechaAgenda);
      cy.get('input[type="number"]').clear();
      cy.get('input[type="number"]').type("30");

      //Probar que no se pueda cambiar la duracion con horarios en lista

      cy.get('input[placeholder="Seleccione horario"]').type("{downarrow}");
      cy.get("span").contains("12:00-12:30").click();
      cy.get("span").contains("12:30-13:00").click();
      cy.get("span").contains("13:00-13:30").click();
      cy.get("span").contains("13:30-14:00").click();
      cy.get("span").contains("14:00-14:30").click();
      cy.get("span").contains("14:30-15:00").click();

      cy.get("button").contains("Guardar").click();
      cy.contains("Agenda creada correctamente");
    }
  });

  // it("Busca agendas en almanaque y transfiere una agenda", () => {
  //   cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);

  //   const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
  //   const diaAgenda = moment().add(1, "days").date();
  //   cy.get('input[placeholder="AAAA-MM-DD"]').clear();
  //   cy.get("button").contains(diaAgenda).eq(0).click();
  //   cy.get("button").contains(diaAgenda).eq(0).click();
  //   cy.get("a").contains("más").should("be.visible");
  //   cy.get("a").contains("más").click();

  //   // cy.get("p").contains(Cypress.env().dataDoctors[0].firstName).eq(5).click();
  // });

  it("Busca agendas en tabla y tranfiere una agenda", () => {
    cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);
    cy.get('div[class="w-fit"]').eq(2).click();

    const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    const diaAgenda = moment().add(1, "days").date();  

    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/doctor-schedule?view=table&endDate=${fechaAgenda}&startDate=${fechaAgenda}&order=desc&status=active&skip=0&take=20&page=0`
    ).as("agendasEncontradas");
    cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.wait("@agendasEncontradas").its("response.body.data.totalRecords").should("eq", 12);
    //falta validar que las agendas que se están viendo tambien sean 12

    cy.get("tr").find("svg").last().click();
    cy.get('button[data-permission="citas.doctor-schedule.status-transfer"]').last().click();
    cy.get("h2").contains("Transferir Agenda").should("be.visible");
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]')
      .eq(3)
      .type(Cypress.env().dataDoctors[2].documentNumber);
    cy.get("span")
      .contains(`${Cypress.env().dataDoctors[2].documentNumber} - ${Cypress.env().dataDoctors[2].firstName}`)
      .should("be.visible");
    cy.get("span")
      .contains(`${Cypress.env().dataDoctors[2].documentNumber} - ${Cypress.env().dataDoctors[2].firstName}`)
      .click();
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(4).type(Cypress.env().dataOffices[1].code);
    cy.get("span")
      .contains(`${Cypress.env().dataOffices[1].code} - ${Cypress.env().dataOffices[1].name}`)
      .should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataOffices[1].code} - ${Cypress.env().dataOffices[1].name}`).click();
    cy.get("button").eq(67).click();
    cy.get("button").contains("Confirmar").click();
    cy.contains("Agenda transferida exitosamente")
  });

  it("Busca agenda en tabla y cancela", () => {
    cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);
    cy.get('div[class="w-fit"]').eq(2).click();

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').first().type(Cypress.env().dataDoctors[2].documentNumber);
    cy.get("span").contains(`${Cypress.env().dataDoctors[2].documentNumber}`).should("be.visible");
    cy.get("span").contains(`${Cypress.env().dataDoctors[2].documentNumber}`).click();

    const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    const diaAgenda = moment().add(1, "days").date();    
    cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.get("td").contains(Cypress.env().dataDoctors[2].firstName).should("be.visible");

    cy.get("tr").find("svg").last().click();
    cy.get('button[data-permission="citas.doctor-schedule.status-cancel"]').last().click();
    cy.get("button").contains("Confirmar").click();
    cy.contains("Estado actualizado exitosamente");
  });

  it.only("Transfiere un bloque de agendas", () => {
    cy.visit(`${Cypress.env().hostName}/citas/agenda-medicos`);
    cy.get('div[class="w-fit"]').eq(2).click();

    const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    const diaAgenda = moment().add(1, "days").date();
    cy.intercept(
      "GET",
      `${Cypress.env().urlApi}/v1/doctor-schedule?view=table&endDate=${fechaAgenda}&startDate=${fechaAgenda}&order=desc&status=active&skip=0&take=20&page=0`
    ).as("citasEncontradas");
    cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.get("button").contains(diaAgenda).eq(0).click();

    cy.get("button").contains("Transferir Agenda").first().click();
    cy.get('input[placeholder="AAAA-MM-DD"]').last().type(fechaAgenda);
    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(3).type(Cypress.env().dataDoctors[1].documentNumber);
    cy.get("span").contains(Cypress.env().dataDoctors[1].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataDoctors[1].documentNumber).click();

    cy.get("p").contains("Presencial").click();    

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(4).type(Cypress.env().dataOffices[0].code);
    cy.get("span").contains(Cypress.env().dataOffices[0].code).should("be.visible");
    cy.get("span").contains(Cypress.env().dataOffices[0].code).click();
    cy.get('input[type="checkbox"]').eq(0).click();
    cy.get('input[type="checkbox"]').eq(1).click();

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(5).type(Cypress.env().dataDoctors[2].documentNumber);
    cy.get("span").contains(Cypress.env().dataDoctors[2].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataDoctors[2].documentNumber).click();

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(6).type(Cypress.env().dataOffices[0].code);
    cy.get("span").contains(Cypress.env().dataOffices[0].code).should("be.visible");
    cy.get("span").contains(Cypress.env().dataOffices[0].code).click();

    cy.get('button').contains('Transferir agenda').click();
    cy.contains('Agenda transferida exitosamente').should('be.visible');
  });
});
