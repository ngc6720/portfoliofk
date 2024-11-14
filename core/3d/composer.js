import {
  EffectComposer,
  RenderPass,
  ShaderPass,
  RGBShiftShader,
  DotScreenShader,
  GammaCorrectionShader,
  OutputPass,
} from "three/addons";

import { BloomPass } from "./bloom.js";

import renderer from "/core/3d/renderer.js";
import scene from "/core/3d/scene.js";
import camera from "/core/3d/camera.js";

import * as THREE from "three";

const composer = new EffectComposer(renderer);

// PASSESÒ

const myDotScreenPass = new ShaderPass({
  name: "myDotScreenShader",

  uniforms: {
    tDiffuse: { value: null },
    scale: { value: new THREE.Vector2(0.42, 0.74) },
  },

  vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: `

    uniform sampler2D tDiffuse;
    uniform vec2 scale;

		varying vec2 vUv;

		float pattern() {

			float s = sin( 0. ), c = cos( 0. ), offset = 0.;

			vec2 tex = gl_FragCoord.xy;
      tex.x += offset;
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

			return ( sin( point.x ) * sin( point.y ) ) * 4.0;

		}

		void main() {

			vec4 color = texture2D( tDiffuse, vUv );

			float average = ( color.r + color.g + color.b ) / 3.0;
      vec3 dotColor = vec3( average * 10.0 - 5.0 + pattern() );
      dotColor *= color.rgb;
			gl_FragColor = vec4( dotColor, color.a );
		}`,
});

const myRGBShiftPass = new ShaderPass({
  name: "myRGBShiftShader",

  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    angle: { value: 0.0 },
  },

  vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: `

  uniform sampler2D tDiffuse;
  varying vec2 vUv;

  void main() {

    vec2 offset = vec2( 3, 0) / (gl_FragCoord.xy / vUv);

    vec4 cr = texture2D(tDiffuse, (vUv + offset));
    vec4 cga = texture2D(tDiffuse, (vUv));
    vec4 cb = texture2D(tDiffuse, (vUv - offset));
    //vec4 cb = texture2D(tDiffuse, (vUv - offset * 2.));

    gl_FragColor = sRGBTransferOETF(vec4(cr.r, cga.g, cb.b, cga.a));
  }`,
});

const bloomPass = new BloomPass(20, 4, 9, 4);

// const DotScreenShaderPass = new ShaderPass(DotScreenShader);
// DotScreenShaderPass.uniforms.scale.value = 3;

// const dotScreenPass = new DotScreenPass(new THREE.Vector2(0, 0), 0, 0.6);

// ORDER

composer.addPass(new RenderPass(scene, camera));
composer.addPass(myDotScreenPass);
composer.addPass(myRGBShiftPass);
composer.addPass(bloomPass);

composer.addPass(new OutputPass());

export default composer;
