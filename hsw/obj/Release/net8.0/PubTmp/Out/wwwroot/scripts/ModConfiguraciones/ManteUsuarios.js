var listas = [];
var lista = [];
var matriz = [];
var opc_sel = 0;
var objfila;
var tabla = $("#tabla").DataTable({
    data: matriz,
    order: [4, 'asc'],
    scrollX: true,
    scrollY: '42vh',
    paging: false,
    columnDefs: [
        {
            data: null, width: "70px", targets: 0, render: function (data, type, row) {
                return '<a title="Editar Usuario"             class="fa fa-edit fa-lg"        style="cursor:pointer;color:blue"   data-opc="2"></a>&nbsp;&nbsp;' +
                       '<a title="Restablecer Contraseña"     class="fa fa-user-secret fa-lg" style="cursor:pointer;color:green"  data-opc="3"></a>&nbsp;&nbsp;' +
                       '<a title="Activar/Desactivar Usuario" class="fa fa-trash-o fa-lg"     style="cursor:pointer;color:red"    data-opc="4"></a>&nbsp;'
            },
            className: "text-center",
            orderable: false
        },
        { "width": "35px", "targets": [1], visible: false },
        { "width": "200px", "targets": [2] },
        { "width": "100px", "targets": [3] },
        { "width": "40px", "targets": [4], visible: false },
        { "width": "50px", "targets": [5], className: "text-center" },
        { "width": "320px", "targets": [6] },
        { "width": "80px", "targets": [7] },
        { "width": "80px", "targets": [8] },
        { "width": "80px", "targets": [9], className: "text-center" },
        { "width": "100px", "targets": [10] },
        { "width": "120px", "targets": [11] },
        { "width": "100px", "targets": [12] },
        { "width": "120px", "targets": [13] },
        { "width": "100px", "targets": [14] },
        { "width": "120px", "targets": [15] }
    ],
    language: idioma_espanol,
    dom: 'Bfrtip',
    rowCallback: function (row, data, index) {
        //                if (data[7] == '&lt;ACTIVADO&gt;') $('td', row).css('background-color', 'Blue');
        if (data[3] * 1 == 0) {
            $('td', row).css('background-color', 'Yellow');
            $('td', row).css('color', 'Black');
        }
        if (data[8] == '*DESACTIVADO*') {
            $('td', row).css('background-color', 'Black');
            $('td', row).css('color', 'White');
        }
    },
    buttons: [
        {
            text: '<i class="fa fa-folder-o"></i> Nuevo Usuario ',
            titleAttr: ' Nuevo Usuario',
            className: 'btn btn-primary btn-mini waves-effect waves-light',
            action: function (e, dt, node, config) {
                opc_sel = 1;
                limpiarModal();
                tit_modal.innerHTML = 'Añadir Usuario';
                 document.getElementById("txtUsuario").disabled = false;
                dvClave1.style.display = 'block';
                dvClave2.style.display = 'block';
                $("#usuario-edt").modal();
            }
        },
        {
            text: '<i class="fa fa-file-excel-o"></i> Excel ',
            titleAttr: 'Exportar a Excel',
            className: 'btn btn-success btn-mini waves-effect waves-light',
            action: function (e, dt, node, config) {
                var idCboEstablecimiento = document.getElementById("cboEstablecimientos").value;
                var Activos = document.getElementById("chkActivos").checked ? 1 : 0;
                navegar("/ModUtilitarios/ObtenerUsuariosXLS/?data=" + idCboEstablecimiento + '|' + Activos);
            }
        }
    ]
});
function iniciar() {

    $('#usuario-edt').draggable();
    $("#clave-edt").draggable();

    get("/ModConfiguraciones/ManteUsuariosCSV/?Data=1|-1|1|", mostrarEstablecimientos);
    function mostrarEstablecimientos(rpta){
        if (rpta != "") {
            var listas = rpta.split("¯");
            lista = listas[0].split("¬");
            crearCombo(lista, "cboEstablecimientos", "<< TODOS >>");
            crearCombo(lista, "cboEstablecimiento", "** SELECCIONE ESTABLECIMIENTO **");
            lista = listas[1].split("¬");
            crearCombo(lista, "cboTipDocPer", "** SELECCIONE TIPO DE DOCUMENTO **");
            lista = listas[2].split("¬");
            crearCombo(lista, "cboRol", "** SELECCIONE ROL **");
            get("/ModConfiguraciones/ManteUsuariosCSV/?Data=2|-1|1|", mostrarLista);
            }
    }
    cboEstablecimientos.onchange = function () {
        var idCboEstablecimiento = cboEstablecimientos.value;
        var Activos = chkActivos.checked ? 1 : 0;
        get("/ModConfiguraciones/ManteUsuariosCSV/?Data=2|" + idCboEstablecimiento + "|" + Activos + "|", mostrarLista);
    }
    chkActivos.onchange = function () {
        var idCboEstablecimiento = cboEstablecimientos.value;
        var Activos = chkActivos.checked ? 1 : 0;
        get("/ModConfiguraciones/ManteUsuariosCSV/?Data=2|" + idCboEstablecimiento + "|" + Activos + "|", mostrarLista);
    }
    $('#tabla tbody').on('click', 'tr', function (e) {
        opc_sel = e.target.dataset.opc;
        if (!(opc_sel === undefined)) {
            if (opc_sel == 2) {
                tit_modal.innerHTML = 'Editar Usuario';
                txtUsuario.disabled = true;
                dvClave1.style.display = 'none';
                dvClave2.style.display = 'none';
                objfila = $(this);
                get("/ModConfiguraciones/ManteUsuariosCSV/?Data=4|" + tabla.row(objfila).data()[1] + "|", editarModal);
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

    btnCerrar.onclick = function () {
        //$('#usuario-edt').removeClass('md-show');
        $("#usuario-edt").modal('hide');
    }

    btnGrabar.onclick = function () {
        if (validacionModal() == 0) {
            var data = obtenerGrbModal();
            get("/ModConfiguraciones/ManteUsuariosCSV/?Data=5|" + data, mostrarGrbModal);
        }
    }
    btnCerrar_rc.onclick = function () {
        $("#clave-edt").modal('hide');
    }




//    get("/ModUtilitarios/ObtenerEstablecimientosUsuario", mostrarEstablecimientos);

//    document.getElementById("cboEstablecimientos").onchange = function () {
//        var idCboEstablecimiento = document.getElementById("cboEstablecimientos").value;
//        var Activos = document.getElementById("chkActivos").checked ? 1 : 0;
//        get("/ModUtilitarios/ObtenerUsuariosLstCSV/?codest=" + idCboEstablecimiento + '|' + Activos, mostrarUsuarios);
//    }
//    document.getElementById("chkActivos").onchange = function () {
//        var idCboEstablecimiento = document.getElementById("cboEstablecimientos").value;
//        var Activos = document.getElementById("chkActivos").checked ? 1 : 0;
//        get("/ModUtilitarios/ObtenerUsuariosLstCSV/?codest=" + idCboEstablecimiento + '|' + Activos, mostrarUsuarios);
//    }


//    $('#tabla tbody').on('click', 'tr', function () {
//        if ($(this).hasClass('selected')) {
//            $(this).removeClass('selected');
//        }
//        else {
//            tabla.$('tr.selected').removeClass('selected');
//            $(this).addClass('selected');
//        }
//    })

//    //$('#tabla tbody').on('dblclick', 'tr', function () {
//    //    operacion = 2;
//    //    celdas = tabla.row(this).data();
//    //    get("/ModRecursosHumanos/ObtenerTrabajadoresGet/?codigo=" + celdas[0], editarPopup);
//    //    $("#trabajador-edt").modal()
//    //})

//    document.getElementById("sw1").onclick = function () {
//        if (document.getElementById("sw1").checked) {
//            document.getElementById("movil1").hidden = false;
//            document.getElementById("movil2").hidden = false;
//        } else {
//            document.getElementById("movil1").hidden = true;
//            document.getElementById("movil2").hidden = true;
//            document.getElementById("txtIDMovil").value = '';
//        }
//    }
//    document.getElementById("btnGrabar").onclick = function () {
//        if (validacion_form() == 0) {
//            var data = obtenerDatosGrabar();
//            post("/ModUtilitarios/ObtenerUsuarioGrbCSV", mostrarGrabar, data);
//        }
//    }



//    $('#bdgDesbloqueoAppTrue').hide();
//    $('#bdgDesbloqueoAppFalse').hide();
//    $('#btnDesbloqueoApp').on("click", function () {
//        desbloquearUsuarioApp();
//    });
//    function desbloquearUsuarioApp() {
//        var apiKey = $("#btnDesbloqueoApp").data("api");
//        var empresa = $("#btnDesbloqueoApp").data("empresa");
//        var usr = document.getElementById("txtUsuario").value;
//        var data = {
//            "apiKey": apiKey,
//            "empresa": empresa,
//            "usuario": usr
//        };

//        $.ajax({
//            url: "https://hsa.hard-system.com/unlock",
//            type: "POST",
//            data: JSON.stringify(data),
//            contentType: "application/json",
//            success: function (response) {
//                var respuesta = response;
//                if (respuesta === true) {
//                    $('#bdgDesbloqueoAppTrue').show().delay(2500).fadeOut();
//                } else {
//                    $('#bdgDesbloqueoAppFalse').show().delay(2500).fadeOut();
//                }
//            },
//            error: function (xhr, status, error) {
//                $('#bdgDesbloqueoAppFalse').show().delay(2500).fadeOut();
//            }
//        });

//    }

//}

//function mostrarEstablecimientos(rpta) {
//    if (rpta != "") {
//        var listas = rpta.split("¯");
//        lista = listas[0].split("¬");

//        crearCombo(lista, "cboEstablecimientos", "<< TODOS >>");
//        crearCombo(lista, "cboEstablecimiento", "** SELECCIONE ESTABLECIMIENTO **");

//        lista = listas[1].split("¬");
//        crearCombo(lista, "cboTipDocPer", "** SELECCIONE TIPO DE DOCUMENTO **");

//        lista = listas[2].split("¬");
//        crearCombo(lista, "cboRol", "** SELECCIONE UN ROL **");

//        get("/ModUtilitarios/ObtenerUsuariosLstCSV/?codest=-1|1", mostrarUsuarios);
//    }
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
    tabla = $('#tabla').DataTable().clear().rows.add(matriz).draw();
}
function limpiarModal() {
    eliminarMarcas();
    txtid_usr.value = 0;
    txtUsuario.value = '';
    $('#cboTipDocPer').val('-1').trigger('change.select2');
    txtNroDoc.value = '';
    txtApePat.value = '';
    txtApeMat.value = '';
    txtNombre.value = '';
    txtCorreo.value = '';
    txtTelefono.value = '';
    $('#cboEstablecimiento').val('-1').trigger('change.select2');
    $('#cboRol').val('-1').trigger('change.select2');
    txtClave1.value = '';
    txtClave2.value = '';
}
function editarModal(rpta) {
    limpiarModal();
    if (rpta != "") {
        var reg = rpta.split("|");
        txtid_usr.value = reg[0];
        txtUsuario.value = reg[1];
        $('#cboTipDocPer').val(reg[2]).trigger('change.select2');
        txtNroDoc.value = reg[3];
        txtApePat.value = reg[4];
        txtApeMat.value = reg[5];
        txtNombre.value = reg[6];
        txtCorreo.value = reg[7];
        txtTelefono.value = reg[8];
        $('#cboEstablecimiento').val(reg[9]).trigger('change.select2');
        $('#cboRol').val(reg[10]).trigger('change.select2');
        $("#usuario-edt").modal();
    }
}
function validacionModal() {
    eliminarMarcas();
    let validacion = 0;
    validacion += validaCampos('txtUsuario', '');
    validacion += validaCampos('cboTipDocPer', -1);
    validacion += validaCampos('txtNroDoc', '');
    validacion += validaCampos('txtApePat', '');
    validacion += validaCampos('txtApeMat', '');
    validacion += validaCampos('txtNombre', '');
    validacion += validaCampos('cboEstablecimiento', -1);
    validacion += validaCampos('cboRol', -1);
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcas() {
    removeRedMark('txtUsuario', 'cboTipDocPer', 'txtNroDoc', 'txtApePat', 'txtApeMat', 'txtNombre', 'cboEstablecimiento', 'cboRol');
}
function obtenerGrbModal() {
    var data = txtid_usr.value + '|';
    data += txtUsuario.value + '|';
    data += cboTipDocPer.value + '|';
    data += txtNroDoc.value + '|';
    data += txtApePat.value + '|';
    data += txtApeMat.value + '|';
    data += txtNombre.value + '|';
    data += txtCorreo.value + '|';
    data += txtTelefono.value + '|';
    data += cboEstablecimiento.value*1 + '|';
    data += cboRol.value * 1 + '|';
    data += txtClave1.value + '|';
    data += txtClave2.value;
    return data;
}
function mostrarGrbModal(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        $('#usuario-edt').modal('hide');
        if (opc_sel == 1) {
            reg = rpta.split('|');
            var fila = [reg[0], reg[1], reg[2], reg[3], reg[4], reg[5], reg[6], reg[7], reg[8], reg[9], reg[10], reg[11], reg[12], reg[13],'',''];
            tabla.row.add(fila).draw();
            mensaje = "Se adicionó un registro";
        }
        else
            if (opc_sel == 2) {
                reg = rpta.split('|');
                celdas = tabla.row(objfila).data();
                celdas[2] = reg[2]; //document.getElementById("cboEstablecimiento").options[document.getElementById("cboEstablecimiento").selectedIndex].innerText;
                celdas[3] = reg[3]; //document.getElementById("txtUsuario").value;
                celdas[5] = reg[5]; //document.getElementById("txtNroDoc").value;
                celdas[6] = reg[6]; //document.getElementById("txtApePat").value + ' ' + document.getElementById("txtApeMat").value + ' ' + document.getElementById("txtNombre").value;
                celdas[7] = reg[7]; //document.getElementById("txtTelefono").value;
                celdas[8] = reg[8]; //document.getElementById("cboRol").options[document.getElementById("cboRol").selectedIndex].innerText;
                celdas[9] = reg[9];
                celdas[10] = reg[10];
                celdas[11] = reg[11];
                celdas[12] = reg[12];
                celdas[13] = reg[13];
                tabla.row(objfila).data(celdas).draw();
                mensaje = "Se actualizó el registro";
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
        if (rpta * 1 == 1) {
            mensaje = "Se activo el registro";
        }
        else {
            mensaje = "Se desactivo el registro";
        }
    }
    else {
        mensaje = rpta; // "Ocurrió un error al eliminar";
    }
    alert(mensaje);
}