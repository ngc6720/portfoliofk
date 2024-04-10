function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

export default function(app, el, duration = 10000) {

    let start = null
    let previousTimeStamp = null;

    function step(timeStamp) {
        if (app.loaderNeedsUpdate === false)
            return;

        start = start ?? timeStamp;
        const elapsed = timeStamp - start;

        const t = Math.min(elapsed / duration, 1);
        const t2 = (elapsed / duration * 10) % 1;
      


        if (previousTimeStamp !== timeStamp) {
            el.style.setProperty('--loadspinAngle', `${ easeInOutSine(t2) * 360  }deg` )
            el.style.setProperty('--loadspinAngle2', `${ easeInOutSine(t2) * 360 }deg` )
            el.style.setProperty('--loadspinAngleOffset', `${ t * 360 }deg` )

            previousTimeStamp = timeStamp;
            window.requestAnimationFrame(step);
        }
        if (t >= 1) {
            start = null;
            previousTimeStamp = null;
            start = timeStamp;
        }

    }  
    return () => window.requestAnimationFrame(step);
}