import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_logic = r"""
        // Extraer nombre para el archivo
        let userName = 'Mi_CV';
        if (window.cvData && window.cvData.name) {
            userName = window.cvData.name.replace(/\s+/g, '_');
        } else {
            const nameEl = document.getElementById('name');
            if (nameEl && nameEl.innerText) userName = nameEl.innerText.replace(/\s+/g, '_');
        }
        
        const opt = {
            margin:       0,
            filename:     `CV_${userName}.pdf`,
            image:        { type: 'jpeg', quality: 1.0 },
            html2canvas:  { scale: 3, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };"""

content = re.sub(r"const opt = \{.*?\n\s+pagebreak:.*?\{.*?\}\n\s+\};", new_logic.replace('\\', '\\\\'), content, flags=re.DOTALL)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)
