import SeedGenerator from "./SeedGenerator.js";

var seedValueURL = location.search;

    if(seedValueURL.length != 0){                   //SEED PASSADA NA URL
      let aux = "?seed=";
      seedValueURL = seedValueURL.substring(aux.length, seedValueURL.length);
      seedValueURL = parseInt(seedValueURL);
    }
    else{                                           //SEED ALEATÓRIA
      let maxValue = 5000000;
      let minValue = 500000;
      seedValueURL = (Math.floor(Math.random() * (maxValue - minValue)) + minValue);
    }
var seedGen = new SeedGenerator({seed_1: seedValueURL , seed_2_string: "teste"});

export default seedGen;