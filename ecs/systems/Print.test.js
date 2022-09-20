import Print from "./Print";

describe("Print class", () => {
  describe("Is right when... ", () => {
    it("It is a function", () => {
      expect(typeof Print).toBe("function");
    });

    it("Print a list of entities", () => {
      const entities = [
        { toString: () => "{id: 1}" },
        { toString: () => "{id: 2}" },
      ];
      expect(Print(entities)).toBe(`{id: 1}
{id: 2}`);
    });
  });
});
