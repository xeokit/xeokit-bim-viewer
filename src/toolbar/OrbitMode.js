import {Controller} from "../Controller.js";

/**
 * Controls orbit mode.
 *
 * Located at {@link Toolbar#orbit}.
 */
class OrbitMode extends Controller {

    /** @private */
    constructor(parent) {

        super(parent);

        this.on("active", (active) => {

            if (active) {

                this.viewer.scene.canvas.canvas.style.cursor = "default";

                const cameraControl = this.viewer.cameraControl;
                cameraControl.firstPerson = false;
                cameraControl.pivoting = true;
                cameraControl.panToPointer = true;
            }
        });
    }
}

export {OrbitMode};