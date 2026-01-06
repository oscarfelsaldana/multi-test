// TEST SERVICIO: CREAR, EDITAR, FILTRAR, ACTIVAR, DESACTIVAR ETC.
describe("Tests de servicio", () => {

  beforeEach(() => {
    cy.viewport(1336, 768);
    cy.startConfig({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
      option: "Servicios",
      title: "Servicios", 
    });
  });

  it("abre el modulo y crea un servicios", () => { 

    // abrir modal 
    cy.contains("button", "Nuevo servicio").click();
    cy.contains("h2", "Servicio").should("be.visible");
    // llena el formulario
    const codigo = Date.now().toString().slice(-6) 
    // Ingresa parametros del comando personalizado
    cy.selectHeadlessCombo( 
      'input#serviceGroupsId', 
      "02",      
      "02 - CONSULTA EXTERNA"      
    );
    // ingresa parametros del comando personalizado 
    cy.fillInputsModal({
      "#code": codigo,
      "#homologationCode": codigo,
      "#description": "CONSULTA EXTERNA" + codigo
    });
    // click en el checkbox 
    //cy.get("#isSurgical").should("not.be.checked").click();
    // intercerta la peticion 
    cy.intercept("POST", "**/v1/services").as("crearServicio");
    // click en GUARDAR
    cy.contains("button", "Guardar").click();
    // Valida que la creación fue exitosa
    cy.wait("@crearServicio")
      .its("response.statusCode")
      .should("eq",200);
  });

  
    it("edita un servicio existente", () => {

      // CODIGO FIJO 
      const codigo = Cypress.env().dataServices[0].code;
      // buscar por el código
      cy.get("#search").should("be.visible").clear().type(codigo);
      // esperar que aparezca la fila en la tabla 
      cy.contains("tbody tr", codigo).as("filaSeleccionada");
      // click en el boton editar de la fila seleccionada
      cy.get("@filaSeleccionada").find("svg#modify").scrollIntoView().click();
      // valida que se abrio el modal de edicion
      cy.contains("h2","Servicio").should("be.visible");
      // edita la descripcion
      const nuevaDescripcion = "CONSULTA EXTERNA" + Date.now().toString().slice(-3); // ultimos 4 digitos
      // ingresa parametros del comando personalizado
      cy.fillInputsModal({
        "#description": nuevaDescripcion
      })
      // intercepta la peticion 
      cy.intercept("PUT", "**/v1/services/*").as("editarServicio");
      // click en GUARDAR
      cy.contains("button", "Guardar").click();
      // Valida que la creación fue exitosa
      cy.wait("@editarServicio")
        .its("response.statusCode")
        .should("eq",200);
    });

      it("inactivar servicio", () => {

      // CODIGO FIJO DEL SERVICIO
      const codigo = Cypress.env().dataServices[0].code;
      
      // BUSCA EL SERVICIO
      cy.get("#search").should("be.visible").clear().type(codigo);
      // VALIDA QUE LA FILA EXISTA
      cy.contains("tbody tr", codigo, { timeout: 10000 }).should("be.visible");
      // INTERCEPTA LA PETICION DE CAMBIO DE ESTADO
      cy.intercept("PUT","**/v1/services/status/*").as("cambiarEstado");
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

      it("activar servicio", () => {

      // CODIGO FIJO DEL SERVICIO
      const codigo = Cypress.env().dataServices[0].code;
      // BUSCA EL SERVICIO
      cy.get("#search").should("be.visible").clear().type(codigo);
      // VALIDA QUE LA FILA EXISTA
      cy.contains("tbody tr", codigo, { timeout: 10000 }).should("be.visible");
      // INTERCEPTA LA PETICION DE CAMBIO DE ESTADO
      cy.intercept("PUT","**/v1/services/status/*").as("cambiarEstado");
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
              // VALIDA QUE QUEDO ACTIVO
              cy.get("#statusModify").should("have.attr", "aria-checked", "true");
            }
          });
      });
    });

    it("desactivar estado web del servicio", () => {

    // CODIGO FIJO DEL SERVICIO
    const codigo = Cypress.env().dataServices[0].code;
    // BUSCAR SERVICIO
    cy.get("#search").should("be.visible").clear().type(codigo);
    // VALIDAR QUE LA FILA EXISTA
    cy.contains("tbody tr", codigo, { timeout: 10000 }).should("be.visible");
    // INTERCEPTA CAMBIO DE ESTADO WEB
    cy.intercept("PUT","**/v1/services/status-web/*").as("cambiarEstadoWeb");
    // TRABAJA SOLO SOBRE LA FILA
    cy.contains("tbody tr", codigo).within(() => {
      // LEE ESTADO ACTUAL
      cy.get("#webStatus").invoke("attr", "aria-checked").then((estadoActual) => {

          // SOLO DESACTIVA SI ESTA ACTIVO
          if (estadoActual === "true") {

            // CLICK AL SWITCH WEB
            cy.get("#webStatus").scrollIntoView().click();
            // VALIDA RESPUESTA BACKEND
            cy.wait("@cambiarEstadoWeb").its("response.statusCode").should("eq", 200);
            // VALIDA QUE QUEDO INACTIVO
            cy.get("#webStatus").should("have.attr", "aria-checked", "false");
          }
        });
    });
  });

    it("activar estado web del servicio", () => {

    // CODIGO FIJO DEL SERVICIO
    const codigo = Cypress.env().dataServices[0].code;
    // BUSCAR SERVICIO
    cy.get("#search").should("be.visible").clear().type(codigo);
    // VALIDAR QUE LA FILA EXISTA
    cy.contains("tbody tr", codigo, { timeout: 10000 }).should("be.visible");
    // INTERCEPTA CAMBIO DE ESTADO WEB
    cy.intercept("PUT","**/v1/services/status-web/*").as("cambiarEstadoWeb");
    // TRABAJA SOLO SOBRE LA FILA
    cy.contains("tbody tr", codigo).within(() => {
      // LEE ESTADO ACTUAL
      cy.get("#webStatus").invoke("attr", "aria-checked").then((estadoActual) => {

          // SOLO ACTIVA SI ESTA INACTIVO
          if (estadoActual === "false") {

            // CLICK AL SWITCH WEB
            cy.get("#webStatus").scrollIntoView().click();
            // VALIDA RESPUESTA BACKEND
            cy.wait("@cambiarEstadoWeb").its("response.statusCode").should("eq", 200);
            // VALIDA QUE QUEDO ACTIVO
            cy.get("#webStatus").should("have.attr", "aria-checked", "true");
          }
        });
    });
  });

  it("filtra servicios por estado Inactivo", () => {

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

  it("ordena servicios de reciente a más antiguo", () => {
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

// * Estos tests recorren múltiples módulos (Servicios y Grupos de servicio).
// * No usan startConfig para evitar estados inconsistentes.
describe("Servicios + Grupos de servicio ", () => {

    beforeEach(() => {
    cy.viewport(1336, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
    });
  });

    it("no permite asignar un grupo de servicio inactivo al crear un servicio", () => {
    // codigo fijo
    const codigoGrupo = Cypress.env().dataServiceGroup[0].code;
    // Ingresa al módulo de servicio y valida
    cy.contains("button", "Configuración").click();
    cy.contains("a", "Grupos de servicio").click();
    cy.contains("h2", "Grupos de servicio").should("be.visible");
    // BUSCA EL GRUPO 
    cy.get("#search").clear().type(codigoGrupo);
    // DESACTIVA EL GRUPO DE SERVICIO
    cy.contains("tbody tr", codigoGrupo)
      .find("#statusModify")
      .scrollIntoView()
      .click();
    // VALIDO QUE EL ESTADO ACTUALIZO
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // INTENTA CREAR UN SERVICIO
    cy.contains("a", "Servicios").click();
    cy.contains("button", "Nuevo servicio").click();
    cy.contains("h2", "Servicio").should("be.visible");
    // BUSCA EL GRUPO INACTIVO
    cy.get("input#serviceGroupsId").clear().type(codigoGrupo);
    // VALIDO QUE EL GRUPO NO DEBE APARECER
    cy.contains("li", codigoGrupo).should("not.exist");
  });

  it("permite asignar un grupo de servicio activo al crear un servicio", () => {
    // codigo fijo
    const codigoGrupo = Cypress.env().dataServiceGroup[0].code;
    // Ingresa al módulo de servicio y valida
    cy.contains("button", "Configuración").click();
    cy.contains("a", "Grupos de servicio").click();
    cy.contains("h2", "Grupos de servicio").should("be.visible");
    // BUSCA EL GRUPO
    cy.get("#search").clear().type(codigoGrupo);
    // ACTIVA EL GRUPO 
    cy.contains("tbody tr", codigoGrupo)
      .find("#statusModify")
      .scrollIntoView()
      .click();
    // VALIDO QUE EL ESTADO ACTUALIZO
    cy.contains("Estado actualizado exitosamente").should("be.visible");
    // CREAR SERVICIO
    cy.contains("a", "Servicios").click();
    cy.contains("button", "Nuevo servicio").click();
    cy.contains("h2", "Servicio").should("be.visible");
    // BUSCA EL GRUPO ACTIVO   
    cy.get("input#serviceGroupsId").clear().type(codigoGrupo);
    // VALIDA QUE EL GRUPO DEBE APARECER
    cy.contains("li", codigoGrupo).should("be.visible");
  });
});

