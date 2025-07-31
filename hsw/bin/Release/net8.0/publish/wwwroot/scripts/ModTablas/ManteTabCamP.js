var listas = [];
var lista = [];
var matriz = [];
var opc_sel = '';
var celdas = '';
var objfila;
const fechaActual = new Date();
const dia = fechaActual.getDate().toString().padStart(2, '0');
const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
const anio = fechaActual.getFullYear();
const Hoy = `${anio}-${mes}-${dia}`;

var tabla = $('#tabla').DataTable({
    data: matriz,
    compact: true,
    order: [1, 'asc'],
    scrollY: 'calc(100vh - 382px)',
    scrollX: true,
    paging: false,
    scrollCollapse: true,
    language: idioma_espanol,
    searching: true,
    autoWidth: false,
    responsive: { // Configuración explícita de Responsive
        details: { // Controla cómo se muestran los detalles de las columnas ocultas
            display: $.fn.dataTable.Responsive.display.modal({
                header: function (row) {
                    var data = row.data();
                    return 'Detalles de Tipo de Cambio para Periodo : ' + data[1];
                }
            }),
            renderer: $.fn.dataTable.Responsive.renderer.tableAll({
                tableClass: 'table'
            })
        }
    },
    columnDefs: [
        {
            targets: 0,
            responsivePriority: 1,
            searchable: false,
            orderable: false,
            width: '80px',
            className: 'dt-body-center text-center',
            render: function (data, type, full, meta) {
                let mostrar = '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar tipo de cambio"><i class="ri-eye-line ri-20px"    style="color:blue"  data-opc="con"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Editar tipo de cambio"   ><i class="ri-pencil-line ri-20px" style="color:green" data-opc="edt"></i></a>' +
                    //'<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular tipo de cambio" ><i class="ri-delete-bin-line"     style="color:red"   data-opc="anu"></i></a>' +
                    '</div>';
                return (mostrar);
            }
        },
        {
            width: "120px", targets: 1, responsivePriority: 2, className: "dt-body-center text-center",
            render: function (data, type, row) {
                let periodoMostrar = data.substr(0,4) + '-' + data.substr(4,3);
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return periodoMostrar;
                }
            }
        },
        { width: "10%", targets: 2, responsivePriority: 3, className: "dt-body-center text-end" },
        {
            targets: 3, responsivePriority: 4, className: "dt-body-center text-center",
            render: function (data, type, row) {
                let fechaMostrar = ''
                if (data == '0000-00-00 00:00:00.000') fechaMostrar = '';
                else fechaMostrar = moment(data).format('DD/MM/YYYY HH:mm:ss');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        },
        {
            targets: 4, responsivePriority: 5, className: "dt-body-center text-center",
            render: function (data, type, row) {
                let fechaMostrar = ''
                if (data == '0000-00-00 00:00:00.000') fechaMostrar = '';
                else fechaMostrar = moment(data).format('DD/MM/YYYY HH:mm:ss');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        }
    ],
    dom: 'Bfrtip',
    buttons: [
        {
            text: '<i class="ri-file-line"></i> Nuevo',
            titleAttr: 'Nuevo',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_sel = 'adi';
                modalTitulo.innerHTML = 'Crear Tipo de cambio promedio';
                get("/ModTablas/ManteTabCamPCSV/?data=" + opc_sel + "|", mostrarAdi);
                function mostrarAdi(rpta) {
                    txtPeriodo.value = rpta;
                    txtTipCam.value = '0.000';
                }
                ListaAdiMod.show();
            }
        }
    ]
});

// Obtener una referencia al modal
const ListaAdiMod = new bootstrap.Modal(document.getElementById('ListaAdiMod'));
function iniciar() {

    mostrarBloqueo('#lista-lst'); 
    get("/ModTablas/ManteTabCamPCSV/?data=ini|", cargaInicial);

    cboPeriodos.onchange = function () {
        mostrarBloqueo('#lista-lst');
        get("/ModTablas/ManteTabCamPCSV/?data=lst|" + cboPeriodos.value, mostrarLista);
    }

    $('#tabla tbody').on('click', 'tr', function (e) {
        opc_sel = e.target.dataset.opc;
        objfila = this;
        celdas = tabla.row(objfila).data();
        if (!(opc_sel === undefined)) {
            if (celdas[10] == 0) {
                Swal.fire({
                    icon: 'error',
                    title: "¡ Anulada !",
                    text: "Tipo de cambio promedio se encuentra anulado.",
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                    buttonsStyling: false
                });
            } else {
                if ('con-edt'.includes(opc_sel)) {
                    if (opc_sel == 'con') modalTitulo.innerHTML = 'Consultar tipo de cambio promedio';
                    else modalTitulo.innerHTML = 'Editar tipo de cambio promedio';
                    get("/ModTablas/ManteTabCamPCSV/?data=" + opc_sel + "|" + celdas[1], editarLista);
                }           }
        }
    });

    btnGuardarLista.onclick = function () {
        if (ControlesValidar() == 0) {
            var data = obtenerDatosGrabar();
            post("/ModTablas/ManteTabCamPGrbCSV", mostrarGrabar, "grb|" + data);
        }
    }
}
function cargaInicial(rpta) {
    listas = rpta.split("¯");
    lista = listas[0].split("¬");
    crearCombo(lista, "cboPeriodos", "");
    get("/ModTablas/ManteTabCamPCSV/?data=lst|" + cboPeriodos.value, mostrarLista);
}
function mostrarLista(rpta) {
    matriz = [];
    if (rpta != "") {
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
    tabla.columns.adjust().draw();
    ocultarBloqueo('#lista-lst');
}
function ControlesValidar() {
    eliminarMarcas();
    let validacion = 0;
    validacion += validaCampos('txtPeriodo', '');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcas() {
    removeRedMark('txtPeriodo');
}
function editarLista(rpta) {
    var reg = rpta.split('|');
    txtPeriodo.value = reg[0];
    txtTipCam.value = reg[1];
    txtPeriodo.disabled = true;
    if (opc_sel == 'con') {
        txtTipCam.disabled = true;
        btnGuardarLista.disabled = true;
    }
    if (opc_sel == 'edt') {
        txtTipCam.disabled = false;
        btnGuardarLista.disabled = false;
    }
    ListaAdiMod.show();
}
function obtenerDatosGrabar() {
    var data = txtPeriodo.value + '|';
    data += txtTipCam.value * 1;
    return data;
}
function mostrarGrabar(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 'adi') {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4]];
            tabla.row.add(fila).draw();
            mensaje = "T/C promedio adicionado ";
        }
        if (opc_sel == 'edt') {
            lista = rpta.split("|");
            celdas[2] = lista[2];
            celdas[3] = lista[3];
            celdas[4] = lista[4];
            tabla.row(objfila).data(celdas).draw();
            mensaje =  "T/C promedio actualizado";
        }
        if (opc_sel == 'anu') {
            lista = rpta.split("|");
            celdas[7] = lista[7];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "T/C promedio anulado";
        }
        Swal.fire({
            icon: 'success',
            title: mensaje,
            text: lista[1],
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