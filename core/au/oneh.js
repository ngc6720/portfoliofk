export default class OneHead {

    constructor(audioContext, { gain = 1 } = {}) {

        this.audioContext = audioContext;
        this.node = new AudioWorkletNode(this.audioContext, "oneh", {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
            parameterData: { gain: gain },
        });
        
    }
    
    static async decodeAudioFile(src, ctx) {
        let arraybuffer;
        try {
            const response = await fetch(src);
          arraybuffer = await response.arrayBuffer();
        } catch (err) {
          console.error(`Unable to fetch the audio file. Error: ${err.message}`);
        }
        return await ctx.decodeAudioData(arraybuffer);
    }

    #loadBuffers(buffers) {
        this.node.port.postMessage({
            buffers: buffers.map(buffer => buffer ? [buffer.getChannelData(0), buffer.getChannelData(1)] : [new Float32Array([0]), new Float32Array([0])]),
        })
    }
    
    async #decodeSource(src) {
        if (typeof(src) === 'string') 
            src = [src];

        let buffer;

        try {

            for (let i = 0; i < src.length; i++) {

                try {
                    buffer = await OneHead.decodeAudioFile(src[i], this.audioContext)
                    break;
                } catch(e) {
                    if (src[i+1]) {
                        console.warn(`cannot decode source ${src[i]}`)
                        console.warn(`trying again with ${src[i+1]}`)
                    }
                    else console.error(`cannot load ${src[i]}`)
                }

            }

        } catch (err) {
            console.error(`Unable to load audio source. Error: ${err.message}`);
            buffer = null;
        }

        return buffer;
    }

    async loadSources(sources, cbProgress = () => {}) {
        const proms = sources.map(source => this.#decodeSource(source));

        let loaded = 0;

        cbProgress(loaded / sources.length)
        
        for (let prom of proms) {
            prom.then(()  => {
                loaded++
                cbProgress(loaded / sources.length)
            })
        }            
        return Promise.all(proms).then(buffers => this.#loadBuffers(buffers))
    }

    play(i) {
        if (this.audioContext.state === 'running')
            this.node.port.postMessage({ play: i })
    }
}