import { PARAMETROS_SLIME } from "./Entities/EnemiesBaseAttributes.js";
import { getPlayer } from "./Entities/Player.js";
import Slime from "./Entities/Slime.js";

const RATE = 1.06;
const PORCENTAGEM_POR_MORTE = 0.3;

export default class ProgressionManager {

    static #contadorInimigos = 0;
    static #contadorTesouros = 0;

    static distribuirPoderEntreInimigos(room, mapa, poderBase, seedGen) {
        let poder = poderBase;
        const inimigosOrdenados = room.enemies.sort((a, b) => {
            const celulaA = mapa.getCell(a.gy, a.gx);
            const celulaB = mapa.getCell(b.gy, b.gx);
            return celulaB.distInundacaoSaida - celulaA.distInundacaoSaida;
        });
        inimigosOrdenados.forEach(inimigo => {
            console.log('Contador de inimigos', ProgressionManager.#contadorInimigos);
            poder = ProgressionManager.aplicarFuncaoDeProgressao(
                ProgressionManager.#contadorInimigos,
                poderBase,
                "cookie"
            );
            ProgressionManager.#contadorInimigos += 1;
            const poderAcimaDoBase = poder - poderBase;
            inimigo.distribuirPoder(poderAcimaDoBase, seedGen);
            inimigo.calcularAtributos();
            inimigo.hpAtual = inimigo.hpMax;
            inimigo.poderTotal = ProgressionManager.calcularPoderTotal(inimigo.atributos, inimigo.taxasCrescimento);
            if (room.number === 12) {
                console.log('Novo Inimigo');
                console.log('Poder acima: ', poderAcimaDoBase);
                console.log('atributos: ');
                console.log(inimigo.atributos);
                console.log('taxas: ');
                console.log(inimigo.taxasCrescimento);
                console.log(inimigo.poderTotal);
            }
            inimigo.poderAoMorrer = inimigo.poderTotal * PORCENTAGEM_POR_MORTE;   // 30% do poder total do inimigo é dado ao player
            inimigo.calcularNivel(poder);
        });
        return poder;
    }

    static distribuirPoderEntreInimigosSalaInicial(level, mapa, poderBase, seedGen) {
        const rooms = level.rooms;
        let roomAtual = level.getPlayerRoom();
        let roomInicial = roomAtual;
        do {
            let poderAtual = ProgressionManager.distribuirPoderEntreInimigos(
                roomAtual,
                mapa,
                poderBase,
                seedGen
            );
            ProgressionManager.calculaMapaDePoderSala(roomAtual);
            roomAtual = rooms[roomAtual.teleporterFinal.proximoTeleporte.roomNumber - 1];
        } while (roomAtual.number != roomInicial.number);
    }

    static distribuirPoderEntreTesouros(room, mapa, poderBase) {
        // console.log('DISTRIBUIR PODER ENTRE TESOUROS');
        let poder = poderBase;
        const tesourosOrdenados = room.treasures.sort((a, b) => {
            const celulaA = mapa.getCell(a.gy, a.gx);
            const celulaB = mapa.getCell(b.gy, b.gx);
            return celulaB.distInundacaoSaida - celulaA.distInundacaoSaida;
        });
        tesourosOrdenados.forEach(tesouro => {
            tesouro.poderTotal = ProgressionManager.aplicarFuncaoDeProgressao(
                ProgressionManager.#contadorTesouros,
                poderBase,
                "cookie"
            ) << 0;
            if (room.number === 12) {
                console.log('O poder é', tesouro.poderTotal);
            }
            ProgressionManager.#contadorTesouros += 1;
            // tesouro.poderTotal = ProgressionManager.aplicarFuncaoDeProgressao(100, 100, "cookie", 1.06);
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
    
    static calculaMapaDePoderSala(room) {
        if (room == null) {
            return;
        }
        room.resetaIdObjetoInundacao();
        room.resetarMetrica('influenciaPoder', 0);
        const inimigos = room.enemies;
        inimigos.forEach((inimigo, index) => {
            const celula = room.blocks.find(block => {
                return (block.linha == inimigo.gy && block.coluna == inimigo.gx);
            });
            if (celula) {
                let poderInimigo = inimigo.poderTotal;
                const decaimento = 0.8;
                const avaliar = [{ celula: celula, poder: poderInimigo, n: 1}];
                let aux;
                while (aux = avaliar.shift()) {
                    const porcentagemDoOriginal = aux.poder / poderInimigo;
                    // if (aux.poder <= 0 || aux.celula.idObjetoInundacao == index) {
                    if (porcentagemDoOriginal <= 0.2 || aux.celula.idObjetoInundacao == index) {
                        continue;
                    }
                    aux.celula.metricas.influenciaPoder += aux.poder;
                    aux.celula.idObjetoInundacao = index;
                    for (let i = 0; i < aux.celula.vizinhos.length; i++) {
                        avaliar.push({
                            celula: room.blocks[aux.celula.vizinhos[i]],
                            // poder: Math.floor(aux.poder - (poderInimigo * 0.15)),
                            poder: Math.round(poderInimigo * Math.pow(decaimento, aux.n)),
                            n: aux.n + 1
                        });
                    }
                }
            }
        });
        room.atualizaMetricas(['influenciaPoder']);
    }

    static calculaMapaDePoderTesouroSala(room) {
        if (room == null) {
            return;
        }
        room.resetaIdObjetoInundacao();
        room.resetarMetrica('influenciaPoderTesouro', 0);
        const treasures = room.treasures;
        treasures.forEach((tesouro, index) => {
            const celula = room.blocks.find(block => {
                return (block.linha == tesouro.gy && block.coluna == tesouro.gx);
            });
            if (celula) {
                let poderTesouro = tesouro.poderTotal;
                const decaimento = 0.85;
                const avaliar = [{ celula: celula, poder: poderTesouro, n: 1}];
                let aux;
                while (aux = avaliar.shift()) {
                    const porcentagemDoOriginal = aux.poder / poderTesouro;
                    // if (aux.poder <= 0 || aux.celula.idObjetoInundacao == index) {
                    if (porcentagemDoOriginal <= 0.2 || aux.celula.idObjetoInundacao == index) {
                        continue;
                    }
                    aux.celula.metricas.influenciaPoderTesouro += aux.poder;
                    aux.celula.idObjetoInundacao = index;
                    for (let i = 0; i < aux.celula.vizinhos.length; i++) {
                        avaliar.push({
                            celula: room.blocks[aux.celula.vizinhos[i]],
                            // poder: Math.floor(aux.poder - (poderTesouro * 0.15)),
                            poder: Math.round(poderTesouro * Math.pow(decaimento, aux.n)),
                            n: aux.n + 1
                        });
                    }
                }
            }
        });
        room.atualizaMetricas(['influenciaPoderTesouro']);
    }

    static calcularPoderTotal(atributos, taxaCrescimento, teste = false) {
        let somaPoder = 0;
        const valoresAtributosBase = PARAMETROS_SLIME.slime_custo_base;
        if (teste) {
            console.log(valoresAtributosBase);
            console.log(atributos);
            console.log(taxaCrescimento);
        }
        Object.keys(atributos).forEach((key) => {
            let somaAtributo = 0;
            for (let i = 0; i <= atributos[key]; i++) {
                let custoAtributo = ProgressionManager.aplicarFuncaoDeProgressao(i, valoresAtributosBase[key], "cookie", taxaCrescimento[key]);
                somaAtributo += custoAtributo;
            }
            somaPoder += somaAtributo;
        });
        return somaPoder << 0;
    }

    static getCustoUpgrade(valorAtributo, nomeAtributo) {
        const custoUpgrade = ProgressionManager.aplicarFuncaoDeProgressao(
            valorAtributo,
            PARAMETROS_SLIME.slime_custo_base[nomeAtributo],
            "cookie",
            PARAMETROS_SLIME.slime_crescimento_por_nivel[nomeAtributo]
        );
        return custoUpgrade;
    }

}