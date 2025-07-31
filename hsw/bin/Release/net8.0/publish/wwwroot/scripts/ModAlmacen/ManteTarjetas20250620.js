var listas = [];
var lista = [];
var matriz = [];
var matrizmov = [];
var operacion = 0;
var celdas = '';
var objfila;
var edicion = 1;
const tabAdjuntosButton = document.getElementById('tabAdjuntos'); // Usando el ID que añadimos
const fechaActual = new Date();
const dia = fechaActual.getDate().toString().padStart(2, '0');
const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
const anio = fechaActual.getFullYear();
const Hoy = `${anio}-${mes}-${dia}`;

// Tabla de Tarjetas
var tabla = $('#tabla').DataTable({
    data: matriz,
    compact: true,
    order: [1, 'desc'],
    scrollY: 'calc(100vh - 452px)',
    scrollX: true,
    paging: true,
    lengthChange: false,
    scrollCollapse: false,
    language: idioma_espanol,
    searching: true,
    //select: 'single',
    columnDefs: [
        {
            targets: 0,
            responsivePriority: 1,
            searchable: false,
            orderable: false,
            width: '80px',
            className: 'dt-body-center text-center',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center botones-tarjeta">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar tarjeta"><i class="ri-eye-line ri-20px"          style="color:blue"  data-opc="con"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Editar tarjeta"   ><i class="ri-pencil-line ri-20px"       style="color:green" data-opc="edt"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Eliminar tarjeta" ><i class="ri-delete-bin-7-line ri-20px" style="color:red"   data-opc="anu"></i></a>' +
                    '</div>'
                );
            }
        },
        {width: "5rem", "targets": 1, className: "text-end"},
        {
            width: "6rem", targets: [2,10,11], className: "text-center",
            render: function (data, type, row) {
                let fechaMostrar = moment(data).format('DD/MM/YYYY');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        },
        { "width": "4rem", "targets": [3], className: "text-center" },
        { "width": "30rem", "targets": [4] },
        { "width": "5rem", "targets": [5, 6], className: "text-end", render: $.fn.dataTable.render.number(',', '.', 0) },
        { "width": "6rem", "targets": [7, 8], className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) },
        { "width": "28rem", "targets": [9], orderable: false },
        { "width": "11rem", "targets": [12] }
    ],
    rowCallback: function (row, data, index) {
        $('td', row).css('font-weight', 'bold');         // <--- APLICA LA NEGRITA AQUÍ
    },
    dom: '<"controls"Bfl>rtip', // Agrupamos Botones, Filtro (checkbox), y buscador en "controls"
    buttons: [
        {
            text: '<i class="ri-file-line"></i> Nueva tarjeta',
            titleAttr: 'Nueva tarjeta',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                eliminarMarcas();
                if (cboServicio.value == -1) {
                    Swal.fire({
                        icon: 'error',
                        title: "¡ No a seleccionado ningún servicio !!!",
                        text: "Debe seleccionar un servicio.",
                        customClass: {
                            confirmButton: 'btn btn-primary waves-effect waves-light'
                        },
                        buttonsStyling: false
                    });
                } else {
                    opc_sel = 'adi';
                    edicion = 0;
                    get("/ModAlmacen/ManteTarjetasCSV/?data=nro|" + cboServicio.value + '|' + dtpFecha.value, mostrarNroReg);
                    function mostrarNroReg(rpta) {
                        txtNroTar.value = rpta;
                    }
                    txtDesSer.value = $('#cboServicio option:selected').text();
                    dtpFecha.value = Hoy;
                    $('#cboCliPro').val('-1').trigger('change.select2');
                    txtDirecc.value = '';
                    $('#cboAgencia').val('-1').trigger('change.select2');
                    txtNroDUAx.value = '';
                    dtpFecDUA.value = '';
                    $('#cboDestinacion').val('-1').trigger('change.select2');
                    txtManifiesto.value = '';
                    dtpFecVen.value = '';
                    $('#cboUbicacion').val('-1').trigger('change.select2');
                    txtDetalle_Manifiesto.value = '';
                    txtDAM.value = '';
                    $('#cboTemporal').val('-1').trigger('change.select2');
                    txtArancel.value = '';
                    dtpFecRef.value = '';
                    txtRefer.value = '';
                    txtVAPAVI.value = '';
                    txtNroCon.value = '';
                    txtObs.value = '';
                    txtCont20.value = '';
                    txtCont40.value = '';
                    txtMercancia_suelta.value = '';
                    $('#cboTipoMercancia').val('-1').trigger('change.select2');
                    $('#cbo_tipo_flamabilidad').val('-1').trigger('change.select2');
                    $('#cboBultos').val('-1').trigger('change.select2');
                    txtFOB.value = '';
                    txtDesMer.value = '';
                    txtFlete.value = '';
                    txtPrecinto.value = '';
                    chkMarca.checked = false;
                    txtSeguro.value = '';
                    txtAjuste.value = '';
                    //document.querySelector('.nav-pills .nav-item:first-child .nav-link').click();
                    document.querySelector('.nav-pills .nav-item:nth-child(2) .nav-link').click();
                    totalCIF();
                    document.getElementById("tarjeta-lst").hidden = true;
                    document.getElementById("tarjeta-edt").hidden = false;

                    if (tabAdjuntosButton) {
                        tabAdjuntosButton.setAttribute('disabled', 'disabled');
                        tabAdjuntosButton.classList.add('disabled'); // Añade la clase 'disabled' para estilo de Bootstrap
                        tabAdjuntosButton.setAttribute('aria-disabled', 'true'); // Mejora la accesibilidad
                        tabAdjuntosButton.removeAttribute('data-bs-toggle'); // Evita que se active al hacer clic
                    }

                    //    ControlesLimpiar();
                    //    txtRUC.disabled = false;
                    //    lblid_empresa.innerHTML = '0';
                    //    EmpresaAdiMod.show();
                }
            }
        }
    ]
});

