var listas = [];
var lista = [];
var matriz = [];
var operacion = 0;

function iniciar() {
    $('select').select2({ theme: "bootstrap4"});
    get("/hsw/DatosUsuarioCSV", mostrarUsuario); 
    document.getElementById("btnGrabar").onclick = function () {
        if (document.getElementById("cboEC").value == -1) {
            alertify.alert('Familiar', 'Debe seleccionar Estado Civil !!!')
        }
        else {
            if (validacion_form() == 0) {
                var data = obtenerDatosGrabar();
                post("/hsw/DatosFamiliarGrbCSV", mostrarGrabar, data);
            }
        }
    }
//    btnBoleta.onclick = function () {
//        div_dp.style.display = 'none';
//        div_bol.style.display = 'block';
//    }
}

function mostrarUsuario(rpta) {
    if (rpta != "") {
        listas = rpta.split("¯");
        lista = listas[0].split("|");
        document.getElementById("txtCodigo").value = lista[0];
        document.getElementById("txtNombres").value = lista[1];
        document.getElementById("txtDNI").value = lista[2];
        document.getElementById("txtDireccion").value = lista[3];
        document.getElementById("txtCelular").value = lista[4];
        document.getElementById("txtCorreo").value = lista[5];
        var EstCiv = lista[6]*1;
        lista = listas[1].split("¬");
        crearCombo(lista, "cboEC", "** SELECCIONE ESTADO CIVIL **");
        lista = listas[2].split("¬");
        crearCombo(lista, "cboParentescoF", "** SELECCIONE PARENTESCO **");
        if (EstCiv != 0) {
            $('#cboEC').val(EstCiv).trigger('change.select2');
            document.getElementById("cboEC").disabled = true;
        }
        if (listas[3]!='') llenarGrilla(listas[3]);

        mostrarImagen(listas[5]);

        lista = listas[4].split("¬");
        data = '';
        if (lista != '') {
            var campos = [];
            var nRegistros = lista.length;
            var i = 0;
            for (i; i < nRegistros; i++) {
                campos = lista[i].split("|");

                data += '<tr>';
                data += '<td style="text-align:center">' + (i + 1) + '</td>';
                data += '<td>' + campos[1] + '</td>';
                data += '<td style="text-align:center">' + campos[2] + '</td>';
                data += '<td style="text-align:center">' + campos[3] + '</td>';
                data += '<td style="text-align:center">' + campos[4] + '</td>';
                data += '<td data-opc="' + campos[0] +'" style="text-align:center;cursor:pointer;"><a title="Vista Previa" style="color:rgb(0, 0, 0);" class="fas fa-search fa-lg"></a></td>';
                data += '</tr>';
            }
        }
        document.getElementById("detalle_documentos").innerHTML = data;

        var el = document.getElementById("detalle_documentos");
        el.addEventListener("click", e => {
            fila = e.target.parentNode.parentNode;
            if (fila.tagName == 'TR') {
                equifax_opc = fila.children[4].children[0];
                equifax_click = e.target.parentNode;
                get("/HSW/ReglamentoPDFVer/?data=" + equifax_click.dataset.opc, mostrarPDF);
                get("/HSW/ListaPDFGrbVistas/?data=" + equifax_click.dataset.opc, actualizaFila);
                function actualizaFila(rpta) {
                    reg = rpta.split('|');
                    fila.cells[3].innerHTML = reg[0];
                    fila.cells[4].innerHTML = reg[1];
                }
            }
        },
            false);

        function mostrarPDF(rpta) {
            var reg = rpta.split('|');
                var pdf = "<iframe width='100%' height='99%' src='data:application/pdf;base64," + encodeURI(rpta) + "'></iframe>";
                document.getElementById("divMostrarDocumento").innerHTML = pdf;
                $('#pdf-MostrarDocumentos').modal();
        }
    }
}

function mostrarImagen(rpta) {
    if (rpta != "") {
        var reg = rpta.split("|");
        var imagen = "<img src='data:image/png;base64," + reg[0] + "' class='img-thumbnail rounded mx-auto d-block' alt='Photo' />";
        document.getElementById("divImg").innerHTML = imagen;
    }
}

function llenarGrilla(rpta) {
    lista = rpta.split("¬");
    var campos = [];
    var nRegistros = lista.length;
    var i = 0;
    data = '';
    for (i; i < nRegistros; i++) {
        campos = lista[i].split("|");
        data += '<tr>';
        data += '<td style="text-align:right">' + (i + 1) + '</td>';
        data += '<td style="text-align:center">' + campos[1] + '</td>';
        data += '<td>' + campos[2] + '</td>';
        data += '<td style="text-align:center">' + campos[3] + '</td>';
        data += '<td>' + campos[4] + '</td>';
        data += '</tr>';
    }
    document.getElementById("detalle").innerHTML = data;
}

function validacion_form() {
    eliminar_marcas();
    let validacion = 0;
    validacion += validaCampos('txtNroDocF', '');
    validacion += validaCampos('txtApePatF', '');
    validacion += validaCampos('txtApeMatF', '');
    validacion += validaCampos('txtNombresF', '');
    validacion += validaCampos('dtpFecNacF', '');
    validacion += validaCampos('cboParentescoF', '-1');
    return (validacion != 0) ? 1 : 0;
}

function eliminar_marcas() {
    removeRedMark('txtNroDocF', 'txtApePatF', 'txtApeMatF', 'txtNombresF', 'dtpFecNacF', 'cboParentesco');
}

function obtenerDatosGrabar() {
    var data = document.getElementById("txtCodigo").value + '|';
    data += document.getElementById("cboEC").value * 1 + '|';
    data += document.getElementById("txtNroDocF").value + '|';
    data += document.getElementById("txtApePatF").value + '|';
    data += document.getElementById("txtApeMatF").value + '|';
    data += document.getElementById("txtNombresF").value + '|';
    data += document.getElementById("dtpFecNacF").value + '|';
    data += document.getElementById("cboParentescoF").value * 1;
    return data;
}

function mostrarGrabar(rpta) {
    llenarGrilla(rpta);
    limpiar_popup();
}

function limpiar_popup() {
    document.getElementById("txtNroDocF").value = '';
    document.getElementById("txtApePatF").value = '';
    document.getElementById("txtApeMatF").value = '';
    document.getElementById("txtNombresF").value = '';
    document.getElementById("dtpFecNacF").value = '';
    $('#cboParentescoF').val("-1").trigger('change.select2');
}
