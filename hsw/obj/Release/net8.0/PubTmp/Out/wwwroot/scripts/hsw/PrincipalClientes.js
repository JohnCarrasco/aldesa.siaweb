var listaMenu;
var filaAnterior;

var idioma_espanol = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "No hay datos disponibles en este momento.",
    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    },
    "buttons": {
        "copy": "Copiar",
        "colvis": "Visibilidad"
    }
}

var timesesion = '30';
var hora = 0,
    minuto = timesesion,
    segundo = 0;
var vis = "";
var stop = true;
var crono = window.sessionStorage.getItem("crono");
// Código del Web Worker como una cadena
var workerCode = `
    var minuto = ${timesesion};
    var segundo = 0;
    var stop = true;
    var timerId;

    self.onmessage = function(e) {
        var data = e.data;

        if (data === 'start') {
            stop = false;
            if (!timerId) {
                // Enviar el estado inicial inmediatamente al 'start'
                self.postMessage({minuto: minuto, segundo: segundo});
                // Y luego iniciar el ciclo con el primer decremento después de 1 segundo
                timerId = setTimeout(cronometro, 1000);
            }
        } else if (data === 'stop') {
            stop = true;
            clearTimeout(timerId);
            timerId = null;
        } else if (data === 'reset') {
            minuto = ${timesesion};
            segundo = 0;
            stop = false;
            clearTimeout(timerId);
            timerId = null;
            // Enviar el estado inicial después del reset
            self.postMessage({minuto: minuto, segundo: segundo});
            // Y luego iniciar el ciclo
            timerId = setTimeout(cronometro, 1000);
        }
    };

    function cronometro() {
        if (!stop) {
            segundo--;
            if (segundo < 0) {
                segundo = 59;
                minuto--;
            }

            // Solo enviamos si el tiempo aún no ha terminado, para evitar un envío extra de -1:-1
            if (minuto >= 0) {
                self.postMessage({minuto: minuto, segundo: segundo});
                timerId = setTimeout(cronometro, 1000);
            } else {
                // Si el tiempo terminó, podemos enviar un último mensaje de 0:00 y detenernos
                self.postMessage({minuto: 0, segundo: 0, finished: true});
                clearTimeout(timerId);
                timerId = null;
            }
        }
    }
`;

// Crear el Blob y la URL del Worker
var blob = new Blob([workerCode], { type: 'application/javascript' });
var workerURL = URL.createObjectURL(blob); // Crea una URL temporal para el Blob
var worker = new Worker(workerURL); // Instancia el Web Worker usando esa URL

// Escuchar mensajes del Web Worker (actualizaciones del cronómetro)
worker.onmessage = function (e) {
    var data = e.data; // Datos enviados desde el worker (minuto, segundo, y quizás finished: true)
    minuto = data.minuto; // Actualiza la variable 'minuto' en el hilo principal
    segundo = data.segundo; // Actualiza la variable 'segundo' en el hilo principal

    actualizarCronometro();

    if (minuto === 0 && segundo <= 59) {
        $("#vis2").html(segundo);
        if (!document.querySelector('.swal2-container')) {
            sendNotification("🔔 ¡Atención! Sesión por cerrarse 🔔", "Tu sesión está a punto de cerrarse. ¿Deseas continuar?");
            changeTabTitle("🔔 ¡Atención! Sesión por cerrarse 🔔");
            Swal.fire({
                title: 'Cierre de sesión automático',
                html: `<p style="font-size:18px;">Si deseas continuar haz clic en <b style="font-size:18px;">¡ Continuar !</b></p>
                       <br><label style="font-size:45px; color:orange;" id="vis2">${segundo}</label>`,
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#137a7f',
                confirmButtonText: "¡ Continuar !",
                customClass: {
                    confirmButton: 'btn btn-primary me-3 waves-effect waves-light'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    get("/HSW/VolverReiniciarChronometro", () => { });
                    worker.postMessage('reset');
                }
            })
        }
    }
    if (data.finished) {
        console.log("Sesión terminada (desde 'finished' en worker)");
        window.sessionStorage.setItem("crono", 0);
        navegar("/hsw/Login");
        worker.postMessage('stop');
    }
};
function arrancaCronometro() {
    if (stop == true) {
        stop = false;
        iniciarWorker();
    }
}
//function iniciarWorker() {
//    worker.postMessage('start');
//}
function actualizarCronometro() {
    const minFormateado = minuto.toString().padStart(2, '0');
    const segFormateado = segundo.toString().padStart(2, '0');
    document.getElementById('tiempo_restante').textContent = `${minFormateado}:${segFormateado}`;
    const relojStrongElement = document.querySelector('#reloj_cont strong');
    const relojContElement = document.getElementById('reloj_cont');
    if (relojStrongElement && relojContElement) {
        if (minuto < 1 && segundo < 60) {
            relojStrongElement.style.color = "red";
        } else {
            relojStrongElement.style.color = "black";
        }
    }
}
function reiniciaCronometro() {
    worker.postMessage('reset');
    vis = "";
    actualizarCronometro();
    get("/HSW/VolverReiniciarChronometro", () => { });
}

