let editorData = JSON.parse(JSON.stringify(window.cvData || {}));

document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    renderCV(editorData);
    
    document.getElementById('btn-save').addEventListener('click', handleSaveClick);
    document.getElementById('btn-save-token').addEventListener('click', saveWithToken);
    document.getElementById('btn-download-only').addEventListener('click', downloadDataJS);
});

function initEditor() {
    renderForm();

    // Escuchar cambios de texto
    document.getElementById('editor-form').addEventListener('input', (e) => {
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            const path = e.target.dataset.path;
            if (path) {
                updateDataByPath(editorData, path, e.target.value);
                renderCV(editorData);
            }
        }
    });
}

function renderForm() {
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

    // Habilidades Técnicas
    html += `<h3 class="section-title-editor">Habilidades Técnicas</h3>`;
    html += `<div id="skills-container"></div>`;
    html += `<button type="button" class="btn-add" onclick="addItem('skills')"><i class="fas fa-plus"></i> Agregar Habilidad</button>`;

    // Habilidades Blandas
    html += `<h3 class="section-title-editor">Habilidades Blandas</h3>`;
    html += `<div id="softskills-container"></div>`;
    html += `<button type="button" class="btn-add" onclick="addItem('softSkills')"><i class="fas fa-plus"></i> Agregar Habilidad Blanda</button>`;

    // Experiencia
    html += `<h3 class="section-title-editor">Experiencia Laboral</h3>`;
    html += `<div id="experience-container"></div>`;
    html += `<button type="button" class="btn-add" onclick="addItem('experience')"><i class="fas fa-plus"></i> Agregar Experiencia</button>`;

    // Educación
    html += `<h3 class="section-title-editor">Educación</h3>`;
    html += `<div id="education-container"></div>`;
    html += `<button type="button" class="btn-add" onclick="addItem('education')"><i class="fas fa-plus"></i> Agregar Educación</button>`;

    formContainer.innerHTML = html;

    // Renderizar sub-listas
    renderArrayItems();
}

function renderArrayItems() {
    // Skills
    document.getElementById('skills-container').innerHTML = editorData.skills.map((item, i) => `
        <div class="array-item">
            <button class="btn-remove" onclick="removeItem('skills', ${i})"><i class="fas fa-trash"></i></button>
            ${createInput(`skills.${i}.name`, 'Habilidad', item.name)}
            ${createInput(`skills.${i}.level`, 'Nivel (0-100)', item.level)}
        </div>
    `).join('');

    // Soft Skills
    document.getElementById('softskills-container').innerHTML = editorData.softSkills.map((item, i) => `
        <div class="array-item">
            <button class="btn-remove" onclick="removeItem('softSkills', ${i})"><i class="fas fa-trash"></i></button>
            ${createInput(`softSkills.${i}`, 'Habilidad', item)}
        </div>
    `).join('');

    // Experience
    document.getElementById('experience-container').innerHTML = editorData.experience.map((item, i) => `
        <div class="array-item">
            <button class="btn-remove" onclick="removeItem('experience', ${i})"><i class="fas fa-trash"></i></button>
            ${createInput(`experience.${i}.role`, 'Puesto', item.role)}
            ${createInput(`experience.${i}.company`, 'Empresa', item.company)}
            ${createInput(`experience.${i}.date`, 'Fechas', item.date)}
            <div class="form-group"><label>Tareas (separadas por punto y coma)</label>
            <textarea data-path="experience.${i}.tasks_str">${item.tasks.join('; ')}</textarea></div>
        </div>
    `).join('');

    // Education
    document.getElementById('education-container').innerHTML = editorData.education.map((item, i) => `
        <div class="array-item">
            <button class="btn-remove" onclick="removeItem('education', ${i})"><i class="fas fa-trash"></i></button>
            ${createInput(`education.${i}.degree`, 'Título', item.degree)}
            ${createInput(`education.${i}.institution`, 'Institución', item.institution)}
            ${createInput(`education.${i}.date`, 'Fecha', item.date)}
            ${createTextarea(`education.${i}.description`, 'Descripción', item.description)}
        </div>
    `).join('');
}

function addItem(type) {
    if (type === 'skills') editorData.skills.push({ name: 'Nueva Habilidad', level: 50 });
    if (type === 'softSkills') editorData.softSkills.push('Nueva Habilidad');
    if (type === 'experience') editorData.experience.push({ role: 'Puesto', company: 'Empresa', date: '', tasks: ['Tarea 1'] });
    if (type === 'education') editorData.education.push({ degree: 'Título', institution: 'Institución', date: '', description: '' });
    
    renderArrayItems();
    renderCV(editorData);
}

window.removeItem = function(type, index) {
    if(confirm('¿Estás seguro de eliminar este elemento?')) {
        editorData[type].splice(index, 1);
        renderArrayItems();
        renderCV(editorData);
    }
};

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
    if (path.endsWith('.tasks_str')) {
        const realPath = path.replace('.tasks_str', '');
        const keys = realPath.split('.');
        let current = obj;
        for(let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
        current[keys[keys.length - 1]].tasks = value.split(';').map(s => s.trim()).filter(s => s);
        return;
    }

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
