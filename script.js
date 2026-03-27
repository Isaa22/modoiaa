// ===== CONFIGURAÇÕES =====
let currentState = 'start';
let timerInterval;
let timeSeconds = 7 * 3600 + 2 * 60 + 25;
let totalTime = timeSeconds;
let decisionsCount = 0;
let flowLevel = 0;

// ===== PARTÍCULAS EM CANVAS =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particlesCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.resize();
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.3,
                speed: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.y -= p.speed;
            if (p.y < 0) p.y = this.canvas.height;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== ÁRVORE DE DECISÕES =====
const story = {
    start: {
        text: "🎤 Você está prestes a entrar no estúdio com Matuê para gravar uma faixa. O beat já está tocando. O que você faz?",
        icon: "fa-microphone-alt",
        choices: [
            { text: "🔥 Mandar um flow superfantástico na hora", icon: "fa-fire", next: "flowBrabo", flowBonus: 30 },
            { text: "🎧 Pedir pra ouvir o beat mais uma vez", icon: "fa-headphones", next: "ouvirBeat", flowBonus: 15 },
            { text: "💡 Sugerir um sample de guitarra", icon: "fa-guitar", next: "sampleGuitarra", flowBonus: 25 }
        ]
    },
    flowBrabo: {
        text: "🚀 Matuê levanta a sobrancelha, dá um sorriso e solta: 'Caralho, mlk, esse flow tá nível 30PRAUM!' Vocês passam a noite inteira gravando e a música vira hit. Você ganhou respeito no rap! 🏆",
        icon: "fa-crown",
        choices: [
            { text: "🔁 Recomeçar jornada", icon: "fa-sync-alt", next: "start" }
        ]
    },
    ouvirBeat: {
        text: "🎧 Matuê concorda e mostra os detalhes da produção. Vocês encontram um loop perfeito e criam 'M4QUINA DO TEMPO 2'. O som estoura nas plataformas. Você aprendeu a ter paciência! ⏳",
        icon: "fa-clock",
        choices: [
            { text: "🔁 Recomeçar jornada", icon: "fa-sync-alt", next: "start" }
        ]
    },
    sampleGuitarra: {
        text: "🎸 Matuê fica surpreso: 'Porra, tava pensando nisso!' Ele puxa a guitarra e vocês criam um som único, misturando trap com rock psicodélico. A faixa vira cult e você é lembrado como inovador. 🌟",
        icon: "fa-star",
        choices: [
            { text: "🔁 Recomeçar jornada", icon: "fa-sync-alt", next: "start" }
        ]
    },
    timeout: {
        text: "⏰ O tempo acabou! Matuê cansou de esperar e foi embora do estúdio. Na próxima, seja mais rápido nas decisões. 🚶🏾‍♂️",
        icon: "fa-hourglass-end",
        choices: [
            { text: "🔁 Tentar novamente", icon: "fa-sync-alt", next: "start" }
        ]
    }
};

// ===== FUNÇÕES DE UI =====
function updateUI() {
    const state = story[currentState];
    if (!state) return;
    
    const storyText = document.getElementById('storyText');
    const storyIcon = document.querySelector('.story-icon-wrapper i');
    
    if (storyText) storyText.innerText = state.text;
    if (storyIcon) storyIcon.className = `fas ${state.icon}`;
    
    const choicesGrid = document.getElementById('choicesGrid');
    if (choicesGrid) {
        choicesGrid.innerHTML = '';
        
        state.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-button';
            btn.innerHTML = `
                <i class="fas ${choice.icon}"></i>
                <span>${choice.text}</span>
            `;
            btn.onclick = () => makeChoice(choice);
            choicesGrid.appendChild(btn);
        });
    }
}

function makeChoice(choice) {
    if (choice.next === 'start') {
        resetGame();
        return;
    }
    
    decisionsCount++;
    if (choice.flowBonus) {
        flowLevel = Math.min(100, flowLevel + choice.flowBonus);
    }
    
    updateMetrics();
    currentState = choice.next;
    updateUI();
}

function updateMetrics() {
    const decisionsSpan = document.getElementById('decisionsCount');
    const flowSpan = document.getElementById('flowLevel');
    
    if (decisionsSpan) decisionsSpan.innerText = decisionsCount;
    if (flowSpan) flowSpan.innerText = `${flowLevel}%`;
}

function resetGame() {
    currentState = 'start';
    decisionsCount = 0;
    flowLevel = 0;
    timeSeconds = totalTime;
    updateMetrics();
    updateUI();
    resetTimer();
}

// ===== TIMER =====
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    const timerFill = document.getElementById('timerFill');
    
    if (timerDisplay) timerDisplay.innerText = formatTime(timeSeconds);
    if (timerFill) {
        const percent = (timeSeconds / totalTime) * 100;
        timerFill.style.width = `${Math.max(0, percent)}%`;
    }
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (timeSeconds > 0) {
            timeSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            if (currentState === 'start') {
                currentState = 'timeout';
                updateUI();
            }
        }
    }, 1000);
}

function resetTimer() {
    timeSeconds = totalTime;
    updateTimerDisplay();
    if (timerInterval) clearInterval(timerInterval);
    startTimer();
}

// ===== PROGRESS BAR DE LEITURA =====
function setupReadingProgress() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
    updateUI();
    startTimer();
    updateMetrics();
    setupReadingProgress();
    
    const restartBtn = document.getElementById('restartButton');
    if (restartBtn) {
        restartBtn.addEventListener('click', resetGame);
    }
});
