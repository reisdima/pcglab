import Cena from "./Cena.js";
import Sprite from "../../js/Sprite.js";
import Button from "../../js/utils/Button.js";
import getXY from "../../js/utils/getXY.js";
import { resources } from "./resources.js"

export default class GameScene extends Cena {
	constructor(canvas = null, assets = null) {
		super(canvas, assets);
		this.resources = resources;
		this.scoreRate = 0;
		this.powerSpent = 0;
		this.currentPower = 0;
		this.mapaTeclado = {
			a: false,
			b: false,
			c: false,
			d: false,
			e: false,
		}
		this.log = {
			upgrades: [],
			registros: []
		}
		this.spacePressed = false;
		this.createAreas();
	}

	desenhar() {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.desenharTextos();
		this.desenharTabela();
		this.powerUpButton.draw(this.ctx);
	}

	desenharTextos() {
		this.ctx.font = "20px Times";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "left";
		this.ctx.fillText("Poder: ", 50, 50);
		this.ctx.fillText(this.currentPower.toFixed(1), 125, 50);
		this.ctx.fillText("Taxa: ", 50, 75);
		this.ctx.fillText(this.scoreRate + " /s", 125, 75);
		this.ctx.fillText("Gasto: ", 50, 100);
		this.ctx.fillText(this.powerSpent, 125, 100);
		this.ctx.fillText("Tempo: ", 785, 40);
		this.ctx.fillText(this.temporizador.toFixed(0), 850, 40);
	}

	desenharTabela() {
		let startX = 20;
		let startY = 150;
		let offsetX = 150;
		let offsetY = 50;
		// this.ctx.textAlign = "center";
		this.ctx.fillText("Recurso", startX, startY);
		this.ctx.fillText("Incremento", startX + offsetX, startY);
		this.ctx.fillText("Incremento total", startX + 2 * offsetX, startY);
		this.ctx.fillText("Quantidade", startX + 3 * offsetX, startY);
		this.ctx.fillText("Custo", startX + 4 * offsetX, startY);
		startY += offsetY;
		this.resources.forEach((resource) => {
			this.ctx.fillText(resource.label, startX, startY);
			this.ctx.fillText(resource.income, startX + offsetX, startY);
			this.ctx.fillText(
				parseFloat((resource.income * resource.quantity).toFixed(10)),
				startX + 2 * offsetX,
				startY
			);
			this.ctx.fillText(resource.quantity, startX + 3 * offsetX, startY);
			this.ctx.fillText(resource.currentCost, startX + 4 * offsetX, startY);
			startY += offsetY;
		});
	}

	createAreas() {
		this.powerUpButton = new Button(
			0.7 * this.canvas.width,
			0.2 * this.canvas.height,
			0.15 * this.canvas.width,
			0.07 * this.canvas.height,
			"Power up!"
		);
	}

	quadro(t) {
		super.quadro(t);
		this.temporizador += this.dt;
		this.counter += this.dt;
		this.controle();
		this.currentPower = parseFloat(
			(this.currentPower + this.scoreRate * this.dt).toFixed(10)
		);
		if (this.counter >= 1) {
			this.log.registros.push({
				"tempo": this.temporizador.toFixed(0),
				"totalGasto": this.powerSpent,
				"taxaAtual": this.scoreRate,
				"poderAtual": this.currentPower.toFixed(1)
			});
			this.game.graph.adicionarDado(this.temporizador.toFixed(0), this.scoreRate);
			this.game.graph.atualizarGrafico();
			// console.log(this.log);
			this.counter = 0;
		}
		// if (this.temporizador.toFixed(0) % 5 === 0) {
		// 	this.game.graph.atualizarGrafico();
		// }
	}

	// Controle dos inputs do teclado
	controle() {
		this.heuristica?.controle(this);
		for (let i = 0; i < this.resources.length; i++) {
			const element = this.resources[i];
			if (this.input.comandos.get(element.label)) {
				if (!this.mapaTeclado[element.label]) {
					this.mapaTeclado[element.label] = true;
					if (this.currentPower >= element.currentCost) {
						this.upgrade(element);
					}
					return;
				}
			} else {
				this.mapaTeclado[element.label] = false;
			}
		}
	}

	quandoColidir(a, b) {
		// if(a.tags.has("pc") && b.tags.has("coin")){
		//     if(!this.aRemover.includes(b)){
		//         this.aRemover.push(b);
		//         a.distancias.clear();
		//     }
		//     this.game.moedas += 1;
		// }
		// if(a.tags.has("pc") && b.tags.has("exit")){ // Se pc colidir com saída, remove os dois e reinicia a cena
		//     if(!this.aRemover.includes(a)){
		//         this.aRemover.push(a);
		//     }
		//     if(!this.aRemover.includes(b)){
		//         this.aRemover.push(b);
		//     }
		//     this.game.selecionaCena("fase1");
		// }
	}

	preparar() {
		super.preparar();
		this.canvas.onmousedown = (e) => {
			this.mousedown(e);
		};
		this.canvas.onmousemove = (e) => {
			this.mousemove(e);
		};
		this.canvas.onclick = (e) => {
			this.click(e);
		};
	}

	mousedown(e) {
		if (this.assets.progresso() < 100.0 || this.expire > 0) {
			return;
		}
	}

	mousemove(e) {
		const [x, y] = getXY(e, this.canvas);
		if (this.powerUpButton.hasPoint({ x, y })) {
			this.canvas.style.cursor = 'pointer'
		} else {
			this.canvas.style.cursor = 'default'
		}
	}

	click(e) {
		this.mousedown(e);
		const [x, y] = getXY(e, this.canvas);
		if (this.powerUpButton.hasPoint({ x, y })) {
			this.powerUp();
		}
	}

	desenharHud() {
		// Fase
		this.ctx.font = "15px Arial";
		this.ctx.textAlign = "left";
		this.ctx.fillStyle = "white";
		this.ctx.fillText("Moedas coletadas: " + this.game.moedas, 10, 20);
		this.ctx.fillText("Sprites na tela: " + this.sprites.length, 10, 40);
	}

	upgrade(resource) {
		if (resource.currentCost > this.currentPower)
			return;
		this.currentPower = parseFloat(
			(this.currentPower - resource.currentCost).toFixed(10)
		);
		this.powerSpent += parseFloat(
			resource.currentCost.toFixed(10)
		);
		resource.quantity++;
		this.scoreRate = parseFloat(
			(this.scoreRate + resource.income).toFixed(10)
		);
		this.log.upgrades.push({
			"recursoMelhorado": resource.label,
			"custo": resource.currentCost,
		});
		resource.currentCost = Math.round(
			resource.initialCost * Math.pow(1.15, resource.quantity)
		);
		// this.game.graph.adicionarDado(resource.currentIncome, resource.currentCost);
		// this.game.graph.atualizarGrafico();
		return;
	}

	powerUp() {
		this.currentPower = parseFloat(
			(
				this.currentPower +
				1 +
				this.resources[0].quantity * this.resources[0].income
			).toFixed(10)
		);
	}
}
