function Path(linhas, colunas, size){
    this.LINHAS = linhas;
    this.COLUNAS = colunas;
    this.SIZE = size;
    this.steps = [];
    for (let l = 0; l < this.linhas; l++) {
        this.steps[l] = [];
        for (let c = 0; c < this.colunas; c++) {
            this.steps[l][c] = 0;
        }
    }
}

Path.prototype.desenhar = function(ctx){
    for (let l = 0; l < this.LINHAS; l++) {
        for (let c = 0; c < this.COLUNAS; c++) {
            ctx.font = "15px Arial";
            ctx.fillStyle = "blue";
            if(this.steps[l][c] === 1){
                ctx.fillText(" O ", c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 + 10);
            }
            ctx.strokeRect(c*this.SIZE, l*this.SIZE, this.SIZE, this.SIZE); 
        }
    }
}

Path.prototype.addStep = function(x,y){
    this.steps[x][y] = 1;
}

Path.prototype.removeStep = function(x,y){
    this.steps[x][y] = 1;
}