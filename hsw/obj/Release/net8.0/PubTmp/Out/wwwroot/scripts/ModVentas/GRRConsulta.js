/**
 * App Invoice List (jquery)
 */

//'use strict';

var TipBus = 0;

var matriz = [];
var listas = [];
var lista = [];

// Declaración de variables para la tabla
//var dt_clipro = $('.clipro-lista');
var tabla = $('#tabla');

// Tabla de Clientes
if (tabla.length) {
    var tabla = $("#tabla").DataTable({

        //    var dt_invoice = dt_clipro.DataTable({
        data: matriz,
        /*
        ajax: assetsPath + 'json/invoice-list.json', // JSON file to add data
        columns: [
            // columns according to JSON
            { data: 'invoice_id' },
            { data: 'invoice_id' },
            { data: 'invoice_id' },
            { data: 'invoice_status' },
            { data: 'issued_date' },
            { data: 'client_name' },
            { data: 'total' },
            { data: 'balance' },
            { data: 'invoice_status' },
            { data: 'action' }
        ],
        */
        dom:
            '<"row mx-1"' +
            '<"col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-4 mt-md-0 mt-5"l<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start"B>>' +
            '<"col-12 col-md-6 d-flex align-items-center justify-content-end flex-column flex-md-row pe-3 gap-md-4"f<"invoice_status mb-5 mb-md-0">>' +
            '>t' +
            '<"row mx-2"' +
            '<"col-sm-12 col-md-6"i>' +
            '<"col-sm-12 col-md-6"p>' +
            '>',
        language: idioma_espanol,
        //scrollY: '60vh',
        //scrollX: true,
        //paging: false,

        //language: {
        //    sLengthMenu: 'Show _MENU_',
        //    search: '',
        //    searchPlaceholder: 'Search Invoice'
        //},
        // Buttons with Dropdown
        buttons: [
            {
                text: '<i class="ri-add-line ri-16px me-md-2 align-baseline"></i><span class="d-md-inline-block d-none">Nuevo Cliente / Proveedor</span>',
                className: 'btn btn-primary waves-effect waves-light',
                action: function (e, dt, button, config) {
                    //window.location = 'app-invoice-add.html';
                    //funCliProAdiMod();
                }
            }
        ],
        columnDefs: [
            {
                // Código Cliente
                targets: 0,
                visible: false,
                render: function (data, type, full, meta) {
                    //var $invoice_id = full['codigo'];
                    var $codigo = full[0];
                    // Creates full output for row
                    var $row_output =
                        '<div class="d-flex justify-content-start align-items-center">' +
                        '<a href="app-invoice-preview.html"><span>' + $codigo + '</span></a>' +
                        '</div>';
                    return $row_output;
                }
            },
            {
                targets: 1,
                responsivePriority: 0,
                render: function (data, type, full, meta) {
                    var $razsoc = full[1],
                        $nrodoc = full[2]

                    // Creates full output for row
                    var $row_output =
                        '<div class="d-flex justify-content-start align-items-center">' +
                        '<div class="d-flex flex-column">' +
                        '<p class="mb-0 fw-medium text-truncate text-heading">' +
                        $razsoc +
                        '</p>' +
                        '<small class="text-truncate">' +
                        $nrodoc +
                        '</small>' +
                        '</div>' +
                        '</div>';
                    return $row_output;
                }

            },
            {
                // Dirección y UBIGEO
                targets: 2,
                responsivePriority: 1,
                render: function (data, type, full, meta) {
                    var $direcc = full[3],
                        $ubigeo = full[4]

                    // Creates full output for row
                    var $row_output =
                        '<div class="d-flex justify-content-start align-items-center">' +
                        '<div class="d-flex flex-column">' +
                        '<p class="mb-0 fw-medium text-truncate text-heading">' +
                        $direcc +
                        '</p>' +
                        '<small class="text-truncate">' +
                        $ubigeo +
                        '</small>' +
                        '</div>' +
                        '</div>';
                    return $row_output;
                }
            },
            {
                // Actions
                targets: -1,
                responsivePriority: -1,
                title: 'Acciones',
                searchable: false,
                orderable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<div class="d-flex align-items-center">' +
                        '<a href="javascript:;" data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record" data-bs-placement="top" title="Elimina Cliente/Proveedor"><i class="ri-delete-bin-7-line ri-20px"></i></a>' +
                        '<a href="app-invoice-preview.html" data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill"  data-bs-placement="top" title="Consultar Cliente/Proveedor"><i class="ri-eye-line ri-20px"></i></a>' +
                        '<div class="dropdown">' +
                        '<a href="javascript:;" class="btn btn-icon btn-sm btn-text-secondary waves-effect waves-light rounded-pill dropdown-toggle hide-arrow p-0" data-bs-toggle="dropdown"><i class="ri-more-2-line ri-20px"></i></a>' +
                        '<div class="dropdown-menu dropdown-menu-end">' +
                        '<a href="javascript:;" class="dropdown-item edita-clipro"><i class="ri-pencil-line"></i>Editar</a>' +
                        '<a href="app-invoice-edit.html" class="dropdown-item"><i class="ri-delete-bin-7-line"></i>Eliminar</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    );
                }
            }

        ],
        order: [[1, 'asc']],
        dom:
            '<"row mx-1"' +
            '<"col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-4 mt-md-0 mt-5"l<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start"B>>' +
            '<"col-12 col-md-6 d-flex align-items-center justify-content-end flex-column flex-md-row pe-3 gap-md-4"f<"invoice_status mb-5 mb-md-0">>' +
            '>t' +
            '<"row mx-2"' +
            '<"col-sm-12 col-md-6"i>' +
            '<"col-sm-12 col-md-6"p>' +
            '>',
        responsive: true
    });
}

