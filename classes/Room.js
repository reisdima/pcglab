import Teleporter, { TeleporterType } from "./Teleporter.js";
import Cell from "./Cell.js";
import FireZone from "./FireZone.js";
import Treasure from "./Treasure.js";
import Enemy from "./Entities/Enemy.js";
import Path from "./Path.js";
import { converteTelaCheia, escreveTexto } from "./Utils.js";
import Slime from "./Entities/Slime.js";
import Debugger, { DEBUG_MODE } from "./utils/Debugger.js";

export default class Room {
	constructor(number) {
		this.blocks = [];
		this.indexTesouros = [];
		this.indexTesourosColetados = [];
		this.pontosInteresse = [];
		this.matrizDistancias = [];
		this.rotaPercurso = [];
		this.achouEntrada = false;
		this.achouSaida = false;
		this.achouTesouros = false;
		this.saida = -1; // Index do bloco de teleporte de saída do room
		this.entrada = -1; // Index do bloco de teleporte de entrada do room
		this.number = number;
		this.teleporterInitial = new Teleporter(TeleporterType.InicioSala); // (Inicio)Transição de uma sala pra outra
		this.teleporterFinal = new Teleporter(TeleporterType.FimSala); // (Chegada)Transição de uma sala pra outra
		this.endingLevel; // Teleportador que termina a fase
		this.beginLevel; // Teleportador que Inicia a fase
		this.fireZones = []; // Area para a recarga do tempo
		this.treasures = []; // Lista de tesouros
		this.enemies = []; // Lista de inimigos
		this.pathGPS = new Path(); // Path GPS até a saída
		this.pathRoom = new Path(); // Path Teleporte - Teleporte
		this.pathTesouros = new Path(); // Path passando por todos os tesouros
		this.pathPlayer = new Path();
		this.poderSala = 0;

		// Mapa Influencia
		this.mapaInfluencia = {
			influenciaPoder: 0,
		}

		// Distancias
		this.distancias = {
			maxTeleportes: 999,
			maxFirezones: 0,
			maxTesouros: 0,
			maxInimigos: 999,
			compostas: {
				inimigosTeleportes: {
					max: 999,
					//min: 0,
				},
				inimigo_Tesouro_Teleporte: {
					max: 999,
					//min: 0,
				},
			},
		};
	}

	addBlock(row, column) {
		let aux = [];
		aux.push(row);
		aux.push(column);
		this.blocks.push(aux);
	};

	removeBlockByArrayIndex(index) {
		this.blocks.splice(index, 1);
	};

