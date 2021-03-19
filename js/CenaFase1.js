import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapa1 from "../maps/mapa1.js";
import modeloMapa2 from "../maps/mapa2.js";
import modeloMapaFase1 from "../maps/mapaFase1.js";

export default class CenaFase1 extends Cena{
    quandoColidir(a, b){
        if(a.tags.has("pc") && b.tags.has("enemy")){ // Se pc colidir com inimigo, remove os dois, emite som e Game Over
            if(!this.aRemover.includes(a)){
                this.aRemover.push(a);
            }
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
            }
            this.assets.play("bruh");
            this.game.selecionaCena("fim");
        }
        if(a.tags.has("pc") && b.tags.has("exit")){ // Se pc colidir com saída, remove os dois e vai pra próx. fase
            if(!this.aRemover.includes(a)){
                this.aRemover.push(a);
            }
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
            }
            this.game.selecionaCena("fase2");
        }
        if(a.tags.has("pc") && b.tags.has("coin")){ // Se pc colidir com moeda, remove moeda e incrementa contador
            if(!this.aRemover.includes(b)){
                this.aRemover.push(b);
            }
            this.game.moedas += 1;
        }
        if(a.tags.has("enemy") && b.tags.has("exit")){ // Se pc colidir com saída, não faz nada (por enquanto)
        }

        //console.log(this.aRemover);
    }

    preparar(){
        super.preparar();

        // Desenha o mapa
        const mapa1 = new Mapa(10, 14, 48);
        mapa1.carregaMapa(modeloMapaFase1);
        this.configuraMapa(mapa1);

        // Desenha o pc
        const pc = new Sprite({x:80, y :150});
        pc.tags.add("pc");

        const cena = this;

        // Define controle do pc
        pc.controlar = function(dt){
            if(cena.input.comandos.get("MOVE_ESQUERDA")){
                this.direcao = "esq";
                this.parado = "false";
                this.vx = -150;
            } else if (cena.input.comandos.get("MOVE_DIREITA")){
                this.direcao = "dir";
                this.parado = "false";
                this.vx = +150;
            } else {
                this.vx = 0;
            }
            if(cena.input.comandos.get("MOVE_CIMA")){
                this.direcao = "cima";
                this.parado = "false";
                this.vy = -150;
            } else if (cena.input.comandos.get("MOVE_BAIXO")){
                this.direcao = "baixo";
                this.parado = "false";
                this.vy = +150;
            } else {
                this.vy = 0;
            }
        };
        this.adicionar(pc);

        // Função de perseguição
        function perseguePC(dt){
            this.vx = 25*Math.sign(pc.x - this.x);
            this.vy = 25*Math.sign(pc.y - this.y);
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

        // Cria inimigos
        const en1 = new Sprite({x:360, color:"red", controlar: perseguePC, tags:["enemy"]});
        this.adicionar(en1);
        this.adicionar(new Sprite({x: 255, y:70, color:"red", controlar: perseguePC, tags:["enemy"]}));
        this.adicionar(new Sprite({x: 235, y:160, color:"red", controlar: perseguePC, tags:["enemy"]}));

        // Cria saída
        const exit = new Sprite({x: 16*32 - 64, y: 12*32/2, w: 32, h: 48, color: "yellow", tags:["exit"]});
        this.adicionar(exit);

        // Cria moedas
        this.adicionar(new Sprite({x: 200, y: 200, w: 16, h: 16, color: "lime", tags:["coin"]}));
        this.adicionar(new Sprite({x: 200, y: 100, w: 16, h: 16, color: "lime", tags:["coin"]}));


                            // Criação de sprites experimental 
        
        /*const mapa2 = new Mapa(10, 14, 32);
        const cena = this;
        mapa2.carregaMapa(modeloMapa2);
        cena.configuraMapa(mapa2);

        // Adiciona sprites mais fortes ("Protagonistas")
        cena.adicionar(new Sprite({x: randValue(43, 16*32 - 43), y: randValue(43, 12*32 - 43), w:20, h:20,
                                    vy: randValue(-200, 200), vx: randValue(-200,200), color:"yellow", vida: 1000}));
        cena.adicionar(new Sprite({x: randValue(43, 16*32 - 43), y: randValue(43, 12*32 - 43), w:20, h:20,
                                    vy: randValue(-200, 200), vx: randValue(-200,200), color:"#BA55D3", vida: 1000}));
        cena.adicionar(new Sprite({x: randValue(43, 16*32 - 43), y: randValue(43, 12*32 - 43), w:20, h:20,
                                    vy: randValue(-200, 200), vx: randValue(-200,200), color:"white", vida: 1000}));
        cena.adicionar(new Sprite({x: randValue(43, 16*32 - 43), y: randValue(43, 12*32 - 43), w:20, h:20,
                                    vy: randValue(-200, 200), vx: randValue(-200,200), color:"#00FFFF", vida: 1000}));

        // Adiciona sprites "inimigos" a cada 4000 ms (4 segundos)
        setInterval(() => {
            cena.adicionar(new Sprite({x: randValue(43, 16*32 - 43), y: randValue(43, 12*32 - 43),
                                        vy: randValue(-100, 100), vx: randValue(-100,100), color:"red"}));
        }, 4000);

        function randValue(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }*/
        
    }

    desenharHud(){
        // Fase
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText("Fase 1", 30, 20);

        // Moedas
        this.ctx.fillStyle = "yellow";
        this.ctx.fillText("Moedas: " + this.game.moedas, this.canvas.width - 60, 20);
    }
}