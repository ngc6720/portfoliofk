import {
    wrap,
    clip
} from "/core/utils/utils.js";

class Player extends AudioWorkletProcessor {

    #bufferL = new Float32Array([0])
    #bufferR = new Float32Array([0])
    #head = 0;

    #fadeRamp = 0;
    #slope = 0;

    #loop = false;
    #play = 0;
    #reset = 0;

    constructor(options) {
        super();

        const fadeRampms = options?.processorOptions?.fadems ? options?.processorOptions?.fadems : 10;
        this.#play = options?.processorOptions?.autoplay ? 1 : 0;
        this.#loop = options?.processorOptions?.loop;

        const fadeRampsize  = fadeRampms * sampleRate / 1000;
        this.#slope = 1 / fadeRampsize;

        this.port.onmessage = ({ data }) => {
            if (data.buffers) {
                this.#bufferL = data.buffers[0];
                this.#bufferR = data.buffers[1];
            }
            //start
            if (data.play === 1) {
                if (this.#head >= this.#bufferL.length)
                    this.#reset = 1;
                this.#play = 1;
            }
            //pause
            if (data.play === 0) this.#play = 0;
            //stop
            if (data.play === -1) this.#play = -1;
            if (data.restart) {
                this.#reset = 1;
                this.#play = 1;
            }
            if (data.loop) this.#loop = data.loop;
            if (data.reset) this.#reset = 1;
        };
    }

    static get parameterDescriptors() {
        return [
          {
            name: "gain",
            defaultValue: 1,
            minValue: 0,
            maxValue: 1,
          }
        ];
    }
    
    process(inputList, outputList, parameters) {   

        for (let smp = 0; smp < outputList[0][0].length; smp++)
        {
            
            outputList[0][0][smp] = (this.#bufferL[this.#head] || 0) * parameters.gain[0] * this.#fadeRamp;
            outputList[0][1][smp] = (this.#bufferR[this.#head] || 0) * parameters.gain[0] * this.#fadeRamp;
            
            if (outputList[1].length > 0) outputList[1][0][smp] = this.#head / this.#bufferL.length; // norm pos in buffer for vis

            if (this.#play === 1) {

                this.#fadeRamp += this.#slope;
                if (this.#fadeRamp > 1) this.#fadeRamp = 1;

            } else {
                
                this.#fadeRamp -= this.#slope;
                if (this.#fadeRamp < 0) this.#fadeRamp = 0;
            }

            if (this.#fadeRamp !== 0) {

                this.#head += 1;

                this.#head = this.#loop === true ?
                    wrap(this.#head, 0, this.#bufferL.length) :
                    clip(this.#head, 0, this.#bufferL.length);

            }

            if (this.#play === -1 && this.#fadeRamp === 0) {
                this.#head = 0;
            }

            if (this.#reset === 1) {
                this.#reset = 0;
                this.#head = 0;
            }
        }

        return true;
    }
}


registerProcessor("player", Player);