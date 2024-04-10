import Player from '/core/au/player.js'

export default class Multiplayer {

    #players = [];
    #state = -1;
    #lastPlayingState = null;
    #playerOptions = {};

    constructor(audioContext, { playerOptions = {} } = {} ) {

        this.audioContext = audioContext;
        this.node = new AudioWorkletNode(this.audioContext, "gain01", {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [2],
        })

        this.#playerOptions = Object.freeze(Object.assign({
            fadems: 20, autoplay: false, loop: false
        }, playerOptions));

    }

    async loadSource(source) {
        const player = new Player(this.audioContext, {...this.#playerOptions})
        this.#players.push(player)
        await this.#players[this.#players.length - 1].loadAudioSource(source)
        player.node.connect(this.node)
    }

    async loadSources(sources, cbProgress = () => {}) {
        const proms = sources.map(source => this.loadSource(source));

        let loaded = 0;

        cbProgress(loaded / sources.length)
        
        for (let prom of proms) {
            prom.then(()  => {
                loaded++
                cbProgress(loaded / sources.length)
            })
        }            
        return Promise.all(proms)
    }

    play(id) {
        id = +id;
        if (isNaN(id)) return;
        if (id === -1) {
            this.getCurrentPlayer()?.pause()
            this.#state = id;
        } else {
            this.getCurrentPlayer()?.pause()
            this.#players[id].start()
            this.#state = id;
            this.#lastPlayingState = id;
        }
    }

    getState() {
        return this.#state;
    }

    getCurrentPlayer() {
        return this.#players[this.#state] ?? null;
    }

    getLastPlayingId() {
        return this.#lastPlayingState;
    }

    getPosition() {
        return this.getCurrentPlayer()?.getPosition() ?? null;
    }

    getDuration() {
        return this.getCurrentPlayer()?.getDuration() ?? null;
    }
    getFormatedDuration() {
        if (!this.getCurrentPlayer())
            return null;

        const duration = Math.round(this.getCurrentPlayer()?.getDuration() / this.audioContext.sampleRate);
        const hrs = ~~(duration / 3600);
        const mins = ~~((duration % 3600) / 60);
        const secs = ~~duration % 60;

        return {
            values: [hrs, mins, secs],
            string: [`${hrs}`.padStart(2, 0), `${mins}`.padStart(2, 0), `${secs}`.padStart(2, 0)].join(':')
        };
    }

    pause() {
        if (this.#state !== -1)
            this.play(-1)
    }

    resume() {
        if (this.#state === -1)
            this.play(this.#lastPlayingState)
    }
}