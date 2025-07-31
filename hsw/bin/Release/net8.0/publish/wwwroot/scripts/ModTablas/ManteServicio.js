var listas = [];
var lista = [];
var matriz = [];
var opc_sel = 0;
var celdas = '';
var objfila;
// Tabla de Servicios
var tabla = $('#tabla').DataTable({
    data: matriz,
    compact: true,
    order: [[3, 'asc'], [4, 'asc']],
    scrollY: 'calc(100vh - 310px)',
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
            width: '4rem',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar grupo de servicio"><i class="ri-eye-line ri-20px"          style="color:blue"  data-opc="con"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Editar grupo de servicio"   ><i class="ri-pencil-line ri-20px"       style="color:green" data-opc="edt"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular grupo de servicio"   ><i class="ri-delete-bin-7-line ri-20px" style="color:red"   data-opc="anu"></i></a>' +
                    '</div>'
                );
            }
        },
        { width: "4rem", targets: 1, visible: false },
        { width: "4rem", targets: 2, visible: false },
        { width: "15rem", targets: 3 },
        { width: "30rem", targets: 4 },
        { width: "5rem", targets: 6, className: "text-center" }
    ],
    dom: '<"controls"Bfl>rtip', // Agrupamos Botones, Filtro (checkbox), y buscador en "controls"
    rowCallback: function (row, data, index) {
        if (data[6] == '*ANU*') {
            $('td', row).css('background-color', '#c8c8c8');
            $('td', row).css('color', 'White');
        }
    },
    buttons: [
        {
            text: '<i class="ri-file-line"></i> Nuevo Servicio',
            titleAttr: 'Nuevo Servicio',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_sel = 'adi';
                ControlesLimpiar();
                txtId.value = '00';
                ListaAdiMod.show();
            }
        }
    ]
});

var controlsContainer = $('.controls'); // Seleccionamos el contenedor "controls"
controlsContainer.append('<div class="filtro-buscador"><input type="checkbox" id="miCheckboxFiltroBuscador"><label for="miCheckboxFiltroBuscador">Mostrar anulados</label></div>');

var searchWrapper = $('.dataTables_filter'); // Seleccionamos el contenedor del buscador
controlsContainer.append(searchWrapper); // Movemos el buscador al contenedor "controls" después del checkbox

var checkboxMostrarAnulados = $('#miCheckboxFiltroBuscador');

// Función para configurar el filtro y el evento del checkbox DESPUÉS de cargar los datos
function configurarFiltroCheckbox() {
    // Aplicar el filtro inicial para mostrar solo los NO anulados
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            const columna6 = data[6];
            return columna6.indexOf('*ANU*') === -1;
        }
    );
    tabla.draw();
    $.fn.dataTable.ext.search.pop(); // Esto remueve el filtro inicial inmediatamente

    // Manejar el evento change del checkbox
    checkboxMostrarAnulados.on('change', function () {
        if ($(this).is(':checked')) {
            // Mostrar todos (remover el filtro de no anulados)
            const index = $.fn.dataTable.ext.search.findIndex(f => f.name === 'noAnuladosFilter');
            if (index !== -1) {
                $.fn.dataTable.ext.search.splice(index, 1);
            }
        } else {
            // Mostrar solo los que NO son anulados
            $.fn.dataTable.ext.search.push(
                function noAnuladosFilter(settings, data, dataIndex) {
                    const columna6 = data[6];
                    return columna6.indexOf('*ANU*') === -1;
                }
            );
        }
        tabla.draw();
    });
}

// Obtener una referencia al modal
const ListaAdiMod = new bootstrap.Modal(document.getElementById('ListaAdiMod'));
function iniciar() {
    mostrarBloqueo('#lista'); 
    get("/ModTablas/ManteServicioCSV/?data=ini|", cargaInicial);
    $('#tabla tbody').on('click', 'tr', function (e) {
        opc_sel = e.target.dataset.opc;
        objfila = this;
        celdas = tabla.row(objfila).data();

        if (!(opc_sel === undefined)) {
            if (opc_sel == 'con' || opc_sel == 'edt') {
                if (celdas[6] == "&lt;ACT&gt;") get("/ModTablas/ManteServicioCSV/?data=" + opc_sel + "|" + celdas[1], editarLista);
                else {
                    Swal.fire({
                        icon: 'error',
                        title: "¡ Anulado !",
                        text: "Servicio se encuentra anulado. no se puede editar.",
                        customClass: {
                            confirmButton: 'btn btn-primary waves-effect waves-light'
                        },
                        buttonsStyling: false
                    });
                }
            }
            if (opc_sel == 'anu') {
                Swal.fire({
                    title: "¿ Está seguro de anular el Servicio " + celdas[4] + " ?",
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
                        post("/ModTablas/ManteServicioGrbCSV", mostrarGrabar, opc_sel + "|" + celdas[1]);
                    }
                });
            }
        }
    });

    btnGuardarLista.onclick = function () {
        if (ControlesValidar() == 0) {
            var data = obtenerDatosGrabar();
            post("/ModTablas/ManteServicioGrbCSV", mostrarGrabar, "grb|" + data);
        }
    }

}
function cargaInicial(rpta) {
    listas = rpta.split("¯");
    lista = listas[0].split("¬");
    crearCombo(lista, "cboGrupo", "** SELECCIONE GRUPO **");
    get("/ModTablas/ManteServicioCSV/?data=lst|", mostrarLista);
}

function mostrarLista(rpta) {
    matriz = [];
    if (rpta != "") {
        var listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearMatriz();
    }
    mostrarMatriz();
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
function mostrarMatriz() {
    tabla = $('#tabla').DataTable().clear().rows.add(matriz).draw();
    ajustarHeadersDataTables($('#tabla'));
    configurarFiltroCheckbox();
    $('#lista').unblock();
}

function ControlesLimpiar() {
    $('#cboGrupo').val('-1').trigger('change.select2');
    txtDescri.value = '';
    txtCuenta.value = '';
}
function ControlesValidar() {
    eliminarMarcas();
    let validacion = 0;
    validacion += validaCampos('txtDescri', '');
    validacion += validaCampos('txtCuenta', '');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcas() {
    removeRedMark('txtDescri', 'txtCuenta');
}
function editarLista(rpta) {
    ControlesLimpiar();
    var reg = rpta.split('|');
    txtId.value = reg[0];
    $('#cboGrupo').val(reg[1]).trigger('change.select2');
    txtDescri.value = reg[2];
    txtCuenta.value = reg[3];
    if (opc_sel == 'con') {
        txtDescri.disabled = true;
        btnGuardarLista.disabled = true;
    }
    if (opc_sel == 'edt') {
        txtDescri.disabled = false;
        btnGuardarLista.disabled = false;
    }
    ListaAdiMod.show();
}
function obtenerDatosGrabar() {
    var data = txtId.value * 1 + '|';
    data += cboGrupo.value + '|';
    data += txtDescri.value + '|';
    data += txtCuenta.value;
    return data;
}
function mostrarGrabar(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 'adi') {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6]];
            tabla.row.add(fila).draw();
            mensaje = "Servicio adicionado";
        }
        if (opc_sel == 'edt') {
            lista = rpta.split("|");
            celdas[3] = lista[3];
            celdas[4] = lista[4];
            celdas[5] = lista[5];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Servicio actualizado";
        }
        if (opc_sel == 'anu') {
            lista = rpta.split("|");
            celdas[6] = lista[6];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Servicio anulado";
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
        ListaAdiMod.hide();
    }
    else {
        mensaje = rpta; // "Ocurrió un error al grabar";
    }
}