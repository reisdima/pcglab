import CellularAutomata from '../CellularAutomata.js';
import { getDebugMode, setDebugMode } from '../DebugMode.js';
import Hud, { setHud } from '../Hud.js';
import Level from '../Level.js';
import { setMapArea } from '../MAPA_AREA.js';
import Player, { getPlayer, setPlayer } from '../Entities/Player.js';
import SeedGenerator from '../SeedGenerator.js';
import Sprite from '../Sprite.js';
import { converteTelaCheia, escreveTexto } from '../Utils.js';
import Cena, { fontMainMenu, wordsColor, alignMainMenu } from './Cena.js';
let stateMainMenu = 0;
export default class CenaJogo extends Cena {

    desenhar() {
        this.limparTela();
        /*if(audioLibrary.isPlaying("BGM")==false){
          audioLibrary.play("BGM");
        }*/
        this.controleTempo();
        this.ctx.save();
        this.ctx.scale(this.game.escala, this.game.escala);
        this.ctx.translate(-getPlayer().x + this.canvas.width / 4, - getPlayer().y + this.canvas.height / 4);
        // this.ctx.translate(-getPlayer().x, - getPlayer().y);
        this.levelAtual.desenhar(this.ctx);
        this.ctx.restore();
        this.desenharHUD(this.ctx);
        if (!getPlayer().vivo) {
            this.estado = 5;
        }


    }

    quadro(t) {
        super.quadro(t);
        this.capturarInput();
        this.levelAtual.passo(this.dt);
    }

    preparar() {
        this.debugModeBegin = 0;
        this.debugModeEnd = 18;
        const hud = new Hud();
        setHud(hud);
        this.hud = hud;
        this.hud.init(this.canvas);

        this.seedGen = this.getSeedGenerator();

        const player = new Player({
            s: 27, w: 27, h: 11,
            hitBox: {
                x: 0,
                y: 0,
                w: 27,
                h: 11,
                wDefault: 27,
                hDefault: 11
            }
        });
        player.cena = this;
        setPlayer(player);


        this.levelAtual = new Level(
            this.game.widthMap,
            this.game.heightMap,
            this.game.sizeMap,
            { hud: this.hud, seedGen: this.seedGen, assetsMng: this.assetsMng }
        );
        this.levels = [];
        this.levels.push(new Level(this.game.widthMap,
            this.game.heightMap,
            this.game.sizeMap,
            { hud: this.hud, seedGen: this.seedGen, assetsMng: this.assetsMng }
        ));

        const geraFase = new CellularAutomata({
            HS: this.game.heightMap, WS: this.game.widthMap, MOORE: 1, r: 0.5,
            totalRock: 4, floorIndex: 0, rockIndex: 2, wallIndex: 1, seedGen: this.seedGen
        });
        //new CellularAutomata(this.game.heightMap, this.game.widthMap, 2, 0.5, 13, 0, 5, 1);
        // 0 => floor
        // 2 => rock
        // 1 => wall
        geraFase.scenarioRandomWall();
        geraFase.fullstep(2);
        geraFase.countRooms();
        geraFase.filterRooms(25);

        this.levels[0].setMatrixMap(geraFase.map);       // Copia a matriz de tipos dentro do gerador
        this.levels[0].copiaSalas(geraFase.rooms);       // Copia os dados em que os blocos da sala são apenas as posições linha e coluna da matriz
        this.levels[0].montarLevel({
            dt: this.dt,
            geraFase: geraFase,
            player: getPlayer(),
        });
        this.levels[0].setTempo(20);                // 20 segundos

        let tempoGameOver = 2;

        this.levelAtual.clonarLevel(this.levels[0]);
        getPlayer().map = this.levelAtual.mapa;
        getPlayer().level = this.levelAtual;

        this.teasuresCollected = 0;

        this.barraTempo = {
            externa: new Sprite(),
            interna: new Sprite(),
            desenhar: function (ctx) {
                this.externa.desenharTempo(ctx);
                this.interna.desenharTempo(ctx);
            },
            init: function () {
                this.externa.w = 127;
                this.externa.h = 15;
                this.externa.colorBG = "black";
                this.externa.colorBorder = "white";
                this.externa.x = 95;
                this.externa.y = 7;
                this.interna.w = 127;
                this.interna.h = 15;
                this.interna.x = 96;
                this.interna.y = 8;
                this.interna.colorBG = "rgb(170, 120, 0)";
                this.interna.borderSize = 0;
            }
        };
        this.barraTempo.init();

        // Energia === Player
        this.barraEnergia = {
            sprite: new Sprite(),
            desenhar: function (ctx) {
                this.sprite.desenharBarraEnergiaHUD(ctx, getPlayer());
            },
            init: function () {
                this.sprite.w = 127;
                this.sprite.h = 15;
                this.sprite.colorBG = "black";
                this.sprite.colorBorder = "white";
                this.sprite.x = 95;
                this.sprite.y = 7;
            }
        };
        this.barraEnergia.init();

        // Main Menu campos
        const fontMainMenu = "30px Arial Black";
        const wordsColor = "white";
        const alignMainMenu = "center";
        let stateMainMenu = 0;

        // window.addEventListener('resize', onResize, false);         // Ouve os eventos de resize
        this.updateTamanhoElementos(this.canvas);
        this.loadLevel(0);
    }

