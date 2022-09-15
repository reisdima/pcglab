import MoveComponent from "./moveComponent";

describe("MoveComponent class", () => {
  describe("Is right when... ", () => {
    it("Can create an instance", () => {
      const component = new MoveComponent();
      expect(typeof component).toBe("object");
    });

      it("Has a name", () => {
      const component = new MoveComponent();
      expect(typeof component.name).toBe("string");
      expect(component.name).toBe("MOVEMENT");
    });

    it("Has a value", () => {
      const component = new MoveComponent();
      expect(component.ax).toBe(0);
      expect(component.vx).toBe(0);
      expect(component.ay).toBe(0);
      expect(component.vy).toBe(0);
    });
  });
});
