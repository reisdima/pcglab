const Sprite = require("../classes/Sprite");

describe("Sprite class", () => {
  describe("is correctly created when", () => {

    it("is an object", () => {
      const sprite = new Sprite();
      expect(typeof sprite).toBe("object");
    });

    it("has an initial position", () => {
      const sprite = new Sprite();

      expect(sprite.x).toBeDefined();
      expect(sprite.y).toBeDefined();

      const sprite2 = new Sprite({ x: 10, y: 20 });
      expect(sprite2.x).toBe(10);
      expect(sprite2.y).toBe(20);
    });

    it("has 2d velocity", () => {
      const sprite = new Sprite();
      expect(sprite.vx).toBeDefined();
      expect(sprite.vy).toBeDefined();

      const sprite2 = new Sprite({ vx: 10, vy: -10 });
      expect(sprite2.vx).toBe(10);
      expect(sprite2.vy).toBe(-10);
    });
  });
});
