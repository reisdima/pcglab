/**
 * Heurística que compra o recurso mais barato
 * possível
 */

import Heuristica from "./Heuristica.js";

export default class CheaperFirst extends Heuristica {
    constructor(canvas) {
        super(canvas);
    }

    controle(cena) {
        super.controle(cena);

        if (cena.counter >= 1) {
            cena.powerUp();
        }
        let resources = cena.resources.slice(0);
        let cheaper = resources[0];
        resources.forEach(resource => {
            cheaper = resource.currentCost < cheaper.currentCost ? resource : cheaper;
        });
        cena.upgrade(cheaper);

    }

}