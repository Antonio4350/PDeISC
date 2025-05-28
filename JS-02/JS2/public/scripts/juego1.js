const green = document.getElementById('green');
    const red = document.getElementById('red');
    const yellow = document.getElementById('yellow');
    const blue = document.getElementById('blue');
    const startBtn = document.getElementById('startBtn');
    const statusText = document.getElementById('status');
    const rankingList = document.getElementById('rankingList');
    const victoriaSound = new Audio('../multimedia/Victoria.mp3');
    const errorSound = new Audio('../multimedia/Error.mp3');
    const buttons = [green, red, yellow, blue];
    const colors = ['green', 'red', 'yellow', 'blue'];

    let sequence = [], playerSequence = [], level = 0;
    let waitingForInput = false, playerName = null, ranking = [];

    const nameModal = document.getElementById('nameModal');
    const playerNameInput = document.getElementById('playerNameInput');
    const confirmNameBtn = document.getElementById('confirmNameBtn');
    const modalErrorMsg = document.getElementById('modalErrorMsg');
    const changePlayerBtn = document.getElementById('changePlayerBtn');

    function lightUp(color) {
      const btn = buttons[colors.indexOf(color)];
      btn.classList.add('brightness-150', 'shadow-[0_0_12px_4px_rgba(255,255,255,0.5)]');
      setTimeout(() => btn.classList.remove('brightness-150', 'shadow-[0_0_12px_4px_rgba(255,255,255,0.5)]'), 600);
    }

    function playSequence() {
      waitingForInput = false;
      let i = 0;
      const interval = setInterval(() => {
        lightUp(sequence[i]);
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          waitingForInput = true;
          statusText.textContent = `Turno de ${playerName}: nivel ${level}`;
          playerSequence = [];
        }
      }, 800);
    }

    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        if (!waitingForInput) return;
        lightUp(colors[idx]);
        playerSequence.push(colors[idx]);
        const currentStep = playerSequence.length - 1;
        if (playerSequence[currentStep] !== sequence[currentStep]) {
          errorSound.volume = 0.2;
          errorSound.currentTime = 0;
          errorSound.play();
          statusText.textContent = `¡Fallaste! Nivel alcanzado: ${level}`;
          waitingForInput = false;
          startBtn.disabled = false;
          addToRanking(playerName, level);
          renderRanking();
          return;
        }
        if (playerSequence.length === sequence.length) {
          statusText.textContent = `¡Correcto! Nivel ${level} superado.`;
          waitingForInput = false;
          setTimeout(nextLevel, 1000);
        }
      });
    });

    function startGame(name) {
      playerName = name;
      sequence = [];
      level = 0;
      startBtn.disabled = true;
      statusText.textContent = `Comenzando juego para ${playerName}...`;
      nextLevel();
      audio.currentTime = 0;
      audio.play();
    }

    function nextLevel() {
      level++;
      victoriaSound.volume = 0.2;
      victoriaSound.currentTime = 0;
      victoriaSound.play();
      statusText.textContent = `Nivel ${level}`;
      sequence.push(colors[Math.floor(Math.random() * colors.length)]);
      playSequence();
    }

    function addToRanking(name, lvl) {
        const existingPlayer = ranking.find(player => player.name === name);
        if (existingPlayer) {
          if (lvl > existingPlayer.level) {
            existingPlayer.level = lvl; // Guarda el puntaje más alto
          }
        } else {
          ranking.push({ name, level: lvl });
        }
        ranking.sort((a, b) => b.level - a.level);
      }
      

    function renderRanking() {
      rankingList.innerHTML = '';
      ranking.forEach(({ name, level }) => {
        const li = document.createElement('li');
        li.textContent = `${name} - Nivel ${level}`;
        li.className = "border-b border-gray-700 py-1";
        rankingList.appendChild(li);
      });
    }

    startBtn.addEventListener('click', () => {
      if (!playerName) {
        modalErrorMsg.classList.add('hidden');
        playerNameInput.value = '';
        nameModal.classList.remove('hidden');
        playerNameInput.focus();
      } else {
        startGame(playerName);
      }
    });

    confirmNameBtn.addEventListener('click', () => {
      const name = playerNameInput.value.trim();
      if (!name) {
        modalErrorMsg.classList.remove('hidden');
        playerNameInput.focus();
        return;
      }
      modalErrorMsg.classList.add('hidden');
      nameModal.classList.add('hidden');
      startGame(name);
    });

    changePlayerBtn.addEventListener('click', () => {
      playerName = null;
      nameModal.classList.remove('hidden');
      playerNameInput.value = '';
      playerNameInput.focus();
    });

    playerNameInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') confirmNameBtn.click();
    });

    const audio = document.getElementById('musica-fondo');
    audio.volume = 0.1; 
    audio.loop = true;
    audio.play();

    const botonMusica = document.getElementById('boton-musica');
    botonMusica.addEventListener('click', () => {
      audio.muted = !audio.muted;
      botonMusica.textContent = audio.muted ? ' Activar música' : ' Silenciar música';
    });