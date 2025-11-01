// Alura Automation SPA - GitHub Pages Version
console.log('🎮 Carregando Automação Alura...');

class AluraAutomationSPA {
    constructor() {
        this.isAutomationActive = false;
        this.observer = null;
        this.retryCount = 0;
        this.maxRetries = 8;
        this.currentActivity = null;
        this.watermark = null;
        
        this.init();
    }

    init() {
        console.log('🎮 AUTOMAÇÃO ALURA SPA INICIADA');
        this.createWatermark();
        this.setupNavigationListener();
        this.setupMutationObserver();
        this.startAutomation();
    }

    createWatermark() {
        this.watermark = document.createElement('div');
        this.watermark.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                z-index: 999999;
                border: 1px solid #28a745;
                backdrop-filter: blur(5px);
                min-width: 180px;
            ">
                <div style="font-weight: bold; margin-bottom: 5px;">🤖 Alura Auto</div>
                <div id="auto-status" style="color: #28a745;">✅ ATIVA</div>
                <div style="font-size: 10px; margin-top: 5px;">GitHub Version</div>
            </div>
        `;
        document.body.appendChild(this.watermark);
    }

    setupNavigationListener() {
        let lastUrl = location.href;
        
        setInterval(() => {
            if (location.href !== lastUrl) {
                console.log('🔄 Navegação SPA detectada');
                lastUrl = location.href;
                this.handlePageChange();
            }
        }, 1000);

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', () => {
            setTimeout(() => this.handlePageChange(), 500);
        });
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && this.isActivityElement(node)) {
                            shouldProcess = true;
                            break;
                        }
                    }
                }
            }
            
            if (shouldProcess) {
                setTimeout(() => this.processCurrentPage(), 1500);
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    isActivityElement(element) {
        const selectors = [
            '.vjs-big-play-button',
            '.vjs-play-control',
            '.alternativeList-item-input',
            '.blocks',
            '#project-link',
            'button.task-actions-button-showOpinion',
            'a.task-actions-button-next'
        ];
        
        return selectors.some(selector => 
            element.matches?.(selector) || 
            element.querySelector?.(selector)
        );
    }

    handlePageChange() {
        if (!this.isAutomationActive) return;
        
        console.log('🔄 Processando mudança de página...');
        this.retryCount = 0;
        this.currentActivity = null;
        
        setTimeout(() => {
            this.processCurrentPage();
        }, 2000);
    }

    async processCurrentPage() {
        if (!this.isAutomationActive) return;
        
        if (this.retryCount >= this.maxRetries) {
            console.log('❌ Máximo de tentativas atingido');
            return;
        }

        this.retryCount++;
        console.log(`🔍 Analisando página (${this.retryCount}/${this.maxRetries})...`);

        const activityType = this.detectActivityType();
        
        if (activityType === 'desconhecida' || activityType === this.currentActivity) {
            setTimeout(() => this.processCurrentPage(), 3000);
            return;
        }

        this.currentActivity = activityType;
        console.log(`📊 Atividade: ${activityType.toUpperCase()}`);
        await this.executeActivity(activityType);
    }

    detectActivityType() {
        const checks = [
            { selector: '.vjs-big-play-button, .vjs-play-control, video', type: 'video' },
            { selector: 'button.task-actions-button-showOpinion', type: 'texto-opiniao' },
            { selector: '.alternativeList-item-input', type: 'multipla-escolha' },
            { selector: '.blocks', type: 'ordenar-blocos' },
            { selector: '#project-link', type: 'link-projeto' },
            { selector: 'a.task-actions-button-next', type: 'texto-imagem' }
        ];

        for (const check of checks) {
            if (this.isElementVisible(check.selector)) {
                if (check.type === 'ordenar-blocos' && !document.getElementById('sortBlocksOrigin')) {
                    continue;
                }
                return check.type;
            }
        }
        return 'desconhecida';
    }

    isElementVisible(selector) {
        const element = document.querySelector(selector);
        return element && 
               element.offsetParent !== null &&
               getComputedStyle(element).display !== 'none' &&
               getComputedStyle(element).visibility !== 'hidden';
    }

    async executeActivity(type) {
        try {
            switch(type) {
                case 'video':
                    await this.autoClickVideo();
                    break;
                case 'texto-imagem':
                    await this.autoClickTextoImagem();
                    break;
                case 'texto-opiniao':
                    await this.autoClickTextoOpiniao();
                    break;
                case 'multipla-escolha':
                    await this.autoClickMultiplaEscolha();
                    break;
                case 'ordenar-blocos':
                    await this.autoClickOrdenarBlocos();
                    break;
                case 'link-projeto':
                    await this.autoClickLinkProjeto();
                    break;
            }
        } catch (error) {
            console.error('❌ Erro:', error);
            this.retryWithBackup();
        }
    }

    async autoClickVideo() {
        console.log('🎬 Processando VÍDEO...');
        const playButton = await this.waitForElement('.vjs-big-play-button, .vjs-play-control', 5000);
        if (playButton) {
            playButton.click();
            console.log('✅ Play clicado');
            await this.delay(4000);
        }
        await this.goToNextActivity();
    }

    async autoClickTextoImagem() {
        console.log('📷 Processando TEXTO/IMAGEM...');
        await this.delay(2000);
        await this.goToNextActivity();
    }

    async autoClickTextoOpiniao() {
        console.log('💬 Processando OPINIÃO...');
        const opinionButton = await this.waitForElement('button.task-actions-button-showOpinion', 5000);
        if (opinionButton) {
            opinionButton.click();
            console.log('✅ Opinião clicada');
            await this.delay(2000);
        }
        await this.goToNextActivity();
    }

    async autoClickMultiplaEscolha() {
        console.log('🔘 Processando MÚLTIPLA ESCOLHA...');
        const alternatives = await this.waitForElement('.alternativeList-item-input', 5000, true);
        if (alternatives && alternatives.length > 0) {
            for (let i = 0; i < alternatives.length; i++) {
                alternatives[i].click();
                await this.delay(300);
            }
            console.log(`✅ ${alternatives.length} alternativas clicadas`);
            await this.delay(2000);
        }
        await this.goToNextActivity();
    }

    async autoClickOrdenarBlocos() {
        console.log('🧩 Processando ORDENAR BLOCOS...');
        try {
            const blocksContainer = await this.waitForElement('.blocks', 5000);
            if (blocksContainer) {
                const correctOrderBase64 = blocksContainer.getAttribute('data-correct-order');
                if (correctOrderBase64) {
                    const firstDecode = atob(correctOrderBase64);
                    const finalDecode = atob(firstDecode);
                    const correctedSequence = finalDecode.split(',').map(text => 
                        text.replace(/â\x80\x9C/g, '“')
                            .replace(/â\x80\x9D/g, '”')
                            .replace(/â\x80/g, '“')
                            .replace(/â\x80/g, '')
                            .trim()
                    );
                    
                    console.log('🎯 Ordem correta decodificada');
                    const resetButton = document.getElementById('tryAgain');
                    if (resetButton) resetButton.click();
                    
                    await this.delay(1000);
                    
                    for (let i = 0; i < correctedSequence.length; i++) {
                        const blockText = correctedSequence[i];
                        const blocks = document.querySelectorAll('#sortBlocksOrigin .block');
                        const targetBlock = Array.from(blocks).find(block => 
                            block.getAttribute('data-text') === blockText
                        );
                        if (targetBlock) {
                            targetBlock.click();
                            await this.delay(1000);
                        }
                    }
                    
                    const submitButton = document.getElementById('submitBlocks');
                    if (submitButton) {
                        submitButton.click();
                        await this.delay(3000);
                    }
                }
            }
        } catch (error) {
            console.log('❌ Erro em ordenar blocos');
        }
        await this.goToNextActivity();
    }

    async autoClickLinkProjeto() {
        console.log('🔗 Processando LINK PROJETO...');
        const projectLinkInput = await this.waitForElement('#project-link', 5000);
        if (projectLinkInput) {
            projectLinkInput.value = 'https://cursos.alura.com.br/course/introducao-python/task/198807';
            ['input', 'change', 'blur'].forEach(eventType => {
                projectLinkInput.dispatchEvent(new Event(eventType, { bubbles: true }));
            });
            console.log('✅ Link preenchido');
            await this.delay(2000);
            
            const submitButton = document.getElementById('linkSubmit');
            if (submitButton) {
                if (submitButton.disabled) submitButton.disabled = false;
                submitButton.click();
                console.log('✅ Link enviado');
                await this.delay(3000);
            }
        }
        await this.goToNextActivity();
    }

    async goToNextActivity() {
        if (!this.isAutomationActive) return;
        
        console.log('🔄 Procurando próxima...');
        const nextButton = await this.waitForElement(
            'a.task-actions-button-next, a[href*="/next"]', 
            10000
        );
        
        if (nextButton) {
            console.log('✅ Indo para próxima...');
            this.currentActivity = null;
            this.retryCount = 0;
            nextButton.click();
            await this.delay(4000);
            await this.processCurrentPage();
        } else {
            console.log('❌ Próxima não encontrada...');
            await this.delay(5000);
            await this.processCurrentPage();
        }
    }

    async waitForElement(selector, timeout = 10000, multiple = false) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const element = multiple ? 
                document.querySelectorAll(selector) : 
                document.querySelector(selector);
                
            if (element && (multiple ? element.length > 0 : this.isElementVisible(selector))) {
                return element;
            }
            await this.delay(500);
        }
        return null;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    retryWithBackup() {
        if (this.retryCount < this.maxRetries) {
            setTimeout(() => this.processCurrentPage(), 3000);
        }
    }

    startAutomation() {
        this.isAutomationActive = true;
        console.log('🚀 AUTOMAÇÃO INICIADA - GitHub Version');
        this.processCurrentPage();
    }

    stopAutomation() {
        this.isAutomationActive = false;
        if (this.observer) this.observer.disconnect();
        if (this.watermark) this.watermark.remove();
        console.log('🛑 AUTOMAÇÃO PARADA');
    }
}

// Inicialização
console.log('🎮 AUTOMAÇÃO ALURA CARREGADA!');
console.log('Comandos: startAluraAutomation() / stopAluraAutomation()');

window.aluraAutomation = new AluraAutomationSPA();
window.startAluraAutomation = () => window.aluraAutomation.startAutomation();
window.stopAluraAutomation = () => window.aluraAutomation.stopAutomation();