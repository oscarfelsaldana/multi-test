// ===============================================
// COMANDO PARA EL LOGIN
// =============================================== 
Cypress.Commands.add("login", ({ email, password, module }) => {

  // REUTILIZA LA SESIÓN DEL USUARIO HACE LOGIN REAL
  cy.session([email],() => { //Si ya existe una sesión para este email, NO vuele a loguear
    // ABRE LA PAGINA PRINCIPAL
    cy.visit(Cypress.env().hostName);

    // Llenar inputs 
    cy.get("#email").clear().type(email);
    cy.get("#password").clear().type(password);

    // Esperar que el botón esté habilitado y hace click
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("not.be.disabled")
      .click();

    // VALIDA QUE EL LOGIN FUE EXITOSO (YA NO ESTÁ EN /auth/signin)
    cy.url({ timeout: 15000 }).should("not.include", "/auth/signin");
  });
    // GARANTIZA QUE LA APP SE CARGUE CON LA SESIÓN YA ACTIVA
    cy.visit(Cypress.env().hostName);
    
    // Seleccionar módulo indicado 
    cy.openModule(module);
})
// ===============================================
// COMANDO PARA SELECCIONAR MODULO 
// ===============================================
Cypress.Commands.add("openModule", (moduleName) => {
  cy.contains("div.cursor-pointer", moduleName, { timeout: 15000 })
    .should("be.visible")
    .click({ force: true });
});
// ===============================================
// COMANDO QUE HACE LOGIN Y ENTRA A UNA OPCIÓN DE "CONFIGURACIÓN"
// PARA QUE EN beforeEach() NO TOQUE REPETIR LOS CLICKS DE NAVEGACIÓN
// ===============================================
Cypress.Commands.add("startConfig", ({ email, password, module, option, title }) => {

  // INICIA SESIÓN (SI YA EXISTE SESIÓN, NO VUELVE A LOGUEAR; SI NO, HACE LOGIN NORMAL)
  // ADEMÁS DEJA ABIERTO EL MÓDULO INDICADO (EJ: "Citas")
  cy.login({ email, password, module });

  // ABRE EL MENÚ "CONFIGURACIÓN" PARA MOSTRAR LAS OPCIONES
  cy.contains("button", "Configuración")
    .should("be.visible")
    .click();

  // ENTRA A LA OPCIÓN ESPECÍFICA QUE SE RECIBE POR PARÁMETRO (option)
  // EJ: option = "Especialidades"
  cy.contains("a", option)
    .should("be.visible")
    .click();

  // CONFIRMA QUE YA CARGÓ LA PANTALLA CORRECTA VALIDANDO EL TÍTULO (h2)
  // SI NO SE PASA title, USA EL MISMO TEXTO DE option
  cy.contains("h2", title || option)
    .should("be.visible");

});

// ===============================================
// COMANDO PARA LLENAR INPUTS DE TEXTO
// selector → id o class del input (ej: "#firstName")
// value → valor que se va a escribir (ej: "Sebastián")
// ===============================================
Cypress.Commands.add("fillInputs", (fields) => {          // creo el comando, este comando recibe un objeto llamado fields
  // Object.entries(fields) convierte el objeto en pares [selector, valor], Luego forEach recorre esos pares y con destructuring obtengo:
  Object.entries(fields).forEach(([selector, value]) => { // selector = el input a manipular y value = el texto que se debe escribir
    cy.get(selector)                //busco el input en el DOM usando lo que me llego del selector
      .scrollIntoView()             //hago scroll hasta el input para asegurarme que este visible en pantalla
      .should("be.visible")         //valido que exista en el DOM de la pagina, que este renderizado 
      .and("not.be.disabled")       //valido que el input no este deshabilitado
      .clear()                      //limpio el campo antes de escribir   
      .type(value, { delay: 50 })   //escribo el texto que llega de value y le agrego delay para que se escriba mas lento
      .should("have.value", value); //valido que lo que se escribio realmente quedo en el input 
  });
});

// ===============================================
// COMANDO PARA LOS COMBOBOX HEADLESS UI -------- SOLO SIRVE PARA INPUTS DONDE SE ESCRIBE----------
// EJEMPLO, OCUPACION, ENTIDAD AFILIADORA, CONTRATO,ETC
// ===============================================
// selector → input del combobox (ej: "input#occupationId")
// searchText → lo que se escribe (ej: "Dev")
// labelText → lo que se debe seleccionar (ej: "Dev - Desarrollador de sistemas")
Cypress.Commands.add("selectHeadlessCombo", (selector, searchText, labelText) => { 
  // 1. Escribir en el input funciona para button o input 
  cy.get(selector)
    .should("be.visible")
    .and("not.be.disabled")
    .clear()
    .type(searchText, { delay: 50 });

  // 2. Esperar a que aparezca la lista
  cy.get("ul[role='listbox']", { timeout: 10000 })
    .should("be.visible");

  // 3. Seleccionar la opción exacta
  cy.contains("li", labelText, { timeout: 10000 })
    .should("be.visible")
    .click({ force: true });

  // 4. Validar que quedó seleccionado
  cy.get(selector)
    .invoke("val")
    .then(value => {
      const normalized = value.replace(/\s+/g, " ").trim();
      expect(normalized).to.eq(labelText);
    });

  // 5. Validar que la lista desapareció
  cy.get("ul[role='listbox']").should("not.exist");
});

