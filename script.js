document.addEventListener('DOMContentLoaded', () => {
    const btnPdf = document.getElementById('btn-pdf');
    const btnWord = document.getElementById('btn-word');
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

    // Funcionalidad para descargar como Word
    btnWord.addEventListener('click', () => {
        // Nota: La exportación de HTML complejo a Word nativo (sin backend) 
        // puede no mantener el 100% del diseño de Flexbox/CSS Grid.
        // Se exporta el contenido para que el texto y estructura base se mantengan.
        
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>CV Ricardo Luciano</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + cvContainer.innerHTML + footer;
        
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = 'CV_Ricardo_Luciano.doc';
        fileDownload.click();
        
        document.body.removeChild(fileDownload);
    });
});
