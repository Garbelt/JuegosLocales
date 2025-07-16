﻿document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const startButtonContainer = document.getElementById("start-button-container");
    const container = document.querySelector(".container");
    const audio = document.getElementById("background-music");
    const reloj = document.getElementById("reloj");
    const puntaje = document.getElementById("puntaje");

    if (!startButton || !startButtonContainer || !container || !audio || !reloj || !puntaje) {
        console.error("Error: One or more DOM elements are missing.");
        return;
    }

    let timerInterval;
    let time;
    let score = 100;
    const baseScore = 50; // Puntos base por completar el puzzle
    const timeLimit = 90; // Límite de tiempo en segundos
    const size = 4; // Tamaño del rompecabezas (3X3)
    const numMovesToShuffle = 200; // Número de movimientos aleatorios para mezclar el puzzle

    let selectedPiece = null;

    startButton.addEventListener("click", () => {
        startButtonContainer.style.display = "none";
        container.style.display = "block";
        audio.play();

        startTimer();
        createPuzzle();
    });

    function startTimer() {
        time = timeLimit;
        updateClockDisplay();
        timerInterval = setInterval(() => {
            time--;
            updateClockDisplay();

            if (time <= 0) {
                clearInterval(timerInterval);
                showTimeUpMessage();
            }
        }, 1000);
    }

    function updateClockDisplay() {
        const minutes = String(Math.floor(time / 60)).padStart(2, "0");
        const seconds = String(time % 60).padStart(2, "0");
        reloj.textContent = `Tiempo: ${minutes}:${seconds}`;
        puntaje.textContent = `Puntaje: ${Math.max(0, score - (timeLimit - time))}`;
    }

    function splitImage(imageSrc) {
        const pieces = [];
        for (let i = 0; i < size * size; i++) {
            const piece = document.createElement("div");
            piece.classList.add("piece");
            piece.style.backgroundImage = `url(${imageSrc})`;
            piece.style.backgroundPosition = `${(i % size) * (100 / (size - 1))}% ${(Math.floor(i / size)) * (100 / (size - 1))}%`;
            piece.dataset.index = i;
            piece.style.order = i;
            pieces.push(piece);
        }
        return pieces;
    }

    function createPuzzle() {
        const puzzleContainer = document.getElementById("puzzle");
        if (!puzzleContainer) {
            console.error("Error: Puzzle container element is missing.");
            return;
        }

        puzzleContainer.innerHTML = ""; // Clear any existing pieces
        const imageSrc = "Image/RompeCa.jpg"; // Reemplaza con la ruta de tu imagen
        const pieces = splitImage(imageSrc);

        // Colocar las piezas en el orden correcto inicialmente
        pieces.forEach(piece => {
            puzzleContainer.appendChild(piece);
        });

        // Mezclar las piezas
        shufflePuzzle(pieces);

        puzzleContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("piece")) {
                if (!selectedPiece) {
                    selectPiece(event.target);
                } else {
                    swapPieces(selectedPiece, event.target);
                    if (checkIfSolved()) {
                        clearInterval(timerInterval);
                        showSolvedMessage();
                    }
                }
            }
        });
    }

    function shufflePuzzle(pieces) {
        const shuffledIndexes = Array.from({ length: size * size }, (_, i) => i).sort(() => Math.random() - 0.5);
        pieces.forEach((piece, index) => {
            piece.style.order = shuffledIndexes[index];
            piece.dataset.index = shuffledIndexes[index];
        });
    }

    function selectPiece(piece) {
        piece.classList.add("selected");
        selectedPiece = piece;
    }

    function swapPieces(piece1, piece2) {
        const tempOrder = piece1.style.order;
        piece1.style.order = piece2.style.order;
        piece2.style.order = tempOrder;

        const tempIndex = piece1.dataset.index;
        piece1.dataset.index = piece2.dataset.index;
        piece2.dataset.index = tempIndex;

        piece1.classList.remove("selected");
        selectedPiece = null;

        // Reproducir el sonido al intercambiar piezas
        playSwapSound();
    }

    function playSwapSound() {
        const swapSound = new Audio("sound/changecoin.mp3");
        swapSound.play();
    }

    function checkIfSolved() {
        const pieces = Array.from(document.querySelectorAll(".piece"));
        return pieces.every((piece, index) => parseInt(piece.dataset.index) === index);
    }

function showSolvedMessage() {
    const remainingScore = Math.max(0, score - (timeLimit - time));
    score = baseScore + remainingScore;  // ← actualizamos directamente la variable global

    const message = document.createElement("div");
    message.classList.add("found-message");
    message.textContent = `¡HAS COMPLETADO EL ROMPECABEZAS! TU PUNTAJE ES DE: ${score}`;
    document.body.appendChild(message);
    document.querySelector("#puzzle").classList.add("disable-clicks");

    fadeOutAudio(audio, 6000);

    setTimeout(() => {
        endGame();  // ← no se cambia
        window.location.href = "out.html";
    }, 7000);
}


function showTimeUpMessage() {
    score = Math.max(0, score - (timeLimit - time));  // ← solo tiempo restante, sin base

    const message = document.createElement("div");
    message.classList.add("found-message");
    message.textContent = `¡TIEMPO AGOTADO! NO HAS COMPLETADO EL ROMPECABEZAS A TIEMPO.`;
    document.body.appendChild(message);
    document.querySelector("#puzzle").classList.add("disable-clicks");

    fadeOutAudio(audio, 6000);

    setTimeout(() => {
        endGame();
        window.location.href = "out.html";
    }, 7000);
}


function endGame() {
    const currentDate = new Date().toLocaleDateString();
    const userData = {
        fecha: currentDate,
        usuario: localStorage.getItem("ActualUs"),
        puntaje: score,
        juegonumero: incrementGameNumber(),
        game: "AEI_rpcab02", // ← este es tu nuevo código
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



    function fadeOutAudio(audio, duration) {
        const fadeOutInterval = 50;
        const fadeOutSteps = duration / fadeOutInterval;
        const fadeOutStepValue = audio.volume / fadeOutSteps;

        const fadeOut = setInterval(() => {
            if (audio.volume > 0) {
                audio.volume = Math.max(0, audio.volume - fadeOutStepValue);
            } else {
                clearInterval(fadeOut);
            }
        }, fadeOutInterval);
    }

    window.addEventListener("load", () => {
        const actualUsername = localStorage.getItem("ActualUs");
        const usernameElement = document.getElementById("actualUsername");
        if (usernameElement) {
            usernameElement.textContent = `Usuario: ${actualUsername}`;
        } else {
            console.error("Error: Username element not found.");
        }
    });
});