window.onload = function () {

    //$(document).on("click", function () {
    //    reiniciaCronometro();
    //});
    //reiniciaCronometro();


    /*************
        $(document).on('focus', '#txtCodigo', function () {
            var list = [
                "Test",
                "Test 2",
                "Test 4",
                "Example 1",
                "Example 2"
            ];
    
            console.log(list);
    
            $(this).autocomplete({
                //source take a list of data
                source: list,
                minLength: 1 //min = 2 characters
            });
        });
    */




    //guardarUrl();
    //    var codusr = window.sessionStorage.getItem("codusr");
    //    var usuario = window.sessionStorage.getItem("usuario");
    //    document.getElementById("spnUsuario").innerHTML = usuario;
    //    get("/hsw/listarMenus", mostrarMenu);
}
function sendNotification(title, body) {
    if (Notification.permission === "granted") {
        const notification = new Notification(title, { body });
        notification.onclick = () => {
            window.focus();
            /*document.getElementById('modal').style.display = "block";*/
        };
    } else if (Notification.permission === "denied") {
        /*document.getElementById('notificationInfo').style.display = 'block';*/
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                const notification = new Notification(title, { body });
                notification.onclick = () => {
                    window.focus();
                    /*document.getElementById('modal').style.display = "block";*/
                };
            } else if (permission === "denied") {
                /*document.getElementById('notificationInfo').style.display = 'block';*/
            }
        });
    }
}
function changeTabTitle(message) {
    const originalTitle = document.title;
    document.title = message;
    let isOriginal = true;

    let intervalId = setInterval(() => {
        document.title = isOriginal ? message : originalTitle;
        isOriginal = !isOriginal;
    }, 1000);

    setTimeout(() => {
        document.title = originalTitle;
        clearInterval(intervalId);
    }, 15000); // Cambiar el título de vuelta después de 5 segundos
}
//function arrancaCronometro() {
//    if (stop == true) {
//        stop = false;
//        cronometro();
//    }
//}



//function cronometro() {
//    if (stop == false) {
//        segundo--;

//        if (segundo < 0) {
//            segundo = 59;
//            minuto--;
//        }
//        if (minuto < 1) {
//            document.getElementById("reloj_cont").style.color = "red";
//            document.getElementById("reloj_cont").style.backgroundColor = "yellow";
//            //console.log(segundo);
//            $("#vis2").html(segundo);

