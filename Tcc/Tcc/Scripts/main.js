// JavaScript source code

class divisa {
	constructor(biomeName, chance) {
		this.biomeName = biomeName;
		this.chance = chance;
	}
}


class bioma {
	constructor(name, power, divisas) {
		this.name = name;
		this.power = power;
		this.divisas = divisas;
	}
}

class map {
	newDoors(entrada){
		if(this.saiu){
			return;
		}
		var saida = Math.floor(Math.random() * 4)+1;
		while(saida == entrada){
			saida = Math.floor(Math.random() * 4)+1;
		}
		if(Math.random()<0.5) this.saiu = true;
		this.setGates(saida);
	}


	setGates(entrada){
		switch (entrada){
			case 1:
				this.entradaNorte = true;
				this.newDoors(entrada);
			break;
			case 2:
				this.entradaSul = true;
				this.newDoors(entrada);
			break;
			case 3:
				this.entradaLeste = true;
				this.newDoors(entrada);
			break;
			case 4:
				this.entradaOeste = true;
				this.newDoors(entrada);
			break;
			case -1:
				this.entradaNorte = true;
				this.entradaSul = true;
				this.entradaLeste = true;
				this.entradaOeste = true;
			break;
		}
	}

	nextRoom(x,y,entrada){
		var rng = Math.floor(Math.random() * 100)+1;
		console.log(rng);
		var acumulado = 0;
		for(var i = 0; i<this.biome.divisas.length;i++){
			if(rng<=acumulado+this.biome.divisas[i].chance){
				grid[[x, y]] = new map(x,y, biomes[this.biome.divisas[i].biomeName], entrada);
				posX = x;
				posY = y;
				updateScreen();
				return;
			}else{
				acumulado+=this.biome.divisas[i].chance
			}
		}
	
	}

	constructor(x, y, biome, entrada) {
		this.altura = x;
		this.largura = y;
		this.biome = biome;
		this.entradaNorte = false;
		this.entradaSul = false;
		this.entradaLeste = false;
		this.entradaOeste = false;
		this.setGates(entrada);
		this.saiu = false;
	}
}


function createGrassland(){
	var divisas = [];
	divisas.push(new divisa("Grassland", 10));
	divisas.push(new divisa("Desert", 90));
	return new bioma("Grassland", 100, divisas);
}

function CreateDesert(){
	var divisas = [];
	divisas.push(new divisa("Grassland", 90));
	divisas.push(new divisa("Desert", 10));
	return new bioma("Desert", 100, divisas);
}

var posX = 0;
var posY = 0;
grid = { };
biomes = { };
biomes["Grassland"] = createGrassland();
biomes["Desert"] = CreateDesert();


grid[[0, 0]] = new map(0,0, biomes["Grassland"], 1);

function updateScreen(){
	var mapa = grid[[posX, posY]]

	$("#map_name").text("Bioma: " + mapa.biome.name + ". Coordenadas: " + posX + " , " + posY);

	if(mapa.entradaNorte){
		$("#norte").css("background-color", "lawngreen");
		$("#norte").off().on( "click", function(e){
			if(grid[[posX, posY+1]]){
				posY++;
				updateScreen()
			}else mapa.nextRoom(posX,posY+1,2);
		});
	}else{
		$("#norte").css("background-color", "orangered");
		$("#norte").off().on( "click", false);
	}

	if(mapa.entradaSul){
		$("#sul").css("background-color", "lawngreen");
		$("#sul").off().on( "click", function(e){
			if(grid[[posX, posY-1]]){
				posY--;
				updateScreen()
			}else mapa.nextRoom(posX,posY-1,1);
		});
	}else{
		$("#sul").css("background-color", "orangered");
		$("#sul").off().on( "click", false);
	}

	if(mapa.entradaLeste){
		$("#leste").css("background-color", "lawngreen");
		$("#leste").off().on( "click", function(e){
			if(grid[[posX+1, posY]]){
				posX++;
				updateScreen()
			}else mapa.nextRoom(posX+1,posY,4);
		});
	}else{
		$("#leste").css("background-color", "orangered");
		$("#leste").off().on( "click", false);
	}

	if(mapa.entradaOeste){
		$("#oeste").css("background-color", "lawngreen");
		$("#oeste").off().on( "click", function(e){
			if(grid[[posX-1, posY]]){
				posX--;
				updateScreen()
			}else mapa.nextRoom(posX-1,posY,3);
		});
	}else{
		$("#oeste").css("background-color", "orangered");
		$("#oeste").off().on( "click", false);
	}

}
updateScreen();