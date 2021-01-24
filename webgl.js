// Ensure ThreeJS is in global scope for the 'examples/'
import {random} from "canvas-sketch-util";
import palettes from "nice-color-palettes"
const glslify = require('glslify');


global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const seed = random.getRandomSeed();
console.log(seed)
random.setSeed(seed)

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  dimensions: [512, 512],
  duration: 24,
  // file: 'sketch-' + `${seed}` +'.png' //ctrl+k to commit and save with a git hash
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 100%)', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();


  // Setup a geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Setup a palette. Choose between random or manual.
  // const palette = ["#2D9CDB", "#DB444A", "#FFAF03"]
  const palette = random.pick(palettes);

  const fragmentShader = `
  varying vec2 vUv;
  
  uniform vec3 color;
  
  void main() {
    gl_FragColor = vec4(vec3(color * vUv.x), 1.0);
  }
  `

  const vertexShader = glslify(`
    varying vec2 vUv;
    
    uniform float time;
    
    #pragma glslify: noise = require('glsl-noise/simplex/4d');
    
    void main() {
      vUv = uv;
      vec3 pos = position.xyz * sin(time);
      pos += noise(vec4(position.xyz, time));
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `)

  // Setup a material
  const material = new THREE.MeshBasicMaterial({
    color: random.pick(palette),
  });
  const meshes = []

  // Setup a mesh with geometry + material
  for (let i = 0; i < 35; i++){
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms:{
        color: {value: new THREE.Color(random.pick(palette))},
        time: {value:0}
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
       random.range(-1, 1),
       random.range(-.75, .75),
       random.range(-1, 1)
    )
    mesh.scale.set(
        random.range(-1, 1),
        random.range(-1, 1),
        random.range(-1, 1)
    )
    mesh.scale.multiplyScalar(0.45)
    scene.add(mesh);
    meshes.push(mesh);
  }

  scene.add(new THREE.AmbientLight('hsl(0, 0% 90%)',  .5))

  const light = new THREE.DirectionalLight('#ffffff', 1);
  light.position.set(1,2,3);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 1.5;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead, time }) {
      // controls.update();
      scene.rotation.y = playhead * Math.PI * 2;

      meshes.forEach(mesh => {
        mesh.material.uniforms.time.value = time;
      })

      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
