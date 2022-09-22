import Enemy from "./Entities/Enemy.js";
import { getPlayer } from "./Entities/Player.js";
import Slime from "./Entities/Slime.js";
import Debugger from "./utils/Debugger.js";
import SeedGenerator from "./SeedGenerator.js";

const debug = Debugger.debug;

export default class ProgressionManager {

    constructor(seedGen, mapa) {
        this.seedGen = seedGen;
        this.mapa = mapa;
        this.inimigoBase = this.criarInimigoBase();
    }

    posicionarInimigos(params, level, rooms) {
        // Debugger.setDebugMode(true);
        debug('============= Posicionar inimigos Teste =============');
        let indexRoomPlayer = level.ondeEstaOPlayer();
        let roomAtual = rooms[indexRoomPlayer];
        let roomInicial = roomAtual;
        let poderJogador = getPlayer().poderTotal;
        let poderSala = poderJogador * 0.25; // Precisa ser proporcional ao tamanho
        let celulasDisponiveis = [];
        let poderAtual = poderSala;
        poderAtual = 0;
        debug("Poder jogador: ", poderJogador);
        
        do {
            debug('====== Room ' + roomAtual.number + ' ======');
            // this.distribuirPoder(null, 500);
            debug("Poder Sala: ", poderSala);
            let numeroInimigos = this.getNumeroInimigosNaSala(roomAtual, level);
            debug("Número inimigos: ", numeroInimigos);
            do {
                celulasDisponiveis = this.getCelulasDisponiveis(roomAtual, params);
                if (celulasDisponiveis.length > 0) {
                    let celula = celulasDisponiveis[this.getRandomInt(0, celulasDisponiveis.length - 1)];
                    const inimigo = this.criarInimigo(celula, roomAtual, level);
                    // this.distribuirPoder(inimigo, poderSala);
                    this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distInimigos');     // Recalcula
                }
            } while (--numeroInimigos > 0 && celulasDisponiveis.length > 0);

            poderAtual = this.distribuirPoderTeste(roomAtual, poderAtual);

            roomAtual = rooms[roomAtual.teleporterFinal.proximoTeleporte.roomNumber - 1];
            // poderSala = poderSala * 1.25;
            // poderAtual = poderSala;
        } while (roomAtual.number != roomInicial.number);
        debug("Poder jogador: ", poderJogador);
    }

    calcularPoderSala(room) {
        let inimigos = room.enemies;
        let poderTotalSala = inimigos.recude((soma, inimigo) => soma + inimigo.poderTotal);
        return poderTotalSala;
    }

    getRandomInt(min, max) {
        return this.seedGen.nextRandInt(min, max);
    }

    getRandomFloat(min, max) {
        return this.seedGen.nextRandFloat(min, max);
    }

    getNumeroInimigosNaSala(room, level) {
        // let maximoPorTamanho = Math.round(room.blocks.length / level.tamanhoSalasMinimo);
        // let maximoPorPoder = Math.round(poderTotalSala / this.inimigoBase.poderTotal);
        // let numeroMaximoInimigos = Math.min(maximoPorPoder, maximoPorTamanho);
        // console.log('Maximo inimigos: ', numeroMaximoInimigos);
        // let numeroInimigos = this.getRandomInt(1, numeroMaximoInimigos);
        let numeroInimigos = Math.round(room.blocks.length / level.tamanhoSalasMinimo);
        return numeroInimigos;
    }

    
    criarInimigoBase() {
        const inimigo = new Enemy(1);
        return inimigo;
    }

    criarInimigo(celula, room, level) {
        const inimigo = new Slime(1);
        if (room.number == 13) {
            debug('Aquiiii');
            debug(inimigo);
        }
        inimigo.room = room;
        inimigo.gx = celula.coluna;
        inimigo.gy = celula.linha;
        inimigo.x = celula.coluna * level.mapa.s + level.mapa.s / 2;
        inimigo.y = celula.linha * level.mapa.s + level.mapa.s / 2;
        inimigo.map = level.mapa;
        room.enemies.push(inimigo);
        return inimigo;
    }

