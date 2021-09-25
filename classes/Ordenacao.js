export default function Ordenacao(){

}

Ordenacao.prototype = new Ordenacao();              
Ordenacao.prototype.constructor = Ordenacao;

Ordenacao.prototype.quickSort = function(params = {}) {   // Lista generica
    //lista, inicio, fim, ordem
    if(params.ordem === 0){    //Crescente
        this.auxQuickSortCrescente(params.lista, params.inicio, params.fim);
    }
    else{               //Decrescente
        this.auxQuickSortDecrescente(params.lista, params.inicio, params.fim);
    }
}

Ordenacao.prototype.quickSort = function(params = {}) {
    //lista, inicio, fim, criterio, ordem
    switch(params.criterio){
        case 0:                 // Eixo x
            if(params.ordem === 0){    //Crescente
                this.auxQuickSortCrescenteX(params.lista, params.inicio, params.fim);
            }
            else{
                this.auxQuickSortDecrescenteX(params.lista, params.inicio, params.fim);
            }            
            break;
        case 1:                 // Eixo y
            if(params.ordem === 0){    //Crescente
                this.auxQuickSortCrescenteY(params.lista, params.inicio, params.fim);
            }
            else{
                this.auxQuickSortDecrescenteY(params.lista, params.inicio, params.fim);
            }      
            break;
    }
}

// ================ Genérico para listas ==============================

Ordenacao.prototype.auxQuickSortCrescente = function(lista, inicio, fim) {
    if(inicio < fim)
    {	
        let p = this.partitionCrescente(lista, inicio, fim);
        this.auxQuickSortCrescente(lista, inicio, p - 1);
        this.auxQuickSortCrescente(lista, p + 1, fim);
    }
}

Ordenacao.prototype.auxQuickSortDecrescente = function(lista, inicio, fim) {
    if(inicio < fim)
    {	
        let p = this.partitionDecrescente(lista, inicio, fim);
        this.auxQuickSortDecrescente(lista, inicio, p - 1);
        this.auxQuickSortDecrescente(lista, p + 1, fim);
    }
}

// ================ Eixo X ====================================

Ordenacao.prototype.auxQuickSortCrescenteX = function(lista, inicio, fim) {
    if(inicio < fim)
    {	
        let p = this.partitionCrescenteX(lista, inicio, fim);
        this.auxQuickSortCrescenteX(lista, inicio, p - 1);
        this.auxQuickSortCrescenteX(lista, p + 1, fim);
    }
}

Ordenacao.prototype.auxQuickSortDecrescenteX = function(lista, inicio, fim) {
    if(inicio < fim)
    {	
        let p = this.partitionDecrescenteX(lista, inicio, fim);
        this.auxQuickSortDecrescenteX(lista, inicio, p - 1);
        this.auxQuickSortDecrescenteX(lista, p + 1, fim);
    }
}

// ================ Eixo Y ====================================

Ordenacao.prototype.auxQuickSortCrescenteY = function(lista, inicio, fim) {
    if(inicio < fim)
    {	
        let p = this.partitionCrescenteY(lista, inicio, fim);
        this.auxQuickSortCrescenteY(lista, inicio, p - 1);
        this.auxQuickSortCrescenteY(lista, p + 1, fim);
    }
}

Ordenacao.prototype.auxQuickSortDecrescenteY = function(lista, inicio, fim) {
    if(inicio < fim)
    {	
        let p = this.partitionDecrescenteY(lista, inicio, fim);
        this.auxQuickSortDecrescenteY(lista, inicio, p - 1);
        this.auxQuickSortDecrescenteY(lista, p + 1, fim);
    }
}

/********************************************************
 * Partition criada no quicksort pra cada variação dele *
 ********************************************************/

// ================ Genérico para listas =====================

Ordenacao.prototype.partitionCrescente = function(lista, inicio, fim) {
    //If you want to implement randomized quick sort
    // just uncomment the next two lines of code
    //int p = inicio + (int)Math.random()*((fim-inicio)+1); 
    //swap(lista, inicio, p);
    let p = inicio;
    for(let n = p + 1; n <= fim; n++){
        if(lista[n] < lista[p]){	
            this.swap(lista, n, p+1);
            this.swap(lista, p, p+1);
            p++;
        }
    }
    return p;
}

Ordenacao.prototype.partitionDecrescente = function(lista, inicio, fim) {
    let p = inicio;
    for(let n = p + 1; n <= fim; n++){
        if(lista[n] > lista[p]){	
            this.swap(lista, n, p+1);
            this.swap(lista, p, p+1);
            p++;
        }
    }
    return p;
}

// ================ Eixo X ====================================

Ordenacao.prototype.partitionCrescente = function(lista, inicio, fim) {
    //If you want to implement randomized quick sort
    // just uncomment the next two lines of code
    //int p = inicio + (int)Math.random()*((fim-inicio)+1); 
    //swap(lista, inicio, p);
    let p = inicio;
    for(let n = p + 1; n <= fim; n++){
        if(lista[n].x < lista[p].x){	
            this.swap(lista, n, p+1);
            this.swap(lista, p, p+1);
            p++;
        }
    }
    return p;
}

Ordenacao.prototype.partitionDecrescente = function(lista, inicio, fim) {
    let p = inicio;
    for(let n = p + 1; n <= fim; n++){
        if(lista[n].x > lista[p].x){	
            this.swap(lista, n, p+1);
            this.swap(lista, p, p+1);
            p++;
        }
    }
    return p;
}

// ================ Eixo Y ====================================

Ordenacao.prototype.partitionCrescenteY = function(lista, inicio, fim) {
    //If you want to implement randomized quick sort
    // just uncomment the next two lines of code
    //int p = inicio + (int)Math.random()*((fim-inicio)+1); 
    //swap(lista, inicio, p);
    let p = inicio;
    for(let n = p + 1; n <= fim; n++){
        if(lista[n].y < lista[p].y){	
            this.swap(lista, n, p+1);
            this.swap(lista, p, p+1);
            p++;
        }
    }
    return p;
}

Ordenacao.prototype.partitionDecrescenteY = function(lista, inicio, fim) {
    let p = inicio;
    for(let n = p + 1; n <= fim; n++){
        if(lista[n].y > lista[p].y){	
            this.swap(lista, n, p+1);
            this.swap(lista, p, p+1);
            p++;
        }
    }
    return p;
}

/**
 * Swap -> Método usado para trocar elementos
 */

Ordenacao.prototype.swap = function(lista, indice1, indice2) {
    let aux = lista[indice1];
    lista[indice1] = lista[indice2];
    lista[indice2] = aux;
}