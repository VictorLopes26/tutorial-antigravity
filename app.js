// Step Data representing the contents of the Word document
const stepsData = [
    {
        id: "requisitos",
        num: "Etapa 1",
        title: "Requisitos do Sistema",
        isCheckable: true,
        checklist: [
            { id: "req_google", label: "Conta Google ativa" },
            { id: "req_net", label: "Conexão com a internet estável" },
            { id: "req_admin", label: "Permissão para instalar aplicativos (privilégios de Administrador)" },
            { id: "req_disk", label: "Espaço em disco livre (~500 MB)" },
            { id: "req_os", label: "Windows 10+, macOS 12+ ou Linux compatível" }
        ],
        supportLinks: [
            { title: "Ajuda da Conta Google", url: "https://support.google.com/accounts" }
        ]
    },
    {
        id: "download",
        num: "Etapa 2",
        title: "Download do Instalador",
        description: "<p>Acesse o portal oficial do Google Antigravity e faça o download da versão apropriada para o seu sistema.</p>",
        image: "images/download_page.png",
        supportLinks: [
            { title: "Portal de Downloads Oficial", url: "https://antigravity.google/download" }
        ]
    },
    {
        id: "windows",
        num: "Etapa 3",
        title: "Instalação no Windows",
        description: "<p>Execute o arquivo <code>.exe</code> baixado. Caso seu usuário local não seja administrador da máquina, certifique-se de executar o instalador como administrador.</p>",
        alert: { type: "warning", text: "<strong>Atenção:</strong> Execute o instalador como Administrador caso note alguma restrição ou se houver políticas de restrição na máquina local." },
        image: "images/windows_install.png"
    },
    {
        id: "linux",
        num: "Etapa 4",
        title: "Instalação no Linux",
        description: "<p>A instalação em sistemas Linux é realizada via CLI (Linha de Comando). Abra o terminal e execute o script de instalação oficial:</p>",
        commands: [
            "curl -fsSL https://antigravity.google/cli/install.sh | bash",
            "antigravity --version"
        ],
        image: "images/linux_terminal.png",
        supportLinks: [
            { title: "Instruções do Comando cURL", url: "https://curl.se/" }
        ]
    },
    {
        id: "macos",
        num: "Etapa 5",
        title: "Instalação no macOS",
        description: "<p>Abra o arquivo <code>.dmg</code> baixado e arraste o ícone para a pasta Applications. Na primeira execução, autorize o aplicativo nas Configurações de Privacidade e Segurança do macOS. Em seguida, execute a instalação do CLI no Terminal:</p>",
        commands: [
            "curl -fsSL https://antigravity.google/cli/install.sh | bash",
            "antigravity --version"
        ],
        image: "images/macos_install.png",
        supportLinks: [
            { title: "Segurança do macOS (Gatekeeper)", url: "https://support.apple.com/pt-br/HT202491" }
        ]
    },
    {
        id: "login",
        num: "Etapa 6",
        title: "Primeiro Acesso e Autenticação",
        description: "<p>Abra o Google Antigravity e clique no botão de login para autenticar sua conta de forma segura.</p>",
        alert: { type: "info", text: "<strong>Dica:</strong> Utilize a mesma Conta Google onde você armazena seus projetos e serviços na nuvem para manter tudo sincronizado." },
        image: "images/google_login.png"
    },
    {
        id: "projeto",
        num: "Etapa 7",
        title: "Criando o Primeiro Projeto",
        description: "<p>Para carregar seus códigos no agente local do Google Antigravity, crie um novo projeto ou selecione uma pasta de trabalho local existente.</p>",
        image: "images/create_project.png"
    },
    {
        id: "teste",
        num: "Etapa 8",
        title: "Testando a Instalação",
        description: "<p>Abra o chat lateral integrado do Google Antigravity e insira o seguinte comando de teste. O agente deve responder analisando os dados da pasta vinculada:</p>",
        commands: [
            "Help me understand this project."
        ],
        isCheckable: true,
        checklist: [
            { id: "chk_install", label: "Instalação concluída com sucesso" },
            { id: "chk_login", label: "Login via Conta Google efetuado" },
            { id: "chk_folder", label: "Pasta de projeto associada no workspace" },
            { id: "chk_chat", label: "Chat funcionando e interpretando arquivos" }
        ]
    },
    {
        id: "solucao",
        num: "Etapa 9",
        title: "Solução de Problemas",
        description: "<p>Confira as soluções para as falhas mais comuns durante o processo de configuração:</p>",
        listItems: [
            "<strong>Aplicativo não abre:</strong> Reinicie seu computador ou execute o instalador novamente com permissões de administrador.",
            "<strong>O login do Google falha:</strong> Verifique se a sua conexão está ativa e se o firewall não está bloqueando domínios como <code>*.google.com</code> ou <code>*.antigravity.google</code>.",
            "<strong>CLI 'antigravity' não é encontrada:</strong> Reinicie o seu terminal ou digite <code>source ~/.bashrc</code> (Linux) / <code>source ~/.zshrc</code> (macOS) para atualizar as configurações de PATH."
        ]
    }
];

