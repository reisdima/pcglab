/**
 * Heurística que compra o recurso com o maior
 * custo benefício (custo / incremento)
 */

import Heuristica from "./Heuristica.js";

export default class CustoBeneficio extends Heuristica {
    constructor(canvas) {
        super(canvas);
    }

    controle(cena) {
        super.controle(cena);
        if (cena.counter >= 1) {
            cena.powerUp();
        }
        let resources = cena.resources.slice(0);
        let best = resources[0];
        resources.forEach(resource => {
            let custoBeneficioAtual = best.income / best.currentCost;
            let custoBeneficio = resource.income / resource.currentCost;
            if (custoBeneficio > custoBeneficioAtual)
                best = resource;
        });
        cena.upgrade(best);

    }

}