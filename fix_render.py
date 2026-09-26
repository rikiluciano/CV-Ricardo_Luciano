import re

with open('render.js', 'r', encoding='utf-8') as f:
    content = f.read()

color_injection = """
    // Apply theme color if present
    if (data.themeColor) {
        document.documentElement.style.setProperty('--primary-color', data.themeColor);
        if(data.themeColor === '#1e293b') document.documentElement.style.setProperty('--accent-color', '#334155');
        else if(data.themeColor === '#3b82f6') document.documentElement.style.setProperty('--accent-color', '#1d4ed8');
        else if(data.themeColor === '#e11d48') document.documentElement.style.setProperty('--accent-color', '#be123c');
        else document.documentElement.style.setProperty('--accent-color', '#0f766e');
    }
"""

content = re.sub(r"function renderCV\(data\) \{", "function renderCV(data) {\n" + color_injection, content)

with open('render.js', 'w', encoding='utf-8') as f:
    f.write(content)
