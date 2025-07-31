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
                fetch("/ModVentas/ManteGR_CSV/?Data=1|" + query)
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
        console.log('aca 1a');
        // Llenar la tabla con el resultado seleccionado
        llenarTabla(suggestion);
    });

    txtBuscar.addEventListener('typeahead:select', function (event) {

        // Acceder al objeto de sugerencia seleccionada
        var suggestion = event.detail.data;

        console.log('addevent ' + suggestion);

        // Llenar la tabla con el resultado seleccionado
        llenarTabla(suggestion);
    });


    // Función para manejar el clic en cualquier tarjeta
    function manejarClicTarjeta(event) {
        var tarjetaClicada = event.target.closest('.card');
        if (tarjetaClicada) {
            txtDestinatario.value = tarjetaClicada.querySelector('h5').textContent.trim();
            lblCodigo.textContent = tarjetaClicada.querySelector('label').textContent.trim();
            $('#CliProBuscar').modal('hide');
        }
    }

    // Agregar evento de clic delegado al contenedor de tarjetas
    var contenedorTarjetas = document.getElementById('contenedorTarjetas');
    contenedorTarjetas.addEventListener('click', manejarClicTarjeta);


}
function mostrarCombos(rpta) {
    if (rpta != "") {
        listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearCombo(lista, "cboTipDocPer", "** SELECCIONE TIPO DE DOCUMENTO **");
        lista = listas[1].split("¬");
        crearCombo(lista, "cboNacionalidad", "");
        $('#cboNacionalidad').val(9589).trigger('change.select2');
        crearCombo(lista, "cboPais", "");
        $('#cboPais').val(9589).trigger('change.select2');
    }
}
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
    //    fila = $('<tr>');
    //    fila.append('<td>' + item[0] + '</td>');
    //    fila.append('<td>' + item[1] + '</td>');
    //    fila.append('<td><a href="#" class="btn-small waves-effect waves-light">Ver detalle</a></td></tr>');
    //    tabla.append(fila);
        fila += '<div class="col-lg-12 col-sm-12 mb-4" style="cursor:pointer">';
        fila += '<div class="card">';
        fila += '<div class="card-body">';
        fila += '<div class="d-flex align-items-center flex-wrap">';
        fila += '<div class="avatar me-4">';
        fila += '<div class="avatar-initial bg-label-primary rounded-3">';
        fila += '<i class="ri-user-star-line ri-24px"> </i>';
        fila += '</div>';
        fila += '</div>';
        fila += '<div class="card-info">';
        fila += '<div class="d-flex align-items-center">';
        fila += '<label style="display:none">' + item[0] + '</label>';
        fila += '<h5 class="mb-0 me-2">' + item[1] + '</h5>';
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

/*
    resultados.forEach(function (item) {
        var fila = $('<tr>');
        fila.append('<td>' + item.title + '</td>');
        fila.append('<td>' + item.year + '</td>');
        fila.append('<td><a href="#" class="btn-small waves-effect waves-light">Ver detalle</a></td></tr>');

        tabla.append(fila);
    });

    /*

    // Configuración de Bloodhound
    var statesSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: states // Utilizamos los datos locales (podrían ser reemplazados por búsqueda remota)
    });

    // Inicialización de Typeahead
    $('.typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
        {
            name: 'states',
            source: statesSearch,
            templates: {
                suggestion: function (data) {
                    return '<div><strong>' + data.title + '</strong> - </div><br><div>' + data.year + '</div>';
                }
            },
            // Aquí se define el contenedor donde se insertarán las sugerencias
            appendTo: '#cuerpoBuscar'
        }
    );


        var substringMatcher = function (strs) {
            return function findMatches(q, cb) {
                var matches, substrRegex;
                matches = [];
                substrRegex = new RegExp(q, 'i');
                $.each(strs, function (i, str) {
                    if (substrRegex.test(str)) {
                        matches.push(str);
                    }
                });
    
                cb(matches);
            };
        };
     
        if (isRtl) {
            $('#txtBuscar').attr('dir', 'rtl');
        }
    
        $('.typeahead').typeahead(
            {
                hint: !isRtl,
                highlight: true,
                minLength: 1
            },
            {
                name: 'states',
                source: substringMatcher(states)
            }
        );
    
    
    
    
    /*
        console.log('load1');
    
        $("#txtBuscar").autocomplete({
            source: '',
            minLength: 3,
            focus: function (event, ui) {
                $('#txtCodigo').val(ui.item.value.substr(0, 7));
                $('#txtCargo').val(ui.item.value.substr(ui.item.value.indexOf('-') + 1, ui.item.value.length - ui.item.value.indexOf('-') - 1));
                $(this).val(ui.item.label.substr(ui.item.label.indexOf('-') + 2, ui.item.label.length - ui.item.label.indexOf('-') - 2));
                return false;
            },
            select: function (event, ui) {
                $('#txtCodigo').val(ui.item.value.substr(0, 7));
                $('#txtCargo').val(ui.item.value.substr(ui.item.value.indexOf('-') + 1, ui.item.value.length - ui.item.value.indexOf('-') - 1));
                $(this).val(ui.item.label.substr(ui.item.label.indexOf('-') + 2, ui.item.label.length - ui.item.label.indexOf('-') - 2));
                return false;
            }
        });
    */
    /*
        $('#txtBuscar').autocomplete({
            data: {
                "Apple": null,
                "Microsoft": null,
                "Google": 'https://placehold.it/250x250'
            },
        });
    */


    //document.addEventListener('DOMContentLoaded', function () {
    //    console.log('load2');
    //    var options = {
    //        data: {
    //            "Apple": null,
    //            "Microsoft": null,
    //            "Google": 'https://placehold.it/250x250'
    //        },
    //        onAutocomplete: function () {
    //            console.log('hola');
    //        }
    //    };
    //    var elems = document.querySelectorAll('.autocomplete');
    //    var instances = M.Autocomplete.init(elems, options);
    //});

}
