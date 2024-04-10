const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const makeElement = (type, attributesOrContent = {}, content) => {
    const el = document.createElement(type);
    if (typeof(attributesOrContent) === 'string') {
        el.textContent = attributesOrContent;
    } else {
        Object.entries(attributesOrContent).map(([k, v]) => el[k] = v);
        content && (el.textContent = content);
    }
    return el;
}
const makeIcon = (el, paths, attr) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (!Array.isArray(paths)) paths = [ paths ];
    paths.forEach(p => {
        if (typeof p === 'string') {
            const path =  document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", p);
            svg.appendChild(path);
        }
    });
    Object.entries(attr).forEach(([k, v]) => svg.setAttribute(k, v));
    el.appendChild(svg);
    return el;
}

const isScrollAtBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

function setScrollbarW() {
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    setRootVariable('--scrollBarW', scrollbarW+'px');
}
function disableElement(el, bool) {
    if (bool) {
        setRootVariable('--scrollY', window.scrollY+'px');
        el.classList.add('disabled');
    } else {
        el.classList.remove('disabled')
    }
}

function disableElement2(el, bool) {
    if (bool) {
        el.style.top = el.getBoundingClientRect().top + 'px';
        el.classList.add('disabled');
    } else {
        el.classList.remove('disabled')
        el.style.top = '0px';
    }
}
function prepareDisableElements(elOrels) {
    const els = Array.isArray(elOrels) ? elOrels : [elOrels];
    els.forEach(el => el.style.top = el.getBoundingClientRect().top + 'px')

}
function disableElements(elOrels, bool) {
    const els = Array.isArray(elOrels) ? elOrels : [elOrels];
    if (bool) {
        els.forEach(el => el.classList.add('disabled'))
    } else {
        els.forEach(el => el.classList.remove('disabled'))
    }
}
// canvas

const lerp = (start, end, amt) => (1-amt) * start + amt * end;

const makePen = _cnv => {
    const cnv = _cnv;
    const ctx = cnv.getContext("2d");
    const fill = (str) => {
        ctx.fillStyle = str;
    }
    
    const stroke = (str) => {
        ctx.strokeStyle = str;
    }
    const rgbStr = function(r,g,b,a) {
        let alpha = a || 1;
        return `rgba(${r},${g},${b},${alpha})`;
    }
    
    const strokeWidth = (width) => {
        width === 0 && (width = 0.0001);
        ctx.lineWidth = width;
    }

    const rectangle = (x, y, w, h) => {
        ctx.fillRect(x, y, w, h);
    }

    const fix_size = () => {
        const {width, height} = cnv.getBoundingClientRect();
        cnv.width = width;
        cnv.height = height;
    };

    const getCtx = () => ctx;

    return { fill, stroke, rgbStr, strokeWidth, rectangle, fix_size, getCtx };
}

function getRootVariable(variable) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
};
function setRootVariable(k, v) {
    document.documentElement.style.setProperty(k, v);
}

/* MISC */


async function fakePromise(durationms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, durationms)
    }
)}


/* MATH */

// in::uni out::bi
function uni2bipo(ramp) { 
    return ramp * 2 - 1;    
}

// in::bi out::uni
function bipo2uni(ramp) { 
    return (ramp + 1) * 0.5 ;   
}

function invert(ramp) {
    return 1 - ramp;    
}

function poltocar(r, theta)
{
    return [ r * Math.cos(theta), r * Math.sin(theta) ];
}

function mix(in1, in2, mix)
{ 
    return in1 * mix + in2 * (1 - mix)
}

function mixHermite(in0, in1, in2, in3, mix)
{
    let slope0 = (in2 - in0) * 0.5;
    let slope1 = (in3 - in1) * 0.5;
    let v = in1 - in2;
    let w = slope0 + v;
    let a = w + v + slope1;
    let b_neg = w + a;
    let stage1 = a * mix - b_neg;
    let stage2 = stage1 * mix + slope0;
    return stage2 * mix + in1;
}

function scale(v, oMin, oMax, tMin, tMax) {
    v = (v - oMin) * (tMax - tMin) / (oMax - oMin) + tMin;
    return v < tMin ? tMin : v > tMax ? tMax : v;
}

function clip(v, min = -1, max = 1) { 
    return v <  min ? min : max < v ? max : v;
}

function hclip(min = -1, max = 1) {
    return x => clip(x, min, max)
}

// min::0 max::1
// function scaleToExp(qt = 0.5) {
//     return pipe(
//         pclip(0, 1),
//         (x) => Math.tan(x * Math.PI/2) ,
//         pclip(0.00001, Infinity)
//     )(qt)
// }
function scaleToExp(qt = 0.5) {
    return clip(Math.tan(clip(qt, 0, 1) * Math.PI/2), 0.00001, Infinity)
}

function wrap(x, min = 0, max = 1) {
    return ((x - min) % (max - min) + (max - min)) % (max - min) + min
}

const fold = (x) => {
    return 4 * (Math.abs(0.25 * x + 0.25 - Math.round(0.25 * x + 0.25)) - 0.25)
  }

function div(div) {
    return (ramp) => wrap(ramp * div);
}

// unit shapers

// in::uni out::uni

function triangle(ramp, shape = 0.5) { 
    return clip(ramp < shape ? ramp / shape : shape < ramp ? (1 - ramp) / (1 - shape) : ramp, 0, 1);
}

function htriangle(shape) { 
    return (ramp) => triangle(ramp, shape);
}

function hann(triangle) {
    return scale(Math.cos(triangle * Math.PI), 1, -1, 0, 1)
}
// in::bi out::bi

function tanh(smp, shape = 0.5) {
    const qt = scaleToExp(shape);
    return Math.tanh(clip(smp, -1, 1) * qt) / Math.tanh(qt);
}
function htanh(shape = 0.5) {
    return (smp) => tanh(smp, shape);
}

function sigmoid(x) {
    return x / Math.sqrt(x * x + 1);
}

function sin({ phase = 0, period = 1 } = {}) {
    return (t) => Math.sin(Math.PI*2 * t / period + phase)
}

function noise() {
    return Math.random() * 2 - 1;
}


export {
    prepareDisableElements,
    disableElements,
    makeElement,
    makeIcon,
    makePen,
    setScrollbarW,
    isScrollAtBottom,
    getRootVariable,
    setRootVariable,
    pipe,
    uni2bipo,
    bipo2uni,
    poltocar,
    mix,
    mixHermite,
    scale,
    div,
    sin,
    clip,
    hclip,
    wrap,
    fold,
    sigmoid,
    tanh,
    htanh,
    triangle,
    htriangle,
    hann,
    scaleToExp,
    fakePromise
}