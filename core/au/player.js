

export default class Player {

    #bufferLength
    #analyser
    #dataArray

    constructor(audioContext, { fadems = 10, autoplay = true, loop = false, gain = 1 } = {}) {

        this.audioContext = audioContext;

        this.node = new AudioWorkletNode(this.audioContext, "player", {
            numberOfInputs: 0,
            numberOfOutputs: 2,
            outputChannelCount: [2, 1],
            parameterData: { gain: gain },
            processorOptions: { fadems: fadems, loop: loop, autoplay: autoplay }
        });

        this.#analyser = this.audioContext.createAnalyser();
        this.#analyser.fftSize = 32;
        
        const bufferLength = this.#analyser.frequencyBinCount;
        this.#dataArray = new Float32Array(bufferLength);
        this.#analyser.getFloatTimeDomainData(this.#dataArray);

        this.node.connect(this.#analyser, 1, 0);
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

    #loadBuffer(buffer) {
        if (!buffer)
            return;
        this.node.port.postMessage({
            buffers: [buffer.getChannelData(0), buffer.getChannelData(1)],
        })
        this.#bufferLength = buffer.getChannelData(0).length;
    }
    
    #decodeSource(src) {
        return Player.decodeAudioFile(src, this.audioContext);
    }
    async loadAudioSource(src) {
        if (typeof(src) === 'string') 
            src = [src];

        let buffer;

        try {

            for (let i = 0; i < src.length; i++) {

                try {
                    buffer = await Player.decodeAudioFile(src[i], this.audioContext)
                    break;
                } catch(e) {
                    if (src[i+1]) {
                        console.warn(`cannot decode source ${src[i]}`)
                        console.warn(`trying again with ${src[i+1]}`)
                    }
                    else console.error(`cannot decode ${src[i]}`)
                }

            }

            this.#loadBuffer( buffer );
        
        } catch (err) {
            console.error(`Unable to load audio source. Error: ${err.message}`);
        }
        
    }

    start() {
        this.node.port.postMessage({ play: 1 })
    }
    pause() {
        this.node.port.postMessage({ play: 0 })
    }
    stop() {
        this.node.port.postMessage({ play: -1 })
    }
    restart() {
        this.node.port.postMessage({ restart: true })
    }
    reset() {
        this.node.port.postMessage({ reset: true })
    }
    loop(bool) {
        this.node.port.postMessage({ loop: bool })
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