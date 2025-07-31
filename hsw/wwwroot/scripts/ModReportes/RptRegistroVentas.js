const fechaActual = new Date();
const dia = fechaActual.getDate().toString().padStart(2, '0');
const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
const anio = fechaActual.getFullYear();
const Ini = `${anio}-${mes}-01`;
const Hoy = `${anio}-${mes}-${dia}`;
dtpFecIni.value = Ini;
dtpFecFin.value = Hoy;
function iniciar() {
    btnExportar.onclick = function () {
        Swal.fire({
            title: "¿ Seguro de exportar ventas al Excel ?",
            text: "Exportar",
            icon: "enabled",
            showCancelButton: true,
            confirmButtonText: "! Sí, exportar !",
            customClass: {
                confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                cancelButton: 'btn btn-outline-secondary waves-effect'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                navegar("/ModReportes/RptRegistroVentas_XLS/?data=" + dtpFecIni.value + '|' + dtpFecFin.value);
            }
        });
    }
}