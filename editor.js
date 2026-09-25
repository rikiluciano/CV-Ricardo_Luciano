let editorData = JSON.parse(JSON.stringify(window.cvData || {}));

document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    renderCV(editorData);
    
    document.getElementById('btn-save').addEventListener('click', handleSaveClick);
    document.getElementById('btn-save-token').addEventListener('click', saveWithToken);
    document.getElementById('btn-download-only').addEventListener('click', downloadDataJS);
});

function initEditor() {
    const formContainer = document.getElementById('editor-form');
    let html = '';

    // Datos Personales
    html += `<h3 class="section-title-editor">Datos Personales</h3>`;
    html += createInput('name', 'Nombre', editorData.name);
    html += createInput('lastName', 'Apellido', editorData.lastName);
    html += createInput('jobTitle', 'Título Profesional', editorData.jobTitle);
    html += createTextarea('profileText', 'Perfil Profesional', editorData.profileText);

    // Contacto
    html += `<h3 class="section-title-editor">Contacto</h3>`;
    html += createInput('contact.phone', 'Teléfono', editorData.contact.phone);
    html += createInput('contact.email', 'Email', editorData.contact.email);
    html += createInput('contact.location', 'Ubicación', editorData.contact.location);
    html += createInput('contact.linkedin', 'LinkedIn', editorData.contact.linkedin);
    html += createInput('contact.github', 'GitHub', editorData.contact.github);

    formContainer.innerHTML = html;

    // Escuchar cambios
    formContainer.addEventListener('input', (e) => {
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            const path = e.target.dataset.path;
            updateDataByPath(editorData, path, e.target.value);
            renderCV(editorData);
        }
    });
}

function createInput(path, label, value) {
    return `
        <div class="form-group">
            <label>${label}</label>
            <input type="text" data-path="${path}" value="${value || ''}">
        </div>
    `;
}

function createTextarea(path, label, value) {
    return `
        <div class="form-group">
            <label>${label}</label>
            <textarea data-path="${path}">${value || ''}</textarea>
        </div>
    `;
}

function updateDataByPath(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for(let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

// --- Lógica de Guardado ---

function handleSaveClick() {
    const token = localStorage.getItem('gh_token');
    if(!token) {
        document.getElementById('github-modal').style.display = 'flex';
    } else {
        pushToGitHub(token);
    }
}

function saveWithToken() {
    const token = document.getElementById('gh-token').value.trim();
    if(token) {
        localStorage.setItem('gh_token', token);
        document.getElementById('github-modal').style.display = 'none';
        pushToGitHub(token);
    } else {
        showToast("Por favor ingresa un token válido.", "error");
    }
}

function downloadDataJS() {
    document.getElementById('github-modal').style.display = 'none';
    const content = `window.cvData = ${JSON.stringify(editorData, null, 4)};`;
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Archivo data.js descargado. Recuerda subirlo manualmente a tu repositorio en GitHub.", "success");
}

async function pushToGitHub(token) {
    const btn = document.getElementById('btn-save');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    btn.disabled = true;

    try {
        const owner = 'rikiluciano';
        const repo = 'CV-Ricardo_Luciano';
        const path = 'data.js';
        
        // 1. Obtener el SHA actual del archivo
        const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const getRes = await fetch(getUrl, {
            headers: { 'Authorization': `token ${token}` }
        });
        
        let sha = null;
        if(getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
        }

        // 2. Preparar el nuevo contenido
        const content = `window.cvData = ${JSON.stringify(editorData, null, 4)};`;
        const encodedContent = btoa(unescape(encodeURIComponent(content))); // Base64 safe para UTF-8

        // 3. Hacer el commit
        const body = {
            message: "Actualizar CV desde el Editor Web",
            content: encodedContent,
            branch: "main"
        };
        if(sha) body.sha = sha;

        const putRes = await fetch(getUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if(putRes.ok) {
            showToast("¡Cambios guardados en GitHub con éxito! La página web pública se actualizará en 1-2 minutos.", "success");
        } else {
            const err = await putRes.json();
            console.error(err);
            showToast("Error al guardar en GitHub: " + err.message + ". Intentando descargar el archivo...", "error");
            downloadDataJS();
        }
    } catch (error) {
        console.error(error);
        showToast("Ocurrió un error de conexión.", "error");
        downloadDataJS();
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon} toast-icon"></i>
        <div class="toast-content">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Eliminar después de 4 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if(container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
}
