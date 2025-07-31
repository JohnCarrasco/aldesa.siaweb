var listas = [];
var lista = [];
var matriz = [];
var opc_sel = '';
var opc_sel_tar = '';
var tabla = '';
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
    order: [3, 'asc'],
    //scrollY: '48vh',
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
            width: '10px',
            render: function (data, type, full, meta) {
                let mostrar = '<div class="d-flex align-items-center">' +
                '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar Documento"><i class="ri-eye-line ri-20px" style="color:blue"  data-opc="con"></i></a>' +
                '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Editar Cotización"    ><i class="ri-pencil-line"    style="color:green" data-opc="est"></i></a>' +
                '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular Documento"   ><i class="ri-delete-bin-line"  style="color:red"   data-opc="anu"></i></a>' +
                '</div>'
                return (mostrar);
            }
        },
        { width: "4rem", targets: 1, visible: false },
        { width: "10rem", targets: 2 },
        { width: "25rem", targets: 3 },
        { width: "35rem", targets: 4 },
        {
            width: "6rem", targets: 5, className: "text-center",
            render: function (data, type, row) {
                if (data == 1) return '&lt;ACT&gt;'
                else return '*ANU*'
            }
        },
    ],
    dom: '<"controls"Bfl>rtip', // Agrupamos Botones, Filtro (checkbox), y buscador en "controls"
    rowCallback: function (row, data, index) {
        /* Anulado */
        if (data[5] == 0) {
            $('td', row).css('background-color', '#c8c8c8');
        }
    },
    buttons: [
        {
            text: '<i class="ri-file-line"></i> Nuevo Cliente/Proveedor',
            titleAttr: 'Nuevo Cliente/Proveedor',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_sel = 'adi';
                ControlesLimpiar(document.getElementById('controles'));
                controlesEnabled(document.getElementById('controles'));
                dtpFecha.value = Hoy;
                get("/ModFacturacion/ManteFacturasCSV/?data=tc|" + Hoy, mostrarTipCam);
                txtDias.value = 0;
                txtFecVen.value = moment(dtpFecha.value).add(txtDias.value * 1, 'days').format('DD/MM/YYYY');
                dtpFecIni_Per.value = Hoy;
                txtDias_Per.value = 30;
                txtFecFin_Per.value = moment(dtpFecIni_Per.value).add(txtDias_Per.value * 1 - 1, 'days').format('DD/MM/YYYY');
                txtNumDoc.disabled = true;
                txtDUA.disabled = true;
                txtNroCar.disabled = true;
                txtFecCar.disabled = true;
                txtFecNum.disabled = true;
                txtFecFin_Per.disabled = true;
                txtTipCam.disabled = true;
                txtFecVen.disabled = true;
                txtBultos.disabled = true;
                txtMonto.disabled = true;
                txtDetPor.disabled = true;
                txtDetSol.disabled = true;
                txtDetDol.disabled = true;
                txtPorIGV.value = '18.00';
                lblPorIGV.innerHTML = 'IGV(18.00%)';
                btnGuardar.disabled = false;
                document.getElementById("servicios").hidden = true;
                document.getElementById("tbl_servicios").innerHTML = '';
                matriz = [];
                tabfac_det = $('#tabfac_det').DataTable().clear().rows.add(matriz).draw();
                tabfac_det_ser = $('#tabfac_det_ser').DataTable().clear().rows.add(matriz).draw();
                totalDocumento();
                ajustarHeadersDataTables($('#tabfac_det'));
                ajustarHeadersDataTables($('#tabfac_det_ser'));
                document.getElementById("lista-lst").hidden = true;
                document.getElementById("lista-edt").hidden = false;
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
            const columna = data[5];
            return columna.indexOf('*ANU*') === -1;
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
                    const columna = data[5];
                    return columna.indexOf('*ANU*') === -1;
                }
            );
        }
        tabla.draw();
    });
}
function iniciar() {

    //var select2 = $('#cboCliPro');
    //if (select2.length) {
    //    select2.each(function () {
    //        var $this = $(this);
    //        select2Focus($this);
    //        $this.wrap('<div class="position-relative"></div>');
    //        $this.select2({
    //            dropdownParent: $this.parent()
    //        });
    //    });
    //}

    mostrarBloqueo('#lista-lst'); 

    get("/ModTablas/ManteCliProCSV/?data=ini|", cargaInicial);

    cboCliPro.onchange = function () {
        var combo = document.getElementById("cboCliPro");
        if (combo.value * 1 > 0) {
            var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
            txtCorreo.value = valorOculto;
        } else txtCorreo.value = '';
    }
    dtpFecha.onchange = function () {
        txtFecVen.value = moment(dtpFecha.value).add(txtDias.value * 1, 'days').format('DD/MM/YYYY');
        get("/ModFacturacion/ManteFacturasCSV/?data=tc|" + dtpFecha.value, mostrarTipCam);
    }
    dtpFecIni_Per.onchange = function () {
        txtFecFin_Per.value = moment(dtpFecIni_Per.value).add(txtDias_Per.value * 1 - 1, 'days').format('DD/MM/YYYY');
    }
    txtDias_Per.oninput = function () {
        if (txtDias_Per.value * 1 > 0) txtFecFin_Per.value = moment(dtpFecIni_Per.value).add(txtDias_Per.value * 1 - 1, 'days').format('DD/MM/YYYY');
    }
    txtDias.oninput = function () {
        txtFecVen.value = moment(dtpFecha.value).add(txtDias.value * 1, 'days').format('DD/MM/YYYY');
    }
    cboServicio.onchange = function () {
        var combo = document.getElementById("cboServicio");
        var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
        if (cboServicio.value == "FA02" || cboServicio.value == "FA04") {
            divAdicional3.hidden = false;
            divAdicional4.hidden = false;
            divAdicional5.hidden = false;
        } else {
            divAdicional3.hidden = true;
            divAdicional4.hidden = true;
            divAdicional5.hidden = true;
        }
        if (valorOculto == '') {
            txtBultos.disabled = false;
            txtMonto.disabled = false;
            det.hidden = true;
            divServicios.hidden = false;
            det_ser.hidden = false;
        } else {
            txtBultos.disabled = true;
            txtMonto.disabled = true;
            det.hidden = false;
            divServicios.hidden = true;
            det_ser.hidden = true;
        }
        txtTipDoc.value = cboServicio.value.substring(0, 1) == 'F' ? 1 : 3;
        if (!cboServicio.disabled) get("/ModFacturacion/ManteFacturasCSV/?data=nro|" + cboServicio.value, mostrarNumDoc);
    }
    function mostrarNumDoc(rpta) {
        txtNumDoc.value = rpta;
    }

    lupa.onclick = function(){
        var combo = document.getElementById("cboServicio");
        var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
        get("/ModFacturacion/ManteFacturasCSV/?data=tar|" + cboCliPro.value + '|' + valorOculto, mostrarTarjetas);
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
            ajustarHeadersDataTables($('#tablatarjetas'));

            var combo = document.getElementById("cboCliPro");
            modalCenterTitle.innerHTML = 'Cliente : ' + combo.options[combo.selectedIndex].text;
            MostrarTarjetas.show();
        }
    }

    chkVarias.onchange = function () {
        verificarVarias();
    }

    cboServiciosGrp.onchange = function () {
        get("/ModCotizaciones/ManteCotizacionesCSV/?data=8|" + cboServiciosGrp.value, mostrarServicios);
        function mostrarServicios(rpta) {
            let tabla_servicios = document.getElementById("tabla_servicios_detalle");
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
                    fila = tabla_servicios.rows[i];
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
            document.getElementById("tbl_servicios").innerHTML = data;
        }
    }