    distribuirPoder(inimigo, poder) {
        let velocidade = this.getRandomInt(1, poder);
        while ((velocidade / 2) + inimigo.atributos.velocidade > inimigo.atributos.velocidadeMaxima) {
            velocidade = this.getRandomInt(1, poder);
        }
        poder -= velocidade;

        let ataque = this.getRandomInt(1, poder);
        poder -= ataque;

        let hp = poder;

        inimigo.atributos.ataque += ataque;
        inimigo.atributos.velocidade += velocidade / 2;
        inimigo.atributos.hpMax += hp / 2;
        inimigo.hpAtual = inimigo.atributos.hpMax;
        inimigo.calcularPoderTotal();
    }

    distribuirPoderTeste(room, poderInicial) {
        const inimigos = room.enemies.sort((a, b) => {
            const celulaA = this.mapa.getCell(a.gy, a.gx);
            const celulaB = this.mapa.getCell(b.gy, b.gx);
            return celulaB.distInundacaoSaida - celulaA.distInundacaoSaida;
        });
        inimigos.forEach(inimigo => {
            let poder = poderInicial;
            // inimigo.distribuirPoder(poder);
            let velocidade = this.getRandomInt(1, poder);
            while ((velocidade / 2) + inimigo.atributos.velocidade > inimigo.atributos.velocidadeMaxima) {
                velocidade = this.getRandomInt(1, poder);
            }
            poder -= velocidade;
            
            let ataque = this.getRandomInt(1, poder);
            if (room.number == 13) {
                debug(ataque)
            }
            poder -= ataque;
            
            let hp = poder;
            
            inimigo.atributos.ataque += ataque;
            inimigo.atributos.velocidade += velocidade / 2;
            inimigo.atributos.hpMax += hp / 2;
            inimigo.hpAtual = inimigo.atributos.hpMax;
            inimigo.calcularPoderTotal();
            poderInicial = poderInicial * 1.05;
        });
        return poderInicial;
    }
    
    getCelulasDisponiveis(room, params) {
        let distMaxTeleporte = room.getMaxDist(0);
        let maxDistInimigos = room.getMaxDist(2);
        let listaCelulas = [...room.blocks.filter((b) => ((b.distTeleportes >= 5) && (b.distFirezones > 0) && b.distInimigos > 5))];
        // let listaCelulas = [...room.blocks.filter((b) => ((b.distTeleportes >= 5) && (b.distFirezones > 0)))];
        let minimalValueComposto = (params.porcentagemDistanciaComp) / 100; // Menor elemento no intervalo para o DistInimigos
        let listaCelulasFinal = [];
        let listaCelulasFinalErrado = [];
        let auxDistanciaNormalizadaLista = [];
        for (let i = 0; i < listaCelulas.length; i++) {       // preenche a lista de celulas disponiveis --- Dist Inimigos
            // if (listaCelulas[i].distInimigos <= 5) { // Evita inimigos muito próximos
            //     continue;
            // }
            let auxDistanciaNormalizada = listaCelulas[i].distInimigoTeleporte(maxDistInimigos, distMaxTeleporte);
            if (minimalValueComposto <= auxDistanciaNormalizada) {
                listaCelulasFinal.push(listaCelulas[i]);
            } else {
                listaCelulasFinalErrado.push(listaCelulas[i]);
                auxDistanciaNormalizadaLista.push(auxDistanciaNormalizada)
            }
        }
        // if (room.number == 1 && listaCelulasFinal.length == 0) {
        //     debug("getCelulasDisponiveis");
        //     debug("maxDistInimigos ", maxDistInimigos);
        //     debug("distMaxTeleporte", distMaxTeleporte);
        //     debug("minimalValueComposto", minimalValueComposto);
        //     debug(listaCelulas);
        //     debug(listaCelulasFinalErrado);
        //     debug(auxDistanciaNormalizadaLista);
        // }
        return listaCelulasFinal;
    }
}