import { getPlayer } from "./Entities/Player.js";
import Slime from "./Entities/Slime.js";

const RATE = 1.07;

export default class ProgressionManager {
    constructor(seedGen, mapa) {
        this.seedGen = seedGen;
        this.mapa = mapa;
        this.poderBase = Slime.getPoderBase();
        this.contadorInimigos = 0;
    }

    posicionarInimigos(params, level, rooms) {
        console.log('===== Posicionar inimigos =====');
        let indexRoomPlayer = level.ondeEstaOPlayer();
        let roomAtual = rooms[indexRoomPlayer];
        let roomInicial = roomAtual;
        let poderJogador = getPlayer().poderTotal;
        let celulasDisponiveis = [];
        let poderAtual = Slime.getPoderBase();
        console.log("Poder jogador: ", poderJogador);
        do {
            let numeroInimigos = this.getNumeroInimigosNaSala(roomAtual, level);
            do {
                celulasDisponiveis = this.getCelulasDisponiveis(roomAtual, params);
                if (celulasDisponiveis.length > 0) {
                    let celula = celulasDisponiveis[this.getRandomInt(0, celulasDisponiveis.length - 1)];
                    const inimigo = this.criarInimigo(celula, roomAtual, level);
                    this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distInimigos');     // Recalcula distância de inimigos
                    roomAtual.maxCamadaDistancias(); // Recalcula maior poder da sala
                }
            } while (--numeroInimigos > 0 && celulasDisponiveis.length > 0);

            poderAtual = this.distribuirPoderEntreInimigos(roomAtual, poderAtual);
            this.calculaMapaDePoderSala(roomAtual);

            roomAtual = rooms[roomAtual.teleporterFinal.proximoTeleporte.roomNumber - 1];
        } while (roomAtual.number != roomInicial.number);
    }

    getRandomInt(min, max) {
        return this.seedGen.nextRandInt(min, max);
    }

    getRandomFloat(min, max) {
        return this.seedGen.nextRandFloat(min, max);
    }

    getNumeroInimigosNaSala(room, level) {
        let numeroInimigos = Math.round(room.blocks.length / level.tamanhoSalasMinimo);
        return numeroInimigos;
    }
    
    criarInimigo(celula, room, level) {
        const inimigo = new Slime(1);
        inimigo.room = room;
        inimigo.gx = celula.coluna;
        inimigo.gy = celula.linha;
        inimigo.x = celula.coluna * level.mapa.s + level.mapa.s / 2;
        inimigo.y = celula.linha * level.mapa.s + level.mapa.s / 2;
        inimigo.map = level.mapa;
        room.enemies.push(inimigo);
        return inimigo;
    }

    distribuirPoderEntreInimigos(room, poder) {
        const inimigosOrdenados = room.enemies.sort((a, b) => {
            const celulaA = this.mapa.getCell(a.gy, a.gx);
            const celulaB = this.mapa.getCell(b.gy, b.gx);
            return celulaB.distInundacaoSaida - celulaA.distInundacaoSaida;
        });
        inimigosOrdenados.forEach(inimigo => {
            poder = ProgressionManager.aplicarFuncaoDeProgressao(this.contadorInimigos, this.poderBase, 'cookie');
            this.contadorInimigos++;
            const poderAcimaDoBase = poder - this.poderBase;
            inimigo.distribuirPoder(poderAcimaDoBase, this.seedGen);
            inimigo.hpAtual = inimigo.atributos.hpMax;
            inimigo.poderTotal = ProgressionManager.calcularPoderTotal(inimigo.atributos, inimigo.taxasCrescimento);
            inimigo.calcularNivel(poder);
        });
        return poder;
    }

    static aplicarFuncaoDeProgressao(valorAtual, valorBase, funcao, multiplicador = RATE) {
        switch (funcao) {
            case 'cookie':
                return (valorBase * Math.pow(multiplicador, valorAtual));
            case 'incremental':
                return Math.round(valorBase * ((1 - Math.pow(RATE, valorAtual)) / (1 - multiplicador)));
            default:
                return valorAtual * 1.05;
        }
    }
    
