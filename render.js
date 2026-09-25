function renderCV(data) {
    // Contact Info
    const contactHtml = `
        <li><i class="fas fa-phone"></i> ${data.contact.phone}</li>
        <li><i class="fas fa-envelope"></i> ${data.contact.email}</li>
        <li><i class="fas fa-map-marker-alt"></i> ${data.contact.location}</li>
        <li><i class="fab fa-linkedin"></i> ${data.contact.linkedin}</li>
        <li><i class="fab fa-github"></i> ${data.contact.github}</li>
    `;
    document.getElementById('contact-list').innerHTML = contactHtml;

    // Skills
    const skillsHtml = data.skills.map(skill => `
        <div class="skill-item">
            <span class="skill-name">${skill.name}</span>
            <div class="progress-bar"><div class="progress" style="width: ${skill.level}%;"></div></div>
        </div>
    `).join('');
    document.getElementById('skills-list').innerHTML = skillsHtml;

    // Soft Skills
    const softSkillsHtml = data.softSkills.map(skill => `<li>${skill}</li>`).join('');
    document.getElementById('soft-skills-list').innerHTML = softSkillsHtml;

    // Header
    document.getElementById('name-title').innerHTML = `${data.name} <span>${data.lastName}</span>`;
    document.getElementById('job-title').innerText = data.jobTitle;
    document.getElementById('profile-pic').src = data.profilePic;

    // Profile Text
    document.getElementById('profile-text').innerHTML = highlightKeywords(data.profileText, data);

    // Experience
    const expHtml = data.experience.map(job => `
        <div class="job">
            <div class="job-header">
                <h3 class="job-role">${job.role}</h3>
                <span class="job-date">${job.date}</span>
            </div>
            <h4 class="job-company">${job.company}</h4>
            <ul class="job-tasks">
                ${job.tasks.map(task => `<li>${highlightKeywords(task, data)}</li>`).join('')}
            </ul>
        </div>
    `).join('');
    document.getElementById('experience-list').innerHTML = expHtml;

    // Education
    const eduHtml = data.education.map(edu => `
        <div class="edu-item">
            <div class="edu-header">
                <h3 class="edu-degree">${edu.degree}</h3>
                ${edu.date ? `<span class="edu-date">${edu.date}</span>` : ''}
            </div>
            <h4 class="edu-institution">${edu.institution}</h4>
            ${edu.description ? `<p class="edu-desc">${highlightKeywords(edu.description, data)}</p>` : ''}
        </div>
    `).join('');
    document.getElementById('education-list').innerHTML = eduHtml;
}

// Función inteligente para resaltar palabras clave
function highlightKeywords(text, data) {
    if (!text) return '';
    
    // 1. Extraer palabras clave de las habilidades del usuario (esto lo hace dinámico)
    const userSkills = data.skills.map(s => s.name);
    const userSoftSkills = data.softSkills;
    
    // 2. Diccionario de palabras clave de alto impacto adicionales
    const extraKeywords = [
        'Desarrollador Full Stack', 'Inteligencia Artificial', 'Frontend', 'Backend',
        'Logística', 'Inventarios', 'Liderazgo', 'Liderar', 'Optimizar', 'Gestión', 
        'Productividad', 'Eficiencia', 'Automatización', 'Innovación', 'Proactivo',
        'Desarrollo Web', 'SAP', 'Excel Avanzado', 'Bases de datos', 'KPIs'
    ];
    
    // Unir todo, eliminar duplicados, y limpiar espacios
    let allKeywords = [...new Set([...userSkills, ...userSoftSkills, ...extraKeywords])]
        .filter(k => k.trim().length > 2); // ignorar palabras muy cortas
        
    // Ordenar de mayor a menor longitud para que "Excel Avanzado" se resalte antes que "Excel"
    allKeywords.sort((a, b) => b.length - a.length);
    
    // Escapar caracteres especiales para RegExp
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Construir la expresión regular
    const pattern = new RegExp(`\\b(${allKeywords.map(escapeRegExp).join('|')})\\b`, 'gi');
    
    // Reemplazar envolviendo en strong
    return text.replace(pattern, '<strong>$1</strong>');
}
