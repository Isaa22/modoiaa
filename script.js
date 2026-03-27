// Estados da narrativa
let currentState = 'start';
let timerInterval;
let timeSeconds = 7 * 3600 + 2 * 60 + 25; // 07:02:25

// Árvore de decisões
const story = {
    start: {
        text: "🎤 Você está prestes a entrar no estúdio com Matuê para gravar uma faixa. O beat já está tocando. O que você faz?",
        choices: [
            { text: "🔥 Mandar um flow superfantástico na hora", next: "flowBrabo" },
            { text: "🎧 Pedir pra ouvir o beat mais uma vez", next: "ouvirBeat" },
            { text: "💡 Sugerir um sample de guitarra (estilo Máquina do Tempo)", next: "sampleGuitarra" }
        ]
    },
    flowBrabo: {
        text: "🚀 Matuê levanta a sobrancelha, dá um sorriso e solta: 'Caralho, mlk, esse flow tá nível 30PRAUM!' Vocês passam a noite inteira gravando e a música vira hit. Você ganhou respeito no rap! 🏆",
        choices: [
            { text: "🔁 Recomeçar jornada", next: "start" }
        ]
    },
    ouvirBeat: {
        text: "🎧 Matuê concorda e mostra os detalhes da produção. Vocês encontram um loop perfeito e criam 'M4QUINA DO TEMPO 2'. O som estoura nas plataformas. Você aprendeu a ter paciência! ⏳",
        choices: [
            { text: "🔁 Recomeçar jornada", next: "start" }
        ]
    },
    sampleGuitarra: {
        text: "🎸 Matuê fica surpreso: 'Porra, tava pensando nisso!' Ele puxa a guitarra e vocês criam um som único, misturando trap com rock psicodélico. A faixa vira cult e você é lembrado como inovador. 🌟",
        choices: [
            { text: "🔁 Recomeçar jornada", next: "start" }
        ]
    }
};

function updateUI() {
    const state = story[currentState];
    document.getElementById('story-text').innerText = state.text;
    
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    
    state.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.innerText = choice.text;
        btn.onclick = () => makeChoice(choice.next);
        choicesDiv.appendChild(btn);
    });
}

function makeChoice(nextState) {
    currentState = nextState;
    updateUI();
}

function restartGame() {
    currentState = 'start';
    updateUI();
    resetTimer();
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    document.getElementById('timer').innerText = formatTime(timeSeconds);
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
            if (currentState !== 'start') return;
            currentState = 'timeout';
            document.getElementById('story-text').innerText = "⏰ O tempo acabou! Matuê foi embora do estúdio. Na próxima, seja mais rápido nas decisões. 🚶🏾‍♂️";
            document.getElementById('choices').innerHTML = '<button onclick="restartGame()">🔁 Tentar novamente</button>';
        }
    }, 1000);
}

function resetTimer() {
    timeSeconds = 7 * 3600 + 2 * 60 + 25;
    updateTimerDisplay();
    if (timerInterval) clearInterval(timerInterval);
    startTimer();
}

// Inicialização
updateUI();
startTimer();
