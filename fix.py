import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'\.btn-settings-nav img \{.*?\}', '.btn-settings-nav img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #02b3a6; }', text)

new_header = '''<div class="editor-header" id="navbar-header" style="flex-direction: column; align-items: flex-start; padding: 20px;">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 20px;">
                <button id="btn-settings" class="btn-settings-nav" style="text-align: left;">
                    <img id="nav-profile-pic" src="https://ui-avatars.com/api/?name=User&background=random" alt="Perfil">
                    <div style="display: flex; flex-direction: column;">
                        <span id="nav-profile-name" style="font-size: 1.15rem;">Ajustes</span>
                        <span style="font-size: 0.8rem; color: #cbd5e1; font-weight: normal;"><i class="fas fa-cog"></i> Configurar Perfil</span>
                    </div>
                </button>
                <button id="btn-logout-new" style="background: transparent; border: none; color: #ef4444; font-size: 1.4rem; cursor: pointer; transition: transform 0.2s;" title="Cerrar Sesión" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
            <button id="btn-save" class="btn-save" style="width: 100%; padding: 12px; font-size: 1.05rem; background: #02b3a6;"><i class="fas fa-save"></i> Guardar Cambios</button>
        </div>'''

text = re.sub(r'<div class="editor-header" id="navbar-header">.*?</div>\s*</div>\s*<div class="editor-content"', new_header + '\n\n        <div class="editor-content"', text, flags=re.DOTALL)

floating_bar = '''<div style="position: fixed; top: 20px; right: 30px; z-index: 1000; display: flex; gap: 15px; background: rgba(255,255,255,0.85); padding: 10px 20px; border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3);">
    <button id="btn-view-floating" style="border: none; background: #0ea5e9; color: white; padding: 10px 20px; border-radius: 20px; font-weight: 600; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3);" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'"><i class="fas fa-external-link-alt"></i> Ver CV Publicado</button>
    <button id="btn-share-floating" style="border: none; background: #10b981; color: white; padding: 10px 20px; border-radius: 20px; font-weight: 600; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'"><i class="fas fa-share-nodes"></i> Compartir Link</button>
</div>'''

text = text.replace('<body>', '<body>\n    ' + floating_bar)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done')