var controlsContainer = $('.controls'); // Seleccionamos el contenedor "controls"
controlsContainer.append('<div class="filtro-buscador"><input type="checkbox" id="miCheckboxFiltroBuscador"><label for="miCheckboxFiltroBuscador">Mostrar todo</label></div>');
var searchWrapper = $('.dataTables_filter'); // Seleccionamos el contenedor del buscador
controlsContainer.append(searchWrapper); // Movemos el buscador al contenedor "controls" después del checkbox
var checkboxMostrarAnulados = $('#miCheckboxFiltroBuscador');

// Función para configurar el filtro y el evento del checkbox DESPUÉS de cargar los datos
function configurarFiltroCheckbox() {
    // Aplicar el filtro inicial para mostrar solo los NO anulados
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            const columna6 = data[6];
            return columna6.indexOf('0') === -1;
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
                    return columna6.indexOf('0') === -1;
                }
            );
        }
        tabla.draw();
    });
}

var tabladoc = $('#tabladoc').DataTable({
    data: matrizmov,
    scrollY: 'calc(100vh - 687px)',
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

// Obtener una referencia al modal
const tarjetaDoc = new bootstrap.Modal(document.getElementById('tarjeta-doc'));

// Tabla de Movimiento de Tarjetas
var tablamov = $('#tablamov').DataTable({
    data: matrizmov,
    scrollY: '38vh',
    //scrollX: true,
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
            width: '2rem',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar movimiento"><i class="ri-eye-line ri-20px" style="color:blue" data-opc="2"></i></a>' +
                    '</div>'
                );
            }
        },
        { "width": "3rem", "targets": 1, className: "text-end" },
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
        { "width": "6rem", "targets": 2, className: "text-center" },
        { "width": "30rem", "targets": 3, className: "dt-body-justify" },
        { "width": "4rem", "targets": [4, 6], className: "text-end", render: $.fn.dataTable.render.number(',', '.', 0) },
        { "width": "6rem", "targets": [5, 7], className: "text-end", render: $.fn.dataTable.render.number(',', '.', 2) }
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
    mostrarBloqueo('#tarjeta-lst'); 
    get("/ModAlmacen/ManteTarjetasCSV/?data=ini|", cargaInicial);
    cboServicio.onchange = function () {
        mostrarBloqueo('#tarjeta-lst');
        get("/ModAlmacen/ManteTarjetasCSV/?data=lst|" + cboServicio.value, mostrarTarjetas);
    }
    cboCliPro.onchange = function () {
        var combo = document.getElementById("cboCliPro");
        var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
        txtDirecc.value = valorOculto;
        if (edicion == 0) {
            get("/ModAlmacen/ManteTarjetasCSV/?data=cot|" + cboCliPro.value, mostrarCotizacion);
            if(opc_sel!='adi') edicion = 1;
        }
    }

    var selectedRow = null; // Variable para almacenar la fila actualmente seleccionada

    $('#tabla tbody').on('click', 'tr', function (e) {

        // Remover la clase de selección de la fila anterior (si existe)
        if (selectedRow) {
            $(selectedRow).removeClass('fila-seleccionada');
        }

        // Añadir la clase de selección a la fila clicada
        $(this).addClass('fila-seleccionada');
        selectedRow = this; // Actualizar la fila seleccionada

        // Opcional: Desplazar la vista para que la fila seleccionada sea visible
        // Esto puede ser útil si la tabla tiene scroll y la fila está fuera de la vista
        // selectedRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        opc_sel = e.target.dataset.opc;
        objfila = this;
        celdas = tabla.row(this).data();

        if (!(opc_sel === undefined)) {
            if (opc_sel == 'con' || opc_sel == 'edt') {
                edicion == 1;
                $(this).removeClass('selected');
                document.getElementById("tarjeta-det").hidden = true;
                get("/ModAlmacen/ManteTarjetasCSV/?data=" + opc_sel + "|" + cboServicio.value + "|" + celdas[1], editarTarjeta);
                if (tabAdjuntosButton) {
                    tabAdjuntosButton.removeAttribute('disabled');
                    tabAdjuntosButton.classList.remove('disabled'); // Remueve la clase 'disabled'
                    tabAdjuntosButton.setAttribute('aria-disabled', 'false'); // Restaura la accesibilidad
                    tabAdjuntosButton.setAttribute('data-bs-toggle', 'tab'); // Restaura la funcionalidad de Bootstrap
                }
            }
        }
    });
    $('#tabladoc tbody').on('click', 'i[data-opc="ver"]', function (e) {
        var fila = tabladoc.row($(this).closest('tr'));
        get("/ModAlmacen/ManteTarjetasVerCSV/?Data=ver|" + cboServicio.value + "|" + celdas[1] + "|" + fila.data()[1], mostrarDocumento);
    });
    $('#tabladoc tbody').on('click', 'i[data-opc="eli"]', function (e) {
        var fila = tabladoc.row($(this).closest('tr'));
        Swal.fire({
            title: "¿ Está seguro de eliminar documento adjunto " + fila.data()[4] + " ?",
            text: "! No se podrá revertir !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "! Sí, eliminar !",
            customClass: {
                confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                cancelButton: 'btn btn-outline-secondary waves-effect'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                post("/ModAlmacen/ManteTarjetasEliCSV", mostrarEliminarDoc, "eli|" + cboServicio.value + "|" + celdas[1] + "|" + fila.data()[1]);
                fila.remove().draw();
            }
        });
    });

    // Evento de teclado para navegar con las flechas
    $(document).on('keydown', function (e) {
        if (!selectedRow) return; // Salir si no hay ninguna fila seleccionada

        var currentRow = $(selectedRow);
        var nextRow;

        if (e.which === 38) { // Flecha hacia arriba (ArrowUp)
            nextRow = currentRow.prev('tr');
            if (nextRow.length) {
                currentRow.removeClass('fila-seleccionada');
                nextRow.addClass('fila-seleccionada');
                selectedRow = nextRow[0];
                const celdas = $(selectedRow).find('td');
                get("/ModAlmacen/ManteTarjetasCSV/?data=mov|" + cboServicio.value + "|" + $(celdas[1]).text(), mostrarTarjetaMov);

                // Desplazar la vista para que la nueva fila seleccionada sea visible
                selectedRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                e.preventDefault(); // Prevenir el desplazamiento de la página
            }
        } else if (e.which === 40) { // Flecha hacia abajo (ArrowDown)
            nextRow = currentRow.next('tr');
            if (nextRow.length) {
                currentRow.removeClass('fila-seleccionada');
                nextRow.addClass('fila-seleccionada');
                selectedRow = nextRow[0];
                const celdas = $(selectedRow).find('td');
                get("/ModAlmacen/ManteTarjetasCSV/?data=mov|" + cboServicio.value + "|" + $(celdas[1]).text(), mostrarTarjetaMov);

                // Desplazar la vista para que la nueva fila seleccionada sea visible
                selectedRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                e.preventDefault(); // Prevenir el desplazamiento de la página
            }
        }
    });



    const contenedorDePestanas = $('#ordenTabs');
    contenedorDePestanas.on('shown.bs.tab', function (e) {
        const pestanaActivada = $(e.target);
        const idPanelContenido = pestanaActivada.data('bs-target');
        if (idPanelContenido == '#navs-adjuntos') tabladoc.columns.adjust().draw();
    });

    txtFOB.addEventListener('input', totalCIF);
    txtFlete.addEventListener('input', totalCIF);
    txtSeguro.addEventListener('input', totalCIF);
    txtAjuste.addEventListener('input', totalCIF);

    btnGuardarTarjeta.onclick = function () {
        if (ControlesValidar() == 0) {
            var data = obtenerDatosGrabar();
            post("/ModAlmacen/ManteTarjetasGrbCSV", mostrarGrabar, "grb|" + data);
        }
    }

    btnGuardarDoc.onclick = function () {
        if (ControlesValidarDoc() == 0) {
            var frm = new FormData();
            frm.append("codser", cboServicio.value);
            frm.append("nrotar", celdas[1]);
            frm.append("TipDoc", cboTarjeta_td.value);
            frm.append("Obs", txtObsD.value);
            frm.append("File", fileAdjuntar.files[0]);
            post("/ModAlmacen/ManteTarjetasGrbPDF", mostrarGrabarDoc, frm)
            tarjetaDoc.hide();
        }
    }

    btnRegresarLista.onclick = function () {
        document.getElementById("tarjeta-lst").hidden = false;
        document.getElementById("tarjeta-edt").hidden = true;
        tabla.columns.adjust().draw();
        checkboxMostrarAnulados.trigger('change');
    }
}

