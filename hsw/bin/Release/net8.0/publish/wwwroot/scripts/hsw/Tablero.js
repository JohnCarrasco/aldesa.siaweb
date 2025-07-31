function iniciar() {
    get("/hsw/TableroCSV", mostrarTablero); 
}
function mostrarTablero(rpta) {
    if (rpta != "") {
        txtTotClientes.innerHTML = rpta;
    }
}