import { PerspectiveCamera } from "three";

// import { light } from '/core/3d/light.js'

const camera = new PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(16, 16, 16);
camera.lookAt(16, 16, 16);

// camera.add(light)

export default camera;
