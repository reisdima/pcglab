export default class Path{
    constructor(layer = null){
        this.layer = layer;
        this.LINHAS = this.layer.LINHAS;
        this.COLUNAS = this.layer.COLUNAS;
        this.SIZE = this.layer.SIZE;
        this.tiles = [];
        this.caminho = [];
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = 0;
            }
        }
    }

    desenhar(ctx){
        for (let l = 0; l < this.LINHAS; l++) {
            for (let c = 0; c < this.COLUNAS; c++) {
                /*ctx.font = "15px Arial";
                ctx.fillStyle = "blue";
                ctx.fillText(this.caminho[l][c], c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 + 10);*/
                if(this.caminho[l][c] === "<"){
                    ctx.drawImage(this.layer.cena.assets.img("setaO"), c*this.SIZE + 11, l*this.SIZE + 11, 25, 25);
                }
                if(this.caminho[l][c] === ">"){
                    ctx.drawImage(this.layer.cena.assets.img("setaL"), c*this.SIZE + 11, l*this.SIZE + 11, 25, 25);
                }
                if(this.caminho[l][c] === "^"){
                    ctx.drawImage(this.layer.cena.assets.img("setaN"), c*this.SIZE + 11, l*this.SIZE + 11, 25, 25);
                }
                if(this.caminho[l][c] === "v"){
                    ctx.drawImage(this.layer.cena.assets.img("setaS"), c*this.SIZE + 11, l*this.SIZE + 11, 25, 25);
                }

                ctx.strokeRect(c*this.SIZE, l*this.SIZE, this.SIZE, this.SIZE); 
            }
        }
    }

    calculaCaminho(){ // percorre caminho
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles[l] = [];
            this.caminho[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = this.layer.direcoes[l][c];
                this.caminho[l][c] = " ";
            }
        }

        let mxAtual = this.layer.mxEntrada;
        let myAtual = this.layer.myEntrada;

        while(mxAtual != this.layer.mxSaida || myAtual != this.layer.mySaida){
            if(this.tiles[myAtual][mxAtual] === "O"){
                this.caminho[myAtual][mxAtual] = "<";
                mxAtual = mxAtual-1;
            }
            if(this.tiles[myAtual][mxAtual] === "L"){
                this.caminho[myAtual][mxAtual] = ">";
                mxAtual = mxAtual+1;
                
            }
            if(this.tiles[myAtual][mxAtual] === "N"){
                this.caminho[myAtual][mxAtual] = "^";
                myAtual = myAtual-1; 
                
            }
            if(this.tiles[myAtual][mxAtual] === "S"){
                this.caminho[myAtual][mxAtual] = "v";
                myAtual = myAtual+1;
                
            }
        }

    }
}
