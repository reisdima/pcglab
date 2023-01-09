import TipoDeMediaEntreAtributos from "./TipoDeMediaEntreAtributos.js";

export default class Cell {
    constructor(params = {}) {
        let exemplo = {
            tipo: 0,
            room: -3,
            // distTeleportes: 999,
            // distFirezones: 999,
            // distInimigos: Infinity,
            // distTesouros: 999,
            // distCaminhoEntradaSaida: 999,
            // influenciaPoder: Infinity,
            linha: 0,
            coluna: 0,
            direcaoSaida: ">",
            direcaoTesouros: "V",
            notacaoTesouros: ".",
            notacaoPlayer: ".   .",
            distInundacaoSaida: Infinity,
            distInundacaoTemp: -1,
            indexRoom: -1,
            vizinhos: [],
            idObjetoInundacao: -1,
            podePosicionarInimigo: false,
            podePosicionarTesouro: false,
        };

        Object.assign(this, exemplo, params); // Sobrescreve os atributos de params e exemplo na classe

        this.metricas = {
            distTeleportes: Infinity,
            distFirezones: Infinity,
            distInimigos: Infinity,
            distTesouros: Infinity,
            distCaminhoEntradaSaida: Infinity,
            influenciaPoder: 0,
            influenciaPoderTesouro: 0,
            // influenciaPoder: Infinity,
            compostas: {
                mediaInimigoTeleportePoder: -1,
                mediaInimigoTesouroTeleportePoder: -1,
                // mediaTesouroFirezoneTeleporteEntradaSaida: -1,
                mediaTesouroFirezoneTeleporteEntradaSaida: Infinity,
                mediaPosicionamentoInimigo: Infinity,
            }
        };
    }

    // Média entre as distências da célula até inimigo e teleporte
    distInimigoTeleporte(maxInimigo = 1, maxTeleporte = 1) {
        return (
            (this.metricas.distInimigos / maxInimigo +
                this.metricas.distTeleportes / maxTeleporte) /
            2
        );
    }

    // Média entre as distências da célula até inimigo e teleporte
    distInimigo_Tesouro_Teleporte(
        maxInimigo = 1,
        maxTeleporte = 1,
        maxTesouro = 1
    ) {
        return (
            (this.metricas.distInimigos / maxInimigo +
                this.metricas.distTeleportes / maxTeleporte +
                this.metricas.distTesouros / maxTesouro) /
            2
        );
    }

    /**
     * Média entre as distâncias normalizadas da célula até inimigo e teleporte 
     * e o valor normalizado de poder.
     * É utilizado para o posicionamento de inimigo.
     */
    mediaInimigo_Teleporte_Poder(
        maxInimigo = 1,
        maxTeleporte = 1,
        maxPoder = 1
    ) {
        let poder = this.metricas.influenciaPoder / maxPoder;
        if (this.metricas.influenciaPoder === 0 || maxPoder === 0) {
            poder = 0;
        }
        return (
            (this.metricas.distInimigos / maxInimigo +
                this.metricas.distTeleportes / maxTeleporte +
                1 -
                poder) /
            3
        );
    }

    // Média entre as distências normalizadas da célula até inimigo, tesouro e teleporte e o valor
    // normalizado de poder
    mediaInimigo_Tesouro_Teleporte_Poder(
        maxInimigo = 1,
        maxTeleporte = 1,
        maxTesouro = 1,
        maxPoder = 1
    ) {
        let poder = this.metricas.influenciaPoder / maxPoder;
        if (this.metricas.influenciaPoder === 0 || maxPoder === 0) {
            poder = 0;
        }
        return (
            (this.metricas.distInimigos / maxInimigo +
                this.metricas.distTeleportes / maxTeleporte +
                this.metricas.distTesouros / maxTesouro +
                1 -
                poder) /
            4
        );
    }

    /**
     * Média entre as distências normalizadas da célula até teleporte, firezone, tesouro
     * e a distância até o caminho entrada-saída.
     * É utilizado para o posicionamento de tesouros
     */
    mediaTesouro_Firezone_Teleporte_EntradaSaida(
        maxTeleporte = 1,
        maxFirezones = 1,
        maxTesouro = 1,
        maxEntradaSaida = 1
    ) {
        return ((
            // this.metricas.distTeleportes / maxTeleporte +
                this.metricas.distFirezones / maxFirezones +
                this.metricas.distTesouros / maxTesouro +
                this.metricas.distTesouros / maxTesouro +
                this.metricas.distCaminhoEntradaSaida / maxEntradaSaida) /
            4
        );
    }

    fazerMediaPonderada(atributos = [], valoresMaximos = []) {
        let media = 0;
        let contador = 0;
        // if (this.room === 12) {
        //     console.log('OUTRA CELULA');
        // }
        for (let i = 0; i < Object.values(atributos).length; i++) {
            let nomeAtributo = Object.keys(atributos)[i];
            let peso = atributos[nomeAtributo];
            let valorDaCelula = this.metricas[nomeAtributo];
            // if (this.room === 12) {
            //     console.log(atributos);
            //     console.log(this.linha, this.coluna);
            //     console.log('nome Atributo', nomeAtributo);
            //     console.log('valor', valorDaCelula);
            //     console.log('peso', peso);
            //     console.log('valor maximo', valoresMaximos[i]);
            // }
            if (valorDaCelula < Infinity) {
                if (peso < 0) {
                    peso = peso * -1;
                    media += (1 - (valorDaCelula * peso / valoresMaximos[i]));
                } else {
                    media += (valorDaCelula * peso / valoresMaximos[i]);
                }
                contador += peso;
            }
        }
        // if (this.room === 12) {
        //     console.log('Valor da soma: ', media);
        //     console.log('Valor do contador: ', contador);
        //     console.log('Valor media: ', media / contador);
        // }
        return media / contador;
    }