function iniciar() {
    btnEmitirGRR.addEventListener('click', function (event) {
        funGRRemitente();
    });

    get("/ModConfiguraciones/ManteCliProCSV/?Data=2|", mostrarLista);

    //$('#tabla tbody').on('click', '.edita-clipro', function () {
    //    funCliProAdiMod();
    //});

    // Modal id
    //const appModal = document.getElementById('CliProAdiMod');
    //appModal.addEventListener('show.bs.modal', function (event) {
    //    const wizardCreateApp = document.querySelector('#wizard-create-app');
    //    if (typeof wizardCreateApp !== undefined && wizardCreateApp !== null) {
    //        // Wizard next prev button
    //        const wizardCreateAppNextList = [].slice.call(wizardCreateApp.querySelectorAll('.btn-next'));
    //        const wizardCreateAppPrevList = [].slice.call(wizardCreateApp.querySelectorAll('.btn-prev'));
    //        const wizardCreateAppBtnSubmit = wizardCreateApp.querySelector('.btn-submit');

    //        const createAppStepper = new Stepper(wizardCreateApp, {
    //            linear: false
    //        });

    //        if (wizardCreateAppNextList) {
    //            wizardCreateAppNextList.forEach(wizardCreateAppNext => {
    //                wizardCreateAppNext.addEventListener('click', event => {
    //                    createAppStepper.next();
    //                    initCleave();
    //                });
    //            });
    //        }
    //        if (wizardCreateAppPrevList) {
    //            wizardCreateAppPrevList.forEach(wizardCreateAppPrev => {
    //                wizardCreateAppPrev.addEventListener('click', event => {
    //                    createAppStepper.previous();
    //                    initCleave();
    //                });
    //            });
    //        }

    //        if (wizardCreateAppBtnSubmit) {
    //            wizardCreateAppBtnSubmit.addEventListener('click', event => {
    //                alert('Submitted..!!');
    //            });
    //        }
    //    }
    //});

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
    //console.log(matriz);
    //dt_clipro = $('.clipro-lista').DataTable().clear().rows.add(matriz).draw();
    dt_clipro = $('#tabla').DataTable().clear().rows.add(matriz).draw();
    //var dt_clipro = $('.clipro-lista');

    //ModalCliProAdiMod.addEventListener('onclick', function (e) {
    //    alert(e);
    //    if (e.key === 'Enter') Ingresar();
    //})

}
function funGRRemitente() {
    //const dtpFecgaGR = document.querySelector('#dtpFechaGR');
    var GRRemitente = new bootstrap.Modal(document.getElementById('GRRemitente'));
    //chkCliente.checked = false;
    //chkProveedor.checked = false;
    //$('#cboTipDocPer').val(-1).trigger('change.select2');
    //$('#cboNacionalidad').val(9589).trigger('change.select2');
    //txtNroDoc.value = '';
    txtDestinatario.value = '';

    $('button[data-bs-target="#navs-direcciones-card"]').removeClass('active');
    $('button[data-bs-target="#navs-informacion-card"]').addClass('active');

    $('button[data-bs-target="#navs-direcciones"]').attr('aria-selected', 'false');
    $('button[data-bs-target="#navs-informacion-card"]').attr('aria-selected', 'true');

    $('#navs-direcciones-card').removeClass('show active');
    $('#navs-informacion-card').addClass('show active');

    GRRemitente.show();

    //if (dtpFecgaGR) {
    //    dtpFecgaGR.flatpickr({
    //        monthSelectorType: 'static'
    //    });
    //}

    // Manejar el evento de cambio en el campo de entrada
    //dtpFechaGR.addEventListener('input', function () {

    //    var inputValue = this.value.trim(); // Obtener el valor del campo y quitar espacios en blanco

    //    // Verificar si el valor tiene al menos 8 caracteres (DD/MM/YYYY)
    //    if (inputValue.length >= 8) {
    //        // Reorganizar el valor para el formato DD/MM/YYYY
    //        var parts = inputValue.split('-');
    //        if (parts.length === 3) {
    //            var formattedDate = parts[2].padStart(2, '0') + '/' + parts[1].padStart(2, '0') + '/' + parts[0];
    //            this.value = formattedDate; // Actualizar el valor del campo con el nuevo formato
    //        }
    //    }
    //});

}