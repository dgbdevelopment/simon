// Objetos
const tiles = document.querySelectorAll(".simon__tile");
const audios = document.querySelectorAll("audio");
const btnStart = document.querySelector(".btn-start");
const message = document.querySelector(".main-message");
const score = document.querySelector(".score");
const record = document.querySelector(".record");

//Variables
let cpuSequence = [];
let playerSequence = [];
let playerTurn = false;
let gameInProgress = false;
let currentScore = 0;
let currentRecord = localStorage.getItem("record") || 0;

const messages = [
  "muy bien",
  "genial",
  "sigue así",
  "eres un fenómeno",
  "vaya crack",
  "increible",
  "magnífico",
  "maravilloso",
  "para flipar",
  "vaya memoria",
];
//Audios
const startAudio = new Audio((src = "assets/sound/start.wav"));
startAudio.preload = "auto";
const endAudio = new Audio((src = "assets/sound/end.wav"));
endAudio.preload = "auto";

//Cargamos record
record.textContent = `record: ${currentRecord}`;

//Botón para empezar partida
btnStart.addEventListener("click", function () {
  if (gameInProgress == true) return;
  this.classList.add("actived");
  cpuSequence = [];
  message.textContent = "";
  currentScore = 0;
  score.textContent = `puntos: ${currentScore}`;
  startAudio.play();
  gameInProgress = true;
  start();
});

//Ponemos las casillas a la escucha y programamos verificaciones
tiles.forEach((tile, index) => {
  tile.addEventListener("click", () => {
    if (!playerTurn) return;
    playerSequence.push(index);
    tile.classList.add("active");
    score.textContent = `puntos: ${++currentScore}`;
    if (currentScore > currentRecord) {
      currentRecord = currentScore;
      record.textContent = `record: ${currentRecord}`;
    }
    audios[index].currentTime = 0;
    audios[index].play();
    playerSequence.forEach((seq, index) => {
      if (seq != cpuSequence[index]) {
        playerTurn = false;
        btnStart.classList.remove("actived");

        message.textContent = "Ohh... has perdido";
        if (currentScore == currentRecord) {
          record.textContent = `record: ${--currentRecord}`;
          localStorage.setItem("record", currentRecord);
        }
        score.textContent = `puntos: ${--currentScore}`;
        gameInProgress = false;
        endAudio.play();
      } else if (index == cpuSequence.length - 1) {
        playerTurn = false;
        let random = Math.floor(Math.random() * messages.length);
        message.textContent = messages[random];
        setTimeout(() => {
          start();
        }, 500);
      }
    });
    setTimeout(() => {
      tile.classList.remove("active");
    }, 300);
  });
});

function start() {
  const random = Math.floor(Math.random() * 4);
  cpuSequence.push(random);
  playerSequence = [];
  document.querySelector(".message-start").classList.add("animated");
  setTimeout(() => {
    document.querySelector(".message-start").classList.remove("animated");
    message.textContent = "";
    playSequence();
  }, 3000);
}

async function playSequence() {
  playerTurn = false;
  for (const seq of cpuSequence) {
    await playNote(seq);
  }
  playerTurn = true;
}

function playNote(i) {
  return new Promise((resolve, reject) => {
    audios[i].parentElement.classList.add("active");
    audios[i].currentTime = 0;
    audios[i].play();
    setTimeout(() => {
      audios[i].parentElement.classList.remove("active");
    }, 400);
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}
