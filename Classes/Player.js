function Player(params) {
  /**
   * Estabelece a relação de Herança entre Player e Sprite:
   *  -> Sprite é pai e player é filho
   */
  Sprite.call(this, {s: params.s, w: 16, h: 16,
    hitBox: {
      x: 0,
      y: 0,
      w: 16,
      h: 16,
    }
  });            

  let exemplo = {
    timeWalkSound: 0.5,
    levelNumber: 1,
    vidas: 3,
    vivo: true,
    room: -1,
    tesourosColetados: 0,
    playerVel: 180, // 100
    cooldownTeleporte: 1,
    cooldownAtaque: 1,                  //Tempo do personagem travado até terminar o ataque            

    // Mapa das teclas pressionadas
    teclas: {
      up: false,
      down: false,
      right: false,
      left: false,
      ctrl: false,
      shift: false,
      space: false
    },

    // AnimationStates
    sentidoMovimento: 0,          //0 => direita, 1 => baixo, 2 => esquerda, 3 => cima
    atacando: 0,                  //0 => Não, 1 => Sim
    estadoAnimacaoAtual: 3,
    poseAtual: 0,
    animation: [],
    numAnimacoes: 8,
    nomeImagem: "player"
  }

  Object.assign(this, exemplo, params);   // Sobrescreve os atributos de params e exemplo na classe

  this.criarAnimacoes();
}

// Heranca
Player.prototype = new Sprite();              // Define que o Player é um Sprite
Player.prototype.constructor = Player;

Player.prototype.restart = function(){
  this.vivo = true;
  this.tesourosColetados = 0;
  this.setRoom();
}

Player.prototype.setRoom = function(){
  this.room = this.map.cell[this.gy][this.gx].room;
}

Player.prototype.moverCompleto = function(dt){
  this.cooldownTeleporte = this.cooldownTeleporte - dt;         // Cooldown de teleporte pra não teleportar direto
  this.tratarAnimacao();
  this.controlePorTeclas();
  if(this.cooldownAtaque < 0){
    this.mover(dt);
  }
  this.animationController();
}

Player.prototype.criarAnimacoes = function(){
  let typeNames = ["Walk", "Atack"];

  // Cria a lista de tipos de animações
  for(let i = 0; i < typeNames.length; i++){
    let auxAnimation = {
        animationPosition: [],
        type: typeNames[i],
        qtdPositions: 4
    }
    if(i === 0){
      for(let j = 0; j < 4; j++){             //  4 Direções
        let auxAnimationPosition = {
          animationFrame: [],
          speedAnimation: 10,  //160
          qtdAnimacoes: 9,
          sw: 64,
          sh: 64,
          sxBegin: 0,
          syBegin: (8 + j) * 64,
        }
        auxAnimation.animationPosition.push(auxAnimationPosition);
      }
    }
    else{
      for(let j = 0; j < 4; j++){             //  4 Direções
        let auxAnimationPosition = {
          animationFrame: [],
          speedAnimation: 10,
          qtdAnimacoes: 6,
          sw: 64,
          sh: 64,
          sxBegin: 0,
          syBegin: (12 + j) * 64,
        }
        auxAnimation.animationPosition.push(auxAnimationPosition);
      }
    }  
    this.animation.push(auxAnimation);
  }

  for(let i = 0; i < this.animation.length; i++){                 //Walk, Atack
    let auxAnimation = this.animation[i].animationPosition;
    for(let j = 0; j < auxAnimation.length; j++){  //4 posições
      let posicao = auxAnimation[j];
      for(let k = 0; k < posicao.qtdAnimacoes; k++){            //Monta o vetor de frames de animação
        let auxAnimationFrame = {
          sx: posicao.sxBegin + (posicao.sw * k),
          sy: posicao.syBegin,
          sw: posicao.sw,
          sh: posicao.sh,
        };
        posicao.animationFrame.push(auxAnimationFrame);
      }
    }
  }

  /*for(let i = 0; i < this.numAnimacoes; i++){
    let animationFrame = {
      sizeImagem: 64,
      pose: 0,
      qtdAnimacoes: 0,
      typeAnimation: 0,
      speedAnimation: 160
      //sx: 16 * j,
      //sy: 24 * i,
    };
    this.animation.push(animationFrame);
  }
  this.animation[0].pose = 8;                   // Localização do sprite na spriteSheet
  this.animation[0].qtdAnimacoes = 9;   //8
  this.animation[0].typeAnimation = 0;

  this.animation[1].pose = 9;
  this.animation[1].qtdAnimacoes = 9;
  this.animation[1].typeAnimation = 0;

  this.animation[2].pose = 10;
  this.animation[2].qtdAnimacoes = 9;
  this.animation[2].typeAnimation = 0;
  
  this.animation[3].pose = 11;
  this.animation[3].qtdAnimacoes = 9;
  this.animation[3].typeAnimation = 0;

  // Ataques

  this.animation[4].pose = 12;
  this.animation[4].qtdAnimacoes = 6;
  this.animation[4].typeAnimation = 1;
  this.animation[4].speedAnimation = 160;

  this.animation[5].pose = 13;
  this.animation[5].qtdAnimacoes = 6;
  this.animation[5].typeAnimation = 1;
  this.animation[5].speedAnimation = 160;

  this.animation[6].pose = 14;
  this.animation[6].qtdAnimacoes = 6;
  this.animation[6].typeAnimation = 1;
  this.animation[6].speedAnimation = 160;

  this.animation[7].pose = 15;
  this.animation[7].qtdAnimacoes = 6;
  this.animation[7].typeAnimation = 1;
  this.animation[7].speedAnimation = 160;*/
}

