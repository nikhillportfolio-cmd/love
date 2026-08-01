/* ==========================================================================
   WARM & COZY ROMANTIC PHONE INTERFACE - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. SCROLL REVEAL (IntersectionObserver)
       ---------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        root: document.querySelector('#scrollContainer'),
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));


    /* ----------------------------------------------------------------------
       2. LIVE CLOCK & DATE UPDATER
       ---------------------------------------------------------------------- */
    const statusTimeEl = document.getElementById('statusTime');
    const lockClockEl = document.getElementById('lockClock');
    const lockDateEl = document.getElementById('lockDate');

    function updateTime() {
        const now = new Date();
        
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const timeStr = `${hours}:${minutes}`;

        if (statusTimeEl) statusTimeEl.textContent = timeStr;
        if (lockClockEl) lockClockEl.textContent = timeStr;

        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        if (lockDateEl) lockDateEl.textContent = now.toLocaleDateString('en-US', options);
    }

    updateTime();
    setInterval(updateTime, 1000);


    /* ----------------------------------------------------------------------
       3. BACKGROUND FLOATING HEART & SPARKLE PARTICLES CANVAS
       ---------------------------------------------------------------------- */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const symbols = ['💖', '💕', '🌸', '✨', '🤍', '💌'];

    class BackgroundParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 50;
            this.size = Math.random() * 14 + 10;
            this.speedY = Math.random() * 1 + 0.3;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.4;
            this.rotation += this.rotationSpeed;

            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px sans-serif`;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillText(this.symbol, -this.size / 2, this.size / 2);
            ctx.restore();
        }
    }

    for (let i = 0; i < 25; i++) {
        const p = new BackgroundParticle();
        p.y = Math.random() * height;
        particles.push(p);
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    /* ----------------------------------------------------------------------
       4. INTERACTIVE KISS BUTTON & HEART EXPLOSION PARTICLES
       ---------------------------------------------------------------------- */
    const kissBtn = document.getElementById('kissBtn');
    const kissCountEl = document.getElementById('kissCount');
    let kissCount = parseInt(localStorage.getItem('love_kiss_count') || '0', 10);
    
    if (kissCountEl) kissCountEl.textContent = kissCount.toLocaleString();

    kissBtn.addEventListener('click', (e) => {
        kissCount++;
        localStorage.setItem('love_kiss_count', kissCount);
        if (kissCountEl) kissCountEl.textContent = kissCount.toLocaleString();

        if (navigator.vibrate) {
            navigator.vibrate([40, 30, 40]);
        }

        const rect = kissBtn.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        createHeartBurst(startX, startY);
    });

    function createHeartBurst(x, y) {
        const burstSymbols = ['💋', '💖', '💘', '✨', '🔥', '💕'];
        for (let i = 0; i < 30; i++) {
            const el = document.createElement('div');
            el.className = 'burst-heart';
            el.textContent = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 120 + 40;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 60;

            el.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: ${Math.random() * 20 + 18}px;
                pointer-events: none;
                z-index: 3000;
                transform: translate(-50%, -50%);
                transition: transform 1.2s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1.2s linear;
                opacity: 1;
            `;

            document.body.appendChild(el);

            requestAnimationFrame(() => {
                el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.4) rotate(${Math.random() * 60 - 30}deg)`;
                el.style.opacity = '0';
            });

            setTimeout(() => el.remove(), 1250);
        }
    }


    /* ----------------------------------------------------------------------
       5. AUDIO PLAYER LOGIC & SYNTHESIZED AMBIENT FALLBACK
       ---------------------------------------------------------------------- */
    const playAudioBtn = document.getElementById('playAudioBtn');
    const audioStatusIcon = document.getElementById('audioStatusIcon');
    const bgAudio = document.getElementById('bgAudio');
    let isPlaying = false;
    let audioCtx = null;

    playAudioBtn.addEventListener('click', () => {
        if (!isPlaying) {
            const playPromise = bgAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    audioStatusIcon.textContent = '❚❚';
                }).catch(() => {
                    startAmbientSynth();
                    isPlaying = true;
                    audioStatusIcon.textContent = '❚❚';
                });
            }
        } else {
            bgAudio.pause();
            stopAmbientSynth();
            isPlaying = false;
            audioStatusIcon.textContent = '▶';
        }
    });

    function startAmbientSynth() {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const freqs = [261.63, 329.63, 392.00, 493.88];
            
            freqs.forEach(freq => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
            });
        } catch (err) {
            console.log('Audio synth not supported');
        }
    }

    function stopAmbientSynth() {
        if (audioCtx) {
            audioCtx.close();
            audioCtx = null;
        }
    }


    /* ----------------------------------------------------------------------
       6. CUSTOMIZER DRAWER, TABS & LIVE IMAGE UPLOADER
       ---------------------------------------------------------------------- */
    const customizeBtn = document.getElementById('customizeBtn');
    const customizerOverlay = document.getElementById('customizerOverlay');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const saveCustomBtn = document.getElementById('saveCustomBtn');
    const resetCustomBtn = document.getElementById('resetCustomBtn');

    // Tabs
    const tabTextBtn = document.getElementById('tabTextBtn');
    const tabImagesBtn = document.getElementById('tabImagesBtn');
    const tabTextContent = document.getElementById('tabTextContent');
    const tabImagesContent = document.getElementById('tabImagesContent');

    tabTextBtn.addEventListener('click', () => {
        tabTextBtn.classList.add('active');
        tabImagesBtn.classList.remove('active');
        tabTextContent.classList.add('active');
        tabImagesContent.classList.remove('active');
    });

    tabImagesBtn.addEventListener('click', () => {
        tabImagesBtn.classList.add('active');
        tabTextBtn.classList.remove('active');
        tabImagesContent.classList.add('active');
        tabTextContent.classList.remove('active');
    });

    // Inputs
    const inputHerName = document.getElementById('inputHerName');
    const inputOccasion = document.getElementById('inputOccasion');
    const inputNickname = document.getElementById('inputNickname');
    const inputClosing = document.getElementById('inputClosing');

    // File Inputs
    const uploadPhoto1 = document.getElementById('uploadPhoto1');
    const uploadPhoto2 = document.getElementById('uploadPhoto2');
    const uploadPhoto3 = document.getElementById('uploadPhoto3');
    const uploadPhoto4 = document.getElementById('uploadPhoto4');
    const uploadPhoto5 = document.getElementById('uploadPhoto5');

    // Elements to update
    const lockWrapper = document.getElementById('lockWrapper');
    const avatarImg = document.getElementById('avatarImg');
    const storyImg1 = document.getElementById('storyImg1');
    const storyImg2 = document.getElementById('storyImg2');
    const storyImg3 = document.getElementById('storyImg3');
    const storyImg4 = document.getElementById('storyImg4');
    const storyImg5 = document.getElementById('storyImg5');

    // Default configuration
    const defaultConfig = {
        herName: "Nitya",
        occasion: "Our Special Day",
        nickname: "My Favorite Human 💖",
        closingMessage: "Forever and always yours, with all my love ❤️"
    };

    const defaultImages = {
        photo1: "images/photo1.jpg",
        photo2: "images/photo2.jpg",
        photo3: "images/photo3.jpg",
        photo4: "images/photo4.jpg",
        photo5: "images/photo5.jpg"
    };

    let currentConfig = JSON.parse(localStorage.getItem('love_letter_config')) || defaultConfig;
    let customImages = JSON.parse(localStorage.getItem('love_letter_images')) || defaultImages;

    function applyConfig(cfg) {
        document.querySelectorAll('.custom-target').forEach(el => {
            const key = el.getAttribute('data-key');
            if (cfg[key]) {
                if (key === 'closingMessage') {
                    el.innerHTML = cfg[key].replace(/\n/g, '<br>');
                } else {
                    el.textContent = cfg[key];
                }
            }
        });

        if (inputHerName) inputHerName.value = cfg.herName;
        if (inputOccasion) inputOccasion.value = cfg.occasion;
        if (inputNickname) inputNickname.value = cfg.nickname;
        if (inputClosing) inputClosing.value = cfg.closingMessage;
    }

    function applyImages(imgs) {
        if (lockWrapper && imgs.photo1) {
            lockWrapper.style.backgroundImage = `url('${imgs.photo1}')`;
        }
        if (avatarImg && imgs.photo2) avatarImg.src = imgs.photo2;
        if (storyImg1 && imgs.photo3) storyImg1.src = imgs.photo3;
        if (storyImg2 && imgs.photo4) storyImg2.src = imgs.photo4;
        if (storyImg3 && imgs.photo5) storyImg3.src = imgs.photo5;
        if (storyImg4 && imgs.photo4) storyImg4.src = imgs.photo4;
        if (storyImg5 && imgs.photo3) storyImg5.src = imgs.photo3;
    }

    applyConfig(currentConfig);
    applyImages(customImages);

    // Read File Helper
    function handleFileUpload(fileInput, key, statusId) {
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                customImages[key] = e.target.result;
                const statusEl = document.getElementById(statusId);
                if (statusEl) statusEl.textContent = 'Custom photo loaded ✓';
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    }

    uploadPhoto1.addEventListener('change', () => handleFileUpload(uploadPhoto1, 'photo1', 'statusPhoto1'));
    uploadPhoto2.addEventListener('change', () => handleFileUpload(uploadPhoto2, 'photo2', 'statusPhoto2'));
    uploadPhoto3.addEventListener('change', () => handleFileUpload(uploadPhoto3, 'photo3', 'statusPhoto3'));
    uploadPhoto4.addEventListener('change', () => handleFileUpload(uploadPhoto4, 'photo4', 'statusPhoto4'));
    uploadPhoto5.addEventListener('change', () => handleFileUpload(uploadPhoto5, 'photo5', 'statusPhoto5'));

    // Open Drawer
    customizeBtn.addEventListener('click', () => {
        customizerOverlay.classList.add('open');
    });

    // Close Drawer
    closeDrawerBtn.addEventListener('click', () => {
        customizerOverlay.classList.remove('open');
    });

    customizerOverlay.addEventListener('click', (e) => {
        if (e.target === customizerOverlay) {
            customizerOverlay.classList.remove('open');
        }
    });

    // Save Customizations
    saveCustomBtn.addEventListener('click', () => {
        currentConfig.herName = inputHerName.value.trim() || defaultConfig.herName;
        currentConfig.occasion = inputOccasion.value.trim() || defaultConfig.occasion;
        currentConfig.nickname = inputNickname.value.trim() || defaultConfig.nickname;
        currentConfig.closingMessage = inputClosing.value.trim() || defaultConfig.closingMessage;

        localStorage.setItem('love_letter_config', JSON.stringify(currentConfig));
        localStorage.setItem('love_letter_images', JSON.stringify(customImages));

        applyConfig(currentConfig);
        applyImages(customImages);

        customizerOverlay.classList.remove('open');
        createHeartBurst(window.innerWidth / 2, window.innerHeight / 2);
    });

    // Reset Defaults
    resetCustomBtn.addEventListener('click', () => {
        currentConfig = { ...defaultConfig };
        customImages = { ...defaultImages };
        localStorage.removeItem('love_letter_config');
        localStorage.removeItem('love_letter_images');
        applyConfig(currentConfig);
        applyImages(customImages);

        document.querySelectorAll('.file-status').forEach(s => s.textContent = 'Default image');
        customizerOverlay.classList.remove('open');
    });


    /* ----------------------------------------------------------------------
       7. DESKTOP PHONE FRAME VIEW TOGGLE
       ---------------------------------------------------------------------- */
    const toggleFrameBtn = document.getElementById('toggleFrameBtn');
    const phoneWrapper = document.getElementById('phoneWrapper');
    let isFullWidth = false;

    if (toggleFrameBtn && phoneWrapper) {
        toggleFrameBtn.addEventListener('click', () => {
            isFullWidth = !isFullWidth;
            if (isFullWidth) {
                phoneWrapper.classList.add('full-width');
                toggleFrameBtn.querySelector('.btn-text').textContent = 'Phone Frame';
            } else {
                phoneWrapper.classList.remove('full-width');
                toggleFrameBtn.querySelector('.btn-text').textContent = 'Phone View';
            }
        });
    }

});
