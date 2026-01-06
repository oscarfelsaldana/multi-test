// TEST ENTIDADES AFILIADORAS: CREAR, EDITAR, FILTRAR, ACTIVAR, DESACTIVAR, ORDENAR.
describe("Test de entidades afiliadoras", () => {

    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.startConfig({
          email: Cypress.env().dataOperators[0].email,
          password: Cypress.env().dataOperators[0].password,
          module: "Citas",
          option: "Entidades afiliadoras",
          title: "Entidades afiliadoras",
        });
    });

    it("Crea una entidad afiliadora", () => {

      // ABRE EL FORMULARIO 
      cy.contains("button", "Nueva entidad afiliadora").click();
      cy.contains("h2", "Entidad Afiliadora").should("be.visible");
      // DATO DINAMICO
      const codigo = "EPS" + Date.now().toString().slice(-3);
      const nit = "901" + Date.now().toString().slice(-6);
      const nombre = "NUEVA EPS" + Date.now().toString().slice(-2);
      // DATOS FIJOS
      const patient = Cypress.env().dataHealthCompanies[0];
      cy.fillInputsModal({
        "#code": codigo,
        "#taxIDNumber": nit,
        "#name": nombre
      });
      cy.selectHeadlessSingle("button#regimen",patient.regime,);
      cy.fillInputsModal({
        "#address": patient.address,
        "#authorizationCharLimit": "8", 
      });
      cy.intercept("POST", "**/v1/health-companies" ).as("crearEntidadAfiliadora");
      // CLICK
      cy.contains("button","Guardar").click();
      cy.wait("@crearEntidadAfiliadora").its("response.statusCode").should("eq", 200);
    });

    it("Editar entidad afiliadora", () => {
      
      // CODIGIO FIJO
      const patient = Cypress.env().dataHealthCompanies[0];
      // DATO DINAMICO DE DIRECCION
      const addressEdited = "Calle 1 #10-10 editada" + Date.now().toString().slice(-3);
      // BUSCAR LA ENTIDAD AFILIADORA A EDITAR
      cy.fillInputsModal({
        "#search": patient.code,
      });
      // ESPERA QUE CARGUE LA FILA EN LA TABLA
      cy.contains("tbody tr", patient.code).as("filaSeleccionada");
      // CLICK EN EL BOTON DE EDITAR 
      cy.get("@filaSeleccionada").find("svg#modify").scrollIntoView().click();
      // VALIDA QUE SE ABRIO EL MODAL DE EDICION
      cy.contains("h2","Entidad Afiliadora").should("be.visible");
      // COMANDO PERSONALIZADO PARA LLENAR INPUTS
      cy.fillInputsModal({
      "#address": addressEdited, 
      });
      // INTERCEPTAR PETICION
      cy.intercept("PUT", "**/v1/health-companies/**").as("actualizarEntidad");
      // CLICK GUARDAR
      cy.contains("button","Guardar").click();
      // ESPERA LA RESPUESTA DE LA PETICION
      cy.wait("@actualizarEntidad").its("response.statusCode").should("eq", 200);
    });

    it("elimina un servicio de la entidad afiliadora", () => {  

      // CODIGIO FIJO
      const codigo = Cypress.env().dataHealthCompanies[0].code;
      const codigoServicio = "890306";
      // BUSCAR LA ENTIDAD AFILIADORA A EDITAR
      cy.fillInputsModal({ 
        "#search": codigo,
      });
      // ESPERA QUE CARGUE LA FILA EN LA TABLA
      cy.contains("tbody tr", codigo,{ timeout: 10000 }).as("filaSeleccionada"); 
      // CLCIK EN EL BOTON DE EDITAR
      cy.get("@filaSeleccionada").find("svg#modify").scrollIntoView().click();
      // VALIDA QUE SE ABRIO EL MODAL DE EDICION
      cy.contains("h2","Entidad Afiliadora").should("be.visible");
      // CLICK EN LA PESTAÑA DE SERVICIOS
      cy.contains('button[role="tab"]', 'Servicios').click();
      // VALIDA QUE EL SERVICIO EXISTA 
      cy.contains("tbody tr", codigoServicio).as("filaServicio");
      // INTERCEPTAR PETICION 
      cy.intercept("DELETE", "**/v1/health-services/**").as("desasignarServicio");
      // CLICK EN ELIMINAR 
      cy.contains("tbody tr", codigoServicio).within(() => {
        cy.contains("button","Eliminar").click();
      });
      // RESPUESTA DE LA PETICION
      cy.wait("@desasignarServicio").its("response.statusCode").should("eq", 200);
      // VALIDA QUE EL SERVICIO YA NO EXISTA
      cy.contains("tbody tr", codigoServicio).should("not.exist");


    });

    it("agrega un servicio a la entidad afiliadora", () => {  
      
      // CODIGIO FIJO
      const codigo = Cypress.env().dataHealthCompanies[0].code;
      const codigoServicio = "890306";
      // BUSCAR LA ENTIDAD AFILIADORA A EDITAR
      cy.fillInputsModal({ 
        "#search": codigo,
      });
      // ESPERA QUE CARGUE LA FILA EN LA TABLA
      cy.contains("tbody tr", codigo,{ timeout: 10000 }).as("filaSeleccionada"); 
      // CLCIK EN EL BOTON DE EDITAR
      cy.get("@filaSeleccionada").find("svg#modify").scrollIntoView().click();
      // VALIDA QUE SE ABRIO EL MODAL DE EDICION
      cy.contains("h2","Entidad Afiliadora").should("be.visible");
      // CLICK EN LA PESTAÑA DE SERVICIOS
      cy.contains('button[role="tab"]', 'Servicios').click();
      // INTERCEPTAR PETICION
      cy.intercept("POST","**/v1/health-services*").as("asignarServicio");
      // CLICK EN AGREGAR SERVICIO COMANDO PERSONALIZADO
      cy.selectHeadlessSearchOnly("input#service",codigoServicio);
      // RESPUESTA DE LA PETICION
      cy.wait("@asignarServicio").its("response.statusCode").should("eq", 200);
      // VALIDA QUE EL SERVICIO EXISTA 
      cy.contains("tbody tr", codigoServicio).as("filaServicio");
    });
    
    it("no permite agregar un servicio inactivo a la entidad afiliadora", () => {

    // CODIGO FIJO
    const codigo = Cypress.env().dataHealthCompanies[0].code;
    const codigoServicio = "893106";
    // BUSCAR LA ENTIDAD AFILIADORA A EDITAR
    cy.fillInputsModal({
      "#search": codigo,
    });
    // ESPERA QUE CARGUE LA FILA EN LA TABLA
    cy.contains("tbody tr", codigo, { timeout: 10000 }).as("filaSeleccionada");
    // CLICK EN EL BOTON DE EDITAR
    cy.get("@filaSeleccionada").find("svg#modify").scrollIntoView().click();
    // VALIDA QUE SE ABRIO EL MODAL DE EDICION
    cy.contains("h2", "Entidad Afiliadora").should("be.visible");
    // CLICK EN LA PESTAÑA DE SERVICIOS
    cy.contains('button[role="tab"]', "Servicios").should("be.visible").click();
    // BUSCA Y SELECCIONA EL SERVICIO EN EL AUTOCOMPLETE
    cy.get("input#service").should("be.visible").clear().type(codigoServicio, { delay: 50 });
    // VALIDAR QUE EL SERVICIO NO APARECE EN LA LISTA
    cy.contains("li", codigoServicio).should("not.exist");

  });

    it("inactivar entidad afiliadora", () => {

      // CODIGO FIJO DEL SERVICIO
      const codigo = Cypress.env().dataHealthCompanies[0].code;
      // BUSCAR LA ENTIDAD AFILIADORA A INACTIVAR 
      cy.fillInputsModal({
      "#search": codigo, 
      });
      // VALIDA QUE LA FILA EXISTA
      cy.contains("tbody tr", codigo, { timeout: 10000 }).should("exist");
      // INTERCEPTAR PETICION
      cy.intercept("PUT", "**/v1/health-companies/status/**").as("cambiarEstado");
      // TRABAJA SOLO SOBRE LA FILA DEL SERVICIO
      cy.contains("tbody tr", codigo).within(() => {

        // LEE EL ESTADO ACTUAL
        cy.get("#statusModify").invoke("attr", "aria-checked").then((estadoActual) => {
          // SOLO INACTIVA SI ESTA ACTIVO
          if (estadoActual === "true") {
            // CLICK AL SWITCH
            cy.get("#statusModify").click();
            // ESPERA LA RESPUESTA DE LA PETICION
            cy.wait("@cambiarEstado").its("response.statusCode").should("eq", 200);
            // VALIDA QUE EL ESTADO HAYA CAMBIADO
            cy.get("#statusModify").invoke("attr", "aria-checked").should("eq", "false");
          }
        });
      });
    });

    it("activar entidad afiliadora", () => {

      // CODIGO FIJO DEL SERVICIO
      const codigo = Cypress.env().dataHealthCompanies[0].code;
      // BUSCAR LA ENTIDAD AFILIADORA A ACTIVAR 
      cy.fillInputsModal({
      "#search": codigo, 
      });
      // VALIDA QUE LA FILA EXISTA
      cy.contains("tbody tr", codigo, { timeout: 10000 }).should("exist");
      // INTERCEPTAR PETICION
      cy.intercept("PUT", "**/v1/health-companies/status/**").as("cambiarEstado");
      // TRABAJA SOLO SOBRE LA FILA DEL SERVICIO
      cy.contains("tbody tr", codigo).within(() => {

        // LEE EL ESTADO ACTUAL
        cy.get("#statusModify").invoke("attr", "aria-checked").then((estadoActual) => {

          // SOLO ACTIVA SI ESTA INACTIVO
          if (estadoActual === "false") {
            // CLICK AL SWITCH
            cy.get("#statusModify").click();
            // ESPERA LA RESPUESTA DE LA PETICION
            cy.wait("@cambiarEstado").its("response.statusCode").should("eq", 200);
            // VALIDA QUE EL ESTADO HAYA CAMBIADO
            cy.get("#statusModify").invoke("attr", "aria-checked").should("eq", "true");

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
        cy.selectHeadlessSingle(
        "button#status", "Activo");
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