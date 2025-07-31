var NroReg = 0;
var scroll_draw = 0;
var selectedRow = null; // Variable para almacenar la fila actualmente seleccionada

var listas = [];
var lista = [];
var matriz = [];
var opc_sel = '';
var opc_sel_tar = '';
var opc_sel_tkt = '';
var opc_sel_doc = '';
var celdas = '';
var objfila;
var objfilaTabla;

var tabla = $('#tabla').DataTable({
    order: [1, 'desc'],
    scrollY: 'calc(100vh - 382px)',
    scrollX: true,
    compact: true,
    serverSide: true,
    processing: true,
    scrollCollapse: false,
    deferRender: true,
    scroller: {
        loadingIndicator: true,
    },
    language: idioma_espanol,
    columnDefs: [
        {
            targets: 0,
            responsivePriority: 1,
            searchable: false,
            orderable: false,
            width: '130px',
            render: function (data, type, full, meta) {
                let mostrar = '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar Documento"><i class="ri-eye-line"        style="color:blue"  data-opc="con"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Editar Documento">   <i class="ri-pencil-line"     style="color:green" data-opc="edt"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon waves-effect waves-light rounded-pill" data-bs-placement="top" title="Exportar PDF">                          <i class="ri-file-pdf-2-line" style="color:red"   data-opc="pdf"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular Documento">   <i class="ri-delete-bin-line" style="color:red"   data-opc="anu"></i></a>'
                    mostrar+='</div>'
                return (mostrar);
            }
        },
        { width: "0rem", targets: 1, visible: false },
        { width: "3rem", targets: 2 },
        {
            width: "6rem", targets: 3, className: "text-center",
            render: function (data, type, row) {
                let fechaMostrar = moment(data).format('DD/MM/YYYY');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        },
        { width: "10rem", targets: 4 },
        { width: "4rem", targets: 5 },
        { width: "12rem", targets: 6, className: "text-wrap" },
        { width: "18rem", targets: 7, className: "text-wrap" },
        { width: "4rem", targets: 8, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 0) },
        { width: "5rem", targets: 9, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "6rem", targets: 10, className: "text-wrap" },
        {
            width: "6rem", targets: 11, className: "text-center text-wrap",
            render: function (data, type, row) {
                let fecreg=''
                if (data == '0000-00-00 00:00:00') fecreg = '';
                else fecreg = moment(data).format('DD/MM/YYYY HH:mm:ss');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fecreg;
                }
            }
        }
    ],
    ajax: (data, callback, settings) => {
        scroll_draw = data.draw;
        scroll_pageLength = data.length;
        scroll_search = data.search.value;
        scroll_start = data.start;
        if (data.order && data.order.length > 0) {
            scroll_order1 = data.order[0].column;
            scroll_order2 = data.order[0].dir;
        } else {
            scroll_order1 = -1;
            scroll_order2 = '';
        }
        scroll_param = scroll_pageLength + '|' + scroll_order1 + '|' + scroll_order2 + '|' + scroll_search + '|' + scroll_start
        get("/ModMantenimiento/ManteIngresosCSV/?data=lst|" + cboPeriodos.value + '|' + scroll_param, (response) => {
            crearMatrizScroll(response);
            callback({
                draw: scroll_draw,
                data: matriz,
                recordsTotal: NroReg,
                recordsFiltered: NroReg
            });
        });
    },
    rowCallback: function (row, data, index) {
        /* Rechazado */
        if (data[12] == 'R') {
            $('td', row).css('background-color', '#c8c8c8');
        }
    },
    dom: 'B<"mb-2"f>r<"mt-2"t>i',
    buttons: [
        {
            text: '<i class="ri-file-line"></i> Nueva Autorización de Ingreso',
            titleAttr: 'Nueva Autorización',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_sel = 'adi';
                spnDesDoc.innerHTML = 'EMITIR AUTORIZACION DE INGRESO';
                ControlesLimpiar(document.getElementById('controlesAI'));
                //controlesEnabled(document.getElementById('controlesAI'));
                cboCliPro.disabled = false;
                lupa.hidden = false;
                txtNroTarDes.disabled = false;
                dtpFecha.value = Hoy;
                //tabla.ajax.reload()
                tabladet = $('#tabladet').DataTable().clear().rows.add([['', 1, '', 0, 0.00]]).draw();
                document.querySelector('.nav-pills .nav-item:first-child .nav-link').click();
                totalDocumentoAI();
                document.getElementById("lista-lst").hidden = true;
                document.getElementById("listaAI-edt").hidden = false;
            }
        }
    ]
});

