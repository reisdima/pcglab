import Teleporter, { TeleporterType } from "./Teleporter.js";
import Cell from "./Cell.js";
import FireZone from "./FireZone.js";
import Treasure from "./Treasure.js";
import Enemy from "./Entities/Enemy.js";
import Path from "./Path.js";
import Slime from "./Entities/Slime.js";
import Debugger, { DEBUG_MODE } from "./utils/Debugger.js";
import { TIPOS_DE_MEDIA } from "./TipoDeMediaEntreAtributos.js";

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

		// Métricas
		this.metricas = {
			influenciaPoder: 0,
			influenciaPoderTesouro: 0,
			distTeleportes: 999,
			distFirezones: 999,
			distInimigos: 999,
			distTesouros: 999,
			distCaminhoEntradaSaida: 999,
			compostas: {
				inimigosTeleportesPoder: 999,
				inimigosTeleportes: 999,
				inimigo_Tesouro_Teleporte: 999,
				inimigosTeleportesPoder: 999
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
					if (this.blocks[i].metricas.distTeleportes == value) {
						return this.blocks[i];
					}
				}
				return null; // Não encontrou nenhuma celula com a distancia determinada
				break;
			case 1: // Firezones
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].metricas.distFirezones == value) {
						return this.blocks[i];
					}
				}
				return null; // Não encontrou nenhuma celula com a distancia determinada
				break;
			case 2: // Inimigos
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].metricas.distInimigos == value) {
						return this.blocks[i];
					}
				}
				return null; // Não encontrou nenhuma celula com a distancia determinada
				break;
			case 3: // Tesouros
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].metricas.distTesouros == value) {
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
					if (this.blocks[i].metricas.distTeleportes >= value) {
						listCells.push(this.blocks[i]);
					}
				}
				break;
			case 1: // Firezones
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].metricas.distFirezones >= value) {
						listCells.push(this.blocks[i]);
					}
				}
				break;
			case 2: // Inimigos
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].metricas.distInimigos >= value) {
						listCells.push(this.blocks[i]);
					}
				}
				break;
			case 3: // Tesouros
				for (let i = 0; i < this.blocks.length; i++) {
					if (this.blocks[i].metricas.distTesouros >= value) {
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
						this.blocks[i].metricas.distFirezones !== 0 &&
						this.blocks[i].metricas.distInimigos !== 0 &&
						this.blocks[i].metricas.distTesouros !== 0
					) {
						// Descarta celulas com outros elementos
						if (this.blocks[i].metricas.distTeleportes >= minimalValue) {
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
						this.blocks[i].metricas.distTeleportes !== 0 &&
						this.blocks[i].metricas.distInimigos !== 0 &&
						this.blocks[i].metricas.distTesouros !== 0
					) {
						// Descarta celulas com outros elementos
						if (this.blocks[i].metricas.distFirezones >= minimalValue) {
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
						this.blocks[i].metricas.distTeleportes !== 0 &&
						this.blocks[i].metricas.distFirezones !== 0 &&
						this.blocks[i].metricas.distTesouros !== 0
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
						this.blocks[i].metricas.distTeleportes !== 0 &&
						this.blocks[i].metricas.distFirezones !== 0 &&
						this.blocks[i].metricas.distInimigos !== 0
					) {
						// Descarta celulas com outros elementos
						if (this.blocks[i].metricas.distTesouros >= minimalValue) {
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
					if (bloco.metricas.distTeleportes >= value) {
						value = bloco.metricas.distTeleportes;
					}
				}
				break;
			case 1: // Firezones
				for (let i = 0; i < this.blocks.length; i++) {
					let bloco = this.blocks[i];
					if (bloco.metricas.distFirezones >= value) {
						value = bloco.metricas.distFirezones;
					}
				}
				break;
			case 2: // Inimigos
				for (let i = 0; i < this.blocks.length; i++) {
					let bloco = this.blocks[i];
					if (bloco.metricas.distInimigos >= value) {
						value = bloco.metricas.distInimigos;
					}
				}
				break;
			case 3: // Tesouros
				for (let i = 0; i < this.blocks.length; i++) {
					let bloco = this.blocks[i];
					if (bloco.metricas.distTesouros >= value) {
						value = bloco.metricas.distTesouros;
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
        this.blocks.forEach((bloco) => {
            switch (opcao) {
                case "influenciaInimigosTeleportesPoder":
                    let aux = bloco.mediaInimigo_Teleporte_Poder();
                    if (aux >= valor) {
                        valor = aux;
                    }
                    break;
				default:
                    if (bloco.metricas[opcao] > valor) {
                        valor = bloco.metricas[opcao];
                    }
                    break;
            }
		});
        return valor;
	}

	// Reseta a distancias da sala com o valor 999
	resetDistancia(option) {
		switch (option) {
			case 0: // Teleportes
				for (let i = 0; i < this.blocks.length; i++) {
					this.blocks[i].metricas.distTeleportes = 999;
				}
				break;
			case 1: // Firezones
				for (let i = 0; i < this.blocks.length; i++) {
					this.blocks[i].metricas.distFirezones = 999;
				}
				break;
			case 2: // Inimigos
				for (let i = 0; i < this.blocks.length; i++) {
					this.blocks[i].metricas.distInimigos = 999;
				}
				break;
			case 3: // Tesouros
				for (let i = 0; i < this.blocks.length; i++) {
					this.blocks[i].metricas.distTesouros = 999;
				}
				break;
		}
	};

	maxCamadaDistancias() {
		this.metricas.distTeleportes = this.getMaxDist(0);
		this.metricas.distFirezones = this.getMaxDist(1);
		this.metricas.distInimigos = this.getMaxDist(2);
		this.metricas.distTesouros = this.getMaxDist(3);

		// Métricas compostas
		this.metricas.compostas.inimigosTeleportes = this.getMaxDist(4);
		this.metricas.compostas.inimigo_Tesouro_Teleporte = this.getMaxDist(5);
		this.metricas.compostas.inimigosTeleportesPoder =
			this.getValorMaxMapaInfluencia("influenciaInimigosTeleportesPoder");
		this.metricas.distCaminhoEntradaSaida = this.getValorMaxMapaInfluencia("distCaminhoEntradaSaida");
	};

	atualizaMetricas(metricas = []) {
		if (metricas.length === 0) {
			this.metricas.distTeleportes = this.getMaxDist(0);
			this.metricas.distFirezones = this.getMaxDist(1);
			this.metricas.distInimigos = this.getMaxDist(2);
			this.metricas.distTesouros = this.getMaxDist(3);
	
			// Métricas compostas
			this.metricas.compostas.inimigosTeleportes = this.getMaxDist(4);
			this.metricas.compostas.inimigo_Tesouro_Teleporte = this.getMaxDist(5);
			this.metricas.compostas.inimigosTeleportesPoder =
				this.getValorMaxMapaInfluencia("influenciaInimigosTeleportesPoder");
			this.metricas.distCaminhoEntradaSaida = this.getValorMaxMapaInfluencia("distCaminhoEntradaSaida");
		} else {
			metricas.forEach(metrica => {
				switch (metrica) {
					case 'distTeleportes':
						this.metricas.distTeleportes = this.getMaxDist(0);
						break;
					case 'distFirezones':
						this.metricas.distFirezones = this.getMaxDist(1);
						break;
					case 'distInimigos':
						this.metricas.distInimigos = this.getMaxDist(2);
						if (this.number === 12) {
							// console.log('Maior distancia de inimigo', this.metricas.distInimigos);
						}
						break;
					case 'distTesouros':
						this.metricas.distTesouros = this.getMaxDist(3);
						break;
					case 'inimigosTeleportes':
						this.metricas.compostas.inimigosTeleportes = this.getMaxDist(4);
						break;
					case 'influenciaPoder':
						this.metricas.influenciaPoder = this.getValorMaxMapaInfluencia("influenciaPoder");
						break;
					case 'influenciaPoderTesouro':
						this.metricas.influenciaPoderTesouro = this.getValorMaxMapaInfluencia("influenciaPoderTesouro");
						break;
					case 'inimigo_Tesouro_Teleporte':
						this.metricas.compostas.inimigo_Tesouro_Teleporte = this.getMaxDist(5);
						break;
					case 'inimigosTeleportesPoder':
						this.metricas.compostas.inimigosTeleportesPoder =
							this.getValorMaxMapaInfluencia("influenciaInimigosTeleportesPoder");
						break;
					case 'distCaminhoEntradaSaida':
						this.metricas.distCaminhoEntradaSaida = this.getValorMaxMapaInfluencia("distCaminhoEntradaSaida");
						break;
				
					default:
						break;
				}
			});
		}
		// if (this.number === 12) {
		// 	console.log('max camada distancias');
		// 	console.log(this.metricas.distancias.maxCaminhoEntradaSaida);
		// }
	};

	move(dt) {
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

			this.enemies.forEach(enemy => {
				enemy.passo(dt);
			});
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
		const COR_HSL = 120;

		for (let i = 0; i < this.blocks.length; i++) {
			let valorMapaCalor = 0;
			let valor = 0;
			let influenciaNegativa = false;
			switch (Debugger.getDebugMode()) {
				case DEBUG_MODE.DISTANCIA_TELEPORTES:
					valor = this.blocks[i].metricas.distTeleportes;
					valorMapaCalor = valor / this.metricas.distTeleportes;
					break;
				case DEBUG_MODE.DISTANCIA_FIREZONES:
					valor = this.blocks[i].metricas.distFirezones;
					valorMapaCalor = valor / this.metricas.distFirezones;
					break;
				case DEBUG_MODE.DISTANCIA_INIMIGOS:
					valor = this.blocks[i].metricas.distInimigos;
					valorMapaCalor = valor / this.metricas.distInimigos;
					break;
				case DEBUG_MODE.DISTANCIA_TESOUROS:
					valor = this.blocks[i].metricas.distTesouros;
					valorMapaCalor = valor / this.metricas.distTesouros;
					break;
				case DEBUG_MODE.DISTANCIA_INIMIGOS_TELEPORTES: {
					valor = this.blocks[i].distInimigoTeleporte(
						this.metricas.distInimigos,
						this.metricas.distTeleportes
					).toFixed(3);
					valorMapaCalor = valor;
					break;
				}
				case DEBUG_MODE.DISTANCIA_INIMIGOS_TELEPORTES_FIREZONES: {
					valor = this.blocks[i].distInimigo_Tesouro_Teleporte(
						this.metricas.distInimigos,
						this.metricas.distTeleportes,
						this.metricas.distTesouros
					).toFixed(3);
					valorMapaCalor = valor;
					break;
				}
				case DEBUG_MODE.INFLUENCIA_PODER: {
					influenciaNegativa = true;
					valor = this.blocks[i].metricas.influenciaPoder;
					valorMapaCalor = this.blocks[i].metricas.influenciaPoder /
						this.metricas.influenciaPoder;
					break;
				}
				case DEBUG_MODE.MAPA_INIMIGOS_TELEPORTES_PODER: {
					valor = this.blocks[i].metricas.compostas.mediaInimigoTeleportePoder.toFixed(3);
					valorMapaCalor = this.blocks[i].metricas.compostas.mediaInimigoTeleportePoder;
					break;
				}
				case DEBUG_MODE.MAPA_INIMIGOS_TESOURO_TELEPORTES_PODER: {
					valor = this.blocks[i].metricas.compostas.mediaInimigoTesouroTeleportePoder.toFixed(3);
					valorMapaCalor = this.blocks[i].metricas.compostas.mediaInimigoTesouroTeleportePoder;
					break;
				}
				case DEBUG_MODE.PONTOS_DE_INTERESSE: {
					let indexRotaPercurso = this.rotaPercurso.indexOf(i);
					valor = indexRotaPercurso === -1 ? 0 : indexRotaPercurso; 
					valorMapaCalor = indexRotaPercurso === -1 ? 0 : 1; 
					break;
				}
				case DEBUG_MODE.DISTANCIA_CAMINHO_ENTRADA_SAIDA: {
					valor = this.blocks[i].metricas.distCaminhoEntradaSaida;
					valorMapaCalor = valor / this.metricas.distCaminhoEntradaSaida;
					break;
				}
				case DEBUG_MODE.MAPA_TESOURO_FIREZONE_TELEPORTE_ENTRADA_SAIDA: {
					valor = this.blocks[i].metricas.compostas.mediaTesouroFirezoneTeleporteEntradaSaida.toFixed(3);
					valorMapaCalor = this.blocks[i].metricas.compostas.mediaTesouroFirezoneTeleporteEntradaSaida;
					break;
				}
				case DEBUG_MODE.MAPA_INFLUENCIA_POSICIONAMENTO_INIMIGO: {
					valor = this.blocks[i].metricas.compostas.mediaPosicionamentoInimigo.toFixed(3);
					valorMapaCalor = this.blocks[i].metricas.compostas.mediaPosicionamentoInimigo;
					break;
				}
				case DEBUG_MODE.INFLUENCIA_PODER_TESOURO: {
					// influenciaNegativa = true;
					valor = this.blocks[i].metricas.influenciaPoderTesouro;
					valorMapaCalor = this.blocks[i].metricas.influenciaPoderTesouro /
						this.metricas.influenciaPoderTesouro;
					break;
				}
				default:
					return;
			}
			valorMapaCalor = COR_HSL * valorMapaCalor;
			params.ctx.save();
			params.ctx.fillStyle = `hsl(${(influenciaNegativa ? COR_HSL - valorMapaCalor : valorMapaCalor)
				}, 100%, 50%)`;
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
				valor,
				this.blocks[i].coluna * params.s + params.s / 2,
				this.blocks[i].linha * params.s + params.s / 2
			);
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
		this.pathRoom = room.pathRoom;
		this.metricas = room.metricas;
		// this.metricas = {
		// 	mapaInfluencia: {
		// 		influenciaPoder: room.metricas.mapaInfluencia.influenciaPoder,
		// 		compostas: {
		// 			inimigosTeleportesPoder: {
		// 				max: room.metricas.mapaInfluencia.compostas.inimigosTeleportesPoder.max,
		// 			}
		// 		}
		// 	},
		// 	distancias: {
		// 		maxTeleportes: room.metricas.distancias.maxTeleportes,
		// 		maxFirezones: room.metricas.distancias.maxFirezones,
		// 		maxTesouros: room.metricas.distancias.maxTesouros,
		// 		maxInimigos: room.metricas.distancias.maxInimigos,
		// 		maxCaminhoEntradaSaida: room.metricas.maxCaminhoEntradaSaida,
		// 		compostas: {
		// 			inimigosTeleportes: {
		// 				max: room.metricas.distancias.compostas.inimigosTeleportes.max,
		// 			},
		// 			inimigo_Tesouro_Teleporte: {
		// 				max: room.metricas.distancias.compostas.inimigo_Tesouro_Teleporte.max,
		// 			},
		// 		},
		// 	}
		// };
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
		this.pathRoom = room.pathRoom;
		this.metricas = room.metricas;
		// this.metricas = {
		// 	mapaInfluencia: {
		// 		influenciaPoder: 0,
		// 		compostas: {
		// 			inimigosTeleportesPoder: {
		// 				max: room.metricas.compostas.inimigosTeleportesPoder.max,
		// 			}
		// 		}
		// 	},
		// 	distancias: {
		// 		maxTeleportes: room.metricas.distancias.maxTeleportes,
		// 		maxFirezones: room.metricas.distancias.maxFirezones,
		// 		maxTesouros: room.metricas.distancias.maxTesouros,
		// 		maxInimigos: room.metricas.distancias.maxInimigos,
		// 		maxCaminhoEntradaSaida: room.metricas.maxCaminhoEntradaSaida,
		// 		compostas: {
		// 			inimigosTeleportes: {
		// 				max: room.metricas.distancias.compostas.inimigosTeleportes.max,
		// 			},
		// 			inimigo_Tesouro_Teleporte: {
		// 				max: room.metricas.distancias.compostas.inimigo_Tesouro_Teleporte.max,
		// 			},
		// 		},
		// 	}
		// };
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
			let cellAux = mapa.getCell(room.blocks[i].linha, room.blocks[i].coluna); // BLOCKS[ID, LINHA/COLUNA]
			cellAux.room = room.number;
			this.blocks.push(cellAux);
		}
		this.pathRoom = room.pathRoom;
		this.metricas = room.metricas;
		// this.metricas = {
		// 	mapaInfluencia: {
		// 		influenciaPoder: room.metricas.influenciaPoder,
		// 		compostas: {
		// 			inimigosTeleportesPoder: {
		// 				max: room.metricas.compostas.inimigosTeleportesPoder.max,
		// 			}
		// 		}
		// 	},
		// 	distancias: {
		// 		maxTeleportes: room.metricas.maxTeleportes,
		// 		maxFirezones: room.metricas.maxFirezones,
		// 		maxTesouros: room.metricas.maxTesouros,
		// 		maxInimigos: room.metricas.maxInimigos,
		// 		maxCaminhoEntradaSaida: room.metricas.maxCaminhoEntradaSaida,
		// 		compostas: {
		// 			inimigosTeleportes: {
		// 				max: room.metricas.compostas.inimigosTeleportes.max,
		// 			},
		// 			inimigo_Tesouro_Teleporte: {
		// 				max: room.metricas.compostas.inimigo_Tesouro_Teleporte.max,
		// 			},
		// 		},
		// 	}
		// };
		this.entrada = room.entrada;
		this.saida = room.saida;
		this.saida = room.saida;
		this.pontosInteresse = room.pontosInteresse;
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
			newEnemy.hpMax = enemy.hpMax;
			newEnemy.hpAtual = enemy.hpAtual;
			newEnemy.ataque = enemy.ataque;
			newEnemy.velocidade = enemy.velocidade;
			newEnemy.poderTotal = enemy.poderTotal;
			this.enemies.push(newEnemy);
		}
	};
	
	// Direção pra saida
	apontarDirecoesParaSaida() {
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

	definirBlocosVizinhos() {
		for (let i = 0; i < this.blocks.length; i++) {
            const bloco = this.blocks[i];
            bloco.indexRoom = i;
            bloco.vizinhos = [];
            for (let j = 0; j < this.blocks.length; j++) {
                const blocoAux = this.blocks[j];
                if (blocoAux.coluna === bloco.coluna) {
                    if (blocoAux.linha === bloco.linha - 1) {
                        bloco.vizinhos.push(j);
                    } else if (blocoAux.linha === bloco.linha + 1) {
                        bloco.vizinhos.push(j);
                    }
                } else if (blocoAux.linha === bloco.linha) {
                    if (blocoAux.coluna === bloco.coluna - 1) {
                        bloco.vizinhos.push(j);
                    } else if (blocoAux.coluna === bloco.coluna + 1) {
                        bloco.vizinhos.push(j);
                    }
                }
                if (bloco.vizinhos.length === 4) {
                    break;
                }
            }
        }
	}

	init() {
		this.apontarDirecoesParaSaida();
	};
	
	adicionarPontosDeInteresse() {
		this.pontosInteresse.push(this.entrada);
		this.achaTesouros();
		this.pontosInteresse.push(this.saida);
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
	};

	achaTesouros() {
		for (let i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].metricas.distTesouros === 0) {
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

	getPathRoom() {
		this.pathRoom.steps = [];
		let indexAtual = this.entrada;

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
	};
	
	inundar(origem, val, propriedade) {
		const avaliar = [{ celula: this.blocks[origem], valor: val}];
		let aux;
		while (aux = avaliar.shift()) {
			if (aux.valor < aux.celula[propriedade]) {
				aux.celula[propriedade] = aux.valor;
				for (let i = 0; i < aux.celula.vizinhos.length; i++) {
					avaliar.push({
						celula: this.blocks[aux.celula.vizinhos[i]],
						valor: aux.valor + 1
					});
				}
			}
		}
	};
	
	resetaDistanciaInundacaoTemp() {
		for (let i = 0; i < this.blocks.length; i++) {
			this.blocks[i].distInundacaoTemp = Infinity;
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

	/**
	 * Calcula a distancia entre os pontos de interesse, colocando
	 * a informação em uma matriz
	 */
	calculaDistPontosInteresse() {
		console.log("Room " + this.number + ": " + this.pontosInteresse.length);
		for (let i = 0; i < this.pontosInteresse.length; i++) {
			this.resetaDistanciaInundacaoTemp();
			this.inundar(this.pontosInteresse[i], 0, 'distInundacaoTemp');
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

	/**
	 * Adiciona ao array rotaPercurso os índices dos blocos que contêm os pontos de interesse.
	 * A ordem em que são inseridos é o de menor distância para o ponto atual.
	 * Ou seja, começando do teleporte de entrada, é adicionado sempre o pronto de interesse
	 * de menor distância daquele ponto.
	 * 
	 */
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
					// index !== i &&
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

	};

	getPathTesouros() {
		this.pathTesouros.steps = [];
		let atual = 0;
		let proximo = 1;

		for (let i = atual; i < this.rotaPercurso.length - 1; i++) {
			this.resetaDistanciaInundacaoTemp();
			this.inundar(this.rotaPercurso[proximo], 0, 'distInundacaoTemp');
			this.apontarDirecoesTemp();
			this.constroiPathDoisPontos(this.rotaPercurso[atual]);
			atual++;
			proximo++;
			if (proximo > this.rotaPercurso.length) {
				proximo--;
			}
		}
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

	atualizaMetricaCelulas(metrica) {
		let distMaxTeleporte = this.metricas.distTeleportes;
		let distMaxFirezones = this.metricas.distFirezones;
        let distMaxInimigos = this.metricas.distInimigos;
		let distMaxTesouros = this.metricas.distTesouros;
        let maxPoder = this.metricas.influenciaPoder;
		let distMaxCaminhoEntradaSaida = this.metricas.distCaminhoEntradaSaida;
		this.blocks.forEach((block) => {
            switch (metrica) {
                case "mediaInimigoTeleportePoder":
                    block.metricas.compostas.mediaInimigoTeleportePoder =
						block.fazerMediaPonderada(
							{
								distInimigos: 1,
								distTeleportes: 1,
								influenciaPoder: -1,
							},
							[
								distMaxInimigos,
								distMaxTeleporte,
								maxPoder
							]
						);
                    break;
                case "mediaInimigoTesouroTeleportePoder":
                    block.metricas.compostas.mediaInimigoTesouroTeleportePoder =
                        block.fazerMediaPonderada(
                            {
                                distInimigos: 1,
                                distTeleportes: 1,
                                distTesouros: 1,
                                influenciaPoder: -1,
                            },
                            [
                                distMaxInimigos,
                                distMaxTeleporte,
                                distMaxTesouros,
                                maxPoder,
                            ]
                        );
                    break;
				case "mediaTesouroFirezoneTeleporteEntradaSaida":
                    block.metricas.compostas.mediaTesouroFirezoneTeleporteEntradaSaida =
						block.fazerSomaTeste(
							TIPOS_DE_MEDIA.posicionamentoTesouroLongeCaminhoEntradaSaida,
							this
						);
				case "mediaPosicionamentoInimigo":
                    block.metricas.compostas.mediaPosicionamentoInimigo =
                        block.fazerSomaTeste(
                        // block.fazerMediaPonderadaTeste(
                            TIPOS_DE_MEDIA.posicionamentoInimigoPertoDeTesouro,
                            this
						);
					break;
                default:
                    break;
            }
		});
		// if (this.number === 12 && metrica === 'mediaPosicionamentoInimigo') {
		// 	console.log('Aquii');
		// 	this.blocks.forEach((block) => { 
		// 		console.log(block.linha, block.coluna, block.metricas.compostas.mediaPosicionamentoInimigo);
		// 	})
		// }
	}

	atualizaDistanciaCaminhoEntradaSaida(mapa) {
		if (this.pathRoom.steps.length > 0) {
			this.pathRoom.steps.forEach(celula => {
				mapa.atualizaDist(celula.linha, celula.coluna, 0, 'distCaminhoEntradaSaida');
			});
		}
	}

	resetaIdObjetoInundacao() {
		this.blocks.forEach(block => {
			block.idObjetoInundacao = -1;
		});
	}
	
	resetarMetrica(metrica, valor = Infinity) {
		this.blocks.forEach(block => {
			block.metricas[metrica] = valor;
		});
	}

}