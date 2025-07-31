var NroReg = 0;
var scroll_draw = 0;
var selectedRow = null; // Variable para almacenar la fila actualmente seleccionada

var listas = [];
var lista = [];
var matriz = [];
var opc_sel = '';
var opc_sel_tar = '';
var opc_sel_doc = '';
var celdas = '';
var objfila;

var tabla = $('#tabla').DataTable({
    order: [[5, 'desc'], [4, 'desc']],
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
            width: '1rem',
            render: function (data, type, full, meta) {
                let mostrar = '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar Documento"><i class="ri-eye-line ri-20px"    style="color:blue"  data-opc="con"></i></a>'
                if (full[11] == "0000-00-00 00:00:00") {
                    mostrar += '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Editar Documento"   ><i class="ri-pencil-line ri-20px" style="color:green" data-opc="edt"></i></a>' +
                        '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular Documento"   ><i class="ri-delete-bin-line"     style="color:red"   data-opc="anu"></i></a>' +
                        '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Enviar DataSmart"   ><i class="ri-send-plane-fill"     data-opc="sen"></i></a>'
                }
                    mostrar+='</div>'
                return (mostrar);
            }
        },
        { width: "0rem", targets: 1, visible: false },
        { width: "0rem", targets: 2, visible: false },
        { width: "1rem", targets: 3 },
        {
            width: "8.5rem", targets: 4, className: "text-center",
            render: function (data, type, row) {
                let datoMostrar = data.replace(' ','<br>');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return datoMostrar;
                }
            }
        },
        {
            width: "6rem", targets: 5, className: "text-center",
            render: function (data, type, row) {
                let fechaMostrar = moment(data).format('DD/MM/YYYY');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        },

        { width: "10rem", targets: 6 },
        { width: "18rem", targets: 7, className: "text-wrap" },
        { width: "1rem", targets: 8 },
        { width: "6rem", targets: 9, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        {
            width: "6rem", targets: 10, className: "text-center",
            render: function (data, type, row) {
                if (data == 1) return '&lt;ACT&gt;'
                else return '*ANU*'
            }
        },
        {
            width: "6rem", targets: 11, className: "text-center text-wrap",
            render: function (data, type, row) {
                let fecenv=''
                if (data == '0000-00-00 00:00:00') fecenv = '';
                else fecenv = moment(data).format('DD/MM/YYYY HH:mm:ss');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fecenv;
                }
            }
        },
        { width: "2rem", targets: 12, className: "text-center" },
        { width: "2rem", targets: 13, className: "text-center" },
        { width: "25rem", targets: 14, className: "text-wrap" }
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
        get("/ModFacturacion/ManteFacturasCSV/?data=lst|" + cboPeriodos.value + '|' + scroll_param, (response) => {
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
            text: '<i class="ri-file-line"></i> Nueva Factura',
            titleAttr: 'Nueva Factura',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_sel = 'adi';
                spnDesDocF.innerHTML = 'EMITIR FACTURA';
                ControlesLimpiar(document.getElementById('controlesF'));
                controlesEnabled(document.getElementById('controlesF'));
                dtpFechaF.value = Hoy;
                get("/ModFacturacion/ManteFacturasCSV/?data=tc|" + Hoy, mostrarTipCamF);
                txtDiasF.value = 0;
                txtFecVenF.value = moment(dtpFechaF.value).add(txtDiasF.value * 1, 'days').format('DD/MM/YYYY');
                dtpFecIni_PerF.value = Hoy;
                txtDias_PerF.value = 30;
                txtFecFin_PerF.value = moment(dtpFecIni_PerF.value).add(txtDias_PerF.value * 1 - 1, 'days').format('DD/MM/YYYY');
                txtNumDocF.disabled = true;
                txtDUAF.disabled = true;
                txtNroCarF.disabled = true;
                txtFecCarF.disabled = true;
                txtFecNumF.disabled = true;
                txtFecFin_PerF.disabled = true;
                txtTipCamF.disabled = true;
                txtFecVenF.disabled = true;
                txtBultosF.disabled = true;
                txtMontoF.disabled = true;
                txtDetPorF.disabled = true;
                txtDetSolF.disabled = true;
                txtDetDolF.disabled = true;
                txtPorIGVF.value = '18.00';
                lblPorIGVF.innerHTML = 'IGV(18.00%)';
                btnGuardarF.disabled = false;
                document.getElementById("serviciosF").hidden = true;
                document.getElementById("tbl_serviciosF").innerHTML = '';
                matriz = [];
                tabfac_detF = $('#tabfac_detF').DataTable().clear().rows.add(matriz).draw();
                tabfac_det_serF = $('#tabfac_det_serF').DataTable().clear().rows.add(matriz).draw();
                totalDocumentoF();
                //ajustarHeadersDataTables($('#tabfac_detF'));
                //ajustarHeadersDataTables($('#tabfac_det_serF'));
                document.getElementById("lista-lst").hidden = true;
                document.getElementById("listaF-edt").hidden = false;
                tabfac_detF.columns.adjust().draw();
                tabfac_det_serF.columns.adjust().draw();
            }
        },
        {
            text: '<i class="ri-file-line"></i> Nueva Boleta',
            titleAttr: 'Nueva Boleta',
            className: 'btn btn-info',
            action: function (e, dt, node, config) {
                opc_sel = 'adi';
                spnDesDocB.innerHTML = 'EMITIR BOLETA DE VENTA';
                ControlesLimpiar(document.getElementById('controlesB'));
                controlesEnabled(document.getElementById('controlesB'));
                txtDireccB.disabled = true;
                dtpFechaB.value = Hoy;
                get("/ModFacturacion/ManteFacturasCSV/?data=tc|" + Hoy, mostrarTipCamB);
                txtDiasB.value = 0;
                txtFecVenB.value = moment(dtpFechaB.value).add(txtDiasB.value * 1, 'days').format('DD/MM/YYYY');
                txtNumDocB.disabled = true;
                txtTipCamB.disabled = true;
                txtFecVenB.disabled = true;
                txtPorIGVB.value = '18.00';
                lblPorIGVB.innerHTML = 'IGV(18.00%)';
                btnGuardarB.disabled = false;
                document.getElementById("serviciosB").hidden = true;
                document.getElementById("tbl_serviciosB").innerHTML = '';
                matriz = [];
                tabfac_det_serB = $('#tabfac_det_serB').DataTable().clear().rows.add(matriz).draw();
                totalDocumentoB();
                document.getElementById("lista-lst").hidden = true;
                document.getElementById("listaB-edt").hidden = false;
                tabfac_det_serB.columns.adjust().draw();
            }
        },
        {
            text: '<i class="ri-file-line"></i> Nueva N/C',
            titleAttr: 'Nueva N/C',
            className: 'btn btn-warning',
            action: function (e, dt, node, config) {
                eliminarMarcasNC();
                opc_sel = 'adi';
                spnDesDocNC.innerHTML = 'EMITIR NOTA DE CRÉDITO';
                ControlesLimpiar(document.getElementById('controlesNC'));
                controlesEnabled(document.getElementById('controlesNC'));
                dtpFechaNC.value = Hoy;
                txtNumDocNC.disabled = true;
                txtTipCamNC.disabled = true;
                txtPorIGVFNC.value = '18.00';
                lblPorIGVFNC.innerHTML = 'IGV(18.00%)';
                btnGuardarNC.disabled = false;
            //    document.getElementById("serviciosB").hidden = true;
            //    document.getElementById("tbl_serviciosB").innerHTML = '';
                matriz = [];
                tabfac_det_serFNC = $('#tabfac_det_serFNC').DataTable().clear().rows.add(matriz).draw();
                totalDocumentoFNC();
                document.getElementById("lista-lst").hidden = true;
                document.getElementById("listaNC-edt").hidden = false;
                tabfac_det_serFNC.columns.adjust().draw();
            }
        },
        {
            text: '<img src="/img/hsw/sunat.jpg" alt="Logo SUNAT" style="width: 4em; height: 1.5em; vertical-align: middle; margin-right: 0.3em;"> Verificar SUNAT',
            titleAttr: 'Verificar estado en SUNAT',
            className: 'btn btn-dark',
            action: function (e, dt, node, config) {
                Swal.fire({
                    title: "¿ Seguro de verificar estado de documentos periodo " + cboPeriodos.value + " en SUNAT ?",
                    //text: "! No se podrá revertir !",
                    icon: "information",
                    showCancelButton: true,
                    confirmButtonText: "! Sí, verificar !",
                    customClass: {
                        confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                        cancelButton: 'btn btn-outline-secondary waves-effect'
                    },
                    buttonsStyling: false
                }).then(function (result) {
                    if (result.value) {
                        mostrarBloqueo('#lista-lst');
                        get("/ModFacturacion/ManteFacturasDSVerificarCSV/?data=" + cboPeriodos.value, mostrarLista);
                    }
                });

            }
        }
    ]
});

