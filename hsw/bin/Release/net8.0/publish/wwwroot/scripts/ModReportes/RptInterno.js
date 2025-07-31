const fechaActual = new Date();
const dia = fechaActual.getDate().toString().padStart(2, '0');
const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
const anio = fechaActual.getFullYear();
const Hoy = `${anio}-${mes}-${dia}`;
dtpFecha.value = Hoy;
function iniciar() {
    btnExportar.onclick = function () {
        Swal.fire({
            title: "¿ Seguro de exportar informe mensual interno al Excel ?",
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
                let tipo = radioAduanero.checked ? 1 : 0;
                let formato = radioDetalle.checked ? 1 : 0;
                navegar("/ModReportes/RptInterno_XLS/?data=" + dtpFecha.value + '|' + tipo + '|' + formato);
            }
        });
    }
}