    inciar() {
        super.iniciar();
        window.addEventListener('resize', onResize, false);         // Ouve os eventos de resize
    }


    desenharHUD() {
        this.barraTempo.desenhar(this.ctx);
        this.barraEnergia.desenhar(this.ctx);
        this.hud.bussola.desenhar(this.ctx);

        this.ctx.font = "15px Arial Black";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = alignMainMenu;
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "black";
        escreveTexto(this.ctx, this.hud.tempo.text, this.hud.tempo.x, this.hud.tempo.y);
        escreveTexto(this.ctx, this.hud.energia.text, this.hud.energia.x, this.hud.energia.y);
        escreveTexto(this.ctx, this.hud.vidas.text + getPlayer().vidas, this.hud.vidas.x, this.hud.vidas.y);
        escreveTexto(this.ctx, this.hud.tesouros.text + getPlayer().tesourosColetados, this.hud.tesouros.x, this.hud.tesouros.y);
        escreveTexto(this.ctx, this.hud.level.text + getPlayer().levelNumber, this.hud.level.x, this.hud.level.y);



        if (getDebugMode() >= 1) {
            let typeMode = this.hud.debugText[getDebugMode() - 1];

            // Desenha menu debaixo
            this.ctx.font = "13px Arial Black";
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            this.ctx.strokeStyle = "rgba(238, 255, 0, 0.5)";
            this.ctx.fillRect(
                converteTelaCheia(5, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(310, this.canvas.heightOld, this.canvas.height),
                converteTelaCheia(585, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(37, this.canvas.heightOld, this.canvas.height)
            );
            this.ctx.strokeRect(
                converteTelaCheia(5, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(310, this.canvas.heightOld, this.canvas.height),
                converteTelaCheia(585, this, canvas.widthOld, this.canvas.width),
                converteTelaCheia(37, this.canvas.heightOld, this.canvas.height)
            );

            // Escritos
            this.ctx.strokeStyle = "black";
            this.ctx.fillStyle = "yellow";
            escreveTexto(
                this.ctx, "Debug mode ativado!!!",
                converteTelaCheia(110, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(321, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, typeMode,
                converteTelaCheia(110, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(332, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, "FPS: " + ((1 / this.dt).toFixed(4)),
                converteTelaCheia(110, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(343, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, "Teleporte Inicial Level: [" + (this.levelAtual.teleporteInicioLevel.gy) +
                "][" + (this.levelAtual.teleporteInicioLevel.gx) + "]",
                converteTelaCheia(this.canvas.widthOld / 2, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(321, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, "Teleporte Final Level: [" + (this.levelAtual.teleporteFinalLevel.gy) +
                "][" + (this.levelAtual.teleporteFinalLevel.gx) + "]",
                converteTelaCheia(this.canvas.widthOld / 2, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(343, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, "Escala mapa: " + this.game.escala.toFixed(4),
                converteTelaCheia(500, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(321, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(
                this.ctx, "Grade Player: [" + (getPlayer().gy) + "][" + (getPlayer().gx) + "]",
                converteTelaCheia(500, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(332, this.canvas.heightOld, this.canvas.height)
            );
            escreveTexto(this.ctx, "Seed: " + this.seedValueURL,
                converteTelaCheia(500, this.canvas.widthOld, this.canvas.width),
                converteTelaCheia(343, this.canvas.heightOld, this.canvas.height)
            );
        }
    }

    controleTempo() {
        if (getDebugMode() == 0) {
            //if(!getPlayer().imune){
            this.barraTempo.interna.w = this.barraTempo.interna.w - this.levelAtual.taxaDiminuicaoTempo;
            this.levelAtual.updateTempo();
            if (this.barraTempo.interna.w <= 0) {
                this.barraTempo.interna.w = 0;
                // estado = 5;
                limparTela();
            }
            //}
        }
    }
    onResize(tela) {
        tela.width = window.innerWidth;
        tela.height = window.innerHeight;
        updateTamanhoElementos(this.canvas);
    }



    // Atualiza o tamanho dos elementos quando a interface é redimensionada
    updateTamanhoElementos(tela) {
        // Update barra de tempo
        this.barraTempo.externa.x = converteTelaCheia(67, tela.widthOld, tela.width);
        this.barraTempo.externa.y = converteTelaCheia(13.5, tela.heightOld, tela.height);
        this.barraTempo.interna.x = converteTelaCheia(67, tela.widthOld, tela.width);
        this.barraTempo.interna.y = converteTelaCheia(13.5, tela.heightOld, tela.height);

        // Update barra de energia do player
        this.barraEnergia.sprite.x = converteTelaCheia(225, tela.widthOld, tela.width);
        this.barraEnergia.sprite.y = converteTelaCheia(13.5, tela.heightOld, tela.height);

        // HUD
        this.hud.updateElementos(tela);
    }

    getSeedGenerator() {
        // SeedGenerator ===> Utilizado para retornar ao mesmo mapa com apenas o código da seed
        this.seedValueURL = location.search;

        if (this.seedValueURL.length != 0) {                   //SEED PASSADA NA URL
            let aux = "?seed=";
            this.seedValueURL = this.seedValueURL.substring(aux.length, this.seedValueURL.length);
            this.seedValueURL = parseInt(this.seedValueURL);
        }
        else {                                           //SEED ALEATÓRIA
            let maxValue = 5000000;
            let minValue = 500000;
            this.seedValueURL = 4248372;//(Math.floor(Math.random() * (maxValue - minValue)) + minValue);
        }
        return new SeedGenerator({ seed_1: this.seedValueURL, seed_2_string: "teste" });
    }

    loadLevel(option) {
        switch (option) {
            case 0:   //Load New Level
                if (getPlayer().levelNumber > this.levels.length) {
                    this.limparDados();
                    this.estado = 1;
                }
                else {
                    this.levelAtual.clonarLevel(this.levels[getPlayer().levelNumber - 1]);
                    this.levelAtual.posicionarPlayer(getPlayer());
                    this.levelAtual.setTaxaDiminuicaoTempo(this.dt, this.barraTempo.interna);        // Atualiza o decaimento da barra
                    getPlayer().restart();
                    this.hud.bussola.update(this.levelAtual);
                    getPlayer().vidas = 3;
                    this.estado = 0;
                }
                break;
            case 1:   //Reload
                this.levelAtual.clonarLevel(this.levels[getPlayer().levelNumber - 1]);
                this.levelAtual.posicionarPlayer(getPlayer());
                this.levelAtual.setTaxaDiminuicaoTempo(this.dt, this.barraTempo.interna);        // Atualiza o decaimento da barra
                getPlayer().restart();
                this.hud.bussola.update(this.levelAtual);
                this.estado = 0;
                break;
        }
    }

    capturarInput() {
        if (this.inputManager.foiPressionado("M")) {
            this.hud.bussola.mapMode = this.hud.bussola.mapMode + 1;
            if (this.hud.bussola.mapMode > 3) {
                this.hud.bussola.mapMode = 0;
            }
            return;
        }
        if (this.inputManager.foiPressionado("ESC")) {
            this.game.selecionarCena("menuInicial");
            this.limparDados();
            this.estado = 1;
            return;
        }

        // Debug mode
        if (this.inputManager.foiPressionado("p")) {
            console.log("Clicou no P");
            setDebugMode(getDebugMode() + 1);
            if (getDebugMode() > this.debugModeEnd) {
                setDebugMode(this.debugModeBegin);  //Padrão do jogo
                this.game.escala = 1.8;
                setMapArea(14);
            }
            return;
        }
        if (this.inputManager.foiPressionado("o")) {
            setDebugMode(getDebugMode() - 1);
            if (getDebugMode() < this.debugModeBegin) {
                setDebugMode(this.debugModeBegin);  //Padrão do jogo
                this.game.escala = 1.8;
                setMapArea(14);
            }
            return;
        }
        if (this.inputManager.foiPressionado("+")) {
            if (getDebugMode() >= 1) {
                this.game.escala = this.game.escala + 0.025;
                if (this.game.escala >= 0.85)
                    setMapArea(20);
                else {
                    if (this.game.escala > 0.3) {
                        setMapArea(100);
                    }
                    else {
                        if (this.game.escala >= 0.0) {
                            setMapArea(160);
                        }
                    }
                }
            }
            return;
        }
        if (this.inputManager.foiPressionado("-")) {
            if (getDebugMode() >= 1) {
                this.game.escala = this.game.escala - 0.025;
                if (this.game.escala >= 0.85)
                    setMapArea(20);
                else {
                    if (this.game.escala > 0.3) {
                        setMapArea(80);
                    }
                    else {
                        if (this.game.escala >= 0.0) {
                            setMapArea(160);
                        }
                    }
                }
            }
            return;
        }
    }

    limparDados() {
        this.levelAtual = new Level(this.game.widthMap,
            this.game.heightMap,
            this.game.sizeMap,
            { hud: this.hud, seedGen: this.seedGen, assetsMng: this.assetsMng }
        );
        this.levelAtual.clonarLevel(this.levels[0]);
        this.levelAtual.posicionarPlayer(getPlayer());
        this.levelAtual.setTaxaDiminuicaoTempo(this.dt, this.barraTempo.interna);        // Atualiza o decaimento da barra
        getPlayer().restart();
        this.hud.bussola.update(this.levelAtual);
    }

}