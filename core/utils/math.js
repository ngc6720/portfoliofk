export const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

export function uni2bipo(ramp) {
  return ramp * 2 - 1;
}

export function bipo2uni(ramp) {
  return (ramp + 1) * 0.5;
}

export function invert(ramp) {
  return 1 - ramp;
}

export function poltocar(r, theta) {
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

export function mix(in1, in2, mix) {
  return in1 * mix + in2 * (1 - mix);
}

export function mixHermite(in0, in1, in2, in3, mix) {
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

export function scale(v, oMin, oMax, tMin, tMax) {
  v = ((v - oMin) * (tMax - tMin)) / (oMax - oMin) + tMin;
  return v < tMin ? tMin : v > tMax ? tMax : v;
}

export function clip(v, min = -1, max = 1) {
  return v < min ? min : max < v ? max : v;
}

export function pclip(min = -1, max = 1) {
  return (x) => clip(x, min, max);
}

export function scaleToExp(qt = 0.5) {
  return clip(Math.tan((clip(qt, 0, 1) * Math.PI) / 2), 0.00001, Infinity);
}

export function wrap(x, min = 0, max = 1) {
  return ((((x - min) % (max - min)) + (max - min)) % (max - min)) + min;
}

export const fold = (x) => {
  return 4 * (Math.abs(0.25 * x + 0.25 - Math.round(0.25 * x + 0.25)) - 0.25);
};

export function div(ramp, factor) {
  return wrap(ramp * factor);
}

export function pdiv(factor) {
  return (ramp) => div(ramp, factor);
}

// in::uni out::uni

export function triangle(ramp, shape = 0.5) {
  return clip(
    ramp < shape
      ? ramp / shape
      : shape < ramp
      ? (1 - ramp) / (1 - shape)
      : ramp,
    0,
    1
  );
}

export function ptriangle(shape) {
  return (ramp) => triangle(ramp, shape);
}

export function hann(triangle) {
  return scale(Math.cos(triangle * Math.PI), 1, -1, 0, 1);
}

// in::bi out::bi

export function tanh(smp, shape = 0.5) {
  const qt = scaleToExp(shape);
  return Math.tanh(clip(smp, -1, 1) * qt) / Math.tanh(qt);
}

export function ptanh(shape = 0.5) {
  return (smp) => tanh(smp, shape);
}

export function sigmoid(x) {
  return x / Math.sqrt(x * x + 1);
}

export function psin({ phase = 0, period = 1 } = {}) {
  return (t) => Math.sin((Math.PI * 2 * t) / period + phase);
}

export function noise() {
  return Math.random() * 2 - 1;
}
