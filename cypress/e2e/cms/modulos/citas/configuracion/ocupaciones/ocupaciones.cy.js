// TEST OCUPACIONES: CREAR, EDITAR, FILTRAR, ACTIVAR, DESACTIVAR, ORDENAR.
describe("Test de ocupaciones", () =>{

    beforeEach(() => {
        cy.viewport(1366, 768);
        cy.startConfig({
          email: Cypress.env().dataOperators[0].email,
          password: Cypress.env().dataOperators[0].password,
          module: "Citas",
          option: "Ocupaciones",
          title: "Ocupaciones",
        });
    });

    it("Crea una ocupación", () => {

       // ABRE EL FORMULARIO
       cy.contains("button", "Nueva ocupación").click();
       cy.contains("h2", "Ocupación").should("be.visible");
       // DATO DINAMICO 
       const nombre = "ingeniero" + Date.now().toString().slice(-2);
       // COMANDO PERSONALIZADO
       cy.fillInputsModal({
          "#name": nombre,
          "#description": "Programador",
       });
       cy.intercept("POST", "**/v1/occupations").as("crearOcupacion");
       // CLICK
       cy.contains("button","Guardar").click();
       cy.wait("@crearOcupacion").its("response.statusCode").should("eq", 200);
    });

    it("Editar ocupacion", () => {

        // CODIGO FIJO
        const codigo = Cypress.env().dataOcupaciones[0].name;
        // BUSCAR LA ESPECIALIDAD A EDITAR 
        cy.fillInputsModal({
        "#search": codigo,
        });
        // ESPERA QUE CARGUE LA FILA EN LA TABLA
        cy.contains("tbody tr", codigo).as("filaSeleccionada");
        // CLICK EN EL BOTON DE EDITAR 
        cy.get("@filaSeleccionada").find("svg#modify").scrollIntoView().click();
        // VALIDA QUE SE ABRIO EL MODAL DE EDICION
        cy.contains("h2","Ocupación").should("be.visible");
        // DESCRIPCION DINÁMICA
        const descripcion = "Programador Junior";
        // COMANDO PERSONALIZADO PARA LLENAR INPUTS
        cy.fillInputsModal({
        "#description": descripcion,
        });
        // INTERCEPTAR PETICION
        cy.intercept("PUT", "**/v1/occupations/**").as("actualizarOcupacion");
        // CLICK GUARDAR
        cy.contains("button","Guardar").click();
        // ESPERA LA RESPUESTA DE LA PETICION
        cy.wait("@actualizarOcupacion").its("response.statusCode").should("eq", 200);
    });

    it("inactivar ocupacion", () => {

        // CODIGO FIJO DEL SERVICIO
        const codigo = Cypress.env().dataOcupaciones[0].name;
        // BUSCAR LA OCUPACION A INACTIVAR 
        cy.fillInputsModal({
        "#search": codigo,
        });
        // VALIDA QUE LA FILA EXISTA
        cy.contains("tbody tr", codigo, { timeout: 10000 }).should("be.visible");
        // INTERCEPTA LA PETICION DE CAMBIO DE ESTADO
        cy.intercept("PUT","**/v1/occupations/status/**").as("cambiarEstado");
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
                    // VALIDA QUE QUEDO INACTIVO
                    cy.get("#statusModify").invoke("attr", "aria-checked").should("eq", "false");
                }
            });
        });
    });

    it("activar ocupacion", () => {

        // CODIGO FIJO DEL SERVICIO
        const codigo = Cypress.env().dataOcupaciones[0].name;
        // BUSCAR LA OCUPACION A ACTIVAR 
        cy.fillInputsModal({
        "#search": codigo,
        });
        // VALIDA QUE LA FILA EXISTA
        cy.contains("tbody tr", codigo, { timeout: 10000 }).should("be.visible");
        // INTERCEPTA LA PETICION DE CAMBIO DE ESTADO
        cy.intercept("PUT","**/v1/occupations/status/**").as("cambiarEstado");
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
                    // VALIDA QUE QUEDO ACTIVO
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