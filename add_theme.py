import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

theme_html = """
                      <div class="settings-form-group" style="margin-top: 20px;">
                          <label>Color del CV</label>
                          <div id="cv-theme-selector" style="display: flex; gap: 15px; margin-top: 10px;">
                              <div class="color-theme-option active" data-color="#02b3a6" style="width:35px; height:35px; border-radius:50%; background:#02b3a6; cursor:pointer; border:3px solid #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" title="Esmeralda"></div>
                              <div class="color-theme-option" data-color="#3b82f6" style="width:35px; height:35px; border-radius:50%; background:#3b82f6; cursor:pointer; border:3px solid transparent; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" title="Zafiro"></div>
                              <div class="color-theme-option" data-color="#e11d48" style="width:35px; height:35px; border-radius:50%; background:#e11d48; cursor:pointer; border:3px solid transparent; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" title="Rubí"></div>
                              <div class="color-theme-option" data-color="#1e293b" style="width:35px; height:35px; border-radius:50%; background:#1e293b; cursor:pointer; border:3px solid transparent; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" title="Obsidiana"></div>
                          </div>
                      </div>
"""

content = re.sub(r'(<select id="theme-select">.*?</select>\s*</div>)', r'\1' + theme_html, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
