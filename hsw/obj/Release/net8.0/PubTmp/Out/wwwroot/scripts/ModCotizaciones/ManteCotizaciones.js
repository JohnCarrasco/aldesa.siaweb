var listas = [];
var lista = [];
var matriz = [];
var opc_sel = 0;
var tabla = '';
var celdas = '';
var objfila;
const fechaActual = new Date();
const dia = fechaActual.getDate().toString().padStart(2, '0');
const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
const anio = fechaActual.getFullYear();
const Hoy = `${anio}-${mes}-${dia}`;

var tabla = $('#tabla').DataTable({
    data: matriz,
    compact: true,
    order: [1, 'desc'],
    scrollY: '53vh',
    scrollX: true,
    paging: false,
    scrollCollapse: false,
    language: idioma_espanol,
    searching: true,
    columnDefs: [
        {
            targets: 0,
            responsivePriority: -1,
            searchable: false,
            orderable: false,
            width: '14rem',
            render: function (data, type, full, meta) {
                return (
                    '<div class="d-flex align-items-center">' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Consultar Cotización" ><i class="ri-eye-line"             style="color:blue"  data-opc="2"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Editar Cotización"    ><i class="ri-pencil-line"          style="color:green" data-opc="3"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Aprobar Cotización"   ><i class="ri-checkbox-circle-line" style="color:green" data-opc="4"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Desaprobar Cotización"><i class="ri-hand"                 style="color:red"   data-opc="5"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Anular Cotización"    ><i class="ri-delete-bin-line"      style="color:red"   data-opc="6"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Duplicar Cotización"  ><i class="ri-file-copy-line"       style="color:green" data-opc="7"></i></a>' +
                    '<a data-bs-toggle="tooltip" class="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-placement="top" title="Exportar PDF"         ><i class="ri-file-pdf-2-line"      style="color:red"   data-opc="8"></i></a>' +
                    '</div>'
                );
            }
        },
        { width: "1rem", targets: 1, className: "text-end" },
        { width: "2rem", targets: 2 },
        { width: "12.5rem", targets: 3 },
        { width: "2rem", targets: 4, className: "text-center" },
        { width: "6rem", targets: 5, visible: false },
        { width: "6rem", targets: 6 },
        {
            width: "6rem", targets: 7,className:"text-center",
            render: function (data, type, row) {
                let fechaMostrar = moment(data).format('DD/MM/YYYY HH:MM:SS');
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        },
        {
            width: "6rem", targets: [8,9],
            render: function (data, type, row) {
                let fechaMostrar = moment(data).format('DD/MM/YYYY');
                if (fechaMostrar == 'Invalid date') fechaMostrar = '';
                if (type === 'sort' || type === 'type') {
                    return data;
                } else {
                    return fechaMostrar;
                }
            }
        },
        { width: "6rem", targets: 10 }
    ],
    dom: 'Bfrtip',
    rowCallback: function (row, data, index) {
        /* Anulado */
        if (data[5] == 0) {
            $('td', row).css('background-color', '#c8c8c8');
            //$('td', row).css('color', 'White');
        }
        /* Registrada */
        if (data[5] == 1) {
            //$('td', row).css('background-color', '#dcedc2');
            //$('td', row).css('color', 'White');
        }
        /* Aprobada */
        if (data[5] == 2) {
            $('td', row).css('background-color', '#a8e6ce');
            //$('td', row).css('color', 'White');
        }
        /* Desactivado */
        if (data[5] == 3) {
            $('td', row).css('background-color', '#ffd3b5');
            //$('td', row).css('color', 'White');
        }
    },
    buttons: [
        {
            text: '<i class="ri-file-line"></i> Nueva Cotización',
            titleAttr: 'Nueva Cotización',
            className: 'btn btn-primary',
            action: function (e, dt, node, config) {
                opc_sel = 1;
                ControlesLimpiar(document.getElementById('controles'));
                controlesEnabled(document.getElementById('controles'));
                txtDirecc.disabled = true;
                txtFecAdi.disabled = true;
                txtEstado.disabled = true;
                txtFecha_Aprobacion.disabled = true;
                txtFecha_Vigencia.disabled = true;
                txtNroCar.disabled = true;
                document.getElementById("servicios").hidden = true;
                btnAgregarServicio.disabled = false;
                btnGuardarCotizacion.disabled = false;
                txtid_cotizacion.value = '0';
                txtNroCar.value = '000-' + anio;
                document.getElementById("tabla_servicios_detalle").innerHTML = '';
                document.getElementById("lista-lst").hidden = true;
                document.getElementById("lista-edt").hidden = false;
            }
        }
    ]
});
// Obtener una referencia al modal
const AprobarCotizacion = new bootstrap.Modal(document.getElementById('AprobarCotizacion'));
const DesaprobarCotizacion = new bootstrap.Modal(document.getElementById('DesaprobarCotizacion'));
function iniciar() {
    var select2 = $('#cboCliPro');
    if (select2.length) {
        select2.each(function () {
            var $this = $(this);
            select2Focus($this);
            $this.wrap('<div class="position-relative"></div>');
            $this.select2({
                dropdownParent: $this.parent()
            });
        });
    }

    mostrarBloqueo('#lista-lst'); 

    get("/ModCotizaciones/ManteCotizacionesCSV/?data=1|", mostrarLista);
    cboCliPro.onchange = function () {
        var combo = document.getElementById("cboCliPro");
        if (combo.value * 1 > 0) {
            var valorOculto = combo.options[combo.selectedIndex].getAttribute("data-adicional");
            txtDirecc.value = valorOculto;
        } else txtDirecc.value = '';
    }
    cboServiciosGrp.onchange = function () {
        get("/ModCotizaciones/ManteCotizacionesCSV/?data=8|" + cboServiciosGrp.value, mostrarServicios);
        function mostrarServicios(rpta) {
            let tabla_servicios = document.getElementById("tabla_servicios_detalle");
            let fila;
            let adiciona;

            lista = rpta.split("¬");
            var campos = [];
            var nRegistros = lista.length;
            var i = 0;
            data = '';
            for (i; i < nRegistros; i++) {
                campos = lista[i].split("|");
                adiciona = true;
                for (let i = 0; i < tabla.rows.length; i++) {
                    fila = tabla_servicios.rows[i];
                    if (fila.cells[2].textContent == campos[0]) {
                        adiciona = false;
                        break;
                    }
                }
                if (adiciona) {
                    data += '<tr>';
                    data += '<td style="display:none">' + campos[0] + '</td>';
                    data += '<td class="col-8 col-md-8">';
                    data += '<input type="text" name="txtServicio" class="form-control" disabled value="' + campos[1] + '"/>';
                    data += '</td>';
                    data += '<td class="col-2 col-md-2">';
                    data += '<input type="text" name="txtPrecio" class="form-control" value="' + campos[2] + '"/>';
                    data += '</td>';
                    data += '<td class="col-2 col-md-2">';
                    data += '<div class="d-grid">';
                    data += '<button type="button" class="btn btn-success waves-effect waves-light">Agregar</button>';
                    data += '</div>';
                    data += '</td>';
                    data += '</tr>';
                }
            }
            if (rpta == '') data = '';
            document.getElementById("tbl_servicios").innerHTML = data;
        }
    }
    dtpFecVig.onchange = function () {
        get("/ModCotizaciones/ManteCotizacionesCSV/?data=7|" + dtpFecVig.value, mostrarNroCar);
    }

    $('#tabla tbody').on('click', 'tr', function (e) {
        opc_sel = e.target.dataset.opc;
        objfila = this;
        celdas = tabla.row(objfila).data();
        txtid_cotizacion.value = celdas[1];
        if (!(opc_sel === undefined)) {
            if (celdas[5] == 0 || celdas[5] == 4) {
                Swal.fire({
                    icon: 'error',
                    title: celdas[5] == 0 ? "¡ Anulada !" : "¡ Desactivada !",
                    text: "Cotizacíón se encuentra " + (celdas[5] == 0 ? "anulada" : "desactivada"),
                    customClass: {
                        confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                    buttonsStyling: false
                });
            } else {
                if (opc_sel == 2 || opc_sel == 3 || opc_sel == 4 || opc_sel == 5) {
                    if ((celdas[5] == 2 || celdas[5] == 3 || celdas[5] == 4 || celdas[5] == 5) && opc_sel != 2) {
                        if (celdas[5] == 2) {
                            Swal.fire({
                                icon: 'error',
                                title: "¡ Cotización se encuentra aprobada !",
                                text: "Cotizacíón se encuentra aprobada.",
                                customClass: {
                                    confirmButton: 'btn btn-primary waves-effect waves-light'
                                },
                                buttonsStyling: false
                            });
                        }
                        if (celdas[5] == 3) {
                            Swal.fire({
                                icon: 'error',
                                title: "¡ Cotización se encuentra desaprobada !",
                                text: "Cotizacíón se encuentra desaprobada.",
                                customClass: {
                                    confirmButton: 'btn btn-primary waves-effect waves-light'
                                },
                                buttonsStyling: false
                            });
                        }
                        if (celdas[5] == 4) {
                            Swal.fire({
                                icon: 'error',
                                title: "¡ Cotización se encuentra desactivada !",
                                text: "Cotizacíón se encuentra desactivada.",
                                customClass: {
                                    confirmButton: 'btn btn-primary waves-effect waves-light'
                                },
                                buttonsStyling: false
                            });
                        }
                    } else {
                        if (opc_sel == 2 || opc_sel == 3){
                            get("/ModCotizaciones/ManteCotizacionesCSV/?data=" + opc_sel + "|" + celdas[1], editarLista);
                        }
                        if (opc_sel == 4) {
                            txtid_cotizacion_aprobar.value = celdas[1];
                            get("/ModCotizaciones/ManteCotizacionesCSV/?data=7|" + dtpFecVig.value, mostrarNroCar);
                            AprobarCotizacion.show();
                        }
                    }
                }
                if (opc_sel == 6) {
                    if (celdas[5] == 2 || celdas[5] == 3 || celdas[5] == 4) {
                        if (celdas[5] == 2) {
                            Swal.fire({
                                icon: 'error',
                                title: "¡ Cotización se encuentra aprobada !",
                                text: "Cotizacíón se encuentra aprobada. No se puede anular",
                                customClass: {
                                    confirmButton: 'btn btn-primary waves-effect waves-light'
                                },
                                buttonsStyling: false
                            });
                        }
                        if (celdas[5] == 3) {
                            Swal.fire({
                                icon: 'error',
                                title: "¡ Cotización se encuentra desaprobada !",
                                text: "Cotizacíón se encuentra desaprobada. No se puede anular",
                                customClass: {
                                    confirmButton: 'btn btn-primary waves-effect waves-light'
                                },
                                buttonsStyling: false
                            });
                        }
                        if (celdas[5] == 4) {
                            Swal.fire({
                                icon: 'error',
                                title: "¡ Cotización se encuentra desactivada !",
                                text: "Cotizacíón se encuentra desactivada. No se puede anular",
                                customClass: {
                                    confirmButton: 'btn btn-primary waves-effect waves-light'
                                },
                                buttonsStyling: false
                            });
                        }
                    } else {
                        Swal.fire({
                            title: "¿ Está seguro de anular cotización " + celdas[1] + " ?",
                            text: "! No se podrá revertir !",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "! Sí, anular !",
                            customClass: {
                                confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                                cancelButton: 'btn btn-outline-secondary waves-effect'
                            },
                            buttonsStyling: false
                        }).then(function (result) {
                            if (result.value) {
                                post("/ModCotizaciones/ManteCotizacionesGrbCSV", mostrarGrabar, opc_sel + "|" + celdas[1]);
                            }
                        });
                    }
                }
                if (opc_sel == 7) {
                    if (celdas[5] == 1) {
                        Swal.fire({
                            icon: 'error',
                            title: "¡ Cotización con estado pendiente !",
                            text: "No se puede generar otra on estado pendiente",
                            customClass: {
                                confirmButton: 'btn btn-primary waves-effect waves-light'
                            },
                            buttonsStyling: false
                        });
                    } else {
                        Swal.fire({
                            title: "¿ Está seguro que desea duplicar cotización " + celdas[1] + " ?",
                            text: "! Se generará una copia con los mismos datos en estado pendiente !",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "! Sí, duplicar !",
                            customClass: {
                                confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                                cancelButton: 'btn btn-outline-secondary waves-effect'
                            },
                            buttonsStyling: false
                        }).then(function (result) {
                            if (result.value) {
                                post("/ModCotizaciones/ManteCotizacionesGrbCSV", mostrarGrabar, "9|" + celdas[1]);
                            }
                        });
                    }
                }
            }
        }
    });

    btnRegresarLista.onclick = function () {
        document.getElementById("lista-lst").hidden = false;
        document.getElementById("lista-edt").hidden = true;
    }

    btnAprobar.onclick = function () {
        if (ControlesAprobarValidar() == 0) {
            var data = obtenerAprobarDatosGrabar();
            post("/ModCotizaciones/ManteCotizacionesGrbCSV", mostrarGrabar, "4|" + data);
        }
    }
    btnDesaprobar.onclick = function () {
        var data = obtenerDesaprobarDatosGrabar();
        post("/ModCotizaciones/ManteCotizacionesGrbCSV", mostrarGrabar, "5|" + data);
    }

    btnGuardarCotizacion.onclick = function () {
        if (ControlesValidar() == 0) {
            var data = obtenerDatosGrabar();
            post("/ModCotizaciones/ManteCotizacionesGrbCSV", mostrarGrabar, "9|" + data);
        }
    }
    function mostrarNroCar(rpta) {
        txtNroCarAsignada.value = rpta;
    }

    btnAgregarServicio.onclick = function () {
        $('#cboServiciosGrp').val('-1').trigger('change.select2');
        document.getElementById("servicios").hidden = false;
        btnAgregarServicio.disabled = true;
    }
    btnCerrarServicio.onclick = function () {
        document.getElementById("servicios").hidden = true;
        btnAgregarServicio.disabled = false;
    }
    document.getElementById('tbl_servicios').addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            let fila = event.target.parentNode.parentNode.parentNode;
            let id_servicio = fila.children[0].innerHTML;
            let servicio = fila.children[1].children[0].value;
            let precio = fila.children[2].children[0].value;

            let tabla = document.getElementById("tabla_servicios_detalle");
            let nuevaFila = document.createElement("tr");
            let celda, enlace;

            enlace = document.createElement("a");
            enlace.title = "Eliminar Servicio";
            enlace.style.color = "red";
            enlace.style.cursor = "pointer";
            enlace.style.textAlign = "center";
            enlace.classList.add("ri-delete-bin-7-line");
            enlace.classList.add("ri-20px");

            celda = document.createElement("td");
            celda.dataset.opc = "1";
            celda.style.textAlign = "center";
            celda.appendChild(enlace);
            nuevaFila.appendChild(celda);

            celda = document.createElement("td");
            celda.textContent = "0";
            celda.style.display = "none";
            nuevaFila.appendChild(celda);

            celda = document.createElement("td");
            celda.textContent = id_servicio;
            celda.style.display = "none";
            nuevaFila.appendChild(celda);

            celda = document.createElement("td");
            celda.textContent = cboServiciosGrp.options[cboServiciosGrp.selectedIndex].text;
            nuevaFila.appendChild(celda);

            celda = document.createElement("td");
            celda.textContent = servicio;
            nuevaFila.appendChild(celda);

            celda = document.createElement("td");
            celda.style.textAlignLast = "right";
            celda.textContent = precio;

            nuevaFila.appendChild(celda);

            // Agregar la fila a la tabla
            tabla.appendChild(nuevaFila);

            // ocultar fila aidcionada
            fila.style.display = "none";
        }
    });
    document.getElementById('tabla_servicios_detalle').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            let fila = event.target.parentNode.parentNode;
            fila.children[0].dataset.opc = '2';
            fila.style.display = "none";
        }
    });

}
function mostrarLista(rpta) {
    matriz = [];
    if (rpta != "") {
        var listas = rpta.split("¯");
        lista = listas[0].split("¬");
        crearCombo(lista, "cboCliPro", "** SELECCIONE CLIENTE **");
        lista = listas[1].split("¬");
        crearCombo(lista, "cboServiciosGrp", "** SELECCIONE GRUPO DE SERVICIOS **");
        lista = listas[2].split("¬");
        crearMatriz();
    }
    mostrarMatriz();
}
function crearMatriz() {
    matriz = [];
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
    ajustarHeadersDataTables($('#tabla'));
    ocultarBloqueo('#lista-lst');
}
function ControlesValidar() {
    eliminarMarcas();
    let validacion = 0;
    validacion += validaCampos('cboCliPro', '-1');
    return (validacion != 0) ? 1 : 0;
}
function eliminarMarcas() {
    removeRedMark('cboCliPro');
}
function editarLista(rpta) {
    ControlesLimpiar(document.getElementById('controles'));
    document.getElementById("servicios").hidden = true;
    btnAgregarServicio.disabled = false;

    var listas = rpta.split("¯");
    var reg = listas[0].split('|');
    txtid_cotizacion.value = reg[0];
    $('#cboCliPro').val(reg[1]).trigger('change.select2');
    txtFecAdi.value = moment(reg[2]).format('DD/MM/YYYY HH:MM:SS');
    txtEstado.value = reg[3];
    if (reg[4] != '0000-00-00') txtFecha_Aprobacion.value = moment(reg[4]).format('DD/MM/YYYY');
    if (reg[5] != '0000-00-00') txtFecha_Vigencia.value = moment(reg[5]).format('DD/MM/YYYY');
    txtNroCar.value = reg[6];
    $('#cboMoneda').val(reg[7]).trigger('change.select2');
    txtRefer.value = reg[8];
    txtPor_Alm.value = reg[9];
    txtTar_Min_Alm.value = reg[10];
    txtPor_Seg.value = reg[11];
    txtTar_Min_Seg.value = reg[12];
    txtAtencion.value = reg[13];
    txtCorreo.value = reg[14];
    txtCelular.value = reg[15];

    if (listas[1]) {
        lista = listas[1].split("¬");
        var campos = [];
        var nRegistros = lista.length;
        var i = 0;
        data = '';
        for (i; i < nRegistros; i++) {
            campos = lista[i].split("|");
            data += '<tr>';
            data += '<td data-opc="1" style="text-align:center;"><a title="Eliminar Servicio" style="color:red;cursor:pointer;text-align:center;" class="ri-delete-bin-7-line ri-20px"></a></td>';
            data += '<td style="display:none">' + campos[0] + '</td>';
            data += '<td style="display:none">' + campos[1] + '</td>';
            data += '<td>' + campos[2] + '</td>';
            data += '<td>' + campos[3] + '</td>';
            data += '<td style="text-align:right">' + campos[4] + '</td>';
            data += '</tr>';
        }
        document.getElementById("tabla_servicios_detalle").innerHTML = data;
    }

    if (opc_sel == 2) {
        controlesDisabled(document.getElementById('controles'));
        btnAgregarServicio.disabled = true;
        btnGuardarCotizacion.disabled = true;
    }
    if (opc_sel == 3) {
        controlesEnabled(document.getElementById('controles'));
        txtDirecc.disabled = true;
        txtFecAdi.disabled = true;
        txtEstado.disabled = true;
        txtFecha_Aprobacion.disabled = true;
        txtFecha_Vigencia.disabled = true;
        btnAgregarServicio.disabled = false;
        btnGuardarCotizacion.disabled = false;
    }
    document.getElementById("lista-lst").hidden = true;
    document.getElementById("lista-edt").hidden = false;
}
function obtenerDatosGrabar() {
    var data = txtid_cotizacion.value * 1 + '|';
    data += cboCliPro.value + '|';
    data += txtNroCar.value + '|';
    data += cboMoneda.value + '|';
    data += txtRefer.value + '|';
    data += txtPor_Alm.value * 1 + '|';
    data += txtTar_Min_Alm.value * 1 + '|';
    data += txtPor_Seg.value * 1 + '|';
    data += txtTar_Min_Seg.value * 1 + '|';
    data += txtAtencion.value + '|';
    data += txtCorreo.value + '|';
    data += txtCelular.value + '¯';
    let tabla = document.getElementById("tabla_servicios_detalle");
    let fila;
    for (let i = 0; i < tabla.rows.length; i++) {
        fila = tabla.rows[i];
        data += fila.children[1].textContent + '|' + fila.children[0].dataset.opc + '|' + fila.children[2].textContent + '|' + fila.children[5].textContent + '¬';
    }
    data = data.slice(0, -1);
    return data;
}
function mostrarGrabar(rpta) {
    var mensaje = "";
    if (rpta.substr(0, 5) != "Error") {
        if (opc_sel == 1 || opc_sel == 7) {
            lista = rpta.split("|");
            var fila = [lista[0], lista[1], lista[2], lista[3], lista[4], lista[5], lista[6], lista[7], lista[8], lista[9], lista[10]];
            tabla.row.add(fila).draw();
            mensaje = opc_sel == 1 ? "Cotización adicionado" : "Se generó la cotización nro " + lista[1];
        }
        if (opc_sel == 3) {
            lista = rpta.split("|");
            celdas[2] = lista[2];
            celdas[3] = lista[3];
            celdas[4] = lista[4];
            celdas[5] = lista[5];
            celdas[6] = lista[6];
            celdas[7] = lista[7];
            celdas[8] = lista[8];
            tabla.row(objfila).data(celdas).draw();
            mensaje =  "Cotización actualizado";
        }
        if (opc_sel == 4 || opc_sel == 5) {
            lista = rpta.split("|");
            celdas[5] = lista[5];
            celdas[6] = lista[6];
            celdas[8] = lista[8];
            celdas[9] = lista[9];
            celdas[10] = lista[10];
            tabla.row(objfila).data(celdas).draw();
            mensaje = (opc_sel == 4 ? "Cotización Aprobada" : "Cotización Desaprobada");
            if (opc_sel == 4) AprobarCotizacion.hide();
            else DesaprobarCotizacion.hide();
        }
        if (opc_sel == 6) {
            lista = rpta.split("|");
            celdas[5] = lista[5];
            celdas[6] = lista[6];
            tabla.row(objfila).data(celdas).draw();
            mensaje = "Cotización anulada";
        }
        Swal.fire({
            icon: 'success',
            title: mensaje,
            text: lista[2],
            customClass: {
                confirmButton: 'btn btn-primary waves-effect waves-light'
            },
            buttonsStyling: false
        });
        document.getElementById("lista-edt").hidden = true;
        document.getElementById("lista-lst").hidden = false;
    }
    else {
        mensaje = rpta; // "Ocurrió un error al grabar";
    }
}
function ControlesAprobarValidar() {
    eliminarAprobarMarcas();
    let validacion = 0;
    validacion += validaCampos('dtpFecApr', '');
    validacion += validaCampos('dtpFecVig', '');
    return (validacion != 0) ? 1 : 0;
}
function eliminarAprobarMarcas() {
    removeRedMark('dtpFecApr', 'dtpFecVig');
}
function obtenerAprobarDatosGrabar() {
    var data = txtid_cotizacion_aprobar.value * 1 + '|';
    data += dtpFecApr.value + '|';
    data += dtpFecVig.value + '|';
    data += txtNroCarAsignada.value;
    return data;
}
function obtenerDesaprobarDatosGrabar() {
    var data = txtid_cotizacion_aprobar.value * 1 + '|';
    data += txtMotivoDesaprobacion.value;
    return data;
}