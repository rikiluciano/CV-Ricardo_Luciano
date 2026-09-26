import re

with open('editor.js', 'r', encoding='utf-8') as f:
    content = f.read()

autosave_logic = """
    // --- AUTOSAVE LOGIC ---
    let autoSaveTimeout;
    document.getElementById('editor-form').addEventListener('input', (e) => {
        updateDataFromForm(); // Ensure data is updated before saving
        
        const btn = document.getElementById('btn-save');
        if (btn) {
            if (!btn.innerHTML.includes('Guardando')) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando... ☁️';
            }
        }
        
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('saveToFirebase', { detail: editorData }));
        }, 1500);
    });
"""

content = re.sub(r"(document\.getElementById\('btn-save'\)\.addEventListener\('click', \(\) => \{.*?\}\);)", r"\1\n" + autosave_logic, content, flags=re.DOTALL)

with open('editor.js', 'w', encoding='utf-8') as f:
    f.write(content)
