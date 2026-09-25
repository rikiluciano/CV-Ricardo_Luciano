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
    
    const imgEl = document.getElementById('profile-pic');
    imgEl.src = data.profilePic || 'perfil.jpg';
    if (data.profilePicOffsetY !== undefined) {
        imgEl.style.objectPosition = `50% ${data.profilePicOffsetY}%`;
    } else {
        imgEl.style.objectPosition = `center`;
    }

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
                ${job.tasks.map(task => `<li>${task}</li>`).join('')}
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
            ${edu.description ? `<p class="edu-desc">${edu.description}</p>` : ''}
        </div>
    `).join('');
    document.getElementById('education-list').innerHTML = eduHtml;

    // Titles
    const titles = data.titles || {
        contact: "Contacto",
        skills: "Habilidades Técnicas",
        softSkills: "Habilidades Blandas",
        profile: "Perfil Profesional",
        experience: "Experiencia Laboral",
        education: "Formación Académica y Técnica"
    };
    
    if (document.getElementById('title-contact')) document.getElementById('title-contact').innerText = titles.contact;
    if (document.getElementById('title-skills')) document.getElementById('title-skills').innerText = titles.skills;
    if (document.getElementById('title-softSkills')) document.getElementById('title-softSkills').innerText = titles.softSkills;
    if (document.getElementById('title-profile')) document.getElementById('title-profile').innerText = titles.profile;
    if (document.getElementById('title-experience')) document.getElementById('title-experience').innerText = titles.experience;
    if (document.getElementById('title-education')) document.getElementById('title-education').innerText = titles.education;
}

// Función inteligente para resaltar palabras clave EXACTAS
function highlightKeywords(text, data) {
    if (!text) return '';
    
    // 1. Extraer frases y habilidades exactas del usuario
    const userSkills = data.skills.map(s => s.name);
    const userSoftSkills = data.softSkills;
    
    // 2. Diccionario de frases técnicas y conceptos clave completos (sin palabras sueltas genéricas)
    const extraKeywords = [
        'Desarrollador Full Stack', 
        'Inteligencia Artificial', 
        'Desarrollo Web', 
        'Excel Avanzado', 
        'Bases de datos'
    ];
    
    // Unir todo, eliminar duplicados, y limpiar espacios
    let allKeywords = [...new Set([...userSkills, ...userSoftSkills, ...extraKeywords])]
        .filter(k => k.trim().length > 2); // ignorar palabras muy cortas
        
    // Limpieza adicional: Si una habilidad tiene paréntesis ej: "Gestión de inventarios (SAP)", 
    // extraer también la frase sin paréntesis para que pueda coincidir en el texto normal.
    const cleanKeywords = [];
    allKeywords.forEach(k => {
        cleanKeywords.push(k);
        if (k.includes('(') && k.includes(')')) {
            cleanKeywords.push(k.replace(/\(.*?\)/g, '').trim());
            const insideParens = k.match(/\(([^)]+)\)/)[1];
            cleanKeywords.push(insideParens.trim());
        }
    });

    let finalKeywords = [...new Set(cleanKeywords)].filter(k => k.length > 2);
        
    // Ordenar de mayor a menor longitud para que las frases largas se prioricen y no se rompan
    finalKeywords.sort((a, b) => b.length - a.length);
    
    // Escapar caracteres especiales para RegExp
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Función para hacer que la regex ignore acentos y la "s" final opcional
    const makeSmartPattern = (keyword) => {
        let patternStr = escapeRegExp(keyword);
        // Ignorar acentos
        patternStr = patternStr.replace(/a|á/gi, '[aáAÁ]');
        patternStr = patternStr.replace(/e|é/gi, '[eéEÉ]');
        patternStr = patternStr.replace(/i|í/gi, '[iíIÍ]');
        patternStr = patternStr.replace(/o|ó/gi, '[oóOÓ]');
        patternStr = patternStr.replace(/u|ú|ü/gi, '[uúüUÚÜ]');
        // Hacer la 's' final opcional (para que "inventario" coincida con "inventarios")
        patternStr = patternStr.replace(/s\b/gi, 's?');
        // Si no termina en s, hacer que admita una s opcional al final de cada palabra
        patternStr = patternStr.replace(/([a-zA-Záéíóú])\b/g, '$1s?');
        return patternStr;
    };
    
    // Construir la expresión regular para que coincida con la frase exacta, ignorando acentos y plurales
    const pattern = new RegExp(`\\b(${finalKeywords.map(makeSmartPattern).join('|')})\\b`, 'gi');
    
    // Reemplazar envolviendo en strong
    return text.replace(pattern, '<strong>$1</strong>');
}
