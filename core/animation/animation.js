function easingDefault(x) {
    return Math.min(1, 1.001 - Math.pow(2, -10 * x))
}

const lerp = (start, end, amt) => (1-amt) * start + amt * end;

const lerp2 = (start, end, amt) => {
    if (typeof(start) === 'number') {
       return  (1-amt) * start + amt * end;
    } else if (Array.isArray(end)) {
        const result = [];
        for (let i = 0; i < end.length; i++) {
            result.push((1-amt) * start[i] + amt * end[i]);
        }
        return result;
    }
}

class Animation {

    #requestId = null;
    #start = null;
    #previousTimeStamp = null;
    #cb = null;
    #from = null;
    #dest = null;
    #currentTime = null;
    
    #durationms = null;
    #easing = null;

    constructor({
        durationms = 2000,
        cb = () => {},
        easing = easingDefault
    } = {}) {
        this.#durationms = durationms;
        this.#cb = cb;
        this.#easing = easing;
    }

    #step(timeStamp) {
        this.#start = this.#start ?? timeStamp;
        const elapsed = timeStamp - this.#start;

        const t = Math.min(elapsed / this.#durationms, 1);
        
        if (this.#previousTimeStamp !== timeStamp) {
            this.#cb(
                lerp2( this.#from, this.#dest, this.#easing(t) )
            )
            this.#previousTimeStamp = timeStamp;
        }
        if (t >= 1) {
            this.#start = null;
            this.#previousTimeStamp = null;
            this.#start = timeStamp;
            this.#from = this.#dest;
            return;
        }
        this.#requestId = window.requestAnimationFrame(this.#step.bind(this));
    }

    from(v) {
        this.#from = v;
    }

    to(v) {
        this.#dest = v;
        window.cancelAnimationFrame(this.#requestId);
        this.#requestId = null
        this.#start = null;
        this.#previousTimeStamp = null;
        this.#requestId = window.requestAnimationFrame(this.#step.bind(this));
    }
}



export default Animation;
