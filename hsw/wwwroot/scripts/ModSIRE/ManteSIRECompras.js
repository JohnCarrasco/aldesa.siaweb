/**
 * App Invoice List (jquery)
 */

//'use strict';

const modalElement = document.getElementById('CliProAdiMod');
// Inicializar el modal con Bootstrap
const CliProAdiMod = new bootstrap.Modal(modalElement);
const firstTab = modalElement.querySelector('.nav-tabs .nav-item button[data-bs-target="#navs-informacion-card"]');

var matriz = [];
var listas = [];
var lista = [];
var opc_sel = 0;

// Declaración de variables para la tabla
//var dt_clipro = $('.clipro-lista');
var tabla = $('#tabla');

if (tabla.length) {
    //var tableHeight = $(window).height() - 200;
    //scrollY: tableHeight + 'px',
    //scrollCollapse: true,

    tabla = $("#tabla").DataTable({
        data: matriz,
        language: idioma_espanol,
        scrollY: '45vh',
        scrollX: true,
        scrollCollapse: true,
        paging: false,

        // Buttons with Dropdown
        buttons: [
            {
                text: '<i class="ri-add-line ri-16px me-md-2 align-baseline"></i><span class="d-md-inline-block d-none">Nueva Compra</span>',
                className: 'btn btn-primary waves-effect waves-light',
                action: function (e, dt, button, config) {
                    get("/ModConfiguraciones/SIRE", "");
                    opc_sel = 1;
                    CliProLimpiar();
                    if (firstTab) {
                        new bootstrap.Tab(firstTab).show();
                    }
                    CliProAdiMod.show();
                }
            }
        ],
        columnDefs: [
            {
                targets: 0,
                responsivePriority: -1,
                searchable: false,
//                orderable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<div class="d-flex align-items-center">' +
                        '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill con-clipro" data-bs-placement="top" title="Consultar compra"><i class="ri-eye-line ri-20px"          style="color:blue"  data-opc="2"></i></a>' +
                        '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill edt-clipro" data-bs-placement="top" title="Editar compra"   ><i class="ri-pencil-line ri-20px"       style="color:green" data-opc="3"></i></a>' +
                        '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill del-clipro" data-bs-placement="top" title="Eliminar compra" ><i class="ri-delete-bin-7-line ri-20px" style="color:red"   data-opc="4"></i></a>' +
                        '</div>'
                    );
                }
            },
            { targets: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], className: "text-right", render: $.fn.dataTable.render.number(',', '.', 2) },
            { targets: 19, className: "text-right", render: $.fn.dataTable.render.number(',', '.', 3) }

/*
            { targets: 10, className: "text-right", render: $.fn.dataTable.render.number(',', '.', 2) },
            { targets: 11, className: "text-right", render: $.fn.dataTable.render.number(',', '.', 2) }

            {
                // Comprobante
                targets: 1,
                render: function (data, type, full, meta) {
                    var $comp = full[1];
                    return $comp;
                }
            },
            {
                targets: 2,
                render: function (data, type, full, meta) {
                    var $tipdoc = full[2];
                    return $tipdoc;
                }
            },
            {
                //Numero de Documento
                targets: 3,
                render: function (data, type, full, meta) {
                    var $numdoc = full[3];
                    return $numdoc;
                }
            },
            {
                //Fecha
                targets: 4,
                render: function (data, type, full, meta) {
                    var $fecha = full[4];
                    return $fecha;
                }
            },
            {
                //Fecha
                targets: 5,
                render: function (data, type, full, meta) {
                    var $nrodoc = full[5];
                    return $nrodoc;
                }
            },
            {
                //Fecha
                targets: 6,
                render: function (data, type, full, meta) {
                    var $razsoc = full[6];
                    return $razsoc;
                }
            },
            {
                //Fecha
                targets: 7,
                render: function (data, type, full, meta) {
                    var $tipmon = full[7];
                    return $tipmon;
                }
            }
*/
        ],


