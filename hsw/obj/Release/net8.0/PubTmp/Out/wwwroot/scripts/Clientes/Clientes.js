window.onload = function () {

    guardarUrl();
    btnAceptar.onclick = function () {
        btnAceptar.disabled = true;
        Ingresar();
    }
    txtNroDoc.addEventListener('keydown', function (e) {
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
    var nrodoc = document.getElementById("txtNroDoc").value;
    var clave = document.getElementById("txtClave").value;
    //navegar("/Clientes/Ordenes");
    get("/Clientes/ValidarLoginWeb/?Data=" + nrodoc + "|" + clave, mostrarValidar);
}

function mostrarValidar(rpta) {
    var datos;
    if (rpta != "Login es invalido") {
        datos = rpta.split("|");
        window.sessionStorage.setItem("codusr", datos[0]);
        window.sessionStorage.setItem("usuario", datos[1]);
        window.sessionStorage.setItem("crono", 0);
        navegar("/Clientes/Ordenes");
    }
    else {
        btnAceptar.disabled = false;
        var span = document.getElementById("spnValida");
        span.innerHTML = "*** DATOS NO VALIDOS ***";
    }
}