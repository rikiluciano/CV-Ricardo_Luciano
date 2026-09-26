import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the dynamic button creation with just bindings
old_js = '''        const headerBtnArea = document.querySelector('#navbar-header > div:last-child');
        
        // Botón Ver CV Limpio
        const viewBtn = document.createElement('button');
        viewBtn.innerHTML = '<i class="fas fa-eye"></i> Ver CV';
        viewBtn.title = "Ver CV Limpio";
        viewBtn.className = 'btn-save';
        viewBtn.style.background = '#0284c7'; // Azul
        viewBtn.style.marginRight = '10px';
        viewBtn.onclick = () => window.open(cv.html?uid=, '_blank');
        headerBtnArea.insertBefore(viewBtn, headerBtnArea.firstChild);

        // Botón Compartir
        const shareBtn = document.createElement('button');
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Compartir';
        shareBtn.title = "Copiar link de solo lectura";
        shareBtn.className = 'btn-save';
        shareBtn.style.background = '#10b981'; // Verde
        shareBtn.style.marginRight = '10px';
        shareBtn.onclick = () => {
            const url = ${window.location.origin}/cv.html?uid=;
            navigator.clipboard.writeText(url).then(() => {
                window.showToast('¡Link copiado al portapapeles!', 'success');
            }).catch(err => {
                console.error("Error al copiar", err);
                window.showToast('Error al copiar el link.', 'error');
            });
        };
        headerBtnArea.insertBefore(shareBtn, headerBtnArea.firstChild);

        // Botón de Cerrar Sesión
        const logoutBtn = document.createElement('button');
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.title = "Cerrar Sesión";
        logoutBtn.className = 'btn-save';
        logoutBtn.style.background = '#e11d48'; // Rojo
        logoutBtn.style.marginLeft = '10px';
        logoutBtn.onclick = () => signOut(auth).then(() => window.location.href = 'login.html');
        headerBtnArea.appendChild(logoutBtn);'''

new_js = '''        // Bind floating buttons
        document.getElementById('btn-view-floating').onclick = () => window.open(cv.html?uid=, '_blank');
        document.getElementById('btn-share-floating').onclick = () => {
            const url = ${window.location.origin}/cv.html?uid=;
            navigator.clipboard.writeText(url).then(() => {
                window.showToast('¡Link copiado al portapapeles!', 'success');
            }).catch(err => {
                console.error("Error al copiar", err);
                window.showToast('Error al copiar el link.', 'error');
            });
        };

        // Botón de Cerrar Sesión
        document.getElementById('btn-logout-new').onclick = () => signOut(auth).then(() => window.location.href = 'login.html');'''

# Re-escape backticks and $ for regex if using re.sub, or just use python replace
text = text.replace(old_js, new_js)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done JS replace')