var tabfac_detF = $('#tabfac_detF').DataTable({
    data: matriz,
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
        { width: "3rem", targets: 0, className: "text-end" },
        { width: "3rem", targets: 1, visible:false },
        { width: "20rem", targets: 2 },
        { width: "6rem", targets: 3, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "6rem", targets: 4, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "6rem", targets: 5, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "5rem", targets: 6, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "5rem", targets: 7, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "5rem", targets: 8, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) }
    ]
});

var tabfac_det_serF = $('#tabfac_det_serF').DataTable({
    data: matriz,
    compact: true,
    //order: [4, 'desc'],
    scrollY: '40vh',
    //    scrollX: true,
    paging: false,
    scrollCollapse: true,
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
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular Documento"   ><i class="ri-delete-bin-line"     style="color:red"   data-opc="anu"></i></a>' +
                    '</div>'
                );
            }
        },

        { width: "3rem", targets: 1, className: "text-end" },
        { width: "3rem", targets: 2, className: "text-center" },
        {
            width: "20rem", targets: 3,
            render: function (data, type, row) {
                if (type === 'display') {
                    return data ? data.replace(/\n/g, '<br>') : '';
                }
                return data;
            }
        },
        { width: "5rem", targets: 4, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 0) },
        { width: "5rem", targets: 5, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "5rem", targets: 6, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) }
    ]
});

var tabfac_det_serB = $('#tabfac_det_serB').DataTable({
    data: matriz,
    compact: true,
    scrollY: '40vh',
    paging: false,
    scrollCollapse: true,
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
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular Documento"   ><i class="ri-delete-bin-line"     style="color:red"   data-opc="anu"></i></a>' +
                    '</div>'
                );
            }
        },

        { width: "3rem", targets: 1, className: "text-end" },
        { width: "3rem", targets: 2, className: "text-center" },
        {
            width: "20rem", targets: 3,
            render: function (data, type, row) {
                if (type === 'display') {
                    return data ? data.replace(/\n/g, '<br>') : '';
                }
                return data;
            }
        },
        { width: "5rem", targets: 4, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 0) },
        { width: "5rem", targets: 5, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "5rem", targets: 6, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) }
    ]
});

var tabfac_detFNC = $('#tabfac_detFNC').DataTable({
    data: matriz,
    compact: true,
    scrollY: '20vh',
    paging: false,
    scrollCollapse: false,
    language: idioma_espanol,
    searching: false,
    info: false,
    columnDefs: [
        { width: "3rem", targets: 0, className: "text-end" },
        { width: "3rem", targets: 1, visible: false },
        { width: "20rem", targets: 2 },
        { width: "6rem", targets: 3, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "6rem", targets: 4, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "6rem", targets: 5, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "5rem", targets: 6, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "5rem", targets: 7, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "5rem", targets: 8, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) }
    ]
});

var tabfac_det_serFNC = $('#tabfac_det_serFNC').DataTable({
    data: matriz,
    compact: true,
    scrollY: '40vh',
    paging: false,
    scrollCollapse: true,
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
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill disabled-button" data-bs-placement="top" title="Anular Documento"   ><i class="ri-delete-bin-line"     style="color:red"   data-opc="anu"></i></a>' +
                    '</div>'
                );
            }
        },

        { width: "3rem", targets: 1, className: "text-end" },
        { width: "3rem", targets: 2, className: "text-center" },
        {
            width: "20rem", targets: 3,
            render: function (data, type, row) {
                if (type === 'display') {
                    return data ? data.replace(/\n/g, '<br>') : '';
                }
                return data;
            }
        },
        { width: "5rem", targets: 4, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 0) },
        { width: "5rem", targets: 5, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { width: "5rem", targets: 6, className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) }
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

