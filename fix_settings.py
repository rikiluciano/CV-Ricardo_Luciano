import re

with open('settings.js', 'r', encoding='utf-8') as f:
    content = f.read()

color_theme_logic = """
    // CV Color Theme Logic
    const themeOptions = document.querySelectorAll('.color-theme-option');
    const rootStyles = document.documentElement.style;
    
    // Load existing theme from cvData if available, otherwise default
    setTimeout(() => {
        if(window.cvData && window.cvData.themeColor) {
            applyCVColor(window.cvData.themeColor);
        }
    }, 1500);

    themeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const color = opt.getAttribute('data-color');
            applyCVColor(color);
            
            // Save to cvData and trigger save
            if(window.cvData) {
                window.cvData.themeColor = color;
                window.dispatchEvent(new CustomEvent('saveToFirebase', { detail: window.cvData }));
            }
            showAlert("Color del CV actualizado", "success");
        });
    });

    function applyCVColor(color) {
        rootStyles.setProperty('--primary-color', color);
        // Also update accents
        if(color === '#1e293b') rootStyles.setProperty('--accent-color', '#334155');
        else if(color === '#3b82f6') rootStyles.setProperty('--accent-color', '#1d4ed8');
        else if(color === '#e11d48') rootStyles.setProperty('--accent-color', '#be123c');
        else rootStyles.setProperty('--accent-color', '#0f766e');
        
        // Update UI active state
        themeOptions.forEach(o => {
            if(o.getAttribute('data-color') === color) {
                o.classList.add('active');
                o.style.borderColor = '#3b82f6';
            } else {
                o.classList.remove('active');
                o.style.borderColor = 'transparent';
            }
        });
    }
"""

content = re.sub(r"function applyTheme\(theme\) \{.*?\n    \}\n", r"\g<0>\n" + color_theme_logic, content, flags=re.DOTALL)

with open('settings.js', 'w', encoding='utf-8') as f:
    f.write(content)
