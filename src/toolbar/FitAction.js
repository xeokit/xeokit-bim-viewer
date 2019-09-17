import {Controller} from "../Controller.js";


/**
 * Flies the camera to show the entire model in view, from the current viewing angle.
 *
 * Located at {@link Toolbar#fit}.
 */
class FitAction extends Controller {

    /** @private */
    constructor(parent, cfg={}) {
        super(parent, cfg);
    }

    /**
     * Flies the camera to show the entire model in view, from the current viewing angle.
     */
    fit() {
        this.viewer.cameraFlight.flyTo(this.viewer.scene);
    }

    set fov(fov) {
        this.viewer.scene.cameraFlight.fitFOV = fov;
    }

    get fov() {
        return this.viewer.scene.cameraFlight.fitFOV;
    }

    set duration(duration) {
        this.viewer.scene.cameraFlight.duration = duration;
    }

    get duration() {
        return this.viewer.scene.cameraFlight.duration;
    }
}

export {FitAction};