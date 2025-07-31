/**
 * App Invoice List (jquery)
 */

//'use strict';

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
        //language: {
        //    sLengthMenu: 'Show _MENU_',
        //    search: '',
        //    searchPlaceholder: 'Search Invoice'
        //},
        // Buttons with Dropdown
        buttons: [
            {
                text: '<i class="ri-add-line ri-16px me-md-2 align-baseline"></i><span class="d-md-inline-block d-none">Create Invoice</span>',
                className: 'btn btn-primary waves-effect waves-light',
                action: function (e, dt, button, config) {
                    window.location = 'app-invoice-add.html';
                }
            }
        ]
        // For responsive popup
/*
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                    header: function (row) {
                        var data = row.data();
                        return 'Details of ' + data['full_name'];
                    }
                }),
                type: 'column',
                renderer: function (api, rowIdx, columns) {
                    var data = $.map(columns, function (col, i) {
                        return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                            ? '<tr data-dt-row="' +
                            col.rowIndex +
                            '" data-dt-column="' +
                            col.columnIndex +
                            '">' +
                            '<td>' +
                            col.title +
                            ':' +
                            '</td> ' +
                            '<td>' +
                            col.data +
                            '</td>' +
                            '</tr>'
                            : '';
                    }).join('');

                    return data ? $('<table class="table"/><tbody />').append(data) : false;
                }
            }
        },
*/

/*
        initComplete: function () {
            // Adding role filter once table initialized
            this.api()
                .columns(8)
                .every(function () {
                    var column = this;
                    var select = $(
                        '<select id="UserRole" class="form-select"><option value=""> Select Status </option></select>'
                    )
                        .appendTo('.invoice_status')
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex($(this).val());
                            column.search(val ? '^' + val + '$' : '', true, false).draw();
                        });

                    column
                        .data()
                        .unique()
                        .sort()
                        .each(function (d, j) {
                            select.append('<option value="' + d + '" class="text-capitalize">' + d + '</option>');
                        });
                });
        }
*/

    });
}

function iniciar() {

    console.log('El carácter especial es: ¬');

    get("/ModConfiguraciones/ManteCliProCSV/?Data=2|", mostrarLista);
}

function mostrarLista(rpta) {
    matriz = [];
    if (rpta != "") {
        var listas = rpta.split("¯");
        lista = listas[0].split("¬");

        console.log(listas);
        console.log(lista);

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

}





//$(function () {

  // On each datatable draw, initialize tooltip
  /*
    dt_invoice_table.on('draw.dt', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        boundary: document.body
      });
    });
  });
  */

  // Delete Record
/*
$('.invoice-list-table tbody').on('click', '.delete-record', function () {
    // To hide tooltip on clicking delete icon
    $(this).closest($('[data-bs-toggle="tooltip"]').tooltip('hide'));
    // To delete the whole row
    dt_invoice.row($(this).parents('tr')).remove().draw();
  });
*/

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
/*
setTimeout(() => {
    $('.invoice_status .form-select').addClass('form-select-sm');
  }, 300);
*/
//});
