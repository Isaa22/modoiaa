// ===== ESTADOS DA NARRATIVA =====
let currentState = 'start';
let timerInterval;
let timeSeconds = 7 * 3600 + 2 * 60 + 25; // 07:02:25
let totalTime = timeSeconds;

// ===== ÁRVORE DE DECISÕES =====
const story = {
    start: {
        text: "🎤 Você está prestes a entrar no estúdio com Matuê para gravar uma faixa. O beat já está tocando. O que você faz?",
        icon: "fa-microphone-alt",
        choices: [
            { text: "🔥 Mandar um flow superfantástico na hora", icon: "fa-fire", next: "flowBrabo" },
            { text: "🎧 Pedir pra ouvir o beat mais uma vez", icon: "fa-headphones", next: "ouvirBeat" },
            { text: "💡 Sugerir um sample de guitarra (estilo Máquina do Tempo)", icon: "fa-guitar", next: "sampleGuitarra" }
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

// ===== FUNÇÃO PARA ATUALIZAR A INTERFACE =====
function updateUI() {
    const state = story[currentState];
    if (!state) return;
    
    // Atualizar texto da história
    const storyText = document.getElementById('story-text');
    const storyIcon = document.querySelector('.story-icon i');
    
    storyText.innerText = state.text;
    storyIcon.className = `fas ${state.icon}`;
    
    // Atualizar botões de escolha
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';
    
    state.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `
            <i class="fas ${choice.icon}"></i>
            <span>${choice.text}</span>
        `;
        btn.onclick = () => makeChoice(choice.next);
        choicesContainer.appendChild(btn);
    });
}

// ===== FUNÇÃO PARA PROCESSAR ESCOLHA =====
function makeChoice(nextState) {
    if (nextState === 'start') {
        resetGame();
        return;
    }
    currentState = nextState;
    updateUI();
}

// ===== FUNÇÃO PARA REINICIAR O JOGO =====
function resetGame() {
    currentState = 'start';
    resetTimer();
    updateUI();
}

// ===== FUNÇÕES DO TIMER =====
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    const progressBar = document.getElementById('timer-progress');
    
    if (timerElement) {
        timerElement.innerText = formatTime(timeSeconds);
    }
    
    if (progressBar) {
        const progressPercent = (timeSeconds / totalTime) * 100;
        progressBar.style.width = `${Math.max(0, progressPercent)}%`;
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
            // Quando o tempo acabar, força um final especial
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

// ===== FUNÇÃO PARA PARAR O TIMER (quando o jogo termina) =====
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    startTimer();
    
    // Adicionar evento ao botão reiniciar
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            resetGame();
        });
    }
});

// ===== OBSERVADOR PARA PAUSAR TIMER EM FINAIS =====
// Monitora mudanças no estado para pausar o timer quando o jogo termina
const originalMakeChoice = makeChoice;
window.makeChoice = function(nextState) {
    const state = story[currentState];
    // Se está em um final (apenas 1 opção de recomeçar), para o timer
    if (state && state.choices.length === 1 && state.choices[0].next === 'start') {
        stopTimer();
    }
    originalMakeChoice(nextState);
};

// Sobrescrever para funcionar com o clique
makeChoice = window.makeChoice;