    fazerMediaPonderadaTeste(tipoDeMedia = '', room, atributos = [], valoresMaximos = []) {
        // const tipoDeMedia = TipoDeMediaEntreAtributos.getTipoDeMediaPorNome(nomeMedia);
        // if (room.number === 12) {
        //     console.log('Entrou aqui');
        //     console.log(tipoDeMedia);
        // }
        let media = 0;
        let contador = 0;
        for (let i = 0; i < Object.values(tipoDeMedia).length; i++) {
            let nomeAtributo = Object.keys(tipoDeMedia)[i];
            let peso = tipoDeMedia[nomeAtributo];
            let valorMaximoNaRoom = room.metricas[nomeAtributo];
            let valorDaCelula = this.metricas[nomeAtributo];
            if (room.number === 12  && this.linha == 91 && this.coluna == 64) {
                // if (room.number === 12) {
                // console.log('linha e coluna', this.linha, this.coluna);
                // console.log('nomeAtributo', nomeAtributo);
                // console.log('peso', peso);
                // console.log('valorDaCelula', valorDaCelula);
                // console.log('valorMaximoNaRoom', valorMaximoNaRoom);
            }
            if (valorDaCelula < Infinity && (valorMaximoNaRoom < Infinity && valorMaximoNaRoom > 0)) {
                // if (peso < 0) {
                //     peso = peso * -1;
                //     media += (1 - (valorDaCelula * peso / valorMaximoNaRoom));
                // } else {
                //     media += (valorDaCelula * peso / valorMaximoNaRoom);
                // }
                if (valorMaximoNaRoom === 0) {
                    if (peso < 0) {
                        peso = peso * -1;
                    }
                    contador += peso;
                } else {
                    if (peso < 0) {
                        peso = peso * -1;
                        media += (peso - (valorDaCelula * peso / valorMaximoNaRoom));
                    } else {
                        media += (valorDaCelula * peso / valorMaximoNaRoom);
                    }
                    contador += peso;
                }
            }
        }
        if (room.number === 12 && this.linha == 91 && this.coluna == 64) {
            // console.log('soma', media);
            // console.log('contador', contador);
            // console.log('media', media / contador);
        }
        return media / contador;
    }

    fazerSomaTeste(tipoDeMedia = '', room, debug = false) {
        let media = 0;
        let soma = 0;
        let contador = 0;
        for (let i = 0; i < Object.values(tipoDeMedia).length; i++) {
            let nomeAtributo = Object.keys(tipoDeMedia)[i];
            let peso = tipoDeMedia[nomeAtributo];
            let valorMaximoNaRoom = room.metricas[nomeAtributo];
            let valorDaCelula = this.metricas[nomeAtributo];
            if (valorDaCelula < Infinity && (valorMaximoNaRoom < Infinity && valorMaximoNaRoom > 0)) {
                soma += peso * (valorDaCelula / valorMaximoNaRoom);
                if (debug) {
                    console.log('linha e coluna', this.linha, this.coluna);
                    console.log('nomeAtributo', nomeAtributo);
                    console.log('peso', peso);
                    console.log('valorDaCelula', valorDaCelula);
                    console.log('valorMaximoNaRoom', valorMaximoNaRoom);
                    console.log('valor a ser somado', peso * (valorDaCelula / valorMaximoNaRoom));
                }
                // if (valorMaximoNaRoom === 0) {
                //     if (peso < 0) {
                //         peso = peso * -1;
                //     }
                //     contador += peso;
                // } else {
                //     if (peso < 0) {
                //         peso = peso * -1;
                //         media += (peso - (valorDaCelula * peso / valorMaximoNaRoom));
                //     } else {
                //         media += (valorDaCelula * peso / valorMaximoNaRoom);
                //     }
                //     contador += peso;
                // }
            }
        }
        if (debug) {
            console.log('soma', soma);
        }
        return soma;
        // return media / contador;
    }


    clone(celula) {
        this.tipo = celula.tipo;
        this.room = celula.room;
        // this.distTeleportes = celula.distTeleportes;
        // this.distFirezones = celula.distFirezones;
        // this.distInimigos = celula.distInimigos;
        // this.distTesouros = celula.distTesouros;
        // this.distCaminhoEntradaSaida = celula.distCaminhoEntradaSaida;
        // this.influenciaPoder = celula.influenciaPoder;
        this.linha = celula.linha;
        this.coluna = celula.coluna;
        this.vizinhos = celula.vizinhos;
        this.distInundacaoSaida = celula.distInundacaoSaida;
        this.metricas = celula.metricas;
    }
}
