import { pipe, div, htriangle, sin, hclip, htanh, scale, uni2bipo, bipo2uni } from '/core/utils/utils.js'


const waveformTypes = (() => {
    // per smp alg
    const waveformTypes = [
        (phz, param) => pipe(
            div(Math.floor(param.rand1 * 6)),
            uni2bipo,
            htriangle(),
            bipo2uni,
            div(sin({phase: 0 , period: 2})(phz.phz)),
            x => div(x * (param.rand1 + 0.4))(x),
            sin({phase: 0, period: scale(param.index, 0, param.qt, 0.2, 4)}),
            sin({phase: scale(param.index, 0, param.qt, 0, 0.5), period: param.rand2 * 4}),
            htanh(0.6),
            x => x * 1 / param.qt * 0.8,
            x => x + scale(param.index, 0, param.qt, -0.8, 0.8),
            x => x * -1
        )(phz.phz),
        (phz, param) => pipe(
            div(Math.floor(param.rand1 * 6)),
            uni2bipo,
            htriangle(),
            bipo2uni,
            div(sin({phase: 0 , period: 2})(phz.phz)),
            x => div(x * (param.rand1 + 0.4))(x),
            sin({phase: 0, period: scale(param.index, 0, param.qt, 0.2, 4)}),
            sin({phase: scale(param.index, 0, param.qt, 0, 0.5), period: param.rand2 * 4}),
            htanh(0.6),
            x => x + hclip(-2, 2)( sin({phase: param.rand1 * 9, period: 2})(phz.mod1 * 0.2) * 8),
            x => x + hclip(-4, 4)( sin({phase: param.rand1 * 9, period: 3})(phz.mod1 * 0.5) * 2),
            x => x * 1 / param.qt * 0.8,
            x => x + scale(param.index, 0, param.qt, -0.8, 0.8),
            x => x * -1,
            htanh(0.4),

        )(phz.phz),
    ];

    return waveformTypes;
})();

// Ramp over multiple values with looping function taking ramping values as argument
// 1st arg = drawing slope (0-1)
// 2nd arg object for which each value is an phasor array : v[0] = initial value, v[1] = slope mult factor, (v[2] = ramp value)
const makeWaveform = (slope, phasors) => f => {
    Object.values(phasors).forEach(v => v[2] = v[0]); // phase offset
    for (
        let pen = 0, ramps = Object.entries(phasors);
        pen < 1.0001;
        pen += slope, ramps.map(([_, v]) => v[2] += v[1] * slope)
        ) f(pen, Object.assign( {}, // only ramp values as output
            ...ramps.map(([k, v]) => ({[k]: v[2]})) // object output: o['<phasorname>'] = ramp value
    ))
}

function makePathes({ width = 512, height = 200, vMargin = 1, qt = 8 } = {}) {
    let pathes = Array(qt);
    pathes.fill("");
    
    // per smp processes
    const cb = pathIndex => (pen, ramps) => {
        const y = waveformTypes[1](ramps, Object.assign(params, { index: pathIndex, qt: qt }));
        const strMoveLine =  ` ${pen === 0 ? "M" : "L"}`;
        const strW = ` ${pen * width}`.slice(0, 6)
        const strH = ` ${((1 - y) * (height/2 - vMargin)) + vMargin}`.slice(0, 6);
        pathes[pathIndex] += strMoveLine + strW + strH;
        // pathes[pathIndex] += ` ${pen === 0 ? "M" : "L"} ${pen * width} ${((1 - y) * (height/2 - vMargin)) + vMargin}`;
    }
    // persistant parameters for the whole wave
    const params = {
        rand1: Math.random(),
        rand2: Math.random(),
    }
    // drawing slope and phasors | [0] = phase offset, [1] = slope mult factor
    for (let pathIndex = pathes.length; pathIndex--;) {
        makeWaveform( 0.005, {
            phz: [0 + pathIndex * 0.2, 1],
            mod1: [0, 8],
            mod2: [0, 0.7],
        })(cb(pathIndex))
    }
    return pathes;
}

export default makePathes;