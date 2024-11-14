import { AudioLoader } from "./audioLoader.js";

export default class OneHead extends AudioLoader {
  constructor(audioContext, { gain = 1 } = {}) {
    super();
    this.audioContext = audioContext;
    this.node = new AudioWorkletNode(this.audioContext, "oneh", {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2],
      parameterData: { gain: gain },
    });
  }

  #loadBuffers(buffers) {
    this.node.port.postMessage({
      buffers: buffers.map((buffer) =>
        buffer
          ? [buffer.getChannelData(0), buffer.getChannelData(1)]
          : [new Float32Array([0]), new Float32Array([0])]
      ),
    });
  }

  async load(sources, cbProgress = () => {}) {
    const buffers = await this.loadSources(sources, cbProgress);
    this.#loadBuffers(buffers);
  }

  play(i) {
    if (this.audioContext.state === "running")
      this.node.port.postMessage({ play: i });
  }
}
