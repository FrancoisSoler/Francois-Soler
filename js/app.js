import '../scss/app.scss';
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
//Animate On Scroll
import AOS from 'aos';
import 'aos/dist/aos.css';
// AOS
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("it worked")
  AOS.init({
    easing: 'ease-in-sine',
    delay: 50,
    once: true,

  })
  
});
// display message on mobile
window.onload=function(){
  var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
  if (mobile) {
      alert("Ce site offre une meilleure experience sur un écran plus grand :(");              
  } else {

  }
}

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 32, 100);
const material = new THREE.PointsMaterial({
  size: 0.05
});
const torus = new THREE.Points(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const earthLight =  new THREE.PointLight(0xffffff)
earthLight.position.set(5, 0, 65 )

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight, /* earthLight */);

// Helpers

/*  const lightHelper = new THREE.PointLightHelper(earthLight)
 const gridHelper = new THREE.GridHelper(200, 50);
 scene.add(lightHelper, gridHelper) */

// const controls = new OrbitControls(camera, renderer.domElement);


const getRandomParticelPos = (particleCount) => {
  const arr = new Float32Array(particleCount * 2);
  for (let i = 0; i < particleCount; i++) {
    arr[i] = (Math.random() - 0.5) * 32;
  }
  return arr;
};
function addStar() {

  const geometrys = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];

  geometrys[0].setAttribute(
    "position",
    new THREE.BufferAttribute(getRandomParticelPos(1800), 3)
  );
  geometrys[1].setAttribute(
    "position",
    new THREE.BufferAttribute(getRandomParticelPos(1800), 3)
  );

  const loader = new THREE.TextureLoader();

  // material
  const materials = [
    new THREE.PointsMaterial({
      size: 0.05,
      map: loader.load(
        "https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp1.png"
      ),
      transparent: true
      // color: "#ff0000"
    }),
    new THREE.PointsMaterial({
      size: 0.075,
      map: loader.load(
        "https://raw.githubusercontent.com/Kuntal-Das/textures/main/sp2.png"
      ),
      transparent: true
      // color: "#0000ff"
    })
  ];


  const starsT1 = new THREE.Points(geometrys[1], materials[1]);
  const starsT2 = new THREE.Points(geometrys[1], materials[1]);

  /*   const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshPhongMaterial ({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
   */
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  starsT1.position.set(x, y, z);
  starsT2.position.set(x, y, z);
  scene.add(starsT1);
  scene.add(starsT2);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('./images/galaxy.jpg');
scene.background = spaceTexture;

// Avatar

const cubeTexture = new THREE.TextureLoader().load('./images/selfie.jpg');

const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ map: cubeTexture }));

scene.add(cube);

// Moon

const moonTexture = new THREE.TextureLoader().load('./images/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('./images/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);
// low poly earth
const gltfLoader = new GLTFLoader();
gltfLoader.load('/3D/earth_low_poly.gltf', (gltf) => {
/*   gltf.scene.scale.set(1,1,1) */
/*   gltf.scene.rotation.set(0, 1.7, 0) */
gltf.scene.position.z = 49;
gltf.scene.position.setX(-5);
  scene.add(gltf.scene)


})


moon.position.z = 24;
moon.position.setX(-10);

cube.position.z = -6;
cube.position.x = 3;
cube.position.y = 0;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.002;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.01;

  moon.rotation.z += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();