var tabladet = $('#tabladet').DataTable({
//    data: [['', 1, '', 0, 0.00]],
    compact: true,
    //order: [4, 'desc'],
    scrollY: '20vh',
    //scrollX: true,
    paging: false,
    scrollCollapse: false,
    language: idioma_espanol,
    searching: false,
    info: false,
    columnDefs: [
        {
            targets: 0,
            className: "text-center",
            responsivePriority: -1,
            searchable: false,
            orderable: false,
            width: '1rem',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Eliminar linea"   ><i class="ri-delete-bin-line"     style="color:red"   data-opc="anu"></i></a>' +
                    '</div>'
                );
            }
        },
        { width: "3rem", targets: 1, className: "text-end", searchable: false, orderable: false },
        { width: "30rem", targets: 2 },
        { width: "5rem", targets: 3, className: "text-end" },
        { width: "5rem", targets: 4, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) }
    ]
});

var tablatkt = $('#tablatkt').DataTable({
    data: matriz,
    scrollY: '15vh',
    //8scrollY: 'calc(100vh - 687px)',
    //scrollX: true,
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
            width: '80px',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Eliminar Documento"><i class="ri-delete-bin-7-line ri-20px" style="color:red"  data-opc="eli"></i></a>' +
                    '</div>'
                );
            }
        },
        { width: "5rem", "targets": 1, className: "text-end" },
        {
            width: "6rem", targets: 2, className: "text-center",
            render: function (data, type, row) {
                let fechaMostrar = moment(data).format('DD/MM/YYYY');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        },
        { width: "6rem", "targets": 3, className: "text-start" },
        { width: "9rem", "targets": 4, className: "text-start" },
        { width: "20rem", "targets": 5, className: "text-start" },
        { width: "10rem", "targets": [6, 7, 8], className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) }
    ],
    dom: 'Bfrtip',
    buttons: [
        {
            text: '<i class="ri-file-line"></i> Ticket',
            titleAttr: 'Ticket',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                get("/ModMantenimiento/ManteIngresosCSV/?data=tkt|" + cboCliPro.value, mostrarTickets);
            }
        }
    ]
});

var tablatickets = $('#tablatickets').DataTable({
    order: [1, 'desc'],
    data: matriz,
    scrollY: '30vh',
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
            width: '80px',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Seleccionar"><i class="ri-check-line ri-20px"  style="color:green" data-opc="sel"></i></a>' +
                    '</div>'
                );
            }
        },
        { width: "5rem", "targets": 1, className: "text-end" },
        {
            width: "6rem", targets: 2, className: "text-center",
            render: function (data, type, row) {
                let fechaMostrar = moment(data).format('DD/MM/YYYY');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        },
        { width: "6rem", "targets": 3, className: "text-start" },
        { width: "9rem", "targets": 4, className: "text-start" },
        { width: "20rem", "targets": 5, className: "text-start" },
        { width: "10rem", "targets": [6, 7, 8], className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) }
    ]
});

var tabladoc = $('#tabladoc').DataTable({
    data: matriz,
    scrollY: '15vh',
    //8scrollY: 'calc(100vh - 687px)',
    //scrollX: true,
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
            width: '80px',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Ver documento">     <i class="ri-eye-line ri-20px"          style="color:blue" data-opc="ver"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Eliminar Documento"><i class="ri-delete-bin-7-line ri-20px" style="color:red"  data-opc="eli"></i></a>' +
                    '</div>'
                );
            }
        },
        { width: "3rem", "targets": 1, className: "text-end" },
        { width: "12rem", "targets": 2 },
        { width: "18rem", "targets": 3 },
        { width: "30rem", "targets": 4 },
        { width: "7rem", "targets": 5, className: "text-end" },
        { width: "10rem", "targets": 6 },
        {
            width: "12rem", targets: 7, className: "text-center",
            render: function (data, type, row) {
                let fecreg = ''
                if (data == '0000-00-00 00:00:00') fecreg = '';
                else fecreg = moment(data).format('DD/MM/YYYY HH:mm:ss');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fecreg;
                }
            }
        }
    ],
    dom: 'Bfrtip',
    buttons: [
        {
            text: '<i class="ri-file-line"></i> Adjuntar Documento',
            titleAttr: 'Adjuntar Documento',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                const cboTarjeta_td = $('#cboTarjeta_td');
                cboTarjeta_td.next('.select2-container').removeClass('is-invalid');
                cboTarjeta_td.next('.select2-container') // Encuentra el contenedor de Select2
                    .find('.select2-selection.select2-selection--single') // Busca el elemento de selección dentro
                    .removeClass('is-invalid'); // Elimina la clase

                removeRedMark('fileAdjuntar');
                $('#cboTarjeta_td').val('-1').trigger('change.select2');
                txtObsD.value = '';
                fileAdjuntar.value = '';
                tarjetaDoc.show();
            }
        }
    ]
});