function cargaInicial(rpta) {
    if (rpta != "") {
        var listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearCombo(lista, "cboServicio", "** SELECCIONE ALMACEN **");
        lista = listas[1].split("¬");
        crearCombo(lista, "cboCliPro", "** SELECCIONE CLIENTE **");
        lista = listas[2].split("¬");
        crearCombo(lista, "cboAgencia", "** SELECCIONE AGENCIA **");
        lista = listas[3].split("¬");
        crearCombo(lista, "cboDestinacion", "** SELECCIONE DESTINO **");
        lista = listas[4].split("¬");
        crearCombo(lista, "cboUbicacion", "** SELECCIONE UBICACION **");
        lista = listas[5].split("¬");
        crearCombo(lista, "cboTemporal", "** SELECCIONE TEMPORAL **");
        lista = listas[6].split("¬");
        crearCombo(lista, "cboTipoMercancia", "** SELECCIONE TIPO MERCANCIA **");
        lista = listas[7].split("¬");
        crearCombo(lista, "cboBultos", "** SELECCIONE TIPO BULTO **");
        lista = listas[8].split("¬");
        crearCombo(lista, "cboTarjeta_td", "** SELECCIONE TIPO  DE DOCUMENTO **");
        $('#cboServicio').val('201').trigger('change.select2');
        //$('#tarjeta-lst').unblock();
    }
}
function mostrarTarjetas(rpta) {
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
    tabla.columns.adjust().draw();
    configurarFiltroCheckbox();
    $('#tarjeta-lst').unblock();
}
function mostrarTarjetaMov(rpta) {
    matriz = [];
    if (rpta != "") {
        var listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearMatriz();
    }
    mostrarMatrizMov();
}
function mostrarMatrizMov(rpta) {
    tablamov = $('#tablamov').DataTable().clear().rows.add(matriz).draw();
    document.getElementById("tarjeta-det").hidden = false;
    tablamov.columns.adjust().draw();
}
function editarTarjeta(rpta) {
    //ControlesLimpiar();
    eliminarMarcas();
    listas = rpta.split("¯");
    var reg = listas[0].split('|');
    data = '';
    if (listas[0] != '') {
        txtid_cotizacion.value = reg[0];
        dtpFechaC.value = reg[1];
        txtNroCar.value = reg[2];
        txtMoneda.value = reg[3];
        lista = listas[1].split("¬");
        reg = lista[0].split('|');
        let i = 0;
        var grupo = '';
        for (i = 0; i < lista.length; i++) {
            reg = lista[i].split('|');
            if (grupo != reg[1]) {
                if (i > 0) {
                    data += '</tbody>';
                    data += '</table>';
                }
                grupo = reg[1];
                data += '<h6><strong>' + reg[1] + '</strong></h6>';
                data += '<table class="table table-bordered table-striped table-hover table-sm">';
                data += '<thead>';
                data += '<tr>';
                data += '<th class="text-center" style="background-color:#2F75B5!important;color:white;">Servicio</th>';
                data += '<th class="text-center" style="background-color:#2F75B5!important;color:white;">Precio</th>';
                data += '</tr>';
                data += '</thead>';
                data += '<tbody>';
            }
            data += '<tr>';
            data += '<td style="text-align:left">' + reg[3] + '</td>';
            data += '<td style="text-align:right">' + reg[4] + '</td>';
            data += '</tr>';
        }
        if (i > 0) {
            data += '</tbody>';
            data += '</table>';
        }
    }
    document.getElementById("div_cotidet").innerHTML = data;
    reg = listas[2].split("|");
    txtNroTar.value = reg[0];
    txtDesSer.value = reg[1];
    dtpFecha.value = reg[2];
    $('#cboCliPro').val(reg[3]).trigger('change.select2');
    txtDirecc.value = reg[4];
    $('#cboAgencia').val(reg[5]).trigger('change.select2');
    txtNroDUAx.value = reg[6];
    dtpFecDUA.value = reg[7];
    $('#cboDestinacion').val(reg[8]).trigger('change.select2');
    txtManifiesto.value = reg[9];
    dtpFecVen.value = reg[10];
    $('#cboUbicacion').val(reg[11]).trigger('change.select2');
    txtDetalle_Manifiesto.value = reg[12];
    txtDAM.value = reg[13];
    $('#cboTemporal').val(reg[14]).trigger('change.select2');
    txtArancel.value = reg[15];
    dtpFecRef.value = reg[16];
    txtRefer.value = reg[17];
    txtVAPAVI.value = reg[18];
    txtNroCon.value = reg[19];
    txtObs.value = reg[20];
    txtCont20.value = reg[21];
    txtCont40.value = reg[22];
    txtMercancia_suelta.value = reg[23];
    $('#cboTipoMercancia').val(reg[24]).trigger('change.select2');
    $('#cbo_tipo_flamabilidad').val(reg[25]).trigger('change.select2');
    $('#cboBultos').val(reg[26]).trigger('change.select2');
    txtFOB.value = reg[27];
    txtDesMer.value = reg[28];
    txtFlete.value = reg[29];
    txtPrecinto.value = reg[30];
    chkMarca.checked = (reg[31] == 1 ? true : false);
    txtSeguro.value = reg[32];
    txtAjuste.value = reg[33];
    document.querySelector('.nav-pills .nav-item:nth-child(2) .nav-link').click();
    totalCIF();

    matriz = [];
    if (listas[3] != "") {
        lista = listas[3].split("¬");
        crearMatriz();
        tabladoc = $('#tabladoc').DataTable().clear().rows.add(matriz).draw();
    }
    document.getElementById("tarjeta-lst").hidden = true;
    document.getElementById("tarjeta-edt").hidden = false;
}
function mostrarCotizacion(rpta) {
    data = '';
    txtid_cotizacion.value = '';
    dtpFechaC.value = '';
    txtNroCar.value = '';
    txtMoneda.value = '';
    if (rpta != '') {
        listas = rpta.split("¯");
        var reg = listas[0].split('|');
        txtid_cotizacion.value = reg[0];
        if (reg[1]!='0000-00-00') dtpFechaC.value = reg[1];
        txtNroCar.value = reg[2];
        txtMoneda.value = reg[3];
        lista = listas[1].split("¬");
        reg = lista[0].split('|');
        let i = 0;
        var grupo = '';
        for (i = 0; i < lista.length; i++) {
            reg = lista[i].split('|');
            if (grupo != reg[1]) {
                if (i > 0) {
                    data += '</tbody>';
                    data += '</table>';
                }
                grupo = reg[1];
                data += '<h6><strong>' + reg[1] + '</strong></h6>';
                data += '<table class="table table-bordered table-striped table-hover table-sm">';
                data += '<thead>';
                data += '<tr>';
                data += '<th class="text-center" style="background-color:#2F75B5!important;color:white;">Servicio</th>';
                data += '<th class="text-center" style="background-color:#2F75B5!important;color:white;">Precio</th>';
                data += '</tr>';
                data += '</thead>';
                data += '<tbody>';
            }
            data += '<tr>';
            data += '<td style="text-align:left">' + reg[3] + '</td>';
            data += '<td style="text-align:right">' + reg[4] + '</td>';
            data += '</tr>';
        }
        if (i > 0) {
            data += '</tbody>';
            data += '</table>';
        }
    }
    document.getElementById("div_cotidet").innerHTML = data;
}
function totalCIF() {
    var totalSuma = txtFOB.value * 1 + txtFlete.value * 1 + txtSeguro.value * 1 + txtAjuste.value * 1;
    txtCIF.value = totalSuma.toFixed(3);
};

