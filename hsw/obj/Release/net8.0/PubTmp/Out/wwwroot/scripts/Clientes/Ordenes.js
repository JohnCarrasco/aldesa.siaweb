var listas = [];
var lista = [];
var matriz = [];
var opc_sel = '';
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
    searching: false,
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
    ]
});

var tabladet = $('#tabladet').DataTable({
    data: matriz,
    compact: true,
    order: [3, 'asc'],
    scrollY: 'calc(100vh - 310px)',
    scrollX: true,
    paging: false,
    scrollCollapse: false,
    language: idioma_espanol,
    searching: false,
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
    ]
});


function iniciar() {
    mostrarBloqueo('#lista-lst'); 

    get("/Clientes/OrdenesCSV/?data=lst|", mostrarLista);

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

    $('#tabla tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            tabla.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }

        var dataFila = tabla.row(this).data();
        console.log('Datos de la fila seleccionada:', dataFila);

        // Aquí puedes hacer lo que necesites con los datos de la fila (dataFila)
    });





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
