import { Mesh, SphereGeometry, MeshBasicMaterial, DoubleSide } from "three";
// import Gui from "lil-gui";
// const gui = new Gui();
import { getRootVariable } from "/core/utils/element.js";

const sphere = new Mesh(
  new SphereGeometry(3, 32, 16),
  new MeshBasicMaterial({
    color: getRootVariable("--three-color-disc"),
    side: DoubleSide,
    transparent: true,
    opacity: 0.1,
    alphaTest: 0,
  })
);
sphere.position.set(3.02, -8, 2.2);
sphere.position.set(4.6, -7.6, 4.6);
// gui.add(sphere.position, "x").min(-16).max(16).step(0.01);
// gui.add(sphere.position, "y").min(-16).max(16).step(0.01);
// gui.add(sphere.position, "z").min(-16).max(16).step(0.01);

sphere.name = "sphere";
export default sphere;