Player.prototype.controlePorTeclas = function(){
  // Teclas direcionais
  if(this.teclas.up){this.vy = - this.playerVel; this.sentidoMovimento = 0;}
  if(this.teclas.right){this.vx = this.playerVel; this.sentidoMovimento = 3;}
  if(this.teclas.down){this.vy = this.playerVel; this.sentidoMovimento = 2;}
  if(this.teclas.left){this.vx = - this.playerVel; this.sentidoMovimento = 1;}

  // Teclas com ações a mais
  if(this.teclas.ctrl){this.atacando = 1; this.cooldownAtaque = 1;} //else{ this.atacando = 0;}
  if(this.teclas.shift){this.playerVel = 250;  /* 180*/} else {this.playerVel = 180}
  //if(this.teclas.space){this.vx = -playerVel; this.sentidoMovimento = 2;}


  // Condição de parada
  if(this.teclas.right === this.teclas.left) { this.vx = 0; }
  if(this.teclas.up === this.teclas.down) { this.vy = 0; }
}

Player.prototype.tratarAnimacao = function(){
  switch (this.sentidoMovimento) {  //Movimento
    case 0:     //Direita
      //this.estadoAnimacaoAtual = 3;
      this.hitBox.x = this.x + this.w/2;
      this.hitBox.y = this.y;
      break;
    case 1:     //Baixo
      //this.estadoAnimacaoAtual = 2;
      this.hitBox.x = this.x;
      this.hitBox.y = this.y + this.h/2;
      break;
    case 2:     //Esquerda
      //this.estadoAnimacaoAtual = 1;
      this.hitBox.x = this.x - this.w/2;
      this.hitBox.y = this.y;
      break;
    case 3:     //Cima
      //this.estadoAnimacaoAtual = 0;
      this.hitBox.x = this.x;
      this.hitBox.y = this.y - this.h/2;
      break;
    default:
      break;
  }
  switch(this.atacando){
    case 0:
      break;
    case 1:
      //console.log("Atacando");
      this.estadoAnimacaoAtual = this.estadoAnimacaoAtual + 4;    
      break;
    default:
      break;
  }

  /*this.sizeImagem = this.animation[this.estadoAnimacaoAtual].sizeImagem;
  this.qtdAnimacoes = this.animation[this.estadoAnimacaoAtual].qtdAnimacoes;
  this.pose = this.animation[this.estadoAnimacaoAtual].pose;
  this.typeAnimation = this.animation[this.estadoAnimacaoAtual].typeAnimation;
  this.speedAnimation = this.animation[this.estadoAnimacaoAtual].speedAnimation;*/
  this.speedAnimation = this.animation[this.atacando].animationPosition[this.sentidoMovimento].speedAnimation;
  
}

Player.prototype.animationController = function(){
  /*if(this.typeAnimation == 0){
    if(this.vx !== 0 || this.vy !== 0){
      this.frameTimeAnimation = this.frameTimeAnimation - this.speedAnimation*dt;
      if(this.frameTimeAnimation < 0){
        this.frameTimeAnimation = 12;
        this.animationState = this.animationState + 1;
      }
    }
    else{
      this.frameTimeAnimation = 12;
      this.animationState = 0;
    }
  }
  else{
    this.frameTimeAnimation = this.frameTimeAnimation - this.speedAnimation*dt;
    if(this.frameTimeAnimation < 0){
      this.frameTimeAnimation = 12;
      this.animationState = this.animationState + 1;
    }
  }*/

  this.pose = this.pose + this.speedAnimation * dt;
  if(this.atacando === 0){
    if(this.vx === 0 && this.vy === 0){     // Personagem parado a pose se mantem
      this.pose = 0;      
    }
  }
  /*else{
    
  }*/

  if(this.cooldownAtaque < 0){
    this.atacando = 0;
  }
  else {
    // Retorna pra animação inicial se o ataque já tiver concluido o ciclo
    if(this.pose > this.animation[this.atacando].animationPosition[this.sentidoMovimento].qtdAnimacoes){
      this.pose = 0;
    }
  }
  
  this.cooldownAtaque = this.cooldownAtaque - 2 * dt;
}


