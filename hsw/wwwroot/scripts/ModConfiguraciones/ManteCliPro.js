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

// Tabla de Clientes
if (tabla.length) {
    tabla = $("#tabla").DataTable({

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
        language: idioma_espanol,
        //scrollY: '30vh',
        //scrollX: true,
        //paging: false,

        // Buttons with Dropdown
        buttons: [
            {
                text: '<i class="ri-add-line ri-16px me-md-2 align-baseline"></i><span class="d-md-inline-block d-none">Nuevo Cliente / Proveedor</span>',
                className: 'btn btn-primary waves-effect waves-light',
                action: function (e, dt, button, config) {
                    //window.location = 'app-invoice-add.html';


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
                // Código Cliente
                targets: 0,
                visible: false,
                render: function (data, type, full, meta) {
                    //var $invoice_id = full['codigo'];
                    var $codigo = full[0];
                    // Creates full output for row
                    var $row_output = $codigo;
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
                        '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill con-clipro" data-bs-placement="top" title="Consultar Cliente/Proveedor"><i class="ri-eye-line ri-20px"          style="color:blue"  data-opc="2"></i></a>' +
                        '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill edt-clipro" data-bs-placement="top" title="Editar Cliente/Proveedor"   ><i class="ri-pencil-line ri-20px"       style="color:green" data-opc="3"></i></a>' +
                        '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill del-clipro" data-bs-placement="top" title="Elimina Cliente/Proveedor"  ><i class="ri-delete-bin-7-line ri-20px" style="color:red"   data-opc="4"></i></a>' +
/*
                        '<div class="dropdown">' +
                        '<a href="javascript:;" class="btn btn-icon btn-sm btn-text-secondary waves-effect waves-light rounded-pill dropdown-toggle hide-arrow p-0" data-bs-toggle="dropdown"><i class="ri-more-2-line ri-20px"></i></a>' +
                        '<div class="dropdown-menu dropdown-menu-end">' +
                        '<a href="javascript:;" class="dropdown-item edita-clipro"><i class="ri-pencil-line"></i>Editar</a>' +
                        '<a href="app-invoice-edit.html" class="dropdown-item"><i class="ri-delete-bin-7-line"></i>Eliminar</a>' +
                        '</div>' +
                        '</div>' +
*/
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

    get("/ModConfiguraciones/ManteCliProCSV/?Data=2|", mostrarLista);

//    $('#tabla tbody').on('click', '.edt-clipro', function () {
//        objfila = $(this);
//        console.log(objfila)
//        console.log(tabla.row(objfila).data())
//        get("/ModConfiguraciones/ManteCliProCSV/?Data=4|" + tabla.row(objfila).data()[0] + "|", CliProEdt);
//        fetch('/ModConfiguraciones/ManteCliProCSV/?Data=3|')
        //funCliProAdiMod();
//    });

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