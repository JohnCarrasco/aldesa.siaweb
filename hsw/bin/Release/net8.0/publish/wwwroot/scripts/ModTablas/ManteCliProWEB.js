var listas = [];
var lista = [];
var matriz = [];
var opc_sel = '';
var tabla = '';
var celdas = '';
var objfila;

var tabla = $('#tabla').DataTable({
    data: matriz,
    compact: true,
    order: [3, 'asc'],
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
            width: '1rem',
            render: function (data, type, full, meta) {
                let mostrar = '<div class="d-flex align-items-center">' +
                '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular acceso de cliente "><i class="ri-delete-bin-line"  style="color:red" data-opc="anu"></i></a>' +
                '</div>'
                return (mostrar);
            }
        },
        { width: "4rem", targets: 1, visible: false },
        { width: "10rem", targets: 2 },
        { width: "22rem", targets: 3 },
        { width: "32rem", targets: 4 }
    ],
    dom: 'Bfrtip',
    buttons: [
        {
            text: '<i class="ri-file-user-line"></i> Nuevo Acceso',
            titleAttr: 'Nuevo Acceso',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                ListaAdiMod.show();
            }
        }
    ]
});

// Obtener una referencia al modal
const ListaAdiMod = new bootstrap.Modal(document.getElementById('ListaAdiMod'));

// Toggle Password Visibility
window.Helpers.initPasswordToggle();
function iniciar() {

    var select2 = $('#cboCliPro');
    if (select2.length) {
        select2.each(function () {
            var $this = $(this);
            select2Focus($this);
            $this.wrap('<div class="position-relative"></div>');
            $this.select2({
                dropdownParent: $this.parent()
            });
        });
    }

    mostrarBloqueo('#lista-lst'); 

    get("/ModTablas/ManteCliProWEBCSV/?data=ini|", cargaInicial);

    $('#tabla tbody').on('click', 'i[data-opc="anu"]', function (e) {
        var celdas = tabla.row($(this).closest('tr')).data();
        Swal.fire({
            title: "¿ Está seguro de anular contraseña del cliente " + celdas[3] + " ?",
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
                get("/ModTablas/ManteCliProWEBCSV/?data=anu|" + celdas[1], mostrarLista);
            }
        });
    });
    btnGrabar.onclick = function () {
        if (ControlesValidar() == 0) {
            if (txtClave1.value == '') {
                Swal.fire({
                    icon: "error",
                    title: "Contraseña",
                    text: "Contraseña en blanco!",
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                    buttonsStyling: false
                });
            } else {
                if (txtClave1.value != txtClave2.value) {
                    Swal.fire({
                        icon: "error",
                        title: "Contraseña",
                        text: "Contraseñas no son iguales!",
                        customClass: {
                            confirmButton: 'btn btn-primary waves-effect waves-light'
                        },
                        buttonsStyling: false
                    });
                } else {
                    var data = obtenerDatosGrabar();
                    get("/ModTablas/ManteCliProWEBCSV/?data=grb|" + data, mostrarLista);
                    Swal.fire({
                        icon: "success",
                        title: "Contraseña",
                        text: "Se creó contraseña para el cliente!",
                        customClass: {
                            confirmButton: 'btn btn-primary waves-effect waves-light'
                        },
                        buttonsStyling: false
                    });
                    ListaAdiMod.hide();
                }
            }
        }
    }
}
function cargaInicial(rpta) {
    listas = rpta.split("¯");
    lista = listas[0].split("¬");
    crearCombo(lista, "cboCliPro", "** SELECCIONE CLIENTE **");
    get("/ModTablas/ManteCliProWEBCSV/?data=lst|", mostrarLista);
}
function mostrarLista(rpta) {
    matriz = [];
    if (rpta != "") {
        var listas = rpta.split("¯");
        lista = rpta.split("¬");
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
    ocultarBloqueo('#lista-lst');
}
function ControlesValidar() {
    eliminarMarcas();
    let validacion = 0;
    validacion += validaCampos('cboCliPro', '-1');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcas() {
    removeRedMark('cboCliPro');
}
function obtenerDatosGrabar() {
    var data = cboCliPro.value * 1 + '|';
    data += txtClave1.value + '|';
    data += txtClave2.value;
    return data;
}