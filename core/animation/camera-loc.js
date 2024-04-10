import Animation from '/core/animation/animation.js'

class CameraLoc {

    #camera = null;

    #positions = [];
    #coeffs = [];

    #scroll = 0;
    #coeffAnim = null;

    constructor(camera) {
        this.#camera = camera ?? console.error('provide a camera to CameraLoc constructor');
        this.#coeffAnim = new Animation({
            durationms: 3000,
            cb: (vals) => {
                this.#coeffs = vals
                this.update();
            }
        })
    }


    addCurve(curve, lookatCurve) {
        this.#positions.push({
            get: (v) => {
                const point = curve.getPointAt(v);
                const lookatPoint = lookatCurve.getPointAt(v);
                return [ [point.x, point.y, point.z], [lookatPoint.x, lookatPoint.y, lookatPoint.z] ]
            }
        })
        this.#coeffs.push(0)
    }
    addPos(pos, lookat) {
        this.#positions.push({
            get: (_) => {
                return[ pos, lookat ]
            }
        })
        this.#coeffs.push(0)
    }

    update() {
        const pos = [0, 0, 0];
        const lookat = [0, 0, 0];

        this.#positions.forEach((data, i) => {
            const coords = data.get(this.#scroll)[0].map(coord => coord * this.#coeffs[i])
            pos[0] += coords[0]
            pos[1] += coords[1]
            pos[2] += coords[2]
            const coordslookat = data.get(this.#scroll)[1].map(coord => coord * this.#coeffs[i])
            lookat[0] += coordslookat[0]
            lookat[1] += coordslookat[1]
            lookat[2] += coordslookat[2]
        })
        this.#camera.position.set( pos[0], pos[1], pos[2]); 
        this.#camera.lookAt( lookat[0], lookat[1], lookat[2]); 
    }

    setScroll(v) {
        this.#scroll = v < 0 ? 0 : v > 1 ? 1 : v;
        this.update();
    }
    setPage(id) {
        this.#coeffAnim.from(this.#coeffs)
        this.#coeffAnim.to(this.#coeffs.map((coeff, i) => coeff = (i === id) ? 1 : 0))
    }
    initPage(id) {
        this.#coeffs = this.#coeffs.map((coeff, i) => coeff = (i === id) ? 1 : 0)
    }

}

export default CameraLoc;