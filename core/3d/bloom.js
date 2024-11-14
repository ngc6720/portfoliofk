import {
  AdditiveBlending,
  HalfFloatType,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  WebGLRenderTarget,
} from "three";
import { Pass, FullScreenQuad } from "three/addons";

// import GUI from "lil-gui";

// const gui = new GUI();

const ConvolutionShader = {
  name: "ConvolutionShader",

  defines: {
    KERNEL_SIZE_FLOAT: "25.0",
    KERNEL_SIZE_INT: "25",
  },

  uniforms: {
    tDiffuse: { value: null },
    uImageIncrement: { value: new Vector2(0.001953125, 0.0) },
    cKernel: { value: [] },
    qt1: { value: 2013 },
    qt2: { value: 1571 },
  },

  vertexShader: /* glsl */ `

		uniform vec2 uImageIncrement;

		varying vec2 vUv;

		void main() {

			vUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `

		uniform float cKernel[ KERNEL_SIZE_INT ];

		uniform sampler2D tDiffuse;
		uniform vec2 uImageIncrement;

		uniform float qt1;
		uniform float qt2;


		varying vec2 vUv;

		void main() {

			vec2 imageCoord = vUv;
			vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );

      vec4 color = texture2D( tDiffuse, vUv );

			for( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {

				sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];
				imageCoord += uImageIncrement / (gl_FragCoord.xy / vUv) * vec2(qt1, qt2);
        imageCoord.x = max(imageCoord.x, 0.);
			}

			gl_FragColor = sum;

		}`,

  buildKernel: function (sigma) {
    // We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.

    const kMaxKernelSize = 25;
    let kernelSize = 2 * Math.ceil(sigma * 3.0) + 1;

    if (kernelSize > kMaxKernelSize) kernelSize = kMaxKernelSize;

    const halfWidth = (kernelSize - 1) * 0.5;

    const values = new Array(kernelSize);
    let sum = 0.0;
    for (let i = 0; i < kernelSize; ++i) {
      values[i] = gauss(i - halfWidth, sigma);
      sum += values[i];
    }

    // normalize the kernel

    for (let i = 0; i < kernelSize; ++i) values[i] /= sum;

    return values;
  },
};

function gauss(x, sigma) {
  return Math.exp(-(x * x) / (2.0 * sigma * sigma));
}

class BloomPass extends Pass {
  constructor(strength = 1, kernelSize = 25, sigma = 4) {
    super();

    // render targets

    this.renderTargetX = new WebGLRenderTarget(1, 1, { type: HalfFloatType }); // will be resized later
    this.renderTargetX.texture.name = "BloomPass.x";
    this.renderTargetY = new WebGLRenderTarget(1, 1, { type: HalfFloatType }); // will be resized later
    this.renderTargetY.texture.name = "BloomPass.y";

    // combine material

    this.combineUniforms = UniformsUtils.clone(CombineShader.uniforms);

    this.combineUniforms["strength"].value = strength;

    this.materialCombine = new ShaderMaterial({
      name: CombineShader.name,
      uniforms: this.combineUniforms,
      vertexShader: CombineShader.vertexShader,
      fragmentShader: CombineShader.fragmentShader,
      blending: AdditiveBlending,
      transparent: true,
    });

    // convolution material

    const convolutionShader = ConvolutionShader;

    this.convolutionUniforms = UniformsUtils.clone(convolutionShader.uniforms);

    this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurX;
    this.convolutionUniforms["cKernel"].value =
      ConvolutionShader.buildKernel(sigma);

    this.materialConvolution = new ShaderMaterial({
      name: convolutionShader.name,
      uniforms: this.convolutionUniforms,
      vertexShader: convolutionShader.vertexShader,
      fragmentShader: convolutionShader.fragmentShader,
      defines: {
        KERNEL_SIZE_FLOAT: kernelSize.toFixed(1),
        KERNEL_SIZE_INT: kernelSize.toFixed(0),
      },
    });

    // gui
    //   .add(this.materialConvolution.uniforms.qt1, "value")
    //   .min(0)
    //   .max(5000)
    //   .step(1);
    // gui
    //   .add(this.materialConvolution.uniforms.qt2, "value")
    //   .min(0)
    //   .max(5000)
    //   .step(1);

    this.needsSwap = false;

    this.fsQuad = new FullScreenQuad(null);
  }

  render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    if (maskActive) renderer.state.buffers.stencil.setTest(false);

    // Render quad with blured scene into texture (convolution pass 1)

    this.fsQuad.material = this.materialConvolution;

    this.convolutionUniforms["tDiffuse"].value = readBuffer.texture;
    this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurX;

    renderer.setRenderTarget(this.renderTargetX);
    renderer.clear();
    this.fsQuad.render(renderer);

    // Render quad with blured scene into texture (convolution pass 2)

    this.convolutionUniforms["tDiffuse"].value = this.renderTargetX.texture;
    this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurY;

    renderer.setRenderTarget(this.renderTargetY);
    renderer.clear();
    this.fsQuad.render(renderer);

    // Render original scene with superimposed blur to texture

    this.fsQuad.material = this.materialCombine;

    this.combineUniforms["tDiffuse"].value = this.renderTargetY.texture;

    if (maskActive) renderer.state.buffers.stencil.setTest(true);

    renderer.setRenderTarget(readBuffer);
    if (this.clear) renderer.clear();
    this.fsQuad.render(renderer);
  }

  setSize(width, height) {
    this.renderTargetX.setSize(width, height);
    this.renderTargetY.setSize(width, height);
  }

  dispose() {
    this.renderTargetX.dispose();
    this.renderTargetY.dispose();

    this.materialCombine.dispose();
    this.materialConvolution.dispose();

    this.fsQuad.dispose();
  }
}

const CombineShader = {
  name: "CombineShader",

  uniforms: {
    tDiffuse: { value: null },
    strength: { value: 1.0 },
  },

  vertexShader: /* glsl */ `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `

		uniform float strength;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv + 0.005 );
			gl_FragColor = strength * texel;
		}`,
};

BloomPass.blurX = new Vector2(0.001953125, 0.0);
BloomPass.blurY = new Vector2(0.0, 0.001953125);

export { BloomPass };
