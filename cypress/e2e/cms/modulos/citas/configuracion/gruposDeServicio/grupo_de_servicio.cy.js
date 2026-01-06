// ======================================================================================================
// TEST GRUPO DE SERVICIOS: CREAR, EDITAR, ACTIVAR, DESACTIVAR,
// ======================================================================================================
describe("Test grupos de servicio", () => {

  beforeEach(() => {
    cy.viewport(1336, 768);
    cy.startConfig({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Citas",
      option: "Grupos de servicio",
      title: "Grupos de servicio", 
    });
  });

  it("abre y crea un grupo de servicios", () => {

    // Abre el formulario de creación
    cy.contains("button", "Nuevo grupo de servicio").click();
    cy.contains("h2", "Grupo de servicio").should("be.visible");

    // Llena el formulario con datos únicos
    const timestamp = Date.now();cy.fillInputsModal({
      "#code": `GRUPOSERV-${timestamp}`,
      "#description": `Descripción del grupo ${timestamp}`,
    });
    // INTERCEPTAR PETICION
    cy.intercept("POST",`${Cypress.env("urlApi")}/v1/service-groups`).as("crearGrupoServicio");
    // CLICK
    cy.contains("button", "Guardar").click();
    // VALIDA PETICION
    cy.wait("@crearGrupoServicio").its("response.statusCode").should("eq", 200);
  });

  it("edita un grupo de servicio existente", () => {
    // CÓDIGO FIJO DEL GRUPO
    const codigoGrupo = Cypress.env().dataServiceGroup[0].code;
    // BUSCA EL GRUPO POR CÓDIGO
    cy.get("#search").should("be.visible").clear().type(codigoGrupo);
    // VALIDA QUE LA FILA EXISTA
    cy.contains("tbody tr", codigoGrupo, { timeout: 10000 }).should("be.visible");
    // TRABAJA SOLO SOBRE LA FILA DEL GRUPO
    cy.contains("tbody tr", codigoGrupo).within(() => {
      // ABRE MODAL DE EDICIÓN
      cy.get("#modify")
        .should("be.visible")
        .scrollIntoView()
        .click();
    });
    // VALIDA QUE SE ABRIÓ EL MODAL
    cy.contains("h2", "Grupo de servicio").should("be.visible");
    // DESCRIPCIÓN DINÁMICA
    const nuevaDescripcion = `Descripción editada ${Date.now().toString().slice(-6)}`;
    // EDITA DESCRIPCIÓN
    cy.fillInputsModal({"#description": nuevaDescripcion,});
    // INTERCEPTA PETICION
    cy.intercept("PUT",`${Cypress.env("urlApi")}/v1/service-groups/*`).as("editarGrupo");
    // CLICK
    cy.contains("button", "Guardar").scrollIntoView().click({ force: true });
    // VALIDA RESPUESTA
    cy.wait("@editarGrupo").its("response.statusCode").should("eq", 200);
    // VALIDA CAMBIO
    cy.get("#search").clear().type(codigoGrupo);
    cy.contains("td", nuevaDescripcion, { timeout: 10000 }).should("be.visible");
  });

  it("inactivar grupo", () => {

    // CODIGO FIJO DEL SERVICIO
    const codigo = Cypress.env().dataServiceGroup[0].code
    // BUSCA GRUPO
    cy.get("#search").should("be.visible").clear().type(codigo);
    // VALIDA FILA
    cy.contains("tbody tr", codigo,{ timeout: 10000 }).should("be.visible");
    // INTERCEPTA PETICION
    cy.intercept("PUT","**/v1/service-groups/status/**").as("cambiarEstadoGrupo");
    // TRABAJA SOLO SOBRE LA FILA DEL GRUPO
    cy.contains("tbody tr", codigo).within(() => {
      // ESTADO ACTUAL DEL SWITCH
      cy.get("#statusModify").invoke("attr", "aria-checked").then((estadoInicial) => {
        
        // SOLO INACTIVA SI ESTA ACTIVO
        if (estadoInicial === "true") {

          // CLICK
          cy.get("#statusModify").scrollIntoView().click();
          // VALIDA RESPUESTA DEL BACKEND
          cy.wait("@cambiarEstadoGrupo").its("response.statusCode").should("eq", 200); 
          // VALIDA QUE EL ESTADO CAMBIO A INACTIVO
          cy.get("#statusModify").should("have.attr", "aria-checked", "false");

        }
      });
    }); 
    
  });

  it("activar grupo", () => {
  
  // CODGIO FIJO DEL GRUPO
  const codigo = Cypress.env().dataServiceGroup[0].code
  // BUSCA GRUPO 
  cy.get("#search").should("be.visible").clear().type(codigo);
  // VALIDA QUE LA FILA EXISTA
  cy.contains("tbody tr", codigo, { timeout: 10000 }).should("be.visible");
  // INTERCEPTA LA PETICION
  cy.intercept("PUT","**/v1/service-groups/status/**").as("cambiarEstado");
    // TRABAJA SOLO SOBRE LA FILA
    cy.contains("tbody tr", codigo).within(() => {

      //LEE EL ESTADO ACTUAL
      cy.get("#statusModify").invoke("attr", "aria-checked").then((estadoActual) => {

        // SOLO ACTIVA SI ESTA INACTIVO
        if (estadoActual === "false") {

          // CLICK
          cy.get("#statusModify").scrollIntoView().click();
          // VALIDA RESPUESTA DEL BAC
          cy.wait("@cambiarEstado").its("response.statusCode").should("eq", 200);
          // VALIDA QUE QUEDO INACTIVO
          cy.get("#statusModify").should("have.attr", "aria-checked", "false"); 
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