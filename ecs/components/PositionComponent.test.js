import PositionComponent from "./PositionComponent";

describe("PositionComponent class", () => {
  describe("Is right when... ", () => {
    it("Can create an instance", () => {
      const component = new PositionComponent();
      expect(typeof component).toBe("object");
    });

    it("Has a name", () => {
      const component = new PositionComponent();
      expect(typeof component.name).toBe("string");
      expect(component.name).toBe("POSITION");
    });

    it("Has a value", () => {
      const component = new PositionComponent(10, 20);
      expect(component.x).toBe(10);
      expect(component.y).toBe(20);
    });
  });
});
