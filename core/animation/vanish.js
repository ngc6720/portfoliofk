const hideTargetElement = (e) => {
  if (e.animationName.slice(0, 6) === "vanish") {
    e.target.style.visibility = "hidden";
  }
};
const showTargetElement = (e) => {
  if (e.animationName.slice(0, 6) === "appear") {
    e.target.style.visibility = "visible";
  }
};
document.body.addEventListener("animationstart", showTargetElement);
document.body.addEventListener("animationend", hideTargetElement);
document.body.addEventListener("webkitAnimationEnd", hideTargetElement);

const makeAnimDurations = (
  numberOfElements,
  { tMin = 800, tMax = 2000, random = false } = {},
) => {
  const durations = [];
  for (let i = 0; i < numberOfElements; i++) {
    durations.push(
      random
        ? Math.random() * (tMax - tMin) + tMin
        : (i * (tMax - tMin)) / numberOfElements + tMin,
    );
  }
  return durations;
};

const makeVanisher = (_elements, _wrapper, _animProps) => {
  const elements = Array.isArray(_elements) ? _elements : [_elements];
  const wrapper = _wrapper;
  const durations = makeAnimDurations(elements.length, _animProps);

  const timingFunctioAppear =
    _animProps?.timingFunctioAppear ?? "cubic-bezier(0.165, 0.84, 0.44, 1)";
  const timingFunctionVanish =
    _animProps?.timingFunctionVanish ?? "cubic-bezier(0.4, 0.60, 0.8, 1)";

  const addMaskAndConnectToWrapper = (el) => {
    const container = document.createElement("span");
    container.classList.add("mask");
    container.style.display = "flex";
    container.style.overflow = "hidden";
    el.style.visibility = "hidden";
    _wrapper.style.pointerEvents = "none";
    container.appendChild(el);
    wrapper.appendChild(container);
  };

  let timeoutPointerEvents;

  const appear = (direction) => {
    timeoutPointerEvents && clearTimeout(timeoutPointerEvents);
    elements.map(
      (el, i) =>
        (el.style.animation = `${direction ?? "appearToTop"} ${
          durations[i]
        }ms ${timingFunctioAppear}`),
    );
    timeoutPointerEvents = setTimeout(
      () => (wrapper.style.pointerEvents = "all"),
      durations[durations.length - 1] * 0.6,
    );
  };
  const vanish = (direction) => {
    clearTimeout(timeoutPointerEvents);
    _wrapper.blur();
    elements.map((el, i) => {
      el.style.animation = `${direction ?? "vanishToTop"} ${
        durations[i] * 0.5
      }ms ${timingFunctionVanish}`;
      i === elements.length - 1 && (wrapper.style.pointerEvents = "none");
    });
  };

  elements.map((el) => addMaskAndConnectToWrapper(el));

  return { el: wrapper, appear, vanish };
};

const makeVanisherDisplay = (_strArr, _wrapper, _animProps) => {
  const min = 6;
  _strArr = _strArr.slice(0, min - 1);
  if (_strArr.length < min) {
    const len = _strArr.length;
    const toAdd = min - len;
    let id = 0;
    for (let i = toAdd; i >= 0; i--) {
      if (id > len - 1) id = 0;
      _strArr.push(_strArr[id]);
      id++;
    }
  }
  const elements = _strArr.map((str) => {
    const e = document.createElement("span");
    e.textContent = str;
    return e;
  });
  const wrapper = _wrapper;
  const durations = () => makeAnimDurations(elements.length, _animProps);
  const timingFunctioAppear = "cubic-bezier(0.1, 0.84, 0.44, 1)";
  const timingFunctionVanish = "cubic-bezier(0.1, 0.2, 0.95, 1)";

  wrapper.classList.add(
    (Object.entries({
      3: "shortestLength",
      5: "shorterLength",
      6: "shortLength",
    }).find(([k, v]) => elements.length < k) ?? [0, "normalLength"])[1],
  );

  const addMaskAndConnectToWrapper = (el) => {
    const container = document.createElement("span");
    container.classList.add("mask");
    el.style.visibility = "hidden";
    container.style.display = "flex";
    container.style.overflow = "hidden";
    container.style.justifyContent = "center";
    container.appendChild(el);
    wrapper.appendChild(container);
  };
  const appear = (direction) =>
    elements.map(
      (el, i) =>
        (el.style.animation = `${direction ?? "appearToTop"} ${
          durations()[i]
        }ms ${timingFunctioAppear}`),
    );
  const vanish = (direction) =>
    elements.map(
      (el, i) =>
        (el.style.animation = `${direction ?? "vanishToTop"} ${
          durations()[i] * 0.5
        }ms ${timingFunctionVanish}`),
    );

  elements.map((el) => addMaskAndConnectToWrapper(el));

  return { el: wrapper, appear, vanish };
};

export { makeVanisher, makeVanisherDisplay };
