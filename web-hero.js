const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

//multiply radius by ~.05 to get normal circles
const seed = random.value();

const settings = {
    dimensions: [ 2115, 260 ],
    file: 'web-circle-divider-' + `${seed}` +'.png'
};

const sketch = () => {
    // const frequency = 0.5;
    const palette = random.pick(palettes);
    palette.push("#2D9CDB");
    // const palette = ["#2D9CDB", "#DB444A", "#FFAF03"]


    const createGrid = () => {
        const points = [];
        const count = 30;
        for ( let x = 0; x<count; x++) {
            for ( let y=0; y<count; y++) {
                const u = count <= 1 ? 0.5 : (x / (count - 1));
                const v = count <= 1 ? 0.5 : (y / (count - 1));
                const radius = Math.abs(random.noise2D(u, v)) * .75;
                points.push({
                    color: random.pick(palette),
                    radius,
                    position: [u,v]
                });
            }
        }
        return points;
    };

    const points = createGrid().filter(() => random.value() > 0.25);
    const margin = 20;

    return ({ context, width, height }) => {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, width, height);

        points.forEach(data => {
            const {
                position,
                radius,
                color,
            } = data


            const [u,v] = position

            const x = lerp(margin, width - margin, u);
            const y = lerp(margin, height - margin, v);

            context.beginPath();
            context.arc(x, y, radius * width, 0, Math.PI * 2, false);
            context.fillStyle = color;
            context.fill();
        });
    };
};

canvasSketch(sketch, settings);
