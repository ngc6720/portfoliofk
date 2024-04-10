
import { BloomPass, EffectComposer,RenderPass, ShaderPass, RGBShiftShader, DotScreenShader, OutputPass } from 'three/addons'

import renderer from '/core/3d/renderer.js'
import scene from '/core/3d/scene.js'
import camera from '/core/3d/camera.js'

const myShaderPass = new ShaderPass({

	name: 'myShader',

	uniforms: {

		'tDiffuse': { value: null },
		'opacity': { value: 1.0 }

	},

	vertexShader: `

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {
            vec4 lol = vec4(1, 0, 0, 1);
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * vec4(texel * 3.);


		}`

});


const composer = new EffectComposer( renderer );

const DotScreenShaderPass = new ShaderPass( DotScreenShader );
DotScreenShaderPass.uniforms[ 'scale' ].value = 3;

const bloomPass = new BloomPass(
    25,    // strength
    4,   // kernel size
    9,    // sigma ?
    256,  // blur render target resolution
);

const RGBShiftShaderPass = new ShaderPass( RGBShiftShader );
RGBShiftShaderPass.uniforms[ 'amount' ].value = 0.0015;
    

composer.addPass( new RenderPass( scene, camera ) );

composer.addPass( DotScreenShaderPass );
composer.addPass( RGBShiftShaderPass );
composer.addPass( bloomPass );
composer.addPass( myShaderPass );

composer.addPass( new OutputPass() );

export default composer;