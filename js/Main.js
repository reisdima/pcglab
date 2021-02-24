import Cena from "./Cena.js";
import Sprite from "./Sprite.js";
console.log("Hello World!");

const canvas = document.querySelector("canvas");
console.log(canvas);

const cena1 = new Cena(canvas);
const pc = new Sprite({vx:10});
const en1 = new Sprite({x:140, w:30, color:"red"});

cena1.adicionar(pc);
cena1.adicionar(en1);

cena1.iniciar();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "s":
            cena1.iniciar(); 
            break;
        case "S":
            cena1.parar(); 
            break;
    }
})