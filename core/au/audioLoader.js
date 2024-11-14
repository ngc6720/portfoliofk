const cbs = [];
const proms = [];

let resolveLoaded;

const prom = new Promise(function (resolve, reject) {
  resolveLoaded = resolve;
});

const pProgress = new Proxy(
  { progress: 0, sourcesCount: 0 },
  {
    set(target, prop, value) {
      target[prop] = value;

      const normalized = target.progress / target.sourcesCount;
      for (let cb of cbs) cb(normalized);

      if (
        pProgress.sourcesCount > 0 &&
        pProgress.progress === pProgress.sourcesCount
      )
        resolveLoaded();

      return true;
    },
  }
);

export class AudioLoader {
  constructor(ctx) {
    if (ctx) this.audioContext = ctx;
  }

  static async #decodeAudioFile(src, ctx) {
    let arraybuffer;
    try {
      const response = await fetch(src);
      arraybuffer = await response.arrayBuffer();
    } catch (err) {
      console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
    return await ctx.decodeAudioData(arraybuffer);
  }

  async #decodeSource(src) {
    if (typeof src === "string") src = [src];
    let buffer;

    try {
      for (let i = 0; i < src.length; i++) {
        try {
          buffer = await AudioLoader.#decodeAudioFile(
            src[i],
            this.audioContext
          );
          break;
        } catch (e) {
          if (src[i + 1]) {
            console.warn(
              `cannot decode source ${src[i]}
trying with ${src[i + 1]}`
            );
          } else console.error(`cannot load ${src[i]}`);
        }
      }
    } catch (err) {
      console.error(`Unable to load audio source. Error: ${err.message}`);
      buffer = null;
    }

    pProgress.progress++;

    return buffer;
  }

  async loadSource(source) {
    pProgress.sourcesCount++;
    const prom = this.#decodeSource(source);
    proms.push(prom);
    return prom;
  }

  async loadSources(sources, cbProgress = () => {}) {
    const proms = sources.map((source) => this.loadSource(source));

    let loaded = 0;

    cbProgress(loaded / sources.length);

    for (let prom of proms) {
      prom.then(() => {
        cbProgress(loaded / sources.length);
      });
    }
    return Promise.all(proms);
  }

  onProgress(cb) {
    cbs.push(cb);
  }
  loaded() {
    return prom;
  }
}
