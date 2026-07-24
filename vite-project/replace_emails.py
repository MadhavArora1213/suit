import os

target_dir = r"c:\Users\DELL\Desktop\New folder (5)\arora\suit\vite-project\src"
email = "madhavarora132005@gmail.com"

replacements = {
    "support@gurnaaz.com": email,
    "concierge@gurnaaz.com": email,
    "admin@gurnaaz.com": email,
    "name@gurnaaz.com": email,
    "member@gurnaaz.com": email,
}

for root, _, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js") or file.endswith(".tsx") or file.endswith(".ts"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            modified = False
            for old, new in replacements.items():
                if old in content:
                    content = content.replace(old, new)
                    modified = True
                    
            if modified:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