/**
 * Muestra un documento decodificado en Base64.
 * Espera una cadena en formato "nombreArchivo.ext|contenidoBase64".
 * Puede abrir PDFs directamente y permite la extensión para otros tipos.
 *
 * @param {string} rpta La cadena de respuesta del servidor (ej. "documento.pdf|JVBERi0xLjQ...").
 */
function mostrarDocumento(rpta) {
    if (!rpta || typeof rpta !== 'string' || rpta.indexOf('|') === -1) {
        console.error("Formato de respuesta inválido para mostrar documento:", rpta);
        // Si tienes Swal (SweetAlert2) disponible, úsalo para notificar al usuario.
        if (typeof Swal !== 'undefined') {
            Swal.fire('Error', 'Formato de datos de documento inválido. Contacte a soporte.', 'error');
        } else {
            alert('Error: Formato de datos de documento inválido.');
        }
        return;
    }

    try {
        const reg = rpta.split('|');
        const fileName = reg[0];
        const base64Content = reg[1];

        if (!base64Content) {
            console.error("Contenido Base64 vacío para el archivo:", fileName);
            if (typeof Swal !== 'undefined') {
                Swal.fire('Advertencia', 'El contenido del documento está vacío.', 'warning');
            } else {
                alert('Advertencia: El contenido del documento está vacío.');
            }
            return;
        }

        const ext = fileName.split('.').pop().toLowerCase();
        let mimeType = '';

        // Determinar el tipo MIME basado en la extensión
        // Lo ideal es que el backend envíe este tipo MIME directamente.
        switch (ext) {
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'png':
                mimeType = 'image/png';
                break;
            case 'jpg':
            case 'jpeg':
                mimeType = 'image/jpeg';
                break;
            case 'gif':
                mimeType = 'image/gif';
                break;
            case 'txt':
                mimeType = 'text/plain';
                break;
            case 'doc':
                mimeType = 'application/msword';
                break;
            case 'docx':
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case 'xls':
                mimeType = 'application/vnd.ms-excel';
                break;
            case 'xlsx':
                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            // Añade más casos para otros tipos de archivo que tu aplicación pueda manejar
            default:
                mimeType = 'application/octet-stream'; // Tipo genérico para binarios desconocidos
                console.warn(`Tipo de archivo desconocido para la extensión: .${ext}. Usando application/octet-stream.`);
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Información', `Extensión de archivo .${ext} no reconocida. Se intentará abrir como un archivo genérico.`, 'info');
                }
                break;
        }

        // Decodificar Base64 a un ArrayBuffer
        // atob() decodifica la cadena Base64 a una cadena binaria.
        const binaryString = atob(base64Content);
        const len = binaryString.length;
        // Uint8Array representa un array de enteros de 8 bits sin signo (bytes).
        const bytes = new Uint8Array(new ArrayBuffer(len));
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Crear un Blob a partir del Array de Bytes y el tipo MIME
        const blob = new Blob([bytes], { type: mimeType });

        // Crear una URL de objeto para el Blob
        const fileURL = URL.createObjectURL(blob);

        // Abrir la URL en una nueva ventana/pestaña
        const newWindow = window.open(fileURL, '_blank'); // '_blank' es buena práctica para nuevas pestañas

        // Revocar la URL del objeto después de un tiempo para liberar memoria
        // Esto es un intento. El navegador a veces limpia automáticamente
        // cuando la pestaña que abrió el URL se cierra, pero es bueno ser explícito.
        if (newWindow) {
            // Un breve retardo para permitir que el navegador comience a cargar el recurso.
            // La liberación en este punto es más una optimización si la ventana permanece abierta.
            // Si la ventana se cierra, el navegador lo limpia eventualmente.
            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
                // console.log('Blob URL revocado:', fileURL);
            }, 30000); // Revocar después de 30 segundos
        } else {
            // Esto puede ocurrir si el navegador bloquea los pop-ups.
            console.warn("La ventana emergente fue bloqueada por el navegador.");
            if (typeof Swal !== 'undefined') {
                Swal.fire('Advertencia', 'El navegador ha bloqueado la ventana emergente. Por favor, permítalas para ver el documento.', 'warning');
            }
        }

    } catch (error) {
        console.error("Error al mostrar el documento:", error);
        if (typeof Swal !== 'undefined') {
            Swal.fire('Error', 'No se pudo procesar el documento. Intente de nuevo o contacte a soporte.', 'error');
        } else {
            alert('Error: No se pudo procesar el documento.');
        }
    }
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
function ControlesValidar() {
    //eliminarMarcas();
    let validacion = 0;
    validacion += validaCampoComboConFeedback('cboCliPro');
    validacion += validaCampoComboConFeedback('cboAgencia');
    validacion += validaCampos('txtNroDUAx', '');
    validacion += validaCampos('dtpFecDUA', '');
    validacion += validaCampoComboConFeedback('cboDestinacion');
    validacion += validaCampos('dtpFecVen', '');
    validacion += validaCampos('txtDAM', '');
    validacion += validaCampoComboConFeedback('cboTipoMercancia');
    return (validacion != 0) ? 1 : 0;
}
function ControlesValidarDoc() {
    //eliminarMarcas();
    let validacion = 0;
    validacion += validaCampoComboConFeedback('cboTarjeta_td');
    validacion += validaCampos('fileAdjuntar', '');
    return (validacion != 0) ? 1 : 0;
}
function obtenerDatosGrabar() {
    var data = cboServicio.value + '|';
    data += txtNroTar.value + '|';
    data += dtpFecha.value + '|';
    data += cboCliPro.value + '|';
    data += txtid_cotizacion.value * 1 + '|';
    data += cboAgencia.value + '|';
    data += txtNroDUAx.value + '|';
    data += dtpFecDUA.value + '|';
    data += cboDestinacion.value + '|';
    data += txtManifiesto.value + '|';
    data += dtpFecVen.value + '|';
    data += cboUbicacion.value * 1 + '|';
    data += txtDetalle_Manifiesto.value + '|';
    data += txtDAM.value + '|';
    data += cboTemporal.value + '|';
    data += txtArancel.value + '|';
    data += dtpFecRef.value + '|';
    data += txtRefer.value + '|';
    data += txtVAPAVI.value + '|';
    data += txtNroCon.value + '|';
    data += txtObs.value + '|';
    data += txtCont20.value * 1 + '|';
    data += txtCont40.value * 1 + '|';
    data += txtMercancia_suelta.value * 1 + '|';
    data += cboTipoMercancia.value * 1 + '|';
    data += cbo_tipo_flamabilidad.value * 1 + '|';
    data += cboBultos.value + '|';
    data += txtFOB.value * 1 + '|';
    data += txtDesMer.value + '|';
    data += txtFlete.value * 1 + '|';
    data += txtPrecinto.value + '|';
    data += (chkMarca.checked ? 1 : 0) + '|';
    data += txtSeguro.value * 1 + '|';
    data += txtAjuste.value * 1 + '¯';
    //var reg = [];
    //var i = 0;
    //tabfac_det.rows().every(function () {
    //    reg = this.data();
    //    data += (++i + '|' + reg[1] + '|' + reg[2] + '|' + (reg[3] * 1) + '|' + (reg[4] * 1) + '|' + (reg[5] * 1) + '|' + (reg[6] * 1) + '|' + (reg[7] * 1) + '|' + (reg[8] * 1) + '¬');
    //});
    //if (reg.length > 0) data = data.slice(0, -1);
    return data;
}
function mostrarGrabar(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 'adi') {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8], lista[9], lista[10], lista[11], lista[12]];
            tabla.row.add(fila).draw();
            mensaje = "Orden adicionada";
        }
        if (opc_sel == 'edt') {
            lista = rpta.split("|");
            celdas[2] = lista[2];
            celdas[3] = lista[3];
            celdas[4] = lista[4];
            celdas[5] = lista[5];
            celdas[6] = lista[6];
            celdas[7] = lista[7];
            celdas[8] = lista[8];
            celdas[9] = lista[9];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Orden actualizada";
        }
        if (opc_sel == 'anu') {
            lista = rpta.split("|");
            celdas[7] = lista[7];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Orden anulada";
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
        document.getElementById("tarjeta-edt").hidden = true;
        document.getElementById("tarjeta-lst").hidden = false;
        tabla.columns.adjust().draw();
    }
    else {
        mensaje = rpta; // "Ocurrió un error al grabar";
    }
}
function mostrarGrabarDoc(rpta) {
    lista = rpta.split("|");
    var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7]];
    tabladoc.row.add(fila).draw();
    mensaje = "Documento anexado";
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
function mostrarEliminarDoc(rpta) {
    mensaje = "Documento eliminado";
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

/**
 * Valida un elemento <select> (especialmente si está mejorado con Select2)
 * y muestra/oculta el mensaje de invalid-feedback.
 *
 * @param {string} idSelect - El ID del elemento <select> (ej. 'cboCliPro').
 * @returns {number} 1 si la validación falla (no hay opción seleccionada), 0 si es exitosa.
 */
function validaCampoComboConFeedback(idSelect) {

    const selectElement = $('#' + idSelect);
    const valorSeleccionado = selectElement.val();
    const select2VisualElement = selectElement.next('.select2-container').find('.select2-selection--single');
    const feedbackDiv = $('#feedback-' + idSelect);

    if (valorSeleccionado === "-1") {
        select2VisualElement.addClass('is-invalid');
        selectElement.addClass('is-invalid');
        selectElement.removeClass('is-valid');
        feedbackDiv.removeClass('d-none').addClass('d-block');
        return 1;
    } else {
        select2VisualElement.removeClass('is-invalid');
        selectElement.removeClass('is-invalid');
        selectElement.addClass('is-valid');
        feedbackDiv.removeClass('d-block').addClass('d-none');
        return 0;
    }
}

function eliminarMarcas() {
    removeRedMark('cboCliPro', 'cboAgencia', 'txtNroDUAx', 'dtpFecDUA', 'cboDestinacion', 'dtpFecVen', 'txtDAM', 'cboTipoMercancia');
}
function removeRedMark() {
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i].toLowerCase().includes('cbo')) {
            limpiarValidacionSelect2(arguments[i]);
        } else {
            $('#' + arguments[i]).removeClass("is-invalid");
            var variable = document.getElementById(arguments[i]).parentNode;
            if (variable.querySelector('span')) variable.querySelector('span').classList.remove('is-invalid')
        }
    }
}
function limpiarValidacionSelect2(idSelect) {
    const selectElement = $('#' + idSelect); // Selecciona el select original por su ID
    selectElement.next('.select2-container')
        .find('.select2-selection.select2-selection--single')
        .removeClass('is-invalid');

    // Encuentra el div de feedback asociado y lo oculta (si usa el patrón 'feedback-' + id)
    const feedbackDiv = $('#feedback-' + idSelect);
    if (feedbackDiv.length) { // Asegura que el div de feedback exista
        feedbackDiv.removeClass('d-block').addClass('d-none');
    }
}
