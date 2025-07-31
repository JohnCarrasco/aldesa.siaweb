/**
 * App Adiciona/Modifica Cliente/Proveedor (jquery)
 */

//'use strict';

var tabla = $('#tablaResultados');
var listas = [];
var lista = [];
var fila;

function iniciar() {

    // Función para manejar cambios en el campo de búsqueda
    $('#txtBuscar').on('input', function () {
        var query = $(this).val().trim(); // Obtener el valor del campo de búsqueda y limpiar espacios en blanco

        //console.log('query ' + query);

        // Mostrar contenedorImagen1 si el query tiene menos de 3 caracteres, de lo contrario, ocultarlo
        if (query.length < 3) {
            contenedorImagen1.style.display = 'inline';
            contenedorImagen2.style.display = 'none';
            contenedorTarjetas.style.display = 'none';
            tabla.empty(); // Vaciar la tabla si es necesario
        } else {
            contenedorImagen1.style.display = 'none';
            contenedorImagen2.style.display = 'inline';
            // Puedes agregar lógica adicional aquí si es necesario
        }
    });

    // Inicializar Typeahead.js en el campo de búsqueda
    $('#txtBuscar').typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 3
        },
        {
            name: 'states',
            display: function (item) {
                return item.title; // Campo a mostrar en las sugerencias
            },
            source: function (query, syncResults, asyncResults) {

                // Realizar una solicitud GET a la ruta /api/clientes-proveedores
                fetch('/ModVentas/ManteGR_CSV/?Data=' + TipBus + '|' + query)
                    .then(res => res.text())
                    .then(function (res) {
                        if (res == '') {
                            if (res == '' && query == '') {
                                contenedorImagen1.style.display = 'inline';
                                contenedorImagen2.style.display = 'none';
                            } else {
                                contenedorImagen1.style.display = 'none';
                                contenedorImagen2.style.display = 'inline';
                            }
                            contenedorTarjetas.style.display = 'none';
                        } else {
                            contenedorTarjetas.style.display = 'inline';
                            contenedorImagen1.style.display = 'none';
                            contenedorImagen2.style.display = 'none';
                        }
                        tabla.empty();
                        llenarTabla(res);
                        //asyncResults(res); // Devolver los datos como sugerencias
                    })
                    .catch(function (error) {
                        //console.error('Error al obtener sugerencias:', error);
                        asyncResults([]); // Devolver un arreglo vacío en caso de error
                    });

            },
            templates: {
                suggestion: function (data) {
                    return '<div><strong>' + data.title + '</strong> - ' + data.year + '</div>';
                }
            }
        }
    );

    // Manejar la selección de sugerencias de Typeahead.js con addEventListener

    // Función para llenar la tabla con los resultados de búsqueda

    // Manejar la selección de sugerencias de Typeahead.js
    $('#txtBuscar').on('typeahead:select', function (event, suggestion) {
        // Llenar la tabla con el resultado seleccionado
        llenarTabla(suggestion);
    });

    txtBuscar.addEventListener('typeahead:select', function (event) {

        // Acceder al objeto de sugerencia seleccionada
        var suggestion = event.detail.data;

        // Llenar la tabla con el resultado seleccionado
        llenarTabla(suggestion);
    });

    // Agregar evento de clic delegado al contenedor de tarjetas
    //var contenedorTarjetas = document.getElementById('contenedorTarjetas');
    //contenedorTarjetas.addEventListener('click', function (event) {
    //    //txtUbiGeoO.value = tarjetaClicada.querySelector('h5').textContent.trim();
    //    //lblUbiGeoO.textContent = tarjetaClicada.querySelector('label').textContent.trim();

    //    var campoTextoId = card.getAttribute('data-texto');
    //    var campoEtiquetaId = card.getAttribute('data-etiqueta');

    //    console.log(campoTextoId);
    //    console.log(campoEtiquetaId);

    //    manejarClicTarjeta(event, campoTextoId, campoEtiquetaId);

    //    console.log(campoTextoId);
    //    console.log(campoEtiquetaId);

    //});
   
}
//function mostrarCombos(rpta) {
//    if (rpta != "") {
//        listas = rpta.split("¯");
//        lista = listas[0].split("¬");
//        crearCombo(lista, "cboTipDocPer", "** SELECCIONE TIPO DE DOCUMENTO **");
//        lista = listas[1].split("¬");
//        crearCombo(lista, "cboNacionalidad", "");
//        $('#cboNacionalidad').val(9589).trigger('change.select2');
//        crearCombo(lista, "cboPais", "");
//        $('#cboPais').val(9589).trigger('change.select2');
//    }
//}
function llenarTabla(resultados) {
    matriz = [];
    lista = [];
    if (resultados != "") {
        lista = resultados.split("¬");
    }

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

    // Iterar sobre los resultados y construir filas de la tabla
    fila = '';
    matriz.forEach(function (item) {
        fila += '<div class="col-lg-12 col-sm-12 mb-4" style="cursor:pointer">';
        fila += '<div class="card card-busqueda" data-codigo="' + lblBuscadoCod.innerHTML + '" data-descri="' + lblBuscadoDes.innerHTML + '">';
        fila += '<div class="card-body card-body-busqueda">';
        fila += '<div class="d-flex align-items-center flex-wrap">';
//        if (TipBus == 2) {
            fila += '<div class="avatar me-4">';
            fila += '<div class="avatar-initial bg-label-primary rounded-3">';
            fila += '<i class="ri-user-star-line ri-24px"> </i>';
            fila += '</div>';
            fila += '</div>';
//        }
        fila += '<div class="card-info">';
        fila += '<div class="d-flex align-items-center">';
        fila += '<label style="display:none">' + item[0] + '</label>';
        fila += '<h6 class="mb-0 me-2">' + item[1] + '</h6>';
        fila += '</div>';
        fila += '<p class="mb-0">' + item[2] + '</p>'; 
        fila += '</div>';
        fila += '</div>';
        fila += '</div>';
        fila += '</div>';
        fila += '</div>';
    });

    //console.log(fila);

    document.getElementById("contenedorTarjetas").innerHTML = fila;

    // Asocia la función a las tarjetas
    document.querySelectorAll('.card.card-busqueda').forEach(card => {
        card.addEventListener('click', function (event) {
            var buscadoCod = card.getAttribute('data-codigo');
            var buscadoDes = card.getAttribute('data-descri');
            manejarClicTarjeta(event, buscadoCod, buscadoDes);
        });
    });
}
function manejarClicTarjeta(event, buscadoCod, buscadoDes) {
    var tarjetaClicada = event.target.closest('.card');

    //console.log('hizo click' + txtBuscar.value);


    if (tarjetaClicada) {
        var buscadoCodigo = document.getElementById(buscadoCod);
        var buscadoDescri = document.getElementById(buscadoDes);
        buscadoCodigo.innerHTML = tarjetaClicada.querySelector('label').textContent.trim();
        buscadoDescri.value = tarjetaClicada.querySelector('h6').textContent.trim();
        $('#Buscador').modal('hide');
    }
}