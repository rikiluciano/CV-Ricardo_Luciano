import { auth, updatePassword, updateProfile, storage, ref, uploadBytes, getDownloadURL } from './firebase-config.js';

export function initSettings() {
    const modal = document.getElementById('settings-modal');
    const btnOpen = document.getElementById('btn-settings');
    const btnClose = document.getElementById('btn-close-settings');
    const tabs = document.querySelectorAll('.settings-tab');
    const tabContents = document.querySelectorAll('.settings-content');

    // UI elements
    const themeSelect = document.getElementById('theme-select');
    const profileNameInput = document.getElementById('profile-name');
    const profilePhotoInput = document.getElementById('profile-photo');
    const currentPhoto = document.getElementById('current-profile-photo');
    const btnSaveProfile = document.getElementById('btn-save-profile');
    const newPasswordInput = document.getElementById('new-password');
    const btnChangePassword = document.getElementById('btn-change-password');
    const alertBox = document.getElementById('settings-alert');

    function showAlert(msg, type = 'success') {
        alertBox.textContent = msg;
        alertBox.className = `settings-alert alert-${type}`;
        alertBox.style.display = 'block';
        setTimeout(() => alertBox.style.display = 'none', 4000);
    }

    if(btnOpen) {
        btnOpen.addEventListener('click', () => {
            modal.showModal();
            loadProfileData();
        });
    }

    if(btnClose) {
        btnClose.addEventListener('click', () => modal.close());
    }

    // Tabs logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    // Theme logic
    const savedTheme = localStorage.getItem('theme') || 'system';
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    themeSelect.addEventListener('change', (e) => {
        const t = e.target.value;
        localStorage.setItem('theme', t);
        applyTheme(t);
        showAlert("Tema actualizado", "success");
    });

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else if (theme === 'light') {
            document.body.classList.remove('dark-mode');
        } else {
            // System
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    }

    // Profile Data Loading
    function loadProfileData() {
        const user = auth.currentUser;
        if(user) {
            profileNameInput.value = user.displayName || "";
            if(user.photoURL) {
                currentPhoto.src = user.photoURL;
            }
        }
    }

    // Save Profile (Name and Photo)
    btnSaveProfile.addEventListener('click', async () => {
        const user = auth.currentUser;
        if(!user) return;
        
        btnSaveProfile.disabled = true;
        btnSaveProfile.textContent = "Guardando...";

        try {
            let photoURL = user.photoURL;
            
            // Upload photo if selected
            if (profilePhotoInput.files.length > 0) {
                const file = profilePhotoInput.files[0];
                const storageRef = ref(storage, `users/${user.uid}/avatar.png`);
                await uploadBytes(storageRef, file);
                photoURL = await getDownloadURL(storageRef);
            }

            // Update Auth Profile
            await updateProfile(user, {
                displayName: profileNameInput.value,
                photoURL: photoURL
            });

            // Update UI
            if(photoURL) currentPhoto.src = photoURL;
            showAlert("Perfil guardado correctamente", "success");
            
            // Dispatch event to update navbar photo
            window.dispatchEvent(new Event('profileUpdated'));

        } catch(err) {
            console.error(err);
            showAlert(err.message, "error");
        } finally {
            btnSaveProfile.disabled = false;
            btnSaveProfile.textContent = "Guardar Perfil";
        }
    });

    // Change Password
    btnChangePassword.addEventListener('click', async () => {
        const user = auth.currentUser;
        const newPass = newPasswordInput.value;
        if(!user) return;
        if(newPass.length < 6) {
            return showAlert("La contraseña debe tener al menos 6 caracteres", "error");
        }

        btnChangePassword.disabled = true;
        try {
            await updatePassword(user, newPass);
            showAlert("Contraseña actualizada con éxito", "success");
            newPasswordInput.value = "";
        } catch(err) {
            console.error(err);
            if(err.code === 'auth/requires-recent-login') {
                showAlert("Por seguridad, debes cerrar sesión y volver a entrar antes de cambiar tu contraseña.", "error");
            } else {
                showAlert(err.message, "error");
            }
        } finally {
            btnChangePassword.disabled = false;
        }
    });
}
