export const element = (type, attriOrContentOrEl, contentOrEl, ...els) => {
  const el = document.createElement(type);

  if (typeof attriOrContentOrEl === "string") {
    el.textContent = attriOrContentOrEl;
  } else if (attriOrContentOrEl instanceof HTMLElement) {
    el.appendChild(attriOrContentOrEl);
  } else if (attriOrContentOrEl) {
    Object.entries(attriOrContentOrEl).map(([k, v]) => (el[k] = v));
  }
  if (contentOrEl instanceof HTMLElement) {
    el.appendChild(contentOrEl);
  } else if (typeof contentOrEl === "string") {
    el.textContent = contentOrEl;
  }
  if (els) for (const e of els) el.appendChild(e);
  return el;
};

export const div = (...args) => element("div", ...args);
export const span = (...args) => element("span", ...args);
export const p = (...args) => element("p", ...args);
export const h2 = (...args) => element("h2", ...args);
export const h3 = (...args) => element("h3", ...args);
export const article = (...args) => element("article", ...args);

export const icon = (el, paths, attr) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  if (!Array.isArray(paths)) paths = [paths];
  paths.forEach((p) => {
    if (typeof p === "string") {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", p);
      svg.appendChild(path);
    }
  });
  Object.entries(attr).forEach(([k, v]) => svg.setAttribute(k, v));
  el.appendChild(svg);
  return el;
};

export function getRootVariable(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}
export function setRootVariable(k, v) {
  document.documentElement.style.setProperty(k, v);
}

export const isScrollAtBottom = () =>
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

export function setScrollbarW() {
  const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
  setRootVariable("--scrollBarW", scrollbarW + "px");
}
