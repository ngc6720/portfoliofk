import { AmbientLight, DirectionalLight, DirectionalLightHelper } from 'three';
import { getRootVariable } from '/core/utils/utils.js'

const light = new DirectionalLight(0xffffff, 0.8)
light.position.set(4, 4, 4)

// const helplight = new DirectionalLightHelper( light );

const ambientLight = new AmbientLight(getRootVariable('--three-color-ambientLight'), 1)

export { ambientLight, light }