//            if (document.querySelector('.swal2-container')) {
//                //console.log("no hacer nada");
//            } else {
//                //console.log("existe el elemento");
//                Swal.fire({
//                    title: 'Cierre de sesión automático',
//                    html: '<p style="font-size:18px;">Si deseas continuar haz clic en <b style="font-size:18px;">CONTINUAR</b></p><br><label style="font-size:45px; color:orange;" id="vis2"></label>',
//                    icon: 'warning',
//                    showCancelButton: false,
//                    confirmButtonColor: '#137a7f',
//                    //cancelButtonColor: '#e12885',
//                    confirmButtonText: 'CONTINUAR',
//                    //cancelButtonText: 'Cancelar',
//                }).then((result) => {
//                    if (result.isConfirmed) {
//                        //enviamos la data al back
//                        //post("/ModRecursosHumanos/EvaAsignarEvas", mostrarGrabar, data);
//                        get("/HSW/VolverReiniciarChronometro", mostrarGrabar);
//                        //console.log("algo");
//                    }
//                })
//            }

//            //swal2-container swal2-center swal2-backdrop-show


//        }
//        else {
//            //document.getElementById("reloj_cont").style.color = "black";
//            //document.getElementById("reloj_cont").style.backgroundColor = "white";
//            try {
//                document.getElementById("reloj_cont").style.color = "black";
//                document.getElementById("reloj_cont").style.backgroundColor = "white";
//            } catch (error) {
//                //console.log(error);
//            }
//        }

//        if (minuto < 0) {
//            //            window.location.href = "j_spring_security_logout";
//            window.sessionStorage.setItem("crono", 0);
//            navegar("/hsw/Login");
//            return false;

//        } else {
//            mostrarCronometro();

//        }
//        setTimeout("cronometro()", 1000);
//    }
//}

//function mostrarGrabar(rpta) {
//    //console.log(rpta);
//    // dejo esto aqui por si se quisiera hacer algo más - Anco
//}

//function mostrarCronometro() {
//    if (minuto < 10) vis = vis + "0";
//    vis = vis + minuto + ":";
//    if (segundo < 10) vis = vis + "0";
//    vis = vis + segundo;
//    var reloj = document.getElementById("vis");
//    if (reloj != null) reloj.innerHTML = vis;
//    vis = "";

//}

//function reiniciaCronometro() {
//    hora = segundo = 0;
//    minuto = timesesion;
//    vis = "";
//    mostrarCronometro();
//    get("/HSW/VolverReiniciarChronometro", mostrarGrabar);
//}
function get(url, metodoCallBack) {
    requestServer("get", url, metodoCallBack)
}

function getScript(url, metodoCallBack) {
    requestServer("get", url, metodoCallBack, "", true)
}

function post(url, metodoCallBack, data) {
    requestServer("post", url, metodoCallBack, data)
}

function postDownload(url, metodoCallBack, data) {
    requestServer("post", url, metodoCallBack, data, null, "arraybuffer");
}

function requestServer(metodoHttp, url, metodoCallBack, data, sinUrlBase, tipoRpta) {
    var urlBase = window.sessionStorage.getItem("urlBase");
    var xhr = new XMLHttpRequest();
    if (tipoRpta != null && tipoRpta != "") xhr.responseType = tipoRpta;
    if (sinUrlBase != null && sinUrlBase != "") xhr.open(metodoHttp, url);
    else xhr.open(metodoHttp, urlBase + url);
    var token = window.sessionStorage.getItem("token", token);
    xhr.setRequestHeader("token", token);

    var divEspera = document.getElementById("divEspera");
    if (divEspera != null) divEspera.style.display = "inline";
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            if (divEspera != null) divEspera.style.display = "none";
            if (tipoRpta != null && tipoRpta != "text") metodoCallBack(xhr.response);
            else metodoCallBack(xhr.responseText);
        }
    }

    if (metodoHttp == "get") xhr.send();
    else {
        if (data != null && data != "") xhr.send(data);
    }
}
function mostrarMenu(rpta) {
    if (rpta != "") {
        listaMenu = rpta.split("¬");
        crearTreeView();
        //        crearArbol();
    }
}
function crearTreeView() {
    var contenido = "<ul class='menu'>";
    var nRegistros = listaMenu.length;
    var campos = [];
    for (var i = 0; i < nRegistros; i++) {
        campos = listaMenu[i].split("|");
        if (campos[3] == "0") {

            //            contenido += "<li><span class='Enlace2' data-url='";
            //            contenido += "<li><div class='sub-menu'><span data-url='";
            contenido += "<li><div class='sub-menu' data-url='";
            if (campos[2] != "") contenido += campos[2];
            contenido += "' onclick='expandir(this);'>";
            contenido += campos[1];
            contenido += "</div>";
            //            contenido += "</span></div>";
            //            contenido += "</span>";
            contenido += crearSubTree(campos[0]);
            contenido += "</li>";
        }
    }
    contenido += "</ul>";
    document.getElementById("contenedor-menu").innerHTML = contenido;
}

