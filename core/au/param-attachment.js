function scale(v, oMin, oMax, tMin, tMax) {
    v = (v - oMin) * (tMax - tMin) / (oMax - oMin) + tMin;
    return v < tMin ? tMin : v > tMax ? tMax : v;
}

function clip(v, min = 0, max = 1) { 
    return v <  min ? min : max < v ? max : v;
}

export default class ParamAttachment {

    static audioCtx;

    static transferFunction = {
        linear: x => x,
        exp: x => x < 0.0001 ? 0 : Math.pow(2, 10 * x - 10)
    }
    
    #ctx
    #range = [0, 1]
    #param
    #transfer
    #slide
    #shouldSlide = true;
    #speedlimms;
    #stopstopstop = false;
    #nextValue = null;

    constructor({
        ctx,
        param,
        el,
        range = [0, 1],
        initialValue = 0,
        transfer = x => x,
        shouldSlide = true,
        slidems = 100,
        speedlimms = 0
      }) {

        [ this.#ctx, this.#param, this.#transfer, this.#slide, this.#shouldSlide, this.#speedlimms ] = [ ctx, param, transfer, slidems * 0.001, shouldSlide, speedlimms]
        if (!this.#ctx) this.#ctx = ParamAttachment.audioCtx;
        
        if (el) {
            this.#range = [+el.min, +el.max];
            this.#setParamValue(+el.value)
            el.addEventListener('input', e => this.update(e.target.value))
        } else {
            this.#range = range;
            this.#setParamValue(clip(initialValue, ...range))
        }
    }

    static setContext(ctx) {
        ParamAttachment.audioCtx = ctx;
    }

    #getScaledValueToParam(v) {
        const [ min, max ] = this.#range;
        return scale(this.#transfer(scale(+v, min, max, 0, 1)), 0, 1, min, max);
    }

    #setParamValue(v) {
        const value = this.#getScaledValueToParam(v);
        if(typeof(value) !== 'number') return;

        if (Array.isArray(this.#param))
            this.#param.forEach(param => param.value = clip(value, param.minValue, param.maxValue));
        else
            this.#param.value = clip(value, this.#param.minValue, this.#param.maxValue);
    }

    #slideNextParamValue() {
        const value = this.#getScaledValueToParam(this.#getNextValue());
    
        if(typeof(value) !== 'number') return;

        if (Array.isArray(this.#param)) {

            this.#param.forEach( param => {
                this.#updateParam(param, value)
            })
        } else {
            this.#updateParam(this.#param, value)
        }
    }
    #getNextValue() {
        return this.#nextValue;
    }

    #slideParamValueLimited(v) {
        this.#nextValue = v;
        
        if (this.#speedlimms > 0) {
            if (this.#stopstopstop) {
                return;
            }
            
            setTimeout(() => {
                this.#stopstopstop = false
                    this.#slideNextParamValue()    
                }, this.#speedlimms)

            this.#stopstopstop = true;
        }
        this.#slideNextParamValue()
    }

    #updateParam(param, value) {
        // console.log(this.#nextValue)
        // console.log(" update " + value)
        const val = param.value;
        param.cancelScheduledValues(this.#ctx.currentTime);
        param.setValueAtTime(val, this.#ctx.currentTime);
        param.linearRampToValueAtTime(clip(value, param.minValue, param.maxValue), this.#ctx.currentTime + this.#slide)
    }

    update(value) {
       this.#shouldSlide === true ? this.#slideParamValueLimited(value) : this.#setParamValue(value)
    }
}
