let _debugMode = 0;

export function getDebugMode(){
    return _debugMode;
}

export function setDebugMode(valor){
    _debugMode = valor;
    console.log(_debugMode);
}