    getCelulasDisponiveis(room, params) {
        let distMaxTeleporte = room.getMaxDist(0);
        let maxDistInimigos = room.getMaxDist(2);
        let maxPoder = room.getValorMaxMapaInfluencia("influenciaPoder");
        let listaCelulas = [
            ...room.blocks.filter(
                (b) =>
                    b.distTeleportes >= 5 &&
                    b.distFirezones > 0 &&
                    b.distInimigos > 5
            ),
        ];
        let minimalValueComposto = params.porcentagemDistanciaComp / 100;
        let listaCelulasFinal = [];
        for (let i = 0; i < listaCelulas.length; i++) {
            let auxDistanciaNormalizada = listaCelulas[i].mediaInimigo_Teleporte_Poder(
                maxDistInimigos,
                distMaxTeleporte,
                maxPoder
            );
            if (minimalValueComposto <= auxDistanciaNormalizada) {
                listaCelulasFinal.push(listaCelulas[i]);
            }
        }
        return listaCelulasFinal;
    }

    posicionarUmInimigo(params, level, roomAtual) {
        console.log(roomAtual);
        console.log('==== Posicionar inimigos Um Por Um ====');
        let celulasDisponiveis = [];
        let poderAtual = Slime.getPoderBase();
        let numeroInimigosMaximo = this.getNumeroInimigosNaSala(roomAtual, level);
        let numeroInimigosAtual = roomAtual.enemies.length;
        console.log("Número inimigos máximo: " + numeroInimigosMaximo);
        console.log("Número inimigos: " + numeroInimigosAtual);
        celulasDisponiveis = this.getCelulasDisponiveis(roomAtual, params);
        if (numeroInimigosAtual < numeroInimigosMaximo && celulasDisponiveis.length > 0) {
            if (celulasDisponiveis.length > 0) {
                let celula = celulasDisponiveis[this.getRandomInt(0, celulasDisponiveis.length - 1)];
                const inimigo = this.criarInimigo(celula, roomAtual, level);
                this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distInimigos');     // Recalcula
                roomAtual.maxCamadaDistancias();
            }
        }
        poderAtual = this.distribuirPoderEntreInimigos(roomAtual, poderAtual);
        this.calculaMapaDePoderSala(roomAtual);
    }

    calculaMapaDePoderSala(room) {
        if (room == null) {
            return;
        }
        const inimigos = room.enemies;
        inimigos.forEach((inimigo, index) => {
            const celula = room.blocks.find(block => {
                return (block.linha == inimigo.gy && block.coluna == inimigo.gx);
            });
            if (celula) {
                let poderInimigo = inimigo.poderTotal;
                const avaliar = [{ celula: celula, poder: poderInimigo}];
                let aux;
                while (aux = avaliar.shift()) {
                    if (aux.poder <= 0 || aux.celula.idObjetoInundacao == index) {
                        continue;
                    }
                    aux.celula.influenciaPoder += aux.poder;
                    aux.celula.idObjetoInundacao = index;
                    for (let i = 0; i < aux.celula.vizinhos.length; i++) {
                        avaliar.push({
                            celula: room.blocks[aux.celula.vizinhos[i]],
                            poder: Math.floor(aux.poder - (poderInimigo * 0.2))
                        });
                    }
                }
            }
        });
        room.maxCamadaDistancias();
    }

    static calcularPoderTotal(atributos, taxaCrescimento) {
        let somaPoder = 0;
        Object.keys(atributos).forEach((key) => {
            let somaAtributo = 0;
            for (let i = 1; i <= atributos[key]; i++) {
                let custoAtributo = ProgressionManager.aplicarFuncaoDeProgressao(i, 1, "cookie", taxaCrescimento[key]);
                somaAtributo += custoAtributo;
            }
            somaPoder += somaAtributo;
        });
        return somaPoder << 0;
    }

    inundarPoder() {

    }
}