// Obtener una referencia al modal Documentos
const MostrarDocumentos = new bootstrap.Modal(document.getElementById('MostrarDocumentos'));
function iniciar() {

    divServiciosF.hidden = true;
    detF.hidden = true;
    det_serF.hidden = false;

    detFNC.hidden = true;
    det_serFNC.hidden = false;

    var select2 = $('#cboCliProF');
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
    var select2 = $('#cboCliProB');
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
    var select2 = $('#cboCliProNC');
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

    //mostrarBloqueo('#lista-lst'); 
    get("/ModFacturacion/ManteFacturasCSV/?data=ini|", cargaInicial);

    cboPeriodos.onchange = function () {
        tabla.ajax.reload()
        //mostrarBloqueo('#lista-lst');
        //get("/ModFacturacion/ManteFacturasCSV/?data=lst|" + cboPeriodos.value, mostrarLista);
    }

    cboServicioF.onchange = function () {
        var combo = document.getElementById("cboServicioF");
        var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
        if (cboServicioF.value == "FA02" || cboServicioF.value == "FA04") {
            divAdicional3F.hidden = false;
            divAdicional4F.hidden = false;
            divAdicional5F.hidden = false;
        } else {
            divAdicional3F.hidden = true;
            divAdicional4F.hidden = true;
            divAdicional5F.hidden = true;
        }
        if (valorOculto == '') {
            txtBultosF.disabled = false;
            txtMontoF.disabled = false;
            divServiciosF.hidden = false;
            detF.hidden = true;
            det_serF.hidden = false;
            tabfac_det_serF.columns.adjust().draw();
        } else {
            txtBultosF.disabled = true;
            txtMontoF.disabled = true;
            divServiciosF.hidden = true;
            detF.hidden = false;
            det_serF.hidden = true;
            tabfac_detF.columns.adjust().draw();
        }
        txtTipDocF.value = cboServicioF.value.substring(0, 1) == 'F' ? 1 : 3;
        if (!cboServicioF.disabled) get("/ModFacturacion/ManteFacturasCSV/?data=nro|" + cboServicioF.value, mostrarNumDocF);
    }
    function mostrarNumDocF(rpta) {
        txtNumDocF.value = rpta;
    }

    cboServicioB.onchange = function () {
        var combo = document.getElementById("cboServicioB");
        txtTipDocB.value = cboServicioB.value.substring(0, 1) == 'F' ? 1 : 3;
        if (!cboServicioB.disabled) get("/ModFacturacion/ManteFacturasCSV/?data=nro|" + cboServicioB.value, mostrarNumDocB);
    }
    function mostrarNumDocB(rpta) {
        txtNumDocB.value = rpta;
    }

    cboServicioNC.onchange = function () {
        var combo = document.getElementById("cboServicioNC");
        txtTipDocNC.value = 7;
        if (!cboServicioNC.disabled) get("/ModFacturacion/ManteFacturasCSV/?data=nro|" + cboServicioNC.value, mostrarNumDocNC);
    }
    function mostrarNumDocNC(rpta) {
        txtNumDocNC.value = rpta;
    }

    cboMonedaF.onchange = function () {
        btnGuardarF.disabled = true;
        if ((cboMonedaF.value == 'USD') && (txtTipCamF.value * 1 == 0)) {
            Swal.fire({
                icon: 'error',
                title: 'TIPO DE CAMBIO',
                text: 'Para emitir facturas en dólares debe ingresar el tipo de cambio primero !!!',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                },
                buttonsStyling: false
            });
        } else {
            btnGuardarF.disabled = false;
        }
    }
    cboMonedaB.onchange = function () {
        btnGuardarB.disabled = true;
        if ((cboMonedaB.value == 'USD') && (txtTipCamB.value * 1 == 0)) {
            Swal.fire({
                icon: 'error',
                title: 'TIPO DE CAMBIO',
                text: 'Para emitir boletas en dólares debe ingresar el tipo de cambio primero !!!',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                },
                buttonsStyling: false
            });
        } else {
            btnGuardarB.disabled = false;
        }
    }

    cboCliProF.onchange = function () {
        var combo = document.getElementById("cboCliProF");
        if (combo.value * 1 > 0) {
            var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
            txtCorreoF.value = valorOculto;
        } else txtCorreoF.value = '';
    }
    cboCliProB.onchange = function () {
        var combo = document.getElementById("cboCliProB");
        if (combo.value * 1 > 0) {
            var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional").split('_');
            txtDireccB.value = valorOculto[0];
            txtCorreoB.value = valorOculto[1];
        } else {
            txtDireccB.value = '';
            txtCorreoB.value = '';
        }
    }
    cboCliProNC.onchange = function () {
        var combo = document.getElementById("cboCliProNC");
        if (combo.value * 1 > 0) {
            var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
            txtCorreoNC.value = valorOculto;
        } else {
            txtCorreoNC.value = '';
        }
    }

    dtpFechaF.onchange = function () {
        txtFecVenF.value = moment(dtpFechaF.value).add(txtDiasF.value * 1, 'days').format('DD/MM/YYYY');
        get("/ModFacturacion/ManteFacturasCSV/?data=tc|" + dtpFechaF.value, mostrarTipCamF);
    }
    dtpFechaB.onchange = function () {
        txtFecVenB.value = moment(dtpFechaB.value).add(txtDiasB.value * 1, 'days').format('DD/MM/YYYY');
        get("/ModFacturacion/ManteFacturasCSV/?data=tc|" + dtpFechaB.value, mostrarTipCamB);
    }

    dtpFecIni_PerF.onchange = function () {
        txtFecFin_PerF.value = moment(dtpFecIni_PerF.value).add(txtDias_PerF.value * 1 - 1, 'days').format('DD/MM/YYYY');
    }
    txtDias_PerF.oninput = function () {
        if (txtDias_PerF.value * 1 > 0) txtFecFin_PerF.value = moment(dtpFecIni_PerF.value).add(txtDias_PerF.value * 1 - 1, 'days').format('DD/MM/YYYY');
    }
    txtDiasF.oninput = function () {
        txtFecVenF.value = moment(dtpFechaF.value).add(txtDiasF.value * 1, 'days').format('DD/MM/YYYY');
    }
    txtDiasB.oninput = function () {
        txtFecVenB.value = moment(dtpFechaB.value).add(txtDiasB.value * 1, 'days').format('DD/MM/YYYY');
    }
    lupaF.onclick = function(){
        var combo = document.getElementById("cboServicioF");
        var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
        get("/ModFacturacion/ManteFacturasCSV/?data=tar|" + cboCliProF.value + '|' + valorOculto, mostrarTarjetas);
    }
    function mostrarTarjetas(rpta) {
        if (rpta == '') {
            Swal.fire({
                icon: 'error',
                title: "¡ Sin datos !",
                text: "No hay tarjetas pendientes !!!",
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
            //ajustarHeadersDataTables($('#tablatarjetas'));

            var combo = document.getElementById("cboCliProF");
            modalCenterTitle.innerHTML = 'Cliente : ' + combo.options[combo.selectedIndex].text;
            MostrarTarjetas.show();
            tablatarjetas.columns.adjust().draw();
        }
    }

    lupaNC.onclick = function () {
        get("/ModFacturacion/ManteFacturasCSV/?data=doc|" + cboCliProNC.value, mostrarDocumentos);
    }
    function mostrarDocumentos(rpta) {
        if (rpta == '') {
            Swal.fire({
                icon: 'error',
                title: "¡ Sin datos !",
                text: "No hay documentos para aplicar !!!",
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                },
                buttonsStyling: false
            });
        } else {
            matriz = [];
            lista = rpta.split("¬");
            crearMatriz();
            tablaDocumentos = $('#tabladocumentos').DataTable().clear().rows.add(matriz).draw();
            var combo = document.getElementById("cboCliProNC");
            modalCenterTitleNC.innerHTML = 'Cliente : ' + combo.options[combo.selectedIndex].text;
            MostrarDocumentos.show();
            tabladocumentos.columns.adjust().draw();
        }
    }

    chkVariasF.onchange = function () {
        verificarVariasF();
    }

    cboServiciosGrpF.onchange = function () {
        get("/ModCotizaciones/ManteCotizacionesCSV/?data=8|" + cboServiciosGrpF.value, mostrarServiciosF);
        function mostrarServiciosF(rpta) {
            let tabla_serviciosF = document.getElementById("tabla_servicios_detalleF");
            let fila;
            let adiciona;

            lista = rpta.split("¬");
            var campos = [];
            var nRegistros = lista.length;
            var i = 0;
            data = '';
            for (i; i < nRegistros; i++) {
                campos = lista[i].split("|");
                adiciona = true;
                for (let i = 0; i < tabla.rows.length; i++) {
                    fila = tabla_serviciosF.rows[i];
                    if (fila.cells[2].textContent == campos[0]) {
                        adiciona = false;
                        break;
                    }
                }
                if (adiciona) {
                    data += '<tr>';
                    data += '<td style="display:none">' + campos[0] + '</td>';
                    data += '<td class="col-8 col-md-8">';
                    data += '<input type="text" name="txtServicio" class="form-control" disabled value="' + campos[1] + '"/>';
                    data += '</td>';
                    data += '<td class="col-2 col-md-2">';
                    data += '<input type="text" name="txtPrecio" class="form-control" value="' + campos[2] + '"/>';
                    data += '</td>';
                    data += '<td class="col-2 col-md-2">';
                    data += '<div class="d-grid">';
                    data += '<button type="button" class="btn btn-success waves-effect waves-light">Agregar</button>';
                    data += '</div>';
                    data += '</td>';
                    data += '</tr>';
                }
            }
            if (rpta == '') data = '';
            document.getElementById("tbl_serviciosF").innerHTML = data;
        }
    }

    cboServiciosGrpB.onchange = function () {
        get("/ModCotizaciones/ManteCotizacionesCSV/?data=8|" + cboServiciosGrpB.value, mostrarServiciosB);
        function mostrarServiciosB(rpta) {
            let tabla_serviciosB = document.getElementById("tabla_servicios_detalleB");
            let fila;
            let adiciona;

            lista = rpta.split("¬");
            var campos = [];
            var nRegistros = lista.length;
            var i = 0;
            data = '';
            for (i; i < nRegistros; i++) {
                campos = lista[i].split("|");
                adiciona = true;
                for (let i = 0; i < tabla.rows.length; i++) {
                    fila = tabla_serviciosB.rows[i];
                    if (fila.cells[2].textContent == campos[0]) {
                        adiciona = false;
                        break;
                    }
                }
                if (adiciona) {
                    data += '<tr>';
                    data += '<td style="display:none">' + campos[0] + '</td>';
                    data += '<td class="col-8 col-md-8">';
                    data += '<input type="text" name="txtServicio" class="form-control" disabled value="' + campos[1] + '"/>';
                    data += '</td>';
                    data += '<td class="col-2 col-md-2">';
                    data += '<input type="text" name="txtPrecio" class="form-control" value="' + campos[2] + '"/>';
                    data += '</td>';
                    data += '<td class="col-2 col-md-2">';
                    data += '<div class="d-grid">';
                    data += '<button type="button" class="btn btn-success waves-effect waves-light">Agregar</button>';
                    data += '</div>';
                    data += '</td>';
                    data += '</tr>';
                }
            }
            if (rpta == '') data = '';
            document.getElementById("tbl_serviciosB").innerHTML = data;
        }
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
                    text: "Documento se encuentra anulado.",
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                    buttonsStyling: false
                });
            } else {
                if ('con-edt'.includes(opc_sel)) {
                    if (celdas[1] == 1) {
                        if (opc_sel == 'con') spnDesDocF.innerHTML = 'CONSULTAR FACTURA';
                        else spnDesDocF.innerHTML = 'EDITAR FACTURA';
                        get("/ModFacturacion/ManteFacturasCSV/?data=" + opc_sel + "|" + celdas[1] + "|" + celdas[2], editarListaF);
                    } else {
                        if (celdas[1] == 3) {
                            if (opc_sel == 'con') spnDesDocB.innerHTML = 'CONSULTAR BOLETA';
                            else spnDesDocB.innerHTML = 'EDITAR BOLETA';
                            get("/ModFacturacion/ManteFacturasCSV/?data=" + opc_sel + "|" + celdas[1] + "|" + celdas[2], editarListaB);
                        } else {
                            if (opc_sel == 'con') spnDesDocNC.innerHTML = 'CONSULTAR NOTA DE CREDITO';
                            else spnDesDocNC.innerHTML = 'EDITAR NOTA DE CREDITO';
                            get("/ModFacturacion/ManteFacturasCSV/?data=" + opc_sel + "|" + celdas[1] + "|" + celdas[2], editarListaNC);
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
                            get("/ModFacturacion/ManteFacturasDataSmartCSV/?data=" + opc_sel + "|" + celdas[1] + "|" + celdas[2], mostrarEnviar);
                        }
                    });
                }
            }
        }
    });

    $('#tablatarjetas tbody').on('click', 'tr', function (e) {
        opc_sel_tar = e.target.dataset.opc;
        objfila = this;
        celdas = tablatarjetas.row(objfila).data();
        txtNroTarF.value = celdas[3];
        if (!(opc_sel_tar === undefined)) {
            if (opc_sel_tar == 'sel') {
                var combo = document.getElementById("cboServicioF");
                var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
                get("/ModFacturacion/ManteFacturasCSV/?data=tf|" + celdas[1] + "|" + celdas[3] + '|' + dtpFechaF.value + '|' + valorOculto + '|' + cboMonedaF.value, recargar_detalleF);
                //txtNroTarDes.value = '(' + celdas[3].substring(0, 4) + '-' + celdas[3].substring(4) + ') ';
                //MostrarTarjetas.hide();
            }
        }
    });
    function recargar_detalleF(rpta) {
        var listas = rpta.split("¯");
        lista = listas[0].split("|");
        txtCodSerF.value = lista[0];
        txtNroTarF.value = lista[1];
        txtDUAF.value = lista[2];
        txtId_CotizacionF.value = lista[3];
        txtNroCarF.value = lista[4];
        txtFecCarF.value = lista[5];
        txtFecNumF.value = lista[6];
        txtBultosF.value = format(lista[7]);
        txtMontoF.value = format(lista[8]);
        if (lista[0] == 203) txtNroTarDesF.value = '(' + lista[1].substring(0, 4) + '-' + lista[1].substring(4) + ') '
        else txtNroTarDesF.value = lista[1]
        matriz = [];
        if (listas[1] != '') {
            lista = listas[1].split('¬');
            crearMatriz();
            tabfac_detF = $('#tabfac_detF').DataTable().clear().rows.add(matriz).draw();
            totalDocumentoF();
        }
        //ajustarHeadersDataTables($('#tabfac_detF'));
        MostrarTarjetas.hide();
    }

    $('#tabladocumentos tbody').on('click', 'tr', function (e) {
        opc_sel_doc = e.target.dataset.opc;
        objfila = this;
        celdas = tabladocumentos.row(objfila).data();
        txtDocRef.value = celdas[1];
        txtNumRef.value = celdas[2];
        if (!(opc_sel_doc === undefined)) {
            if (opc_sel_doc == 'sel') {
                get("/ModFacturacion/ManteFacturasCSV/?data=con|" + celdas[1] + "|" + celdas[2], recargar_detalleFNC);
            }
        }
    });
    function recargar_detalleFNC(rpta) {
        var listas = rpta.split("¯");
        lista = listas[0].split("|");
        txtNumDocNCRef.value = lista[1] + '-' + lista[2] + ' Fecha Emisión : ' + moment(lista[5]).format('DD/MM/YYYY');;
        txtFecRef.value = lista[5];
        txtTipCamNC.value = lista[18];
        matriz = [];
        if (listas[1] != '') {
            detFNC.hidden = false;
            det_serFNC.hidden = true;
            lista = listas[1].split('¬');
            crearMatriz();
            tabfac_detFNC = $('#tabfac_detFNC').DataTable().clear().rows.add(matriz).draw();
            totalDocumentoFNC();
        }
        if (listas[2] != '') {
            detFNC.hidden = true;
            det_serFNC.hidden = false;
            lista = listas[2].split('¬');
            crearMatriz();
            tabfac_det_serFNC = $('#tabfac_det_serFNC').DataTable().clear().rows.add(matriz).draw();
            totalDocumentoFNC();
        }
        MostrarDocumentos.hide();
    }

    $('#tabfac_detF tbody').on('click', 'td', function () {
        var input = '';
        var celda = $(this);
        var Original = celda.text();
        var Indice = tabfac_detF.column(this).index();
        var Fila = tabfac_detF.row($(this).closest('tr'));

        if (Indice === 5 || Indice === 7) {
            if (!celda.find('input').length) {
                input = $('<input type="number" step="' + (Indice == 5 ? "0.01" : "1.00") + '" value="' + Original + '" style="width: 100%; height: 100%; box-sizing: border-box; border: 2px solid red; padding: 1px; margin: 0; font-size: inherit; text-align: inherit;">');
                celda.html(input);
                input.focus();
                input.on('input', function () { // Escucha el evento 'input'
                    var CIF = (cboMonedaF.value == 'PEN' ? Fila.cell(Fila.index(), 3).data() : Fila.cell(Fila.index(), 4).data()) * 1;
                    if (Indice == 5) {
                        var PorTar = $(this).val() * 1;
                        var Resultado = ((CIF * PorTar / 100).toFixed(2)) * 1;
                        var TarMin = $(Fila.node()).find('td:eq(6)').text() * 1;
                        var Total = ((Resultado <= TarMin ? TarMin : Resultado) * 1).toFixed(2);
                        $(Fila.node()).find('td:eq(5)').text(Resultado);
                        $(Fila.node()).find('td:eq(7)').text(Total);
                        var filaData = Fila.data();
                        filaData[5] = PorTar;
                        filaData[6] = Resultado;
                        filaData[8] = Total;
                    }
                    if (Indice == 7) {
                        var TarMin = $(this).val().replace(/,/g, '') * 1;
                        var Resultado = $(Fila.node()).find('td:eq(5)').text().replace(/,/g, '') * 1;
                        var Total = ((Resultado <= TarMin ? TarMin : Resultado) * 1).toFixed(2);
                        $(Fila.node()).find('td:eq(7)').text(Total);
                        var filaData = Fila.data();
                        filaData[6] = Resultado;
                        filaData[7] = TarMin;
                        filaData[8] = Total;
                    }
                    totalDocumentoF();
                });

                input.on('blur', function () {
                    var newContent = $(this).val();
                    //if (Indice == 5) $(Fila.node()).find('td:eq(4)').text(newContent);
                    //else $(Fila.node()).find('td:eq(6)').text(newContent);
                    celda.text(newContent);
                    //var filaData = Fila.data();
                    //var valorDOM = $(Fila.node()).find('td:eq(5)').text(); // Obtén el valor final del DOM
                    //var totalDOM = $(Fila.node()).find('td:eq(7)').text(); // Obtén el valor final del DOM
                });

                input.on('keypress', function (e) {
                    if (e.which === 13) {
                        this.blur();
                    }
                });
            }
        }
    });

    $('#tabfac_det_serF tbody').on('click', 'td', function () {
        var textarea = '';
        var input = '';
        var celda = $(this);
        var Original = celda.html();
        var Indice = tabfac_det_serF.column(this).index();
        var Fila = tabfac_det_serF.row($(this).closest('tr'));

        if (Indice === 3) {
            if (!celda.find('textarea').length) {
                textarea = $('<textarea maxlength="500" rows="2" style="width: 100%; height: 100%; box-sizing: border-box; border: 2px solid red; padding: 1px; margin: 0; font-size: inherit; text-align: inherit;" oninput="this.value=this.value.toUpperCase();"></textarea>');
                textarea.val(Original.replace(/<br>/g, '\n'));
                celda.html(textarea);
                textarea.focus();
                textarea.on('blur', function () {
                    var newContent = $(this).val().replace(/\r/g, '');
                    var filaData = Fila.data();
                    newContent = newContent.replace(/<br>/g, '\n');
                    filaData[3] = newContent;
                    newContent = newContent.replace(/\n/g, '<br>');
                    celda.html(newContent);
                });
            }
        }

        if (Indice === 4 || Indice === 5) {
            if (!celda.find('input').length) {
                input = $('<input type="number" step="1" style="width: 100%; height: 100%; box-sizing: border-box; border: 2px solid red; padding: 1px; margin: 0; font-size: inherit; text-align: inherit;">');
                input.val(Original);
                celda.html(input);
                input.focus();
                input.on('input', function () {
                    if (Indice == 4) {
                        var Cantid = $(this).val() * 1;
                        var Precio = $(Fila.node()).find('td:eq(5)').text() * 1;
                    }
                    if (Indice == 5) {
                        var Cantid = $(Fila.node()).find('td:eq(4)').text() * 1; 
                        var Precio = $(this).val() * 1;
                    }
                    var Total = (Cantid * Precio * 1).toFixed(2);
                    $(Fila.node()).find('td:eq(6)').text(Total);
                    var filaData = Fila.data();
                    filaData[4] = Cantid;
                    filaData[5] = Precio;
                    filaData[6] = Total;
                    totalDocumentoF();
                });

                input.on('blur', function () {
                    var newContent = $(this).val();
                    celda.text(newContent);
                });

                input.on('keypress', function (e) {
                    if (e.which === 13) {
                        this.blur();
                    }
                });
            }
        }
    });
    $('#tabfac_det_serF tbody').on('click', 'i[data-opc="anu"]', function (e) {
        var fila = tabfac_det_serF.row($(this).closest('tr'));
        fila.remove().draw();
        tabfac_det_serF.rows().every(function (rowIdx, tableLoop, rowLoop) {
            var data = this.data();
            data[1] = rowIdx + 1;
            this.data(data);
        });
        tabfac_det_serF.draw(false);
        totalDocumentoF();
    });

    $('#tabfac_det_serB tbody').on('click', 'td', function () {
        var textarea = '';
        var input = '';
        var celda = $(this);
        var Original = celda.html();
        var Indice = tabfac_det_serB.column(this).index();
        var Fila = tabfac_det_serB.row($(this).closest('tr'));

        if (Indice === 3) {
            if (!celda.find('textarea').length) {
                textarea = $('<textarea maxlength="500" rows="2" style="width: 100%; height: 100%; box-sizing: border-box; border: 2px solid red; padding: 1px; margin: 0; font-size: inherit; text-align: inherit;" oninput="this.value=this.value.toUpperCase();"></textarea>');
                textarea.val(Original.replace(/<br>/g, '\n'));
                celda.html(textarea);
                textarea.focus();
                textarea.on('blur', function () {
                    var newContent = $(this).val().replace(/\r/g, '');
                    var filaData = Fila.data();
                    newContent = newContent.replace(/<br>/g, '\n');
                    filaData[3] = newContent;
                    newContent = newContent.replace(/\n/g, '<br>');
                    celda.html(newContent);
                });
            }
        }

        if (Indice === 4 || Indice === 5) {
            if (!celda.find('input').length) {
                input = $('<input type="number" step="1" style="width: 100%; height: 100%; box-sizing: border-box; border: 2px solid red; padding: 1px; margin: 0; font-size: inherit; text-align: inherit;">');
                input.val(Original);
                celda.html(input);
                input.focus();
                input.on('input', function () {
                    if (Indice == 4) {
                        var Cantid = $(this).val() * 1;
                        var Precio = $(Fila.node()).find('td:eq(5)').text() * 1;
                    }
                    if (Indice == 5) {
                        var Cantid = $(Fila.node()).find('td:eq(4)').text() * 1;
                        var Precio = $(this).val() * 1;
                    }
                    var Total = (Cantid * Precio * 1).toFixed(2);
                    $(Fila.node()).find('td:eq(6)').text(Total);
                    var filaData = Fila.data();
                    filaData[4] = Cantid;
                    filaData[5] = Precio;
                    filaData[6] = Total;
                    totalDocumentoB();
                });

                input.on('blur', function () {
                    var newContent = $(this).val();
                    celda.text(newContent);
                });

                input.on('keypress', function (e) {
                    if (e.which === 13) {
                        this.blur();
                    }
                });
            }
        }
    });
    $('#tabfac_det_serB tbody').on('click', 'i[data-opc="anu"]', function (e) {
        var fila = tabfac_det_serB.row($(this).closest('tr'));
        fila.remove().draw();
        tabfac_det_serB.rows().every(function (rowIdx, tableLoop, rowLoop) {
            var data = this.data();
            data[1] = rowIdx + 1;
            this.data(data);
        });
        tabfac_det_serB.draw(false);
        totalDocumentoB();
    });

    btnCerrarListaTarjetas.onclick = function () {
        MostrarTarjetas.hide();
    }

    btnAgregarServicioF.onclick = function () {
        $('#cboServiciosGrpF').val('-1').trigger('change.select2');
        document.getElementById("serviciosF").hidden = false;
        btnAgregarServicioF.disabled = true;
        btnGuardarF.disabled = true;
    }
    btnAgregarServicioB.onclick = function () {
        $('#cboServiciosGrpB').val('-1').trigger('change.select2');
        document.getElementById("serviciosB").hidden = false;
        btnAgregarServicioB.disabled = true;
        btnGuardarB.disabled = true;
    }
    btnCerrarServicioF.onclick = function () {
        document.getElementById("serviciosF").hidden = true;
        document.getElementById("tbl_serviciosF").innerHTML = '';
        btnAgregarServicioF.disabled = false;
        btnGuardarF.disabled = false;
    }
    btnCerrarServicioB.onclick = function () {
        document.getElementById("serviciosB").hidden = true;
        document.getElementById("tbl_serviciosB").innerHTML = '';
        btnAgregarServicioB.disabled = false;
        btnGuardarB.disabled = false;
    }

    document.getElementById('tbl_serviciosF').addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            let lastRow = tabfac_det_serF.row(':last');
            let Item = (lastRow.any() ? lastRow.data()[1] : 0) * 1 + 1;
            let fila = event.target.parentNode.parentNode.parentNode;
            let id_servicio = fila.children[0].innerHTML;
            let servicio = fila.children[1].children[0].value;
            let precio = fila.children[2].children[0].value;
            tabfac_det_serF.row.add(['', Item, id_servicio, servicio, 1, precio, precio]).draw();
            // ocultar fila adicionada
            fila.style.display = "none";
            totalDocumentoF();
        }
    });
    document.getElementById('tbl_serviciosB').addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            let lastRow = tabfac_det_serB.row(':last');
            let Item = (lastRow.any() ? lastRow.data()[1] : 0) * 1 + 1;
            let fila = event.target.parentNode.parentNode.parentNode;
            let id_servicio = fila.children[0].innerHTML;
            let servicio = fila.children[1].children[0].value;
            let precio = fila.children[2].children[0].value;
            tabfac_det_serB.row.add(['', Item, id_servicio, servicio, 1, precio, precio]).draw();
            // ocultar fila adicionada
            fila.style.display = "none";
            totalDocumentoB();
        }
    });

    btnRegresarListaF.onclick = function () {
        document.getElementById("lista-lst").hidden = false;
        document.getElementById("listaF-edt").hidden = true;
        //tabla.columns.adjust().draw();
    }
    btnRegresarListaB.onclick = function () {
        document.getElementById("lista-lst").hidden = false;
        document.getElementById("listaB-edt").hidden = true;
        //tabla.columns.adjust().draw();
    }
    btnRegresarListaNC.onclick = function () {
        document.getElementById("lista-lst").hidden = false;
        document.getElementById("listaNC-edt").hidden = true;
        //tabla.columns.adjust().draw();
    }
    btnGuardarF.onclick = function () {
        if (ControlesValidarF() == 0) {
            var data = obtenerDatosGrabarF();
            post("/ModFacturacion/ManteFacturasGrbCSV", mostrarGrabarF, "grb|" + data);
        }
    }
    btnGuardarB.onclick = function () {
        if (ControlesValidarB() == 0) {
            var data = obtenerDatosGrabarB();
            post("/ModFacturacion/ManteFacturasGrbCSV", mostrarGrabarB, "gr1|" + data);
        }
    }
    btnGuardarNC.onclick = function () {
        if (ControlesValidarNC() == 0) {
            var data = obtenerDatosGrabarFNC();
            post("/ModFacturacion/ManteFacturasGrbCSV", mostrarGrabarFNC, "grc|" + data);
        }
    }
}
function cargaInicial(rpta) {
    listas = rpta.split("¯");
    lista = listas[0].split("¬");
    crearCombo(lista, "cboPeriodos", "");
    lista = listas[1].split("¬");
    crearCombo(lista, "cboServicioF", "** SELECCIONE SERIE - SERVICIO **");
    lista = listas[2].split("¬");
    crearCombo(lista, "cboServicioB", "** SELECCIONE SERIE - SERVICIO **");
    lista = listas[3].split("¬");
    crearCombo(lista, "cboServicioNC", "** SELECCIONE SERIE - SERVICIO **");
    lista = listas[4].split("¬");
    crearCombo(lista, "cboMonedaF", "");
    crearCombo(lista, "cboMonedaB", "");
    crearCombo(lista, "cboMonedaNC", "");
    lista = listas[5].split("¬");
    crearCombo(lista, "cboForPagF", "");
    crearCombo(lista, "cboForPagB", "");
    lista = listas[6].split("¬");
    crearCombo(lista, "cboCliProF", "** SELECCIONE CLIENTE **");
    crearCombo(lista, "cboCliProNC", "** SELECCIONE CLIENTE **");
    lista = listas[7].split("¬");
    crearCombo(lista, "cboCliProB", "** SELECCIONE CLIENTE **");
    lista = listas[8].split("¬");
    crearCombo(lista, "cboServiciosGrpF", "** SELECCIONE GRUPO DE SERVICIOS **");
    crearCombo(lista, "cboServiciosGrpB", "** SELECCIONE GRUPO DE SERVICIOS **");
    lista = listas[9].split("¬");
    crearCombo(lista, "cboTabMotNC", "** SELECCIONE MOTIVO DE N/C **");
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
function mostrarTipCamF(rpta) {
    txtTipCamF.value = rpta;
}
function mostrarTipCamB(rpta) {
    txtTipCamB.value = rpta;
}
function mostrarTipCamNC(rpta) {
    txtTipCamNC.value = rpta;
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
function ControlesValidarF() {
    eliminarMarcasF();
    let validacion = 0;
    validacion += validaCampos('cboCliProF', '-1');
    return (validacion != 0) ? 1 : 0;
}
function ControlesValidarB() {
    eliminarMarcasB();
    let validacion = 0;
    validacion += validaCampos('cboCliProB', '-1');
    return (validacion != 0) ? 1 : 0;
}
function ControlesValidarNC() {
    eliminarMarcasNC();
    let validacion = 0;
    validacion += validaCampoComboConFeedback('cboServicioNC', '-1');
    validacion += validaCampoComboConFeedback('cboCliProNC', '-1');
    validacion += validaCampoComboConFeedback('cboTabMotNC', '-1');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcasF() {
    removeRedMark('cboCliProF');
}
function eliminarMarcasB() {
    removeRedMark('cboCliProB');
}
function eliminarMarcasNC() {
    removeRedMark('cboServicioNC', 'cboCliProNC','cboTabMotNC');
}
function editarListaF(rpta) {
    ControlesLimpiar(document.getElementById('controlesF'));
    var listas = rpta.split("¯");
    var reg = listas[0].split('|');
    txtTipDocF.value = reg[0];
    cboServicioF.disabled = true;
    $('#cboServicioF').val(reg[1]).trigger('change.select2');
    txtNumDocF.value = reg[2];
    txtTipCamF.value = reg[18];
    $('#cboMonedaF').val(reg[3]).trigger('change.select2');
    $('#cboForPagF').val(reg[4]).trigger('change.select2');
    dtpFechaF.value = reg[5];
    $('#cboCliProF').val(reg[6]).trigger('change.select2');
    txtId_CotizacionF.value = reg[7];
    chkVariasF.checked = (reg[8] == 0 ? true : false);
    txtCodSerF.value = reg[8]*1 ;
    txtNroTarF.value = reg[9]*1;
    if (chkVariasF.checked) {
        txtNroTarDesF.value = 'VARIAS TARJETAS';
        lupaF.hidden = true;
        txtBultosF.disabled = false;
        txtMontoF.disabled = false;
    } else {
        if (reg[8] == 203) txtNroTarDesF.value = '(' + reg[9].substring(0, 4) + '-' + reg[9].substring(4) + ') '
        else txtNroTarDesF.value = reg[9]
        lupaF.hidden = false;
        txtBultosF.disabled = true;
        txtMontoF.disabled = true;
        txtDias_PerF.value = 0;
    }
    txtCorreoF.value = reg[10];
    txtDUAF.value = reg[11];
    txtNroCarF.value = reg[12];
    txtFecCarF.value = reg[13];
    txtFecNumF.value = reg[14];
    dtpFecIni_PerF.value = reg[15];
    txtDias_PerF.value = reg[16];
    txtFecFin_PerF.value = reg[17];
    txtDiasF.value = reg[19];
    txtFecVenF.value = reg[20];
    txtBultosF.value = format(reg[21]);
    txtMontoF.value = format(reg[22]);
    txtPorIGVF.value = reg[23];
    lblPorIGVF.innerHTML = 'IGV(' + reg[23] + '%)';
    txtObsF.value = reg[24];
    btnCerrarServicioF.click();
    matriz = [];
    tabfac_detF = $('#tabfac_detF').DataTable().clear().rows.add(matriz).draw();
    tabfac_det_serF = $('#tabfac_det_serF').DataTable().clear().rows.add(matriz).draw();
    if (listas[1] != '') {
        lista = listas[1].split('¬');
        crearMatriz();
        tabfac_detF = $('#tabfac_detF').DataTable().clear().rows.add(matriz).draw();
    }
    if (listas[2] != '') {
        lista = listas[2].split('¬');
        crearMatriz();
        tabfac_det_serF = $('#tabfac_det_serF').DataTable().clear().rows.add(matriz).draw();
    }
    //ajustarHeadersDataTables($('#tabfac_detF').closest('.dataTables_wrapper'));
    //ajustarHeadersDataTables($('#tabfac_det_serF').closest('.dataTables_wrapper'));
    //ajustarHeadersDataTables($('#tabfac_detF'));
    //ajustarHeadersDataTables($('#tabfac_det_serF'));
    totalDocumentoF();

    if (opc_sel == 'con') {
        //controlesDisabled(document.getElementById('controles'));
        cboMonedaF.disabled = true;
        cboForPagF.disabled = true;
        dtpFechaF.disabled = true;
        cboCliProF.disabled = true;
        chkVariasF.disabled = true;
        lupaF.disabled = true;
        txtNroTarDesF.disabled = true;
        txtCorreoF.disabled = true;
        dtpFecIni_PerF.disabled = true;
        txtDias_PerF.disabled = true;
        txtDiasF.disabled = true;
        detF.disabled = true;
        tabfac_det_serF.disabled = true;
        btnAgregarServicioF.disabled = true;
        btnGuardarF.disabled = true;
    }
    if (opc_sel == 'edt') {
        //controlesEnabled(document.getElementById('controles'));
        cboMonedaF.disabled = false;
        cboForPagF.disabled = false;
        dtpFechaF.disabled = false;
        cboCliProF.disabled = false;
        chkVariasF.disabled = false;
        lupaF.disabled = false;
        txtNroTarDesF.disabled = false;
        txtCorreoF.disabled = false;
        dtpFecIni_PerF.disabled = false;
        txtDias_PerF.disabled = false;
        txtDiasF.disabled = false;
        detF.disabled = false;
        tabfac_det_serF.disabled = false;
        btnAgregarServicioF.disabled = false;
        btnGuardarF.disabled = false;
    }
    document.getElementById("lista-lst").hidden = true;
    document.getElementById("listaF-edt").hidden = false;
    tabfac_detF.columns.adjust().draw();
    tabfac_det_serF.columns.adjust().draw();
}
function editarListaB(rpta) {
    ControlesLimpiar(document.getElementById('controlesB'));
    var listas = rpta.split("¯");
    var reg = listas[0].split('|');
    txtTipDocB.value = reg[0];
    cboServicioB.disabled = true;
    $('#cboServicioB').val(reg[1]).trigger('change.select2');
    txtNumDocB.value = reg[2];
    $('#cboMonedaB').val(reg[3]).trigger('change.select2');
    $('#cboForPagB').val(reg[4]).trigger('change.select2');
    txtTipCamB.value = reg[5];
    $('#cboCliProB').val(reg[6]).trigger('change.select2');
    dtpFechaB.value = reg[7];
    txtDiasB.value = reg[8];
    txtFecVenB.value = reg[9];
    txtCorreoB.value = reg[10];
    chkGratuita.checked = (reg[11] == 1 ? true : false);
    txtObsB.value = reg[12];
    txtPorIGVB.value = reg[13];
    lblPorIGVB.innerHTML = 'IGV(' + reg[13] + '%)';
    btnCerrarServicioB.click();
    matriz = [];
    tabfac_det_serB = $('#tabfac_det_serF').DataTable().clear().rows.add(matriz).draw();
    if (listas[2] != '') {
        lista = listas[2].split('¬');
        crearMatriz();
        tabfac_det_serB = $('#tabfac_det_serB').DataTable().clear().rows.add(matriz).draw();
    }
    totalDocumentoB();

    txtDireccB.disabled = true;
    if (opc_sel == 'con') {
        cboMonedaB.disabled = true;
        cboForPagB.disabled = true;
        cboCliProB.disabled = true;
        dtpFechaB.disabled = true;
        txtDiasB.disabled = true;
        txtCorreoB.disabled = true;
        tabfac_det_serB.disabled = true;
        btnAgregarServicioB.disabled = true;
        btnGuardarB.disabled = true;
    }
    if (opc_sel == 'edt') {
        cboMonedaB.disabled = false;
        cboForPagB.disabled = false;
        cboCliProB.disabled = false;
        dtpFechaB.disabled = false;
        txtDiasB.disabled = false;
        txtCorreoB.disabled = false;
        tabfac_det_serB.disabled = false;
        btnAgregarServicioB.disabled = false;
        btnGuardarB.disabled = false;
    }
    document.getElementById("lista-lst").hidden = true;
    document.getElementById("listaB-edt").hidden = false;
    tabfac_det_serB.columns.adjust().draw();
}
function editarListaNC(rpta) {
    ControlesLimpiar(document.getElementById('controlesNC'));
    var listas = rpta.split("¯");
    var reg = listas[0].split('|');
    txtTipDocNC.value = reg[0];
    cboServicioNC.disabled = true;
    $('#cboServicioNC').val(reg[1]).trigger('change.select2');
    txtNumDocNC.value = reg[2];
    dtpFechaNC.value = reg[3];
    $('#cboMonedaNC').val(reg[4]).trigger('change.select2');
    txtTipCamNC.value = reg[5];
    $('#cboCliProNC').val(reg[6]).trigger('change.select2');
    txtCorreoNC.value = reg[7];
    txtDocRef.value = reg[8];
    txtNumRef.value = reg[9];
    txtFecRef.value = reg[10];
    txtNumDocNCRef.value = reg[9].substring(0, 4) + '-' + reg[9].substring(4,13) + ' Fecha Emisión : ' + moment(reg[10]).format('DD/MM/YYYY');;
    $('#cboTabMotNC').val(reg[11]).trigger('change.select2');
    txtObsFNC.value = reg[12];
    txtPorIGVFNC.value = reg[13];
    lblPorIGVFNC.innerHTML = 'IGV(' + reg[14] + '%)';
    matriz = [];
    tabfac_detFNC = $('#tabfac_detFNC').DataTable().clear().rows.add(matriz).draw();
    tabfac_det_serFNC = $('#tabfac_det_serFNC').DataTable().clear().rows.add(matriz).draw();
    if (listas[1] != '') {
        lista = listas[1].split('¬');
        crearMatriz();
        tabfac_detFNC = $('#tabfac_detFNC').DataTable().clear().rows.add(matriz).draw();
    }
    if (listas[2] != '') {
        lista = listas[2].split('¬');
        crearMatriz();
        tabfac_det_serFNC = $('#tabfac_det_serFNC').DataTable().clear().rows.add(matriz).draw();
    }
    //ajustarHeadersDataTables($('#tabfac_detF').closest('.dataTables_wrapper'));
    //ajustarHeadersDataTables($('#tabfac_det_serF').closest('.dataTables_wrapper'));
    //ajustarHeadersDataTables($('#tabfac_detF'));
    //ajustarHeadersDataTables($('#tabfac_det_serF'));
    totalDocumentoFNC();

    if (opc_sel == 'con') {
        //controlesDisabled(document.getElementById('controles'));
        cboMonedaNC.disabled = true;
        dtpFechaNC.disabled = true;
        cboCliProNC.disabled = true;
        txtCorreoNC.disabled = true;
        lupaNC.disabled = true;
        txtNumDocNCRef.disabled = true;
        cboTabMotNC.disabled = true;
        txtObsFNC.disabled = true;
        detFNC.disabled = true;
        tabfac_det_serFNC.disabled = true;
        btnGuardarNC.disabled = true;
    }
    if (opc_sel == 'edt') {
        //controlesEnabled(document.getElementById('controles'));
        cboMonedaNC.disabled = false;
        dtpFechaNC.disabled = false;
        cboCliProNC.disabled = false;
        txtCorreoNC.disabled = false;
        lupaNC.disabled = false;
        txtNumDocNCRef.disabled = false;
        cboTabMotNC.disabled = false;
        txtObsFNC.disabled = false;
        detFNC.disabled = false;
        tabfac_det_serFNC.disabled = false;
        btnGuardarNC.disabled = false;
    }
    document.getElementById("lista-lst").hidden = true;
    document.getElementById("listaNC-edt").hidden = false;
    tabfac_detFNC.columns.adjust().draw();
    tabfac_det_serFNC.columns.adjust().draw();
}
function totalDocumentoF() {
    var totalSuma = 0.00;
    var PorIGV = txtPorIGVF.value * 1;
    tabfac_detF.rows().every(function () {
        var data = this.data();
        totalSuma += data[8] * 1;
    });
    tabfac_det_serF.rows().every(function () {
        var data = this.data();
        totalSuma += data[6] * 1;
    });
    lblVVF.innerHTML = format(totalSuma.toFixed(2));
    let IGV = ((totalSuma * PorIGV / 100) * 1).toFixed(2);
    lblIGVF.innerHTML = format(IGV);
    lblTotalF.innerHTML = format((totalSuma + (IGV * 1)).toFixed(2));
    let total = totalSuma + (IGV * 1);
    let Base = total;
    let DetPor = "0.00"
    let DetSol = "0.00";
    let DetDol = "0.00";
    if (cboMonedaF.value == "USD") {
        Base = (total * (txtTipCamF.value * 1)).toFixed(2);
    }
    if (cboServicioF.value == "FA02" || cboServicioF.value == "FA04") {
        if (Base > 700) {
            DetPor = "12.00"
            if (cboMonedaF.value == "PEN") {
                DetSol = (total * 0.12).toFixed(0);
            } else {
                DetDol = (total * 0.12).toFixed(2);
                DetSol = (DetDol * (txtTipCamF.value * 1)).toFixed(0);
            }
        }
    }
    txtDetPorF.value = DetPor;
    txtDetSolF.value = DetSol;
    txtDetDolF.value = DetDol;
};
function totalDocumentoB() {
    var totalSuma = 0.00;
    var PorIGV = txtPorIGVB.value * 1;
    tabfac_det_serB.rows().every(function () {
        var data = this.data();
        totalSuma += data[6] * 1;
    });
    lblVVB.innerHTML = format(totalSuma.toFixed(2));
    let IGV = ((totalSuma * PorIGV / 100) * 1).toFixed(2);
    lblIGVB.innerHTML = format(IGV);
    lblTotalB.innerHTML = format((totalSuma + (IGV * 1)).toFixed(2));
};
function verificarVariasF() {
    if (chkVariasF.checked) {
        txtNroTarF.value = '0';
        txtNroTarDesF.value = 'VARIAS TARJETAS';
        lupaF.hidden = true;
        txtBultosF.disabled = false;
        txtMontoF.disabled = false;
        txtDias_PerF.value = 30;
        if ('FA01-FA02'.includes(cboServicioF.value)) txtBultosF.disabled = false;
    } else {
        txtNroTarF.value = '0';
        txtNroTarDesF.value = '';
        lupaF.hidden = false;
        txtBultosF.disabled = true;
        txtMontoF.disabled = true;
        txtDias_PerF.value = 0;
        if ('FA01-FA02'.includes(cboServicioF.value)) {
            txtBultosF.disabled = true;
            txtBultosF.value = '';
            txtMontoF.disabled = true;
            txtMontoF.value = '';
        }
    }
}
function totalDocumentoFNC() {
    var totalSuma = 0.00;
    var PorIGV = txtPorIGVFNC.value * 1;
    tabfac_detFNC.rows().every(function () {
        var data = this.data();
        totalSuma += data[8] * 1;
    });
    tabfac_det_serFNC.rows().every(function () {
        var data = this.data();
        totalSuma += data[6] * 1;
    });
    lblVVFNC.innerHTML = format(totalSuma.toFixed(2));
    let IGV = ((totalSuma * PorIGV / 100) * 1).toFixed(2);
    lblIGVFNC.innerHTML = format(IGV);
    lblTotalFNC.innerHTML = format((totalSuma + (IGV * 1)).toFixed(2));
    let total = totalSuma + (IGV * 1);
    let Base = total;
//    let DetPor = "0.00"
//    let DetSol = "0.00";
//    let DetDol = "0.00";
//    if (cboMonedaF.value == "USD") {
//        Base = (total * (txtTipCamF.value * 1)).toFixed(2);
//    }
//    if (cboServicioF.value == "FA02" || cboServicioF.value == "FA04") {
//        if (Base > 700) {
//            DetPor = "12.00"
//            if (cboMonedaF.value == "PEN") {
//                DetSol = (total * 0.12).toFixed(0);
//            } else {
//                DetDol = (total * 0.12).toFixed(2);
//                DetSol = (DetDol * (txtTipCamF.value * 1)).toFixed(0);
//            }
//        }
//    }
//    txtDetPorF.value = DetPor;
//    txtDetSolF.value = DetSol;
//    txtDetDolF.value = DetDol;
};

function obtenerDatosGrabarF() {
    var data = txtTipDocF.value + '|';
    data += cboServicioF.value + txtNumDocF.value + '|';
    data += cboMonedaF.value + '|';
    data += cboForPagF.value + '|';
    data += dtpFechaF.value + '|';
    data += cboCliProF.value + '|';
    data += txtCodSerF.value * 1 + '|';
    data += txtNroTarF.value * 1 + '|';
    data += txtCorreoF.value + '|';
    data += txtId_CotizacionF.value * 1 + '|';
    data += dtpFecIni_PerF.value + '|';
    data += txtDias_PerF.value + '|';
    data += txtTipCamF.value * 1 + '|';
    data += txtDiasF.value + '|';
    data += txtBultosF.value.replace(/,/g, '') * 1 + '|';
    data += txtMontoF.value.replace(/,/g, '') * 1 + '|';
    data += txtObsF.value + '|';
    data += lblVVF.innerHTML.replace(/,/g, '') * 1 + '|';
    data += txtPorIGVF.value * 1 + '|';
    data += lblIGVF.innerHTML.replace(/,/g, '') * 1 + '|';
    data += lblTotalF.innerHTML.replace(/,/g, '') * 1 + '|';
    data += txtDetPorF.value * 1 + '|';
    data += txtDetSolF.value * 1 + '|';
    data += txtDetDolF.value * 1 + '¯';

    var reg = [];
    var i = 0;
    tabfac_detF.rows().every(function () {
        reg = this.data();
        data += (++i + '|' + reg[1] + '|' + reg[2] + '|' + (reg[3] * 1) + '|' + (reg[4] * 1) + '|' + (reg[5] * 1) + '|' + (reg[6] * 1) + '|' + (reg[7] * 1) + '|' + (reg[8] * 1) + '¬');
    });
    if (reg.length > 0) data = data.slice(0, -1);
    data += '¯';
    reg = [];
    i = 0;
    tabfac_det_serF.rows().every(function () {
        reg = this.data();
        data += (++i + '|' + reg[2] + '|' + reg[3] + '|' + (reg[4] * 1) + '|' + (reg[5] * 1) + '|' + (reg[6] * 1) + '¬');
    });
    if (reg.length > 0) data = data.slice(0, -1);
    return data;
}
function obtenerDatosGrabarB() {
    var data = txtTipDocB.value + '|';
    data += cboServicioB.value + txtNumDocB.value + '|';
    data += cboMonedaB.value + '|';
    data += cboForPagB.value + '|';
    data += txtTipCamB.value * 1 + '|';
    data += cboCliProB.value + '|';
    data += dtpFechaB.value + '|';
    data += txtDiasB.value + '|';
    data += txtCorreoB.value + '|';
    data += (chkGratuita.checked ? 1 : 0) + '|';
    data += txtObsB.value + '|';
    data += lblVVB.innerHTML.replace(/,/g, '') * 1 + '|';
    data += txtPorIGVB.value * 1 + '|';
    data += lblIGVB.innerHTML.replace(/,/g, '') * 1 + '|';
    data += lblTotalB.innerHTML.replace(/,/g, '') * 1 + '¯';
    reg = [];
    i = 0;
    tabfac_det_serB.rows().every(function () {
        reg = this.data();
        data += (++i + '|' + reg[2] + '|' + reg[3] + '|' + (reg[4] * 1) + '|' + (reg[5] * 1) + '|' + (reg[6] * 1) + '¬');
    });
    if (reg.length > 0) data = data.slice(0, -1);
    return data;
}
function obtenerDatosGrabarFNC() {
    var data = txtTipDocNC.value + '|';
    data += cboServicioNC.value + txtNumDocNC.value + '|';
    data += cboMonedaNC.value + '|';
    data += dtpFechaNC.value + '|';
    data += cboCliProNC.value + '|';
    data += txtCorreoNC.value + '|';
    data += txtTipCamNC.value * 1 + '|';
    data += txtDocRef.value * 1 + '|';
    data += txtNumRef.value + '|';
    data += txtFecRef.value + '|';
    data += cboTabMotNC.value + '|';
    data += txtObsFNC.value + '|';
    data += lblVVFNC.innerHTML.replace(/,/g, '') * 1 + '|';
    data += txtPorIGVFNC.value * 1 + '|';
    data += lblIGVFNC.innerHTML.replace(/,/g, '') * 1 + '|';
    data += lblTotalFNC.innerHTML.replace(/,/g, '') * 1 + '¯';
    var reg = [];
    var i = 0;
    tabfac_detFNC.rows().every(function () {
        reg = this.data();
        data += (++i + '|' + reg[1] + '|' + reg[2] + '|' + (reg[3] * 1) + '|' + (reg[4] * 1) + '|' + (reg[5] * 1) + '|' + (reg[6] * 1) + '|' + (reg[7] * 1) + '|' + (reg[8] * 1) + '¬');
    });
    if (reg.length > 0) data = data.slice(0, -1);
    data += '¯';
    reg = [];
    i = 0;
    tabfac_det_serFNC.rows().every(function () {
        reg = this.data();
        data += (++i + '|' + reg[2] + '|' + reg[3] + '|' + (reg[4] * 1) + '|' + (reg[5] * 1) + '|' + (reg[6] * 1) + '¬');
    });
    if (reg.length > 0) data = data.slice(0, -1);
    return data;
}
function mostrarGrabarF(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 'adi') {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8], lista[9], lista[10], lista[11], lista[12], lista[13], lista[14]];
            tabla.row.add(fila).draw();
            mensaje = "Documento adicionado ";
        }
        if (opc_sel == 'edt') {
            lista = rpta.split("|");
            celdas[5] = lista[5];
            celdas[6] = lista[6];
            celdas[7] = lista[7];
            celdas[8] = lista[8];
            celdas[9] = lista[9];
            tabla.row(objfila).data(celdas).draw();
            mensaje =  "Documento actualizado";
        }
        if (opc_sel == 'anu') {
            lista = rpta.split("|");
            celdas[7] = lista[7];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Documento anulado";
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
        document.getElementById("listaF-edt").hidden = true;
        document.getElementById("lista-lst").hidden = false;
        tabla.columns.adjust().draw();
    }
    else {
        mensaje = rpta; // "Ocurrió un error al grabar";
    }
}
function mostrarGrabarB(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 'adi') {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8], lista[9], lista[10], lista[11], lista[12], lista[13], lista[14]];
            tabla.row.add(fila).draw();
            mensaje = "Documento adicionado ";
        }
        if (opc_sel == 'edt') {
            lista = rpta.split("|");
            celdas[5] = lista[5];
            celdas[6] = lista[6];
            celdas[7] = lista[7];
            celdas[8] = lista[8];
            celdas[9] = lista[9];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Documento actualizado";
        }
        if (opc_sel == 'anu') {
            lista = rpta.split("|");
            celdas[7] = lista[7];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Documento anulado";
        }
        Swal.fire({
            icon: 'success',
            title: mensaje,
            text: lista[4],
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false
        });
        document.getElementById("listaB-edt").hidden = true;
        document.getElementById("lista-lst").hidden = false;
        tabla.columns.adjust().draw();
    }
    else {
        mensaje = rpta; // "Ocurrió un error al grabar";
    }
}
function mostrarEnviar(rpta) {
    ocultarBloqueo('#lista-lst');
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        celdas[11] = rpta;
        tabla.row(objfila).data(celdas).draw();
        mensaje = "Documento enviado";
        Swal.fire({
            icon: 'success',
            title: mensaje,
            text: lista[4],
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false
        });
    }
    else {
        mensaje = rpta; // "Ocurrió un error al grabar";
    }
}
function mostrarGrabarFNC(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 'adi') {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8], lista[9], lista[10], lista[11], lista[12], lista[13], lista[14]];
            tabla.row.add(fila).draw();
            mensaje = "Documento adicionado ";
        }
        if (opc_sel == 'edt') {
            lista = rpta.split("|");
            celdas[5] = lista[5];
            celdas[6] = lista[6];
            celdas[7] = lista[7];
            celdas[8] = lista[8];
            celdas[9] = lista[9];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Documento actualizado";
        }
        if (opc_sel == 'anu') {
            lista = rpta.split("|");
            celdas[7] = lista[7];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Documento anulado";
        }
        Swal.fire({
            icon: 'success',
            title: mensaje,
            text: lista[4],
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false
        });
        document.getElementById("listaNC-edt").hidden = true;
        document.getElementById("lista-lst").hidden = false;
        tabla.columns.adjust().draw();
    }
    else {
        mensaje = rpta; // "Ocurrió un error al grabar";
    }
}
