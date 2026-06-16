import os
import shutil

# Paths configuration
source_dir = r"C:\Users\victor\.gemini\antigravity-ide\brain\defdfbda-3987-4721-8709-3a1f0d248ff5"
target_dir = r"c:\Users\victor\OneDrive - SENAC - SP\Área de Trabalho\Tutorial Anti\images"

# Map generated files to standard names in workspace
image_mappings = {
    "download_page_1781623925476.png": "download_page.png",
    "windows_install_1781623938122.png": "windows_install.png",
    "linux_terminal_1781623951632.png": "linux_terminal.png",
    "macos_install_1781623962441.png": "macos_install.png",
    "google_login_1781623975102.png": "google_login.png",
    "create_project_1781623988785.png": "create_project.png"
}

def copy_images():
    print("Iniciando cópia das imagens geradas para a pasta do workspace...")
    
    # Ensure target directory exists
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        print(f"Pasta criada: {target_dir}")
        
    copied_count = 0
    for src_name, target_name in image_mappings.items():
        src_path = os.path.join(source_dir, src_name)
        target_path = os.path.join(target_dir, target_name)
        
        if os.path.exists(src_path):
            shutil.copy2(src_path, target_path)
            print(f"Copiado: {src_name} -> images/{target_name}")
            copied_count += 1
        else:
            print(f"Erro: Arquivo de origem não encontrado: {src_path}")
            
    print(f"\nConcluído! {copied_count} de {len(image_mappings)} imagens foram copiadas com sucesso.")

if __name__ == "__main__":
    copy_images()
