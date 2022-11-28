export default class Cell {
    constructor(params = {}) {
        let exemplo = {
            tipo: 0,
            room: -3,
            distTeleportes: 999,
            distFirezones: 999,
            distInimigos: 999,
            distTesouros: 999,
            linha: 0,
            coluna: 0,
            direcaoSaida: ">",
            direcaoTesouros: "V",
            notacaoTesouros: ".",
            notacaoPlayer: ".   .",
            distInundacaoSaida: -1,
            distInundacaoTemp: -1,
            indexRoom: -1,
            vizinhos: [],
            influenciaPoder: 0,
            idObjetoInundacao: -1,
        };

        Object.assign(this, exemplo, params);   // Sobrescreve os atributos de params e exemplo na classe
    }

    // Média entre as distências da célula até inimigo e teleporte
    distInimigoTeleporte(maxInimigo = 1, maxTeleporte = 1) {
        return ((this.distInimigos / maxInimigo) + (this.distTeleportes / maxTeleporte)) / 2;
    }

    // Média entre as distências da célula até inimigo e teleporte
    distInimigo_Tesouro_Teleporte(maxInimigo = 1, maxTeleporte = 1, maxTesouro = 1) {
        return ((this.distInimigos / maxInimigo) + (this.distTeleportes / maxTeleporte) +
            (this.distTesouros / maxTesouro)) / 2;
    }

    // Média entre as distências normalizadas da célula até inimigo e teleporte e o valor
    // normalizado de poder
    mediaInimigo_Teleporte_Poder(maxInimigo = 1, maxTeleporte = 1, maxPoder = 1) {
        let poder = this.influenciaPoder / maxPoder;
        if (this.influenciaPoder === 0 || maxPoder === 0) {
            poder = 0;
        }
        return ((this.distInimigos / maxInimigo) + (this.distTeleportes / maxTeleporte) +
            1 - poder) / 3;
    }

    clone(celula) {
        this.tipo = celula.tipo;
        this.room = celula.room;
        this.distTeleportes = celula.distTeleportes;
        this.distFirezones = celula.distFirezones;
        this.distInimigos = celula.distInimigos;
        this.distTesouros = celula.distTesouros;
        this.linha = celula.linha;
        this.coluna = celula.coluna;
        this.influenciaPoder = celula.influenciaPoder;
        this.vizinhos = celula.vizinhos;
    }
}
