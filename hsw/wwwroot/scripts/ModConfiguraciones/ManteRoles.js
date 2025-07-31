var tbl_perfiles_asignar,tbl_modulos='';

var idPerfil = 0;
var selectedElmsIds = [];

var listas = [];
var lista = [];
var matriz = [];

mostrarModulos();

function iniciar() {

    get("/ModUtilitarios/ModulosLst", mostrarListaModulos);
    get("/ModUtilitarios/PerfilesLst", mostrarListaPerfiles);
    get("/ModUtilitarios/ModulosALst", mostrarModulosA);

    $('#tbl_perfiles_asignar tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#modulos').jstree('deselect_all', false);
            $('#modulos').jstree('close_all');
            $('#select_modulos option').remove();
            idPerfil = 0;
        }
        else {
            tbl_perfiles_asignar.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            celdas = tbl_perfiles_asignar.row(this).data();
            idPerfil = celdas[0];
            get("/ModUtilitarios/PerfilModuloCSV/?Data=" + idPerfil, marcarArbol);
            function marcarArbol(rpta) {
                $('#modulos').jstree('deselect_all', false);
                $('#modulos').jstree('close_all');
                if (rpta != '') {
                    var listas = rpta.split('¬');
                    var lista = listas[1].split('|');
                    var nRegistros = lista.length;
                    var i = 0;
                    for (i; i < nRegistros; i++) {
                        $('#modulos').jstree('select_node', lista[i]);
                    }
                    $('#select_modulos').val(listas[0]).trigger('change.select2');
                }
            }
        }
    })

    $('#marcar_modulos').on('click', function() {
        $('#modulos').jstree('select_all');
    });

    $('#desmarcar_modulos').on('click', function() {
        $('#modulos').jstree('deselect_all',false);
        $('#select_modulos option').remove();
        $('#select_modulos').append($('<option>', { value: 0, text: '--No hay modulos seleccionados--' }))
    });

    $('#asignar_modulos').on('click', function () {
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

        if (idPerfil != 0 && selectedElmsIds.length > 0) {
            post("/ModUtilitarios/PerfilModuloGrbCSV", mostrarID, idPerfil + '|' + modulo_inicio + '|' + data);
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
                    $('#modulos').jstree('deselect_all', false);
                    tbl_perfiles_asignar.$('tr.selected').removeClass('selected');
                }
            }
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Debe seleccionar el perfil y módulos a registrar',
                showConfirmButton: false,
                timer: 3000
            })
        }
    });

    $('#btnReordenarModulos').on('click', function () {
        //var array_modulos = [];
        var data = '';
        var reg_id, reg_padre_id, reg_orden;
        var v = $('#arbolModulos').jstree(true).get_json('#', { 'flat': true });
        console.log(v);
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
        console.log(data);
        post("/ModUtilitarios/ModulosGrbCSV", mostrarID, data);
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
                get("/ModUtilitarios/ModulosLst", mostrarListaModulos);
                get("/ModUtilitarios/ModulosALst", mostrarModulosReiniciar);
                function mostrarModulosReiniciar(rpta) {
                    var data = crear_json_modulos(rpta.split('¬'));
                    $('#arbolModulos').jstree(true).settings.core.data = data;
                    $('#arbolModulos').jstree(true).refresh();
                }
            }
        }
    });

    $('#btnReiniciar').on('click', function () {
        get("/ModUtilitarios/ModulosALst", mostrarModulosReiniciar);
        function mostrarModulosReiniciar(rpta) {
            var data = crear_json_modulos(rpta.split('¬'));
            $('#arbolModulos').jstree(true).settings.core.data = data;
            $('#arbolModulos').jstree(true).refresh();
        }
    });
}

