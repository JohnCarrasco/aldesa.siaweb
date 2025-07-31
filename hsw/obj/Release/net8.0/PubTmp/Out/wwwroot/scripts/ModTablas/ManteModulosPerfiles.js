var theme = $('html').hasClass('light-style') ? 'default' : 'default-dark',
    modulos = $('#modulos'),
    arbolModulos = $('#arbolModulos');

var listas = [];
var lista = [];
var matriz = [];
var opc_selP, opc_selM = 0;
var celdasModulo = [], celdasPerfil = [];
var objfila;

// Tabla Modulos
var tablaModulos = $('#tablaModulos').DataTable({
    data: matriz,
    order: [2, 'asc'],
    scrollY: '42vh',
    scrollX: true,
    paging: false,
    scrollCollapse: false,
    language: idioma_espanol,
    searching: true,
    columnDefs: [
        {
            targets: 0,
            responsivePriority: -1,
            searchable: false,
            orderable: false,
            width: '10px',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar Módulo"><i class="ri-eye-line ri-20px"          style="color:blue"  data-opc="22"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Editar Módulo"   ><i class="ri-pencil-line ri-20px"       style="color:green" data-opc="23"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular Módulo"   ><i class="ri-delete-bin-7-line ri-20px" style="color:red"   data-opc="24"></i></a>' +
                    '</div>'
                );
            }
        },
        { "width": "10px", "targets": [1, 2], className: "text-end" },
        { "width": "100px", "targets": [3, 4, 5] },
        { "width": "150px", "targets": [6] },
        { "width": "50px", "targets": [7] },
        { "width": "200px", "targets": [8, 9] }
    ],

    dom: 'Bfrtip',
    rowCallback: function (row, data, index) {
        if (data[7] == 'INACTIVO') {
            $('td', row).css('background-color', 'Black');
            $('td', row).css('color', 'White');
        }
    },
    buttons: [
        {
            text: '<i class="fas fa-file-excel"></i> Nuevo Módulo',
            titleAttr: 'Nuevo Módulo',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_selM = 21;
                ControlesLimpiarModulo();
                txtId_Modulo.value = '000';
                ModuloAdiMod.show();
                $('#ModuloAdiMod').on('shown.bs.modal', function () {
                    txtDescriModulo.focus();
                });
            }
        }
    ]
});
// Tabla de Modulos y Perfiles
var tablaPerfiles = $('#tablaPerfiles').DataTable({
    data: matriz,
    order: [1, 'asc'],
    scrollY: '42vh',
    scrollX: true,
    paging: false,
    scrollCollapse: false,
    language: idioma_espanol,
    searching: true,
    columnDefs: [
        {
            targets: 0,
            responsivePriority: -1,
            searchable: false,
            orderable: false,
            width: '10px',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar Perfil"><i class="ri-eye-line ri-20px"          style="color:blue"  data-opc="12"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Editar Perfil"   ><i class="ri-pencil-line ri-20px"       style="color:green" data-opc="13"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular Perfil"   ><i class="ri-delete-bin-7-line ri-20px" style="color:red"   data-opc="14"></i></a>' +
                    '</div>'
                );
            }
        },
        { "width": "10px", "targets": [1], className: "text-end" },
        { "width": "150px", "targets": [2] },
        { "width": "50px", "targets": [3] },
        { "width": "180px", "targets": [4,5] }
    ],

    dom: 'Bfrtip',
    rowCallback: function (row, data, index) {
        if (data[3] == 'INACTIVO') {
            $('td', row).css('background-color', 'Black');
            $('td', row).css('color', 'White');
        }
    },
    buttons: [
        {
            text: '<i class="fas fa-file-excel"></i> Nuevo Perfil',
            titleAttr: 'Nuevo Perfil',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_selP = 11;
                ControlesLimpiarPerfil();
                txtId_Perfil.value = '00';
                PerfilAdiMod.show();
                $('#PerfilAdiMod').on('shown.bs.modal', function () {
                    txtDescriPerfil.focus();
                });
            }
        }
    ]
});

