export default function Move(entityManager, { dt }) {
  entityManager.entities.forEach((entity) => {
    const pos = entity.get("POSITION");
    const v = entity.get("VELOCITY");
    if (pos === undefined || v === undefined) return;
    pos.x += v.vx * dt;
    pos.y += v.vy * dt;
  });
}
