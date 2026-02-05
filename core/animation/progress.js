function makeLowpass(_a = 0.92) {
  let hist = 0;

  return (val = 0, a = _a) => {
    const result = val * (1 - a) + hist * a;
    hist = result;
    return result;
  };
}

const progressLowpass = makeLowpass();

export default (app, progressEl, getPosition) => () => {
  if (app.progressNeedsUpdate === false) return;
  requestAnimationFrame(app.animateProgress);
  progressEl.style.setProperty(
    "--multiplayerProgress",
    `${progressLowpass(getPosition())}`,
  );
};
