export default class Debugger {
    static debugMode = false;

    static setDebugMode(debugMode) {
        Debugger.debugMode = debugMode;
    }

    static debug(mensagem) {
        if (Debugger.debugMode) {
            console.log(mensagem);
        }
    }
}
