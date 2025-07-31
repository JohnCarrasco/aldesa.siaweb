window.onload = function () {

    //console.log('El carácter especial es: ¬');

    //var connection = new signalR.HubConnectionBuilder()
    //    .withUrl("/chatHub")
    //    .build();

    //connection.start().then(function () {
    //    console.log('Conexion exitosa');
    //}).catch(function (err) {
    //    console.log(err);
    //});

    //connection.on('Receive', function (user, message) {
    //    let div = document.createElement('div');
    //    div.textContent = user + ' ' + message;
    //    document.getElementById('div').appendChild(div);
    //});

    guardarUrl();
    btnAceptar.onclick = function () {
        btnAceptar.disabled = true;
/*
        connection.invoke("SendMessage", "JOhn", "Prueba").catch(function (err) {
            return console.error(err.toString());
        });
*/
        Ingresar();
    }
    txtEmpresa.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            txtUsuario.select();
            txtUsuario.focus();
        }

    })
    txtUsuario.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            txtClave.select();
            txtClave.focus();
        }
    })
    txtClave.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') btnAceptar.onclick();
    })
}

function Ingresar() {
//    if (validarDatos()) {

    var empresa = document.getElementById("txtEmpresa").value;
    //var usuario = document.getElementById("txtUsuario").value;
    //var clave = document.getElementById("txtClave").value;

    console.log(txtClave.value);
    //console.log(clave);

    get("/hsw/ValidarLogin/?Data=" + empresa + "|" + txtUsuario.value + "|" + encodeURIComponent(txtClave.value), mostrarValidar);

    //fetch('https://api.ipify.org?format=json')
    //    .then(response => response.json())
    //    .then(data => {
    //        ip = data.ip;
    //        get("/hsw/ValidarLogin/?Data=" + empresa + "|" + usuario + "|" + clave + "|" + ip + "|" + appVersion, mostrarValidar);
    //    })
    //    .catch(error => {
    //        ip = error;
    //        get("/hsw/ValidarLogin/?Data=" + empresa + "|" + usuario + "|" + clave + "|" + ip + "|" + appVersion, mostrarValidar);
    //    });

//    }
}

function mostrarValidar(rpta) {
    var datos;
    if (rpta != "Login es invalido") {
        datos = rpta.split("|");
        window.sessionStorage.setItem("codusr", datos[0]);
        window.sessionStorage.setItem("usuario", datos[1]);
        window.sessionStorage.setItem("crono", 0);
        navegar("/hsw/Inicio");
    }
    else {
        btnAceptar.disabled = false;
        var span = document.getElementById("spnValida");
        span.innerHTML = "*** DATOS NO VALIDOS ***";
    }
}