function mostrarListaModulos(rpta) {
    matriz = [];
    if (rpta != "") {
        var listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearMatriz();
    }
    mostrarModulos();
}
function crearMatriz() {
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
function mostrarModulos() {
    if (tbl_modulos != '') tbl_modulos.destroy()
    tbl_modulos = $('#tblModulos').DataTable({
        columnDefs: [
            {
                targets: 0, sortable: false, render: function (data, type, full, meta) {
                    return "<center>" +
                        "<span class='fas fa-edit fs-6 btnSeleccionarModulo text-primary px-1' style='cursor:pointer;' data-bs-toggle='tooltip' data-bs-placement='top' title='Seleccionar Módulo'>" +
                        "</span> " +
                        "<span class='fas fa-trash fs-6 btnElimiarModulo text-danger px-1' style='cursor:pointer;' data-bs-toggle='tooltip' data-bs-placement='top' title='Eliminar Módulo'>" +
                        "</span> " +
                        "</center>"
                }
            },
            { targets: [1, 2], className: "text-center" },
            { targets: [7, 8], visible: false },
        ],
        scrollX: true,
        order: [[2, 'asc']],
        lengthMenu: [0, 10, 15, 20, 50],
        pageLength: 20,
        data: matriz,
        language: idioma_espanol
    });
    ajustarHeadersDataTables($('#tblModulos'));
}

function mostrarListaPerfiles(rpta) {
    matriz = [];
    if (rpta != "") {
        var listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearMatriz();
    }
    mostrarPerfiles();
}
function mostrarPerfiles() {
    tbl_perfiles_asignar = $('#tbl_perfiles_asignar').DataTable({
        processing: true,
        pageLength: 25,
        columnDefs: [
            { targets: 0, className: "text-center" },
            {
                targets: 2,
                sortable: false,
                createdCell: function (td, cellData, rowData, row, col) {
                    if (parseInt(rowData[2]) == 1) {
                        $(td).html("Activo")
                    } else {
                        $(td).html("Inactivo")
                    }
                }
            },
            {
                targets: 5,
                sortable: false,
                render: function (data, type, full, meta) {
                    return "<center>" +
                        "<span class='btnSeleccionarPerfil text-primary px-1' style='cursor:pointer;' data-bs-toggle='tooltip' data-bs-placement='top' title='Seleccionar Perfil'>" +
                        "<i class='fas fa-check fs-5'></i> " +
                        "</span> " +
                        "</center>"
                }
            }
        ],
        data: matriz,
        language: idioma_espanol
    });
    ajustarHeadersDataTables($('#tbl_perfiles_asignar'));
}

function mostrarModulosA(rpta) {
    console.log(rpta);
    var data = crear_json_modulos(rpta.split('¬'));
    console.log(data);

    /*
            var datajx= [
                { "id": "ajson1", "parent": "#", "text": "Simple root node" },
                { "id": "ajson2", "parent": "#", "text": "Root node 2" },
                { "id": "ajson3", "parent": "ajson2", "text": "Child 1" },
                { "id": "ajson31", "parent": "ajson3", "text": "Child 21" },
                { "id": "ajson32", "parent": "ajson3", "text": "Child 22" },
                { "id": "ajson33", "parent": "ajson3", "text": "Child 23" },
                { "id": "ajson4", "parent": "ajson2", "text": "Child 3" }
            ]
    */
    $('#modulos').jstree({
        'core': {
            'check_callback': true,
            'data': data,
        },
        'checkbox': {
            'keep_selectd_style': true
        },
        'types': {
            'default': {
                'icon': 'fas fa-laptop text-warning'
            }
        },
        'plugins': ['wholerow', 'checkbox', 'types', 'changed']
    });
    //}).bind("loaded.jstree", function (event, data) { $(this).jstree("open_all") });

    $('#modulos').on('changed.jstree', function (rvt, data) {
        $('#select_modulos option').remove();
        var selectedElms = $('#modulos').jstree('get_selected', true);
        $.each(selectedElms, function () {
            $('#select_modulos').append($('<option>', { value: this.id, text: this.text }))
        });
        if ($('#select_modulos').has('option').length <= 0) $('#select_modulos').append($('<option>', { value: 0, text: '--No hay modulos seleccionados--' }))
    });

    /*arbol edicion */
    $('#arbolModulos').jstree({
        'core': {
            'check_callback': true,
            'data': data,
        },
        'types': {
            'default': {
                'icon': 'fas fa-laptop'
            },
            'file': {
                'icon': 'fas fa-laptop'
            }
        },
        'plugins': ['types', 'dnd']
    });
    //}).bind("loaded.jstree", function (event, data) { $(this).jstree("open_all") });

    $('#arbolModulos').on('changed.jstree', function (rvt, data) {
        $('#select_modulos option').remove();
        var selectedElms = $('#arbolModulos').jstree('get_selected', true);
        $.each(selectedElms, function () {
            $('#select_modulos').append($('<option>', { value: this.id, text: this.text }))
        });
        if ($('#select_modulos').has('option').length <= 0) $('#select_modulos').append($('<option>', { value: 0, text: '--No hay modulos seleccionados--' }))
    });
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