Player.prototype.teste = function(){
  console.log(this.animation[this.atacando].animationPosition[this.sentidoMovimento]);
}

Player.prototype.desenhar = function(ctx){
  let auxAnimation = this.animation[this.atacando].animationPosition[this.sentidoMovimento];  // Dados da animação do personagem
  // tipo de animação -- sentido de movimento -- vetor de frames de animação

  let elipse = {
    x: -auxAnimation.sw/8 + 8,
    y: -auxAnimation.sh/16 + 3,
    radiusX: auxAnimation.sw/4 - 2,
    radiusY: auxAnimation.sh/8 - 2,
    rotation: 0,
    startAngle: 0,
    endAngle: 2 * Math.PI,
    anticlockwise: false
  }
  ctx.linewidth = 1;
  ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
  ctx.strokeStyle = "rgba(10, 10, 10, 0.4)";
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.beginPath();
  ctx.ellipse(elipse.x, elipse.y, elipse.radiusX, elipse.radiusY, elipse.rotation, elipse.startAngle, 
    elipse.endAngle, elipse.anticlockwise); //ctx.ellipse(-this.s/2 + 7, -this.s/4 + 6, this.s - 2, this.s/2 - 2, 0, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  //ctx, key, sx, sy, w, h, dx, dy, dw, dh
  /*assetsMng.drawClipSize({ctx: ctx, key: this.nomeImagem, 
    sx: (this.sizeImagem * (this.animationState % this.qtdAnimacoes)),
    sy: (this.sizeImagem * this.pose), w: this.sizeImagem, h: this.sizeImagem, 
    dx: (- this.sizeImagem/2 ), dy: (5 - this.sizeImagem),  dw: this.sizeImagem, dh: this.sizeImagem
  });*/
  
  assetsMng.drawClipSize({ctx: ctx, key: this.nomeImagem, 
    sx: (auxAnimation.animationFrame[(Math.floor(this.pose) % auxAnimation.qtdAnimacoes)].sx),
    sy: (auxAnimation.animationFrame[(Math.floor(this.pose) % auxAnimation.qtdAnimacoes)].sy),
    w: auxAnimation.animationFrame[(Math.floor(this.pose) % auxAnimation.qtdAnimacoes)].sw, 
    h: auxAnimation.animationFrame[(Math.floor(this.pose) % auxAnimation.qtdAnimacoes)].sh, 
    dx: (- auxAnimation.sw/2), dy: (5 - auxAnimation.sh),  dw: auxAnimation.sw, dh: auxAnimation.sh
  });
  ctx.restore();
  if(debugMode == 1){
    this.desenharCell(ctx);         //Debug mode Grid
    this.desenharCentro(ctx);
    this.desenharCentroHitBox(ctx);
  }
  else if(debugMode == 2){
    this.desenharCell(ctx);         //Debug mode Grid    
    this.desenharCaixaColisao(ctx);
    this.desenharCentro(ctx);
    this.desenharCentroHitBox(ctx);
  }
}

Player.prototype.desenharCaixaColisao = function(ctx){
  // hurt box => danifica o personagem
  ctx.fillStyle = "red";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.fillRect(- this.w/2, - this.h/2, this.w, this.h);
  ctx.strokeRect(- this.w/2, - this.h/2, this.w, this.h);
  ctx.restore();
  
  if(this.atacando){
    // hurt box => danifica o personagem
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.save();
    ctx.translate(this.hitBox.x, this.hitBox.y);
    //ctx.fillRect(this.w/2, this.h/2, -this.w, this.h);
    //ctx.strokeRect(this.w/2, this.h/2, -this.w, this.h);
    ctx.fillRect(-this.hitBox.w/2, -this.hitBox.h/2, this.hitBox.w, this.hitBox.h);
    ctx.strokeRect(-this.hitBox.w/2, -this.hitBox.h/2, this.hitBox.w, this.hitBox.h);
    ctx.restore();
    /*switch (this.sentidoMovimento) {  //Movimento
      case 0:     //Direita
        this.estadoAnimacaoAtual = 3;
        break;
      case 1:     //Baixo
        this.estadoAnimacaoAtual = 2;
        break;
      case 2:     //Esquerda
        this.estadoAnimacaoAtual = 1;
        break;
      case 3:     //Cima
        this.estadoAnimacaoAtual = 0;
        break;
      default:
        break;
    }*/
  }
}
/**
 * Mover que usa WIDTH e HEIGHT como referência no movimento
 */
