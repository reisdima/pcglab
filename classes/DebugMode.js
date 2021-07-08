let _debugMode = 0;

function debugMode(){
    return _debugMode;
}

export function setDebugMode(valor){
    _debugMode = valor;
}

export default debugMode;