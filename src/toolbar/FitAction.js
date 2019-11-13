import {Controller} from "../Controller.js";
import {math} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

const tempVec3 = math.vec3();

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
        const scene = this.viewer.scene;
        const aabb = scene.getAABB(scene.visibleObjectIds);
        this.viewer.cameraFlight.flyTo({
            aabb: aabb
        });
        this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
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