// Obtener una referencia al modal
const ModuloAdiMod = new bootstrap.Modal(document.getElementById('ModuloAdiMod'));
const PerfilAdiMod = new bootstrap.Modal(document.getElementById('PerfilAdiMod'));
function iniciar() {
    $('#lista-lst').block({
        message: '<div class="d-flex justify-content-center"><p class="mb-0">Por favor espere...</p> <div class="sk-wave m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
        css: {
            backgroundColor: 'transparent',
            border: '0'
        },
        overlayCSS: {
            opacity: 0.5
        }
    });
    get("/ModTablas/ManteModulosPerfilesCSV/?data=1|", mostrarLista);

    $('#tablaPerfiles tbody').on('click', 'tr', function (e) {
        opc_selP = e.target.dataset.opc;
        objfila = this;
        celdasPerfil = tablaPerfiles.row(objfila).data();
        if (!(opc_selP === undefined) || (celdasPerfil[3] == "INACTIVO")) {
            if (celdasPerfil[3] == "INACTIVO") {
                Swal.fire({
                    icon: 'error',
                    title: "¡ Desactivado !",
                    text: "Perfil se encuentra desactivado.",
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                    buttonsStyling: false
                });
            } else {
                if (opc_selP == 12 || opc_selP == 13) {
                    get("/ModTablas/ManteModulosPerfilesCSV/?data=" + opc_selP + "|" + celdasPerfil[1], editarPerfil);
                }
                if (opc_selP == 14) {
                    Swal.fire({
                        title: "¿ Está seguro de anular perfil " + celdasPerfil[2] + " ?",
                        text: "! No se podrá revertir !",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "! Sí, anular !",
                        customClass: {
                            confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                            cancelButton: 'btn btn-outline-secondary waves-effect'
                        },
                        buttonsStyling: false
                    }).then(function (result) {
                        if (result.value) {
                            post("/ModTablas/ManteModulosPerfilesGrbCSV", mostrarPerfilGrabar, opc_selP + "|" + celdasPerfil[1]);
                        }
                    });
                }
            }
        } else {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                modulos.jstree('deselect_all', false);
                modulos.jstree('close_all');
                btnMarcarModulos.disabled = true;
                btnDesmarcarModulos.disabled = true;
                btnAsignarModulos.disabled = true;
            } else {
                tablaPerfiles.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                get("/ModTablas/ManteModulosPerfilesCSV/?data=2|" + celdasPerfil[1], marcarArbol);
                function marcarArbol(rpta) {
                    modulos.jstree('deselect_all', false);
                    modulos.jstree('close_all');
                    if (rpta != '') {
                        var listas = rpta.split('¬');
                        var lista = listas[1].split('|');
                        var nRegistros = lista.length;
                        var i = 0;
                        for (i; i < nRegistros; i++) {
                            modulos.jstree('select_node', lista[i]);
                        }
                        $('#select_modulos').val(listas[0]).trigger('change.select2');
                    }
                    btnMarcarModulos.disabled = false;
                    btnDesmarcarModulos.disabled = false;
                    btnAsignarModulos.disabled = false;
                }
            }
        }
    });

    btnMarcarModulos.onclick = function () {
        modulos.jstree('select_all');
    }
    btnDesmarcarModulos.onclick = function () {
        modulos.jstree('deselect_all', false);
    }
    btnAsignarModulos.onclick = function () {
        selectedElmsIds = [];
        var selectedElms = $('#modulos').jstree('get_selected', true);
        var data = '';
        $.each(selectedElms, function () {
            data += this.id + '|';
            selectedElmsIds.push(this.id);
            if (this.parent != '#') {
                data += this.parent + '|';
                selectedElmsIds.push(this.parent);
            }
            if (this.parents.length > 2) {
                data += this.parents[1] + '|';
                selectedElmsIds.push(this.parents[1]);
            }
        });

        if (data.length > 0) data = data.substring(0, data.length - 1)

        let modulo_inicio = $('#select_modulos').val();

        if (selectedElmsIds.length > 0) {
            post("/ModTablas/ManteModulosPerfilesGrbCSV", mostrarID, '3|' + celdasPerfil[1] + '|' + modulo_inicio + '|' + data);
            function mostrarID(rpta) {
                if ((rpta * 1) == 0) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error al registrar',
                        showConfirmButton: false,
                        timer: 3000
                    })
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Se registró correctamente',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    $('#select_modulos option').remove();
                    //modulos.jstree('close_all');
                    modulos.jstree('deselect_all', false);
                    tablaPerfiles.$('tr.selected').removeClass('selected');
                    //tbl_perfiles_asignar.$('tr.selected').removeClass('selected');
                }
            }
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Debe seleccionar módulos a registrar',
                showConfirmButton: false,
                timer: 3000
            })
        }
    }
    btnGuardarPerfil.onclick = function () {
        if (ControlesValidarPerfil() == 0) {
            var data = obtenerDatosPerfilGrabar();
            post("/ModTablas/ManteModulosPerfilesGrbCSV", mostrarPerfilGrabar, "15|" + data);
        }
    }
    btnCancelarPerfil.onclick = function () {
        PerfilAdiMod.hide();
    }
    btnReordenarModulos.onclick = function () {
        //var array_modulos = [];
        var data = '';
        var reg_id, reg_padre_id, reg_orden;
        var v = $('#arbolModulos').jstree(true).get_json('#', { 'flat': true });
        //console.log(v);
        for (i = 0; i < v.length; i++) {
            var z = v[i];

            //asignamos el id, el padre Id, y el nombre del módulo
            reg_id = z["id"];
            reg_padre_id = z["parent"];
            reg_orden = i;
            //array_modulos[i] = reg_id + ';' + reg_padre_id + ';' + reg_orden;
            data += reg_id + '|' + reg_padre_id + '|' + reg_orden + '¬';
        }
        data = data.substring(0, data.length - 1);
        //console.log(data);
        post("/ModTablas/ManteModulosPerfilesGrbCSV", mostrarID, '10|' + data);
        function mostrarID(rpta) {
            if ((rpta * 1) == 0) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error al registrar',
                    showConfirmButton: false,
                    timer: 3000
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Se registró correctamente',
                    showConfirmButton: false,
                    timer: 2000
                })
                get("/ModTablas/ManteModulosPerfilesCSV/?data=11|", mostrarListaModulos);
                get("/ModTablas/ManteModulosPerfilesCSV/?data=9|", mostrarModulosReiniciar);
            }
        }
    }
    btnReiniciar.onclick = function () {
        get("/ModTablas/ManteModulosPerfilesCSV/?data=9|", mostrarModulosReiniciar);
    }
    function mostrarModulosReiniciar(rpta) {
        var data = crear_json_modulos(rpta.split('¬'));
        $('#arbolModulos').jstree(true).settings.core.data = data;
        $('#arbolModulos').jstree(true).refresh();
    }

    $('#tablaModulos tbody').on('click', 'tr', function (e) {
        opc_selM = e.target.dataset.opc;
        objfila = this;
        celdasModulo = tablaModulos.row(objfila).data();
        if (!(opc_selM === undefined) || (celdasModulo[7] == "INACTIVO")) {
            if (celdasModulo[7] == "INACTIVO") {
                Swal.fire({
                    icon: 'error',
                    title: "¡ Desactivado !",
                    text: "Módulo se encuentra desactivado.",
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                    buttonsStyling: false
                });
            } else {
                if (opc_selM == 22 || opc_selM == 23) {
                    get("/ModTablas/ManteModulosPerfilesCSV/?data=" + opc_selM + "|" + celdasModulo[1], editarModulo);
                }
                if (opc_selM == 24) {
                    Swal.fire({
                        title: "¿ Está seguro de anular módulo " + celdasModulo[1] + " ?",
                        text: "! No se podrá revertir !",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "! Sí, anular !",
                        customClass: {
                            confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                            cancelButton: 'btn btn-outline-secondary waves-effect'
                        },
                        buttonsStyling: false
                    }).then(function (result) {
                        if (result.value) {
                            post("/ModTablas/ManteModulosPerfilesGrbCSV", mostrarModuloGrabar, opc_selM + "|" + celdasModulo[1]);
                        }
                    });
                }
            }
        } else {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                modulos.jstree('deselect_all', false);
                modulos.jstree('close_all');
                btnMarcarModulos.disabled = true;
                btnDesmarcarModulos.disabled = true;
                btnAsignarModulos.disabled = true;
            } else {
                tablaPerfiles.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                get("/ModTablas/ManteModulosPerfilesCSV/?data=2|" + celdasPerfil[1], marcarArbol);
                function marcarArbol(rpta) {
                    modulos.jstree('deselect_all', false);
                    modulos.jstree('close_all');
                    if (rpta != '') {
                        var listas = rpta.split('¬');
                        var lista = listas[1].split('|');
                        var nRegistros = lista.length;
                        var i = 0;
                        for (i; i < nRegistros; i++) {
                            modulos.jstree('select_node', lista[i]);
                        }
                        $('#select_modulos').val(listas[0]).trigger('change.select2');
                    }
                    btnMarcarModulos.disabled = false;
                    btnDesmarcarModulos.disabled = false;
                    btnAsignarModulos.disabled = false;
                }
            }
        }
    });

    btnGuardarModulo.onclick = function () {
        if (ControlesValidarModulo() == 0) {
            var data = obtenerDatosModuloGrabar();
            post("/ModTablas/ManteModulosPerfilesGrbCSV", mostrarModuloGrabar, "25|" + data);
        }
    }
    btnCancelarModulo.onclick = function () {
        ModuloAdiMod.hide();
    }


}

