// TEST ESPECIALIDADES: CREAR, EDITAR, FILTRAR, ACTIVAR, DESACTIVAR, ORDENAR.
describe("Test de especialidades", () =>{

    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.startConfig({
          email: Cypress.env().dataOperators[0].email,
          password: Cypress.env().dataOperators[0].password,
          module: "Citas",
          option: "Especialidades",
          title: "Especialidades",
        });
    });

  it("Crea una especialidad", () => {

    // ABRE EL FORMULARIO
    cy.contains("button", "Nueva especialidad").click();
    cy.contains("h2", "Especialidad").should("be.visible");
    // DATO DINAMICO
    const codigo = Date.now().toString().slice(-2);
    // COMANDO PERSONALIZADO
    cy.fillInputsModal({
       "#code": codigo,
       "#description": "Medico General" + codigo,
    });
  
    cy.intercept("POST", "**/v1/specializations").as("crearEspecialidad");
    // CLICK
    cy.contains("button","Guardar").click();
    cy.wait("@crearEspecialidad").its("response.statusCode").should("eq", 200);
  });

  it("Editar especialidad", () => {

    // CODIGO FIJO
    const codigo = Cypress.env().dataSpecializations[0].code;
    // BUSCAR LA ESPECIALIDAD A EDITAR 
    cy.fillInputsModal({
       "#search": codigo,
    });
    // ESPERA QUE CARGUE LA FILA EN LA TABLA
    cy.contains("tbody tr", codigo).as("filaSeleccionada");
    // CLICK EN EL BOTON DE EDITAR 
    cy.get("@filaSeleccionada").find("svg#modify").scrollIntoView().click();
    // VALIDA QUE SE ABRIO EL MODAL DE EDICION
    cy.contains("h2","Especialidad").should("be.visible");
    // DESCRIPCION DINÁMICA
    const descripcion = "MÉDICO GENERAL" + codigo;
    // COMANDO PERSONALIZADO PARA LLENAR INPUTS
    cy.fillInputsModal({
       "#description": descripcion,
    });
    // INTERCEPTAR PETICION
    cy.intercept("PUT", "**/v1/specializations/**").as("actualizarEspecialidad");
    // CLICK GUARDAR
    cy.contains("button","Guardar").click();
    // ESPERA LA RESPUESTA DE LA PETICION
    cy.wait("@actualizarEspecialidad").its("response.statusCode").should("eq", 200);
  });


  it("inactivar especialidad", () => {

    // CODIGO FIJO DEL SERVICIO
    const codigo = Cypress.env().dataSpecializations[0].code;  
    // BUSCA EL SERVICIO
    cy.fillInputsModal({
       "#search": codigo,
    });
    // VALIDA QUE LA FILA EXISTA
    cy.contains("tbody tr", codigo, { timeout: 10000 }).should("be.visible");
    // INTERCEPTA LA PETICION DE CAMBIO DE ESTADO
    cy.intercept("PUT","**/v1/specializations/status/**").as("cambiarEstado");
    // TRABAJA SOLO SOBRE LA FILA DEL SERVICIO
    cy.contains("tbody tr", codigo).within(() => {

      // LEE EL ESTADO ACTUAL
      cy.get("#statusModify").invoke("attr", "aria-checked").then((estadoActual) => {

          // SOLO DESACTIVA SI ESTA ACTIVO
          if (estadoActual === "true") {

            // CLICK AL SWITCH
            cy.get("#statusModify").scrollIntoView().click();
            // VALIDA RESPUESTA DEL BACKEND
            cy.wait("@cambiarEstado").its("response.statusCode").should("eq", 200);
            // VALIDA QUE QUEDO INACTIVO
            cy.get("#statusModify").should("have.attr", "aria-checked", "false");
          }
      });
    });
  });

    it("activar especialidad", () => {

    // CODIGO FIJO DEL SERVICIO
    const codigo = Cypress.env().dataSpecializations[0].code;  
    // BUSCA EL SERVICIO
    cy.fillInputsModal({
       "#search": codigo,
    });
    // VALIDA QUE LA FILA EXISTA
    cy.contains("tbody tr", codigo, { timeout: 10000 }).should("be.visible");
    // INTERCEPTA LA PETICION DE CAMBIO DE ESTADO
    cy.intercept("PUT","**/v1/specializations/status/**").as("cambiarEstado");
    // TRABAJA SOLO SOBRE LA FILA DEL SERVICIO
    cy.contains("tbody tr", codigo).within(() => {

      // LEE EL ESTADO ACTUAL
      cy.get("#statusModify").invoke("attr", "aria-checked").then((estadoActual) => {

          // SOLO ACTIVA SI ESTA INACTIVO
          if (estadoActual === "false") {

            // CLICK AL SWITCH
            cy.get("#statusModify").scrollIntoView().click();
            // VALIDA RESPUESTA DEL BACKEND
            cy.wait("@cambiarEstado").its("response.statusCode").should("eq", 200);
            // VALIDA QUE QUEDO INACTIVO
            cy.get("#statusModify").should("have.attr", "aria-checked", "false");
          }
      });
    });
  });

  it("filtrar por estado Inactivo", () => {

    // CLICK FILTRO INACTIVO Y VALIDA RESULTADOS
    cy.selectHeadlessSingle( // comando personalizado
    "button#status","Inactivo"); 
    cy.contains("td", "Activo").should("not.exist");
    cy.contains("td", "Inactivo").should("exist");
    // CLICK FILTRO ACTIVO Y VALIDA RESULTADOS
    cy.selectHeadlessSingle("button#status", "Activo");
    cy.contains("td", "Inactivo").should("not.exist");
    cy.contains("td", "Activo").should("exist");
    // CLICK FILTRO TODOS Y VALIDA LISTADO GENERAL
    cy.selectHeadlessSingle("button#status", "Todos");
    cy.get("tbody tr").should("have.length.greaterThan", 0);

  });

  it("ordena de reciente a más antiguo", () => {
  // OBTIENE EL TEXTO DE LA PRIMERA FILA 
  cy.get("tbody tr:first")
    .invoke("text")
    .then((filaInicial) => {
      // GUARDA EL TEXTO INICIAL SIN ESPACIOS
      const textoInicial = filaInicial.trim();
      // CLICK EN EL FILTRO MAS ANTIGUO
      cy.selectHeadlessSingle("button#order", "Más antiguo");
      // SELECCIONA NUEVAMENTE LA PRIMERA FILA Y VALIDA QUE ALLA CAMBIADO
      cy.get("tbody tr:first")
        .invoke("text")
        .should((filaOrdenada) => {
          expect(filaOrdenada.trim()).to.not.eq(textoInicial);
        });
    });
  });
}); 