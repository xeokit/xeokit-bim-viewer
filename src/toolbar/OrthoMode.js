import {Controller} from "../Controller.js";

/**
 * Controls orthographic mode for a xeokit {@link Camera}.
 *
 * Located at {@link Toolbar#ortho}.
 */
class OrthoMode extends Controller {

    /** @private */
    constructor(parent) {
        super(parent);
        this.on("active", (active) => {
            if (active) {
                this.viewer.cameraFlight.flyTo({projection: "ortho", duration: 0.5}, () => {});
            }
        });
    }
}

export {OrthoMode};