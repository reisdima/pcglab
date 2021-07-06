function Path(linhas, colunas, size){
    this.linhas = linhas;
    this.colunas = colunas;
    this.size = size;
    this.steps = [];
    for (let l = 0; l < this.linhas; l++) {
        this.steps[l] = [];
        for (let c = 0; c < this.colunas; c++) {
            this.steps[l][c] = 0;
        }
    }
}