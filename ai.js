// =============== AI INTEGRATION ===============
document.addEventListener('DOMContentLoaded', () => {
    // Add AI magic styles
    const style = document.createElement('style');
    style.innerHTML = `
        .btn-ai {
            background: linear-gradient(135deg, #6366f1, #a855f7);
            color: white; border: none; padding: 4px 10px; border-radius: 6px; 
            font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
            transition: opacity 0.2s, transform 0.2s;
        }
        .btn-ai:hover { opacity: 0.9; transform: scale(1.02); }
        .btn-ai:disabled { opacity: 0.5; cursor: not-allowed; }
        .form-group label { display: flex; justify-content: space-between; align-items: center; width: 100%; }
    `;
    document.head.appendChild(style);

    // AI Logic
    window.aiImprove = async function(path, type, btn) {
        const textarea = document.querySelector(`textarea[data-path='${path}']`);
        if (!textarea) return;
        
        let originalText = textarea.value.trim();
        if (type === 'improve' && !originalText) {
            alert('Por favor, escribe algunas palabras o tareas básicas para que la IA las mejore.');
            return;
        }
        
        if (type === 'summary' && !originalText) {
            const exps = window.editorData.experience.map(e => `${e.role} en ${e.company}. Tareas: ${e.tasks.join(', ')}`).join('. ');
            originalText = `Basado en mi experiencia: ${exps}`;
            if (window.editorData.experience.length === 0) {
                alert('Agrega al menos una experiencia laboral para poder generar el perfil automáticamente.');
                return;
            }
        }

        const originalBtnHtml = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Pensando...`;
        btn.disabled = true;
        
        try {
            const workerUrl = 'https://patient-forest-6eb6.asielluciano1997.workers.dev/';
            const response = await fetch(workerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: originalText, type: type })
            });
            
            if (!response.ok) throw new Error('Error al conectar con la IA');
            const data = await response.json();
            
            // Typing effect
            btn.innerHTML = `<i class="fas fa-magic"></i> Escribiendo...`;
            const newText = data.result.replace(/"/g, '').trim();
            textarea.value = '';
            
            let i = 0;
            const speed = 25; 
            
            function typeWriter() {
                if (i < newText.length) {
                    textarea.value += newText.charAt(i);
                    i++;
                    // Trigger input event to update preview in real-time!
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(typeWriter, speed);
                } else {
                    btn.innerHTML = originalBtnHtml;
                    btn.disabled = false;
                }
            }
            typeWriter();

        } catch (err) {
            console.error(err);
            alert('Ocurrió un error al contactar a la IA.');
            btn.innerHTML = originalBtnHtml;
            btn.disabled = false;
        }
    };

    // Observers to inject buttons when form is re-rendered
    const observer = new MutationObserver(() => {
        // Profile Summary Button
        const profileLabel = document.querySelector(`textarea[data-path='profileText']`)?.previousElementSibling;
        if (profileLabel && !profileLabel.querySelector('.btn-ai')) {
            profileLabel.innerHTML += ` <button type="button" class="btn-ai" onclick="window.aiImprove('profileText', 'summary', this)"><i class="fas fa-magic"></i> Auto-redactar</button>`;
        }
        
        // Experience Buttons
        const expTextareas = document.querySelectorAll(`textarea[data-path^='experience.'][data-path$='.tasks_str']`);
        expTextareas.forEach(ta => {
            const label = ta.previousElementSibling;
            if (label && !label.querySelector('.btn-ai')) {
                label.innerHTML += ` <button type="button" class="btn-ai" onclick="window.aiImprove('${ta.dataset.path}', 'improve', this)"><i class="fas fa-magic"></i> Mejorar texto</button>`;
            }
        });
    });
    
    const editorForm = document.getElementById('editor-form');
    if (editorForm) {
        observer.observe(editorForm, { childList: true, subtree: true });
    }
});