//        order: [[1, 'asc']],
        dom:
            '<"row mx-1"' +
            '<"col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-4 mt-md-0 mt-5"l<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start"B>>' +
            '<"col-12 col-md-6 d-flex align-items-center justify-content-end flex-column flex-md-row pe-3 gap-md-4"f<"invoice_status mb-5 mb-md-0">>' +
            '>t' +
            '<"row mx-2"' +
            '<"col-sm-12 col-md-6"i>' +
            '<"col-sm-12 col-md-6"p>' +
            '>'
//        responsive: true
    });
}

function iniciar() {
//    $("#loading-hsw").show();    
//    ajustarHeadersDataTables($('#tabla'));
//    mostrarMatriz();

    $('#card-rce').block({
        message: '<div class="d-flex justify-content-center"><p class="mb-0">Por favor espere...</p> <div class="sk-wave m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
        css: {
            backgroundColor: 'transparent',
            border: '0'
        },
        overlayCSS: {
            opacity: 0.5
        }
    });

    get("/ModSIRE/ManteSIREComprasCSV/?Data=1|", mostrarCombos);
    cboPeriodos.onchange = function () {
        if (cboPeriodos.value == -1) {
            btnConsultar.disabled = true;
            btnSolicitar.disabled = true;
            btnDescargar.disabled = true;
        } else {
            btnConsultar.disabled = false;
            btnSolicitar.disabled = false;
            btnDescargar.disabled = false;
        }
    }
    btnConsultar.onclick = function () {
        get("/ModSIRE/ManteSIREComprasCSV/?Data=5|" + cboPeriodos.value, mostrarLista);
    }
    btnSolicitar.onclick = function () {
        $('#card-rce').block({
            message: '<div class="d-flex justify-content-center"><p class="mb-0">Solicitando ticket...</p> <div class="sk-wave m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
            css: {
                backgroundColor: 'transparent',
                border: '0'
            },
            overlayCSS: {
                opacity: 0.5
            }
        });
        get("/ModSIRE/ManteSIREComprasCSV/?Data=2|" + cboPeriodos.value, mostrarTicket);
    }
    function mostrarTicket(rpta) {
        $('#card-rce').unblock();
        Swal.fire({
            title: '',
            text: 'Se ha generado el ticket nro. ' + rpta,
            imageUrl: assetsPath + 'img/hsw/sunat.jpg',
            imageWidth: 200,
            imageAlt: 'Custom image',
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false
        });
    }
    btnDescargar.onclick = function () {
        $('#card-rce').block({
            message: '<div class="d-flex justify-content-center"><p class="mb-0">Descargando propuesta periodo : ' + cboPeriodos.value + '&nbsp&nbsp</p> <div class="sk-wave m-0"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div> </div>',
            css: {
                backgroundColor: 'transparent',
                border: '0'
            },
            overlayCSS: {
                opacity: 0.5
            }
        });
        get("/ModSIRE/ManteSIREComprasCSV/?Data=3|" + cboPeriodos.value, mostrarDescarga);
    }
    function mostrarDescarga(rpta) {
        $('#card-rce').unblock();
        if (rpta == '') {
            Swal.fire({
                title: '',
                text: 'Se descargó propuesta',
                imageUrl: assetsPath + 'img/hsw/sunat.jpg',
                imageWidth: 200,
                imageAlt: 'Custom image',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                },
                buttonsStyling: false
            });
        } else {

        }
    }

    $('#tabla tbody').on('click', 'tr', function (e) {
        opc_sel = e.target.dataset.opc;
        if (!(opc_sel === undefined)) {
            if (opc_sel == 2 || opc_sel == 3) {
                objfila = $(this);
                get("/ModConfiguraciones/ManteCliProCSV/?Data=" + opc_sel + "|" + tabla.row(objfila).data()[0] + "|", CliProEdt);

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
                //    nrofila = $(this);
                //    Swal.fire({
                //        title: "¿ Está seguro desactivar el usuario " + tabla.row(nrofila).data()[1] + " ?",
                //        text: "! No se podrá revertir !",
                //        icon: "warning",
                //        showCancelButton: true,
                //        confirmButtonColor: "#3085d6",
                //        cancelButtonColor: "#d33",
                //        confirmButtonText: "! Sí, eliminar !"
                //    }).then((result) => {
                //        if (result.isConfirmed) {
                //            get("/ModContabilidad/SC_MantePlanCuentas/?Data=4|" + tabla.row(nrofila).data()[1] + "|", mostrarEliminar);
                //            tabla.row($(this)).remove().draw(false);
                //            Swal.fire({
                //                title: "! Eliminado !",
                //                text: "Usuario ha sido eliminado.",
                //                icon: "success"
                //            });
                //        }
                //    });
            }
        }
    });

}
function mostrarCombos(rpta) {
    if (rpta != "") {
        listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearCombo(lista, "cboPeriodos", "** Periodo **");
    }
    $('#card-rce').unblock();
//    $("#loading-hsw").hide();
}
function mostrarLista(rpta) {2
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
    //dt_clipro = $('.clipro-lista').DataTable().clear().rows.add(matriz).draw();
    dt_clipro = $('#tabla').DataTable().clear().rows.add(matriz).draw();
    //var dt_clipro = $('.clipro-lista');

    //ModalCliProAdiMod.addEventListener('onclick', function (e) {
    //    alert(e);
    //    if (e.key === 'Enter') Ingresar();
    //})

}