function crearSubTree(idPadre) {
    var contenido = "<ul style='display: none;'>";
    var nRegistros = listaMenu.length;
    var campos = [];
    for (var i = 0; i < nRegistros; i++) {
        campos = listaMenu[i].split("|");
        if (campos[3] == idPadre) {
            //            contenido += "<li><span class='Enlace2' data-url='";
            //            contenido += "<li><div class='sub-sub-menu'><span data-url='";
            contenido += "<li><div class='sub-sub-menu' data-url='";
            if (campos[2] != "") contenido += campos[2];
            contenido += "' onclick='expandir(this);'>";
            contenido += campos[1];
            contenido += "</div>";
            //            contenido += "</span></div>";
            //            contenido += "</span>";
            contenido += crearSubTree(campos[0]);
            contenido += "</li>";
        }
    }
    contenido += "</ul>";
    return contenido;
}

function expandir(span) {
    if (span.className == "menu-link") {
        $(".menu-item").removeClass('active');
        $(span.parentNode).addClass('active');
        var url = span.getAttribute("data-url");
        post(url, mostrarPagina, " ");
    }
}

function expandirDB(span) {
    var url = span.getAttribute("data-url");
    post(url, mostrarPagina, " ");

}

function mostrarPagina(rpta) {
    if (rpta != "") {
        if (rpta.search("Login.js") > 0) {
            navegar('/HSW/Login');
        } else {
            divPagina.innerHTML = rpta;
            var scripts = divPagina.getElementsByTagName("script");
            var cc = 0;
            while (cc < scripts.length) {
                if (scripts[cc].src.search('v=1') > -1) {
                    url = scripts[cc].src;
                    getScript(url, ejecutarJS);
                }
                cc++
            }
        }
    }
}

function ejecutarJS(rpta) {
    if (rpta.search("iniciar()") > 0) {
        eval(rpta);
        iniciar();
    }
}

function crearArbol() {
    var nRegistros = listaMenu.length;
    var campos;
    var nCampos;
    var contenido = "<nav>";
    contenido += "<ul id='ulMenu' class='nav'>";
    for (var i = 0; i < nRegistros; i++) {
        campos = listaMenu[i].split("|");
        nCampos = campos.length;
        if (campos[3] == "0") {
            contenido += "<li><a href='#' ";
            if (campos[2] != "") {
                contenido += " onclick='obtenerHtml(\"";
                contenido += campos[2];
                contenido += "\");'";
            }
            contenido += ">";
            contenido += campos[1];
            contenido += "</a>";
            contenido += crearSubArbol(campos[0]);
            contenido += "</li>";
        }
    }
    contenido += "</ul>";
    contenido += "</nav>";
    document.getElementById("divMenu").innerHTML = contenido;
}

function crearSubArbol(idMenu) {
    var nRegistros = listaMenu.length;
    var campos;
    var nCampos;
    var contenido = "<ul>";
    for (var j = 0; j < nRegistros; j++) {
        campos = listaMenu[j].split("|");
        nCampos = campos.length;
        if (campos[3] == idMenu) {
            contenido += "<li><a href='#' ";
            if (campos[2] != "") {
                contenido += " onclick='obtenerHtml(\"";
                contenido += campos[2];
                contenido += "\");'";
            }
            contenido += ">";
            contenido += campos[1];
            contenido += "</a>";
            contenido += crearSubArbol(campos[0]);
            contenido += "</li>";
        }
    }
    contenido += "</ul>";
    return contenido;
}

