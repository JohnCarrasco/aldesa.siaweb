var listas = [];
var lista = [];
var matriz = [];
var matrizF = [];
var matrizP = [];
var matrizE = [];
var matrizD = [];
var matrizC = [];
var matrizCat = [];
var matrizH = [];
var matrizU = [];
var operacion = 0;
var operacionF = 0;
var operacionP = 0;
var operacionE = 0;
var operacionD = 0;
var operacionC = 0;
var operacionCat = 0;
var segmento = 0;
var XCodMotCese = 0;
var table = '';
var tablaF = '';
var tablaP = '';
var tablaE = '';
var tablaD = '';
var tablaC = '';
var tablaCat = '';
var tablaH = '';
var tablaU = '';
var opc_sel = 0;

var tablaRechazo1 = [];
var tablaRechazo2 = [];
var accesosArray = [];
var accesosTabs = [];

// Tabla de Colaboradores
var tabla = $('#tabla').DataTable({
    data: matriz,
    scrollY: '38vh',
    scrollX: true,
    paging: true,
    scrollCollapse: true,
    language: idioma_espanol,
    searching: true,
    columnDefs: [
        {
            targets: 0,
            responsivePriority: -1,
            searchable: false,
            orderable: false,
            width: '130px',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill empresa-con" data-bs-placement="top" title="Consultar colaborador"><i class="ri-eye-line ri-20px"          style="color:blue"  data-opc="2"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill empresa-edt" data-bs-placement="top" title="Editar eolaborador"   ><i class="ri-pencil-line ri-20px"       style="color:green" data-opc="3"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill empresa-del" data-bs-placement="top" title="Eliminar colaborador" ><i class="ri-delete-bin-7-line ri-20px" style="color:red"   data-opc="4"></i></a>' +
                    '</div>'
                );
            }
        },
        { "width": "40px", "targets": [1], className: "text-end" },
        { "width": "40px", "targets": [2, 3] },
        { "width": "250px", "targets": [5] },
        { "width": "250px", "targets": [6] },
        { "width": "160px", "targets": [7] },
        { "width": "70px", "targets": [8, 9, 10, 11] },
        { "width": "600px", "targets": [12] },
        { "width": "1px", "targets": [13, 14], visible: false },
        { "width": "60px", "targets": [15] },
        { "width": "100px", "targets": [16] },
        { "width": "120px", "targets": [17] },
        { "width": "100px", "targets": [18] },
        { "width": "120px", "targets": [19] }
    ],

    dom: 'Bfrtip',
    buttons: [
        {
            text: '<i class="fas fa-file-excel"></i> Nuevo colaborador',
            titleAttr: 'Nuevo colaborador',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_sel = 1;
            //    ControlesLimpiar();
            //    txtRUC.disabled = false;
            //    lblid_empresa.innerHTML = '0';
            //    EmpresaAdiMod.show();
            }
        }
    ]
});
function iniciar() {

    var select2 = $('.select2');
    // For all Select2
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

    $('#colaborador-lst').block({
        message: '<div class="d-flex justify-content-center"><p class="mb-0">Por favor espere...</p> <div class="sk-wave m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
        css: {
            backgroundColor: 'transparent',
            border: '0'
        },
        overlayCSS: {
            opacity: 0.5
        }
    });
    get("/ModRecursosHumanos/ObtenerEstablecimientosCSV", mostrarEstablecimientos);
    txtUbiGeo.addEventListener('click', function (event) {
        TipBus = 3;
        txtBuscar.placeholder = 'Buscar ubigeo...';
        lblMsgBuscar.innerHTML = 'Busca un ubigeo por region, provincia o distrito';
        lblBuscadoCod.innerHTML = 'lblUbiGeoO';
        lblBuscadoDes.innerHTML = 'txtUbiGeoO';
        handleClick();
    });
    function handleClick() {
        contenedorTarjetas.style.display = 'none';
        contenedorImagen1.style.display = 'inline';
        contenedorImagen2.style.display = 'none';
        txtBuscar.value = '';
        contenedorTarjetas.innerHTML = '';
        var Buscador = new bootstrap.Modal(document.getElementById('Buscador'));
        Buscador.show();
        $('#Buscador').on('shown.bs.modal', function () {
            txtBuscar.focus();
        });
    }


    //get("/ModRecursosHumanos/ValidarAccesos/?Data=1", ValidarAccesosSGI);
    //get("/ModRecursosHumanos/ValidarTabs/?Data=1", ValidarTabsSGI);

    //function ValidarAccesosSGI(rpta) {
    //    var jsonAccesos = JSON.parse(rpta);
    //    var accesosString = jsonAccesos[0].ACCESOS;
    //    if (accesosString && accesosString.length > 0) {
    //        accesosArray = accesosString.split(',').map(Number);
    //    } else {
    //        accesosArray = [];
    //    }
    //}
    //function ValidarTabsSGI(rpta) {
    //    var jsonAccesos = JSON.parse(rpta);
    //    var accesosString = jsonAccesos[0].TABS;
    //    if (accesosString && accesosString.length > 0) {
    //        accesosTabs = accesosString.split(',');
    //    } else {
    //        accesosTabs = [];
    //    }
    //}
    //mostrarMatriz();
    //if (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16) {
    //    apagaControles();
    //}

    //$("select").select2({
    //    theme: "classic"
    //});

    //$('#trabajadorF-edt').draggable();
    //$('#trabajadorP-edt').draggable();
    //$('#trabajadorPR-edt').draggable();
    //$('#trabajadorPC-edt').draggable();
    //$('#trabajadorE-edt').draggable();
    //$('#trabajadorD-edt').draggable();
    //$('#trabajadorC-edt').draggable();
    //$('#trabajadorCat-edt').draggable();

    cboEstablecimientos.onchange = function () {
        $('#colaborador-lst').block({
            message: '<div class="d-flex justify-content-center"><p class="mb-0">Por favor espere...</p> <div class="sk-wave m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
            css: {
                backgroundColor: 'transparent',
                border: '0'
            },
            overlayCSS: {
                opacity: 0.5
            }
        });
        var idCboEstablecimiento = [...$("#cboEstablecimientos :selected")].map(e => e.value);
        var idCboTabMot = [...$("#cboTabMot :selected")].map(e => e.value);
        var idCboTabCat = [...$("#cboTabCat :selected")].map(e => e.value);
        get("/ModRecursosHumanos/ObtenerTrabajadoresCSV/?Data=" + idCboEstablecimiento + '|' + idCboTabMot + '|' + idCboTabCat, mostrarTrabajadores);
    }
    cboTabMot.onchange = function () {
        $('#colaborador-lst').block({
            message: '<div class="d-flex justify-content-center"><p class="mb-0">Por favor espere...</p> <div class="sk-wave m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
            css: {
                backgroundColor: 'transparent',
                border: '0'
            },
            overlayCSS: {
                opacity: 0.5
            }
        });
        var idCboEstablecimiento = [...$("#cboEstablecimientos :selected")].map(e => e.value);
        var idCboTabMot = [...$("#cboTabMot :selected")].map(e => e.value);
        var idCboTabCat = [...$("#cboTabCat :selected")].map(e => e.value);
        get("/ModRecursosHumanos/ObtenerTrabajadoresCSV/?Data=" + idCboEstablecimiento + '|' + idCboTabMot + '|' + idCboTabCat, mostrarTrabajadores);
    }
    cboTabCat.onchange = function () {
        $('#colaborador-lst').block({
            message: '<div class="d-flex justify-content-center"><p class="mb-0">Por favor espere...</p> <div class="sk-wave m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
            css: {
                backgroundColor: 'transparent',
                border: '0'
            },
            overlayCSS: {
                opacity: 0.5
            }
        });
        var idCboEstablecimiento = [...$("#cboEstablecimientos :selected")].map(e => e.value);
        var idCboTabMot = [...$("#cboTabMot :selected")].map(e => e.value);
        var idCboTabCat = [...$("#cboTabCat :selected")].map(e => e.value);
        get("/ModRecursosHumanos/ObtenerTrabajadoresCSV/?Data=" + idCboEstablecimiento + '|' + idCboTabMot + '|' + idCboTabCat, mostrarTrabajadores);
    }

    //document.getElementById("cboTabOcu").onchange = function () {
    //    var idCboTabOcu = document.getElementById("cboTabOcu").value;
    //    get("/ModRecursosHumanos/OcupacionDimensionadoCSV/?Data=" + idCboTabOcu, mostrarDimensionado);
    //    if (cboTabOcu.value == '37500612') {
    //        chkCatTraST.disabled = false;
    //        dtpFecTie.disabled = false;
    //    } else {
    //        chkCatTraST.disabled = true;
    //        dtpFecTie.disabled = true;
    //    }
    //}
    //document.getElementById("cboTabOcuC_Des").onchange = function () {
    //    var idCboTabOcuC_Des = document.getElementById("cboTabOcuC_Des").value;
    //    get("/ModRecursosHumanos/OcupacionDimensionadoCSV/?Data=" + idCboTabOcuC_Des, mostrarDimensionadoC_Des);
    //}
    //document.getElementById("cboTabCambio").onchange = function () {
    //    eliminar_marcasC();
    //    var idCboCambio = document.getElementById("cboTabCambio").value * 1;
    //    if (idCboCambio == -1) {
    //        document.getElementById("Fila01").style.display = 'none';
    //        document.getElementById("Fila02").style.display = 'none';
    //        document.getElementById("Fila03").style.display = 'none';
    //        document.getElementById("Fila04").style.display = 'none';
    //        document.getElementById("Fila05").style.display = 'none';
    //        document.getElementById("cboStatus").disabled = false;
    //    }
    //    if (idCboCambio == 1) {
    //        $('#cboTabCatC_Ori').val(document.getElementById("cboTabCat1").value).trigger('change.select2');
    //        document.getElementById("Fila01").style.display = 'inline';
    //        document.getElementById("Fila02").style.display = 'none';
    //        document.getElementById("Fila03").style.display = 'none';
    //        document.getElementById("Fila04").style.display = 'none';
    //        document.getElementById("cboStatus").disabled = false;
    //    }
    //    if (idCboCambio == 2) {
    //        $('#cboTabEstC_Ori').val(document.getElementById("cboTabEst").value).trigger('change.select2');
    //        document.getElementById("Fila01").style.display = 'none';
    //        document.getElementById("Fila02").style.display = 'inline';
    //        document.getElementById("Fila03").style.display = 'none';
    //        document.getElementById("Fila04").style.display = 'none';
    //        document.getElementById("cboStatus").disabled = false;
    //    }
    //    if (idCboCambio == 3) {
    //        $('#cboTabOcuC_Ori').val(document.getElementById("cboTabOcu").value).trigger('change.select2');
    //        document.getElementById("lblGerencia_Ori").value = document.getElementById("lblGerencia").value;
    //        document.getElementById("lblAreaC_Ori").value = document.getElementById("lblArea").value;
    //        document.getElementById("lblSubAreaC_Ori").value = document.getElementById("lblSubArea").value;
    //        document.getElementById("cboModalidad_Ori").value = document.getElementById("cboModalidad").value;
    //        $('#cboModalidad_Ori').val(document.getElementById("cboModalidad").value).trigger('change.select2');
    //        $('#cboSegmento_Ori').val(document.getElementById("cboSegmento").value).trigger('change.select2');
    //        document.getElementById("cboStatus").disabled = false;
    //        document.getElementById("Fila01").style.display = 'none';
    //        document.getElementById("Fila02").style.display = 'none';
    //        document.getElementById("Fila03").style.display = 'inline';
    //        document.getElementById("Fila04").style.display = 'none';
    //        var msg = 'Error:'
    //        if (cboTabOcuC_Ori.value == '') msg += ' la ocupación origen no existe en el dimensionado. Revise !!!<br/>';
    //        if (cboTabOcuC_Des.value == '') msg += ' la ocupación destino no existe en el dimensionado. Revise !!!';
    //        if (cboTabOcuC_Ori.value == '' || cboTabOcuC_Des.value == '') {
    //            Swal.fire({
    //                position: 'center',
    //                icon: 'error',
    //                title: msg,
    //                showConfirmButton: true,
    //            })
    //            btnGrabarC.disabled = true;
    //        }
    //    }
    //    if (idCboCambio == 4) {
    //        celdas = table.row('.selected').data();
    //        $('#cboTabSitC_Ori').val(celdas[13]).trigger('change.select2');
    //        $('#cboTabSitC_Des').val('-1').trigger('change.select2');
    //        $('#cboTabSubMotC_Des').val('-1').trigger('change.select2');
    //        $('#cboStatus').val('1').trigger('change.select2');
    //        lblFecIniC.style.display = 'none';
    //        lblFecFinC.innerHTML = 'Fecha de Cese :';
    //        cboStatus.disabled = true;

    //        document.getElementById("Fila01").style.display = 'none';
    //        document.getElementById("Fila02").style.display = 'none';
    //        document.getElementById("Fila03").style.display = 'none';
    //        document.getElementById("Fila04").style.display = 'inline';
    //    } else {
    //        lblFecIniC.style.display = 'inline';
    //        lblFecFinC.innerHTML = 'Fecha de Fin :';
    //    }
    //    if (idCboCambio > 0) {
    //        get("/ModRecursosHumanos/ObtenerTrabajadoresCCVerificarCSV/?Data=" + celdas[0] + '|' + idCboCambio, verificarCC);
    //        function verificarCC(rpta) {

    //            if (rpta * 1 == 1 && operacionC == 1) {
    //                var msg = 'Error: Tipo de Cambio ya tiene un registro en proceso ...'
    //                Swal.fire({
    //                    position: 'center',
    //                    icon: 'error',
    //                    title: msg,
    //                    showConfirmButton: true,
    //                })
    //                btnGrabarC.disabled = true;
    //            }
    //        }
    //    }
    //}
    //cboTabSitC_Des.onchange = function () {

    //    get("/ModRecursosHumanos/ObtenerTabSubMotCSV/?Data=" + cboTabSitC_Des.value, cargarTabSubMotC_Des);
    //    function cargarTabSubMotC_Des(rpta) {
    //        lista = rpta.split("¬");
    //        crearCombo(lista, "cboTabSubMotC_Des", "** SELECCIONE SUB-MOTIVO SITUACION LABORAL **");
    //    }

    //    if (cboTabSitC_Des.value == 1 || cboTabSitC_Des.value == 8) {
    //        Fila05.style.display = 'inline';
    //        if (cboTabSitC_Des.value == 1) $('#cboTabDocC').val("102").trigger('change.select2');
    //        if (cboTabSitC_Des.value == 8) $('#cboTabDocC').val("100").trigger('change.select2');
    //    } else {
    //        Fila05.style.display = 'none';
    //        $('#cboTabDocC').val("-1").trigger('change.select2');
    //    }
    //}

    //document.getElementById("cboTabCat1").onchange = function () {
    //    mostrarMatrizP();
    //}
    //document.getElementById("cboTabCat_A").onchange = function () {
    //    if (document.getElementById("cboTabCat_A").value * 1 == -1) {
    //        document.getElementById("btnAprobado").disabled = true;
    //        document.getElementById("btnTemporal").disabled = false;
    //        document.getElementById("btnDefinitivo").disabled = false;
    //    } else {
    //        document.getElementById("btnAprobado").disabled = false;
    //        document.getElementById("btnTemporal").disabled = true;
    //        document.getElementById("btnDefinitivo").disabled = true;
    //    }
    //    var rol = document.getElementById("txtRol").value * 1;
    //    if (rol == 16 || rol == 17) {
    //        document.getElementById("btnTemporal").disabled = true;
    //    }
    //}
    //document.getElementById("cboNivelE").onchange = function () {
    //    (document.getElementById("txtCarrerasE").disabled = document.getElementById("cboNivelE").value <= 7) ? true : false;
    //}
    //document.getElementById("buttonXLS").onclick = function () {
    //    var idRpt = document.getElementById("cboReportes").value;
    //    var idCboEstablecimiento = [...$("#cboEstablecimientos :selected")].map(e => e.value);
    //    var idCboTabMot = [...$("#cboTabMot :selected")].map(e => e.value);
    //    var idCboTabCat = [...$("#cboTabCat :selected")].map(e => e.value);
    //    if (idRpt == 1) {
    //        navegar("/ModReportes/ObtenerTrabajadoresXLS/?data=" + idCboEstablecimiento + "|" + idCboTabMot + "|" + idCboTabCat);
    //    }
    //    if (idRpt == 2) {
    //        navegar("/ModReportes/ObtenerTrabajadoresUsuariosXLS/?data=" + idCboEstablecimiento + "|" + idCboTabMot + "|" + idCboTabCat);
    //    }
    //    if (idRpt == 3) {
    //        navegar("/ModReportes/ObtenerTrabajadoresGestionXLS/?data=" + idCboEstablecimiento + "|" + idCboTabMot + "|" + idCboTabCat);
    //    }
    //    if (idRpt == 4) {
    //        navegar("/ModReportes/ObtenerTrabajadoresEstudiosXLS/?data=" + idCboEstablecimiento + "|" + idCboTabMot + "|" + idCboTabCat);
    //    }
    //}

    $('#tabla tbody').on('click', 'tr', function (e) {
        opc_sel = e.target.dataset.opc;
        if (!(opc_sel === undefined)) {
            if (opc_sel == 2 || opc_sel == 3) {

                document.getElementById("colaborador-lst").style.display = 'none';
                document.getElementById("colaborador-edt").style.display = 'inline';



                //                objfila = $(this);
//                txtRUC.disabled = true;
//                get("/ModConfiguraciones/ManteEmpresasCSV/?Data=" + opc_sel + "|" + tabla.row(objfila).data()[1], ControlesEdt);

                //$('#usuario-edt1').addClass('md-show');
                //$('#modal-4').addClass('md-show');
                //modal.className = 'md-modal md-effect-4 md-show';
                //console.log(modal.className);



                //    nrofila = $(this);
                //    if (tabla.row(nrofila).data()[9] == "&lt;ACTIVADO&gt;") {
                //        limpiar_popup();
                //        eliminar_marcas();
                //        get("/ModUtilitarios/ObtenerUsuarioGetCSV/?codusr=" + tabla.row(nrofila).data()[1], editarPopup);
                //        $("#usuario-edt").modal();
                //    }
                //    else alert('Usuario ' + tabla.row(nrofila).data()[1] + ' se encuentra desactivado ...')
            }
            if (opc_sel == 3) {
                $("#clave-edt").modal();
            }

            if (opc_sel == 4) {
                $('#usuario-edt').modal();
            }
        }
    });





    //$('#tabla tbody').on('dblclick', 'tr', function () {
    //    operacion = 2;
    //    $(this).addClass('selected');
    //    celdas = table.row('.selected').data();
    //    if (celdas == undefined) {
    //        alert('No ha Seleccionado ningún registro !!!');
    //    }
    //    else {
    //        var rol = document.getElementById("txtRol").value * 1;
    //        if (accesosArray.includes(rol)) {
    //            console.log("Perfil autorizado");
    //            eliminar_marcas();
    //            limpiar_popup();
    //            get("/ModRecursosHumanos/ObtenerTrabajadoresGetCSV/?codigo=" + celdas[0], editarPopup);
    //        } else {
    //            console.log("no autorizado");
    //            if (((rol == 14 || rol == 18 || rol == 31) && celdas[1] == 'POST') || (rol == 18 && celdas[1] == 'CIEPRA') || ((rol == 14 || rol == 31) && celdas[1] == 'PVAL') || ((rol == 8) && celdas[1] == 'EVAMA') || ((rol == 33) && (celdas[1] == 'ICAP' || celdas[1] == 'SCAR' || celdas[1] == 'CARCRE'))) {
    //                eliminar_marcas();
    //                limpiar_popup();
    //                get("/ModRecursosHumanos/ObtenerTrabajadoresGetCSV/?codigo=" + celdas[0], editarPopup);
    //            } else {
    //                Notificacion("Ud. no está autorizado a ver esta opción", "error");
    //            }
    //        }
    //    }
    //});
    //function ValidarPermisos(pRolx) {
    //    switch (pRolx) {
    //        case 37:
    //            break;
    //    }
    //}
    //$('#tabla tbody').on('click', 'tr', function () {
    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //    }
    //    else {
    //        table.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //})
    //$('#tablaF tbody').on('click', 'tr', function () {
    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //    }
    //    else {
    //        tablaF.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //})
    //$('#tablaP tbody').on('click', 'tr', function () {
    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //    }
    //    else {
    //        tablaP.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //})
    //$('#tablaE tbody').on('click', 'tr', function () {
    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //    }
    //    else {
    //        tablaE.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //})
    //$('#tablaD tbody').on('click', 'tr', function () {
    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //    }
    //    else {
    //        tablaD.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //})
    //$('#tablaC tbody').on('click', 'tr', function () {
    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //    }
    //    else {
    //        tablaC.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //})
    //$('#tablaCat tbody').on('click', 'tr', function () {
    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //    }
    //    else {
    //        tablaCat.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //})
    //$('#tablaH tbody').on('click', 'tr', function () {
    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //    }
    //    else {
    //        tablaH.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //})
    //$('#tablaU tbody').on('click', 'tr', function () {
    //    if ($(this).hasClass('selected')) {
    //        $(this).removeClass('selected');
    //        document.getElementById('txtTipoUsuarioU').value = '';
    //        document.getElementById('txtUsuarioU').value = '';
    //        document.getElementById('txtFecSolU').value = '';
    //        document.getElementById('txtFecAteU').value = '';
    //        document.getElementById('txtFecBajU').value = '';
    //        ApagarU();
    //    }
    //    else {
    //        tablaU.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //        CargarU();
    //        ApagarU();
    //    }
    //})
    //chkCatTraST.onclick = function () {
    //    if (chkCatTraST.checked) dtpFecTie.disabled = false;
    //    else {
    //        dtpFecTie.disabled = true;
    //        dtpFecTie.value = '';
    //    }
    //}
    //document.getElementById("chkMarcaE").onclick = function () {
    //    if (document.getElementById("chkMarcaE").checked) {
    //        document.getElementById("cboMesFin").disabled = true;
    //        document.getElementById("cboAnoFin").disabled = true;
    //        $('#cboAnoFin').val(-1).trigger('change.select2');
    //        $('#cboMesFin').val(-1).trigger('change.select2');
    //    } else {
    //        document.getElementById("cboMesFin").disabled = false;
    //        document.getElementById("cboAnoFin").disabled = false;
    //    }
    //}
    //document.getElementById("chkMarcaE").onclick = function () {
    //    if (document.getElementById("chkMarcaE").checked) {
    //        document.getElementById("cboMesFin").disabled = true;
    //        document.getElementById("cboAnoFin").disabled = true;
    //        $('#cboAnoFin').val(-1).trigger('change.select2');
    //        $('#cboMesFin').val(-1).trigger('change.select2');
    //    } else {
    //        document.getElementById("cboMesFin").disabled = false;
    //        document.getElementById("cboAnoFin").disabled = false;
    //    }
    //}
    //document.getElementById("btnCerrar").onclick = function () {
    //    document.getElementById("trabajador-lst").style.display = 'inline';
    //    document.getElementById("trabajador-edt").style.display = 'none';
    //    $('#tabs a:first').tab('show');
    //    if (operacion == 1) mostrarMatriz();
    //}
    //document.getElementById("btnGrabar").onclick = function () {
    //    if (document.getElementById("cboTabCat1") * 1 == -1) alert('Debe seleccionar una categoría !!!');
    //    else {
    //        if (validacion_form() == 0) {
    //            celdas = table.row('.selected').data();
    //            if (celdas != undefined) {
    //                if (table.row('.selected').data()[1] == '5TA') {
    //                    if (chkCatTraST.checked && dtpFecTie.value == '') {
    //                        alertify.alert('Trabajador', 'Si Selecciona que esta en tienda. Debe ingresar desde que fecha esta !!!', function () {
    //                            alertify.message('Ok');
    //                        });
    //                    } else {
    //                        var data = obtenerDatosGrabar();
    //                        post("/ModRecursosHumanos/ObtenerTrabajadoresGrbCSV", mostrarGrabar, data);
    //                    }
    //                } else {
    //                    var data = obtenerDatosGrabar();
    //                    post("/ModRecursosHumanos/ObtenerTrabajadoresGrbCSV", mostrarGrabar, data);
    //                }
    //            } else {
    //                var data = obtenerDatosGrabar();
    //                post("/ModRecursosHumanos/ObtenerTrabajadoresGrbCSV", mostrarGrabar, data);
    //            }
    //        }
    //    }
    //}
    //btnMostrarMaps.onclick = function () {
    //    if (txtMaps.value == '') {
    //        Swal.fire({
    //            position: 'center',
    //            icon: 'error',
    //            title: 'ingrese coordenadas validas...',
    //            showConfirmButton: true,
    //        })
    //    } else window.open(txtMaps.value, '_blank');
    //}
    //cboTabMotPC.onchange = function () {
    //    get("/ModRecursosHumanos/ObtenerTabSubMotCSV/?Data=" + cboTabMotPC.value, cargarTabSubMotPC);
    //    function cargarTabSubMotPC(rpta) {
    //        lista = rpta.split("¬");
    //        crearCombo(lista, "cboTabSubMotPC", "** SELECCIONE SUB-MOTIVO SITUACION LABORAL **");
    //        $('#cboTabSubMotPC').val(xSubMotPC).trigger('change.select2');
    //    }
    //}
    //document.getElementById("btnGrabarF").onclick = function () {
    //    if (validacion_formF() == 0) {
    //        var data = obtenerDatosGrabarF();
    //        post("/ModRecursosHumanos/ObtenerTrabajadoresFamGrbCSV", mostrarGrabarF, data);
    //    }
    //}
    //document.getElementById("btnGrabarP").onclick = function () {
    //    if (validacion_formP() == 0) {
    //        if (document.getElementById("dtpFecFinP").value < document.getElementById("dtpFecIniP").value) {
    //            alertify.alert('Periodos', 'fecha de fin de contrato no puede ser menor que fecha de inicio de contrato ...', function () {
    //                alertify.message('Ok');
    //            });
    //        } else {
    //            var data = obtenerDatosGrabarP();
    //            post("/ModRecursosHumanos/ObtenerTrabajadoresPerGrbCSV", mostrarGrabarP, data);
    //        }
    //    }
    //}
    //document.getElementById("btnGrabarPR").onclick = function () {
    //    if (validacion_formPR() == 0) {
    //        if (document.getElementById("dtpFecFinPR").value < document.getElementById("dtpFecIniPR").value) {
    //            alertify.alert('Periodos', 'Fecha de fin de contrato no puede ser menor que la fecha de inicio ...', function () {
    //                alertify.message('Error');
    //            });
    //        } else {
    //            var data = obtenerDatosGrabarPR();
    //            post("/ModRecursosHumanos/ObtenerTrabajadoresPerRGrbCSV", mostrarGrabarPR, data);
    //        }
    //    }
    //}
    //document.getElementById("btnGrabarPC").onclick = function () {
    //    if (validacion_formPC() == 0) {
    //        if (document.getElementById("dtpFecCesPC").value < document.getElementById("dtpFecIniPC").value) {
    //            alertify.alert('Periodos', 'Fecha de cese de contrato no puede ser menor que la fecha de inicio ...', function () {
    //                alertify.message('Error');
    //            });
    //        } else {
    //            var data = obtenerDatosGrabarPC();
    //            post("/ModRecursosHumanos/ObtenerTrabajadoresPerCGrbCSV", mostrarGrabarPC, data);
    //        }
    //    }
    //}
    //document.getElementById("btnGrabarE").onclick = function () {
    //    var valida = true;
    //    if (document.getElementById("cboNivelE").value == -1) {
    //        alertify.error('Seleccione un nivel de educación !!!')
    //        valida = false;
    //    } else {
    //        if (document.getElementById("cboNivelE").value > 7 && document.getElementById("txtCodCarreraE").value * 1 == 0) {
    //            alertify.error('Debe escoger una carrera o especialidad !!!')
    //            valida = false;
    //        }
    //    }
    //    if (valida) {
    //        var data = obtenerDatosGrabarE();
    //        post("/ModRecursosHumanos/ObtenerTrabajadoresEstGrbCSV", mostrarGrabarE, data);
    //    }
    //}
    //document.getElementById("btnGrabarC").onclick = function () {
    //    if (validacion_formC() == 0) {
    //        var data = obtenerDatosGrabarC();
    //        var frm = new FormData();
    //        frm.append("Obs", data);
    //        if (cboTabCambio.value == 4) {
    //            if (cboTabSitC_Des.value == 1 || cboTabSitC_Des.value == 8) {
    //                var archivo = document.getElementById('fileAdjuntarC').files[0];
    //                var archivoSeleccionadaSize = Math.round(document.getElementById('fileAdjuntarC').files[0].size / 1024);
    //                if (archivoSeleccionadaSize > 4096) alert('Archivo Seleccionado es mas grande de lo permitido. Reduzca su tamaño !!!')
    //                else {
    //                    frm.append("File", archivo);
    //                }
    //            }
    //        }
    //        post("/ModRecursosHumanos/ObtenerTrabajadoresCCGrbCSV", mostrarGrabarC, frm);
    //        $("#trabajadorC-edt").modal('hide');
    //    }
    //}
    //document.getElementById("btnAprobado").onclick = function () {
    //    if (document.getElementById("dtpFecIniCat").value == '') alertify.alert('Cambio de Categoría', 'Ingrese Fecha de Inicio')
    //    else if (document.getElementById("dtpFecFinCat").value == '') alertify.alert('Cambio de Categoría', 'Ingrese Fecha de Fin')
    //    else {
    //        alertify.confirm('Confirmación', 'Confirma APROBADO ?',
    //            function () {
    //                var data = obtenerDatosGrabarCat();
    //                post("/ModRecursosHumanos/ObtenerTrabajadoresCatGrbCSV", mostrarGrabarCat, data + '|1|0|0');
    //            },
    //            function () { alertify.error('Cancela APROBADO') });
    //    }
    //}
    //document.getElementById("btnTemporal").onclick = function () {
    //    alertify.confirm('Confirmación', 'Confirma el RECHAZO TEMPORAL ?',
    //        function () {
    //            var data = obtenerDatosGrabarCat();
    //            post("/ModRecursosHumanos/ObtenerTrabajadoresCatGrbCSV", mostrarGrabarCat, data + '|2|0|0');
    //        },
    //        function () { alertify.error('Cancela el RECHAZO TEMPORAL') });
    //}
    //document.getElementById("btnDefinitivo").onclick = function () {
    //    if (document.getElementById("dtpFecIniCat").value == '') alertify.alert('Cambio de Categoría', 'Ingrese Fecha de Inicio')
    //    else if (document.getElementById("dtpFecFinCat").value == '') alertify.alert('Cambio de Categoría', 'Ingrese Fecha de Fin')
    //    else {
    //        $('#cboSegmentoR').val(-1).trigger('change.select2');
    //        $('#cboMotivosR').val(-1).trigger('change.select2');
    //        $("#Trabajadores_Rechazo").modal();
    //    }
    //}
    //cboSegmentoR.onchange = function () {
    //    if (cboSegmentoR.value * 1 == -1) {
    //        cboMotivosR.innerHTML = '<option value="-1" selected>*** SELECCIONE MOTIVO RECHAZO ***</option>';
    //    } else {
    //        if (cboSegmentoR.value * 1 == 1) {
    //            crearCombo(tablaRechazo1, "cboMotivosR", "** SELECCIONE MOTIVO **");
    //        } else {
    //            crearCombo(tablaRechazo2, "cboMotivosR", "** SELECCIONE MOTIVO **");
    //        }
    //    }
    //}
    //btnAceptarRechazo.onclick = function () {
    //    if (cboSegmentoR.value == -1)
    //        alertify.alert('Rechazo', 'Seleccione un segmento !!!');
    //    else {
    //        if (cboMotivosR.value == -1) {
    //            alertify.alert('Rechazo', 'Seleccione un motivo !!!');
    //        } else {
    //            var data = document.getElementById("txtID").value * 1 + '|';
    //            data += document.getElementById("cboTabCat_A").value * 1 + '|';
    //            data += document.getElementById("dtpFecIniCat").value + '|';
    //            data += document.getElementById("dtpFecFinCat").value + '|';
    //            data += document.getElementById("txtObsCatR").value;
    //            post("/ModRecursosHumanos/ObtenerTrabajadoresCatGrbCSV", mostrarGrabarCat, data + '|3|' + cboSegmentoR.value + '|' + cboMotivosR.value);
    //        }
    //    }
    //}

    //document.getElementById("btnGrabarHab").onclick = function () {
    //    var data = obtenerDatosGrabarHab();
    //    post("/ModRecursosHumanos/ObtenerTrabajadoresHabGrbCSV", mostrarGrabarHab, data);
    //}

    //document.getElementById("btnAdjuntarD").onclick = function () {
    //    document.getElementById('fileAdjuntarD').click();
    //}
    //document.getElementById("fileAdjuntarD").onchange = function () {
    //    var archivoSeleccionada = document.getElementById('fileAdjuntarD').files[0].name;
    //    var archivoSeleccionadaSize = Math.round(document.getElementById('fileAdjuntarD').files[0].size / 1024);
    //    if (archivoSeleccionadaSize > 4096) alert('Archivo Seleccionado es mas grande de lo permitido. Reduzca su tamaño !!!')
    //    else {
    //        var ext = archivoSeleccionada.split('.').pop();
    //        if (ext.toLowerCase() == 'pdf') document.getElementById('divAdjuntosD').innerHTML = archivoSeleccionada;
    //        else {
    //            document.getElementById('divAdjuntosD').innerHTML = 'No ha seleccionado ningún archivo';
    //            alertify.alert('Alerta : TRABAJADORES', 'Tipo de archivo no permitido. Solo puede ser PDF !!!');
    //        }
    //    }
    //}
    //document.getElementById("btnGrabarD").onclick = function () {
    //    if (document.getElementById("cboTabDocD").value * 1 == -1) {
    //        alertify.error('Debe seleccionar un motivo !!!');
    //    } else {
    //        if (document.getElementById("divAdjuntosD").innerHTML == "No ha seleccionado ningún archivo") {
    //            alertify.error('Debe seleccionar un archivo PDF para adjuntar ...');
    //        } else {
    //            var frm = new FormData();
    //            var archivo = document.getElementById('fileAdjuntarD').files[0];

    //            frm.append("Codigo", document.getElementById("txtID").value);
    //            frm.append("TipDoc", document.getElementById("cboTabDocD").value);
    //            frm.append("Obs", document.getElementById("txtObsD").value);
    //            frm.append("File", archivo);
    //            post("/ModRecursosHumanos/SubirDocumentoImg", mostrarGrabarD, frm)
    //            $("#trabajadorD-edt").modal('hide');
    //        }
    //    }
    //}
    //document.getElementById("btnAdjuntarC").onclick = function () {
    //    if (cboTabDocC.value == -1) alertify.alert('Alerta : CONTROL DE CAMBIOS', 'Selecciones un tipo de documento primero ...');
    //    else document.getElementById('fileAdjuntarC').click();
    //}
    //document.getElementById("fileAdjuntarC").onchange = function () {
    //    var archivo = document.getElementById("fileAdjuntarC").files[0].name;
    //    var ext = archivo.split('.').pop();
    //    if (ext.toLowerCase() == 'pdf') document.getElementById("divAdjuntoC").innerHTML = archivo;
    //    else {
    //        document.getElementById("divAdjuntoC").innerHTML = '';
    //        alertify.alert('Alerta : CONTROL DE CAMBIOS', 'Tipo de archivo no permitido. Solo puede ser PDF !!!');
    //    }
    //}

    //document.getElementById("btnCerrarDI").onclick = function () {
    //    document.getElementById("spnTitulo").innerHTML = 'Documento';
    //    document.getElementById("divAdjuntosDI").innerHTML = '';
    //}

    //document.getElementById("btnGrabarU").onclick = function () {
    //    if (document.getElementById("btnGrabarU").innerHTML == 'Editar') {
    //        var celdas = tablaU.row('.selected').data();
    //        if (celdas == undefined) {
    //            alertify.alert('Trabajadores - Usuarios', 'Primero debe seleccionar un registro !!!')
    //        } else {
    //            document.getElementById("btnGrabarU").innerHTML = 'Grabar';
    //            document.getElementById("txtUsuarioU").disabled = false;
    //            document.getElementById("txtFecSolU").disabled = false;
    //            document.getElementById("txtFecAteU").disabled = false;
    //            document.getElementById("txtFecBajU").disabled = false;
    //            document.getElementById("btnCancelarU").style.display = 'inline';
    //        }
    //    }
    //    else {
    //        var data = document.getElementById("txtID").value + '|';
    //        data += tablaU.row('.selected').data()[0] + '|';
    //        data += document.getElementById("txtUsuarioU").value + '|';
    //        data += document.getElementById("txtFecSolU").value + '|';
    //        data += document.getElementById("txtFecAteU").value + '|';
    //        data += document.getElementById("txtFecBajU").value;
    //        post("/ModRecursosHumanos/ObtenerTrabajadoresUsuariosGrbCSV", mostrarGrabarU, data);
    //        ApagarU();
    //    }

    //    document.getElementById("btnCancelarU").onclick = function () {
    //        CargarU();
    //        ApagarU();
    //    }
    //}
    //function CargarU() {
    //    celdas = tablaU.row('.selected').data();
    //    if (celdas != undefined) {
    //        document.getElementById('txtTipoUsuarioU').value = celdas[1];
    //        document.getElementById('txtUsuarioU').value = celdas[2];
    //        document.getElementById('txtFecSolU').value = (celdas[3] == '0000-00-00' ? '' : celdas[3]);
    //        document.getElementById('txtFecAteU').value = (celdas[4] == '0000-00-00' ? '' : celdas[3]);
    //        document.getElementById('txtFecBajU').value = (celdas[5] == '0000-00-00' ? '' : celdas[3]);
    //    }
    //}
    //function ApagarU() {
    //    document.getElementById("txtUsuarioU").disabled = true;
    //    document.getElementById("txtFecSolU").disabled = true;
    //    document.getElementById("txtFecAteU").disabled = true;
    //    document.getElementById("txtFecBajU").disabled = true;
    //    document.getElementById("btnGrabarU").innerHTML = 'Editar';
    //    document.getElementById("btnCancelarU").style.display = 'none';
    //}

    //function mostrarGrabarU(rpta) {
    //    var celdas = tablaU.row('.selected').data();
    //    celdas[2] = document.getElementById("txtUsuarioU").value;
    //    celdas[3] = document.getElementById("txtFecSolU").value;
    //    celdas[4] = document.getElementById("txtFecAteU").value;
    //    celdas[5] = document.getElementById("txtFecBajU").value;
    //    $('#tablaU').dataTable().fnUpdate(celdas, '.selected', undefined, false);
    //    alertify.alert('Trabajadores - Usuarios', 'Usuario se grabó OK !!!')
    //}

    //validarControles()


    function mostrarEstablecimientos(rpta) {
        if (rpta != "") {
            var listas = rpta.split("¯");
            lista = listas[0].split("¬");

            crearCombo(lista, "cboEstablecimientos", "<< TODOS >>");
            crearCombo(lista, "cboTabEst", "** SELECCIONE ESTABLECIMIENTO **");
    //        crearCombo(lista, "cboTabEstC_Ori", "** SELECCIONE ESTABLECIMIENTO **");
    //        crearCombo(lista, "cboTabEstC_Des", "** SELECCIONE ESTABLECIMIENTO **");

            lista = listas[1].split("¬");

            crearCombo(lista, "cboTabMot", "<< TODOS >>");
    //        crearCombo(lista, "cboTabSitC_Ori", "** SELECCIONE SITUACION TRABAJADOR **");

    //        crearCombo(lista, "cboTabMotP", "** SELECCIONE MOTIVO FIN CONTRATO **");
    //        lista.shift();
    //        crearCombo(lista, "cboTabMotPC", "** SELECCIONE MOTIVO FIN CONTRATO **");

            lista = listas[2].split("¬");
            crearCombo(lista, "cboTabCat", "<< TODOS >>");
            crearCombo(lista, "cboTabCat1", "<< ELEGIR CATEGORIA >>");
    //        crearCombo(lista, "cboTabCatC_Ori", "<< ELEGIR CATEGORIA >>");
    //        crearCombo(lista, "cboTabCatC_Des", "<< ELEGIR CATEGORIA >>");
    //        crearCombo(lista, "cboTabCat2", "<< ELEGIR CATEGORIA >>");

            lista = listas[3].split("¬");
            crearCombo(lista, "cboTipDocPer", "** SELECCIONE TIPO DE DOCUMENTO **");
    //        crearCombo(lista, "cboTipDocPerF", "** SELECCIONE TIPO DE DOCUMENTO DE IDENTIDAD **");

    //        lista = listas[4].split("¬");
    //        crearCombo(lista, "cboUbiGeoD", "** SELECCIONE UBIGEO DIRECCION **");
    //        crearCombo(lista, "cboUbiGeoN", "** SELECCIONE UBIGEO NACIMIENTO **");

            lista = listas[5].split("¬");
            crearCombo(lista, "cboTabOcu", "** SELECCIONE OCUPACION **");

    //        lista = listas[6].split("¬");
    //        crearCombo(lista, "cboNivelE", "** SELECCIONE NIVEL EDUCATIVO **");

    //        lista = listas[7].split("¬");
    //        var listaJSON = crear_json(lista);
    //        $("#txtCarrerasE").autocomplete({
    //            source: listaJSON,
    //            minLength: 3,
    //            focus: function (event, ui) {
    //                $('#txtCodCarreraE').val(ui.item.value);
    //                $(this).val(ui.item.label);
    //                return false;
    //            },
    //            select: function (event, ui) {
    //                $('#txtCodCarreraE').val(ui.item.value);
    //                $(this).val(ui.item.label);
    //                return false;
    //            }
    //        });

    //        lista = listas[8].split("¬");
    //        crearCombo(lista, "cboTipoContratoP", "** SELECCIONE TIPO DE CONTRATO **");
    //        crearCombo(lista, "cboTipoContratoPR", "** SELECCIONE TIPO DE CONTRATO **");
    //        crearCombo(lista, "cboTipoContratoPC", "** SELECCIONE TIPO DE CONTRATO **");

    //        lista = listas[9].split("¬");
    //        crearCombo(lista, "cboTabSitP", "** SELECCIONE SITUACION TRABAJADOR **");
    //        lista.splice(1, 1);
    //        crearCombo(lista, "cboTabSitPC", "** SELECCIONE SITUACION TRABAJADOR **");

    //        lista = listas[10].split("¬");
    //        crearCombo(lista, "cboReg_Pension", "** SELECCIONE REGIMEN PENSIONARIO **");

    //        lista = listas[11].split("¬");
    //        crearCombo(lista, "cboTipo_Pago", "** SELECC TIPO DE PAGO **");

    //        lista = listas[12].split("¬");
    //        crearCombo(lista, "cboTabBan", "** SELECCIONE BANCO **");

    //        lista = listas[13].split("¬");
    //        crearCombo(lista, "cboTabDocD", "** SELECCIONE TIPO DE DOCUMENTO **");

    //        lista = listas[13].split("¬");
    //        crearCombo(lista, "cboTabDocC", "** SELECCIONE TIPO DE DOCUMENTO **");

    //        lista = listas[14].split("¬");
    //        crearCombo(lista, "cboTabCambio", "** SELECCIONE TIPO DE DE CAMBIO **");

    //        lista = listas[15].split("¬");
    //        crearCombo(lista, "cboTabSitC_Des", "** SELECCIONE SITUACION TRABAJADOR **");

    //        lista = listas[16].split("¬");
    //        crearCombo(lista, "cboTabSubMotC_Des", "** SELECCIONE SUB-MOTIVO SITUACION LABORAL **");

    //        lista = listas[17].split("¬");
    //        crearCombo(lista, "cboStatus", "** SELECCIONE STATUS **");

    //        lista = listas[18].split("¬");
    //        crearCombo(lista, "cboParentescoF", "** SELECCIONE PARENTESCO **");

    //        tablaRechazo1 = listas[19].split("¬");
    //        tablaRechazo2 = listas[20].split("¬");

    //        i = 0;
    //        lista = '';
    //        anyo = new Date().getFullYear();
    //        for (i = anyo; i > 1980; i--) { lista += i + '|' + i + '¬' }
    //        lista = lista.substring(0, lista.length - 1);

    //        lista = lista.split("¬");
    //        crearCombo(lista, "cboAnoIni", "*Año*");
    //        crearCombo(lista, "cboAnoFin", "*Año*");

    //        lista = '01|Enero¬02|Febrero¬03|Marzo¬04|Abril¬05|Mayo¬06|Junio¬07|Julio¬08|Agosto¬09|Setiembre¬10|Octubre¬11|Noviembre¬12|Diciembre'.split("¬");
    //        crearCombo(lista, "cboMesIni", "*Mes*");
    //        crearCombo(lista, "cboMesFin", "*Mes*");

    //        lista = listas[21].split("¬");
    //        crearCombo(lista, "cboCC", "** SELECCIONE CENTRO DE COSTO **");


        }
        $('#cboTabMot').val(0).trigger('change.select2');

    }
    //function apagaControles() {
    //    document.getElementById("cboTabCat1").disabled = true;
    //    document.getElementById("cboTipDocPer").disabled = true;
    //    document.getElementById("txtNroDoc").disabled = true;
    //    document.getElementById("txtIdControlNet").disabled = true;
    //    document.getElementById("txtApePat").disabled = true;
    //    document.getElementById("txtApeMat").disabled = true;
    //    document.getElementById("txtNombres").disabled = true;
    //    if (document.getElementById("txtRol").value != 10) {
    //        document.getElementById("txtDirecc").disabled = true;
    //        document.getElementById("cboUbiGeoD").disabled = true;
    //        document.getElementById("txtMaps").disabled = true;
    //        document.getElementById("txtTelefo1").disabled = true;
    //        document.getElementById("txtTelefo2").disabled = true;
    //        document.getElementById("txtCorreo").disabled = true;
    //    }
    //    if (document.getElementById("txtRol").value == 16) {
    //        document.getElementById("txtCorreo").disabled = false;
    //    }
    //    document.getElementById("dtpFecNac").disabled = true;
    //    document.getElementById("cboEstCiv").disabled = true;
    //    document.getElementById("txtNroHij").disabled = true;
    //    document.getElementById("cboSexo").disabled = true;
    //    document.getElementById("cboUbiGeoN").disabled = true;
    //    if (document.getElementById("txtRol").value != 16) document.getElementById("cboTabEst").disabled = true;
    //    if (document.getElementById("txtRol").value != 16) document.getElementById("cboTabOcu").disabled = true;
    //    document.getElementById("cboTalla_Polo").disabled = true;
    //    document.getElementById("cboTalla_Pantalon").disabled = true;
    //    if (document.getElementById("txtRol").value != 16) document.getElementById("cboReg_Pension").disabled = true;
    //    document.getElementById("dtpReg_Fecha").disabled = true;
    //    if (document.getElementById("txtRol").value != 16) document.getElementById("txtCUSPP").disabled = true;
    //    document.getElementById("cboComis").disabled = true;
    //    document.getElementById("cboTipo_Pago").disabled = true;
    //    document.getElementById("cboTabBan").disabled = true;
    //    document.getElementById("txtNroCta").disabled = true;
    //}
    //function calcularEdad(fechaNacimiento) {
    //    var fechaActual = new Date();
    //    var añoActual = fechaActual.getFullYear();
    //    var mesActual = fechaActual.getMonth() + 1;
    //    var diaActual = fechaActual.getDate();

    //    var partesFecha = fechaNacimiento.split("-");
    //    var añoNacimiento = parseInt(partesFecha[0]);
    //    var mesNacimiento = parseInt(partesFecha[1]);
    //    var diaNacimiento = parseInt(partesFecha[2]);

    //    var edadAños = añoActual - añoNacimiento;
    //    var edadMeses = mesActual - mesNacimiento;
    //    var edadDias = diaActual - diaNacimiento;

    //    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
    //        edadAños--;
    //        edadMeses += 12;
    //    }

    //    if (edadDias < 0) {
    //        var ultimoDiaMesAnterior = new Date(añoActual, mesActual - 1, 0).getDate();
    //        edadMeses--;
    //        edadDias += ultimoDiaMesAnterior;
    //    }
    //    return 'Edad : ' + edadAños + ' años, con ' + edadMeses + ' meses y ' + edadDias + ' dias';
    //}

    //function validarControles() {
    //    document.getElementById('txtNroDoc').addEventListener('input', function () {
    //        var xTipDocPer = document.getElementById('cboTipDocPer').value;
    //        if (xTipDocPer == 1 && this.value.length > 8) this.value = this.value.slice(0, 8);
    //        if (xTipDocPer == 6 && this.value.length > 11) this.value = this.value.slice(0, 11);
    //    });
    //};

    function mostrarTrabajadores(rpta) {

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
        table = $('#tabla').DataTable().clear().rows.add(matriz).draw();
        ajustarHeadersDataTables($('#tabla'));
        $('#colaborador-lst').unblock();

/*
        if (table != '') table.destroy()
        table = $("#tabla").DataTable({
            data: matriz,
            order: [4, 'asc'],
            scrollY: '60vh',
            scrollX: true,
            paging: false,
            columnDefs: [
                { "width": "40px", "targets": [0] },
                { "width": "40px", "targets": [1, 2] },
                { "width": "250px", "targets": [4] },
                { "width": "250px", "targets": [5] },
                { "width": "160px", "targets": [6] },
                { "width": "70px", "targets": [7, 8, 9, 10] },
                { "width": "600px", "targets": [11] },
                { "width": "1px", "targets": [12, 13], visible: false },
                { "width": "60px", "targets": [14] },
                { "width": "100px", "targets": [15] },
                { "width": "120px", "targets": [16] },
                { "width": "100px", "targets": [17] },
                { "width": "120px", "targets": [18] }
            ],
            language: idioma_espanol,
            initComplete: function (settings, json) {

            },
            rowCallback: function (row, data, index) {
                if (data[10] != '' && data[11] == 'ACTIVO') {
                    $('td', row).css('background-color', '#CABC1B');
                    $('td', row).css('color', 'Black');
                }
                if (data[12] == '1') {
                    $('td', row).css('background-color', 'Gray');
                    $('td', row).css('color', 'White');
                }
            },
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fas fa-folder"></i>Nuevo',
                    titleAttr: 'Nuevo trabajador',
                    className: 'btn hor-grd btn-grd-primary text-white',
                    action: function (e, dt, node, config) {
                        operacion = 1;
                        eliminar_marcas();
                        limpiar_popup();

                        document.getElementById("cboTabEst").disabled = false;
                        document.getElementById("cboTabOcu").disabled = false;
                        document.getElementById("cboModalidad").disabled = false;
                        document.getElementById("cboSegmento").disabled = false;
                        $('#cboModalidad').val("1").trigger('change.select2');
                        $('#cboSegmento').val("0").trigger('change.select2');

                        document.getElementById("btnGrabar").disabled = (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 37) ? true : false
                        document.getElementById("trabajador-lst").style.display = 'none';
                        document.getElementById("trabajador-edt").style.display = 'inline';
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 11 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16 || document.getElementById("txtRol").value == 17) ? false : true
                },
                {
                    text: '<i class="fas fa-pencil-alt"></i>Editar',
                    titleAttr: 'Editar trabajador',
                    className: 'btn hor-grd btn-grd-info text-white',
                    action: function (e, dt, node, config) {
                        operacion = 2;
                        celdas = table.row('.selected').data();
                        if (celdas == undefined) {
                            //alert('No ha Seleccionado ningún registro !!!');
                            Notificacion("No ha Seleccionado ningún registro !!!", "error");
                        }
                        else {
                            var rol = document.getElementById("txtRol").value * 1;
                            //console.log("Rol : " + rol);
                            if (accesosArray.includes(rol)) {
                                console.log("Perfil autorizado");
                                //ValidarPermisos(rol);
                                eliminar_marcas();
                                limpiar_popup();
                                get("/ModRecursosHumanos/ObtenerTrabajadoresGetCSV/?codigo=" + celdas[0], editarPopup);
                            } else {
                                console.log("no autorizado");
                                if (((rol == 14 || rol == 18 || rol == 31) && celdas[1] == 'POST') || (rol == 18 && celdas[1] == 'CIEPRA') || ((rol == 14 || rol == 31) && celdas[1] == 'PVAL') || ((rol == 8) && celdas[1] == 'EVAMA') || ((rol == 33) && (celdas[1] == 'ICAP' || celdas[1] == 'SCAR' || celdas[1] == 'CARCRE'))) {
                                    eliminar_marcas();
                                    limpiar_popup();
                                    get("/ModRecursosHumanos/ObtenerTrabajadoresGetCSV/?codigo=" + celdas[0], editarPopup);
                                } else {
                                    //alert('OPCION NO AUTORIZADA !!!')
                                    Notificacion("Ud. no está autorizado a ver esta opción", "error");
                                }
                            }
                        }
                    }
                    //enabled: (document.getElementById("txtRol").value == 11 || document.getElementById("txtRol").value == 14) ? false : true
                },
                {
                    text: '<i class="fas fa-trash"></i>Eliminar',
                    titleAttr: 'Eliminar trabajador',
                    className: 'btn hor-grd btn-grd-danger text-white',
                    action: function (e, dt, node, config) {
                        celdas = table.row('.selected').data();
                        if (celdas == undefined) {
                            //alert('No ha Seleccionado ningún registro !!!');
                            Notificacion('No ha Seleccionado ningún registro !!!', 'warning');
                        }
                        else {

                            Swal.fire({
                                title: '¿Esta seguro que desea eliminar el registro ' + celdas[0] + ' ?',
                                html: 'Esta acción no se puede revertir',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#137a7f',
                                cancelButtonColor: '#e12885',
                                confirmButtonText: 'Sí',
                                cancelButtonText: 'No',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    var data = celdas[0];
                                    get("/ModRecursosHumanos/ObtenerTrabajadoresEliCSV/?codigo=" + data, mostrarEliminar);
                                    table.row('.selected').remove().draw(false);
                                } else if (result.isDenied) {
                                }
                            });

                            //if (confirm("Esta seguro que desea eliminar el registro ?" + celdas[0])) {
                            //    var data = celdas[0];
                            //    get("/ModRecursosHumanos/ObtenerTrabajadoresEliCSV/?codigo=" + data, mostrarEliminar);
                            //    table.row('.selected').remove().draw(false);
                            //}
                        }
                    },
                    //enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 11 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 14 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16 || document.getElementById("txtRol").value == 17) ? false : true
                    enabled: (document.getElementById("txtRol").value == 1) ? true : false

                },
                {
                    text: '<i class="fas fa-file-excel"></i> Reportes',
                    titleAttr: 'XLS Reportes',
                    className: 'btn hor-grd btn-grd-success text-white',
                    action: function (e, dt, node, config) {
                        var rol = document.getElementById("txtRol").value * 1;
                        cbo = '<option value="0" selected>***SELECCIONE REPORTE***</option>';
                        if (!(rol == 15 || rol == 17 || rol == 33)) {
                            cbo += '<option value="1">Consulta de Trabajadores</option>';
                        }
                        if (rol == 1 || rol == 17) {
                            cbo += '<option value="2">Gestión Usuarios</option>';
                        }
                        if (rol == 1 || rol == 11 || rol == 16 || rol == 42 || rol == 34 || rol == 69) {
                            cbo += '<option value="3">Gestión de Planilla</option>';
                        }
                        if (!(rol == 15 || rol == 17 || rol == 33)) {
                            cbo += '<option value="4">Estudios Trabajadores</option>';
                        }
                        document.getElementById("cboReportes").innerHTML = cbo;
                        $("#Reportes").modal();
                    }
                }
            ]
        });
*/
    }

    //function limpiar_popup() {
    //    document.getElementById("idPeriodos").disabled = true;
    //    document.getElementById("idPeriodos").style.cursor = "not-allowed";
    //    document.getElementById("idEstudios").disabled = true;
    //    document.getElementById("idEstudios").style.cursor = "not-allowed";
    //    document.getElementById("idDocumentos").disabled = true;
    //    document.getElementById("idDocumentos").style.cursor = "not-allowed";
    //    document.getElementById("idControl").disabled = true;
    //    document.getElementById("idControl").style.cursor = "not-allowed";
    //    document.getElementById("idCategoria").disabled = true;
    //    document.getElementById("idCategoria").style.cursor = "not-allowed";
    //    document.getElementById("idHaberes").disabled = true;
    //    document.getElementById("idHaberes").style.cursor = "not-allowed";
    //    document.getElementById("txtID").value = 0
    //    if (document.getElementById("txtRol").value == 14) {
    //        document.getElementById("cboTabCat1").disabled = true;
    //    }
    //    else $('#cboTabCat1').val("-1").trigger('change.select2');
    //    $('#cboTabCat1').val("04").trigger('change.select2');
    //    $('#cboTipDocPer').val("1").trigger('change.select2');
    //    document.getElementById("txtNroDoc").value = '';
    //    document.getElementById("txtRUC").value = '';
    //    document.getElementById("txtIdControlNet").value = '';
    //    document.getElementById("txtApePat").value = '';
    //    document.getElementById("txtApeMat").value = '';
    //    document.getElementById("txtNombres").value = '';
    //    document.getElementById("txtDirecc").value = '';
    //    $('#cboUbiGeoD').val("-1").trigger('change.select2');
    //    document.getElementById("txtMaps").value = '';
    //    document.getElementById("txtTelefo1").value = '';
    //    document.getElementById("txtTelefo2").value = '';
    //    document.getElementById("txtCorreo").value = '';
    //    document.getElementById("dtpFecNac").value = '';
    //    $('#cboEstCiv').val("-1").trigger('change.select2');
    //    document.getElementById("txtNroHij").value = '';
    //    $('#cboSexo').val("-1").trigger('change.select2');
    //    $('#cboUbiGeoN').val("-1").trigger('change.select2');
    //    $('#cboTabEst').val("-1").trigger('change.select2');
    //    $('#cboTabOcu').val("-1").trigger('change.select2');
    //    chkCatTraST.checked = false;
    //    dtpFecTie.value = '';
    //    document.getElementById("lblGerencia").value = '';
    //    document.getElementById("lblArea").value = '';
    //    document.getElementById("lblSubArea").value = '';
    //    $('#cboTalla_Polo').val("-1").trigger('change.select2');
    //    $('#cboTalla_Pantalon').val("-1").trigger('change.select2');
    //    $('#cboModalidad').val("1").trigger('change.select2');
    //    $('#cboSegmento').val("-1").trigger('change.select2');
    //    $('#cboReg_Pension').val("-1").trigger('change.select2');
    //    document.getElementById("dtpReg_Fecha").value = '';
    //    document.getElementById("txtCUSPP").value = '';
    //    $('#cboComis').val("0").trigger('change.select2');
    //    $('#cboTipo_Pago').val("-1").trigger('change.select2');
    //    $('#cboTabBan').val("-1").trigger('change.select2');
    //    document.getElementById("txtNroCta").value = '';
    //    segmento = 0;
    //    document.getElementById('txtTipoUsuarioU').value = '';
    //    document.getElementById('txtUsuarioU').value = '';
    //    document.getElementById('txtFecSolU').value = '';
    //    document.getElementById('txtFecAteU').value = '';
    //    document.getElementById('txtFecBajU').value = '';
    //    matrizP = [];
    //    mostrarMatrizP();
    //    matrizE = [];
    //    mostrarMatrizE();
    //    matrizD = [];
    //    mostrarMatrizD();
    //    matrizC = [];
    //    mostrarMatrizC();
    //    matrizCat = [];
    //    mostrarMatrizCat();
    //    matrizH = [];
    //    mostrarMatrizH();
    //    matrizU = [];
    //    mostrarMatrizU();
    //    ajustarHeadersDataTables($('#tablaD'));
    //}
    //function validacion_form() {
    //    eliminar_marcas();
    //    let validacion = 0;
    //    validacion += validaCampos('cboTabCat1', -1);
    //    validacion += validaCampos('cboTipDocPer', -1);
    //    validacion += validaCampos('txtNroDoc', '');
    //    validacion += validaCampos('txtApePat', '');
    //    validacion += validaCampos('txtApeMat', '');
    //    validacion += validaCampos('txtNombres', '');
    //    validacion += validaCampos('txtDirecc', '');
    //    validacion += validaCampos('cboUbiGeoD', -1);
    //    validacion += validaCampos('txtTelefo1', '');
    //    validacion += validaCampos('txtCorreo', '');
    //    validacion += validaCampos('dtpFecNac', '');
    //    validacion += validaCampos('cboEstCiv', -1);
    //    validacion += validaCampos('cboSexo', -1);
    //    validacion += validaCampos('cboUbiGeoN', -1);
    //    validacion += validaCampos('cboTabEst', -1);
    //    validacion += validaCampos('cboTabOcu', -1);
    //    validacion += validaCampos('cboSegmento', -1);
    //    validacion += validaCampos('cboTalla_Polo', -1);
    //    validacion += validaCampos('cboTalla_Pantalon', -1);
    //    validacion += validaCampos('cboModalidad', -1);
    //    validacion += validaCampos('cboReg_Pension', -1);
    //    return (validacion != 0) ? 1 : 0;
    //}
    //function eliminar_marcas() {
    //    removeRedMark('cboTabCat1', 'cboTipDocPer', 'txtNroDoc', 'txtApePat', 'txtApeMat', 'txtNombres', 'txtDirecc', 'cboUbiGeoD', 'txtTelefo1', 'txtCorreo', 'dtpFecNac', 'cboEstCiv', 'cboSexo', 'cboUbiGeoN', 'cboNivel', 'txtCarreras', 'cboTabEst', 'cboTabOcu', 'cboTalla_Polo', 'cboTalla_Pantalon', 'cboModalidad', 'cboReg_Pension');
    //}
    //function obtenerDatosGrabar() {
    //    var data = document.getElementById("txtID").value + '|';
    //    data += document.getElementById("cboTabCat1").value * 1 + '|';
    //    data += document.getElementById("cboTipDocPer").value * 1 + '|';
    //    data += document.getElementById("txtNroDoc").value + '|';
    //    data += document.getElementById("txtRUC").value + '|';
    //    data += document.getElementById("txtIdControlNet").value * 1 + '|';
    //    data += document.getElementById("txtApePat").value + '|';
    //    data += document.getElementById("txtApeMat").value + '|';
    //    data += document.getElementById("txtNombres").value + '|';
    //    data += document.getElementById("txtDirecc").value + '|';
    //    data += document.getElementById("cboUbiGeoD").value + '|';
    //    data += document.getElementById("txtMaps").value + '|';
    //    data += document.getElementById("txtTelefo1").value + '|';
    //    data += document.getElementById("txtTelefo2").value + '|';
    //    data += document.getElementById("txtCorreo").value + '|';
    //    data += document.getElementById("dtpFecNac").value + '|';
    //    data += document.getElementById("cboEstCiv").value + '|';
    //    data += document.getElementById("txtNroHij").value * 1 + '|';
    //    data += document.getElementById("cboSexo").value + '|';
    //    data += document.getElementById("cboUbiGeoN").value + '|';
    //    data += document.getElementById("cboTabEst").value * 1 + '|';
    //    data += document.getElementById("cboTabOcu").value + '|';
    //    if (cboTabCat1.value * 1 == 0) {
    //        data += (document.getElementById("chkCatTraST").checked == true ? 1 : 0) + '|';
    //        data += document.getElementById("dtpFecTie").value + '|';
    //    } else {
    //        data += '0|0000-00-00|';
    //    }
    //    data += document.getElementById("cboTalla_Polo").value + '|';
    //    data += document.getElementById("cboTalla_Pantalon").value + '|';
    //    data += document.getElementById("cboModalidad").value * 1 + '|';
    //    data += document.getElementById("cboSegmento").value * 1 + '|';
    //    data += document.getElementById("cboReg_Pension").value * 1 + '|';
    //    data += document.getElementById("dtpReg_Fecha").value + '|';
    //    data += document.getElementById("txtCUSPP").value + '|';
    //    data += document.getElementById("cboComis").value * 1 + '|';
    //    data += document.getElementById("cboTipo_Pago").value * 1 + '|';
    //    data += document.getElementById("cboTabBan").value * 1 + '|';
    //    data += document.getElementById("txtNroCta").value + '|';
    //    data += document.getElementById("cboDiscapacitado").value * 1 + '|';
    //    data += document.getElementById("cboGrp_Riesgo").value * 1 + '|';
    //    data += document.getElementById("cboCC").value * 1;
    //    return data;
    //}
    //function editarPopup(rpta) {
    //    //console.log(rpta);
    //    if (rpta.substr(0, 5) == "Error") {
    //        alert(rpta);
    //    }
    //    else {
    //        var listas = rpta.split("¯");
    //        var reg = listas[0].split("|");
    //        var rol = document.getElementById("txtRol").value * 1;
    //        if (rol == 10 || rol == 13 || rol == 15 || rol == 16 || rol == 17) {
    //            apagaControles();
    //        }
    //        document.getElementById("btnGrabar").disabled = (rol == 13) ? true : false

    //        //Bloqueamos todos los tabs - posiblemente esto se haga al iniciar el modulo
    //        document.getElementById("idFamiliares").disabled = true;
    //        document.getElementById("idFamiliares").style.cursor = "not-allowed";

    //        document.getElementById("idPeriodos").disabled = true;
    //        document.getElementById("idPeriodos").style.cursor = "not-allowed";

    //        document.getElementById("idEstudios").disabled = true;
    //        document.getElementById("idEstudios").style.cursor = "not-allowed";

    //        document.getElementById("idDocumentos").disabled = true;
    //        document.getElementById("idDocumentos").style.cursor = "not-allowed";

    //        document.getElementById("idControl").disabled = true;
    //        document.getElementById("idControl").style.cursor = "not-allowed";

    //        document.getElementById("idCategoria").disabled = true;
    //        document.getElementById("idCategoria").style.cursor = "not-allowed";

    //        document.getElementById("idHaberes").disabled = true;
    //        document.getElementById("idHaberes").style.cursor = "not-allowed";

    //        document.getElementById("idUsuarios").disabled = true;
    //        document.getElementById("idUsuarios").style.cursor = "not-allowed";

    //        document.getElementById("idMapa").disabled = true;
    //        document.getElementById("idMapa").style.cursor = "not-allowed";

    //        //console.log(accesosTabs);

    //        for (let i = 0; i < accesosTabs.length; i++) {
    //            if (accesosTabs[i] === "CATEGORIA") {
    //                //console.log("acceso a CATEGORIA");
    //                modificarTab("idCategoria", false, "pointer");
    //            }
    //            if (accesosTabs[i] === "CONTROL") {
    //                //console.log("acceso a CONTROL");
    //                modificarTab("idControl", false, "pointer");
    //            }
    //            if (accesosTabs[i] === "DOCUMENTOS") {
    //                //console.log("acceso a DOCUMENTOS");
    //                modificarTab("idDocumentos", false, "pointer");
    //            }
    //            if (accesosTabs[i] === "ESTUDIOS") {
    //                //console.log("acceso a ESTUDIOS");
    //                modificarTab("idEstudios", false, "pointer");
    //            }
    //            if (accesosTabs[i] === "FAMILIA") {
    //                //console.log("acceso a FAMILIA");
    //                modificarTab("idFamiliares", false, "pointer");
    //            }
    //            if (accesosTabs[i] === "HABERES") {
    //                //console.log("acceso a HABERES");
    //                modificarTab("idHaberes", false, "pointer");
    //            }
    //            if (accesosTabs[i] === "MAPA") {
    //                //console.log("acceso a MAPA");
    //                modificarTab("idMapa", false, "pointer");
    //            }
    //            if (accesosTabs[i] === "PERIODO") {
    //                //console.log("acceso a Periodo");
    //                modificarTab("idPeriodos", false, "pointer");
    //            }
    //            if (accesosTabs[i] === "USUARIOS") {
    //                //console.log("acceso a USUARIOS");
    //                modificarTab("idUsuarios", false, "pointer");
    //            }
    //        }

    //        function modificarTab(id, st, cursor) {
    //            document.getElementById(id).disabled = st;
    //            document.getElementById(id).style.cursor = cursor;
    //        }

    //        //$('#idHaberes').addClass('disabled');
    //        //$('#idHaberes').closest('li').remove();

    //        //if (rol == 11 || rol == 16 || rol == 42) {
    //        //    document.getElementById("idHaberes").disabled = false;
    //        //    $('#idHaberes').removeClass('disabled');
    //        //    document.getElementById("idHaberes").style.cursor = "pointer";
    //        //}
    //        //if (rol == 31) {
    //        //    document.getElementById("idControl").disabled = true;
    //        //    document.getElementById("idControl").style.cursor = "not-allowed";
    //        //}
    //        //if (rol == 13) {
    //        //    document.getElementById("idCategoria").disabled = true;
    //        //    document.getElementById("idCategoria").style.cursor = "not-allowed";
    //        //}
    //        //if (rol == 8 || rol == 14 || rol == 31) {
    //        //    document.getElementById("idPeriodos").disabled = true;
    //        //    document.getElementById("idPeriodos").style.cursor = "not-allowed";
    //        //    document.getElementById("idControl").disabled = true;
    //        //    document.getElementById("idControl").style.cursor = "not-allowed";
    //        //}
    //        //if (rol == 15 || rol == 17) {
    //        //    document.getElementById("idEstudios").disabled = true;
    //        //    document.getElementById("idEstudios").style.cursor = "not-allowed";
    //        //    document.getElementById("idDocumentos").disabled = true;
    //        //    document.getElementById("idDocumentos").style.cursor = "not-allowed";
    //        //    document.getElementById("idControl").disabled = true;
    //        //    document.getElementById("idControl").style.cursor = "not-allowed";
    //        //}

    //        document.getElementById("txtID").value = reg[0];
    //        $('#cboTabCat1').val(reg[1]).trigger('change.select2');
    //        /*
    //                if (rol == 15) {
    //                    $('#cboTabCat1').val(5).trigger('change.select2');
    //                    document.getElementById("cboTabCat1").disabled = true;
    //                }
    //                if (rol == 16) {
    //                    $('#cboTabCat1').val(0).trigger('change.select2');
    //                    document.getElementById("cboTabCat1").disabled = true;
    //                }
    //        */
    //        $('#cboTipDocPer').val(reg[2]).trigger('change.select2');
    //        document.getElementById("txtNroDoc").value = reg[3];
    //        document.getElementById("txtRUC").value = reg[4];
    //        document.getElementById("txtIdControlNet").value = reg[5];
    //        document.getElementById("txtApePat").value = reg[6];
    //        document.getElementById("txtApeMat").value = reg[7];
    //        document.getElementById("txtNombres").value = reg[8];
    //        document.getElementById("txtDirecc").value = reg[9];
    //        $('#cboUbiGeoD').val(reg[10]).trigger('change.select2');
    //        document.getElementById("txtMaps").value = reg[11];
    //        document.getElementById("txtTelefo1").value = reg[12];
    //        document.getElementById("txtTelefo2").value = reg[13];
    //        document.getElementById("txtCorreo").value = reg[14];
    //        document.getElementById("dtpFecNac").value = reg[15];
    //        document.getElementById("txtEdad").value = calcularEdad(reg[15]);
    //        $('#cboEstCiv').val(reg[16]).trigger('change.select2');
    //        document.getElementById("txtNroHij").value = reg[17];
    //        $('#cboSexo').val(reg[18]).trigger('change.select2');
    //        $('#cboUbiGeoN').val(reg[19]).trigger('change.select2');
    //        $('#cboTabEst').val(reg[20]).trigger('change.select2');
    //        $('#cboTabOcu').val(reg[21]).trigger('change.select2');
    //        if (reg[1] == '00' && reg[21] == '37500612') {
    //            lblchkCatTraST.style.display = 'block';
    //            dtpFecTie.style.display = 'block';

    //            chkCatTraST.checked = (reg[22] == '1' ? true : false);
    //            dtpFecTie.value = reg[23];
    //            if (reg[22] == '1') {
    //                chkCatTraST.disabled = true;
    //                dtpFecTie.disabled = true;
    //            }
    //        } else {
    //            lblchkCatTraST.style.display = 'none';
    //            dtpFecTie.style.display = 'none';
    //        }
    //        document.getElementById("lblGerencia").value = reg[24];
    //        document.getElementById("lblArea").value = reg[25];
    //        document.getElementById("lblSubArea").value = reg[26];
    //        $('#cboTalla_Polo').val(reg[27]).trigger('change.select2');
    //        $('#cboTalla_Pantalon').val(reg[28]).trigger('change.select2');
    //        $('#cboModalidad').val(reg[29]).trigger('change.select2');
    //        $('#cboSegmento').val(reg[30]).trigger('change.select2');
    //        segmento = reg[30] * 1;
    //        $('#cboReg_Pension').val(reg[31]).trigger('change.select2');
    //        document.getElementById("dtpReg_Fecha").value = reg[32];
    //        document.getElementById("txtCUSPP").value = reg[33];
    //        $('#cboComis').val(reg[34]).trigger('change.select2');
    //        $('#cboTipo_Pago').val(reg[35]).trigger('change.select2');
    //        $('#cboTabBan').val(reg[36]).trigger('change.select2');
    //        document.getElementById("txtNroCta").value = reg[37];
    //        $('#cboDiscapacitado').val(reg[38]).trigger('change.select2');
    //        $('#cboGrp_Riesgo').val(reg[39]).trigger('change.select2');
    //        document.getElementById("dtpFecIngE").value = reg[40];
    //        document.getElementById("dtpFecIng").value = reg[41];
    //        document.getElementById("dtpFecIni").value = reg[42];
    //        document.getElementById("dtpFecFin").value = reg[43];
    //        document.getElementById("dtpFecCes").value = reg[44];
    //        XCodMotCese = reg[45] * 1;
    //        document.getElementById("lblDesMotCese").value = reg[46];
    //        $('#cboCC').val(reg[47]).trigger('change.select2');
    //        document.getElementById("lblUsrAdi").value = reg[48];
    //        document.getElementById("lblUsrMod").value = reg[49];
    //        if (XCodMotCese == 0) {
    //            btnGrabar.disabled = false;
    //            btnGrabarU.disabled = false;
    //        }
    //        else {
    //            btnGrabar.disabled = true;
    //            btnGrabarU.disabled = true;
    //        }
    //        if ((reg[1] == '00' || reg[1] == '02') && reg[16] != 127) {
    //            document.getElementById("cboTabEst").disabled = true;
    //            document.getElementById("cboTabOcu").disabled = true;
    //            document.getElementById("cboModalidad").disabled = true;
    //            document.getElementById("cboSegmento").disabled = true;
    //        } else {
    //            document.getElementById("cboTabEst").disabled = false;
    //            document.getElementById("cboTabOcu").disabled = false;
    //            document.getElementById("cboModalidad").disabled = false;
    //            document.getElementById("cboSegmento").disabled = false;
    //        }

    //        //mostrarMatrizF();
    //        //mostrarMatrizP();
    //        //mostrarMatrizE();
    //        //mostrarMatrizD();
    //        //mostrarMatrizC();
    //        //mostrarMatrizCat();
    //        //mostrarMatrizH();
    //        //mostrarMatrizU();

    //        if (listas[1] != '') {
    //            lista = listas[1].split("¬");
    //            crearMatrizF(lista);
    //            mostrarMatrizF(matrizF);
    //        } else {
    //            matrizF = [];
    //            mostrarMatrizF(matrizF);
    //        }

    //        if (listas[2] != '') {
    //            lista = listas[2].split("¬");
    //            crearMatrizP(lista);
    //            mostrarMatrizP(matrizP);
    //        } else {
    //            matrizP = [];
    //            mostrarMatrizP(matrizP);
    //        }

    //        if (listas[3] != '') {
    //            lista = listas[3].split("¬");
    //            crearMatrizE(lista);
    //            mostrarMatrizE(matrizE);
    //        } else {
    //            matrizE = [];
    //            mostrarMatrizE(matrizE);
    //        }

    //        if (listas[4] != '') {
    //            lista = '';
    //            lista = listas[4].split("¬");
    //            crearMatrizD(lista);
    //            mostrarMatrizD(matrizD);
    //        } else {
    //            matrizD = [];
    //            mostrarMatrizD(matrizD);
    //        }

    //        if (listas[5] != '') {
    //            lista = listas[5].split("¬");
    //            crearCombo(lista, "cboTabOcuC_Ori", "** SELECCIONE OCUPACION **");
    //            crearCombo(lista, "cboTabOcuC_Des", "** SELECCIONE OCUPACION **");
    //        }
    //        if (listas[6] != '') {
    //            lista = listas[6].split("¬");
    //            crearMatrizC(lista);
    //            mostrarMatrizC(matrizC);
    //        } else {
    //            matrizC = [];
    //            mostrarMatrizC(matrizC);
    //        }

    //        if (listas[7] != '') {
    //            lista = listas[7].split("¬");
    //            crearMatrizCat(lista);
    //            mostrarMatrizCat(matrizCat);
    //        } else {
    //            matrizCat = [];
    //            mostrarMatrizCat(matrizC);
    //        }

    //        if (listas[8] != '') {
    //            lista = listas[8].split("¬");
    //            crearCombo(lista, "cboTabCat_A", "** Seleccione Categoría **");
    //        }
    //        if (listas[9] != '') {
    //            lista = listas[9].split("¬");
    //            crearMatrizH(lista);
    //            mostrarMatrizH(matrizH);
    //        } else {
    //            matrizH = [];
    //            mostrarMatrizH(matrizH);
    //        }

    //        if (listas[10] != '') {
    //            lista = listas[10].split("¬");
    //            crearMatrizU(lista);
    //            mostrarMatrizU(matrizU);
    //            //$('#idUsuarios').tab('show');
    //            //$('#idDatos').tab('show');
    //        } else {
    //            matrizU = [];
    //            mostrarMatrizU(matrizU);
    //        }

    //        //$('#idMapa').tab('show');
    //        //mostrarMapa();

    //        document.getElementById("trabajador-lst").style.display = 'none';
    //        document.getElementById("trabajador-edt").style.display = 'inline';
    //        if (rol == 25) {
    //            document.getElementById("idDatos").disabled = true;
    //            document.getElementById("idDatos").style.cursor = "not-allowed";
    //            document.getElementById("idFamiliares").disabled = true;
    //            document.getElementById("idFamiliares").style.cursor = "not-allowed";
    //            document.getElementById("idPeriodos").disabled = true;
    //            document.getElementById("idPeriodos").style.cursor = "not-allowed";
    //            document.getElementById("idEstudios").disabled = true;
    //            document.getElementById("idEstudios").style.cursor = "not-allowed";
    //            document.getElementById("idDocumentos").disabled = true;
    //            document.getElementById("idDocumentos").style.cursor = "not-allowed";
    //            document.getElementById("idCategoria").disabled = true;
    //            document.getElementById("idCategoria").style.cursor = "not-allowed";
    //            document.getElementById("idHaberes").disabled = true;
    //            document.getElementById("idHaberes").style.cursor = "not-allowed";
    //            document.getElementById("idUsuarios").disabled = true;
    //            document.getElementById("idUsuarios").style.cursor = "not-allowed";
    //            document.getElementById("idMapa").disabled = true;
    //            document.getElementById("idMapa").style.cursor = "not-allowed";
    //            $('#idControl').tab('show');
    //        } else {
    //            $('#idDatos').tab('show');
    //        }
    //    }
    //}

    //function mostrarMapa() {
    //    /*
    //        map.locate({ enableHighAccuracy: true });
    //        map.on('locationfound', e => {
    //            const coordenadas = [e.latlng.lat, e.latlng.lng];
    //            const miUbicacion = L.marker(coordenadas);
    //            if (map != null) { map.remove(); };
        
    //            map = L.map('map').setView(coordenadas, 13);
    //            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    //                maxZoom: 18
    //            }).addTo(map);
    //            L.control.scale().addTo(map);
    //            miUbicacion.bindPopup('Estoy aqui');
    //            map.addLayer(miUbicacion);
        
    //        });
    //    */
    //}

    function mostrarDimensionado(rpta) {
        if (rpta != "") {
            var ssql = '';
            var reg = rpta.split("|");
            document.getElementById("lblGerencia").value = reg[0];
            document.getElementById("lblArea").value = reg[1];
            document.getElementById("lblSubArea").value = reg[2];
            if (reg[3] == "1") {
                ssql = '<option value="-1" selected>*SELECCIONE*</option>';
                ssql += '<option value="1">MULTIPRODUCTO</option>';
                ssql += '<option value="2">FIJA</option>';
                document.getElementById("cboSegmento").disabled = false;
            } else {
                ssql = '<option value="0" selected>*NO APLICA*</option>';
                if (segmento != 0) segmento = 0;
                document.getElementById("cboSegmento").disabled = true;
            }
            document.getElementById("cboSegmento").innerHTML = ssql;
            if (segmento == 0) {
            } else {
                $('#cboSegmento').val(segmento).trigger('change.select2');
            }

        }
    }

    //function mostrarDimensionadoC_Ori(rpta) {
    //    if (rpta != "") {
    //        var reg = rpta.split("|");
    //        document.getElementById("lblGerenciaC_Ori").value = reg[0];
    //        document.getElementById("lblAreaC_Ori").value = reg[1];
    //        document.getElementById("lblSubAreaC_Ori").value = reg[2];
    //    }
    //}
    function mostrarDimensionadoC_Des(rpta) {
        if (rpta != "") {
            var reg = rpta.split("|");
            document.getElementById("lblGerenciaC_Des").value = reg[0];
            document.getElementById("lblAreaC_Des").value = reg[1];
            document.getElementById("lblSubAreaC_Des").value = reg[2];
        }
    }

    function mostrarGrabar(rpta) {
        var mensaje = "";
        if (rpta.substr(0, 5) != "Error") {
            //        document.getElementById("trabajador-lst").style.display = 'inline';
            //        document.getElementById("trabajador-edt").style.display = 'none';
            $('#tabs a:first').tab('show');
            if (operacion == 1) {
                var reg = rpta.split('|');
                mensaje = "Se adicionó un registro " + reg[0] + "\n puede continuar con el resto de pestañas ...";
                document.getElementById("txtID").value = reg[0];
                var NroDoc = document.getElementById("txtNroDoc").value;
                var Nombres = document.getElementById("txtApePat").value + ' ' + document.getElementById("txtApeMat").value + ' ' + document.getElementById("txtNombres").value;
                var DesOcu = document.getElementById("cboTabOcu").options[document.getElementById("cboTabOcu").selectedIndex].innerText;
                var DesEst = document.getElementById("cboTabEst").options[document.getElementById("cboTabEst").selectedIndex].innerText;
                matriz.push([reg[0], reg[1], reg[2], NroDoc, Nombres, DesOcu, DesEst, '', '', '', '', 'ACTIVO']);
                /*
                            document.getElementById("trabajador-lst").style.display = 'inline';
                            document.getElementById("trabajador-edt").style.display = 'none';
                            mostrarMatriz();
                            document.getElementById("trabajador-lst").style.display = 'none';
                            document.getElementById("trabajador-edt").style.display = 'inline';
                */
                document.getElementById("idPeriodos").disabled = false;
                document.getElementById("idPeriodos").style.cursor = "pointer";
                document.getElementById("idEstudios").disabled = false;
                document.getElementById("idEstudios").style.cursor = "pointer";
                document.getElementById("idDocumentos").disabled = false;
                document.getElementById("idDocumentos").style.cursor = "pointer";
                document.getElementById("idCategoria").disabled = false;
                document.getElementById("idCategoria").style.cursor = "pointer";

                document.getElementById("btnGrabar").disabled = true
            }
            else
                if (operacion == 2) {
                    listas = rpta.split("¯");
                    celdas = table.row('.selected').data();
                    celdas[1] = document.getElementById("cboTabCat1").options[document.getElementById("cboTabCat1").selectedIndex].innerText.substring(0, 4);
                    celdas[3] = document.getElementById("txtNroDoc").value;
                    celdas[4] = document.getElementById("txtApePat").value + ' ' + document.getElementById("txtApeMat").value + ' ' + document.getElementById("txtNombres").value;
                    celdas[5] = document.getElementById("cboTabOcu").options[document.getElementById("cboTabOcu").selectedIndex].innerText;
                    celdas[6] = document.getElementById("cboTabEst").options[document.getElementById("cboTabEst").selectedIndex].innerText;
                    document.getElementById("trabajador-lst").style.display = 'inline';
                    document.getElementById("trabajador-edt").style.display = 'none';
                    $('#tabla').dataTable().fnUpdate(celdas, '.selected', undefined, false);
                    document.getElementById("trabajador-lst").style.display = 'none';
                    document.getElementById("trabajador-edt").style.display = 'inline';
                    if (document.getElementById("txtRol").value == 14 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16) document.getElementById("btnGrabar").disabled = true;
                    if (listas[1] != '') {
                        matrizC = [];
                        lista = listas[1].split("¬");
                        crearMatrizC(lista);
                        mostrarMatrizC();
                    }
                    mensaje = "Se actualizó el registro " + listas[0];
                }
        }
        else {
            mensaje = rpta; // "Ocurrió un error al grabar";
        }
        alert(mensaje);
    }
    function mostrarEliminar(rpta) {
        var mensaje = "";
        if (rpta.substr(0, 5) != "Error") {
            mensaje = "Se eliminó el registro " + rpta;
        }
        else {
            mensaje = rpta; // "Ocurrió un error al eliminar";
        }
        alert(mensaje);
    }

    function crearMatrizF(lista) {
        matrizF = [];
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
            matrizF.push(fila);
        }
    }
    function mostrarMatrizF() {
        if (tablaF != '') tablaF.destroy()
        tablaF = $("#tablaF").DataTable({
            data: matrizF,
            order: [0, 'asc'],
            //            scrollY: '32vh',
            //            scrollX: true,
            paging: true,
            pageLength: 10,
            language: idioma_espanol,
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fas fa-folder"></i>Nuevo',
                    titleAttr: 'Nuevo familiar',
                    className: 'btn hor-grd btn-grd-primary ',
                    action: function (e, dt, node, config) {
                        operacionF = 1;
                        if (document.getElementById("txtID").value * 1 == 0) {
                            alert('Primero debe grabar los datos del trabajador ... para poder agregar familiares !!!');
                        } else {
                            eliminar_marcasF();
                            limpiar_popupF();
                            $("#trabajadorF-edt").modal();
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 13 || XCodMotCese != 0) ? false : true
                },
                {
                    text: '<i class="fas fa-pencil-alt"></i>Editar',
                    titleAttr: 'Editar familiar',
                    className: 'btn btn-info btn-sm',
                    action: function (e, dt, node, config) {
                        operacionF = 2;
                        celdas1 = table.row('.selected').data();
                        celdas2 = tablaF.row('.selected').data();
                        if (celdas2 == undefined) {
                            alert('No ha Seleccionado ningún registro !!!');
                        }
                        else {
                            eliminar_marcasF();
                            get("/ModRecursosHumanos/ObtenerTrabajadoresFamGetCSV/?Data=" + celdas1[0] + "|" + celdas2[0], editarPopupF);
                            document.getElementById("dtpFecIniP").disabled = true;
                            $("#trabajadorF-edt").modal();
                        }
                    },
                    //                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 11 && document.getElementById("cboTabCat1").value != 4 || document.getElementById("txtRol").value == 13) ? false : true
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 13 || XCodMotCese != 0) ? false : true
                },
                {
                    text: '<i class="fas fa-trash"></i>Eliminar',
                    titleAttr: 'Eliminar familiar',
                    className: 'btn btn-danger btn-sm',
                    action: function (e, dt, node, config) {
                        celdas1 = table.row('.selected').data();
                        celdas2 = tablaF.row('.selected').data();
                        if (celdas2 == undefined) {
                            alert('No ha Seleccionado ningún registro !!!');
                        }
                        else {
                            if (confirm("Esta seguro que desea eliminar el registro ?" + celdas2[0])) {
                                get("/ModRecursosHumanos/ObtenerTrabajadoresPerEliCSV/?Data=" + celdas1[0] + "|" + celdas2[0], mostrarEliminar);
                                tablaF.row('.selected').remove().draw(false);
                            }
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 13 || XCodMotCese != 0) ? false : true
                }
            ]
        });
    }
    function limpiar_popupF() {
        document.getElementById("txtIDF").value = ''
        $('#cboTipDocPerF').val("-1").trigger('change.select2');
        document.getElementById("txtNroDocF").value = ''
        document.getElementById("txtApePatF").value = ''
        document.getElementById("txtApeMatF").value = ''
        document.getElementById("txtNombresF").value = ''
        $('#cboParentescoF').val("-1").trigger('change.select2');
        document.getElementById("dtpFecNacF").value = ''
    }
    function validacion_formF() {
        eliminar_marcasF();
        let validacion = 0;
        validacion += validaCampos('cboTipDocPerF', -1);
        validacion += validaCampos('txtNroDocF', '');
        validacion += validaCampos('txtApePatF', '');
        validacion += validaCampos('txtApeMatF', '');
        validacion += validaCampos('txtNombresF', '');
        validacion += validaCampos('cboParentescoF', -1);
        validacion += validaCampos('dtpFecNacF', '');
        return (validacion != 0) ? 1 : 0;
    }
    function eliminar_marcasF() {
        removeRedMark('cboTipDocPerF', 'txtNroDocF', 'txtApePatF', 'txtApeMatF', 'txtNombresF', 'cboParentescoF', 'dtpFecNacF');
    }
    function obtenerDatosGrabarF() {
        var data = document.getElementById("txtID").value + '|';
        data += document.getElementById("txtIDF").value * 1 + '|0|';
        data += document.getElementById("cboTipDocPerF").value * 1 + '|';
        data += document.getElementById("txtNroDocF").value + '|';
        data += document.getElementById("txtApePatF").value + '|';
        data += document.getElementById("txtApeMatF").value + '|';
        data += document.getElementById("txtNombresF").value + '|';
        data += document.getElementById("cboParentescoF").value * 1 + '|';
        data += document.getElementById("dtpFecNacF").value;
        return data;
    }
    function editarPopupF(rpta) {
        if (rpta.substr(0, 5) == "Error") {
            alert(rpta);
        }
        else {
            var reg = rpta.split("|");
            document.getElementById("txtIDF").value = reg[0];
            $('#cboTipDocPerF').val(reg[1]).trigger('change.select2');
            document.getElementById("txtNroDocF").value = reg[2];
            document.getElementById("txtApePatF").value = reg[3];
            document.getElementById("txtApeMatF").value = reg[4];
            document.getElementById("txtNombresF").value = reg[5];
            $('#cboParentescoF').val(reg[6]).trigger('change.select2');
            document.getElementById("dtpFecNacF").value = reg[7];
        }
    }
    function mostrarGrabarF(rpta) {
        var mensaje = "";
        if (rpta.substr(0, 5) == "Error") {
            mensaje = rpta; // "Ocurrió un error al grabar";
            alertify.alert('Registro de Familiares', mensaje);
        }
        else {
            $("#trabajadorF-edt").modal('hide');
            lista = rpta.split('¬');
            crearMatrizF(lista);
            mostrarMatrizF();
            mensaje = 'Se grabó Ok';
            alertify.success(mensaje);
        }
    }

    function crearMatrizP(lista) {
        matrizP = [];
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
            matrizP.push(fila);
        }
    }
    function mostrarMatrizP() {
        if (tablaP != '') tablaP.destroy()
        tablaP = $("#tablaP").DataTable({
            data: matrizP,
            order: [0, 'desc'],
            scrollY: '55vh',
            scrollX: true,
            paging: false,
            scrollCollapse: true,
            language: idioma_espanol,
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fas fa-folder"></i>Nuevo',
                    titleAttr: 'Nuevo periodo',
                    className: 'btn btn-primary btn-sm',
                    action: function (e, dt, node, config) {
                        operacionP = 1;
                        if (document.getElementById("txtID").value * 1 == 0) {
                            alert('Primero debe grabar los datos del trabajador ... para poder agregar periodos !!!');
                        } else {
                            eliminar_marcasP();
                            limpiar_popupP();
                            document.getElementById("dtpFecIniP").disabled = false;
                            $("#trabajadorP-edt").modal();
                        }
                    },
                    //enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 15 || XCodMotCese != 0) ? false : true
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 15) ? false : true
                },
                {
                    text: '<i class="fas fa-pencil-alt"></i>Renovar Contrato',
                    titleAttr: 'Renovar Contrato',
                    className: 'btn btn-warning btn-sm',
                    action: function (e, dt, node, config) {
                        celdas1 = table.row('.selected').data();
                        get("/ModRecursosHumanos/ObtenerTrabajadoresPerRGetCSV/?Data=" + celdas1[0], editarPopupPR);
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 15 || XCodMotCese != 0) ? false : true
                },
                {
                    text: '<i class="fas fa-pencil-alt"></i>Cesar Trabajador',
                    titleAttr: 'Cesar Trabajador',
                    className: 'btn btn-dark btn-sm',
                    action: function (e, dt, node, config) {
                        eliminar_marcasPC();
                        limpiar_popupPC();
                        celdas1 = table.row('.selected').data();
                        get("/ModRecursosHumanos/ObtenerTrabajadoresPerCGetCSV/?Data=" + celdas1[0], editarPopupPC);
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 15 || XCodMotCese != 0) ? false : true
                },
                {
                    text: '<i class="fas fa-trash"></i>Eliminar',
                    titleAttr: 'Eliminar periodo',
                    className: 'btn btn-danger btn-sm',
                    action: function (e, dt, node, config) {
                        celdas1 = table.row('.selected').data();
                        celdas2 = tablaP.row('.selected').data();
                        if (celdas2 == undefined) {
                            alert('No ha Seleccionado ningún registro !!!');
                        }
                        else {
                            if (confirm("Esta seguro que desea eliminar el registro ?" + celdas2[0])) {
                                get("/ModRecursosHumanos/ObtenerTrabajadoresPerEliCSV/?Data=" + celdas1[0] + "|" + celdas2[0], mostrarEliminar);
                                tablaP.row('.selected').remove().draw(false);
                            }
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 15 || XCodMotCese != 0) ? false : true
                }
            ]
        });
        ajustarHeadersDataTables($('#tablaP'));
    }
    function limpiar_popupP() {
        document.getElementById("dtpFecIniP").value = ''
        document.getElementById("dtpFecFinP").value = ''
        $('#cboTipoContratoP').val("-1").trigger('change.select2');
        $('#cboTabSitP').val("1").trigger('change.select2');
    }
    function validacion_formP() {
        eliminar_marcasP();
        let validacion = 0;
        validacion += validaCampos('dtpFecIniP', '');
        validacion += validaCampos('dtpFecFinP', '');
        validacion += validaCampos('cboTipoContratoP', -1);
        return (validacion != 0) ? 1 : 0;
    }
    function eliminar_marcasP() {
        removeRedMark('dtpFecIniP', 'dtpFecFinP', 'cboTipoContratoP');
    }
    function obtenerDatosGrabarP() {
        var data = document.getElementById("txtID").value + '|';
        data += document.getElementById("dtpFecIniP").value + '|';
        data += document.getElementById("dtpFecFinP").value + '|';
        data += document.getElementById("cboTipoContratoP").value * 1 + '|';
        data += document.getElementById("cboTabSitP").value * 1 + '|';
        data += operacionP;
        return data;
    }
    function editarPopupP(rpta) {
        if (rpta.substr(0, 5) == "Error") {
            alert(rpta);
        }
        else {
            var reg = rpta.split("|");
            document.getElementById("dtpFecIniP").value = reg[0];
            document.getElementById("dtpFecFinP").value = reg[1];
            $('#cboTipoContratoP').val(reg[2]).trigger('change.select2');
            $('#cboTabMotP').val(reg[3]).trigger('change.select2');
            document.getElementById("dtpFecIngP").value = reg[4];
            document.getElementById("dtpFecCesP").value = reg[5];
            $('#cboTabSitP').val(reg[6]).trigger('change.select2');
            document.getElementById("chkMarca").checked = (reg[7] == 1) ? true : false;
        }
    }
    function mostrarGrabarP(rpta) {
        var mensaje = "";
        var listas = rpta.split('¯');
        if (listas[0].substr(0, 5) != "Error") {
            $("#trabajadorP-edt").modal('hide');
            var reg = listas[0].split('|');
            if (operacionP == 1) mensaje = "Se adicionó un registro " + reg[0];
            else mensaje = "Se actualizó el registro " + reg[0];
            if (listas[1] != '') {
                lista = listas[1].split("¬");
                matrizP = [];
                crearMatrizP(lista);
                mostrarMatrizP();
            }
        }
        else {
            mensaje = listas[0]; // "Ocurrió un error al grabar";
        }
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: 3000
        })
    }

    function validacion_formPR() {
        eliminar_marcasPR();
        let validacion = 0;
        validacion += validaCampos('dtpFecFinPR', '');
        validacion += validaCampos('cboTipoContratoPR', -1);
        return (validacion != 0) ? 1 : 0;
    }
    function eliminar_marcasPR() {
        removeRedMark('dtpFecFinPR', 'cboTipoContratoPR');
    }
    function obtenerDatosGrabarPR() {
        var data = document.getElementById("txtID").value + '|';
        data += document.getElementById("dtpFecIniPR").value + '|';
        data += document.getElementById("dtpFecFinPR").value + '|';
        data += document.getElementById("cboTipoContratoPR").value * 1;
        return data;
    }
    function editarPopupPR(rpta) {
        if (rpta == "") {
            alert('No existe periodos para renovar !!!');
        }
        else {
            var reg = rpta.split("|");
            document.getElementById("dtpFecIniPR").value = reg[0];
            $('#cboTipoContratoPR').val(reg[1]).trigger('change.select2');
            $("#trabajadorPR-edt").modal();
        }
    }
    function mostrarGrabarPR(rpta) {
        var mensaje = "";
        var listas = rpta.split('¯');
        if (listas[0].substr(0, 5) != "Error") {
            $("#trabajadorPR-edt").modal('hide');
            celdas[8] = document.getElementById("dtpFecIniPR").value;
            celdas[9] = document.getElementById("dtpFecFinPR").value;
            $('#tabla').dataTable().fnUpdate(celdas, '.selected', undefined, false);
            ajustarHeadersDataTables($('#tabla'));

            var reg = listas[0].split('|');
            mensaje = "Se creo nuevo periodo " + reg[0];
            if (listas[1] != '') {
                lista = listas[1].split("¬");
                matrizP = [];
                crearMatrizP(lista);
                mostrarMatrizP();
            }
        }
        else {
            mensaje = listas[0]; // "Ocurrió un error al grabar";
        }
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: 3000
        })
    }

    function validacion_formPC() {
        eliminar_marcasPC();
        let validacion = 0;
        validacion += validaCampos('cboTabMotPC', -1);
        validacion += validaCampos('dtpFecCesPC', '');
        validacion += validaCampos('cboTabSitPC', -1);
        return (validacion != 0) ? 1 : 0;
    }
    function eliminar_marcasPC() {
        removeRedMark('cboTabMotPC', 'dtpFecCesPC', 'cboTabSitPC');
    }
    function obtenerDatosGrabarPC() {
        var data = document.getElementById("txtID").value + '|';
        data += document.getElementById("cboTabMotPC").value * 1 + '|';
        data += document.getElementById("cboTabSubMotPC").value * 1 + '|';
        data += document.getElementById("dtpFecCesPC").value + '|';
        data += document.getElementById("cboTabSitPC").value * 1;
        return data;
    }
    function eliminar_marcasPC() {
        removeRedMark('cboTabMotPC', 'dtpFecCesPC', 'cboTabSitPC');
    }

    function limpiar_popupPC() {
        $('#cboTabMotPC').val("-1").trigger('change.select2');
        document.getElementById("dtpFecCesPC").value = ''
        $('#cboTabSitPC').val("-1").trigger('change.select2');
    }

    function editarPopupPC(rpta) {
        if (rpta == "") {
            alert('No existe periodos para poder cesar !!!');
        }
        else {
            var reg = rpta.split("|");
            document.getElementById("dtpFecIniPC").value = reg[0];
            document.getElementById("dtpFecFinPC").value = reg[1];
            $('#cboTipoContratoPC').val(reg[2]).trigger('change.select2');
            $('#cboTabSitPC').val("0").trigger('change.select2');
            $("#trabajadorPC-edt").modal();
        }
    }
    function mostrarGrabarPC(rpta) {
        var mensaje = "";
        var listas = rpta.split('¯');
        if (listas[0].substr(0, 5) != "Error") {
            $("#trabajadorPC-edt").modal('hide');
            var combo = document.getElementById("cboTabMotPC");
            var selected = combo.options[combo.selectedIndex].text;
            celdas[10] = document.getElementById("dtpFecCesPC").value;
            celdas[11] = selected;
            $('#tabla').dataTable().fnUpdate(celdas, '.selected', undefined, false);
            ajustarHeadersDataTables($('#tabla'));

            var reg = listas[0].split('|');
            mensaje = "Se cesó " + reg[0];
            if (listas[1] != '') {
                lista = listas[1].split("¬");
                matrizP = [];
                crearMatrizP(lista);
                mostrarMatrizP();
            }
        }
        else {
            mensaje = listas[0]; // "Ocurrió un error al grabar";
        }
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: 3000
        })
    }
    function crearMatrizE(lista) {
        matrizE = [];
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
            matrizE.push(fila);
        }
    }
    function mostrarMatrizE() {
        if (tablaE != '') tablaE.destroy()
        tablaE = $("#tablaE").DataTable({
            data: matrizE,
            order: [0, 'asc'],
            paging: true,
            pageLength: 10,
            language: idioma_espanol,
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fas fa-folder"></i>Nuevo',
                    titleAttr: 'Nuevo estudio realizado',
                    className: 'btn btn-primary btn-sm',
                    action: function (e, dt, node, config) {
                        operacionE = 1;
                        if (document.getElementById("txtID").value * 1 == 0) {
                            alert('Primero debe grabar los datos del trabajador ... para poder agregar estudios realizados !!!');
                        } else {
                            eliminar_marcasE();
                            limpiar_popupE();
                            $("#trabajadorE-edt").modal();
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 11 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16 || XCodMotCese != 0) ? false : true
                },
                {
                    text: '<i class="fas fa-pencil-alt"></i>Editar',
                    titleAttr: 'Editar estudio realizado',
                    className: 'btn btn-info btn-sm',
                    action: function (e, dt, node, config) {
                        operacionE = 2;
                        celdas1 = table.row('.selected').data();
                        celdas2 = tablaE.row('.selected').data();
                        if (celdas2 == undefined) {
                            alert('No ha Seleccionado ningún registro !!!');
                        }
                        else {
                            eliminar_marcasE();
                            get("/ModRecursosHumanos/ObtenerTrabajadoresEstGetCSV/?Data=" + celdas1[0] + "|" + celdas2[0], editarPopupE);
                            $("#trabajadorE-edt").modal();
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 11 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16 || XCodMotCese != 0) ? false : true
                },
                {
                    text: '<i class="fas fa-trash"></i>Eliminar',
                    titleAttr: 'Eliminar estudio realizado',
                    className: 'btn btn-danger btn-sm',
                    action: function (e, dt, node, config) {
                        celdas1 = table.row('.selected').data();
                        celdas2 = tablaE.row('.selected').data();
                        if (celdas2 == undefined) {
                            alert('No ha Seleccionado ningún registro !!!');
                        }
                        else {
                            if (confirm("Esta seguro que desea eliminar el registro ?" + celdas2[0])) {
                                get("/ModRecursosHumanos/ObtenerTrabajadoresEstEliCSV/?Data=" + celdas1[0] + "|" + celdas2[0], mostrarEliminar);
                                tablaE.row('.selected').remove().draw(false);
                            }
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 11 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16 || XCodMotCese != 0) ? false : true
                }
            ]
        });
        ajustarHeadersDataTables($('#tablaE'));
    }
    function limpiar_popupE() {
        document.getElementById("txtCorrelE").value = '0'
        $('#cboNivelE').val(-1).trigger('change.select2');
        document.getElementById("txtCarrerasE").value = ''
        document.getElementById("txtCodCarreraE").value = ''
        document.getElementById("txtCarrerasE").disabled = true;
        $('#cboTabMotP').val("").trigger('change.select2');
        $('#cboAnoIni').val(-1).trigger('change.select2');
        $('#cboMesIni').val(-1).trigger('change.select2');
        $('#cboAnoFin').val(-1).trigger('change.select2');
        $('#cboMesFin').val(-1).trigger('change.select2');
        document.getElementById("chkMarcaE").checked = false;
    }
    function validacion_formE() {
        eliminar_marcasE();
        let validacion = 0;
        validacion += validaCampos('cboNivelE', -1);
        validacion += validaCampos('txtCodCarreraE', '');
        return (validacion != 0) ? 1 : 0;
    }
    function eliminar_marcasE() {
        removeRedMark('cboNivelE', 'txtCodCarreraE');
    }
    function obtenerDatosGrabarE() {
        var data = document.getElementById("txtID").value + '|';
        data += document.getElementById("txtCorrelE").value * 1 + '|';
        data += document.getElementById("cboNivelE").value * 1 + '|';
        data += document.getElementById("txtCodCarreraE").value + '|';
        data += document.getElementById("cboAnoIni").value + '|';
        data += document.getElementById("cboMesIni").value + '|';
        data += document.getElementById("cboAnoFin").value + '|';
        data += document.getElementById("cboMesFin").value + '|';
        data += ((document.getElementById("chkMarcaE").checked) ? 1 : 0);
        return data;
    }
    function editarPopupE(rpta) {
        if (rpta.substr(0, 5) == "Error") {
            alert(rpta);
        }
        else {
            var reg = rpta.split("|");
            document.getElementById("txtCorrelE").value = reg[0];
            $('#cboNivelE').val(reg[1]).trigger('change.select2');
            document.getElementById("txtCodCarreraE").value = reg[2];
            document.getElementById("txtCarrerasE").value = reg[3];
            $('#cboAnoIni').val(reg[4]).trigger('change.select2');
            $('#cboMesIni').val(reg[5]).trigger('change.select2');
            $('#cboAnoFin').val(reg[6]).trigger('change.select2');
            $('#cboMesFin').val(reg[7]).trigger('change.select2');
            document.getElementById("chkMarcaE").checked = reg[6] == -1 ? true : false;
            if (document.getElementById("chkMarcaE").checked) {
                document.getElementById("cboMesFin").disabled = true;
                document.getElementById("cboAnoFin").disabled = true;
            } else {
                document.getElementById("cboMesFin").disabled = false;
                document.getElementById("cboAnoFin").disabled = false;
            }
        }
    }
    function mostrarGrabarE(rpta) {
        if (rpta != '') {
            matrizE = [];
            lista = rpta.split("¬");
            crearMatrizE(lista);
            mostrarMatrizE();
            $("#trabajadorE-edt").modal('hide');
            alertify.alert('Estudios', 'Se grabó Ok...');
        }

        /*
            if (rpta.substr(0, 5) != "Error") {
                $("#trabajadorE-edt").modal('hide');
                if (operacionE == 1) {
                    var reg = rpta.split('|');
                    mensaje = "Se adicionó un registro " + reg[0];
                    var Correl = reg[0];
                    var Nivel = document.getElementById("cboNivelE").options[document.getElementById("cboNivelE").selectedIndex].innerText;
                    var Carrera = document.getElementById("txtCarrerasE").value;
                    var PerIni = document.getElementById("cboMesIni").value + '/' + document.getElementById("cboAnoIni").value;
                    var PerFin = document.getElementById("cboMesFin").value + '/' + document.getElementById("cboAnoFin").value;
                    if (document.getElementById("cboAnoFin").value == -1) perFin = 'HASTA LA FECHA';
                    matrizE.push([Correl, Nivel, Carrera, PerIni, PerFin]);
                    mostrarMatrizE();
                }
                else
                    if (operacionE == 2) {
                        celdas = tablaE.row('.selected').data();
                        celdas[1] = document.getElementById("cboNivelE").options[document.getElementById("cboNivelE").selectedIndex].innerText;
                        celdas[2] = document.getElementById("txtCarrerasE").value;
                        celdas[3] = document.getElementById("cboMesIni").value + '/' + document.getElementById("cboAnoIni").value;
                        if (document.getElementById("cboAnoFin").value == -1)
                            celdas[4] = 'HASTA LA FECHA';
                        else
                            celdas[4] = document.getElementById("cboMesFin").value + '/' + document.getElementById("cboAnoFin").value;
                        $('#tablaE').dataTable().fnUpdate(celdas, '.selected', undefined, false);
                        mensaje = "Se actualizó el registro " + rpta;
                    }
            }
            else {
                mensaje = rpta; // "Ocurrió un error al grabar";
            }
            alert(mensaje);
        */
    }

    function crearMatrizD(lista) {
        matrizD = [];
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
            matrizD.push(fila);
        }
        //console.log(matrizD);
    }
    function mostrarMatrizD(matrizD) {
        if (tablaD != '') tablaD.destroy()
        tablaD = $("#tablaD").DataTable({
            data: matrizD,
            order: [0, 'asc'],
            scrollY: '62vh',
            scrollX: true,
            paging: false,
            scrollCollapse: true,
            language: idioma_espanol,
            rowCallback: function (row, data, index) {
                if (data[2] == 'REGISTRADO POR MODULO DE CONTROL DE CAMBIOS') {
                    $('td', row).css('background-color', 'Yellow');
                }
            },
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fas fa-folder"></i> Nuevo',
                    titleAttr: 'Nuevo documento',
                    className: 'btn btn-primary btn-sm',
                    action: function (e, dt, node, config) {
                        operacionD = 1;
                        if (document.getElementById("txtID").value * 1 == 0) {
                            alert('Primero debe grabar los datos del trabajador ... para poder agregar estudios realizados !!!');
                        } else {
                            eliminar_marcasD();
                            limpiar_popupD();
                            if (document.getElementById("txtRol").value == 11) {
                                $('#cboTabDocD').val('104').trigger('change.select2');
                                document.getElementById("cboTabDocD").disabled = true;
                            }
                            $("#trabajadorD-edt").modal();
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 40 || document.getElementById("txtRol").value == 1 || XCodMotCese == 0) ? true : false
                },
                {
                    text: '<i class="fas fa-trash"></i> Eliminar',
                    titleAttr: 'Eliminar documento',
                    className: 'btn btn-danger btn-sm',
                    action: function (e, dt, node, config) {
                        celdas1 = table.row('.selected').data();
                        celdas2 = tablaD.row('.selected').data();
                        if (celdas2 == undefined) {
                            alert('No ha Seleccionado ningún registro !!!');
                        }
                        else {
                            if (confirm("Esta seguro que desea eliminar el documento ?" + celdas2[0])) {
                                get("/ModRecursosHumanos/ObtenerTrabajadoresDocEliCSV/?Data=" + celdas1[0] + "|" + celdas2[0], mostrarEliminar);
                                matrizD = matrizD.filter(e => !e.some(m => m === celdas2[0]));
                                tablaD.row('.selected').remove().draw(false);
                            }
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 11 || document.getElementById("txtRol").value == 13 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16 || XCodMotCese != 0) ? false : true
                },
                {
                    text: '<i class="far fa-images"></i> Ver Documento',
                    titleAttr: 'Ver Documento',
                    className: 'btn btn-primary btn-sm',
                    action: function (e, dt, node, config) {
                        celdas1 = table.row('.selected').data();
                        celdas2 = tablaD.row('.selected').data();
                        if (celdas2 == undefined) {
                            alert('No ha Seleccionado ningún registro !!!');
                        }
                        else {
                            get("/ModRecursosHumanos/ObtenerTrabajadoresDocVerCSV/?Data=" + celdas1[0] + "|" + celdas2[0], mostrarDocumento);
                        }
                    },
                    enabled: (txtRol.value == 1 || txtRol.value == 6 || txtRol.value == 7 || txtRol.value == 10 || txtRol.value == 11 || txtRol.value == 16 || txtRol.value == 18 || txtRol.value == 20 || txtRol.value == 34 || txtRol.value == 42 || txtRol.value == 69 || XCodMotCese == 0) ? true : false
                }
            ]
        });
        ajustarHeadersDataTables($('#tablaD'));
    }
    function limpiar_popupD() {
        document.getElementById("txtCorrelD").value = '0';
        $('#cboTabDocD').val(-1).trigger('change.select2');
        document.getElementById("txtObsD").value = '';
        document.getElementById("divAdjuntosD").innerHTML = 'No ha seleccionado ningún archivo';
    }
    function eliminar_marcasD() {
        removeRedMark('cboTabDocD');
    }
    function mostrarGrabarD(rpta) {
        var reg = rpta.split('|');
        var Correl = reg[1];
        var TipDoc = document.getElementById("cboTabDocD").options[document.getElementById("cboTabDocD").selectedIndex].innerText;
        var Obs = document.getElementById("txtObsD").value;
        matrizD.push([Correl, TipDoc, Obs, reg[2], reg[3], reg[4], reg[5]]);
        mostrarMatrizD();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se subió ok el archivo ' + reg[0] + ' !!!',
            showConfirmButton: false,
            timer: 2000
        })
    }
    function mostrarDocumento(rpta) {
        //var mensaje = "";
        //var reg = rpta.split('|');
        //if (reg[0].substr(0, 5) != "Error") {
        //    document.getElementById("spnTitulo").innerHTML = 'Documento : '+reg[0];
        //    var imagen = "<div><img src='data:image/jpg;base64," + reg[1] + "'/></div>";
        //    document.getElementById("divAdjuntosDI").innerHTML = imagen;
        //}
        //else {
        //    document.getElementById("divAdjuntosDI").innerHTML = '<span>IMAGEN NO EXISTE</span>';
        //}
        var reg = rpta.split('|');
        var ext = reg[0].split('.').pop();
        if (ext.toLowerCase() == 'pdf') {
            var byteCharacters = atob(reg[1]);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var file = new Blob([byteArray], { type: 'application/pdf;base64' });
            var fileURL = URL.createObjectURL(file);
            //        var pdf = "<iframe width='100%' height='99%' src='" + fileURL + "'></iframe>";
            //        document.getElementById("divpdf").innerHTML = pdf;
            //        $('#pdf-equifax').modal();
            //        var pdf = "<title>" + reg[0] + "</title><iframe width='100%' height='100%' src='data:application/pdf;base64," + fileURL + "'></iframe>";
            //        var pdf = "<title>" + reg[0] + "</title><iframe width='100%' height='100%' src='data:application/pdf;base64," + encodeURI(reg[1]) + "'></iframe>";
            window.open(fileURL);
            //        window.location = fileURL;
            //        let pdfWindow = window.open('');
            //        pdfWindow.document.write(pdf);
        } else {
            document.getElementById("divAdjuntosDI").innerHTML = '<span>IMAGEN NO EXISTE</span>';
            if (reg[0].substr(0, 5) != "Error") {
                document.getElementById("spnTitulo").innerHTML = 'Documento : ' + reg[0];
                var imagen = "<div><img src='data:image/jpg;base64," + reg[1] + "'/></div>";
                //var imagen = "<iframe width='100%' height='100%' src='data:application/pdf;base64," + encodeURI(reg[1]) + "'></iframe>";
                document.getElementById("divAdjuntosDI").innerHTML = imagen;
            }
            $("#trabajadorDI-edt").modal();
        }
    }
    function crearMatrizC(lista) {
        matrizC = [];
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
            matrizC.push(fila);
        }
        //console.log(matrizC);
    }
    function mostrarMatrizC(matrizC) {
        if (tablaC != '') tablaC.destroy()
        tablaC = $("#tablaC").DataTable({
            data: matrizC,
            order: [0, 'asc'],
            scrollY: '52vh',
            scrollX: true,
            paging: false,
            //pageLength: 10,
            scrollCollapse: true,

            language: idioma_espanol,
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fas fa-folder"></i>Nuevo',
                    titleAttr: 'Nuevo cambio',
                    className: 'btn btn-primary btn-sm',
                    action: function (e, dt, node, config) {
                        operacionC = 1;
                        if (document.getElementById("txtID").value * 1 == 0) {
                            alert('Primero debe grabar los datos del trabajador ... para poder agregar control de cambio !!!');
                        } else {
                            eliminar_marcasC();
                            limpiar_popupC();
                            btnGrabarC.disabled = false;
                            $("#trabajadorC-edt").modal();
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16 || XCodMotCese != 0) ? false : true
                },
                {
                    text: '<i class="fas fa-pencil-alt"></i>Editar',
                    titleAttr: 'Editar cambio',
                    className: 'btn btn-info btn-sm',
                    action: function (e, dt, node, config) {
                        operacionC = 2;
                        celdas1 = table.row('.selected').data();
                        celdas2 = tablaC.row('.selected').data();
                        if (celdas2 == undefined) {
                            alert('No ha Seleccionado ningún registro !!!');
                        }
                        else {
                            eliminar_marcasC();
                            limpiar_popupC();
                            get("/ModRecursosHumanos/ObtenerTrabajadoresCCGetCSV/?Data=" + celdas1[0] + "|" + celdas2[0], editarPopupC);
                            if (celdas2[6] == 'EJECUTADO') btnGrabarC.disabled = true
                            else btnGrabarC.disabled = false
                            $("#trabajadorC-edt").modal();
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16 || XCodMotCese != 0) ? false : true
                },
                {
                    text: '<i class="fas fa-trash"></i>Eliminar',
                    titleAttr: 'Eliminar cambio',
                    className: 'btn btn-danger btn-sm',
                    action: function (e, dt, node, config) {
                        celdas1 = table.row('.selected').data();
                        celdas2 = tablaC.row('.selected').data();
                        if (celdas2 == undefined) {
                            alert('No ha Seleccionado ningún registro !!!');
                        }
                        else {
                            if (celdas2[5] == 'REALIZADO') alert('Control de Cambio ha sido procesado ... No se puede eliminar !!!')
                            else {
                                if (confirm("Esta seguro que desea eliminar el registro ?" + celdas2[0])) {
                                    get("/ModRecursosHumanos/ObtenerTrabajadoresCCEliCSV/?Data=" + celdas1[0] + "|" + celdas2[0], mostrarEliminarC);
                                    tablaC.row('.selected').remove().draw(false);
                                }
                            }
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || document.getElementById("txtRol").value == 15 || document.getElementById("txtRol").value == 16 || XCodMotCese != 0) ? false : true
                },
                {
                    text: '<i class="fas fa-file-excel"></i> Excel',
                    titleAttr: 'Exportar a Excel',
                    className: 'btn btn-success',
                    action: function (e, dt, node, config) {
                        var idCboEstablecimiento = document.getElementById("cboEstablecimientos").value;
                        var idCboTabMot = document.getElementById("cboTabMot").value;
                        var idCboTabCat = document.getElementById("cboTabCat").value;
                        navegar("/ModRecursosHumanos/ObtenerTrabajadoresCCXLS_CSV/?data=" + idCboEstablecimiento + "|" + idCboTabMot + "|" + idCboTabCat);
                    },
                    enabled: (document.getElementById("txtRol").value == 10 || XCodMotCese != 0) ? false : true
                }
            ]
        });
        ajustarHeadersDataTables($('#tablaC'));
    }
    function limpiar_popupC() {
        document.getElementById("txtCorrelC").value = '0'
        document.getElementById("txtApeNomCC").value = document.getElementById("txtApePat").value + ' ' + document.getElementById("txtApeMat").value + ', ' + document.getElementById("txtNombres").value
        var CboTabEst = document.getElementById("cboTabEst");
        document.getElementById("txtDesEstCC").value = CboTabEst.options[CboTabEst.selectedIndex].text;
        $('#cboTabCambio').val(-1).trigger('change.select2');
        $('#cboTabCatC').val(-1).trigger('change.select2');
        $('#cboTabEstC').val(-1).trigger('change.select2');
        $('#cboTabOcuC').val(-1).trigger('change.select2');
        $('#cboTabSitC').val(-1).trigger('change.select2');
        $('#cboTabSubMotC_Des').val(-1).trigger('change.select2');
        dtpFecIniC.value = ''
        dtpFecFinC.value = ''
        $('#cboStatus').val(-1).trigger('change.select2');
        $('#cboTabDocC').val(-1).trigger('change.select2');
        document.getElementById("divAdjuntoC").innerHTML = 'No ha seleccionado ningún archivo';
        document.getElementById("txtObsC").value = '';
        document.getElementById("Fila01").style.display = 'none';
        document.getElementById("Fila02").style.display = 'none';
        document.getElementById("Fila03").style.display = 'none';
        document.getElementById("Fila04").style.display = 'none';
        document.getElementById("Fila05").style.display = 'none';

    }
    function validacion_formC() {
        eliminar_marcasC();
        let validacion = 0;
        validacion += validaCampos('cboTabCambio', -1);

        if (cboTabCambio.value == 2) {
            validacion += validaCampos('cboTabEstC_Des', -1);
        }
        if (cboTabCambio.value == 3) {
            validacion += validaCampos('cboTabOcuC_Des', -1);
            validacion += validaCampos('cboModalidad_Des', -1);
        }
        if (cboTabCambio.value == 4) {
            validacion += validaCampos('cboTabSitC_Des', -1);
            validacion += validaCampos('cboTabSubMotC_Des', -1);
        }

        validacion += validaCampos('dtpFecIniC', '');
        if (document.getElementById("cboStatus").value != 3 || cboTabCambio.value != 0) validacion += validaCampos('dtpFecFinC', '');
        validacion += validaCampos('cboStatus', -1);
        return (validacion != 0) ? 1 : 0;
    }
    function eliminar_marcasC() {
        removeRedMark('cboTabCambio', 'cboTabEstC_Des', 'dtpFecIniC', 'cboTabOcuC_Des', 'cboModalidad_Des', 'dtpFecFinC', 'cboStatus');
    }
    function obtenerDatosGrabarC() {
        var data = document.getElementById("txtID").value * 1 + '|';
        data += document.getElementById("txtCorrelC").value * 1 + '|';
        data += document.getElementById("cboTabCambio").value * 1 + '|';
        data += document.getElementById("cboTabCatC_Ori").value * 1 + '|';
        data += document.getElementById("cboTabCatC_Des").value * 1 + '|';
        data += document.getElementById("cboTabEstC_Ori").value * 1 + '|';
        data += document.getElementById("cboTabEstC_Des").value * 1 + '|';
        data += document.getElementById("cboTabOcuC_Ori").value * 1;
        data += document.getElementById("cboModalidad_Ori").value * 1;
        data += document.getElementById("cboSegmento_Ori").value * 1 + '|';
        data += document.getElementById("cboTabOcuC_Des").value * 1;
        data += document.getElementById("cboModalidad_Des").value * 1;
        data += document.getElementById("cboSegmento_Des").value * 1 + '|';
        data += document.getElementById("cboTabSitC_Ori").value * 1 + '|';
        data += document.getElementById("cboTabSitC_Des").value * 1 + '|';
        data += document.getElementById("cboTabSubMotC_Des").value * 1 + '|';
        data += document.getElementById("dtpFecIniC").value + '|';
        data += document.getElementById("dtpFecFinC").value + '|';
        data += document.getElementById("cboStatus").value * 1 + '|';
        data += document.getElementById("cboTabDocC").value * 1 + '|';
        data += document.getElementById("txtObsC").value;
        return data;
    }
    function editarPopupC(rpta) {
        if (rpta.substr(0, 5) == "Error") {
            alert(rpta);
        }
        else {
            var reg = rpta.split("|");
            document.getElementById("txtCorrelC").value = reg[0];
            $('#cboTabCambio').val(reg[1]).trigger('change.select2');
            if (reg[1] == 1) {
                $('#cboTabCatC_Ori').val(reg[2]).trigger('change.select2');
                $('#cboTabCatC_Des').val(reg[3].substr(0, 7)).trigger('change.select2');
            }
            if (reg[1] == 2) {
                $('#cboTabEstC_Ori').val(reg[2]).trigger('change.select2');
                $('#cboTabEstC_Des').val(reg[3]).trigger('change.select2');
            }
            if (reg[1] == 3) {
                $('#cboTabOcuC_Ori').val(reg[2].substr(0, 8)).trigger('change.select2');
                $('#cboModalidad_Ori').val(reg[2].substr(8, 1)).trigger('change.select2');
                $('#cboSegmento_Ori').val(reg[2].substr(9, 1)).trigger('change.select2');
                $('#cboTabOcuC_Des').val(reg[3].substr(0, 8)).trigger('change.select2');
                $('#cboModalidad_Des').val(reg[3].substr(8, 1)).trigger('change.select2');
                $('#cboSegmento_Des').val(reg[3].substr(9, 1)).trigger('change.select2');
            }
            if (reg[1] == 4) {
                $('#cboTabSitC_Ori').val(reg[2]).trigger('change.select2');
                $('#cboTabSitC_Des').val(reg[3]).trigger('change.select2');
                $('#cboTabSubMotC_Des').val(reg[4]).trigger('change.select2');
            }
            document.getElementById("dtpFecIniC").value = reg[5];
            document.getElementById("dtpFecFinC").value = reg[6];
            $('#cboStatus').val(reg[7]).trigger('change.select2');
            document.getElementById("txtObsC").value = reg[8];
        }
    }
    function mostrarGrabarC(rpta) {
        var mensaje = "";
        var listas = rpta.split('¯');
        rpta = listas[0];
        if (rpta.substr(0, 5) != "Error") {
            $("#trabajadorC-edt").modal('hide');
            if (operacionC == 1) {
                var reg = rpta.split('|');
                mensaje = "Se adicionó un registro " + reg[0];
                /*
                            var Correl = reg[0];
                            var TabCambio = document.getElementById("cboTabCambio").options[document.getElementById("cboTabCambio").selectedIndex].innerText;
                            var TipoCC = document.getElementById("cboTabCambio").value;
                            var DesTipoCC = '';
                            if (TipoCC == 1) DesTipoCC = document.getElementById("cboTabCatC_Des").options[document.getElementById("cboTabCatC_Des").selectedIndex].innerText;
                            if (TipoCC == 2) DesTipoCC = document.getElementById("cboTabEstC_Des").options[document.getElementById("cboTabEstC_Des").selectedIndex].innerText;
                            if (TipoCC == 3) DesTipoCC = document.getElementById("cboTabOcuC_Des").options[document.getElementById("cboTabOcuC_Des").selectedIndex].innerText;
                            if (TipoCC == 4) DesTipoCC = document.getElementById("cboTabSitC_Des").options[document.getElementById("cboTabSitC_Des").selectedIndex].innerText;
                            var Status = document.getElementById("cboStatus").options[document.getElementById("cboStatus").selectedIndex].innerText;
                            matrizC.push([Correl, TabCambio, DesTipoCC, document.getElementById("dtpFecIniC").value, document.getElementById("dtpFecFinC").value,'EN PROCESO', Status, reg[1], reg[2]]);
                            mostrarMatrizC();
                */
                if (listas[1] != '') {
                    lista = listas[1].split("¬");
                    matrizC = [];
                    crearMatrizC(lista);
                    mostrarMatrizC();
                }

                if (listas[2] != '') {
                    lista = listas[2].split("¬");
                    matrizD = [];
                    crearMatrizD(lista);
                    mostrarMatrizD();
                }
            }
            else
                if (operacionC == 2) {
                    /*
                                    var reg = rpta.split('|');
                                    celdas = tablaC.row('.selected').data();
                                    celdas[1] = document.getElementById("cboTabCambio").options[document.getElementById("cboTabCambio").selectedIndex].innerText;
                                    var TipoCC = document.getElementById("cboTabCambio").value;
                                    var DesTipoCC = '';
                                    if (TipoCC == 1) DesTipoCC = document.getElementById("cboTabCatC_Des").options[document.getElementById("cboTabCatC_Des").selectedIndex].innerText;
                                    if (TipoCC == 2) DesTipoCC = document.getElementById("cboTabEstC_Des").options[document.getElementById("cboTabEstC_Des").selectedIndex].innerText;
                                    if (TipoCC == 3) DesTipoCC = document.getElementById("cboTabOcuC_Des").options[document.getElementById("cboTabOcuC_Des").selectedIndex].innerText;
                                    if (TipoCC == 4) DesTipoCC = document.getElementById("cboTabSitC_Des").options[document.getElementById("cboTabSitC_Des").selectedIndex].innerText;
                                    var Status = document.getElementById("cboStatus").options[document.getElementById("cboStatus").selectedIndex].innerText;
                                    celdas[2] = DesTipoCC;
                                    celdas[3] = document.getElementById("dtpFecIniC").value;
                                    celdas[4] = document.getElementById("dtpFecFinC").value;
                                    celdas[6] = Status;
                                    celdas[7] = reg[1];
                                    celdas[8] = reg[2];
                                    $('#tablaC').dataTable().fnUpdate(celdas, '.selected', undefined, false);
                    */
                    if (listas[1] != '') {
                        lista = listas[1].split("¬");
                        matrizC = [];
                        crearMatrizC(lista);
                        mostrarMatrizC();
                    }

                    if (listas[2] != '') {
                        lista = listas[1].split("¬");
                        matrizD = [];
                        crearMatrizD(lista);
                        mostrarMatrizD();
                    }
                    mensaje = "Se actualizó el registro " + reg[0];
                }
        }
        else {
            mensaje = rpta; // "Ocurrió un error al grabar";
        }
        alert(mensaje);
    }
    function mostrarEliminarC(rpta) {
        var mensaje = "";
        var listas = rpta.split('¯');
        rpta = listas[0];
        if (rpta.substr(0, 5) != "Error") {
            mensaje = "Se eliminó el registro " + rpta;
            if (listas[1] != '') {
                lista = listas[1].split("¬");
                matrizD = [];
                crearMatrizD(lista);
                mostrarMatrizD();
            }
        }
        else {
            mensaje = rpta; // "Ocurrió un error al eliminar";
        }
        alert(mensaje);
    }
    function crearMatrizCat(lista) {
        matrizCat = [];
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
            matrizCat.push(fila);
        }
        //    document.getElementById('txtDesCatAct').value = campos[1];
    }
    function mostrarMatrizCat() {
        if (tablaCat != '') tablaCat.destroy()
        tablaCat = $("#tablaCat").DataTable({
            data: matrizCat,
            order: [0, 'asc'],
            paging: true,
            pageLength: 10,
            columnDefs: [
                { "width": "40px", "targets": [0] },
                { "width": "200px", "targets": [1] },
                { "width": "150px", "targets": [2, 3] },
                { "width": "150px", "targets": [4] },
                { "width": "200px", "targets": [5] },
                { "width": "100px", "targets": [6, 7, 8, 9, 10, 12, 13] }],
            language: idioma_espanol,
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fas fa-folder"></i> Actualizar Categoría',
                    titleAttr: 'Actualizar Categoría',
                    className: 'btn btn-primary btn-xl',
                    action: function (e, dt, node, config) {
                        operacionCat = 1;
                        celdas = tablaCat.row('.selected').data();
                        if (document.getElementById("txtID").value * 1 == 0) {
                            alert('Primero debe grabar los datos del trabajador ... para poder agregar categoría !!!');
                        } else {
                            eliminar_marcasCat();
                            limpiar_popupCat();
                            get("/hsw/ObtenerFecha/?Data=" + txtID.value, mostrarFechaUltimoPeriodo);
                            function mostrarFechaUltimoPeriodo(rpta) {
                                var Fecha = rpta.split('|');
                                document.getElementById("dtpFecIniCat").value = Fecha[0];
                                document.getElementById("dtpFecFinCat").value = Fecha[1];
                            }
                            document.getElementById("btnAprobado").disabled = true;
                            //document.getElementById("btnTemporal").disabled = true;
                            //document.getElementById("btnDefinitivo").disabled = true;
                            document.getElementById("txtDesCatAct").value = document.getElementById("cboTabCat1").options[document.getElementById("cboTabCat1").selectedIndex].innerText;
                            document.getElementById("cboTabCat_A").disabled = false;
                            $("#trabajadorCat-edt").modal();
                        }
                    },
                    enabled: (document.getElementById("txtRol").value == 10) ? false : true
                }
            ]
        });
        ajustarHeadersDataTables($('#tablaCat'));
        $('#idDatos').tab('show');
    }
    function limpiar_popupCat() {
        $('#cboTabCat_A').val(-1).trigger('change.select2');
        document.getElementById("dtpFecIniCat").value = ''
        document.getElementById("dtpFecFinCat").value = ''
        document.getElementById("txtObsCat").value = ''
    }
    function validacion_formCat() {
        eliminar_marcasC();
        let validacion = 0;
        return (validacion != 0) ? 1 : 0;
    }
    function eliminar_marcasCat() {
        //    removeRedMark('cboTabCat2');
    }
    function obtenerDatosGrabarCat() {
        var data = document.getElementById("txtID").value * 1 + '|';
        data += document.getElementById("cboTabCat_A").value * 1 + '|';
        data += document.getElementById("dtpFecIniCat").value + '|';
        data += document.getElementById("dtpFecFinCat").value + '|';
        data += document.getElementById("txtObsCat").value;
        return data;
    }
    function mostrarGrabarCat(rpta) {
        var mensaje = rpta;
        if (rpta.substr(0, 5) != "Error") {
            $("#trabajadorCat-edt").modal('hide');
            $("#Trabajadores_Rechazo").modal('hide');
            if (operacionCat == 1) {
                $('#cboTabCat1').val(document.getElementById("cboTabCat_A").value).trigger('change.select2');
                celdas = table.row('.selected').data();
                var listas = rpta.split("¯");
                celdas[1] = listas[0];

                document.getElementById("trabajador-lst").style.display = 'inline';
                document.getElementById("trabajador-edt").style.display = 'none';
                $('#tabla').dataTable().fnUpdate(celdas, '.selected', undefined, false);
                document.getElementById("trabajador-lst").style.display = 'none';
                document.getElementById("trabajador-edt").style.display = 'inline';

                lista = listas[1].split("¬");
                crearCombo(lista, "cboTabCat_A", "** Seleccione Categoría **");
                matrizCat = [];
                if (listas[2] != '') {
                    lista = listas[2].split("¬");
                    crearMatrizCat(lista);
                }
                mostrarMatrizCat();

                if (listas[3] != '') {
                    matrizC = [];
                    lista = listas[3].split("¬");
                    crearMatrizC(lista);
                    mostrarMatrizC();
                }
            }
            //$('#idCategoria').tab('show');
            alertify.success('Ok')
        } else alertify.error(mensaje);
    }
    function crearMatrizH(lista) {
        matrizH = []
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
            matrizH.push(fila);
        }
    }
    function mostrarMatrizH() {
        if (tablaH != '') tablaH.destroy()
        tablaH = $("#tablaH").DataTable({
            data: matrizH,
            order: [2, 'asc'],
            paging: false,
            language: idioma_espanol,
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="fas fa-folder"></i> Actualizar Haber Permanente',
                    titleAttr: 'Actualizar Haber Permanente',
                    className: 'btn btn-primary btn-xl',
                    action: function (e, dt, node, config) {
                        celdas1 = table.row('.selected').data();
                        celdas2 = tablaH.row('.selected').data();
                        if (celdas2 == undefined) {
                            alert('No ha Seleccionado ningún registro !!!');
                        } else {
                            celdas2 = tablaH.row('.selected').data();
                            document.getElementById("txtDesCon").value = celdas2[3];
                            document.getElementById("txtImporte").value = celdas2[4];
                            $("#trabajadorHaber-edt").modal();
                        }
                    },
                    enabled: (XCodMotCese != 0) ? false : true
                }
            ]
        });
    }
    function obtenerDatosGrabarHab() {
        celdas2 = tablaH.row('.selected').data();
        var data = document.getElementById("txtID").value * 1 + '|';
        data += celdas2[0] * 1 + '|';
        data += celdas2[1] * 1 + '|';
        data += document.getElementById("txtImporte").value * 1;
        return data;
    }
    function mostrarGrabarHab(rpta) {
        var mensaje = rpta;
        if (rpta.substr(0, 5) != "Error") {
            $("#trabajadorHaber-edt").modal('hide');
            matrizH = [];
            if (rpta != '') {
                lista = rpta.split("¬");
                crearMatrizH(lista);
            }
            mostrarMatrizH();
        }
        alert('Se Grabó Ok !!!');
    }

    function crearMatrizU(lista) {
        matrizU = [];
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
            matrizU.push(fila);
        }
    }
    function mostrarMatrizU() {
        if (tablaU != '') tablaU.destroy()
        tablaU = $("#tablaU").DataTable({
            data: matrizU,
            //scrollY: '30vh',
            order: [0, 'asc'],
            searching: false,
            paging: true,
            lengthChange: false,
            pageLength: 15,
            language: idioma_espanol,
            columnDefs: [
                { "width": "40px", "targets": [0], visible: false },
                { "width": "200px", "targets": [1] },
                { "width": "150px", "targets": [2, 3, 4, 5] }
            ]
        });
    }

    //accesosTabs
    $('.nav-tabs .nav-link').on('click', function (e) {
        //console.log(accesosTabs);
        e.preventDefault();
        var tabHref = $(this).attr('href');
        var tipotab = "";

        switch (tabHref) {
            case "#categorias":
                tipotab = "CATEGORIA";
                break;
            case "#control":
                tipotab = "CONTROL";
                break;
            case "#documentos":
                tipotab = "DOCUMENTOS";
                break;
            case "#estudios":
                tipotab = "ESTUDIOS";
                break;
            case "#familiares":
                tipotab = "FAMILIA";
                break;
            case "#haberes":
                tipotab = "HABERES";
                break;
            case "#mapa":
                tipotab = "MAPA";
                break;
            case "#periodos":
                tipotab = "PERIODO";
                break;
            case "#usuarios":
                tipotab = "USUARIOS";
                break;
        }

        if (accesosTabs.includes(tipotab)) {
            $('.tab-pane').removeClass('active');
            $(tabHref).addClass('active');
            $('.nav-tabs .nav-link').removeClass('active');
        }

    });

}