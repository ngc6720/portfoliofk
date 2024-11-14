import { AudioLoader } from "./audioLoader.js";
import ParamAttachment from "/core/au/param-attachment.js";
import { scale, triangle, clip, hann, scaleToExp } from "/core/utils/math.js";

/**
 * playbackOptions :
 * min: playback start (top)
 * max: playback start (bottom)
 * vertical offset starting from top of the element
 * offset 1 = full element height -> bottom, 0 = no offset -> top
 * threshPosition of whole window : 'CENTER' -> sound bounds triggers when crossing the center of the clientheight, else when crossing top
 */

class Source {
  #playbackOptions = null; // { min: {el, offset}, max: {el, offset} }
  #window = [-1, -1]; // norm scroll 0 - 1
  #attachment = null;
  #audioContext = null;
  #node = null;

  constructor(audioCtx, buffer, defaultPlaybackOptions) {
    this.#audioContext = audioCtx;
    this.#playbackOptions = defaultPlaybackOptions;

    this.#node = new AudioWorkletNode(audioCtx, "player", {
      numberOfInputs: 0,
      numberOfOutputs: 2, // temp -> 1
      outputChannelCount: [2, 1],
      // channelInterpretation: 'discrete',
      parameterData: { gain: 1 },
      processorOptions: { fadems: 10, loop: true, autoplay: true },
    });

    if (buffer)
      this.#node.port.postMessage({
        buffers: [buffer.getChannelData(0), buffer.getChannelData(1)],
      });

    this.#attachment = new ParamAttachment({
      ctx: this.#audioContext,
      param: this.#node.parameters.get("gain"),
      range: [0, 1],
      initialValue: 0,
      speedlimms: this.#playbackOptions.speedlimms,
      slidems: this.#playbackOptions.slidems,
    });
  }

  static #getNormalisedWindow(playbackOptions) {
    const bodyRect = document.body.getBoundingClientRect();
    const minRect = playbackOptions.min.element.getBoundingClientRect();
    const maxRect = playbackOptions.max.element.getBoundingClientRect();
    const thresholdOffset =
      playbackOptions.threshPosition === Atmos.threshPosition.center
        ? window.innerHeight * 0.5
        : 0;
    return [
      (minRect.top +
        minRect.height * playbackOptions.min.offset -
        bodyRect.top -
        thresholdOffset) /
        (bodyRect.height - document.documentElement.clientHeight),
      (maxRect.top +
        maxRect.height * playbackOptions.max.offset -
        bodyRect.top -
        thresholdOffset) /
        (bodyRect.height - document.documentElement.clientHeight),
    ];
  }

  #calcVolume(position) {
    return hann(
      clip(
        triangle(scale(position, this.#window[0], this.#window[1], 0, 1), 0.5) *
          (scaleToExp(clip(1 - this.#playbackOptions.windowFade, 0, 1)) + 1),
        0,
        1
      )
    );
  }

  connect(mainNode) {
    this.#node.connect(mainNode, 0, 0);
  }

  setWindow(newWindow) {
    this.#window = newWindow;
  }

  setPlaybackOptions(newPlaybackOptions) {
    Object.assign(this.#playbackOptions, newPlaybackOptions);
  }

  updateWindow() {
    this.#window = Source.#getNormalisedWindow(this.#playbackOptions);
  }

  update(position) {
    this.#attachment && this.#attachment.update(this.#calcVolume(position));
  }
}

export default class Atmos extends AudioLoader {
  #defaultSourceOptions;

  constructor(audioCtx, options) {
    super();
    this.audioContext = audioCtx;
    this.#defaultSourceOptions = options?.defaultSourceOptions;
    this.sources = [];
    this.node = new AudioWorkletNode(audioCtx, "gain01", {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2],
    });
    this.currentPosition = 0;
  }

  static threshPosition = { center: 0, top: 1 };

  #updateGains() {
    for (let source of this.sources) {
      source.update(this.currentPosition);
    }
  }

  async load(sources, cbProgress = () => {}) {
    const buffers = await this.loadSources(sources, cbProgress);
    for (const buffer of buffers) {
      const source = new Source(this.audioContext, buffer, {
        ...this.#defaultSourceOptions,
      });

      source.connect(this.node, 0, 0);
      source.update(this.currentPosition);

      this.sources.push(source);
    }
  }

  connect(...args) {
    return this.node.connect(args);
  }

  updateWindows() {
    for (let source of this.sources) {
      source.updateWindow();
    }
  }

  updatePosition(newPosition) {
    this.currentPosition = clip(newPosition, 0, 1);
    this.#updateGains();
  }

  setWindow(sourceId, newWindow) {
    this.sources[sourceId]?.setWindow(newWindow);
    this.#updateGains();
  }

  setPlaybackOptions(sourceId, newPlaybackOptions) {
    this.sources[sourceId]?.setPlaybackOptions(newPlaybackOptions);
    this.sources[sourceId]?.updateWindow();
    this.#updateGains();
  }

  log() {
    for (let source of this.sources) {
      console.log(source);
    }
  }
}