var tablatarjetas = $('#tablatarjetas').DataTable({
    data: matriz,
    compact: true,
    order: [4, 'desc'],
    scrollY: '35vh',
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
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Seleccionar"><i class="ri-check-line ri-20px"  style="color:green" data-opc="sel"></i></a>' +
                    '</div>'
                );
            }
        },
        { width: "0rem", targets: 1, visible: false },
        { width: "13rem", targets: 2 },
        {
            width: "8rem", targets: 3, className: "text-center",
            render: function (data, type, row) {
                let nrotar = '';
                if (row[1] == '203') nrotar = row[3].substring(0, 4) + '-' + row[3].substring(4)
                else nrotar = row[3]
                return nrotar;
            }
        },
        {
            width: "5rem", targets: 4, className: "text-center",
            render: function (data, type, row) {
                let fechaMostrar = moment(data).format('DD/MM/YYYY');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        },
        { width: "12rem", targets: 5 },
        { width: "40rem", targets: 6 }
    ]
});



var tabladocumentos = $('#tabladocumentos').DataTable({
    data: matriz,
    compact: true,
    order: [3, 'desc'],
    scrollY: '35vh',
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
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Seleccionar"><i class="ri-check-line ri-20px"  style="color:green" data-opc="sel"></i></a>' +
                    '</div>'
                );
            }
        },
        { width: "0rem", targets: 1, visible: false },
        {
            width: "8rem", targets: 2, className: "text-center",
            render: function (data, type, row) {
                let numdoc = data.substring(0, 4) + '-' + data.substring(4,12);
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return numdoc;
                }
            }
        },
        {
            width: "5rem", targets: [3, 4], className: "text-center",
            render: function (data, type, row) {
                let fechaMostrar = moment(data).format('DD/MM/YYYY');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        },
        { width: "1rem", targets: 5 },
        { width: "6rem", targets: 6, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
    ]
});

// Obtener una referencia al modal Ordenes
const MostrarTarjetas = new bootstrap.Modal(document.getElementById('MostrarTarjetas'));

// Obtener una referencia al modal Tickets
const MostrarTickets = new bootstrap.Modal(document.getElementById('MostrarTickets'));

