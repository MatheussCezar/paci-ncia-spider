export function jogo() {
    const cartas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    function criaBaralho(cartas) {
        let baralho = []
        for (let i = 0; i < 8; i++) {
            cartas.forEach(element => {
                baralho.push({ valor: element });
            });
        }
        return baralho;
    }

    function embaralha(baralho) {
        for (let i = baralho.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
        }
        return baralho;
    }


    const cartasColuna = {
        cartasColuna1: [],
        cartasColuna2: [],
        cartasColuna3: [],
        cartasColuna4: [],
        cartasColuna5: [],
        cartasColuna6: [],
        cartasColuna7: [],
        cartasColuna8: [],
        cartasColuna9: [],
        cartasColuna10: [],
    }

    function distribuiCartas(baralho) {
        for (let i = 1; i <= 10; i++) {
            let valoresColuna = []
            if (i <= 4) {
                for (let i = 0; i < 6; i++) {
                    valoresColuna.push(baralho[0].valor);
                    baralho.shift();
                }
            } else {
                for (let j = 0; j < 5; j++) {
                    valoresColuna.push(baralho[0].valor);
                    baralho.shift();
                }
            }
            valoresColuna.forEach(valor => {
                cartasColuna[`cartasColuna${i}`].push({ valor, virada: false, bloqueada: false })
            });
        }

        for (let x = 1; x <= 10; x++) {
            const coluna = cartasColuna[`cartasColuna${x}`];
            if (coluna.length > 0) {
                coluna[coluna.length - 1].virada = true;
            }
        }
    }


    function mostraCartas() {
        const colunas = document.querySelectorAll(".coluna");

        colunas.forEach((element, colunaIndex) => {
            const numeroColuna = colunaIndex + 1;
            element.innerHTML = "";

            element.appendChild(criaEspacoVazio(colunaIndex));

            const cartas = cartasColuna[`cartasColuna${numeroColuna}`];

            let distancia = 0;
            cartas.forEach((x, index) => {
                const carta = document.createElement("img");

                carta.src = x.virada ? `baralho/${x.valor}.png` : "baralho/verso.png";
                if (x.virada && x.bloqueada) {
                    carta.style.filter = "brightness(80%)";
                    carta.style.pointerEvents = "none";
                }
                if (!x.virada) {
                    carta.style.pointerEvents = "none";
                }
                carta.classList.add("carta");
                if (cartas.length < 15) {
                    carta.style.top = `${distancia}px`;
                    distancia += 25;
                } else {
                    carta.style.top = `${distancia}px`;
                    distancia += 17;
                }

                element.appendChild(carta);

                carta.addEventListener("click", () => {
                    selecionaCarta(numeroColuna, index);
                });
            });
        });
    }

    let pontos = 300;
    const contadorDePontos = document.getElementById("contador-pontos");

    function atualizaPontos(pontos) {
        contadorDePontos.innerHTML = `pontos: ${pontos}`;
    }

    let cartasDistribuidas = 0;

    function distribuiMaisCartas() {

        for (let i = 1; i <= 10; i++) {
            const coluna = cartasColuna[`cartasColuna${i}`];
            const carta = {
                valor: baralho[0].valor,
                virada: true
            };

            if (carta.valor === coluna[coluna.length - 1].valor - 1) {
                coluna.push(carta);
            } else {
                coluna.forEach(element => {
                    if (element.virada) {
                        element.bloqueada = true;
                    };
                });
                coluna.push(carta);
            }
            baralho.shift();
        };

        mostraCartas();
        cartasDistribuidas++

        if (cartasDistribuidas == 5) {
            let monteDeCartas = document.getElementById("baralho")
            monteDeCartas.removeEventListener("click", distribuiMaisCartas);
            monteDeCartas.innerHTML = '<img class="pilhaBaralho" src="baralho/pilha.png" alt="">'
        }

    };

    document.getElementById("baralho").addEventListener("click", distribuiMaisCartas);

    function criaEspacoVazio(colunaIndex) {
        const espaco = document.createElement("div");
        espaco.classList.add("espaco-para-carta");
        espaco.addEventListener("click", () => {
            selecionaCarta(colunaIndex + 1, null);
        });

        return espaco;
    };

    let cartaSelecionada = null;
    let colunaOrigem = null;

    function selecionaCarta(numeroColuna, index) {
        const coluna = cartasColuna[`cartasColuna${numeroColuna}`];
        let cartaObj;
        if (index !== null) {
            cartaObj = coluna[index];
        } else if (cartaSelecionada) {
            tentaMover(numeroColuna);
            return;
        }

        if (!cartaObj.virada || cartaObj.bloqueada) return;

        const grupo = coluna.slice(index);

        if (cartaSelecionada) {
            tentaMover(numeroColuna);
        } else {
            cartaSelecionada = grupo;
            colunaOrigem = numeroColuna;
            destacaGrupo(numeroColuna, index);
        }
    };

    function destacaGrupo(numeroColuna, indexInicio) {
        const coluna = document.querySelector(`#coluna-${numeroColuna}`);
        const cartasHtml = coluna.querySelectorAll(".carta");

        for (let i = indexInicio; i < cartasHtml.length; i++) {
            cartasHtml[i].style.filter = "brightness(1.3)";
            cartasHtml[i].style.transform = "translateY(-10px)";
        }
    }

    function limpaDestaque() {
        document.querySelectorAll(".carta").forEach(c => {
            c.style.filter = "brightness(1)";
            c.style.transform = "translateY(0)";
        });
    }

    function atualizaTopo(coluna) {
        if (coluna.length === 0) return;

        const ultima = coluna[coluna.length - 1];
        ultima.virada = true;
        ultima.bloqueada = false;

        for (let i = coluna.length - 1; i > 0; i--) {
            let j = i - 1;
            if (coluna[j].virada && coluna[i].valor == coluna[j].valor - 1) {
                coluna[j].bloqueada = false;
            } else {
                break;
            }
        }
    }


    function tentaMover(colunaDestino) {
        const origem = cartasColuna[`cartasColuna${colunaOrigem}`];
        const destino = cartasColuna[`cartasColuna${colunaDestino}`];

        const cartaBaseOrigem = cartaSelecionada[0];
        const cartaTopoDestino = destino[destino.length - 1];

        if (!cartaTopoDestino) {
            destino.push(...cartaSelecionada);
            origem.splice(origem.length - cartaSelecionada.length);
            pontos -= 1
            atualizaPontos(pontos);
        }
        else if (cartaTopoDestino.valor === cartaBaseOrigem.valor + 1) {
            destino.push(...cartaSelecionada);
            origem.splice(origem.length - cartaSelecionada.length);
            pontos -= 1
            atualizaPontos(pontos);
        } else {
            console.log("Movimento inválido");
        }

        atualizaTopo(origem);

        cartaSelecionada = null;
        colunaOrigem = null;
        limpaDestaque();
        verificaTorreCompleta();
        mostraCartas();
    }

    function verificaTorreCompleta() {
        for (let i = 1; i <= 10; i++) {
            const coluna = cartasColuna[`cartasColuna${i}`];
            if (coluna.length < 13) continue;

            let contador = 1;
            for (let j = coluna.length - 1; j > 0; j--) {
                const atual = coluna[j].valor;
                const anterior = coluna[j - 1].valor;

                if (anterior === atual + 1 && coluna[j].virada && coluna[j - 1].virada) {
                    contador++;
                    if (contador === 13) {
                        removeTorreCompleta(i);
                        pontos += 100;
                        atualizaPontos(pontos);
                        break;
                    }
                } else {
                    contador = 1;
                }
            }
        }
    }

    let timerID = setInterval(atualizarTimer, 1000);
    let torresCompletas = 0;
    function removeTorreCompleta(numeroColuna) {
        const coluna = cartasColuna[`cartasColuna${numeroColuna}`];
        coluna.splice(coluna.length - 13, 13);


        const monte = document.querySelectorAll(".monte")[torresCompletas];

        monte.style.background = "url(baralho/13.png)";
        monte.style.backgroundSize = "cover";
        monte.style.backgroundPosition = "center";

        torresCompletas++;
        //document.getElementById("ganha-pontos").play();

        if (torresCompletas == 8) {
            venceu = true;
            clearInterval(timerID);

            const victory = document.querySelector(".victory");
            //const victoryAudio = document.getElementById("victory-audio");

            victory.classList.add("show");
            botaoEnd.innerHTML = "Reiniciar"

            //victoryAudio.currentTime = 0;
            //victoryAudio.play();

            setTimeout(() => {
                victory.classList.remove("show");
            }, 3000)
        }

        atualizaTopo(coluna);
        mostraCartas();
    }

    let segundos = 0;

    function formatarTempo(segundosTotais) {
        const minutos = Math.floor(segundosTotais / 60);
        const seg = segundosTotais % 60;
        return `${String(minutos).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
    }

    function atualizarTimer() {
        segundos++;
        document.getElementById("timer").textContent = formatarTempo(segundos);
    }

    let baralho = criaBaralho(cartas);
    baralho = embaralha(baralho);
    distribuiCartas(baralho);

    mostraCartas();
    atualizaPontos(pontos);
};
