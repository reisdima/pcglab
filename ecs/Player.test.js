import Player from "./Player";

describe("Player class", () => {
  describe("Is right when... ", () => {
    it("Can create an instance", () => {
      const entity = new Player();
      expect(typeof entity).toBe("object");
    });

    it("Has a map of components", () => {
      const entity = new Player();
      expect(typeof entity.components).toBe("object");
      expect(typeof entity.components.set).toBe("function");
      expect(typeof entity.components.delete).toBe("function");
    });

    it("add a component increase components size", () => {
      const entity = new Player();
      expect(entity.components.size).toBe(2);
      entity.addComponent({name:'teste'});
      expect(entity.components.size).toBe(3);
    });

    it("remove a component decrease components size", () => {
      const entity = new Player();
      const mockComponent = {name:'teste'};
      entity.addComponent(mockComponent);
      expect(entity.components.size).toBe(3);
      entity.removeComponent(mockComponent);
      expect(entity.components.size).toBe(2);

    });

  });
});
