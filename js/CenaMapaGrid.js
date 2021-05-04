import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapaFase1 from "../maps/mapa1.js";
import Layer from "./Layer.js";

export default class CenaMapaGrid extends Cena{
    quandoColidir(a, b){

    }

    preparar(){
        super.preparar();

        // Define dimensões do mapa
        const LINHAS = 8;
        const COLUNAS = 12;
        const TAMANHO_TILE = 48;
        
        // Desenha o mapa
        const mapa1 = new Mapa(LINHAS, COLUNAS, TAMANHO_TILE);
        mapa1.carregaMapa(modeloMapaFase1);
        this.configuraMapa(mapa1);

        // Desenha o layer
        const layer1 = new Layer(LINHAS, COLUNAS, TAMANHO_TILE);
        layer1.carregaLayer(modeloMapaFase1);
        this.configuraLayer(layer1);  
        
        const cena = this;

        // Cria entrada
        const entrada = new Sprite({x: 65, y: randValue(65,310), w: 20, h: 20, color:"yellow", tags:["entrada"]});
        this.adicionar(entrada);

        // Cria pc
        const pc = new Sprite({x: entrada.x, y :entrada.y, w: 15, h: 15, color: "red", controlar:movimentoTeclado});
        pc.tags.add("pc");
        this.adicionar(pc);

        this.layer.atualizaDistanciasManhattan(pc.mx, pc.my);
        
        // Cria saída
        const exit = new Sprite({x: 510, y: randValue(65,310), w: 20, h: 20, tags:["exit"], controlar:estatico});
        this.adicionar(exit);
        
        // Função geradora de valores aleatórios
        function randValue(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //Função de movimento estático
        function estatico(dt){
            cena.layer.iniciaLayers(pc.mx, pc.my, this.mx, this.my);
            cena.layer.inundarRecursivo(this.my, this.mx, this.my, this.mx);
            cena.layer.apontarDirecoes();
        }

        // Função de movimentação pelo teclado
        function movimentoTeclado(dt){
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

        // Função de cálculo de distância entre dois pontos
        function dist(a, b) {
            return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
        }
        
    }
        
    desenharHud(){
        // Fase
        /*this.ctx.font = "15px Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Moedas coletadas: " + this.game.moedas, 10, 20);
        this.ctx.fillText("Sprites na tela: " + this.sprites.length, 10, 40);*/
    }
}