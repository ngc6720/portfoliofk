import { AudioLoader } from "./audioLoader.js";

export default class Player extends AudioLoader {
  #bufferLength;
  #analyser;
  #dataArray;

  constructor(
    audioContext,
    { fadems = 10, autoplay = true, loop = false, gain = 1 } = {}
  ) {
    super();

    this.audioContext = audioContext;

    this.node = new AudioWorkletNode(this.audioContext, "player", {
      numberOfInputs: 0,
      numberOfOutputs: 2,
      outputChannelCount: [2, 1],
      parameterData: { gain: gain },
      processorOptions: { fadems: fadems, loop: loop, autoplay: autoplay },
    });

    this.#analyser = this.audioContext.createAnalyser();
    this.#analyser.fftSize = 32;

    const bufferLength = this.#analyser.frequencyBinCount;
    this.#dataArray = new Float32Array(bufferLength);
    this.#analyser.getFloatTimeDomainData(this.#dataArray);

    this.node.connect(this.#analyser, 1, 0);
  }

  loadBuffer(buffer) {
    if (!buffer) return;
    this.node.port.postMessage({
      buffers: [buffer.getChannelData(0), buffer.getChannelData(1)],
    });
    this.#bufferLength = buffer.getChannelData(0).length;
  }

  async load(source) {
    const buffer = await this.loadSource(source);
    this.loadBuffer(buffer);
  }

  start() {
    this.node.port.postMessage({ play: 1 });
  }
  pause() {
    this.node.port.postMessage({ play: 0 });
  }
  stop() {
    this.node.port.postMessage({ play: -1 });
  }
  restart() {
    this.node.port.postMessage({ restart: true });
  }
  reset() {
    this.node.port.postMessage({ reset: true });
  }
  loop(bool) {
    this.node.port.postMessage({ loop: bool });
  }
  getPosition() {
    this.#analyser.getFloatTimeDomainData(this.#dataArray);
    const v = this.#dataArray[0];
    return v;
  }
  getDuration() {
    return this.#bufferLength;
  }
}
