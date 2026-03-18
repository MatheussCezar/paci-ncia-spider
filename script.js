import { jogo } from './jogo.js'

let start = false;
let venceu = false;

const botaoStart = document.getElementById("start");
const botaoEnd = document.getElementById("end");
botaoStart.addEventListener("click", () => {
    if (!start) {
        start = true;
        jogo();
    }
});

const gameOver = document.querySelector(".game-over");
//const gameOverAudio = document.getElementById("game-over-audio");

botaoEnd.addEventListener("click", () => {

    if (start) {
        if (!venceu) {
            gameOver.classList.add("show");

            //gameOverAudio.currentTime = 0;
            //gameOverAudio.play();

            setTimeout(() => {
                location.reload();
            }, 3000);
        } else {
            location.reload();
        }


    };
});



