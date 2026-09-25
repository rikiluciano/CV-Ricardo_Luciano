document.addEventListener('DOMContentLoaded', () => {
    const btnPdf = document.getElementById('btn-pdf');
    const cvContainer = document.getElementById('cv-container');

    // Funcionalidad para descargar como PDF
    btnPdf.addEventListener('click', () => {
        const opt = {
            margin:       0,
            filename:     'CV_Ricardo_Luciano.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Cambiar temporalmente los estilos si es necesario para el renderizado
        html2pdf().set(opt).from(cvContainer).save();
    });
});
