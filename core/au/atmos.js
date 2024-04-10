import ParamAttachment from '/core/au/param-attachment.js'

import {
    scale,
    triangle,
    clip,
    hann,
    scaleToExp
} from "/core/utils/utils.js";

class Source {

    #playbackOptions = null;
    #window = [-1, -1];
    #attachment = null;
    #audioContext = null;
    #node = null;

    constructor(audioCtx, defaultPlaybackOptions) {
        this.#audioContext = audioCtx;
        this.#playbackOptions = defaultPlaybackOptions;
    }

    static getNormalisedWindow(playbackOptions) {
        const bodyRect = document.body.getBoundingClientRect();
        const minRect = playbackOptions.min.element.getBoundingClientRect();
        const maxRect = playbackOptions.max.element.getBoundingClientRect();
        const thresholdOffset = playbackOptions.threshPosition === Atmos.threshPosition.center ? window.innerHeight * 0.5 : 0;
        return [
          (minRect.top + (minRect.height * playbackOptions.min.offset) - bodyRect.top - thresholdOffset) / (bodyRect.height - document.documentElement.clientHeight),
          (maxRect.top + (maxRect.height * playbackOptions.max.offset) - bodyRect.top - thresholdOffset) / (bodyRect.height - document.documentElement.clientHeight),
        ];
    }

    // #calcVolume(position) {
    //     return this.#window[0] <= position && position <= this.#window[1] ? 1 : 0;
    // }

    #calcVolume(position) {
        return hann(clip(triangle(
            scale(position, this.#window[0], this.#window[1], 0, 1),
            0.5
        ) * (scaleToExp(clip(1 - this.#playbackOptions.windowFade, 0, 1)) +1)
        , 0, 1))
    }

    setNode(node) {
        this.#node = node;
        this.#attachment = new ParamAttachment({
            ctx: this.#audioContext,
            param: this.#node.parameters.get('gain'),
            range: [0, 1],
            initialValue: 0,
            speedlimms: this.#playbackOptions.speedlimms,
            slidems: this.#playbackOptions.slidems
        })
    }
    setWindow(newWindow) {
        this.#window = newWindow;
    }
    setPlaybackOptions(newPlaybackOptions) {
        Object.assign(this.#playbackOptions, newPlaybackOptions);
    }
    updateWindow() {
        this.#window = Source.getNormalisedWindow(this.#playbackOptions)
    }
    update(position) {
        this.#attachment && this.#attachment.update(this.#calcVolume(position));
    }

}

export default class Atmos {

    #defaultSourceOptions;

    constructor(audioCtx, options) {
        this.audioContext = audioCtx;
        this.#defaultSourceOptions = options?.defaultSourceOptions;
        this.sources = [];
        this.node = new AudioWorkletNode(audioCtx, "gain01", {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [2],
        })
        this.currentPosition = 0;
    }

    static threshPosition = { center: 0, top: 1 };

    #updateGains() {
        for (let source of this.sources) {
            source.update(this.currentPosition);
        }
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
    
    #createNodeAndLoadBufferAndConnectNode(buffer) {

        const node = new AudioWorkletNode(this.audioContext, "player", {
            numberOfInputs: 0,
            numberOfOutputs: 2, // temp -> 1
            outputChannelCount: [2, 1],
            // channelInterpretation: 'discrete',
            parameterData: { gain: 1 },
            processorOptions: { fadems: 10, loop: true, autoplay: true }
        })

        if (buffer)
            node.port.postMessage({
                buffers: [buffer.getChannelData(0), buffer.getChannelData(1)],
            })
        
        node.connect(this.node, 0, 0)
        return node;
    }

    async loadAudioSource(src) {
        if (typeof(src) === 'string') 
        src = [src];
    
        this.sources.push(new Source(this.audioContext, {...this.#defaultSourceOptions}));
        const id = this.sources.length - 1;

        let buffer;
        
        try {

            for (let i = 0; i < src.length; i++) {
                try {
                    buffer = await Atmos.decodeAudioFile(src[i], this.audioContext)
                    break;
                } catch(e) {
                    if (src[i+1]) {
                        console.warn(`cannot decode source ${src[i]}`)
                        console.warn(`trying again with ${src[i+1]}`)
                    }
                    else console.error(`cannot decode ${src[i]}`)
                }

            }

            const node = this.#createNodeAndLoadBufferAndConnectNode( buffer );
            this.sources[id].setNode(node);
            this.sources[id].update(this.currentPosition);

        } catch (err) {
            console.error(`Unable to load audio source. Error: ${err.message}`);
        }             
        
    }

    async loadAudioSources(sources, cbProgress = () => {}) {
        const proms = sources.map(source => this.loadAudioSource(source))

        let loaded = 0;

        cbProgress(loaded / sources.length)
        
        for (let prom of proms) {
            prom.then(()  => {
                loaded++
                cbProgress(loaded / sources.length)
            })
        }            
        return Promise.all(proms);
    }

    connect(...args) {
        return this.node.connect(args)
    }

    updateWindows() {
        for (let source of this.sources) {
            source.updateWindow()
        }
    }

    updatePosition(newPosition) {
        this.currentPosition = clip(newPosition, 0, 1);
        this.#updateGains()
    }

    setWindow(sourceId, newWindow) {
        this.sources[sourceId]?.setWindow(newWindow)
        this.#updateGains()
    }

    setPlaybackOptions(sourceId, newPlaybackOptions) {
        this.sources[sourceId]?.setPlaybackOptions(newPlaybackOptions)
        this.sources[sourceId]?.updateWindow()
        this.#updateGains()
    }

    log() {
        for (let source of this.sources) {
            console.log(source)
        }
    }
}