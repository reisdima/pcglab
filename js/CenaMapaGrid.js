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
        const pc = new Sprite({x: entrada.x, y :entrada.y, w: 15, h: 15, color: "red", controlar:estatico});
        pc.tags.add("pc");
        this.adicionar(pc);
        iniciaDistanciasTiles(pc);

        this.layer.atualizaDistanciasManhattan(pc.mx, pc.my);

        
        // Cria saída
        const exit = new Sprite({x: 510, y: randValue(65,310), w: 20, h: 20, tags:["exit"]});
        this.adicionar(exit);

        //this.adicionar(new Sprite({x: 200, y: 200, w:20, h:20, color:"blue"})); // Sprite de teste
        
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
                for (let i = 0; i < cena.sprites.length; i++) {
                    console.log("Sprite " + i + ": MX = " + cena.sprites[i].mx + " MY = " + cena.sprites[i].my + " {" + cena.sprites[i].color + "}");
                }
            }
            if(cena.input.comandos.get("VER_MATRIZ")){
                //console.log(entrada.mapaDistancias);
                for (let l = 0; l < cena.mapa.LINHAS; l++) {
                    let print = "[";
                    for (let c = 0; c < cena.mapa.COLUNAS; c++) {
                        print = print + "(" + this.mapaDistancias[l][c] + "), "; 
                    }
                    print = print + "]";
                    console.log(print);
                }
            }
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
            if(cena.input.comandos.get("VER_DISTANCIAS")){
                console.log(this.distancias);
            }
            
            iniciaDistanciasTiles(this);
            atualizaDistanciasLinhaReta(this);
            inundar(this, this.my, this.mx);
            //atualizaDistanciasManhattan(this);
            cena.layer.iniciaLayers();
            //cena.layer.atualizaDistanciasManhattan(pc.mx, pc.my);
            cena.layer.inundar(pc.my, pc.mx, pc.my, pc.mx);
            cena.layer.apontarDirecoes();
        }

        // Função de cálculo de distância entre dois pontos
        function dist(a, b) {
            return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
        }

        //Função que atualiza distâncias de entrada aos demais sprites
        function atualizaDistanciasLinhaReta(a){

            for (let i = 0; i < cena.sprites.length; i++) {
                a.distancias.set(i,Math.floor(dist(a, cena.sprites[i])));
            }
        }

        //Função que atualiza matriz de distâncias de Manhattan
        function atualizaDistanciasManhattan(a){
            for (let l = 0; l < cena.mapa.LINHAS; l++) {
                a.mapaDistancias[l] = [];
                for (let c = 0; c < cena.mapa.COLUNAS; c++) {
                    if(cena.mapa.tiles[l][c] != 0){
                        a.mapaDistancias[l][c] = -1;
                    } else {
                        let distL = a.my - l;
                        let distC = a.mx - c;
                        a.mapaDistancias[l][c] = Math.abs(distL) + Math.abs(distC);
                        //a.mapaDistancias[l][c] = l + " ," + c ;
                        //a.mapaDistancias[l][c] = cena.mapa.tiles[l][c];
                    }
                }
            }
        }

        // Função de cálculo de distâncias entre tiles
        function iniciaDistanciasTiles(a){
            for (let l = 0; l < cena.mapa.LINHAS; l++) {
                a.mapaDistancias[l] = [];
                for (let c = 0; c < cena.mapa.COLUNAS; c++) {
                    if(cena.mapa.tiles[l][c] != 0){
                        a.mapaDistancias[l][c] = -1;
                    } else {
                        a.mapaDistancias[l][c] = 0;
                    }
                }
            }
        }

        // Função de inundação (flood fill)
        function inundar(a, linha, coluna){
            if((a.my === linha && a.mx === coluna) && a.mapaDistancias[linha][coluna] != -1){
                a.mapaDistancias[linha][coluna] = 0;
                if(a.mapaDistancias[linha-1][coluna] != -1) {
                    a.mapaDistancias[linha-1][coluna] = a.mapaDistancias[linha][coluna] + 1;
                    inundar(a, linha-1, coluna);
                } 
                if(a.mapaDistancias[linha+1][coluna] != -1){
                    a.mapaDistancias[linha+1][coluna] = a.mapaDistancias[linha][coluna] + 1;
                    inundar(a, linha+1, coluna);
                } 
                if(a.mapaDistancias[linha][coluna-1] != -1){
                    a.mapaDistancias[linha][coluna-1] = a.mapaDistancias[linha][coluna] + 1;
                    inundar(a, linha, coluna-1);
                } 
                if(a.mapaDistancias[linha][coluna+1] != -1){
                    a.mapaDistancias[linha][coluna+1] = a.mapaDistancias[linha][coluna] + 1;
                    inundar(a, linha, coluna+1);
                } 
            }  else {
                if((a.my != linha || a.mx != coluna) && a.mapaDistancias[linha-1][coluna] != -1){
                    if((a.my != linha-1 || a.mx != coluna) && a.mapaDistancias[linha-1][coluna] === 0 ){
                        a.mapaDistancias[linha-1][coluna] = a.mapaDistancias[linha][coluna] + 1;
                        inundar(a, linha-1, coluna);
                    } else if ((a.my != linha-1 || a.mx != coluna) && a.mapaDistancias[linha-1][coluna] > a.mapaDistancias[linha][coluna] + 1){
                        a.mapaDistancias[linha-1][coluna] = a.mapaDistancias[linha][coluna] + 1;
                        inundar(a, linha-1, coluna);
                    }
                }
                if((a.my != linha || a.mx != coluna) && a.mapaDistancias[linha+1][coluna] != -1){
                    if((a.my != linha+1 || a.mx != coluna) && a.mapaDistancias[linha+1][coluna] === 0){
                        a.mapaDistancias[linha+1][coluna] = a.mapaDistancias[linha][coluna] + 1;
                        inundar(a, linha+1, coluna);
                    } else if ((a.my != linha+1 || a.mx != coluna) && a.mapaDistancias[linha+1][coluna] > a.mapaDistancias[linha][coluna] + 1){
                        a.mapaDistancias[linha+1][coluna] = a.mapaDistancias[linha][coluna] + 1;
                        inundar(a, linha+1, coluna);
                    }
                }
                if((a.my != linha || a.mx != coluna) && a.mapaDistancias[linha][coluna-1] != -1){
                    if((a.my != linha || a.mx != coluna-1) && a.mapaDistancias[linha][coluna-1] === 0){
                        a.mapaDistancias[linha][coluna-1] = a.mapaDistancias[linha][coluna] + 1;
                        inundar(a, linha, coluna-1);
                    } else if ((a.my != linha || a.mx != coluna-1) && a.mapaDistancias[linha][coluna-1] > a.mapaDistancias[linha][coluna] + 1){
                        a.mapaDistancias[linha][coluna-1] = a.mapaDistancias[linha][coluna] + 1;
                        inundar(a, linha, coluna-1);
                    }
                }
                if((a.my != linha || a.mx != coluna) && a.mapaDistancias[linha][coluna+1] != -1){
                    if((a.my != linha || a.mx != coluna+1) && a.mapaDistancias[linha][coluna+1] === 0){
                        a.mapaDistancias[linha][coluna+1] = a.mapaDistancias[linha][coluna] + 1;
                        inundar(a, linha, coluna+1);
                    }else if ((a.my != linha || a.mx != coluna+1) && a.mapaDistancias[linha][coluna+1] > a.mapaDistancias[linha][coluna] + 1){
                        a.mapaDistancias[linha][coluna+1] = a.mapaDistancias[linha][coluna] + 1;
                        inundar(a, linha, coluna+1);
                    }
                }
            }
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