Player.prototype.mover = function (dt) {
  this.gx = Math.floor(this.x/this.map.s);
  this.gy = Math.floor(this.y/this.map.s);

  if(debugMode === 0 || debugMode === 2){
    if(this.gx === 0 || this.gx === (this.map.w - 1))  // Trata casos extremos do mapa =>{gx <= 0, gx >= gxMapa}
    {
      if(this.gx === 0){
        if(this.vx < 0){
          var limite = (this.gx) * this.map.s;
          var maxDx = limite - (this.x - this.w/2);
          var Dx = this.vx * dt;
          this.x += Math.max(Dx, maxDx);
        } else if( this.vx > 0 && this.map.cell[this.gy][this.gx + 1].tipo === 1){
          var limite = (this.gx + 1) * this.map.s;
          var maxDx = limite - (this.x + this.w/2);
          var Dx = this.vx * dt;
          this.x += Math.min(Dx, maxDx);
        }else {
          this.x += this.vx * dt;
        }
      }
      else{
        if(this.vx < 0 && this.map.cell[this.gy][this.gx - 1].tipo === 1){
          var limite = (this.gx) * this.map.s;
          var maxDx = limite - (this.x - this.w/2);
          var Dx = this.vx * dt;
          this.x += Math.max(Dx, maxDx);
        } else if( this.vx > 0){
          var limite = (this.gx + 1) * this.map.s;
          var maxDx = limite - (this.x + this.w/2);
          var Dx = this.vx * dt;
          this.x += Math.min(Dx, maxDx);
        }else {
          this.x += this.vx * dt;
        }
      }
    }
    else{
      if(this.vx < 0 && this.map.cell[this.gy][this.gx - 1].tipo === 1){
        var limite = (this.gx) * this.map.s;
        var maxDx = limite - (this.x - this.w/2);
        var Dx = this.vx * dt;
        this.x += Math.max(Dx, maxDx);
      } else if( this.vx > 0 && this.map.cell[this.gy][this.gx + 1].tipo === 1){
        var limite = (this.gx + 1) * this.map.s;
        var maxDx = limite - (this.x + this.w/2);
        var Dx = this.vx * dt;
        this.x += Math.min(Dx, maxDx);
      }else {
        this.x += this.vx * dt;
      }
    }

    if(this.gy === 0 || this.gy === (this.map.h - 1))  // Trata casos extremos do mapa =>{gy <= 0, gy >= gyMapa}
    {
      if(this.gy === 0){
        if(this.vy < 0){
          var limite = (this.gy) * this.map.s;
          var maxDy = limite - (this.y - this.h/2);
          var Dy = (this.vy) * dt;
          this.y += Math.max(Dy, maxDy);
        } else if((this.vy) > 0 && this.map.cell[this.gy + 1][this.gx].tipo !== 0){
          var limite = (this.gy + 1) * this.map.s;
          var maxDy = limite - (this.y + this.h/2);
          var Dy = (this.vy) * dt;
          this.y += Math.min(Dy, maxDy);
        }else {
          this.y += (this.vy) * dt;
        }
      }
      else{
        if((this.vy) < 0 && this.map.cell[this.gy - 1][this.gx].tipo !== 0){
          var limite = (this.gy) * this.map.s;
          var maxDy = limite - (this.y - this.h/2);
          var Dy = (this.vy) * dt;
          this.y += Math.max(Dy, maxDy);
        } else if((this.vy) > 0){
          var limite = (this.gy + 1) * this.map.s;
          var maxDy = limite - (this.y + this.h/2);
          var Dy = (this.vy) * dt;
          this.y += Math.min(Dy, maxDy);
        }else {
          this.y += (this.vy) * dt;
        }
      }
    }
    else{
      if((this.vy) < 0 && this.map.cell[this.gy - 1][this.gx].tipo !== 0){
        var limite = (this.gy) * this.map.s;
        var maxDy = limite - (this.y - this.h/2);
        var Dy = (this.vy) * dt;
        this.y += Math.max(Dy, maxDy);
      } else if((this.vy) > 0 && this.map.cell[this.gy + 1][this.gx].tipo !== 0){
        var limite = (this.gy + 1) * this.map.s;
        var maxDy = limite - (this.y + this.h/2);
        var Dy = (this.vy) * dt;
        this.y += Math.min(Dy, maxDy);
      }else {
        this.y += (this.vy) * dt;
      }
    }
  }
  else{   // Debug mode => Colision is not detected
    this.x += (this.vx) * dt;
    this.y += (this.vy) * dt;
  }
}
