import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapaFase1 from "../maps/mapa1.js";

export default class CenaFase1 extends Cena{
    quandoColidir(a, b){

    }

    preparar(){
        super.preparar();

        // Desenha o mapa
        const mapa1 = new Mapa(8, 12, 48);
        mapa1.carregaMapa(modeloMapaFase1);
        this.configuraMapa(mapa1);

        // Cria entrada
        const entrada = new Sprite({x: 65, y: randValue(65,310), w: 20, h: 20, color:"yellow", tags:["entrada"]});
        this.adicionar(entrada);
        
        // Cria saída
        const exit = new Sprite({x: 510, y: randValue(65,310), w: 20, h: 20, tags:["exit"]});
        this.adicionar(exit);
        
        // Função geradora de valores aleatórios
        function randValue(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

    }
        
    desenharHud(){
        // Fase
        this.ctx.font = "15px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Moedas coletadas: " + this.game.moedas, 10, 20);
        this.ctx.fillText("Sprites na tela: " + this.sprites.length, 10, 40);
    }
}