import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_listener = """        window.addEventListener('saveToFirebase', async (e) => {
            if(!currentUserId) return;
            const editorData = e.detail;
            
            const btn = document.getElementById('btn-save');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            btn.disabled = true;

            try {
                const cvRef = doc(db, `users/${currentUserId}/cvs/default`);
                await setDoc(cvRef, editorData);
                // No mostramos toast continuo para no ser molestos con el auto-guardado
                btn.innerHTML = '<i class="fas fa-check"></i> Guardado ✅';
            } catch (error) {
                console.error("Error guardando:", error);
                btn.innerHTML = '<i class="fas fa-times"></i> Error al guardar';
                window.showToast('Error al guardar.', 'error');
            } finally {
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
                    btn.disabled = false;
                }, 2500);
            }
        });"""

content = re.sub(r"window\.addEventListener\('saveToFirebase', async \(e\) => \{.*?\n\s+}\);\n", new_listener + "\n", content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
