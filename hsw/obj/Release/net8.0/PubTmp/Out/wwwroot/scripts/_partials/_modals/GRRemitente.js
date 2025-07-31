/**
 * App Guia de Remisión jquery)
 */

//'use strict';

var listas = [];
var lista = [];
function iniciar() {
    get('/ModVentas/ManteGR_CSV/?Data=1|', cargaInicial)

    cmdCliProNuevo.addEventListener('click', function (event) {

        var CliProAdiMod = new bootstrap.Modal(document.getElementById('CliProAdiMod'));
        chkCliente.checked = false;
        chkProveedor.checked = false;
        $('#cboTipDocPer').val(-1).trigger('change.select2');
        $('#cboNacionalidad').val(9589).trigger('change.select2');
        txtNroDoc.value = '';
        txtRazSoc.value = '';
        txtRazSoc_Comercial.value = '';

        $('button[data-bs-target="#navs-direcciones-card"]').removeClass('active');
        $('button[data-bs-target="#navs-informacion-card"]').addClass('active');

        $('button[data-bs-target="#navs-direcciones"]').attr('aria-selected', 'false');
        $('button[data-bs-target="#navs-informacion-card"]').attr('aria-selected', 'true');

        $('#navs-direcciones-card').removeClass('show active');
        $('#navs-informacion-card').addClass('show active');

        CliProAdiMod.show();

    });
    txtDestinatario.addEventListener('click', function (event) {
        TipBus = 2;
        txtBuscar.placeholder = 'Buscar remitente...';
        lblMsgBuscar.innerHTML = 'Busca un cliente o proveedor por su nombre, documento, etc';
        lblBuscadoCod.innerHTML = 'lblCodigo';
        lblBuscadoDes.innerHTML = 'txtDestinatario';
        handleClick();
    });
    txtUbiGeoO.addEventListener('click', function (event) {
        TipBus = 3;
        txtBuscar.placeholder = 'Buscar ubigeo...';
        lblMsgBuscar.innerHTML = 'Busca un ubigeo por region, provincia o distrito';
        lblBuscadoCod.innerHTML = 'lblUbiGeoO';
        lblBuscadoDes.innerHTML = 'txtUbiGeoO';
        handleClick();
    });
    txtUbiGeoD.addEventListener('click', function (event) {
        TipBus = 4;
        txtBuscar.placeholder = 'Buscar ubigeo...';
        lblMsgBuscar.innerHTML = 'Busca un ubigeo por region, provincia o distrito';
        lblBuscadoCod.innerHTML = 'lblUbiGeoD';
        lblBuscadoDes.innerHTML = 'txtUbiGeoD';
        handleClick();
    });
    btnAceptarCliPro.addEventListener('click', function (event) {
        alert('grabar');
    });
}
function cargaInicial(rpta) {
    if (rpta != "") {
        listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearCombo(lista, "cboNumSerGR", "");
        dtpFechaGR.value = listas[1];
        dtpFecEnvGR.value = listas[1];
        lista = listas[2].split("¬");
        crearCombo(lista, "cboTabMotGR", "");
        $('#cboTabMotGR').val(1).trigger('change.select2');
    }
}
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
