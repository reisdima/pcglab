export default class InputManager {
    constructor() {
        this.comandos = {};
        this.teclas = {};
        this.mapaPressionado = {};
    }

    configurarTeclado(acoes) {
        for (const tecla in acoes) {
            const comando = acoes[tecla];
            this.teclas[tecla] = comando;
            this.comandos[comando] = false;
            this.mapaPressionado[comando] = false;
        }
        const that = this;
        addEventListener("keydown", function (e) {
            const comando = that.teclas[e.key];
            if (comando) {
                that.comandos[comando] = true;
            }
            //console.log(e.key, comando, that.comandos.get(comando));
        });
        addEventListener("keyup", function (e) {
            const comando = that.teclas[e.key];
            if (comando) {
                that.mapaPressionado[comando] = false;
                that.comandos[comando] = false;
            }
            //console.log(e.key, comando, that.comandos.get(comando));
        });
    }

    foiPressionado(comando) {
        if (this.comandos[comando]) {
            if (this.mapaPressionado[comando] != undefined && !this.mapaPressionado[comando]) {
                this.mapaPressionado[comando] = true;
                return true;
            }
        }
        return false;
    }

    estaPressionado(comando) {
        if (this.comandos[comando]) {
            this.mapaPressionado[comando] = true;
            return true;
        }
        return false;
    }


    // configurarTeclado(acoes) {
    //     for (const tecla in acoes) {
    //         const comando = acoes[tecla];
    //         this.comandos.set(comando, false);
    //         this.teclas.set(tecla, comando);
    //     }
    //     const that = this;
    //     addEventListener("keydown", function (e) {
    //         const comando = that.teclas.get(e.key);
    //         if (comando) {
    //             that.comandos.set(comando, true);
    //         }
    //         //console.log(e.key, comando, that.comandos.get(comando));
    //     });
    //     addEventListener("keyup", function (e) {
    //         const comando = that.teclas.get(e.key);
    //         if (comando) {
    //             that.comandos.set(comando, false);
    //         }
    //         //console.log(e.key, comando, that.comandos.get(comando));
    //     });
    // }
}