function crearCombox(lista, idCombo, primerItem) {
    var contenido = "";
    if (primerItem != null && primerItem != "") {
        contenido += "<option value='0'>";
        contenido += primerItem;
        contenido += "</option>";
    }
    var nRegistros = lista.length;
    var campos = [];
    for (var i = 0; i < nRegistros; i++) {
        campos = lista[i].split('|');
        contenido += "<option value='";
        contenido += campos[0];
        contenido += "'>";
        contenido += campos[1];
        contenido += "</option>";
    }
    var cbo = document.getElementById(idCombo);
    if (cbo != null) cbo.innerHTML = contenido;
}

function crearCombo(lista, idCombo, primerItem) {
    var contenido = "";
    if (primerItem != null && primerItem != "") {
        contenido += "<option value='-1' data-adicional='' selected>";
        contenido += primerItem;
        contenido += "</option>";
        if (primerItem.substring(0, 2) == '--') {
            contenido += "<option value='0' data-adicional=''>";
            contenido += "TODOS";
            contenido += "</option>";
        }
    }
    if (lista[0] != '') {
        var nRegistros = lista.length;
        var campos = [];
        for (var i = 0; i < nRegistros; i++) {
            campos = lista[i].split('|');
            contenido += "<option value='";
            contenido += campos[0];
            if (campos.length > 2) contenido += "' data-adicional='" + campos[2];
            contenido += "'>";
            contenido += campos[1];
            contenido += "</option>";
        }
    }
    var cbo = document.getElementById(idCombo);
    if (cbo != null) cbo.innerHTML = contenido;
}

function validarDatos() {
    var mensaje = validarRequeridos("Requerido");
    var spnValida = document.getElementById("spnValida");
    //if (mensaje == "") {
    //    mensaje = validarNumeros("Numero");
    //    if (mensaje == "") spnValida.innerHTML = "";
    //    else spnValida.innerHTML = "<ul>" + mensaje + "</ul>";
    //}
    //else {
    //    spnValida.innerHTML = "<ul>" + mensaje + "</ul>";
    //}
    return (mensaje == "");
}

function validarRequeridos(clase) {
    var controles = document.getElementsByClassName(clase);
    var control;
    var nControles = controles.length;
    var fila;
    var mensaje = "";
    for (var j = 0; j < nControles; j++) {
        control = controles[j];
        if (control.value == "") {
            fila = control.parentNode.parentNode;
            mensaje += "<li>Ingresa ";
            mensaje += fila.firstChild.innerHTML;
            mensaje += "</li>";
            control.style.borderColor = "red";
        }
        else {
            control.style.borderColor = "";
        }
    }
    return (mensaje);
}

function validarNumeros(clase) {
    var controles = document.getElementsByClassName(clase);
    var control;
    var nControles = controles.length;
    var fila;
    var mensaje = "";
    for (var j = 0; j < nControles; j++) {
        control = controles[j];
        if (isNaN(control.value)) {
            fila = control.parentNode.parentNode;
            mensaje += "<li>";
            mensaje += fila.firstChild.innerHTML;
            mensaje += " debe ser numérico</li>";
            control.style.borderColor = "red";
        }
        else {
            if ((control.value * 1) < 0) {
                fila = control.parentNode.parentNode;
                mensaje += "<li>";
                mensaje += fila.firstChild.innerHTML;
                mensaje += " debe ser numérico mayor o igual a cero</li>";
                control.style.borderColor = "red";
            }
            else control.style.borderColor = "";
        }
    }
    return (mensaje);
}

function navegar(url) {
    var urlBase = window.sessionStorage.getItem("urlBase");
    window.location.href = urlBase + url;
}

