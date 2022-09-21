export default function Move(entityManager, { dt }) {
  entityManager.entities.forEach((entity) => {
    const pos = entity.get("POSITION");
    const v = entity.get("VELOCITY");
    if (pos === undefined || v === undefined) return;
    v.vx += v.ax * dt;
    pos.x += v.vx * dt;
    v.vy += v.ay * dt;    
    pos.y += v.vy * dt;
  });
}