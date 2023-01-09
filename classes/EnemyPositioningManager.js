import Slime from "./Entities/Slime.js";
import PositioningManager from "./PositioningManager.js";
import ProgressionManager from "./ProgressionManager.js";
import { TIPOS_DE_MEDIA } from "./TipoDeMediaEntreAtributos.js";

export default class EnemyPositioningManager extends PositioningManager{
    constructor(seedGen, mapa) {
        super(seedGen, mapa);
        this.poderBase = Slime.getPoderBase();
        this.contadorInimigos = 0;
        this.distanciaInimigos = 1;
        this.distanciaTeleporte = 5;
        this.distanciaFirezone = 1;
        this.distanciaTesrousos = 1;
        this.porcentagemDistanciaComp = 0.5;
    }

    posicionar(level) {
        const rooms = level.rooms;
        let roomAtual = level.getPlayerRoom();
        let roomInicial = roomAtual;
        do {
            let numeroInimigos = this.getNumeroInimigosNaSala(roomAtual, level);
            do {
                let celula = this.getCelulaParaPosicionarInimigo(roomAtual);
                if (celula) {
                    const inimigo = this.criarInimigo(celula, roomAtual, level);
                    this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distInimigos');
                    roomAtual.atualizaMetricas(['distInimigos', 'influenciaPoder']);
                    ProgressionManager.calculaMapaDePoderSala(roomAtual);
                } 
            } while (--numeroInimigos > 0);

            let poderAtual = ProgressionManager.distribuirPoderEntreInimigos(
                roomAtual,
                this.mapa,
                this.poderBase,
                this.seedGen
            );
            ProgressionManager.calculaMapaDePoderSala(roomAtual);

            roomAtual = rooms[roomAtual.teleporterFinal.proximoTeleporte.roomNumber - 1];
        } while (roomAtual.number != roomInicial.number);
    }

    getNumeroInimigosNaSala(room, level) {
        let numeroInimigos = Math.round(room.blocks.length / level.tamanhoSalasMinimo);
        return numeroInimigos;
    }

    /**
     * Aplica critérios para filtrar células de acordo com os critérios
     * de distância de poder
     */
    getCelulasElegiveis(room) {
        if (room.number === 12) {
            // console.log('Outro inimigo');
        }
        let listaCelulas = [
            ...room.blocks.filter((b) => {
                if (
                    b.metricas.distTeleportes >= this.distanciaTeleporte &&
                    b.metricas.distFirezones >= this.distanciaFirezone &&
                    b.metricas.distTesouros >= this.distanciaTesrousos &&
                    b.metricas.distInimigos >= this.distanciaInimigos
                ) {
                    let auxMediaNormalizada =
                        // b.fazerMediaPonderadaTeste(
                        b.fazerSomaTeste(
							TIPOS_DE_MEDIA.posicionamentoInimigoPertoDeTesouro,
							room
                        );
                    if (room.number === 12) {
                        // console.log('OUTR ACELULA');
                        let tipoDeMedia = TIPOS_DE_MEDIA.posicionamentoInimigoPertoDeTesouro;
                        for (let i = 0; i < Object.values(tipoDeMedia).length; i++) {
                            let nomeAtributo = Object.keys(tipoDeMedia)[i];
                            let peso = tipoDeMedia[nomeAtributo];
                            let valorMaximoNaRoom = room.metricas[nomeAtributo];
                            let valorDaCelula = b.metricas[nomeAtributo];
                            // console.log('nomeAtributo', nomeAtributo);
                            // console.log('peso', peso);
                            // console.log('valorMaximoNaRoom', valorMaximoNaRoom);
                            // console.log('valorDaCelula', valorDaCelula);
                        }
                        // console.log(auxMediaNormalizada);
                    }
                    b.metricas.compostas.mediaPosicionamentoInimigo = auxMediaNormalizada;
                    return auxMediaNormalizada >= 0;
                    // return auxMediaNormalizada >= this.porcentagemDistanciaComp;
                }
                return false;
            }),
        ];
        return listaCelulas;
    }

    /**
     * Método para sortear de forma ponderada
     * Nesse caso, quanto maior é o valor da média
     * mediaInimigoTeleportePoder, maior a probabilidade de ser sorteado
     * https://stackoverflow.com/a/55671924
     */
    getCelulaParaPosicionarInimigo(room) {
        let celulasElegiveis = this.getCelulasElegiveis(room);
        let pesos = [
        ...celulasElegiveis.map(
            (c) => c.metricas.compostas.mediaPosicionamentoInimigo
            ),
        ];
        let i;
        for (i = 0; i < pesos.length; i++){
            pesos[i] += pesos[i - 1] || 0;
        }
        var random = this.getRandomFloat(0, 1) * pesos[pesos.length - 1];
        for (i = 0; i < pesos.length; i++)
            if (pesos[i] > random)
                break;
        return celulasElegiveis[i];
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

    marcarCelulasDisponiveisParaInimigos(room) {
        let celulasElegiveis = this.getCelulasElegiveis(room);
        room.blocks.forEach(block => {
            block.podePosicionarInimigo = false;
        });
        celulasElegiveis.forEach(celula => {
            celula.podePosicionarInimigo = true;
        });
    }

    posicionarUmInimigo(level, roomAtual) {
        console.log(roomAtual);
        console.log('==== Posicionar inimigos Um Por Um ====');
        let numeroInimigosMaximo = this.getNumeroInimigosNaSala(roomAtual, level);
        let numeroInimigosAtual = roomAtual.enemies.length;
        console.log("Número inimigos máximo: " + numeroInimigosMaximo);
        console.log("Número inimigos: " + numeroInimigosAtual);
        if (numeroInimigosAtual < numeroInimigosMaximo) {
            let celula = this.getCelulaParaPosicionarInimigo(roomAtual);
            if (celula) {
                console.log('Célula selecionada com peso ', celula.linha, celula.coluna, celula.metricas.compostas.mediaPosicionamentoInimigo);
                const inimigo = this.criarInimigo(celula, roomAtual, level);
                this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distInimigos');     // Recalcula
                roomAtual.atualizaMetricas(['distInimigos', 'influenciaPoder']);
                console.log('posicionou inimigo');
                if (numeroInimigosAtual + 1 === numeroInimigosMaximo) {
                    ProgressionManager.distribuirPoderEntreInimigos(roomAtual,
                        this.mapa,
                        this.poderBase,
                        this.seedGen);
                }
                ProgressionManager.calculaMapaDePoderSala(roomAtual);
            }
        }
        this.marcarCelulasDisponiveisParaInimigos(roomAtual);
    }

}