function guardarUrl() {
    var urlBase = document.getElementById("hdfRaiz").value;
    window.sessionStorage.setItem("urlBase", urlBase);
    //var token = document.getElementById("hdfToken").value;
    //window.sessionStorage.setItem("token", token);
}

function obtenerHtml(url) {
    get(url, mostrarPagina);
}

/** FunciÃ³n removeRedMark() sirve para quitar la clase css 'is-invalid' 
 * a los campos para que inicien sin la clase
 * @arguments {string, ...} Recibe los nombres de los campos del formulario a los que le quitaremos la clase
 * return Nada
 */
function removeRedMark() {
    for (let i = 0; i < arguments.length; i++) {
        $('#' + arguments[i]).removeClass("is-invalid");
    }
}

function soloLetras(letra) {
    tecla = (document.querySelectorAll('*')) ? letra.keyCode : letra.which;
    //Tecla de retroceso para borrar, y espacio siempre la permite
    if (tecla == 8 || tecla == 32) {
        return true;
    }

    // Patrón de entrada
    patron = /[A-Za-zÑñ]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}

/** FunciÃ³n para permitir solo numeros en inputs
 * @data {evt}: evento (onkeydown)
 * return: nada
 */
function soloNumeros(evt) {
    var theEvent = evt;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\.|\t|[\b]/;
    if (!regex.test(key) && key !== 'Tab') {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function soloNumerosCond(evt) {
    var theEvent = evt;
    var key = theEvent.key; // Code || theEvent.which;
    var regex = /[0-9]|\.|\t|[\b]/;
    var xTipDocPer = document.getElementById('cboTipDocPer').value;
    key = String.fromCharCode(key).toUpperCase();
    if (xTipDocPer == 1 || xTipDocPer == 6) {
        if (!regex.test(key) && key !== 'Tab') {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }
}

function validarRango(evt) {
    var numero = parseInt(evt.value, 10);
    //Validamos que se cumpla el rango
    if (numero < 0 || numero > 20) {
        //        alertify.alert('Registro de notas', 'Solo se permite el siguiente rango: 0 - 20');
        evt.focus();
        evt.select();
        return false;
    }
    return true;
}

/** FunciÃ³n para validar campos de acuerdo a una condiciÃ³n establecida.
 * AdemÃ¡s si el campo estÃ¡ deshabilitado retorna como vÃ¡lido el valor.
 * @nomCampo {string} Recibe el nombre del campo del formulario que validaremos 
 * @condicion {string} Recibe la condiciÃ³n que evaluaremos contra el valor del campo
 * return Retorna una bandera encendido o apagado
 */
function validaCampos(nomCampo, condicion) {
    var field = $('#' + nomCampo).val();
    if (field == condicion || field == null) {
        if ($('#' + nomCampo).is(':disabled') || $('#' + nomCampo).is(':hidden')) {
            $('#' + nomCampo).removeClass("is-invalid");
            return 0
        } else {
            $('#' + nomCampo).addClass("is-invalid");
            return 1;
        }
    } else {
        $('#' + nomCampo).removeClass("is-invalid");
        return 0;
    }
}

function crear_json(lista) {
    var texto_j = [];
    var nRegistros = lista.length;
    var campos = [];
    var fila = [];
    var i = 0;
    campos = lista[0].split("|");
    for (i; i < nRegistros; i++) {
        campos = lista[i].split("|");
        fila = { value: campos[0], label: campos[1] };
        texto_j.push(fila);
    }
    return (texto_j);
}

function sortTable(n, name_table) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(name_table);
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function ajustarHeadersDataTables(element) {

    var observer = window.ResizeObserver ? new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
            var dtApi = $(entry.target).DataTable();
            if (dtApi) {
                dtApi.columns.adjust();
            } else {
                console.warn("DataTable API object is undefined when ResizeObserver triggered.");
            }
            //$(entry.target).DataTable().columns.adjust();
        });
    }) : null;

    resizeHandler = function ($table) {
        if (observer && $table.length > 0 && $.fn.DataTable.isDataTable($table)) {
            observer.observe($table[0]);
        } else {
            //console.warn("No se puede observar un elemento que no es una DataTable o el observador no está disponible.", $table);
        }
    };

    resizeHandler(element);
}

