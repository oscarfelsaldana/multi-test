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
    const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    const diaAgenda = moment().add(1, "days").date();

    cy.visit(`${Cypress.env().hostName}/citas/gestionar-citas`);

    cy.get('input[placeholder="Digite para iniciar la búsqueda"]')
      .eq(0)
      .type(Cypress.env().dataPatients[0].documentNumber);
    cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).should("be.visible");
    cy.get("span").contains(Cypress.env().dataPatients[0].documentNumber).click();

    cy.get('input[placeholder="AAAA-MM-DD"]').clear();
    cy.get("button").contains(diaAgenda).eq(0).click();
    cy.get("button").contains(diaAgenda).eq(0).click();
  });

  it.only("Re agendar cita", () => {
    const fechaAgenda = moment().add(1, "days").format("YYYY-MM-DD");
    const diaAgenda = moment().add(1, "days").date();

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

    cy.get('div[class="w-fit"]').eq(4).click();
    cy.get("h3").contains("Detalles de la cita a original").should("be.visible");
    cy.get('input[placeholder="AAAA-MM-DD"]').last().click();

    cy.get("button")
      .filter((index, element) => {
        const color = Cypress.$(element).css("color");
        const text = Cypress.$(element).text().trim();
        return color === "rgb(55, 65, 81)" && text === "17";
      })
      .eq(1)
      .click()
      .click();

    cy.get("td button")
      .filter((index, element) => {
        const text = Cypress.$(element).text().trim();
        return text === "Seleccionar";
      })
      .last()
      .click();

    cy.get('#notes').type('Cita reprogramada por cypress');
    
  });

  it("Transferir cita", () => {});

  it("Cancelar cita", () => {});
});
