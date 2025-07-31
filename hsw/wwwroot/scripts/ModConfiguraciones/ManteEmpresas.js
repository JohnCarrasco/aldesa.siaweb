var matriz = [];
var listas = [];
var lista = [];
var opc_sel = 0;

// Tabla de Empresas
var tabla = $('#tabla').DataTable({
    data: matriz,
    scrollY: '38vh',
    scrollX: true,
    paging: false,
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
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill empresa-con" data-bs-placement="top" title="Consultar empresa"><i class="ri-eye-line ri-20px"          style="color:blue"  data-opc="2"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill empresa-edt" data-bs-placement="top" title="Editar empresa"   ><i class="ri-pencil-line ri-20px"       style="color:green" data-opc="3"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill empresa-del" data-bs-placement="top" title="Eliminar empresa" ><i class="ri-delete-bin-7-line ri-20px" style="color:red"   data-opc="4"></i></a>' +
                    '</div>'
                );
            }
        },
        { targets: 1, visible: false },
        { targets: 2, width: '120px' }

/*
        { targets: 6, className: "text-end", orderable: false, render: $.fn.dataTable.render.number(',', '.', 2) }
*/
    ],
    dom: 'Bfrtip',
    buttons: [
        {
            text: '<i class="fas fa-file-excel"></i> Nueva Empresa',
            titleAttr: 'Nueva empresa',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_sel = 1;
                ControlesLimpiar();
                txtRUC.disabled = false;
                lblid_empresa.innerHTML = '0';
                EmpresaAdiMod.show();
            }
        }
    ]
});
// Obtener una referencia al modal
const EmpresaAdiMod = new bootstrap.Modal(document.getElementById('EmpresaAdiMod'));
function iniciar() {
    get("/ModConfiguraciones/ManteEmpresasCSV/?Data=1|", mostrarLista);
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
                txtRUC.disabled = true;
                get("/ModConfiguraciones/ManteEmpresasCSV/?Data=" + opc_sel + "|" + tabla.row(objfila).data()[1], ControlesEdt);

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

    btnGuardarEmpresa.onclick = function () {
        if (ControlesValidar() == 0) {
            var data = obtenerDatosGrabar();
            post("/ModConfiguraciones/ManteEmpresasGrbCSV", mostrarGrabar, "5|" + data);
        }
    }

    // Obtener todos los campos del formulario
    const campos = document.querySelectorAll('input[type="text"]');
    campos.forEach(campo => {
        campo.addEventListener('keypress', (event) => {
           // console.log('campo ' + campo.name);
            if (event.key === 'Enter') {
                console.log(event.key);
                const siguienteTabIndex = parseInt(campo.tabIndex) + 1;
                const siguienteCampo = document.querySelector(`[tabindex="${siguienteTabIndex}"]`);
                if (siguienteCampo) {
                    siguienteCampo.focus();
                }
            }
        });
    });

}

function mostrarGrabar(rpta) {
    EmpresaAdiMod.hide();

    //var mensaje = "";
    //if (rpta.substr(0, 5) != "Error") {
    //    $('#usuario-edt').modal('hide');
    //    if (operacion == 1) mensaje = "Se adicionó un registro";

    //    else
    //        if (operacion == 2) {
    //            celdas = tabla.row('.selected').data();
    //            celdas[1] = document.getElementById("cboEstablecimiento").options[document.getElementById("cboEstablecimiento").selectedIndex].innerText;
    //            celdas[2] = document.getElementById("txtUsuario").value;
    //            celdas[4] = document.getElementById("txtNroDoc").value;
    //            celdas[5] = document.getElementById("txtApePat").value + ' ' + document.getElementById("txtApeMat").value + ' ' + document.getElementById("txtNombre").value;
    //            celdas[6] = document.getElementById("txtTelefono").value;
    //            celdas[7] = document.getElementById("cboRol").options[document.getElementById("cboRol").selectedIndex].innerText;
    //            $('#tabla').dataTable().fnUpdate(celdas, '.selected', undefined, false);
    //            mensaje = "Se actualizó el registro";
    //        }
    //}
    //else {
    //    mensaje = rpta; // "Ocurrió un error al grabar";
    //}
    //alert(mensaje);
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
    dt_clipro = $('#tabla').DataTable().clear().rows.add(matriz).draw();
    ajustarHeadersDataTables($('#tabla'));
}
function ControlesEdt(rpta) {
    ControlesLimpiar();
    var reg = rpta.split('|');
    lblid_empresa.innerHTML = reg[0];
    txtRUC.value = reg[1];
    txtDescri.value = reg[2];
    txtDesAbr.value = reg[3];
    txtDirecc.value = reg[4];
    txtContacto.value = reg[5];
    txtTelefono.value = reg[6];
    txtUsuario.value = reg[7];
    txtClave.value = reg[8];
    txtclient_id.value = reg[9];
    txtcliente_secret.value = reg[10];
    txtDescri.focus();
    EmpresaAdiMod.show();
}
function ControlesLimpiar() {
    lblid_empresa.innerHTML = '';
    txtRUC.value = '';
    txtDescri.value = '';
    txtDesAbr.value = '';
    txtDirecc.value = '';
    txtContacto.value = '';
    txtTelefono.value = '';
    txtUsuario.value = '';
    txtClave.value = '';
    txtclient_id.value = '';
    txtcliente_secret.value = '';
}
function ControlesValidar() {
    eliminarMarcas();
    let validacion = 0;
    validacion += validaCampos('txtRUC', '');
    validacion += validaCampos('txtDescri', '');
    validacion += validaCampos('txtDesAbr', '');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcas() {
    removeRedMark('txtRUC', 'txtDescri', 'txtDesAbr');
}
function obtenerDatosGrabar() {
    var data = lblid_empresa.innerHTML + '|';
    data += txtRUC.value + '|';
    data += txtDescri.value + '|';
    data += txtDesAbr.value + '|';
    data += txtDirecc.value + '|';
    data += txtContacto.value + '|';
    data += txtTelefono.value + '|';
    data += txtUsuario.value + '|';
    data += txtClave.value + '|';
    data += txtclient_id.value + '|';
    data += txtcliente_secret.value;
    return data;
}