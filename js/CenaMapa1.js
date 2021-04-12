import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapaFase1 from "../maps/mapa1.js";

export default class CenaFase1 extends Cena{
    quandoColidir(a, b){
        if(a.tags.has("pc") && b.tags.has("coin")){
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
            }
            this.game.moedas += 1;
        }
    }

    preparar(){
        super.preparar();

        // Desenha o mapa
        const mapa1 = new Mapa(8, 12, 48);
        mapa1.carregaMapa(modeloMapaFase1);
        this.configuraMapa(mapa1);

        // Desenha o pc
        const pc = new Sprite({x: 65, y :192, w: 20, h: 20, color: "red"});
        pc.tags.add("pc");

        const cena = this;

        // Define controle do pc
        /*pc.controlar = function(dt){
            if(cena.input.comandos.get("MOVE_ESQUERDA")){
                this.direcao = "esq";
                this.vx = -150;
            } else if (cena.input.comandos.get("MOVE_DIREITA")){
                this.direcao = "dir";
                this.vx = +150;
            } else {
                this.vx = 0;
            }
            if(cena.input.comandos.get("MOVE_CIMA")){
                this.direcao = "cima";
                this.vy = -150;
            } else if (cena.input.comandos.get("MOVE_BAIXO")){
                this.direcao = "baixo";
                this.vy = +150;
            } else {
                this.vy = 0;
            }
        };*/

        pc.controlar = caminhoAleatorio;
        
        this.adicionar(pc);
        
        // Cria saída
        const exit = new Sprite({x: 510, y: 192, w: 20, h: 20, tags:["exit"]});
        this.adicionar(exit);
        
        // Cria moedas
        this.adicionar(new Sprite({x: randValue(65, 510), y: randValue(65, 340), w: 16, h: 16, tags:["coin"]}));
        this.adicionar(new Sprite({x: randValue(65, 510), y: randValue(65, 340), w: 16, h: 16, tags:["coin"]}));
        this.adicionar(new Sprite({x: randValue(65, 510), y: randValue(65, 340), w: 16, h: 16, tags:["coin"]}));
        this.adicionar(new Sprite({x: randValue(65, 510), y: randValue(65, 340), w: 16, h: 16, tags:["coin"]}));
        this.adicionar(new Sprite({x: randValue(65, 510), y: randValue(65, 340), w: 16, h: 16, tags:["coin"]}));
            
        // Função de movimentação por perseguição
        function perseguePC(dt){
            this.vx = 40*Math.sign(pc.x - this.x);
            this.vy = 40*Math.sign(pc.y - this.y);
        }

        //Função de caminho aleatório
        function caminhoAleatorio(dt){
            for (let i = 0; i < cena.sprites.length; i++) {
                if(cena.sprites[i].tags.has("coin")){
                    this.vx = 100*Math.sign(cena.sprites[i].x - this.x);
                    this.vy = 100*Math.sign(cena.sprites[i].y - this.y);
                }
                if(cena.sprites[i].tags.has("exit") && cena.sprites.length === 2){
                    this.vx = 100*Math.sign(cena.sprites[i].x - this.x);
                    this.vy = 100*Math.sign(cena.sprites[i].y - this.y);
                }
            }
        }

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
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Moedas: " + this.game.moedas, 10, 20);
        this.ctx.fillText("Sprites: " + this.sprites.length, 10, 40);
    }
}