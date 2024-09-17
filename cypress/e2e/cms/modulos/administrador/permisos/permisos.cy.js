describe("Test empresas", (module = "Citas") => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    cy.login({
      email: Cypress.env().dataOperators[0].email,
      password: Cypress.env().dataOperators[0].password,
      module: "Administrador",
    });
  });

  it("abre opcion de permisos", () => {
    cy.get('[href="/admin/permisos"]').should("contain", "Permisos");
    cy.get('[href="/admin/permisos"]').click();
    cy.get("h2").contains("Permisos").should("be.visible");
  });

  it("crea permisos", () => {
    var c = 0;

    cy.visit(`${Cypress.env().hostName}/admin/permisos`);

    Cypress.env().dataPermissions.forEach((permission) => {
      cy.wait(2000)
      //Abre formulario
      cy.get("button").contains("Nuevo permiso").should("be.visible");
      cy.get("button").contains("Nuevo permiso").click();
      cy.get("p").contains("Cree o actualice un permiso").should("be.visible");

      //llena campo de modulo
      cy.get("span").contains("Seleccione una opción").eq(0).click();
      cy.get("span").contains(permission.module).should("be.visible");
      cy.get("span").contains(permission.module).click();

      //lena campo de accion
      cy.get('input[placeholder="Digite para iniciar la búsqueda"]').eq(0).type(permission.action);
      cy.get("ul")
        .find("span")
        .then(($spans) => {
          const spanWithAdmin = $spans.toArray().find((span) => span.innerText.trim() === permission.action);
          if (spanWithAdmin) cy.wrap(spanWithAdmin).click();
        });

      // llena campo de descripcion
      cy.get("#description").type(permission.description);

      //Guarda y verifica exito
      cy.intercept("POST", `${Cypress.env().urlApi}/v1/permissions`).as(`peticion${c}`);
      cy.get("button").contains("Guardar").click();
      cy.wait(`@peticion${c}`).its("response.statusCode").then((response) => {
        cy.log(response)
        if(response >= 300)  cy.get("button").contains("Cancelar").click();
      });
      c++;
    });
  });

  it("busca y edita permiso", () => {
    cy.visit(`${Cypress.env().hostName}/admin/permisos`);

    //Busca permiso    
    cy.get('input[placeholder="Permiso"]').type(`${Cypress.env().dataPermissions[0].description}`);
    cy.get("td").contains(`${Cypress.env().dataPermissions[0].description}`).should("be.visible");

    //Abre formulario de edición
    cy.get('svg[data-permission="admin.permission.modify"]').click();
    cy.get("p").contains("Cree o actualice un permiso").should("be.visible");
    cy.get("#description").clear();
    cy.get("#description").type(Cypress.env().dataPermissions[0].description);
    cy.get("button").contains("Guardar").click();
    cy.contains("Permiso actualizado exitosamente").should("be.visible");
  });

  it("cambio estado y filtro de estado", () => {
    cy.visit(`${Cypress.env().hostName}/admin/permisos`);

    //Busca empresa
    cy.get('input[placeholder="Permiso"]').type(`${Cypress.env().dataPermissions[0].description}`);
    cy.get("td").contains(`${Cypress.env().dataPermissions[0].description}`).should("be.visible");

    //Cambia estado del permiso
    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    //Busca inactivo
    cy.get("span").contains("Todos").click();
    cy.get("span").contains("Inactivo").click();
    cy.get("td").contains(`${Cypress.env().dataPermissions[0].description}`).should("be.visible");    

    // Vuelve a cambiar estatus
    cy.get('button[role="switch"]').click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");

    // Vuelve a buscar activo
    cy.get("span").contains("Inactivo").click();
    cy.get("span").contains("Activo").click();
    cy.contains("Estado actualizado exitosamente").should("be.visible");
  });
});
