var timesesion = '5';

var hora = 0,
    minuto = timesesion,
    segundo = 0;
var vis = "";
var stop = true;

console.log('entro');

arrancaCronometro();

//window.onload = function () {
function iniciar() {
    $(document).click(function () {
        reiniciaCronometro();
    });

//    reiniciaCronometro();
}

function arrancaCronometro() {
    if (stop == true) {
        stop = false;
        cronometro();
    }
}

function cronometro() {
    if (stop == false) {
        segundo--;

        if (segundo < 1) {
            segundo = 59;
            minuto--;
        }
        if (minuto < 0) {
//            window.location.href = "j_spring_security_logout";
            return false;

        } else {
            mostrarCronometro();

        }

        console.log(segundo);

        window.setTimeout("cronometro()", 1000);
    }
}

function mostrarCronometro() {
    if (minuto < 10) vis = vis + "0";
    vis = vis + minuto + ":";
    if (segundo < 10) vis = vis + "0";
    vis = vis + segundo;
    document.getElementById("vis").innerHTML = vis;
    vis = "";
}

function reiniciaCronometro() {
    hora = segundo = 0;
    minuto = timesesion;
    vis = "";
    mostrarCronometro();
}