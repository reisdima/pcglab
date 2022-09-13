export default function Render(entityManager, {ctx, canvas}){
 ctx.fillStyle = "darkslategray";
 ctx.fillRect(0, 0, canvas.width, canvas.height);
 ctx.fillStyle = "lightgreen";
 entityManager.entities.forEach(entity => {
  const pos = entity.get('POSITION');
  const box = entity.get('BOX');
   ctx.fillRect(pos.x, pos.y, box.width, box.height);
 });

}


// const canvas = document.querySelector("canvas");
// const ctx = canvas.getContext("2d");
// canvas.width = 960;
// canvas.height = 600;
// let t0;
// let dt;

// requestAnimationFrame(desenha);

// function desenha(t) {
//   t0 = t0 ?? t;
//   dt = (t - t0) / 1000;

//   ctx.fillStyle = "darkslategray";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   requestAnimationFrame(desenha);
//   t0 = t;
// }
