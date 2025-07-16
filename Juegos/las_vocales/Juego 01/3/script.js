document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  const container = document.querySelector(".container");
  const audio = document.getElementById("background-music");
  const reloj = document.getElementById("reloj");
  const puntaje = document.getElementById("puntaje");
  const intentos = document.getElementById("intentos");

  let score = 0;
  let time = 60;
  let attempts = 3;
  let timerInterval;
  let audioEnabled = true;
  let clicksEnabled = true;
  let correctVowel = '';
  let previousVowel = '';


  const actualUsername = localStorage.getItem("ActualUs");
  document.getElementById("actualUsername").textContent = `Usuario: ${actualUsername}`;

  function updateDisplay() {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    reloj.textContent = `Tiempo: ${minutes}:${seconds}`;
    puntaje.textContent = `Puntaje: ${score}`;
    intentos.textContent = `Intentos: ${attempts}`;
  }

  function startTimer() {
    updateDisplay();
    timerInterval = setInterval(() => {
      time--;
      updateDisplay();
      if (time <= 0) {
        clearInterval(timerInterval);
        showMessagexTiempo();
        document.getElementById("audio-tiempo-agotado").play();
      }
    }, 1000);
  }

function fadeOutMusic(audioElement, duration) {
    let volume = audioElement.volume;
    let fadeInterval = 50;
    let fadeStep = volume / (duration * 1000 / fadeInterval);

    let fadeOut = setInterval(function() {
      if (volume > 0) {
        volume -= fadeStep;
        if (volume < 0) volume = 0;
        audioElement.volume = volume;
      } else {
        clearInterval(fadeOut);
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    }, fadeInterval);
  }

function showTemporaryMessage(text, type) {
  const message = document.createElement("div");
  message.classList.add("found-message", type);
  message.textContent = text;

  document.body.appendChild(message);

  // Deshabilitar clics temporalmente en el contenedor principal
  const puzzle = document.querySelector("#puzzle");
  if (puzzle) {
    puzzle.classList.add("disable-clicks");
  }

  // Eliminar el mensaje después de 2 segundos
  setTimeout(() => {
    message.remove();
    if (puzzle) {
      puzzle.classList.remove("disable-clicks");
    }
  }, 2000);
}



  function showMessagexTiempo() {
    fadeOutMusic(audio, 4);

    const message = document.createElement("div");
    message.classList.add("found-message");

    message.innerHTML = `
      <div style="font-weight: bold; font-size: 32px;">¡FIN DEL JUEGO!</div>
      <div style="font-size: 24px;">Tu tiempo se ha terminado.</div>
    `;

    document.body.appendChild(message);
    document.body.classList.add("disable-clicks");

    const audioTiempo = new Audio("sounds/finportiempo.mp3");
    audioTiempo.play();

    setTimeout(() => {
      endGame();
      window.location.href = "out.html";
    }, 7000);
  }


function showMessagexIntentos() {


  const audioError = document.getElementById("audio-error");
  if (audioError) audioError.play();

  setTimeout(() => {
    fadeOutMusic(audio, 4);

    const message = document.createElement("div");
    message.classList.add("found-message");
    message.innerHTML = `<div style="font-size: 24px;">Lo siento. Perdiste.</div>`;
    document.body.appendChild(message);
    document.body.classList.add("disable-clicks");

    const audioIntentos = document.getElementById("audio-perdiste");
    if (audioIntentos) audioIntentos.play();

    setTimeout(() => {
      endGame();
      window.location.href = "out.html";
    }, 7000);
  }, 2000);
}

function showMessagexExito() {
  // Primero mostrar el mensaje pequeño de "CORRECTO"
  showTemporaryMessage("CORRECTO", "correct"); 

  // Luego esperar 2 segundos antes de seguir
  setTimeout(() => {


    fadeOutMusic(audio, 4);
    
    const bonus = time * 2;
    score += bonus;

    const message = document.createElement("div");
    message.classList.add("found-message");

    message.innerHTML = `
      <div style="font-weight: bold; font-size: 32px;">¡FELICITACIONES!</div>
      <div style="font-size: 24px;">Has completado el juego.</div>
      <div style="margin-top: 10px; font-size: 20px;">Puntaje final: ${score} (Bonus: ${bonus})</div>
    `;

    document.body.appendChild(message);
    document.body.classList.add("disable-clicks");

    const audioFin = new Audio("sounds/finporcompletar.mp3");
    audioFin.play();

    setTimeout(() => {
      endGame();
      window.location.href = "out.html";
    }, 7000);

  }, 2000); // Esperar 2 segundos antes de ejecutar todo esto
}




function endGame() {
    const currentDate = new Date().toLocaleDateString();
    const userData = {
        fecha: currentDate,
        usuario: localStorage.getItem("ActualUs"),
        puntaje: score,
        juegonumero: incrementGameNumber(),
        game: "AEI_cncrvocales", // ← este es tu nuevo código
        rutina: localStorage.getItem("rutina")
    };

    // Guardar en el historial de juegos
    const gamesHistory = JSON.parse(localStorage.getItem("gamesHistory")) || [];
    gamesHistory.push(userData);
    localStorage.setItem("gamesHistory", JSON.stringify(gamesHistory));

    // Actualizar puntaje acumulado
    updateAcumulado(score);
}

function updateAcumulado(scoreToAdd) {
    let acumulado = parseInt(localStorage.getItem("acumulado")) || 0;
    acumulado += scoreToAdd;
    localStorage.setItem("acumulado", acumulado);
}

function incrementGameNumber() {
    let gameNumber = parseInt(localStorage.getItem("gameNumber")) || 0;
    gameNumber++;
    localStorage.setItem("gameNumber", gameNumber);
    return gameNumber;
}

function almacenarRegistroConZ(finalScore) {
    const juegonumero = localStorage.getItem("gameNumber") || 1;
    const fechaActual = new Date().toLocaleDateString();
    const usuario = localStorage.getItem("ActualUs") || "Desconocido";
    const acumulado = localStorage.getItem("acumulado") || 0;
    const rutina = localStorage.getItem("rutina") || "No disponible";

    const registro = {
        juegoZ: `Juego ${juegonumero}Z`,
        fecha: fechaActual,
        usuario: usuario,
        acumulado: acumulado,
        rutina: rutina
    };

    localStorage.setItem(`registroConZ-${Date.now()}`, JSON.stringify(registro));
    console.log("Registro almacenado con Z:", registro);
}


  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

function setVowelTable() {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const shuffled = shuffle([...vowels]);
  
  // Elegir una nueva vocal distinta de la anterior
  let newCorrect;
  do {
    newCorrect = shuffled[Math.floor(Math.random() * shuffled.length)];
  } while (newCorrect === previousVowel);

  correctVowel = newCorrect;
  previousVowel = correctVowel; // Guardar la actual como "anterior" para la siguiente ronda

  [0, 1, 2, 3, 4].forEach((i, index) => {
    const cell = document.getElementById(`cell-${i}`);
    cell.textContent = shuffled[index];
    cell.className = '';
    cell.onclick = () => checkAnswer(shuffled[index], cell);
  });
}




function checkAnswer(selected, cell) {
  // Deshabilitar clics en el contenedor del juego
  const vowelTable = document.querySelector("#vowel-table");
  if (vowelTable) vowelTable.classList.add("disable-clicks");

  audioEnabled = false;

  if (selected === correctVowel) {
    cell.classList.add('correct');
    score += 10;
    updateDisplay();
    const audioCorrect = document.getElementById("audio-correcto");
    audioCorrect.pause();
    audioCorrect.currentTime = 0;
    audioCorrect.play();
  } else {
  cell.classList.add('incorrect');
  attempts--;
  score = Math.max(0, score - 5); // Resta 5 puntos, sin ir por debajo de 0
  updateDisplay();

  const audioError = document.getElementById("audio-error");
  audioError.pause();
  audioError.currentTime = 0;
  audioError.play();

  // Mostrar imagen animada con la letra correcta
  showHint(correctVowel);
}

  if (attempts <= 0) {
    clearInterval(timerInterval);
    showMessagexIntentos();
    return;
  }

  if (score >= 100) {
    clearInterval(timerInterval);
    showMessagexExito();
    return;
  }

  // Rehabilitar los clics después del retraso
  setTimeout(() => {
    setVowelTable();
    if (vowelTable) vowelTable.classList.remove("disable-clicks");
    audioEnabled = true;
  }, 2000);  // a 2 segundos para que dé tiempo a ver la imagen y sonido
}

// Función para mostrar la pista visual y sonora
function showHint(letter) {
  const hintContainer = document.getElementById("hint-container");
  const hintImage = document.getElementById("hint-image");
  hintImage.src = `image/${letter}.jpg`;  // ruta a la imagen animada

  hintContainer.style.display = "block";

  // Reproducir sonido de pista
  const hintAudio = new Audio(`sounds/hint_${letter}.mp3`);
  hintAudio.play();

  // Ocultar la imagen y detener sonido tras 2 segundos
  setTimeout(() => {
    hintContainer.style.display = "none";
    hintAudio.pause();
    hintAudio.currentTime = 0;
  }, 2000);
}






function playSound(vowel) {
  const vowelAudio = new Audio(`sounds/señalar ${vowel}.mp3`);
  vowelAudio.play().catch((e) => console.error("Error al reproducir el sonido:", e));
}



document.getElementById('cell-5').addEventListener('click', () => {
  if (correctVowel && audioEnabled) playSound(correctVowel);
});


  startButton.addEventListener("click", () => {
    document.getElementById("start-button-container").style.display = "none";
    container.style.display = "block";
    audio.play();
    startTimer();
    setVowelTable();
  });
});
