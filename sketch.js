const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const seed = random.value();

const settings = {
  dimensions: [ 2048, 2048 ],
  file: 'sketch-' + `${seed}` +'.png'
};

const sketch = () => {
  random.setSeed(seed)
  // const frequency = 0.5;
  const palette = random.pick(palettes);

  const createGrid = () => {
    const points = [];
    const count = 40;
    for ( let x = 0; x<count; x++) {
      for ( let y=0; y<count; y++) {
        const u = count <= 1 ? 0.5 : (x / (count - 1));
        const v = count <= 1 ? 0.5 : (y / (count - 1));
        const radius = Math.abs(random.noise2D(u, v)) * 0.5;
        points.push({
          color: random.pick(palette),
          radius,
          position: [ u, v ],
          rotation: random.noise2D(u, v),
      });
      }
    }
    return points;
  };

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 0;

  return ({ context, width, height }) => {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color,
        rotation
      } = data


      const [u,v] = position

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Arial"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('/', 0, 0);

      context.restore();

    });
  };
};

canvasSketch(sketch, settings);
