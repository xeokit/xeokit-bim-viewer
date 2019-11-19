import {Controller} from "../Controller.js";
import {math} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

const tempVec3 = math.vec3();

class FitAction extends Controller {

    constructor(parent, cfg={}) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.addClass("disabled");
            } else {
                buttonElement.removeClass("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.addClass("active");
            } else {
                buttonElement.removeClass("active");
            }
        });

        buttonElement.on('click', (event) => {
            if (this.getEnabled()) {
                this.fit();
            }
            event.preventDefault();
        });
    }

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