function mostrarListaModulos(rpta) {
    matriz = [];
    var listas = rpta.split("¯");
    if (listas[0] != "") {
        lista = listas[0].split("¬");
        crearMatriz();
    }
    mostrarMatrizModulos();
}
function mostrarLista(rpta) {
    matriz = [];
    var listas = rpta.split("¯");
    if (listas[0] != "") {
        lista = listas[0].split("¬");
        crearMatriz();
    }
    mostrarMatrizPerfiles();

    if (listas[1] != "") {
        lista = listas[1].split("¬");
        crearMatriz();
    }
    mostrarMatrizModulos();

    var data = crear_json_modulos(listas[2].split('¬'));
    const ids = new Set(data.map(item => item.id));
    const dataFiltrada = data.filter(item => item.parent === "#" || ids.has(item.parent));

    /*modulos */
    modulos.jstree({
        core: {
            themes: {
                name: theme
            },
            check_callback: true,
            data: dataFiltrada,
        },
        checkbox: {
            keep_selectd_style: true
        },
        //plugins: ['wholerow', 'checkbox', 'types', 'changed']
        plugins: ['types', 'dnd', 'checkbox', 'wholerow'],
        types: {
            default: {
                icon: 'ri-macbook-line text-warning'
            }
        }
    });

    $('#modulos').on('changed.jstree', function (rvt, data) {
        $('#select_modulos option').remove();
        var selectedElms = $('#modulos').jstree('get_selected', true);
        $.each(selectedElms, function () {
            $('#select_modulos').append($('<option>', { value: this.id, text: this.text }))
        });
        if ($('#select_modulos').has('option').length <= 0) $('#select_modulos').append($('<option>', { value: 0, text: '--No hay modulos seleccionados--' }))
    });

    /*arbol para organizar */
    arbolModulos.jstree({
        core: {
            themes: {
                name: theme
            },
            check_callback: true,
            data: dataFiltrada,
        },
        plugins: ['types', 'dnd'],
        types: {
            default: {
                icon: 'ri-macbook-line',
                max_depth: 2
            }
        }
    //});
    }).bind("loaded.jstree", function (event, data) { $(this).jstree("open_all") });

    $('#arbolModulos').on('changed.jstree', function (rvt, data) {
        $('#select_modulos option').remove();
        var selectedElms = $('#arbolModulos').jstree('get_selected', true);
        $.each(selectedElms, function () {
            $('#select_modulos').append($('<option>', { value: this.id, text: this.text }))
        });
        if ($('#select_modulos').has('option').length <= 0) $('#select_modulos').append($('<option>', { value: 0, text: '--No hay modulos seleccionados--' }))
    });

    $('#lista-lst').unblock();
}
function crear_json_modulos(lista) {
    var texto_j = [];
    var nRegistros = lista.length;
    var campos = [];
    var fila = [];
    var i = 0;
    campos = lista[0].split("|");
    for (i; i < nRegistros; i++) {
        campos = lista[i].split("|");
        fila = { id: campos[0], parent: campos[1], text: campos[2] };
        texto_j.push(fila);
    }
    return (texto_j);
}
function crearMatriz() {
    matriz = [];
    var campos = [];
    var nRegistros = lista.length;
    var fila = [];
    var i = 0;
    campos = lista[0].split("|");
    for (i; i < nRegistros; i++) {
        campos = lista[i].split("|");
        nCampos = campos.length;
        fila = [];
        for (var j = 0; j < nCampos; j++) {
            fila.push(campos[j]);
        }
        matriz.push(fila);
    }
}
function mostrarMatrizPerfiles() {
    tablaPerfiles = $('#tablaPerfiles').DataTable().clear().rows.add(matriz).draw();
    ajustarHeadersDataTables($('#tablaPerfiles'));
}
function mostrarMatrizModulos() {
    tablaModulos = $('#tablaModulos').DataTable().clear().rows.add(matriz).draw();
    ajustarHeadersDataTables($('#tablaModulos'));
}

