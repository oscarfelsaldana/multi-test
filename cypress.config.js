const { defineConfig } = require("cypress");

var consec = 1;
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    hostName: "https://dev.citas-multisalud.com",
    // hostName: "http://localhost:3000",
    urlApi: "https://api-dev.citas-multisalud.com",
    // urlApi: "http://localhost:8080",
    dataOperators: [
      {
        email: "oscarsaldana1108@gmail.com",
        password: "Multisalud@2024"
      },
      {
        documentType: "Cédula de ciudadanía",
        documentNumber: "0123456789",
        firstName: "Super",
        secondName: "Admin",
        firstSurname: "Cypress",
        secondSurname: "",
        gender: "Masculino",
        birthDate: "2000-01-01",
        phoneNumber: "3127143782",
        email: "superadmin_cy@gmail.com",
        password: "Multi@2023",
        company: "EmpresaCypress",
      },
      {
        documentType: "Cédula de ciudadanía",
        documentNumber: "1000000001",
        firstName: "Operador",
        firstSurname: "Cypress",
        gender: "Masculino",
        birthDate: "2000-01-01",
        phoneNumber: "3127143001",
        email: "operador1Cy@gmail.com",
        password: "123456",
      },
    ],
    dataServiceGroup: [
      {
        code: "200002",
        description: "GrupoServicioCy",
      },
    ],
    dataServices: [
      {
        code: "200002",
        description: "Medicina general Cy",
      },
      {
        code: "200003",
        description: "Fisioterapia Cy",
      },
    ],
    dataSpecializations: [
      {
        code: "200002",
        description: "Medico familiar",
      },
      {
        code: "200003",
        description: "Fisioterapeuta Cy",
      },
      {
        code: "200004",
        description: "Neurologo Cy",
      },
    ],
    dataOffices: [
      {
        code: "200002",
        name: "Sede1 Cy",
        address: "Centro",
        district: "Centro",
        municipality: "Villavicencio",
        zone: "Urbana",
        phoneNumber: "3001234567",
        email: "pruebaCy@email.com",
        manager: "Gerente1 Cy",
      },
      {
        code: "200003",
        name: "Sede2 Cy",
        address: "Centro",
        district: "Centro",
        municipality: "Villavicencio",
        zone: "Urbana",
        phoneNumber: "3001234569",
        email: "pruebaCy@email.com",
        manager: "Gerente2 Cy",
      },
    ],
    dataHealthCompanies: [
      {
        code: "20000" + (consec + 1),
        taxIDNumber: "1000000001",
        name: "Aseguradora1 Cy",
        regime: "Contributivo",
        address: "Caudal Villavicencio",
      },
      {
        code: "20000" + (consec + 2),
        taxIDNumber: "10000000002",
        name: "Aseguradora2 Cy",
        regime: "Subsidiado",
        address: "Centro villavicencio",
      },
    ],
    dataPatients: [
      {
        documentType: "Cédula de ciudadanía",
        documentNumber: "10000000001" + consec,
        firstName: "Paciente1",
        firstSurname: "Cypress",
        gender: "Masculino",
        ethnicity: "Otras etnias",
        birthDate: "2000-01-01",
        regime: "Contributivo",
        municipality: "Villavicencio",
        academicLevel: "Profesional",
        phoneNumber: "3127143001",
        secondPhoneNumber: "3127143001",
        email: `paciente_${consec}Cy@gmail.com`,
        healthCompanyCode: "20000" + (consec + 1),
      },
      {
        documentType: "Cédula de ciudadanía",
        documentNumber: "10000000002" + (consec + 1),
        firstName: "Paciente2",
        firstSurname: "Cypress",
        gender: "Masculino",
        ethnicity: "Indígena",
        birthDate: "2000-01-01",
        regime: "Contributivo",
        municipality: "Villavicencio",
        academicLevel: "Básica Secundaria",
        phoneNumber: "3127143002",
        secondPhoneNumber: "3127143002",
        email: `paciente_${consec + 1}Cy@gmail.com`,
        healthCompanyCode: "20000" + (consec + 1),
      },
      {
        documentType: "Cédula de ciudadanía",
        documentNumber: "10000000003" + (consec + 1),
        firstName: "Paciente3",
        firstSurname: "Cypress",
        gender: "Masculino",
        ethnicity: "Indígena",
        birthDate: "2000-01-01",
        regime: "Subsidiado",
        municipality: "Villavicencio",
        academicLevel: "Básica Secundaria",
        phoneNumber: "3127143003",
        secondPhoneNumber: "3127143003",
        email: `paciente_${consec + 2}Cy@gmail.com`,
        healthCompanyCode: "20000" + (consec + 2),
      },
      {
        documentType: "Cédula de ciudadanía",
        documentNumber: "10000000004" + (consec + 1),
        firstName: "Paciente4",
        firstSurname: "Cypress",
        gender: "Femenino",
        ethnicity: "Otras etnias",
        birthDate: "2000-01-01",
        regime: "Subsidiado",
        municipality: "Villavicencio",
        academicLevel: "Básica Secundaria",
        phoneNumber: "3127143004",
        secondPhoneNumber: "3127143004",
        email: `paciente_${consec + 3}Cy@gmail.com`,
        healthCompanyCode: "20000" + (consec + 2),
      },
    ],
    dataDoctors: [
      {
        documentType: "Cédula de ciudadanía",
        documentNumber: "10000000001" + consec,
        firstName: "Doctor1",
        firstSurname: "Cypress",
        gender: "Masculino",
        birthDate: "2000-01-01",
        phoneNumber: "3127143001",
        email: `doctor_${consec}Cy@gmail.com`,
      },
      {
        documentType: "Cédula de ciudadanía",
        documentNumber: "10000000002" + (consec + 1),
        firstName: "Doctor2",
        firstSurname: "Cypress",
        gender: "Masculino",
        birthDate: "2000-01-01",
        phoneNumber: "3127143001",
        email: `doctor_${consec + 1}Cy@gmail.com`,
      },
      {
        documentType: "Cédula de ciudadanía",
        documentNumber: "10000000002" + (consec + 2),
        firstName: "Doctor3",
        firstSurname: "Cypress",
        gender: "Masculino",
        birthDate: "2000-01-01",
        phoneNumber: "3127143001",
        email: `doctor_${consec + 2}Cy@gmail.com`,
      },
    ],
    dataCompanies: [
      {
        documentType: "NIT",
        documentNumber: "10000000001",
        dv: "0",
        legalNature: "Mixta",
        name: "EmpresaCypress",
        phoneNumber: "3127143001",
        address: "Calle 1 # 01-01",
        district: "Centro",
        municipality: "Villavicencio",
        fax: "6657217",
        email: "empresaCy@gmail.com",
        legalAgent: "Gerente Cypress",
        domain: "empresasCypress.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/2560px-Test-Logo.svg.png",
      },
    ],
    dataPermissions: [
      {
        action: "admin",
        module: "Administrador",
        description: "Acceso al módulo administrador",
      },
      {
        action: "admin.company",
        module: "Administrador",
        description: "Acceso a la opción empresas",
      },
      {
        action: "admin.company.create",
        module: "Administrador",
        description: "Crear una empresa",
      },
      {
        action: "admin.company.modify",
        module: "Administrador",
        description: "Modificar una empresa",
      },
      {
        action: "admin.company.update-status",
        module: "Administrador",
        description: "Actualizar el estado de una empresa",
      },
      //
      {
        action: "admin.operator",
        module: "Administrador",
        description: "Acceso a la opción operadores",
      },
      {
        action: "admin.operator.create",
        module: "Administrador",
        description: "Crear un operador",
      },
      {
        action: "admin.operator.modify",
        module: "Administrador",
        description: "Modificar un operador",
      },
      {
        action: "admin.operator.update-status",
        module: "Administrador",
        description: "Actualizar el estado de un operador",
      },
      //
      {
        action: "admin.permission",
        module: "Administrador",
        description: "Acceso a la opción permisos",
      },
      {
        action: "admin.permission.create",
        module: "Administrador",
        description: "Crear un permiso",
      },
      {
        action: "admin.permission.modify",
        module: "Administrador",
        description: "Modificar un permiso",
      },
      {
        action: "admin.permission.update-status",
        module: "Administrador",
        description: "Actualizar el estado de un permiso",
      },
      {
        action: "admin.office",
        module: "Administrador",
        description: "Acceso a la opción de sedes",
      },
      {
        action: "admin.office.create",
        module: "Administrador",
        description: "Crear una sede",
      },
      {
        action: "admin.office.modify",
        module: "Administrador",
        description: "Modificar una sede",
      },
      {
        action: "admin.office.update-status",
        module: "Administrador",
        description: "Actualizar el estado de una sede",
      },
      {
        action: "citas",
        module: "Citas",
        description: "Acceso al módulo citas",
      },
      {
        action: "citas.schedule-appointment",
        module: "Citas",
        description: "Acceso a la opción agendar cita",
      },
      {
        action: "citas.schedule-appointment.create",
        module: "Citas",
        description: "Crear cita",
      },
      //
      {
        action: "citas.manage-appointment",
        module: "Citas",
        description: "Acceso a opción gestionar citas",
      },
      {
        action: "citas.manage-appointment.status-cancel",
        module: "Citas",
        description: "Cancelar cita",
      },
      {
        action: "citas.manage-appointment.status-reschedule",
        module: "Citas",
        description: "Re agendar cita",
      },
      {
        action: "citas.manage-appointment.status-transfer",
        module: "Citas",
        description: "Transferir cita",
      },
      {
        action: "citas.manage-appointment.download-report",
        module: "Citas",
        description: "Descargar reporte",
      },
      //
      {
        action: "citas.doctor-schedule",
        module: "Citas",
        description: "Acceso a opción agenda de medicos",
      },
      {
        action: "citas.doctor-schedule.create",
        module: "Citas",
        description: "Aperturar agenda",
      },
      {
        action: "citas.doctor-schedule.status-cancel",
        module: "Citas",
        description: "Cancelar agenda",
      },
      {
        action: "citas.doctor-schedule.status-transfer",
        module: "Citas",
        description: "Transferir agenda",
      },
      // citas > report
      {
        action: "citas.report",
        module: "Citas",
        description: "Acceso aopción de reportes",
      },
      {
        action: "citas.report.citas",
        module: "Citas",
        description: "Acceso a opcion reportes de citas",
      },
      {
        action: "citas.report.citas.download",
        module: "Citas",
        description: "Descargar reporte de citas",
      },
      // citas > configuration
      {
        action: "citas.configuration",
        module: "Citas",
        description: "Acceso a menú de configuración",
      },
      
      {
        action: "citas.configuration.patient",
        module: "Citas",
        description: "Acceso a opción de pacientes - citas",
      },
      {
        action: "citas.configuration.patient.create",
        module: "Citas",
        description: "Crear paciente - citas",
      },
      {
        action: "citas.configuration.patient.modify",
        module: "Citas",
        description: "Modificar paciente - citas",
      },
      {
        action: "citas.configuration.patient.update-status",
        module: "Citas",
        description: "Cambiar estatus de paciente - citas",
      },
      //
      {
        action: "citas.configuration.doctor",
        module: "Citas",
        description: "Acceso aopción de doctor",
      },
      {
        action: "citas.configuration.doctor.create",
        module: "Citas",
        description: "Crear doctor",
      },
      {
        action: "citas.configuration.doctor.modify",
        module: "Citas",
        description: "Modificar doctor",
      },
      {
        action: "citas.configuration.doctor.update-status",
        module: "Citas",
        description: "Cambiar estatus de doctor",
      },
      //
      {
        action: "citas.configuration.health-company",
        module: "Citas",
        description: "Acceso a opción de aseguradoras - citas",
      },
      {
        action: "citas.configuration.health-company.create",
        module: "Citas",
        description: "Crear aseguradora - citas",
      },
      {
        action: "citas.configuration.health-company.modify",
        module: "Citas",
        description: "Modificar aseguradora - citas",
      },
      {
        action: "citas.configuration.health-company.update-status",
        module: "Citas",
        description: "Cambiar estatus de aseguradora - citas",
      },
      //
      {
        action: "citas.configuration.office",
        module: "Citas",
        description: "Acceso a a opcion de sedes - citas",
      },
      {
        action: "citas.configuration.office.create",
        module: "Citas",
        description: "Crear sede - citas",
      },
      {
        action: "citas.configuration.office.modify",
        module: "Citas",
        description: "Modificar sedes - citas",
      },
      {
        action: "citas.configuration.office.update-status",
        module: "Citas",
        description: "Cambiar estatus de sede - citas",
      },
      //
      {
        action: "citas.configuration.specialization",
        module: "Citas",
        description: "Acceso a opción de especializaciones",
      },
      {
        action: "citas.configuration.specialization.create",
        module: "Citas",
        description: "Crear especialización",
      },
      {
        action: "citas.configuration.specialization.modify",
        module: "Citas",
        description: "Modificar especialización",
      },
      {
        action: "citas.configuration.specialization.update-status",
        module: "Citas",
        description: "Cambiar estatus de sede - citas",
      },
      //
      {
        action: "citas.configuration.service",
        module: "Citas",
        description: "Acceso a opción de servicios",
      },
      {
        action: "citas.configuration.service.create",
        module: "Citas",
        description: "Crear servicio",
      },
      {
        action: "citas.configuration.service.modify",
        module: "Citas",
        description: "Modificar servicio",
      },
      {
        action: "citas.configuration.service.update-status",
        module: "Citas",
        description: "Cambiar estatus de servicio",
      },
      {
        action: "citas.configuration.service.status-web",
        module: "Citas",
        description: "Cambiar estatus web de servicio",
      },
      //
      {
        action: "citas.configuration.service-group",
        module: "Citas",
        description: "Acceso aopcion de grpo de servicios",
      },
      {
        action: "citas.configuration.service-group.create",
        module: "Citas",
        description: "Crear grupo de servicios",
      },
      {
        action: "citas.configuration.service-group.modify",
        module: "Citas",
        description: "Modificar grupo de servicios",
      },
      {
        action: "citas.configuration.service-group.update-status",
        module: "Citas",
        description: "Cambiar estatus de grupo de servicio",
      },
    ],
  },
});
