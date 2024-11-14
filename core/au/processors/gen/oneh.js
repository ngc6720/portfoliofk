import { clip } from "/core/utils/math.js";

class Oneh extends AudioWorkletProcessor {
  #buffers = null;
  #current = 0;
  #next = 0;

  #head = 0;

  #fadeRamp = 0;
  #slope = 0;

  #reset = 0;

  constructor(options) {
    super();

    const fadeRampsize = (30 * sampleRate) / 1000;
    this.#slope = 1 / fadeRampsize;

    this.port.onmessage = ({ data }) => {
      //load
      if (data.buffers) {
        this.#buffers = data.buffers;
      }
      //play
      if (typeof data.play === "number") {
        if (!this.#buffers[data.play]) return;
        this.#next = data.play;
        this.#reset = 1;
      }
    };
  }

  static get parameterDescriptors() {
    return [
      {
        name: "gain",
        defaultValue: 1,
        minValue: 0,
        maxValue: 1,
      },
    ];
  }

  process(inputList, outputList, parameters) {
    for (let smp = 0; smp < outputList[0][0].length; smp++) {
      outputList[0][0][smp] =
        (this.#buffers[this.#current][0][this.#head] || 0) *
        parameters.gain[0] *
        this.#fadeRamp;
      outputList[0][1][smp] =
        (this.#buffers[this.#current][1][this.#head] || 0) *
        parameters.gain[0] *
        this.#fadeRamp;

      if (this.#reset === 1) {
        this.#fadeRamp -= this.#slope;
        if (this.#fadeRamp < 0) this.#fadeRamp = 0;
      }

      if (this.#fadeRamp !== 0) {
        this.#head += 1;
        this.#head = clip(
          this.#head,
          0,
          this.#buffers[this.#current][0].length
        );
      }

      if (this.#reset === 1 && this.#fadeRamp === 0) {
        this.#fadeRamp = 1;
        this.#current = this.#next;
        this.#head = 0;
        this.#reset = 0;
      }
    }

    return true;
  }
}

registerProcessor("oneh", Oneh);
