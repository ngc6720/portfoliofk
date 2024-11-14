export const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

async function fakePromise(durationms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, durationms);
  });
}

export function prepareDisableElements(elOrels) {
  const els = Array.isArray(elOrels) ? elOrels : [elOrels];
  els.forEach((el) => (el.style.top = el.getBoundingClientRect().top + "px"));
}

export function disableElements(elOrels, bool) {
  const els = Array.isArray(elOrels) ? elOrels : [elOrels];
  if (bool) {
    els.forEach((el) => {
      el.classList.add("disabled");
      [
        ...el.querySelectorAll("a"),
        ...el.querySelectorAll("button"),
        ...el.querySelectorAll("input"),
      ].forEach((el) => {
        el.setAttribute("tabindex", -1);
      });
    });
  } else {
    els.forEach((el) => {
      el.classList.remove("disabled");
      [
        ...el.querySelectorAll("a"),
        ...el.querySelectorAll("button"),
        ...el.querySelectorAll("input"),
      ].forEach((el) => {
        el.setAttribute("tabindex", 0);
      });
    });
  }
}
