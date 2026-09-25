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
    document.getElementById('profile-text').innerText = data.profileText;

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
}
