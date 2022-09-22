export const DEBUG_MODE = Object.freeze({
    DEBUG_OFF: 0,
    TIPO_DA_CELULA: 1,
    ROOM_DA_CELULA: 2,
    LIGACAO_TELEPORTES: 3,
    CAIXA_DE_COLISAO: 4,
    DISTANCIA_TELEPORTES: 5,
    DISTANCIA_FIREZONES: 6,
    DISTANCIA_INIMIGOS: 7,
    DISTANCIA_TESOUROS: 8,
    DISTANCIA_INIMIGOS_TELEPORTES: 9,
    DISTANCIA_INIMIGOS_TELEPORTES_FIREZONES: 10,
    GPS_SAIDA_ROOM: 11,
    CAMINHO_ENTRADA_SAIDA: 12,
    CAMINHO_TESOUROS: 13,
    CAMINHO_PLAYER: 14,
    CAMINHO_SOBREPOSICAO: 15,
    GRAFICO_ENTRADA_SAIDA: 16,
    GRAFICO_ENTRADA_TESOURO_SAIDA: 17,
    GRAFICO_CAMINHO_PLAYER: 18,
    INFLUENCIA_PODER: 19,
});

export default class Debugger {
    static _debugMode = DEBUG_MODE.DEBUG_OFF;

    static setDebugMode(debugMode) {
        Debugger._debugMode = debugMode;
    }

    static getDebugMode(){
        return Debugger._debugMode;
    }

    static debug(mensagem) {
        console.log(mensagem);
    }

    static isDebugMode(debugMode) {
        return Debugger._debugMode === debugMode;
    }

    static isDebugModeOn() {
        return Debugger._debugMode !== DEBUG_MODE.DEBUG_OFF;
    }

    static nextDebugMode() {
        Debugger._debugMode++;
        if (Debugger._debugMode >= Object.values(DEBUG_MODE).length) {
            Debugger._debugMode = 0;
        }
    }

    static previousDebugMode() {
        Debugger._debugMode--;
        if (Debugger._debugMode < 0) {
            Debugger._debugMode = Object.values(DEBUG_MODE).length - 1;
        }
    }
}