// Obtener una referencia al modal Documentos
const MostrarDocumentos = new bootstrap.Modal(document.getElementById('MostrarDocumentos'));
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

    get("/ModMantenimiento/ManteIngresosCSV/?data=ini|", cargaInicial);
    cboPeriodos.onchange = function () {
        tabla.ajax.reload()
    }

    $('#tabla tbody').on('click', 'tr', function (e) {
        opc_sel = e.target.dataset.opc;
        objfilaTabla = this;
        celdas = tabla.row(objfilaTabla).data();
        if (!(opc_sel === undefined)) {
/*
            if (celdas[10] == 0) {
                Swal.fire({
                    icon: 'error',
                    title: "¡ Anulada !",
                    text: "Documento se encuentra anulado.",
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                    buttonsStyling: false
                });
            } else {
*/
                if ('con-edt'.includes(opc_sel)) {
                    if (opc_sel == 'con') spnDesDoc.innerHTML = 'CONSULTAR AUTORIZACIÓN DE INGRESO';
                    else spnDesDoc.innerHTML = 'EDITAR AUTORIZACIÓN DE INGRESO';
                    get("/ModMantenimiento/ManteIngresosCSV/?data=" + opc_sel + "|" + celdas[1] + "|" + celdas[2], editarAI);

                } else {
                    if (opc_sel == 'pdf') {
                        //var NumDoc = CodAlmacen + '|' + document.getElementById("txtNumDoc").value;

                        //get("/ModMantenimiento/ManteIngresosCSV/?data=pdf|", cargaInicial);
                        get("/ModMantenimiento/ManteIngresosPdf/?Data=" + cboPeriodos.value, mostrarPDF);
                        function mostrarPDF(rpta) {
                            if (rpta == '') {
                                alertify.alert('Ingreso', 'Debe seleccionar una guia !!!')
                            } else {
                                var reg = rpta.split('|');

                                var byteCharacters = atob(reg[0]);
                                var byteNumbers = new Array(byteCharacters.length);
                                for (var i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                var byteArray = new Uint8Array(byteNumbers);
                                var file = new Blob([byteArray], { type: 'application/pdf;base64' });
                                var fileURL = URL.createObjectURL(file);
                                var pdf = "<iframe width='100%' height='99%' src='" + fileURL + "'></iframe>";
                                document.getElementById("divpdf").innerHTML = pdf;
                                $('#pdf-ingreso').modal();
                                //var pdf = "<iframe width='100%' height='99%' src='data:application/pdf;base64," + encodeURI(reg[0]) + "'></iframe>";
                                //document.getElementById("divpdf").innerHTML = pdf;
                                //$('#pdf-ingreso').modal();
                            }
                        }
                    } else {
                        Swal.fire({
                            title: "¿ Está seguro de enviar documento " + celdas[4] + " al DataSmart ?",
                            text: "! No se podrá revertir !",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "! Sí, enviar !",
                            customClass: {
                                confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                                cancelButton: 'btn btn-outline-secondary waves-effect'
                            },
                            buttonsStyling: false
                        }).then(function (result) {
                            if (result.value) {
                                mostrarBloqueo('#lista-lst');
                                //get("/ModFacturacion/ManteFacturasDataSmartCSV/?data=" + opc_sel + "|" + celdas[1] + "|" + celdas[2], mostrarEnviar);
                            }
                        });
                    }
                }
//            }
        }
    });

    $('#tabladet tbody').on('click', 'td', function () {
        var textInput = ''; // Renombrado de 'text' a 'textInput' para evitar conflicto con 'text' de jQuery
        var numberInput = ''; // Renombrado de 'input' a 'numberInput' para mayor claridad
        var celda = $(this);
        var Original = celda.html();
        var Indice = tabladet.column(this).index(); // Índice de la columna clickeada (0-basado)
        var Fila = tabladet.row($(this).closest('tr'));
        var indiceFilaActual = Fila.index(); // Índice de la fila actual (0-basado)

        // Define tus columnas editables por índice (0-basado)
        // Columna 2: Texto (textInput)
        // Columna 3: Número (numberInput)
        // Columna 4: Número (numberInput), es la última columna que dispara la navegación avanzada
        var columnasEditables = [2, 3, 4];
        var ultimaColumnaEditableDeLaFila = 4; // Columna de índice 4 ahora es la que dispara la lógica de avance/nueva fila

        // --- Función Auxiliar para Navegación ---
        function goToNextCellOrAddRow(currentRowNode, currentColumnIndex, currentOriginalRowIndex) {
            let nextColumnIndex = -1;
            // 1. Buscar la siguiente columna editable en la *misma* fila
            for (let i = 0; i < columnasEditables.length; i++) {
                if (columnasEditables[i] === currentColumnIndex) {
                    if (i + 1 < columnasEditables.length) {
                        nextColumnIndex = columnasEditables[i + 1];
                        break;
                    }
                }
            }

            if (nextColumnIndex !== -1) {
                // Si hay una siguiente columna editable en la misma fila, salta a ella
                let siguienteCelda = $(currentRowNode).find('td').eq(nextColumnIndex);
                if (siguienteCelda.length) {
                    siguienteCelda.trigger('click');
                    return; // Terminamos, ya navegamos a la siguiente celda
                }
            }

            // 2. Si no hay más columnas editables en la fila actual, o si ya estamos en la última columna editable,
            // entonces decidir si saltar a la siguiente fila o añadir una nueva
            if (currentColumnIndex === ultimaColumnaEditableDeLaFila) {
                var totalFilas = tabladet.rows().data().length;

                if (currentOriginalRowIndex === totalFilas - 1) { // Si la fila actual es la última
                    // --- Lógica para AÑADIR NUEVA FILA ---
                    var nextItemNumber = totalFilas + 1; // Calcula el número del siguiente ítem para la columna 1

                    var nuevaFilaNode = tabladet.row.add([
                        '',             // Columna 0: Vacía o ID (si no es contador)
                        nextItemNumber, // Columna 1: Contador
                        '',             // Columna 2: Texto
                        0,              // Columna 3: Número
                        0               // Columna 4: Número
                        // *** IMPORTANTE: ASEGÚRATE DE QUE LA CANTIDAD DE ELEMENTOS AQUÍ COINCIDA EXACTAMENTE CON EL NÚMERO DE COLUMNAS DE TU TABLA ***
                    ]).draw().node(); // Añade la fila, la dibuja y obtiene el nodo TR

                    // Haz clic en la primera celda editable (columna de índice 2) de la nueva fila
                    $(nuevaFilaNode).find('td').eq(2).trigger('click');

                } else {
                    // --- Lógica para SALTAR A LA SIGUIENTE FILA (primera columna editable) ---
                    var siguienteFila = tabladet.row(currentOriginalRowIndex + 1);
                    if (siguienteFila.any()) {
                        // Salta a la primera columna editable (índice 2) de la siguiente fila
                        var siguienteCelda = $(siguienteFila.node()).find('td').eq(columnasEditables[0]); // columnablesEditables[0] es la columna de índice 2
                        if (siguienteCelda.length) {
                            siguienteCelda.trigger('click');
                        }
                    }
                }
            }
        }

        // --- Bloque de edición de INPUT DE TEXTO (columna 2) ---
        if (Indice === 2) {
            // Se cambió el selector a 'input' porque 'text' no es un elemento HTML.
            // Se verificó .find('input') en lugar de .find('text')
            if (!celda.find('input').length) {
                textInput = $('<input type="text" style="width: 100%; height: 100%; box-sizing: border-box; border: 2px solid red; padding: 1px; margin: 0; font-size: inherit; text-align: inherit;" oninput="this.value=this.value.toUpperCase();">');
                textInput.val(Original.replace(/<br>/g, '\n'));
                celda.html(textInput);
                textInput.focus().select();
                var Descri = "";

                //textInput.on('input', function () {
                //    if (Indice == 2) {
                //        Descri = $(this).val().replace(/\r/g, '');
                //        var filaData = Fila.data();
                //        filaData[2] = Descri;
                //    }
                //});

                textInput.on('blur', function () {
                    var newContent = $(this).val().replace(/\r/g, '');
                    var filaData = Fila.data();
                    // newContent = newContent.replace(/<br>/g, '\n'); // Esta línea es redundante aquí, ya que newContent viene del input
                    filaData[2] = newContent;
                    Fila.data(filaData).draw(false); // Refresca los datos de DataTables

                    newContent = newContent.replace(/\n/g, '<br>'); // Vuelve a poner <br> para HTML
                    celda.html(newContent);
                });

                textInput.on('keypress', function (e) {
                    if (e.which === 13) {
                        e.preventDefault(); // Previene el salto de línea o envío
                        this.blur(); // Guarda el contenido

                        // Llama a la función auxiliar para manejar la navegación
                        goToNextCellOrAddRow(Fila.node(), Indice, indiceFilaActual);
                    }
                });
            }
        }

        // --- Bloque de edición de INPUT NUMÉRICO (columnas 3 y 4) ---
        if (Indice === 3 || Indice === 4) {
            if (!celda.find('input').length) { // Busca un input (ya que es type="number")
                numberInput = $('<input type="number" step="1" style="width: 100%; height: 100%; box-sizing: border-box; border: 2px solid red; padding: 1px; margin: 0; font-size: inherit; text-align: inherit;">');
                numberInput.val(Original.replace(/,/g, '')); // Quita comas para editar números

                celda.html(numberInput);
                numberInput.focus().select();
                var Cantid = 0;
                var CIFDol = 0; // Se mantiene la variable, aunque su uso es específico para Indice 4 ahora

                numberInput.on('input', function () {
                    if (Indice == 3) {
                        Cantid = parseFloat($(this).val());
                        if (isNaN(Cantid)) Cantid = 0;
                        var filaData = Fila.data();
                        filaData[3] = Cantid;
                    }
                    if (Indice == 4) { // Si la columna es la de índice 4
                        CIFDol = parseFloat($(this).val()); // Usa parseFloat para números con decimales
                        if (isNaN(CIFDol)) CIFDol = 0; // Asegura que sea un número
                        // console.log("CIFDol actualizado:", CIFDol); // Para depuración
                        var filaData = Fila.data();
                        filaData[4] = CIFDol;
                        //Fila.data(filaData).draw(false);
                    }
                    totalDocumentoAI(); // Llama a tu función de cálculo total
                });

                numberInput.on('blur', function () {
                    var newContent;
                    var rawValue = parseFloat($(this).val()); // Obtén el valor numérico
                    if (isNaN(rawValue)) rawValue = 0; // Asegura que sea un número

                    if (Indice === 3) {
                        newContent = rawValue.toFixed(0); // Columna 3: Sin decimales
                    } else if (Indice === 4) {
                        newContent = rawValue.toFixed(2); // Columna 4: Con 2 decimales
                    }

                    newContent = format(newContent); // Asumo que 'format' es tu función para añadir comas/puntos
                    celda.text(newContent);

                    // Actualiza los datos internos de DataTables para la columna actual también
                    var filaData = Fila.data();
                    filaData[Indice] = rawValue; // Guarda el número puro, no el formateado para visualización
                    Fila.data(filaData).draw(false);
                });

                numberInput.on('keypress', function (e) {
                    if (e.which === 13) { // Si se presiona Enter
                        e.preventDefault(); // Previene comportamiento por defecto
                        this.blur(); // Guarda el contenido

                        // Llama a la función auxiliar para manejar la navegación
                        goToNextCellOrAddRow(Fila.node(), Indice, indiceFilaActual);
                    }
                });
            }
        }
    });

    $('#tabladet tbody').on('click', 'i[data-opc="anu"]', function (e) {

        if (tabladet.rows().data().length <= 1) {
            Swal.fire({
                icon: 'error',
                title: "¡ Eliminar !",
                text: "No puede eliminar. Al menos debe haber una fila.",
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                },
                buttonsStyling: false
            });
            return;
        }

        var fila = tabladet.row($(this).closest('tr'));
        fila.remove().draw(false);

        var contador = 1; // Inicia el contador para la columna 1 (índice 1)

        // Recorre cada fila (<tr>) visible en el tbody de la tabla
        $('#tabladet tbody tr').each(function () {
            var filaActualDOM = $(this); // La fila <tr> de jQuery
            var filaDT = tabladet.row(filaActualDOM); // Obtiene el objeto fila de DataTables para esta fila del DOM

            if (filaDT.any()) { // Asegúrate de que es una fila válida de DataTables
                var data = filaDT.data(); // Obtiene los datos actuales de DataTables para esta fila
                data[1] = contador;      // Actualiza el valor del contador en la columna 1 (índice 1)
                filaDT.data(data);       // Guarda los datos actualizados de vuelta en DataTables

                // Actualiza también el texto visible en la celda del DOM
                filaActualDOM.find('td').eq(1).text(contador);
                contador++;
            }
        });
        totalDocumentoAI();
    });

    lupa.onclick = function () {
        get("/ModMantenimiento/ManteIngresosCSV/?data=tar|" + cboCliPro.value, mostrarTarjetas);
    }
    function mostrarTarjetas(rpta) {
        if (rpta == '') {
            Swal.fire({
                icon: 'error',
                title: "¡ Sin datos !",
                text: "Cliente no tiene Ordenes !!!",
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                },
                buttonsStyling: false
            });
        } else {
            matriz = [];
            lista = rpta.split("¬");
            crearMatriz();
            tablatarjetas = $('#tablatarjetas').DataTable().clear().rows.add(matriz).draw();
            var combo = document.getElementById("cboCliPro");
            modalCenterTitle.innerHTML = 'Cliente : ' + combo.options[combo.selectedIndex].text;
            MostrarTarjetas.show();
            tablatarjetas.columns.adjust().draw();
        }
    }

    $('#tablatarjetas tbody').on('click', 'tr', function (e) {
        opc_sel_tar = e.target.dataset.opc;
        objfila = this;
        celdas = tablatarjetas.row(objfila).data();
        txtNroTar.value = celdas[3];
        if (!(opc_sel_tar === undefined)) {
            if (opc_sel_tar == 'sel') {
                get("/ModMantenimiento/ManteIngresosCSV/?data=tf|" + celdas[1] + "|" + celdas[3], mostrarOrden);
            }
        }
    });
    function mostrarOrden(rpta) {
        lista = rpta.split("|");
        txtTipDep.value = lista[0];
        txtCodSer.value = lista[1];
        txtNroTar.value = lista[2];
        txtNroTarDes.value = lista[3];
        txtNumDoc.value = lista[4];
        txtDesAge.value = lista[5];
        txtDesDes.value = lista[6];
        txtDAM.value = lista[7];
        txtFecha.value = lista[8];
        txtTipCam.value = lista[9];
        txtManifiesto.value = lista[10];
        txtBL.value = lista[11];
        txtFOB.value = lista[12];
        txtFlete.value = lista[13];
        txtSeguro.value = lista[14];
        txtAjuste.value = lista[15];
        txtCIF.value = lista[16];
        MostrarTarjetas.hide();
    }

    $('#tablatickets tbody').on('click', 'tr', function (e) {
        opc_sel_tkt = e.target.dataset.opc;
        objfila = this;
        celdas = tablatickets.row(objfila).data();
        if (!(opc_sel_tkt === undefined)) {
            if (opc_sel_tkt == 'sel') {
                tablatkt.row.add(['', celdas[1], celdas[2], celdas[3], celdas[4], celdas[5], celdas[6], celdas[7], celdas[8]]).draw();
                totalDocumentoAI();
                MostrarTickets.hide();
            }
        }
    });

    $('#tablatkt tbody').on('click', 'i[data-opc="eli"]', function (e) {
        var fila = tablatkt.row($(this).closest('tr'));
        fila.remove().draw(false);
        totalDocumentoAI();
    });

    btnCerrarListaTarjetas.onclick = function () {
        MostrarTarjetas.hide();
    }

    btnRegresarLista.onclick = function () {
        document.getElementById("lista-lst").hidden = false;
        document.getElementById("listaAI-edt").hidden = true;
    }
    btnGuardar.onclick = function () {
        if (ControlesValidar() == 0) {
            var data = obtenerDatosGrabar();
            //get("/ModMantenimiento/ManteIngresosCSV/?data=tf|" + celdas[1] + "|" + celdas[3], mostrarOrden);
            post("/ModMantenimiento/ManteIngresosGrbCSV", mostrarGrabar, "grb|" + data);
        }
    }