	removeBlockByMatrixIndex(row, column) {
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i][0] === row && this.blocks[i][1] === column) {
				this.blocks.splice(i, 1);
				break;
			}
		}
	};

	// Procura 1 celula da sala que possui distancia value
	getCellByDist(value, option) {
		switch (option) {
			case 0: // Teleportes
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].distTeleportes == value) {
						return this.blocks[i];
					}
				}
				return null; // Não encontrou nenhuma celula com a distancia determinada
				break;
			case 1: // Firezones
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].distFirezones == value) {
						return this.blocks[i];
					}
				}
				return null; // Não encontrou nenhuma celula com a distancia determinada
				break;
			case 2: // Inimigos
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].distInimigos == value) {
						return this.blocks[i];
					}
				}
				return null; // Não encontrou nenhuma celula com a distancia determinada
				break;
			case 3: // Tesouros
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].distTesouros == value) {
						return this.blocks[i];
					}
				}
				return null; // Não encontrou nenhuma celula com a distancia determinada
				break;
		}
	};

	// Procura LISTA de celulas da sala que possui distancia MAIOR OU IGUAL a Value
	getCellsByDist(value, option) {
		let listCells = [];
		switch (option) {
			case 0: // Teleportes
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].distTeleportes >= value) {
						listCells.push(this.blocks[i]);
					}
				}
				break;
			case 1: // Firezones
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].distFirezones >= value) {
						listCells.push(this.blocks[i]);
					}
				}
				break;
			case 2: // Inimigos
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].distInimigos >= value) {
						listCells.push(this.blocks[i]);
					}
				}
				break;
			case 3: // Tesouros
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].distTesouros >= value) {
						listCells.push(this.blocks[i]);
					}
				}
				break;
		}

		return listCells;
	};

	// Retorna somente celulas que não tem nenhum outro elemento
	// Procura LISTA de celulas da sala que possui distancia DENTRO DO INTERVALO DA MAIOR DISTANCIA
	getEmptyCellsByPercentageBetweenMaxDist(params) {
		let listCells = [];
		let maxDist;
		let minimalValue; // Menor elemento dentro da porcentagem correspondente
		switch (params.option) {
			case 0: // Teleportes
				maxDist = this.getMaxDist(0);
				minimalValue = Math.floor((params.porcentagem * maxDist) / 100); // Menor elemento no intervalo
				for (let i = 0; i < this.blocks.length; i++) {
					if (
						this.blocks[i].distFirezones !== 0 &&
						this.blocks[i].distInimigos !== 0 &&
						this.blocks[i].distTesouros !== 0
					) {
						// Descarta celulas com outros elementos
						if (this.blocks[i].distTeleportes >= minimalValue) {
							listCells.push(this.blocks[i]);
						}
					}
				}
				break;
			case 1: // Firezones
				maxDist = this.getMaxDist(1);
				minimalValue = Math.floor((params.porcentagem * maxDist) / 100); // Menor elemento no intervalo
				for (let i = 0; i < this.blocks.length; i++) {
					if (
						this.blocks[i].distTeleportes !== 0 &&
						this.blocks[i].distInimigos !== 0 &&
						this.blocks[i].distTesouros !== 0
					) {
						// Descarta celulas com outros elementos
						if (this.blocks[i].distFirezones >= minimalValue) {
							listCells.push(this.blocks[i]);
						}
					}
				}
				break;
			case 2: // Inimigos
				maxDist = this.getMaxDist(2);
				minimalValue = Math.floor((params.porcentagem * maxDist) / 100); // Menor elemento no intervalo
				for (let i = 0; i < this.blocks.length; i++) {
					if (
						this.blocks[i].distTeleportes !== 0 &&
						this.blocks[i].distFirezones !== 0 &&
						this.blocks[i].distTesouros !== 0
					) {
						// Descarta celulas com outros elementos
						if (this.blocks[i].distInimigos >= minimalValue) {
							listCells.push(this.blocks[i]);
						}
					}
				}
				break;
			case 3: // Tesouros
				maxDist = this.getMaxDist(3);
				minimalValue = Math.floor((params.porcentagem * maxDist) / 100); // Menor elemento no intervalo
				for (let i = 0; i < this.blocks.length; i++) {
					if (
						this.blocks[i].distTeleportes !== 0 &&
						this.blocks[i].distFirezones !== 0 &&
						this.blocks[i].distInimigos !== 0
					) {
						// Descarta celulas com outros elementos
						if (this.blocks[i].distTesouros >= minimalValue) {
							listCells.push(this.blocks[i]);
						}
					}
				}
				break;
		}

		return listCells;
	};

	/**
	 * Retorna a maior distancia na matriz dentre os atributos determinados
	 */
	getMaxDist(option) {
		let value = 0;
		switch (option) {
			case 0: // Teleportes
				for (let i = 0; i < this.blocks.length; i++) {
					let bloco = this.blocks[i];
					if (bloco.distTeleportes >= value) {
						value = bloco.distTeleportes;
					}
				}
				break;
			case 1: // Firezones
				for (let i = 0; i < this.blocks.length; i++) {
					let bloco = this.blocks[i];
					if (bloco.distFirezones >= value) {
						value = bloco.distFirezones;
					}
				}
				break;
			case 2: // Inimigos
				for (let i = 0; i < this.blocks.length; i++) {
					let bloco = this.blocks[i];
					if (bloco.distInimigos >= value) {
						value = bloco.distInimigos;
					}
				}
				break;
			case 3: // Tesouros
				for (let i = 0; i < this.blocks.length; i++) {
					let bloco = this.blocks[i];
					if (bloco.distTesouros >= value) {
						value = bloco.distTesouros;
					}
				}
				break;

			/*********************************************
			 *           DISTANCIAS COMPOSTAS            *
			 *********************************************/

			case 4: {
				// Inimigos + Teleportes
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].distInimigoTeleporte() >= value) {
						value = this.blocks[i].distInimigoTeleporte();
					}
				}
				break;
			}

			case 5: {
				// Inimigos + Teleportes + Tesouros
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].distInimigo_Tesouro_Teleporte() >= value) {
						value = this.blocks[i].distInimigo_Tesouro_Teleporte();
					}
				}
				break;
			}
		}
		return value;
	};

	getValorMaxMapaInfluencia(opcao) {
		let valor = 0;
		for (let i = 0; i < this.blocks.length; i++) {
			let bloco = this.blocks[i];
			if (bloco[opcao] > valor) {
				valor = bloco[opcao];
			}
		}
		return valor;
	}

	// Reseta a distancias da sala com o valor 999
	resetDistancia(option) {
		switch (option) {
			case 0: // Teleportes
				for (let i = 0; i < this.blocks.length; i++) {
					this.blocks[i].distTeleportes = 999;
				}
				break;
			case 1: // Firezones
				for (let i = 0; i < this.blocks.length; i++) {
					this.blocks[i].distFirezones = 999;
				}
				break;
			case 2: // Inimigos
				for (let i = 0; i < this.blocks.length; i++) {
					this.blocks[i].distInimigos = 999;
				}
				break;
			case 3: // Tesouros
				for (let i = 0; i < this.blocks.length; i++) {
					this.blocks[i].distTesouros = 999;
				}
				break;
		}
	};

	maxCamadaDistancias() {
		/*if(this.distancias.maxTeleportes === 0){
			this.distancias.maxTeleportes = this.getMaxDist(0);
			this.distancias.maxFirezones = this.getMaxDist(1);
			this.distancias.maxInimigos = this.getMaxDist(2);
			this.distancias.maxTesouros = this.getMaxDist(3);
	  
			// Distancias compostas
			this.distancias.compostas.inimigosTeleportes.max = this.getMaxDist(4);
		  }*/

		this.distancias.maxTeleportes = this.getMaxDist(0);
		this.distancias.maxFirezones = this.getMaxDist(1);
		this.distancias.maxInimigos = this.getMaxDist(2);
		this.distancias.maxTesouros = this.getMaxDist(3);

		// Distancias compostas
		this.distancias.compostas.inimigosTeleportes.max = this.getMaxDist(4);
		this.distancias.compostas.inimigo_Tesouro_Teleporte.max = this.getMaxDist(5);
	};

	move(dt, player) {
		if (Debugger.isDebugModeOn()) {
			for (let i = 0; i < this.fireZones.length; i++) {
				this.fireZones[i].mover(dt);
			}

			for (let i = 0; i < this.treasures.length; i++) {
				this.treasures[i].mover(dt);
			}

			/*for(let i = 0; i < this.enemies.length; i++){     
					this.enemies[i].movimento(dt);         
				} */
		} else {
			for (let i = 0; i < this.fireZones.length; i++) {
				this.fireZones[i].mover(dt);
			}

			for (let i = 0; i < this.treasures.length; i++) {
				this.treasures[i].mover(dt);
			}

			for (const indiceInimigo in this.enemies) {
				const enemy = this.enemies[indiceInimigo]
				enemy.persegue(player);
				enemy.movimento(dt);
			}
		}
	};

	draw(ctx) {
		for (let i = 0; i < this.fireZones.length; i++) {
			this.fireZones[i].desenhar(ctx);
		}
		this.teleporterInitial.desenhar(ctx);
		this.teleporterFinal.desenhar(ctx);

		for (let i = 0; i < this.treasures.length; i++) {
			this.treasures[i].desenhar(ctx);
		}

		for (const indiceInimigo in this.enemies) {
			const enemy = this.enemies[indiceInimigo];
			enemy.desenhar(dt);
		}
	};

	desenharCamadas(params = {}) {
		params.ctx.fillStyle = "yellow";
		params.ctx.strokeStyle = "black";
		params.ctx.lineWidth = 2;
		params.ctx.font = "10px Arial Black";

		switch (Debugger.getDebugMode()) {
			case DEBUG_MODE.DISTANCIA_TELEPORTES: // Teleportes
				for (let i = 0; i < this.blocks.length; i++) {
					//this.escreveTexto(params.ctx, this.blocks[i].distTeleportes + "", this.blocks[i].coluna * params.s + params.s / 2, this.blocks[i].linha * params.s + params.s / 2);

					params.ctx.save();
					params.ctx.fillStyle = `hsl(${(150 * this.blocks[i].distTeleportes) / this.distancias.maxTeleportes
						}, 100%, 50%)`;
					/*if(this.blocks[i].distTeleportes < Math.floor((25 * this.distancias.maxTeleportes)/100)){
								params.ctx.fillStyle = "rgb(153, 255, 51)";
							}
							else{
								if(this.blocks[i].distTeleportes < Math.floor((50 * this.distancias.maxTeleportes)/100)){
									params.ctx.fillStyle = "rgb(253, 253, 127)";
								}
								else{
									if(this.blocks[i].distTeleportes < Math.floor((75 * this.distancias.maxTeleportes)/100)){
										params.ctx.fillStyle = "rgb(255, 153, 51)";
									}
									else{
										params.ctx.fillStyle = "rgb(153, 0, 0)";
									}
								}
							}*/
					params.ctx.linewidth = 1;
					params.ctx.globalAlpha = 0.3;
					//ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
					params.ctx.fillRect(
						this.blocks[i].coluna * params.s,
						this.blocks[i].linha * params.s,
						params.s,
						params.s
					);
					//ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
					params.ctx.restore();
					params.ctx.fillStyle = "yellow";
					params.ctx.strokeStyle = "black";
					this.escreveTexto(
						params.ctx,
						this.blocks[i].distTeleportes,
						this.blocks[i].coluna * params.s + params.s / 2,
						this.blocks[i].linha * params.s + params.s / 2
					);
				}
				break;
			case DEBUG_MODE.DISTANCIA_FIREZONES: // Firezones
				for (let i = 0; i < this.blocks.length; i++) {
					params.ctx.save();
					params.ctx.fillStyle = `hsl(${(150 * this.blocks[i].distFirezones) / this.distancias.maxFirezones
						}, 100%, 50%)`;
					params.ctx.linewidth = 1;
					params.ctx.globalAlpha = 0.3;
					//ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
					params.ctx.fillRect(
						this.blocks[i].coluna * params.s,
						this.blocks[i].linha * params.s,
						params.s,
						params.s
					);
					//ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
					params.ctx.restore();
					params.ctx.fillStyle = "yellow";
					params.ctx.strokeStyle = "black";
					this.escreveTexto(
						params.ctx,
						this.blocks[i].distFirezones,
						this.blocks[i].coluna * params.s + params.s / 2,
						this.blocks[i].linha * params.s + params.s / 2
					);
				}
				break;
			case DEBUG_MODE.DISTANCIA_INIMIGOS: // Inimigos
				for (let i = 0; i < this.blocks.length; i++) {
					params.ctx.save();
					params.ctx.fillStyle = `hsl(${(150 * this.blocks[i].distInimigos) / this.distancias.maxInimigos
						}, 100%, 50%)`;
					params.ctx.linewidth = 1;
					params.ctx.globalAlpha = 0.3;
					//ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
					params.ctx.fillRect(
						this.blocks[i].coluna * params.s,
						this.blocks[i].linha * params.s,
						params.s,
						params.s
					);
					//ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
					params.ctx.restore();
					params.ctx.fillStyle = "yellow";
					params.ctx.strokeStyle = "black";
					this.escreveTexto(
						params.ctx,
						this.blocks[i].distInimigos,
						this.blocks[i].coluna * params.s + params.s / 2,
						this.blocks[i].linha * params.s + params.s / 2
					);
				}
				break;
			case DEBUG_MODE.DISTANCIA_TESOUROS: // Tesouros
				for (let i = 0; i < this.blocks.length; i++) {
					params.ctx.save();
					params.ctx.fillStyle = `hsl(${(150 * this.blocks[i].distTesouros) / this.distancias.maxTesouros
						}, 100%, 50%)`;
					params.ctx.linewidth = 1;
					params.ctx.globalAlpha = 0.3;
					//ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
					params.ctx.fillRect(
						this.blocks[i].coluna * params.s,
						this.blocks[i].linha * params.s,
						params.s,
						params.s
					);
					//ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
					params.ctx.restore();
					params.ctx.fillStyle = "yellow";
					params.ctx.strokeStyle = "black";
					this.escreveTexto(
						params.ctx,
						this.blocks[i].distTesouros,
						this.blocks[i].coluna * params.s + params.s / 2,
						this.blocks[i].linha * params.s + params.s / 2
					);
				}
				break;
			case DEBUG_MODE.DISTANCIA_INIMIGOS_TELEPORTES: {
				// distInimigosTeleportes
				for (let i = 0; i < this.blocks.length; i++) {
					params.ctx.save();
					params.ctx.fillStyle = `hsl(${(150 * this.blocks[i].distInimigoTeleporte()) /
						this.distancias.compostas.inimigosTeleportes.max
						}, 100%, 50%)`;
					params.ctx.linewidth = 1;
					params.ctx.globalAlpha = 0.3;
					//ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
					params.ctx.fillRect(
						this.blocks[i].coluna * params.s,
						this.blocks[i].linha * params.s,
						params.s,
						params.s
					);
					//ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
					params.ctx.restore();
					params.ctx.fillStyle = "yellow";
					params.ctx.strokeStyle = "black";
					this.escreveTexto(
						params.ctx,
						this.blocks[i]
							.distInimigoTeleporte(
								this.distancias.maxInimigos,
								this.distancias.maxTeleportes
							)
							.toFixed(3),
						this.blocks[i].coluna * params.s + params.s / 2,
						this.blocks[i].linha * params.s + params.s / 2
					);
				}
				break;
			}
			case DEBUG_MODE.DISTANCIA_INIMIGOS_TELEPORTES_FIREZONES: {
				// distInimigo_Tesouro_Teleporte
				for (let i = 0; i < this.blocks.length; i++) {
					params.ctx.save();
					params.ctx.fillStyle = `hsl(${(150 * this.blocks[i].distInimigo_Tesouro_Teleporte()) /
						this.distancias.compostas.inimigo_Tesouro_Teleporte.max
						}, 100%, 50%)`;
					params.ctx.linewidth = 1;
					params.ctx.globalAlpha = 0.3;
					//ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
					params.ctx.fillRect(
						this.blocks[i].coluna * params.s,
						this.blocks[i].linha * params.s,
						params.s,
						params.s
					);
					//ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
					params.ctx.restore();
					params.ctx.fillStyle = "yellow";
					params.ctx.strokeStyle = "black";
					this.escreveTexto(
						params.ctx,
						this.blocks[i]
							.distInimigo_Tesouro_Teleporte(
								this.distancias.maxInimigos,
								this.distancias.maxTeleportes,
								this.distancias.maxTesouros
							)
							.toFixed(3),
						this.blocks[i].coluna * params.s + params.s / 2,
						this.blocks[i].linha * params.s + params.s / 2
					);
				}
				break;
			}
			case DEBUG_MODE.GPS_SAIDA_ROOM: {
				// Path GPS
				this.pathGPS.desenhar(params.ctx, params.s);
				break;
			}
			case DEBUG_MODE.INFLUENCIA_PODER: {
				let maxPoder = 0;
				this.blocks.forEach(block => {
					if (maxPoder < block.influenciaPoder) {
						maxPoder = block.influenciaPoder;
					}
				});
				for (let i = 0; i < this.blocks.length; i++) {
					params.ctx.save();
					params.ctx.fillStyle = `hsl(${150 - (150 * this.blocks[i].influenciaPoder / this.mapaInfluencia.influenciaPoder)}, 100%, 50%)`;
					params.ctx.linewidth = 1;
					params.ctx.globalAlpha = 0.3;
					params.ctx.fillRect(
						this.blocks[i].coluna * params.s,
						this.blocks[i].linha * params.s,
						params.s,
						params.s
					);
					params.ctx.restore();
					params.ctx.fillStyle = "yellow";
					params.ctx.strokeStyle = "black";
					this.escreveTexto(
						params.ctx,
						this.blocks[i].influenciaPoder,
						this.blocks[i].coluna * params.s + params.s / 2,
						this.blocks[i].linha * params.s + params.s / 2
					);
				}
				break;
			}
			case 20: { // Pintar área de room específico 
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.number === 1) { // Informar número do room
						params.ctx.save();
						params.ctx.fillStyle = "lime";
						params.ctx.linewidth = 1;
						params.ctx.globalAlpha = 0.5;
						params.ctx.fillRect(
							this.blocks[i].coluna * params.s,
							this.blocks[i].linha * params.s,
							params.s,
							params.s
						);
						params.ctx.restore();
					}
				}
				break;
			}
		}
	};

	escreveTexto(ctx, texto, x, y) {
		ctx.strokeText(texto, x, y);
		ctx.fillText(texto, x, y);
	};

	drawTeleportersLine(ctx) {
		// Ligação entre os teleportes
		ctx.save();
		ctx.strokeStyle = "black"; // linha de acabamento preta pra facilitar a visualização
		ctx.lineWidth = 10;
		ctx.beginPath();
		ctx.moveTo(this.teleporterInitial.x, this.teleporterInitial.y);
		ctx.lineTo(
			this.teleporterInitial.proximoTeleporte.x,
			this.teleporterInitial.proximoTeleporte.y
		);
		ctx.closePath();
		ctx.stroke();
		ctx.strokeStyle = "white";
		ctx.lineWidth = 8;
		ctx.beginPath();
		ctx.moveTo(this.teleporterInitial.x, this.teleporterInitial.y);
		ctx.lineTo(
			this.teleporterInitial.proximoTeleporte.x,
			this.teleporterInitial.proximoTeleporte.y
		);
		ctx.closePath();
		ctx.stroke();
		ctx.lineWidth = 1;
		ctx.restore();
	};

	/**********************
	 * Testes de colisões *
	 **********************/

	collisionFirezones(player) {
		for (let j = 0; j < this.fireZones.length; j++) {
			if (this.fireZones[j].colidiuComCentralWidthHeight(player)) return true;
		}
		return false;
	};

	collisionEnemies(player) {
		for (const indiceInimigo in this.enemies) {
			const enemy = this.enemies[indiceInimigo];
			if (player.colidiuComCentralWidthHeight(enemy)) {
				return true;
			}
		}
		return false;
	};

	collisionTreasures(player) {
		for (let j = 0; j < this.treasures.length; j++) {
			if (player.colidiuComCentralWidthHeight(this.treasures[j])) {
				player.tesourosColetados++;
				this.treasures.splice(j, 1);
				return true;
			}
		}
		return false;
	};

	/***********************
	 * Ataque dos inimigos *
	 **********************/

	attackEnemiesPlayer(player) {
		for (const indiceInimigo in this.enemies) {
			const enemy = this.enemies[indiceInimigo];
			enemy.attackPlayer(player);
		}
	};

	/***********************
	 * Métodos de cópia    *
	 ***********************/

	// Copia os dados da sala toda mas o vetor de blocos salva a linha e coluna apenas
	copy(room) {
		this.number = room.number;
		this.teleporterInitial.copy(room.teleporterInitial);
		this.teleporterFinal.copy(room.teleporterFinal);
		for (let i = 0; i < room.blocks.length; i++) {
			let aux = new Cell();
			aux.clone(room.blocks[i]);
			this.blocks.push(aux);
		}

		this.distancias = {
			maxTeleportes: room.distancias.maxTeleportes,
			maxFirezones: room.distancias.maxFirezones,
			maxTesouros: room.distancias.maxTesouros,
			maxInimigos: room.distancias.maxInimigos,
			compostas: {
				inimigosTeleportes: {
					max: room.distancias.compostas.inimigosTeleportes.max,
				},
				inimigo_Tesouro_Teleporte: {
					max: room.distancias.compostas.inimigo_Tesouro_Teleporte.max,
				},
			},
		};
	};

	// Copia os dados da sala toda mas o vetor de blocos salva a linha e coluna apenas
	copyByLevelGeneration(room, mapa) {
		this.number = room.number;
		this.teleporterInitial.copy(room.teleporterInitial);
		this.teleporterFinal.copy(room.teleporterFinal);
		for (let i = 0; i < room.blocks.length; i++) {
			let cellAux = mapa.cell[room.blocks[i][0]][room.blocks[i][1]]; // BLOCKS[ID, LINHA/COLUNA]
			cellAux.room = room.number;
			this.blocks.push(cellAux);
		}
		this.distancias = {
			maxTeleportes: room.distancias.maxTeleportes,
			maxFirezones: room.distancias.maxFirezones,
			maxTesouros: room.distancias.maxTesouros,
			maxInimigos: room.distancias.maxInimigos,
			compostas: {
				inimigosTeleportes: {
					max: room.distancias.compostas.inimigosTeleportes.max,
				},
				inimigo_Tesouro_Teleporte: {
					max: room.distancias.compostas.inimigo_Tesouro_Teleporte.max,
				},
			},
		};
		this.copyFireZones(room);
		this.copyTreasures(room);
		this.copyEnemies(room);
	};

	// Copia os dados da sala toda mas o vetor de blocos salva REFERENCIA PRA MATRIZ DO MAPA
	copyWithReference(room, mapa) {
		this.number = room.number;
		this.teleporterInitial.copyTeleporte(room.teleporterInitial);
		this.teleporterFinal.copyTeleporte(room.teleporterFinal);

		for (let i = 0; i < room.blocks.length; i++) {
			let aux = new Cell();
			aux.clone(mapa.getCell(room.blocks[i].linha, room.blocks[i].coluna));
			this.blocks.push(aux);
		}
		this.distancias = {
			maxTeleportes: room.distancias.maxTeleportes,
			maxFirezones: room.distancias.maxFirezones,
			maxTesouros: room.distancias.maxTesouros,
			maxInimigos: room.distancias.maxInimigos,
			compostas: {
				inimigosTeleportes: {
					max: room.distancias.compostas.inimigosTeleportes.max,
				},
				inimigo_Tesouro_Teleporte: {
					max: room.distancias.compostas.inimigo_Tesouro_Teleporte.max,
				},
			},
		};
		this.copyFireZones(room);
		this.copyTreasures(room);
		this.copyEnemies(room);
	};

	copyFireZones(room) {
		for (let i = 0; i < room.fireZones.length; i++) {
			let aux = room.fireZones[i];
			let newFireZone = new FireZone();
			newFireZone.copyWithAnimation(aux);
			this.fireZones.push(newFireZone);
		}
	};

	copyTreasures(room) {
		for (let i = 0; i < room.treasures.length; i++) {
			let aux = room.treasures[i];
			let newTreasure = new Treasure();
			newTreasure.copyWithAnimation(aux);
			this.treasures.push(newTreasure);
		}
	};

	copyEnemies(room) {
		for (const indiceInimigo in room.enemies) {
			const enemy = room.enemies[indiceInimigo];
			const newEnemy = new Slime(enemy.nivel);
			newEnemy.copy(enemy);
			newEnemy.room = this;
			newEnemy.atributos = enemy.atributos;
			newEnemy.hpAtual = enemy.hpAtual;
			newEnemy.poderTotal = enemy.poderTotal;
			this.enemies.push(newEnemy);
		}
	};

	apontarDirecoes() {
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].distInundacaoSaida === 0) {
				this.blocks[i].direcaoSaida = "X";
			} else {
				let menor;
				for (let j = 0; j < this.blocks[i].vizinhos.length; j++) {
					let indexVizinho = this.blocks[i].vizinhos[j];
					if (
						this.blocks[indexVizinho].distInundacaoSaida <
						this.blocks[i].distInundacaoSaida
					) {
						menor = indexVizinho;
					}
				}
				if (
					this.blocks[menor].linha === this.blocks[i].linha - 1 &&
					this.blocks[menor].coluna === this.blocks[i].coluna
				) {
					this.blocks[i].direcaoSaida = "^";
				}
				if (
					this.blocks[menor].linha === this.blocks[i].linha + 1 &&
					this.blocks[menor].coluna === this.blocks[i].coluna
				) {
					this.blocks[i].direcaoSaida = "V";
				}
				if (
					this.blocks[menor].coluna === this.blocks[i].coluna - 1 &&
					this.blocks[menor].linha === this.blocks[i].linha
				) {
					this.blocks[i].direcaoSaida = "<";
				}
				if (
					this.blocks[menor].coluna === this.blocks[i].coluna + 1 &&
					this.blocks[menor].linha === this.blocks[i].linha &&
					this.blocks[i].direcaoSaida !== "O"
				) {
					this.blocks[i].direcaoSaida = ">";
				}
			}
		}
	};

	inundaRecursivo(origem, val) {
		if (this.blocks[origem].distInundacaoSaida === -1) {
			this.blocks[origem].distInundacaoSaida = val;
			val++;
			for (let i = 0; i < this.blocks[origem].vizinhos.length; i++) {
				this.inundaRecursivo(this.blocks[origem].vizinhos[i], val);
			}
		} else {
			if (val < this.blocks[origem].distInundacaoSaida) {
				this.blocks[origem].distInundacaoSaida = val;
				val++;
				for (let i = 0; i < this.blocks[origem].vizinhos.length; i++) {
					this.inundaRecursivo(this.blocks[origem].vizinhos[i], val);
				}
			}
		}
	};

	defineVizinhos(bloco) {
		bloco.vizinhos = [];
		for (let i = 0; i < this.blocks.length; i++) {
			if (
				this.blocks[i].linha === bloco.linha - 1 &&
				this.blocks[i].coluna === bloco.coluna
			) {
				bloco.vizinhos.push(i);
			}
			if (
				this.blocks[i].linha === bloco.linha &&
				this.blocks[i].coluna === bloco.coluna - 1
			) {
				bloco.vizinhos.push(i);
			}
			if (
				this.blocks[i].linha === bloco.linha + 1 &&
				this.blocks[i].coluna === bloco.coluna
			) {
				bloco.vizinhos.push(i);
			}
			if (
				this.blocks[i].linha === bloco.linha &&
				this.blocks[i].coluna === bloco.coluna + 1
			) {
				bloco.vizinhos.push(i);
			}
		}
	};

	init() {
		for (let i = 0; i < this.blocks.length; i++) {
			// this.defineIndexBlocos();
			this.blocks[i].indexRoom = i;
			this.defineVizinhos(this.blocks[i]);
			if (!this.achouEntrada) {
				this.achaEntrada();
				this.achouEntrada = true;
			}
			if (!this.achouTesouros) {
				this.achaTesouros();
				this.achouTesouros = true;
			}
			if (!this.achouSaida) {
				this.achaSaida();
				this.achouSaida = true;
			}
		}
		this.inundaRecursivo(this.saida, 0);
		this.apontarDirecoes();
	};

	achaSaida() {
		for (let i = 0; i < this.blocks.length; i++) {
			if (
				this.blocks[i].linha === this.teleporterFinal.gy &&
				this.blocks[i].coluna === this.teleporterFinal.gx
			) {
				this.saida = i;
				break;
			}
		}
		this.pontosInteresse.push(this.saida);
	};

	achaEntrada() {
		for (let i = 0; i < this.blocks.length; i++) {
			if (
				this.blocks[i].linha === this.teleporterInitial.gy &&
				this.blocks[i].coluna === this.teleporterInitial.gx
			) {
				this.entrada = i;
				break;
			}
		}
		this.pontosInteresse.push(this.entrada);
	};

	achaTesouros() {
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].distTesouros === 0) {
				this.indexTesouros.push(i);
				this.pontosInteresse.push(i);
			}
		}
	};

	getPathGPS(gx, gy) {
		this.pathGPS.steps = [];
		let indexAtual;
		let indexPlayer = -1; // Index -1 indica que o player não está nessa room
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].linha === gy && this.blocks[i].coluna === gx) {
				indexPlayer = i;
				indexAtual = i;
			}
		}

		if (indexPlayer !== -1) {
			this.pathGPS.addStep(this.blocks[indexPlayer]);
			for (let i = 0; i < this.blocks[indexPlayer].distInundacaoSaida; i++) {
				if (this.blocks[indexAtual].direcaoSaida === "^") {
					for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
						if (
							this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
							this.blocks[indexAtual].linha - 1 &&
							this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
							this.blocks[indexAtual].coluna &&
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
								.distInundacaoSaida < this.blocks[indexAtual].distInundacaoSaida
						) {
							this.pathGPS.addStep(
								this.blocks[this.blocks[indexAtual].vizinhos[j]]
							);
							indexAtual = this.blocks[indexAtual].vizinhos[j];
						}
					}
				} else if (this.blocks[indexAtual].direcaoSaida === "V") {
					for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
						if (
							this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
							this.blocks[indexAtual].linha + 1 &&
							this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
							this.blocks[indexAtual].coluna &&
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
								.distInundacaoSaida < this.blocks[indexAtual].distInundacaoSaida
						) {
							this.pathGPS.addStep(
								this.blocks[this.blocks[indexAtual].vizinhos[j]]
							);
							indexAtual = this.blocks[indexAtual].vizinhos[j];
						}
					}
				} else if (this.blocks[indexAtual].direcaoSaida === "<") {
					for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
						if (
							this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
							this.blocks[indexAtual].linha &&
							this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
							this.blocks[indexAtual].coluna - 1 &&
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
								.distInundacaoSaida < this.blocks[indexAtual].distInundacaoSaida
						) {
							this.pathGPS.addStep(
								this.blocks[this.blocks[indexAtual].vizinhos[j]]
							);
							indexAtual = this.blocks[indexAtual].vizinhos[j];
						}
					}
				} else if (this.blocks[indexAtual].direcaoSaida === ">") {
					for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
						if (
							this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
							this.blocks[indexAtual].linha &&
							this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
							this.blocks[indexAtual].coluna + 1 &&
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
								.distInundacaoSaida < this.blocks[indexAtual].distInundacaoSaida
						) {
							this.pathGPS.addStep(
								this.blocks[this.blocks[indexAtual].vizinhos[j]]
							);
							indexAtual = this.blocks[indexAtual].vizinhos[j];
						}
					}
				}
			}
		}
	};

	getPathRoom(gx, gy) {
		this.pathRoom.steps = [];
		let indexAtual = this.entrada;

		let indexPlayer = -1; // Index -1 indica que o player não está nessa room
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].linha === gy && this.blocks[i].coluna === gx) {
				indexPlayer = i;
			}
		}

		//if(indexPlayer !== -1){
		this.pathRoom.addStep(this.blocks[indexAtual]);
		for (let i = 0; i < this.blocks[this.entrada].distInundacaoSaida; i++) {
			if (this.blocks[indexAtual].direcaoSaida === "^") {
				for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
					if (
						this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
						this.blocks[indexAtual].linha - 1 &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
						this.blocks[indexAtual].coluna &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].distInundacaoSaida <
						this.blocks[indexAtual].distInundacaoSaida
					) {
						this.pathRoom.addStep(
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
						);
						indexAtual = this.blocks[indexAtual].vizinhos[j];
					}
				}
			} else if (this.blocks[indexAtual].direcaoSaida === "V") {
				for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
					if (
						this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
						this.blocks[indexAtual].linha + 1 &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
						this.blocks[indexAtual].coluna &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].distInundacaoSaida <
						this.blocks[indexAtual].distInundacaoSaida
					) {
						this.pathRoom.addStep(
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
						);
						indexAtual = this.blocks[indexAtual].vizinhos[j];
					}
				}
			} else if (this.blocks[indexAtual].direcaoSaida === "<") {
				for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
					if (
						this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
						this.blocks[indexAtual].linha &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
						this.blocks[indexAtual].coluna - 1 &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].distInundacaoSaida <
						this.blocks[indexAtual].distInundacaoSaida
					) {
						this.pathRoom.addStep(
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
						);
						indexAtual = this.blocks[indexAtual].vizinhos[j];
					}
				}
			} else if (this.blocks[indexAtual].direcaoSaida === ">") {
				for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
					if (
						this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
						this.blocks[indexAtual].linha &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
						this.blocks[indexAtual].coluna + 1 &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].distInundacaoSaida <
						this.blocks[indexAtual].distInundacaoSaida
					) {
						this.pathRoom.addStep(
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
						);
						indexAtual = this.blocks[indexAtual].vizinhos[j];
					}
				}
			}
		}
		//}
	};

	inundar(origem, val) {
		if (this.blocks[origem].distInundacaoTemp === -1) {
			this.blocks[origem].distInundacaoTemp = val;
			val++;
			for (let i = 0; i < this.blocks[origem].vizinhos.length; i++) {
				this.inundar(this.blocks[origem].vizinhos[i], val);
			}
		} else {
			if (val < this.blocks[origem].distInundacaoTemp) {
				this.blocks[origem].distInundacaoTemp = val;
				val++;
				for (let i = 0; i < this.blocks[origem].vizinhos.length; i++) {
					this.inundar(this.blocks[origem].vizinhos[i], val);
				}
			}
		}
	};

	resetaDistanciaInundacaoTemp() {
		for (let i = 0; i < this.blocks.length; i++) {
			this.blocks[i].distInundacaoTemp = -1;
		}
	};

	apontarDirecoesTemp() {
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].distInundacaoTemp === 0) {
				this.blocks[i].direcaoTesouros = "X";
			} else {
				let menor;
				for (let j = 0; j < this.blocks[i].vizinhos.length; j++) {
					let indexVizinho = this.blocks[i].vizinhos[j];
					if (
						this.blocks[indexVizinho].distInundacaoTemp <
						this.blocks[i].distInundacaoTemp
					) {
						menor = indexVizinho;
					}
				}
				if (
					this.blocks[menor].linha === this.blocks[i].linha - 1 &&
					this.blocks[menor].coluna === this.blocks[i].coluna
				) {
					this.blocks[i].direcaoTesouros = "^";
				}
				if (
					this.blocks[menor].linha === this.blocks[i].linha + 1 &&
					this.blocks[menor].coluna === this.blocks[i].coluna
				) {
					this.blocks[i].direcaoTesouros = "V";
				}
				if (
					this.blocks[menor].coluna === this.blocks[i].coluna - 1 &&
					this.blocks[menor].linha === this.blocks[i].linha
				) {
					this.blocks[i].direcaoTesouros = "<";
				}
				if (
					this.blocks[menor].coluna === this.blocks[i].coluna + 1 &&
					this.blocks[menor].linha === this.blocks[i].linha &&
					this.blocks[i].direcaoTesouros !== "O"
				) {
					this.blocks[i].direcaoTesouros = ">";
				}
			}
		}
	};

	calculaDistPontosInteresse() {
		console.log("Room " + this.number + ": " + this.pontosInteresse.length);
		for (let i = 0; i < this.pontosInteresse.length; i++) {
			this.resetaDistanciaInundacaoTemp();
			this.inundar(this.pontosInteresse[i], 0);
			this.matrizDistancias[i] = [];
			for (let j = 0; j < this.pontosInteresse.length; j++) {
				if (i === j) {
					this.matrizDistancias[i][j] = Infinity;
				} else {
					this.matrizDistancias[i][j] = this.blocks[
						this.pontosInteresse[j]
					].distInundacaoTemp;
				}
			}
		}
		//console.log(this.matrizDistancias)
		//console.log(this.pontosInteresse)
	};

	constroiRota() {
		let index = 0;
		let indexAux = 0;
		let faltam = this.pontosInteresse.length;
		let jaFoi = [];
		this.rotaPercurso = [];
		jaFoi.push(this.pontosInteresse[index]);
		this.rotaPercurso.push(this.pontosInteresse[index]);
		faltam--;

		for (let k = 0; k < this.pontosInteresse.length - 1; k++) {
			let menor = Infinity;
			for (let i = 0; i < this.pontosInteresse.length; i++) {
				if (
					index !== i &&
					this.matrizDistancias[index][i] < menor &&
					jaFoi.indexOf(this.pontosInteresse[i]) === -1
				) {
					if (faltam > 1 && i === this.pontosInteresse.length - 1) {
						//console.log("A saída foi achada e ignorada");
					} else {
						menor = this.matrizDistancias[index][i];
						indexAux = i;
					}
				}
			}
			index = indexAux;
			jaFoi.push(this.pontosInteresse[index]);
			this.rotaPercurso.push(this.pontosInteresse[index]);
			faltam--;
		}

		//console.log(this.rotaPercurso);
	};

	getPathTesouros(gx, gy) {
		this.pathTesouros.steps = [];
		let indexPlayer = -1; // Index -1 indica que o player não está nessa room
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].linha === gy && this.blocks[i].coluna === gx) {
				indexPlayer = i;
			}
		}

		//if(indexPlayer !== -1){
		let atual = 0;
		let proximo = 1;

		for (let i = atual; i < this.rotaPercurso.length - 1; i++) {
			this.resetaDistanciaInundacaoTemp();
			this.inundar(this.rotaPercurso[proximo], 0);
			this.apontarDirecoesTemp();
			this.constroiPathDoisPontos(this.rotaPercurso[atual]);
			atual++;
			proximo++;
			if (proximo > this.rotaPercurso.length) {
				proximo--;
			}
		}
		//}
	};

	constroiPathDoisPontos(inicio) {
		let indexAtual = inicio;

		if (this.blocks[indexAtual].distTeleportes === 0) {
			this.pathTesouros.addStep(this.blocks[indexAtual]);
		}
		for (let i = 0; i < this.blocks[this.entrada].distInundacaoTemp; i++) {
			if (this.blocks[indexAtual].direcaoTesouros === "^") {
				for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
					if (
						this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
						this.blocks[indexAtual].linha - 1 &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
						this.blocks[indexAtual].coluna &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].distInundacaoTemp <
						this.blocks[indexAtual].distInundacaoTemp
					) {
						this.pathTesouros.addStep(
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
						);
						indexAtual = this.blocks[indexAtual].vizinhos[j];
					}
				}
			} else if (this.blocks[indexAtual].direcaoTesouros === "V") {
				for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
					if (
						this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
						this.blocks[indexAtual].linha + 1 &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
						this.blocks[indexAtual].coluna &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].distInundacaoTemp <
						this.blocks[indexAtual].distInundacaoTemp
					) {
						this.pathTesouros.addStep(
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
						);
						indexAtual = this.blocks[indexAtual].vizinhos[j];
					}
				}
			} else if (this.blocks[indexAtual].direcaoTesouros === "<") {
				for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
					if (
						this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
						this.blocks[indexAtual].linha &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
						this.blocks[indexAtual].coluna - 1 &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].distInundacaoTemp <
						this.blocks[indexAtual].distInundacaoTemp
					) {
						this.pathTesouros.addStep(
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
						);
						indexAtual = this.blocks[indexAtual].vizinhos[j];
					}
				}
			} else if (this.blocks[indexAtual].direcaoTesouros === ">") {
				for (let j = 0; j < this.blocks[indexAtual].vizinhos.length; j++) {
					if (
						this.blocks[this.blocks[indexAtual].vizinhos[j]].linha ===
						this.blocks[indexAtual].linha &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].coluna ===
						this.blocks[indexAtual].coluna + 1 &&
						this.blocks[this.blocks[indexAtual].vizinhos[j]].distInundacaoTemp <
						this.blocks[indexAtual].distInundacaoTemp
					) {
						this.pathTesouros.addStep(
							this.blocks[this.blocks[indexAtual].vizinhos[j]]
						);
						indexAtual = this.blocks[indexAtual].vizinhos[j];
					}
				}
			}
		}
	};

	getPathPlayer(gx, gy) {
		let indexAtual;
		let indexPlayer = -1; // Index -1 indica que o player não está nessa room
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].linha === gy && this.blocks[i].coluna === gx) {
				indexPlayer = i;
				indexAtual = i;
			}
		}
		if (indexPlayer !== -1) {
			if (
				this.blocks[indexPlayer] !==
				this.pathPlayer.steps[this.pathPlayer.steps.length - 1]
			) {
				this.pathPlayer.addStep(this.blocks[indexPlayer]);
			}
		}
	};

	desenharGraficoRoom(ctx, playerX, playerY) {
		let posX = playerX - 350; //15
		let posY = playerY + 150; //245
		let xQuadro = posX - 15; //10
		let yQuadro = posY - 235; //10
		let hQuadro = 250; //240
		let wQuadro = 410; //400
		let maior = 1;
		for (let i = 0; i < this.pathRoom.steps.length; i++) {
			if (this.pathRoom.steps[i].distTesouros > maior) {
				maior = this.pathRoom.steps[i].distTesouros;
			}
			if (this.pathRoom.steps[i].distInimigos > maior) {
				maior = this.pathRoom.steps[i].distInimigos;
			}
			if (this.pathRoom.steps[i].distFirezones > maior) {
				maior = this.pathRoom.steps[i].distFirezones;
			}
		}

		let escalaX = this.pathRoom.steps.length - 1;
		let escalaY = maior;

		// Desenho do quadro do gráfico 
		ctx.save();
		ctx.fillStyle = "rgba(10, 10, 10, 1)"; //0.8
		ctx.strokeStyle = "rgba(105, 105, 105, 0.9)";
		ctx.globalAlpha = 1.9;
		ctx.fillRect(xQuadro, yQuadro, wQuadro, hQuadro);
		ctx.strokeRect(xQuadro, yQuadro, wQuadro, hQuadro);
		ctx.fillStyle = "white";
		ctx.strokeStyle = "rgba(225, 225, 225, 0.9)";
		//ctx.fillText(escalaX + " x " + escalaY, posX + wQuadro / 2, yQuadro + 10);
		ctx.font = "6px Arial Black";
		ctx.fillText("Passo (" + escalaX + ")", posX + wQuadro / 2, posY + 10);
		ctx.font = "8px Arial Black";
		ctx.fillText("Gráfico Path Entrada-Saída: Sala " + this.number, posX + wQuadro / 2, yQuadro + 10);
		ctx.font = "6px Arial Black";
		ctx.rotate(-15 * Math.PI / 30);
		ctx.fillText("Distância (" + escalaY + ")", (posY - wQuadro / 4 - 10) * -1, posX - 5);
		ctx.restore();

		// Desenho dos eixos do gráfico
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1;
		ctx.beginPath();
		// Eixo X - 390 pixels
		ctx.moveTo(posX, posY);
		ctx.lineTo(posX + 390, posY);
		// Eixo Y - 230 pixels
		ctx.moveTo(posX, posY);
		ctx.lineTo(posX, posY - 230);

		// Marcações X
		let espacamentoX = 390 / escalaX; //Math.trunc(390 / escalaX);
		if (escalaX <= 200) {
			let atualX = posX;
			for (let i = 0; i < escalaX; i++) {
				ctx.moveTo(atualX + espacamentoX, posY - 2);
				ctx.lineTo(atualX + espacamentoX, posY + 2);
				atualX = atualX + espacamentoX;
			}
		}

		// Marcações Y
		let espacamentoY = 230 / escalaY; //Math.trunc(230 / escalaY);
		if (escalaY !== 999) {
			let atualY = posY;
			for (let i = 0; i < escalaY; i++) {
				ctx.moveTo(posX - 2, atualY - espacamentoY);
				ctx.lineTo(posX + 2, atualY - espacamentoY);
				atualY = atualY - espacamentoY;
			}
		}

		// Fecha desenho do gráfico
		ctx.closePath();
		ctx.stroke();

		// posição 0,0 no gráfico
		let xZero = posX - espacamentoX;
		let yZero = posY;

		let xAtual = xZero;
		let yAtual = yZero - espacamentoY * this.pathRoom.steps[0].distTesouros;

		let valY = this.pathRoom.steps[0].distTesouros;
		let muxY;

		// Desenho da linha do gráfico de distância para tesouros
		ctx.beginPath();
		ctx.strokeStyle = "yellow";
		for (let i = 0; i < this.pathRoom.steps.length; i++) {
			if (valY < this.pathRoom.steps[i].distTesouros) {
				muxY = -1;
			} else if (valY > this.pathRoom.steps[i].distTesouros) {
				muxY = 1;
			} else if (valY === this.pathRoom.steps[i].distTesouros) {
				muxY = 0;
			}

			valY = this.pathRoom.steps[i].distTesouros;

			if (i !== 0) {
				ctx.moveTo(xAtual, yAtual);
				ctx.lineTo(xAtual + espacamentoX, yAtual + espacamentoY * muxY);
			}
			xAtual = xAtual + espacamentoX;
			yAtual = yAtual + espacamentoY * muxY;
		}
		ctx.closePath();
		ctx.stroke();

		xAtual = xZero;
		yAtual = yZero - espacamentoY * this.pathRoom.steps[0].distInimigos;

		valY = this.pathRoom.steps[0].distInimigos;
		muxY = 0;

		// Desenho da linha do gráfico de distância para inimigos
		ctx.beginPath();
		ctx.strokeStyle = "rgba(225, 0, 0, 0.6)";
		for (let i = 0; i < this.pathRoom.steps.length; i++) {
			if (valY < this.pathRoom.steps[i].distInimigos) {
				muxY = -1;
			} else if (valY > this.pathRoom.steps[i].distInimigos) {
				muxY = 1;
			} else if (valY === this.pathRoom.steps[i].distInimigos) {
				muxY = 0;
			}

			valY = this.pathRoom.steps[i].distInimigos;

			if (i !== 0) {
				ctx.moveTo(xAtual, yAtual);
				ctx.lineTo(xAtual + espacamentoX, yAtual + espacamentoY * muxY);
			}
			xAtual = xAtual + espacamentoX;
			yAtual = yAtual + espacamentoY * muxY;
		}
		ctx.closePath();
		ctx.stroke();

		xAtual = xZero;
		yAtual = yZero - espacamentoY * this.pathRoom.steps[0].distFirezones;

		valY = this.pathRoom.steps[0].distFirezones;
		muxY = 0;

		// Desenho da linha do gráfico de distância para firezones
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 255, 127, 0.6)";
		for (let i = 0; i < this.pathRoom.steps.length; i++) {
			if (valY < this.pathRoom.steps[i].distFirezones) {
				muxY = -1;
			} else if (valY > this.pathRoom.steps[i].distFirezones) {
				muxY = 1;
			} else if (valY === this.pathRoom.steps[i].distFirezones) {
				muxY = 0;
			}

			valY = this.pathRoom.steps[i].distFirezones;

			if (i !== 0) {
				ctx.moveTo(xAtual, yAtual);
				ctx.lineTo(xAtual + espacamentoX, yAtual + espacamentoY * muxY);
			}
			xAtual = xAtual + espacamentoX;
			yAtual = yAtual + espacamentoY * muxY;
		}
		ctx.closePath();
		ctx.stroke();
	};

	desenharGraficoTesouros(ctx, playerX, playerY) {
		let posX = playerX - 350; //15
		let posY = playerY + 150; //245
		let xQuadro = posX - 15; //10
		let yQuadro = posY - 235; //10
		let hQuadro = 250; //240
		let wQuadro = 410; //400
		let maior = 1;
		for (let i = 0; i < this.pathTesouros.steps.length; i++) {
			if (this.pathTesouros.steps[i].distTesouros > maior) {
				maior = this.pathTesouros.steps[i].distTesouros;
			}
			if (this.pathTesouros.steps[i].distInimigos > maior) {
				maior = this.pathTesouros.steps[i].distInimigos;
			}
			if (this.pathTesouros.steps[i].distFirezones > maior) {
				maior = this.pathTesouros.steps[i].distFirezones;
			}
		}

		let escalaX = this.pathTesouros.steps.length - 1;
		let escalaY = maior;

		if (escalaX > 999) { wQuadro = 610; }
		let eixoX = wQuadro - 20;
		let eixoY = hQuadro - 20;

		// Desenho do quadro do gráfico 
		ctx.save();
		ctx.fillStyle = "rgba(10, 10, 10, 1)"; //0.8
		ctx.strokeStyle = "rgba(105, 105, 105, 0.9)";
		ctx.globalAlpha = 1.9;
		ctx.fillRect(xQuadro, yQuadro, wQuadro, hQuadro);
		ctx.strokeRect(xQuadro, yQuadro, wQuadro, hQuadro);
		ctx.font = "10px Arial Black";
		ctx.fillStyle = "white";
		ctx.strokeStyle = "rgba(225, 225, 225, 0.9)";
		//ctx.fillText(escalaX + " x " + escalaY, posX + wQuadro / 2, yQuadro + 10);
		ctx.font = "6px Arial Black";
		ctx.fillText("Passo (" + escalaX + ")", posX + wQuadro / 2, posY + 10);
		ctx.font = "8px Arial Black";
		ctx.fillText("Gráfico Path Entrada-Tesouros-Saída: Sala " + this.number, posX + wQuadro / 2, yQuadro + 10);
		ctx.font = "6px Arial Black";
		ctx.rotate(-15 * Math.PI / 30);
		ctx.fillText("Distância (" + escalaY + ")", (posY - wQuadro / 4 - 10) * -1, posX - 5);
		ctx.restore();

		// Desenho dos eixos do gráfico
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1;
		ctx.beginPath();
		// Eixo X - 390 pixels
		ctx.moveTo(posX, posY);
		ctx.lineTo(posX + eixoX, posY);
		// Eixo Y - 230 pixels
		ctx.moveTo(posX, posY);
		ctx.lineTo(posX, posY - eixoY);

		// Marcações X
		let espacamentoX = eixoX / escalaX;
		if (escalaX <= 200) {
			let atualX = posX;
			for (let i = 0; i < escalaX; i++) {
				ctx.moveTo(atualX + espacamentoX, posY - 2);
				ctx.lineTo(atualX + espacamentoX, posY + 2);
				atualX = atualX + espacamentoX;
			}
		}

		// Marcações Y
		let espacamentoY = eixoY / escalaY;
		if (escalaY !== 999) {
			let atualY = posY;
			for (let i = 0; i < escalaY; i++) {
				ctx.moveTo(posX - 2, atualY - espacamentoY);
				ctx.lineTo(posX + 2, atualY - espacamentoY);
				atualY = atualY - espacamentoY;
			}
		}

		// Fecha desenho do gráfico
		ctx.closePath();
		ctx.stroke();

		// posição 0,0 no gráfico
		let xZero = posX - espacamentoX;
		let yZero = posY;

		let xAtual = xZero;
		let yAtual = yZero - espacamentoY * this.pathTesouros.steps[0].distTesouros;

		let valY = this.pathTesouros.steps[0].distTesouros;
		let muxY;

		// Desenho da linha do gráfico de distância para tesouros
		ctx.beginPath();
		ctx.strokeStyle = "yellow";
		for (let i = 0; i < this.pathTesouros.steps.length; i++) {
			if (valY < this.pathTesouros.steps[i].distTesouros) {
				muxY = -1;
			} else if (valY > this.pathTesouros.steps[i].distTesouros) {
				muxY = 1;
			} else if (valY === this.pathTesouros.steps[i].distTesouros) {
				muxY = 0;
			}

			valY = this.pathTesouros.steps[i].distTesouros;

			if (i !== 0) {
				ctx.moveTo(xAtual, yAtual);
				ctx.lineTo(xAtual + espacamentoX, yAtual + espacamentoY * muxY);
			}
			xAtual = xAtual + espacamentoX;
			yAtual = yAtual + espacamentoY * muxY;
		}
		ctx.closePath();
		ctx.stroke();

		xAtual = xZero;
		yAtual = yZero - espacamentoY * this.pathTesouros.steps[0].distInimigos;

		valY = this.pathTesouros.steps[0].distInimigos;
		muxY = 0;

		// Desenho da linha do gráfico de distância para inimigos
		ctx.beginPath();
		ctx.strokeStyle = "rgba(225, 0, 0, 0.6)";
		for (let i = 0; i < this.pathTesouros.steps.length; i++) {
			if (valY < this.pathTesouros.steps[i].distInimigos) {
				muxY = -1;
			} else if (valY > this.pathTesouros.steps[i].distInimigos) {
				muxY = 1;
			} else if (valY === this.pathTesouros.steps[i].distInimigos) {
				muxY = 0;
			}

			valY = this.pathTesouros.steps[i].distInimigos;

			if (i !== 0) {
				ctx.moveTo(xAtual, yAtual);
				ctx.lineTo(xAtual + espacamentoX, yAtual + espacamentoY * muxY);
			}
			xAtual = xAtual + espacamentoX;
			yAtual = yAtual + espacamentoY * muxY;
		}
		ctx.closePath();
		ctx.stroke();

		xAtual = xZero;
		yAtual = yZero - espacamentoY * this.pathTesouros.steps[0].distFirezones;

		valY = this.pathTesouros.steps[0].distFirezones;
		muxY = 0;

		// Desenho da linha do gráfico de distância para firezones
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 255, 127, 0.6)";
		for (let i = 0; i < this.pathTesouros.steps.length; i++) {
			if (valY < this.pathTesouros.steps[i].distFirezones) {
				muxY = -1;
			} else if (valY > this.pathTesouros.steps[i].distFirezones) {
				muxY = 1;
			} else if (valY === this.pathTesouros.steps[i].distFirezones) {
				muxY = 0;
			}

			valY = this.pathTesouros.steps[i].distFirezones;

			if (i !== 0) {
				ctx.moveTo(xAtual, yAtual);
				ctx.lineTo(xAtual + espacamentoX, yAtual + espacamentoY * muxY);
			}
			xAtual = xAtual + espacamentoX;
			yAtual = yAtual + espacamentoY * muxY;
		}
		ctx.closePath();
		ctx.stroke();
	};

	desenharGraficoPlayer(ctx, playerX, playerY) {
		let posX = playerX - 350; //15
		let posY = playerY + 150; //245
		let xQuadro = posX - 15; //10
		let yQuadro = posY - 235; //10
		let hQuadro = 250; //240
		let wQuadro = 410; //400
		let maior = 1;
		for (let i = 0; i < this.pathPlayer.steps.length; i++) {
			if (this.pathPlayer.steps[i].distTesouros > maior) {
				maior = this.pathPlayer.steps[i].distTesouros;
			}
			if (this.pathPlayer.steps[i].distInimigos > maior) {
				maior = this.pathPlayer.steps[i].distInimigos;
			}
			if (this.pathPlayer.steps[i].distFirezones > maior) {
				maior = this.pathPlayer.steps[i].distFirezones;
			}
		}

		let escalaX = this.pathPlayer.steps.length - 1;
		let escalaY = maior;

		if (escalaX > 999) { wQuadro = 610; }
		let eixoX = wQuadro - 20;
		let eixoY = hQuadro - 20;

		// Desenho do quadro do gráfico 
		ctx.save();
		ctx.fillStyle = "rgba(10, 10, 10, 1)"; //0.8
		ctx.strokeStyle = "rgba(105, 105, 105, 0.9)";
		ctx.globalAlpha = 1.9;
		ctx.fillRect(xQuadro, yQuadro, wQuadro, hQuadro);
		ctx.strokeRect(xQuadro, yQuadro, wQuadro, hQuadro);
		ctx.font = "10px Arial Black";
		ctx.fillStyle = "white";
		ctx.strokeStyle = "rgba(225, 225, 225, 0.9)";
		//ctx.fillText(escalaX + " x " + escalaY, posX + wQuadro / 2, yQuadro + 10);
		ctx.font = "6px Arial Black";
		ctx.fillText("Passo (" + escalaX + ")", posX + wQuadro / 2, posY + 10);
		ctx.font = "8px Arial Black";
		ctx.fillText("Gráfico Path Player: Sala " + this.number, posX + wQuadro / 2, yQuadro + 10);
		ctx.font = "6px Arial Black";
		ctx.rotate(-15 * Math.PI / 30);
		ctx.fillText("Distância (" + escalaY + ")", (posY - wQuadro / 4 - 10) * -1, posX - 5);
		ctx.restore();

		// Desenho dos eixos do gráfico
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1;
		ctx.beginPath();
		// Eixo X - 390 pixels
		ctx.moveTo(posX, posY);
		ctx.lineTo(posX + eixoX, posY);
		// Eixo Y - 230 pixels
		ctx.moveTo(posX, posY);
		ctx.lineTo(posX, posY - eixoY);

		// Marcações X
		let espacamentoX = eixoX / escalaX;
		if (escalaX <= 200) {
			let atualX = posX;
			for (let i = 0; i < escalaX; i++) {
				ctx.moveTo(atualX + espacamentoX, posY - 2);
				ctx.lineTo(atualX + espacamentoX, posY + 2);
				atualX = atualX + espacamentoX;
			}
		}

		// Marcações Y
		let espacamentoY = eixoY / escalaY;
		if (escalaY !== 999) {
			let atualY = posY;
			for (let i = 0; i < escalaY; i++) {
				ctx.moveTo(posX - 2, atualY - espacamentoY);
				ctx.lineTo(posX + 2, atualY - espacamentoY);
				atualY = atualY - espacamentoY;
			}
		}

		// Fecha desenho do gráfico
		ctx.closePath();
		ctx.stroke();

		if (this.pathPlayer.steps.length > 0) {
			// posição 0,0 no gráfico
			let xZero = posX - espacamentoX;
			let yZero = posY;

			let xAtual = xZero;
			let yAtual = yZero - espacamentoY * this.pathPlayer.steps[0].distTesouros;

			let valY = this.pathPlayer.steps[0].distTesouros;
			let muxY;

			// Desenho da linha do gráfico de distância para tesouros
			ctx.beginPath();
			ctx.strokeStyle = "yellow";
			for (let i = 0; i < this.pathPlayer.steps.length; i++) {
				if (valY < this.pathPlayer.steps[i].distTesouros) {
					muxY = -1;
				} else if (valY > this.pathPlayer.steps[i].distTesouros) {
					muxY = 1;
				} else if (valY === this.pathPlayer.steps[i].distTesouros) {
					muxY = 0;
				}

				if (i !== 0) {
					ctx.moveTo(xAtual, yAtual);
					ctx.lineTo(xAtual + espacamentoX, yAtual + (Math.abs(valY - this.pathPlayer.steps[i].distTesouros)) * espacamentoY * muxY);
				}
				xAtual = xAtual + espacamentoX;
				yAtual = yAtual + (Math.abs(valY - this.pathPlayer.steps[i].distTesouros)) * espacamentoY * muxY;
				valY = this.pathPlayer.steps[i].distTesouros;
			}
			ctx.closePath();
			ctx.stroke();

			xAtual = xZero;
			yAtual = yZero - espacamentoY * this.pathPlayer.steps[0].distInimigos;

			valY = this.pathPlayer.steps[0].distInimigos;
			muxY = 0;

			// Desenho da linha do gráfico de distância para inimigos
			ctx.beginPath();
			ctx.strokeStyle = "rgba(225, 0, 0, 0.6)";
			for (let i = 0; i < this.pathPlayer.steps.length; i++) {
				if (valY < this.pathPlayer.steps[i].distInimigos) {
					muxY = -1;
				} else if (valY > this.pathPlayer.steps[i].distInimigos) {
					muxY = 1;
				} else if (valY === this.pathPlayer.steps[i].distInimigos) {
					muxY = 0;
				}

				if (i !== 0) {
					ctx.moveTo(xAtual, yAtual);
					ctx.lineTo(xAtual + espacamentoX, yAtual + (Math.abs(valY - this.pathPlayer.steps[i].distInimigos)) * espacamentoY * muxY);
				}
				xAtual = xAtual + espacamentoX;
				yAtual = yAtual + (Math.abs(valY - this.pathPlayer.steps[i].distInimigos)) * espacamentoY * muxY;
				valY = this.pathPlayer.steps[i].distInimigos;
			}
			ctx.closePath();
			ctx.stroke();

			xAtual = xZero;
			yAtual = yZero - espacamentoY * this.pathPlayer.steps[0].distFirezones;

			valY = this.pathPlayer.steps[0].distFirezones;
			muxY = 0;

			// Desenho da linha do gráfico de distância para firezones
			ctx.beginPath();
			ctx.strokeStyle = "rgba(0, 255, 127, 0.6)";
			for (let i = 0; i < this.pathPlayer.steps.length; i++) {
				if (valY < this.pathPlayer.steps[i].distFirezones) {
					muxY = -1;
				} else if (valY > this.pathPlayer.steps[i].distFirezones) {
					muxY = 1;
				} else if (valY === this.pathPlayer.steps[i].distFirezones) {
					muxY = 0;
				}

				if (i !== 0) {
					ctx.moveTo(xAtual, yAtual);
					ctx.lineTo(xAtual + espacamentoX, yAtual + (Math.abs(valY - this.pathPlayer.steps[i].distFirezones)) * espacamentoY * muxY);
				}
				xAtual = xAtual + espacamentoX;
				yAtual = yAtual + (Math.abs(valY - this.pathPlayer.steps[i].distFirezones)) * espacamentoY * muxY;
				valY = this.pathPlayer.steps[i].distFirezones;
			}
			ctx.closePath();
			ctx.stroke();
		}
	};
}