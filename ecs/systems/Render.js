export default function Render(entityManager, { ctx, canvas, t, t0, dt }) {
  t0 = t0 ?? t;
  dt = (t - t0) / 1000;

  canvas.width = 960;
  canvas.height = 600;
  ctx.fillStyle = "darkslategray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lightgreen";

  entityManager.entities.forEach((entity) => {
    const pos = entity.get("POSITION");
    const box = entity.get("BOX");
    ctx.fillRect(pos.x, pos.y, box.width, box.height);
  });

  t0 = t;
}

requestAnimationFrame(desenha);

function desenha(t) {
  requestAnimationFrame(desenha);
}
