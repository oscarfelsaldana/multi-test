// TEST PACIENTE: CREAR, EDITAR, , DESACTIVAR, ACTIVAR, FILTRAR
describe("Test paciente", () => { 

 beforeEach(() => {
        cy.viewport(1366, 768);
        cy.startConfig({
          email: Cypress.env().dataOperators[0].email,
          password: Cypress.env().dataOperators[0].password,
          module: "Citas",
          option: "Pacientes",
          title: "Pacientes",
        });
    });

  //* TEST CREAR
  it("crea pacientes", () => {
    // DATOS DINAMICOS
    const timestamp = Date.now();
    const basePatient = Cypress.env().dataPatients[0];
    // USA SPREAD
    const patient = {
      ...basePatient, 
      documentNumber: `10${timestamp.toString().slice(-8)}`,
      email: `paciente_${timestamp}Cy@gmail.com`,
      phoneNumber: `312${timestamp.toString().slice(-7)}`,

    };
      // CLICK 
      cy.get("button").contains("Nuevo paciente").click();
      cy.get("p").contains("Cree o actualice un paciente.").should("be.visible");

      // TIPO DE DOCUMENTO
      // cy.selectHeadlessSingle("button#typeDocumentId", patient.documentType);
      cy.get("span").contains("Seleccione una opción").eq(0).click();
      cy.get("span").contains(patient.documentType).click();
      // LLAMO LA FUNCION PARA LLENAR INPUT DE TEXTO SIMPLES Y MANDO LOS PARAMETRO AL COMANDO
      cy.fillInputs({ 
        //NUMERO DE DOCUMENTO
        "#documentNumber": patient.documentNumber,
        //PRIMER NOMBRE
        "#firstName": patient.firstName,
        //SEGUNDO NOMBRE
        "#secondName": patient.secondName,
        //PRIMER APELLIDO
        "#firstSurname": patient.firstSurname,
        //SEGUNDO APELLIDO
        "#secondSurname": patient.secondSurname,
        //RH
        "#rhFactor": patient.rhFactor
      });
      // *COMANDOS SELECTS HEADLESS
      // SEXO
      cy.selectHeadlessSingle("button#sex",patient.sex);
      //ESTADO CIVIL
      cy.selectHeadlessSingle("button#maritalStatus",patient.maritalStatus);  
      // IDENTIDAD DE GÉNERO 
      cy.selectHeadlessSingle("button#genderIdentity",patient.gender);
      // GRUPO ÉTNICO
      cy.selectHeadlessSingle("button#ethnicGroupId",patient.ethnicity);  
      // FECHA NACIMIENTO
      cy.get("#birthDate").type(patient.birthDate);
      // CERRAR CALENDARIO 
      cy.get("body").click(0,0);
      // RÉGIMEN 
      cy.selectHeadlessSingle("button#regimen",patient.regime)  
      // NIVEL 
      cy.selectHeadlessSingle("button#incomeRange",patient.incomeRange);
      // TIPO DE AFILIACIÓN = Seleccionar "Beneficiario"
      cy.selectHeadlessSingle("button#affiliationType",patient.affiliationType)
      // DOCUMENTO DEL COTIZANTE (se habilita solo con Beneficiario)
      cy.fillInputs({"#contributorDocumentNumber" :patient.contributorDocumentNumber}); 
      // MUNICIPIO DE RESIDENCIA 
      cy.selectHeadlessCombo("input#municipalityId",patient.municipality,patient.municipality);
      // NIVEL ACADÉMICO
      cy.selectHeadlessSingle("button#academic",patient.academicLevel);
      // Telefono
      cy.fillInputs({
        // TELEFONO
        "#phoneNumber" : patient.phoneNumber,
        // TELEFONO SECUNDARIO
        "#secondPhoneNumber" : patient.secondPhoneNumber,
        // CORREO
        "#email" : patient.email,
        // DIRECCION
        "#address" : patient.address,
      }); 
      // OCUPACIÓN (COMANDO SELECTHEADLESSCOMBO) 
      cy.selectHeadlessCombo( "input#occupationId",patient.occupationSearch,patient.occupationLabel);
      
      // OPERADOR TERCIARIO POR SI SAKE CONTRI O SUBSI AL ESCRIBIR SANI
      const epslabel =                             
        patient.regime ==="Contributivo"           
          ? "EPS001 - EPS SANITAS - contributivo"  
          : "EPS001 - EPS SANITAS - subsidiado";   
      // ASEGURADORA
      cy.selectHeadlessCombo("input#healthCompanyId",patient.healthCompanySearch,epslabel)
      // CONTRATO
      cy.selectHeadlessCombo("input#healthContractId",patient.contractSearch,patient.contractLabel);
      // NOVEDADES (COMANDO HeadlessUI Multiselect)
      cy.selectHeadlessMultiselect("button#novelties",patient.novelty)
      // TIPO DE DISCAPACIDAD
      cy.selectHeadlessSingle("button#disabilityType",patient.disabilityType);
      // SENTENCIAS JUDICIALES
      cy.selectHeadlessSingle("button#judicialSentence",patient.judicialSentence)

      // *GUARDAR PACIENTE, CLICK Y VALIDAR 
      cy.intercept( "POST",`${Cypress.env("urlApi")}/v1/patients`).as("creacionCorrecta");                 
      cy.get("button").contains("Guardar").click({ force: true }); 
      cy.wait("@creacionCorrecta").its("response.statusCode") .should("eq", 200);         
  });

  // * PRUEBA: BUSCAR Y EDITAR PACIENTE 
  it("busca y edita paciente", () => {  
    // DOCUMENTO FIJO
    const documento = Cypress.env().dataPatients[0].documentNumber;
    // BUSCAR PACIENTE
    cy.get("#search").should("be.visible").clear().type(documento);
    // VALIDA QUE LA TABLA EXISTA
    cy.contains("tr", documento, { timeout: 10000 }).should("exist");
    // CLICK EN EL BOTON DE EDITAR 
    cy.contains("tr", documento)
      .within(() => { // limita la búsqueda SOLO dentro de esa fila <tr>                                
        cy.get("#modify")                                           
          .should("be.visible")                                     
          .click();                                                 
      });
    // EDITA PRIMER NOMBRE CON DATO DINAMICO 
    const nuevoNombre = "Paciente-" + Date.now();  
    cy.get("#firstName").should("be.visible").clear().type(nuevoNombre, { delay: 50 });             
    // INTERCEPTAR PETICION
    cy.intercept("PUT",`${Cypress.env("urlApi")}/v1/patients/*`).as("actualizarPaciente");                     
    // CLICK GUARDAR 
    cy.contains("button", "Guardar").scrollIntoView().should("be.visible").click({ force: true });                       
    // VALIDA RESPUESTA DE LA API
    cy.wait("@actualizarPaciente").its("response.statusCode").should("eq", 200);
    // VALIDA QUE EL CAMBIO SE REFLEJE EN LA TABLA
    cy.get("#search").clear().type(documento, { delay: 50 })
    cy.contains("td", nuevoNombre, { timeout: 10000 }) .should("be.visible");                            
  });  

  //* TEST DE INACTIVAR
  it("inactivar paciente", () => {

    // DOCUMENTO FIJO DEL PACIENTE
    const documento = Cypress.env().dataPatients[0].documentNumber;

    // BUSCA EL PACIENTE POR DOCUMENTO
    cy.get("#search").should("be.visible").clear().type(documento);
    // VALIDA QUE LA FILA DEL PACIENTE EXISTA EN LA TABLA
    cy.contains("tr", documento, { timeout: 10000 }).should("be.visible");
    // INTERCEPTA LA PETICIÓN DE CAMBIO DE ESTADO
    cy.intercept("PUT",`${Cypress.env("urlApi")}/v1/patients/status/*`).as("cambiarEstado");
    // TRABAJA ÚNICAMENTE SOBRE LA FILA DEL PACIENTE ENCONTRADO
    cy.contains("tr", documento).within(() => {
      // OBTIENE EL ESTADO ACTUAL DEL SWITCH
      cy.get("#statusModify").invoke("attr", "aria-checked").then((estadoActual) => {

          // SI YA ESTÁ INACTIVO, NO REALIZA NINGUNA ACCIÓN
          if (estadoActual === "false") return;
          // HACE CLICK PARA DESACTIVAR EL PACIENTE
          cy.get("#statusModify").scrollIntoView().click({ force: true });
          // VALIDA QUE EL BACKEND RESPONDA CORRECTAMENTE
          cy.wait("@cambiarEstado").its("response.statusCode").should("eq", 200);
          // VALIDA QUE EL SWITCH QUEDE EN ESTADO INACTIVO
          cy.get("#statusModify").should("have.attr", "aria-checked", "false");
        });
    });

  });

    //* TEST DE ACTIVAR 
    it("activar paciente", () => {

    // DOCUMENTO FIJO DEL PACIENTE
    const documento = Cypress.env().dataPatients[0].documentNumber;
    // BUSCA EL PACIENTE POR DOCUMENTO
    cy.get("#search").should("be.visible").clear().type(documento);
    // VALIDA QUE LA FILA DEL PACIENTE EXISTA EN LA TABLA
    cy.contains("tr", documento, { timeout: 10000 }).should("be.visible");
    // INTERCEPTA LA PETICIÓN DE CAMBIO DE ESTADO
    cy.intercept("PUT",`${Cypress.env("urlApi")}/v1/patients/status/*`).as("cambiarEstado");
    // TRABAJA ÚNICAMENTE SOBRE LA FILA DEL PACIENTE ENCONTRADO
    cy.contains("tr", documento).within(() => {

      // OBTIENE EL ESTADO ACTUAL DEL SWITCH
      cy.get("#statusModify").invoke("attr", "aria-checked").then((estadoActual) => {
          // SI YA ESTÁ ACTIVO, NO REALIZA NINGUNA ACCIÓN
          if (estadoActual === "true") return;
          // HACE CLICK PARA ACTIVAR EL PACIENTE
          cy.get("#statusModify").scrollIntoView().click({ force: true });
          // VALIDA QUE EL BACKEND RESPONDA CORRECTAMENTE
          cy.wait("@cambiarEstado").its("response.statusCode").should("eq", 200);
          // VALIDA QUE EL SWITCH QUEDE EN ESTADO ACTIVO
          cy.get("#statusModify").should("have.attr", "aria-checked", "true");
        });
    });

  });

  //* TEST FILTRA 
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

  //* TEST ORDENA
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
