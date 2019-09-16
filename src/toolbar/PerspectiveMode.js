import {Controller} from "../Controller.js";

/**
 * Controls perspective mode for a xeokit {@link Camera}.
 *
 * Located at {@link Toolbar#perspective}.
 */
class PerspectiveMode extends Controller {

    /** @private */
    constructor(parent) {
        super(parent);
        this.on("active", (active) => {
            if (active) {
                this.viewer.cameraFlight.flyTo({projection: "perspective", duration: 0.5}, () => {});
            }
        });
    }
}

export {PerspectiveMode};