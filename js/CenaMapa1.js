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

        // Desenha o pc
        const pc = new Sprite({x: 80, y :80, w: 20, h: 20, color: "red"});
        pc.tags.add("pc");

        const cena = this;

        // Define controle do pc
        pc.controlar = function(dt){
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
        };
        
        this.adicionar(pc);
        
        // Cria saída
        const exit = new Sprite({x: 200, y: 100, w: 20, h: 20, tags:["exit"]});
        this.adicionar(exit);
        
        // Cria moedas
        this.adicionar(new Sprite({x: 100, y: 100, w: 16, h: 16, tags:["coin"]}));
            
        // Função de movimentação por perseguição
        function perseguePC(dt){
            this.vx = 40*Math.sign(pc.x - this.x);
            this.vy = 40*Math.sign(pc.y - this.y);
            if(pc.x > this.x){
                this.direcao = "dir";
            }
            if(pc.x < this.x){
                this.direcao = "esq";
            }
            /*if (pc.y < this.y){
                this.direcao = "cima";
            }
            if (pc.y > this.y){
                this.direcao = "baixo";
            }*/
        }

        // Função de movimentação básica
        function movimentoBasico(dt){
            if(this.direcao === "dir"){
                this.vx = 60;
            }
            if(this.direcao === "esq"){
                this.vx = -60;
            }
            if(this.direcao === "cima"){
                this.vy = -60;
            }
            if(this.direcao === "baixo"){
                this.vy = 60;
            }
                
            //console.log(this.direcao);
        }

        // Função geradora de valores aleatórios
        function randValue(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
        
        
}