function ControlesLimpiarPerfil() {
    txtDescriPerfil.value = '';
}
function ControlesValidarPerfil() {
    eliminarMarcasPerfil();
    let validacion = 0;
    validacion += validaCampos('txtDescriPerfil', '');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcasPerfil() {
    removeRedMark('txtDescriPerfil');
}
function editarPerfil(rpta) {
    ControlesLimpiarPerfil();
    var reg = rpta.split('|');
    txtId_Perfil.value = reg[0];
    txtDescriPerfil.value = reg[1];
    if (opc_selP == 12) {
        txtDescriPerfil.disabled = true;
        btnGuardarPerfil.disabled = true;
    }
    if (opc_selP == 13) {
        txtDescriPerfil.disabled = false;
        btnGuardarPerfil.disabled = false;
    }
    PerfilAdiMod.show();
    if (opc_selP != 12) {
        $('#PerfilAdiMod').on('shown.bs.modal', function () {
            txtDescriPerfil.focus();
        });
    }
}
function obtenerDatosPerfilGrabar() {
    var data = txtId_Perfil.value * 1 + '|';
    data += txtDescriPerfil.value;
    return data;
}
function mostrarPerfilGrabar(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_selP == 11) {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5]];
            tablaPerfiles.row.add(fila).draw();
            mensaje = "Perfil adicionado";
        }
        if (opc_selP == 13) {
            lista = rpta.split("|");
            celdasPerfil[2] = lista[2];
            celdasPerfil[4] = lista[4];
            celdasPerfil[5] = lista[5];
            tablaPerfiles.row(objfila).data(celdasPerfil).draw();
            mensaje = "Perfil actualizado";
        }
        if (opc_selP == 14) {
            lista = rpta.split("|");
            celdasPerfil[3] = lista[3];
            tablaPerfiles.row(objfila).data(celdasPerfil).draw();
            mensaje = "Perfil anulado";
        }
        Swal.fire({
            icon: 'success',
            title: mensaje,
            text: lista[2],
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false
        });
        PerfilAdiMod.hide();
    }
    else {
        mensaje = rpta; // "Ocurrió un error al grabar";
    }
}