//    btnGuardarB.onclick = function () {
//        if (ControlesValidarB() == 0) {
//            var data = obtenerDatosGrabarB();
//            post("/ModFacturacion/ManteFacturasGrbCSV", mostrarGrabarB, "gr1|" + data);
//        }
//    }
//    btnGuardarNC.onclick = function () {
//        if (ControlesValidarNC() == 0) {
//            var data = obtenerDatosGrabarFNC();
//            post("/ModFacturacion/ManteFacturasGrbCSV", mostrarGrabarFNC, "grc|" + data);
//        }
//    }
}
function cargaInicial(rpta) {
    listas = rpta.split("¯");
    lista = listas[0].split("¬");
    crearCombo(lista, "cboPeriodos", "");
    lista = listas[1].split("¬");
    crearCombo(lista, "cboCliPro", "** SELECCIONE CLIENTE **");

    $('#cboPeriodos').val(cboPeriodos.value).trigger('change.select2');

}
function crearMatrizScroll(rpta) {
    matriz = [];
    listas = rpta.split('¯');
    if (listas[0] * 1 != 0) {
        lista = listas[1].split("¬")
        var nRegistros = lista.length;
        NroReg = listas[0];
        var campos = [];
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
}
function mostrarLista(rpta) {
    matriz = [];
    if (rpta != "") {
        //var listas = rpta.split("¯");
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
    validacion += validaCampoComboConFeedback('cboCliPro');
    validacion += validaCampos('txtNroTarDes', '');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcas() {
    removeRedMark('cboCliPro');
}
function editarAI(rpta) {
    ControlesLimpiar(document.getElementById('controlesAI'));
    var listas = rpta.split("¯");
    var reg = listas[0].split('|');
    $('#cboCliPro').val(reg[0]).trigger('change.select2');
    txtTipDep.value = reg[1];
    txtCodSer.value = reg[2];
    txtNroTar.value = reg[3];
    txtNroTarDes.value = reg[4];
    txtNumDoc.value = reg[5];
    dtpFecha.value = reg[6];
    txtDesAge.value = reg[7];
    txtDesDes.value = reg[8];
    txtDAM.value = reg[9];
    txtFecha.value = reg[10];
    txtTipCam.value = reg[11];
    txtManifiesto.value = reg[12];
    txtBL.value = reg[13];
    txtFOB.value = reg[14];
    txtFlete.value = reg[15];
    txtSeguro.value = reg[16];
    txtAjuste.value = reg[17];
    txtCIF.value = reg[18];
    txtObs.value = reg[19];
    cboCliPro.disabled = true;
    lupa.hidden = true;
    txtNroTarDes.disabled = true;

    matriz = [];
    lista = listas[1].split('¬');
    crearMatriz();
    tabladet = $('#tabladet').DataTable().clear().rows.add(matriz).draw();

    matriz = [];
    lista = listas[2].split('¬');
    crearMatriz();
    tablatkt = $('#tablatkt').DataTable().clear().rows.add(matriz).draw();

    totalDocumentoAI();
    document.getElementById("lista-lst").hidden = true;
    document.getElementById("listaAI-edt").hidden = false;
    document.querySelector('.nav-pills .nav-item:first-child .nav-link').click();
//    tabfac_det_serF.columns.adjust().draw();
}
function totalDocumentoAI() {
    var totCantid = 0;
    var totCIFDol = 0.00;
    var totPeso = 0.00;
    tabladet.rows().every(function () {
        var data = this.data();
        totCantid += (data[3] * 1);
        totCIFDol += (data[4] * 1);
    });
    tablatkt.rows().every(function () {
        var data = this.data();
        totPeso += (data[8] * 1);
    });
    lblTotCantid.innerHTML = format(totCantid.toFixed(0));
    lblTotCIFDol.innerHTML = format(totCIFDol.toFixed(2));
    let TotCIFSol = (totCIFDol * txtTipCam.value) * 1;
    lblTotCIFSol.innerHTML = format(TotCIFSol.toFixed(2));
    lblTotPeso.innerHTML = format(totPeso.toFixed(2));
};
function mostrarTickets(rpta) {
    if (rpta == '') {
        Swal.fire({
            icon: 'error',
            title: "¡ Sin datos !",
            text: "Cliente no tiene Tickets !!!",
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false
        });
    } else {
        matriz = [];
        lista = rpta.split("¬");
        crearMatriz();
        tablatickets = $('#tablatickets').DataTable().clear().rows.add(matriz).draw();
        var combo = document.getElementById("cboCliPro");
        modalCenterTitleTkt.innerHTML = 'Cliente : ' + combo.options[combo.selectedIndex].text;
        MostrarTickets.show();
        //tablatkt.columns.adjust().draw();
    }
}
function obtenerDatosGrabar() {
    var data = txtTipDep.value * 1 + '|';
    data += txtCodSer.value * 1 + '|';
    data += txtNroTar.value * 1 + '|';
    data += txtNumDoc.value * 1 + '|';
    data += dtpFecha.value + '|';
    data += txtObs.value + '|';
    data += lblTotCantid.innerHTML.replace(/,/g, '') * 1 + '|';
    data += lblTotCIFDol.innerHTML.replace(/,/g, '') * 1 + '|';
    data += lblTotCIFSol.innerHTML.replace(/,/g, '') * 1 + '|';
    data += lblTotPeso.innerHTML.replace(/,/g, '') * 1 + '¯';
    var reg = [];
    var i = 0;
    tabladet.rows().every(function () {
        reg = this.data();
        if (reg[3] * 1 != 0) {
            i++;
            data += (i + '|' + reg[2] + '|' + (reg[3] * 1) + '|' + (reg[4] * 1) + '¬');
        }
    });
    if (reg.length > 0) data = data.slice(0, -1);
    data += '¯';
    reg = [];
    i = 0;
    tablatkt.rows().every(function () {
        reg = this.data();
        data += (reg[1] + '¬');
    });
    if (reg.length > 0) data = data.slice(0, -1);
    return data;
}
function mostrarGrabar(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 'adi') {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8], lista[9], lista[10], lista[11]];
            tabla.row.add(fila).draw();
            mensaje = "Documento adicionado ";
        }
        if (opc_sel == 'edt') {
            celdas = tabla.row(objfilaTabla).data();
            lista = rpta.split("|");
            celdas[5] = lista[5];
            celdas[6] = lista[6];
            celdas[7] = lista[7];
            celdas[8] = lista[8];
            celdas[9] = lista[9];
            tabla.row(objfilaTabla).data(celdas).draw();
            mensaje =  "Documento actualizado";
        }
        if (opc_sel == 'anu') {
            lista = rpta.split("|");
            celdas[7] = lista[7];
            tabla.row(objfilaTabla).data(celdas).draw();
            mensaje = "Documento anulado";
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
        document.getElementById("listaAI-edt").hidden = true;
        document.getElementById("lista-lst").hidden = false;
        //tabla.columns.adjust().draw();
    }
    else {
        mensaje = rpta; // "Ocurrió un error al grabar";
    }
}