function mostrarPropuesta() {
    $("#loading-hsw").hide();
}

function CliProEdt(rpta) {
    CliProLimpiar();
    var reg = rpta.split('|');
    lblCodigo.innerHTML = reg[0];
    if (reg[1] == 1) chkCliente.checked = true;
    if (reg[2] == 1) chkProveedor.checked = true;
    $('#cboTipDocPer').val(reg[3]).trigger('change.select2');
    txtNroDoc.value = reg[4];
    txtRazSoc.value = reg[5];
    txtRazSoc_Comercial.value = reg[6];
    $('#cboNacionalidad').val(reg[7]).trigger('change.select2');
    if (reg[2] == 1 && reg[8] == 1) {
        chkAgente.checked = true;
        txtAgente_Porcen.value = reg[9];
    }
    $('#cboPais').val(reg[10]).trigger('change.select2');
    lblUbiGeo.innerHTML = reg[11];
    txtUbiGeo.value = reg[12];
    txtDirecc.value = reg[13];
    txtTelefono.value = reg[14];
    txtCelular.value = reg[15];
    txtContacto.value = reg[16];

    if (firstTab) {
        new bootstrap.Tab(firstTab).show();
    }
    //chkCliente.checked = false;
    //chkProveedor.checked = false;
    //$('#cboTipDocPer').val(-1).trigger('change.select2');
    //$('#cboNacionalidad').val(9589).trigger('change.select2');
    //txtNroDoc.value = '';
    //txtRazSoc.value = '';
    //txtRazSoc_Comercial.value = '';

    CliProAdiMod.show();
}
function CliProLimpiar() {
    eliminarMarcas();
    lblCodigo.innerHTML = 0;
    chkCliente.checked = false;
    chkProveedor.checked = false;
    $('#cboTipDocPer').val(-1).trigger('change.select2');
    txtNroDoc.value = '';
    txtRazSoc.value = '';
    txtRazSoc_Comercial.value = '';
    $('#cboNacionalidad').val(9589).trigger('change.select2');
    chkAgente.checked = false;
    txtAgente_Porcen.value = '';
    $('#cboPais').val(9589).trigger('change.select2');
    lblUbiGeo.innerHTML = '';
    txtUbiGeo.value = '';
    txtDirecc.value = '';
    txtTelefono.value = '';
    txtCelular.value = '';
    txtContacto.value = '';
    cliproCopias.innerHTML = '';
}
function eliminarMarcas() {
    removeRedMark('cboTipDocPer', 'txtNroDoc', 'txtRazSoc', 'txtRazSoc_Comercial', 'cboNacionalidad', 'cboPais', 'txtUbiGeo', 'txtDirecc');
}