function ControlesLimpiarModulo() {
    txtDescriModulo.value = '';
    txtRuta_Vista.value = '';
}
function ControlesValidarModulo() {
    eliminarMarcasModulo();
    let validacion = 0;
    validacion += validaCampos('txtDescriModulo', '');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcasModulo() {
    removeRedMark('txtDescriModulo');
}
function editarModulo(rpta) {
    ControlesLimpiarModulo();
    var reg = rpta.split('|');

    console.log(reg);

    txtId_Modulo.value = reg[0];
    txtDescriModulo.value = reg[1];
    txtRuta_Vista.value = reg[2];
    txtIcon_Menu.value = reg[3];
    if (opc_selM == 22) {
        txtDescriModulo.disabled = true;
        txtRuta_Vista.disabled = true;
        txtIcon_Menu.disabled = true;
        btnGuardarModulo.disabled = true;
    }
    if (opc_selM == 23) {
        txtDescriModulo.disabled = false;
        txtRuta_Vista.disabled = false;
        txtIcon_Menu.disabled = false;
        btnGuardarModulo.disabled = false;
    }
    ModuloAdiMod.show();
    if (opc_selM != 22) {
        $('#ModuloAdiMod').on('shown.bs.modal', function () {
            txtDescriModulo.focus();
        });
    }
}
function obtenerDatosModuloGrabar() {
    var data = txtId_Modulo.value * 1 + '|';
    data += txtDescriModulo.value + '|';
    data += txtRuta_Vista.value + '|';
    data += txtIcon_Menu.value;
    return data;
}
function mostrarModuloGrabar(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        listas = rpta.split("¯");
        lista = listas[0].split("|");
        if (opc_selM == 21) {
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8], lista[9]];
            tablaModulos.row.add(fila).draw();

            var data = crear_json_modulos(listas[1].split('¬'));
            $('#arbolModulos').jstree(true).settings.core.data = data;
            $('#arbolModulos').jstree(true).refresh();

            $('#modulos').jstree(true).settings.core.data = data;
            $('#modulos').jstree(true).refresh();

            mensaje = "Módulo adicionado";
        }
        if (opc_selM == 23) {
            celdasModulo[3] = lista[3];
            celdasModulo[4] = lista[4];
            celdasModulo[5] = lista[5];
            celdasModulo[6] = lista[6];
            celdasModulo[9] = lista[9];
            tablaModulos.row(objfila).data(celdasModulo).draw();
            mensaje = "Modulo actualizado";
        }
        if (opc_selM == 24) {
            celdasModulo[7] = 'INACTIVO';
            tablaModulos.row(objfila).data(celdasModulo).draw();
            mensaje = "Módulo anulado";
        }
        Swal.fire({
            icon: 'success',
            title: mensaje,
            text: lista[3],
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false
        });
        ModuloAdiMod.hide();
    }
    else {
        mensaje = rpta; // "Ocurrió un error al grabar";
    }
}