// App State
let currentSlideIndex = 0;
let checkedItems = JSON.parse(localStorage.getItem('antigravity_tutorial_checked')) || {};
let currentViewMode = 'slides'; // 'slides' or 'doc'

// DOM Elements
const navList = document.getElementById('nav-list');
const slideContentArea = document.getElementById('slide-content-area');
const documentContentArea = document.getElementById('document-content-area');
const slidesSection = document.getElementById('slides-view-section');
const docSection = document.getElementById('document-view-section');
const btnSlidesView = document.getElementById('btn-slides-view');
const btnDocView = document.getElementById('btn-doc-view');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const slideIndicator = document.getElementById('slide-indicator');
const progressBar = document.getElementById('progress-bar');
const progressPercentage = document.getElementById('progress-percentage');
const themeToggle = document.getElementById('theme-toggle');
const themeIconSun = document.getElementById('theme-icon-sun');
const themeIconMoon = document.getElementById('theme-icon-moon');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const toast = document.getElementById('toast');

// Initialize the Application
function init() {
    setupTheme();
    buildNavigation();
    updateProgress();
    renderView();
    
    // View Switchers
    btnSlidesView.addEventListener('click', () => setViewMode('slides'));
    btnDocView.addEventListener('click', () => setViewMode('doc'));
    
    // Slide Navigation
    btnPrev.addEventListener('click', prevSlide);
    btnNext.addEventListener('click', nextSlide);
    
    // Mobile Menu Toggle
    menuToggle.addEventListener('click', toggleSidebar);
    
    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);
}

