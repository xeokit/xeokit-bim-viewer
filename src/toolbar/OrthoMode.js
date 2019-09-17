import {Controller} from "../Controller.js";

/**
 * Controls orthographic mode for a xeokit {@link Camera}.
 *
 * Located at {@link Toolbar#ortho}.
 */
class OrthoMode extends Controller {

    /** @private */
    constructor(parent, cfg) {
        super(parent, cfg);
        this.on("active", (active) => {
            if (active) {
                this.viewer.cameraFlight.flyTo({projection: "ortho", duration: 0.5}, () => {});
            } else {
                this.viewer.cameraFlight.flyTo({projection: "perspective", duration: 0.5}, () => {});
            }
        });
    }
}

export {OrthoMode};