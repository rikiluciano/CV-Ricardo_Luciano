import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

loader_html = """<body>
    <!-- SKELETON LOADER OVERLAY -->
    <div id="app-loader" style="position:fixed; top:0; left:0; width:100%; height:100%; background:#f8fafc; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; transition: opacity 0.5s;">
        <div style="width: 80px; height: 80px; border: 8px solid #e2e8f0; border-top: 8px solid var(--primary-color, #02b3a6); border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <h2 style="margin-top:20px; color:#475569; font-family:'Montserrat', sans-serif;">Cargando tu espacio...</h2>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    </div>
"""

content = re.sub(r"<body.*?>", loader_html, content, count=1, flags=re.IGNORECASE)

hide_loader = """
                    document.getElementById('app-loader').style.opacity = '0';
                    setTimeout(() => document.getElementById('app-loader').style.display = 'none', 500);
"""

content = re.sub(r"(window\.startEditor\(data\);)", r"\1\n" + hide_loader, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
