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
        { "width": "450px", "targets": [2] },
        { "width": "55px", "targets": [4, 6] },
        { "width": "220px", "targets": [5, 7], className: "text-center" }
    ],

    dom: 'Bfrtip',
    rowCallback: function (row, data, index) {
        if (data[3] == '*ANU*') {
            $('td', row).css('background-color', 'Black');
            $('td', row).css('color', 'White');
        }
    },
    buttons: [
        {
            text: '<i class="fas fa-file-excel"></i> Nuevo segmento',
            titleAttr: 'Nuevo segmento',
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
    mostrarBloqueo('#lista'); 
    get("/ModTablas/ManteServicioSegmentosCSV/?data=1|", mostrarLista);

    $('#tabla tbody').on('click', 'tr', function (e) {
        opc_sel = e.target.dataset.opc;
        objfila = this;
        celdas = tabla.row(objfila).data();

        if (!(opc_sel === undefined)) {
            if (opc_sel == 2 || opc_sel == 3) {
                if (celdas[3] == "&lt;ACT&gt;") get("/ModTablas/ManteServicioSegmentosCSV/?data=" + opc_sel + "|" + celdas[1], editarLista);
                else {
                    Swal.fire({
                        icon: 'error',
                        title: "¡ Anulado !",
                        text: "Grupo de servicio se encuentra anulado. no se puede editar.",
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
                        post("/ModTablas/ManteServicioSegmentosGrbCSV", mostrarGrabar, opc_sel + "|" + celdas[1]);
                    }
                });
            }
        }
    });

    btnGuardarLista.onclick = function () {
        if (ControlesValidar() == 0) {
            var data = obtenerDatosGrabar();
            post("/ModTablas/ManteServicioSegmentosGrbCSV", mostrarGrabar, "5|" + data);
        }
    }

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
    ocultarBloqueo('#lista');
}

function ControlesLimpiar() {
    txtDescri.value = '';
}
function ControlesValidar() {
    eliminarMarcas();
    let validacion = 0;
    validacion += validaCampos('txtDescri', '');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcas() {
    removeRedMark('txtDescri');
}
function editarLista(rpta) {
    ControlesLimpiar();
    var reg = rpta.split('|');
    txtId.value = reg[0];
    txtDescri.value = reg[1];
    if (opc_sel == 2) {
        txtDescri.disabled = true;
        btnGuardarLista.disabled = true;
    }
    if (opc_sel == 3) {
        txtDescri.disabled = false;
        btnGuardarLista.disabled = false;
    }
    ListaAdiMod.show();
}
function obtenerDatosGrabar() {
    var data = txtId.value * 1 + '|';
    data += txtDescri.value;
    return data;
}
function mostrarGrabar(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 1) {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7]];
            tabla.row.add(fila).draw();
            mensaje = "Segmento adicionado";
        }
        if (opc_sel == 3) {
            lista = rpta.split("|");
            celdas[2] = lista[2];
            celdas[6] = lista[6];
            celdas[7] = lista[7];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Segmento actualizado";
        }
        if (opc_sel == 4) {
            lista = rpta.split("|");

            console.log(celdas);

            celdas[3] = lista[3];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Segmento anulado";
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