//anco
function InputDecimal(input) {
    input.on({
        "focus": function (event) {
            event.target.select();
        },
        "input": function (event) {
            event.target.value = event.target.value
                .replace(/\D/g, "") // Elimina caracteres no numéricos
                .replace(/([0-9])([0-9]{2})$/, '$1.$2') // Agrega el punto decimal
                .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ","); // Agrega comas
        }
    });
}
function mostrarBloqueo(elemento, mensaje = "Por favor espere...", overlayOpacidad = 0.5) {
    $(elemento).block({
        message: `<div class="d-flex justify-content-center">
                      <p class="mb-0">${mensaje}</p> 
                      <div class="sk-wave m-0">
                          <div class="sk-rect sk-wave-rect"></div> 
                          <div class="sk-rect sk-wave-rect"></div> 
                          <div class="sk-rect sk-wave-rect"></div> 
                          <div class="sk-rect sk-wave-rect"></div> 
                          <div class="sk-rect sk-wave-rect"></div>
                      </div> 
                  </div>`,
        css: {
            backgroundColor: 'transparent',
            border: '0'
        },
        overlayCSS: {
            opacity: overlayOpacidad
        }
    });
}
function ocultarBloqueo(elemento) {
    $(elemento).unblock();
}
function saltarSiguienteCampo(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita que el formulario se envíe al presionar Enter
        let currentTabIndex = parseInt(event.target.getAttribute("tabIndex"));
        let nextTabIndex = currentTabIndex + 1;
        let nextField = document.querySelector('[tabIndex="' + nextTabIndex + '"]');
        if (nextField) {
            nextField.focus();
            // Seleccionar el contenido si es un campo de texto o textarea
            if (nextField.tagName === 'INPUT' && (nextField.type === 'text' || nextField.type === 'email' || nextField.type === 'password') || nextField.tagName === 'TEXTAREA') {
                nextField.select();
            }
        } else {
            // Si no hay más campos, puedes enviar el formulario o hacer otra acción
            console.log("No hay más campos, puedes enviar el formulario aquí.");
            // document.getElementById("miFormulario").submit();
        }
    }
}
function ControlesLimpiar(bloque_controles) {
    bloque_controles.querySelectorAll('input, select, textarea').forEach(elemento => {
        if (elemento.type === 'text' || elemento.type === 'textarea' || elemento.type === 'date') {
            elemento.value = '';
        } else if (elemento.type === 'number') {
            elemento.value = '0';
        } else if (elemento.type === 'checkbox' || elemento.type === 'radio') {
            elemento.checked = false;
        } else if (elemento.tagName === 'SELECT') {
            elemento.selectedIndex = 0; // Selecciona la primera opción (si existe una por defecto)
            if ($(elemento).hasClass('select2-hidden-accessible')) { // Verifica si tiene la clase de Select2
                $(elemento).trigger('change.select2');
            }

        }
    });
    eliminarMarcas(bloque_controles);
}
function eliminarMarcas(bloque_controles) {
    if (bloque_controles) {
        bloque_controles.querySelectorAll('.is-invalid').forEach(control => {
            control.classList.remove('is-invalid'); // Elimina la indicación de error visual
        });
    }
}
function controlesDisabled(bloque_controles) {
    bloque_controles.querySelectorAll('input, select, textarea, button').forEach(elemento => {
        elemento.disabled = true;
    });
}
function controlesEnabled(bloque_controles) {
    bloque_controles.querySelectorAll('input, select, textarea, button').forEach(elemento => {
        elemento.disabled = false;
    });
}
function format(n) {
    n = n.toString()
    while (true) {
        var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
        if (n == n2) break
        n = n2
    }
    return n
}