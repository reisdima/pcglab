import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapa1 from "../maps/mapa1.js";
import modeloMapa2 from "../maps/mapa2.js";
import modeloMapaFase1 from "../maps/mapaFase1.js";

export default class CenaFase1 extends Cena{
    quandoColidir(a, b){
        //Colisão básica (elimina os dois)
        if(!this.aRemover.includes(a)){
            this.aRemover.push(a);
        }
        if(!this.aRemover.includes(b)){
            this.aRemover.push(b);
        }
        if(a.tags.has("pc") && b.tags.has("enemy")){
            this.game.selecionaCena("fim");
        }

        console.log(this.aRemover);
        this.assets.play("bruh");
    }

    preparar(){
        super.preparar();
        const mapa1 = new Mapa(10, 14, 32);
        mapa1.carregaMapa(modeloMapaFase1);
        this.configuraMapa(mapa1);

        const pc = new Sprite({x:50, y :150, h: 20, w:20});
        pc.tags.add("pc");

        const cena = this;

        pc.controlar = function(dt){
            if(cena.input.comandos.get("MOVE_ESQUERDA")){
                this.vx = -150;
            } else if (cena.input.comandos.get("MOVE_DIREITA")){
                this.vx = +150;
            } else {
                this.vx = 0;
            }
            if(cena.input.comandos.get("MOVE_CIMA")){
                this.vy = -150;
            } else if (cena.input.comandos.get("MOVE_BAIXO")){
                this.vy = +150;
            } else {
                this.vy = 0;
            }
        };
        this.adicionar(pc);

        function perseguePC(dt){
            this.vx = 25*Math.sign(pc.x - this.x);
            this.vy = 25*Math.sign(pc.y - this.y);
        }

        const en1 = new Sprite({x:360, color:"red", h: 20, w:20, controlar: perseguePC, tags:["enemy"]});

        //this.adicionar(en1);
        //this.adicionar(new Sprite({x: 115, y:70, vy:10, color:"red", h: 20, w:20, controlar: perseguePC, tags:["enemy"]}));
        //this.adicionar(new Sprite({x: 115, y:160, vy:-10, color:"red", h: 20, w:20, controlar: perseguePC, tags:["enemy"]}));

        const exit = new Sprite({x: 16*32 - 64, y: 12*32/2, w: 32, h: 32, color: "yellow", tags:["exit"]});
        this.adicionar(exit);


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
}