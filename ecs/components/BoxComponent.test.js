import BoxComponent from "./BoxComponent";

describe("BoxComponent class", () => {
  describe("Is right when... ", () => {
    it("Can create an instance", () => {
      const component = new BoxComponent();
      expect(typeof component).toBe("object");
    });

    it("Has a name", () => {
      const component = new BoxComponent();
      expect(typeof component.name).toBe("string");
      expect(component.name).toBe("BOX");
    });

    it("Has height and width", () => {
      const component = new BoxComponent(20, 30);
      expect(component.height).toBe(30);
      expect(component.width).toBe(20);
    });
  });
});