//    $('#tabla tbody').on('click', 'tr', function (e) {
//        opc_sel = e.target.dataset.opc;
//        objfila = this;
//        celdas = tabla.row(objfila).data();
//        if (!(opc_sel === undefined)) {
//            if (celdas[9] == 0) {
//                Swal.fire({
//                    icon: 'error',
//                    title: "¡ Anulada !",
//                    text: "Documento se encuentra anulado.",
//                    customClass: {
//                        confirmButton: 'btn btn-primary waves-effect waves-light'
//                    },
//                    buttonsStyling: false
//                });
//            } else {
//                if ('con-edt'.includes(opc_sel)) {
//                    get("/ModFacturacion/ManteFacturasCSV/?data=" + opc_sel + "|" + celdas[1] + "|" + celdas[2], editarLista);
//                } else {
//                    Swal.fire({
//                        title: "¿ Está seguro de enviar documento " + celdas[3] + " al DataSmart ?",
//                        text: "! No se podrá revertir !",
//                        icon: "warning",
//                        showCancelButton: true,
//                        confirmButtonText: "! Sí, enviar !",
//                        customClass: {
//                            confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
//                            cancelButton: 'btn btn-outline-secondary waves-effect'
//                        },
//                        buttonsStyling: false
//                    }).then(function (result) {
//                        if (result.value) {
//                            mostrarBloqueo('#lista-lst'); 
//                            get("/ModFacturacion/ManteFacturasDataSmartCSV/?data=" + opc_sel + "|" + celdas[1] + "|" + celdas[2], mostrarEnviar);
//                        }
//                    });
//                }
///*
//                if ('con-edt'.includes(opc_sel)) {
//                    get("/ModFacturacion/ManteFacturasCSV/?data=" + opc_sel + "|" + celdas[1] + "|" + celdas[3], editarLista);
//                }


