export const makePen = (_cnv) => {
  const cnv = _cnv;
  const ctx = cnv.getContext("2d");
  const fill = (str) => {
    ctx.fillStyle = str;
  };

  const stroke = (str) => {
    ctx.strokeStyle = str;
  };
  const rgbStr = function (r, g, b, a) {
    let alpha = a || 1;
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const strokeWidth = (width) => {
    width === 0 && (width = 0.0001);
    ctx.lineWidth = width;
  };

  const rectangle = (x, y, w, h) => {
    ctx.fillRect(x, y, w, h);
  };

  const fix_size = () => {
    const { width, height } = cnv.getBoundingClientRect();
    cnv.width = width;
    cnv.height = height;
  };

  const getCtx = () => ctx;

  return {
    cnv,
    ctx,
    fill,
    stroke,
    rgbStr,
    strokeWidth,
    rectangle,
    fix_size,
    getCtx,
  };
};
