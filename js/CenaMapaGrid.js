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
        
        const cena = this;

        // Cria entrada
        const entrada = new Sprite({x: 65, y: randValue(65,310), w: 20, h: 20, color:"yellow", controlar:estatico, tags:["entrada"]});
        this.adicionar(entrada);
        
        // Cria saída
        const exit = new Sprite({x: 510, y: randValue(65,310), w: 20, h: 20, tags:["exit"]});
        this.adicionar(exit);

        this.adicionar(new Sprite({x: 200, y: 200, w:20, h:20, color:"blue"}));
        
        // Função geradora de valores aleatórios
        function randValue(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //Função de movimento estático
        function estatico(dt){
            if(cena.input.comandos.get("VER_DISTANCIAS")){
                    console.log(this.distancias);
            }
            atualizaDistancias();
        }

        // Função de cálculo de distância entre dois pontos
        function dist(a, b) {
            return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
        }

        //Função que atualiza distâncias de pc aos demais sprites
        function atualizaDistancias(){

            for (let i = 0; i < cena.sprites.length; i++) {
                entrada.distancias.set(i,dist(entrada, cena.sprites[i]));
            }
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