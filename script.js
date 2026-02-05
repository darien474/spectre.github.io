document.addEventListener('DOMContentLoaded', function() {
    console.log('⚡ Spectre.io - Loading...');

    const copyButtons = [
        { id: 'copy1', inputId: 'box1', name: 'BloxStrike Script' },
        { id: 'copy2', inputId: 'box2', name: 'Universal FPS Script' },
        { id: 'copy3', inputId: 'box3', name: 'Frontline Versus Script' },
        { id: 'copy4', inputId: 'box4', name: 'Defuse Division Script' }
    ];

    copyButtons.forEach(buttonInfo => {
        const button = document.getElementById(buttonInfo.id);
        const input = document.getElementById(buttonInfo.inputId);
        
        if (button && input) {
            button.addEventListener('click', function() {
                copyToClipboard(input, button, buttonInfo.name);
            });
            
            input.addEventListener('click', function() {
                this.select();
            });
            
            input.addEventListener('dblclick', function() {
                this.select();
                showNotification('Text selected. Press Ctrl+C to copy.', 'info');
            });
        }
    });

    function copyToClipboard(input, button, scriptName) {
        input.select();
        input.setSelectionRange(0, 99999);
        
        const originalText = button.textContent;
        const originalHTML = button.innerHTML;
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(input.value)
                .then(() => {
                    button.textContent = 'Copied!';
                    button.classList.add('copied');
                    button.style.animation = 'copyPulse 0.5s ease-out';
                    
                    showNotification(`${scriptName} copied to clipboard!`, 'success');
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.innerHTML = originalHTML;
                        button.classList.remove('copied');
                        button.style.animation = '';
                    }, 2000);
                    
                    console.log(`✅ Copied: ${scriptName}`);
                })
                .catch(err => {
                    console.error('Clipboard API failed:', err);
                    fallbackCopy(input, button, scriptName);
                });
        } else {
            fallbackCopy(input, button, scriptName);
        }
    }

    function fallbackCopy(input, button, scriptName) {
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                button.textContent = 'Copied!';
                button.classList.add('copied');
                button.style.animation = 'copyPulse 0.5s ease-out';
                
                showNotification(`${scriptName} copied!`, 'success');
                
                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                    button.style.animation = '';
                }, 2000);
            } else {
                throw new Error('execCommand failed');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            
            button.textContent = 'Select';
            button.classList.add('error');
            
            input.focus();
            input.select();
            
            showNotification('Please press Ctrl+C to copy', 'error');
            
            setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('error');
            }, 3000);
        }
    }

    const executorLinks = document.querySelectorAll('.executor-download');
    
    executorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.href;
            const executorName = this.closest('.executor-card')?.querySelector('.executor-title')?.textContent || 'Executor';
            
            showNotification(`Opening ${executorName}...`, 'info');
            
            setTimeout(() => {
                window.open(url, '_blank', 'noopener,noreferrer');
            }, 500);
            
            createRippleEffect(this);
        });
    });

    const scriptCards = document.querySelectorAll('.script-card, .executor-card');
    
    scriptCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(138, 43, 226, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #8a2be2, #9b30ff);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(138, 43, 226, 0.4);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'translateY(20px)';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        createRippleEffect(this);
    });

    function showNotification(message, type = 'info') {
        const existing = document.querySelectorAll('.custom-notification');
        existing.forEach(notif => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 300);
        });
        
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                           type === 'error' ? 'fa-exclamation-circle' : 
                           'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.95)' : 
                         type === 'error' ? 'rgba(255, 68, 68, 0.95)' : 
                         'rgba(138, 43, 226, 0.95)'};
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Segoe UI', sans-serif;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function createRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    document.addEventListener('click', function(e) {
        if (e.target.matches('button, .executor-download') || 
            e.target.closest('button') || 
            e.target.closest('.executor-download')) {
            const element = e.target.closest('button') || e.target.closest('.executor-download') || e.target;
            createRippleEffect(element);
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes copyPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        button.copied {
            background: linear-gradient(135deg, #00ff88, #00cc66) !important;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.5) !important;
        }
        
        button.error {
            background: linear-gradient(135deg, #ff4444, #cc0000) !important;
            box-shadow: 0 0 20px rgba(255, 68, 68, 0.5) !important;
        }
        
        .scroll-top-btn:hover {
            transform: translateY(-5px) scale(1.1) !important;
            box-shadow: 0 10px 30px rgba(138, 43, 226, 0.6) !important;
        }
        
        .custom-notification i {
            font-size: 20px;
        }
    `;
    document.head.appendChild(style);

    const loadingScreen = document.createElement('div');
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;
    loadingScreen.innerHTML = `
        <div style="
            width: 60px;
            height: 60px;
            border: 4px solid rgba(138, 43, 226, 0.3);
            border-top: 4px solid #8a2be2;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        "></div>
        <div style="
            margin-top: 20px;
            color: #ffffff;
            font-size: 14px;
            letter-spacing: 2px;
            text-transform: uppercase;
            animation: pulse 1.5s ease-in-out infinite;
        ">Loading Spectre.io</div>
    `;
    
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(loadingStyle);
    
    document.body.appendChild(loadingScreen);
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
            showNotification('Welcome to Spectre.io!', 'success');
        }, 500);
    }, 1500);

    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: 45px;
        height: 45px;
        background: rgba(20, 20, 20, 0.8);
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(darkModeToggle);
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('light-mode')) {
            icon.className = 'fas fa-sun';
            document.body.style.background = '#ffffff';
            document.body.style.color = '#000000';
            showNotification('Light mode activated', 'info');
        } else {
            icon.className = 'fas fa-moon';
            document.body.style.background = '';
            document.body.style.color = '';
            showNotification('Dark mode activated', 'info');
        }
        createRippleEffect(this);
    });

    darkModeToggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(15deg)';
        this.style.boxShadow = '0 0 20px rgba(138, 43, 226, 0.5)';
    });
    
    darkModeToggle.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });

    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(138, 43, 226, 0.5);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    const particleAnimation = document.createElement('style');
    particleAnimation.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 0.5;
            }
            90% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleAnimation);

    const inputs = document.querySelectorAll('input[type="text"]');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#8a2be2';
            this.style.boxShadow = '0 0 0 3px rgba(138, 43, 226, 0.2)';
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
            this.style.transform = '';
        });
    });

    const scriptTiers = document.querySelectorAll('.script-tier');
    
    scriptTiers.forEach(tier => {
        tier.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 0 20px currentColor';
        });
        
        tier.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    const viewCount = localStorage.getItem('spectre_view_count') || 0;
    localStorage.setItem('spectre_view_count', parseInt(viewCount) + 1);
    
    if (parseInt(viewCount) > 0) {
        console.log(`👁️ This page has been viewed ${parseInt(viewCount) + 1} times`);
    }

    const stats = {
        scripts: document.querySelectorAll('.script-card').length,
        executors: document.querySelectorAll('.executor-card').length,
        copies: 0
    };
    
    copyButtons.forEach(buttonInfo => {
        const button = document.getElementById(buttonInfo.id);
        if (button) {
            button.addEventListener('click', () => {
                stats.copies++;
                console.log(`📋 Total copies: ${stats.copies}`);
            });
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'c') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.type === 'text') {
                showNotification('Text ready to copy', 'info');
            }
        }
        
        if (e.key === 'Escape') {
            const notifications = document.querySelectorAll('.custom-notification');
            notifications.forEach(notification => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            });
        }
    });

    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.style.boxShadow = 'none';
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    const copyrightYear = new Date().getFullYear();
    const copyrightElement = document.createElement('div');
    copyrightElement.className = 'copyright';
    copyrightElement.innerHTML = `© ${copyrightYear} Spectre.io - Premium Roblox Scripts`;
    copyrightElement.style.cssText = `
        text-align: center;
        color: var(--text-muted);
        font-size: 12px;
        margin-top: 40px;
        padding: 15px;
        opacity: 0.7;
    `;
    
    const footer = document.querySelector('footer') || document.body;
    footer.appendChild(copyrightElement);

    const glowEffects = document.createElement('div');
    glowEffects.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -2;
    `;
    
    for (let i = 0; i < 3; i++) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            width: ${Math.random() * 300 + 200}px;
            height: ${Math.random() * 300 + 200}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%);
            filter: blur(60px);
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: glowFloat ${Math.random() * 20 + 20}s ease-in-out infinite;
        `;
        glowEffects.appendChild(glow);
    }
    
    document.body.appendChild(glowEffects);
    
    const glowAnimation = document.createElement('style');
    glowAnimation.textContent = `
        @keyframes glowFloat {
            0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0.2;
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.1);
                opacity: 0.4;
            }
        }
    `;
    document.head.appendChild(glowAnimation);

    function checkPerformance() {
        const start = performance.now();
        
        for (let i = 0; i < 1000000; i++) {
            Math.sqrt(i);
        }
        
        const end = performance.now();
        const duration = end - start;
        
        if (duration > 100) {
            console.warn('⚠️ Performance notice: Consider optimizing');
        }
    }
    
    setTimeout(checkPerformance, 5000);

    const sessionStart = Date.now();
    
    window.addEventListener('beforeunload', function() {
        const sessionDuration = Date.now() - sessionStart;
        console.log(`⏱️ Session duration: ${(sessionDuration / 1000).toFixed(1)} seconds`);
        console.log(`📊 Stats: ${stats.copies} copies made`);
    });

    console.log('🚀 Spectre.io fully loaded!');
    console.log('📋 Available scripts:', stats.scripts);
    console.log('💻 Available executors:', stats.executors);
    
    const welcomeMessages = [
        "Ready to enhance your Roblox experience!",
        "Premium scripts at your fingertips!",
        "Unlock new possibilities with Spectre.io!",
        "Game smarter, not harder!"
    ];
    
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    console.log(`💬 ${randomMessage}`);
});