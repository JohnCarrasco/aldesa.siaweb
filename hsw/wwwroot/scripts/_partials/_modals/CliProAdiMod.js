/**
 * App Adiciona/Modifica Cliente/Proveedor (jquery)
 */

//'use strict';

var listas = [];
var lista = [];

let formularioCount = 0;

const actualizarTitulos = () => {
    const formularios = document.querySelectorAll('#cliproCopias .formulario');
    formularios.forEach((formulario, index) => {
        const titulo = formulario.querySelector('.form-title');
        titulo.innerText = `Dirección secundaria # ${index + 1}`;
        formularioCount = formularios.length-1;
    });
};

function iniciar() {
    get("/ModConfiguraciones/CliProAdiModCSV/?Data=1|", mostrarCombos);

    chkProveedor.addEventListener('click', function (event) {
        chkAgente.checked = false;
        divPorcentaje.style.display = "none"
        if (chkProveedor.checked) {
            divAgente.style.display = "block"
        }
        else {
            divAgente.style.display = "none"
        }
        chkAgente.addEventListener('click', function (event) {
            if (chkAgente.checked) divPorcentaje.style.display = "block"
            else divPorcentaje.style.display = "none"
        });

    });
    txtUbiGeo.addEventListener('click', function (event) {
        TipBus = 3;
        txtBuscar.value = '';
        txtBuscar.placeholder = 'Buscar ubigeo...';
        lblMsgBuscar.innerHTML = 'Busca un ubigeo por region, provincia o distrito';
        lblBuscadoCod.innerHTML = 'lblUbiGeo';
        lblBuscadoDes.innerHTML = 'txtUbiGeo';
        handleClick();
    });
    btnDireccionRepetir.addEventListener('click', function (event) {
        const originalForm = document.getElementById('cliproOriginal').innerHTML.replace(/ style="display:none"/,"");
        const newForm = document.createElement('div');
        newForm.innerHTML = originalForm;
        newForm.style.display = 'none';

        // Buscar el combo box de país en la copia y establecer el valor predeterminado
        const comboPaisCopia = newForm.querySelector('.cboPais');

        console.log(comboPaisCopia);

        comboPaisCopia.value = '9589';

        formularioCount++;
        newForm.querySelector('.form-title').innerText = `Dirección secundaria # ${formularioCount}`;
        document.getElementById('cliproCopias').appendChild(newForm);
        $(newForm).slideDown(); // Aplicar el efecto slideDown

        // Agregar evento de eliminación al botón de eliminar
        newForm.querySelector('.btnEliminar').addEventListener('click', (event) => {
            const form = event.target.closest('.formulario');
            $(form).slideUp(() => {
                form.remove();
                actualizarTitulos();
            });
        });
    });
}
function mostrarCombos(rpta) {
    if (rpta != "") {
        listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearCombo(lista, "cboTipDocPer", "** TIPO DE DOCUMENTO **");
        lista = listas[1].split("¬");
        crearCombo(lista, "cboNacionalidad", "");
        $('#cboNacionalidad').val(9589).trigger('change.select2');
        crearCombo(lista, "cboPais", "");
        $('#cboPais').val(9589).trigger('change.select2');
    }
}
function handleClick(txtUbiGeo, lblUbiGeo) {
    txtBuscar.placeholder = 'Buscar ubigeo...';
    lblMsgBuscar.innerHTML = 'Busca un ubigeo por region, provincia o distrito';
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

btnGuardarCliPro.addEventListener('click', function (event) {
    //alert('grabar');
    if (validacionModal() == 0) {
        var data = obtenerGrbModal();
        get("/ModConfiguraciones/ManteUsuariosCSV/?Data=5|" + data, mostrarGrbModal);
    }


});
function validacionModal() {
    eliminarMarcas();
    let validacion = 0;
    validacion += validaCampos('cboTipDocPer', -1);
    validacion += validaCampos('txtNroDoc', '');
    validacion += validaCampos('txtRazSoc', '');
    validacion += validaCampos('txtRazSoc_Comercial', '');
    validacion += validaCampos('cboNacionalidad', -1);
    validacion += validaCampos('cboPais', -1);
    validacion += validaCampos('txtUbiGeo', '');
    validacion += validaCampos('txtDirecc', '');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcas() {
    removeRedMark('cboTipDocPer', 'txtNroDoc', 'txtRazSoc', 'txtRazSoc_Comercial', 'cboNacionalidad', 'cboPais', 'txtUbiGeo', 'txtDirecc');
}