//                if (opc_sel == 5) {
//                    if (celdas[5] == 2) {
//                        Swal.fire({
//                            icon: 'error',
//                            title: "¡ Cotización se encuentra aprobada !",
//                            text: "Cotizacíón se encuentra aprobada. No se puede anular",
//                            customClass: {
//                                confirmButton: 'btn btn-primary waves-effect waves-light'
//                            },
//                            buttonsStyling: false
//                        });
//                    } else {
//                        Swal.fire({
//                            title: "¿ Está seguro de anular cotización " + celdas[1] + " ?",
//                            text: "! No se podrá revertir !",
//                            icon: "warning",
//                            showCancelButton: true,
//                            confirmButtonText: "! Sí, anular !",
//                            customClass: {
//                                confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
//                                cancelButton: 'btn btn-outline-secondary waves-effect'
//                            },
//                            buttonsStyling: false
//                        }).then(function (result) {
//                            if (result.value) {
//                                post("/ModCotizaciones/ManteCotizacionesGrbCSV", mostrarGrabar, opc_sel + "|" + celdas[1]);
//                            }
//                        });
//                    }
//                }
//*/
//            }
//        }
//    });

    $('#tabla tbody').on('click', 'i[data-opc="edt"]', function (e) {
        var fila = tabla.row($(this).closest('tr'));

        console.log(fila);

        get("/ModFacturacion/ManteFacturasCSV/?data=" + opc_sel + "|" + celdas[1] + "|" + celdas[2], editarLista);

    //    fila.remove().draw();
    //    tabfac_det_ser.rows().every(function (rowIdx, tableLoop, rowLoop) {
    //        var data = this.data();
    //        data[1] = rowIdx + 1;
    //        this.data(data);
    //    });
    });



    btnRegresarLista.onclick = function () {
        document.getElementById("lista-lst").hidden = false;
        document.getElementById("lista-edt").hidden = true;
    }

    btnGuardar.onclick = function () {
        if (ControlesValidar() == 0) {
            var data = obtenerDatosGrabar();
            post("/ModFacturacion/ManteFacturasGrbCSV", mostrarGrabar, "grb|" + data);
        }
    }
    function mostrarNroCar(rpta) {
        txtNroCarAsignada.value = rpta;
    }

    //$('#tablatarjetas tbody').on('click', 'tr', function (e) {
    //    opc_sel_tar = e.target.dataset.opc;
    //    objfila = this;
    //    celdas = tablatarjetas.row(objfila).data();
    //    txtNroTar.value = celdas[3];
    //    if (!(opc_sel_tar === undefined)) {
    //        if (opc_sel_tar == 'sel') {
    //            var combo = document.getElementById("cboServicio");
    //            var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
    //            get("/ModFacturacion/ManteFacturasCSV/?data=tf|" + celdas[1] + "|" + celdas[3] + '|' + dtpFecha.value + '|' + valorOculto, recargar_detalle);
    //            //txtNroTarDes.value = '(' + celdas[3].substring(0, 4) + '-' + celdas[3].substring(4) + ') ';
    //            //MostrarTarjetas.hide();
    //        }
    //    }
    //});
    //function recargar_detalle(rpta) {
    //    var listas = rpta.split("¯");
    //    lista = listas[0].split("|");
    //    txtCodSer.value = lista[0];
    //    txtNroTar.value = lista[1];
    //    txtDUA.value = lista[2];
    //    txtId_Cotizacion.value = lista[3];
    //    txtNroCar.value = lista[4];
    //    txtFecCar.value = lista[5];
    //    txtFecNum.value = lista[6];
    //    txtBultos.value = format(lista[7]);
    //    txtMonto.value = format(lista[8]);
    //    if (lista[0] == 203) txtNroTarDes.value = '(' + lista[1].substring(0, 4) + '-' + lista[1].substring(4) + ') '
    //    else txtNroTarDes.value = lista[1]
    //    matriz = [];
    //    if (listas[1] != '') {
    //        lista = listas[1].split('¬');
    //        crearMatriz();
    //        tabfac_det = $('#tabfac_det').DataTable().clear().rows.add(matriz).draw();
    //        totalDocumento();
    //    }
    //    ajustarHeadersDataTables($('#tabfac_det'));
    //    MostrarTarjetas.hide();
    //}

    //$('#tabfac_det tbody').on('click', 'td', function () {
    //    var input = '';
    //    var celda = $(this);
    //    var Original = celda.text();
    //    var Indice = tabfac_det.column(this).index();
    //    var Fila = tabfac_det.row($(this).closest('tr'));

    //    if (Indice === 5 || Indice === 7) {
    //        if (!celda.find('input').length) {
    //            input = $('<input type="number" step="' + (Indice == 5 ? "0.01" : "1.00") + '" value="' + Original + '" style="width: 100%; height: 100%; box-sizing: border-box; border: 2px solid red; padding: 1px; margin: 0; font-size: inherit; text-align: inherit;">');
    //            celda.html(input);
    //            input.focus();
    //            input.on('input', function () { // Escucha el evento 'input'
    //                var CIF = (cboMoneda.value == 'PEN' ? Fila.cell(Fila.index(), 3).data() : Fila.cell(Fila.index(), 4).data()) * 1;
    //                if (Indice == 5) {
    //                    var PorTar = $(this).val() * 1;
    //                    var Resultado = ((CIF * PorTar / 100).toFixed(2)) * 1;
    //                    var TarMin = $(Fila.node()).find('td:eq(6)').text() * 1;
    //                    var Total = ((Resultado <= TarMin ? TarMin : Resultado) * 1).toFixed(2);
    //                    $(Fila.node()).find('td:eq(5)').text(Resultado);
    //                    $(Fila.node()).find('td:eq(7)').text(Total);
    //                    var filaData = Fila.data();
    //                    filaData[5] = PorTar;
    //                    filaData[6] = Resultado;
    //                    filaData[8] = Total;
    //                    //console.log(filaData);
    //                    //Fila.data(filaData);
    //                }
    //                if (Indice == 7) {
    //                    var TarMin = $(this).val().replace(/,/g, '') * 1;
    //                    var Resultado = $(Fila.node()).find('td:eq(5)').text().replace(/,/g, '') * 1;
    //                    var Total = ((Resultado <= TarMin ? TarMin : Resultado) * 1).toFixed(2);
    //                    $(Fila.node()).find('td:eq(7)').text(Total);
    //                    var filaData = Fila.data();
    //                    filaData[6] = Resultado;
    //                    filaData[7] = TarMin;
    //                    filaData[8] = Total;
    //                }
    //                totalDocumento();

    //                //var filaData = Fila.data();
    //                //filaData[5] = PorTar;
    //                //filaData[6] = Resultado;
    //                //Fila.data(filaData);
    //                //Fila.cell(Fila.index(), 5).data(Resultado); // Establece el dato
    //                //Fila.invalidate().draw(false); // Invalida la fila y redibuja
    //                //Fila.cell(Fila.index(), 5).data(Resultado).draw(false);
    //            });

    //            input.on('blur', function () {
    //                var newContent = $(this).val();
    //                //console.log(newContent);
    //                //if (Indice == 5) $(Fila.node()).find('td:eq(4)').text(newContent);
    //                //else $(Fila.node()).find('td:eq(6)').text(newContent);
    //                //console.log(newContent);
    //                celda.text(newContent);
    //                //var filaData = Fila.data();
    //                //var valorDOM = $(Fila.node()).find('td:eq(5)').text(); // Obtén el valor final del DOM
    //                //var totalDOM = $(Fila.node()).find('td:eq(7)').text(); // Obtén el valor final del DOM

    //                //filaData[Indice == 5 ? 5 : 7] = newContent;
    //                //filaData[6] = valorDOM;
    //                //filaData[8] = totalDOM;
    //                //Fila.data(filaData);
    //                //totalDocumento();

    //                //Fila.invalidate().draw(false);
    //            });

    //            input.on('keypress', function (e) {
    //                if (e.which === 13) {
    //                    this.blur();
    //                }
    //            });
    //        }
    //    }
    //});

    //$('#tabfac_det_ser tbody').on('click', 'td', function () {
    //    var textarea = '';
    //    var input = '';
    //    var celda = $(this);
    //    var Original = celda.html();
    //    var Indice = tabfac_det_ser.column(this).index();
    //    var Fila = tabfac_det_ser.row($(this).closest('tr'));

    //    if (Indice === 3) {
    //        if (!celda.find('textarea').length) {
    //            textarea = $('<textarea maxlength="500" rows="2" style="width: 100%; height: 100%; box-sizing: border-box; border: 2px solid red; padding: 1px; margin: 0; font-size: inherit; text-align: inherit;" oninput="this.value=this.value.toUpperCase();"></textarea>');
    //            textarea.val(Original.replace(/<br>/g, '\n'));
    //            celda.html(textarea);
    //            textarea.focus();
    //            textarea.on('blur', function () {
    //                var newContent = $(this).val().replace(/\r/g, '');
    //                var filaData = Fila.data();
    //                newContent = newContent.replace(/<br>/g, '\n');
    //                filaData[3] = newContent;
    //                newContent = newContent.replace(/\n/g, '<br>');
    //                celda.html(newContent);
    //            });
    //        }
    //    }

    //    if (Indice === 4 || Indice === 5) {
    //        if (!celda.find('input').length) {
    //            input = $('<input type="number" step="1" style="width: 100%; height: 100%; box-sizing: border-box; border: 2px solid red; padding: 1px; margin: 0; font-size: inherit; text-align: inherit;">');
    //            input.val(Original);
    //            celda.html(input);
    //            input.focus();
    //            input.on('input', function () {
    //                if (Indice == 4) {
    //                    var Cantid = $(this).val() * 1;
    //                    var Precio = $(Fila.node()).find('td:eq(5)').text() * 1;
    //                }
    //                if (Indice == 5) {
    //                    var Cantid = $(Fila.node()).find('td:eq(4)').text() * 1; 
    //                    var Precio = $(this).val() * 1;
    //                }
    //                var Total = (Cantid * Precio * 1).toFixed(2);
    //                $(Fila.node()).find('td:eq(6)').text(Total);
    //                var filaData = Fila.data();
    //                filaData[4] = Cantid;
    //                filaData[5] = Precio;
    //                filaData[6] = Total;
    //                totalDocumento();
    //            });

    //            input.on('blur', function () {
    //                var newContent = $(this).val();
    //                celda.text(newContent);
    //            });

    //            input.on('keypress', function (e) {
    //                if (e.which === 13) {
    //                    this.blur();
    //                }
    //            });
    //        }
    //    }
    //});

    //$('#tabfac_det_ser tbody').on('click', 'i[data-opc="anu"]', function (e) {
    //    var fila = tabfac_det_ser.row($(this).closest('tr'));
    //    fila.remove().draw();
    //    tabfac_det_ser.rows().every(function (rowIdx, tableLoop, rowLoop) {
    //        var data = this.data();
    //        data[1] = rowIdx + 1;
    //        this.data(data);
    //    });
    //    tabfac_det_ser.draw(false);
    //    totalDocumento();
    //});


    btnAgregarServicio.onclick = function () {
        $('#cboServiciosGrp').val('-1').trigger('change.select2');
        document.getElementById("servicios").hidden = false;
        btnAgregarServicio.disabled = true;
        btnGuardar.disabled = true;
    }
    btnCerrarServicio.onclick = function () {
        document.getElementById("servicios").hidden = true;
        document.getElementById("tbl_servicios").innerHTML = '';
        btnAgregarServicio.disabled = false;
        btnGuardar.disabled = false;
    }
}
function mostrarTipCam(rpta) {
    txtTipCam.value = rpta;
}
function cargaInicial(rpta) {
    listas = rpta.split("¯");
    lista = listas[1].split("¬");
    crearCombo(lista, "cboMoneda", "");
    lista = listas[2].split("¬");
    crearCombo(lista, "cboForPag", "");
    lista = listas[3].split("¬");
    crearCombo(lista, "cboCliPro", "** SELECCIONE CLIENTE **");
    get("/ModTablas/ManteCliProCSV/?data=lst|", mostrarLista);
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
    tabla.columns.adjust().draw();
    configurarFiltroCheckbox();
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
function editarLista(rpta) {
    ControlesLimpiar(document.getElementById('controles'));
    var listas = rpta.split("¯");
    var reg = listas[0].split('|');
    txtTipDoc.value = reg[0];
    cboServicio.disabled = true;
    $('#cboServicio').val(reg[1]).trigger('change.select2');
    txtNumDoc.value = reg[2];
    $('#cboMoneda').val(reg[3]).trigger('change.select2');
    $('#cboForPag').val(reg[4]).trigger('change.select2');
    dtpFecha.value = reg[5];
    $('#cboCliPro').val(reg[6]).trigger('change.select2');
    txtId_Cotizacion.value = reg[7];
    chkVarias.checked = (reg[8] == 0 ? true : false);
    txtCodSer.value = reg[8]*1 ;
    txtNroTar.value = reg[9]*1;
    if (chkVarias.checked) {
        txtNroTarDes.value = 'VARIAS TARJETAS';
        lupa.hidden = true;
        txtBultos.disabled = false;
        txtMonto.disabled = false;
    } else {
        if (reg[8] == 203) txtNroTarDes.value = '(' + reg[9].substring(0, 4) + '-' + reg[9].substring(4) + ') '
        else txtNroTarDes.value = reg[9]
        lupa.hidden = false;
        txtBultos.disabled = true;
        txtMonto.disabled = true;
        txtDias_Per.value = 0;
    }
    txtCorreo.value = reg[10];
    txtDUA.value = reg[11];
    txtNroCar.value = reg[12];
    txtFecCar.value = reg[13];
    txtFecNum.value = reg[14];
    dtpFecIni_Per.value = reg[15];
    txtDias_Per.value = reg[16];
    txtFecFin_Per.value = reg[17];
    txtTipCam.value = reg[18];
    txtDias.value = reg[19];
    txtFecVen.value = reg[20];
    txtBultos.value = format(reg[21]);
    txtMonto.value = format(reg[22]);
    txtPorIGV.value = reg[23];
    lblPorIGV.innerHTML = 'IGV(' + reg[23] + '%)';
    txtObs.value = reg[24];
    btnCerrarServicio.click();
    matriz = [];
    tabfac_det = $('#tabfac_det').DataTable().clear().rows.add(matriz).draw();
    tabfac_det_ser = $('#tabfac_det_ser').DataTable().clear().rows.add(matriz).draw();
    if (listas[1] != '') {
        lista = listas[1].split('¬');
        crearMatriz();
        tabfac_det = $('#tabfac_det').DataTable().clear().rows.add(matriz).draw();
        ajustarHeadersDataTables($('#tabfac_det'));
    }
    ajustarHeadersDataTables($('#tabfac_det'));
    if (listas[2] != '') {
        lista = listas[2].split('¬');
        crearMatriz();
        tabfac_det_ser = $('#tabfac_det_ser').DataTable().clear().rows.add(matriz).draw();
        ajustarHeadersDataTables($('#tabfac_det_ser'));
    }
    totalDocumento();

    if (opc_sel == 'con') {
        //controlesDisabled(document.getElementById('controles'));
        cboMoneda.disabled = true;
        cboForPag.disabled = true;
        dtpFecha.disabled = true;
        cboCliPro.disabled = true;
        chkVarias.disabled = true;
        lupa.disabled = true;
        txtNroTarDes.disabled = true;
        txtCorreo.disabled = true;
        dtpFecIni_Per.disabled = true;
        txtDias_Per.disabled = true;
        txtDias.disabled = true;
        det.disabled = true;
        tabfac_det_ser.disabled = true;
        btnAgregarServicio.disabled = true;
        btnGuardar.disabled = true;
    }
    if (opc_sel == 'edt') {
        //controlesEnabled(document.getElementById('controles'));
        cboMoneda.disabled = false;
        cboForPag.disabled = false;
        dtpFecha.disabled = false;
        cboCliPro.disabled = false;
        chkVarias.disabled = false;
        lupa.disabled = false;
        txtNroTarDes.disabled = false;
        txtCorreo.disabled = false;
        dtpFecIni_Per.disabled = false;
        txtDias_Per.disabled = false;
        txtDias.disabled = false;
        det.disabled = false;
        tabfac_det_ser.disabled = false;
        btnAgregarServicio.disabled = false;
        btnGuardar.disabled = false;
    }
    document.getElementById("lista-lst").hidden = true;
    document.getElementById("lista-edt").hidden = false;
}
function totalDocumento() {
    var totalSuma = 0.00;
    var PorIGV = txtPorIGV.value * 1;
    tabfac_det.rows().every(function () {
        var data = this.data();
        totalSuma += data[8] * 1;
    });
    tabfac_det_ser.rows().every(function () {
        var data = this.data();
        totalSuma += data[6] * 1;
    });
    lblVV.innerHTML = format(totalSuma.toFixed(2));
    let IGV = ((totalSuma * PorIGV / 100) * 1).toFixed(2);
    lblIGV.innerHTML = format(IGV);
    lblTotal.innerHTML = format((totalSuma + (IGV * 1)).toFixed(2));
    let total = totalSuma + (IGV * 1);
    let Base = total;
    let DetPor = "0.00"
    let DetSol = "0.00";
    let DetDol = "0.00";
    if (cboMoneda.value == "USD") {
        Base = (total * (txtTipCam.value * 1)).toFixed(2);
    }
    if (cboServicio.value == "FA02" || cboServicio.value == "FA04") {
        if (Base > 700) {
            DetPor = "12.00"
            if (cboMoneda.value == "PEN") {
                DetSol = (total * 0.12).toFixed(0);
            } else {
                DetDol = (total * 0.12).toFixed(2);
                DetSol = (DetDol * (txtTipCam.value * 1)).toFixed(0);
            }
        }
    }
    txtDetPor.value = DetPor;
    txtDetSol.value = DetSol;
    txtDetDol.value = DetDol;
};
function verificarVarias() {
    if (chkVarias.checked) {
        txtNroTar.value = 'VARIAS';
        txtNroTarDes.value = 'VARIAS TARJETAS';
        lupa.hidden = true;
        txtBultos.disabled = false;
        txtMonto.disabled = false;
        txtDias_Per.value = 30;
    } else {
        txtNroTar.value = '';
        txtNroTarDes.value = '';
        lupa.hidden = false;
        txtBultos.disabled = true;
        txtMonto.disabled = true;
        txtDias_Per.value = 0;
    }
}
function controles_disabled() {
    cboCliPro.disabled = true;
    cboMoneda.disabled = true;
    txtRefer.disabled = true;
    txtPor_Alm.disabled = true;
    txtTar_Min_Alm.disabled = true;
    txtPor_Seg.disabled = true;
    txtTar_Min_Seg.disabled = true;
    btnAgregarServicio.disabled = true;
    btnGuardarCotizacion.disabled = true;
}
function controles_enabled() {
    cboCliPro.disabled = false;
    cboMoneda.disabled = false;
    txtRefer.disabled = false;
    txtPor_Alm.disabled = false;
    txtTar_Min_Alm.disabled = false;
    txtPor_Seg.disabled = false;
    txtTar_Min_Seg.disabled = false;
    btnAgregarServicio.disabled = false;
    btnGuardarCotizacion.disabled = false;
}
function obtenerDatosGrabar() {
    var data = txtTipDoc.value + '|';
    data += cboServicio.value + txtNumDoc.value + '|';
    data += cboMoneda.value + '|';
    data += cboForPag.value + '|';
    data += dtpFecha.value + '|';
    data += cboCliPro.value + '|';
    data += txtCodSer.value * 1 + '|';
    data += txtNroTar.value * 1 + '|';
    data += txtCorreo.value + '|';
    data += txtId_Cotizacion.value * 1 + '|';
    data += dtpFecIni_Per.value + '|';
    data += txtDias_Per.value + '|';
    data += txtTipCam.value * 1 + '|';
    data += txtDias.value + '|';
    data += txtBultos.value.replace(/,/g, '') * 1 + '|';
    data += txtMonto.value.replace(/,/g, '') * 1 + '|';
    data += txtObs.value + '|';
    data += lblVV.innerHTML.replace(/,/g, '') * 1 + '|';
    data += txtPorIGV.value * 1 + '|';
    data += lblIGV.innerHTML.replace(/,/g, '') * 1 + '|';
    data += lblTotal.innerHTML.replace(/,/g, '') * 1 + '|';
    data += txtDetPor.value * 1 + '|';
    data += txtDetSol.value * 1 + '|';
    data += txtDetDol.value * 1 + '¯';

    var reg = [];
    var i = 0;
    tabfac_det.rows().every(function () {
        reg = this.data();
        data += (++i + '|' + reg[1] + '|' + reg[2] + '|' + (reg[3] * 1) + '|' + (reg[4] * 1) + '|' + (reg[5] * 1) + '|' + (reg[6] * 1) + '|' + (reg[7] * 1) + '|' + (reg[8] * 1) + '¬');
    });
    if (reg.length > 0) data = data.slice(0, -1);
    data += '¯';
    reg = [];
    i = 0;
    tabfac_det_ser.rows().every(function () {
        reg = this.data();
        data += (++i + '|' + reg[2] + '|' + reg[3] + '|' + (reg[4] * 1) + '|' + (reg[5] * 1) + '|' + (reg[6] * 1) + '¬');
    });
    if (reg.length > 0) data = data.slice(0, -1);
    return data;
}
function mostrarGrabar(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 'adi') {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8], lista[9], lista[10], lista[11], lista[12], lista[13]];
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
        document.getElementById("lista-edt").hidden = true;
        document.getElementById("lista-lst").hidden = false;
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