// ===============================================
// COMANDO PARA BUSCADORES QUE DISPARAN ACCIÓN
// (NO mantienen valor en el input)
// ===============================================
// selector → input (ej: "input#service")
// searchText → texto a buscar (ej: "890306")
Cypress.Commands.add("selectHeadlessSearchOnly", (selector, searchText) => {

  cy.get(selector)
    .should("be.visible")
    .and("not.be.disabled")
    .clear()
    .type(searchText, { delay: 50 });

  cy.get("ul[role='listbox']", { timeout: 10000 })
    .should("be.visible");

  cy.contains("li", searchText, { timeout: 10000 })
    .should("be.visible")
    .click({ force: true });

  // ❗ NO se valida el valor del input
  // ❗ Porque este tipo de componente se limpia solo
});

// ===============================================
// COMANDO PARA LISTBOX MULTISELECT HEADLESS UI--------SIRVE PARA BOTON CON SELECCION MULTIPLE----------
// EJEMPLO, NOVEDADES
// ===============================================
// selector → botón que abre el listbox (ej: "button#novelties")
// optionText → texto exacto del <li> a seleccionar ("Presenta queja") 
Cypress.Commands.add("selectHeadlessMultiselect", (selector, optionText) => {

  // 1. Abro la lista
  cy.get(selector)          // aqui selecciono el input en el html
    .should("be.visible")   // con esto valido que elemento si exista en el html
    .and("not.be.disabled") // con and valido que el elemento no este desabilitado atributo disabled
    .click();               // hago click en el elemento 

  // 2. Esperar que aparezca la lista
  cy.get("ul[role='listbox']", { timeout: 10000 })  // aqui busco en el Dom ese elemento role="listbox" en este caso el menu que se despliega y espero a que salga 10s 
    .should("be.visible");                          // verifico que sea visible esa lista 

  // 3. Seleccionar la opción por texto
  cy.get("ul[role='listbox']")                  // aqui busco un elemento li que tenga role="option" y a demas contenga optionText(Presenta queja)
    .contains(optionText)
    .should("be.visible")                       // verifico que sea visible 
    .click({ force: true });                    // con force forzamos el click asi se presenten animaciones o algo que lo tape levemente 

  // 4. Validar que quedó seleccionada
  cy.get("ul[role='listbox']")     // aqui vuelvo a seleccionar el mismo li donde hice clic antes 
    .contains("span",optionText)
    .closest("li[role='option']") 
    .should("have.attr", "aria-selected", "true"); // aqui valido que el atributo aria-selected este en true para validar que esa fue la seleccionada

  // 5. CERRAR LA LISTA 
  cy.get("body").click(0, 0); // aqui selecciono el body de la pagina y hago click en la esquina superior izquierda  
});
// ===============================================
// COMANDO PARA SELECT HEADLESS UI TIPO <button> -----------SOLO SIRVE PARA SELECCION SIMPLE----------
// selector  → botón que abre la lista (ej: "button#novelties")
// optionText → texto exacto de la opción a seleccionar
// ===============================================
Cypress.Commands.add("selectHeadlessSingle", (selector, optionText) => {

  // 1. Abrir la lista (el usuario haría clic en el botón)
  cy.get(selector)                      // obtengo el botón del listbox
  .scrollIntoView()                    // con esto esfuerzo que el elemento este visible en pantalla
  .should("be.visible")               // verifico que sí esté visible
    .and("not.be.disabled")             // verifico que no esté deshabilitado
    .click();                           // clic para desplegar la lista

  // 2. Esperar a que la lista aparezca en pantalla
  cy.get("ul[role='listbox']", { timeout: 10000 }) // espero el menú desplegable
    .should("be.visible");                         // confirmo que ya se muestra

  // 3. Seleccionar la opción del listbox
  cy.get("ul[role='listbox']")                     // regreso al contenedor del menú
    .scrollIntoView()                              // esfuerzo que el elemento este visible en pantalla                
    .contains("li[role='option']", optionText)     // busco el <li> exacto según texto
    .should("be.visible")                          // verifico que sea visible
    .click({ force: true });                       // clic forzado por animaciones de HeadlessUI

  // 4. Validar que el botón ahora está mostrando la opción seleccionada
  cy.get(selector)                                  // vuelvo al botón original
    .contains(optionText);                          // confirmo que su texto cambió al seleccionado

  // 5. Cerrar la lista haciendo clic en el fondo de la página
  cy.get("body").click(0, 0);                       // click fuera para cerrar el listbox
});
// ============================================================
// COMANDO ESPECIAL PARA MODALES: fillInputsModal
//    - Usa scrollIntoView() y force 
//    - Ideal para formularios dentro de modales o tablas con overflow
// ============================================================
Cypress.Commands.add("fillInputsModal", (fields) => {
  Object.entries(fields).forEach(([selector, value]) => {
    cy.get(selector)
      .scrollIntoView()                    // que el campo esté dentro del área visible del modal
      .clear({ force: true })              // limpiar incluso si el modal genera clipping
      .type(value, { delay: 40, force: true }) // escribir siempre, evitando fallos de visibilidad
      .should("have.value", value);        // validar que el input quedó correcto
  });
});