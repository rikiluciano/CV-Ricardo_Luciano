let editorData = {};

window.startEditor = function(data) {
    editorData = JSON.parse(JSON.stringify(data || {}));
    
    // Asegurar que exista el objeto titles
    if (!editorData.titles) {
        editorData.titles = {
            contact: "Contacto",
            skills: "Habilidades Técnicas",
            softSkills: "Habilidades Blandas",
            profile: "Perfil Profesional",
            experience: "Experiencia Laboral",
            education: "Formación Académica y Técnica",
            workReferences: "Referencias Laborales",
            personalReferences: "Referencias Personales"
        };
    }
    if (!editorData.workReferences) editorData.workReferences = [];
    if (!editorData.personalReferences) editorData.personalReferences = [];

    initEditor();
    updatePreview(editorData);
};

document.addEventListener('DOMContentLoaded', () => {
    // Escuchas estáticas que no dependen de la data
    document.getElementById('btn-save').addEventListener('click', () => {
        // Enviar evento al padre para guardar en Firebase
        window.dispatchEvent(new CustomEvent('saveToFirebase', { detail: editorData }));
    });
    // Removemos botones de GitHub
});

function updatePreview(data) {
    renderCV(data);
}

function initEditor() {
    renderForm();

    // Escuchar cambios de texto
    document.getElementById('editor-form').addEventListener('input', (e) => {
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            const path = e.target.dataset.path;
            if (path) {
                updateDataByPath(editorData, path, e.target.value);
                updatePreview(editorData);
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
    html += createInput('profilePic', 'URL de tu Foto (ej: perfil.jpg o https://...)', editorData.profilePic || 'perfil.jpg');
    
    // Rango para mover la foto arriba o abajo
    const offsetY = editorData.profilePicOffsetY !== undefined ? editorData.profilePicOffsetY : 50;
    html += `
        <div class="form-group">
            <label>Ajustar posición de la foto (Arriba / Abajo)</label>
            <input type="range" data-path="profilePicOffsetY" min="0" max="100" value="${offsetY}" style="width:100%; cursor:pointer;">
        </div>
    `;

    html += createTextarea('profileText', 'Perfil Profesional', editorData.profileText);

    // Títulos de Secciones
    html += `<h3 class="section-title-editor">Títulos de Secciones</h3>`;
    html += createInput('titles.profile', 'Perfil Profesional', editorData.titles.profile);
    html += createInput('titles.experience', 'Experiencia Laboral', editorData.titles.experience);
    html += createInput('titles.education', 'Educación', editorData.titles.education);
    html += createInput('titles.skills', 'Habilidades Técnicas', editorData.titles.skills);
    html += createInput('titles.softSkills', 'Habilidades Blandas', editorData.titles.softSkills);
    html += createInput('titles.contact', 'Contacto', editorData.titles.contact);
    html += createInput('titles.workReferences', 'Referencias Laborales', editorData.titles.workReferences);
    html += createInput('titles.personalReferences', 'Referencias Personales', editorData.titles.personalReferences);

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

    // Referencias Laborales
    html += `<h3 class="section-title-editor">Referencias Laborales</h3>`;
    html += `<div id="work-references-container"></div>`;
    html += `<button type="button" class="btn-add" onclick="addItem('workReferences')"><i class="fas fa-plus"></i> Agregar Referencia</button>`;

    // Referencias Personales
    html += `<h3 class="section-title-editor">Referencias Personales</h3>`;
    html += `<div id="personal-references-container"></div>`;
    html += `<button type="button" class="btn-add" onclick="addItem('personalReferences')"><i class="fas fa-plus"></i> Agregar Referencia</button>`;

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

    // Work References
    document.getElementById('work-references-container').innerHTML = editorData.workReferences.map((item, i) => `
        <div class="array-item">
            <button class="btn-remove" onclick="removeItem('workReferences', ${i})"><i class="fas fa-trash"></i></button>
            ${createInput(`workReferences.${i}.name`, 'Nombre', item.name)}
            ${createInput(`workReferences.${i}.relation`, 'Cargo / Relación', item.relation)}
            ${createInput(`workReferences.${i}.contact`, 'Contacto (Teléfono/Email)', item.contact)}
        </div>
    `).join('');

    // Personal References
    document.getElementById('personal-references-container').innerHTML = editorData.personalReferences.map((item, i) => `
        <div class="array-item">
            <button class="btn-remove" onclick="removeItem('personalReferences', ${i})"><i class="fas fa-trash"></i></button>
            ${createInput(`personalReferences.${i}.name`, 'Nombre', item.name)}
            ${createInput(`personalReferences.${i}.relation`, 'Relación', item.relation)}
            ${createInput(`personalReferences.${i}.contact`, 'Contacto (Teléfono/Email)', item.contact)}
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
    if (type === 'workReferences') editorData.workReferences.push({ name: 'Nombre', relation: 'Relación/Cargo', contact: 'Teléfono' });
    if (type === 'personalReferences') editorData.personalReferences.push({ name: 'Nombre', relation: 'Relación', contact: 'Teléfono' });
    if (type === 'experience') editorData.experience.push({ role: 'Puesto', company: 'Empresa', date: '', tasks: ['Tarea 1'] });
    if (type === 'education') editorData.education.push({ degree: 'Título', institution: 'Institución', date: '', description: '' });
    
    renderArrayItems();
    updatePreview(editorData);
}

window.removeItem = function(type, index) {
    if(confirm('¿Estás seguro de eliminar este elemento?')) {
        editorData[type].splice(index, 1);
        renderArrayItems();
        updatePreview(editorData);
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

// --- Lógica de Mensajes ---
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

// === Inteligencia Artificial Básica (Linter de CV) ===

    // 2. LinkedIn
    if (!data.contact || !data.contact.linkedin || data.contact.linkedin.trim() === '') {
        score -= 1.0;
        suggestions.push("🔗 Te recomendamos añadir la URL de tu LinkedIn para dar más credibilidad profesional.");
    }

    // 3. Experiencia y métricas
    if (!data.experience || data.experience.length === 0) {
        score -= 2.0;
        suggestions.push("💼 No has agregado experiencia laboral. ¡Añade al menos una!");
    } else {
        let hasMetrics = false;
        let hasTasks = false;
        data.experience.forEach(exp => {
            if (exp.tasks && exp.tasks.length > 0) {
                hasTasks = true;
                exp.tasks.forEach(task => {
                    if (/\d+%?/.test(task)) {
                        hasMetrics = true;
                    }
                });
            }
        });
        
        if (!hasTasks) {
            score -= 1.0;
            suggestions.push("📝 Describe al menos una tarea o responsabilidad por cada experiencia laboral.");
        } else if (!hasMetrics) {
            score -= 1.5;
            suggestions.push("📈 Considera añadir métricas o números a tus tareas (ej: 'Mejoré la eficiencia un 20%', 'Manejé $10,000', 'Lideré 5 personas'). Esto multiplica el impacto de tu CV.");
        }
    }

    // 4. Habilidades
    if (!data.skills || data.skills.length < 3) {
        score -= 1.0;
        suggestions.push("🛠️ Añade al menos 3 habilidades técnicas clave para pasar los filtros automáticos (ATS).");
    }
    if (!data.softSkills || data.softSkills.length < 3) {
        score -= 0.5;
        suggestions.push("🤝 Añade al menos 3 habilidades blandas (ej: Trabajo en equipo, Liderazgo).");
    }

    // Actualizar UI
    if (score < 0) score = 0;
    
    const scoreEl = document.getElementById('ai-score');
    if (scoreEl) {
        scoreEl.innerText = score.toFixed(1) + "/10";
        if (score >= 9) {
            scoreEl.style.background = '#27ae60'; // Verde
        } else if (score >= 7) {
            scoreEl.style.background = '#f1c40f'; // Amarillo
            scoreEl.style.color = '#000';
        } else {
            scoreEl.style.background = '#e74c3c'; // Rojo
            scoreEl.style.color = '#fff';
        }
    }

    const suggestionsEl = document.getElementById('ai-suggestions');
    if (suggestionsEl) {
        if (suggestions.length === 0) {
            suggestionsEl.innerHTML = `<li style="color:#27ae60; font-weight:bold;">¡Tu CV está excelente! Listo para enviar a los reclutadores. 🚀</li>`;
        } else {
            suggestionsEl.innerHTML = suggestions.map(s => `<li style="margin-bottom:8px;">${s}</li>`).join('');
        }
    }
