// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(3, 3, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const loader = new THREE.TextureLoader();
  const texture = loader.load("avery.jpg");
  const brockTexture = loader.load("brock.jpg")
  const caseyTexture = loader.load("casey.jpg")
  const darrenTexture = loader.load("darren.jpg")
  const joshTexture = loader.load("josh.jpg")

  // Setup a material
  const material = new THREE.MeshBasicMaterial({
    map: texture
  });

  const brockMaterial = new THREE.MeshBasicMaterial({
    map: brockTexture
  })

  const caseyMaterial = new THREE.MeshBasicMaterial({
    map: caseyTexture
  })

  const darrenMaterial = new THREE.MeshBasicMaterial({
    map: darrenTexture
  })

  const joshMaterial = new THREE.MeshBasicMaterial({
    map: joshTexture
  })

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const brockMesh = new THREE.Mesh(geometry, brockMaterial);
  brockMesh.position.set(1.5, 1, 0);
  brockMesh.scale.setScalar(0.25)
  scene.add(brockMesh)

  const caseyMesh = new THREE.Mesh(geometry, caseyMaterial);
  caseyMesh.position.set(-1.5, .5, 1);
  caseyMesh.scale.setScalar(0.25)
  scene.add(caseyMesh)

  const darrenMesh = new THREE.Mesh(geometry, darrenMaterial);
  darrenMesh.position.set(-.5, -1.5, 1);
  darrenMesh.scale.setScalar(0.25)
  scene.add(darrenMesh)

  const joshMesh = new THREE.Mesh(geometry, joshMaterial);
  joshMesh.position.set(-1, -1, -1.5);
  joshMesh.scale.setScalar(0.25)
  scene.add(joshMesh)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
