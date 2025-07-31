var listas = [];
var lista = [];
var matriz = [];
var opc_sel = 0;
var tabla = '';
var celdas = '';
var objfila;
// Tabla de Segmentos
var tabla = $('#tabla').DataTable({
    data: matriz,
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
            width: '30px',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar segmento"><i class="ri-eye-line ri-20px"          style="color:blue"  data-opc="2"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Editar segmento"   ><i class="ri-pencil-line ri-20px"       style="color:green" data-opc="3"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular segmento"   ><i class="ri-delete-bin-7-line ri-20px" style="color:red"   data-opc="4"></i></a>' +
                    '</div>'
                );
            }
        },
        { "width": "10px", "targets": [1], className: "text-end" },
        { "width": "200px", "targets": [2] },
        { "width": "400px", "targets": [3] },
        { "width": "55px", "targets": [5, 7] },
        { "width": "220px", "targets": [6, 8], className: "text-center" }
    ],

    dom: 'Bfrtip',
    rowCallback: function (row, data, index) {
        if (data[4] == '*ANU*') {
            $('td', row).css('background-color', 'Black');
            $('td', row).css('color', 'White');
        }
    },
    buttons: [
        {
            text: '<i class="fas fa-file-excel"></i> Nueva familia',
            titleAttr: 'Nueva familia',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_sel = 1;
                ControlesLimpiar();
                txtId.value = '00';
                ListaAdiMod.show();
            }
        }
    ]
});
// Obtener una referencia al modal
const ListaAdiMod = new bootstrap.Modal(document.getElementById('ListaAdiMod'));
function iniciar() {
    var select2 = $('.select2');
    // For all Select2
    if (select2.length) {
        select2.each(function () {
            var $this = $(this);
            select2Focus($this);
            //$this.wrap('<div class="position-relative"></div>');
            $this.select2({
                dropdownParent: $this.parent()
            });
        });
    }
    $('#lista').block({
        message: '<div class="d-flex justify-content-center"><p class="mb-0">Por favor espere...</p> <div class="sk-wave m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
        css: {
            backgroundColor: 'transparent',
            border: '0'
        },
        overlayCSS: {
            opacity: 0.5
        }
    });
    get("/ModTablas/ManteServicioFamiliaCSV/?data=1|", mostrarLista);

    $('#tabla tbody').on('click', 'tr', function (e) {
        opc_sel = e.target.dataset.opc;
        objfila = this;
        celdas = tabla.row(objfila).data();

        if (!(opc_sel === undefined)) {
            if (opc_sel == 2 || opc_sel == 3) {
                if (celdas[4] == "&lt;ACT&gt;") get("/ModTablas/ManteServicioFamiliaCSV/?data=" + opc_sel + "|" + celdas[1], editarLista);
                else {
                    Swal.fire({
                        icon: 'error',
                        title: "¡ Anulado !",
                        text: "Familia se encuentra anulado. no se puede editar.",
                        customClass: {
                            confirmButton: 'btn btn-primary waves-effect waves-light'
                        },
                        buttonsStyling: false
                    });
                }
            }
            if (opc_sel == 4) {
                Swal.fire({
                    title: "¿ Está seguro de anular el grupo de servicio " + celdas[2] + " ?",
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
                        post("/ModTablas/ManteServicioFamiliaGrbCSV", mostrarGrabar, opc_sel + "|" + celdas[1]);
                    }
                });
            }
        }
    });

    btnGuardarLista.onclick = function () {
        if (ControlesValidar() == 0) {
            var data = obtenerDatosGrabar();
            post("/ModTablas/ManteServicioFamiliaGrbCSV", mostrarGrabar, "5|" + data);
        }
    }

}
function mostrarLista(rpta) {
    matriz = [];
    if (rpta != "") {
        var listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearCombo(lista, "cboSegmento", "** SELECCIONE SEGMENTO **");
        lista = listas[1].split("¬");
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
    $('#lista').unblock();
}

function ControlesLimpiar() {
    eliminarMarcas();
    $('#cboSegmento').val('-1').trigger('change.select2');
    txtDescri.value = '';
}
function ControlesValidar() {
    eliminarMarcas();
    let validacion = 0;
    validacion += validaCampos('cboSegmento', -1);
    validacion += validaCampos('txtDescri', '');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcas() {
    removeRedMark('cboSegmento','txtDescri');
}
function editarLista(rpta) {
    ControlesLimpiar();
    var reg = rpta.split('|');
    txtId.value = reg[0];
    $('#cboSegmento').val(reg[1]).trigger('change.select2');
    txtDescri.value = reg[2];
    if (opc_sel == 2) {
        cboSegmento.disabled = true;
        txtDescri.disabled = true;
        btnGuardarLista.disabled = true;
    }
    if (opc_sel == 3) {
        cboSegmento.disabled = false;
        txtDescri.disabled = false;
        btnGuardarLista.disabled = false;
    }
    ListaAdiMod.show();
}
function obtenerDatosGrabar() {
    var data = txtId.value * 1 + '|';
    data += cboSegmento.value + '|';
    data += txtDescri.value;
    return data;
}
function mostrarGrabar(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 1) {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8]];
            tabla.row.add(fila).draw();
            mensaje = "Familia adicionado";
        }
        if (opc_sel == 3) {
            lista = rpta.split("|");
            celdas[2] = lista[2];
            celdas[3] = lista[3];
            celdas[7] = lista[7];
            celdas[8] = lista[8];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Familia actualizado";
        }
        if (opc_sel == 4) {
            lista = rpta.split("|");
            celdas[4] = lista[4];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Familia anulado";
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