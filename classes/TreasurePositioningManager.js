import PositioningManager from "./PositioningManager.js";
import ProgressionManager from "./ProgressionManager.js";
import TipoDeMediaEntreAtributos, { TIPOS_DE_MEDIA } from "./TipoDeMediaEntreAtributos.js";
import Treasure from "./Treasure.js";

let a = false;
export default class TreasurePositioningManager extends PositioningManager{
    constructor(seedGen, mapa) {
        super(seedGen, mapa);
        this.contadorTesouros = 0;
        this.distanciaTeleporte = 5;
        this.distanciaFirezone = 1;
        this.distanciaInimigos = 1;
        this.distanciaTesouros = 4;
        this.distCaminhoEntradaSaida = 1;
        this.porcentagemDistanciaComp = 0.5;
    }

    posicionar(level) {
        const rooms = level.rooms;
        let roomAtual = level.getPlayerRoom();
        const roomInicial = roomAtual;
        console.log('POSITIONAMENTO DE TESOURO');
        do {
            let numeroTesouros = this.getNumeroTesourosNaSala(roomAtual, level);
            do {
                let celula = this.getCelulaParaPosicionarTesouro(roomAtual);
                if (celula) {
                    const tesouro = this.criarTesouro(celula, roomAtual, level);
                    this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distTesouros');
                    roomAtual.atualizaMetricas(['distTesouros', 'influenciaPoderTesouro'])
                }
                ProgressionManager.calculaMapaDePoderTesouroSala(roomAtual);
            } while (--numeroTesouros > 0);

            let poderAtual = ProgressionManager.distribuirPoderEntreTesouros(
                roomAtual,
                this.mapa,
                100,
                // this.poderBase,
                this.seedGen
            );
            ProgressionManager.calculaMapaDePoderTesouroSala(roomAtual);

            roomAtual = rooms[roomAtual.teleporterFinal.proximoTeleporte.roomNumber - 1];
        } while (roomAtual.number != roomInicial.number);
    }

    getNumeroTesourosNaSala(room, level) {
        // let numeroTesouros = Math.round(room.blocks.length / level.tamanhoSalasMinimo);
        let numeroTesouros = Math.round(room.blocks.length / 50);
        return numeroTesouros;
    }

    /**
     * Aplica critérios para filtrar células de acordo com os critérios
     * de distância de poder
     */
    getCelulasElegiveis(room) {
        let listaCelulas = [
            ...room.blocks.filter((b) => {
                if (
                    b.metricas.distInimigos >= this.distanciaInimigos &&
                    b.metricas.distTeleportes >= this.distanciaTeleporte &&
                    b.metricas.distFirezones >= this.distanciaFirezone &&
                    b.metricas.distCaminhoEntradaSaida >= this.distCaminhoEntradaSaida &&
                    b.metricas.distTesouros >= this.distanciaTesouros
                ) {
                    // let auxMediaNormalizada = b.fazerMediaPonderadaTeste(
                    let auxMediaNormalizada = b.fazerSomaTeste(
                        TIPOS_DE_MEDIA.posicionamentoTesouroLongeCaminhoEntradaSaida,
                        room
                    );
                    b.metricas.compostas.mediaTesouroFirezoneTeleporteEntradaSaida = auxMediaNormalizada;
                    return auxMediaNormalizada >= this.porcentagemDistanciaComp;
                }
                return false;
            }),
        ];
        return listaCelulas;
    }

    /**
     * Método para sortear de forma ponderada
     * Nesse caso, quanto maior é o valor da média
     * mediaInimigoTesouroTeleportePoder, maior a probabilidade de ser sorteado
     * https://stackoverflow.com/a/55671924
     */
    getCelulaParaPosicionarTesouro(room) {
        let celulasElegiveis = this.getCelulasElegiveis(room);
        let pesos = [
            ...celulasElegiveis.map(
                (c) => c.metricas.compostas.mediaTesouroFirezoneTeleporteEntradaSaida
            ),
        ];
        let i;
        for (i = 0; i < pesos.length; i++) {
            pesos[i] += pesos[i - 1] || 0;
        }
        var random = this.getRandomFloat(0, 1) * pesos[pesos.length - 1];
        for (i = 0; i < pesos.length; i++) if (pesos[i] > random) break;
        return celulasElegiveis[i];
    }

    criarTesouro(celula, room, level) {
        const tesouro = new Treasure();
        tesouro.room = room;
        tesouro.gx = celula.coluna;
        tesouro.gy = celula.linha;
        tesouro.x = celula.coluna * level.mapa.s + level.mapa.s / 2;
        tesouro.y = celula.linha * level.mapa.s + level.mapa.s / 2;
        tesouro.map = level.mapa;
        room.treasures.push(tesouro);
        return tesouro;
    }

    marcarCelulasDisponiveisParaTesouros(room) {
        let celulasElegiveis = this.getCelulasElegiveis(room);
        room.blocks.forEach(block => {
            block.podePosicionarTesouro = false;
        });
        celulasElegiveis.forEach(celula => {
            celula.podePosicionarTesouro = true;
        });
    }

    posicionarUmTesouro(level) {
        const roomAtual = level.getPlayerRoom();
        console.log(roomAtual);
        console.log('==== Posicionar tesouros Um Por Um ====');
        let numeroTesourosMaximo = this.getNumeroTesourosNaSala(roomAtual, level);
        let numeroTesourosAtual = roomAtual.treasures.length;
        console.log("Número tesouros máximo: " + numeroTesourosMaximo);
        console.log("Número tesouros: " + numeroTesourosAtual);
        if (numeroTesourosAtual < numeroTesourosMaximo) {
            let celula = this.getCelulaParaPosicionarTesouro(roomAtual);
            if (celula) {
                console.log('Célula selecionada ', celula);
                console.log('Peso dela: ', celula.metricas.compostas.mediaTesouroFirezoneTeleporteEntradaSaida);
                const tesouro = this.criarTesouro(celula, roomAtual, level);
                this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distTesouros');     // Recalcula
                roomAtual.maxCamadaDistancias();
                console.log('posicionou tesouro');
                ProgressionManager.calculaMapaDePoderTesouroSala(roomAtual);
            }
        }
        this.marcarCelulasDisponiveisParaTesouros(roomAtual);
    }

    posicionarTesouroEmPosicaoEspecifica(celula, level) {
        const roomAtual = level.getPlayerRoom();
        const tesouro = this.criarTesouro(celula, roomAtual, level);
        this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distTesouros');     // Recalcula
        roomAtual.maxCamadaDistancias();
        console.log('posicionou tesouro');
        ProgressionManager.calculaMapaDePoderTesouroSala(roomAtual);
        this.marcarCelulasDisponiveisParaTesouros(roomAtual);
    }


}