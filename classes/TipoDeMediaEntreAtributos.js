
export const TIPOS_DE_MEDIA = Object.freeze({
    posicionamentoInimigoPertoDeTesouro: {
        // distInimigos: 1,
        // distTeleportes: 1,
        distFirezones: 0.7,
        distCaminhoEntradaSaida: -1,
        // distTesouros: -1,
        influenciaPoder: -2,
        influenciaPoderTesouro: 1.3,
    },
    posicionamentoTesouroLongeCaminhoEntradaSaida:{
        // distFirezones: 1,
        // distTesouros: 2,
        // influenciaPoderTesouro: -1,
        // distCaminhoEntradaSaida: 1,
        influenciaPoderTesouro: -1.5,
        distCaminhoEntradaSaida: 1.5,
    }
});

export default class TipoDeMediaEntreAtributos {
    static getTipoDeMediaPorNome(nome) {
        return TIPOS_DE_MEDIA[nome];
    }
}