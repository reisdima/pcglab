import Path from "../js/Path";

describe("Classe Path", () => {
  describe("Está corretamente criada quando:", () => {
    it("É um objeto", () => {
      const path = new Path();
      expect(typeof path).toBe("object");
    });

    it("Contém uma matriz", () => {
      const path = new Path();
      expect(path.COLUNAS).toBeDefined();
      expect(path.COLUNAS).toBeGreaterThan(0);
      expect(path.LINHAS).toBeDefined();
      expect(path.LINHAS).toBeGreaterThan(0);
    });
    
    it("Possui um tamanho maior do que zero", () => {
      const path = new Path();
      expect(path.SIZE).toBeDefined();
      expect(path.SIZE).toBeGreaterThan(0);
    });

    it("Possui uma cena", () => {
      const path = new Path();
      expect(path.cena).toBeDefined();
    });

    it("Steps está preenchido inicialmente com zeros", () => {
      const path = new Path();
      for (let l = 0; l < path.LINHAS; l++) {
        for (let c = 0; c < path.COLUNAS; c++) {
          expect(path.steps[l][c]).toEqual(0);
        }
    }
    
    });
    
  });
});