// Setup Theme based on system preference or saved value
function setupTheme() {
    const savedTheme = localStorage.getItem('antigravity_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('antigravity_theme', newTheme);
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    if (theme === 'dark') {
        themeIconSun.classList.remove('hidden');
        themeIconMoon.classList.add('hidden');
    } else {
        themeIconSun.classList.add('hidden');
        themeIconMoon.classList.remove('hidden');
    }
}

// Build Sidebar Navigation Menu
function buildNavigation() {
    navList.innerHTML = '';
    stepsData.forEach((step, index) => {
        const li = document.createElement('li');
        li.className = `nav-item ${index === currentSlideIndex && currentViewMode === 'slides' ? 'active' : ''}`;
        
        // Check if all items for this step are completed
        const isStepDone = isStepCompleted(step);
        if (isStepDone) {
            li.classList.add('completed');
        }
        
        li.innerHTML = `
            <div class="nav-item-icon">
                ${isStepDone ? '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : index + 1}
            </div>
            <span class="nav-item-title">${step.title}</span>
        `;
        
        li.addEventListener('click', () => {
            if (currentViewMode !== 'slides') {
                setViewMode('slides');
            }
            goToSlide(index);
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
        
        navList.appendChild(li);
    });
}

// Helper to determine if a step is completely completed
function isStepCompleted(step) {
    if (step.isCheckable && step.checklist) {
        return step.checklist.every(item => checkedItems[item.id]);
    }
    // Non-checkable steps are considered completed if they have been visited or are just checked off
    return checkedItems[step.id] === true;
}

// Update general progress and progress bar
function updateProgress() {
    // Total checkmarks across all checkable steps + visits to general steps
    let totalItems = 0;
    let checkedCount = 0;
    
    stepsData.forEach(step => {
        if (step.isCheckable && step.checklist) {
            totalItems += step.checklist.length;
            step.checklist.forEach(item => {
                if (checkedItems[item.id]) checkedCount++;
            });
        } else {
            // General steps count as 1 item each (completed when checkmark clicked or slide visited)
            totalItems += 1;
            if (checkedItems[step.id]) checkedCount++;
        }
    });
    
    const percentage = Math.round((checkedCount / totalItems) * 100);
    progressBar.style.width = `${percentage}%`;
    progressPercentage.innerText = `${percentage}%`;
    
    // Update sidebar checklist icons
    buildNavigation();
}

// Navigation Slide Methods
function prevSlide() {
    if (currentSlideIndex > 0) {
        goToSlide(currentSlideIndex - 1);
    }
}

function nextSlide() {
    if (currentSlideIndex < stepsData.length - 1) {
        goToSlide(currentSlideIndex + 1);
    }
}

function goToSlide(index) {
    // Auto check previous slide as visited if it's not a checkable list step
    const prevStep = stepsData[currentSlideIndex];
    if (!prevStep.isCheckable) {
        checkedItems[prevStep.id] = true;
        localStorage.setItem('antigravity_tutorial_checked', JSON.stringify(checkedItems));
    }
    
    currentSlideIndex = index;
    
    // Check current slide if not checkable
    const currentStep = stepsData[currentSlideIndex];
    if (!currentStep.isCheckable) {
        checkedItems[currentStep.id] = true;
        localStorage.setItem('antigravity_tutorial_checked', JSON.stringify(checkedItems));
    }
    
    updateProgress();
    renderSlide();
    
    // Update active nav item
    const navItems = navList.querySelectorAll('.nav-item');
    navItems.forEach((item, idx) => {
        if (idx === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update slide buttons state
    btnPrev.disabled = currentSlideIndex === 0;
    btnNext.innerText = currentSlideIndex === stepsData.length - 1 ? 'Concluir' : 'Próximo';
    btnNext.classList.toggle('active', currentSlideIndex !== stepsData.length - 1);
    slideIndicator.innerText = `Slide ${currentSlideIndex + 1} de ${stepsData.length}`;
}

// Switch between Slides View and Full Document View
function setViewMode(mode) {
    currentViewMode = mode;
    if (mode === 'slides') {
        btnSlidesView.classList.add('active');
        btnDocView.classList.remove('active');
        slidesSection.classList.remove('hidden');
        docSection.classList.add('hidden');
        renderSlide();
    } else {
        btnSlidesView.classList.remove('active');
        btnDocView.classList.add('active');
        slidesSection.classList.add('hidden');
        docSection.classList.remove('hidden');
        renderFullDocument();
    }
    buildNavigation();
}

// Render dynamic slide page
function renderSlide() {
    const step = stepsData[currentSlideIndex];
    let htmlContent = `
        <div class="step-container">
            <span class="step-num">${step.num}</span>
            <h1 class="step-title">${step.title}</h1>
            <div class="step-body">
    `;
    
    if (step.description) {
        htmlContent += step.description;
    }
    
    // Render Alert Box if exists
    if (step.alert) {
        htmlContent += `
            <div class="alert-box alert-box-${step.alert.type}">
                <span class="alert-icon">${step.alert.type === 'warning' ? '⚠️' : '💡'}</span>
                <div class="alert-content">${step.alert.text}</div>
            </div>
        `;
    }
    
    // Render Terminal Commands if exist
    if (step.commands) {
        step.commands.forEach(cmd => {
            htmlContent += `
                <div class="code-container">
                    <pre class="code-block"><code>${cmd}</code></pre>
                    <button class="btn-copy" onclick="copyToClipboard('${cmd}')" title="Copiar Comando">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    </button>
                </div>
            `;
        });
    }
    
    // Render Checklist if checkable
    if (step.isCheckable && step.checklist) {
        htmlContent += `<ul class="checklist">`;
        step.checklist.forEach(item => {
            const checkedClass = checkedItems[item.id] ? 'checked' : '';
            htmlContent += `
                <li class="checklist-item ${checkedClass}" onclick="toggleChecklistItem('${item.id}')">
                    <div class="checklist-checkbox">
                        <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </div>
                    <span class="checklist-label">${item.label}</span>
                </li>
            `;
        });
        htmlContent += `</ul>`;
    }
    
    // Render List Items if exist (Troubleshooting)
    if (step.listItems) {
        htmlContent += `<ul style="margin: 1.5rem 0 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 0.8rem;">`;
        step.listItems.forEach(item => {
            htmlContent += `<li style="color: var(--text-secondary);">${item}</li>`;
        });
        htmlContent += `</ul>`;
    }
    
    // Render Image if exists
    if (step.image) {
        htmlContent += `
            <div class="step-image-container">
                <img class="step-image" src="${step.image}" alt="${step.title}">
            </div>
        `;
    }
    
    // Render Support Links
    if (step.supportLinks) {
        htmlContent += `
            <div style="margin-top: 2rem;">
                <h4 style="margin-bottom: 0.8rem; font-family: var(--font-heading);">Links de Apoio</h4>
                <div class="support-links-grid">
        `;
        step.supportLinks.forEach(link => {
            htmlContent += `
                <a href="${link.url}" target="_blank" class="support-link-card">
                    <svg viewBox="0 0 24 24" width="20" height="20" style="color: var(--primary);"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                    <div>
                        <strong style="color: var(--text-primary); font-size: 0.95rem; display: block;">${link.title}</strong>
                        <span style="color: var(--text-muted); font-size: 0.8rem;">Acesse o site externo oficial</span>
                    </div>
                </a>
            `;
        });
        htmlContent += `</div></div>`;
    }
    
    htmlContent += `</div></div>`;
    slideContentArea.innerHTML = htmlContent;
}

// Render the entire scrollable document view
function renderFullDocument() {
    let htmlContent = `
        <h1 class="doc-title-main">Google Antigravity</h1>
        <p class="doc-intro">Objetivo: Guia interativo completo de instalação e configuração inicial do ambiente Google Antigravity em Windows, Linux e macOS.</p>
        <hr style="border: none; border-top: 1px solid var(--border-color); margin-bottom: 2rem;">
    `;
    
    stepsData.forEach((step, idx) => {
        htmlContent += `
            <div class="doc-section" id="section-${step.id}">
                <h2 class="doc-subtitle-section">${step.num}: ${step.title}</h2>
        `;
        
        if (step.description) {
            htmlContent += step.description;
        }
        
        if (step.alert) {
            htmlContent += `
                <div class="alert-box alert-box-${step.alert.type}">
                    <span class="alert-icon">${step.alert.type === 'warning' ? '⚠️' : '💡'}</span>
                    <div class="alert-content">${step.alert.text}</div>
                </div>
            `;
        }
        
        if (step.commands) {
            step.commands.forEach(cmd => {
                htmlContent += `
                    <div class="code-container">
                        <pre class="code-block"><code>${cmd}</code></pre>
                        <button class="btn-copy" onclick="copyToClipboard('${cmd}')" title="Copiar Comando">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                        </button>
                    </div>
                `;
            });
        }
        
        if (step.isCheckable && step.checklist) {
            htmlContent += `<ul class="checklist">`;
            step.checklist.forEach(item => {
                const checkedClass = checkedItems[item.id] ? 'checked' : '';
                htmlContent += `
                    <li class="checklist-item ${checkedClass}" onclick="toggleChecklistItem('${item.id}')">
                        <div class="checklist-checkbox">
                            <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        </div>
                        <span class="checklist-label">${item.label}</span>
                    </li>
                `;
            });
            htmlContent += `</ul>`;
        } else {
            // General steps checkable toggle in doc view
            const checkedClass = checkedItems[step.id] ? 'checked' : '';
            htmlContent += `
                <ul class="checklist" style="margin-top: 1rem;">
                    <li class="checklist-item ${checkedClass}" onclick="toggleGeneralStepItem('${step.id}')">
                        <div class="checklist-checkbox">
                            <svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        </div>
                        <span class="checklist-label" style="font-weight: 600;">Concluir esta etapa</span>
                    </li>
                </ul>
            `;
        }
        
        if (step.listItems) {
            htmlContent += `<ul style="margin: 1.5rem 0 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 0.8rem;">`;
            step.listItems.forEach(item => {
                htmlContent += `<li style="color: var(--text-secondary);">${item}</li>`;
            });
            htmlContent += `</ul>`;
        }
        
        if (step.image) {
            htmlContent += `
                <div class="step-image-container">
                    <img class="step-image" src="${step.image}" alt="${step.title}">
                </div>
            `;
        }
        
        if (step.supportLinks) {
            htmlContent += `
                <div style="margin-top: 1.5rem;">
                    <h4 style="margin-bottom: 0.8rem; font-family: var(--font-heading);">Links de Apoio</h4>
                    <div class="support-links-grid">
            `;
            step.supportLinks.forEach(link => {
                htmlContent += `
                    <a href="${link.url}" target="_blank" class="support-link-card">
                        <svg viewBox="0 0 24 24" width="20" height="20" style="color: var(--primary);"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                        <div>
                            <strong style="color: var(--text-primary); font-size: 0.95rem; display: block;">${link.title}</strong>
                            <span style="color: var(--text-muted); font-size: 0.8rem;">Acesse o site externo oficial</span>
                        </div>
                    </a>
                `;
            });
            htmlContent += `</div></div>`;
        }
        
        htmlContent += `</div>`;
    });
    
    documentContentArea.innerHTML = htmlContent;
}

// Toggle Checklist Checklist Item
function toggleChecklistItem(itemId) {
    checkedItems[itemId] = !checkedItems[itemId];
    localStorage.setItem('antigravity_tutorial_checked', JSON.stringify(checkedItems));
    updateProgress();
    renderView();
}

// Toggle general steps visit status in document view
function toggleGeneralStepItem(stepId) {
    checkedItems[stepId] = !checkedItems[stepId];
    localStorage.setItem('antigravity_tutorial_checked', JSON.stringify(checkedItems));
    updateProgress();
    renderView();
}

// Update active view content
function renderView() {
    if (currentViewMode === 'slides') {
        renderSlide();
    } else {
        renderFullDocument();
    }
}

// Copy Text Command to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast();
    }).catch(err => {
        console.error("Falha ao copiar comando: ", err);
    });
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Mobile Sidebar toggle
function toggleSidebar() {
    sidebar.classList.toggle('open');
}

// Initialize on window load
window.addEventListener('DOMContentLoaded', init);
