import { Scene, Color, GridHelper, AxesHelper } from 'three'

import camera from '/core/3d/camera.js'
import mesh from '/core/3d/obj/mesh.js'
import { path } from '/core/3d/obj/path.js'
import { lookatPath } from '/core/3d/obj/lookat-path.js'
// import { helplight } from '/core/3d/light.js'
import { ambientLight, light } from '/core/3d/light.js'

import { getRootVariable } from '/core/utils/utils.js'

const scene = new Scene();
scene.background = new Color( getRootVariable('--three-color-background') );

const gridHelper = new GridHelper( 64, 16 ); 

const axesHelper = new AxesHelper( 4 );
axesHelper.setColors('lime', "aquamarine",'LightCoral');

scene.add( mesh );

path.name = 'path';
scene.add( path );

// mesh.visible = false; // dev
path.visible = false; // dev
lookatPath.visible = false; // dev
gridHelper.visible = false; // dev
axesHelper.visible = false; // dev

lookatPath.name = 'lookatPath';
scene.add( lookatPath );

// scene.add( helplight );
// scene.add( light );
// scene.add( ambientLight );

scene.add( camera )
camera.position.set(0, 0, 0)

gridHelper.name = 'grid';
scene.add( gridHelper );

axesHelper.name = 'axes';
scene.add( axesHelper );



export default scene;