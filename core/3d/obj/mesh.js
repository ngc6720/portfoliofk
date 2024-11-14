import {
  Vector2,
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
  ClampToEdgeWrapping,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  DoubleSide,
  MeshPhongMaterial,
} from "three";

import { getRootVariable } from "/core/utils/element.js";

// GEOMETRY

const geometry = new PlaneGeometry(16, 16, 100, 100);

// TEXTURES

// const textureLoader = new TextureLoader();
// const alphaMap = textureLoader.load( './textures/displacement-wind-strokes.jpg');
// alphaMap.colorSpace = SRGBColorSpace;
// alphaMap.wrapS = ClampToEdgeWrapping;
// alphaMap.wrapT = ClampToEdgeWrapping;
// alphaMap.repeat = new Vector2( 1, 2 );
// alphaMap.wrapS = RepeatWrapping;
// alphaMap.wrapT = RepeatWrapping;

// const displaceMap = textureLoader.load( './textures/displacement-soft-clouds.jpg' );
// displaceMap.colorSpace = SRGBColorSpace;
// displaceMap.wrapS = ClampToEdgeWrapping;
// displaceMap.wrapT = ClampToEdgeWrapping;
// displaceMap.repeat = new Vector2( 1, 2 );
// displaceMap.wrapS = RepeatWrapping;
// displaceMap.wrapT = RepeatWrapping;

// MATERIAL

const material = new MeshPhongMaterial({
  color: getRootVariable("--three-color-mesh"),
  emissive: getRootVariable("--three-color-mesh-emissive"),
  emissiveIntensity: 1,
  // alphaMap: alphaMap,
  // displacementMap: displaceMap,
  displacementScale: 3,
  transparent: true,
  opacity: 1,
  side: DoubleSide,
  alphaTest: 0,
  depthTest: true,
  depthWrite: true,
  // wireframe: true
});

// MESH

const mesh = new Mesh(geometry, material);
mesh.position.set(0, 0, -1.5);
mesh.name = "mesh";

export default mesh;
