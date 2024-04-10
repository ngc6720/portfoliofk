class Gain01 extends AudioWorkletProcessor {


    constructor(options) {
        super();
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

        for (let out = 0; out < Math.min(inputList.length, outputList.length); out++)
        {
            for (let chan = 0; chan <  Math.min(inputList[out].length, outputList[out].length); chan++)
            {
                for (let smp = 0; smp < outputList[out][chan].length; smp++)
                {
                    outputList[out][chan][smp] = inputList[out][chan][smp] * parameters.gain[0];
                }
            }
        }

        return true;
    }
}

registerProcessor("gain01", Gain01);